"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchWithRetry } from '../utils';

const getVideoCategory = (ratio: any) => {
    if (ratio === '9x16' || ratio === '3x4' || ratio === '2x3') return 'doc';
    return 'ngang';
};

export const useAutopilot = ({
  user,
  currentUser,
  userName,
  userGender,
  userAge,
  appLanguage,
  selectedAiConfigIdRef,
  generateVoice,
  showToastMsg,
  startVideoExportRef,
  cancelVideoExport,
  handleClearCache,
  allCharacters,
  applyCharacterPreset,
  setCharOffsets,
  setChatLaoVideos,
  poemDatabase,
  sessions,
  setSessions,
  currentSessionId,
  setCurrentSessionId,
  messages,
  updateCurrentMessages,
  audioQueueRef,
  isPlayingQueueRef,
  activeAudioRef,
  globalAudioRef,
  latestAutoPlayaiMsgIdRef,
  renderPromiseRef,
  presetBackgrounds,
  currentUserPresetId,
  FULLFRAME_PACKS,
  ffScenesRef,
  ffVidRefs
}: any) => {

  // --- TÂM AN AUTO-PILOT (XƯỞNG PHIM TỰ ĐỘNG) STATE ---
  const [showAutoPilotModal, setShowAutoPilotModal] = useState(false);
  const [apTopics, setApTopics] = useState('');
  const [apSettings, setApSettings] = useState({ orientation: '16x9', charMode: 'match', scriptLength: 'Khoảng 6-10 câu', renderMode: 'fullframe', transition: 'none', transitionDuration: 0.7 });
  const [apState, setApState] = useState({ isRunning: false, currentIndex: 0, step: '', logs: [] });
  const [isGeneratingAITopic, setIsGeneratingAITopic] = useState(false);

  const apStateRef = useRef(apState);
  const apTopicsRef = useRef(apTopics);
  const apSettingsRef = useRef(apSettings);
  const latestMessagesRef = useRef(messages);
  const latestSessionsRef = useRef(sessions);

  useEffect(() => { apStateRef.current = apState; }, [apState]);
  useEffect(() => { apTopicsRef.current = apTopics; }, [apTopics]);
  useEffect(() => { apSettingsRef.current = apSettings; }, [apSettings]);
  useEffect(() => { latestMessagesRef.current = messages; }, [messages]);
  useEffect(() => { latestSessionsRef.current = sessions; }, [sessions]);

  const processAutoPilotLoopRef = useRef<any>(null);

  useEffect(() => {
      processAutoPilotLoopRef.current = processAutoPilotLoop;
  });

  const logAp = (msg: any) => {
      setApState((p: any) => ({ ...p, logs: [...p.logs, `${new Date().toLocaleTimeString('vi-VN')} - ${msg}`] }));
  };

  const delayAp = async (ms: any) => {
      const steps = Math.ceil(ms / 500);
      for (let i = 0; i < steps; i++) {
          if (!apStateRef.current.isRunning) return false;
          await new Promise(r => setTimeout(r, 500));
      }
      return apStateRef.current.isRunning;
  };

  const handleFetchTrendingTopics = async () => {
      logAp("Đang truy cập bộ não AI để tìm các chủ đề Viral nhất hiện nay...");
      setApState((p: any) => ({...p, step: 'fetching_trends'}));
      try {
          const prompt = `Bạn là một chuyên gia nghiên cứu nội dung mạng xã hội (Tiktok, Youtube Shorts, Reels). Hãy liệt kê 10 chủ đề tâm lý, chữa lành, nhân sinh quan đang ĐƯỢC QUAN TÂM NHẤT, VIRAL NHẤT hiện nay (Ví dụ: Áp lực đồng trang lứa, Vỡ nợ tuổi trẻ, Suy nghĩ quá nhiều, Mất phương hướng, Áp lực gia đình...).
          YÊU CẦU BẮT BUỘC: 
          - Trả về ĐÚNG MỘT DANH SÁCH, mỗi chủ đề nằm trên 1 dòng.
          - TUYỆT ĐỐI không đánh số thứ tự (1, 2, 3...).
          - TUYỆT ĐỐI không có văn bản giải thích, không có lời chào đầu hay kết luận. Chỉ xuất ra văn bản thô gồm các chủ đề phân cách bằng dấu xuống dòng.`;

          const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  aiConfigId: selectedAiConfigIdRef.current,
                  message: prompt,
                  language: appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });

          const rawResult = data.message;
          if (rawResult) {
              setApTopics(rawResult.trim());
              logAp("Đã nạp thành công danh sách chủ đề Viral!");
          } else {
              throw new Error("Không nhận được kết quả.");
          }
      } catch (e: any) {
          logAp("❌ Lỗi khi tìm chủ đề: " + e.message);
      } finally {
          setApState((p: any) => ({...p, step: 'idle'}));
      }
  };

  const generateScriptForAutoPilot = async (topic: any, pName: any, pGender: any, pAge: any) => {
      try {
          const customLaoName = allCharacters.find((c: any) => c.role === 'lao')?.name || 'Lão';
          const quoteRule = appLanguage === 'Tiếng Việt' 
              ? '- Tắt tự làm thơ. Chọn đúng 4 câu kệ (không lấy ngày tháng) phù hợp nhất từ kho dữ liệu. Giữ nguyên văn. BẮT BUỘC: Mỗi câu kệ phải xuống dòng riêng biệt, không được viết dính liền nhau thành 1 hàng. Trước khi trích dẫn, nói: "Sư Cha Tam Vô đã khai thị như sau:".'
              : `- Tắt tự làm thơ. Chọn đúng 4 câu kệ (không lấy ngày tháng) phù hợp từ kho dữ liệu. DỊCH sang ${appLanguage}. MANDATORY: Each line of the poem MUST be on a new line. Do not merge them. Trước khi trích dẫn, nói câu (bằng ${appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;

          const lengthInstruction = `
          YÊU CẦU ÉP BUỘC VỀ SỐ LƯỢNG LƯỢT THOẠI (RẤT QUAN TRỌNG):
          - Kịch bản BẮT BUỘC phải kéo dài ${apSettingsRef.current.scriptLength} (Mỗi lần một người cất tiếng nói được tính là 1 câu/lượt).
          - Nếu yêu cầu kịch bản dài (10-21 câu), bạn PHẢI để nhân vật Phàm Trần phản biện, thắc mắc nhiều lần, Minh Sư giải thích từ từ, đào sâu từng lớp vấn đề.
          - TUYỆT ĐỐI KHÔNG cho nhân vật ngộ đạo quá nhanh ở câu thứ 3 hay thứ 4. Phải duy trì cuộc trò chuyện đạt đúng số lượng câu đã yêu cầu mới được kết thúc. Bắt buộc đếm số lượt thoại trước khi trả về kết quả!`;

          const prompt = `Viết một kịch bản đàm đạo tâm linh sâu sắc giữa hai nhân vật.
          NGÔN NGỮ BẮT BUỘC: ${appLanguage}
          
          THÔNG TIN VÀ QUY TẮC XƯNG HÔ CỦA 2 NHÂN VẬT (BẮT BUỘC TUÂN THỦ 100%):
          
          1. Nhân vật Minh Sư (Người đáp):
          - Tên hiển thị kịch bản: ${customLaoName}
          - Khi nói chuyện, bắt buộc tự xưng mình là: "Lão"
          - Khi gọi/nhắc đến đối phương, bắt buộc dùng từ: "Con"
          
          2. Nhân vật Phàm Trần (Người hỏi):
          - Tên hiển thị kịch bản: ${pName} (Giới tính: ${pGender}, ${pAge} tuổi)
          - Khi nói chuyện, bắt buộc tự xưng mình là: "Con"
          - Khi gọi/nhắc đến Minh Sư, bắt buộc dùng từ: "Sư Cha"
          
          VÍ DỤ VỀ XƯNG HÔ: Nếu quy định Người hỏi tự xưng là "Con" và gọi Minh sư là "Sư Cha", thì kịch bản phải thoại là: "Sư Cha ơi, con đang buồn...". Đừng xưng hô lộn xộn (không được để con gọi Sư Cha là "ngươi").
          
          - Chủ đề: "${topic}"
          ${lengthInstruction}
          
          CẢNH BÁO KIỂM DUYỆT (RẤT QUAN TRỌNG):
          Tuyệt đối KHÔNG sử dụng các từ ngữ có thể vi phạm chính sách của Youtube, Tiktok, Facebook. Cấm dùng các từ: tự tử, tự sát, máu me, bạo lực, giết chóc, hận thù, lừa đảo, chính trị phản động. Hãy dùng các từ nói giảm nói tránh (VD: "nghĩ quẩn", "vết thương lòng", "bế tắc").

          QUY TẮC DIỄN BIẾN (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
          1. Mở đầu (Intro-Hook BẮT BUỘC): Lượt thoại ĐẦU TIÊN của kịch bản PHẢI LÀ CỦA LÃO. Đây là một câu mào đầu mang tính châm biếm, hài hước, mỉa mai nhẹ nhàng để đánh trúng tim đen và dẫn dắt người xem vào chủ đề. (Ví dụ chủ đề 'Cúng sao giải hạn' thì Lão nói: 'Mới nghe thầy bói hù vài câu, tính đem tiền đi cúng sao giải hạn hả? Vào đây, Lão giải các tâm cho bớt hạn hẹp đi nè!'). Bắt buộc dùng thẻ [hook] ngay sau tên Lão ở câu này.
          2. Mê lầm: Tiếp theo, ${pName} mang theo nỗi khổ/vướng mắc trên đến hỏi.
          3. Giữa: ${customLaoName} dùng lời đốn giáo, thẳng thắn đánh thức mộng ảo. ${pName} tỉnh ngộ dần.
          4. Kết thúc: ${pName} vỡ òa hạnh phúc, ${customLaoName} nói "Lành thay" và đặt 1 câu hỏi tự vấn.

          QUY TẮC ĐỊNH DẠNG (BẮT BUỘC):
          - Bắt đầu mỗi dòng thoại BẮT BUỘC bằng tên nhân vật: "${pName}:" hoặc "${customLaoName}:". Tuyệt đối không dùng tiền tố khác.
          - CHÈN THẺ CẢM XÚC: Phân tích nội tâm nhân vật ở câu đó và chèn 1 trong 4 thẻ: [hook] (Châm biếm mào đầu - CHỈ DÙNG CHO CÂU ĐẦU CỦA LÃO), [calm] (Bình thường), [sad] (Buồn bã, đau khổ), [joy] (Vui vẻ, ngộ đạo) ngay sau tên. Ví dụ: "${customLaoName} [hook]: ..." BẮT BUỘC PHẢI CÓ THẺ NÀY TRONG MỌI CÂU.
          - Không viết HOA toàn bộ từ. Thay dấu gạch chéo "/" bằng dấu phẩy ",".
          ${quoteRule}
          
          KHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:
          ${(poemDatabase as any[]).map((p: any) => `Tên bài: ${p.title}\n` + (p.stanzas as any[]).map((s: any) => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n')}`;

          const data = await fetchWithRetry(`/api/giacngo/chat`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  aiConfigId: selectedAiConfigIdRef.current,
                  message: prompt,
                  language: appLanguage === 'Tiếng Việt' ? 'vi' : 'en'
              })
          });

          const rawResult = data.message;
          if (!rawResult) throw new Error("AI không trả về kịch bản.");

          const lines = rawResult.split('\n');
          const newMsgs: any[] = [];
          let currentRole: any = null;
          let currentEmotion = 'calm';
          
          const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const laoNameSafe = escapeRegExp(customLaoName || 'Lão');
          const userNameSafe = escapeRegExp(pName || 'Con');
          
          lines.forEach((line: any) => {
             let text = line.replace(/\*\*/g, '').trim();
             if (!text) return;
             let role = null;
             let cleanText = text;
             
             const matchUser = text.match(new RegExp(`^(${userNameSafe}|con|người hỏi|hỏi)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));
             const matchAi = text.match(new RegExp(`^(${laoNameSafe}|lão|đáp|ai)(?:\\s*\\[(.*?)\\]|\\s*\\((.*?)\\))?\\s*:\\s*(.*)`, 'i'));

             if (matchUser) {
                role = 'user'; 
                currentRole = 'user';
                currentEmotion = (matchUser[2] || matchUser[3] || 'calm').toLowerCase().trim();
                cleanText = matchUser[4].trim();
             } else if (matchAi) {
                role = 'ai'; 
                currentRole = 'ai';
                currentEmotion = (matchAi[2] || matchAi[3] || 'calm').toLowerCase().trim();
                cleanText = matchAi[4].trim();
             } else if (currentRole) {
                role = currentRole; cleanText = text;
             }

             if (!['calm', 'sad', 'joy', 'hook'].includes(currentEmotion)) currentEmotion = 'calm';

             if (role && cleanText) {
                 if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                     newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
                 } else {
                     newMsgs.push({ id: Date.now() + Math.random(), role, text: cleanText, emotion: currentEmotion, timestamp: new Date(), audioUrl: null, reactions: {} });
                 }
             }
          });

          if (newMsgs.length === 0) throw new Error("Lỗi định dạng kịch bản từ AI.");

          const newSessionId = Date.now();
          const newSession = { id: newSessionId, title: `Auto: ${topic.substring(0, 15)}...`, isPinned: false, messages: newMsgs, type: 'script' };
          
          setSessions((prev: any) => [newSession, ...prev]);
          setCurrentSessionId(newSessionId);
          
          await delayAp(500);
          
          return newSessionId;
      } catch (err: any) {
          throw err;
      }
  };

  const generateAudioForAutoPilot = async (sessionId: any) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 5;
      
      while (attempts < MAX_ATTEMPTS && apStateRef.current.isRunning) {
          const targetSession = latestSessionsRef.current.find((s: any) => s.id === sessionId);
          if (!targetSession) throw new Error("Không tìm thấy dữ liệu đàm đạo.");
          
          const currentMsgs = targetSession.messages;
          const missing = currentMsgs.filter((m: any) => {
              if (m.audioUrl) return false;
              const readableText = m.text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
              return readableText.length > 0;
          });
          
          if (missing.length === 0) {
              logAp(`Đã tạo xong 100% âm thanh kịch bản.`);
              return true;
          }

          logAp(`Phát hiện ${missing.length} đoạn chưa có âm thanh. Đang tiến hành tạo... (Lần thử ${attempts + 1})`);
          
          for (let msg of missing) {
              if (!apStateRef.current.isRunning) return false;
              let success = false;
              let retries = 0;
              while (!success && retries < 3 && apStateRef.current.isRunning) {
                  success = await generateVoice(msg.id, msg.text, msg.role, sessionId, false);
                  if (!success) {
                      retries++;
                      logAp(`⚠️ Nghẽn mạng API khi tạo đoạn "${msg.text.substring(0, 15)}...". Thử lại (${retries}/3)`);
                      if (!(await delayAp(4000))) return false;
                  } else {
                      logAp(`🎙️ Đã tạo xong âm thanh: "${msg.text.substring(0, 20)}..."`);
                  }
              }
              if (!(await delayAp(2500))) return false;
          }
          
          attempts++;
          if (!(await delayAp(2000))) return false;
      }

      const finalSession = latestSessionsRef.current.find((s: any) => s.id === sessionId);
      const finalMissing = (finalSession?.messages || []).filter((m: any) => !m.audioUrl && m.text.replace(/\[.*?\]|\(.*?\)/g, '').trim().length > 0);
      
      if (finalMissing.length > 0) {
          throw new Error("Đường truyền API TTS của Google đang bị quá tải (Rate limit). Vui lòng dừng hệ thống Auto-Pilot, đợi 5 phút rồi chạy lại.");
      }
      return true;
  };

  const prepareAutoPilotAssets = () => {
      const orientation = apSettingsRef.current.orientation;
      const isRandomMode = apSettingsRef.current.charMode === 'random';
      const category = getVideoCategory(orientation);

      const validBgs = presetBackgrounds.filter((p: any) => p.type === 'video' && (!p.aspectCategory || p.aspectCategory === category));
      const selectedBg = validBgs.length > 0 ? validBgs[Math.floor(Math.random() * validBgs.length)] : presetBackgrounds[0];

      let selectedUserCharId: any = currentUserPresetId;
      if (isRandomMode) {
          if (selectedBg.defaultCharacters && selectedBg.defaultCharacters.user) {
              selectedUserCharId = selectedBg.defaultCharacters.user;
          } else {
              const validUsers = allCharacters.filter((c: any) => c.role === 'user' || !c.role);
              selectedUserCharId = validUsers.length > 0 ? validUsers[Math.floor(Math.random() * validUsers.length)].id : null;
          }
      }

      const targetLaoId = 'char_lao_xeo';

      return { selectedBg, selectedUserCharId, targetLaoId };
  };

  const processAutoPilotLoop = async () => {
      if (!apStateRef.current.isRunning) return;
      
      const topics = apTopicsRef.current.split('\n').filter((t: any) => t.trim());
      const idx = apStateRef.current.currentIndex;

      if (idx >= topics.length) {
          logAp("🎉 ĐÃ HOÀN THÀNH TOÀN BỘ DANH SÁCH CHỦ ĐỀ!");
          setApState(p => ({...p, isRunning: false, step: 'completed'}));
          return;
      }

      const currentTopic = topics[idx];
      logAp(`--- BẮT ĐẦU CHỦ ĐỀ [${idx + 1}/${topics.length}]: ${currentTopic.substring(0,30)}... ---`);

      try {
          setApState(p => ({...p, step: 'cache'}));
          logAp("Xóa bộ nhớ đệm giải phóng RAM...");
          handleClearCache();
          if (!(await delayAp(2500))) return;

          setApState((p: any) => ({...p, step: 'assets'}));
          logAp("Phân tích bối cảnh và chọn nhân vật (Đồng bộ offset)...");
          
          const { selectedBg, selectedUserCharId, targetLaoId } = prepareAutoPilotAssets();
          const userChar: any = allCharacters.find((c: any) => c.id === selectedUserCharId) || {};
          
          const isRandomMode = apSettingsRef.current.charMode === 'random';
          const isFullFrameRender = apSettingsRef.current.renderMode === 'fullframe';

          let pName = userName.trim() || 'Con';
          let pGender = userGender;
          let pAge = userAge;
          let selectedPackId = 'pack_co_gai';

          if (isFullFrameRender) {
              const isDoc = apSettingsRef.current.orientation === '9x16';
              if (isRandomMode) {
                  const validPacks = FULLFRAME_PACKS.filter((p: any) => p.aspect === (isDoc ? 'doc' : 'ngang'));
                  const randomPack = validPacks.length > 0 ? validPacks[Math.floor(Math.random() * validPacks.length)] : FULLFRAME_PACKS[0];
                  selectedPackId = randomPack.id;
                  
                  const basePackId = selectedPackId.replace('_doc', '');
                  if (basePackId === 'pack_nam_tre') { pName = 'Chàng trai'; pGender = 'Nam'; pAge = 30; }
                  else if (basePackId === 'pack_ba_mai_90') { pName = 'Bà lão'; pGender = 'Nữ'; pAge = 90; }
                  else if (basePackId === 'pack_ba_cu' || basePackId === 'pack_ba_lao_78') { pName = 'Bà cụ'; pGender = 'Nữ'; pAge = 75; }
                  else if (basePackId === 'pack_ong_hung' || basePackId === 'pack_ong_lao_85') { pName = 'Ông cụ'; pGender = 'Nam'; pAge = 85; }
                  else if (basePackId === 'pack_be_9t') { pName = 'Bé gái'; pGender = 'Nữ'; pAge = 9; }
                  else if (basePackId === 'pack_be_hoa') { pName = 'Bé Hoa'; pGender = 'Nữ'; pAge = 12; }
                  else if (basePackId === 'pack_hoa_35') { pName = 'Hoa'; pGender = 'Nữ'; pAge = 35; }
                  else if (basePackId === 'pack_nu_a') { pName = 'Chị gái'; pGender = 'Nữ'; pAge = 40; }
                  else { pName = 'Cô gái'; pGender = 'Nữ'; pAge = 28; }
              } else {
                  let basePackId = 'pack_co_gai';
                  if (pGender === 'Nam') {
                      if (pAge >= 55) basePackId = 'pack_ong_hung';
                      else basePackId = 'pack_nam_tre';
                  } else {
                      if (pAge <= 10) basePackId = 'pack_be_9t';
                      else if (pAge <= 16) basePackId = 'pack_be_hoa';
                      else if (pAge >= 80) basePackId = 'pack_ba_mai_90';
                      else if (pAge >= 55) basePackId = 'pack_ba_cu';
                      else if (pAge >= 38) basePackId = 'pack_nu_a';
                      else if (pAge >= 32) basePackId = 'pack_hoa_35';
                      else basePackId = 'pack_co_gai';
                  }
                  
                  let tryPackId = isDoc ? `${basePackId}_doc` : basePackId;
                  const packExists = FULLFRAME_PACKS.some((p: any) => p.id === tryPackId);
                  
                  if (!packExists) {
                       if (isDoc) {
                           tryPackId = pGender === 'Nam' ? 'pack_ong_lao_85_doc' : 'pack_ba_lao_78_doc'; 
                       } else {
                           tryPackId = 'pack_co_gai'; 
                       }
                  }
                  selectedPackId = tryPackId;
              }
          }

          // Cưỡng chế nạp và áp dụng assets bối cảnh/nhân vật
          applyCharacterPreset(targetLaoId, 'lao', true); 
          applyCharacterPreset(selectedUserCharId, 'user', true);
          
          if (!isFullFrameRender) {
              setCharOffsets((prev: any) => ({
                  lao: { ...prev.lao, ...selectedBg.defaultCharacters.laoOffset },
                  user: { ...prev.user, ...selectedBg.defaultCharacters.userOffset }
              }));
          }

          setChatLaoVideos({
              idle: selectedBg.url,
              talking: selectedBg.url
          });

          if (!(await delayAp(1500))) return;

          setApState((p: any) => ({...p, step: 'script'}));
          logAp(`Đang nhờ AI viết kịch bản cho: ${pName} (${pAge} tuổi)...`);
          
          const newSessionId = await generateScriptForAutoPilot(currentTopic, pName, pGender, pAge);
          if (!newSessionId || !apStateRef.current.isRunning) return;

          if (isFullFrameRender) {
              const finalPack = FULLFRAME_PACKS.find((p: any) => p.id === selectedPackId);
              if (finalPack) {
                  const targetAspect = apSettingsRef.current.orientation === '9x16' ? 'doc' : 'ngang';
                  const mappedScenes = finalPack.scenes.filter((s: any) => s.aspect === targetAspect);
                  
                  // Nạp pack scene vào ffScenes của session mới
                  setSessions((prev: any) => prev.map((s: any) => s.id === newSessionId ? { ...s, ffScenes: mappedScenes } : s));
                  ffScenesRef.current = mappedScenes; 
              }
          }

          setApState((p: any) => ({...p, step: 'audio'}));
          logAp("Đang tạo âm thanh đồng loạt...");
          const audioOk = await generateAudioForAutoPilot(newSessionId);
          if (!audioOk || !apStateRef.current.isRunning) return;

          setApState((p: any) => ({...p, step: 'render'}));
          logAp("Mở Xưởng phim và chuẩn bị tài nguyên...");
          
          // Trực quan hóa cấu hình render
          logAp(`Chế độ Render: ${isFullFrameRender ? 'Video Dựng Sẵn (Toàn cảnh)' : 'Cách Cũ (Phông Xanh 3D)'}`);
          
          await delayAp(500);

          logAp("Đang làm nóng GPU (Đợi 8s)... Vui lòng KHÔNG chuyển tab!");
          if (!(await delayAp(8000))) return; 
          
          logAp("Bắt đầu Render Video chất lượng cao...");
          await new Promise((resolve, reject) => {
              renderPromiseRef.current = { resolve, reject };
              if (startVideoExportRef.current) startVideoExportRef.current(); 
          });

          if (!apStateRef.current.isRunning) return;

          setApState((p: any) => ({...p, step: 'wait', currentIndex: idx + 1}));
          logAp("✅ Thành công! Đợi 12 giây cho máy nghỉ trước khi sang chủ đề tiếp theo...");
          
          if (!(await delayAp(12000))) return; 
          
          if (apStateRef.current.isRunning && processAutoPilotLoopRef.current) {
              processAutoPilotLoopRef.current();
          }

      } catch (err: any) {
          if (err.message === "Dừng khẩn cấp từ người dùng.") {
              logAp("✅ Đã ngắt cầu dao, dừng xưởng phim an toàn.");
          } else {
              logAp(`❌ LỖI NGHIÊM TRỌNG: ${err.message}`);
              logAp("Tạm dừng hệ thống Auto-Pilot để tránh vòng lặp lỗi.");
              setApState((p: any) => ({...p, isRunning: false, step: 'error'}));
          }
      }
  };

  const startAutoPilot = () => {
      if (!apTopics.trim()) {
          showToastMsg('Danh sách chủ đề đang trống!', 'error');
          return;
      }
      setApState((p: any) => ({...p, isRunning: true, logs: [], currentIndex: 0}));
      logAp("🚀 KHỞI ĐỘNG XƯỞNG PHIM TỰ ĐỘNG...");
      logAp("⚠️ BẮT BUỘC: Hãy giữ màn hình tab này luôn mở để video render mượt mà, không giật lag.");
      setTimeout(() => {
          if (processAutoPilotLoopRef.current) processAutoPilotLoopRef.current();
      }, 500);
  };

  const stopAutoPilot = () => {
      logAp("🛑 ĐÃ NHẬN LỆNH DỪNG HỆ THỐNG KHẨN CẤP.");
      
      apStateRef.current = { ...apStateRef.current, isRunning: false };
      setApState(p => ({...p, isRunning: false, step: 'stopped'}));
      
      if (renderPromiseRef.current) {
          renderPromiseRef.current.reject(new Error("Dừng khẩn cấp từ người dùng."));
          renderPromiseRef.current = null;
      }
      
      cancelVideoExport();
      
      audioQueueRef.current = [];
      isPlayingQueueRef.current = false;
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if (globalAudioRef.current) globalAudioRef.current.pause();
  };

  return {
    showAutoPilotModal,
    setShowAutoPilotModal,
    apTopics,
    setApTopics,
    apSettings,
    setApSettings,
    apState,
    setApState,
    handleFetchTrendingTopics,
    startAutoPilot,
    stopAutoPilot,
    isGeneratingAITopic,
    setIsGeneratingAITopic
  };
};
