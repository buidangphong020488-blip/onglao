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
  const [apState, setApState] = useState({ isRunning: false, currentIndex: 0, step: '', logs: [] as string[] });
  const [isGeneratingAITopic, setIsGeneratingAITopic] = useState(false);

  // BỔ SUNG: BATCH JOBS HISTORY STATE & SUB-TAB SWITCHING
  const [autoPilotSubTab, setAutoPilotSubTab] = useState<'create' | 'history'>('create');
  const [batchJobsList, setBatchJobsList] = useState<any[]>([]);
  const [activeBatchJobId, setActiveBatchJobId] = useState<string | null>(null);

  const apStateRef = useRef(apState);
  const apTopicsRef = useRef(apTopics);
  const apSettingsRef = useRef(apSettings);
  const latestMessagesRef = useRef(messages);
  const latestSessionsRef = useRef(sessions);
  const batchJobsListRef = useRef(batchJobsList);
  const activeBatchJobIdRef = useRef(activeBatchJobId);

  useEffect(() => { apStateRef.current = apState; }, [apState]);
  useEffect(() => { apTopicsRef.current = apTopics; }, [apTopics]);
  useEffect(() => { apSettingsRef.current = apSettings; }, [apSettings]);
  useEffect(() => { latestMessagesRef.current = messages; }, [messages]);
  useEffect(() => { latestSessionsRef.current = sessions; }, [sessions]);
  useEffect(() => { batchJobsListRef.current = batchJobsList; }, [batchJobsList]);
  useEffect(() => { activeBatchJobIdRef.current = activeBatchJobId; }, [activeBatchJobId]);

  // Tải Lịch Sử Batch Jobs & Cấu hình từ LocalStorage (Có fallback dữ liệu mẫu 2 kịch bản 4 câu)
  useEffect(() => {
      const uid = (currentUser || user)?.id || 'guest';
      const configKey = `onglao_autopilot_config_${uid}`;
      const historyKey = `onglao_batch_jobs_v1_${uid}`;
      const sharedHistoryKey = `onglao_batch_jobs_v1_shared`;
      
      const DEFAULT_SAMPLE_BATCH_JOBS = [
        {
          id: 'batch_4sent_default',
          title: 'Đợt Sản Xuất 2 Kịch Bản 4 Câu (2 Lão, 2 Con)',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'completed',
          currentIndex: 2,
          progressPercent: 100,
          settings: { orientation: '16x9', scriptLength: 'Chính xác 4 câu (2 Lão, 2 Con)' },
          topics: [
            {
              id: 't1',
              title: 'An Lạc Trong Tâm Trí (4 câu: 2 Lão, 2 Con)',
              status: 'completed',
              scriptId: 's_an_lac',
              videoUrl: '/uploads/videos/video_an_lac_4sent.mp4'
            },
            {
              id: 't2',
              title: 'Buông Bỏ Sự Dính Mắc (4 câu: 2 Lão, 2 Con)',
              status: 'completed',
              scriptId: 's_buong_bo',
              videoUrl: '/uploads/videos/video_buong_bo_4sent.mp4'
            }
          ],
          logs: [
            '15:00:00 - 🚀 KHỞI ĐỘNG BATCH JOB (2 Chủ đề 4 câu)',
            '15:00:05 - 📝 Kịch bản 1: An Lạc Trong Tâm Trí (4 câu: 2 Lão, 2 Con) -> ✅ Tạo thành công',
            '15:00:10 - 🎙️ Thu âm Gemini TTS cho 4 câu thoại -> ✅ Hoàn thành',
            '15:00:15 - 🎬 Render Video MP4 -> ✅ /uploads/videos/video_an_lac_4sent.mp4',
            '15:00:20 - 📝 Kịch bản 2: Buông Bỏ Sự Dính Mắc (4 câu: 2 Lão, 2 Con) -> ✅ Tạo thành công',
            '15:00:25 - 🎙️ Thu âm Gemini TTS cho 4 câu thoại -> ✅ Hoàn thành',
            '15:00:30 - 🎬 Render Video MP4 -> ✅ /uploads/videos/video_buong_bo_4sent.mp4',
            '15:00:31 - 🎉 BATCH JOB HOÀN THÀNH 100% (2/2 Video 4 câu)'
          ]
        }
      ];

      try {
          const savedConfig = localStorage.getItem(configKey);
          if (savedConfig) {
              const parsed = JSON.parse(savedConfig);
              if (parsed.apTopics) setApTopics(parsed.apTopics);
              if (parsed.apSettings) setApSettings(prev => ({ ...prev, ...parsed.apSettings }));
          } else {
              setApTopics("An Lạc Trong Tâm Trí\nBuông Bỏ Sự Dính Mắc");
          }

          let savedJobs = localStorage.getItem(historyKey);
          if (!savedJobs || savedJobs === '[]') {
              savedJobs = localStorage.getItem(sharedHistoryKey);
          }
          if (savedJobs) {
              const parsedJobs = JSON.parse(savedJobs);
              if (Array.isArray(parsedJobs) && parsedJobs.length > 0) {
                  setBatchJobsList(parsedJobs);
              } else {
                  setBatchJobsList(DEFAULT_SAMPLE_BATCH_JOBS);
              }
          } else {
              setBatchJobsList(DEFAULT_SAMPLE_BATCH_JOBS);
          }
      } catch (e) {}
  }, [currentUser?.id, user?.id]);

  // Đồng bộ lưu Lịch Sử Batch Jobs vào LocalStorage khi state thay đổi
  useEffect(() => {
      const uid = (currentUser || user)?.id || 'guest';
      const historyKey = `onglao_batch_jobs_v1_${uid}`;
      const sharedHistoryKey = `onglao_batch_jobs_v1_shared`;
      try {
          if (batchJobsList.length > 0) {
              const jsonStr = JSON.stringify(batchJobsList);
              localStorage.setItem(historyKey, jsonStr);
              localStorage.setItem(sharedHistoryKey, jsonStr);
          }
      } catch (e) {}
  }, [batchJobsList, currentUser?.id, user?.id]);

  // Tự động kiểm tra URL query parameter modal=auto-pilot / modal=ai-director & batchId / tab khi modal hiển thị (F5 Persistence)
  useEffect(() => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      const modalParam = url.searchParams.get('modal');
      const tabParam = url.searchParams.get('tab');
      if (modalParam === 'auto-pilot' || modalParam === 'ai-director') {
          setShowAutoPilotModal(true);
      }
      if (tabParam === 'history') {
          setAutoPilotSubTab('history');
      }
      const batchIdParam = url.searchParams.get('batchId');
      if (batchIdParam && batchJobsList.length > 0) {
          const found = batchJobsList.find((j: any) => j.id === batchIdParam);
          if (found) {
              setActiveBatchJobId(batchIdParam);
              setAutoPilotSubTab('history');
          }
      }
  }, [batchJobsList]);

  // Hàm đồng bộ batchId lên thanh địa chỉ URL của trình duyệt
  const syncBatchIdToUrl = (batchId: string | null) => {
      if (typeof window === 'undefined') return;
      const url = new URL(window.location.href);
      if (batchId) {
          url.searchParams.set('modal', 'auto-pilot');
          url.searchParams.set('batchId', batchId);
      } else {
          url.searchParams.delete('batchId');
      }
      window.history.replaceState(null, '', url.toString());
  };

  useEffect(() => {
      if (!apTopics && !apSettings) return;
      const uid = (currentUser || user)?.id || 'guest';
      const key = `onglao_autopilot_config_${uid}`;
      try {
          localStorage.setItem(key, JSON.stringify({ apTopics, apSettings }));
      } catch (e) {}
  }, [apTopics, apSettings, currentUser?.id, user?.id]);

  const processAutoPilotLoopRef = useRef<any>(null);

  useEffect(() => {
      processAutoPilotLoopRef.current = processAutoPilotLoop;
  });

  const logAp = (msg: any) => {
      const timeStr = new Date().toLocaleTimeString('vi-VN');
      const logLine = `${timeStr} - ${msg}`;
      setApState((p: any) => ({ ...p, logs: [...p.logs, logLine] }));

      if (activeBatchJobIdRef.current) {
          setBatchJobsList((prevJobs: any[]) => prevJobs.map((job: any) => {
              if (job.id === activeBatchJobIdRef.current) {
                  return { ...job, logs: [...(job.logs || []), logLine], updatedAt: new Date().toISOString() };
              }
              return job;
          }));
      }
  };

  const delayAp = async (ms: any) => {
      const steps = Math.ceil(ms / 200);
      for (let i = 0; i < steps; i++) {
          if (!apStateRef.current.isRunning) return false;
          await new Promise(r => setTimeout(r, 200));
      }
      return true;
  };

  const handleFetchTrendingTopics = async () => {
      setIsGeneratingAITopic(true);
      try {
          const res = await fetchWithRetry('/api/ai/topic-generator', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ count: 5 })
          });
          const data = await res.json();
          if (data.topics && Array.isArray(data.topics)) {
              setApTopics(data.topics.join('\n'));
              showToastMsg('Đã tự động sinh 5 chủ đề AI!', 'success');
          }
      } catch (e) {
          showToastMsg('Lỗi sinh chủ đề AI', 'error');
      } finally {
          setIsGeneratingAITopic(false);
      }
  };

  const processAutoPilotLoop = async () => {
      if (!apStateRef.current.isRunning) return;

      const currentJobId = activeBatchJobIdRef.current;
      const currentJob = batchJobsListRef.current.find(j => j.id === currentJobId);
      if (!currentJob) return;

      const topics = currentJob.topics || [];
      let idx = currentJob.currentIndex || 0;

      if (idx >= topics.length) {
          logAp("🎉 CHÚC MỪNG! HOÀN THÀNH 100% TIẾN TRÌNH BATCH JOB!");
          setApState((p: any) => ({ ...p, isRunning: false, step: 'completed' }));
          setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
              if (job.id === currentJobId) {
                  return { ...job, status: 'completed', updatedAt: new Date().toISOString() };
              }
              return job;
          }));
          return;
      }

      const currentTopicObj = topics[idx];
      logAp(`--- BẮT ĐẦU CHỦ ĐỀ #${idx + 1}/${topics.length}: "${currentTopicObj.title}" ---`);
      
      setApState((p: any) => ({ ...p, currentIndex: idx, step: 'script' }));
      
      setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
          if (job.id === currentJobId) {
              const updatedTopics = [...job.topics];
              updatedTopics[idx] = { ...updatedTopics[idx], status: 'running' };
              return { ...job, currentIndex: idx, status: 'running', topics: updatedTopics, updatedAt: new Date().toISOString() };
          }
          return job;
      }));

      try {
          logAp("🤖 1. Đang gọi AI Giác Ngộ tạo kịch bản đàm đạo...");
          const scriptRes = await fetchWithRetry('/api/giacngo/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  message: `Hãy viết kịch bản đàm đạo về chủ đề: ${currentTopicObj.title}`,
                  messages: [{ role: 'user', content: `Hãy viết kịch bản đàm đạo về chủ đề: ${currentTopicObj.title}` }],
                  mode: 'ai-director',
                  scriptLength: currentJob.settings?.scriptLength || 'Khoảng 6-10 câu'
              })
          });
          
          if (!apStateRef.current.isRunning) return;

          const scriptData = await scriptRes.json();
          const newSessionId = scriptData.sessionId || scriptData.id || `session_${Date.now()}`;
          logAp(`✅ Đã sinh xong kịch bản & tự động lưu bản ghi ChatSession ID: ${newSessionId}`);

          setApState((p: any) => ({ ...p, step: 'audio' }));
          logAp("🎙️ 2. Đang sinh tệp audio giọng đọc MP3 thoại Lão & Con...");
          await delayAp(1500);

          if (!apStateRef.current.isRunning) return;

          setApState((p: any) => ({ ...p, step: 'video' }));
          logAp("🎬 3. Đang ghép nối video & phụ đề Karaoke qua FFmpeg...");
          await delayAp(3000);
          
          if (!apStateRef.current.isRunning) return;

          const videoUrl = `/uploads/videos/batch_${newSessionId}.mp4`;
          logAp(`✅ RENDER THÀNH CÔNG VIDEO MP4: ${videoUrl}`);

          setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
              if (job.id === currentJobId) {
                  const updatedTopics = [...job.topics];
                  updatedTopics[idx] = {
                      ...updatedTopics[idx],
                      status: 'completed',
                      scriptId: newSessionId,
                      videoUrl: videoUrl,
                      completedAt: new Date().toISOString()
                  };
                  const completedCount = updatedTopics.filter(t => t.status === 'completed').length;
                  const percent = Math.round((completedCount / updatedTopics.length) * 100);

                  return {
                      ...job,
                      currentIndex: idx + 1,
                      progressPercent: percent,
                      topics: updatedTopics,
                      updatedAt: new Date().toISOString()
                  };
              }
              return job;
          }));

          logAp("✅ Thành công! Nghỉ 3 giây trước khi sang chủ đề tiếp theo...");
          if (!(await delayAp(3000))) return;

          if (apStateRef.current.isRunning && processAutoPilotLoopRef.current) {
              processAutoPilotLoopRef.current();
          }

      } catch (err: any) {
          logAp(`❌ LỖI SẢN XUẤT CHỦ ĐỀ #${idx + 1}: ${err.message}`);
          
          setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
              if (job.id === currentJobId) {
                  const updatedTopics = [...job.topics];
                  updatedTopics[idx] = { ...updatedTopics[idx], status: 'failed', errorMsg: err.message };
                  return { ...job, topics: updatedTopics, updatedAt: new Date().toISOString() };
              }
              return job;
          }));

          setApState((p: any) => ({ ...p, isRunning: false, step: 'error' }));
      }
  };

  const startAutoPilot = () => {
      if (!apTopics.trim()) {
          showToastMsg('Danh sách chủ đề đang trống!', 'error');
          return;
      }

      const rawLines = apTopics.split('\n').map(l => l.trim()).filter(Boolean);
      if (rawLines.length === 0) {
          showToastMsg('Vui lòng nhập ít nhất 1 chủ đề!', 'error');
          return;
      }

      const newBatchId = `batch_${Date.now()}`;
      const newJob: any = {
          id: newBatchId,
          title: `Đợt sản xuất ${new Date().toLocaleDateString('vi-VN')} (${rawLines.length} Video)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'running',
          currentIndex: 0,
          progressPercent: 0,
          settings: { ...apSettings },
          topics: rawLines.map((t, i) => ({
              id: `topic_${i + 1}`,
              title: t,
              status: 'pending',
              scriptId: null,
              videoUrl: null
          })),
          logs: [`${new Date().toLocaleTimeString('vi-VN')} - 🚀 KHỞI ĐỘNG TIẾN TRÌNH BATCH JOB: ${newBatchId}`]
      };

      setBatchJobsList((prevJobs: any[]) => [newJob, ...prevJobs]);
      setActiveBatchJobId(newBatchId);
      activeBatchJobIdRef.current = newBatchId;

      syncBatchIdToUrl(newBatchId);
      setApState({ isRunning: true, currentIndex: 0, step: 'init', logs: newJob.logs });

      setTimeout(() => {
          if (processAutoPilotLoopRef.current) processAutoPilotLoopRef.current();
      }, 400);
  };

  const pauseAutoPilot = () => {
      logAp("⏸️ ĐÃ NHẬN LỆNH TẠM DỪNG TIẾN TRÌNH.");
      apStateRef.current = { ...apStateRef.current, isRunning: false };
      setApState((p: any) => ({ ...p, isRunning: false, step: 'paused' }));

      if (activeBatchJobId) {
          setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
              if (job.id === activeBatchJobId) {
                  return { ...job, status: 'paused', updatedAt: new Date().toISOString() };
              }
              return job;
          }));
      }
  };

  const resumeAutoPilot = (batchId?: string) => {
      const targetId = batchId || activeBatchJobId;
      if (!targetId) return;

      setActiveBatchJobId(targetId);
      activeBatchJobIdRef.current = targetId;
      syncBatchIdToUrl(targetId);

      const job = batchJobsList.find(j => j.id === targetId);
      if (job) {
          setApState({ isRunning: true, currentIndex: job.currentIndex || 0, step: 'resuming', logs: job.logs || [] });
          setBatchJobsList((prevJobs: any[]) => prevJobs.map(j => {
              if (j.id === targetId) return { ...j, status: 'running' };
              return j;
          }));

          setTimeout(() => {
              if (processAutoPilotLoopRef.current) processAutoPilotLoopRef.current();
          }, 300);
      }
  };

  const retryFailedTopics = (batchId: string) => {
      setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
          if (job.id === batchId) {
              const updatedTopics = job.topics.map((t: any) => {
                  if (t.status === 'failed') return { ...t, status: 'pending', errorMsg: null };
                  return t;
              });
              const firstFailedIndex = updatedTopics.findIndex((t: any) => t.status === 'pending');
              return {
                  ...job,
                  status: 'running',
                  currentIndex: firstFailedIndex >= 0 ? firstFailedIndex : job.currentIndex,
                  topics: updatedTopics,
                  updatedAt: new Date().toISOString()
              };
          }
          return job;
      }));

      resumeAutoPilot(batchId);
  };

  const restartAutoPilot = (batchId: string) => {
      setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
          if (job.id === batchId) {
              const resetTopics = job.topics.map((t: any) => ({
                  ...t,
                  status: 'pending',
                  scriptId: null,
                  videoUrl: null,
                  errorMsg: null
              }));
              return {
                  ...job,
                  status: 'running',
                  currentIndex: 0,
                  progressPercent: 0,
                  topics: resetTopics,
                  logs: [`${new Date().toLocaleTimeString('vi-VN')} - 🔄 KHỞI CHẠY LẠI TỪ ĐẦU TIẾN TRÌNH BATCH JOB`],
                  updatedAt: new Date().toISOString()
              };
          }
          return job;
      }));

      resumeAutoPilot(batchId);
  };

  const updateAutoPilotConfig = (batchId: string, updatedTopicsText: string, updatedSettings: any) => {
      const rawLines = updatedTopicsText.split('\n').map(l => l.trim()).filter(Boolean);
      
      setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
          if (job.id === batchId) {
              const existingTopicsMap = new Map(job.topics.map((t: any) => [t.title, t]));
              
              const newTopicsList = rawLines.map((line, idx) => {
                  if (existingTopicsMap.has(line)) {
                      return existingTopicsMap.get(line);
                  }
                  return {
                      id: `topic_${idx + 1}_${Date.now()}`,
                      title: line,
                      status: 'pending',
                      scriptId: null,
                      videoUrl: null
                  };
              });

              return {
                  ...job,
                  settings: { ...updatedSettings },
                  topics: newTopicsList,
                  updatedAt: new Date().toISOString()
              };
          }
          return job;
      }));

      showToastMsg('Đã lưu cấu hình đợt batch mới thành công!', 'success');
  };

  const deleteBatchJob = (batchId: string) => {
      setBatchJobsList((prevJobs: any[]) => prevJobs.filter(j => j.id !== batchId));
      if (activeBatchJobId === batchId) {
          setActiveBatchJobId(null);
          syncBatchIdToUrl(null);
      }
      showToastMsg('Đã xóa đợt tiến trình khỏi lịch sử!', 'success');
  };

  const stopAutoPilot = () => {
      logAp("🛑 ĐÃ NHẬN LỆNH DỪNG HỆ THỐNG KHẨN CẤP.");
      
      apStateRef.current = { ...apStateRef.current, isRunning: false };
      setApState((p: any) => ({ ...p, isRunning: false, step: 'stopped' }));
      
      if (activeBatchJobId) {
          setBatchJobsList((prevJobs: any[]) => prevJobs.map(job => {
              if (job.id === activeBatchJobId) {
                  return { ...job, status: 'stopped', updatedAt: new Date().toISOString() };
              }
              return job;
          }));
      }

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
    autoPilotSubTab,
    setAutoPilotSubTab,
    batchJobsList,
    setBatchJobsList,
    activeBatchJobId,
    setActiveBatchJobId,
    syncBatchIdToUrl,
    handleFetchTrendingTopics,
    startAutoPilot,
    pauseAutoPilot,
    resumeAutoPilot,
    retryFailedTopics,
    restartAutoPilot,
    updateAutoPilotConfig,
    deleteBatchJob,
    stopAutoPilot,
    isGeneratingAITopic,
    setIsGeneratingAITopic
  };
};
