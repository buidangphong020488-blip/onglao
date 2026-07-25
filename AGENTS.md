<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# QUY TẮC PHÁT TRIỂN & KỶ LUẬT DỰ ÁN ÔNG LÃO (AI THIỀN ĐƯỜNG)

## 0. SKILL BẮT BUỘC: ĐỌC THƯ MỤC DOCS BAN ĐẦU (MANDATORY INITIAL DOCS INSPECTION)
- **BẮT BUỘC ĐỌC THƯ MỤC `docs/`**: Ở đầu mỗi cuộc trò chuyện hoặc trước khi phân tích / viết bất kỳ dòng mã nguồn nào, AI **BẮT BUỘC PHẢI DÙNG `view_file` ĐỌC TỆP `docs/RULES_AND_TESTS.md` VÀ CÁC TỆP TRONG THƯ MỤC `docs/`** để cập nhật 100% quy trình kỷ luật và kiến trúc dự án.

---

## 1. NGUYÊN TẮC KỶ LUẬT BẮT BUỘC (STRICT INVARIANTS)
1. **Lập Kế Hoạch & Phê Duyệt**: Mọi thay đổi logic phức tạp bắt buộc phải viết `implementation_plan.md` với `request_feedback = true` và **CHỜ NGƯỜI DÙNG BẤM ĐỒNG Ý** trước khi sửa bất kỳ tệp nguồn nào.
2. **Ưu Tiên Tệp Thu Âm Sẵn Từ CSDL / Ổ Cứng**:
   - Mào Đầu: Gọi `/api/opening-phrases/random` lấy tệp thu âm sẵn (`/uploads/audio/phrase_xxx.wav`).
   - Bài Kệ: Sử dụng `matchedStanza.audioUrl`.
   - Tuyệt đối **KHÔNG dùng giọng đọc WebSpeech của trình duyệt (`speechSynthesis`)**. Chỉ dùng Gemini TTS (`/api/tts`) làm phương án thứ hai khi chưa có thu âm sẵn.
3. **Thứ Tự Đàm Đạo Tuần Tự Ngăn Nắp (`AudioQueue`)**:
   - Thứ tự: $$\text{1. Mào Đầu} \longrightarrow \text{2. Bài Kệ} \longrightarrow \text{3. AI Đúc Kết}$$
   - Sử dụng cơ chế hàng chờ FIFO `AudioQueue` nối tiếp `onended`, tuyệt đối không cắt ngang giữa chừng, không phát chồng và không đọc lại từ đầu.
4. **Quy Tắc Khẩu Hình Lip-Sync (`MiniLaoFace.tsx`)**:
   - Khẩu hình miệng Lão **CHỈ MỞ KHI ÂM THANH ĐANG THỰC TẾ PHÁT RA LOA** (`isLaoSpeakingSession = Boolean(currentlyPlayingId)`).
   - Khi không có âm thanh phát, khẩu hình ở trạng thái tĩnh ngậm miệng (`idleSrc`).
5. **Giải Phóng Bộ Nhớ RAM & Garbage Collection Tự Động**:
   - Mọi tác vụ phải gọi `autoReleaseRamMemory()` thu hồi Blob URL (`URL.revokeObjectURL`) khi quá 5 tệp.
   - Giải phóng thẻ HTML `<video>` và dọn dẹp VRAM khi unmount.

---

## 2. KỊCH BẢN KIỂM THỬ THỰC TẾ (75/76 SYSTEM TEST SUITE)
Mọi nâng cấp/sửa đổi phải chạy kịch bản kiểm thử Puppeteer tự động trên Chrome thực tế và chụp ảnh màn hình bằng chứng:
- File kịch bản chính: `scratch/full_system_verification.ts` & `scratch/generate_final_perfect_75_report.ts`
- Lệnh chạy kiểm thử:
  ```bash
  npx tsx scratch/full_system_verification.ts
  ```
- Kiểm tra 100% 75/76 tiêu chuẩn đàm đạo, ghim session, khẩu hình avatar, thu hồi RAM và đúc kết AI.
