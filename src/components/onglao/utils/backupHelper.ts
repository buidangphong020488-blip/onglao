import { db, idb } from '../constants';

export const executeFullBackup = async ({
  backupOptions,
  poemDatabase,
  greetingMeta,
  greetingAudioUrls,
  setBackupProgress,
  showToastMsg,
  setIsProcessingBackup,
  setShowBackupOptionsModal
}: any) => {
    setShowBackupOptionsModal(false);
    setIsProcessingBackup(true);
    
    try {
        // Tính tổng số file âm thanh cần đóng gói dựa trên tùy chọn
        let totalAudios = 0;
        if (backupOptions.stanzas) {
            poemDatabase.forEach((p: any) => p.stanzas.forEach((s: any) => { if (s.isSaved) totalAudios++; }));
        }
        if (backupOptions.meanings) {
            poemDatabase.forEach((p: any) => p.stanzas.forEach((s: any) => { if (s.isMeaningSaved) totalAudios++; }));
        }
        
        const allGreetingKeys = Array.from(new Set([...Object.keys(greetingAudioUrls), ...Object.keys(greetingMeta)]));
        if (backupOptions.greetings) {
            totalAudios += allGreetingKeys.length;
        }
        
        setBackupProgress({ current: 0, total: totalAudios, status: 'Đang chuẩn bị đóng gói...' });
        showToastMsg('Đang nén dữ liệu và âm thanh... Vui lòng không đóng trình duyệt!', 'loading', 5000);

        const blobParts: any[] = [];
        
        // Mở đầu chuỗi JSON (Bao gồm cả metadata của Mào Đầu)
        blobParts.push(`{"version":"2.2","timestamp":${Date.now()},"database":${JSON.stringify(poemDatabase)},"greetingMeta":${JSON.stringify(greetingMeta)},"audioBlobs":{`);
        
        let audioIdx = 0;
        let isFirstKey = true;

        // 1. Gói các tệp âm thanh Kệ Pháp
        if (backupOptions.stanzas) {
            for (const poem of poemDatabase) {
                for (const stanza of poem.stanzas) {
                    if (stanza.isSaved) {
                        const idbKey = `audio_stanza_${stanza.id}`;
                        const audioBlob = await idb.get(idbKey);
                        if (audioBlob) {
                            // Chuyển blob sang base64
                            const reader = new FileReader();
                            const base64Promise = new Promise((resolve) => {
                                reader.onloadend = () => {
                                    const base64data = (reader.result as string).split(',')[1];
                                    resolve(base64data);
                                };
                            });
                            reader.readAsDataURL(audioBlob);
                            const base64 = await base64Promise;
                            
                            const comma = isFirstKey ? "" : ",";
                            blobParts.push(`${comma}"${idbKey}":"${base64}"`);
                            isFirstKey = false;
                        }
                        
                        audioIdx++;
                        setBackupProgress((prev: any) => ({ ...prev, current: audioIdx, status: `Đang nén Pháp âm: ${audioIdx}/${totalAudios}` }));
                    }
                }
            }
        }

        // 2. Gói các tệp âm thanh Giải Nghĩa
        if (backupOptions.meanings) {
            for (const poem of poemDatabase) {
                for (const stanza of poem.stanzas) {
                    if (stanza.isMeaningSaved) {
                        const idbKey = `audio_meaning_${stanza.id}`;
                        const audioBlob = await idb.get(idbKey);
                        if (audioBlob) {
                            const reader = new FileReader();
                            const base64Promise = new Promise((resolve) => {
                                reader.onloadend = () => {
                                    const base64data = (reader.result as string).split(',')[1];
                                    resolve(base64data);
                                };
                            });
                            reader.readAsDataURL(audioBlob);
                            const base64 = await base64Promise;
                            
                            const comma = isFirstKey ? "" : ",";
                            blobParts.push(`${comma}"${idbKey}":"${base64}"`);
                            isFirstKey = false;
                        }
                        audioIdx++;
                        setBackupProgress((prev: any) => ({ ...prev, current: audioIdx, status: `Đang nén Pháp âm: ${audioIdx}/${totalAudios}` }));
                    }
                }
            }
        }

        // 3. Gói các tệp âm thanh Mào Đầu (Greetings)
        if (backupOptions.greetings) {
            for (const key of allGreetingKeys) {
                const idbKey = `audio_greeting_${key}`;
                const audioBlob = await idb.get(idbKey);
                if (audioBlob) {
                    const reader = new FileReader();
                    const base64Promise = new Promise((resolve) => {
                        reader.onloadend = () => {
                            const base64data = (reader.result as string).split(',')[1];
                            resolve(base64data);
                        };
                    });
                    reader.readAsDataURL(audioBlob);
                    const base64 = await base64Promise;
                    
                    const comma = isFirstKey ? "" : ",";
                    blobParts.push(`${comma}"${idbKey}":"${base64}"`);
                    isFirstKey = false;
                }
                audioIdx++;
                setBackupProgress((prev: any) => ({ ...prev, current: audioIdx, status: `Đang nén Pháp âm: ${audioIdx}/${totalAudios}` }));
            }
        }

        // Kết thúc JSON
        blobParts.push(`}}`);
        
        const finalBlob = new Blob(blobParts, { type: 'application/json' });
        
        // Tải xuống file backup
        const url = URL.createObjectURL(finalBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `taman_onglao_backup_${new Date().toISOString().slice(0,10)}.taman`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        showToastMsg('Sao lưu 100% dữ liệu bối cảnh và pháp âm thành công!', 'success');
    } catch (err: any) {
        console.error("Lỗi đóng gói Backup khổng lồ:", err);
        showToastMsg(`Lỗi khi tạo sao lưu: ${err.message}`, 'error');
    } finally {
        setIsProcessingBackup(false);
        setBackupProgress({ current: 0, total: 0, status: '' });
    }
};

export const handleImportFullBackup = async (e: any, {
  user,
  poemDatabase,
  setPoemDatabase,
  greetingMeta,
  setGreetingMeta,
  setBackupProgress,
  showToastMsg,
  setIsProcessingBackup,
  backupFileInputRef
}: any) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingBackup(true);
    setBackupProgress({ current: 0, total: 100, status: 'Đang bắt đầu phân tích file...' });
    showToastMsg('Đang chuẩn bị dọn nhà... Vui lòng không đóng trình duyệt!', 'loading', 8000);

    try {
        let textBuffer = '';
        let braceDepth = 0;
        let state = 'root'; // root -> db -> audioBlobs
        
        let metadataJson = '';
        let currentDbClone = [...poemDatabase];
        let currentGreetingMeta = { ...greetingMeta };
        
        let processedAudios = 0;
        
        const CHUNK_SIZE = 5 * 1024 * 1024; // Đọc từng miếng 5MB cực nhanh
        let offset = 0;
        
        const fileReader = new FileReader();

        const readNextChunk = () => new Promise<string>((resolve, reject) => {
            fileReader.onload = () => resolve(fileReader.result as string);
            fileReader.onerror = () => reject(fileReader.error);
            const slice = file.slice(offset, offset + CHUNK_SIZE);
            fileReader.readAsText(slice, 'utf-8');
        });

        let idbBatch: any[] = [];

        while (offset < file.size) {
            const chunk = await readNextChunk();
            const end = Math.min(file.size, offset + CHUNK_SIZE);
            
            textBuffer += chunk;
            
            // XỬ LÝ PHÂN TÍCH LUỒNG STREAM ĐỂ TRÁNH LỖI OVERFLOW RAM
            if (state === 'root') {
                const audioBlobsIndex = textBuffer.indexOf('"audioBlobs":{');
                if (audioBlobsIndex !== -1) {
                    // Cắt lấy toàn bộ Metadata JSON trước phần audioBlobs
                    const metadataPart = textBuffer.slice(0, audioBlobsIndex) + '"audioBlobs":{}';
                    
                    // Thử parse và gộp kệ mới vào
                    const parsedMeta = JSON.parse(metadataPart + '}');
                    
                    // A. Merge Kệ pháp
                    if (parsedMeta.database) {
                        const newDb = parsedMeta.database;
                        const existingTitles = new Set(currentDbClone.map(p => p.title.toLowerCase().trim()));
                        
                        newDb.forEach((p: any) => {
                            if (!existingTitles.has(p.title.toLowerCase().trim())) {
                                currentDbClone.push(p);
                            } else {
                                const matched = currentDbClone.find(x => x.title.toLowerCase().trim() === p.title.toLowerCase().trim());
                                if (matched) {
                                    p.stanzas.forEach((s: any) => {
                                        const stanzaMatch = matched.stanzas.find((sm: any) => sm.content.trim() === s.content.trim());
                                        if (stanzaMatch) {
                                            if (s.isSaved) stanzaMatch.isSaved = true;
                                            if (s.isMeaningSaved) stanzaMatch.isMeaningSaved = true;
                                            if (s.meaning && !stanzaMatch.meaning) stanzaMatch.meaning = s.meaning;
                                        } else {
                                            matched.stanzas.push(s);
                                        }
                                    });
                                }
                            }
                        });
                    }

                    // B. Merge Greetings
                    if (parsedMeta.greetingMeta) {
                        currentGreetingMeta = { ...currentGreetingMeta, ...parsedMeta.greetingMeta };
                    }
                    
                    textBuffer = textBuffer.slice(audioBlobsIndex + '"audioBlobs":{'.length);
                    state = 'audioBlobs';
                }
            }

            if (state === 'audioBlobs') {
                // Quét qua textBuffer để tìm các cặp "key":"base64"
                let commaIndex;
                while ((commaIndex = textBuffer.indexOf('","')) !== -1 || (textBuffer.indexOf('"}}') !== -1 && textBuffer.indexOf('":') !== -1)) {
                    const nextDelimiter = textBuffer.indexOf('","');
                    const isEnd = nextDelimiter === -1;
                    const limit = isEnd ? textBuffer.indexOf('"}}') : nextDelimiter;
                    
                    const itemStr = textBuffer.slice(0, limit);
                    textBuffer = textBuffer.slice(limit + (isEnd ? 3 : 3));
                    
                    const colonIndex = itemStr.indexOf('":');
                    if (colonIndex !== -1) {
                        const key = itemStr.slice(0, colonIndex).replace(/["']/g, '').trim();
                        const base64 = itemStr.slice(colonIndex + 2).replace(/["']/g, '').trim();
                        
                        if (key && base64) {
                            // Bung nén base64 -> Blob asynchronously
                            const convertBase64ToBlob = async (b64: string) => {
                                const response = await fetch(`data:audio/mp3;base64,${b64}`);
                                return await response.blob();
                            };
                            
                            idbBatch.push({
                                idbKey: key,
                                blobPromise: convertBase64ToBlob(base64)
                            });
                            
                            processedAudios++;
                        }
                    }
                    
                    if (isEnd) break;
                }

                // Thực thi ghi DB hàng loạt (Batch set) vào IndexedDB để tiết kiệm RAM & CPU
                if (idbBatch.length >= 100) {
                    const resolvedItems = await Promise.all(idbBatch.map(async item => ({
                        key: item.idbKey,
                        blob: await item.blobPromise
                    })));
                    await idb.setMany(resolvedItems);
                    idbBatch = [];
                }
            }

            // Tiến lên
            offset = end;
            const percent = Math.max(5, Math.min(99, Math.round((offset / file.size) * 100)));
            setBackupProgress({ current: percent, total: 100, status: `Đang quét: ${Math.round(offset/1024/1024)}MB / ${Math.round(file.size/1024/1024)}MB` });
        }

        // Xử lý nốt phần dư trong lô hàng cuối cùng
        if (idbBatch.length > 0) {
            const resolvedItems = await Promise.all(idbBatch.map(async item => ({
                key: item.idbKey,
                blob: await item.blobPromise
            })));
            await idb.setMany(resolvedItems);
        }

        // 3. CHỐT SỔ GIAO DIỆN
        setBackupProgress({ current: 100, total: 100, status: 'Hoàn tất đồng bộ thiết bị...' });
        
        setPoemDatabase([...currentDbClone]);
        localStorage.setItem('taman_poem_db', JSON.stringify(currentDbClone));
        
        // Lưu Metadata Mào đầu mới và kích hoạt load lại vào giao diện
        setGreetingMeta(currentGreetingMeta);
        localStorage.setItem('taman_greetings_db', JSON.stringify(currentGreetingMeta));

        showToastMsg(`Hoàn tất dọn nhà! Đã bung nén siêu tốc ${processedAudios} file âm thanh vào thiết bị này.`, 'success', 8000);
    } catch (err: any) {
        console.error("Lỗi bung nén Backup khổng lồ:", err);
        showToastMsg(`Lỗi khi giải nén: ${err.message || 'File bị hỏng.'}`, 'error', 6000);
    } finally {
        setIsProcessingBackup(false);
        setBackupProgress({ current: 0, total: 0, status: '' });
        if (backupFileInputRef.current) (backupFileInputRef.current as any).value = '';
    }
};
