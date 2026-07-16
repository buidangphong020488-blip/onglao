# Tài Liệu Kiểm Thử (Test Cases)

> **LƯU Ý QUAN TRỌNG: Luôn luôn test bằng JS chạy Chrome ở port 9952 (không dùng chế độ headless mở browser mới mà attach vào Chrome đang chạy).**

Tài liệu này lưu trữ các kịch bản kiểm thử (test scripts) và các chức năng đã/đang được tự động hóa cho nền tảng Ông Lão, bám sát các tính năng thực tế của dự án.

## 1. Kiểm Thử Đăng Nhập & Màn Hình Chào
- **Mục tiêu:** Kiểm thử luồng đăng nhập GiacNgo SSO.
- **Kịch bản:** Bypass màn hình chào, mở AuthModal, nhập tài khoản, xác thực proxy `/api/giacngo/auth` thành công.
- **Trạng thái:** Đã có script (ví dụ: `scripts/test_interactive.js`).

## 2. Kiểm Thử Chat & Sinh Âm Thanh (TTS)
- **Mục tiêu:** Kiểm thử tính năng gửi tin nhắn và nhận phản hồi văn bản + âm thanh.
- **Kịch bản:** Nhập câu hỏi, chờ `/api/giacngo/chat` trả về, kiểm tra tự động phát TTS qua `/api/tts`.
- **Trạng thái:** Cần duy trì.

## 3. Kiểm Thử Greeting AI (Mở Đầu Thông Minh)
- **Mục tiêu:** Kiểm thử AI phản hồi đúng phong cách mở đầu theo chủ đề (sức khỏe, thất tình, đạo lý,...).
- **Kịch bản:** Gửi các từ khóa tương ứng và xác nhận Lão dùng đúng kịch bản greeting.
- **Trạng thái:** Tích hợp trong kịch bản chat.

## 4. Kiểm Thử Kho Tàng Pháp Bảo & RAG
- **Mục tiêu:** Đảm bảo Modal Kho tàng pháp bảo hiển thị đúng 3 tab và có thể tải lại dữ liệu RAG từ GiacNgo.
- **Kịch bản:** Mở modal, chọn tab RAG, click "Tải lại từ GiacNgo", xác nhận dữ liệu cập nhật.
- **Trạng thái:** Cần viết script tự động.

## 5. Kiểm Thử Sidebar Pháp Bảo Khai Thị
- **Mục tiêu:** Xác nhận lịch sử đàm đạo và các tính năng phụ (tạo audio thiếu, đúc kết kệ pháp, phát toàn bộ, tải MP3).
- **Kịch bản:** Mở sidebar lịch sử, thử click các tính năng tiện ích.
- **Trạng thái:** Cần viết script tự động.

## 6. Kiểm Thử Bộ Điều Chỉnh Nhân Vật Lão
- **Mục tiêu:** Kiểm tra các chức năng thay đổi vị trí, lật hướng, bật tắt hào quang.
- **Kịch bản:** Thay đổi Slider vị trí X/Y/Scale và đảm bảo UI cập nhật.
- **Trạng thái:** Cần viết script tự động.

## 7. Kiểm Thử Đạo Diễn AI (E2E)
- **Mục tiêu:** Tự động tạo kịch bản đàm đạo dựa trên thiết lập.
- **File kịch bản:** `scratch/test_ai_director_e2e.js`
- **Kịch bản:** Mở Modal Đạo diễn, cấu hình nhân vật (Lão/Con), độ dài, hành trình cảm xúc, tạo và import kịch bản.
- **Trạng thái:** Đã PASS.

## 8. Kiểm Thử Nhập Kịch Bản Thủ Công
- **Mục tiêu:** Test tính năng dán kịch bản text vào hệ thống để tạo hội thoại.
- **Kịch bản:** Mở modal Nhập kịch bản, dán nội dung Text-to-Video, xác nhận import thành công.
- **Trạng thái:** Cần viết script tự động.

## 9. Kiểm Thử Chế Độ Live Stream (OBS)
- **Mục tiêu:** Kiểm thử luồng phát video, nhạc nền, hàng đợi live.
- **File kịch bản:** `scratch/test_obs_stream.js`
- **Kịch bản:** Bật OBS mode, nhập form URL YouTube, thêm vào danh sách chờ.
- **Trạng thái:** Đang debug (vấn đề event React `onClick`).

## 10. Kiểm Thử Freemium & Thanh Toán
- **Mục tiêu:** Kiểm thử tính năng khóa sau `freeLimit` (20 tin) và nhập mã kích hoạt.
- **Kịch bản:** Gửi quá số lượng cho phép, điền mã kích hoạt vào Modal Thanh toán.
- **Trạng thái:** Cần viết script tự động.

## 11. Kiểm Thử Bộ Đếm Tĩnh Tâm (Idle Timer)
- **Mục tiêu:** Kiểm tra timer đếm thời gian idle và reset khi có tin nhắn mới.
- **Trạng thái:** Có thể test thủ công.

## 12. Kiểm Thử Tutorial Tour
- **Mục tiêu:** Xác nhận hướng dẫn người dùng mới hoạt động đúng trên UI.
- **Trạng thái:** Có thể test thủ công.

## 13. Kiểm Thử Xuất Video (Dự kiến)
- **Mục tiêu:** Đảm bảo tính năng FFmpeg.wasm xuất được video cuối cùng.
- **Kịch bản:** Bấm tạo video, xác nhận file MP4/WebM được sinh ra.
- **Trạng thái:** Đang phát triển.
