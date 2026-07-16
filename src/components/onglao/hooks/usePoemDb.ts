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
  writeBatch,
  LAO_GREETINGS_DB,
  audioBufferToWav,
  GIAC_NGO_DB
} from '../constants';
import { fetchWithRetry } from '../utils';
import { executeFullBackup as executeFullBackupHelper, handleImportFullBackup as handleImportFullBackupHelper } from '../utils/backupHelper';
import { usePoemGenerator } from './usePoemGenerator';

export const usePoemDb = ({
  user,
  appLanguage,
  selectedAiConfigId,
  selectedAiConfigIdRef,
  geminiApiKeyRef,
  showToastMsg,
  initialPoems = [],
  laoVoiceRef,
  laoVoiceStyleRef,
  userVoiceRef,
  userVoiceStyleRef,
  setIsFetchingCloudAudio,
  handlePlayStanzaVoice
}: any) => {

  // --- STATE QUẢN LÝ KHO KỆ PHÁP (MỚI) ---
  const [poemDatabase, setPoemDatabase] = useState<any[]>(() => {
      let rawData: any[];
      const saved = typeof window !== 'undefined' ? localStorage.getItem('taman_poem_db') : null;
      if (saved) {
          rawData = JSON.parse(saved);
          if (Array.isArray(initialPoems) && initialPoems.length > 0) {
              const existingTitles = new Set(rawData.map((p: any) => p.title.toLowerCase().trim()));
              const newPoems = initialPoems.filter((p: any) => !existingTitles.has(p.title.toLowerCase().trim()));
              if (newPoems.length > 0) {
                  rawData = [...rawData, ...newPoems];
                  if (typeof window !== 'undefined') {
                      localStorage.setItem('taman_poem_db', JSON.stringify(rawData));
                  }
              }
          }
      } else {
          rawData = initialPoems;
      }

      // Xử lý tương thích ngược: Chuyển đổi dữ liệu cũ sang cấu trúc mới (tách đoạn)
      const processedData = rawData.map((poem: any, index: number) => {
          if (poem.stanzas) return poem; // Đã là cấu trúc mới

          // Xử lý dữ liệu cũ (Tách đoạn 4 câu)
          let titleTag = "Bài kệ " + (index + 1);
          const lines = (poem.content as string).split('\n').map((l: string) => l.trim()).filter((l: string) => l.length > 0);
          
          // Lấy dòng đầu làm tên bài nếu ngắn
          if (lines.length > 0 && lines[0].length < 50 && !lines[0].toLowerCase().includes('tam vô')) {
              const firstLine = lines.shift();
              if (firstLine) {
                  titleTag = firstLine.replace(/^[0-9.\s]+/, '').replace(/\*/g, '').split('(')[0].trim();
              }
          }

          const stanzas = [];
          let currentStanza = [];
          
          for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes('tam vô') && lines[i].match(/\d+/)) continue; // Bỏ dòng tác giả/ngày
              
              currentStanza.push(lines[i]);
              
              if (currentStanza.length === 4) {
                  const remainingLines = lines.slice(i + 1).filter((l: any) => !l.toLowerCase().includes('tam vô'));
                  // Nếu số câu dư còn lại <= 2, gộp luôn vào đoạn này để tránh đoạn cụt ngủn
                  if (remainingLines.length > 0 && remainingLines.length <= 2) {
                      continue; 
                  } else {
                      stanzas.push({
                          id: `p${index}_s${stanzas.length + 1}_${Date.now()}`,
                          tags: [...poem.tags],
                          content: currentStanza.join('\n'),
                          audioUrl: null,
                          isSaved: false
                      });
                      currentStanza = [];
                  }
              }
          }
          if (currentStanza.length > 0) {
              stanzas.push({
                  id: `p${index}_s${stanzas.length + 1}_${Date.now()}`,
                  tags: [...poem.tags],
                  content: currentStanza.join('\n'),
                  audioUrl: null,
                  isSaved: false
              });
          }

          return { id: poem.id || `poem_legacy_${index}`, title: titleTag, stanzas };
      });

      if (typeof window !== 'undefined') {
          localStorage.setItem('taman_poem_db', JSON.stringify(processedData));
      }
      return processedData;

  });
  
  const [showPoemModal, setShowPoemModal] = useState(false);
  const [poemModalTab, setPoemModalTab] = useState<'poems' | 'greetings' | 'rag'>('poems'); // State quản lý tab Kho Kệ / Kho Mào Đầu / Kho Huấn Luyện
  const [poemSearch, setPoemSearch] = useState('');
  const [newTagInputs, setNewTagInputs] = useState<Record<string, string>>({});
  const [generatingStanzas, setGeneratingStanzas] = useState<Record<string, boolean>>({});
  const [generatingMeanings, setGeneratingMeanings] = useState<Record<string, boolean>>({}); // TÂM AN THÊM: Trạng thái tạo audio Ý nghĩa
  const [isGeneratingAIMeaning, setIsGeneratingAIMeaning] = useState<Record<string, boolean>>({}); // TÂM AN THÊM: Trạng thái AI viết ý nghĩa

  // TÂM AN THÊM: State quản lý nội dung chữ, tìm kiếm và âm thanh cho Kho Mào Đầu
  const [greetingsDb, setGreetingsDb] = useState<any>(() => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('taman_greetings_text_db') : null;
      if (saved) return JSON.parse(saved);
      return LAO_GREETINGS_DB;
  });
  const [greetingSearch, setGreetingSearch] = useState('');
  const [greetingAudioUrls, setGreetingAudioUrls] = useState<Record<string, string>>(() => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('taman_greeting_audio_urls') : null;
      if (saved) return JSON.parse(saved);
      return {};
  });
  const [generatingGreetings, setGeneratingGreetings] = useState<Record<string, boolean>>({});
  const [transitionAudioUrls, setTransitionAudioUrls] = useState<Record<string, string>>({});

  // --- TÂM AN THÊM: STATE CHO KHO TRÍ TUỆ (RAG DB) ---
  const [ragDb, setRagDb] = useState<any[]>([]);
  const [ragSearch, setRagSearch] = useState('');
  const ragFileInputRef = useRef<any>(null);

  // --- Tải Kho Trí Tuệ từ GiacNgo API (Training Data của AI Config đang chọn) ---
  const [isLoadingRag, setIsLoadingRag] = useState(false);

  const refreshRagFromGiacNgo = async (aiConfigId?: number) => {
      const id = aiConfigId ?? selectedAiConfigId;
      if (!id) return;
      setIsLoadingRag(true);
      try {
          const res = await fetch(`/api/giacngo/ai-configs?id=${id}&type=training-data`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const data: any[] = await res.json();

          if (Array.isArray(data) && data.length > 0) {
              // Chuyển đổi định dạng TrainingData của GiacNgo → ragDb format
              const mapped = data
                  .filter((item: any) => item.type === 'qa' || item.type === 'document')
                  .map((item: any) => {
                      if (item.type === 'qa') {
                          return {
                              id: String(item.id),
                              source: item.fileName || 'GiacNgo Training Q&A',
                              text: `Hỏi: ${item.question || ''}\nĐáp: ${item.answer || ''}`
                          };
                      } else {
                          // document: dùng summary làm context tra cứu nhanh
                          return {
                              id: String(item.id),
                              source: item.documentName || item.fileName || 'Tài liệu',
                              text: item.summary || item.answer || ''
                          };
                      }
                  })
                  .filter((item: any) => item.text && item.text.trim().length > 0);

              setRagDb(mapped);
          } else {
              // Không có training data trên GiacNgo → giữ DB nội tuyến mặc định nhỏ
              const fallback = GIAC_NGO_DB.map((item, idx) => ({
                  id: `rag_default_${idx}`,
                  source: 'Mặc định',
                  text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
              }));
              setRagDb(fallback);
          }
      } catch(e) {
          console.error("Lỗi tải RAG từ GiacNgo API:", e);
          showToastMsg('Không thể tải kho tri thức từ GiacNgo. Dùng dữ liệu mặc định.', 'error', 4000);
      } finally {
          setIsLoadingRag(false);
      }
  };

  // Tải khi khởi động
  useEffect(() => {
      refreshRagFromGiacNgo(selectedAiConfigId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Đồng bộ câu mào đầu từ Database về Client
  useEffect(() => {
      const syncGreetings = async () => {
          try {
              const res = await fetch('/api/opening-phrases');
              if (res.ok) {
                  const dbPhrases: any[] = await res.json();
                  if (Array.isArray(dbPhrases) && dbPhrases.length > 0) {
                      const newGreetingsDb: Record<string, string[]> = {};
                      const newGreetingAudioUrls: Record<string, string> = {};
                      
                      const categories = [
                          "waiting_long", "health_daily", "serious_dharma", "love_heartbreak",
                          "money_debt", "complaining_lost", "boasting_ego", "random_teasing",
                          "testing_lao", "mundane_weather"
                      ];
                      categories.forEach(cat => { newGreetingsDb[cat] = []; });

                      dbPhrases.forEach(ph => {
                          const cat = ph.category || "mundane_weather";
                          if (!newGreetingsDb[cat]) newGreetingsDb[cat] = [];
                          
                          newGreetingsDb[cat].push(ph.text);
                          const index = newGreetingsDb[cat].length - 1;
                          const key = `${cat}_${index}`;
                          if (ph.audioUrl) {
                              newGreetingAudioUrls[key] = ph.audioUrl;
                          }
                      });

                      setGreetingsDb(newGreetingsDb);
                      setGreetingAudioUrls(newGreetingAudioUrls);
                      if (typeof window !== 'undefined') {
                          localStorage.setItem('taman_greetings_text_db', JSON.stringify(newGreetingsDb));
                          localStorage.setItem('taman_greeting_audio_urls', JSON.stringify(newGreetingAudioUrls));
                      }
                  }
              }
          } catch (err) {
              console.warn("Lỗi đồng bộ mào đầu từ DB:", err);
          }
      };
      syncGreetings();
  }, []);

  // Tải lại khi chuyển AI Config
  useEffect(() => {
      if (selectedAiConfigId) {
          refreshRagFromGiacNgo(selectedAiConfigId);
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAiConfigId]);

  const handleUpdateGreetingText = (category: string, index: number, newText: string) => {
      setGreetingsDb((prev: any) => {
          const next = { ...prev };
          next[category] = [...next[category]];
          next[category][index] = newText;
          localStorage.setItem('taman_greetings_text_db', JSON.stringify(next));
          return next;
      });
  };

  const cleanTextForTTS = (text: string) => {
      if (!text) return "";
      let cleaned = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      cleaned = cleaned.replace(/\//g, ',');
      return cleaned.replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂ�??ỆỈỊỌỎỐỒỔỖỘỚỜ�?ỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, 
          (match: string) => match.charAt(0) + match.slice(1).toLowerCase()
      );
  };

  // --- STATE CHO IMPORT JSON TRỰC TIẾP TỪ GIAO DIỆN ---
  const [showImportPoemModal, setShowImportPoemModal] = useState(false);
  const [importPoemJson, setImportPoemJson] = useState('');
  
  // TÂM AN THÊM: Ref cho nhập Kệ từ file TXT tự động
  const txtPoemFileInputRef = useRef<any>(null);

  // --- STATE CHO KHÔI PHỤC TỪ LINK CŨ ---
  const [showOldLinkModal, setShowOldLinkModal] = useState(false);
  const [oldLinkInput, setOldLinkInput] = useState('');

  // --- STATE CHO FULL BACKUP OFFLINE (TÂM AN TỐI THƯỢNG) ---
  const [isProcessingBackup, setIsProcessingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState({ current: 0, total: 0, status: '' });
  const backupFileInputRef = useRef<any>(null);

  // TÂM AN THÊM: State quản lý Tùy chọn Sao lưu & Metadata Mào đầu
  const [showBackupOptionsModal, setShowBackupOptionsModal] = useState(false);
  const [backupOptions, setBackupOptions] = useState({ stanzas: true, meanings: false, greetings: true });
  const [greetingMeta, setGreetingMeta] = useState(() => {
      if (typeof window === 'undefined') return {};
      return JSON.parse(localStorage.getItem('taman_greetings_db') || '{}');
  });

  // TÂM AN FIX LỖI PROMPT: Thêm State quản lý bảng nhập tên khi lưu nhân vật
  const [showSaveCharModal, setShowSaveCharModal] = useState(false);
  const [saveCharData, setSaveCharData] = useState({ role: 'lao', name: '', age: 25, gender: 'Nữ' });

  // TÂM AN THÊM: Tự động nạp lại đường dẫn IDB cho Kho Mào Đầu khi khởi động
  useEffect(() => {
      const loadGreetingUrls = () => {
          const urls = { ...greetingAudioUrls };
          let changed = false;
          for (const [key, idbKey] of Object.entries(greetingMeta)) {
              if (!urls[key]) {
                  urls[key] = `idb://${idbKey}`;
                  changed = true;
              }
          }
          if (changed) setGreetingAudioUrls(urls);
      };
      loadGreetingUrls();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [greetingMeta]);

  // --- STATE VÀ LOGIC CHO BATCH GENERATION (DÙNG HOOK HOÀN TOÀN) ---
  const {
    isBatchGeneratingPoems,
    setIsBatchGeneratingPoems,
    batchPoemProgress,
    setBatchPoemProgress,
    isBatchGeneratingMeanings,
    setIsBatchGeneratingMeanings,
    batchMeaningProgress,
    setBatchMeaningProgress,
    isBatchGeneratingGreetings,
    setIsBatchGeneratingGreetings,
    batchGreetingProgress,
    setBatchGreetingProgress,
    isBatchGeneratingAIMeanings,
    setIsBatchGeneratingAIMeanings,
    batchAIMeaningProgress,
    setBatchAIMeaningProgress,
    handleBatchGenerateStanzas,
    handleBatchGenerateMeanings,
    handleBatchGenerateGreetings,
    handleBatchGenerateAIMeaningsText,
    isBatchGeneratingPoemsRef,
    isBatchGeneratingMeaningsRef,
    isBatchGeneratingGreetingsRef,
    isBatchGeneratingAIMeaningsRef
  } = usePoemGenerator({
    user,
    db,
    appId,
    appLanguage,
    poemDatabase,
    setPoemDatabase,
    greetingsDb,
    greetingAudioUrls,
    setGreetingAudioUrls,
    greetingMeta,
    geminiApiKeyRef,
    selectedAiConfigIdRef,
    cleanTextForTTS,
    showToastMsg
  });

  // --- BỘ ĐẾM THỜI GIAN CHỜ (IDLE TIMER) ---
  // Dùng useRef thay useState để KHÔNG gây re-render context mỗi giây
  const lastMessageTimeRef = useRef(Date.now());
  const idleSecondsRef = useRef(0);

  // Vẫn giữ state để NormalModePanel display cập nhật - nhưng chỉ update mỗi 10 giây
  const [idleSeconds, setIdleSeconds] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          idleSecondsRef.current = Math.floor((Date.now() - lastMessageTimeRef.current) / 1000);
          // Chỉ update state mỗi 10 giây để giảm re-render tần suất cao
          setIdleSeconds(idleSecondsRef.current);
      }, 10000);
      return () => clearInterval(interval);
  }, []);

  // Khi có message mới, reset timer
  const resetIdleTimer = () => {
      lastMessageTimeRef.current = Date.now();
      idleSecondsRef.current = 0;
      setIdleSeconds(0);
  };

  // --- STATE CHO ĐẨY AUDIO LÊN MÂY (THỦ CÔNG) ---
  const [isUploadingAudios, setIsUploadingAudios] = useState(false);
  const [uploadAudioProgress, setUploadAudioProgress] = useState({ current: 0, total: 0 });

  const savePoemDatabase = (newDb: any[]) => {
      setPoemDatabase(newDb);
      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
  };


  // Hàm phụ trợ: Chạy ngầm để copy file âm thanh từ Kho Cá Nhân sang Kho Chung
  const migrateAudiosToPublicAsync = async (database: any[], uid: string) => {
      let migratedCount = 0;
      for (const poem of database) {
          for (const stanza of poem.stanzas) {
              if (stanza.isSaved) {
                  try {
                      // Tìm trong kho cá nhân cũ
                      const privateAudioRef = doc(db, 'artifacts', appId, 'users', uid, 'stanza_audios', stanza.id);
                      const pSnap = await getDoc(privateAudioRef);
                      if (pSnap.exists()) {
                          // Copy sang kho chung
                          const publicAudioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
                          await setDoc(publicAudioRef, pSnap.data());
                          migratedCount++;
                      }
                  } catch (err: any) {
                      console.warn("Lỗi khi copy âm thanh cũ:", stanza.id, err);
                  }
              }
          }
      }
      if (migratedCount > 0) {
          showToastMsg(`Hoàn tất! Đã copy ${migratedCount} file pháp âm sang Kho Chung. Giờ ai cũng có thể dùng!`, 'success', 6000);
      }
  };

  const handleSyncFromCloud = async () => {
      if (!user || !db) {
          showToastMsg('Chưa kết nối được máy chủ Đám mây.', 'error');
          return;
      }
      setIsCloudSyncing(true);
      try {
          // BƯỚC 1: Ưu tiên tìm trong Kho Chung (Public) trước
          const publicDbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
          const publicSnap = await getDoc(publicDbRef);
          
          if (publicSnap.exists()) {
              const cloudData = publicSnap.data().database;
              setPoemDatabase(cloudData);
              localStorage.setItem('taman_poem_db', JSON.stringify(cloudData));
              showToastMsg('Đã tải Dữ liệu. Đang tự động lôi file âm thanh từ mây về...', 'loading', 4000);

              // TÂM AN FIX TỐI THƯỢNG: Khôi phục hàng loạt file âm thanh từ mây về ổ cứng (Background Hydration)
              let restoredCount = 0;
              for (const p of cloudData) {
                  for (const s of p.stanzas) {
                      if (s.isSaved && s.audioUrl && s.audioUrl.startsWith('idb://')) {
                          const idbKey = s.audioUrl.replace('idb://', '');
                          const localBlob = await idb.get(idbKey);
                          if (!localBlob) {
                              try {
                                  const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', s.id);
                                  const snap = await getDoc(audioRef);
                                  if (snap.exists()) {
                                      const res = await fetch(snap.data().base64);
                                      const blob = await res.blob();
                                      await idb.set(idbKey, blob); // Bơm thẳng vào ổ cứng
                                      restoredCount++;
                                  }
                              } catch(e) { console.warn("Lỗi tải lại audio:", e); }
                          }
                      }
                  }
              }
              
              if (restoredCount > 0) {
                  showToastMsg(`Đã lôi thành công ${restoredCount} file mp3 từ Đám mây về máy!`, 'success', 6000);
              } else {
                  showToastMsg('Mọi file âm thanh đều đã có sẵn trên thiết bị của bạn.', 'success', 3000);
              }

          } else {
              // BƯỚC 2: Nếu Kho Chung trống, lặn tìm trong Kho Cá Nhân cũ của tài khoản này
              const privateDbRef = doc(db, 'artifacts', appId, 'users', user.uid, 'metadata', 'poem_db');
              const privateSnap = await getDoc(privateDbRef);
              
              if (privateSnap.exists()) {
                  showToastMsg('Phát hiện dữ liệu cá nhân cũ! Đang tự động chuyển sang Kho Chung...', 'loading', 6000);
                  const oldData = privateSnap.data().database;
                  
                  // Copy cấu trúc sang Kho Chung
                  await setDoc(publicDbRef, { database: oldData, timestamp: Date.now() });
                  
                  // Kích hoạt tiến trình copy Âm Thanh chạy ngầm
                  migrateAudiosToPublicAsync(oldData, user.uid);
                  
                  setPoemDatabase(oldData);
                  localStorage.setItem('taman_poem_db', JSON.stringify(oldData));
                  showToastMsg('Đã khôi phục Cấu trúc Kệ. Các file âm thanh đang được copy ngầm...', 'success', 5000);
              } else {
                  showToastMsg('Kho Chung chưa có dữ liệu và không tìm thấy bản sao lưu cá nhân cũ.', 'info');
              }
          }
      } catch (e) {
          console.error(e);
          showToastMsg('Lỗi khi tải dữ liệu đám mây.', 'error');
      } finally {
          setIsCloudSyncing(false);
      }
  };

  const handleBackupToCloud = async () => {
      if (!user || !db) {
          showToastMsg('Chưa kết nối được máy chủ Đám mây.', 'error');
          return;
      }
      setIsCloudSyncing(true);
      try {
          // TÂM AN FIX: Đổi đường dẫn lưu cấu trúc Database sang Kho Chung
          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
          await setDoc(dbRef, { database: poemDatabase, timestamp: Date.now() });
          showToastMsg('Đã sao lưu thủ công Cấu trúc & Tags lên Kho Chung.', 'success');
      } catch(e) {
          showToastMsg('Lỗi khi sao lưu dữ liệu.', 'error');
      } finally {
          setIsCloudSyncing(false);
      }
  };

  // --- HÀM BƠM AUDIO LÊN MÂY THỦ CÔNG (ĐÃ TỐI ƯU SIÊU TỐC - SIZE AWARE BATCHING V2) ---
  const handlePushAudiosToCloud = async () => {
      if (!user || !db) {
          showToastMsg('Chưa kết nối được máy chủ Đám mây.', 'error');
          return;
      }

      // Lọc ra các đoạn đã lưu cục bộ (Có savedKey) để đẩy lên
      const itemsToUpload: any[] = [];
      poemDatabase.forEach((p: any) => {
          p.stanzas.forEach((s: any) => {
              if (s.isSaved && s.savedKey) {
                  itemsToUpload.push({ type: 'stanza', id: s.id, savedKey: s.savedKey });
              }
              if (s.isMeaningSaved && s.meaningSavedKey) {
                  itemsToUpload.push({ type: 'meaning', id: s.id, savedKey: s.meaningSavedKey });
              }
          });
      });

      if (itemsToUpload.length === 0) {
          showToastMsg('Không có pháp âm nào lưu trong ổ cứng thiết bị này để đẩy lên.', 'info');
          return;
      }

      setIsUploadingAudios(true);
      setUploadAudioProgress({ current: 0, total: itemsToUpload.length });
      showToastMsg(`Đang khởi động Đóng gói thông minh (Size-Aware) cho ${itemsToUpload.length} file...`, 'loading', 5000);

      let processedCount = 0;

      // TÂM AN GIẢI QUYẾT LỖI TỐI THƯỢNG (Size-Aware Batching V2):
      // Gom 5MB hoặc tối đa 150 file vào một "chuyến xe" (Batch) để gửi đi một lần.
      // Tốc độ tối đa, tận dụng hết băng thông mà không làm treo máy chủ.
      const BATCH_MAX_SIZE = 5 * 1024 * 1024; // 5 Megabytes
      const BATCH_MAX_OPS = 150; 

      try {
          let batch = writeBatch(db);
          let currentBatchSize = 0;
          let currentBatchOps = 0;

          for (let i = 0; i < itemsToUpload.length; i++) {
              const item = itemsToUpload[i];
              let base64Data = null;
              let docSize = 0;

              try {
                  const blob = await idb.get(item.savedKey);
                  if (blob) {
                      base64Data = await blobToBase64(blob);
                      docSize = base64Data.length;
                  }
              } catch (err: any) {
                  console.warn(`Lỗi đọc file ${item.id}:`, err);
              }

              if (base64Data) {
                  // Firebase giới hạn 1 document tối đa 1MB (1,048,576 bytes)
                  if (docSize > 1040000) {
                      console.warn(`File ${item.id} vượt quá 1MB. Bỏ qua.`);
                      processedCount++;
                      continue;
                  }

                  // NẾU XE ĐÃ ĐẦY -> GỬI XE NÀY ĐI VÀ LẬP TỨC GỌI XE MỚI
                  if (currentBatchSize + docSize >= BATCH_MAX_SIZE || currentBatchOps >= BATCH_MAX_OPS) {
                      if (currentBatchOps > 0) {
                          try {
                              await batch.commit(); // Nhấn nút gửi đi
                          } catch (commitErr) {
                              console.error("Lỗi mạng khi đẩy chuyến xe:", commitErr);
                          }
                          
                          // TÂM AN FIX LỖI "AFTER COMMIT() HAS BEEN CALLED":
                          // Bắt buộc phải gọi lại hàm writeBatch(db) để xóa sạch chuyến xe cũ.
                          batch = writeBatch(db); 
                          currentBatchSize = 0;
                          currentBatchOps = 0;
                          
                          // Nghỉ thở siêu ngắn (50ms) để Firebase dọn rác RAM
                          await new Promise(resolve => setTimeout(resolve, 50));
                      }
                  }

                  // Xếp hàng lên chuyến xe hiện tại
                  try {
                      const collectionName = item.type === 'stanza' ? 'stanza_audios' : 'meaning_audios';
                      const audioRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, item.id);
                      batch.set(audioRef, { base64: base64Data, timestamp: Date.now() });

                      currentBatchSize += docSize;
                      currentBatchOps++;
                  } catch (setErr) {
                      console.warn(`Lỗi đặt hàng lên xe ${item.id}:`, setErr);
                  }
              }

              processedCount++;
              
              // Cập nhật UI mượt mà, thấy rõ % nhảy
              if (processedCount % 5 === 0 || processedCount === itemsToUpload.length) {
                  setUploadAudioProgress({ current: processedCount, total: itemsToUpload.length });
              }
          }

          // Chuyến xe cuối cùng (Gửi nốt số hàng còn sót lại)
          if (currentBatchOps > 0) {
              try {
                  await batch.commit();
              } catch (commitErr) {
                  console.error("Lỗi khi đẩy chuyến xe cuối:", commitErr);
              }
          }

          showToastMsg(`Tuyệt đỉnh! Đã bơm siêu tốc thành công ${processedCount} file pháp âm lên Đám mây.`, 'success', 8000);
      } catch (error) {
          console.error("Lỗi luồng tải lên:", error);
          showToastMsg('Mạng bị nghẽn trong lúc đẩy cụm dữ liệu. Vui lòng thử lại.', 'error', 6000);
      } finally {
          setIsUploadingAudios(false);
          setTimeout(() => setUploadAudioProgress({ current: 0, total: 0 }), 1000);
      }
  };

  // --- TÂM AN FIX: HÀM GỘP THÔNG MINH ĐA TẦNG (SMART MERGE V4) DÙNG CHUNG ---
  const performSmartMerge = async (parsedSource: any[], currentDb: any[]) => {
      const allHistoricalStanzas: any[] = [];

      // 1. Quét lịch sử ở Trình duyệt (Local)
      try {
          const localDb = JSON.parse(localStorage.getItem('taman_poem_db') || '[]');
          localDb.forEach((p: any, pIdx: number) => p.stanzas.forEach((s: any, sIdx: number) => {
              if (s.isSaved || s.isMeaningSaved) allHistoricalStanzas.push({ ...s, poemIndex: pIdx, stanzaIndex: sIdx });
          }));
      } catch(e) {}

      // 2. Quét lịch sử ở Đám Mây (Cloud Metadata)
      if (user && db) {
          try {
              const snap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db'));
              if (snap.exists() && snap.data().database) {
                  snap.data().database.forEach((p: any, pIdx: number) => p.stanzas.forEach((s: any, sIdx: number) => {
                      if (s.isSaved || s.isMeaningSaved) allHistoricalStanzas.push({ ...s, poemIndex: pIdx, stanzaIndex: sIdx });
                  }));
              }
          } catch(e) {}
      }

      const migrations: any[] = [];
      let retainedAudioCount = 0;
      
      // Vắt kiệt khoảng trắng để so sánh chữ siêu chuẩn xác
      const normalizeText = (text: string) => text ? text.replace(/\s+/g, '').toLowerCase() : '';

      // 3. Quét từng bài kệ và hợp nhất (Hỗ trợ Async/Await)
      const mergedDb = await Promise.all(parsedSource.map(async (sourcePoem: any, pIdx: number) => {
          const mergedStanzas = await Promise.all(sourcePoem.stanzas.map(async (sourceStanza: any, sIdx: number) => {
              
              // A. Tìm trong lịch sử Metadata
              let matchedOld = allHistoricalStanzas.find((old: any) => old.id === sourceStanza.id);
              if (!matchedOld) {
                  const sourceNormalized = normalizeText(sourceStanza.content);
                  matchedOld = allHistoricalStanzas.find((old: any) => normalizeText(old.content) === sourceNormalized);
              }
              if (!matchedOld) {
                  matchedOld = allHistoricalStanzas.find((old: any) => old.poemIndex === pIdx && old.stanzaIndex === sIdx);
              }

              const combinedTags = Array.from(new Set([...(sourceStanza.tags || []), ...(matchedOld?.tags || [])]));
              
              let finalAudioUrl = sourceStanza.audioUrl || null;
              let finalIsSaved = sourceStanza.isSaved || false;
              let finalSavedKey = sourceStanza.savedKey || null;

              let finalMeaningAudioUrl = sourceStanza.meaningAudioUrl || null;
              let finalIsMeaningSaved = sourceStanza.isMeaningSaved || false;
              let finalMeaningSavedKey = sourceStanza.meaningSavedKey || null;



              if (matchedOld) {
                  if (matchedOld.isSaved) {
                      retainedAudioCount++;
                      finalAudioUrl = matchedOld.audioUrl;
                      finalIsSaved = true;
                      finalSavedKey = matchedOld.savedKey;

                      if (matchedOld.id !== sourceStanza.id) {
                          migrations.push({ type: 'stanza', oldId: matchedOld.id, newId: sourceStanza.id });
                      }
                  }
                  if (matchedOld.isMeaningSaved) {
                      retainedAudioCount++;
                      finalMeaningAudioUrl = matchedOld.meaningAudioUrl;
                      finalIsMeaningSaved = true;
                      finalMeaningSavedKey = matchedOld.meaningSavedKey;

                      if (matchedOld.id !== sourceStanza.id) {
                          migrations.push({ type: 'meaning', oldId: matchedOld.id, newId: sourceStanza.id });
                      }
                  }
              } 
              // B. DEEP SCAN (Quét Đáy Biển): Nếu Metadata bị mất, trực tiếp mò tìm file MP3 mang tên ID này trên Mây
              if (!finalIsSaved && user && db) {
                  try {
                      const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', sourceStanza.id);
                      const audioSnap = await getDoc(audioRef);
                      if (audioSnap.exists()) {
                          retainedAudioCount++;
                          finalIsSaved = true;
                          // Gán tên tạm, khi người dùng bấm "Tải dữ liệu" nó sẽ tự động lôi file MP3 về ổ cứng
                          finalAudioUrl = `idb://saved_stanza_${sourceStanza.id}_recovered`; 
                          finalSavedKey = `saved_stanza_${sourceStanza.id}_recovered`;
                      }
                  } catch(e) {}
              }
              if (!finalIsMeaningSaved && user && db) {
                  try {
                      const mAudioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', sourceStanza.id);
                      const mAudioSnap = await getDoc(mAudioRef);
                      if (mAudioSnap.exists()) {
                          retainedAudioCount++;
                          finalIsMeaningSaved = true;
                          finalMeaningAudioUrl = `idb://saved_meaning_${sourceStanza.id}_recovered`; 
                          finalMeaningSavedKey = `saved_meaning_${sourceStanza.id}_recovered`;
                      }
                  } catch(e) {}
              }

              return {
                  ...sourceStanza,
                  tags: combinedTags,
                  audioUrl: finalAudioUrl,
                  isSaved: finalIsSaved,
                  savedKey: finalSavedKey,
                  meaningAudioUrl: finalMeaningAudioUrl,
                  isMeaningSaved: finalIsMeaningSaved,
                  meaningSavedKey: finalMeaningSavedKey
              };
          }));
          return { ...sourcePoem, title: sourcePoem.title, stanzas: mergedStanzas };
      }));

      return { mergedDb, migrations, retainedAudioCount };
  };

  // --- NÚT ADMIN - ÉP ĐỒNG BỘ MÃ NGUỒN LÊN ĐÁM MÂY ---
  const handlePushSourceToCloud = () => {
      setConfirmDialog({
          isOpen: true,
          message: 'CÔNG CỤ ADMIN: Chức năng này sẽ lấy Kệ từ Mã nguồn mới nhất gộp vào Kho hiện tại. Các file Âm thanh đã lưu sẽ được tự động giữ lại. Tiếp tục?',
          onConfirm: async () => {
              setIsCloudSyncing(true);
              try {
                  showToastMsg('Đang quét sâu đáy biển để khôi phục Âm thanh...', 'loading', 0);
                  
                  const { mergedDb, migrations, retainedAudioCount } = await performSmartMerge(POEM_DATABASE, poemDatabase);

                  setPoemDatabase(mergedDb);
                  localStorage.setItem('taman_poem_db', JSON.stringify(mergedDb));

                  if (user && db) {
                      const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
                      await setDoc(dbRef, { database: mergedDb, timestamp: Date.now() });

                      if (migrations.length > 0) {
                          showToastMsg(`Đang nối lại ${migrations.length} file âm thanh bị đứt link...`, 'loading', 0);
                          for (const mig of migrations) {
                              try {
                                  const collectionName = mig.type === 'stanza' ? 'stanza_audios' : 'meaning_audios';
                                  const oldRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.oldId);
                                  const snap = await getDoc(oldRef);
                                  if (snap.exists()) {
                                      const newRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.newId);
                                      await setDoc(newRef, snap.data()); 
                                  }
                              } catch (e) {}
                          }
                      }

                      if (retainedAudioCount > 0) {
                          showToastMsg(`Thành công! Đã đồng bộ Code và TÌM THẤY ${retainedAudioCount} file MP3 cũ.`, 'success', 7000);
                      } else {
                          showToastMsg(`Đã cập nhật Code, nhưng KHÔNG CÓ file MP3 cũ nào được tìm thấy trên Đám mây.`, 'error', 8000);
                      }
                  } else {
                      showToastMsg('Đã cập nhật bài kệ mới vào giao diện. (Chưa đẩy lên Cloud vì thiếu mạng)', 'info', 6000);
                  }
              } catch(e) {
                  console.error(e);
                  showToastMsg('Lỗi khi đồng bộ dữ liệu.', 'error');
              } finally {
                  setIsCloudSyncing(false);
              }
          }
      });
  };

  // --- TỰ ĐỘNG ĐỒNG BỘ VÀ TẢI ÂM THANH KHI ĐĂNG NHẬP (BACKGROUND HYDRATION) ---
  const hasAutoSyncedRef = useRef(false);

  useEffect(() => {
      if (!user || !db || hasAutoSyncedRef.current) return;

      const performAutoSync = async () => {
          hasAutoSyncedRef.current = true;
          
          try {
              // 1. Lấy dữ liệu cấu trúc mới nhất từ Đám mây
              const publicDbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              const publicSnap = await getDoc(publicDbRef);
              
              let currentDbToUse = poemDatabase;
              let isCloudDataLoaded = false;

              if (publicSnap.exists()) {
                  const cloudData = publicSnap.data().database;
                  currentDbToUse = cloudData;
                  isCloudDataLoaded = true;
              }

              // 2. Gộp với Code cứng (phòng khi Admin vừa thêm bài mới vào mã nguồn)
              const { mergedDb, migrations } = await performSmartMerge(POEM_DATABASE, currentDbToUse);
              
              // Cập nhật giao diện lập tức
              setPoemDatabase(mergedDb);
              localStorage.setItem('taman_poem_db', JSON.stringify(mergedDb));
              
              // Nếu có sự thay đổi cấu trúc so với Cloud, đẩy cập nhật lên Cloud
              if (isCloudDataLoaded && JSON.stringify(mergedDb) !== JSON.stringify(currentDbToUse)) {
                  await setDoc(publicDbRef, { database: mergedDb, timestamp: Date.now() }).catch(()=>{});
                  // Fix đứt link nếu ID kệ thay đổi
                  if (migrations.length > 0) {
                      for (const mig of migrations) {
                          try {
                              const collectionName = mig.type === 'stanza' ? 'stanza_audios' : 'meaning_audios';
                              const oldRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.oldId);
                              const snap = await getDoc(oldRef);
                              if (snap.exists()) {
                                  const newRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.newId);
                                  await setDoc(newRef, snap.data()).catch(()=>{}); 
                              }
                          } catch (e) {}
                      }
                  }
              }

              // 3. CHIẾN DỊCH QUÉT VÀ TẢI MP3 NGẦM VỀ MÁY MỚI (BACKGROUND HYDRATION)
              let missingFromIdb = [];
              for (const p of mergedDb) {
                  for (const s of p.stanzas) {
                      // Nếu UI báo là đã có File MP3, tiến hành kiểm tra dưới ổ cứng
                      if (s.isSaved && s.audioUrl && s.audioUrl.startsWith('idb://')) {
                          const idbKey = s.audioUrl.replace('idb://', '');
                          const localBlob = await idb.get(idbKey);
                          if (!localBlob) {
                              missingFromIdb.push({ type: 'stanza', stanza: s, idbKey });
                          }
                      }
                      if (s.isMeaningSaved && s.meaningAudioUrl && s.meaningAudioUrl.startsWith('idb://')) {
                          const idbKey = s.meaningAudioUrl.replace('idb://', '');
                          const localBlob = await idb.get(idbKey);
                          if (!localBlob) {
                              missingFromIdb.push({ type: 'meaning', stanza: s, idbKey });
                          }
                      }
                  }
              }

              // Nếu ổ cứng thiếu file, tự động lôi từ mây về
              if (missingFromIdb.length > 0) {
                  showToastMsg(`Thiết bị mới: Đang tự động kéo ${missingFromIdb.length} file pháp âm từ Đám mây về máy...`, 'loading', 6000);
                  
                  let restoredCount = 0;
                  const BATCH_SIZE = 5; // Tải 5 file cùng lúc để không nghẽn mạng

                  for (let i = 0; i < missingFromIdb.length; i += BATCH_SIZE) {
                      const batch = missingFromIdb.slice(i, i + BATCH_SIZE);
                      await Promise.all(batch.map(async ({ type, stanza, idbKey }) => {
                          try {
                              const collectionName = type === 'stanza' ? 'stanza_audios' : 'meaning_audios';
                              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, stanza.id);
                              const snap = await getDoc(audioRef);
                              if (snap.exists() && snap.data().base64) {
                                  const res = await fetch(snap.data().base64);
                                  const blob = await res.blob();
                                  await idb.set(idbKey, blob); // Lưu vào ổ cứng trình duyệt
                                  restoredCount++;
                              }
                          } catch (e) {
                              console.warn(`Lỗi kéo MP3 ${stanza.id}:`, e);
                          }
                      }));
                  }
                  
                  if (restoredCount > 0) {
                      showToastMsg(`Hoàn tất! Đã đồng bộ thành công ${restoredCount} file mp3. Bây giờ Lão có thể đọc kệ rồi!`, 'success', 8000);
                  }
              }

          } catch (e) {
              console.error("Lỗi đồng bộ tự động:", e);
          }
      };

      // Chạy ngầm sau 2s để không làm lag giao diện lúc vừa vào App
      setTimeout(performAutoSync, 2000);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, db]);


  // --- HÀM NHẬP MÃ JSON TRỰC TIẾP TỪ GIAO DIỆN ---
  const handleImportPoemJson = () => {
      if (!importPoemJson.trim()) return;
      try {
          const parsedSource = JSON.parse(importPoemJson);
          if (!Array.isArray(parsedSource)) {
              showToastMsg('Định dạng không hợp lệ. Phải là một mảng (Array) bắt đầu bằng dấu ngoặc vuông [', 'error', 5000);
              return;
          }

          setConfirmDialog({
              isOpen: true,
              message: 'Hệ thống sẽ gộp dữ liệu JSON mới vào kho hiện tại. Các file Âm thanh đã lưu sẽ được tự động giữ lại. Tiếp tục?',
              onConfirm: async () => {
                  setIsCloudSyncing(true);
                  try {
                      showToastMsg('Đang quét sâu đáy biển để khôi phục Âm thanh...', 'loading', 0);
                      
                      const { mergedDb, migrations, retainedAudioCount } = await performSmartMerge(parsedSource, poemDatabase);

                      setPoemDatabase(mergedDb);
                      localStorage.setItem('taman_poem_db', JSON.stringify(mergedDb));

                      if (user && db) {
                          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
                          await setDoc(dbRef, { database: mergedDb, timestamp: Date.now() });

                          if (migrations.length > 0) {
                              showToastMsg(`Đang nối lại ${migrations.length} file âm thanh bị đứt link...`, 'loading', 0);
                              for (const mig of migrations) {
                                  try {
                                      const oldRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', mig.oldId);
                                      const snap = await getDoc(oldRef);
                                      if (snap.exists()) {
                                          const newRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', mig.newId);
                                          await setDoc(newRef, snap.data());
                                      }
                                  } catch (e) {}
                              }
                          }
                          
                          if (retainedAudioCount > 0) {
                              showToastMsg(`Hoàn tất! Đã chèn JSON và TÌM THẤY ${retainedAudioCount} file MP3 cũ.`, 'success', 7000);
                          } else {
                              showToastMsg(`Đã chèn JSON, nhưng KHÔNG CÓ file MP3 cũ nào được tìm thấy trên Đám mây.`, 'error', 8000);
                          }
                      } else {
                          showToastMsg('Đã cập nhật bài kệ vào máy cá nhân. (Chưa đẩy lên Cloud vì không có mạng)', 'info', 6000);
                      }

                      setShowImportPoemModal(false);
                      setImportPoemJson('');
                  } catch (mergeError) {
                      console.error("Merge Error:", mergeError);
                      showToastMsg('Lỗi khi gộp dữ liệu.', 'error', 6000);
                  } finally {
                      setIsCloudSyncing(false);
                  }
              }
          });
      } catch (error) {
          console.error("JSON Parse Error:", error);
          showToastMsg('Mã JSON bị lỗi cú pháp. Vui lòng kiểm tra lại dấu phẩy, ngoặc kép...', 'error', 6000);
      }
  };

  // --- TÂM AN THÊM: HÀM NHẬP KỆ TỪ FILE TEXT (.TXT) TỰ ĐỘNG PHÂN TÍCH LÕI V2 ---
  const handleImportTxtPoem = async (e: any) => {
      const file = e.target.files[0];
      if (!file) return;

      showToastMsg(`Đang dùng Trí tuệ Nhân tạo nội bộ phân tích file ${file.name}...`, 'loading', 0);

      try {
          const text = await file.text();
          const lines = text.split('\n');
          const parsedPoems: any[] = [];

          let currentPoem: any = null;
          let currentStanzaLines: any[] = [];
          let currentMeaningLines: any[] = [];
          let isParsingMeaning = false;

          const saveCurrentStanza = () => {
              if (currentStanzaLines.length > 0 && currentPoem) {
                  const content = currentStanzaLines.join('\n').trim();
                  if (content) {
                      currentPoem.stanzas.push({
                          id: `p_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                          tags: ['kệ mới'], 
                          content: content,
                          meaning: '',
                          audioUrl: null,
                          isSaved: false
                      });
                  }
                  currentStanzaLines = [];
              }
          };

          const saveCurrentPoem = () => {
              saveCurrentStanza();
              if (currentPoem && currentPoem.stanzas.length > 0) {
                  if (currentMeaningLines.length > 0) {
                      // Gom toàn bộ văn bản ý nghĩa vào đoạn kệ ĐẦU TIÊN để đọc liền mạch
                      currentPoem.stanzas[0].meaning = currentMeaningLines.join('\n').trim();
                  }
                  parsedPoems.push(currentPoem);
              }
          };

          for (let i = 0; i < lines.length; i++) {
              let line = lines[i].trim();
              
              if (!line) {
                  if (!isParsingMeaning) saveCurrentStanza(); // Dòng trống cắt nhịp thơ
                  continue;
              }

              // 1. BỘ LỌC RÁC (FOOTER / NGÀY THÁNG / LỜI HỒI HƯỚNG)
              const lowerLine = line.toLowerCase();
              if (
                  lowerLine === 'tam vô' || 
                  lowerLine.match(/^\d{1,2}\/\s*\d{1,2}\/\s*\d{4}$/) || // Ví dụ: 13/ 09/2020
                  lowerLine.includes('nguyện đem công đức này') || 
                  lowerLine.includes('hồi hướng khắp tất cả') || 
                  lowerLine.includes('hồi hướng đến tất cả') ||
                  lowerLine.includes('đệ tử và chúng sanh') || 
                  lowerLine.includes('tôn tử và chúng sanh') || 
                  lowerLine.includes('con cháu cùng chúng sanh') || 
                  lowerLine.includes('đều đồng thành phật đạo') ||
                  lowerLine.includes('nam mô bổn sư') ||
                  lowerLine.includes('nam mô tam vô') ||
                  line.includes('***') || 
                  line.includes('---') ||
                  line.includes('===') ||
                  lowerLine.startsWith('tâm an ở') ||
                  lowerLine.startsWith('câu 1:') ||
                  lowerLine.includes('kính trình kệ') ||
                  lowerLine.includes('cúng dường sư cha')
              ) {
                  saveCurrentStanza(); 
                  continue;
              }

              // 2. BỘ NHẬN DIỆN TỰA ĐỀ THÔNG MINH
              let isNewTitle = false;
              let titleText = "";

              // Phân tích 1: Bài kệ có đánh số (VD: 1. Tam Vô, 001.TẶNG PHỤ NỮ, 163. ĐỒNG NHẤT DẠ)
              const numMatch = line.match(/^0*(\d+)[.\-\s]+(.*)$/);
              // Phân tích 2: Bài kệ in hoa toàn bộ (không phải chữ Tam Vô)
              const isAllCaps = line === line.toUpperCase() && line.length > 3 && line.length < 50 && !line.includes(':');

              if (numMatch) {
                  isNewTitle = true;
                  titleText = `Bài ${numMatch[1]}: ${numMatch[2]}`;
              } else if (line === '3.3T') {
                  isNewTitle = true;
                  titleText = "Bài 3.3T";
              } else if (isAllCaps && !isParsingMeaning && currentStanzaLines.length === 0) {
                  // Dòng in hoa nằm lơ lửng ngay khi vừa kết thúc bài trước
                  isNewTitle = true;
                  titleText = line;
              } 

              // Phân tích 3: Bắt ngoại lệ các bài kệ không có số ở file của con
              if (line === 'Vô tướng' || line === 'Vô niệm' || line === 'Nó Không Là Gì Cả' || line === 'Dạo mùa' || line === 'Vô Tướng') {
                   isNewTitle = true;
                   titleText = line;
              }

              if (isNewTitle) {
                  saveCurrentPoem(); // Chốt bài đang đọc
                  currentPoem = {
                      id: `poem_txt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                      title: titleText.replace(/\*/g, '').trim(),
                      stanzas: []
                  };
                  isParsingMeaning = false;
                  currentMeaningLines = [];
                  currentStanzaLines = [];
                  continue;
              }

              if (!currentPoem) continue; // Bỏ qua rác ở tít trên cùng của file

              // 3. BỘ NHẬN DIỆN PHẦN Ý NGHĨA (DI�??N GIẢI)
              if (lowerLine.startsWith('ý nghĩa') || lowerLine.startsWith('phân tích') || lowerLine.startsWith('giải thích') || lowerLine.startsWith('dưới đây là phân tích')) {
                  saveCurrentStanza(); // Chốt đoạn kệ lại
                  isParsingMeaning = true; // Chuyển luồng sang ghi chép ý nghĩa
                  currentMeaningLines.push(line);
                  continue;
              }

              // 4. BỘ HÃM THÔNG MINH (CHỐNG TRÀN Ý NGHĨA VÀO THƠ)
              // Thuật toán Look-ahead: Nếu đang đọc ý nghĩa, mà thấy 4 câu liên tiếp ngắn ngắn, in hoa chữ cái đầu -> Đích thị là Thơ của bài mới bị sót tựa đề!
              if (isParsingMeaning && line.length < 60) {
                  let nextL1 = lines[i+1] ? lines[i+1].trim() : '';
                  let nextL2 = lines[i+2] ? lines[i+2].trim() : '';
                  let nextL3 = lines[i+3] ? lines[i+3].trim() : '';
                  
                  const isCapitalized = (str: string) => str && str.length > 0 && str[0] === str[0].toUpperCase();
                  
                  if (isCapitalized(line) && isCapitalized(nextL1) && isCapitalized(nextL2) && isCapitalized(nextL3) && 
                      nextL1.length < 60 && nextL2.length < 60 && nextL3.length < 60) {
                      
                      // Ép chốt bài cũ và tạo bài mới ngầm
                      saveCurrentPoem();
                      currentPoem = {
                          id: `poem_txt_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                          title: `Kệ Pháp: ${line}`, // Lấy tạm câu 1 làm tựa đề
                          stanzas: []
                      };
                      isParsingMeaning = false;
                      currentMeaningLines = [];
                      currentStanzaLines = [line];
                      continue;
                  }
              }

              // 5. NẠP DỮ LIỆU VÀO ĐÚNG KHAY
              if (isParsingMeaning) {
                  currentMeaningLines.push(line);
              } else {
                  currentStanzaLines.push(line);
                  // Tự động chốt thành 1 đoạn nếu đủ 4 câu (Chuẩn kệ)
                  if (currentStanzaLines.length === 4) {
                      saveCurrentStanza();
                  }
              }
          }

          saveCurrentPoem(); // Chốt sổ bài cuối cùng của file

          if (parsedPoems.length === 0) {
              showToastMsg('Không tìm thấy bài kệ nào hợp lệ trong file TXT. Vui lòng đảm bảo các bài bắt đầu bằng số thứ tự (VD: 1. Tên Bài).', 'error', 6000);
              return;
          }

          // Kích hoạt thuật toán Gộp thông minh đa tầng (Smart Merge)
          setConfirmDialog({
              isOpen: true,
              message: `Tuyệt vời! Tâm An đã đọc và trích xuất thành công ${parsedPoems.length} bài kệ (cùng với phần diễn giải) từ file TXT.\n\nHệ thống sẽ gộp thông minh số kệ này vào kho hiện tại. Những bài trùng lặp sẽ tự động bị bỏ qua để bảo vệ các file âm thanh cũ của con. Con đồng ý tiến hành chứ?`,
              onConfirm: async () => {
                  setIsCloudSyncing(true);
                  try {
                      showToastMsg('Đang hợp nhất dữ liệu Kệ và Âm thanh. Xin hãy giữ màn hình...', 'loading', 0);
                      const { mergedDb, migrations, retainedAudioCount } = await performSmartMerge(parsedPoems, poemDatabase);

                      setPoemDatabase(mergedDb);
                      localStorage.setItem('taman_poem_db', JSON.stringify(mergedDb));

                      if (user && db) {
                          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
                          await setDoc(dbRef, { database: mergedDb, timestamp: Date.now() });

                          if (migrations.length > 0) {
                              for (const mig of migrations) {
                                  try {
                                      const collectionName = mig.type === 'stanza' ? 'stanza_audios' : 'meaning_audios';
                                      const oldRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.oldId);
                                      const snap = await getDoc(oldRef);
                                      if (snap.exists()) {
                                          const newRef = doc(db, 'artifacts', appId, 'public', 'data', collectionName, mig.newId);
                                          await setDoc(newRef, snap.data()); 
                                      }
                                  } catch (e) {}
                              }
                          }

                          showToastMsg(`Hoàn tất rực rỡ! Đã chèn các bài kệ mới và GIỮ LẠI ĐƯỢC ${retainedAudioCount} file Âm thanh cũ.`, 'success', 8000);
                      } else {
                          showToastMsg(`Đã cập nhật bài kệ vào máy cá nhân. (Chưa lưu lên Cloud vì thiết bị đang thiếu mạng)`, 'info', 6000);
                      }
                  } catch (mergeError) {
                      console.error(mergeError);
                      showToastMsg('Lỗi khi gộp dữ liệu.', 'error');
                  } finally {
                      setIsCloudSyncing(false);
                  }
              }
          });

      } catch (error) {
          console.error("Lỗi đọc file TXT:", error);
          showToastMsg('Không thể phân tích file. Vui lòng thử lại.', 'error');
      }
      e.target.value = ''; // Reset input để cho phép load lại file
  };

  // --- HÀM XUẤT FILE SAO LƯU TOÀN BỘ (CÓ TÙY CHỌN) ---
  const handleExportFullBackupClick = () => {
      setShowBackupOptionsModal(true);
  };

  const executeFullBackup = async () => {
      await executeFullBackupHelper({
          backupOptions,
          poemDatabase,
          greetingMeta,
          greetingAudioUrls,
          setBackupProgress,
          showToastMsg,
          setIsProcessingBackup,
          setShowBackupOptionsModal
      });
  };

  const handleImportFullBackup = async (e: any) => {
      await handleImportFullBackupHelper(e, {
          user,
          poemDatabase,
          setPoemDatabase,
          greetingMeta,
          setGreetingMeta,
          setBackupProgress,
          showToastMsg,
          setIsProcessingBackup,
          backupFileInputRef
      });
  };

  // --- HÀM KHÔI PHỤC TỪ LINK CŨ (Đã bị ẩn bớt trên UI nhưng vẫn giữ logic) ---
  const handleConnectOldLink = async () => {
      if (!oldLinkInput.trim()) return;
      
      // TÂM AN FIX 1: Chặn lỗi nếu chưa kết nối xong tài khoản Đám mây
      if (!user || !db) {
          showToastMsg('Hệ thống Đám mây chưa sẵn sàng. Vui lòng đợi trong giây lát.', 'error');
          return;
      }

      let oldAppId = oldLinkInput.trim();
      
      // TÂM AN FIX 2: Lọc chính xác mã ID của ứng dụng kể cả khi có biến số
      const match = oldLinkInput.match(/\/artifacts\/([^\/?#]+)/);
      if (match) {
          oldAppId = match[1];
      } else if (oldLinkInput.includes('http')) {
          showToastMsg('Link con dán không chứa Mã Kho. Hướng dẫn: �? Link cũ, con hãy bấm chuột phải vào hình Lão, chọn "Mở khung trong tab mới" (Open frame in new tab). Sau đó copy link ở tab mới dán vào đây nhé.', 'error', 12000);
          return;
      }
      
      const currentAppId = typeof (window as any).__app_id !== 'undefined' ? (window as any).__app_id : 'default-app-id';
      if (oldAppId === currentAppId) {
          showToastMsg('Đây chính là Mã Kho hiện tại. Vui lòng nhập Mã Kho cũ.', 'error');
          return;
      }

      setShowOldLinkModal(false);
      setIsCloudSyncing(true);
      try {
          showToastMsg('Đang phá vỡ không gian, tìm về kho dữ liệu của Link cũ...', 'loading', 0);
          const oldDbRef = doc(db, 'artifacts', oldAppId, 'public', 'data', 'poem_metadata', 'default_db');
          const snap = await getDoc(oldDbRef);
          
          if (snap.exists()) {
              const oldData = snap.data().database;
              showToastMsg('Đã tìm thấy Cấu trúc kệ cũ. Đang dời toàn bộ Âm thanh sang Link mới...', 'loading', 0);
              
              let audioCount = 0;
              
              for (const p of oldData) {
                  for (const s of p.stanzas) {
                      if (s.isSaved) {
                          try {
                              const oldAudioRef = doc(db, 'artifacts', oldAppId, 'public', 'data', 'stanza_audios', s.id);
                              const audioSnap = await getDoc(oldAudioRef);
                              if (audioSnap.exists()) {
                                  const newAudioRef = doc(db, 'artifacts', currentAppId, 'public', 'data', 'stanza_audios', s.id);
                                  await setDoc(newAudioRef, audioSnap.data());
                                  audioCount++;
                              }
                          } catch(e) {
                              // Bỏ qua lỗi nhỏ để tiếp tục
                          }
                      }
                  }
              }
              
              const newDbRef = doc(db, 'artifacts', currentAppId, 'public', 'data', 'poem_metadata', 'default_db');
              await setDoc(newDbRef, { database: oldData, timestamp: Date.now() });
              
              setPoemDatabase(oldData);
              localStorage.setItem('taman_poem_db', JSON.stringify(oldData));
              
              showToastMsg(`Tuyệt vời! Đã khôi phục và chuyển nhà thành công ${audioCount} file âm thanh sang Link mới này!`, 'success', 8000);
          } else {
              showToastMsg('Không tìm thấy dữ liệu ở Link này. Có thể Link bị sai hoặc Kho trống.', 'error', 6000);
          }
      } catch(e: any) {
          console.error("Lỗi khi kết nối Link chéo:", e);
          if (e.code === 'permission-denied' || (e.message && e.message.includes('Missing or insufficient permissions'))) {
              setConfirmDialog({
                  isOpen: true,
                  message: 'Tường lửa bảo mật của máy chủ đã chặn việc tải dữ liệu chéo giữa 2 đường link để bảo vệ quyền riêng tư.\n\nCÁCH DỌN NHÀ THỦ CÔNG:\n1. Con hãy quay lại Link Web Cũ, bấm nút "Xuất mã nguồn Kệ" (Màu xanh lá) để copy.\n2. Quay lại Link Web Mới này, bấm nút "Nhập mã JSON" (Màu hồng) và dán mã vừa copy vào.\n\nBấm "Đồng ý" để hệ thống tự động mở bảng Nhập mã cho con nhé!',
                  onConfirm: () => { setShowOldLinkModal(false); setShowImportPoemModal(true); }
              });
          } else {
              showToastMsg(`Lỗi kết nối Đám mây: ${e.message || 'Vui lòng thử lại sau.'}`, 'error');
          }
      } finally {
          setIsCloudSyncing(false);
          setOldLinkInput('');
      }
  };


  // --- Thêm state cho Kịch bản thủ công ---
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptText, setScriptText] = useState('');


  const triggerDownload = (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  const handleExportPoemDatabaseCode = () => {
      try {
          const exportData = poemDatabase.map(p => ({
              title: p.title,
              stanzas: p.stanzas.map((s: any) => ({
                  id: s.id,
                  tags: s.tags,
                  content: s.content,
                  meaning: s.meaning,
                  audioUrl: s.audioUrl,
                  isSaved: s.isSaved
              }))
          }));
          const jsonStr = JSON.stringify(exportData, null, 2);
          const blob = new Blob([jsonStr], { type: 'application/json' });
          triggerDownload(blob, `onglao_poem_database_${Date.now()}.json`);
          showToastMsg('Đã xuất bản mã cơ sở dữ liệu thành công!', 'success');
      } catch (err) {
          showToastMsg('Không xuất được cơ sở dữ liệu.', 'error');
      }
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
              const res = reader.result as string;
              resolve(res.substring(res.indexOf(',') + 1));
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  const handleDownloadAllPoemAudios = async () => {
      showToastMsg('Đang quét và tải xuống tất cả âm thanh...', 'loading', 0);
      try {
          let downloadCount = 0;
          for (const p of poemDatabase) {
              for (const s of p.stanzas) {
                  if (s.isSaved && s.savedKey) {
                      const blob = await idb.get(s.savedKey);
                      if (blob) {
                          const url = URL.createObjectURL(blob);
                          const filename = `${p.title.replace(/[^a-zA-Z0-9_]/g, '_')}_stanza_${s.id}.wav`;
                          
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = filename;
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          downloadCount++;
                          await new Promise(r => setTimeout(r, 200));
                      }
                  }
              }
          }
          if (downloadCount > 0) {
              showToastMsg(`Đã tải xuống thành công ${downloadCount} tệp âm thanh!`, 'success');
          } else {
              showToastMsg('Không tìm thấy tệp âm thanh nào được lưu.', 'info');
          }
      } catch (e) {
          console.warn("Lỗi tải tất cả âm thanh:", e);
          showToastMsg('Lỗi khi tải xuống các tệp âm thanh.', 'error');
      }
  };

  const handleGenerateGreetingVoice = async (category: string, index: number, text: string) => {
      const key = `${category}_${index}`;
      setGeneratingGreetings((prev: any) => ({ ...prev, [key]: true }));
      try {
          const optimizedText = cleanTextForTTS(text).split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
          const voiceName = "Algieba";
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

          const data = await fetchWithRetry(`/api/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
              body: JSON.stringify({
                  text: `${promptPrefix} ${optimizedText}`,
                  aiConfigId: selectedAiConfigIdRef.current
              })
          }, 3, 2000);

          const audioData = data && data.audioContent ? data.audioContent : null;
          if (audioData) {
              const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
              if (wavBlob) {
                  let finalAudioUrl = URL.createObjectURL(wavBlob);
                  
                  // Upload lên server disk để lưu trữ offline vĩnh viễn
                  try {
                      const formData = new FormData();
                      formData.append('audio', wavBlob, `greeting_${category}_${index}.wav`);
                      const uploadRes = await fetch('/api/audio/upload', {
                          method: 'POST',
                          body: formData
                      });
                      if (uploadRes.ok) {
                          const uploadData = await uploadRes.json();
                          if (uploadData.url) {
                              finalAudioUrl = uploadData.url;
                          }
                      }
                  } catch (err) {
                      console.error("Lỗi upload greeting audio:", err);
                  }

                  setGreetingAudioUrls((prev: any) => {
                      const next = { ...prev, [key]: finalAudioUrl };
                      localStorage.setItem('taman_greeting_audio_urls', JSON.stringify(next));
                      return next;
                  });
                  showToastMsg('Tạo pháp âm câu mào đầu thành công!', 'success');
              }
          } else {
              showToastMsg('Không tạo được pháp âm mào đầu.', 'error');
          }
      } catch (e) {
          console.warn(`Lỗi tạo âm mào đầu ${key}:`, e);
          showToastMsg('Không thể kết nối dịch vụ TTS.', 'error');
      } finally {
          setGeneratingGreetings((prev: any) => ({ ...prev, [key]: false }));
      }
  };

  const handleGenerateStanzaVoice = async (poemId: string, stanzaId: string, content: string) => {
      setGeneratingStanzas((prev: any) => ({ ...prev, [stanzaId]: true }));
      try {
          const optimizedText = content.split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
          const voiceName = "Algieba";
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

          const data = await fetchWithRetry(`/api/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
              body: JSON.stringify({
                  text: `${promptPrefix} ${optimizedText}`,
                  aiConfigId: selectedAiConfigIdRef.current
              })
          }, 3, 2000);

          const audioData = data && data.audioContent ? data.audioContent : null;
          if (audioData) {
              const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
              if (wavBlob) {
                  const finalIdbKey = `saved_stanza_${stanzaId}_${Date.now()}`;
                  await idb.set(finalIdbKey, wavBlob);
                  
                  if (user && db) {
                      const base64Data = await blobToBase64(wavBlob);
                      const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanzaId);
                      setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                  }

                  setPoemDatabase((prevDb: any) => {
                      const nextDb = prevDb.map((p: any) => p.id === poemId ? {
                          ...p,
                          stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? {
                              ...s,
                              isSaved: true,
                              savedKey: finalIdbKey,
                              audioUrl: `idb://${finalIdbKey}`
                          } : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                      return nextDb;
                  });

                  showToastMsg('Tạo pháp âm đoạn kệ thành công!', 'success');
              }
          } else {
              showToastMsg('Không tạo được pháp âm đoạn kệ.', 'error');
          }
      } catch (e) {
          console.warn(`Lỗi tạo âm đoạn kệ ${stanzaId}:`, e);
          showToastMsg('Không thể kết nối dịch vụ TTS.', 'error');
      } finally {
          setGeneratingStanzas((prev: any) => ({ ...prev, [stanzaId]: false }));
      }
  };

  const handleGenerateMeaningVoice = async (poemId: string, stanzaId: string, meaningText: string) => {
      setGeneratingMeanings((prev: any) => ({ ...prev, [stanzaId]: true }));
      try {
          const optimizedText = cleanTextForTTS(meaningText).split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
          const voiceName = "Algieba";
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, nhẹ nhàng, giảng giải chậm rãi, sâu sắc, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, gently explain, pause between lines, warm voice in ${appLanguage}: `;

          const data = await fetchWithRetry(`/api/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
              body: JSON.stringify({
                  text: `${promptPrefix} ${optimizedText}`,
                  aiConfigId: selectedAiConfigIdRef.current
              })
          }, 3, 2000);

          const audioData = data && data.audioContent ? data.audioContent : null;
          if (audioData) {
              const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
              if (wavBlob) {
                  const finalIdbKey = `saved_meaning_${stanzaId}_${Date.now()}`;
                  await idb.set(finalIdbKey, wavBlob);
                  
                  if (user && db) {
                      const base64Data = await blobToBase64(wavBlob);
                      const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanzaId);
                      setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                  }

                  setPoemDatabase((prevDb: any) => {
                      const nextDb = prevDb.map((p: any) => p.id === poemId ? {
                          ...p,
                          stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? {
                              ...s,
                              isMeaningSaved: true,
                              meaningSavedKey: finalIdbKey,
                              meaningAudioUrl: `idb://${finalIdbKey}`
                          } : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                      return nextDb;
                  });

                  showToastMsg('Tạo pháp âm ý nghĩa thành công!', 'success');
              }
          } else {
              showToastMsg('Không tạo được pháp âm ý nghĩa.', 'error');
          }
      } catch (e) {
          console.warn(`Lỗi tạo âm ý nghĩa ${stanzaId}:`, e);
          showToastMsg('Không thể kết nối dịch vụ TTS.', 'error');
      } finally {
          setGeneratingMeanings((prev: any) => ({ ...prev, [stanzaId]: false }));
      }
  };

  const handleSaveMeaningVoice = async (poemId: any, stanzaId: any, audioUrl: string) => {
      showToastMsg('Đang lưu diễn giải vào kho thiết bị và Kho Chung...', 'loading', 0);
      try {
          const blob = await fetch(audioUrl).then(r => r.blob());
          const idbKey = `saved_meaning_${stanzaId}_${Date.now()}`;
          await idb.set(idbKey, blob);
          
          if (user && db) {
              const base64Data = await blobToBase64(blob);
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanzaId);
              await setDoc(audioRef, { base64: base64Data, timestamp: Date.now() });
          }
          
          setPoemDatabase((prev: any) => {
              const newDb = prev.map((p: any) => p.id === poemId ? {
                  ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, isMeaningSaved: true, meaningAudioUrl: `idb://${idbKey}` } : s)
              } : p);
              localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
              return newDb;
          });
          showToastMsg('Đã lưu thành công!', 'success');
      } catch (err: any) {
          showToastMsg('Lỗi khi lưu.', 'error');
      }
  };

  const handleAddTag = async (poemId: string, stanzaId: string) => {
      const inputVal = newTagInputs[stanzaId] || '';
      if (!inputVal.trim()) return;
      
      const newTag = inputVal.trim();
      setPoemDatabase((prev: any) => {
          const newDb = prev.map((p: any) => p.id === poemId ? {
              ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, tags: Array.from(new Set([...s.tags, newTag])) } : s)
          } : p);
          localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
          
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              setDoc(dbRef, { database: newDb, timestamp: Date.now() }).catch(()=>{});
          }
          return newDb;
      });

      setNewTagInputs((prev: any) => ({ ...prev, [stanzaId]: '' }));
  };

  const handleRemoveTag = async (poemId: string, stanzaId: string, tagToRemove: string) => {
      setPoemDatabase((prev: any) => {
          const newDb = prev.map((p: any) => p.id === poemId ? {
              ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, tags: s.tags.filter((t: string) => t !== tagToRemove) } : s)
          } : p);
          localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
          
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              setDoc(dbRef, { database: newDb, timestamp: Date.now() }).catch(()=>{});
          }
          return newDb;
      });
  };

  const handleUpdatePoemContent = async (poemId: string, stanzaId: string, newContent: string) => {
      setPoemDatabase((prev: any) => {
          const newDb = prev.map((p: any) => p.id === poemId ? {
              ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, content: newContent } : s)
          } : p);
          localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
          
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              setDoc(dbRef, { database: newDb, timestamp: Date.now() }).catch(()=>{});
          }
          return newDb;
      });
  };

  const handleUpdatePoemMeaning = async (poemId: string, stanzaId: string, newMeaning: string) => {
      setPoemDatabase((prev: any) => {
          const newDb = prev.map((p: any) => p.id === poemId ? {
              ...p, stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? { ...s, meaning: newMeaning } : s)
          } : p);
          localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
          
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              setDoc(dbRef, { database: newDb, timestamp: Date.now() }).catch(()=>{});
          }
          return newDb;
      });
  };

  const handleGenerateAIMeaningText = async (poemId: string, stanzaId: string, content: string, title: string) => {
      setIsGeneratingAIMeaning((prev: any) => ({ ...prev, [stanzaId]: true }));
      try {
          const wholePoemText = poemDatabase.find(p => p.id === poemId)?.stanzas.map((s: any, idx: number) => `Đoạn ${idx + 1}:\n${s.content}`).join('\n\n') || content;
          const stanzaIndex = poemDatabase.find(p => p.id === poemId)?.stanzas.findIndex((s: any) => s.id === stanzaId) ?? 0;

          const prompt = `Bạn là Lão, một bậc minh sư thấu hiểu giáo lý của Sư Cha Tam Vô (vô ngã, vô tướng, vô niệm, thoát luân hồi, nhận ra bản thể chân thật).
Hãy diễn giải ý nghĩa của ĐOẠN KỆ sau đây bằng ngôn ngữ ${appLanguage}. 
LƯU Ý QUAN TRỌNG: Đoạn kệ này nằm trong bài kệ mang tên "${title}". Để đảm bảo tính logic xuyên suốt, đây là toàn bộ nội dung bài kệ:
${wholePoemText}

Nhiệm vụ của bạn: CHỈ diễn giải ý nghĩa cho Đoạn ${stanzaIndex + 1} có nội dung là:
"${content}"

YÊU CẦU ÉP BUỘC:
1. Giải thích súc tích, dễ hiểu, đi thẳng vào bản chất, mộng ảo, và sự tỉnh thức.
2. Độ dài khoảng 2-4 câu, không quá dài dòng.
3. KHÔNG chép lại nguyên văn đoạn kệ.
4. Thay thế ký tự gạch chéo (/) bằng dấu phẩy (,).
5. KHÔNG viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu.
6. Không mào đầu như "Ý nghĩa là...", chỉ in ra đoạn diễn giải trực tiếp.`;

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
              const cleanText = rawResult.trim();
              setPoemDatabase((prevDb: any) => {
                  const nextDb = prevDb.map((p: any) => p.id === poemId ? {
                      ...p,
                      stanzas: p.stanzas.map((s: any) => s.id === stanzaId ? {
                          ...s,
                          meaning: cleanText
                      } : s)
                  } : p);
                  localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                  return nextDb;
              });
              showToastMsg('Đã tạo ý nghĩa bằng AI thành công!', 'success');
          } else {
              showToastMsg('Không tạo được ý nghĩa bằng AI.', 'error');
          }
      } catch (err: any) {
          console.error("Lỗi AI Meaning:", err);
          showToastMsg('Không thể kết nối dịch vụ AI.', 'error');
      } finally {
          setIsGeneratingAIMeaning((prev: any) => ({ ...prev, [stanzaId]: false }));
      }
  };



  const resolveStanzaAudioUrl = async (poemId: any, stanza: any, silent = false) => {
      if (!stanza.audioUrl || stanza.audioUrl === 'null' || stanza.audioUrl === 'undefined') {
          return null;
      }
      if (stanza.audioUrl.startsWith('idb://')) {
          const blob = await idb.get(stanza.audioUrl.replace('idb://', ''));
          if (blob) return URL.createObjectURL(blob);
      }
      
      if (stanza.isSaved && user && db) {
          if (!silent) showToastMsg('Đang kéo âm thanh từ Đám mây về máy...', 'loading', 0);
          setIsFetchingCloudAudio(true);
          try {
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
              const snap = await getDoc(audioRef);
              if (snap.exists()) {
                  const base64Data = snap.data().base64;
                  const res = await fetch(base64Data);
                  const blob = await res.blob();
                  
                  const newIdbKey = `saved_stanza_${stanza.id}_${Date.now()}`;
                  await idb.set(newIdbKey, blob);
                  
                  setPoemDatabase((prev: any) => {
                      const newDb = prev.map((p: any) => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {...s, audioUrl: `idb://${newIdbKey}`} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });
                  
                  if (!silent) showToastMsg('Lôi âm thanh từ mây về thành công!', 'success');
                  setIsFetchingCloudAudio(false);
                  return URL.createObjectURL(blob);
              } else {
                  if (!silent) showToastMsg('Không tìm thấy file mp3 trên Đám mây. Đã dọn dẹp dữ liệu ảo.', 'error');
                  
                  setPoemDatabase((prev: any) => {
                      const newDb = prev.map((p: any) => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {...s, isSaved: false, audioUrl: null, savedKey: null} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });

                  setIsFetchingCloudAudio(false);
                  return null;
              }
          } catch(e) {
              console.error("Lỗi tải cloud:", e);
              if (!silent) showToastMsg('Lỗi đường truyền Đám mây.', 'error');
              setIsFetchingCloudAudio(false);
          }
      }
      return stanza.audioUrl;
  };

  const resolveMeaningAudioUrl = async (poemId: any, stanza: any, silent = false) => {
      if (!stanza.meaningAudioUrl || stanza.meaningAudioUrl === 'null' || stanza.meaningAudioUrl === 'undefined') {
          return null;
      }
      if (stanza.meaningAudioUrl.startsWith('idb://')) {
          const blob = await idb.get(stanza.meaningAudioUrl.replace('idb://', ''));
          if (blob) return URL.createObjectURL(blob);
      }
      
      if (stanza.isMeaningSaved && user && db) {
          if (!silent) showToastMsg('Đang kéo giọng diễn giải từ Đám mây...', 'loading', 0);
          setIsFetchingCloudAudio(true);
          try {
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanza.id);
              const snap = await getDoc(audioRef);
              if (snap.exists()) {
                  const base64Data = snap.data().base64;
                  const res = await fetch(base64Data);
                  const blob = await res.blob();
                  
                  const newIdbKey = `saved_meaning_${stanza.id}_${Date.now()}`;
                  await idb.set(newIdbKey, blob);
                  
                  setPoemDatabase((prev: any) => {
                      const newDb = prev.map((p: any) => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {...s, meaningAudioUrl: `idb://${newIdbKey}`} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });
                  
                  if (!silent) showToastMsg('Tải giọng diễn giải thành công!', 'success');
                  setIsFetchingCloudAudio(false);
                  return URL.createObjectURL(blob);
              } else {
                  setPoemDatabase((prev: any) => {
                      const newDb = prev.map((p: any) => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {...s, isMeaningSaved: false, meaningAudioUrl: null, meaningSavedKey: null} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });
                  setIsFetchingCloudAudio(false);
                  return null;
              }
          } catch(e) {
              setIsFetchingCloudAudio(false);
          }
      }
      return stanza.meaningAudioUrl;
  };

  const resolveGreetingAudioUrl = async (key: string) => {
      let url = greetingAudioUrls[key];
      if (!url || url === 'null' || url === 'undefined') {
          return null;
      }
      if (url.startsWith('idb://')) {
          const blob = await idb.get(url.replace('idb://', ''));
          if (blob) return URL.createObjectURL(blob);
      }
      return url;
  };

  const getOrGenerateTransitionAudio = async (text: string, lang: string) => {
      const cacheKey = `transition_${lang}_${text.replace(/\s/g, '_')}`;
      if (transitionAudioUrls[cacheKey]) return transitionAudioUrls[cacheKey];

      const idbKey = `saved_${cacheKey}`;
      const blob = await idb.get(idbKey);
      if (blob) {
          const url = URL.createObjectURL(blob);
          setTransitionAudioUrls((prev: any) => ({ ...prev, [cacheKey]: url }));
          return url;
      }

      try {
          const voiceName = "Algieba";
          const promptPrefix = lang === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, pause between lines, warm, strong, and emotional voice in ${lang}: `;

          const data = await fetchWithRetry(`/api/tts`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${geminiApiKeyRef.current}` },
              body: JSON.stringify({
                  text: `${promptPrefix} ${text}`,
                  aiConfigId: selectedAiConfigIdRef.current
              })
          }, 3, 2000);

          const audioData = data && data.audioContent ? data.audioContent : null;
          if (audioData) {
              const wavBlob = new Blob([Uint8Array.from(atob(audioData), c => c.charCodeAt(0))], { type: data.mimeType || 'audio/wav' });
              if (wavBlob) {
                  await idb.set(idbKey, wavBlob);
                  const url = URL.createObjectURL(wavBlob);
                  setTransitionAudioUrls((prev: any) => ({ ...prev, [cacheKey]: url }));
                  return url;
              }
          }
      } catch(e) {
          console.warn("Lỗi tạo audio nối tiếp:", e);
      }
      return null;
  };
  const [documentPage, setDocumentPage] = useState(1);
  const [isLoadingMorePoems, setIsLoadingMorePoems] = useState(false);
  const [hasMorePoems, setHasMorePoems] = useState(true);

  const handleLoadMorePoemsFromGiacNgo = async () => {
      if (isLoadingMorePoems || !hasMorePoems) return;
      setIsLoadingMorePoems(true);
      try {
          const nextPage = documentPage + 1;
          const limit = 20;
          const res = await fetch(`/api/giacngo/documents?limit=${limit}&page=${nextPage}`);
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          
          const docData = await res.json();
          if (docData && Array.isArray(docData.data) && docData.data.length > 0) {
              const keyDocuments = docData.data.filter((doc: any) => 
                  doc.type && doc.type.toLowerCase().includes('kệ')
              );

              const parseHtmlToLines = (html: string) => {
                  let text = html
                      .replace(/<br\s*\/?>/gi, '\n')
                      .replace(/<\/p>/gi, '\n')
                      .replace(/<\/div>/gi, '\n')
                      .replace(/<p[^>]*>/gi, '')
                      .replace(/<div[^>]*>/gi, '');
                  text = text.replace(/<[^>]*>/g, '');
                  text = text
                      .replace(/&nbsp;/g, ' ')
                      .replace(/&quot;/g, '"')
                      .replace(/&amp;/g, '&')
                      .replace(/&lt;/g, '<')
                      .replace(/&gt;/g, '>');
                  return text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
              };

              const apiPoems = keyDocuments.map((doc: any) => {
                  const lines = parseHtmlToLines(doc.content || '');
                  const stanzas: any[] = [];
                  let currentStanza: string[] = [];

                  for (let i = 0; i < lines.length; i++) {
                      const lineLower = lines[i].toLowerCase();
                      if (lineLower.includes('nam mô tam vô chân sư')) continue;
                      if (lineLower.includes('kính cảm niệm')) continue;
                      if (lineLower.includes('nguyện đem công đức')) continue;
                      if (lineLower.includes('hồi hướng khắp')) continue;
                      if (lineLower.includes('đệ tử và chúng')) continue;
                      if (lineLower.includes('đều đồng thành phật')) continue;
                      if (lineLower.match(/[a-zA-Z\s]+,\s*\d{2}\/\d{2}\/\d{4}/)) continue;

                      currentStanza.push(lines[i]);

                      if (currentStanza.length === 4) {
                          const remaining = lines.slice(i + 1).filter(l => {
                              const lLower = l.toLowerCase();
                              return !lLower.includes('nam mô tam vô chân sư') &&
                                     !lLower.includes('kính cảm niệm') &&
                                     !lLower.includes('nguyện đem công đức') &&
                                     !lLower.includes('hồi hướng') &&
                                     !lLower.includes('đệ tử') &&
                                     !lLower.includes('thành phật') &&
                                     !lLower.match(/[a-zA-Z\s]+,\s*\d{2}\/\d{2}\/\d{4}/);
                          });

                          if (remaining.length > 0 && remaining.length <= 2) {
                              continue;
                          }

                          stanzas.push({
                              id: `giacngo_doc_${doc.id}_stanza_${stanzas.length + 1}`,
                              tags: doc.tags || [],
                              content: currentStanza.join('\n'),
                              meaning: '',
                              audioUrl: doc.audioUrl || null,
                              isSaved: false
                          });
                          currentStanza = [];
                      }
                  }

                  if (currentStanza.length > 0) {
                      stanzas.push({
                          id: `giacngo_doc_${doc.id}_stanza_${stanzas.length + 1}`,
                          tags: doc.tags || [],
                          content: currentStanza.join('\n'),
                          meaning: '',
                          audioUrl: doc.audioUrl || null,
                          isSaved: false
                      });
                  }

                  return {
                      id: `giacngo_doc_${doc.id}`,
                      title: doc.title,
                      stanzas: stanzas
                  };
              }).filter((p: any) => p.stanzas.length > 0);

              if (apiPoems.length > 0) {
                  setPoemDatabase((prev: any) => {
                      const existingTitles = new Set(prev.map((p: any) => p.title.toLowerCase().trim()));
                      const uniqueNew = apiPoems.filter((p: any) => !existingTitles.has(p.title.toLowerCase().trim()));
                      const updated = [...prev, ...uniqueNew];
                      localStorage.setItem('taman_poem_db', JSON.stringify(updated));
                      
                      if (uniqueNew.length > 0) {
                          showToastMsg(`Đã tải thêm ${uniqueNew.length} bài kệ mới từ GiacNgo!`, 'success');
                      } else {
                          showToastMsg('Các bài kệ tải về đã có sẵn trong kho.', 'info');
                      }
                      return updated;
                  });
              } else {
                  showToastMsg('Không tìm thấy thêm bài kệ nào ở trang này.', 'info');
              }

              setDocumentPage(nextPage);
              if (docData.data.length < limit) {
                  setHasMorePoems(false);
                  showToastMsg('Đã tải hết toàn bộ bài kệ từ GiacNgo.', 'info');
              }
          } else {
              setHasMorePoems(false);
              showToastMsg('Đã tải hết toàn bộ bài kệ từ GiacNgo.', 'info');
          }
      } catch(e) {
          console.error("Lỗi khi tải thêm bài kệ:", e);
          showToastMsg('Gặp lỗi khi tải thêm bài kệ từ GiacNgo.', 'error');
      } finally {
          setIsLoadingMorePoems(false);
      }
  };

  return {
    poemDatabase, setPoemDatabase, savePoemDatabase,
    isLoadingMorePoems, hasMorePoems, handleLoadMorePoemsFromGiacNgo,
    showPoemModal, setShowPoemModal,
    poemModalTab, setPoemModalTab,
    poemSearch, setPoemSearch,
    newTagInputs, setNewTagInputs,
    generatingStanzas, setGeneratingStanzas,
    generatingMeanings, setGeneratingMeanings,
    isGeneratingAIMeaning, setIsGeneratingAIMeaning,
    greetingsDb, setGreetingsDb,
    greetingSearch, setGreetingSearch,
    greetingAudioUrls, setGreetingAudioUrls,
    generatingGreetings, setGeneratingGreetings,
    transitionAudioUrls, setTransitionAudioUrls,
    ragDb, setRagDb,
    ragSearch, setRagSearch,
    ragFileInputRef,
    isLoadingRag, setIsLoadingRag,
    showImportPoemModal, setShowImportPoemModal,
    importPoemJson, setImportPoemJson,
    txtPoemFileInputRef,
    showOldLinkModal, setShowOldLinkModal,
    oldLinkInput, setOldLinkInput,
    isProcessingBackup, setIsProcessingBackup,
    backupProgress, setBackupProgress,
    backupFileInputRef,
    showBackupOptionsModal, setShowBackupOptionsModal,
    backupOptions, setBackupOptions,
    greetingMeta, setGreetingMeta,
    isBatchGeneratingPoems, setIsBatchGeneratingPoems,
    batchPoemProgress, setBatchPoemProgress,
    isBatchGeneratingMeanings, setIsBatchGeneratingMeanings,
    batchMeaningProgress, setBatchMeaningProgress,
    isBatchGeneratingGreetings, setIsBatchGeneratingGreetings,
    batchGreetingProgress, setBatchGreetingProgress,
    isBatchGeneratingAIMeanings, setIsBatchGeneratingAIMeanings,
    batchAIMeaningProgress, setBatchAIMeaningProgress,
    isUploadingAudios, setIsUploadingAudios,
    uploadAudioProgress, setUploadAudioProgress,
    
    // Manual script panel states
    showScriptModal, setShowScriptModal,
    scriptText, setScriptText,

    // Resolution functions
    resolveStanzaAudioUrl,
    resolveMeaningAudioUrl,
    resolveGreetingAudioUrl,
    getOrGenerateTransitionAudio,
    
    // Database handlers
    handleSyncFromCloud,
    handleBackupToCloud,
    handleUpdateGreetingText,
    handleGenerateGreetingVoice,
    handleDownloadAllPoemAudios,
    handleGenerateStanzaVoice,
    handlePlayStanzaVoice,
    handleGenerateMeaningVoice,
    handleSaveMeaningVoice,
    handleExportFullBackupClick,
    handleImportFullBackup,
    handleConnectOldLink,
    handleImportPoemJson,
    handleImportTxtPoem,
    handleExportPoemDatabaseCode,
    handlePushSourceToCloud,
    refreshRagFromGiacNgo,
    handleAddTag,
    handleRemoveTag,
    handleUpdatePoemContent,
    handleUpdatePoemMeaning,
    handleBatchGenerateStanzas,
    handleBatchGenerateMeanings,
    handleBatchGenerateGreetings,
    handleBatchGenerateAIMeaningsText,
    handleGenerateAIMeaningText,
    executeFullBackup,
    
    isBatchGeneratingPoemsRef,
    isBatchGeneratingMeaningsRef,
    isBatchGeneratingGreetingsRef,
    isBatchGeneratingAIMeaningsRef,
    idleSeconds,           // giữ lại để tương thích - giờ update mỗi 10 giây thay vì mỗi giây
    idleSecondsRef,        // ref để useLiveStreaming đọc không trigger re-render
    resetIdleTimer,        // thay thế setLastMessageTime
    setLastMessageTime: resetIdleTimer  // backward-compat alias
  };
};

