# Cấu trúc Hệ thống và Lưu ý Kỹ thuật (Architecture & Gotchas)

Tài liệu này lưu trữ các cấu trúc hệ thống và các vấn đề kỹ thuật quan trọng của nền tảng Ông Lão, hỗ trợ cho quá trình bảo trì và phát triển.

## 1. Cơ chế Event của React vs Puppeteer
- **Vấn đề cốt lõi:** React 18 sử dụng Synthetic Event Delegation gắn ở root div. Các thao tác trực tiếp lên DOM (như `input.value = 'text'` hoặc `button.click()`) có thể không kích hoạt được state của React, dẫn đến việc UI hiển thị chữ nhưng component vẫn nhận state là chuỗi rỗng (`''`).
- **Cách xử lý chuẩn (Best Practice) cho Automation:**
  Khi viết script Puppeteer cho các form React:
  ```javascript
  await page.evaluate((el, text) => {
      // 1. Dùng prototype của HTMLInputElement để set value tự nhiên
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
      nativeInputValueSetter.call(el, text);
      
      // 2. Kích hoạt event input với bubbles: true
      const ev = new Event('input', { bubbles: true });
      el.dispatchEvent(ev);
  }, inputElement, "Dữ liệu cần nhập");
  ```

## 2. Xử lý Toast Message (Custom Component)
- Các thông báo toast trong hệ thống không dùng thư viện `react-toastify` mà được render trực tiếp thông qua state `toast` (`{ show: false, message: '', type: 'info' }`).
- DOM structure của Toast:
  ```html
  <div className="fixed bottom-6 right-6 z-[300] bg-slate-900/90...">
      <span className="text-xs text-white leading-relaxed">{toast.message}</span>
  </div>
  ```
- **Lưu ý test:** Bắt selector bằng `span.text-xs.text-white.leading-relaxed`, tuyệt đối không dùng `.Toastify__toast-body`.

## 3. Quản lý trạng thái Live Idle Videos (OBS Stream)
- Component: `LiveModePanel.tsx`
- State: `liveIdleVideos` (mảng đối tượng).
- Khi thêm video từ máy hoặc YouTube, object sẽ được map và đẩy vào `setLiveIdleVideos`.
- **Lưu ý test:** Videos render bằng thẻ div lặp với class chứa `span.text-slate-300.truncate`.

## 4. Prisma Schema Desync
- Lỗi `Unknown argument laoPresetId`: State client (thông qua `updateUserProfileAction`) đang cố gắng lưu trường `laoPresetId` vào database (bảng `User`), nhưng Schema DB không tồn tại field này.
- **Cách xử lý:** Đã đồng bộ Schema và migrate cơ sở dữ liệu mới. `laoPresetId` và `voiceStyle` đã được định nghĩa là trường tùy chọn (`String?`) trong model `User`.

## 5. Tương tác API GiacNgo & Cơ chế Hàng đợi Âm thanh (Audio Queue)
- **Tương tác API GiacNgo:** 
  Khi gọi API `/api/giacngo/chat`, Client chỉ cần gửi đúng:
  * `spaceId` (Số ID của không gian).
  * `aiConfigId` (ID cấu hình Agent/Lão).
  * `message` (Nội dung câu hỏi của người dùng, không bao gồm systemPrompt).
  * **Authorization Header**: Yêu cầu truyền Bearer token của tài khoản người dùng lấy từ `localStorage` để phân quyền chính xác.

- **Chiến lược phát âm thanh (Audio Queuing Strategy):**
  * **Có Audio Có Sẵn:** Phát ngay câu mào đầu / kệ tại thời điểm 0ms. Khi API GiacNgo phản hồi, chỉ sinh TTS cho câu trả lời và dùng cờ `appendOnly = true` để đẩy tiếp phần âm thanh này vào cuối hàng đợi phát.
  * **Không Có Audio Có Sẵn:** Đợi API chat phản hồi xong, gộp chung toàn bộ nội dung (mào đầu + kệ + câu trả lời) để sinh một audio TTS tổng duy nhất nhằm đảm bảo chất lượng đọc tốt nhất và tối ưu chi phí API.

---
**SKILL CHECK:** Tất cả agent khi tham gia sửa lỗi tự động hoá hoặc phát triển tính năng cần đọc file này đầu tiên để chọn phương pháp tương tác DOM/React và API phù hợp.
