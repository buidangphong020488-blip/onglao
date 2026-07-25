# BẢN MÔ TẢ CHI TIẾT TOÀN BỘ GIAO DIỆN FRONTEND & TÍNH NĂNG HỆ THỐNG AI THIỀN ĐƯỜNG ÔNG LÃO

> **Phiên bản**: 3.6.0  
> **Dự án**: Ông Lão — AI Thiền Đường Tâm Linh  
> **Kiến trúc**: Next.js App Router (Client Side) + PostgreSQL + Gemini 2.5 Flash & TTS Engine  
> **Tài liệu tham chiếu**: `docs/RULES_AND_TESTS.md` & `docs/TEST_REPORT_ONG_LAO.html`

---

## 📋 THƯ MỤC LỤC
1. [MÀN HÌNH 1: XÁC THỰC SSO & ĐĂNG NHẬP (LoginPage.tsx / AuthModal.tsx)](#man-hinh-1-xac-thuc-sso--dang-nhap)
2. [MÀN HÌNH 2: CHÀO MỪNG & THIẾT LẬP PROFILE (WelcomeScreen.tsx)](#man-hinh-2-chao-mung--thiet-lap-profile)
3. [MÀN HÌNH 3: CHÍNH THIỀN ĐƯỜNG & KHUNG CHAT ĐÀM THOẠI (NormalModePanel.tsx)](#man-hinh-3-chinh-thien-duong--khung-chat-dam-thoai)
4. [MÀN HÌNH 4: XƯỞNG PHIM TỰ ĐỘNG (AutoPilotModal.tsx)](#man-hinh-4-xuong-phim-tu-dong)
5. [MÀN HÌNH 5: QUẢN LÝ KỊCH BẢN AI DIRECTOR (AiDirectorManagerModal.tsx)](#man-hinh-5-quan-ly-kich-ban-ai-director)
6. [MÀN HÌNH 6: STUDIO DỰNG VIDEO & KHO CẢNH QUAY (VideoCreatorModal.tsx)](#man-hinh-6-studio-dung-video--kho-canh-quay)
7. [MÀN HÌNH 7: CHẾ ĐỘ LIVESTREAM OBS 16:9 (LiveModePanel.tsx)](#man-hinh-7-che-do-livestream-obs-169)
8. [MÀN HÌNH 8: KHO KỆ PHÁP 164 BÀI (PoemVaultModal.tsx)](#man-hinh-8-kho-ke-phap-164-bai)
9. [MÀN HÌNH 9: HƯỚNG DẪN SỬ DỤNG PHÁP KHÍ (UserGuideModal)](#man-hinh-9-huong-dan-su-dung-phap-khi)
10. [MÀN HÌNH 10: BẢNG QUẢN TRỊ HỆ THỐNG (AdminPage.tsx)](#man-hinh-10-bang-quan-tri-he-thong)

---

<a id="man-hinh-1-xac-thuc-sso--dang-nhap"></a>
## 1. MÀN HÌNH 1: XÁC THỰC SSO & ĐĂNG NHẬP (LoginPage.tsx / AuthModal.tsx)

### 📌 Mục đích:
Xác thực người dùng toàn hệ thống qua hạ tầng SSO GiacNgo (`https://giac.ngo`), phân lập dữ liệu cuộc đàm đạo và kịch bản video cá nhân hóa.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **Background Canvas**: Hiệu ứng hiệu chỉnh màu tối thiền định (`#020617`), kết hợp hạt ánh sáng mờ linh thiêng.
* **Form Đăng nhập SSO (Card trung tâm)**:
  - **Logo & Tiêu đề**: Biểu tượng Phật giáo thiền định kèm tiêu đề *"Đăng Nhập Thiền Đường Ông Lão"*.
  - **Ô nhập Email (`input[type="email"]`)**:
    + Placeholder: `name@giac.ngo`
    + Tự động kiểm tra định dạng email và xóa khoảng trắng dư thừa.
  - **Ô nhập Mật khẩu (`input[type="password"]`)**:
    + Nút 👁️ Bật/Tắt ẩn hiện mật khẩu góc phải ô nhập.
  - **Nút "Đăng Nhập SSO GiacNgo" (`button[type="submit"]`)**:
    + Hiệu ứng Gradient Nâu Amber - Vàng Hoàng Kim.
    + Trạng thái Loading spinner ⏳ khi đang gửi yêu cầu xác thực API.
  - **Nút "Tiếp tục với tư cách Khách"**:
    + Cho phép trải nghiệm nhanh không cần đăng ký tài khoản.

---

<a id="man-hinh-2-chao-mung--thiet-lap-profile"></a>
## 2. MÀN HÌNH 2: CHÀO MỪNG & THIẾT LẬP PROFILE (WelcomeScreen.tsx)

### 📌 Mục đích:
Cấu hình danh xưng, giới tính, tuổi, mẫu giọng và văn phong ứng đối khi lần đầu thưa thỉnh hoặc trước khi bắt đầu đàm đạo.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **[1.1] Ô Nhập Tên / Pháp danh (`input[type="text"]`)**:
  - Nhập Tên hoặc Pháp danh người thưa thỉnh (Mặc định: *"Con"*).
* **[1.2 & 1.3] Nút Chọn Giới tính (`button`)**:
  - Nút **👨 Nam** & Nút **👩 Nữ** (Đổi hiệu ứng màu sắc rực rỡ khi được chọn).
* **[1.4] Ô Nhập Tuổi (`input[type="number"]`)**:
  - Nhập số tuổi hiện tại (Tự động gợi ý xưng hô phù hợp).
* **[1.5] Dropdown Chọn Hình Tướng Lão (`select`)**:
  - Chọn danh xưng Minh Sư (Mặc định: *Lão Hóa / Ông Lão*).
* **[1.6] Dropdown Chọn Ngôn Ngữ (`select`)**:
  - Tùy chọn **Tiếng Việt** / **English** cho toàn bộ hội thoại.
* **[1.7] Dropdown Mẫu Giọng Đọc Gemini (`select`)**:
  - Chọn mẫu giọng đọc Gemini TTS (Puck, Charon, Fenrir, Orpheus, Enceladus, Algieba, Kore, Zephyr, Aoede, Leda, Callisto).
* **[1.8] Dropdown 21+ Phong Cách Đọc (`select`)**:
  - Lựa chọn phong cách văn phong: *Trầm ấm từ hòa, Uy nghiêm minh triết, Thong dong tự tại, Nhẹ nhàng tha thiết...*
* **[1.9] Textarea Prompt Khai Thị Tự Do (`textarea`)**:
  - Nhập chỉ dẫn nâng cao tùy chỉnh cho AI.
* **[1.10 & 1.11] Nút Hủy & Nút Lưu Thay Đổi**:
  - Nút **Hủy** (Quay về màn hình cũ), Nút **Lưu Thay Đổi** (Lưu cấu hình vào `localStorage` và PostgreSQL DB).

---

<a id="man-hinh-3-chinh-thien-duong--khung-chat-dam-thoai"></a>
## 3. MÀN HÌNH 3: CHÍNH THIỀN ĐƯỜNG & KHUNG CHAT ĐÀM THOẠI (NormalModePanel.tsx)

### 📌 Mục đích:
Không gian đàm đạo thiền định trực tiếp giữa Người thưa thỉnh và Minh Sư Ông Lão.

### 🎨 Chi tiết Giao diện & Linh kiện UI:

#### A. Thanh Header Bar & Nút Menu Pháp Khí:
* **Nút Menu Sidebar (`button`)**: Bật/tắt thanh lịch sử các cuộc đàm đạo.
* **Nút 🎬 AI Đạo Diễn**: Mở Modal Quản Lý Kịch Bản (`?modal=ai-director`).
* **Nút 🤖 Auto-Pilot**: Mở Xưởng Phim Tự Động (`?modal=auto-pilot`).
* **Nút 📚 Kho Kệ Pháp**: Mở Modal 164 Bài Kệ (`?modal=poem-vault`).
* **Nút 🎥 OBS Live**: Kích hoạt Chế độ Livestream OBS 16:9 (`?mode=live`).
* **Nút 👤 Avatar Profile**: Mở lại Form Sửa Profile.

#### B. Sidebar Quản Lý Cuộc Đàm Đạo (SessionsSidebar.tsx):
* **Nút "Đàm Đạo Mới" (`+`)**: Tạo cuộc trò chuyện sạch mới.
* **Danh sách Cuộc Đàm Đạo**:
  - Nút 📌 **Ghim**: Ghim cuộc đàm đạo lên đầu danh sách (Lưu vào DB).
  - Nút 🗑️ **Xóa**: Xóa cuộc đàm đạo khỏi cơ sở dữ liệu.

#### C. Khung Chat & Tương Tác Câu Thoại (NormalModePanel.tsx):
* **Bong bóng thoại Người thưa thỉnh (User)** & **Bong bóng thoại Ông Lão (AI)**.
* **Các nút điều hướng câu thoại**:
  - **[7.1] Ô nhập văn bản**: Nhập tâm thư / thắc mắc.
  - **[7.2] Nút Gửi (Send)**: Gửi câu hỏi cho AI processing.
  - **[7.3] Nút Micro 🎙️**: Thu âm giọng nói trực tiếp qua trình duyệt Web Speech API.
  - **[7.4] Nút Tinh Lọc Cốt Lõi ⭐**: Rút gọn tâm thư thành cốt lõi ngắn gọn.
  - **[7.5] Nút Tải Ảnh 📷**: Tải ảnh đính kèm để AI phân tích cảnh quan / tâm trạng.
  - **[7.6] Nút 🔊 Bật/Tắt Âm Thanh**: Bật/tắt chế độ tự động đọc tiếng nói khi có câu trả lời.
  - **[7.9] Nút ▶️ Nghe lại / ⏹️ Dừng**: Phát âm thanh ngắt nhịp của câu thoại.
  - **[7.10] Nút 📥 Tải MP3**: Tải file âm thanh `.mp3` của thoại về máy.
  - **[7.11] Nút 📋 Copy**: Sao chép văn bản câu thoại vào Clipboard.
  - **[7.12] Nút ✏️ Sửa Inline**: Sửa nội dung văn bản trực tiếp trên khung chat.
  - **[7.13] Nút 👍 / 👎**: Thích hoặc Không thích phản hồi của AI.
  - **[7.14] Nút ❓ Giải Thích Thêm**: Yêu cầu AI mở rộng nghĩa bài kệ.
  - **[7.15] Nút 📤 Chia Sẻ**: Tạo ảnh / link chia sẻ pháp thoại.
  - **[7.16] Nút 🎵 Tạo Tiếng Lòng**: Tổng hợp giọng đọc TTS khi câu thoại chưa có audio.
  - **[7.17] Nút 🔄 Tái Sinh Tiếng Lòng**: Tạo lại audio mới với giọng đọc khác.
  - **[7.20] Nút Đúc Kết Kệ Pháp**: Tự động kết hợp 4 câu kệ ngắt nhịp thiền.
  - **[7.21] Nút Tạo Video**: Đưa cuộc đàm đạo sang Studio Dựng Video (`VideoCreatorModal`).
  - **[7.22] Nút Trình Phát Toàn Bộ ▶️**: Phát nối tiếp tất cả câu thoại theo thứ tự:  
    $$\text{1. Mào Đầu} \longrightarrow \text{2. Bài Kệ} \longrightarrow \text{3. AI Đúc Kết}$$
  - **[7.23] Nút Tải MP3 Toàn Bộ**: Tải 1 file MP3 hợp nhất toàn bộ đàm đạo.

---

<a id="man-hinh-4-xuong-phim-tu-dong"></a>
## 4. MÀN HÌNH 4: XƯỞNG PHIM TỰ ĐỘNG (AutoPilotModal.tsx)

### 📌 Mục đích:
Sản xuất hàng loạt video ngắn (Tiktok, Shorts, Reels) tự động từ danh sách chủ đề hoặc từ đề xuất hot trend của AI.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **[2.2] Textarea Danh Sách Chủ Đề**: Nhập danh sách các chủ đề (Mỗi dòng 1 chủ đề).
* **[2.3] Nút "AI Tìm Chủ Đề Hot/Viral"**: Tự động sinh 5 chủ đề thu hút nhất về tâm linh và cuộc sống.
* **[2.4] Dropdown Giọng Lão**: Chọn giọng Gemini TTS cho nhân vật Lão.
* **[2.5] Dropdown Giọng Con**: Chọn giọng Gemini TTS cho nhân vật Con.
* **[2.6] Dropdown Độ Dài Kịch Bản**: *Ngắn (3-5 câu), Vừa (6-10 câu), Dài (10-15 câu)*.
* **[2.7] Dropdown Hiệu Ứng Chuyển Cảnh**: *Cắt cứng, Mờ đen, Chớp trắng, Lóa sáng tâm linh*.
* **[2.8] Dropdown Chế Độ Sản Xuất**: *Tạo Audio trước / Dựng Video MP4 hoàn chỉnh*.
* **[2.9] Nút "🚀 BẮT ĐẦU SẢN XUẤT TỰ ĐỘNG"**: Kích hoạt luồng sản xuất background tự động.

---

<a id="man-hinh-5-quan-ly-kich-ban-ai-director"></a>
## 5. MÀN HÌNH 5: QUẢN LÝ KỊCH BẢN AI DIRECTOR (AiDirectorManagerModal.tsx)

### 📌 Mục đích:
Soạn thảo, quản lý, thiết lập giọng đọc TTS và biên tập kịch bản đàm đạo chuyên nghiệp trước khi xuất phim.

### 🎨 Chi tiết Giao diện & Linh kiện UI Cực Kỳ Chi Tiết:

#### A. Thanh Header Modal & Nút Điều Hướng:
* **Tiêu đề Modal**: *"🎬 Đạo Diễn AI & Quản Lý Kịch Bản Video"*.
* **Nút Close `X` (Top-Right)**: Đóng modal, làm sạch các tham số URL searchParams (`action`, `type`, `id`), khôi phục trạng thái Thiền đường an toàn.

#### B. Màn Hình 1: Danh Sách Kịch Bản (View Mode = `'list'`):
* **Ô Tìm Kiếm Kịch Bản (`input[type="text"]`)**:
  - Lọc nhanh danh sách kịch bản theo tiêu đề, từ khóa chủ đề hoặc ngày khởi tạo.
* **Nút "⚡ Tạo Kịch Bản Mới" (`button`)**:
  - Mở menu lựa chọn: **🤖 Nhờ AI Soạn Tự Động** hoặc **✍️ Soạn Thủ Công Tự Do**.
* **Thẻ Kịch Bản (Script Card)**:
  - **Badge Loại Kịch Bản**: Hiển thị nhãn `[AI]` (Màu xanh cyan) hoặc `[Thủ công]` (Màu vàng amber).
  - **Tiêu đề & Ngày khởi tạo**: Hiển thị tên kịch bản và mốc thời gian local `vi-VN`.
  - **Badge Tiến Trình Audio TTS**: Hiển thị tỷ lệ thoại đã sẵn sàng audio (VD: `5/5 câu ready`).
  - **Nút ✏️ "Chỉnh Sửa"**: Chuyển sang màn hình biên tập kịch bản chi tiết (`view = 'edit'`).
  - **Nút 🎙️ "Tạo Audio Hàng Loạt"**: Tự động gọi Gemini TTS tạo âm thanh nối tiếp cho các thoại chưa có tiếng.
  - **Nút ▶️ "Phát Tất Cả (Playlist Player)"**: Phát âm thanh nối tiếp toàn kịch bản, hiển thị thanh tua thời gian real-time (Seek Slider).
  - **Nút 🎥 "Dựng Video"**: Đưa kịch bản trực tiếp sang Studio Dựng Video (`childmodal=create-video&scriptid=xxx`).
  - **Nút 🗑️ "Xóa Kịch Bản"**: Xóa kịch bản vĩnh viễn khỏi cơ sở dữ liệu PostgreSQL.

#### C. Màn Hình 2: Form Biên Tập Kịch Bản Chi Tiết (View Mode = `'edit'`):
* **1. Ô Nhập Tiêu Đề Kịch Bản (`input[type="text"]`)**:
  - Cho phép sửa tên kịch bản (Tự động cắt bỏ các tiền tố `[AI]`, `[Thủ công]`).
* **2. Ô Chọn Ngày & Giờ (`input[type="datetime-local"]`)**:
  - Lựa chọn mốc thời gian hiển thị kịch bản.
* **3. Bảng Công Cụ Gợi Ý AI (AiGeneratorPanel)**:
  - **Textarea Chủ Đề Đàm Đạo**: Nhập bế tắc / chủ đề tâm lý (VD: *Nợ nần, bế tắc cuộc sống, áp lực gia đình*).
  - **Dropdown Độ Dài Kịch Bản**: *Khoảng 3-5 câu (Ngắn), 6-10 câu (Vừa), 10-15 câu (Dài)*.
  - **Dropdown Phong Cách Lão**: *Từ bi ôn hòa, Uy nghiêm dứt khoát, Thong dong tự tại, Ngắn gọn minh triết...*
  - **Dropdown Diễn Biến Cảm Xúc Con**: *Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng*.
  - **Checkbox Trích Dẫn 4 Câu Kệ Sư Cha Tam Vô**: Bắt buộc AI tìm và trích dẫn bài kệ phù hợp.
  - **Nút "🤖 Nhờ AI Soạn Lại Kịch Bản"**: Gửi prompt chuẩn tới Gemini 2.5 Flash API.
* **4. Bộ Cấu Hình Mẫu Giọng & Văn Phong TTS**:
  - **Giọng Lão**: Dropdown chọn mẫu giọng Gemini Nam/Nữ (`Puck`, `Charon`, `Fenrir`...) + Input phong cách giọng Lão.
  - **Giọng Con**: Dropdown chọn mẫu giọng Gemini Nam/Nữ (`Kore`, `Zephyr`, `Aoede`...) + Input phong cách giọng Con.
* **5. Khung Văn Bản Thoại Gộp (`textarea`)**:
  - Nhập và biên tập toàn bộ hội thoại dưới dạng văn bản thô:
    ```text
    Lão: [vui] Chào con, tâm con hôm nay thế nào?
    Con: [buồn] Thưa Lão, con đang rất bế tắc...
    Outro: [kết] Sư Cha Tam Vô đã khai thị.
    ```
  - **Hỗ trợ Phím Tắt `Ctrl + S`**: Bấm `Ctrl + S` để lưu kịch bản tức thì.
* **6. Thanh Nút Chèn Nhanh Vai Trò & Tag Cảm Xúc**:
  - Nút chèn vai: `Lão:`, `Con:`, `Outro:`.
  - Nút chèn cảm xúc: `[vui]`, `[buồn]`, `[bình thường]`, `[intro]`, `[outtro]`.
* **7. Danh Sách Khối Thoại Chi Tiết (Dialogue Blocks List)**:
  - Phân tách từng câu thoại thành 1 ô điều khiển riêng biệt:
    + Thẻ vai trò màu sắc: `Lão` (Cam), `Con` (Xanh), `Outro` (Tím).
    + Dropdown chọn cảm xúc riêng cho câu thoại: *Bình thường, Vui vẻ, Buồn bế tắc, Mào đầu, Outro*.
    + Textarea chỉnh sửa nội dung văn bản thoại inline.
    + Nút 🎙️ **Tạo Audio Này**: Tạo/tái sinh âm thanh TTS cho câu thoại cụ thể.
    + Nút ▶️ **Nghe Thử**: Phát file MP3 thoại vừa sinh.
    + Nút 🗑️ **Xóa Dòng**: Xóa câu thoại khỏi danh sách.
* **8. Thanh Chân Trang Form Biên Tập**:
  - Nút **"💾 Lưu Kịch Bản"**: Lưu thay đổi vào PostgreSQL DB (`batchSaveScriptAction`).
  - Nút **"🎵 Tải MP3 Hợp Nhất Đa Nhân Vật"**: Gọi API `/api/tts/multispeaker` tổng hợp 1 file MP3 hợp nhất toàn bộ thoại.
  - Nút **"🎥 Chuyển Sang Studio Dựng Video"**: Đưa kịch bản sang Studio Dựng Video (`childmodal=create-video`).

---

<a id="man-hinh-6-studio-dung-video--kho-canh-quay"></a>
## 6. MÀN HÌNH 6: STUDIO DỰNG VIDEO & KHO CẢNH QUAY (VideoCreatorModal.tsx)

### 📌 Mục đích:
Studio dựng video chuyên nghiệp, ghép nối video clips, khớp phụ đề, nhép miệng tự động 60FPS và quản lý Kho Cảnh Quay phân mục.

### 🎨 Chi tiết Giao diện & Linh kiện UI Cực Kỳ Chi Tiết:

#### A. Studio Dựng Video Phim Pháp Bảo (VideoCreatorModal.tsx):

##### 1. Cột Trái: Bảng Điều Chỉnh Thông Số & Lịch Sử Render:
* **Thanh Sub-Tab Điều Hướng**: *Cơ bản*, *Thông điệp & Phụ đề*, *📜 Lịch sử (N)*.

* **Sub-Tab 1: Cơ Bản (Thiết lập Video & Clips)**:
  - **Selector Tỷ Lệ Màn Hình (`videoAspectRatio`)**:
    + `Ngang (16:9 Youtube)`: Tỉ lệ chuẩn màn hình ngang.
    + `Dọc (9:16 Tiktok/Reels)`: Tỉ lệ chuẩn video ngắn dọc.
  - **Selector Độ Phân Giải Output (`videoResolution`)**:
    + `480p (Rất nhẹ)`
    + `720p (HD tiêu chuẩn)`
    + `1080p (Full HD - Mặc định)`
    + `1440p (2K siêu nét)`
    + `2160p (4K điện ảnh)`
  - **Selector Định Dạng Tệp (`videoExt`)**: `MP4 (.mp4)` hoặc `WebM (.webm)`.
  - **Selector Hiệu Ứng Chuyển Cảnh (`videoTransition`)**:
    + `Cắt cứng (Cut - Mặc định)`
    + `Mờ đen (Dip to Black)`
    + `Chớp trắng (Flash White)`
    + `Lóa sáng tâm linh (Spirit Glow)`
    + `Ngẫu nhiên tự động`
  - **Slider Thời Gian Kéo Dài Hiệu Ứng (`videoTransitionDuration`)**: Chỉnh từ `0.1s` đến `2.0s`.

* **Nút Lệnh Thao Tác Cảnh Quay**:
  - Nút **"✨ Chia cảnh theo thoại"**: Tự động ánh xạ từng câu thoại trong kịch bản thành 1 cảnh video riêng.
  - Nút **"+ Thêm cảnh tự do"**: Tạo cảnh quay trống thủ công.
  - Nút **"💾 Lưu Bộ Cảnh Này"**: Lưu cấu hình bộ cảnh quay vào cơ sở dữ liệu.
  - Nút **"🗑️ Xóa tất cả cảnh"**: Xóa toàn bộ danh sách cảnh quay hiện tại.
  - **Vùng Kéo Thả Upload Hàng Loạt (Batch Dropzone)**: Kéo thả nhiều file video clip từ máy tính (AI tự phân loại vai qua tên file: `lao_vui.mp4`, `con_buon.mp4`...).

* **Sub-Tab 1.2: Logo & Nhạc Nền (Logo & Music)**:
  - **Tải Lên Logo Thương Hiệu**: Nhập URL hoặc tải ảnh Logo đóng dấu bản quyền.
  - **Vị Trí Đóng Dấu Logo**: *Top-Right, Top-Left, Bottom-Right, Bottom-Left, Custom (X%, Y%)*.
  - **Toggle Logo Hình Tròn (Circular)** & **Slider Độ Mờ Opacity** (`0.1` đến `1.0`).
  - **Selector Nhạc Nền Thiền Định**: Chọn nhạc thiền tĩnh tâm.
  - **Slider Âm Lượng Nhạc Nền (`bgmVolume`)**: Căn chỉnh âm lượng nhạc nền không bị đè tiếng thoại.

* **Sub-Tab 2: Thông Điệp & Phụ Đề**:
  - **Tùy Chỉnh Phụ Đề**: Chọn Màu chữ phụ đề (Vàng, Trắng, Xanh...), Cỡ chữ (Scale `0.5x` đến `2.0x`) và Vị trí Y% hiển thị trên màn hình.
  - **Thiết Lập Intro & Outro**:
    + **Intro**: Nhập Tiêu đề Mở đầu & Subtitle Intro.
    + **Outro**: Nhập Thông điệp Lời kết Outro cuối video.

* **Sub-Tab 3: Lịch Sử Render**:
  - Danh sách các video đã xuất bản thành công kèm thumbnail, ngày khởi tạo và dung lượng.
  - Nút **"▶️ Xem"**: Phát video trực tiếp trên player.
  - Nút **"💾 Tải Về"**: Tải tệp MP4 về máy tính.
  - Nút **"🗑️ Xóa"**: Xóa video khỏi lịch sử render.

##### 2. Cột Phải: Màn Hình Preview Render Canvas 60FPS:
* **Khung Hình Live Preview Canvas**:
  - Hiển thị video render 60FPS thời gian thực với công nghệ tách nền xanh Chroma-Key (Chroma Keying Engine).
* **Nút Thao Tác Màn Hình Preview**:
  - Nút **"💾 Tải Video MP4"**: Tải tệp phim MP4 vừa xuất.
  - Nút **"🔵 Chia Sẻ"**: Chia sẻ video lên mạng xã hội.
  - Nút **"Phóng To Toàn Màn Hình"**: Bật/tắt chế độ Fullscreen Preview (`isPreviewFullscreen`).

---

#### B. Kho Cảnh Quay Video & Phân Mục Tùy Chỉnh (Library Picker Modal):

##### 1. Thanh Header & Nút Nạp Clip Mới:
* Tiêu đề: *"Kho Cảnh Quay Video & Phân Mục"*.
* Nút **"📥 Nạp Thêm Clip Mới"**: Chọn 1 hoặc nhiều tệp video từ máy tính để nạp trực tiếp vào IndexedDB trình duyệt.
* Nút **`X` Đóng Modal**: Đóng Kho Cảnh Quay.

##### 2. Thanh Tiêu Đề Trung Tâm & Thao Tác Hàng Loạt:
* Hiển thị tổng số clip kết quả đang lọc.
* **Nút "⚡ Chọn Tất Cả (N clip)"**: Tích chọn nhanh toàn bộ video clip đang hiển thị vào danh sách chờ dựng.
* **Nút "🗑️ Bỏ Chọn (N clip)"**: Xóa toàn bộ danh sách clip đang chờ.

##### 3. Cột Phân Mục Trái (Left Sidebar Categories):
* **Phân Mục Mặc Định**:
  - `📁 Tất Cả Clip`
  - `🧘 Cảnh Lão Đàm Đạo`
  - `👤 Cảnh Con Hỏi Đạo`
  - `🎬 Cảnh Outro Kết Thúc`
* **Chuyên Mục Tùy Chỉnh**:
  - **Nút "+ Thêm Chuyên Mục Mới"**: Mở Modal nhập tên chuyên mục mới (`showAddCatModal`).
  - **Danh Sách Chuyên Mục Tùy Chỉnh**:
    + Nút ✏️ **Edit (Đổi Tên Chuyên Mục)**: Mở Modal đổi tên chuyên mục với `z-[9999]`.
    + Nút 🗑️ **Trash (Xóa Chuyên Mục)**: Xóa chuyên mục trực tiếp không hiển thị alert trình duyệt.

##### 4. Khung Tìm Kiếm & Phân Trang Clip:
* **Ô Nhập Tìm Kiếm (`input[type="text"]`)**: Tìm kiếm video clip theo tên, nhân vật, cảm xúc hoặc phân mục.
* **Selector Số Lượng Clip Trên Trang**: *5, 10, 25, 50, 100 clip/trang*.
* **Nút Điều Hướng Phân Trang**: Nút **« Đầu**, **‹ Trước**, **Trang Hiện Tại / Tổng Trang**, **Sau ›**, **Cuối »**.

##### 5. Danh Sách Card Video Clip (LibraryClipCard):
* **Nút Check 🟢 (Góc Trên Trái Thumbnail)**:
  - Tích chọn / Bỏ chọn từng clip cá nhân. Hiển thị viền xanh lá `border-emerald-500` và dấu check nổi bật khi được chọn.
* **Thumbnail Video Snap Poster**: Chụp ảnh tĩnh JPEG snapshot khung hình video không gây lãng phí bộ nhớ RAM.
* **Nút "▶️ Xem thử"**: Click thumbnail để phát thử video clip trong modal xem trước.
* **Badge Vai Trò & Cảm Xúc**:
  - Badge Vai trò: `Lão` (Màu cam), `Con` (Màu xanh), `Outro` (Màu tím).
  - Badge Cảm xúc: `Vui Vẻ`, `Buồn Bế Tắc`, `Mào Đầu`, `Bình Thường`.
* **Nút Lệnh Card**: Nút **"+ Thêm"** / **"✔ Đã Chọn"**.

##### 6. Bảng Danh Sách Chờ Dựng Video (Staged Clips Sidebar - Cột Phải Kho):
* Danh sách các clip đã chọn được xếp hàng theo thứ tự.
* Nút **"✅ Xác Nhận Nạp N Clip Vào Kịch Bản"**: Nạp toàn bộ danh sách chờ vào kịch bản dựng video.
* Nút **"❌ Hủy Bỏ"**: Hủy bỏ và đóng kho.

---

<a id="man-hinh-7-che-do-livestream-obs-169"></a>
## 7. MÀN HÌNH 7: CHẾ ĐỘ LIVESTREAM OBS 16:9 (LiveModePanel.tsx)

### 📌 Mục đích:
Giao diện chuẩn 16:9 chuyên dụng cho Livestream OBS Studio, hỗ trợ đàm thoại AI tự động và tương tác Micro khách mời.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **Khung hình 16:9 Fullscreen**:
  - Hiển thị 2 nhân vật đối thoại 3D / 2.5D song song trên màn hình.
* **Bảng Tùy Chỉnh Vị Trí Nhân Vật (CharOffsets)**:
  - Nút **"Lật" (FlipHorizontal)**: Lật hướng nhân vật nhìn đối diện nhau.
  - Thanh trượt **Ngang (X)**, **Dọc (Y)** & **Thu phóng (Scale)**: Căn chỉnh vị trí 2 nhân vật mượt mà.
* **Hạ Tầng Micro Khách Mời (Guest Mic)**:
  - Nút 🎙️ **Bật/Tắt Micro Khách Mời**: Thu tiếng khách mời livestream và trả lời trực tiếp thời gian thực.

---

<a id="man-hinh-8-kho-ke-phap-164-bai"></a>
## 8. MÀN HÌNH 8: KHO KỆ PHÁP 164 BÀI (PoemVaultModal.tsx)

### 📌 Mục đích:
Tra cứu, tìm kiếm và thỉnh 164 bài kệ khai thị của Sư Cha Tam Vô từ PostgreSQL DB.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **[5.2] Input Tìm Kiếm Kệ Pháp**: Tìm theo từ khóa, số thứ tự bài kệ hoặc nội dung câu thơ.
* **[5.3] Nút "▶️ Nghe Thử"**: Phát âm thanh bài kệ ngắt nhịp chuẩn thiền.
* **[5.4] Nút "🌸 Chọn Bài Kệ Đàm Đạo"**: Đưa bài kệ vào khung chat để Lão giảng nghĩa.
* **[5.5] Nút "📥 Tải Audio"**: Tải MP3 của bài kệ về máy.

---

<a id="man-hinh-9-huong-dan-su-dung-phap-khi"></a>
## 9. MÀN HÌNH 9: HƯỚNG DẪN SỬ DỤNG PHÁP KHÍ (UserGuideModal)

### 📌 Mục đích:
Giới thiệu quy trình thưa thỉnh, đàm đạo và cách sử dụng các pháp khí công nghệ cho người mới.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **[6.1] Màn hình Hướng Dẫn**: Các thẻ giới thiệu về Thiền Đường, Pháp Khí Kệ Pháp, AI Đạo Diễn và Studio Video.
* **[6.3] Nút "Đã Rõ Khai Thị"**: Đóng modal hướng dẫn.

---

<a id="man-hinh-10-bang-quan-tri-he-thong"></a>
## 10. MÀN HÌNH 10: BẢNG QUẢN TRỊ HỆ THỐNG (AdminPage.tsx)

### 📌 Mục đích:
Quản lý toàn bộ cấu hình hệ thống, kho bài kệ, kho cảnh quay và mô hình giọng đọc TTS.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **Phần 1: Cấu hình Hệ thống**:
  - Nhập Gemini API Key, chọn Gemini Model (`gemini-2.5-flash-preview-09-2025`).
* **Phần 2: 🎙️ Cấu hình Giọng đọc Khai thị của Lão (Khung Duy Nhất)**:
  - **Mẫu Giọng Gemini (Nam & Nữ)**: Combobox xổ xuống duy nhất chứa đầy đủ 11+ mẫu giọng (Puck, Charon, Fenrir, Orpheus, Enceladus, Algieba, Kore, Zephyr, Aoede, Leda, Callisto).
  - **Văn phong & Phong cách Giọng Lão**: Ô nhập phong cách đọc mặc định.
* **Phần 3: Quản lý Hình Tướng & Kho Cảnh Quay**:
  - Thêm / sửa / xóa các bộ cảnh quay video nền và dữ liệu nhân vật.
* **Phần 4: Quản lý Kho Kệ Pháp & Freemium**:
  - Thêm mới bài kệ, quản lý số lượt nhắn tin miễn phí và mã kích hoạt.

---

## 🏆 KẾT LUẬN
Tài liệu này mô tả **100% đầy đủ chi tiết** từng màn hình, linh kiện UI, nút bấm và luồng dữ liệu của hệ thống **AI Thiền Đường Ông Lão**. Mọi cập nhật tiếp theo bắt buộc tuân thủ đúng các quy chuẩn thiết kế và kỷ luật đã nêu.
