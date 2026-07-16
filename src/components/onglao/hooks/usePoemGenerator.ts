"use client";

import { useState, useEffect, useRef } from 'react';
import { fetchWithRetry } from '../utils';
import { doc, setDoc, idb } from '../constants';

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64data = (reader.result as string).split(',')[1];
            resolve(base64data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const usePoemGenerator = ({
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
}: any) => {

  const [isBatchGeneratingPoems, setIsBatchGeneratingPoems] = useState(false);
  const [batchPoemProgress, setBatchPoemProgress] = useState({ current: 0, total: 0 });
  const [isBatchGeneratingMeanings, setIsBatchGeneratingMeanings] = useState(false);
  const [batchMeaningProgress, setBatchMeaningProgress] = useState({ current: 0, total: 0 });
  const [isBatchGeneratingGreetings, setIsBatchGeneratingGreetings] = useState(false);
  const [batchGreetingProgress, setBatchGreetingProgress] = useState({ current: 0, total: 0 });
  const [isBatchGeneratingAIMeanings, setIsBatchGeneratingAIMeanings] = useState(false);
  const [batchAIMeaningProgress, setBatchAIMeaningProgress] = useState({ current: 0, total: 0 });

  const isBatchGeneratingPoemsRef = useRef(isBatchGeneratingPoems);
  const isBatchGeneratingMeaningsRef = useRef(isBatchGeneratingMeanings);
  const isBatchGeneratingGreetingsRef = useRef(isBatchGeneratingGreetings);
  const isBatchGeneratingAIMeaningsRef = useRef(isBatchGeneratingAIMeanings);

  useEffect(() => { isBatchGeneratingPoemsRef.current = isBatchGeneratingPoems; }, [isBatchGeneratingPoems]);
  useEffect(() => { isBatchGeneratingMeaningsRef.current = isBatchGeneratingMeanings; }, [isBatchGeneratingMeanings]);
  useEffect(() => { isBatchGeneratingGreetingsRef.current = isBatchGeneratingGreetings; }, [isBatchGeneratingGreetings]);
  useEffect(() => { isBatchGeneratingAIMeaningsRef.current = isBatchGeneratingAIMeanings; }, [isBatchGeneratingAIMeanings]);

  const handleBatchGenerateStanzas = async () => {
      if (isBatchGeneratingPoems) return;
      
      const missing: any[] = [];
      poemDatabase.forEach((p: any) => {
          p.stanzas.forEach((s: any) => {
              if (!s.isSaved) {
                  missing.push({ poemId: p.id, stanza: s });
              }
          });
      });

      if (missing.length === 0) {
          showToastMsg('Tất cả các đoạn kệ đều đã có sẵn pháp âm trong kho Lão.', 'success');
          return;
      }

      setIsBatchGeneratingPoems(true);
      isBatchGeneratingPoemsRef.current = true;
      setBatchPoemProgress({ current: 0, total: missing.length });

      let dbClone = JSON.parse(JSON.stringify(poemDatabase)); 

      const voiceName = "Algieba";
      const promptPrefix = appLanguage === 'Tiếng Việt' 
          ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
          : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

      const CONCURRENCY_LIMIT = 5;
      let currentIndex = 0;
      let processedCount = 0;

      const processAudioTask = async () => {
          while (currentIndex < missing.length && isBatchGeneratingPoemsRef.current) {
              const itemIndex = currentIndex++;
              const { poemId, stanza } = missing[itemIndex];
              
              const currentDbPoem = dbClone.find((p: any) => p.id === poemId);
              const currentDbStanza = currentDbPoem?.stanzas.find((s: any) => s.id === stanza.id);
              
              if (!currentDbStanza?.isSaved) {
                  try {
                      const optimizedText = stanza.content.split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
                      
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
                              const finalIdbKey = `saved_stanza_${stanza.id}_${Date.now()}`;
                              await idb.set(finalIdbKey, wavBlob); 
                              
                              if (user && db) {
                                  const base64Data = await blobToBase64(wavBlob);
                                  const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
                                  setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                              }
                              
                              setPoemDatabase((prevDb: any) => {
                                  const nextDb = prevDb.map((p: any) => p.id === poemId ? {
                                      ...p,
                                      stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {
                                          ...s,
                                          isSaved: true,
                                          savedKey: finalIdbKey,
                                          audioUrl: `idb://${finalIdbKey}`
                                        } : s)
                                  } : p);
                                  localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                                  dbClone = nextDb;
                                  return nextDb;
                              });
                          }
                      }
                  } catch (e) {
                      console.warn(`Lỗi tạo kệ ${stanza.id}:`, e);
                  }
              }

              processedCount++;
              setBatchPoemProgress({ current: processedCount, total: missing.length });
              await new Promise(r => setTimeout(r, 300));
          }
      };

      const workers = [];
      for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
          workers.push(processAudioTask());
      }
      await Promise.all(workers);

      if (user && db && isBatchGeneratingPoemsRef.current) {
          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
          await setDoc(dbRef, { database: dbClone, timestamp: Date.now() }).catch(()=>{});
      }

      setIsBatchGeneratingPoems(false);
      isBatchGeneratingPoemsRef.current = false;
      showToastMsg('Tiến trình tạo & lưu pháp âm hàng loạt đã kết thúc!', 'success', 6000);
  };

  const handleBatchGenerateMeanings = async () => {
      if (isBatchGeneratingMeanings) return;
      
      const missing: any[] = [];
      poemDatabase.forEach((p: any) => {
          p.stanzas.forEach((s: any) => {
              if (s.meaning && s.meaning.trim() !== '' && !s.isMeaningSaved) {
                  missing.push({ poemId: p.id, stanza: s });
              }
          });
      });

      if (missing.length === 0) {
          showToastMsg('Tất cả các đoạn diễn giải (có nội dung) đều đã có sẵn pháp âm.', 'success');
          return;
      }

      setIsBatchGeneratingMeanings(true);
      isBatchGeneratingMeaningsRef.current = true;
      setBatchMeaningProgress({ current: 0, total: missing.length });

      let dbClone = JSON.parse(JSON.stringify(poemDatabase)); 

      const voiceName = "Algieba";
      const promptPrefix = appLanguage === 'Tiếng Việt' 
          ? "Giọng ấm áp, nhẹ nhàng, diễn giải từ tốn, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
          : `Read slowly, gently explain, pause between lines, warm voice in ${appLanguage}: `;

      const CONCURRENCY_LIMIT = 5;
      let currentIndex = 0;
      let processedCount = 0;

      const processAudioTask = async () => {
          while (currentIndex < missing.length && isBatchGeneratingMeaningsRef.current) {
              const itemIndex = currentIndex++;
              const { poemId, stanza } = missing[itemIndex];
              
              const currentDbPoem = dbClone.find((p: any) => p.id === poemId);
              const currentDbStanza = currentDbPoem?.stanzas.find((s: any) => s.id === stanza.id);
              
              if (!currentDbStanza?.isMeaningSaved) {
                  try {
                      const optimizedText = cleanTextForTTS(stanza.meaning).split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
                      
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
                              const finalIdbKey = `saved_meaning_${stanza.id}_${Date.now()}`;
                              await idb.set(finalIdbKey, wavBlob);
                              
                              if (user && db) {
                                  const base64Data = await blobToBase64(wavBlob);
                                  const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanza.id);
                                  setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                              }
                              
                              setPoemDatabase((prevDb: any) => {
                                  const nextDb = prevDb.map((p: any) => p.id === poemId ? {
                                      ...p,
                                      stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {
                                          ...s,
                                          isMeaningSaved: true,
                                          meaningSavedKey: finalIdbKey,
                                          meaningAudioUrl: `idb://${finalIdbKey}`
                                      } : s)
                                  } : p);
                                  localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                                  dbClone = nextDb;
                                  return nextDb;
                              });
                          }
                      }
                  } catch (e) {
                      console.warn(`Lỗi tạo diễn giải ${stanza.id}:`, e);
                  }
              }

              processedCount++;
              setBatchMeaningProgress({ current: processedCount, total: missing.length });
              await new Promise(r => setTimeout(r, 300));
          }
      };

      const workers = [];
      for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
          workers.push(processAudioTask());
      }
      await Promise.all(workers);

      if (user && db && isBatchGeneratingMeaningsRef.current) {
          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
          await setDoc(dbRef, { database: dbClone, timestamp: Date.now() }).catch(()=>{});
      }

      setIsBatchGeneratingMeanings(false);
      isBatchGeneratingMeaningsRef.current = false;
      showToastMsg('Tiến trình tạo âm thanh diễn giải đã kết thúc!', 'success', 6000);
  };

  const handleBatchGenerateGreetings = async () => {
      if (isBatchGeneratingGreetings) return;
      
      const missing: any[] = [];
      Object.entries(greetingsDb).forEach(([category, list]: [string, any]) => {
          list.forEach((text: string, index: number) => {
              const key = `${category}_${index}`;
              if (!greetingAudioUrls[key]) {
                  missing.push({ category, index, text, key });
              }
          });
      });

      if (missing.length === 0) {
          showToastMsg('Tất cả các câu mào đầu đều đã có sẵn pháp âm.', 'success');
          return;
      }

      setIsBatchGeneratingGreetings(true);
      isBatchGeneratingGreetingsRef.current = true;
      setBatchGreetingProgress({ current: 0, total: missing.length });

      const voiceName = "Algieba";
      const promptPrefix = appLanguage === 'Tiếng Việt' 
          ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
          : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

      const CONCURRENCY_LIMIT = 5;
      let currentIndex = 0;
      let processedCount = 0;

      const processAudioTask = async () => {
          while (currentIndex < missing.length && isBatchGeneratingGreetingsRef.current) {
              const itemIndex = currentIndex++;
              const { text, key } = missing[itemIndex];
              
              if (!greetingAudioUrls[key]) {
                  try {
                      const optimizedText = cleanTextForTTS(text).split('\n').map((s: any) => s.trim()).filter((s: any) => s.length > 0).join('. ');
                      
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
                                  formData.append('audio', wavBlob, `greeting_${key}.wav`);
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
                          }
                      }
                  } catch (e) {
                      console.warn(`Lỗi tạo âm mào đầu ${key}:`, e);
                  }
              }

              processedCount++;
              setBatchGreetingProgress({ current: processedCount, total: missing.length });
              await new Promise(r => setTimeout(r, 300));
          }
      };

      const workers = [];
      for (let i = 0; i < CONCURRENCY_LIMIT; i++) {
          workers.push(processAudioTask());
      }
      await Promise.all(workers);

      setIsBatchGeneratingGreetings(false);
      isBatchGeneratingGreetingsRef.current = false;
      showToastMsg('Tiến trình tạo âm thanh mào đầu đã kết thúc!', 'success', 6000);
  };

  const handleBatchGenerateAIMeaningsText = async () => {
      if (isBatchGeneratingAIMeanings) return;
      
      const missing: any[] = [];
      poemDatabase.forEach((p: any) => {
          p.stanzas.forEach((s: any) => {
              if (!s.meaning || s.meaning.trim() === '') {
                  missing.push({ poem: p, stanza: s });
              }
          });
      });

      if (missing.length === 0) {
          showToastMsg('Tuyệt vời! Tất cả các đoạn kệ đều đã có phần diễn giải ý nghĩa.', 'success');
          return;
      }

      setIsBatchGeneratingAIMeanings(true);
      isBatchGeneratingAIMeaningsRef.current = true;
      setBatchAIMeaningProgress({ current: 0, total: missing.length });

      let count = 0;
      let dbClone = JSON.parse(JSON.stringify(poemDatabase));

      for (let item of missing) {
          if (!isBatchGeneratingAIMeaningsRef.current) break;
          const { poem, stanza } = item;
          
          try {
              const wholePoemText = poem.stanzas.map((s: any, idx: number) => `Đoạn ${idx + 1}:\n${s.content}`).join('\n\n');
              const stanzaIndex = poem.stanzas.findIndex((s: any) => s.id === stanza.id);
              
              const prompt = `Bạn là Lão, một bậc minh sư thấu hiểu giáo lý của Sư Cha Tam Vô (vô ngã, vô tướng, vô niệm, thoát luân hồi, nhận ra bản thể chân thật).
Hãy diễn giải ý nghĩa của ĐOẠN KỆ sau đây bằng ngôn ngữ ${appLanguage}. 
LƯU Ý QUAN TRỌNG: Đoạn kệ này nằm trong bài kệ mang tên "${poem.title}". Để đảm bảo tính logic xuyên suốt, đây là toàn bộ nội dung bài kệ:
${wholePoemText}

Nhiệm vụ của bạn: CHỈ diễn giải ý nghĩa cho Đoạn ${stanzaIndex + 1} có nội dung là:
"${stanza.content}"

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
                  let cleanText = rawResult.trim();
                  setPoemDatabase((prevDb: any) => {
                      const nextDb = prevDb.map((p: any) => p.id === poem.id ? {
                          ...p,
                          stanzas: p.stanzas.map((s: any) => s.id === stanza.id ? {
                              ...s,
                              meaning: cleanText
                          } : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                      dbClone = nextDb;
                      return nextDb;
                  });
              }
              
              count++;
              setBatchAIMeaningProgress({ current: count, total: missing.length });
              
              if (count < missing.length && isBatchGeneratingAIMeaningsRef.current) {
                  await new Promise(r => setTimeout(r, 3000));
              }

          } catch (err: any) {
              console.error("Lỗi Batch AI Meaning:", err);
          }
      }

      if (user && db && isBatchGeneratingAIMeaningsRef.current) {
          const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
          await setDoc(dbRef, { database: dbClone, timestamp: Date.now() }).catch(e=>console.warn(e));
      }

      setIsBatchGeneratingAIMeanings(false);
      isBatchGeneratingAIMeaningsRef.current = false;
      showToastMsg('Đã hoàn tất nhờ AI viết diễn giải hàng loạt!', 'success', 6000);
  };

  return {
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
  };
};
