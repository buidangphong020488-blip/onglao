# HƯỚNG DẪN KIẾN TRÚC & KỶ LUẬT PHÁT TRIỂN DỰ ÁN ÔNG LÃO

Tài liệu này quy định toàn bộ các nguyên tắc bắt buộc phải tuân thủ khi duy trì, sửa đổi và phát triển hệ thống AI Thiền Đường Ông Lão.

---

## I. 4 NGUYÊN TẮC KỶ LUẬT BẮT BUỘC

1. **Thẩm Định Kế Hoạch (`implementation_plan.md`)**:
   - Không được phép tự ý sửa code. Mọi thay đổi logic phức tạp đều phải viết kế hoạch chi tiết và **chờ phản hồi phê duyệt từ người dùng**.

2. **Ưu Tiên Tệp Thu Âm Sẵn Từ CSDL / Ổ Cứng**:
   - Mào Đầu: Gọi API `/api/opening-phrases/random` để lấy câu mào đầu cùng đường dẫn tệp thu âm sẵn (`/uploads/audio/phrase_xxx.wav`).
   - Bài Kệ: Sử dụng tệp thu âm `matchedStanza.audioUrl`.
   - Tuyệt đối **không dùng giọng đọc mặc định của trình duyệt (`speechSynthesis`)**.

3. **Luồng Phát Âm Thanh Tuần Tự Ngăn Nắp (`AudioQueue`)**:
   - Thứ tự chuẩn:
     $$\text{1. Mào Đầu} \longrightarrow \text{2. Bài Kệ} \longrightarrow \text{3. AI Đúc Kết}$$
   - Hàng chờ FIFO đảm bảo âm thanh phát xong đoạn trước mới phát tiếp đoạn sau, không bị cắt ngang hay đọc lại từ đầu.

4. **Khẩu Hình Avatar Lip-Sync Nối Tiếp (`MiniLaoFace.tsx`)**:
   - Khẩu hình mở miệng cử động **chỉ khi âm thanh đang thực tế phát ra loa** (`isLaoSpeakingSession = Boolean(currentlyPlayingId)`).
   - Khi không có âm thanh phát, avatar trở về video tĩnh ngậm miệng (`idleSrc`).

5. **Thu Hồi Bộ Nhớ RAM (Garbage Collection)**:
   - Tự động thu hồi Blob URL (`URL.revokeObjectURL`) khi vượt quá 5 tệp trong bộ nhớ đệm.
   - Giải phóng thẻ `<video>` và dọn dẹp RAM/VRAM khi unmount component.

---

## II. KỊCH BẢN KIỂM THỬ TỰ ĐỘNG (75/76 SYSTEM TEST SUITE)

Mọi cập nhật tính năng mới đều phải thông qua kịch bản kiểm thử Puppeteer tự động trên Chrome thực tế:
- Tệp kịch bản kiểm thử: `scratch/full_system_verification.ts` và `scratch/generate_final_perfect_75_report.ts`
- Lệnh thực thi:
  ```bash
  npx tsx scratch/full_system_verification.ts
  ```
- Kết quả kiểm thử phải đạt 100% tỷ lệ thành công và có bằng chứng ảnh chụp lưu lại.
