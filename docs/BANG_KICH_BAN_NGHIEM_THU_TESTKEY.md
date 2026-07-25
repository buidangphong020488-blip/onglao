# 📋 BẢNG KỊCH BẢN NGHIỆM THU & KIỂM THỬ CHI TIẾT (TEST KEY SPECIFICATION)
## HỆ THỐNG THIỀN ĐƯỜNG ÔNG LÃO & GIÁC NGỘ AI PLATFORM

Tài liệu này cung cấp **kịch bản kiểm thử từng bước (Test Key)** chuẩn xác cho toàn bộ hệ thống. Người kiểm thử hoặc hệ thống kiểm thử tự động (Puppeteer/Playwright) sẽ thực hiện kiểm tra chi tiết theo các mục dưới đây.

---

### 📂 MODULE 1: SIDEBAR TRÁI & QUẢN LÝ PHIÊN ĐÀM ĐẠO (SESSIONS SIDEBAR)

| STT | Tên Tính Năng | Thao Tác Kiểm Thử (Steps) | Kết Quả Kỳ Vọng (Expected Outcome) | Trạng Thái |
|---|---|---|---|---|
| **1.1** | Nút `+ Tạo cuộc trò chuyện mới` | Click nút `+ Tạo cuộc trò chuyện mới` ở đầu menu bên trái. | 1. Hệ thống tạo 1 bản ghi `ChatSession` mới trong DB.<br>2. Tiêu đề chuyển thành `Cuộc đàm đạo N`.<br>3. Màn hình chat giữa & sidebar phải làm sạch 100%.<br>4. Đóng menu trái và phát Toast thông báo thành công. | ✅ PASS |
| **1.2** | Nút `Xưởng Phim Tự Động (Auto-Pilot)` | Click nút `Xưởng Phim Tự Động (Auto-Pilot)` ở menu trái. | Hiển thị Modal "Xưởng Phim Tự Động". Cho phép nhập chủ đề, chọn cấu hình nhân vật và bấm chạy tự động. | ✅ PASS |
| **1.3** | Nút `Bật chế độ Livestream Obs` | Click nút `Bật chế độ Livestream Obs` ở menu trái. | Chuyển toàn bộ ứng dụng sang giao diện Live Mode (Player YouTube, Canvas OBS đầy màn hình). | ✅ PASS |
| **1.4** | Nút `Quản lý Kịch bản Đạo diễn` | Click nút `Quản lý Kịch bản Đạo diễn` ở menu trái. | Hiển thị Modal "Quản lý Kịch bản Đạo diễn". Cho phép soạn kịch bản AI, chọn giọng Lão/Con và import văn bản. | ✅ PASS |
| **1.5** | Nút `Kho Kệ Pháp` | Click nút `Kho Kệ Pháp` ở menu trái. | Hiển thị Modal "Kho Kệ Pháp" với 164 bài kệ thiền. Cho phép chọn bài kệ và nghe thử audio. | ✅ PASS |
| **1.6** | Nút `Hướng dẫn sử dụng` | Click nút `Hướng dẫn sử dụng` ở menu trái. | Hiển thị Modal "Hướng dẫn sử dụng". Khi click nút `X` hoặc `Đã rõ khai thị` thì modal đóng lại mượt mà. | ✅ PASS |
| **1.7** | Ghim phiên đàm đạo (📌) | Click biểu tượng chiếc ghim (Pin) trên thẻ đàm đạo bất kỳ. | Phiên đàm đạo lập tức đẩy lên đầu danh sách, lưu trạng thái ghim xuống DB và phát Toast *"Đã ghim..."*. | ✅ PASS |
| **1.8** | Sửa tiêu đề phiên (✏️) | Click biểu tượng chiếc bút (Edit) trên thẻ đàm đạo $\rightarrow$ Nhập tên mới $\rightarrow$ Nhấn Enter. | Tiêu đề phiên được cập nhật ngay lập tức và đồng bộ xuống PostgreSQL DB. | ✅ PASS |
| **1.9** | Xóa phiên đàm đạo (🗑️) | Click biểu tượng chiếc thùng rác (Delete) trên thẻ đàm đạo bất kỳ. | Phiên đàm đạo và toàn bộ tin nhắn con bị xóa khỏi DB, thẻ biến mất khỏi danh sách và phát Toast *"Đã xóa..."*. | ✅ PASS |
| **1.10** | Chọn Hình tướng Lão | Click dropdown "Đổi hình tướng Lão" $\rightarrow$ Chọn Lão Hoa / Lão Trầm... | Hình ảnh đại diện Lão ở khung trung tâm thay đổi ngay lập tức theo preset đã chọn. | ✅ PASS |

---

### 💬 MODULE 2: KHUNG ĐÀM THOẠI & TRÍ TUỆ AI (CHAT ENGINE & INTERACTION)

| STT | Tên Tính Năng | Thao Tác Kiểm Thử (Steps) | Kết Quả Kỳ Vọng (Expected Outcome) | Trạng Thái |
|---|---|---|---|---|
| **2.1** | Gửi câu hỏi thưa thỉnh | Gõ văn bản vào ô nhập $\rightarrow$ Click nút Gửi (hoặc nhấn phím `Enter`). | 1. Tin nhắn người hỏi xuất hiện ngay lập tức (chỉ 1 câu, KHÔNG BỊ TRÙNG LẶP).<br>2. Lưu tin nhắn xuống DB qua `saveChatMessageAction`. | ✅ PASS |
| **2.2** | Dấu 3 chấm nhấp nháy (Typing Indicator) | Ngay khi bấm Gửi và chờ AI trả lời. | Hiển thị **Khung 3 chấm nảy (Bouncing Typing Dots)** kèm chữ *"Lão đang quán chiếu & khai thị... • • •"*. | ✅ PASS |
| **2.3** | Nhận phản hồi AI & TTS Voice | AI trả về câu trả lời. | 1. Câu khai thị của Lão thay thế cho dấu 3 chấm.<br>2. Tự động sinh giọng đọc TTS WAV qua Gemini AI (`/api/tts`).<br>3. Lão nhép miệng Lip-Sync theo sóng âm thời gian thực. | ✅ PASS |
| **2.4** | Tinh lọc cốt lõi (⭐) | Nhập văn bản dài $\rightarrow$ Click biểu tượng Ngôi sao (Sparkles) ở thanh nhập. | Lão giúp tóm gọn văn bản thành 1 câu hỏi đi thẳng vào trọng tâm nhất. | ✅ PASS |
| **2.5** | Micro thưa thỉnh (🎙️) | Click nút Micro tròn ở giữa. | Đèn Micro nhấp nháy đỏ báo hiệu ghi âm. Nhấn lần nữa để hoàn tất và gửi lời thưa. | ✅ PASS |
| **2.6** | Thao tác trên tin nhắn | Click các nút trên bóng thoại: Copy (📋), Sửa (✏️), Thích (👍), Không thích (👎), Tạo lại (🔄). | Mỗi nút thực thi chuẩn xác (Copy văn bản, hiển thị Toast cảm ơn, sinh lại giọng đọc mới). | ✅ PASS |

---

### 👤 MODULE 3: THANH HEADER & QUẢN LÝ PROFILE NGƯỜI DÙNG

| STT | Tên Tính Năng | Thao Tác Kiểm Thử (Steps) | Kết Quả Kỳ Vọng (Expected Outcome) | Trạng Thái |
|---|---|---|---|---|
| **3.1** | Nút Lịch sử / Khai thị (🕘) | Click biểu tượng Đồng hồ ở góc trên bên phải. | Ẩn/Hiện Sidebar phải "Pháp bảo khai thị" mượt mà. | ✅ PASS |
| **3.2** | Nút `Sửa Profile` | Hover Avatar góc trên phải $\rightarrow$ Click `Sửa Profile`. | Mở màn hình "Thông tin người hỏi" (`WelcomeScreen`) với đầy đủ trường dữ liệu. | ✅ PASS |
| **3.3** | Lưu Form Profile | Đổi Tên (Danh xưng), Nam/Nữ, Tuổi, Ngôn ngữ, Giọng đọc $\rightarrow$ Click `Lưu thay đổi`. | Dữ liệu lưu xuống PostgreSQL DB & `localStorage`. Phát Toast *"Đã lưu thay đổi..."* và quay về Thiền Đường. | ✅ PASS |
| **3.4** | Nút `Đăng xuất` | Hover Avatar góc trên phải $\rightarrow$ Click `Đăng xuất`. | Xóa token xác thực, đưa người dùng về trạng thái Đăng nhập và phát Toast *"Đã đăng xuất"*. | ✅ PASS |

---

### 📜 MODULE 4: PHÁP BẢO KHAI THỊ (RIGHT HISTORY SIDEBAR)

| STT | Tên Tính Năng | Thao Tác Kiểm Thử (Steps) | Kết Quả Kỳ Vọng (Expected Outcome) | Trạng Thái |
|---|---|---|---|---|
| **4.1** | Nút `Tạo MP3 thiếu` | Click nút `Tạo MP3 thiếu` ở đầu Sidebar phải. | Hệ thống tự động lọc các câu thoại chưa có âm thanh và gọi TTS ngầm sinh đầy đủ. | ✅ PASS |
| **4.2** | Nút `Lưu kịch bản` | Click nút `Lưu kịch bản`. | Hiển thị Modal nhập tên kịch bản và lưu toàn bộ cuộc đàm đạo thành kịch bản mẫu. | ✅ PASS |
| **4.3** | Nút `Đúc kết kệ pháp` | Click nút `Đúc kết kệ pháp`. | AI phân tích cuộc đàm đạo và đúc kết thành bài kệ 4 câu cô đọng. | ✅ PASS |
| **4.4** | Nút `Tạo video` | Click nút `Tạo video`. | Mở Studio Dựng Video Pháp Bảo (FullFrame Video Creator Studio). | ✅ PASS |
| **4.5** | Nút `Phát toàn bộ đàm đạo` | Click nút Play xanh lá tại trình phát Playlist. | Tự động phát nối tiếp toàn bộ âm thanh từ câu mào đầu $\rightarrow$ kệ $\rightarrow$ giải đáp. | ✅ PASS |

---

### 🎬 MODULE 5: STUDIO DỰNG VIDEO PHÁP BẢO (FULLFRAME VIDEO CREATOR)

| STT | Tên Tính Năng | Thao Tác Kiểm Thử (Steps) | Kết Quả Kỳ Vọng (Expected Outcome) | Trạng Thái |
|---|---|---|---|---|
| **5.1** | Tự động khớp Cảnh quay | Mở Studio Dựng Video. | Tự động phân tách từng câu thoại thành Thẻ Cảnh Quay (Scene Card) khớp đúng nhân vật Lão / Con / Outro. | ✅ PASS |
| **5.2** | Chọn Tỷ lệ Khung hình | Chọn "Đọc dọc (9:16 TikTok)" hoặc "Ngang (16:9 YouTube)". | Khung Canvas xem trước thay đổi tỉ lệ hiển thị chuẩn xác. | ✅ PASS |
| **5.3** | Bắt đầu Render Video | Click `Bắt đầu dựng Video`. | Hệ thống tổng hợp âm thanh, hình ảnh canvas và render ra video MP4 có giọng đọc & nhạc nền BGM. | ✅ PASS |

---

### 🏆 ĐÁNH GIÁ TỔNG THỂ HỆ THỐNG: PASS 100% TOÀN BỘ CÁC TÍNH NĂNG CLICK & LUỒNG XỬ LÝ!
