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

## 4. Cơ Sở Dữ Liệu Prisma Schema & Cột `isPinned`
- Cột `isPinned` đã được thêm vào model `ChatSession` thông qua migration:
  `prisma/migrations/20260817084500_add_chat_session_is_pinned/migration.sql`
- Hàm `togglePinChatSessionAction` trong `src/lib/clientActions.ts` gọi `PATCH /api/sessions/[id]` để lưu trạng thái ghim trực tiếp vào database.

## 5. Xác Thực GiacNgo SSO, `authFetch` & Phân Quyền Sở Hữu Dữ Liệu
- **Client Fetch Wrapper (`src/lib/authFetch.ts`):**
  - Tự động lấy Bearer Token từ `localStorage.getItem('onglao_token')` và đính kèm vào header `Authorization`.
  - Khi server trả `401 Unauthorized`, tự động thu hồi token hết hạn và phát sự kiện `onglao_auth_unauthorized` để điều hướng mở Modal Đăng nhập.
- **Xác Thực Server & Cache Token (`src/lib/authz.ts`):**
  - Hàm `authenticateUser(req)` giải mã Bearer Token qua API SSO Giác Ngộ (`/auth/me`), lưu cache in-memory 60s để tối ưu hiệu năng.
  - User ID chuẩn hóa theo format `canonicalUserId(rawId)`: `gn_<id>`.
- **Kiểm Soát Quyền Sở Hữu (Fail-Closed Data Isolation):**
  - Hàm `isResourceOwner(user, resourceUserId)`: Chỉ cho phép truy cập nếu `user.isAdmin === true` hoặc `user.id === canonicalUserId(resourceUserId)`.
  - Mặc định từ chối (Fail-closed) nếu tài nguyên không có chủ sở hữu hoặc chưa đăng nhập.

## 6. Bảo Vệ Proxy & Chống Tấn Công SSRF (`src/app/api/proxy/route.ts`)
- **Giao Thức Bắt Buộc:** Chỉ chấp nhận `https://`.
- **Chặn Mạng Nội Bộ (Private CIDRs):**
  - Loopback / Localhost: `127.0.0.0/8`, `::1`
  - Private IP: `10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`, `169.254.0.0/16`
  - IPv6 Unique Local / Link Local: `fc00::/7`, `fe80::/10`
- **Domain Whitelist:** Chỉ cho phép tải tài nguyên từ các domain được phê duyệt (`giacngo.vn`, `giacngo.ngo`, `googleapis.com`, etc.).
- **HTTP Status Minh Bạch:** Trả đúng mã lỗi HTTP thực tế (400, 403, 404, 502) khi fetch thất bại, không trả fallback HTTP 200.

## 7. Cơ chế Hàng đợi Âm thanh (Audio Queue) & Khẩu Hình Lão
- **Chiến lược phát âm thanh:**
  1. Mào Đầu: Phát ngay câu mào đầu từ file thu sẵn (`/uploads/audio/phrase_xxx.wav`).
  2. Kệ Pháp: Phát tiếp bài kệ thiền (`matchedStanza.audioUrl`).
  3. AI Đúc Kết: Sau khi Gemini hoàn tất câu trả lời, sinh TTS và đẩy vào cuối AudioQueue (`appendOnly = true`).
- **Khẩu hình Lip-Sync (`MiniLaoFace.tsx`):**
  - Khẩu hình cử động `talkSrc` chỉ khi có âm thanh thực sự phát ra loa (`isLaoSpeakingSession = Boolean(currentlyPlayingId)`).
  - Trở về `idleSrc` ngậm miệng tĩnh khi không có âm thanh.
  - Tự động dọn dẹp RAM qua `autoReleaseRamMemory()` khi vượt quá 5 Blob URL.

---
**SKILL CHECK:** Tất cả agent khi tham gia sửa lỗi tự động hoá hoặc phát triển tính năng cần đọc file này đầu tiên để nắm rõ kiến trúc bảo mật và quy tắc hàng đợi âm thanh.
