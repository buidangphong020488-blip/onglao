# Nhật Ký Công Việc (Work Journal)

## Ngày 10/07/2026

### 1. Fix lỗi E2E Testing (AI Director)
- **Nguyên nhân lỗi:** Input của UI có hiệu ứng (slider/range input và text input) được bind vào trạng thái của React 18, nhưng các sự kiện `page.type()` hoặc `page.click()` từ Puppeteer không trigger được `onChange` của React nếu không dispatch event đúng cách.
- **Giải pháp:** Sử dụng `nativeInputValueSetter` để ép cập nhật value ở cấp độ DOM nguyên thủy (native level) và gửi event `input` với thuộc tính `bubbles: true`. Đối với button click, nếu `page.click()` bị lỗi delegate event, dùng `page.evaluateHandle` và gọi `btn.click()` trực tiếp trên object DOM nguyên thủy.
- **Kết quả:** Kịch bản `test_ai_director_e2e.js` đã pass hoàn toàn (Tạo kịch bản, AI sinh nội dung, UI cập nhật).

### 2. Fix lỗi OBS Stream Test (Đang xử lý)
- **Vấn đề:** Khi thêm video YouTube vào Kho Kệ Pháp & Mào Đầu, `page.type` chưa trigger được React state cho form thêm YouTube (Tên phim, Chủ đề, URL). Nút "Xác nhận Thêm" bị chặn vì URL/Tên phim bị coi là rỗng trong state.
- **Giải pháp:** Đã điều chỉnh cách nhập liệu và lấy button "Xác nhận Thêm". Đồng thời fix lại selector của Toast message (trước đây tìm `.Toastify__toast-body` nhưng UI dùng custom div `span.text-xs.text-white.leading-relaxed`). Cần áp dụng cơ chế `nativeInputValueSetter` cho các input trong OBS form tương tự như AI Director để fix triệt để.

### 3. Vấn đề Schema Prisma (`laoPresetId`)
- **Tình trạng:** Quá trình `updateUserProfileAction` báo lỗi `Unknown argument 'laoPresetId'`. 
- **Lý do:** Client/DB schema chưa đồng bộ, Prisma schema ở máy chủ VPS (hoặc trong code base mới nhất) không chứa trường `laoPresetId` trong model `User`.
- **Hành động tiếp theo:** Cần đồng bộ file `schema.prisma` và migrate database (lưu ý: hệ thống cấm tùy tiện thay đổi schema theo Quy tắc `database_rules.md`, cần xác nhận với người dùng trước khi can thiệp Prisma).

### 4. Cấu trúc bộ lọc (Filter) trong AiDirectorManagerModal
- **Yêu cầu:** Thêm ô tìm kiếm và radio "Thủ công"/"AI".
- **Tiến độ:** Ghi nhận vào Task list. Cần triển khai sau khi E2E Testing hoàn thiện.


## Ngày 14/07/2026

### 1. Di chuyển cơ sở dữ liệu cũ sang cơ sở dữ liệu mới và đồng bộ Schema Prisma
- **Vấn đề:** Thay đổi cấu hình cơ sở dữ liệu mới nhưng DB mới chưa đồng bộ đầy đủ các bảng dữ liệu của Ông Lão. Đồng thời trường `laoPresetId` bị thiếu trong bảng `User` gây lỗi.
- **Giải pháp:** 
  1. Tạo và chạy script di chuyển dữ liệu (mào đầu, kệ pháp, cài đặt hệ thống) từ database cũ sang database mới.
  2. Cập nhật `prisma/schema.prisma` thêm trường `laoPresetId String?` và `voiceStyle String?` vào model `User`, sau đó chạy `prisma generate` và `prisma db push` để tạo cấu trúc bảng chính xác trên database mới.
- **Kết quả:** Database mới đã đồng bộ đầy đủ 164 bài kệ pháp, các câu chào mào đầu, cài đặt và cấu trúc bảng khớp hoàn toàn với schema của dự án.

### 2. Cấu hình mô hình giọng đọc (TTS Model)
- **Giải pháp:** Cập nhật trường `ttsModel` trong bảng `SystemSetting` thành mô hình `gemini-2.5-flash-preview-tts` trên cả hai database theo yêu cầu.
- **Kết quả:** API TTS `/api/tts` đã tạo giọng phát âm chuẩn xác thông qua mô hình Gemini 2.5 Flash TTS (Preview).

### 3. Sửa lỗi ô nhập đàm thoại (ChatInput)
- **Vấn đề:** Khi gửi câu hỏi đi ở ô chat giao diện thông thường, ô nhập không tự động xóa nội dung đã gõ.
- **Giải pháp:** Thêm hàm gọi `setLocalInputText('')` trong sự kiện submit của `NormalModePanel.tsx`.

### 4. Kết nối API GiacNgo & Đồng bộ Cuộn hội thoại (Auto-scroll)
- **Vấn đề:** API GiacNgo trả kết quả nhưng không thể hiển thị trong khung đàm thoại bên phải, và thanh cuộn hội thoại không tự trượt xuống khi có chữ mới.
- **Giải pháp:**
  1. Cấu hình cuộc gọi `/api/giacngo/chat` chỉ truyền đúng `spaceId`, `aiConfigId` (Agent ID) và `message` (nội dung thực tế) để nhận phản hồi từ API GiacNgo chính xác.
  2. Bổ sung `Authorization` header tự động lấy token người dùng đã đăng nhập từ `localStorage` để gọi API được phân quyền chính chủ.
  3. Cập nhật `ChatHistorySidebar.tsx` sử dụng `chatEndRef` và `React.useEffect` lắng nghe sự thay đổi chi tiết của `messages` để tự động cuộn xuống cuối mỗi khi có nội dung mới.

### 5. Tối ưu hóa phát âm thanh mào đầu + Kệ song song với TTS
- **Vấn đề:** Trước đây nếu mào đầu không có sẵn audio, app phải đợi API GiacNgo phản hồi xong mới chuyển đổi tổng, gây trễ 5-10 giây khiến Lão đứng im lặng.
- **Giải pháp:**
  1. Nếu mào đầu/kệ có sẵn file âm thanh, lập tức phát ngay khi gửi tin nhắn. Khi API GiacNgo trả về kết quả, TTS chỉ cần dịch phần câu trả lời và ghép tiếp vào cuối hàng đợi (`appendOnly = true`).
  2. Nếu không có file âm thanh mào đầu sẵn, hệ thống sẽ đợi API GiacNgo trả câu trả lời về, sau đó gộp chung toàn bộ (mào đầu + kệ + giải đáp) rồi gọi một API TTS tổng duy nhất để tránh gọi nhiều lần và phát giọng mượt mà từ đầu.

### 6. Sửa lỗi ẩn mất khung chat trên màn hình Desktop lớn
- **Vấn đề:** Khung chat (hộp nhập liệu và các nút micro, camera) bị sập chiều rộng về `0px` và ẩn hoàn toàn trên màn hình lớn.
- **Nguyên nhân:** Do class layout có `md:w-auto` kết hợp với ô nhập liệu có `flex-1`. Sự kết hợp này tạo vòng lặp logic chiều rộng (Container đợi con co giãn, con đợi Container xác định chiều rộng) dẫn đến Container bị co lại về `0px` trên một số trình duyệt.
- **Giải pháp:** Xóa class `md:w-auto` và đặt độ rộng cố định `w-full max-w-xl` cho khung chat trong `NormalModePanel.tsx` để bảo đảm độ rộng hiển thị ổn định trên mọi màn hình.

### 7. Sửa lỗi nút góc tin nhắn hiện "Nghe lại" (Play) khi đang nói
- **Vấn đề:** Khi Lão đang phát âm thanh trả lời, nút trạng thái ở góc bong bóng tin nhắn lại hiện nút Play ("Nghe lại") thay vì nút Stop ("Dừng").
- **Nguyên nhân:** Do hàng đợi âm thanh bị rỗng tạm thời trong khi chờ file TTS của phần trả lời tải xong, khiến state phát bị đặt về `null`. Khi file TTS nạp xong và phát tiếp, nó dùng ID bị `null` đó, làm mất đồng bộ trạng thái hiển thị trên giao diện.
- **Giải pháp:** Cập nhật hàm `playNextInQueue` trong `onglao-platform.tsx`, tự động đối chiếu ngược với Ref lưu tin nhắn đang phát tự động (`latestAutoPlayaiMsgIdRef.current`) làm ID dự phòng khi ID hiện tại bị rỗng. Điều này đảm bảo nút Stop luôn hiển thị chuẩn xác suốt quá trình nói và tự động đổi về nút Play khi kết thúc.

### 8. Ẩn tab Mào Đầu (Tiếp đón) và đổi tên nút mở Kho Kệ Pháp
- **Vấn đề:** Client muốn ẩn tính năng "Mào đầu (Tiếp đón)" trong Kho Tàng Pháp Bảo.
- **Giải pháp:**
  1. Comment out tab button `"Mào Đầu (Tiếp đón)"` trong `PoemVaultModal.tsx` để người dùng không thể chọn tab này.
  2. Đổi tên nút mở Modal trong sidebar (`SessionsSidebar.tsx`) từ `"Kho Kệ Pháp & Mào Đầu"` thành `"Kho Kệ Pháp"`.

---
*Lưu ý (SKILL):* Các agent/skill trong hệ thống **phải** đọc tài liệu này trước khi tiếp tục công việc để nắm bắt context và không lặp lại lỗi cũ (đặc biệt là lỗi Puppeteer vs React Synthetic Events).

