# HƯỚNG DẪN KIẾN TRÚC & KỶ LUẬT PHÁT TRIỂN DỰ ÁN ÔNG LÃO

Tài liệu này quy định toàn bộ các nguyên tắc bắt buộc phải tuân thủ khi duy trì, sửa đổi và phát triển hệ thống AI Thiền Đường Ông Lão.

---

## I. NGUYÊN TẮC KỶ LUẬT BẮT BUỘC

0. **Đọc Docs & Skill Bắt Buộc**:
   - Trước khi làm bất kỳ việc gì (phân tích, lập kế hoạch, sửa mã nguồn, chạy lệnh, tạo tính năng...), AI **BẮT BUỘC PHẢI DÙNG `view_file` ĐỌC TỆP `docs/RULES_AND_TESTS.md`, CÁC TỆP TRONG `docs/` VÀ ĐỌC HƯỚNG DẪN `SKILL.md` CỦA SKILL LIÊN QUAN**.

1. **Thẩm Định Kế Hoạch (`implementation_plan.md`)**:
   - Không được phép tự ý sửa code. Mọi thay đổi logic phức tạp đều phải viết kế hoạch chi tiết và **chờ phản hồi phê duyệt từ người dùng**.

2. **Ưu Tiên Tệp Thu Âm Sẵn Từ CSDL / Ổ Cứng**:
   - Mào Đầu: Gọi API `/api/opening-phrases/random` để lấy câu mào đầu cùng đường dẫn tệp thu âm sẵn (`/uploads/audio/phrase_xxx.wav`).
   - Bài Kệ: Sử dụng tệp thu âm `matchedStanza.audioUrl`.
   - Tuyệt đối **không dùng giọng đọc mặc định của trình duyệt (`speechSynthesis`)**. Chỉ dùng Gemini TTS (`/api/tts`) làm phương án thứ hai khi chưa có thu âm sẵn.

3. **Luồng Phát Âm Thanh Tuần Tự Ngăn Nắp (`AudioQueue`)**:
   - Thứ tự chuẩn:
     $$\text{1. Mào Đầu} \longrightarrow \text{2. Bài Kệ} \longrightarrow \text{3. AI Đúc Kết}$$
   - Hàng chờ FIFO đảm bảo âm thanh phát xong đoạn trước mới phát tiếp đoạn sau, không bị cắt ngang hay đọc lại từ đầu.

4. **Khẩu Hình Avatar Lip-Sync Nối Tiếp (`MiniLaoFace.tsx`)**:
   - Khẩu hình mở miệng cử động **chỉ khi âm thanh đang thực tế phát ra loa** (`isLaoSpeakingSession = Boolean(currentlyPlayingId)`).
   - Khi không có âm thanh phát, avatar trở về video tĩnh ngậm miệng (`idleSrc`).

5. **Thu Hồi Bộ Nhớ RAM (Garbage Collection)**:
   - Tự động thu hồi Blob URL (`URL.revokeObjectURL`) khi vượt quá 5 tệp trong bộ nhớ đệm (`autoReleaseRamMemory()`).
   - Giải phóng thẻ `<video>` và dọn dẹp RAM/VRAM khi unmount component.

6. **Lập Kế Hoạch Minh Bạch Từng Chi Tiết UI & Thẩm Định Ảnh Bằng Chứng**:
   - Trong `implementation_plan.md`, mọi chi tiết chỉnh sửa (thêm/bỏ nút, xóa dấu check, ẩn/hiện UI...) **BẮT BUỘC PHẢI LIỆT KÊ MINH BẠCH 100% TRONG KẾ HOẠCH**, tuyệt đối không tự ý xóa bỏ bất kỳ thành phần nào nếu chưa báo trước.
   - Khi chụp ảnh kiểm thử Puppeteer, AI **BẮT BUỘC PHẢI DÙNG `view_file` TỰ REVIEW VÀ THẨM ĐỊNH LẠI ẢNH SCREENSHOT** để đảm bảo đúng 100% yêu cầu người dùng trước khi báo hoàn tất.

7. **Bảo Mật & Phân Quyền Giác Ngộ SSO (Chính Sách B - Bắt Buộc Đăng Nhập)**:
   - **Xác Thực 100% Private API**: Mọi tính năng Chat AI, TTS, Tạo Ảnh, Render Video, Quản lý Session/Messages/Clips/Profile đều bắt buộc gửi Bearer Token qua `authFetch()`. Trả về `401 Unauthorized` nếu chưa đăng nhập hoặc token không hợp lệ.
   - **Phân Quyền Sở Hữu Dữ Liệu (Fail-Closed Data Isolation)**: Kiểm tra `isResourceOwner(user, resourceUserId)` — người dùng chỉ xem/sửa/xóa được dữ liệu do chính mình tạo ra (`userId === canonicalUserId(resourceUserId)`). Nếu tài nguyên không rõ chủ sở hữu (`userId` là null/undefined) thì từ chối mặc định đối với user thường.
   - **Không Lưu Mật Khẩu/Token Trong Mã Nguồn**: Loại bỏ toàn bộ password mặc định (`admin@123`), token cứng; chỉ đọc từ biến môi trường `process.env`.
   - **Phòng Chống Tấn Công SSRF (`/api/proxy`)**: Chỉ chấp nhận `https:`, chặn toàn bộ dải IP nội bộ (`localhost`, `127.0.0.1`, `10.x`, `192.168.x`, `172.16-31.x`) và kiểm tra whitelist domain nghiêm ngặt. Khi tải lỗi trả đúng HTTP error code thực tế.

---

## II. KỊCH BẢN KIỂM THỬ TỰ ĐỘNG (SYSTEM TEST SUITE)

Mọi cập nhật tính năng mới đều phải thông qua các kịch bản kiểm thử tự động:
1. **Bộ Kiểm Thử Bảo Mật & Phân Quyền (27/27 Tests)**:
   - Tệp kịch bản: `scratch/test_auth_security_suite.ts`
   - Lệnh thực thi:
     ```bash
     npx tsx scratch/test_auth_security_suite.ts
     ```
   - Kiểm tra 100% khóa Private API (401), SSRF (403), Admin auth và Public API (200).

2. **Kịch Bản Kiểm Thử Giao Diện Puppeteer Chrome Thực Tế**:
   - Tệp kịch bản: `scratch/verify_browser_flow.ts` và `scratch/full_system_verification.ts`
   - Lệnh thực thi:
     ```bash
     npx tsx scratch/verify_browser_flow.ts
     ```
   - Kết quả kiểm thử phải đạt 100% tỷ lệ thành công và có bằng chứng ảnh chụp lưu lại trong `scratch/`.
