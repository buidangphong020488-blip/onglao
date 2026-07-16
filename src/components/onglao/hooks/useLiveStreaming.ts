// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { 
  db, 
  appId, 
  idb, 
  doc, 
  getDoc, 
  setDoc,
  collection,
  onSnapshot,
  DEFAULT_BGM_LIST
} from '../constants';
import { fetchWithRetry, cleanTextForTTS } from '../utils';

export const useLiveStreaming = ({
  user,
  messages,
  updateCurrentMessages,
  isMuted,
  isVoiceEnabled,
  laoVoiceRef,
  laoVoiceStyleRef,
  userVoiceRef,
  userVoiceStyleRef,
  laoSelfCallRef,
  laoCallUserRef,
  userSelfCallRef,
  userCallLaoRef,
  userName,
  userGender,
  userAge,
  appLanguage,
  selectedAiConfigIdRef,
  geminiApiKeyRef,
  showToastMsg,
  searchTrainedDatabase,
  smartLocalSemanticRouter,
  generateVoice,
  processAiResponse,
  activeAudioRef,
  audioQueueRef,
  isPlayingQueueRef,
  currentlyPlayingId,
  setCurrentlyPlayingId,
  isThinkingRef,
  currentlyPlayingIdRef,
  allCharacters,
  applyCharacterPreset,
  handleChangeChatLao,
  charOffsets,
  setCharOffsets,
  setChatLaoVideos,
  publicAis
}: any) => {

    const [isLiveMode, setIsLiveMode] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false); // TÂM AN THÊM: Quản lý việc Đã chính thức bật Live chưa
  const [showLiveSettings, setShowLiveSettings] = useState(true); // TÂM AN THÊM: Quản lý ẩn/hiện bảng cài đặt
  const isLiveActiveRef = useRef(isLiveActive); // TÂM AN FIX: Thêm Ref chống lỗi biến cũ cho bộ đếm 30s
  useEffect(() => { isLiveActiveRef.current = isLiveActive; }, [isLiveActive]);

  const [liveBgFilter, setLiveBgFilter] = useState('all'); // TÂM AN THÊM: Bộ lọc bối cảnh cho chế độ Live
  const [laoIsFullScreen, setLaoIsFullScreen] = useState(false); // TÂM AN THÊM: Chế độ Video Lão phủ kín màn hình
  const liveQueueRef = useRef<any[]>([]); // Hàng đợi câu hỏi từ khán giả
  const isLiveProcessingRef = useRef(false); // Cờ đánh dấu Lão có đang trả lời không
  const liveMovieToPlayRef = useRef(null); // TÂM AN THÊM: Lưu tên phim AI yêu cầu phát
  const [liveCurrentQuestion, setLiveCurrentQuestion] = useState<any>(null); // TÂM AN THÊM: Hiển thị câu hỏi đang trả lời trên OBS
  const [liveQueueLength, setLiveQueueLength] = useState(0); // TÂM AN THÊM: Quản lý số lượng tin nhắn chờ trên UI
  const [liveCommentBox, setLiveCommentBox] = useState({ x: -22, y: -13, w: 500, s: 1.0 }); // TÂM AN THÊM: Quản lý tọa độ, độ rộng khung bình luận
  const [liveMicBoxY, setLiveMicBoxY] = useState(0); // TÂM AN FIX: Quản lý vị trí dọc của bảng trạng thái Mic (Mặc định 0 vh)
  const [liveShowSubtitles, setLiveShowSubtitles] = useState(true); // TÂM AN THÊM: Bật/tắt phụ đề khi Lão nói
  const [liveSubPos, setLiveSubPos] = useState({ x: 0, y: 3, w: 35, s: 1.4, outline: 1.5, shadow: 15 }); // TÂM AN FIX: Bổ sung tọa độ Ngang (x) và Độ rộng khung (w) cho Phụ đề Live

  // TÂM AN THÊM: Quản lý Phím tắt và Nút Bỏ qua (Skip)
  const [skipShortcutModifier, setSkipShortcutModifier] = useState('Shift'); // 'Shift', 'Ctrl', 'Alt', 'None'
  const [skipShortcutKey, setSkipShortcutKey] = useState('Enter');
  const skipShortcutModifierRef = useRef(skipShortcutModifier);
  const skipShortcutKeyRef = useRef(skipShortcutKey);
  useEffect(() => { skipShortcutModifierRef.current = skipShortcutModifier; }, [skipShortcutModifier]);
  useEffect(() => { skipShortcutKeyRef.current = skipShortcutKey; }, [skipShortcutKey]);

  // TÂM AN THÊM: Quản lý Lịch sử Livestream
  const [showLiveHistory, setShowLiveHistory] = useState(false);

  // TÂM AN THÊM: Ref mốc thời gian để chỉ lấy comment mới khi bật Live
  const liveStartTimeRef = useRef(Date.now());

  // TÂM AN FIX: Các Ref phục vụ luồng đồng bộ Phụ đề tốc độ cao (60fps) không gây lag React
  const liveShowSubtitlesRef = useRef(liveShowSubtitles);
  const isLiveModeRef = useRef(isLiveMode);
  const liveSubtitlesMetaRef = useRef<any>(null);
  const currentLiveSubTextRef = useRef<any>('');

  useEffect(() => { liveShowSubtitlesRef.current = liveShowSubtitles; }, [liveShowSubtitles]);
  useEffect(() => { isLiveModeRef.current = isLiveMode; }, [isLiveMode]);

  // TÂM AN THÊM MỚI: Quản lý chức năng Lắng nghe giọng Khách Mời (Voice)
  const [isLiveGuestMicActive, setIsLiveGuestMicActive] = useState(false);
  const liveGuestMicRef = useRef(false);
  const guestRecognitionRef = useRef(null);
  const isGuestMicListeningRef = useRef(false); // Cờ theo dõi trạng thái Mic đang bật hay tắt vật lý
  
  // TÂM AN THÊM: Quản lý trạng thái giao diện UI của Mic (Xanh/Đỏ)
  const [guestMicStatus, setGuestMicStatus] = useState('off'); // 'off', 'listening', 'busy'
  const guestMicStatusRef = useRef(guestMicStatus);
  
  useEffect(() => { liveGuestMicRef.current = isLiveGuestMicActive; }, [isLiveGuestMicActive]);
  useEffect(() => { guestMicStatusRef.current = guestMicStatus; }, [guestMicStatus]);

  // TÂM AN THÊM MỚI: Quản lý trí nhớ cá nhân & Trạng thái phát phim đặc biệt
  const liveUserHistoryRef = useRef(new Map()); // Lưu lịch sử { "username": ["Con:...", "Lão:..."] }
  const currentLiveStoryRef = useRef({ isPlaying: false, username: null }); // Xác định xem phim CÂU CHUYỆN đang chiếu cho AI
  
  // TÂM AN THÊM: Ref lưu trữ câu trả lời tạo ngầm trong lúc chiếu phim
  const preloadedMovieResponseRef = useRef<any>(null);

  // TÂM AN FIX: Thêm Ref khóa thời điểm Lão vừa nói xong để làm mốc chặn Vang nhại (Echo)
  const lastLaoSpeakEndTimeRef = useRef(0);

  // TÂM AN THÊM: Quản lý Video Phim Phát Chờ khi không có ai hỏi (Sau 30s)
  const [liveIdleVideos, setLiveIdleVideos] = useState<any[]>([]);
  const [isLiveIdlePlaying, setIsLiveIdlePlaying] = useState(false);
  const isLiveIdlePlayingRef = useRef(isLiveIdlePlaying); // TÂM AN FIX: Thêm Ref để theo dõi trạng thái Phim đang phát cho hàm Mic chạy ngầm
  const [isIdleVideoPaused, setIsIdleVideoPaused] = useState(false); // Quản lý nút Play/Pause
  const [currentLiveIdleVideoIndex, setCurrentLiveIdleVideoIndex] = useState(0);
  const [idleVideoProgress, setIdleVideoProgress] = useState(0);
  const [idleVideoCurrentTime, setIdleVideoCurrentTime] = useState(0);
  const [liveIdleTimeout, setLiveIdleTimeout] = useState(30); // Tùy chỉnh thời gian chờ (giây)
  const [showLaoPiP, setShowLaoPiP] = useState(true); // TÂM AN THÊM: Quản lý bật/tắt Lão ở góc phải dưới khi chiếu phim
  
  // TÂM AN THÊM: State quản lý Form nhập YouTube
  const [showYtForm, setShowYtForm] = useState(false);
  const [ytFormData, setYtFormData] = useState({ url: '', name: '', topic: '' });
  
  const liveIdleVideosRef = useRef(liveIdleVideos);
  const liveIdleTimeoutRef = useRef(liveIdleTimeout);
  const liveIdlePlayerRef = useRef<any>(null); // Ref gắn vào thẻ video phim chờ
  const liveIdleYtPlayerRef = useRef<any>(null); // TÂM AN THÊM: Ref điều khiển trình phát Youtube

  useEffect(() => { liveIdleVideosRef.current = liveIdleVideos; }, [liveIdleVideos]);
  useEffect(() => { liveIdleTimeoutRef.current = liveIdleTimeout; }, [liveIdleTimeout]);
  useEffect(() => { isLiveIdlePlayingRef.current = isLiveIdlePlaying; }, [isLiveIdlePlaying]); // TÂM AN FIX: Cập nhật Ref liên tục

  const liveBgmAudioRef = useRef<HTMLAudioElement | null>(null);
  const liveBgmResumeTimerRef = useRef<any>(null);

  const handleUploadLiveLaoFolder = (e: any) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      let idleUrl = null;
      let talkingUrl = null;

      files.forEach((file: any) => {
          const name = file.name.toLowerCase();
          const url = URL.createObjectURL(file);
          if (name.includes('idle') || name.includes('nghe') || name.includes('im') || name.includes('silent')) {
              idleUrl = url;
          } else if (name.includes('talking') || name.includes('noi') || name.includes('speak') || name.includes('chat')) {
              talkingUrl = url;
          }
      });

      if (idleUrl || talkingUrl) {
          setChatLaoVideos((prev: any) => ({
              ...prev,
              ...(idleUrl ? { idle: idleUrl } : {}),
              ...(talkingUrl ? { talking: talkingUrl } : {})
          }));
          showToastMsg("Đã cập nhật video Lão từ máy tính!", "success");
      } else {
          showToastMsg("Không tìm thấy file video phù hợp (quy tắc đặt tên: nghe/noi/idle/talking).", "error");
      }
  };

  const showLiveUploadGuide = () => {
      showToastMsg(
          "Quy tắc đặt tên video Live:\n- Video im lặng: 'nghe.mp4', 'idle.mp4' hoặc 'silent.mp4'\n- Video nói: 'noi.mp4', 'talking.mp4' hoặc 'speak.mp4'",
          "info",
          8000
      );
  };

  // --- TÂM AN THÊM: Quản lý danh sách AI public từ GiacNgo và AI được chọn ---

  // Refs are defined inside liveFunctions

    // --- Hàm Hỗ Trợ: Khởi động lại Bộ đếm thời gian chờ (Idle Timer) ---
  const startLiveIdleTimer = () => {
      if (liveBgmResumeTimerRef.current) {
          clearTimeout(liveBgmResumeTimerRef.current);
      }
      liveBgmResumeTimerRef.current = setTimeout(() => {
          // TÂM AN FIX TỐI THƯỢNG: Dùng isLiveActiveRef.current thay vì isLiveActive để không bị kẹt giá trị cũ
          if (isLiveActiveRef.current && liveQueueRef.current.length === 0 && !currentLiveStoryRef.current.isPlaying) {
              if (liveIdleVideosRef.current.length > 0) {
                  // CÓ PHIM CHỜ -> Bật Phim, Tắt Nhạc Nền
                  if (liveBgmAudioRef.current && !liveBgmAudioRef.current.paused) {
                      liveBgmAudioRef.current.pause();
                  }
                  setIsLiveIdlePlaying(true);
              } else {
                  // KHÔNG CÓ PHIM CHỜ -> Phát lại nhạc nền như bình thường
                  if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                      liveBgmAudioRef.current.play().catch((e: any) => console.warn("Lỗi phát lại nhạc nền Live:", e));
                  }
              }
          }
      }, liveIdleTimeoutRef.current * 1000); // Áp dụng số giây tùy chỉnh
  };

  // --- Bước 2: Kết nối Websocket lấy comment livestream ---
  const processLiveQueueRef = useRef<any>(null);
  
  // TÂM AN THÊM: Hàm chạy ngầm để chuẩn bị sẵn câu tự vấn và giọng đọc trong lúc phim đang chiếu
  const preloadPostMovieResponse = async (username: any) => {
      try {
          console.log(`🧠 [Preload] Đang suy nghĩ câu chốt ngầm cho khán giả ${username} trong lúc phim chiếu...`);
          
          // 1. Tạo câu thoại
          const prompt = `Bạn là Lão, một bậc minh sư đang khai thị. Người hỏi (tên là "${username}") vừa xem xong một thước phim/câu chuyện nhân quả, tâm linh do Lão mở cho xem.
          Hãy đúc kết bài học và đặt câu hỏi tự vấn.
          
          YÊU CẦU BẮT BUỘC:
          - Ngôn ngữ: ${appLanguage}
          - Bắt đầu bằng thẻ cảm xúc [calm], [joy] hoặc [sad].
          - XƯNG HÔ: Xưng "Lão", gọi đối phương là "con" (hoặc dùng tên nếu tên đó tự nhiên). TUYỆT ĐỐI CẤM dùng các từ khách sáo, sáo rỗng như "Thưa khách mời", "Chào bạn", "Khách mời ơi". Hãy đi thẳng vào vấn đề!
          - NỘI DUNG: 
            1. Giảng giải, đúc kết lại vấn đề/mộng ảo vừa được chiếu một cách ngắn gọn, thấu đáo (khoảng 2-3 câu).
            2. Kết thúc bằng đúng 1 câu hỏi tự vấn sâu sắc, sắc bén để người hỏi tự quán chiếu.
          - CẤM dùng dấu gạch chéo (/), thay bằng dấu phẩy (,).
          
          Ví dụ tham khảo: "[calm] Cảnh phim vừa rồi cũng giống như cõi mộng nhân gian, mọi tham cầu rồi cũng tan biến như bọt nước. Con đã nhìn thấy chính bản ngã của mình trong đó chưa?"`;

          const textData = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  aiConfigId: selectedAiConfigIdRef.current,
                  message: prompt,
                  language: appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });

          const rawText = textData.message;
          if (!rawText) return;

          let cleanText = rawText.replace(/^\[.*?\]/, '').trim();
          const emotionMatch = rawText.match(/^\[(.*?)\]/);
          const emotion = emotionMatch ? emotionMatch[1] : 'calm';

          // 2. Tạo giọng đọc
          const voiceName = laoVoiceRef.current || "Algieba";
          let prefix = (laoVoiceStyleRef.current || "").trim();
          if (appLanguage === 'Tiếng Việt' && prefix && !prefix.endsWith(':')) prefix += ':';

          const optimizedText = cleanTextForTTS(cleanText).split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');

          const audioDataRes = await fetchWithRetry(`/api/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
              body: JSON.stringify({
                  text: `${prefix} ${optimizedText}`,
                  aiConfigId: selectedAiConfigIdRef.current
              })
          });

          const audioData = audioDataRes && audioDataRes.audioContent ? audioDataRes.audioContent : null;
          let audioUrl = null;
          if (audioData) {
              const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: audioDataRes.mimeType || 'audio/wav' });
              audioUrl = URL.createObjectURL(wavBlob);
          }

          // 3. Lưu vào Ref chờ phim chiếu xong
          preloadedMovieResponseRef.current = {
              text: cleanText,
              emotion: emotion,
              audioUrl: audioUrl,
              username: username
          };
          console.log("✅ [Preload] Đã chuẩn bị sẵn sàng giọng đọc chốt hạ.");

      } catch (e) {
          console.error("Lỗi khi preload câu chốt sau phim:", e);
      }
  };

  // --- TÂM AN LÕI MỚI: HỆ THỐNG TẠO GIỌNG ĐỌC NGẦM (BACKGROUND PREFETCH WORKER) ---
  const livePrefetchQueueRef = useRef<any[]>([]);
  const isPrefetchingRef = useRef(false);

  const generateLivePrefetch = async (item: any, idleSecs: any) => {
      let liveUsername = "Khán giả";
      let actualQuestion = "";
      let isSystemCommand = false;

      if (typeof item === 'string') {
          actualQuestion = item;
          isSystemCommand = actualQuestion.includes("[LỆNH_NGẦM]");
      } else {
          liveUsername = item.username;
          actualQuestion = item.comment;
          isSystemCommand = actualQuestion.includes("[LỆNH_NGẦM]");
      }

      // Cập nhật Lịch sử để tạo ngữ cảnh thông minh cho các câu hỏi liên hoàn
      let liveContext = "";
      let uHistory = liveUserHistoryRef.current.get(liveUsername) || [];
      if (!isSystemCommand) {
          uHistory.push(`Người hỏi (${liveUsername}): ${actualQuestion}`);
          let previousHistory = uHistory.slice(0, -1); 
          if (previousHistory.length > 0) {
              liveContext = `\n\n[LỊCH SỬ TRÒ CHUYỆN LIÊN TỤC VỚI KHÁN GIẢ NÀY (${liveUsername})]:\n${previousHistory.slice(-6).join('\n')}\n\n(LƯU Ý TỐI QUAN TRỌNG: Khán giả này đang hỏi tiếp. Nếu câu hỏi yêu cầu giải thích rõ hơn, hãy dựa vào lịch sử để trả lời sâu hơn!)`;
          }
      }

      const greetingInfo = getLaoGreetingInfo(actualQuestion, idleSecs, greetingsDb);
      const greetingText = greetingInfo.text;
      const greetingKey = `${greetingInfo.category}_${greetingInfo.index}`;

      const bestStanzasInfo = smartLocalSemanticRouter(actualQuestion, 1);
      const bestStanzaInfo = bestStanzasInfo.length > 0 ? bestStanzasInfo[0] : null;
      
      const stanzaText = bestStanzaInfo ? bestStanzaInfo.stanza.content : "";
      const meaningText = bestStanzaInfo && bestStanzaInfo.stanza.meaning ? bestStanzaInfo.stanza.meaning : "";
      const TRANSITION_TEXT = appLanguage === 'Tiếng Việt' ? "Hãy nghe kệ đây." : "Listen to this verse.";

      const hasVietnameseTones = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(actualQuestion);
      const isCJK = /[\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(actualQuestion);
      const isForeignRequest = /(tiếng anh|tiếng trung|tiếng hàn|tiếng nhật|tiếng pháp|ngôn ngữ|english|chinese|korean|japanese|french|translate|speak)/i.test(actualQuestion);
      const isForeignLanguage = isCJK || isForeignRequest || (!hasVietnameseTones && actualQuestion.replace(/[^a-zA-Z]/g, '').length > 10);
      const needsTranslation = isForeignLanguage || appLanguage !== 'Tiếng Việt';

      const trainedKnowledge = searchTrainedDatabase(actualQuestion);

      let displayIntro = "";
      let audioQueueItems = [];
      let missingPartsText = ""; 

      if (!isSystemCommand && !needsTranslation) {
          displayIntro = greetingText;
          if (bestStanzaInfo) displayIntro += `\n\n${TRANSITION_TEXT}\n${stanzaText}`;
          
          const gUrl = await resolveGreetingAudioUrl(greetingKey);
          if (gUrl) audioQueueItems.push({ url: gUrl, text: greetingText });
          else missingPartsText += greetingText + ". ";

          if (bestStanzaInfo) {
              const tUrl = await getOrGenerateTransitionAudio(TRANSITION_TEXT, appLanguage);
              if (tUrl) audioQueueItems.push({ url: tUrl, text: TRANSITION_TEXT }); 
              else missingPartsText += TRANSITION_TEXT + " ";

              const sUrl = await resolveStanzaAudioUrl(bestStanzaInfo.poemId, bestStanzaInfo.stanza, true);
              if (sUrl) audioQueueItems.push({ url: sUrl, text: stanzaText }); 
              else missingPartsText += stanzaText.split('\n').join('. ') + ". ";
          }
      }

      let systemPrompt = systemPromptTemplate;
      if (needsTranslation) {
          systemPrompt += `\n\nQUY TẮC ĐA NGÔN NGỮ (ĐANG KÍCH HOẠT):
          Hệ thống phát hiện Người hỏi đang sử dụng hoặc yêu cầu một ngôn ngữ khác.
          Nhiệm vụ của bạn:
          1. Tự động nhận diện chính xác ngôn ngữ của Người hỏi (Anh, Trung, Hàn, Nhật, Pháp...).
          2. Giao tiếp và trả lời TOÀN BỘ bằng ngôn ngữ đó.
          3. Bạn phải tự viết Lời Mào Đầu (Chào hỏi/Nhận định), sau đó DỊCH BÀI KỆ tham khảo sang ngôn ngữ đó (mỗi câu 1 dòng), và cuối cùng là Lời đúc kết + Câu hỏi tự vấn.
          4. Vẫn giữ phong thái đốn giáo, từ bi, xưng là "Lão" (hoặc từ tương đương trong ngôn ngữ đó) và gọi người hỏi bằng đại từ phù hợp.`;
      }

      let movieInstruction = "";
      const wantsMovie = /(phim|chuyện|kể|xem|ví dụ)/i.test(actualQuestion);
      if (liveIdleVideosRef.current && liveIdleVideosRef.current.length > 0) {
          const movieNames = liveIdleVideosRef.current.map((v: any) => `${v.name.replace(/\.[^/.]+$/, "")} (Chủ đề: ${v.topic || 'Khác'})`).join(' | ');
          movieInstruction = `\n\nHỆ THỐNG RẠP PHIM TÂM AN ĐANG CÓ SẴN CÁC TỰA PHIM SAU: [${movieNames}]. \nLƯU Ý QUAN TRỌNG: Nếu Người hỏi ĐANG HỎI VỀ MỘT CHỦ ĐỀ KHỚP VỚI "Chủ đề" của một bộ phim có sẵn trong danh sách trên, HOẶC họ trực tiếp yêu cầu xem phim/nghe kể chuyện, bạn HÃY CHỦ ĐỘNG mời họ xem phim đó bằng cách:\n1. Cuối câu trả lời, nói một câu dẫn dắt.\n2. CÚ PHÁP BẮT BUỘC: Đặt thẻ [PLAY_MOVIE: Tên_Phim_Chính_Xác] ở tận cùng văn bản để hệ thống tự động bật phim.`;
      }

      let knowledgeInstruction = "";
      if (trainedKnowledge) {
          knowledgeInstruction = `\n\n[DỮ LIỆU ĐƯỢC HUẤN LUYỆN TỪ DATABASE GIACNGO.SQL]:\n"${trainedKnowledge}"\n(Hãy lấy ý chính từ đoạn tri thức trên, diễn đạt lại theo văn phong đốn giáo của Lão một cách tự nhiên nhất).`;
      }

      let userPrompt = `TÌNH HUỐNG:
Người hỏi (${liveUsername}): "${actualQuestion}" ${isSystemCommand ? "(Đây là lệnh từ hệ thống, hãy làm theo yêu cầu trong ngoặc kép)" : ""}
BÀI KỆ THAM KHẢO TỪ HỆ THỐNG:
"${stanzaText}"
Ý nghĩa bài kệ: "${meaningText ? meaningText.replace(/\n/g, ' ') : 'Vạn pháp vô thường'}"
${movieInstruction}${knowledgeInstruction}${liveContext}`;

      if (needsTranslation) {
          userPrompt += `\n\nYÊU CẦU ĐA NGÔN NGỮ: Hãy phản hồi toàn bộ (Mào đầu -> Dịch Bài Kệ -> Đúc kết -> Tự vấn) bằng NGÔN NGỮ CỦA NGƯỜI HỎI. Tuyệt đối không dùng Tiếng Việt trừ khi họ hỏi bằng Tiếng Việt.`;
      } else {
          userPrompt += `\n\nYÊU CẦU: Lão đã đọc bài kệ trên cho người hỏi nghe rồi. Bây giờ CHỈ CẦN viết tiếp phần đúc kết ý nghĩa và câu hỏi tự vấn cuối cùng (bằng Tiếng Việt). KHÔNG chép lại bài kệ.`;
      }

      const payload = {
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: "user", parts: [{ text: userPrompt }] }],
          generationConfig: { maxOutputTokens: 3000, temperature: 0.6 }
      };

      let finalAiText = "";
      let finalEmotion = "calm";
      let movieCmd = null;

      try {
          console.log(`🧠 [Worker] Đang dùng AI phân tích câu hỏi của ${liveUsername}...`);
          const combinedMessage = `${systemPrompt}\n\n${userPrompt}`;
          const data = await fetchWithRetry(`/api/giacngo/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              aiConfigId: selectedAiConfigIdRef.current,
              message: combinedMessage,
              language: appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
            })
          }, 2, 1000); 

          const aiRawText = data.message;
          if (aiRawText) {
              let extractedText = aiRawText.replace(/^\[.*?\]/, '').trim();
              const emotionMatch = aiRawText.match(/^\[(.*?)\]/);
              finalEmotion = emotionMatch ? emotionMatch[1] : 'calm';

              const movieMatch = extractedText.match(/\[PLAY_MOVIE:?\s*(.+?)\]/i);
              if (movieMatch && wantsMovie) {
                  movieCmd = movieMatch[1].trim();
                  extractedText = extractedText.replace(movieMatch[0], '').trim();
              }

              finalAiText = extractedText.replace(/\//g, ',').replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ�??ỆỈỊỌỎỐỒỔỖỘỚỜ�?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, (match: any) => match.charAt(0) + match.slice(1).toLowerCase());

              if (!isSystemCommand) {
                  uHistory.push(`Lão: ${finalAiText}`);
                  if (uHistory.length > 6) uHistory = uHistory.slice(-6);
                  liveUserHistoryRef.current.set(liveUsername, uHistory);
              }
          }
      } catch (err: any) {
          console.error("Lỗi AI Text (Prefetch):", err);
      }

      // Nạp Audio TTS ngầm
      if (finalAiText && isVoiceEnabled && !isMuted) {
          console.log(`🎙️ [Worker] Đang khởi tạo giọng đọc ngầm cho ${liveUsername}...`);
          const textToSynthesize = missingPartsText + finalAiText;
          const ttsText = cleanTextForTTS(textToSynthesize);

          let voiceName = laoVoiceRef.current || "Algieba";
          let prefix = (laoVoiceStyleRef.current || "").trim();
          if (isForeignLanguage) {
              prefix = prefix.replace(/miền nam việt nam/gi, '').replace(/chuẩn giọng/gi, '').replace(/đúng chính tả/gi, '').replace(/việt nam/gi, '').replace(/miền nam/gi, '').trim();
              prefix = `Read naturally with emotion: ${prefix}. Text: `;
          } else {
              if (prefix && !prefix.endsWith(':')) prefix += ':';
              prefix = prefix + " ";
          }

          const cleanSentences = [ttsText.split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ')];
          
          for (let i = 0; i < cleanSentences.length; i++) {
              const sentence = cleanSentences[i];
              if (!sentence) continue;
              try {
                  const data = await fetchWithRetry(`/api/tts`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
                      body: JSON.stringify({
                          text: `${prefix} ${sentence}`,
                          aiConfigId: selectedAiConfigIdRef.current
                      })
                  }, 2, 1000);

                  const audioData = data && data.audioContent ? data.audioContent : null;
                  if (audioData) {
                      const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
                      const audioUrl = URL.createObjectURL(wavBlob);
                      audioQueueItems.push({ url: audioUrl, text: sentence });
                  }
              } catch(e) {
                  console.error("Lỗi TTS (Prefetch):", e);
              }
          }
      }

      return {
          liveUsername,
          actualQuestion,
          isSystemCommand,
          displayIntro,
          finalAiText,
          finalEmotion,
          movieCmd,
          audioQueueItems
      };
  };

  const startPrefetchWorker = async () => {
      if (isPrefetchingRef.current) return;
      isPrefetchingRef.current = true;

      while (liveQueueRef.current.length > 0) {
          // Giới hạn buffer sẵn tối đa 3 câu để chống lãng phí API
          if (livePrefetchQueueRef.current.length >= 3) {
              break;
          }

          const nextItem = liveQueueRef.current.shift();
          if (!nextItem) continue;
          try {
              const preloadedData = await generateLivePrefetch(nextItem, idleSeconds);
              livePrefetchQueueRef.current.push(preloadedData);
              
              // Gọi Lão ra làm việc nếu Lão đang ngủ rảnh rỗi
              if (!isLiveProcessingRef.current && processLiveQueueRef.current) {
                  processLiveQueueRef.current();
              }
          } catch (e) {
              console.error("Prefetch error", e);
              // Cứu cánh nếu API sập, đẩy tin nhắn chờ lỗi để UI không bị treo
              livePrefetchQueueRef.current.push({
                  isFallback: true,
                  liveUsername: typeof nextItem === 'string' ? 'Khán giả' : nextItem.username,
                  actualQuestion: typeof nextItem === 'string' ? nextItem : nextItem.comment
              });
              if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current();
          }
      }
      isPrefetchingRef.current = false;
  };

  // TÂM AN THÊM: Hàm xử lý khi kết thúc phim (Dùng chung cho cả Video Local và YouTube)
  const handleIdleVideoEnded = () => {
      if (currentLiveStoryRef.current.isPlaying) {
          const targetUser = currentLiveStoryRef.current.username;
          currentLiveStoryRef.current = { isPlaying: false, username: null };
          setIsLiveIdlePlaying(false); 
          
          if (preloadedMovieResponseRef.current && preloadedMovieResponseRef.current.username === targetUser) {
              const preloaded = preloadedMovieResponseRef.current;
              preloadedMovieResponseRef.current = null; 
              
              const aiMsgId = Date.now();
              latestAutoPlayaiMsgIdRef.current = aiMsgId;
              
              updateCurrentMessages((prev: any) => [...prev, {
                  id: aiMsgId, role: 'ai', text: preloaded.text, timestamp: new Date(), audioUrl: preloaded.audioUrl, emotion: preloaded.emotion, reactions: {}
              }]);
              
              if (preloaded.audioUrl) {
                  audioQueueRef.current = [preloaded.audioUrl];
                  isPlayingQueueRef.current = true;
                  setCurrentlyPlayingId(aiMsgId);
                  playNextInQueue();
              }
              
              let uHistory = liveUserHistoryRef.current.get(targetUser) || [];
              uHistory.push(`Lão: ${preloaded.text}`);
              liveUserHistoryRef.current.set(targetUser, uHistory);
              
              if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                  liveBgmAudioRef.current.play().catch((e: any) => console.warn(e));
              }
              
          } else {
              liveQueueRef.current.unshift({
                  username: "HỆ THỐNG",
                  comment: `[LỆNH_NGẦM] Phim đã phát xong cho khán giả ${targetUser}. BẮT BUỘC xưng 'Lão' và gọi đối phương là 'con', TUYỆT ĐỐI KHÔNG dùng từ khách sáo như 'Thưa khách mời'. Hãy đúc kết ngắn gọn bài học từ thước phim vừa chiếu và đặt 1 câu hỏi tự vấn sâu sắc để họ tự quán chiếu.`
              });
              if (!isLiveProcessingRef.current && processLiveQueueRef.current) {
                  processLiveQueueRef.current();
              }
          }
      } else {
          setCurrentLiveIdleVideoIndex((prev) => (prev + 1) % liveIdleVideos.length);
      }
  };

  // --- TÂM AN THÊM MỚI: HÀM BỎ QUA CÂU HIỆN TẠI (SKIP) ---
  const handleSkipCurrentLive = () => {
      console.log("⏭️ Bỏ qua câu hiện tại...");
      
      // 1. Dọn dẹp hàng đợi âm thanh
      audioQueueRef.current = [];
      isPlayingQueueRef.current = false;
      
      // 2. Dừng âm thanh đang phát
      if (activeAudioRef.current) {
          activeAudioRef.current.pause();
      }
      setCurrentlyPlayingId(null);
      stopLipSync();
      
      // 3. Xóa câu hỏi đang hiển thị trên màn hình
      setLiveCurrentQuestion(null);
      
      // 4. Reset trạng thái Lão đang nói
      currentLiveSubTextRef.current = '';
      const subEl = document.getElementById('live-subtitle-text');
      if (subEl) subEl.innerText = '';

      showToastMsg('⏭️ Đã bỏ qua câu hiện tại.', 'info', 2000);
      
      // Hệ thống processLiveQueue sẽ tự động bắt vòng lặp mới khi isPlayingQueueRef = false
  };

  // --- TÂM AN THÊM MỚI: LẮNG NGHE PHÍM TẮT TOÀN CỤC ---
  useEffect(() => {
      const handleKeyDown = (e: any) => {
          // Chỉ hoạt động khi đang bật chế độ Livestream
          if (!isLiveActiveRef.current) return;

          // Kiểm tra Modifier
          let modifierMatch = false;
          if (skipShortcutModifierRef.current === 'Shift') modifierMatch = e.shiftKey && !e.ctrlKey && !e.altKey;
          else if (skipShortcutModifierRef.current === 'Ctrl') modifierMatch = e.ctrlKey && !e.shiftKey && !e.altKey;
          else if (skipShortcutModifierRef.current === 'Alt') modifierMatch = e.altKey && !e.shiftKey && !e.ctrlKey;
          else if (skipShortcutModifierRef.current === 'None') modifierMatch = !e.shiftKey && !e.ctrlKey && !e.altKey;

          // Kiểm tra phím chính (Không phân biệt hoa thường)
          if (modifierMatch && e.key.toLowerCase() === skipShortcutKeyRef.current.toLowerCase()) {
              e.preventDefault(); // Ngăn hành vi mặc định (ví dụ Enter xuống dòng)
              handleSkipCurrentLive();
          }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // --- TÂM AN LÕI MỚI: BỘ TIÊU THỤ HÀNG ĐỢI SIÊU NHANH B�?I VÌ ĐÃ PREFETCH ---
  const processLiveQueue = async () => {
      // Chỉ tắt Idle Video (Phim chờ), NẾU đang chiếu Phim Câu Chuyện thì KHÔNG TẮT
      if (!currentLiveStoryRef.current.isPlaying) {
          setIsLiveIdlePlaying(false);
      }

      if (isLiveProcessingRef.current) return;
      
      let prefetchedItem = livePrefetchQueueRef.current.shift();
      
      if (!prefetchedItem) {
          if (liveQueueRef.current.length > 0) {
              startPrefetchWorker();
          }
          return; // Lão rảnh, chờ Background Worker đưa tài liệu tới
      }

      isLiveProcessingRef.current = true;
      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);

      try {
          // Tạm dừng nhạc nền khi có câu hỏi và hủy lệnh hẹn giờ bật phim/nhạc cũ
          if (liveBgmResumeTimerRef.current) {
              clearTimeout(liveBgmResumeTimerRef.current);
              liveBgmResumeTimerRef.current = null;
          }
          if (liveBgmAudioRef.current && !liveBgmAudioRef.current.paused) {
              liveBgmAudioRef.current.pause();
          }

          if (prefetchedItem.isFallback) {
              // Xử lý báo lỗi nhẹ nhàng nếu Background Worker sụp API
              setLiveCurrentQuestion({ username: prefetchedItem.liveUsername, comment: prefetchedItem.actualQuestion });
              await new Promise(r => setTimeout(r, 2000));
              setLiveCurrentQuestion(null);
          } else {
              const { liveUsername, actualQuestion, isSystemCommand, displayIntro, finalAiText, finalEmotion, movieCmd, audioQueueItems } = prefetchedItem;

              // Hiển thị câu hỏi lên màn hình OBS
              if (!isSystemCommand) {
                  setLiveCurrentQuestion({ username: liveUsername, comment: actualQuestion });
                  const userMsgId = Date.now();
                  updateCurrentMessages((prev: any) => [...prev, { id: userMsgId, role: 'user', text: actualQuestion, timestamp: new Date(), audioUrl: null, isCorrecting: false }]);
              }

              // Hiển thị ngay Lời đáp của AI lên hộp Chat mà KHÔNG PHẢI CHỜ SUY NGHĨ (vì đã prefetch ngầm xong)
              const aiMsgId = Date.now() + 1;
              latestAutoPlayaiMsgIdRef.current = aiMsgId;
              const finalText = displayIntro ? (finalAiText ? `${displayIntro}\n\n${finalAiText}` : displayIntro) : finalAiText;
              
              updateCurrentMessages((prev: any) => [...prev, { 
                  id: aiMsgId, role: 'ai', 
                  text: finalText, 
                  timestamp: new Date(), audioUrl: null, emotion: finalEmotion, reactions: {},
                  isAppendingAI: false, // Không cần bật ba chấm vì text đã có sẵn
                  cachedPrefetch: prefetchedItem // TÂM AN FIX: Lưu lại toàn bộ cục Audio đã tạo để tái sử dụng khi "Hỏi lại"
              }]);

              // Bật Âm thanh (Audio TTS cũng đã prefetch 100%)
              if (isVoiceEnabled && !isMuted && audioQueueItems.length > 0) {
                  audioQueueRef.current = [...audioQueueItems];
                  isPlayingQueueRef.current = true;
                  setCurrentlyPlayingId(aiMsgId);
                  playNextInQueue();
                  
                  // Chờ Lão ngậm miệng thật sự
                  await new Promise<void>(resolve => {
                      const checkInterval = setInterval(() => {
                          if (!isPlayingQueueRef.current && !isThinkingRef.current) {
                              clearInterval(checkInterval);
                              lastLaoSpeakEndTimeRef.current = Date.now(); 
                              resolve();
                          }
                      }, 1000);
                  });
              } else {
                  // Nếu không bật giọng đọc, Lão dừng khoảng 4s để người dùng tự đọc chữ
                  await new Promise(r => setTimeout(r, 4000));
              }

              // Ẩn câu hỏi cũ trên màn hình OBS
              setTimeout(() => setLiveCurrentQuestion(null), 1000);
              
              // Kích hoạt Đạo diễn phát phim nếu AI yêu cầu trong câu nói
              if (movieCmd && liveIdleVideosRef.current.length > 0) {
                  const targetMovieName = movieCmd.toLowerCase();
                  const movieIndex = liveIdleVideosRef.current.findIndex(v => {
                      const safeName = v.name.toLowerCase().replace(/\.[^/.]+$/, "");
                      return safeName.includes(targetMovieName) || targetMovieName.includes(safeName);
                  });
                  
                  if (movieIndex !== -1) {
                      console.log("🎬 Chuyển cảnh sang phim:", liveIdleVideosRef.current[movieIndex].name);
                      setCurrentLiveIdleVideoIndex(movieIndex);
                      setIsLiveIdlePlaying(true);
                      currentLiveStoryRef.current = { isPlaying: true, username: liveUsername };

                      if (liveBgmAudioRef.current && !liveBgmAudioRef.current.paused) {
                          liveBgmAudioRef.current.pause();
                      }
                      preloadPostMovieResponse(liveUsername);
                      
                      // Giải thoát luồng lập tức. Bộ phim tự tắt sau khi hết theo event onEnded
                      isLiveProcessingRef.current = false;
                      return; 
                  } else {
                      await new Promise(r => setTimeout(r, 3000));
                  }
              } else {
                  await new Promise(r => setTimeout(r, 2000)); // Khoảng thở giữa các câu
              }
          }

      } catch (error) {
          console.error("Lỗi khi xử lý Live queue:", error);
      } finally {
          isLiveProcessingRef.current = false;

          // Chủ động kích hoạt lại Worker phòng hờ 
          startPrefetchWorker();

          // Kích hoạt chế độ nghỉ nếu hoàn toàn cạn kiệt tài nguyên
          if (livePrefetchQueueRef.current.length === 0 && liveQueueRef.current.length === 0 && !currentLiveStoryRef.current.isPlaying) {
              startLiveIdleTimer();
          } else if (!currentLiveStoryRef.current.isPlaying && livePrefetchQueueRef.current.length > 0) {
              if (processLiveQueueRef.current) {
                  processLiveQueueRef.current();
              }
          }
      }
  };

  useEffect(() => { processLiveQueueRef.current = processLiveQueue; });

  useEffect(() => {
      // TÂM AN FIX: Chỉ kết nối mạng lấy comment khi đã CHÍNH THỨC bấm Bắt đầu Live
      if (!isLiveActive) return;

      // Cập nhật mốc thời gian bật Live
      liveStartTimeRef.current = Date.now();

      // TÂM AN THÊM: Tự động khởi động bộ đếm Bật Phim/Nhạc Chờ
      startLiveIdleTimer();

      // Giữ cho màn hình không bị tắt khi đang Live
      if (navigator.wakeLock && navigator.wakeLock.request) {
          navigator.wakeLock.request('screen').catch(()=>console.log("Wake Lock error"));
      }

      // --- TÂM AN AUTO RAM SWEEPER: CƠ CHẾ DỌN RÁC NGẦM CHỐNG ĐƠ MÁY KHI LIVESTREAM DÀI ---
      const autoRamSweeper = setInterval(() => {
          console.log("🧹 [Tâm An] Kích hoạt tiến trình dọn rác RAM tự động...");
          
          // Dọn dẹp Canvas đồ họa của Video Lão (Chỉ dọn thằng đang nghỉ để không bị chớp giật)
          ['idle', 'talking'].forEach(type => {
              if (laoExportVidRefs.current[type] && laoExportVidRefs.current[type].paused) {
                  laoExportVidRefs.current[type].chromaCanvas = null;
                  laoExportVidRefs.current[type].chromaCtx = null;
                  laoExportVidRefs.current[type].lastProcessedTime = -1;
              }
          });

          // Dọn dẹp Canvas đồ họa của Video Người Hỏi
          ['idle', 'talking', 'bowing'].forEach(type => {
              if (userExportVidRefs.current[type] && userExportVidRefs.current[type].paused) {
                  userExportVidRefs.current[type].chromaCanvas = null;
                  userExportVidRefs.current[type].chromaCtx = null;
                  userExportVidRefs.current[type].lastProcessedTime = -1;
              }
          });

          // Xóa các bộ đệm ảnh tĩnh không cần thiết ở hiện tại
          processedBgsRef.current = {};
      }, 3 * 60 * 1000); // Kích hoạt dọn rác mỗi 3 phút (180,000 ms)

      let unsubscribeLiveComments = null;
      
      // TÂM AN FIX LỖI SẬP MÀN HÌNH TRẮNG & BỊ CHẶN WEBSOCKET: 
      // Chuyển sang dùng Firebase Firestore làm cầu nối trung gian
      try {
          if (user && db) {
              console.log('Đã kết nối với hệ thống đọc comment qua Firebase Đám Mây!');
              
              // Lắng nghe collection live_comments từ Firebase
              const commentsRef = collection(db, 'artifacts', appId, 'public', 'data', 'live_comments');
              
              unsubscribeLiveComments = onSnapshot(commentsRef, (snapshot: any) => {
                  snapshot.docChanges().forEach((change: any) => {
                      if (change.type === 'added') {
                          const data = change.doc.data();
                          
                          // Lọc bỏ các tin nhắn cũ trước khi bấm nút Bắt đầu Live
                          if (!data.timestamp || data.timestamp < liveStartTimeRef.current) return;

                          // Tùy chỉnh keyword để Lão bắt đầu trả lời (VD: Khán giả gõ "Lão ơi + câu hỏi")
                          if (data.comment && (data.comment.toLowerCase().includes('lão ơi') || data.comment.toLowerCase().includes('hỏi'))) {
                              
                              const username = data.nickname || data.displayName || data.username || "Ẩn danh";
                              
                              // Hủy ngay bộ đếm phim chờ khi có tương tác
                              if (liveBgmResumeTimerRef.current) {
                                  clearTimeout(liveBgmResumeTimerRef.current);
                                  liveBgmResumeTimerRef.current = null;
                              }

                              // --- TÂM AN LOGIC INTERRUPT (NGẮT MẠCH) TRỌNG ĐIỂM ---
                              if (currentLiveStoryRef.current.isPlaying) {
                                  // Nếu đang phát phim CÂU CHUYỆN (AI kể)
                                  if (currentLiveStoryRef.current.username === username) {
                                      // CHÍNH NGƯỜI ĐÓ HỎI LẠI -> Ngắt phim ngay lập tức, chuyển qua trả lời
                                      setIsLiveIdlePlaying(false);
                                      currentLiveStoryRef.current = { isPlaying: false, username: null };
                                      if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                                          liveBgmAudioRef.current.play().catch((e: any) => console.warn(e));
                                      }
                                  } else {
                                      // NGƯỜI KHÁC HỎI -> Thêm vào hàng đợi, nhưng ĐỢI PHIM PHÁT XONG mới trả lời
                                      liveQueueRef.current.push({ username, comment: data.comment });
                                      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);
                                      startPrefetchWorker();
                                      return; // Ngắt luồng tại đây
                                  }
                              } else {
                                  // Nếu đang phát phim CHỜ (Idle) -> Ai hỏi cũng ngắt ngay lập tức
                                  setIsLiveIdlePlaying(false);
                                  // TÂM AN FIX: Đảm bảo dọn dẹp cờ Truyện để bộ đếm 30s không bị liệt
                                  currentLiveStoryRef.current = { isPlaying: false, username: null };
                                  if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                                      liveBgmAudioRef.current.play().catch((e: any) => console.warn(e));
                                  }
                              }
                              
                              liveQueueRef.current.push({
                                  username: username,
                                  comment: data.comment
                              });
                              setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length); // TÂM AN ĐỒNG BỘ: Bộ đếm tính cả Prefetch queue
                              startPrefetchWorker(); // Gọi Worker tải tài nguyên ngầm
                              if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current(); 
                          }
                      }
                  });
              }, (err: any) => {
                  console.error('Lỗi đọc comment từ Firebase:', err);
              });
          }
      } catch (error) {
          console.warn("Không thể khởi tạo Firebase Live Comments:", error);
      }

      return () => {
          if (unsubscribeLiveComments) {
              unsubscribeLiveComments();
          }
          clearInterval(autoRamSweeper); // Tắt bộ dọn rác khi dừng Live
          // Dọn dẹp hẹn giờ nhạc nền nếu có
          if (liveBgmResumeTimerRef.current) {
              clearTimeout(liveBgmResumeTimerRef.current);
          }
      };
  }, [isLiveActive]);
  // --- Kết thúc Bước 2 ---


    // --- TÂM AN THÊM: KH�?I TẠO BỘ NÃO LẮNG NGHE KHÁCH MỜI BẰNG GIỌNG NÓI ---
  useEffect(() => {
      let recognition: any = null;
      let watchdogTimer: any = null;
      let isIntentionalStop = false;

      const stopMic = () => {
          isIntentionalStop = true;
          if (recognition) {
              try { recognition.abort(); } catch (e) {}
          }
          if (guestMicStatusRef.current === 'listening') {
              setGuestMicStatus('busy');
          }
      };

      const startMic = () => {
          if (!liveGuestMicRef.current) return;

          const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
          if (!SpeechRecognition) return;

          // Xóa instance cũ để giải phóng bộ nhớ và tránh kẹt state của Chrome
          if (recognition) {
              recognition.onend = null;
              recognition.onerror = null;
              recognition.onresult = null;
              try { recognition.abort(); } catch(e){}
          }

          isIntentionalStop = false;
          recognition = new SpeechRecognition();
          // TÂM AN TỐI ƯU: Chuyển sang continuous = false.
          // Nghe dứt 1 câu là chốt ngay lập tức, không ngâm quá lâu gây chậm trễ.
          recognition.continuous = false; 
          recognition.interimResults = false;
          recognition.lang = 'vi-VN';

          recognition.onstart = () => {
              isGuestMicListeningRef.current = true;
              setGuestMicStatus('listening'); // Cập nhật UI đèn Xanh
          };

          recognition.onend = () => {
              isGuestMicListeningRef.current = false;
              // Nếu mic sập do ngắt câu, tự động bật lại ngay lập tức nếu Lão đang rảnh
              if (liveGuestMicRef.current && !isIntentionalStop) {
                  const isLaoBusy = isLiveProcessingRef.current || isPlayingQueueRef.current || isThinkingRef.current || currentlyPlayingIdRef.current !== null;
                  if (!isLaoBusy) {
                      setTimeout(startMic, 300); // Bật lại cực nhanh (0.3s)
                  } else {
                      setGuestMicStatus('busy'); // Nếu Lão đang bận thì chuyển sang Đỏ
                  }
              }
          };

          recognition.onerror = (e: any) => {
              isGuestMicListeningRef.current = false;
              if (e.error !== 'not-allowed' && liveGuestMicRef.current && !isIntentionalStop) {
                  setTimeout(startMic, 800);
              }
          };

          // TÂM AN FIX: Đã gỡ bỏ async và hàm chờ AI để tốc độ nhận diện nhanh nhất (0ms)
          recognition.onresult = (e: any) => {
              if (!liveGuestMicRef.current) return;
              
              const isLaoBusy = isLiveProcessingRef.current || isPlayingQueueRef.current || isThinkingRef.current || currentlyPlayingIdRef.current !== null;
              if (isLaoBusy) return;

              // Do continuous=false, kết quả luôn nằm ở index 0
              const rawTranscript = e.results[0][0].transcript.trim();
              const lowerTranscript = rawTranscript.toLowerCase();
              
              // Bắt những câu nói có ý nghĩa (Giảm xuống > 3 để không bỏ sót các câu ngắn)
              if (rawTranscript.length > 3) {
                  // TÂM AN LỌC ÂM THANH TỪ PHIM: Kiểm tra xem phim có đang phát không
                  const isMoviePlaying = isLiveIdlePlayingRef.current;
                  
                  if (isMoviePlaying) {
                      // Nếu đang phát phim, BẮT BUỘC phải có từ khóa thì mới ngắt phim để tránh thu nhầm lời thoại
                      const triggerWords = ["ông lão", "ông nội", "cho hỏi", "muốn hỏi", "con hỏi", "dừng phim"];
                      const hasTrigger = triggerWords.some((word: any) => lowerTranscript.includes(word));
                      
                      if (!hasTrigger) {
                          console.log("🎙️ Mic nghe tiếng phim nhưng bỏ qua vì không có lệnh ngắt:", rawTranscript);
                          return; // Thoát hàm, bỏ qua đoạn thu âm này, Lão tiếp tục chiếu phim
                      }
                  }

                  // NGAY LẬP TỨC NGẮT PHIM VÀ THU HỒI CỜ PHÁT PHIM ĐỂ ƯU TIÊN KHÁCH MỜI
                  if (isLiveIdlePlayingRef.current) {
                      setIsLiveIdlePlaying(false);
                      currentLiveStoryRef.current = { isPlaying: false, username: null };
                      if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                          liveBgmAudioRef.current.play().catch((err: any) => console.warn(err));
                      }
                  }

                  // Tắt mic ngay lập tức và Chuyển Đèn Đỏ
                  stopMic();
                  setGuestMicStatus('busy');

                  console.log("🎙️ Khách mời vừa nói (Đã tắt AI lọc chữ):", rawTranscript);

                  // Hủy bộ đếm nhẩm 30s của phim chờ
                  if (liveBgmResumeTimerRef.current) {
                      clearTimeout(liveBgmResumeTimerRef.current);
                      liveBgmResumeTimerRef.current = null;
                  }

                  // Nhét lời khách mời trực tiếp vào hàng đợi để xử lý siêu tốc
                  liveQueueRef.current.push({
                      username: "Khách Mời",
                      comment: rawTranscript
                  });
                  setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length); // TÂM AN THÊM: Cập nhật bộ đếm từ Mic
                  startPrefetchWorker();

                  // Xử lý câu hỏi ngay lập tức
                  if (!isLiveProcessingRef.current && processLiveQueueRef.current) {
                      processLiveQueueRef.current();
                  }
              }
          };

          try {
              recognition.start();
          } catch(e) {
              console.warn("Lỗi khởi động Mic:", e);
          }
      };

      // CHÓ CANH GÁC: Tuần tra mỗi giây xem Lão đã làm việc xong chưa để bật lại Mic
      watchdogTimer = setInterval(() => {
          if (!liveGuestMicRef.current) {
              setGuestMicStatus('off');
              stopMic();
              return;
          }

          const isLaoBusy = isLiveProcessingRef.current || isPlayingQueueRef.current || isThinkingRef.current || currentlyPlayingIdRef.current !== null;

          if (isLaoBusy) {
              // Nếu Lão đang bận mà mic vẫn mở -> Tắt ngay
              if (isGuestMicListeningRef.current) {
                  stopMic();
              }
              if (guestMicStatusRef.current !== 'busy') {
                  setGuestMicStatus('busy');
              }
          } else {
              // Lão đang rảnh mà mic tắt -> Khởi tạo và bật lại mic mới
              if (!isGuestMicListeningRef.current) {
                  startMic();
              }
          }
      }, 1000);

      return () => {
          clearInterval(watchdogTimer);
          stopMic();
          setGuestMicStatus('off');
      };
  }, []);

  // Xử lý nút Bật/Tắt Micro Khách Mời trên giao diện
  useEffect(() => {
      if (isLiveGuestMicActive) {
          showToastMsg('Đã khởi động chế độ Quét giọng Khách mời.', 'success'); 
      } else {
          showToastMsg('Đã ngắt Micro Khách mời.', 'info'); 
      }
  }, [isLiveGuestMicActive]);


  return {
    isLiveMode, setIsLiveMode,
    isLiveActive, setIsLiveActive,
    showLiveSettings, setShowLiveSettings,
    liveBgFilter, setLiveBgFilter,
    laoIsFullScreen, setLaoIsFullScreen,
    liveCurrentQuestion, setLiveCurrentQuestion,
    liveQueueLength, setLiveQueueLength,
    liveCommentBox, setLiveCommentBox,
    liveMicBoxY, setLiveMicBoxY,
    liveShowSubtitles, setLiveShowSubtitles,
    liveSubPos, setLiveSubPos,
    skipShortcutModifier, setSkipShortcutModifier,
    skipShortcutKey, setSkipShortcutKey,
    showLiveHistory, setShowLiveHistory,
    isLiveGuestMicActive, setIsLiveGuestMicActive,
    guestMicStatus, setGuestMicStatus,
    liveIdleVideos, setLiveIdleVideos,
    isLiveIdlePlaying, setIsLiveIdlePlaying,
    isIdleVideoPaused, setIsIdleVideoPaused,
    currentLiveIdleVideoIndex, setCurrentLiveIdleVideoIndex,
    idleVideoProgress, setIdleVideoProgress,
    idleVideoCurrentTime, setIdleVideoCurrentTime,
    liveIdleTimeout, setLiveIdleTimeout,
    showLaoPiP, setShowLaoPiP,
    showYtForm, setShowYtForm,
    ytFormData, setYtFormData,
    
    // Refs
    liveQueueRef,
    isLiveProcessingRef,
    liveMovieToPlayRef,
    liveStartTimeRef,
    liveShowSubtitlesRef,
    isLiveModeRef,
    liveSubtitlesMetaRef,
    currentLiveSubTextRef,
    liveGuestMicRef,
    guestRecognitionRef,
    isGuestMicListeningRef,
    guestMicStatusRef,
    liveUserHistoryRef,
    currentLiveStoryRef,
    preloadedMovieResponseRef,
    lastLaoSpeakEndTimeRef,
    liveIdleVideosRef,
    liveIdleTimeoutRef,
    liveIdlePlayerRef,
    liveIdleYtPlayerRef,
    liveBgmAudioRef,
    liveBgmResumeTimerRef,
    
    // Handlers
    handleUploadLiveLaoFolder,
    showLiveUploadGuide,
    handleSkipCurrentLive,
    processLiveQueue,
    generateLivePrefetch,
    preloadPostMovieResponse,
    startPrefetchWorker,
    handleIdleVideoEnded,
    startLiveIdleTimer
  };
};
