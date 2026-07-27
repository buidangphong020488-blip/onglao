---
name: onglao-vps-testing-workflow
description: Hướng dẫn chi tiết quy trình kỷ luật phát triển, dọn kho, đồng bộ tệp đa thư mục VPS, xử lý Nginx ^~ location conflict, và kiểm thử Puppeteer tự thẩm định ảnh bằng chứng cho dự án Ông Lão.
---

# SKILL: KỶ LUẬT PHÁT TRIỂN, XỬ LÝ MEDIA VPS VÀ KIỂM THỬ TỰ THẨM ĐỊNH DỰ ÁN ÔNG LÃO

Hồ sơ kĩ năng (Skill) này tổng hợp đầy đủ các nguyên tắc kỷ luật, giải pháp hạ tầng VPS và quy trình kiểm thử thực tế áp dụng cho dự án **Ông Lão (AI Thiền Đường)**.

---

## 1. NGUYÊN TẮC KỶ LUẬT BẮT BUỘC (AGENTS.MD INVARIANTS)

1. **Lập Kế Hoạch & Phê Duyệt (Rule 1)**:
   - Mọi thay đổi logic/giao diện phức tạp **BẮT BUỘC** phải lập `implementation_plan.md` với `request_feedback = true`.
   - **CHỜ NGƯỜI DÙNG BẤM ĐỒNG Ý** trước khi chỉnh sửa bất kỳ tệp nguồn nào.

2. **Thẩm Định Ảnh Bằng Chứng Tự Động (Rule 6)**:
   - Khi chạy script Puppeteer chụp ảnh kiểm thử (lưu tại `scratch/kho_canh_quay_proof.png`), AI **BẮT BUỘC DÙNG `view_file` TỰ REVIEW ẢNH SCREENSHOT**.
   - Kiểm tra kỹ 100% chi tiết UI (số đếm badge, hình thumbnail, kho trống/kho có dữ liệu) đúng yêu cầu người dùng trước khi báo hoàn tất.

---

## 2. HẠ TẦNG VPS & ĐỒNG BỘ MEDIA ĐA THƯ MỤC (MULTI-DIRECTORY SYNC)

### A. Vấn đề lệch thư mục giữa PM2 Standalone và Nginx Web Root
Khi Next.js chạy ở chế độ Standalone (`.next/standalone`), `process.cwd()` trỏ về thư mục standalone. Trong khi aaPanel Nginx lại phục vụ tĩnh từ Web Root `/www/wwwroot/onglao.giac.ngo/public/uploads`.

### B. Giải pháp Ghi Đa Thư Mục Đồng Bộ
Mọi API Upload / FFmpeg khi ghi file video (`.mp4`) hoặc thumbnail (`.jpg`) phải **đồng thời ghi/copy sang tất cả thư mục candidate**:
1. `process.cwd()/public/uploads/canhquay` (PM2 Standalone)
2. `/www/wwwroot/onglao.giac.ngo/public/uploads/canhquay` (Nginx Web Root)
3. `/www/wwwroot/onglao.giac.ngo/uploads/canhquay` (Backup)

### C. Mẹo FFmpeg Seek Vô Địch (`-ss 00:00:00.1`)
- Tránh dùng `-ss 00:00:01` vì nếu video ngắn dưới 1 giây, FFmpeg sẽ bị thoát lỗi và không xuất ra file ảnh thumb `.jpg`.
- Luôn dùng `-ss 00:00:00.1` để mọi video clip (dù siêu ngắn) đều cắt khung hình thành công 100%.

---

## 3. KHẮC PHỤC XUNG ĐỘT NGINX REGEX (`^~` MODIFIER)

### A. Nguyên nhân lỗi 404 Nginx trên aaPanel
aaPanel mặc định có khối regex:
```nginx
location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
    expires 30d;
}
```
Khối Regex này sẽ **chiếm ưu tiên trước** các route `location /api/` thông thường. Khi gọi `https://domain/api/files/canhquay/thumb_xxx.jpg`, Nginx tìm file trên đĩa không thấy và báo lỗi **404 Not Found** mà không bao giờ chuyển request tới Next.js!

### B. Giải pháp dùng Modifier `^~`
Thêm `^~` để Nginx dừng khớp Regex và xử lý ngay lập tức:
```nginx
# Ưu tiên tĩnh trực tiếp từ Nginx (tốc độ tối đa)
location ^~ /uploads/ {
    alias /www/wwwroot/onglao.giac.ngo/public/uploads/;
    expires 30d;
}

# Bắt buộc proxy /api/ về Next.js kể cả khi URL có đuôi .jpg/png
location ^~ /api/ {
    proxy_pass http://127.0.0.1:3013;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

---

## 4. TỐI ƯU TỐC ĐỘ UI KHO CLIP (THUMBNAIL-ONLY RENDERING)

1. **Không render thẻ `<video>` ngầm trong danh sách**:
   - Tránh việc khởi tạo hàng chục thẻ `<video>` ngầm hoặc chạy Canvas trích xuất client (`generateVideoPosterThrottled`) gây giật lag RAM.
   - Thẻ `<video>` chỉ được nạp khi người dùng **chủ động click nút Xem Thử `▶`**.

2. **Render ảnh tĩnh & Fallback `onError`**:
   - Thẻ clip chỉ render `<img src={poster} onError={() => setPoster(null)} />`.
   - Khi ảnh hỏng/mất kết nối, `onError` tự chuyển sang render ô thiết kế badge icon gradient siêu nhẹ, đảm bảo kho clip lướt mượt 100%.

---

## 5. QUY TRÌNH KIỂM THỬ THỰC TẾ (PUPPETEER AUTOMATION)

### Script Kiểm thử Puppeteer (`scratch/test_logo_preview.ts`):
```typescript
import puppeteer from 'puppeteer';

async function runTest() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://localhost:3013');
  // Thực hiện thao tác click mở modal Kho Cảnh Quay
  await page.screenshot({ path: 'scratch/kho_canh_quay_proof.png' });
  await browser.close();
}
runTest();
```

### Lệnh chạy kiểm thử và thẩm định:
1. Kiểm tra TypeScript: `npx tsc --noEmit`
2. Chạy kiểm thử: `npx tsx scratch/test_logo_preview.ts`
3. Thẩm định ảnh bằng chứng: Dùng `view_file` xem `scratch/kho_canh_quay_proof.png`.
4. Đóng gói sản phẩm: `npm run build`
5. Push Git: `git add . && git commit -m "..." && git push`
