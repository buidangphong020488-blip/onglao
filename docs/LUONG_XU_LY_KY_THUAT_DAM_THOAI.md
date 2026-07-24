# 🛠 KĨ THUẬT XỬ LÝ LUỒNG ĐÀM THOẠI, CHAT GIÁC NGỘ AI, TẠO KỊCH BẢN & DỰNG VIDEO PHÁP BẢO (TECHNICAL PIPELINE SPECIFICATION)

Tài liệu mô tả chi tiết toàn bộ kiến trúc kĩ thuật, quy trình xử lý dữ liệu và luồng âm thanh/hình ảnh khi hệ thống **Ông Lão** thực hiện:
1. **Luồng Đàm thoại trực tiếp (Live Conversation Step)**
2. **Mô-đun Chat Giác Ngộ AI & Sinh Nội Dung (GiacNgo Chat Engine & Content Generation)**
3. **Luồng Đạo diễn & Sáng tạo Kịch bản AI (AI Director Script Pipeline)**
4. **Luồng Dựng & Render Video Pháp Bảo Toàn Cảnh (FullFrame Video Creator Pipeline)**

---

## 📌 1. KIẾN TRÚC TỔNG QUAN HỆ THỐNG (SYSTEM ARCHITECTURE)

Hệ thống **Ông Lão** được tích hợp chặt chẽ với **Hệ sinh thái Giác Ngộ AI Backend** theo mô hình N-Tier:

```text
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│     ÔNG LÃO CLIENT      │  ──►  │ NEXT.JS API PROXY ROUTE │  ──►  │    GIÁC NGỘ CORE AI     │
│  React Canvas/Video UI  │       │  /api/giacngo/* Routes  │       │  https://giac.ngo/api  │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
            │                                 │                                 │
            ▼                                 ▼                                 ▼
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│  MÀO ĐẦU & KỆ PHÁP DB   │       │   GEMINI 2.5 FLASH TTS  │       │  POSTGRESQL DATABASE    │
│  Audio MP3 (Độ trễ 0s)  │       │   Synthesize WAV Voice  │       │  Sessions, Msgs, Clips  │
└─────────────────────────┘       └─────────────────────────┘       └─────────────────────────┘
```

Một lượt đàm thoại tiêu chuẩn gồm **3 thành phần âm thanh & văn bản** kết hợp nối tiếp nhau:

```text
┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
│  1. MÀO ĐẦU (GREETING) │  ──► │   2. KỆ PHÁP (STANZA)  │  ──► │  3. GIẢI ĐÁP (TTS AI)  │
│  Text + Pre-rendered   │      │  Text + Pre-rendered   │      │  Text AI + Gemini TTS  │
│  MP3 Audio (Có sẵn)    │      │  MP3 Audio (Có sẵn)    │      │  WAV Audio (Sinh ngầm) │
└────────────────────────┘      └────────────────────────┘      └────────────────────────┘
```

---

## 🤖 2. MÔ-ĐUN CHAT GIÁC NGỘ AI & SINH NỘI DUNG (GIACNGO CHAT ENGINE)

Mô-đun **GiacNgo Chat Engine** đảm nhận việc giao tiếp với trí tuệ nhân tạo để sinh câu trả lời triết lý, nội dung kịch bản và kiến thức Phật pháp.

### 2.1. Cấu Trúc API Routes Middleware (`/api/giacngo/*`)
Hệ thống Ông Lão sử dụng Next.js API Routes làm màng lọc bảo mật (Proxy Server-Side) tới server **GiacNgo Core**:

- `POST /api/giacngo/chat`: Gửi câu hỏi đàm thoại, nhận phản hồi dạng JSON hoàn chỉnh.
- `POST /api/giacngo/chat/stream`: Forward trực tiếp dòng dữ liệu dạng Server-Sent Events (SSE) để hiển thị chữ chạy thời gian thực trên giao diện.
- `GET /api/giacngo/public-ais`: Lấy danh sách nhân dạng AI agents có sẵn trên hệ thống.
- `GET /api/giacngo/library`: Kết nối kho tài liệu tri thức RAG Giác Ngộ.

### 2.2. Cơ Chế Xác Thực & Mã Service Token
- **Service Token (`GIACNGO_SERVICE_TOKEN`)**: Trường hợp người dùng chưa đăng nhập, hệ thống tự động sử dụng Token dịch vụ cấp quyền cao nhất của ứng dụng Ông Lão để gọi AI mà không làm gián đoạn trải nghiệm người dùng.
- **User JWT Bearer Token**: Khi người dùng đã đăng nhập, Token của người dùng sẽ được gửi qua Header `Authorization: Bearer <token>` để cá nhân hóa lịch sử trò chuyện và lưu vết trong `spaceId`.

### 2.3. Quy Trình Gọi AI Sinh Nội Dung (`giacNgoChat.sendJson`)
```typescript
const result = await giacNgoChat.sendJson(
  aiConfigId,     // ID cấu hình nhân dạng Ông Lão (VD: 1)
  message,        // Tin nhắn / Trăn trở của người dùng
  token,          // Authorization Token
  language,       // Tiếng Việt ('vi') hoặc Tiếng Anh ('en')
  userPersona,    // Thông tin nhân dạng người hỏi
  spaceId         // ID Không gian tri thức Giác Ngộ (VD: 1)
);
```

---

## ⚙️ 3. QUY TRÌNH THỰC THI CHI TIẾT 4 BƯỚC ĐÀM THOẠI

### BƯỚC 1: XỬ LÝ CÂU MÀO ĐẦU (OPENING PHRASE / GREETING)
1. **Phân loại Ngữ cảnh (Category Mapping)**:
   - Khi người dùng gửi tin nhắn, hệ thống NLP phân tích từ khóa để chọn nhóm mào đầu phù hợp:
     - `mundane_weather` (Thời tiết / Chuyện đời thường)
     - `serious_dharma` (Hỏi đạo nghiêm túc)
     - `love_heartbreak` (Tình cảm / Tổn thương)
     - `money_debt` (Tài chính / Nợ nần / Công danh)
2. **Trích xuất Dữ liệu Mào đầu**:
   - Truy vấn câu mào đầu từ DB PostgreSQL (`OpeningPhrase`):
     - `text`: Văn bản mào đầu (VD: *"A Di Đà Phật, lão chào con..."*).
     - `audioUrl`: Đường dẫn tệp âm thanh thu sẵn (VD: `/uploads/audio/greeting_mundane_weather_0.wav`).
3. **Phát Âm Thanh Mào Đầu**:
   - Hệ thống lập tức phát `audioUrl` mào đầu mà **KHÔNG CẦN CHỜ AI** sinh câu trả lời, giúp người dùng nghe giọng Lão ngay lập tức (độ trễ 0s).

---

### BƯỚC 2: TRÍCH XUẤT KỆ PHÁP / THƠ THIỀN (POEM STANZA & AUDIO)
1. **Truy vấn Kệ Pháp (RAG Knowledge Matching)**:
   - Tìm kiếm bài kệ pháp/khổ thơ liên quan nhất đến trăn trở của người dùng trong DB (`Poem` & `Stanza`).
2. **Trích xuất Dữ liệu Kệ**:
   - `text`: Nội dung khổ kệ thiền.
   - `audioUrl`: Đường dẫn âm thanh ngắt nhịp thơ thu sẵn (`stanza.audioUrl`).
3. **Nối Chuỗi Âm Thanh (Audio Queueing)**:
   - Thêm `stanza.audioUrl` vào danh sách chờ phát nối tiếp sau câu mào đầu.

---

### BƯỚC 3: AI GIẢI ĐÁP & SINH GIỌNG ĐỌC TTS (GEMINI AI & TTS SYNTHESIS)

Trong lúc 2 âm thanh mào đầu & kệ đang phát, hệ thống chạy **Worker ngầm (Background Prefetch)** để xử lý phần giải đáp:

1. **Sinh Văn Bản Giải Đáp Qua GiacNgo Engine**:
   - Gửi yêu cầu tới `/api/giacngo/chat` kèm ngữ cảnh cuộc trò chuyện.
   - AI trả về văn bản kèm nhãn cảm xúc ở đầu dòng (VD: `[vui] An lạc vốn dĩ ở trong tâm con...`).
2. **Làm Sạch Văn Bản Cho TTS (`cleanTextForTTS`)**:
   - Loại bỏ các ký tự đặc biệt, nhãn tag `[vui]`, `[buon]`.
   - Ngắt câu bằng dấu chấm câu để TTS đọc rõ ràng.
3. **Gọi API Tổng Hợp Giọng Nói (Gemini 2.5 Flash TTS)**:
   - Gửi yêu cầu HTTP POST tới `/api/tts`:
     ```json
     {
       "text": "Giọng ấm áp, dứt khoát: An lạc vốn dĩ ở trong tâm con...",
       "voiceName": "Algieba",
       "model": "gemini-2.5-flash-preview-tts"
     }
     ```
   - Server gửi yêu cầu tới Google Gemini REST API (`generateContent` với `responseModalities: ["AUDIO"]`).
   - Server trả về dữ liệu âm thanh Base64 WAV.
4. **Tạo Blob URL**:
   - Client nhận Base64, chuyển thành `Blob` và `URL.createObjectURL(blob)` làm `audioUrl` cho phần giải đáp.

---

### BƯỚC 4: GHÉP NỐI ÂM THANH & ĐIỀU KHIỂN LIP-SYNC (AUDIO STITCHING & VISUAL DRIVER)

1. **Chuỗi Phát Nối Tiếp (Sequential Playback Queue)**:
   ```javascript
   // Luồng phát nối tiếp 3 đoạn âm thanh
   const playChain = async () => {
       await playAudio(greetingAudioUrl); // Đoạn 1: Mào đầu
       await playAudio(stanzaAudioUrl);   // Đoạn 2: Kệ pháp
       await playAudio(ttsAudioUrl);      // Đoạn 3: TTS Giải đáp
   };
   ```
2. **Đồng Bộ Nhịp Môi (Lip-Sync Driver)**:
   - Phân tích tần số âm thanh bằng `Web Audio API` (`AudioContext` & `AnalyserNode`).
   - Cập nhật biến `mouthOpen` (từ 0.0 đến 1.0) theo thời gian thực để điều khiển khẩu hình miệng của nhân vật trên canvas/CSS.
3. **Chuyển Cảnh & Cảm Xúc (State & Visual Transition)**:
   - Đổi góc máy và trạng thái cảm xúc nhân vật (`calm`, `sad`, `joy`) tương ứng với nhãn cảm xúc bóc tách từ câu thoại.

---

## 📝 4. LUỒNG KĨ THUẬT TẠO KỊCH BẢN ĐẠO DIỄN (AI DIRECTOR SCRIPT PIPELINE)

```text
┌────────────────────────────────┐       ┌────────────────────────────────┐       ┌────────────────────────────────┐
│  GIÁC NGỘ AI PROMPT / NHẬP     │  ──►  │   BÓC TÁCH THOẠI & EMOTION     │  ──►  │  LƯU DB (ChatSession/Message)  │
│  Topic, Role, Emotion Arc      │       │   Con [buon], Lão [vui]        │       │  laoVoice, userVoice, emotion  │
└────────────────────────────────┘       └────────────────────────────────┘       └────────────────────────────────┘
```

### 4.1. Chế Độ 1: AI Tự Động Soạn Kịch Bản (AI Auto Generator)
1. **Tham Số Đầu Vào**:
   - `topic`: Chủ đề kịch bản (VD: *"Vượt qua áp lực công danh"*).
   - `length`: Số cặp câu thoại (VD: *"Khoảng 6-10 câu"*).
   - `laoStyle`: Phong cách giảng đạo của Lão (VD: *"Từ bi, ôn hòa, dắt dụ từng bước"*).
   - `userEmotionArc`: Mạch cảm xúc người hỏi (VD: *"Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng"*).
2. **Gọi GiacNgo Chat API & Prompt Engineering**:
   - Gửi yêu cầu tới `/api/giacngo/chat` kèm System Prompt quy định rõ cấu pháp output:
     ```text
     Con [buon]: Lão ơi, con thấy không vui chút nào cả.
     Lão [vui]: Cái "không vui" ấy, con thấy nó đến từ đâu?
     ```
3. **Lưu Phiên Kịch Bản Vào Database**:
   - Gọi Action `createChatSessionAction(userId, title, "script")` $\rightarrow$ Tạo bản ghi `ChatSession` với `type = "script"`.
   - Lưu cấu hình giọng riêng của phiên qua `updateChatSessionVoicesAction`:
     - `laoVoice`: `"Algieba"` | `laoVoiceStyle`: *"Giọng ấm áp, dứt khoát..."*
     - `userVoice`: `"Aoede"` | `userVoiceStyle`: *"Giọng thanh niên, thắc mắc..."*
   - Gọi `saveChatMessageAction` cho từng câu thoại kèm nhãn cảm xúc (`emotion: "buon"`, `emotion: "vui"`).

### 4.2. Chế Độ 2: Bóc Tách Kịch Bản Thủ Công (`parseToBlocks` & `handleImportScript`)
1. **Regex Phân Tách Dòng**:
   - Phân tích chuỗi văn bản đầu vào theo từng dòng thoại:
     - Dòng bắt đầu bằng `Con:`, `Hỏi:` $\rightarrow$ `role = "user"`
     - Dòng bắt đầu bằng `Lão:`, `Đáp:`, `AI:` $\rightarrow$ `role = "ai"`
2. **Khớp Mã Cảm Xúc Động Từ Database**:
   - Hàm `matchDbStateId` đối chiếu nhãn tag trong ngoặc vuông `[tag]` với API `/api/public/character-states`:
     - `[buon]` / `[sad]` $\rightarrow$ Mã ID cảm xúc `"buon"`
     - `[vui]` / `[joy]` $\rightarrow$ Mã ID cảm xúc `"vui"`
     - `[binhthuong]` / `[calm]` $\rightarrow$ Mã ID cảm xúc `"binhthuong"`
3. **Cập Nhật State & DB**:
   - Tạo danh sách `newMsgs` có cấu trúc `{ id, role, emotion, text }` và đồng bộ xuống PostgreSQL.

---

## 🎬 5. LUỒNG KĨ THUẬT DỰNG & RENDER VIDEO PHÁP BẢO (VIDEO CREATOR PIPELINE)

```text
┌────────────────────────────────┐       ┌────────────────────────────────┐       ┌────────────────────────────────┐
│  AUTO SCENES & CLIP MATCHING   │  ──►  │   SYNTHESIZE AUDIO & BGM MIX   │  ──►  │ CANVAS / FFMPEG VIDEO RENDER   │
│  Role & Emotion State Match    │       │   Algieba + Aoede + BGM 20%    │       │ 1080p MP4 (9:16 / 16:9)        │
└────────────────────────────────┘       └────────────────────────────────┘       └────────────────────────────────┘
```

### 5.1. Giai Đoạn 1: Tự Động Khớp Cảnh Quay & Video Clip (`autoScenes`)
1. **Tạo Danh Sách Cảnh (`ffScenes`) Từ Kịch Bản**:
   - Mỗi câu thoại `ChatMessage` được chuyển đổi thành 1 Thẻ Cảnh Quay (`Scene Card`):
     - `targetRole`: `"lao"` (nếu role thoại là `ai`/`ASSISTANT`), `"user"` (nếu role thoại là `user`), hoặc `"outro"`.
     - `finalEmotion`: Mã cảm xúc bóc tách từ thoại (`buon`, `vui`, `binhthuong`).
2. **Thuật Toán Khớp Clip Tự Động (Bilingual Role & Emotion Matcher)**:
   - Hệ thống lọc qua kho clip trong `FULLFRAME_PACKS` và `localFfClips`:
     - **Bước 1**: Tìm clip trùng khớp cả Vai lẫn Cảm xúc (`isRoleMatch(c.role, targetRole) && isEmoMatch(c.emotion, finalEmotion)`).
     - **Bước 2**: Tìm clip trùng khớp Vai (`isRoleMatch(c.role, targetRole)`).
     - **Bước 3**: Tìm clip theo từ khóa tên file (tên có chứa `lao`/`ai` cho Lão; chứa `con`/`user` cho Con).
     - **Bước 4**: Fallback nạp theo thứ tự mảng cùng vai.
3. **Kiểm Tra & Loại Bỏ Xung Đột Góc Máy (Role Conflict Safeguard)**:
   - Nếu cảnh mang vai `"user"` (Máy quay Con) nhưng clip mang tên chứa `lao` $\rightarrow$ Tự động xóa bỏ URL lệch góc máy, trả về khung chờ clip chuẩn cho Con.

### 5.2. Giai Đoạn 2: Tổng Hợp Âm Thanh & Nhạc Nền (Multi-Speaker TTS & BGM Mixing)
1. **Kiểm Tra & Tạo Âm Thanh Thiếu**:
   - Hệ thống quét danh sách cảnh thoại. Nếu câu thoại nào chưa có `audioUrl`, tự động gọi `generateVoice()` với đúng `voiceName` và `voiceStyle` cấu hình của kịch bản.
2. **Hòa Âm Nhạc Nền (BGM Mixing)**:
   - Nạp file âm thanh nhạc nền BGM (`bgmAudioData`).
   - Thiết lập âm lượng nhạc nền qua `AudioNode.gain.value` (mặc định `0.15 - 0.25`) để nhạc chạy ngầm dưới giọng đọc thoại.

### 5.3. Giai Đoạn 3: Render & Xuất File Video MP4 (Canvas Composite & FFmpeg / MediaRecorder)
1. **Compositing Trên Offscreen Canvas**:
   - Vẽ video clip nền tương ứng với tỷ lệ `9:16` (1080x1920) hoặc `16:9` (1920x1080).
   - Đè lớp Phụ đề mẫu (Subtitle Overlays) ngắt câu chuẩn.
   - Vẽ Logo watermark Pháp bảo ở góc màn hình.
2. **Ghi Hình & Xuất File**:
   - **Phương án 1**: Dùng `MediaRecorder` ghi trực tiếp luồng Canvas Stream + Audio Stream thành file Blob MP4/WebM.
   - **Phương án 2**: Gửi yêu cầu HTTP POST tới `/api/export-video-ffmpeg` để server dùng FFmpeg render chất lượng cao.
3. **Lưu Lịch Sử Render**:
   - Lưu file video vào `/public/exports/` và ghi bản ghi vào DB PostgreSQL bảng `RenderHistory`.

---

## 📊 6. SƠ ĐỒ LUỒNG DỮ LIỆU TỔNG THỂ (MERMAID SEQUENCE DIAGRAM)

```mermaid
sequenceDiagram
    autonumber
    actor User as Người dùng
    participant UI as Giao diện Client
    participant Proxy as Next.js API Proxy (/api/giacngo)
    participant Core as GiacNgo Core AI Backend
    participant DB as PostgreSQL DB
    participant TTS as Gemini 2.5 Flash TTS

    User->>UI: 1. Nhập câu hỏi đàm thoại / Tạo kịch bản AI
    UI->>Proxy: POST /api/giacngo/chat (kèm aiConfigId & spaceId)
    Proxy->>Core: POST /api/v1/chat (Forward request với Bearer Token)
    Core-->>Proxy: Trả về Nội dung phản hồi + Emotion Tags
    Proxy-->>UI: Forward JSON Response
    UI->>DB: Lưu ChatSession (laoVoice, userVoice) & ChatMessage (emotion)
    
    User->>UI: 2. Nhấn nút "Tạo Video" (Mở VideoCreatorModal)
    UI->>UI: autoScenes đối chiếu Role & Emotion với Kho Clip
    UI->>UI: Khớp clip "con_buon.mp4" cho Con, "lao_vui.mp4" cho Lão
    
    User->>UI: 3. Nhấn nút "Bắt Đầu Render"
    UI->>Proxy: Gọi TTS cho các thoại thiếu (Algieba cho Lão, Aoede cho Con)
    Proxy->>TTS: Request Audio (POST /api/tts với voiceConfig từng vai)
    TTS-->>Proxy: Base64 Audio Content
    Proxy-->>UI: Audio WAV Blobs
    
    UI->>UI: Composite Video Clip + Audio + Subtitle + Logo trên Canvas
    UI->>Proxy: Gửi Stream xuất MP4 (hoặc MediaRecorder local)
    Proxy-->>UI: Trả về File Video MP4 1080p
    UI-->>User: Tải Video thành công & Lưu Lịch Sử
```

---

## 🗄️ 7. BẢNG DỮ LIỆU THAM CHIẾU (DATABASE SCHEMAS)

- **`OpeningPhrase`**: `id`, `text`, `audioUrl`, `category`, `tags`.
- **`Stanza`**: `id`, `poemId`, `content`, `meaning`, `audioUrl`.
- **`ChatSession`**: `id`, `title`, `type` (`script`), `laoVoice`, `laoVoiceStyle`, `userVoice`, `userVoiceStyle`.
- **`ChatMessage`**: `id`, `sessionId`, `role` (`USER`/`ASSISTANT`), `content`, `emotion`, `audioUrl`.
- **`CanhQuay`**: `id`, `name`, `assetsNgang`, `assetsDoc`.
- **`RenderHistory`**: `id`, `title`, `videoUrl`, `aspectRatio`, `resolution`.

---

*Tài liệu kĩ thuật được lưu trữ và cập nhật tại `docs/LUONG_XU_LY_KY_THUAT_DAM_THOAI.md`.*
