# BẢN MÔ TẢ CHI TIẾT TOÀN BỘ GIAO DIỆN FRONTEND & TÍNH NĂNG HỆ THỐNG AI THIỀN ĐƯỜNG ÔNG LÃO

> **Phiên bản**: 3.5.0  
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
Soạn thảo, quản lý và biên tập các kịch bản đàm đạo chuyên nghiệp trước khi xuất phim.

### 🎨 Chi tiết Giao diện & Linh kiện UI:
* **Màn Hình Danh Sách Kịch Bản**:
  - Ô tìm kiếm kịch bản theo tiêu đề & ngày tạo.
  - **[3.2] Nút "Tạo Kịch Bản Mới"**: Mở form soạn kịch bản.
  - Nút 🗑️ **Xóa Kịch Bản**: Xóa kịch bản khỏi cơ sở dữ liệu.
* **Màn Hình Soạn & Chỉnh Sửa Kịch Bản**:
  - **[3.3] Nút "AI Đạo Diễn Soạn Kịch Bản"**: Nhờ Gemini AI viết kịch bản theo chủ đề.
  - **[3.4] Nút "Nhập Kịch Bản Từ File"**: Upload file văn bản `.txt` / `.json`.
  - **[3.7, 3.8, 3.9] Nút Chèn Thoại Lão / Con / Outro**: Chèn nhanh định dạng `Lão:`, `Con:`, `Outro:`.
  - **[3.5] Nút "Lưu Kịch Bản"**: Lưu nội dung kịch bản (Hỗ trợ phím tắt `Ctrl + S`).
  - **[3.10] Nút "🎥 Chuyển Sang Studio Dựng Video"**: Đưa kịch bản sang màn hình Video Studio (Giữ trạng thái URL `?modal=ai-director&childmodal=create-video`).

---

<a id="man-hinh-6-studio-dung-video--kho-canh-quay"></a>
## 6. MÀN HÌNH 6: STUDIO DỰNG VIDEO & KHO CẢNH QUAY (VideoCreatorModal.tsx)

### 📌 Mục đích:
Ghép nối video clips, ghép thoại MP3, nhép miệng tự động và xuất video MP4 sắc nét 60FPS.

### 🎨 Chi tiết Giao diện & Linh kiện UI:

#### A. Studio Dựng Video (VideoCreatorModal.tsx):
* **Tab 1: Cơ Bản**:
  - Chọn tỷ lệ màn hình: **Ngang 16:9 (Youtube)** hoặc **Dọc 9:16 (Tiktok/Reels)**.
  - Độ phân giải: **720p HD**, **1080p Full HD**, **4K**.
  - Hiệu ứng chuyển cảnh: *Cắt cứng, Dip to Black, Flash White, Spirit Glow*.
* **Tab 2: Thông Điệp & Phụ Đề**:
  - Tùy chỉnh kích thước font chữ, màu sắc phụ đề và vị trí Y trên màn hình.
  - Nhập tiêu đề Intro & nội dung Lời kết Outro.
* **Tab 3: Lịch Sử Render**:
  - Danh sách các video đã render thành công (Xem lại, Tải về, Xóa).
* **Màn Hình Preview Video Canvas**:
  - Xem trước tiến trình dựng video 60FPS thời gian thực.
  - Nút **Tải Video MP4** & Nút **Chia Sẻ Mạng Xã Hội**.

#### B. Kho Cảnh Quay Video & Phân Mục (Library Picker Modal):
* **Thanh Header & Nút Tải Clip**:
  - Nút **"Nạp Thêm Clip Mới"**: Upload file video từ máy tính vào IndexedDB.
* **Thanh Tiêu Đề Trung Tâm**:
  - **Nút "⚡ Chọn Tất Cả (N clip)"**: Chọn nhanh toàn bộ clip đang hiển thị vào danh sách chờ.
  - **Nút "🗑️ Bỏ Chọn (N clip)"**: Xóa danh sách chờ.
* **Cột Phân Mục Trái**:
  - Các phân mục mặc định: *Tất Cả Clip, Cảnh Lão Đàm Đạo, Cảnh Con Hỏi Đạo, Cảnh Outro*.
  - **Chuyên Mục Tùy Chỉnh**:
    + Nút ✏️ **Edit (Đổi tên chuyên mục)**: Mở Modal đổi tên chuyên mục (`z-[9999]`).
    + Nút 🗑️ **Trash (Xóa chuyên mục)**: Xóa chuyên mục trực tiếp không bật alert trình duyệt.
* **Card Video Clip (LibraryClipCard)**:
  - **Dấu Check 🟢 (Góc trên trái)**: Tích chọn / Bỏ chọn từng clip trực tiếp trên thumbnail.
  - Nút **"▶️ Xem thử"**: Phát video clip ngắn.
  - Nút **"+ Thêm" / "✔ Đã Chọn"**: Thêm clip vào hàng chờ dựng.

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
