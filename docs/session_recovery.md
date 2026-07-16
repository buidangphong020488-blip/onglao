# Nhật Ký Khôi Phục Phiên Làm Việc (Session Recovery & State Document)

Tài liệu này ghi lại chi tiết toàn bộ trạng thái hệ thống, cấu hình, thông tin cơ sở dữ liệu và các bước triển khai trong phiên làm việc ngày **14/07/2026** để phục vụ việc tiếp quản dự án ở các phiên làm việc tiếp theo.

---

## 1. Thông Tin Cơ Sở Dữ Liệu (Database Credentials)

Hệ thống đã được chuyển đổi từ database cũ sang database mới:
- **Database Cũ (Source):**
  `postgresql://onglao:MweeAz3SEyR4yymc@18.139.27.179:5432/onglao`
- **Database Mới (Target - Hiện tại):**
  `postgresql://onglao:MweeAz3SEyR4yymc@103.165.145.137:5432/onglao`

### Kịch bản di chuyển dữ liệu (Migration Script)
Được lưu tại: `scratch/migrate_data.js`
- Dọn dẹp dữ liệu cũ trên database mới (theo thứ tự ngược của quan hệ phụ thuộc khóa ngoại).
- Di chuyển dữ liệu tuần tự theo từng bảng: `SystemSetting` -> `BackgroundMusic` -> `VoiceStyle` -> `PromptTemplate` -> `VoicePersona` -> `NhanVat` -> `OpeningPhrase` -> `KnowledgeBase` -> `Poem` -> `User` -> `Stanza` -> `ChatSession` -> `ChatMessage` -> `UserFavorite`.

---

## 2. Đồng Bộ Schema Prisma

Đã đồng bộ trường dữ liệu profile người dùng trong file `prisma/schema.prisma`:
- Thêm trường `laoPresetId String?` và `voiceStyle String?` vào model `User` để tránh lỗi `Unknown argument` khi chạy `updateUserProfileAction`.
- Đã thực thi lệnh `npx prisma db push` và `npx prisma generate` để cập nhật cấu trúc bảng trên Database mới thành công.

---

## 3. Cập Nhật TTS Model (Mô hình giọng đọc)

- Hệ thống sử dụng mô hình giọng đọc:
  **`gemini-2.5-flash-preview-tts`** (Gemini 2.5 Flash TTS Preview)
- Đã đồng bộ giá trị `ttsModel` trong bảng `SystemSetting` của cả database cũ và mới để đảm bảo tính nhất quán.

---

## 4. Các Tính Năng Đã Sửa Đổi & Cấu Trúc Code

### 4.1. Reset Ô Chat Nhập Liệu
- **File sửa đổi:** `src/components/onglao/components/NormalModePanel.tsx`
- **Thay đổi:** Gọi hàm `setLocalInputText('')` ngay khi người dùng nhấn nút Gửi (Submit) câu hỏi đàm thoại để xóa chữ đã nhập.

### 4.2. Tự Động Cuộn Khung Đàm Thoại (Auto-scroll)
- **File sửa đổi:** `src/components/onglao/components/ChatHistorySidebar.tsx`
- **Thay đổi:** Thêm thẻ `<div ref={chatEndRef} />` ở cuối danh sách tin nhắn. Sử dụng `useEffect` lắng nghe sự thay đổi của danh sách tin nhắn (`messages`) và gọi hàm `chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })` để tự cuộn khung chat xuống dưới cùng khi có phản hồi mới từ Lão.

### 4.3. Gọi API Chat GiacNgo
- **File sửa đổi:** `src/app/api/giacngo/chat/route.ts` & `src/lib/giacngo.ts`
- **Thay đổi:** 
  * Cấu hình proxy gọi API đàm thoại bên ngoài của Giác Ngộ (qua endpoint `/api/giacngo/chat`).
  * Chỉ truyền đúng các tham số: `spaceId`, `aiConfigId` (chính là Agent ID), và `message` (nội dung câu hỏi).
  * Tự động lấy Authorization Bearer token của tài khoản người dùng từ `localStorage` để đính kèm vào header cuộc gọi.

### 4.4. Cơ Chế Phát Âm Thanh Song Song (Audio Queue)
- **File sửa đổi:** `src/components/onglao-platform.tsx`
- **Logic hoạt động:**
  1. **Trường hợp mào đầu/kệ có sẵn âm thanh (đã upload trước đó):** Lập tức phát file âm thanh đó ngay khi gửi tin nhắn. API GiacNgo chat được gọi đồng thời. Khi có chữ trả lời từ stream, TTS sẽ chuyển câu trả lời thành giọng đọc ở background và ghép vào hàng đợi phát âm thanh (`appendOnly = true`) sau khi âm thanh mào đầu phát xong.
  2. **Trường hợp mào đầu không có sẵn âm thanh:** Đợi API chat phản hồi xong câu trả lời. Hệ thống gộp chuỗi văn bản mào đầu + kệ + câu trả lời lại thành một nội dung duy nhất rồi gọi API TTS tổng để sinh ra một file âm thanh đọc liền mạch từ đầu tới cuối.

---

## 5. Dọn Dẹp File Rác & Sửa Lỗi Tải Ảnh
- **Xóa file 0-byte:** Tiến hành quét thư mục `public/media/` và xóa toàn bộ các file media rác có dung lượng 0 byte.
- **Sửa lỗi 404:** Thêm các file ảnh đại diện `icon.jpg` và `logo.jpg` bị thiếu vào thư mục `public/` để khắc phục lỗi 404 khi tải giao diện ứng dụng.

---

## 6. Trạng Táí Git Repository

Toàn bộ các file code và tài liệu đã được thêm và lưu trữ trên Git:
- **Repository:** `https://github.com/buidangphong020488-blip/onglao.git`
- **Commit gần nhất:** `62de5e243c9444453b2c432ef52d7606a945f0f7`
- **Nội dung commit:** Cập nhật tài liệu, prisma schema, dọn dẹp các file rác trong media và sửa các component đàm thoại/TTS.

---

## 7. Hướng Dẫn Xác Thực & Kiểm Thử Cho Lần Sau

Khi bắt đầu phiên làm việc mới, bạn có thể chạy các kịch bản kiểm thử sau trong thư mục `scratch/` để đảm bảo hệ thống hoạt động ổn định:
1. **Kiểm thử Luồng Chat & TTS:**
   `node scratch/test_all_fixes.js`
2. **Kiểm thử Đồng Bộ Database:**
   `node scratch/check_db_scripts.js`

*Lưu ý:* Khi chạy kiểm thử E2E bằng Puppeteer trên môi trường React, hãy sử dụng cơ chế dispatch event `nativeInputValueSetter` được ghi chi tiết trong `docs/architecture.md` để tránh lỗi state React không cập nhật.
