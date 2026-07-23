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
    if (typeof window !== 'undefined') {
      const savedKey = currentSessionId ? `onglao_ff_scenes_${currentSessionId}` : 'onglao_ff_scenes';
      const saved = localStorage.getItem(savedKey) || localStorage.getItem('onglao_ff_scenes');
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

  useEffect(() => {
    const cleanForStorage = ffScenes.map((s: any) => ({
      ...s,
      url: (s.url && s.url.startsWith('blob:')) ? null : s.url
    }));
    localStorage.setItem('onglao_ff_scenes', JSON.stringify(cleanForStorage));
    if (currentSessionId) {
      localStorage.setItem(`onglao_ff_scenes_${currentSessionId}`, JSON.stringify(cleanForStorage));
    }
  }, [ffScenes, currentSessionId]);
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

  // Load kho Video Dựng Sẵn cá nhân từ bộ nhớ máy
  useEffect(() => {
      const list = JSON.parse(localStorage.getItem('taman_local_ff_clips') || '[]');
      setLocalFfClips(list);
      
      const packList = JSON.parse(localStorage.getItem('taman_local_ff_packs') || '[]');
      setLocalFfPacks(packList);
  }, []);

  // Load trước Video Dựng Sẵn vào RAM
  useEffect(() => {
      ffScenes.forEach((scene: any) => {
          const url = scene.url;
          if (url) {
              if (!ffVidRefs.current[scene.id]) {
                  const v = document.createElement('video');
                  v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                  ffVidRefs.current[scene.id] = v;
              }
              if (ffVidRefs.current[scene.id].src !== url) {
                  ffVidRefs.current[scene.id].src = url;
                  ffVidRefs.current[scene.id].load();
              }
          } else if (ffVidRefs.current[scene.id]) {
              ffVidRefs.current[scene.id].pause();
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

  const handleUploadFolder = (e: any) => {
      const files: any[] = Array.from(e.target.files || []);
      if (files.length === 0) return;

      showToastMsg(`Đang phân tích ${files.length} video...`, 'loading', 2000);

      const newScenesTemplate: any[] = [
          { id: `scene_lao_calm_${Date.now()}`, role: 'lao', emotion: 'calm', url: null, idbKey: null },
          { id: `scene_lao_sad_${Date.now()}`, role: 'lao', emotion: 'sad', url: null, idbKey: null },
          { id: `scene_lao_joy_${Date.now()}`, role: 'lao', emotion: 'joy', url: null, idbKey: null },
          { id: `scene_user_calm_${Date.now()}`, role: 'user', emotion: 'calm', url: null, idbKey: null },
          { id: `scene_user_sad_${Date.now()}`, role: 'user', emotion: 'sad', url: null, idbKey: null },
          { id: `scene_user_joy_${Date.now()}`, role: 'user', emotion: 'joy', url: null, idbKey: null },
          { id: `scene_outro_calm_${Date.now()}`, role: 'outro', emotion: 'calm', url: null, idbKey: null }
      ];

      let matchedCount = 0;

      files.forEach((file: any) => {
          const fileName = file.name.toLowerCase();
          const url = URL.createObjectURL(file as any);

          if (fileName.includes('lao_calm') || fileName.includes('lao_binhthuong')) {
              newScenesTemplate[0].url = url; matchedCount++;
          } else if (fileName.includes('lao_sad') || fileName.includes('lao_buon')) {
              newScenesTemplate[1].url = url; matchedCount++;
          } else if (fileName.includes('lao_joy') || fileName.includes('lao_vui')) {
              newScenesTemplate[2].url = url; matchedCount++;
          } else if (fileName.includes('user_calm') || fileName.includes('con_binhthuong')) {
              newScenesTemplate[3].url = url; matchedCount++;
          } else if (fileName.includes('user_sad') || fileName.includes('con_buon') || fileName.includes('con_khoc')) {
              newScenesTemplate[4].url = url; matchedCount++;
          } else if (fileName.includes('user_joy') || fileName.includes('con_vui') || fileName.includes('con_cuoi')) {
              newScenesTemplate[5].url = url; matchedCount++;
          } else if (fileName.includes('outro') || fileName.includes('vailay') || fileName.includes('kethuc')) {
              newScenesTemplate[6].url = url; matchedCount++;
          } else {
              URL.revokeObjectURL(url);
          }
      });

      if (matchedCount > 0) {
          ffScenes.forEach((s: any) => { if (s.url && s.url.startsWith('blob:')) URL.revokeObjectURL(s.url); });
          setFfScenes(newScenesTemplate);
          showToastMsg(`Đã tự động phân loại và ghép thành công ${matchedCount} cảnh quay! Bạn hãy bấm "Lưu thành Bộ Cảnh" nhé.`, 'success', 6000);
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

          const updatedPacks = [...localFfPacks, newPack];
          setLocalFfPacks(updatedPacks);
          localStorage.setItem('taman_local_ff_packs', JSON.stringify(updatedPacks));
          showToastMsg(`Đã lưu Bộ Cảnh "${savePackData.name}" thành công!`, 'success', 4000);
      } catch (e) {
          console.error("Lỗi lưu Bộ Cảnh:", e);
          showToastMsg('Lỗi khi lưu bộ cảnh. Trình duyệt có thể bị đầy bộ nhớ (Hãy dọn rác RAM).', 'error', 5000);
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
          showToastMsg(`Đang nạp bộ cảnh "${localPack.name}" từ ổ cứng...`, 'loading', 0);
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
          message: 'Bạn có chắc chắn muốn xóa Bộ cảnh cá nhân này? Các video bên trong vẫn sẽ còn trong Kho Video lẻ.',
          onConfirm: () => {
              const updatedPacks = localFfPacks.filter((p: any) => p.id !== packId);
              setLocalFfPacks(updatedPacks);
              localStorage.setItem('taman_local_ff_packs', JSON.stringify(updatedPacks));
              showToastMsg('Đã xóa Bộ cảnh cá nhân.', 'info');
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
    handleCopyFfScenesCode
  };
};
