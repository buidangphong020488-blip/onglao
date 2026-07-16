# Tài Liệu Hướng Dẫn Kiểm Thử (Test Guide) — Ông Lão AI

> **Phiên bản tài liệu này được viết dựa trên code thực tế** của `onglao-platform.tsx`, `AuthModal.tsx`, `RagSection.tsx`, và các API route. Mọi tên nút bấm, selector, và luồng đều khớp 100% với code hiện tại.

---

## 1. Thông Tin Tài Khoản Kiểm Thử

| Vai trò | Tài khoản | Mật khẩu |
|---|---|---|
| **User SSO** | `demo@giac.ngo` | `password` |

---

## 2. Chuẩn Bị Trước Khi Test

```bash
# Tại thư mục dự án:
npm run dev
```

Mở Chrome, truy cập: **http://localhost:3013**

---

## 3. Kiểm Thử Từng Tính Năng

### ✅ TEST 1: Màn Hình Chào — Đăng nhập GiacNgo SSO

1. Truy cập **http://localhost:3013**
2. Màn hình chào hiển thị → nhập thông tin profile (tên, giới tính, tuổi)
3. Click nút **"Đăng nhập"** (nút ở góc phải màn hình chào) → `AuthModal` hiện ra
4. Kiểm tra `AuthModal`:
   - Tiêu đề: **"Đăng nhập Ông Lão"**, subtitle: *"Dùng tài khoản GiacNgo để đăng nhập"*
   - Nhập `email@giac.ngo` và mật khẩu
   - Có nút **Show/Hide password** (icon Eye/EyeOff)
   - Link **"Đăng ký tại GiacNgo"** → mở `https://giac.ngo` tab mới
5. Đăng nhập thành công → modal đóng, tên người dùng hiển thị
6. Nếu là lần đầu (chưa lưu profile): giữ ở màn hình chào để hoàn thành profile
7. Sau khi nhập profile xong → click **"Vào thiền đường"** để vào app

> **Kiểm tra bảo mật:** Mở F12 → Network tab → đăng nhập → chỉ thấy request tới `/api/giacngo/auth` (proxy), **không bao giờ thấy Gemini API Key** lộ ra client.

---

### ✅ TEST 2: Chat & TTS — Thưa hỏi Lão

1. Sau khi vào thiền đường (giao diện chính), gõ câu hỏi vào ô:
   - **Placeholder:** `"Con muốn thưa thỉnh..."`
   - Ô input nằm trong `div[data-tutorial="tut-input"]`
2. Gửi tin nhắn bằng **Enter** hoặc click icon **Send** (mũi tên)
3. Kiểm tra luồng proxy:
   - F12 → Network tab → request gửi tới **`/api/giacngo/chat`** (chat AI)
   - Phản hồi TTS gửi tới **`/api/tts`** (giọng đọc)
   - **Không có request nào trực tiếp tới `generativelanguage.googleapis.com`**
4. Xác nhận:
   - Lão trả lời xuất hiện trong chat
   - **TTS phát giọng đọc tự động** sau khi Lão hoàn tất câu trả lời
   - Nút **Volume** (icon Volume1/VolumeX ở góc phải input bar) bật/tắt TTS

#### Kiểm tra nút bổ sung trên thanh input:
| Nút | Chức năng |
|---|---|
| 🎙️ Mic (lớn, tròn, bên trái) | Click để ghi âm giọng nói, `data-tutorial="tut-mic"` |
| 📷 Camera | Bật/tắt tầm nhìn qua camera |
| 🖼️ Image icon | Gửi ảnh từ máy tính |
| ✨ Sparkles (trong input) | Tinh lọc cốt lõi câu hỏi (Refine) |
| 🔊 Volume | Bật/tắt TTS |

---

### ✅ TEST 3: Kiểm tra Greeting AI thông minh

1. Gửi các câu hỏi theo từng chủ đề, xác nhận Lão mở đầu đúng phong cách:
   - **Hỏi sức khỏe** (`"Lão khỏe không?"`) → greeting nhóm `health_daily`
   - **Thất tình** (`"Con thất tình rồi Lão ơi"`) → greeting nhóm `love_heartbreak`
   - **Tiền nợ** (`"Con đang nợ nhiều tiền"`) → greeting nhóm `money_debt`
   - **Đạo lý** (`"Tánh phật là gì?"`) → greeting nhóm `serious_dharma`
2. Để idle > 2 phút rồi gửi tin → greeting nhóm `waiting_long` (Lão phàn nàn chờ lâu)

---

### ✅ TEST 4: Kho Tàng Pháp Bảo (Modal)

1. Click nút **"Kho Tàng Pháp Bảo"** *(icon BookOpen)* trên giao diện
2. Modal mở ra với **3 tab**:

   | Tab | Nội dung |
   |---|---|
   | **Kho Kệ Pháp** | Danh sách bài kệ pháp load từ PostgreSQL |
   | **Mào Đầu (Tiếp đón)** | Các câu mở đầu theo chủ đề |
   | **Kho Trí Tuệ (Huấn luyện)** | RAG — Training data từ GiacNgo |

3. **Tab "Kho Trí Tuệ (Huấn luyện)":**
   - Click **"Tải lại từ GiacNgo"** (nút indigo, có icon refresh)
   - Kiểm tra F12 → Network → request tới `/api/giacngo/ai-configs`
   - Xác nhận dữ liệu hiển thị dưới dạng thẻ danh sách với badge `Nguồn: ...`
   - Thanh tìm kiếm hoạt động: gõ từ khóa → lọc real-time
   - Badge góc phải: `AI Config #[số]` hiển thị đúng config đang chọn

---

### ✅ TEST 5: Pháp Bảo Khai Thị (Sidebar Lịch sử)

1. Click icon **Lịch sử / MessageSquare** → sidebar "Pháp bảo khai thị" trượt ra
2. Kiểm tra các nút trong sidebar:
   - **"Tạo toàn bộ âm thanh còn thiếu"** (highlight emerald khi có tin chưa có audio)
   - **"✨ Đúc kết kệ pháp"** → AI tóm tắt cuộc đàm đạo
   - **"Tạo video"** → mở modal video export
   - **"Phát toàn bộ đàm đạo"** → Play/Pause + thanh progress
   - **"Tải MP3"** → dropdown: *"Từng đoạn rời rạc"* | *"Gộp 1 file chung"*
   - **"Chia sẻ"** → dropdown share options

---

### ✅ TEST 6: Bộ Điều Chỉnh Nhân Vật Lão

Trên giao diện chính, phần Lão hiển thị có các nút điều chỉnh:

| Nút | Chức năng |
|---|---|
| ✨ Sparkles | Bật/tắt hào quang (Lão Aura) |
| 🔄 FlipHorizontal | Lật hướng nhìn của Lão |
| ⚙️ Sliders | Mở bảng kéo thanh điều chỉnh vị trí Lão (X/Y/Scale) |
| ↩️ RotateCcw | Reset vị trí Lão về giữa |

Kiểm tra bảng kéo thanh: kéo X (Ngang), Y (Dọc), Thu phóng → Lão di chuyển tương ứng trực quan.

---

### ✅ TEST 7: Đạo Diễn AI — Tạo Kịch Bản Tự Động

1. Click nút **"Đạo Diễn AI"** *(icon Sparkles + Wand2)* trên UI
2. Modal **"Đạo Diễn AI (Tối ưu đàm đạo)"** mở ra
3. Điền thông tin:
   - **Ngôn ngữ kịch bản**: Tiếng Việt / English / ...
   - **Cài đặt Lão**: Tên, tự xưng, gọi người kia, giọng đọc, phong cách
   - **Cài đặt Con**: Tên, tự xưng, gọi Lão, giọng đọc, phong cách
   - **Chủ đề vướng mắc**: nhập nỗi khổ/câu hỏi
   - **Độ dài**: 4-6 câu → 15-21 câu
   - **Phong cách Lão**: Sắc bén / Từ bi / Hài hước
   - **Hành trình cảm xúc**: Đau khổ → An lạc / Tức giận → Phản tỉnh / ...
4. Click **"Tạo đàm đạo"** → spinner "Đang viết kịch bản..."
5. Xác nhận kịch bản được tạo ra và import vào chat

---

### ✅ TEST 8: Nhập Kịch Bản Thủ Công (Text-to-Video)

1. Click nút **"Nhập kịch bản"** *(icon FileText)*
2. Modal **"Nhập kịch bản (Text-to-Video)"** mở ra
3. Chọn chế độ:
   - **Tạo cuộc đàm đạo mới**
   - **Thêm vào đàm đạo hiện tại**
4. Dán kịch bản theo định dạng:
   ```
   Con: Lão ơi, sao cõi đời này nhiều phiền não đến thế?
   Lão: Phiền não vốn do tâm bám víu mà sinh ra...
   ```
5. Click **"Xác nhận & Nhập"** → tin nhắn xuất hiện trong chat

---

### ✅ TEST 9: Chế Độ Live Stream / OBS

1. Kích hoạt **chế độ Live Stream** qua nút tương ứng trên UI
2. Kiểm tra:
   - **Nhạc nền (BGM)**: danh sách mặc định BGM
   - **Ngắt mạch nhạc tự động**: khi Lão bắt đầu nói → nhạc nền tự fade/pause
   - **Video nhân vật**: chuyển trạng thái Idle ↔ Talking mượt mà theo sóng âm
   - **Phụ đề Live**: bật/tắt, kiểm tra vị trí và kích thước có thể điều chỉnh
   - **Hàng đợi câu hỏi khán giả**: `liveQueue` hiển thị số lượng chờ
   - **Bộ đếm idle 30s**: khi không có câu hỏi → phát video chờ (nếu đã cấu hình)

---

### ✅ TEST 10: Freemium & Thanh Toán

1. Đảm bảo `localStorage.removeItem('onglao_subscribed')` (xóa để test giới hạn)
2. Gửi đủ số lượng câu hỏi theo `freeLimit` (mặc định 20)
3. Xác nhận modal thanh toán xuất hiện với thông tin:
   - **MoMo** (số điện thoại + tên)
   - **Ngân hàng** (tên ngân hàng + số tài khoản)
   - **QR Code** (link ảnh)
4. Nhập mã kích hoạt đúng → Toast: *"Kích hoạt bản quyền thành công! Con đã có thể thưa thỉnh không giới hạn."*
5. Kiểm tra `localStorage.getItem('onglao_subscribed')` = `"true"`

---

### ✅ TEST 11: Bộ đếm Tĩnh Tâm (Idle Timer)

- Phía trên thanh input luôn hiển thị bộ đếm: **"Thời gian tĩnh tâm: MM:SS"** (màu emerald)
- Khi idle không gửi tin → timer tăng dần
- Khi gửi tin → timer reset về 00:00
- Khi idle > 2 phút và gửi tin → Lão dùng greeting nhóm `waiting_long`

---

### ✅ TEST 12: Tutorial Tour (Lần đầu dùng)

- **Xóa** `localStorage.removeItem('onglao_profile_completed_guest')` để reset
- Load lại trang → màn hình chào hiện ra yêu cầu điền profile
- Sau khi điền và click **"Vào thiền đường"** → tutorial tour có thể chạy theo `TUTORIAL_STEPS`

---

## 4. Kiểm Thử Nhanh bằng Puppeteer (Tự Động)

Script `scripts/live_test.js` test tự động các luồng sau:
1. Truy cập Trang chủ
2. Click "Đăng nhập" → AuthModal → nhập email/password demo
3. Click "Vào thiền đường"
4. Gõ câu hỏi vào `input[placeholder="Con muốn thưa thỉnh..."]`
5. Click Send → chờ 20 giây nghe TTS phát giọng

```bash
# Chạy script test tự động (cần puppeteer cài sẵn):
node scripts/live_test.js
```

> **Lưu ý:** Script đã cấu hình sẵn `demo@giac.ngo / password`.

---

## 5. Checklist Tổng Hợp

| # | Tính năng | Trạng thái |
|---|---|---|
| 1 | GiacNgo SSO login qua AuthModal | ☐ |
| 2 | Chat gửi tin → AI trả lời | ☐ |
| 3 | TTS phát giọng tự động | ☐ |
| 4 | Proxy bảo mật (không lộ API Key) | ☐ |
| 5 | Greeting AI theo chủ đề | ☐ |
| 6 | Modal Kho Tàng Pháp Bảo (3 tab) | ☐ |
| 7 | RAG → Tải lại từ GiacNgo | ☐ |
| 8 | Sidebar Pháp Bảo Khai Thị | ☐ |
| 9 | Điều chỉnh vị trí nhân vật Lão | ☐ |
| 10 | Đạo Diễn AI tạo kịch bản | ☐ |
| 11 | Nhập kịch bản thủ công | ☐ |
| 12 | Live Stream / OBS mode | ☐ |
| 13 | Freemium & mã kích hoạt | ☐ |
| 14 | Bộ đếm tĩnh tâm | ☐ |

## 6. Hướng Dẫn Kiểm Thử Bằng Chrome (Cổng 9952)

Để thực hiện test tự động (Automated UI Testing) thông qua trình duyệt Chrome đang hiển thị trên màn hình của bạn, chúng ta sẽ sử dụng Puppeteer kết nối qua cổng Remote Debugging `9952`.

### Bước 1: Mở Chrome với chế độ Remote Debugging
Bạn phải đảm bảo rằng đã đóng **tất cả** các cửa sổ Chrome hiện tại. Sau đó, mở một Terminal (hoặc CMD/PowerShell) và chạy lệnh sau để khởi động Chrome:

```powershell
# Đối với Windows:
& "C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9952 --user-data-dir="C:\chrome-debug-profile"
```

Lệnh này sẽ mở một cửa sổ Chrome hoàn toàn mới, sẵn sàng cho phép script Puppeteer điều khiển.

### Bước 2: Chạy Script Kiểm Thử
Tôi đã tạo sẵn một script kiểm thử tự động tại `scripts/chrome_test_suite.js`.
Script này sẽ:
1. Kết nối vào Chrome của bạn qua cổng `9952`.
2. Mở tab mới truy cập `http://localhost:3013`.
3. Kiểm tra xem Hình Tướng (Lão Hoa) đã load thành công từ DB chưa.
4. Mở Popup "Viết Kịch Bản" và thử thao tác "Đạo diễn AI".

Chạy lệnh sau để bắt đầu test:
```bash
node scripts/chrome_test_suite.js
```

---
*Lưu ý: Nếu bị lỗi `ECONNREFUSED 127.0.0.1:9952`, tức là bạn chưa chạy Chrome đúng cách với cờ `--remote-debugging-port=9952` hoặc đường dẫn Chrome không chính xác.*
