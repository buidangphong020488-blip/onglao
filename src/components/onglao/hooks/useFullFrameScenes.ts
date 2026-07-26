// @ts-nocheck
import { useState, useEffect, useRef } from 'react';
import { idb } from '../constants';

const resolveFfAssetUrl = async (val: any) => {
    if (!val) return null;
    if (val.startsWith('http') || val.startsWith('/')) {
        return val;
    }
    const cleanKey = val.startsWith('idb://') ? val.replace('idb://', '') : val;
    try {
        const blob = await idb.get(cleanKey);
        if (blob) return URL.createObjectURL(blob);
    } catch (e) {
        console.warn("Lỗi resolve IDB key:", e);
    }
    return null;
};

export const useFullFrameScenes = ({
  showToastMsg,
  setConfirmDialog,
  copyToClipboard,
  videoAspectRatio,
  FULLFRAME_PACKS,
  setFullFramePacks,
  allCharacters = [],
  currentLaoPresetId = null,
  currentUserPresetId = null,
  currentSessionId = null
}: any) => {
  const [ffScenes, setFfScenes] = useState<any[]>(() => {
    if (typeof window !== 'undefined' && currentSessionId) {
      const savedKey = `onglao_ff_scenes_${currentSessionId}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          return parsed.map((s: any) => ({
            ...s,
            url: (s.url && s.url.startsWith('blob:')) ? null : s.url
          }));
        } catch (e) {}
      }
    }
    return [];
  });

  const prevSessionIdRef = useRef(currentSessionId);

  // Tự động nạp bộ cảnh lưu riêng của kịch bản/session từ PostgreSQL DB (fallback localStorage)
  useEffect(() => {
    if (!currentSessionId) return;
    if (prevSessionIdRef.current === currentSessionId) return;
    prevSessionIdRef.current = currentSessionId;

    let isMounted = true;
    const dbPackName = `script_scenes_${currentSessionId}`;

    // 1. Thử nạp từ CSDL PostgreSQL trước
    fetch(`/api/goi-canh-quay?name=${encodeURIComponent(dbPackName)}`)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data && data.success && data.pack && Array.isArray(data.pack.scenesData) && data.pack.scenesData.length > 0) {
          const restored = data.pack.scenesData.map((s: any) => ({
            ...s,
            url: (s.url && s.url.startsWith('blob:')) ? null : s.url
          }));
          setFfScenes(restored);
          return;
        }

        // 2. Fallback nạp từ localStorage
        const savedKey = `onglao_ff_scenes_${currentSessionId}`;
        const saved = localStorage.getItem(savedKey);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const restored = parsed.map((s: any) => ({
              ...s,
              url: (s.url && s.url.startsWith('blob:')) ? null : s.url
            }));
            setFfScenes(restored);
            return;
          } catch (e) {}
        }

        // 3. Nếu chưa có cảnh lưu riêng -> reset ffScenes về [] để tự động tạo theo tin nhắn kịch bản
        setFfScenes([]);
      })
      .catch(() => {
        if (!isMounted) return;
        setFfScenes([]);
      });

    return () => { isMounted = false; };
  }, [currentSessionId]);

  // Tự động khôi phục Video Blobs mới từ IndexedDB cho các cảnh có idbKey khi load hoặc đổi kịch bản
  useEffect(() => {
    let isMounted = true;
    const restoreBlobs = async () => {
      let changed = false;
      const updated = await Promise.all(ffScenes.map(async (scene: any) => {
        if (scene.idbKey && !scene.url) {
          const resolved = await resolveFfAssetUrl(scene.idbKey);
          if (resolved) {
            changed = true;
            return { ...scene, url: resolved };
          }
        }
        return scene;
      }));
      if (changed && isMounted) {
        setFfScenes(updated);
      }
    };
    
    if (ffScenes.some((s: any) => s.idbKey && !s.url)) {
      restoreBlobs();
    }
    return () => { isMounted = false; };
  }, [ffScenes, currentSessionId]);

  // Tự động lưu bộ cảnh theo kịch bản vào localStorage & PostgreSQL DB
  useEffect(() => {
    if (!ffScenes || ffScenes.length === 0) return;
    const cleanForStorage = ffScenes.map((s: any) => ({
      ...s,
      url: (s.url && s.url.startsWith('blob:')) ? null : s.url
    }));

    if (currentSessionId) {
      localStorage.setItem(`onglao_ff_scenes_${currentSessionId}`, JSON.stringify(cleanForStorage));

      // Đẩy bộ cảnh lên CSDL PostgreSQL ngầm
      const dbPackName = `script_scenes_${currentSessionId}`;
      fetch('/api/goi-canh-quay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: dbPackName,
          aspect: videoAspectRatio === '9x16' ? 'doc' : 'ngang',
          scenes: cleanForStorage
        })
      }).catch(err => console.warn("Lỗi lưu bộ cảnh lên PostgreSQL DB:", err));
    } else {
      localStorage.setItem('onglao_ff_scenes', JSON.stringify(cleanForStorage));
    }
  }, [ffScenes, currentSessionId, videoAspectRatio]);
  const [localFfClips, setLocalFfClips] = useState<any[]>([]);
  const [showFfSaveModal, setShowFfSaveModal] = useState(false);
  const [ffSaveData, setFfSaveData] = useState({ sceneId: '', name: '' });
  const ffVidRefs = useRef<any>({});
  const ffScenesRef = useRef(ffScenes);
  
  useEffect(() => {
    ffScenesRef.current = ffScenes;
  }, [ffScenes]);

  const [localFfPacks, setLocalFfPacks] = useState<any[]>([]);
  const [showSavePackModal, setShowSavePackModal] = useState(false);
  const [savePackData, setSavePackData] = useState({ name: '', aspect: 'ngang' });

  const [customCategories, setCustomCategories] = useState<any[]>([]);

  // Load kho Video Dựng Sẵn cá nhân duy nhất từ PostgreSQL DB
  useEffect(() => {
      // Đọc trực tiếp Gói cảnh quay từ CSDL PostgreSQL
      fetch('/api/goi-canh-quay')
        .then(res => res.json())
        .then(dbPacks => {
          if (Array.isArray(dbPacks)) {
            const mapped = dbPacks.map((p: any) => ({
              id: p.id,
              name: p.name,
              aspect: p.aspect || 'ngang',
              isLocal: true,
              scenes: p.scenesData || []
            }));
            setLocalFfPacks(mapped);
          }
        })
        .catch(err => console.warn('Lỗi tải GoiCanhQuay từ DB:', err));

      // Đọc trực tiếp Phân mục tùy chỉnh từ CSDL PostgreSQL
      fetch('/api/user/canh-quay/categories')
        .then(res => res.json())
        .then(cats => {
          if (Array.isArray(cats)) setCustomCategories(cats);
        })
        .catch(err => console.warn('Lỗi tải Custom Categories từ DB:', err));

      // Đọc trực tiếp duy nhất từ CSDL PostgreSQL
      fetch('/api/user/canh-quay')
        .then(res => res.json())
        .then(dbList => {
          if (Array.isArray(dbList)) {
            const dbClips = dbList.map((item: any) => ({
              id: item.id,
              name: item.name,
              url: item.url,
              poster: item.poster,
              role: item.role || 'lao',
              category: item.category || item.role || 'lao',
              emotion: item.emotion || 'calm',
              idbKey: item.id,
              isDb: true
            }));
            setLocalFfClips(dbClips);
          }
        })
        .catch(err => console.warn('Lỗi tải CanhQuay từ PostgreSQL DB:', err));
  }, []);

  const handleAddCustomCategory = async (name: string) => {
    if (!name.trim()) return;
    const catId = `cat_${Date.now()}_${Math.floor(Math.random()*1000)}`;
    const newCat = { id: catId, name: name.trim() };
    const updated = [...customCategories.filter((c: any) => c.name !== newCat.name), newCat];
    setCustomCategories(updated);

    try {
      await fetch('/api/user/canh-quay/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCat)
      });
    } catch (err) {
      console.warn('Lỗi lưu Category lên DB:', err);
    }
  };

  const handleDeleteCustomCategory = async (catId: string) => {
    const targetCat = customCategories.find((c: any) => c.id === catId || c.name === catId);
    const catName = targetCat ? targetCat.name : catId;
    
    // 1. Xóa khỏi state
    const updatedCats = customCategories.filter((c: any) => c.id !== catId && c.name !== catId);
    setCustomCategories(updatedCats);

    // 2. Xóa các clip thuộc category này khỏi localFfClips & PostgreSQL DB
    setLocalFfClips((prev: any[]) => prev.filter((clip: any) => clip.category !== catId && clip.category !== catName));
    
    try {
      await fetch(`/api/user/canh-quay/categories?id=${encodeURIComponent(catId)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Lỗi xóa category trên DB:', err);
    }
  };

  const handleRenameCustomCategory = async (catId: string, oldName: string, newName: string) => {
    if (!newName.trim() || newName.trim() === oldName) return;
    const trimmedNew = newName.trim();

    // 1. Cập nhật customCategories state
    setCustomCategories((prev: any[]) => prev.map((c: any) => {
      if (c.id === catId || c.name === catId || c.name === oldName) {
        return { ...c, name: trimmedNew };
      }
      return c;
    }));

    // 2. Cập nhật category của các clip trong localFfClips state
    setLocalFfClips((prev: any[]) => prev.map((clip: any) => {
      if (clip.category === catId || clip.category === oldName) {
        return { ...clip, category: trimmedNew };
      }
      return clip;
    }));

    // 3. Cập nhật DB
    try {
      await fetch('/api/user/canh-quay/categories', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: catId, oldName, newName: trimmedNew })
      });
    } catch (err) {
      console.warn('Lỗi đổi tên category trên DB:', err);
    }
  };

  const handleDeleteLibraryClip = async (clipId: string) => {
    setLocalFfClips((prev: any[]) => prev.filter((c: any) => c.id !== clipId && c.idbKey !== clipId));

    try {
      await fetch(`/api/user/canh-quay?id=${encodeURIComponent(clipId)}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Lỗi xóa clip trên DB:', err);
    }
  };

  const handleBatchDeleteLibraryClips = async (clipIds: string[]) => {
    if (!clipIds || clipIds.length === 0) return;
    setLocalFfClips((prev: any[]) => prev.filter((c: any) => !clipIds.includes(c.id) && !clipIds.includes(c.idbKey)));

    try {
      await fetch('/api/user/canh-quay', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: clipIds })
      });
    } catch (err) {
      console.warn('Lỗi xóa batch clips trên DB:', err);
    }
  };

  // Load trước Video Dựng Sẵn vào RAM (Tối ưu hóa tránh treo trình duyệt khi nạp nhiều clip)
  useEffect(() => {
      const activeIds = new Set(ffScenes.map((s: any) => s.id));
      
      // 1. Giải phóng RAM các video không còn thuộc danh sách ffScenes
      Object.keys(ffVidRefs.current).forEach((key) => {
          if (!activeIds.has(key)) {
              try {
                  if (ffVidRefs.current[key]) {
                      ffVidRefs.current[key].pause();
                      ffVidRefs.current[key].removeAttribute('src');
                      ffVidRefs.current[key].load();
                  }
              } catch (e) {}
              delete ffVidRefs.current[key];
          }
      });

      // 2. Cập nhật thẻ video mà KHÔNG ép đồng loạt gọi .load() gây ngốn RAM
      ffScenes.forEach((scene: any) => {
          const url = scene.url;
          if (url) {
              if (!ffVidRefs.current[scene.id]) {
                  const v = document.createElement('video');
                  v.muted = true; 
                  v.loop = true; 
                  v.playsInline = true; 
                  v.crossOrigin = "anonymous";
                  v.preload = "metadata";
                  ffVidRefs.current[scene.id] = v;
              }
              if (ffVidRefs.current[scene.id].src !== url) {
                  ffVidRefs.current[scene.id].src = url;
              }
          } else if (ffVidRefs.current[scene.id]) {
              try {
                  ffVidRefs.current[scene.id].pause();
                  ffVidRefs.current[scene.id].removeAttribute('src');
                  ffVidRefs.current[scene.id].load();
              } catch (e) {}
              delete ffVidRefs.current[scene.id];
          }
      });
  }, [ffScenes]);

  // Tự động cập nhật URL khi thay đổi nhân vật hoặc danh sách nhân vật
  useEffect(() => {
      let isChanged = false;
      const updateScenes = async () => {
          const currentScenes = ffScenesRef.current;
          const updatedScenes = await Promise.all(currentScenes.map(async (scene: any) => {
              if (scene.idbKey && (scene.idbKey.startsWith('active_char:') || scene.idbKey.startsWith('char_asset:'))) {
                  let charId = null;
                  let assetKey = null;
                  
                  if (scene.idbKey.startsWith('active_char:')) {
                      const [_, role, aKey] = scene.idbKey.split(':');
                      charId = role === 'lao' ? currentLaoPresetId : currentUserPresetId;
                      assetKey = aKey;
                  } else {
                      const [_, cId, aKey] = scene.idbKey.split(':');
                      charId = cId;
                      assetKey = aKey;
                  }
                  
                  const char = allCharacters.find((c: any) => c.id === charId);
                  let assetVal = null;
                  if (assetKey.startsWith('scene_')) {
                      const isDoc = videoAspectRatio === '9x16';
                      const targetAspect = isDoc ? 'doc' : 'ngang';
                      const pack = char?.fullFramePacks?.find((p: any) => p.aspect === targetAspect) || char?.fullFramePacks?.[0];
                      const foundScene = pack?.scenes?.find((s: any) => s.id === assetKey);
                      assetVal = foundScene?.url || foundScene?.idbKey;
                  } else {
                      assetVal = char?.assets?.[assetKey];
                  }
                  
                  if (assetVal) {
                      const resolvedUrl = await resolveFfAssetUrl(assetVal);
                      if (resolvedUrl && scene.url !== resolvedUrl) {
                          isChanged = true;
                          if (scene.url && scene.url.startsWith('blob:')) {
                              URL.revokeObjectURL(scene.url);
                          }
                          return { ...scene, url: resolvedUrl };
                      }
                  }
              }
              return scene;
          }));
          
          if (isChanged) {
              setFfScenes(updatedScenes);
          }
      };
      
      updateScenes();
  }, [allCharacters, currentLaoPresetId, currentUserPresetId, videoAspectRatio]);

  // Tự động chuyển đổi pack dọc/ngang tương ứng khi tỉ lệ khung hình (videoAspectRatio) thay đổi
  useEffect(() => {
      if (!currentLaoPresetId) return;
      const char = allCharacters.find((c: any) => c.id === currentLaoPresetId);
      if (!char) return;
      
      const isDoc = videoAspectRatio === '9x16';
      const targetAspect = isDoc ? 'doc' : 'ngang';
      const pack = char.fullFramePacks?.find((p: any) => p.aspect === targetAspect);
      if (pack) {
          handleLoadPack(pack.id);
      }
  }, [videoAspectRatio, currentLaoPresetId, allCharacters]);

  const moveFfScene = (index: any, direction: any) => {
      setFfScenes((prev: any[]) => {
          const newScenes = [...prev];
          if (direction === -1 && index > 0) {
              [newScenes[index - 1], newScenes[index]] = [newScenes[index], newScenes[index - 1]];
          } else if (direction === 1 && index < newScenes.length - 1) {
              [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];
          }
          return newScenes;
      });
  };

  const handleSelectFfClipV2 = async (sceneId: any, idbKey: any) => {
      if (!idbKey) {
          setFfScenes((prev: any[]) => prev.map((s: any) => {
              if (s.id === sceneId) {
                  if (s.url) URL.revokeObjectURL(s.url);
                  return { ...s, url: null, idbKey: null };
              }
              return s;
          }));
          return;
      }
      showToastMsg('Đang tải video...', 'loading', 0);
      try {
          let url = null;
          if (idbKey.startsWith('active_char:') || idbKey.startsWith('char_asset:')) {
              let charId = null;
              let assetKey = null;
              
              if (idbKey.startsWith('active_char:')) {
                  const [_, role, aKey] = idbKey.split(':');
                  charId = role === 'lao' ? currentLaoPresetId : currentUserPresetId;
                  assetKey = aKey;
              } else {
                  const [_, cId, aKey] = idbKey.split(':');
                  charId = cId;
                  assetKey = aKey;
              }
              
              const char = allCharacters.find((c: any) => c.id === charId);
              let assetVal = null;
              if (assetKey.startsWith('scene_')) {
                  const isDoc = videoAspectRatio === '9x16';
                  const targetAspect = isDoc ? 'doc' : 'ngang';
                  const pack = char?.fullFramePacks?.find((p: any) => p.aspect === targetAspect) || char?.fullFramePacks?.[0];
                  const foundScene = pack?.scenes?.find((s: any) => s.id === assetKey);
                  assetVal = foundScene?.url || foundScene?.idbKey;
              } else {
                  assetVal = char?.assets?.[assetKey];
              }
              
              if (assetVal) {
                  url = await resolveFfAssetUrl(assetVal);
              }
          } else {
              const blob = await idb.get(idbKey);
              if (blob) url = URL.createObjectURL(blob);
          }

          if (url) {
              setFfScenes((prev: any[]) => prev.map((s: any) => {
                  if (s.id === sceneId) {
                      if (s.url) URL.revokeObjectURL(s.url);
                      return { ...s, url, idbKey };
                  }
                  return s;
              }));
              showToastMsg('Đã nạp video!', 'success', 2000);
          } else {
              showToastMsg('Không tìm thấy file video cho lựa chọn này.', 'error');
          }
      } catch (e) {
          console.error(e);
          showToastMsg('Lỗi khi tải video.', 'error');
      }
  };

  const handleUploadFolder = async (e: any) => {
      const files: any[] = Array.from(e.target.files || []);
      if (files.length === 0) return;

      showToastMsg(`Đang tải lên và trích xuất Thumbnail ngầm cho ${files.length} video...`, 'loading', 0);

      const newScenesTemplate: any[] = [
          { id: `scene_lao_calm_${Date.now()}`, role: 'lao', emotion: 'calm', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_lao_sad_${Date.now()}`, role: 'lao', emotion: 'sad', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_lao_joy_${Date.now()}`, role: 'lao', emotion: 'joy', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_user_calm_${Date.now()}`, role: 'user', emotion: 'calm', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_user_sad_${Date.now()}`, role: 'user', emotion: 'sad', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_user_joy_${Date.now()}`, role: 'user', emotion: 'joy', url: null, thumbnailUrl: null, idbKey: null },
          { id: `scene_outro_calm_${Date.now()}`, role: 'outro', emotion: 'calm', url: null, thumbnailUrl: null, idbKey: null }
      ];

      let matchedCount = 0;

      for (const file of files) {
          const fileName = file.name.toLowerCase();
          let targetIdx = -1;

          if (fileName.includes('lao_calm') || fileName.includes('lao_binhthuong')) targetIdx = 0;
          else if (fileName.includes('lao_sad') || fileName.includes('lao_buon')) targetIdx = 1;
          else if (fileName.includes('lao_joy') || fileName.includes('lao_vui')) targetIdx = 2;
          else if (fileName.includes('user_calm') || fileName.includes('con_binhthuong')) targetIdx = 3;
          else if (fileName.includes('user_sad') || fileName.includes('con_buon') || fileName.includes('con_khoc')) targetIdx = 4;
          else if (fileName.includes('user_joy') || fileName.includes('con_vui') || fileName.includes('con_cuoi')) targetIdx = 5;
          else if (fileName.includes('outro') || fileName.includes('vailay') || fileName.includes('kethuc')) targetIdx = 6;

          if (targetIdx !== -1) {
              try {
                  const fd = new FormData();
                  fd.append('file', file);
                  const res = await fetch('/api/upload/canh-quay', { method: 'POST', body: fd });
                  const data = await res.json();
                  if (data.success && data.url) {
                      newScenesTemplate[targetIdx].url = data.url;
                      newScenesTemplate[targetIdx].thumbnailUrl = data.thumbnailUrl || data.url;
                      matchedCount++;
                  }
              } catch (err) {
                  console.error('Lỗi upload clip:', err);
              }
          }
      }

      if (matchedCount > 0) {
          setFfScenes(newScenesTemplate);
          showToastMsg(`Đã tải lên và tạo xong ${matchedCount} Thumbnail ngầm! Hãy bấm "Lưu Bộ Cảnh".`, 'success', 6000);
      } else {
          showToastMsg(`Tải lên ${files.length} file nhưng không có file nào đúng định dạng tên. Bấm vào icon (i) để xem hướng dẫn đặt tên.`, 'error', 8000);
      }
      
      e.target.value = '';
  };

  const showUploadGuide = () => {
      setConfirmDialog({
          isOpen: true,
          message: 'HƯỚNG DẪN TẢI ĐỒNG LOẠT:\n\nĐể hệ thống tự động gắp video vào đúng ô, con hãy đặt tên file trên máy tính có chứa các từ khóa sau:\n\n1. Lão bình thường: lao_calm (hoặc lao_binhthuong)\n2. Lão buồn/nghiêm: lao_sad (hoặc lao_buon)\n3. Lão vui vẻ: lao_joy (hoặc lao_vui)\n4. Con bình thường: user_calm (hoặc con_binhthuong)\n5. Con buồn/khóc: user_sad (hoặc con_buon)\n6. Con vui vẻ: user_joy (hoặc con_vui)\n7. Cảnh lạy/Kết thúc: outro (hoặc vailay)\n\nVí dụ tên file hợp lệ: "video_lao_sad_1.mp4"',
          onConfirm: null
      });
  };

  const executeSaveFfClipV2 = async () => {
      const { sceneId, name } = ffSaveData;
      setShowFfSaveModal(false);
      const scene = ffScenes.find((s: any) => s.id === sceneId);
      const url = scene?.url;
      if (!url) return;

      showToastMsg('Đang nén và lưu video vào kho máy...', 'loading', 0);
      try {
          const blob = await fetch(url).then(r => r.blob());
          const idbKey = `ff_clip_${scene.role}_${scene.emotion}_${Date.now()}`;
          await idb.set(idbKey, blob);

          const newClip = { id: idbKey, role: scene.role, name, url: `idb://${idbKey}` };
          const updatedList = [...localFfClips, newClip];
          setLocalFfClips(updatedList);
          localStorage.setItem('taman_local_ff_clips', JSON.stringify(updatedList));

          setFfScenes((prev: any[]) => prev.map((s: any) => s.id === sceneId ? { ...s, idbKey } : s));
          showToastMsg('Đã lưu video vào kho thành công!', 'success');
      } catch (err: any) {
          console.error(err);
          showToastMsg('Trình duyệt không đủ bộ nhớ để lưu video này.', 'error');
      }
  };

  const executeSaveFfPack = async () => {
      setShowSavePackModal(false);
      showToastMsg('Đang nén và lưu toàn bộ cảnh vào ổ cứng... Vui lòng đợi!', 'loading', 0);
      try {
          const newScenes = [];
          for (const scene of ffScenes) {
              let finalIdbKey = scene.idbKey;
              if (scene.url && !finalIdbKey && scene.url.startsWith('blob:')) {
                  const blob = await fetch(scene.url).then(r => r.blob());
                  finalIdbKey = `ff_clip_${scene.role}_${scene.emotion}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                  await idb.set(finalIdbKey, blob);
              }
              newScenes.push({ ...scene, idbKey: finalIdbKey, url: null });
          }

          const newPack = {
              id: `local_pack_${Date.now()}`,
              name: savePackData.name,
              aspect: savePackData.aspect,
              isLocal: true,
              scenes: newScenes
          };

          const updatedPacks = [...localFfPacks.filter((p: any) => p.name !== newPack.name), newPack];
          setLocalFfPacks(updatedPacks);

          await fetch('/api/goi-canh-quay', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              id: newPack.id,
              name: newPack.name,
              aspect: newPack.aspect,
              scenes: newScenes
            })
          });

          showToastMsg(`Đã lưu Bộ Cảnh "${savePackData.name}" vào PostgreSQL CSDL thành công!`, 'success', 4000);
      } catch (e: any) {
          console.error("Lỗi lưu Bộ Cảnh:", e);
          showToastMsg('Lỗi khi lưu bộ cảnh lên CSDL: ' + (e.message || ''), 'error', 5000);
      }
  };

  const handleLoadPack = async (packId: any) => {
      const hardcodedPack = FULLFRAME_PACKS.find((p: any) => p.id === packId);
      const localPack = localFfPacks.find((p: any) => p.id === packId);

      ffScenes.forEach((s: any) => { if (s.url) URL.revokeObjectURL(s.url); });

      if (hardcodedPack) {
          setFfScenes(JSON.parse(JSON.stringify(hardcodedPack.scenes)));
          showToastMsg(`Đã đổi sang bộ cảnh ${hardcodedPack.name}`, 'success', 2000);
      } else if (localPack) {
          showToastMsg(`Đang nạp bộ cảnh "${localPack.name}"...`, 'loading', 0);
          try {
              const loadedScenes = await Promise.all(localPack.scenes.map(async (scene: any) => {
                  let url = null;
                  if (scene.idbKey) {
                      if (scene.idbKey.startsWith('active_char:') || scene.idbKey.startsWith('char_asset:')) {
                          let charId = null;
                          let assetKey = null;
                          
                          if (scene.idbKey.startsWith('active_char:')) {
                              const [_, role, aKey] = scene.idbKey.split(':');
                              charId = role === 'lao' ? currentLaoPresetId : currentUserPresetId;
                              assetKey = aKey;
                          } else {
                              const [_, cId, aKey] = scene.idbKey.split(':');
                              charId = cId;
                              assetKey = aKey;
                          }
                          
                          const char = allCharacters.find((c: any) => c.id === charId);
                          let assetVal = null;
                          if (assetKey.startsWith('scene_')) {
                              const isDoc = videoAspectRatio === '9x16';
                              const targetAspect = isDoc ? 'doc' : 'ngang';
                              const pack = char?.fullFramePacks?.find((p: any) => p.aspect === targetAspect) || char?.fullFramePacks?.[0];
                              const foundScene = pack?.scenes?.find((s: any) => s.id === assetKey);
                              assetVal = foundScene?.url || foundScene?.idbKey;
                          } else {
                              assetVal = char?.assets?.[assetKey];
                          }
                          
                          if (assetVal) {
                              url = await resolveFfAssetUrl(assetVal);
                          }
                      } else {
                          const blob = await idb.get(scene.idbKey);
                          if (blob) url = URL.createObjectURL(blob);
                      }
                  }
                  return { ...scene, url };
              }));
              setFfScenes(loadedScenes);
              showToastMsg(`Đã nạp thành công bộ cảnh ${localPack.name}!`, 'success', 3000);
          } catch (e) {
              showToastMsg('Lỗi khi đọc file từ ổ cứng.', 'error');
          }
      }
  };

  const handleDeleteFfPack = (packId: any, e: any) => {
      e.stopPropagation();
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xóa Bộ cảnh cá nhân này khỏi CSDL? Các video bên trong vẫn sẽ còn trong Kho Video lẻ.',
          onConfirm: async () => {
              const updatedPacks = localFfPacks.filter((p: any) => p.id !== packId && p.name !== packId);
              setLocalFfPacks(updatedPacks);
              try {
                await fetch(`/api/goi-canh-quay?id=${encodeURIComponent(packId)}`, { method: 'DELETE' });
              } catch (err) {}
              showToastMsg('Đã xóa Bộ cảnh cá nhân khỏi CSDL.', 'info');
          }
      });
  };

  const handleDeleteFfClipV2 = (idbKey: any) => {
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xóa vĩnh viễn video này khỏi kho máy?',
          onConfirm: async () => {
              await idb.remove(idbKey);
              const updatedList = localFfClips.filter((c: any) => c.id !== idbKey);
              setLocalFfClips(updatedList);
              localStorage.setItem('taman_local_ff_clips', JSON.stringify(updatedList));
              
              setFfScenes((prev: any[]) => prev.map((s: any) => {
                  if (s.idbKey === idbKey) {
                      if (s.url) URL.revokeObjectURL(s.url);
                      return { ...s, url: null, idbKey: null };
                  }
                  return s;
              }));
              showToastMsg('Đã xóa video khỏi kho.', 'info');
          }
      });
  };

  const handleCopyFfScenesCode = () => {
      let hasLocalBlob = false;
      const sceneCodes = ffScenes.map((s: any) => {
          let safeUrl = s.url;
          if (safeUrl && (safeUrl.startsWith('blob:') || safeUrl.startsWith('idb://'))) {
              hasLocalBlob = true;
              safeUrl = 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY';
          }
          return `            { id: '${s.id}', role: '${s.role}', emotion: '${s.emotion}', url: '${safeUrl || ''}', idbKey: null }`;
      });

      const packCode = `{
      id: 'pack_moi_${Date.now()}', name: 'Bộ Cảnh Mới Của Con', aspect: '${videoAspectRatio === '9x16' ? 'doc' : 'ngang'}',
      scenes: [
${sceneCodes.join(',\n')}
      ]
  }`;

      copyToClipboard(packCode);
      
      if (hasLocalBlob) {
          showToastMsg('Đã copy mã! NHƯNG LƯU Ý: Có chứa video tải lên từ máy tính. Tâm An không thể đưa video trong máy con vào kho chung. Hãy thay bằng Link mạng nhé!', 'error', 12000);
      } else {
          showToastMsg('Đã copy mã Bộ cảnh! Hãy dán vào khung chat cho Tâm An để cập nhật vào Kho Mặc Định vĩnh viễn.', 'success', 8000);
      }
  };

  return {
    ffScenes,
    setFfScenes,
    ffScenesRef,
    localFfClips,
    setLocalFfClips,
    localFfPacks,
    setLocalFfPacks,
    ffVidRefs,
    showFfSaveModal,
    setShowFfSaveModal,
    ffSaveData,
    setFfSaveData,
    showSavePackModal,
    setShowSavePackModal,
    savePackData,
    setSavePackData,
    moveFfScene,
    handleSelectFfClipV2,
    handleDeleteFfClipV2,
    handleUploadFolder,
    showUploadGuide,
    executeSaveFfClipV2,
    executeSaveFfPack,
    handleLoadPack,
    handleDeleteFfPack,
    handleCopyFfScenesCode,
    customCategories,
    setCustomCategories,
    handleAddCustomCategory,
    handleRenameCustomCategory,
    handleDeleteCustomCategory,
    handleDeleteLibraryClip,
    handleBatchDeleteLibraryClips
  };
};
