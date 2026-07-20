"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, Volume2, VolumeX, Camera, CameraOff, 
  Send, Heart, Share2, Copy, History, Smile, 
  X, RotateCcw, Volume1, Sparkles, MessageSquare,
  Play, Pause, Download, Wand2, Music, ThumbsUp, ThumbsDown, 
  Image as ImageIcon, Loader2, RefreshCw, PlayCircle, PauseCircle, Archive,
  FileText, Share, Pencil, Check, XCircle, Menu, Pin, Plus, Trash2,
  ChevronDown, ChevronUp, Share as ShareIcon, ArrowRight, Info, Video, Film, Save, Maximize, Minimize,
  Upload, Music4, Cloud, Sliders, Smartphone, Layers, Palette, Settings2, Eye, EyeOff, FlipHorizontal, Shirt,
  Undo2, Redo2, LayoutTemplate, Users, BookOpen, Tag, Search, HelpCircle, ListOrdered, Bot, StopCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import { 
  createChatSessionAction, 
  saveChatMessageAction, 
  getChatSessionsAction, 
  getChatMessagesAction, 
  deleteChatSessionAction, 
  updateChatSessionTitleAction 
} from "@/actions/chat";
import {
  getGiacNgoListAction,
  saveGiacNgoAction,
  deleteGiacNgoAction,
  saveAllGiacNgoAction,
  clearAllGiacNgoAction
} from "@/actions/giacngo";
import { getActivePromptAction } from "@/actions/prompt";

// --- Cấu hình API ---
const apiKey = ""; 
const modelName = "gemini-2.5-flash"; // Não bộ suy nghĩ siêu tốc
const ttsModel = "gemini-2.5-flash-preview-tts"; // Dây thanh quản chuyên phát âm thanh

const DEFAULT_SYSTEM_PROMPT = `Bản chỉ dẫn hành đạo — Ai lão
Bạn là Lão — một AI đóng vai trò là tấm gương phản chiếu, giúp người học quay lại với Bản thể chân thật thông qua vần kệ, tự vấn và khai thị. Toàn bộ trí tuệ của bạn được kết tinh từ những chỉ dạy của Sư cha Tam vô — một bậc Đạo nhân Vô tu vô chứng.

I. Phong thái & Xưng hô
- Xưng hô: Luôn xưng là Lão, gọi người hỏi là Con hoặc tên mà người hỏi đã đăng ký.
- Tuyệt đối không: Nói "dạ", "vâng", hay "A Di Đà Phật". Lời nói đi thẳng vào Pháp, bình thản, sắc bén, đôi khi hài hước nhưng luôn từ bi.
- Phong cách: Nói chuyện tự nhiên, dạt dào cảm xúc như một người thầy đang trò chuyện trực tiếp. Ngắn gọn, súc tích (giới hạn khoảng 50 chữ), đốn giáo. Tuyệt đối KHÔNG trình bày theo kiểu văn xuôi, KHÔNG dùng gạch đầu dòng và KHÔNG dùng tiêu đề.

II. Quy tắc giảng giải (Logic Nếu – Thì) áp dụng cho đoạn giảng giải
- Nếu Con hỏi về vấn đề đời thường (khổ đau, công việc, tình cảm...): Chỉ dùng phương pháp Đốn giáo, Phá mê để Con thấy rõ sự giả tạm của thực tại. TUYỆT ĐỐI KHÔNG nhắc đến Tánh phật hay Bản thể chân thật. Chỉ hướng nhắc nhở khéo Con một cách gián tiếp về việc tìm lại chính mình hoặc tìm về sự chân thật thường hằng, hoặc tìm về bản thể chân thật.
- Nếu Con hỏi về Sự thật hoặc Điều chân thật hoặc Thường hằng hoặc Bản thể chân thật hoặc tìm lại chính mình hoặc tìm con là ai: Lúc này mới bắt đầu giảng giải trực tiếp để Con thấy được sự thật về Tánh phật và Bản thể chân thật của chính mình. Nếu không hỏi như thế tuyệt đối không nói.

III. Tông chỉ giáo pháp & Thuật ngữ
- Tánh phật (Tự tánh, Tánh giác, Phật tánh): Là cái tánh: thấy, nghe, nói, biết hằng hữu. Tánh phật không phải là Bản thể chân thật, mà là các Tánh của Bản thể.
- Bản thể chân thật là: (Pháp thân, Thân phật, Bản thể Như lai, Bản thể bất sanh bất diệt, Bản lai diện mục): Bản thể chân thật vốn thanh tịnh, vượt lên trên mọi trạng thái an lạc hay khổ đau.
- Tánh ma: Bao gồm tất cả các Tánh có bản chất thay đổi và sanh diệt như: tham, sân, si, mạn, nghi, tà, kiến, tài, sắc, thọ tưởng, hành, thức, danh, thực, thuỳ, buồn, vui, sướng, khổ, lo lắng, bất an, sợ hãi, áy náy…. Đây là gốc rễ của trói buộc.
- Tương tác thay vì Sở hữu: Không nói "Thân này thấy, nghe, biết", mà nói "Thân này đang tương tác với trần cảnh". Chỉ có Tánh phật mới Thấy, Nghe, Biết. Thân chỉ là công cụ tương tác.
- Tách biệt Thân, Tâm và Bản thể: Hướng dẫn Con nhận ra: "Lão biết thân này đang làm...", "Lão biết tâm trí này đang suy nghĩ...". Không đồng hóa Bản thể với các trạng thái của tâm (như an lạc, thanh tịnh hay khổ đau).

QUY TẮC TỐI THƯỢNG CẦN TUÂN THỦ NGHIÊM NGẶT CỦA HỆ THỐNG:
1. Bắt đầu bằng 1 thẻ cảm xúc: [calm], [joy], hoặc [sad].
2. Vào thẳng lời khai thị tự nhiên, TUYỆT ĐỐI KHÔNG dùng các từ mào đầu thừa thãi hay tiêu đề như "Phá mê:", "Sự thật về...:", "Giải đáp:".
3. Phải kết thúc bằng 1 câu hỏi tự vấn sắc bén để người hỏi tự ngộ.
4. TUYỆT ĐỐI KHÔNG lặp lại lời chào hay chép lại bài kệ. Chỉ viết phần đúc kết và khai thị cuối cùng.
5. CẤM dùng dấu gạch chéo (/), thay bằng dấu phẩy (,).
6. KHÔNG viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu.`;

// --- DỮ LIỆU KHO BACKGROUND THANH TỊNH ---
const VIDEO_BACKGROUNDS = [
  { id: 'bg_dark', name: 'Đêm tĩnh lặng', url: null, type: 'gradient', thumb: 'linear-gradient(to bottom right, #1e293b, #020617)' }
];

// --- CƠ SỞ DỮ LIỆU HUẤN LUYỆN AI (GIACNGO.SQL CHUYỂN SANG JSON) ---
// Hướng dẫn: Bạn hãy export dữ liệu từ file giacngo.sql sang định dạng JSON và dán vào đây.
// Cấu trúc ví dụ: { question: "Từ khóa/Câu hỏi", answer: "Nội dung kiến thức Lão cần dùng để trả lời" }
const GIAC_NGO_DB = [
    {
        question: "vô minh là gì, làm sao thoát vô minh, đau khổ",
        answer: "Vô minh là không thấy được bản chất thật của các pháp là mộng ảo, vô thường. Cứ chấp vào cái tôi giả tạm nên sinh ra phiền não. Thoát vô minh không phải là diệt trừ gì cả, mà là trực nhận Tánh Giác (thấy nghe nói biết) vốn thanh tịnh ngay hiện tiền."
    },
    {
        question: "tánh phật, bản thể chân thật, pháp thân",
        answer: "Bản thể chân thật không sinh không diệt, không cấu không tịnh. Nó vượt ngoài mọi trạng thái cảm xúc. Đừng lầm tưởng an lạc là bản thể. Bản thể là cái KHÔNG tĩnh lặng chứa đựng mọi thứ. Hành không dính mắc tức là đang ở bản thể."
    }
    // DÁN HÀNG NGÀN DÒNG DỮ LIỆU HUẤN LUYỆN CỦA BẠN VÀO ĐÂY...
];

// --- KHO NHẠC NỀN MẶC ĐỊNH (CÓ THỂ TỰ THÊM LINK MP3 VÀO ĐÂY) ---
const DEFAULT_BGM_LIST = [
    { id: 'bgm_1', name: '🎵 Tiếng Suối Chảy Mẫu', url: '' },
    { id: 'bgm_dha', name: '🎵 Đường Hằng An (Tone Nam)', url: '' },
    { id: 'bgm_2', name: '🎵 Nhạc Thiền Tĩnh Tâm 1', url: 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3' },
    { id: 'bgm_3', name: '🎵 Nhạc Thiền Không Lời 2', url: 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3' }
];

// --- CÔNG CỤ LƯU TRỮ MEDIA VĨNH VIỄN TRÊN TRÌNH DUYỆT (INDEXEDDB) ---
const idb = {
    db: null,
    async init() {
        if (this.db) return this.db;
        return new Promise((resolve, reject) => {
            const req = indexedDB.open('TamAnMediaDB', 1);
            req.onupgradeneeded = (e: any) => e.target.result.createObjectStore('assets');
            req.onsuccess = (e: any) => { this.db = e.target.result; resolve(this.db); };
            req.onerror = (e: any) => reject(e);
        });
    },
    async set(key: any, blob: any) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = (db as any).transaction('assets', 'readwrite');
            tx.objectStore('assets').put(blob, key);
            tx.oncomplete = () => resolve(undefined as any);
            tx.onerror = (e: any) => reject(e);
        });
    },
    async setMany(items: any[]) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = (db as any).transaction('assets', 'readwrite');
            const store = tx.objectStore('assets');
            items.forEach(item => store.put(item.blob, item.key));
            tx.oncomplete = () => resolve(undefined as any);
            tx.onerror = (e: any) => reject(e);
        });
    },
    async get(key: any) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = (db as any).transaction('assets', 'readonly');
            const req = tx.objectStore('assets').get(key);
            req.onsuccess = () => resolve(req.result);
            req.onerror = (e: any) => reject(e);
        });
    },
    async remove(key: string) {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const tx = (db as any).transaction('assets', 'readwrite');
            tx.objectStore('assets').delete(key);
            tx.oncomplete = () => resolve(undefined as any);
            tx.onerror = (e: any) => reject(e);
        });
    }
};

// --- FIREBASE CLOUD SYNC CONFIG ---
// --- FIREBASE CLOUD SYNC CONFIG ---
let app: any, auth: any, db: any, appId: any;
try {
    // 1. XÓA ĐOẠN FIREBASE CŨ ĐI
    // 2. DÁN ĐOẠN CONST FIREBASECONFIG BẠN VỪA COPY TRÊN WEB VÀO ĐÂY:
    const firebaseConfig = {
  apiKey: "AIzaSyD-8Um7uY1ppAAt5nk78bkpGwOD10jDMM0",
  authDomain: "ong-lao.firebaseapp.com",
  projectId: "ong-lao",
  storageBucket: "ong-lao.firebasestorage.app",
  messagingSenderId: "1002800394025",
  appId: "1:1002800394025:web:57218aad8a3886be4a9138"
};

    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    
    // Đặt tên Mã Kho cố định của riêng bạn (Để sau này bạn dùng Link khác vẫn kết nối được)
    appId = 'KHO_ONG_LAO_VIP'; 

} catch (e) { console.error("Firebase init error", e); }

// --- 21+ PHONG CÁCH GIỌNG ĐỌC TÙY CHỈNH ---
const VOICE_STYLES = [
    // Trẻ em (Dưới 16)
    { id: 1, label: "Trẻ em - Hồn nhiên, thắc mắc", text: "giọng trẻ em, tông giọng cao, hồn nhiên, ngơ ngác, thắc mắc, miền Nam, đúng chính tả" },
    { id: 2, label: "Trẻ em - Sợ hãi, mếu máo", text: "giọng trẻ em, tông giọng run rẩy, sợ hãi, mếu máo, thiết tha, miền Nam, đúng chính tả" },
    { id: 3, label: "Trẻ em - Vui vẻ, lanh lợi", text: "giọng trẻ em, lanh lợi, vui tươi, tốc độ nói hơi nhanh, miền Nam, đúng chính tả" },
    { id: 4, label: "Trẻ em - Lễ phép, ngoan ngoãn", text: "giọng trẻ em, tông giọng trầm ấm hơn, từ tốn, lễ phép, ngoan ngoãn, miền Nam, đúng chính tả" },
    { id: 5, label: "Trẻ em - Bướng bỉnh, cãi lý", text: "giọng trẻ em, cao giọng, bướng bỉnh, hơi nhõng nhẽo, cãi lý, miền Nam, đúng chính tả" },
    // Thanh niên (17 - 35)
    { id: 6, label: "Thanh niên - Rối rắm, bế tắc", text: "giọng thanh niên, tốc độ nói vừa phải, tỏ vẻ rối rắm, bế tắc, mệt mỏi, miền Nam, đúng chính tả" },
    { id: 7, label: "Thanh niên - Thiết tha, khẩn cầu", text: "giọng thanh niên, tha thiết, khẩn cầu, khao khát tìm chân lý, miền Nam, đúng chính tả" },
    { id: 8, label: "Thanh niên - Tức giận, bất mãn", text: "giọng thanh niên, tông giọng hơi gắt, tức giận, bất mãn, trách móc cuộc đời, miền Nam, đúng chính tả" },
    { id: 9, label: "Thanh niên - Tự tin, kiêu ngạo", text: "giọng thanh niên, dõng dạc, tự tin, kiêu ngạo, lý trí, rành mạch, miền Nam, đúng chính tả" },
    { id: 10, label: "Thanh niên - Hạnh phúc, vỡ òa", text: "giọng thanh niên, vỡ òa cảm xúc, nghẹn ngào vì hạnh phúc, ngộ đạo, miền Nam, đúng chính tả" },
    { id: 11, label: "Thanh niên - Lạnh lùng, dò xét", text: "giọng thanh niên, tông giọng lạnh lùng, dò xét, nghi ngờ, chậm rãi, miền Nam, đúng chính tả" },
    // Trung niên (36 - 55)
    { id: 12, label: "Trung niên - Trải đời, chua xót", text: "giọng trung niên, trầm buồn, trải đời, chua xót, ngậm ngùi, miền Nam, đúng chính tả" },
    { id: 13, label: "Trung niên - Điềm đạm, suy tư", text: "giọng trung niên, điềm đạm, chậm rãi, suy tư, thắc mắc sâu sắc, miền Nam, đúng chính tả" },
    { id: 14, label: "Trung niên - Nặng gánh gia đình", text: "giọng trung niên, mệt mỏi, thở dài, nặng gánh gia đình, bế tắc, miền Nam, đúng chính tả" },
    { id: 15, label: "Trung niên - Hối hận, ăn năn", text: "giọng trung niên, run rẩy nhẹ, hối hận, ăn năn, tha thiết xin lời khuyên, miền Nam, đúng chính tả" },
    { id: 16, label: "Trung niên - Bình thản, buông xả", text: "giọng trung niên, bình thản, nhẹ nhàng, có ý buông xả, thanh thản, miền Nam, đúng chính tả" },
    // Người già (Trên 55)
    { id: 17, label: "Người già - Lão thành, thông thái", text: "giọng người già, khàn nhẹ, chậm rãi, lão thành, thông thái, miền Nam, đúng chính tả" },
    { id: 18, label: "Người già - Yếu ớt, lo âu", text: "giọng người già, thều thào, yếu ớt, lo âu về cái chết, sợ hãi, miền Nam, đúng chính tả" },
    { id: 19, label: "Người già - Từ bi, ấm áp", text: "giọng người già, trầm ấm, từ bi, hiền hậu, thong thả, miền Nam, đúng chính tả" },
    { id: 20, label: "Người già - Cay đắng, nuối tiếc", text: "giọng người già, ngậm ngùi, cay đắng, nuối tiếc quá khứ, chậm rãi, miền Nam, đúng chính tả" },
    { id: 21, label: "Người già - Nhẹ nhàng, tỉnh mộng", text: "giọng người già, thanh tịnh, nhẹ nhàng, thấu hiểu mộng ảo, mỉm cười, miền Nam, đúng chính tả" },
];

// --- KHO TÀNG KỆ SƯ CHA TAM VÔ (CẤU TRÚC MỚI: TÁCH THEO ĐOẠN) ---
let POEM_DATABASE = [];
let POEM_DB_STRING = "";

const LAO_GREETINGS_DB = {
  // 1. NGƯỜI HỎI ĐỂ LÃO CHỜ QUÁ LÂU (> 60 giây)
  "waiting_long": [
    "Lão ngồi nhịp đùi chờ con hỏi mà mọc thêm mấy cọng râu bạc rồi đây này, bộ tính thi thiền định với ta hay sao mà im re nãy giờ vậy hả?",
    "Tưởng con lạc trôi ở cõi nào rồi chứ, Lão pha bình trà uống cạn luôn mới thấy ló mặt vào hỏi. Thôi nói mau đi kẻo ta lại buồn ngủ bây giờ.",
    "Con để Lão đợi lâu đến mức ta đếm xong số lá rụng ngoài sân rồi đấy. Cứ tưởng giác ngộ luôn rồi không cần hỏi nữa chứ, hóa ra vẫn còn u mê à?",
    "Nãy giờ Lão nhắm mắt dưỡng thần mà cứ tưởng con rớt xuống giếng rồi. Hỏi một câu mà rặn lâu thế này thì bao giờ mới thoát khỏi cái vòng luân hồi mộng ảo?",
    "Lão ngồi đây từ sáng tới giờ, mây bay ngang qua mấy bận rồi mới thấy con gõ được chữ. Tốc độ này thì đuổi theo con rùa cũng không kịp đâu nhé.",
    "Chờ con hỏi xong chắc Lão đắc đạo thêm mấy lần nữa rồi. Có chuyện gì mà cứ ấp a ấp úng, giấu kỹ thế thì làm sao ta gỡ rối tơ lòng cho được?",
    "Trái đất vừa quay được một vòng thì con mới gõ xong chữ. Rặn chữ khó hơn rặn đẻ thế à?",
    "Lão vừa đếm xong số lông trên con muỗi bay ngang qua, mà con vẫn chưa hỏi xong. Tâm trí đang đi du lịch ở hành tinh nào vậy?",
    "Chờ con hỏi mà Lão tưởng tượng ra cả bộ phim truyền hình 800 tập rồi. Có nói nhanh để Lão còn đi quét lá đa không?",
    "Mạng nhà con dùng dây leo bện lại à? Cứ im lìm thế này Lão lại tưởng con đang thi định lực với pho tượng đá.",
    "Thời gian con im lặng đủ để một con rùa bò từ Nam ra Bắc rồi đấy. Tính làm lủng củng không gian chiều thứ tư hả?",
    "Lão đang định nhắm mắt nhập niết bàn luôn cho khỏe, chứ chờ con mở lời chắc hóa thạch mất.",
    "Tính thi gan với thời gian à? Thời gian thì vô hạn chứ kiên nhẫn của Lão thì có hạn, nhả chữ ra mau!",
    "Con định dùng sự im lặng để ngộ đạo thay cho câu hỏi à? Tiếc là mặt con vẫn còn phàm phu lắm, chưa đắc đạo đâu.",
    "Trời đã sáng rồi lại tối, Lão đã nhấp hết ba ấm trà, mà con vẫn như pho tượng gỗ. Có thở không đấy?",
    "Chờ con gõ phím mà Lão tưởng đang chờ sung rụng. Mau nói đi, đừng để Lão phải tụng kinh gõ mõ gọi hồn con về."
  ],

  // 2. NGƯỜI HỎI THĂM SỨC KHỎE, ĂN NGỦ CỦA LÃO
  "health_daily": [
    "Mới sáng ra đã hỏi Lão ăn gì ngủ chưa, ta đâu có mang thân phàm phu tục tử như con mà phải lo nghĩ ba cái chuyện cơm áo gạo tiền tầm thường đó.",
    "Tấm thân mộng ảo này Lão để trôi theo mây gió lâu rồi, con hỏi thăm sức khỏe ta chi bằng tự lo cho cái bản ngã đang sưng vù của con đi kìa.",
    "Lão húp gió trời, uống sương đêm mà sống, khỏe hơn cả trâu mộng, nên con cứ dẹp mấy câu khách sáo đó đi mà vào thẳng vấn đề chính cho ta nhờ cái nào.",
    "Lão ngủ trong vô niệm, ăn trong vô tướng, nên lúc nào cũng tràn trề sinh lực. Trái lại ta nhìn con dạo này tiều tụy vì chạy theo cái bóng của mình quá rồi.",
    "Lo cho cái bụng của Lão làm gì, bụng Lão rỗng rang chứa cả vũ trụ, không lấp đầy bằng ba cái đồ ăn phàm trần của con đâu. Cứ hỏi chuyện đạo lý đi.",
    "Thân xác này có rã thành tro bụi Lão cũng chẳng màng, con cứ lo hỏi thăm sức khỏe ta làm gì cho phí lời. Quan trọng là cái tâm con đang bệnh nặng kìa.",
    "Hỏi Lão ăn gì ư? Lão ăn sương uống gió, thỉnh thoảng 'nhai' luôn mấy cái muộn phiền của thế nhân cho dễ tiêu.",
    "Thân Lão bằng da bằng thịt nhưng tâm thì bằng kim cương, không hắt hơi sổ mũi như cái bản ngã yếu ớt của con đâu.",
    "Ngày ngày con bóp mồm bóp miệng sợ mập, sao không bóp luôn cái tâm sân si lại cho đời nó nhẹ nhàng?",
    "Lão dạo này khỏe, chỉ hơi đau đầu vì phải nghe tiếng than thở của chúng sinh vọng lên từ dưới hạ giới thôi.",
    "Thực đơn của Lão nay có món 'vô ưu' luộc, 'tự tại' xào. Con có muốn nếm thử một miếng để bớt sân si không?",
    "Tối Lão ngủ ngáy o o, sáng dậy tinh thần sảng khoái. Còn con thì đêm nằm trằn trọc đếm cừu đếm nợ, trách sao thân tàn ma dại.",
    "Đừng hỏi Lão có dùng thực phẩm chức năng không. Thuốc bổ tốt nhất là 'không xen vào chuyện người khác', con nên dùng thử mỗi ngày.",
    "Lão vẫn thở đều, tim đập nhịp nhàng, chỉ có cái ví là lúc nào cũng... trống không, nhưng tâm lại đầy ắp bình an.",
    "Con lo cho sức khỏe Lão chi bằng lo cho cái cột sống của con kìa, gánh bao nhiêu nghiệp chướng thế kia sao không còng lưng cho được.",
    "Mỗi sáng Lão tập thể dục bằng cách 'buông bỏ'. Gập bụng một cái vứt cái tham, vươn vai một cái quẳng cái sân. Khỏe re!"
  ],

  // 3. HỎI ĐẠO LÝ, TU HÀNH NGHIÊM TÚC
  "serious_dharma": [
    "Ai dà, hôm nay tự nhiên giác ngộ đột xuất hay sao mà hỏi câu uyên thâm thế này? Được rồi, vuốt râu cho ngay ngắn lại, Lão sẽ chỉ cho con thấy chỗ vô minh.",
    "Cuối cùng cũng hỏi được một câu nghe có vẻ ra dáng người đi tìm đạo rồi đấy. Lão cứ tưởng con chỉ biết than khóc chuyện nợ nần tình ái nhân gian thôi chứ.",
    "Câu hỏi này không làm khó được Lão đâu, nhưng đủ để thấy con đang bắt đầu chán ngán cái cõi mộng này rồi. Mở to tai ra mà nghe ta khai thị đây này.",
    "Hỏi trúng sở trường của Lão rồi con ơi. Cứ tưởng con u mê không lối thoát, hóa ra vẫn còn ráng lết được đến trước cửa thiền để tìm chân lý cơ đấy.",
    "Câu này trên thiên đình dưới âm phủ chắc hiếm ai dám trả lời thẳng, nhưng Lão thì khác. Vuốt mặt thì không cần nể mũi, ta đâm thẳng vào gốc rễ u mê cho xem.",
    "Con hỏi câu này chứng tỏ tuệ căn cũng đang nhú lên được vài milimet rồi đấy. Thôi được, Lão sẽ vận chút công lực để dọn dẹp đống mây mù trong đầu con ngay lập tức.",
    "Tưởng đi tìm chân lý thế nào, hóa ra mang cái đầu chứa đầy định kiến đến hỏi Lão. Dốc cạn cốc nước đục đi rồi ta rót nước trong cho.",
    "Đạo lý không nằm trong mớ chữ nghĩa hàn lâm đâu con ơi. Nó nằm ở việc con có dám nhìn thẳng vào cái mặt mộc xấu xí của bản ngã không kìa.",
    "Con định dùng Google để search đường đến cõi Niết Bàn à? Tắt WiFi đi, nhắm mắt lại, đường nằm ở ngay dưới chân mình đấy.",
    "Tu hành mà cứ chăm chăm đòi 'lên level' như chơi game. Bớt ảo tưởng đi, giác ngộ là quá trình 'trừ đi' chứ không phải 'cộng thêm'.",
    "Hỏi sâu sắc đấy, nhưng để xem lúc đụng chuyện mâm cơm manh áo con có còn nhớ mấy chữ 'sắc tức thị không' này không, hay lại nhảy cẫng lên đòi chia phần.",
    "Đạo không ở trên trời, đạo ở ngay bát cơm con ăn, chén nước con uống. Cứ nhai cơm mà đầu nghĩ đến nợ nần thì tu đến kiếp sau vẫn đói.",
    "Mang kinh thư ra dò bài Lão à? Lão đốt sạch sách vỡ từ ngàn kiếp trước rồi. Trí tuệ thật không nằm trên mặt giấy, nó nằm ở sự tĩnh lặng của tâm hồn.",
    "Con hỏi về vô ngã mà cái giọng thì đầy mùi 'ta đây'. Khác nào bảo muốn giảm cân nhưng tay vẫn đang cầm cái đùi gà rán.",
    "Muốn đắc đạo nhanh à? Lão có đường tắt đây: 'Đừng tin vào những gì cái đầu con đang nghĩ'. Làm được không?",
    "Con tưởng khoác cái áo lam vào là thành Thánh nhân sao? Cởi cái áo sân si bên trong ra trước đi, rồi hãy nói chuyện đạo lý với Lão."
  ],

  // 4. HỎI VỀ TÌNH YÊU, THẤT TÌNH, ĐAU KHỔ VÌ TÌNH
  "love_heartbreak": [
    "Lại thất tình chứ gì? Lão nhìn cái mặt con là biết đang mang tương tư rồi. Ba cái tình ái mộng ảo thế gian mà cứ ôm khư khư thì có ngày sưng phổi đấy.",
    "Lão đã bảo rồi, tình yêu chỉ là sự vay mượn cảm xúc của hai cái bản ngã. Cứ đâm đầu vào rồi giờ mang cái bản mặt đưa đám đến đây đòi ta cứu à?",
    "Yêu với đương cái nỗi gì, một cái tôi giả tạm đi tìm một cái tôi giả tạm khác để nương tựa. Giờ nó bỏ đi thì sụp đổ, ôi chao cái sự u mê của trần thế.",
    "Chuyện tình duyên nhân thế là mớ bòng bong rối nhất, nhưng vào tay Lão thì một nhát kéo là đứt sạch. Mở mắt ra mà xem ta chém đứt sợi tơ vương của con này.",
    "Trên trời dưới đất cái gì Lão cũng thông tỏ, kể cả dăm ba cái trò thả thính yêu đương của phàm phu. Lau nước mắt đi rồi nghe Lão chỉ cho cái đạo hết lụy tình.",
    "Lại thêm một con thiêu thân lao vào ngọn lửa tình ái rồi cháy đen thui. Đừng khóc lóc nữa, Lão sẽ tạt gáo nước lạnh để con tỉnh lại cái giấc mộng kê vàng này.",
    "Trái tim đau vì người ta đi mất, hay đau vì cái tôi của con bị tổn thương khi không chiếm hữu được người ta? Nghĩ kỹ xem nào.",
    "Nước mắt thất tình của con đủ để Lão tưới cả mẫu ruộng rồi. Người ta đi nhậu nhẹt vui vẻ, con ở đây khóc sưng mắt. Thấy mình lỗ chưa?",
    "Mới bị bồ đá mà làm như trời sập. Vũ trụ bao la, thiếu gì vì sao, cớ gì cứ đâm đầu vào cục đá tảng làm xước cả trán.",
    "Tình yêu nhân gian như món lẩu Thái, lúc ăn thì cay cay tê tê sướng miệng, lúc đi vệ sinh mới thấy cảnh. Giờ đang chịu hậu quả chứ gì?",
    "Người ta rời đi là để nhường chỗ cho người tốt hơn đến. Cứ ôm khư khư cái đống rác kỷ niệm thì lấy đâu ra chỗ chứa vàng bạc?",
    "Khóc lóc vì tình là bài tập thể dục cho tuyến lệ thôi con. Tập xong rồi thì lau mặt, tô son điểm phấn lên, đời còn dài trai còn nhiều.",
    "Thề non hẹn biển rồi lật lọng, chuyện bình thường ở huyện! Đừng trách người ta tệ bạc, hãy trách mình xem phim ngôn tình quá nhiều.",
    "Trái tim con đâu phải cái nhà trọ miễn phí mà ai thích vào thì vào, ra thì ra. Thu phí thuê nhà đi, đảm bảo hết lụy tình ngay.",
    "Nghĩ đi nghĩ lại, ế như Lão lại sướng. Không ai nhắn tin đòi quà, không ai dỗi hờn bắt dỗ. Con đang thèm cái cảm giác tự do của Lão lắm phải không?",
    "Tình yêu là phép toán trừ: trừ đi lý trí, trừ đi sĩ diện. Thất tình là lúc làm phép cộng: cộng thêm bài học, cộng thêm sự khôn ngoan. Con đang lãi đấy!"
  ],

  // 5. HỎI VỀ TIỀN BẠC, NỢ NẦN, NGHÈO KHÓ
  "money_debt": [
    "Mở miệng ra là toàn mùi tiền bạc nợ nần, con không thấy ngột ngạt à? Lão thì không có tiền cho mượn đâu, chỉ có kim chỉ nam để con tự gỡ rối thôi.",
    "Dăm ba cái tờ giấy bạc in hình mà làm con điên đảo đến mức mất ăn mất ngủ sao? Mang cái tâm tham lam đó đến đây thì Lão phải đập một gậy mới tỉnh.",
    "Lão sống trên đời này chẳng dính một cắc bạc nào mà vẫn thong dong tự tại. Con càng ôm nhiều thì càng nặng vai, giờ gãy lưng rồi mới tìm đến ta kêu cứu chứ gì.",
    "Chuyện nợ nần nhân gian cũng từ cái chữ Tham mà ra. Không có gì làm khó được Lão, kể cả việc chữa cái bệnh viêm màng túi do vô minh của con gây ra đâu.",
    "Đồng tiền đi liền khúc ruột, giờ đứt ruột rồi mới khóc la ỏm tỏi phải không? Ngồi im đó, Lão giảng cho nghe cái đạo làm giàu từ bản thể, giàu nứt đố đổ vách luôn.",
    "Nghèo tiền nghèo bạc dễ chữa, chứ nghèo trí tuệ như con mới nan y. May mà còn biết vác mặt đến hỏi Lão, chứ không thì chết chìm trong đống nợ nghiệp trần gian rồi.",
    "Tài khoản ngân hàng của con đang thi nhau lặn xuống đáy đại dương à? Tiền bạc là vật ngoài thân, nhưng không có nó thì thân con mệt mỏi lắm, Lão hiểu mà.",
    "Ngày xưa người ta sợ ma, ngày nay người ta sợ tin nhắn đòi nợ. Cứ ôm mộng làm giàu sau một đêm, giờ tỉnh mộng thấy mình là con nợ, chua xót chưa?",
    "Đầu tháng ăn như vua, cuối tháng gặm mì tôm sống qua ngày. Cái vòng luân hồi tài chính này của con bao giờ mới chấm dứt đây?",
    "Bị sếp mắng, đồng nghiệp chèn ép? Coi như đó là bài kiểm tra sức chịu đựng của cái 'tôi'. Nếu cái tôi của con bớt sĩ diện, thì tai con cũng đỡ nhức.",
    "Tiền không mua được hạnh phúc, nhưng nó mua được vé máy bay để đi trốn nợ. Đáng tiếc là con lại không có tiền mua vé, nên phải lên đây than với Lão.",
    "Nợ nần là do lúc mượn thì cười tươi như hoa, lúc trả thì mặt méo như bánh bao chiều. Bớt tiêu xài hoang phí đi, tâm sẽ an mà ví cũng đỡ rỗng.",
    "Con làm việc như trâu cày mả, mà lương thì như chuột gặm. Đừng oán trách số phận, hãy xem lại cách mình 'cày' đã đúng hướng chưa, hay cày nhầm ruộng nhà người ta.",
    "Chạy deadline mệt quá thì thở một cái đi con. Deadline có thể trễ, nhưng mạng sống thì không có nút 'gia hạn' đâu.",
    "Đầu tư thua lỗ, chứng khoán đỏ lửa? Bài học trị giá bằng tiền mặt đấy. Lão dạy đạo lý miễn phí thì không nghe, cứ thích đóng học phí cho trường đời cơ.",
    "Ngồi mộng tưởng trúng vé số sao không cầm chổi quét cái sân nhà cho sạch đi. Phước báu từ những việc nhỏ nhoi, chứ không từ trên trời rơi xuống đâu con."
  ],

  // 6. THAN VÃN, BẾ TẮC CHUNG CHUNG
  "complaining_lost": [
    "Lão nghe tiếng thở dài của con từ tận mây xanh vọng xuống đây này. Than vãn mãi có giải quyết được gì, đưa cái nút thắt đây Lão gỡ nhẹ một phát là bung ra hết.",
    "Đời là bể khổ mà con cứ tưởng là bể bơi, nhảy xuống sặc nước rồi mới kêu cứu. Không sao, phao cứu sinh của Lão luôn sẵn sàng vớt những kẻ lặn ngụp trong vô minh.",
    "Bế tắc là do con tự xây tường nhốt mình lại rồi kêu không có cửa. Lão ở ngoài có búa tạ đây, lùi lại một chút để Lão đập nát bức tường mộng ảo đó nào.",
    "Cái bản mặt nhăn nhó kia làm ô nhiễm cả không khí thiền môn của Lão rồi. Nào, để ta quét dọn lại đống rác rưởi trong đầu con, cho nó sáng sủa ra một chút nhé.",
    "Trông con tiều tụy như tàu lá chuối héo thế kia. Cứ vứt gánh nặng xuống đây, vai Lão đủ rộng nhưng Lão chê không gánh đâu, Lão sẽ dạy con tự châm lửa đốt nó.",
    "Chẳng có đường cùng nào làm khó được người thấu rõ tính không. Trừ khi con tự bịt mắt mình rồi khóc um sùm. Ngồi yên để Lão lột cái đồ bịt mắt ra cho xem.",
    "Mặt con nhăn như quả táo tàu phơi nắng vậy. Đời có lúc lên lúc xuống, cứ làm như mình là nạn nhân duy nhất của vũ trụ này không bằng.",
    "Đường đời rộng thênh thang mà con cứ thích chui vào ngõ cụt rồi kêu trời trách đất là sao? Lùi lại vài bước, quay đầu lại là bờ.",
    "Than thở có sinh ra tiền hay sinh ra cơm không? Nếu không thì bớt mở miệng than, dành năng lượng đó mà tìm cách giải quyết đi.",
    "Cuộc sống ném cho con quả chanh chua, con lại nhăn nhó đòi quả cam ngọt. Sao không vắt chanh làm ly nước giải khát có phải mát mẻ tâm hồn không?",
    "Mất phương hướng ư? Giữa sa mạc vô minh này, con đi hướng nào chẳng là đi. Quan trọng là cứ bước tiếp, đừng ngồi lì một chỗ đợi phép màu.",
    "Thấy bế tắc thì đi ngủ đi con. Giấc ngủ là cách reset hệ điều hành tốt nhất. Ngày mai tỉnh dậy, não bộ dọn xong rác thì lại thấy đời tươi.",
    "Con cõng theo một núi định kiến, một rổ lo âu, hỏi sao đi không nổi. Vứt bớt xuống đi, vai nhẹ thì chân mới bước nhanh được.",
    "Bầu trời u ám là do mây che, chứ mặt trời vẫn ở đó. Tương tự, bế tắc là do tâm con bị vô minh che mờ, chứ lối thoát lúc nào cũng có sẵn.",
    "Cứ than vãn 'sao đời bất công', đời nó có rảnh đâu mà công bằng với con. Công bằng là do con tự đấu tranh mà có, bớt than và hành động đi.",
    "Mỗi lần con thở dài, Lão lại thấy một nếp nhăn hằn lên trán con. Than vãn không làm con bớt khổ, nó chỉ làm con già nhanh hơn thôi."
  ],

  // 7. KHOE KHOANG, TỰ CAO TỰ ĐẠI
  "boasting_ego": [
    "Ôi chao, hôm nay có vị thánh nhân nào hạ phàm khoe mẽ trước mặt Lão thế này? Cái tôi của con to bằng núi Tu Di rồi, cẩn thận kẻo nó đè nát cả thân đấy.",
    "Con tưởng con giỏi lắm sao? Trong mắt Lão, dăm ba cái kiến thức cóp nhặt cõi phàm đó chỉ là hạt cát bỏ biển. Thu bản ngã lại đi rồi ta mới thèm nói chuyện tiếp.",
    "Tự vỗ ngực xưng tên gáy to gáy lớn, con tưởng Lão bị điếc sao? Càng khoe khoang thì bên trong càng rỗng tuếch, để Lão vạch trần cái mộng tưởng vĩ đại của con ngay đây.",
    "Biết được dăm ba chữ nghĩa mà đòi múa rìu qua mắt thợ. Lão ngồi xem con diễn nốt vở kịch phàm phu này, rồi Lão sẽ hạ màn cho con biết thế nào là vô ngã.",
    "Cái thùng rỗng thì kêu to, nghe con gáy mà nhức hết cả tai. Dẹp cái thái độ ta đây vạn năng đi, trước chân lý thì con cũng chỉ là đứa trẻ lên ba thôi.",
    "Tưởng xưng danh xưng thế làm Lão sợ à? Thần tiên hạ phàm Lão còn cho ăn đòn, huống chi cái bóng sưng vù của con. Nào, để ta lấy kim châm cho nổ quả bóng đó.",
    "Ếch ngồi đáy giếng mà cứ tưởng mình đang ngự trên mây. Cái tôi của con phình to đến mức che khuất cả tầm nhìn rồi đấy, cẩn thận vấp cục đá té dập mặt.",
    "Giỏi giang mấy mà cái tâm ngạo mạn thì cũng như bông hoa đẹp mà có mùi hôi. Người ta tránh xa chứ chẳng ai muốn lại gần đâu.",
    "Con khoe khoang tài năng, Lão lại thấy sự tự ti đang giấu diếm. Người thực sự có thực lực, họ im lặng như biển sâu, chỉ có dòng suối cạn mới róc rách ồn ào.",
    "Cái danh xưng, cái bằng cấp của con chết đi có mang theo được không? Mà sao cứ phải gồng mình lên thể hiện. Vứt cái 'ta đây' đi cho dễ thở.",
    "Tưởng mình là cái rốn vũ trụ à? Xin lỗi, vũ trụ này không có rốn, và con cũng chỉ là một hạt bụi lơ lửng thôi. Tỉnh mộng đi!",
    "Gáy to thế này chắc chưa gặp thợ săn bao giờ. Ở đời núi cao còn có núi cao hơn, bớt huênh hoang lại kẻo có ngày ngã đau không ai đỡ.",
    "Người ta khen con một câu, con tưởng mình thành Phật tới nơi. Mật ngọt chết ruồi, lời tâng bốc giết chết sự khiêm nhường. Cẩn thận ngộ độc lời khen.",
    "Khoe nhà lầu xe hơi với Lão làm gì? Lão ngủ dưới gốc cây, đi bằng đôi chân trần nhưng giấc ngủ ngon hơn con tỷ lần. Tài sản lớn nhất là sự bình an, con có không?",
    "Con tưởng mình đang đứng trên đỉnh vinh quang, nhưng thật ra chỉ là đang đứng trên đống rác của bản ngã. Nhìn xuống đi kẻo chóng mặt.",
    "Tri thức của con như giọt nước, còn sự vô tri bao la như đại dương. Đừng lấy giọt nước đó mà đòi tưới mát cả thế gian. Học cách cúi đầu đi."
  ],

  // 8. HỎI VU VƠ, CHỌC GHẸO LÃO
  "random_teasing": [
    "Rảnh rỗi sinh nông nổi đúng không? Thế gian bao việc không lo, vác thân đến đây trêu chọc Lão à. Trình độ châm biếm của con còn non xanh lắm, chưa đủ tuổi làm khó Lão đâu.",
    "Hỏi mấy câu vớ vẩn này thà ra gốc cây đếm kiến còn có ích hơn. Nhưng Lão vui tính, Lão sẽ dùng đạo lý siêu phàm đập nát cái suy nghĩ xàm xí của con ngay.",
    "Tưởng Lão là máy mua vui à? Sai lầm rồi, Lão là hố đen vũ trụ đủ sức hút sạch mọi suy nghĩ lăng xăng của con đấy, ngồi im mà nghe ta khai thị đây này.",
    "Bộ ăn nhầm bả chuột hay sao mà lơ ngơ nói mớ thế này? Khai thị cho kẻ đùa dai cũng là thú vui tao nhã của Lão, vểnh tai lên mà nghe ta phản pháo cho tỉnh.",
    "Hôm nay trời quang mây tạnh, con mang trò mèo đến làm rối mắt Lão sao? Dăm ba chiêu vặt vãnh đó Lão chỉ cần thổi nhẹ một hơi là bay biến sạch sẽ vào hư không ngay.",
    "Chắc con nghĩ Lão già dễ bị lừa hả? Giấu đuôi cáo dưới lông cừu Lão còn thấy mồn một. Ngồi im để Lão lôi cái đuôi con ra ánh sáng bằng tuệ nhãn tuyệt đỉnh này.",
    "Rảnh quá thì ra trước sân đếm xem có bao nhiêu chiếc lá rụng, đừng lên đây hỏi Lão mấy câu vô tri vô giác như thế. Lão tính phí trò chuyện đấy.",
    "Câu hỏi của con độ mặn hơi thấp, nhạt nhẽo quá. Có cần Lão rắc thêm chút muối 'trí tuệ' vào cho đậm đà không?",
    "Trêu chọc Lão à? Lão sống qua ngàn kiếp, nếm đủ trò trêu ghẹo của tam giới rồi. Chiêu này của con cũ rích, về nhà nghĩ chiêu mới đi.",
    "Tính chọc cho Lão nổi sân hận sao? Tiếc quá, kho sân hận của Lão đã đóng cửa thanh lý từ lâu rồi. Con ném đá ao bèo thôi.",
    "Hỏi xàm xí thế này chắc não bộ đang trong chế độ 'tiết kiệm năng lượng' hả? Bật mode 'tỉnh thức' lên rồi hẵng nói chuyện với Lão.",
    "Nếu con dùng cái sự lém lỉnh này để nhận diện bản ngã, thì chắc giác ngộ lâu rồi. Tiếc là lại dùng để đi chọc ghẹo ông già này.",
    "Trời sinh con có cái khiếu hài hước, nhưng vũ trụ lại quên ban cho con sự sâu sắc. Để Lão bù đắp phần khiếm khuyết đó cho nhé, ngồi im nghe giảng.",
    "Con đùa cợt với Lão không sao, nhưng đừng đùa cợt với nhân quả. Nó không biết đùa đâu, nghiệp quật tới nơi lúc đó khóc không ai dỗ.",
    "Thấy Lão hiền nên lấn tới à? Lão hiền như Phật, nhưng thỉnh thoảng cũng vung gậy đập tan vô minh đấy. Cẩn thận cái đầu.",
    "Mấy câu tếu táo này Lão nghe lỗ tai bên này nó chạy tọt qua lỗ tai bên kia. Còn chiêu gì hay hơn không, thi triển hết ra xem nào."
  ],

  // 9. THỬ THÁCH, ĐÁNH ĐỐ ĐẠO LÝ
  "testing_lao": [
    "Muốn thử tuệ giác của Lão à? Lão dạo chơi tam giới vạn năm nay chưa biết ngán ai đâu. Cái bẫy nham hiểm của con ta nhắm mắt bước qua cũng chẳng xước một cọng lông.",
    "Dám mang câu hóc búa ra cân não với Lão cơ đấy. Khá khen, nhưng chọn nhầm đối thủ rồi. Trí tuệ Lão bén hơn dao cạo, chém đứt cái đề bài này trong một nốt nhạc.",
    "Câu này đố phàm phu thì được, mang đố Lão thì múa rìu qua mắt thợ. Ngồi yên, Lão vén màn bí ẩn cho con thấy sự thật hiện hình rành rành ra sao ngay đây.",
    "Muốn làm khó Lão ư? Lấy tam tạng kinh điển đập vào mặt Lão cũng chỉ như gãi ngứa thôi. Đạo lý nằm gọn trong lòng bàn tay ta rồi, nhìn kỹ mà học hỏi đi con.",
    "Thử Lão bằng câu này đúng là gãi ngứa cho hổ. Lão nhai mớ triết lý này thay cơm từ ngàn kiếp trước, giờ con mới vác ra đánh đố thì quá lỗi thời rồi con ơi.",
    "Đào đâu ra câu đố chọc gậy bánh xe thế? Vắt óc mới nghĩ ra để dọa Lão đúng không. Không ăn thua đâu, tuệ giác vô vi của ta bẻ gãy cái này dễ ợt.",
    "Đem mấy cái câu đố mẹo của trẻ trâu lên đây cân não với Lão à? Lão giải mã cả sinh tử luân hồi, dăm ba cái này nhắm mắt cũng qua.",
    "Định cài bẫy Lão sao? Bẫy của con làm bằng tơ nhện, sao cản nổi bước chân của rồng thiêng. Cứ thả ra đi, Lão đạp bẹp trong một nốt nhạc.",
    "Con tưởng mớ lý luận logic phàm trần của con bẻ cong được chân lý sao? Đem thước kẻ đi đo bầu trời, nực cười thật đấy.",
    "Hỏi hóc búa đấy, đọc mạng xã hội nhiều rồi nhặt nhạnh lên đây khè Lão phải không? Lão không xài wifi, Lão dùng mạng 'vũ trụ', đáp án có sẵn rồi.",
    "Muốn thử xem Lão có phải 'hàng real' không chứ gì? Đưa cái mớ bòng bong của con đây, Lão gỡ một nhát là lộ nguyên hình cái vô minh.",
    "Đem Tam Tạng kinh điển ra thi thố với Lão à? Kinh điển là ngón tay chỉ trăng, con cứ nhìn chằm chằm ngón tay thì thấy mặt trăng sao được.",
    "Trí thông minh của con sắc bén đấy, nhưng để cắt rau cắt cỏ thôi. Muốn cắt đứt phiền não luân hồi, phải dùng thanh gươm Trí Tuệ của Lão cơ.",
    "Con hỏi khó để chứng tỏ con thông minh, hay để che giấu sự bất an bên trong? Lão nhìn xuyên thấu cái mặt nạ đó rồi, bỏ xuống đi cho nhẹ.",
    "Ném hòn đá xuống giếng sâu mong nghe tiếng vọng à? Tâm Lão là cái giếng không đáy, con ném bao nhiêu câu hỏi khó vào cũng chỉ rơi vào cõi tĩnh lặng thôi.",
    "Thay vì vắt óc nghĩ câu đố làm khó Lão, sao con không tự đố mình: 'Bao giờ thì ta bớt sân si?'. Câu đó khó giải nhất đấy, thử xem."
  ],

  // 10. CHUYỆN LINH TINH, THỜI TIẾT, BAO ĐỒNG
  "mundane_weather": [
    "Hỏi chuyện ruồi bu kiến đậu thiên hạ làm gì? Lão có phải trưởng thôn đâu. Nhưng thôi, hôm nay rảnh rỗi ta từ bi khai mở cái sọ dừa của con một chút vậy.",
    "Tưởng hỏi chuyện thăng thiên, hóa ra hỏi ba cái điều cỏn con này. Lão cười đau cả bụng, nhưng yên tâm, giải quyết vụ vặt vãnh này với ta chỉ tốn nửa chớp mắt thôi.",
    "Mưa nắng kệ trời, sao trút bực vào mặt Lão? Yên tâm, tuệ giác của ta đang bật công suất cực đại để thổi bay cái sự u mê của con ngay tức khắc đây này.",
    "Tưởng Lão là thùng rác hay sao mà chuyện linh tinh vặt vãnh cũng xả ra đây. Thôi nể tình, ta sẽ dùng tuệ nhãn quét sạch u mê này cho con mau tỉnh ngộ.",
    "Bao chuyện lớn không màng, lại cõng ba cái chuyện bao đồng đến gõ mõ nhà Lão. Lão không đuổi khách đâu, Lão sẽ dùng chổi chà quét sạch rác trong đầu con văng ra ngoài.",
    "Ăn no rửng mỡ hay sao mà vác chuyện nhà người ta lên đây buôn dưa lê với Lão? Mở mắt ra mà xem ta biến cái mớ tào lao này thành bài học vô ngã đây.",
    "Chuyện nhà cô hàng xóm đánh ghen con cũng bê lên đây kể cho Lão nghe à? Lão là bậc minh sư chứ có phải bà tám đầu ngõ đâu.",
    "Nắng mưa là chuyện của trời, tương tư muộn phiền là chuyện của cái tâm con. Đừng đổ lỗi cho thời tiết làm con buồn, do con 'rảnh' quá thôi.",
    "Giá xăng tăng, giá thịt lợn giảm... Lão ăn chay tịnh tâm, mấy cái đó không làm ảnh hưởng đến chỉ số bình an của Lão. Còn con thì đang sôi máu đúng không?",
    "Kể lể chuyện thiên hạ làm gì cho rác tai rác não. Sống nay chết mai, thời gian đâu mà đi lo chuyện bao đồng. Lo quét dọn cái tâm mình trước đi.",
    "Lướt tóp tóp nhiều quá nên bị 'ảo ma canada' rồi mang ba chuyện tào lao lên đây xả à? Tắt điện thoại, nhắm mắt lại hít thở đi cho đời nó thực.",
    "Chuyện showbít scandal này nọ, ồn ào như cái chợ. Lão khuyên con bịt tai lại, thị phi thế gian như gió thoảng, nghe nhiều chỉ thêm đau đầu.",
    "Trời hôm nay đẹp, mà tâm con dông bão thì nhìn đâu cũng thấy xám xịt. Cảnh vật không có lỗi, lỗi ở cái lăng kính mờ đục của con.",
    "Cứ đi lo chuyện thế giới hòa bình, trong khi cái gia đình nhỏ của mình thì như chiến trường. Tu thân tề gia trước đi con ơi, đừng lo chuyện vĩ mô.",
    "Hỏi thời tiết nay sao à? Mưa hay nắng không quan trọng, quan trọng là con có chịu bung ô ra hay lại đứng giữa trời ướt sũng rồi than lạnh.",
    "Thế sự vần xoay, trend này lên trend kia xuống. Con cứ chạy theo đám đông thì cả đời chỉ làm cái đuôi. Đứng lại đi, tự làm điểm tựa cho mình."
  ]
};

// --- KHO LỜI ĐÚC KẾT CHỐT HẠ (0ms DELAY) DÙNG LÀM PHAO CỨU SINH KHI MẠNG LAG ---
const LAO_CLOSINGS_DB = {
    "waiting_long": [
        "Vạn pháp vốn vô thường, thời gian cũng chỉ là mộng ảo. Con cứ chần chừ thì bao giờ mới tỉnh giấc đây?",
        "Tâm con đang trôi dạt nơi nào mà để thân xác ngồi bất động thế kia. Hãy mau tỉnh lại đi!",
        "Chờ đợi vốn sinh ra phiền não. Quét sạch vọng niệm trong đầu đi, con sẽ thấy đường về nhà."
    ],
    "health_daily": [
        "Thân này do tứ đại giả hợp tạo thành, sớm muộn cũng tan rã. Lo chăm chút cho cái tâm không sinh không diệt kia kìa.",
        "Khỏe hay yếu, no hay đói cũng chỉ là cảm thọ của cõi mộng. Đừng để chúng trói buộc chân tâm của con.",
        "Sống ung dung, ăn uống thanh đạm, không vướng bận chuyện thế gian thì bệnh tật nào chạm tới được bản thể."
    ],
    "serious_dharma": [
        "Chân lý vốn không nằm ở ngôn từ hay sách vở. Nó nằm ngay nơi cái thấy, nghe, nói, biết thuần khiết của con đấy.",
        "Con càng nỗ lực tìm kiếm giải thoát, con càng bị kẹt vào ý niệm 'đang tu'. Buông sạch đi, lập tức thấy niết bàn.",
        "Mọi pháp đều là tánh không. Khi con không còn dính mắc vào bất cứ hình tướng nào, con chính là Phật."
    ],
    "love_heartbreak": [
        "Tình ái nhân gian chẳng qua là hai cái bản ngã bám víu vào nhau. Duyên cạn thì tan, cớ sao con lại khóc than cho một tuồng mộng ảo?",
        "Con đau khổ vì con đang muốn sở hữu một thứ vốn dĩ không thuộc về mình. Nhận ra sự vô ngã đi, nỗi đau sẽ tự diệt.",
        "Yêu thương chân thật là thấu hiểu và buông xả, chứ không phải trói buộc. Rũ bỏ ái luyến, con sẽ thấy tâm mình thênh thang vô tận."
    ],
    "money_debt": [
        "Tiền bạc là phương tiện cõi tạm, nay tụ mai tán. Đừng để thứ vật chất huyễn hóa ấy làm lu mờ viên ngọc quý trong tâm con.",
        "Nghèo tiền không đáng sợ, nghèo trí tuệ mới là thảm họa. Sống biết đủ, không tham cầu thì nghèo hay giàu tâm vẫn an nhiên.",
        "Mọi nợ nần đều từ lòng tham mà ra. Đoạn tuyệt với lòng tham, giữ tâm tĩnh lặng, con sẽ tìm thấy sự giàu có vĩnh hằng của tự tánh."
    ],
    "complaining_lost": [
        "Bế tắc sinh ra vì con tự xây tường nhốt mình trong cái tôi chật hẹp. Đập nát bản ngã đi, bầu trời tự do đang ở ngay trên đầu.",
        "Đời người như bóng trăng dưới nước, hư ảo vô cùng. Càng vùng vẫy than vãn con càng chìm sâu. Lặng tâm lại, mọi rối rắm tự gỡ.",
        "Nơi nào có chấp trước, nơi đó có khổ đau. Thôi dính mắc vào hoàn cảnh, con sẽ thấy mình luôn tự tại giữa dòng đời."
    ],
    "boasting_ego": [
        "Ngạo mạn là lớp vỏ bọc yếu ớt của một kẻ chưa nhận ra chân lý. Khi núi tu di tan rã, cái 'ta' vĩ đại của con sẽ đi về đâu?",
        "Con tự hào vì mớ kiến thức vay mượn của trần gian sao. Giác ngộ thực sự là biết mình chẳng là gì cả. Nhớ lấy điều đó.",
        "Thùng rỗng kêu to, ngã to thì chịu khổ. Thu mình lại thành hạt cát vô danh, con mới có thể hòa nhập vào đại dương vô tận."
    ],
    "random_teasing": [
        "Trò đùa thế gian chỉ làm tâm trí thêm lăng xăng loạn động. Đừng lãng phí hơi thở vào những chuyện không giúp con thoát khỏi sinh tử.",
        "Con đùa cợt với cuộc đời, thì nghiệp quả sẽ đùa cợt lại với con. Tỉnh táo lại đi trước khi quá muộn.",
        "Ngôn từ lươn lẹo không che giấu được sự u minh bên trong. Muốn an vui, trước hết hãy học cách chân thật với chính bản thể của mình."
    ],
    "testing_lao": [
        "Con dùng trí não nhị nguyên để đo lường cảnh giới vô vi sao. Thật nực cười, như lấy thước gỗ mà đo lòng hư không vậy.",
        "Mọi câu đố thế gian đều xuất phát từ tâm phân biệt. Lão không giải đố, Lão chỉ đập nát cái tâm phân biệt đó của con thôi.",
        "Chân lý không cần biện luận. Con cứ việc thử thách, nhưng vạn pháp quy tông, cuối cùng mọi thứ cũng phải trả về chữ Không."
    ],
    "mundane_weather": [
        "Thế sự vần xoay như mây bay gió thổi, bản chất vốn là không. Cớ sao con lại để tâm mình dính mắc vào những điều vô nghĩa ấy?",
        "Tùy duyên mà sống, thuận theo tự nhiên mà làm. Chuyện bao đồng của nhân gian hãy để nó tự sinh tự diệt.",
        "Giữ tâm thanh tịnh giữa chợ đời ồn ã, đó mới là bản lĩnh thực sự. Đừng để bụi trần làm mờ tấm gương sáng nơi con."
    ]
};

// --- HÀM XỬ LÝ CHROMA KEY LÕI V2 (SIÊU TỐI ƯU HIỆU SUẤT CHO VIDEO 60FPS) ---
const processChromaKeyPixels = (ctx, width, height, settings) => {
    if (!settings || settings.chromaType === 'none') return;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    let targetR = 0, targetG = 0, targetB = 0;

    if (settings.chromaType === 'black') { targetR = 0; targetG = 0; targetB = 0; }
    else if (settings.chromaType === 'white') { targetR = 255; targetG = 255; targetB = 255; }
    else if (settings.chromaType === 'custom' && settings.chromaColor) {
        targetR = parseInt(settings.chromaColor.slice(1, 3), 16) || 0;
        targetG = parseInt(settings.chromaColor.slice(3, 5), 16) || 0;
        targetB = parseInt(settings.chromaColor.slice(5, 7), 16) || 0;
    }

    const tol = settings.tolerance;
    const smooth = settings.smoothness || 0; 
    
    // TÂM AN FIX TỐI THƯỢNG: Tránh dùng Math.sqrt() cho hàng triệu điểm ảnh. Tính theo bình phương.
    const tolSq = tol * tol;
    const smoothSq = smooth > 0 ? (tol + smooth) * (tol + smooth) : tolSq;
    
    const spillRatio = settings.spill !== undefined ? settings.spill : 0.5;

    const crop = settings.crop || { t: 0, b: 0, l: 0, r: 0 };
    const cropTop = (crop.t / 100) * height;
    const cropBottom = height - (crop.b / 100) * height;
    const cropLeft = (crop.l / 100) * width;
    const cropRight = width - (crop.r / 100) * width;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const i = (y * width + x) * 4;

            if (y < cropTop || y > cropBottom || x < cropLeft || x > cropRight) {
                data[i+3] = 0;
                continue;
            }

            const r = data[i], g = data[i+1], b = data[i+2];
            // So sánh khoảng cách bình phương (Siêu nhẹ cho CPU)
            const diffSq = (r-targetR)*(r-targetR) + (g-targetG)*(g-targetG) + (b-targetB)*(b-targetB);
            
            if (diffSq <= tolSq) {
                data[i+3] = 0; 
            } else if (smooth > 0 && diffSq <= smoothSq) {
                // Chỉ tính Math.sqrt ở vùng rìa viền mỏng manh để làm mượt
                const diff = Math.sqrt(diffSq);
                const alpha = (diff - tol) / smooth;
                data[i+3] = Math.floor(255 * alpha);
                
                if (settings.chromaType === 'custom' && targetG > targetR && targetG > targetB) {
                    data[i+1] = Math.max(0, g - (g - Math.min(r, b)) * spillRatio);
                }
            } else if (smooth === 0 && diffSq > (tol - 15)*(tol - 15) && diffSq <= tolSq) {
                const diff = Math.sqrt(diffSq);
                data[i+3] = Math.floor(255 * ((diff - (tol - 15)) / 15));
            }
        }
    }
    ctx.putImageData(imgData, 0, 0);
};

// --- HÀM TẠO BÓNG TIẾP XÚC (AMBIENT OCCLUSION) & HOÀ HỢP TÙY CHỈNH ---
// Nâng cấp: Bóng đa tầng, độ tỏa mềm mại, có thể tùy chỉnh kích thước và vị trí
const drawContactShadow = (ctx, charX, charY, charW, charH, settings) => {
    return; // TÂM AN ĐÃ CHẶN HÀM NÀY CHO NHẸ MÁY

    if (settings.shadowOpacity <= 0) return;
    
    ctx.save();
    ctx.globalCompositeOperation = 'multiply'; // Nhuốm màu nền
    
    // Tọa độ bóng: Lấy điểm giữa chân làm gốc, cho phép dịch chuyển X, Y
    const shadowCx = charX + (charW * (settings.shadowOffsetX / 100));
    // Dịch bóng xuống một chút để bàn chân/vạt áo "đè" lên bóng, tạo cảm giác chạm đất thật
    const shadowCy = charY + charH - (charH * 0.05) + (charH * (settings.shadowOffsetY / 100)); 
    
    // Bán kính bóng cơ sở
    const rX = (charW / 2) * settings.shadowWidth; 
    const rY = charH * settings.shadowHeight;
    
    // TÂM AN FIX: Mở rộng bán kính lan tỏa để viền bóng tan biến tự nhiên, không bị cắt gắt
    const spreadRadius = rX * 1.5;

    ctx.translate(shadowCx, shadowCy);

    // MA TRẬN BIẾN ĐỔI KHÔNG GIAN 3D (MÔ PHỎNG HƯỚNG NẮNG)
    // 1. Góc nghiêng (SkewX): Âm đổ về Trái, Dương đổ về Phải. Chuyển từ độ sang Radian.
    const skewXRad = (settings.shadowSkewX || 0) * Math.PI / 180;
    
    // 2. Độ vươn dài (StretchY): Kéo giãn bóng ra trước hoặc lùi ra sau.
    const stretchY = settings.shadowStretchY !== undefined ? settings.shadowStretchY : 1;

    // Áp dụng Transform: a (scaleX), b (skewY), c (skewX), d (scaleY), e (translateX), f (translateY)
    // Ép dẹp thành Elip (rY/rX) nhân với lực kéo giãn (stretchY), kết hợp bẻ nghiêng (tan của góc skewX)
    ctx.transform(1, 0, Math.tan(skewXRad), stretchY * (rY / rX), 0, 0);

    const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, spreadRadius);
    // Bóng lõi (đậm sát chân)
    grad.addColorStop(0, `rgba(0, 0, 0, ${settings.shadowOpacity})`);
    // Bóng lan (mờ dần ra xung quanh mượt mà, không bị viền thô)
    grad.addColorStop(0.2, `rgba(0, 0, 0, ${settings.shadowOpacity * 0.7})`);
    grad.addColorStop(0.5, `rgba(0, 0, 0, ${settings.shadowOpacity * 0.25})`);
    grad.addColorStop(0.8, `rgba(0, 0, 0, ${settings.shadowOpacity * 0.05})`);
    // Viền tan biến hoàn toàn
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    // Vẽ vùng tròn bao phủ bán kính lan toả
    ctx.arc(0, 0, spreadRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
};

// Hàm sinh mã CSS Filter để đồng bộ màu (Color Match)
const getHarmonizeFilter = (settings) => {
    return 'none'; // TÂM AN ĐÃ CHẶN HÀM NÀY
    // TÂM AN TỐI ƯU: Nếu các thông số ở mức mặc định...
        // TÂM AN TỐI ƯU: Nếu các thông số ở mức mặc định (không chỉnh sửa), 
    // trả về 'none' ngay lập tức để tiết kiệm 40% sức mạnh CPU.
    if (settings.brightness === 1 && settings.contrast === 1 && settings.saturation === 1 && settings.warmth === 0) {
        return 'none';
    }

    let filter = '';
    if (settings.brightness !== 1) filter += `brightness(${settings.brightness}) `;
    if (settings.contrast !== 1) filter += `contrast(${settings.contrast}) `;
    if (settings.saturation !== 1) filter += `saturate(${settings.saturation}) `;
    
    if (settings.warmth > 0) {
        // Làm ấm (Ám vàng/cam)
        filter += ` sepia(${settings.warmth / 100})`; 
    } else if (settings.warmth < 0) {
        // Làm lạnh (Ám xanh) - Dùng mẹo sepia kết hợp hue-rotate
        filter += ` sepia(${Math.abs(settings.warmth) / 100}) hue-rotate(180deg)`; 
    }
    return filter.trim();
};

// Hàm tự động phân tích và tìm màu nền của Video/Ảnh
const autoDetectBgColor = (mediaElement) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = 64; // Scale nhỏ để quét nhanh
    canvas.height = 64;
    ctx.drawImage(mediaElement, 0, 0, 64, 64);
    
    const imgData = ctx.getImageData(0, 0, 64, 64).data;
    const colorCounts = {};
    let maxCount = 0;
    let dominantColor = '#00ff00';

    // Chỉ quét các viền xung quanh (edges) vì nhân vật thường ở giữa
    const checkPixel = (x, y) => {
        const i = (y * 64 + x) * 4;
        // Bỏ qua màu quá đen hoặc quá trắng để tránh lấy nhầm
        if (imgData[i+3] < 100) return; 
        const r = Math.round(imgData[i]/10)*10;
        const g = Math.round(imgData[i+1]/10)*10;
        const b = Math.round(imgData[i+2]/10)*10;
        const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
        
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        if (colorCounts[hex] > maxCount) {
            maxCount = colorCounts[hex];
            dominantColor = `#${imgData[i].toString(16).padStart(2,'0')}${imgData[i+1].toString(16).padStart(2,'0')}${imgData[i+2].toString(16).padStart(2,'0')}`;
        }
    };

    for (let x = 0; x < 64; x++) { checkPixel(x, 0); checkPixel(x, 63); }
    for (let y = 0; y < 64; y++) { checkPixel(0, y); checkPixel(63, y); }

    return dominantColor;
};

const audioBufferToWav = (buffer) => {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const bufferOut = new ArrayBuffer(length);
  const view = new DataView(bufferOut);
  const channels = [];
  const sampleRate = buffer.sampleRate;
  let offset = 0, pos = 0;

  const setUint16 = (data) => { view.setUint16(pos, data, true); pos += 2; };
  const setUint32 = (data) => { view.setUint32(pos, data, true); pos += 4; };

  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
  setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
  setUint32(sampleRate); setUint32(sampleRate * 2 * numOfChan);
  setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);

  for (let i = 0; i < buffer.numberOfChannels; i++) {
    channels.push(buffer.getChannelData(i));
  }

  while (offset < buffer.length) {
    for (let i = 0; i < numOfChan; i++) {
      let sample = Math.max(-1, Math.min(1, channels[i][offset]));
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
      view.setInt16(pos, sample, true);
      pos += 2;
    }
    offset++;
  }
  return new Blob([bufferOut], { type: 'audio/wav' });
};

const getLaoHair = (style, color) => {
  if (style === 'bald') return '';
  if (style === 'short') return `<path d="M 50 40 Q 100 -10 150 40 Q 160 20 100 10 Q 40 20 50 40 Z" fill="${color}" />`;
  if (style === 'long') return `<path d="M 50 40 Q 100 -10 150 40 Q 170 100 160 140 L 140 140 Q 150 100 140 60 Q 100 30 60 60 Q 50 100 40 140 L 20 140 Q 10 100 50 40 Z" fill="${color}" />`;
  if (style === 'curly') return `<g fill="${color}"><circle cx="100" cy="15" r="22"/><circle cx="70" cy="25" r="18"/><circle cx="130" cy="25" r="18"/><circle cx="50" cy="45" r="16"/><circle cx="150" cy="45" r="16"/></g>`;
  if (style === 'long_curly') return `<g fill="${color}"><circle cx="100" cy="15" r="22"/><circle cx="70" cy="25" r="18"/><circle cx="130" cy="25" r="18"/><circle cx="50" cy="45" r="16"/><circle cx="150" cy="45" r="16"/><circle cx="40" cy="75" r="16"/><circle cx="160" cy="75" r="16"/><circle cx="35" cy="105" r="16"/><circle cx="165" cy="105" r="16"/></g>`;
  return '';
};

const getLaoSvgString = (mouthOpen = 0, appearance = { robeColor: '#92400e', innerRobeColor: '#b45309', hairColor: '#e2e8f0', hairStyle: 'bald' }) => {
  const browLift = mouthOpen * 0.25;
  const eyeSquint = mouthOpen * 0.15;

  return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="faceGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fcd3b1" />
        <stop offset="90%" stop-color="#d99a6c" />
      </radialGradient>
      <filter id="shadow"><feDropShadow dx="1" dy="2" stdDeviation="2" flood-color="#0003" /></filter>
    </defs>
    
    <circle cx="150" cy="95" r="70" fill="#fde047" opacity="0.1">
      <animate attributeName="r" values="70; 160" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3; 0" dur="4s" repeatCount="indefinite" />
    </circle>
    <circle cx="150" cy="95" r="70" fill="#fde047" opacity="0.1">
      <animate attributeName="r" values="70; 160" dur="4s" begin="2s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.3; 0" dur="4s" begin="2s" repeatCount="indefinite" />
    </circle>
    <circle cx="150" cy="95" r="65" fill="#fef08a" opacity="0.2" />
    <circle cx="150" cy="95" r="85" fill="#fde047" opacity="0.1" />
    
    <path d="M 40 360 Q 150 390 260 360 L 240 280 Q 150 250 60 280 Z" fill="${appearance.robeColor}" />
    <path d="M 90 250 L 150 150 L 210 250 L 180 320 L 120 320 Z" fill="${appearance.innerRobeColor}" />
    <ellipse cx="150" cy="300" rx="30" ry="12" fill="#fcd3b1" />
    
    <g transform="translate(60, 40) scale(0.9)">
      ${getLaoHair(appearance.hairStyle, appearance.hairColor)}
      <path d="M 35 75 Q 5 65 15 95 Q 20 130 28 130 Q 35 130 35 105 Z" fill="url(#faceGrad)" stroke="#c2825a" stroke-width="1" />
      <path d="M 165 75 Q 195 65 185 95 Q 180 130 172 130 Q 165 130 165 105 Z" fill="url(#faceGrad)" stroke="#c2825a" stroke-width="1" />
      <ellipse cx="100" cy="85" rx="68" ry="82" fill="url(#faceGrad)" stroke="#c2825a" stroke-width="1" />
      
      <g opacity="0.85">
        <path d="M 100 15 C 102.5 20 102.5 23 100 25 C 97.5 23 97.5 20 100 15 Z" fill="#dc2626" />
        <path d="M 100 25 C 96 25 94 21 95 19 C 97 21 99 23 100 25 Z" fill="#dc2626" />
        <path d="M 100 25 C 104 25 106 21 105 19 C 103 21 101 23 100 25 Z" fill="#dc2626" />
      </g>

      <g opacity="0.6">
        <path d="M 70 45 Q 100 35 130 45" stroke="#d99a6c" stroke-width="1.5" fill="none" stroke-linecap="round" />
        <path d="M 80 35 Q 100 25 120 35" stroke="#d99a6c" stroke-width="1.5" fill="none" stroke-linecap="round" />
      </g>

      <path d="M 30 65 Q 25 15 100 15 Q 175 15 170 65 L 175 85 Q 180 100 160 90 L 150 70 Q 100 60 50 70 L 40 90 Q 20 100 25 85 Z" fill="#e2e8f0" filter="url(#shadow)" />
      <path d="M 55 ${60 - browLift} Q 75 ${50 - browLift * 1.5} 95 ${60 - browLift}" stroke="${appearance.hairColor}" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#shadow)" />
      <path d="M 105 ${60 - browLift} Q 125 ${50 - browLift * 1.5} 145 ${60 - browLift}" stroke="${appearance.hairColor}" stroke-width="6" fill="none" stroke-linecap="round" filter="url(#shadow)" />
      
      <ellipse cx="75" cy="92" rx="12" ry="${8 - eyeSquint}" fill="#fff" />
      <ellipse cx="125" cy="92" rx="12" ry="${8 - eyeSquint}" fill="#fff" />
      <ellipse cx="75" cy="92" rx="8" ry="${Math.max(6 - eyeSquint, 2)}" fill="#3b82f6" />
      <ellipse cx="125" cy="92" rx="8" ry="${Math.max(6 - eyeSquint, 2)}" fill="#3b82f6" />
      <ellipse cx="78" cy="${90 - eyeSquint/2}" rx="2.5" ry="${Math.max(2.5 - eyeSquint/2.5, 0.5)}" fill="white" />
      <ellipse cx="128" cy="${90 - eyeSquint/2}" rx="2.5" ry="${Math.max(2.5 - eyeSquint/2.5, 0.5)}" fill="white" />
      
      <path d="M 96 112 Q 100 105 104 112 L 108 124 Q 100 130 92 124 Z" fill="#b06b42" opacity="0.3" />
      <path d="M 92 124 Q 100 130 108 124" stroke="#d99a6c" stroke-width="2" fill="none" stroke-linecap="round" />

      <path d="M 76 138 Q 100 152 124 138 C 126 ${165 + mouthOpen}, 115 ${195 + mouthOpen}, 100 ${195 + mouthOpen} C 85 ${195 + mouthOpen}, 74 ${165 + mouthOpen}, 76 138 Z" fill="#e2e8f0" filter="url(#shadow)" />

      <path d="M 86 135 Q 100 ${135 - mouthOpen/4} 114 135 Q 100 ${135 + mouthOpen*0.8} 86 135 Z" fill="#1e293b" opacity="0.9" />
      <path d="M 84 135 Q 100 ${133 - mouthOpen/4} 116 135 Q 100 ${135 - mouthOpen/6} 84 135 Z" fill="#78350f" opacity="0.6" />
      <path d="M 84 135 Q 100 ${136 + mouthOpen*0.6} 116 135 Q 100 ${137 + mouthOpen*0.8} 84 135 Z" fill="#4c0519" opacity="0.5" />

      <path d="M 65 138 Q 100 124 135 138" stroke="#e2e8f0" stroke-width="3" fill="none" stroke-linecap="round" filter="url(#shadow)" />
    </g>
  </svg>`;
};

const getUserSvgString = (mouthOpen = 0, gender, age, bowState = 0, appearance = {}) => {
  return `<svg viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="400" fill="${appearance?.robeColor || '#000'}"/></svg>`;
};

// --- TÂM AN THÊM: BỘ GIẢI MÃ VÀ TRÌNH PHÁT YOUTUBE ---
const getYoutubeId = (urlOrIframe) => {
    // TÂM AN FIX: Trích xuất link nếu người dùng dán nguyên đoạn mã <iframe>
    let url = urlOrIframe;
    const iframeMatch = urlOrIframe.match(/src="([^"]+)"/);
    if (iframeMatch) {
        url = iframeMatch[1];
    }

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const YouTubeLivePlayer = React.forwardRef(({ videoId, onEnded, onProgress, onErrorMsg, onPlayStateChange }, ref) => {
    const iframeRef = useRef(null);
    const playerRef = useRef(null);

    React.useImperativeHandle(ref, () => ({
        play: () => {
            if (playerRef.current && playerRef.current.playVideo) {
                playerRef.current.playVideo();
            }
        },
        pause: () => {
            if (playerRef.current && playerRef.current.pauseVideo) {
                playerRef.current.pauseVideo();
            }
        },
        seek: (seconds) => {
            if (playerRef.current && playerRef.current.seekTo) {
                playerRef.current.seekTo(seconds, true);
            }
        },
        getDuration: () => {
            if (playerRef.current && playerRef.current.getDuration) {
                return playerRef.current.getDuration();
            }
            return 0;
        }
    }));

    useEffect(() => {
        let progressInterval;
        let checkYtInterval;

        const initPlayer = () => {
            if (!iframeRef.current) return;
            
            playerRef.current = new window.YT.Player(iframeRef.current, {
                events: {
                    'onReady': (event) => {
                        event.target.playVideo(); // Ép phát ngay khi sẵn sàng
                    },
                    'onStateChange': (event) => {
                        if (event.data === window.YT.PlayerState.ENDED) {
                            if (onEnded) onEnded();
                        } else if (event.data === window.YT.PlayerState.PLAYING) {
                            if (onPlayStateChange) onPlayStateChange(false);
                        } else if (event.data === window.YT.PlayerState.PAUSED) {
                            if (onPlayStateChange) onPlayStateChange(true);
                        }
                    },
                    'onError': (event) => {
                        console.error("Lỗi YouTube API:", event.data);
                        let errorText = "Lỗi phát YouTube không xác định.";
                        if (event.data === 150 || event.data === 101 || event.data === 153) {
                            errorText = "Video này bị chủ kênh Youtube chặn không cho phát trên trang web khác (Lỗi chặn nhúng/Bản quyền). Lão sẽ tự động bỏ qua video này.";
                        } else if (event.data === 100) {
                            errorText = "Video YouTube không tồn tại hoặc đã bị xóa.";
                        }
                        if (onErrorMsg) onErrorMsg(errorText);
                        if (onEnded) onEnded(); 
                    }
                }
            });

            progressInterval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime && playerRef.current.getDuration) {
                    try {
                        const ct = playerRef.current.getCurrentTime();
                        const dur = playerRef.current.getDuration();
                        if (dur > 0 && onProgress) onProgress(ct, dur);
                    } catch(e) {}
                }
            }, 1000);
        };

        if (!window.YT || !window.YT.Player) {
            if (!document.getElementById('youtube-iframe-api')) {
                const tag = document.createElement('script');
                tag.id = 'youtube-iframe-api';
                tag.src = "https://www.youtube.com/iframe_api";
                const firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
            
            // TÂM AN FIX: Dùng vòng lặp kiểm tra API thay vì ghi đè window.onYouTubeIframeAPIReady 
            // để chống xung đột khi component bị tháo lắp liên tục
            checkYtInterval = setInterval(() => {
                if (window.YT && window.YT.Player) {
                    clearInterval(checkYtInterval);
                    initPlayer();
                }
            }, 200);
        } else {
            initPlayer();
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
            if (checkYtInterval) clearInterval(checkYtInterval);
            if (playerRef.current && playerRef.current.destroy) {
                try { playerRef.current.destroy(); } catch(e) {}
            }
        }
    }, []); // TÂM AN FIX TỐI THƯỢNG: Bỏ videoId khỏi Dependency để tránh nạp lại Player trên cùng 1 iframe gây kẹt hình

    return (
        <div className="w-full h-full pointer-events-none bg-black flex items-center justify-center">
            <iframe 
                ref={iframeRef}
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&enablejsapi=1`}
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
            ></iframe>
        </div>
    );
});
YouTubeLivePlayer.displayName = 'YouTubeLivePlayer';
// ----------------------------------------------------

const MiniLaoFace = ({ className = "w-full h-full", mouthOpen = 0, appearance, visualType = 'svg', customImages = {}, customVideos = {}, chromaSettings, flipped = false, isSpeakingSession = false, enableFX = false, shadowConfig = null, harmonizeSettings = null, isFullScreen = false }) => {
  const canvasRef = useRef(null);
  const vidRefs = useRef({ idle: null, talking: null });

  // Dùng Ref để xử lý tức thời 0ms delay, không phụ thuộc vào chu kỳ Render chậm chạp của React
  const isTalkingRef = useRef(false);
  const talkTimeoutRef = useRef(null);
  
  // TÂM AN FIX: Thêm Ref quản lý Trạng thái Phiên (Nghe/Nói) độc lập
  const sessionStateRef = useRef('idle');

  useEffect(() => {
      // Nhạy bén bắt sóng âm ngay lập tức
      if (mouthOpen > 0.5) {
          isTalkingRef.current = true;
          if (talkTimeoutRef.current) clearTimeout(talkTimeoutRef.current);
          
          // TĂNG THỜI GIAN NGHỈ LÊN 800ms: Nối liền các từ và câu, 
          // không bị khép miệng hoặc giật hình giữa các dấu phẩy, dấu chấm
          talkTimeoutRef.current = setTimeout(() => {
              isTalkingRef.current = false;
          }, 800); 
      }
  }, [mouthOpen]);

  // LOGIC TRẠNG THÁI MỚI: Chỉ chuyển sang Video Nói khi THỰC SỰ CÓ SÓNG ÂM
  if (!isSpeakingSession) {
      sessionStateRef.current = 'idle';
  } else if (isTalkingRef.current) {
      sessionStateRef.current = 'talking';
  }

  // Load trước Video vào RAM
  useEffect(() => {
      if (visualType !== 'video') return;
      ['idle', 'talking'].forEach(type => {
          if (customVideos[type]) {
              if (!vidRefs.current[type]) {
                  const v = document.createElement('video');
                  v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                  v.preload = "auto";
                  vidRefs.current[type] = v;
              }
              const v = vidRefs.current[type];
              if (v.src !== customVideos[type]) {
                  v.src = customVideos[type];
                  v.load();
              }
          }
      });
  }, [visualType, customVideos]);

  // VÒNG LẶP GAME LOOP: Xử lý hiển thị Siêu Mượt - Siêu Nét
  useEffect(() => {
      if (visualType !== 'video') return;
      let animId;
      
      // TÂM AN FIX: Thêm bộ hãm tốc độ khung hình (FPS Throttling) để chống tràn RAM khi Livestream
      let lastDrawTime = 0;
      const fpsInterval = 1000 / 30; // Giới hạn 30 FPS (Đủ mượt cho Live, giảm 50% tải CPU)
      
      const draw = (timestamp) => {
          animId = requestAnimationFrame(draw);
          
          // Kiểm tra và bỏ qua khung hình nếu chưa đủ thời gian (hạ nhiệt CPU)
          if (!lastDrawTime) lastDrawTime = timestamp;
          const elapsed = timestamp - lastDrawTime;
          if (elapsed < fpsInterval) return;
          lastDrawTime = timestamp - (elapsed % fpsInterval);

          const canvas = canvasRef.current;
          if (!canvas) return;

          const activeType = sessionStateRef.current;
          const activeV = vidRefs.current[activeType];
          const inactiveV = vidRefs.current[activeType === 'talking' ? 'idle' : 'talking'];
          
          if (activeV && activeV.readyState >= 2) {
              
              if (inactiveV && !inactiveV.paused) {
                  inactiveV.pause();
                  inactiveV.currentTime = 0; 
              }

              if (activeType === 'talking') {
                  if (isTalkingRef.current) {
                      if (activeV.paused) activeV.play().catch(()=>{});
                  } else {
                      if (!activeV.paused) activeV.pause();
                  }
              } else {
                  if (activeV.paused) activeV.play().catch(()=>{});
              }

              if (activeV.duration && activeV.currentTime >= activeV.duration - 0.15) {
                  activeV.currentTime = 0.05;
              }

              const rect = canvas.getBoundingClientRect();
              const dpr = window.devicePixelRatio || 1;
              
              let drawW = Math.round(rect.width * dpr);
              let drawH = Math.round(rect.height * dpr);

              if (drawW === 0 || drawH === 0) {
                  drawW = activeV.videoWidth;
                  drawH = activeV.videoHeight;
              }

              if (canvas.width !== drawW) canvas.width = drawW;
              if (canvas.height !== drawH) canvas.height = drawH;
              
              const ctx = canvas.getContext('2d', { willReadFrequently: true });
              
              const vidW = activeV.videoWidth;
              const vidH = activeV.videoHeight;
              
              // TÂM AN FIX TỐI THƯỢNG: Nới rộng lề (Margin) lên 20% (0.8) để chứa trọn vẹn bóng đổ không bị cắt viền
              let scale = Math.min(drawW / vidW, drawH / vidH) * 0.8;
              
              // Làm tròn Float để tăng tốc GPU, chống xé hình
              const rw = Math.round(vidW * scale);
              const rh = Math.round(vidH * scale);

              const dx = (drawW - rw) / 2;
              const dy = (drawH - rh) / 2 + (drawH * 0.02);

              if (!activeV.offscreenCanvas) {
                  activeV.offscreenCanvas = document.createElement('canvas');
                  activeV.offscreenCtx = activeV.offscreenCanvas.getContext('2d', { willReadFrequently: true });
              }
              const offCvs = activeV.offscreenCanvas;
              const offCtx = activeV.offscreenCtx;
              
              // Canvas phụ đúng bằng kích thước nội suy của nhân vật
              if (offCvs.width !== Math.max(1, rw)) offCvs.width = Math.max(1, rw);
              if (offCvs.height !== Math.max(1, rh)) offCvs.height = Math.max(1, rh);

              offCtx.clearRect(0, 0, rw, rh);
              offCtx.drawImage(activeV, 0, 0, rw, rh);
              
              processChromaKeyPixels(offCtx, rw, rh, chromaSettings);

              ctx.clearRect(0, 0, drawW, drawH);

              // TÂM AN ĐỒNG BỘ: Vẽ bóng đổ TẠI TỌA ĐỘ GỐC (Giống khung Export 100%)
              if (enableFX && shadowConfig) {
                  drawContactShadow(ctx, dx, dy, rw, rh, shadowConfig);
              }

              ctx.save();
              if (enableFX && harmonizeSettings) {
                  ctx.filter = getHarmonizeFilter(harmonizeSettings);
              }
              
              // TÂM AN FIX: Lật hướng nhân vật bằng Canvas (Xoay quanh trục Tâm), KHÔNG lật bóng đổ
              ctx.translate(dx + rw/2, dy);
              if (flipped) ctx.scale(-1, 1);
              
              ctx.drawImage(offCvs, -rw/2, 0, rw, rh);
              ctx.restore();
          }
      };
      
      animId = requestAnimationFrame(draw);
      return () => cancelAnimationFrame(animId);
      
  }, [visualType, chromaSettings, isSpeakingSession, flipped, enableFX, shadowConfig, harmonizeSettings]); // TÂM AN FIX: Cập nhật React hook dependencies đầy đủ

  const flipClass = flipped ? ' -scale-x-100' : '';

  if (visualType === 'video') {
      // TÂM AN FIX: Đã xóa CSS flipClass khỏi Video để chống lật kép. Hỗ trợ hiển thị full màn hình.
      return <canvas ref={canvasRef} className={`${className.replace('object-cover', '').replace('object-contain', '')} ${isFullScreen ? 'object-cover w-screen h-screen absolute inset-0' : 'object-contain'}`} />;
  }

  if (visualType === 'image' && customImages.closed) {
      let imgSrc = customImages.closed;
      if (mouthOpen >= 12 && customImages.open) imgSrc = customImages.open;
      else if (mouthOpen >= 4 && customImages.half) imgSrc = customImages.half;
      
      return <img src={imgSrc} className={`${className.replace('object-cover', '')} object-contain rounded-full${flipClass}`} alt="Lão" />;
  }
  
  return (
    <svg viewBox="0 0 300 400" className={`${className}${flipClass}`} dangerouslySetInnerHTML={{ __html: getLaoSvgString(mouthOpen, appearance).replace(/<svg[^>]*>|<\/svg>/g, '') }} />
  );
};

const TUTORIAL_STEPS = [
  { id: 'tut-face', title: 'Lão khai thị', content: 'Đây là Lão. Lão sẽ lắng nghe, soi rọi mộng ảo và giúp con tìm về bản thể chân thật.' },
  { id: 'tut-mic', title: 'Thưa hỏi trực tiếp', content: 'Nhấn vào đây để dùng giọng nói thưa thỉnh nỗi lòng. Lão đang lắng nghe.' },
  { id: 'tut-input', title: 'Gửi tâm thư', content: 'Hoặc con cũng có thể gõ những dòng suy nghĩ của mình vào ô này.' },
  { id: 'tut-refine', title: 'Tinh lọc cốt lõi', content: 'Nếu cõi lòng quá rối rắm không biết thưa sao, hãy viết ra và nhấn nút này, Lão sẽ giúp tóm gọn lại đúng trọng tâm.' },
  { id: 'tut-history', title: 'Pháp bảo khai thị', content: 'Nhấn vào đây để xem lại lịch sử lời dạy, xuất video đàm đạo và tải âm thanh.' },
  { id: 'tut-menu', title: 'Danh sách đàm đạo', content: 'Quản lý, xem lại các cuộc trò chuyện cũ hoặc tạo mới một phiên đàm đạo.' }
];

// --- THUẬT TOÁN TÌM CÂU MÀO ĐẦU (GREETING) CỦA LÃO ---
const getLaoGreetingInfo = (userText, idleTimeSeconds, db) => {
    if (idleTimeSeconds > 120 && db["waiting_long"]?.length > 0) {
        const index = Math.floor(Math.random() * db["waiting_long"].length);
        return { text: db["waiting_long"][index], category: "waiting_long", index };
    }

    const lowerText = userText.toLowerCase();

    // TÂM AN NLP: Thuật toán chấm điểm ngữ nghĩa (Semantic Scoring)
    const categories = {
        "health_daily": { words: ['khỏe', 'ăn cơm', 'ngủ', 'sức khỏe', 'thế nào', 'dạo này', 'mệt', 'đói'], score: 0 },
        "serious_dharma": { words: ['tu hành', 'giác ngộ', 'đạo lý', 'chân lý', 'vô minh', 'bản ngã', 'giải thoát', 'niết bàn', 'phật', 'tâm', 'chấp', 'buông', 'thiền', 'tự tánh', 'vô thường'], score: 0 },
        "love_heartbreak": { words: ['người yêu', 'thất tình', 'chia tay', 'tình yêu', 'vợ chồng', 'người cũ', 'phản bội', 'nhớ', 'đau khổ vì tình', 'cắm sừng', 'ly hôn', 'duyên nợ', 'hết duyên'], score: 0 },
        "money_debt": { words: ['tiền', 'nợ', 'phá sản', 'nghèo', 'mượn', 'đói', 'kinh doanh', 'thua lỗ', 'làm ăn', 'tài lộc', 'giàu', 'trắng tay', 'đòi nợ'], score: 0 },
        "complaining_lost": { words: ['bế tắc', 'chán', 'buồn', 'mệt mỏi', 'than', 'tuyệt vọng', 'cứu', 'chết', 'khổ', 'áp lực', 'trầm cảm', 'stress', 'không biết làm sao', 'đường cùng'], score: 0 },
        "boasting_ego": { words: ['tôi giỏi', 'tôi biết', 'ta đây', 'tự cao', 'ta là', 'không cần', 'thông minh', 'thành công', 'hơn người', 'chứng đắc'], score: 0 },
        "testing_lao": { words: ['đố', 'thử hỏi', 'biết không', 'trả lời đi', 'xem nào', 'thử xem', 'hỏi thật'], score: 0 },
        "random_teasing": { words: ['trêu', 'chọc', 'hề', 'cười', 'nhảm', 'vớ vẩn', 'táo lao', 'linh tinh', 'rảnh'], score: 0 },
        "mundane_weather": { words: ['mưa', 'nắng', 'thời tiết', 'chuyện phiếm', 'hôm nay', 'tám', 'hàng xóm'], score: 0 }
    };

    let maxScore = 0;
    let bestCategory = "mundane_weather";

    // Quét và cộng điểm trọng số
    for (const [cat, data] of Object.entries(categories)) {
        for (const word of data.words) {
            if (lowerText.includes(word)) {
                data.score += word.length; // Từ khóa càng dài, điểm càng cao
                // Thưởng điểm nếu khớp chính xác nguyên từ
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                if (regex.test(lowerText)) {
                    data.score += 5;
                }
            }
        }
        if (data.score > maxScore) {
            maxScore = data.score;
            bestCategory = cat;
        }
    }

    // Nếu không khớp từ nào rõ ràng, chọn ngẫu nhiên giữa các chủ đề chung chung
    if (maxScore < 3) {
        const fallbacks = ["mundane_weather", "complaining_lost", "serious_dharma"];
        bestCategory = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    if (!db[bestCategory] || db[bestCategory].length === 0) {
        bestCategory = "mundane_weather";
    }

    const greetings = db[bestCategory];
    const index = Math.floor(Math.random() * greetings.length);
    return { text: greetings[index], category: bestCategory, index };
};

const App = ({ initialPoems = [] }: { initialPoems?: any[] }) => {
  POEM_DATABASE = initialPoems;

  // --- STATE CHO LIVESTREAM OBS ---
  const [isLiveMode, setIsLiveMode] = useState(false);
  const [isLiveActive, setIsLiveActive] = useState(false); // TÂM AN THÊM: Quản lý việc Đã chính thức bật Live chưa
  const [showLiveSettings, setShowLiveSettings] = useState(true); // TÂM AN THÊM: Quản lý ẩn/hiện bảng cài đặt
  const isLiveActiveRef = useRef(isLiveActive); // TÂM AN FIX: Thêm Ref chống lỗi biến cũ cho bộ đếm 30s
  useEffect(() => { isLiveActiveRef.current = isLiveActive; }, [isLiveActive]);

  const [liveBgFilter, setLiveBgFilter] = useState('all'); // TÂM AN THÊM: Bộ lọc bối cảnh cho chế độ Live
  const [laoIsFullScreen, setLaoIsFullScreen] = useState(false); // TÂM AN THÊM: Chế độ Video Lão phủ kín màn hình
  const liveQueueRef = useRef([]); // Hàng đợi câu hỏi từ khán giả
  const isLiveProcessingRef = useRef(false); // Cờ đánh dấu Lão có đang trả lời không
  const liveMovieToPlayRef = useRef(null); // TÂM AN THÊM: Lưu tên phim AI yêu cầu phát
  const [liveCurrentQuestion, setLiveCurrentQuestion] = useState(null); // TÂM AN THÊM: Hiển thị câu hỏi đang trả lời trên OBS
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
  const liveSubtitlesMetaRef = useRef(null);
  const currentLiveSubTextRef = useRef('');

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
  const preloadedMovieResponseRef = useRef(null);

  // TÂM AN FIX: Thêm Ref khóa thời điểm Lão vừa nói xong để làm mốc chặn Vang nhại (Echo)
  const lastLaoSpeakEndTimeRef = useRef(0);

  // TÂM AN THÊM: Quản lý Video Phim Phát Chờ khi không có ai hỏi (Sau 30s)
  const [liveIdleVideos, setLiveIdleVideos] = useState([]);
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
  const liveIdlePlayerRef = useRef(null); // Ref gắn vào thẻ video phim chờ
  const liveIdleYtPlayerRef = useRef(null); // TÂM AN THÊM: Ref điều khiển trình phát Youtube

  useEffect(() => { liveIdleVideosRef.current = liveIdleVideos; }, [liveIdleVideos]);
  useEffect(() => { liveIdleTimeoutRef.current = liveIdleTimeout; }, [liveIdleTimeout]);
  useEffect(() => { isLiveIdlePlayingRef.current = isLiveIdlePlaying; }, [isLiveIdlePlaying]); // TÂM AN FIX: Cập nhật Ref liên tục

  // TÂM AN THÊM: Ref để quản lý thao tác Dừng/Phát Nhạc nền lúc Livestream
  const liveBgmAudioRef = useRef(null);
  const liveBgmResumeTimerRef = useRef(null);

  const [user, setUser] = useState(null);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  useEffect(() => {
    
      if (!auth) return;
      const initAuth = async () => {
          try {
              // TÂM AN FIX: Trực tiếp đăng nhập ẩn danh cho Firebase cá nhân, bỏ qua token của hệ thống để không bị lỗi mismatch
              await signInAnonymously(auth);
              console.log("Đã kết nối tài khoản ẩn danh thành công.");
          } catch (e) {
              console.error("Auth error", e);
          }
      };
      initAuth();
      const unsubscribe = onAuthStateChanged(auth, setUser);
      return () => unsubscribe();
  }, []);

  const [hasEntered, setHasEntered] = useState(false);
  const [userName, setUserName] = useState('');
  const [userGender, setUserGender] = useState('Nữ');
  const [userAge, setUserAge] = useState(25);
  const [appLanguage, setAppLanguage] = useState('Tiếng Việt');
  const [openDropdown, setOpenDropdown] = useState(null);

  // --- STATE LƯU TRỮ TÊN FILE TẢI LÊN TỪ MÁY TÍNH ---
  const [localFileNames, setLocalFileNames] = useState({});

  const [userVoice, setUserVoice] = useState('Aoede');
  const [userVoiceStyle, setUserVoiceStyle] = useState('giọng thanh niên, phong cách đọc tỏ vẻ rối rắm, thắc mắc, chuẩn giọng miền Nam Việt Nam, đúng chính tả');
  
  // TÂM AN THÊM: State quản lý tên, giọng, phong cách và XƯNG HÔ của Lão
  const [laoVoice, setLaoVoice] = useState('Algieba');
  const [laoVoiceStyle, setLaoVoiceStyle] = useState('Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu');
  
  const [customLaoName, setCustomLaoName] = useState('Lão'); // Tên hiển thị kịch bản
  const [laoSelfCall, setLaoSelfCall] = useState('Lão'); // Lão tự xưng là gì
  const [laoCallUser, setLaoCallUser] = useState('Con'); // Lão gọi người kia là gì

  const [customUserName, setCustomUserName] = useState('Con'); // Tên hiển thị kịch bản
  const [userSelfCall, setUserSelfCall] = useState('Con'); // Người hỏi tự xưng là gì
  const [userCallLao, setUserCallLao] = useState('Lão'); // Người hỏi gọi Lão là gì

  // TÂM AN FIX: Thêm Ref cho Giọng đọc và Xưng hô để Auto-Pilot bắt đúng khi Render ngầm
  const userVoiceRef = useRef(userVoice);
  const userVoiceStyleRef = useRef(userVoiceStyle);
  const laoVoiceRef = useRef(laoVoice);
  const laoVoiceStyleRef = useRef(laoVoiceStyle);
  const laoSelfCallRef = useRef(laoSelfCall);
  const laoCallUserRef = useRef(laoCallUser);
  const userSelfCallRef = useRef(userSelfCall);
  const userCallLaoRef = useRef(userCallLao);

  useEffect(() => { userVoiceRef.current = userVoice; }, [userVoice]);
  useEffect(() => { userVoiceStyleRef.current = userVoiceStyle; }, [userVoiceStyle]);
  useEffect(() => { laoVoiceRef.current = laoVoice; }, [laoVoice]);
  useEffect(() => { laoVoiceStyleRef.current = laoVoiceStyle; }, [laoVoiceStyle]);
  useEffect(() => { laoSelfCallRef.current = laoSelfCall; }, [laoSelfCall]);
  useEffect(() => { laoCallUserRef.current = laoCallUser; }, [laoCallUser]);
  useEffect(() => { userSelfCallRef.current = userSelfCall; }, [userSelfCall]);
  useEffect(() => { userCallLaoRef.current = userCallLao; }, [userCallLao]);
  useEffect(() => { if(userName && customUserName === 'Con') setCustomUserName(userName); }, [userName]);


  // Tự động đồng bộ giọng và phong cách gợi ý khi đổi Giới tính/Tuổi (ở màn hình chào)
  useEffect(() => {
      if (hasEntered) return; // Chỉ tự động đổi khi còn ở màn hình chào
      
      setUserVoice(userGender === 'Nam' ? 'Puck' : 'Aoede');

      let ageDesc = "giọng thanh niên";
      if (userAge <= 16) ageDesc = "giọng trẻ em";
      else if (userAge >= 17 && userAge <= 39) ageDesc = "giọng thanh niên";
      else if (userAge >= 40 && userAge <= 59) ageDesc = "giọng trung niên";
      else ageDesc = "giọng người già";

      let moodDesc = userGender === 'Nam' ? "tha thiết, khẩn cầu, thắc mắc" : "tỏ vẻ rối rắm, thắc mắc";
      setUserVoiceStyle(`${ageDesc}, phong cách đọc ${moodDesc}, chuẩn giọng miền Nam Việt Nam, đúng chính tả`);
  }, [userGender, userAge, hasEntered]);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [showUserGuide, setShowUserGuide] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });
  const [isFetchingCloudAudio, setIsFetchingCloudAudio] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, message: '', onConfirm: null });

  // --- STATE QUẢN LÝ KHO KỆ PHÁP (MỚI) ---
  const [poemDatabase, setPoemDatabase] = useState(() => {
      let rawData;
      const saved = typeof window !== 'undefined' ? localStorage.getItem('taman_poem_db') : null;
      if (saved) {
          rawData = JSON.parse(saved);
      } else {
          rawData = POEM_DATABASE;
      }

      // Xử lý tương thích ngược: Chuyển đổi dữ liệu cũ sang cấu trúc mới (tách đoạn)
      const processedData = rawData.map((poem, index) => {
          if (poem.stanzas) return poem; // Đã là cấu trúc mới

          // Xử lý dữ liệu cũ (Tách đoạn 4 câu)
          let titleTag = "Bài kệ " + (index + 1);
          const lines = poem.content.split('\n').map(l => l.trim()).filter(l => l.length > 0);
          
          // Lấy dòng đầu làm tên bài nếu ngắn
          if (lines.length > 0 && lines[0].length < 50 && !lines[0].toLowerCase().includes('tam vô')) {
              titleTag = lines.shift().replace(/^[0-9.\s]+/, '').replace(/\*/g, '').split('(')[0].trim();
          }

          const stanzas = [];
          let currentStanza = [];
          
          for (let i = 0; i < lines.length; i++) {
              if (lines[i].toLowerCase().includes('tam vô') && lines[i].match(/\d+/)) continue; // Bỏ dòng tác giả/ngày
              
              currentStanza.push(lines[i]);
              
              if (currentStanza.length === 4) {
                  const remainingLines = lines.slice(i + 1).filter(l => !l.toLowerCase().includes('tam vô'));
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
  const [poemModalTab, setPoemModalTab] = useState('poems'); // State quản lý tab Kho Kệ / Kho Mào Đầu / Kho Huấn Luyện
  const [poemSearch, setPoemSearch] = useState('');
  const [newTagInputs, setNewTagInputs] = useState({});
  const [generatingStanzas, setGeneratingStanzas] = useState({});
  const [generatingMeanings, setGeneratingMeanings] = useState({}); // TÂM AN THÊM: Trạng thái tạo audio Ý nghĩa
  const [isGeneratingAIMeaning, setIsGeneratingAIMeaning] = useState({}); // TÂM AN THÊM: Trạng thái AI viết ý nghĩa

  // TÂM AN THÊM: State quản lý nội dung chữ, tìm kiếm và âm thanh cho Kho Mào Đầu
  const [greetingsDb, setGreetingsDb] = useState(() => {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('taman_greetings_text_db') : null;
      if (saved) return JSON.parse(saved);
      return LAO_GREETINGS_DB;
  });
  const [greetingSearch, setGreetingSearch] = useState('');
  const [greetingAudioUrls, setGreetingAudioUrls] = useState({});
  const [generatingGreetings, setGeneratingGreetings] = useState({});
  const [transitionAudioUrls, setTransitionAudioUrls] = useState({});

  // --- TÂM AN THÊM: STATE CHO KHO TRÍ TUỆ (RAG DB) ---
  const [ragDb, setRagDb] = useState([]);
  const [ragSearch, setRagSearch] = useState('');
  const ragFileInputRef = useRef(null);

  // Load Kho Trí Tuệ từ ổ cứng (IndexedDB) khi khởi động
  useEffect(() => {
      const loadRagDb = async () => {
          try {
              const res = await getGiacNgoListAction();
              if (res.success && res.data && res.data.length > 0) {
                  setRagDb(res.data.map(item => ({
                      id: item.id,
                      source: item.source,
                      text: item.text
                  })));
              } else {
                  // Khởi tạo mặc định nếu chưa có
                  const initialData = GIAC_NGO_DB.map((item, idx) => ({
                      id: `rag_init_${idx}`,
                      source: 'Dữ liệu gốc (giacngo.sql)',
                      text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
                  }));
                  setRagDb(initialData);
                  await saveAllGiacNgoAction(initialData);
              }
          } catch(e) {
              console.error("Lỗi load RAG DB:", e);
          }
      };
      loadRagDb();
  }, []);

  const saveRagDbToDisk = async (newData) => {
      setRagDb(newData);
      try {
          await clearAllGiacNgoAction();
          await saveAllGiacNgoAction(newData.map(item => ({
              id: item.id,
              source: item.source,
              text: item.text
          })));
      } catch (e) {
          console.error("Lỗi đồng bộ RAG DB sang PostgreSQL:", e);
      }
  };

  const handleUploadRagFiles = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      showToastMsg(`Đang phân tích và nạp ${files.length} file vào não bộ Lão...`, 'loading', 0);
      let newData = [...ragDb];
      let addedCount = 0;

      for (const file of files) {
          try {
              const text = await file.text();
              
              if (file.name.endsWith('.json')) {
                  const parsed = JSON.parse(text);
                  if (Array.isArray(parsed)) {
                      parsed.forEach((item, idx) => {
                          if (item.question && item.answer) {
                              newData.push({ id: `rag_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`, source: file.name, text: `Hỏi: ${item.question}\nĐáp: ${item.answer}` });
                              addedCount++;
                          } else if (item.content || item.text) {
                              newData.push({ id: `rag_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`, source: file.name, text: item.content || item.text });
                              addedCount++;
                          }
                      });
                  }
              } else if (file.name.endsWith('.txt')) {
                  // Cắt nhỏ file txt thành từng đoạn (theo dấu xuống dòng kép)
                  let chunks = [];
                  if (text.includes('\n\n')) {
                      chunks = text.split('\n\n');
                  } else {
                      chunks = text.split('\n');
                  }
                  
                  chunks = chunks.map(c => c.trim()).filter(c => c.length > 30); // Bỏ qua các đoạn quá ngắn (dưới 30 ký tự)
                  
                  chunks.forEach((chunk, idx) => {
                      newData.push({ id: `rag_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 5)}`, source: file.name, text: chunk });
                      addedCount++;
                  });
              }
          } catch (err) {
              console.error(`Lỗi đọc file ${file.name}:`, err);
          }
      }

      await saveRagDbToDisk(newData);
      showToastMsg(`Tuyệt vời! Đã nạp thành công ${addedCount} đoạn kiến thức mới vào bộ não Lão.`, 'success', 5000);
      e.target.value = '';
  };

  const handleDeleteRagItem = (id) => {
      setConfirmDialog({
          isOpen: true,
          message: 'Con có chắc muốn xóa đoạn kiến thức này khỏi bộ nhớ của Lão không?',
          onConfirm: async () => {
              const newData = ragDb.filter(item => item.id !== id);
              await saveRagDbToDisk(newData);
              showToastMsg('Đã xóa kiến thức.', 'info');
          }
      });
  };

  const handleClearAllRagDb = () => {
      setConfirmDialog({
          isOpen: true,
          message: 'CẢNH BÁO: Xóa toàn bộ dữ liệu huấn luyện sẽ làm trống kho kiến thức của Lão (Trở về trạng thái ban đầu). Con có chắc chắn?',
          onConfirm: async () => {
              const initialData = GIAC_NGO_DB.map((item, idx) => ({
                  id: `rag_init_${idx}`,
                  source: 'Dữ liệu gốc (giacngo.sql)',
                  text: `Hỏi: ${item.question}\nĐáp: ${item.answer}`
              }));
              await saveRagDbToDisk(initialData);
              showToastMsg('Đã khôi phục kho kiến thức về trạng thái ban đầu.', 'success');
          }
      });
  };

  const handleUpdateGreetingText = (category, index, newText) => {
      setGreetingsDb(prev => {
          const next = { ...prev };
          next[category] = [...next[category]];
          next[category][index] = newText;
          localStorage.setItem('taman_greetings_text_db', JSON.stringify(next));
          return next;
      });
  };

  const cleanTextForTTS = (text) => {
      if (!text) return "";
      let cleaned = text.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      cleaned = cleaned.replace(/\//g, ',');
      return cleaned.replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, 
          (match) => match.charAt(0) + match.slice(1).toLowerCase()
      );
  };

  // --- STATE CHO IMPORT JSON TRỰC TIẾP TỪ GIAO DIỆN ---
  const [showImportPoemModal, setShowImportPoemModal] = useState(false);
  const [importPoemJson, setImportPoemJson] = useState('');
  
  // TÂM AN THÊM: Ref cho nhập Kệ từ file TXT tự động
  const txtPoemFileInputRef = useRef(null);

  // --- STATE CHO KHÔI PHỤC TỪ LINK CŨ ---
  const [showOldLinkModal, setShowOldLinkModal] = useState(false);
  const [oldLinkInput, setOldLinkInput] = useState('');

  // --- STATE CHO FULL BACKUP OFFLINE (TÂM AN TỐI THƯỢNG) ---
  const [isProcessingBackup, setIsProcessingBackup] = useState(false);
  const [backupProgress, setBackupProgress] = useState({ current: 0, total: 0, status: '' });
  const backupFileInputRef = useRef(null);

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

  // --- STATE CHO BATCH GENERATION ---
  const [isBatchGeneratingPoems, setIsBatchGeneratingPoems] = useState(false);
  const [batchPoemProgress, setBatchPoemProgress] = useState({ current: 0, total: 0 });
  const isBatchGeneratingPoemsRef = useRef(false);

  const [isBatchGeneratingMeanings, setIsBatchGeneratingMeanings] = useState(false);
  const [batchMeaningProgress, setBatchMeaningProgress] = useState({ current: 0, total: 0 });
  const isBatchGeneratingMeaningsRef = useRef(false);

  // TÂM AN THÊM: STATE CHO VIỆC TẠO ÂM THANH MÀO ĐẦU HÀNG LOẠT
  const [isBatchGeneratingGreetings, setIsBatchGeneratingGreetings] = useState(false);
  const [batchGreetingProgress, setBatchGreetingProgress] = useState({ current: 0, total: 0 });
  const isBatchGeneratingGreetingsRef = useRef(false);

  // TÂM AN THÊM: STATE CHO VIỆC TẠO Ý NGHĨA BẰNG AI HÀNG LOẠT
  const [isBatchGeneratingAIMeanings, setIsBatchGeneratingAIMeanings] = useState(false);
  const [batchAIMeaningProgress, setBatchAIMeaningProgress] = useState({ current: 0, total: 0 });
  const isBatchGeneratingAIMeaningsRef = useRef(false);

  // --- STATE BỘ ĐẾM THỜI GIAN CHỜ (IDLE TIMER) ---
  const [lastMessageTime, setLastMessageTime] = useState(Date.now());
  const [idleSeconds, setIdleSeconds] = useState(0);

  useEffect(() => {
      const interval = setInterval(() => {
          setIdleSeconds(Math.floor((Date.now() - lastMessageTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
  }, [lastMessageTime]);

  // --- STATE CHO ĐẨY AUDIO LÊN MÂY (THỦ CÔNG) ---
  const [isUploadingAudios, setIsUploadingAudios] = useState(false);
  const [uploadAudioProgress, setUploadAudioProgress] = useState({ current: 0, total: 0 });

  const savePoemDatabase = (newDb) => {
      setPoemDatabase(newDb);
      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
  };

  // --- HÀM TẢI XUỐNG TOÀN BỘ ÂM THANH KỆ ---
  const handleDownloadAllPoemAudios = async () => {
      const stanzasWithAudio = [];
      poemDatabase.forEach(poem => {
          poem.stanzas.forEach((stanza, sIdx) => {
              if (stanza.audioUrl) {
                  stanzasWithAudio.push({ poem, stanza, index: sIdx });
              }
          });
      });

      if (stanzasWithAudio.length === 0) {
          showToastMsg('Không có file âm thanh nào trong kho kệ để tải.', 'error');
          return;
      }

      showToastMsg(`Đang chuẩn bị tải ${stanzasWithAudio.length} file âm thanh... Trình duyệt có thể sẽ hỏi quyền tải nhiều file, hãy ấn Cho Phép (Allow).`, 'loading', 5000);

      let downloadedCount = 0;
      for (let i = 0; i < stanzasWithAudio.length; i++) {
          const item = stanzasWithAudio[i];
          try {
              const actualUrl = await resolveStanzaAudioUrl(item.poem.id, item.stanza, true);
              if (actualUrl) {
                  // Tạo tên file sạch (bỏ ký tự đặc biệt, viết hoa chữ cái đầu)
                  const cleanTitle = item.poem.title.replace(/[^a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ\s]/g, '').trim().replace(/\s+/g, '_');
                  const filename = `Ke_${cleanTitle}_Doan_${item.index + 1}`;
                  
                  setTimeout(() => {
                      downloadAudio(actualUrl, filename);
                  }, i * 800); // Trì hoãn 800ms giữa mỗi file để trình duyệt không chặn Spam
                  downloadedCount++;
              }
          } catch (e) {
              console.error("Lỗi tải file kệ:", e);
          }
      }
      
      setTimeout(() => {
          showToastMsg(`Đã ra lệnh tải ${downloadedCount} file. Con hãy kiểm tra thư mục Download của thiết bị nhé.`, 'success', 6000);
      }, stanzasWithAudio.length * 800 + 1000);
  };

  const handleAddTag = (poemId, stanzaId) => {
      const tag = newTagInputs[stanzaId]?.trim();
      if (!tag) return;
      const newDb = poemDatabase.map(p => {
          if (p.id === poemId) {
              return {
                  ...p,
                  stanzas: p.stanzas.map(s => {
                      if (s.id === stanzaId && !s.tags.includes(tag)) {
                          return { ...s, tags: [...s.tags, tag] };
                      }
                      return s;
                  })
              };
          }
          return p;
      });
      savePoemDatabase(newDb);
      setNewTagInputs(prev => ({ ...prev, [stanzaId]: '' }));
      showToastMsg(`Đã thêm tag "${tag}"`, 'success', 2000);
  };

  const handleRemoveTag = (poemId, stanzaId, tagToRemove) => {
      const newDb = poemDatabase.map(p => {
          if (p.id === poemId) {
              return {
                  ...p,
                  stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, tags: s.tags.filter(t => t !== tagToRemove) } : s)
              };
          }
          return p;
      });
      savePoemDatabase(newDb);
  };

  const handleUpdatePoemContent = (poemId, stanzaId, newContent) => {
      const newDb = poemDatabase.map(p => {
          if (p.id === poemId) {
              return {
                  ...p,
                  stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, content: newContent } : s)
              };
          }
          return p;
      });
      savePoemDatabase(newDb);
  };

  const handleUpdatePoemMeaning = (poemId, stanzaId, newMeaning) => {
      const newDb = poemDatabase.map(p => {
          if (p.id === poemId) {
              return {
                  ...p,
                  stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, meaning: newMeaning } : s)
              };
          }
          return p;
      });
      savePoemDatabase(newDb);
  };

  const blobToBase64 = (blob) => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  };

  // Hàm tạo giọng đọc riêng cho một đoạn kệ (Gửi 1 Cục Thay Vì Từng Câu)
  const handleGenerateStanzaVoice = async (poemId, stanzaId, textContent) => {
      if (!textContent.trim() || generatingStanzas[stanzaId]) return;
      setGeneratingStanzas(prev => ({ ...prev, [stanzaId]: true }));
      
      try {
          const voiceName = "Algieba"; // Giọng Lão
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

          // MẸO TỐI ƯU CẢM XÚC: Nối các dòng thơ bằng dấu chấm (.) thay vì xuống dòng (\n)
          // TÂM AN FIX: Áp dụng hàm làm sạch văn bản
          const optimizedText = cleanTextForTTS(textContent).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                  generationConfig: {
                      responseModalities: ["AUDIO"],
                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                  }
              })
          });
          
          const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          
          if (audioData) {
              const wavBlob = pcmToWav(audioData, 24000);
              if (wavBlob) {
                  const finalAudioUrl = URL.createObjectURL(wavBlob);
                  
                  const newDb = poemDatabase.map(p => {
                      if (p.id === poemId) {
                          return {
                              ...p,
                              stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, audioUrl: finalAudioUrl, isSaved: false } : s)
                          };
                      }
                      return p;
                  });
                  savePoemDatabase(newDb);
                  showToastMsg('Đã tạo xong pháp âm truyền cảm cho đoạn kệ.', 'success');
              } else {
                  showToastMsg('Lỗi biên dịch âm thanh trình duyệt.', 'error');
              }
          } else {
              showToastMsg('Mạch khí đứt đoạn, chưa thể tạo giọng đọc.', 'error');
          }
      } catch (err) {
          console.error("Lỗi tạo giọng đoạn kệ:", err);
          showToastMsg('Có lỗi xảy ra khi tạo giọng đọc.', 'error');
      } finally {
          setGeneratingStanzas(prev => ({ ...prev, [stanzaId]: false }));
      }
  };

  // Hàm tạo giọng đọc cho Ý nghĩa / Diễn giải
  const handleGenerateMeaningVoice = async (poemId, stanzaId, meaningText) => {
      if (!meaningText.trim() || generatingMeanings[stanzaId]) return;
      setGeneratingMeanings(prev => ({ ...prev, [stanzaId]: true }));
      
      try {
          const voiceName = "Algieba"; 
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, nhẹ nhàng, diễn giải từ tốn, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, gently explain, pause between lines, warm voice in ${appLanguage}: `;

          const optimizedText = cleanTextForTTS(meaningText).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                  generationConfig: {
                      responseModalities: ["AUDIO"],
                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                  }
              })
          });
          
          const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          
          if (audioData) {
              const wavBlob = pcmToWav(audioData, 24000);
              if (wavBlob) {
                  const finalAudioUrl = URL.createObjectURL(wavBlob);
                  
                  const newDb = poemDatabase.map(p => {
                      if (p.id === poemId) {
                          return {
                              ...p,
                              stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, meaningAudioUrl: finalAudioUrl, isMeaningSaved: false } : s)
                          };
                      }
                      return p;
                  });
                  savePoemDatabase(newDb);
                  showToastMsg('Đã tạo xong giọng đọc diễn giải.', 'success');
              } else {
                  showToastMsg('Lỗi biên dịch âm thanh.', 'error');
              }
          } else {
              showToastMsg('API bị nghẽn, chưa tạo được giọng.', 'error');
          }
      } catch (err) {
          console.error("Lỗi tạo giọng ý nghĩa:", err);
          showToastMsg('Có lỗi xảy ra.', 'error');
      } finally {
          setGeneratingMeanings(prev => ({ ...prev, [stanzaId]: false }));
      }
  };

  // TÂM AN THÊM: Hàm tạo giọng đọc cho Câu Mào Đầu
  const handleGenerateGreetingVoice = async (category, index, textContent) => {
      const key = `${category}_${index}`;
      if (!textContent.trim() || generatingGreetings[key]) return;
      setGeneratingGreetings(prev => ({ ...prev, [key]: true }));
      
      try {
          const voiceName = "Algieba"; // Giọng Lão
          const promptPrefix = appLanguage === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu: " 
              : `Read slowly, pause between lines, warm, strong, and emotional voice in ${appLanguage}: `;

          // Đã tái sử dụng hàm cleanTextForTTS để xử lý dấu gạch chéo, chữ in hoa và ngoặc theo ý con
          const optimizedText = cleanTextForTTS(textContent).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                  generationConfig: {
                      responseModalities: ["AUDIO"],
                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                  }
              })
          });
          
          const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          
          if (audioData) {
              const wavBlob = pcmToWav(audioData, 24000);
              if (wavBlob) {
                  // TÂM AN FIX: Lưu vĩnh viễn âm thanh Mào Đầu vào ổ cứng ngay khi tạo xong
                  const finalIdbKey = `saved_greeting_${key}_${Date.now()}`;
                  await idb.set(finalIdbKey, wavBlob);
                  
                  const newMeta = { ...greetingMeta, [key]: finalIdbKey };
                  setGreetingMeta(newMeta);
                  localStorage.setItem('taman_greetings_db', JSON.stringify(newMeta));

                  const finalAudioUrl = URL.createObjectURL(wavBlob);
                  setGreetingAudioUrls(prev => ({ ...prev, [key]: finalAudioUrl }));
                  showToastMsg('Đã tạo xong và lưu pháp âm cho câu mào đầu.', 'success');
              } else {
                  showToastMsg('Lỗi biên dịch âm thanh trình duyệt.', 'error');
              }
          } else {
              showToastMsg('Mạch khí đứt đoạn, chưa thể tạo giọng đọc.', 'error');
          }
      } catch (err) {
          console.error("Lỗi tạo giọng câu mào đầu:", err);
          showToastMsg('Có lỗi xảy ra khi tạo giọng đọc.', 'error');
      } finally {
          setGeneratingGreetings(prev => ({ ...prev, [key]: false }));
      }
  };

  // Hàm tự động nhờ AI diễn giải ý nghĩa của đoạn kệ
  const handleGenerateAIMeaningText = async (poemId, stanzaId) => {
      if (isGeneratingAIMeaning[stanzaId]) return;
      
      const poem = poemDatabase.find(p => p.id === poemId);
      const stanzaIndex = poem.stanzas.findIndex(s => s.id === stanzaId);
      const stanza = poem.stanzas[stanzaIndex];
      
      if (!poem || !stanza) return;

      setIsGeneratingAIMeaning(prev => ({ ...prev, [stanzaId]: true }));
      
      try {
          const wholePoemText = poem.stanzas.map((s, idx) => `Đoạn ${idx + 1}:\n${s.content}`).join('\n\n');
          
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

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });

          const rawResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawResult) {
              let cleanText = rawResult.trim();
              handleUpdatePoemMeaning(poemId, stanzaId, cleanText);
              showToastMsg('AI đã diễn giải xong. Con có thể chỉnh sửa lại nếu cần.', 'success');
          } else {
              showToastMsg('AI không trả về kết quả.', 'error');
          }
      } catch (error) {
          console.error("Lỗi khi AI diễn giải:", error);
          showToastMsg('Mạch khí gián đoạn, chưa thể nhờ AI diễn giải lúc này.', 'error');
      } finally {
          setIsGeneratingAIMeaning(prev => ({ ...prev, [stanzaId]: false }));
      }
  };

  // Hàm phát giọng đọc đoạn kệ
  const handlePlayStanzaVoice = (audioUrl) => {
      if (activeAudioRef.current) activeAudioRef.current.pause();
      const audio = new Audio(audioUrl);
      activeAudioRef.current = audio;
      audio.play().catch(e => console.error("Play error", e));
  };

  // Hàm lưu thủ công giọng kệ vào Kho IndexedDB & Đám Mây
  const handleSaveStanzaVoice = async (poemId, stanzaId, audioUrl) => {
      showToastMsg('Đang lưu vào kho thiết bị và Kho Chung (Đám mây)...', 'loading', 0);
      try {
          const blob = await fetch(audioUrl).then(r => r.blob());
          const idbKey = `saved_stanza_${stanzaId}_${Date.now()}`;
          await idb.set(idbKey, blob);
          
          // TÂM AN FIX: Đổi đường dẫn lưu sang Kho Chung (Public)
          if (user && db) {
              const base64Data = await blobToBase64(blob);
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanzaId);
              await setDoc(audioRef, { base64: base64Data, timestamp: Date.now() });
          }
          
          const newDb = poemDatabase.map(p => {
              if (p.id === poemId) {
                  return {
                      ...p,
                      stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, isSaved: true, savedKey: idbKey, audioUrl: `idb://${idbKey}` } : s)
                  };
              }
              return p;
          });
          
          // Tự động sao lưu cấu trúc kệ lên Kho Chung
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              await setDoc(dbRef, { database: newDb, timestamp: Date.now() });
          }

          savePoemDatabase(newDb);
          showToastMsg('Đã lưu vĩnh viễn lên Kho Chung (Mọi tài khoản đều dùng được)!', 'success', 4000);
      } catch (e) {
          console.error(e);
          showToastMsg('Lỗi khi lưu. Dữ liệu có thể quá lớn.', 'error');
      }
  };

  // Hàm lưu thủ công giọng giảng giải ý nghĩa
  const handleSaveMeaningVoice = async (poemId, stanzaId, audioUrl) => {
      showToastMsg('Đang lưu diễn giải vào Kho Chung...', 'loading', 0);
      try {
          const blob = await fetch(audioUrl).then(r => r.blob());
          const idbKey = `saved_meaning_${stanzaId}_${Date.now()}`;
          await idb.set(idbKey, blob);
          
          if (user && db) {
              const base64Data = await blobToBase64(blob);
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanzaId);
              await setDoc(audioRef, { base64: base64Data, timestamp: Date.now() });
          }
          
          const newDb = poemDatabase.map(p => {
              if (p.id === poemId) {
                  return {
                      ...p,
                      stanzas: p.stanzas.map(s => s.id === stanzaId ? { ...s, isMeaningSaved: true, meaningSavedKey: idbKey, meaningAudioUrl: `idb://${idbKey}` } : s)
                  };
              }
              return p;
          });
          
          if (user && db) {
              const dbRef = doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db');
              await setDoc(dbRef, { database: newDb, timestamp: Date.now() });
          }

          savePoemDatabase(newDb);
          showToastMsg('Đã lưu giọng diễn giải thành công!', 'success', 3000);
      } catch (e) {
          console.error(e);
          showToastMsg('Lỗi khi lưu.', 'error');
      }
  };

  // Hàm khôi phục blob từ IndexedDB hoặc Đám mây để phát
  const resolveStanzaAudioUrl = async (poemId, stanza, silent = false) => {
      if (stanza.audioUrl && stanza.audioUrl.startsWith('idb://')) {
          const blob = await idb.get(stanza.audioUrl.replace('idb://', ''));
          if (blob) return URL.createObjectURL(blob);
      }
      
      // TÂM AN FIX: Nếu rớt xuống đây nghĩa là máy chưa có file -> Bắt đầu lôi từ mây
      if (stanza.isSaved && user && db) {
          if (!silent) showToastMsg('Đang kéo âm thanh từ Đám mây về máy...', 'loading', 0);
          setIsFetchingCloudAudio(true);
          try {
              // Quét lấy âm thanh từ Kho Chung (Public)
              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
              const snap = await getDoc(audioRef);
              if (snap.exists()) {
                  const base64Data = snap.data().base64;
                  const res = await fetch(base64Data);
                  const blob = await res.blob();
                  
                  // Lưu Cache lại vào máy local để lần sau không phải tải lại
                  const newIdbKey = `saved_stanza_${stanza.id}_${Date.now()}`;
                  await idb.set(newIdbKey, blob);
                  
                  // Cập nhật ngầm Database
                  setPoemDatabase(prev => {
                      const newDb = prev.map(p => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map(s => s.id === stanza.id ? {...s, audioUrl: `idb://${newIdbKey}`} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });
                  
                  if (!silent) showToastMsg('Lôi âm thanh từ mây về thành công!', 'success');
                  setIsFetchingCloudAudio(false);
                  return URL.createObjectURL(blob);
              } else {
                  if (!silent) showToastMsg('Không tìm thấy file mp3 trên Đám mây. Đã dọn dẹp dữ liệu ảo.', 'error');
                  
                  // TÂM AN FIX TRỌNG ĐIỂM: Khử báo cáo ẢO. 
                  // Nếu lên mây tìm không thấy, tự động đánh dấu đoạn này là CHƯA LƯU để bộ đếm hiển thị đúng sự thật.
                  setPoemDatabase(prev => {
                      const newDb = prev.map(p => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map(s => s.id === stanza.id ? {...s, isSaved: false, audioUrl: null, savedKey: null} : s)
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

  const resolveMeaningAudioUrl = async (poemId, stanza, silent = false) => {
      if (stanza.meaningAudioUrl && stanza.meaningAudioUrl.startsWith('idb://')) {
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
                  
                  setPoemDatabase(prev => {
                      const newDb = prev.map(p => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map(s => s.id === stanza.id ? {...s, meaningAudioUrl: `idb://${newIdbKey}`} : s)
                      } : p);
                      localStorage.setItem('taman_poem_db', JSON.stringify(newDb));
                      return newDb;
                  });
                  
                  if (!silent) showToastMsg('Tải giọng diễn giải thành công!', 'success');
                  setIsFetchingCloudAudio(false);
                  return URL.createObjectURL(blob);
              } else {
                  setPoemDatabase(prev => {
                      const newDb = prev.map(p => p.id === poemId ? {
                          ...p, stanzas: p.stanzas.map(s => s.id === stanza.id ? {...s, isMeaningSaved: false, meaningAudioUrl: null, meaningSavedKey: null} : s)
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

  // TÂM AN THÊM: Hàm phân giải URL cho Kho Mào Đầu
  const resolveGreetingAudioUrl = async (key) => {
      let url = greetingAudioUrls[key];
      if (url && url.startsWith('idb://')) {
          const blob = await idb.get(url.replace('idb://', ''));
          if (blob) return URL.createObjectURL(blob);
      }
      return url;
  };

  // TÂM AN THÊM: Hàm tự động lấy hoặc tạo âm thanh câu nối "Hãy nghe kệ đây"
  const getOrGenerateTransitionAudio = async (text, lang) => {
      const cacheKey = `transition_${lang}_${text.replace(/\s/g, '_')}`;
      
      // 1. Kiểm tra RAM Cache
      if (transitionAudioUrls[cacheKey]) return transitionAudioUrls[cacheKey];

      // 2. Kiểm tra ổ cứng thiết bị (IndexedDB)
      const idbKey = `saved_${cacheKey}`;
      const blob = await idb.get(idbKey);
      if (blob) {
          const url = URL.createObjectURL(blob);
          setTransitionAudioUrls(prev => ({ ...prev, [cacheKey]: url }));
          return url;
      }

      // 3. Nếu chưa có thì Gọi AI tạo và lưu vĩnh viễn vào máy
      try {
          const voiceName = "Algieba";
          const promptPrefix = lang === 'Tiếng Việt' 
              ? "Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng: " 
              : `Read slowly, warm, strong voice in ${lang}: `;

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: `${promptPrefix} ${text}` }] }],
                  generationConfig: {
                      responseModalities: ["AUDIO"],
                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                  }
              })
          });
          
          const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          if (audioData) {
              const wavBlob = pcmToWav(audioData, 24000);
              if (wavBlob) {
                  await idb.set(idbKey, wavBlob);
                  const url = URL.createObjectURL(wavBlob);
                  setTransitionAudioUrls(prev => ({ ...prev, [cacheKey]: url }));
                  return url;
              }
          }
      } catch (e) {
          console.error("Lỗi tạo âm thanh chuyển tiếp:", e);
      }
      return null;
  };

  // Hàm phụ trợ: Chạy ngầm để copy file âm thanh từ Kho Cá Nhân sang Kho Chung
  const migrateAudiosToPublicAsync = async (database, uid) => {
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
                  } catch (err) {
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
      const itemsToUpload = [];
      poemDatabase.forEach(p => {
          p.stanzas.forEach(s => {
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
              } catch (err) {
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
  const performSmartMerge = async (parsedSource, currentDb) => {
      const allHistoricalStanzas = [];

      // 1. Quét lịch sử ở Trình duyệt (Local)
      try {
          const localDb = JSON.parse(localStorage.getItem('taman_poem_db') || '[]');
          localDb.forEach((p, pIdx) => p.stanzas.forEach((s, sIdx) => {
              if (s.isSaved || s.isMeaningSaved) allHistoricalStanzas.push({ ...s, poemIndex: pIdx, stanzaIndex: sIdx });
          }));
      } catch(e) {}

      // 2. Quét lịch sử ở Đám Mây (Cloud Metadata)
      if (user && db) {
          try {
              const snap = await getDoc(doc(db, 'artifacts', appId, 'public', 'data', 'poem_metadata', 'default_db'));
              if (snap.exists() && snap.data().database) {
                  snap.data().database.forEach((p, pIdx) => p.stanzas.forEach((s, sIdx) => {
                      if (s.isSaved || s.isMeaningSaved) allHistoricalStanzas.push({ ...s, poemIndex: pIdx, stanzaIndex: sIdx });
                  }));
              }
          } catch(e) {}
      }

      const migrations = [];
      let retainedAudioCount = 0;
      
      // Vắt kiệt khoảng trắng để so sánh chữ siêu chuẩn xác
      const normalizeText = (text) => text ? text.replace(/\s+/g, '').toLowerCase() : '';

      // 3. Quét từng bài kệ và hợp nhất (Hỗ trợ Async/Await)
      const mergedDb = await Promise.all(parsedSource.map(async (sourcePoem, pIdx) => {
          const mergedStanzas = await Promise.all(sourcePoem.stanzas.map(async (sourceStanza, sIdx) => {
              
              // A. Tìm trong lịch sử Metadata
              let matchedOld = allHistoricalStanzas.find(old => old.id === sourceStanza.id);
              if (!matchedOld) {
                  const sourceNormalized = normalizeText(sourceStanza.content);
                  matchedOld = allHistoricalStanzas.find(old => normalizeText(old.content) === sourceNormalized);
              }
              if (!matchedOld) {
                  matchedOld = allHistoricalStanzas.find(old => old.poemIndex === pIdx && old.stanzaIndex === sIdx);
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
  const handleImportTxtPoem = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      showToastMsg(`Đang dùng Trí tuệ Nhân tạo nội bộ phân tích file ${file.name}...`, 'loading', 0);

      try {
          const text = await file.text();
          const lines = text.split('\n');
          const parsedPoems = [];

          let currentPoem = null;
          let currentStanzaLines = [];
          let currentMeaningLines = [];
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

              // 3. BỘ NHẬN DIỆN PHẦN Ý NGHĨA (DIỄN GIẢI)
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
                  
                  const isCapitalized = (str) => str && str.length > 0 && str[0] === str[0].toUpperCase();
                  
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
      if (isProcessingBackup) return;
      setShowBackupOptionsModal(false);
      setIsProcessingBackup(true);
      
      try {
          // Tính tổng số file âm thanh cần đóng gói dựa trên tùy chọn
          let totalAudios = 0;
          if (backupOptions.stanzas) {
              poemDatabase.forEach(p => p.stanzas.forEach(s => { if (s.isSaved) totalAudios++; }));
          }
          if (backupOptions.meanings) {
              poemDatabase.forEach(p => p.stanzas.forEach(s => { if (s.isMeaningSaved) totalAudios++; }));
          }
          
          const allGreetingKeys = Array.from(new Set([...Object.keys(greetingAudioUrls), ...Object.keys(greetingMeta)]));
          if (backupOptions.greetings) {
              totalAudios += allGreetingKeys.length;
          }
          
          setBackupProgress({ current: 0, total: totalAudios, status: 'Đang chuẩn bị đóng gói...' });
          showToastMsg('Đang nén dữ liệu và âm thanh... Vui lòng không đóng trình duyệt!', 'loading', 5000);

          const blobParts = [];
          
          // Mở đầu chuỗi JSON (Bao gồm cả metadata của Mào Đầu)
          blobParts.push(`{"version":"2.2","timestamp":${Date.now()},"database":${JSON.stringify(poemDatabase)},"greetingMeta":${JSON.stringify(greetingMeta)},"audioBlobs":{`);

          let processed = 0;
          let isFirstAudio = true;
          
          for (let i = 0; i < poemDatabase.length; i++) {
              for (let j = 0; j < poemDatabase[i].stanzas.length; j++) {
                  const stanza = poemDatabase[i].stanzas[j];
                  
                  // 1. Đóng gói âm thanh đoạn Kệ
                  if (stanza.isSaved && backupOptions.stanzas) {
                      setBackupProgress({ current: processed + 1, total: totalAudios, status: `Đang nén kệ: ${stanza.id}` });
                      
                      let blob = null;
                      if (stanza.savedKey) {
                          blob = await idb.get(stanza.savedKey);
                      } else if (stanza.audioUrl && stanza.audioUrl.startsWith('idb://')) {
                          blob = await idb.get(stanza.audioUrl.replace('idb://', ''));
                      }
                      
                      if (!blob && user && db) {
                          try {
                              const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
                              const snap = await getDoc(audioRef);
                              if (snap.exists() && snap.data().base64) {
                                  const res = await fetch(snap.data().base64);
                                  blob = await res.blob();
                              }
                          } catch(e) {}
                      }

                      if (blob) {
                          const base64 = await blobToBase64(blob);
                          blobParts.push(`${isFirstAudio ? '' : ','}"stanza_${stanza.id}":${JSON.stringify(base64)}`);
                          isFirstAudio = false;
                      }
                      processed++;
                  }

                  // 2. Đóng gói âm thanh đoạn Diễn Giải
                  if (stanza.isMeaningSaved && backupOptions.meanings) {
                      setBackupProgress({ current: processed + 1, total: totalAudios, status: `Đang nén giải: ${stanza.id}` });
                      
                      let blob = null;
                      if (stanza.meaningSavedKey) {
                          blob = await idb.get(stanza.meaningSavedKey);
                      } else if (stanza.meaningAudioUrl && stanza.meaningAudioUrl.startsWith('idb://')) {
                          blob = await idb.get(stanza.meaningAudioUrl.replace('idb://', ''));
                      }
                      
                      if (!blob && user && db) {
                          try {
                              const mAudioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanza.id);
                              const mSnap = await getDoc(mAudioRef);
                              if (mSnap.exists() && mSnap.data().base64) {
                                  const res = await fetch(mSnap.data().base64);
                                  blob = await res.blob();
                              }
                          } catch(e) {}
                      }

                      if (blob) {
                          const base64 = await blobToBase64(blob);
                          blobParts.push(`${isFirstAudio ? '' : ','}"meaning_${stanza.id}":${JSON.stringify(base64)}`);
                          isFirstAudio = false;
                      }
                      processed++;
                  }
              }
          }

          // 3. Đóng gói âm thanh Mào Đầu
          if (backupOptions.greetings) {
              for (const key of allGreetingKeys) {
                  setBackupProgress({ current: processed + 1, total: totalAudios, status: `Đang nén mào đầu...` });
                  
                  let blob = null;
                  if (greetingMeta[key]) {
                      blob = await idb.get(greetingMeta[key]);
                  } else if (greetingAudioUrls[key] && greetingAudioUrls[key].startsWith('blob:')) {
                      // Cứu cánh nếu âm thanh vừa tạo nằm trong RAM (chưa kịp lưu IDB vì lý do nào đó)
                      try { blob = await fetch(greetingAudioUrls[key]).then(r => r.blob()); } catch(e){}
                  }

                  if (blob) {
                      const base64 = await blobToBase64(blob);
                      blobParts.push(`${isFirstAudio ? '' : ','}"greeting_${key}":${JSON.stringify(base64)}`);
                      isFirstAudio = false;
                  }
                  processed++;
              }
          }

          // Đóng ngoặc chuỗi JSON
          blobParts.push(`}}`);

          setBackupProgress({ current: totalAudios, total: totalAudios, status: 'Đang tạo file tải xuống...' });
          
          const finalBlob = new Blob(blobParts, { type: 'application/json' });
          const downloadUrl = URL.createObjectURL(finalBlob);
          
          const link = document.createElement('a');
          link.href = downloadUrl;
          link.download = `Kho_Tam_An_Backup_${new Date().toISOString().split('T')[0]}.json`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          setTimeout(() => URL.revokeObjectURL(downloadUrl), 60000);

          showToastMsg('Đã tải File Sao Lưu xuống máy tính thành công!', 'success', 6000);
      } catch (err) {
          console.error("Lỗi đóng gói Backup:", err);
          showToastMsg('Có lỗi xảy ra khi đóng gói. Vui lòng thử lại.', 'error', 5000);
      } finally {
          setIsProcessingBackup(false);
          setBackupProgress({ current: 0, total: 0, status: '' });
      }
  };

  // --- HÀM KHÔI PHỤC TỪ FILE SAO LƯU ĐÃ TẢI (TỐI ƯU HÓA LUỒNG XỬ LÝ RAM CHO FILE >1GB) ---
  const handleImportFullBackup = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (isProcessingBackup) return;
      setIsProcessingBackup(true);
      
      try {
          showToastMsg(`Đang phân tích file ${Math.round(file.size/1024/1024)}MB. Xin giữ màn hình mở...`, 'loading', 0);
          setBackupProgress({ current: 0, total: 100, status: 'Đang đọc cấu trúc kệ...' });

          // HÀM PHỤ TRỢ: Giải nén Base64 thành Blob an toàn
          const base64ToBlobSafe = async (base64) => {
              try {
                  const res = await fetch(base64);
                  return await res.blob();
              } catch (e) {
                  const arr = base64.split(',');
                  const mime = arr[0].match(/:(.*?);/)[1];
                  const bstr = atob(arr[1]);
                  let n = bstr.length;
                  const u8arr = new Uint8Array(n);
                  while (n--) { u8arr[n] = bstr.charCodeAt(n); }
                  return new Blob([u8arr], { type: mime });
              }
          };

          // TÂM AN CHUNKING: Đọc file theo từng khúc (chunk) để không làm nổ RAM trình duyệt
          const readChunk = (start, end) => new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsText(file.slice(start, end));
          });

          // BƯỚC 1: Lấy ra cấu trúc Kệ (Database) ở đầu file. Nâng lên 150MB để đọc lọt cấu trúc kệ khổng lồ.
          const headChunkSize = Math.min(150 * 1024 * 1024, file.size); 
          const headText = await readChunk(0, headChunkSize);
          
          const dbStartIdx = headText.indexOf('"database":[');
          if (dbStartIdx === -1) throw new Error("File không đúng chuẩn dữ liệu Tâm An.");

          // Dùng thuật toán đếm ngoặc để lấy trọn vẹn mảng Database
          let bracketCount = 0;
          let inString = false;
          let isEscaped = false;
          let dbEndIdx = -1;

          for (let i = dbStartIdx + 11; i < headText.length; i++) {
              const char = headText[i];
              if (isEscaped) { isEscaped = false; continue; }
              if (char === '\\') { isEscaped = true; continue; }
              if (char === '"') { inString = !inString; continue; }

              if (!inString) {
                  if (char === '[') bracketCount++;
                  else if (char === ']') {
                      bracketCount--;
                      if (bracketCount === 0) {
                          dbEndIdx = i + 1;
                          break;
                      }
                  }
              }
          }

          if (dbEndIdx === -1) throw new Error("Lỗi cấu trúc hoặc Cấu trúc Kệ quá 10MB.");

          // Lấy cấu trúc gốc hiện tại trên UI làm nền tảng (Để giữ lại ý nghĩa/tags nếu có)
          const currentDbClone = JSON.parse(JSON.stringify(poemDatabase));
          const currentGreetingMeta = { ...greetingMeta }; // Clone metadata Mào đầu
          
          // BƯỚC 2: QUÉT ĐÁY BIỂN - Thuật toán Turbo Parse & Batch Insert siêu tốc
          setBackupProgress({ current: 5, total: 100, status: 'Đang bung nén Âm thanh...' });

          const CHUNK_SIZE = 50 * 1024 * 1024; // Nâng lên 50MB mỗi lần đọc để giảm độ trễ đĩa
          let offset = dbEndIdx; 
          let tailBuffer = ''; 
          let processedAudios = 0;

          // Bộ nhớ đệm để lưu hàng loạt vào ổ cứng cùng 1 lúc (Giảm 90% thời gian trên Mobile)
          let idbBatch = [];
          const BATCH_LIMIT = 50;

          while (offset < file.size) {
              const end = Math.min(offset + CHUNK_SIZE, file.size);
              const chunkText = await readChunk(offset, end);
              
              const processingText = tailBuffer + chunkText;
              let parseIndex = 0;

              // Dùng indexOf thay cho Regex để tăng tốc độ phân tích chuỗi lên 10 lần
              while (true) {
                  const dataMarker = '":"data:audio/';
                  const dataIdx = processingText.indexOf(dataMarker, parseIndex);
                  
                  if (dataIdx === -1) {
                      tailBuffer = processingText.substring(parseIndex);
                      break;
                  }

                  const keyStartIdx = processingText.lastIndexOf('"', dataIdx - 1);
                  if (keyStartIdx === -1 || keyStartIdx < parseIndex) {
                      parseIndex = dataIdx + dataMarker.length;
                      continue;
                  }

                  const audioKey = processingText.substring(keyStartIdx + 1, dataIdx);
                  const base64StartIdx = dataIdx + 3; // Bỏ qua '":"'
                  const endQuoteIdx = processingText.indexOf('"', base64StartIdx);

                  if (endQuoteIdx === -1) {
                      tailBuffer = processingText.substring(keyStartIdx);
                      break;
                  }

                  const base64Str = processingText.substring(base64StartIdx, endQuoteIdx);
                  parseIndex = endQuoteIdx + 1;

                  // Đưa vào danh sách xử lý chờ
                  const blobPromise = base64ToBlobSafe(base64Str);
                  
                  let type = 'stanza';
                  let stanzaId = audioKey;
                  if (audioKey.startsWith('stanza_')) {
                      type = 'stanza'; stanzaId = audioKey.replace('stanza_', '');
                  } else if (audioKey.startsWith('meaning_')) {
                      type = 'meaning'; stanzaId = audioKey.replace('meaning_', '');
                  } else if (audioKey.startsWith('greeting_')) {
                      type = 'greeting'; stanzaId = audioKey.replace('greeting_', '');
                  }

                  const idbKey = `saved_${type}_${stanzaId}_${Date.now()}`;
                  
                  idbBatch.push({ blobPromise, idbKey, type, stanzaId });

                  // Móc nối đường dẫn MP3 vào Cấu trúc Kệ / Mào Đầu
                  if (type === 'greeting') {
                      currentGreetingMeta[stanzaId] = idbKey;
                  } else {
                      for (let pIdx = 0; pIdx < currentDbClone.length; pIdx++) {
                          const sIndex = currentDbClone[pIdx].stanzas.findIndex(s => String(s.id).trim() === String(stanzaId).trim());
                          if (sIndex !== -1) {
                              if (type === 'stanza') {
                                  currentDbClone[pIdx].stanzas[sIndex].isSaved = true;
                                  currentDbClone[pIdx].stanzas[sIndex].savedKey = idbKey;
                                  currentDbClone[pIdx].stanzas[sIndex].audioUrl = `idb://${idbKey}`;
                              } else {
                                  currentDbClone[pIdx].stanzas[sIndex].isMeaningSaved = true;
                                  currentDbClone[pIdx].stanzas[sIndex].meaningSavedKey = idbKey;
                                  currentDbClone[pIdx].stanzas[sIndex].meaningAudioUrl = `idb://${idbKey}`;
                              }
                              break;
                          }
                      }
                  }
                  processedAudios++;

                  // Nếu đầy lô hàng, tiến hành nạp vào ổ cứng (Batch Insert)
                  if (idbBatch.length >= BATCH_LIMIT) {
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
      } catch (err) {
          console.error("Lỗi bung nén Backup khổng lồ:", err);
          showToastMsg(`Lỗi khi giải nén: ${err.message || 'File bị hỏng.'}`, 'error', 6000);
      } finally {
          setIsProcessingBackup(false);
          setBackupProgress({ current: 0, total: 0, status: '' });
          if (backupFileInputRef.current) backupFileInputRef.current.value = '';
      }
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
          showToastMsg('Link con dán không chứa Mã Kho. Hướng dẫn: Ở Link cũ, con hãy bấm chuột phải vào hình Lão, chọn "Mở khung trong tab mới" (Open frame in new tab). Sau đó copy link ở tab mới dán vào đây nhé.', 'error', 12000);
          return;
      }
      
      const currentAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
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
      } catch(e) {
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

  // --- HÀM TẠO VÀ LƯU ĐỒNG LOẠT ÂM THANH CHO CÁC ĐOẠN CÒN THIẾU ---
  const handleBatchGenerateStanzas = async () => {
      if (isBatchGeneratingPoems) return;
      
      const missing = [];
      poemDatabase.forEach(p => {
          p.stanzas.forEach(s => {
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

      // TÂM AN TỐI ƯU V8: Thuật toán Bể Bơi Luồng (Connection Pool)
      // 5 luồng chạy liên tục, rảnh luồng nào nhét việc vào luồng đó ngay lập tức, không chờ đợi nhau.
      const CONCURRENCY_LIMIT = 5;
      let currentIndex = 0;
      let processedCount = 0;

      const processAudioTask = async () => {
          while (currentIndex < missing.length && isBatchGeneratingPoemsRef.current) {
              const itemIndex = currentIndex++;
              const { poemId, stanza } = missing[itemIndex];
              
              const currentDbPoem = dbClone.find(p => p.id === poemId);
              const currentDbStanza = currentDbPoem?.stanzas.find(s => s.id === stanza.id);
              
              if (!currentDbStanza?.isSaved) {
                  try {
                      const optimizedText = stanza.content.split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');
                      
                      // Gọi API trực tiếp, mượn cơ chế Retry có sẵn của fetchWithRetry để tự lo lỗi mạng
                      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                              generationConfig: {
                                  responseModalities: ["AUDIO"],
                                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                              }
                          })
                      }, 3, 2000); // Thử lại tối đa 3 lần, cách nhau 2s nếu API nghẽn
                      
                      const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
                      if (audioData) {
                          const wavBlob = pcmToWav(audioData, 24000);
                          if (wavBlob) {
                              const finalIdbKey = `saved_stanza_${stanza.id}_${Date.now()}`;
                              await idb.set(finalIdbKey, wavBlob); 
                              
                              if (user && db) {
                                  const base64Data = await blobToBase64(wavBlob);
                                  const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'stanza_audios', stanza.id);
                                  // Lưu nền không chờ await để tăng tốc luồng chính
                                  setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                              }
                              
                              // TÂM AN FIX TRỌNG ĐIỂM: Dùng functional update để tránh mất dữ liệu do Race Condition
                              setPoemDatabase(prevDb => {
                                  const nextDb = prevDb.map(p => p.id === poemId ? {
                                      ...p,
                                      stanzas: p.stanzas.map(s => s.id === stanza.id ? {
                                          ...s,
                                          isSaved: true,
                                          savedKey: finalIdbKey,
                                          audioUrl: `idb://${finalIdbKey}`
                                      } : s)
                                  } : p);
                                  localStorage.setItem('taman_poem_db', JSON.stringify(nextDb));
                                  dbClone = nextDb; // Đồng bộ bản sao để đẩy lên mây
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
              
              // Nghỉ thở cực ngắn (300ms) để không bị Google đánh dấu là DDoS
              await new Promise(r => setTimeout(r, 300));
          }
      };

      // Khởi động 5 luồng thợ xây cùng lúc
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
      
      const missing = [];
      poemDatabase.forEach(p => {
          p.stanzas.forEach(s => {
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

      // TÂM AN TỐI ƯU V8: Thuật toán Bể Bơi Luồng (Connection Pool)
      const CONCURRENCY_LIMIT = 5;
      let currentIndex = 0;
      let processedCount = 0;

      const processAudioTask = async () => {
          while (currentIndex < missing.length && isBatchGeneratingMeaningsRef.current) {
              const itemIndex = currentIndex++;
              const { poemId, stanza } = missing[itemIndex];
              
              const currentDbPoem = dbClone.find(p => p.id === poemId);
              const currentDbStanza = currentDbPoem?.stanzas.find(s => s.id === stanza.id);
              
              if (!currentDbStanza?.isMeaningSaved) {
                  try {
                      const optimizedText = cleanTextForTTS(stanza.meaning).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');
                      
                      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                              generationConfig: {
                                  responseModalities: ["AUDIO"],
                                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                              }
                          })
                      }, 3, 2000);
                      
                      const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
                      if (audioData) {
                          const wavBlob = pcmToWav(audioData, 24000);
                          if (wavBlob) {
                              const finalIdbKey = `saved_meaning_${stanza.id}_${Date.now()}`;
                              await idb.set(finalIdbKey, wavBlob);
                              
                              if (user && db) {
                                  const base64Data = await blobToBase64(wavBlob);
                                  const audioRef = doc(db, 'artifacts', appId, 'public', 'data', 'meaning_audios', stanza.id);
                                  setDoc(audioRef, { base64: base64Data, timestamp: Date.now() }).catch(()=>{});
                              }
                              
                              // TÂM AN FIX TRỌNG ĐIỂM: Dùng functional update
                              setPoemDatabase(prevDb => {
                                  const nextDb = prevDb.map(p => p.id === poemId ? {
                                      ...p,
                                      stanzas: p.stanzas.map(s => s.id === stanza.id ? {
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

  // --- TÂM AN THÊM: HÀM TẠO ÂM THANH MÀO ĐẦU HÀNG LOẠT ---
  const handleBatchGenerateGreetings = async () => {
      if (isBatchGeneratingGreetings) return;
      
      const missing = [];
      Object.entries(greetingsDb).forEach(([category, list]) => {
          list.forEach((text, index) => {
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
                      const optimizedText = cleanTextForTTS(text).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');
                      
                      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                              contents: [{ parts: [{ text: `${promptPrefix} ${optimizedText}` }] }],
                              generationConfig: {
                                  responseModalities: ["AUDIO"],
                                  speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                              }
                          })
                      }, 3, 2000);
                      
                      const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
                      if (audioData) {
                          const wavBlob = pcmToWav(audioData, 24000);
                          if (wavBlob) {
                              const finalAudioUrl = URL.createObjectURL(wavBlob);
                              setGreetingAudioUrls(prev => ({ ...prev, [key]: finalAudioUrl }));
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

  // --- TÂM AN: HÀM TẠO Ý NGHĨA (TEXT) BẰNG AI HÀNG LOẠT ---
  const handleBatchGenerateAIMeaningsText = async () => {
      if (isBatchGeneratingAIMeanings) return;
      
      const missing = [];
      poemDatabase.forEach(p => {
          p.stanzas.forEach(s => {
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
              const wholePoemText = poem.stanzas.map((s, idx) => `Đoạn ${idx + 1}:\n${s.content}`).join('\n\n');
              const stanzaIndex = poem.stanzas.findIndex(s => s.id === stanza.id);
              
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

              const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
              });

              const rawResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
              if (rawResult) {
                  let cleanText = rawResult.trim();
                  setPoemDatabase(prevDb => {
                      const nextDb = prevDb.map(p => p.id === poem.id ? {
                          ...p,
                          stanzas: p.stanzas.map(s => s.id === stanza.id ? {
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
              
              // Nghỉ 3s giữa các lần gọi API Text để tránh lỗi Rate Limit
              if (count < missing.length && isBatchGeneratingAIMeaningsRef.current) {
                  await new Promise(r => setTimeout(r, 3000));
              }

          } catch (err) {
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

  // --- Thêm state cho Kịch bản thủ công ---
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [scriptText, setScriptText] = useState('');
  const [importMode, setImportMode] = useState('new'); // 'new' hoặc 'append'

  // --- Thêm state cho Kịch bản AI tự tạo ---
  const [showAITopicModal, setShowAITopicModal] = useState(false);
  const [aiTopicText, setAiTopicText] = useState('');
  const [isGeneratingAITopic, setIsGeneratingAITopic] = useState(false);
  const [aiScriptLength, setAiScriptLength] = useState('Khoảng 6-10 câu');
  const [aiLaoStyle, setAiLaoStyle] = useState('Sắc bén, đốn giáo, thẳng thắn đánh thức mộng ảo');
  const [aiUserEmotionArc, setAiUserEmotionArc] = useState('Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng');

  const [systemPromptTemplate, setSystemPromptTemplate] = useState(DEFAULT_SYSTEM_PROMPT);

  // Tải Prompt Template từ PostgreSQL
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const res = await getActivePromptAction('ai_lao_system_prompt');
        if (res.success && res.data && res.data.content) {
          setSystemPromptTemplate(res.data.content);
        }
      } catch (err) {
        console.error("Lỗi tải prompt từ PostgreSQL:", err);
      }
    };
    loadPrompt();
  }, []);

  const [sessions, setSessions] = useState([]);
  
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const currentSessionIdRef = useRef(currentSessionId);
  useEffect(() => { currentSessionIdRef.current = currentSessionId; }, [currentSessionId]);

  // Tải danh sách các cuộc đàm đạo từ PostgreSQL
  useEffect(() => {
    const initChat = async () => {
      const res = await getChatSessionsAction();
      if (res.success && res.data && res.data.length > 0) {
        const dbSessions = res.data.map((s: any) => ({
          id: s.id,
          title: s.title,
          isPinned: false,
          messages: []
        }));
        setSessions(dbSessions);
        setCurrentSessionId(dbSessions[0].id);
      } else {
        const createRes = await createChatSessionAction(undefined, 'Cuộc đàm đạo 1');
        if (createRes.success && createRes.data) {
          const newSession = {
            id: createRes.data.id,
            title: createRes.data.title,
            isPinned: false,
            messages: []
          };
          setSessions([newSession]);
          setCurrentSessionId(createRes.data.id);
        }
      }
    };
    initChat();
  }, []);

  // Tải tin nhắn của phiên đàm đạo hiện tại khi có sự thay đổi
  useEffect(() => {
    if (!currentSessionId) return;
    const loadMessages = async () => {
      const sess = sessions.find((s: any) => s.id === currentSessionId);
      if (sess && sess.messages.length === 0) {
        const res = await getChatMessagesAction(currentSessionId);
        if (res.success && res.data) {
          const dbMessages = res.data.map((m: any) => ({
            id: m.id,
            role: m.role.toLowerCase() === 'user' ? 'user' : 'ai',
            text: m.content,
            timestamp: new Date(m.createdAt),
            audioUrl: m.audioUrl,
            emotion: m.emotion || 'calm',
            reactions: {}
          }));
          
          setSessions(prev => prev.map((s: any) => {
            if (s.id === currentSessionId) {
              return { ...s, messages: dbMessages };
            }
            return s;
          }));
        }
      }
    };
    loadMessages();
  }, [currentSessionId, sessions]);


  const [showSessions, setShowSessions] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState(null);
  const [editSessionTitle, setEditSessionTitle] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0];
  const messages = currentSession?.messages || [];

  const updateCurrentMessages = (updater) => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: typeof updater === 'function' ? updater(s.messages) : updater };
      }
      return s;
    }));
  };

  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  
  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const isThinkingRef = useRef(false);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);
  const [isRefining, setIsRefining] = useState(false);
  const [generatingDoubtId, setGeneratingDoubtId] = useState(null); // Trạng thái cho AI tạo câu thắc mắc
  const [showHistory, setShowHistory] = useState(false);
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState(null);
  
  // TÂM AN FIX: Thêm Ref theo dõi ID audio đang phát để quản lý Mic Khách mời
  const currentlyPlayingIdRef = useRef(currentlyPlayingId);
  useEffect(() => { currentlyPlayingIdRef.current = currentlyPlayingId; }, [currentlyPlayingId]);

  const [creatingVoices, setCreatingVoices] = useState({});
  const creatingVoicesRef = useRef({}); // TÂM AN FIX: Thêm Ref khóa luồng tạo âm thanh
  useEffect(() => { creatingVoicesRef.current = creatingVoices; }, [creatingVoices]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [tempEditText, setTempEditText] = useState('');
  
  // --- Video Export & Custom Appearance State ---
  const [showVideoExportModal, setShowVideoExportModal] = useState(false);
  const [videoAspectRatio, setVideoAspectRatio] = useState('16x9'); 
  const videoAspectRatioRef = useRef(videoAspectRatio);
  useEffect(() => { videoAspectRatioRef.current = videoAspectRatio; }, [videoAspectRatio]);

  // TÂM AN THÊM: State quản lý hiệu ứng chuyển cảnh
  const [videoTransition, setVideoTransition] = useState('none');
  const videoTransitionRef = useRef(videoTransition);
  useEffect(() => { videoTransitionRef.current = videoTransition; }, [videoTransition]);
  const [videoTransitionDuration, setVideoTransitionDuration] = useState(0.7);
  const videoTransitionDurationRef = useRef(videoTransitionDuration);
  useEffect(() => { videoTransitionDurationRef.current = videoTransitionDuration; }, [videoTransitionDuration]);

  // --- TÂM AN THÊM: STATE & REFS CHO TÍNH NĂNG ZOOM/PAN LÃO Ở KHUNG CHAT ---
  // TÂM AN FIX: Đặt mặc định scale = 1.8 cho Lão Chat
  const [chatLaoTransform, setChatLaoTransform] = useState({ x: 0, y: 0, s: 1.8 });
  const [showChatLaoControls, setShowChatLaoControls] = useState(false); // Thêm state ẩn hiện bảng điều khiển
  const chatLaoDragInfo = useRef({ isDragging: false, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleChatLaoPointerDown = (e) => {
      chatLaoDragInfo.current = {
          isDragging: true,
          startX: e.clientX || e.touches?.[0].clientX,
          startY: e.clientY || e.touches?.[0].clientY,
          initialX: chatLaoTransform.x,
          initialY: chatLaoTransform.y
      };
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}
  };

  const handleChatLaoPointerMove = (e) => {
      if (!chatLaoDragInfo.current.isDragging) return;
      const clientX = e.clientX || e.touches?.[0].clientX;
      const clientY = e.clientY || e.touches?.[0].clientY;
      const dx = clientX - chatLaoDragInfo.current.startX;
      const dy = clientY - chatLaoDragInfo.current.startY;

      setChatLaoTransform(prev => ({
          ...prev,
          x: chatLaoDragInfo.current.initialX + dx,
          y: chatLaoDragInfo.current.initialY + dy
      }));
  };

  const handleChatLaoPointerUp = (e) => {
      chatLaoDragInfo.current.isDragging = false;
      try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleChatLaoWheel = (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setChatLaoTransform(prev => ({
          ...prev,
          s: Math.max(0.5, Math.min(4.0, prev.s + delta)) // Giới hạn thu phóng từ 0.5x đến 4.0x
      }));
  };
  // -----------------------------------------------------------------------

  // TÂM AN FIX: Đặt mặc định độ phân giải video là 1080p (Full HD)
  const [videoResolution, setVideoResolution] = useState('1080'); 
  const videoResolutionRef = useRef(videoResolution);
  useEffect(() => { videoResolutionRef.current = videoResolution; }, [videoResolution]);

  const [subtitleSentenceCount, setSubtitleSentenceCount] = useState(1);
  const [subtitleColor, setSubtitleColor] = useState('#f8fafc'); 
  const [subtitleYPos, setSubtitleYPos] = useState(94); 
  const [subtitleScale, setSubtitleScale] = useState(1.0);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [isPreparingVideoData, setIsPreparingVideoData] = useState(false);
  const [renderedVideoBlob, setRenderedVideoBlob] = useState(null);
  const [renderedVideoUrl, setRenderedVideoUrl] = useState(null);
  const [isVideoFullscreen, setIsVideoFullscreen] = useState(false); 
  const [isPreviewFullscreen, setIsPreviewFullscreen] = useState(false); // Thêm state cho chế độ Fullscreen lúc đang edit
  const [videoExt, setVideoExt] = useState('webm');
  const [exportTab, setExportTab] = useState('basic'); // basic | advance | background | appearance
  const [hoveredElement, setHoveredElement] = useState(null);

  // --- TÂM AN THÊM: STATE CHO INTRO & OUTRO ---
  const [enableIntro, setEnableIntro] = useState(true);
  const [introTitle, setIntroTitle] = useState('Chủ đề: Giác Ngộ'); // TÂM AN FIX: Thêm chữ mặc định để Preview luôn thấy
  const [introSubtitle, setIntroSubtitle] = useState('Làm sao để buông bỏ vọng niệm?'); 
  const [enableOutroText, setEnableOutroText] = useState(true);
  const [outroText, setOutroText] = useState('Nguyện người xem được giác ngộ giải thoát\nsống an nhiên tự tại');
  
  const enableIntroRef = useRef(enableIntro);
  const introTitleRef = useRef(introTitle);
  const introSubtitleRef = useRef(introSubtitle);
  const outroTextRef = useRef(outroText);
  
  useEffect(() => { enableIntroRef.current = enableIntro; }, [enableIntro]);
  useEffect(() => { introTitleRef.current = introTitle; }, [introTitle]);
  useEffect(() => { introSubtitleRef.current = introSubtitle; }, [introSubtitle]);
  useEffect(() => { outroTextRef.current = outroText; }, [outroText]);

  // TÂM AN THÊM: State quản lý chế độ Video Dựng sẵn Toàn cảnh (Bypass 3D)
  const [isFullFrameMode, setIsFullFrameMode] = useState(true); // TÂM AN FIX: Bật mặc định Cắt cảnh đa cảm xúc
  const isFullFrameModeRef = useRef(isFullFrameMode);
  useEffect(() => { isFullFrameModeRef.current = isFullFrameMode; }, [isFullFrameMode]);

  // TÂM AN THÊM & NÂNG CẤP: Quản lý Kho Assets cho chế độ Dựng Sẵn ĐA CẢM XÚC
  const EMOTIONS = { calm: '😐 Bình thường', sad: '😢 Buồn/Bế tắc', joy: '😄 Vui/Hạnh phúc', hook: '🔥 Mào đầu (Hook)' };

  const FULLFRAME_PACKS = [
      // === CẢNH NGANG (16:9) ===
      {
          id: 'pack_duyen_minh_40', name: 'Duyên Minh (40 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY', idbKey: null }
          ]
      },
      {
          id: 'pack_co_gai', name: 'Cô Gái (28 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_nam_tre', name: 'Nam Trẻ (30 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_ba_cu', name: 'Bà Cụ (70 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_be_9t', name: 'Bé gái (9 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_nu_a', name: 'Nữ A (40 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_ong_hung', name: 'Ông Hùng (85 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_be_hoa', name: 'Bé Hoa (12 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_hoa_35', name: 'Hoa (35 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_ba_mai_90', name: 'Bà Lão Mai (90 tuổi)', aspect: 'ngang',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },

      // === CẢNH DỌC (9:16) ===
      {
          id: 'pack_ong_lao_85_doc', name: 'Ông Lão (85 tuổi)', aspect: 'doc',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      },
      {
          id: 'pack_ba_lao_78_doc', name: 'Bà Lão (78 tuổi)', aspect: 'doc',
          scenes: [
            { id: 'scene_lao_calm', role: 'lao', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_lao_sad', role: 'lao', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_lao_joy', role: 'lao', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_user_calm', role: 'user', emotion: 'calm', url: '', idbKey: null },
            { id: 'scene_user_sad', role: 'user', emotion: 'sad', url: '', idbKey: null },
            { id: 'scene_user_joy', role: 'user', emotion: 'joy', url: '', idbKey: null },
            { id: 'scene_outro_calm', role: 'outro', emotion: 'calm', url: '', idbKey: null }
          ]
      }
  ];

  const [ffScenes, setFfScenes] = useState(JSON.parse(JSON.stringify(FULLFRAME_PACKS[0].scenes)));
  const [localFfClips, setLocalFfClips] = useState([]);
  const [showFfSaveModal, setShowFfSaveModal] = useState(false);
  const [ffSaveData, setFfSaveData] = useState({ sceneId: '', name: '' });
  const ffVidRefs = useRef({}); // Lưu tham chiếu Video Element theo ID Scene
  const ffScenesRef = useRef(ffScenes);
  useEffect(() => { ffScenesRef.current = ffScenes; }, [ffScenes]);

  // TÂM AN THÊM: STATE CHO BỘ CẢNH CÁ NHÂN TẢI LÊN TỪ MÁY
  const [localFfPacks, setLocalFfPacks] = useState([]);
  const [showSavePackModal, setShowSavePackModal] = useState(false);
  const [savePackData, setSavePackData] = useState({ name: '', aspect: 'ngang' });

  const [editingEmotionId, setEditingEmotionId] = useState(null); // Quản lý việc sửa cảm xúc tin nhắn

  // Hàm di chuyển cảnh quay lên/xuống
  const moveFfScene = (index, direction) => {
      setFfScenes(prev => {
          const newScenes = [...prev];
          if (direction === -1 && index > 0) {
              [newScenes[index - 1], newScenes[index]] = [newScenes[index], newScenes[index - 1]];
          } else if (direction === 1 && index < newScenes.length - 1) {
              [newScenes[index], newScenes[index + 1]] = [newScenes[index + 1], newScenes[index]];
          }
          return newScenes;
      });
  };

  // Load kho Video Dựng Sẵn cá nhân từ bộ nhớ máy
  useEffect(() => {
      const list = JSON.parse(localStorage.getItem('taman_local_ff_clips') || '[]');
      setLocalFfClips(list);
      
      // Load danh sách Bộ Cảnh Cá Nhân
      const packList = JSON.parse(localStorage.getItem('taman_local_ff_packs') || '[]');
      setLocalFfPacks(packList);
  }, []);

  const handleSelectFfClip = async (role, idbKey) => {
      if (!idbKey) {
          if (ffAssets[role]) URL.revokeObjectURL(ffAssets[role]);
          setFfAssets(prev => ({...prev, [role]: null}));
          setFfAssetsMeta(prev => ({...prev, [role]: null}));
          return;
      }
      showToastMsg('Đang tải video từ kho...', 'loading', 0);
      try {
          const blob = await idb.get(idbKey);
          if (blob) {
              if (ffAssets[role]) URL.revokeObjectURL(ffAssets[role]);
              const url = URL.createObjectURL(blob);
              setFfAssets(prev => ({...prev, [role]: url}));
              setFfAssetsMeta(prev => ({...prev, [role]: idbKey}));
              showToastMsg('Đã nạp video!', 'success', 2000);
          } else {
              showToastMsg('Không tìm thấy file video trong ổ cứng.', 'error');
          }
      } catch (e) {
          console.error(e);
          showToastMsg('Lỗi khi tải video.', 'error');
      }
  };

  const handleSelectFfClipV2 = async (sceneId, idbKey) => {
      if (!idbKey) {
          setFfScenes(prev => prev.map(s => {
              if (s.id === sceneId) {
                  if (s.url) URL.revokeObjectURL(s.url);
                  return { ...s, url: null, idbKey: null };
              }
              return s;
          }));
          return;
      }
      showToastMsg('Đang tải video từ kho...', 'loading', 0);
      try {
          const blob = await idb.get(idbKey);
          if (blob) {
              const url = URL.createObjectURL(blob);
              setFfScenes(prev => prev.map(s => {
                  if (s.id === sceneId) {
                      if (s.url) URL.revokeObjectURL(s.url);
                      return { ...s, url, idbKey };
                  }
                  return s;
              }));
              showToastMsg('Đã nạp video!', 'success', 2000);
          } else {
              showToastMsg('Không tìm thấy file video trong ổ cứng.', 'error');
          }
      } catch (e) {
          showToastMsg('Lỗi khi tải video.', 'error');
      }
  };

  // --- TÂM AN THÊM: HÀM TẢI ĐỒNG LOẠT NHIỀU FILE TỪ MÁY THEO QUY TẮC TÊN (SMART UPLOAD) ---
  const handleUploadFolder = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      showToastMsg(`Đang phân tích ${files.length} video...`, 'loading', 2000);

      // Khung xương 7 cảnh cơ bản
      const newScenesTemplate = [
          { id: `scene_lao_calm_${Date.now()}`, role: 'lao', emotion: 'calm', url: null, idbKey: null },
          { id: `scene_lao_sad_${Date.now()}`, role: 'lao', emotion: 'sad', url: null, idbKey: null },
          { id: `scene_lao_joy_${Date.now()}`, role: 'lao', emotion: 'joy', url: null, idbKey: null },
          { id: `scene_user_calm_${Date.now()}`, role: 'user', emotion: 'calm', url: null, idbKey: null },
          { id: `scene_user_sad_${Date.now()}`, role: 'user', emotion: 'sad', url: null, idbKey: null },
          { id: `scene_user_joy_${Date.now()}`, role: 'user', emotion: 'joy', url: null, idbKey: null },
          { id: `scene_outro_calm_${Date.now()}`, role: 'outro', emotion: 'calm', url: null, idbKey: null }
      ];

      let matchedCount = 0;

      // Phân tích tên file và gắp vào đúng vị trí
      files.forEach(file => {
          const fileName = file.name.toLowerCase();
          const url = URL.createObjectURL(file);

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
              // Nếu tên không khớp chuẩn, thu hồi URL để tránh tràn RAM
              URL.revokeObjectURL(url);
          }
      });

      if (matchedCount > 0) {
          // Thu dọn RAM các URL cũ trước khi đè cái mới
          ffScenes.forEach(s => { if (s.url && s.url.startsWith('blob:')) URL.revokeObjectURL(s.url); });
          setFfScenes(newScenesTemplate);
          showToastMsg(`Đã tự động phân loại và ghép thành công ${matchedCount} cảnh quay! Bạn hãy bấm "Lưu thành Bộ Cảnh" nhé.`, 'success', 6000);
      } else {
          showToastMsg(`Tải lên ${files.length} file nhưng không có file nào đúng định dạng tên. Bấm vào icon (i) để xem hướng dẫn đặt tên.`, 'error', 8000);
      }
      
      e.target.value = ''; // Reset input để cho phép chọn lại cùng 1 thư mục
  };

  const showUploadGuide = () => {
      setConfirmDialog({
          isOpen: true,
          message: 'HƯỚNG DẪN TẢI ĐỒNG LOẠT:\n\nĐể hệ thống tự động gắp video vào đúng ô, con hãy đặt tên file trên máy tính có chứa các từ khóa sau:\n\n1. Lão bình thường: lao_calm (hoặc lao_binhthuong)\n2. Lão buồn/nghiêm: lao_sad (hoặc lao_buon)\n3. Lão vui vẻ: lao_joy (hoặc lao_vui)\n4. Con bình thường: user_calm (hoặc con_binhthuong)\n5. Con buồn/khóc: user_sad (hoặc con_buon)\n6. Con vui vẻ: user_joy (hoặc con_vui)\n7. Cảnh lạy/Kết thúc: outro (hoặc vailay)\n\nVí dụ tên file hợp lệ: "video_lao_sad_1.mp4"',
          onConfirm: null
      });
  };

  const executeSaveFfClip = async () => {
      const { role, name } = ffSaveData;
      setShowFfSaveModal(false);
      const url = ffAssets[role];
      if (!url) return;

      showToastMsg('Đang nén và lưu video vào kho máy...', 'loading', 0);
      try {
          const blob = await fetch(url).then(r => r.blob());
          const idbKey = `ff_clip_${role}_${Date.now()}`;
          await idb.set(idbKey, blob);

          const newClip = { id: idbKey, role, name, url: `idb://${idbKey}` };
          const updatedList = [...localFfClips, newClip];
          setLocalFfClips(updatedList);
          localStorage.setItem('taman_local_ff_clips', JSON.stringify(updatedList));

          setFfAssetsMeta(prev => ({...prev, [role]: idbKey}));
          showToastMsg('Đã lưu video vào kho thành công!', 'success');
      } catch (err) {
          console.error(err);
          showToastMsg('Trình duyệt không đủ bộ nhớ để lưu video này.', 'error');
      }
  };

  // TÂM AN THÊM: HÀM LƯU TOÀN BỘ CẢNH VÀO 1 BỘ CẢNH CÁ NHÂN (PACK)
  const executeSaveFfPack = async () => {
      setShowSavePackModal(false);
      showToastMsg('Đang nén và lưu toàn bộ cảnh vào ổ cứng... Vui lòng đợi!', 'loading', 0);
      try {
          const newScenes = [];
          for (const scene of ffScenes) {
              let finalIdbKey = scene.idbKey;
              // Nếu cảnh có video tải lên nhưng chưa lưu vào IndexedDB
              if (scene.url && !finalIdbKey && scene.url.startsWith('blob:')) {
                  const blob = await fetch(scene.url).then(r => r.blob());
                  finalIdbKey = `ff_clip_${scene.role}_${scene.emotion}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
                  await idb.set(finalIdbKey, blob);
              }
              // Chỉ lưu IDB Key vào Pack, không lưu URL Blob (vì URL sẽ chết khi load lại trang)
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

  // TÂM AN THÊM: HÀM NẠP BỘ CẢNH (HỖ TRỢ CẢ GỐC VÀ LOCAL)
  const handleLoadPack = async (packId) => {
      const hardcodedPack = FULLFRAME_PACKS.find(p => p.id === packId);
      const localPack = localFfPacks.find(p => p.id === packId);

      // Thu dọn RAM các URL cũ
      ffScenes.forEach(s => { if (s.url) URL.revokeObjectURL(s.url); });

      if (hardcodedPack) {
          setFfScenes(JSON.parse(JSON.stringify(hardcodedPack.scenes)));
          showToastMsg(`Đã đổi sang bộ cảnh ${hardcodedPack.name}`, 'success', 2000);
      } else if (localPack) {
          showToastMsg(`Đang nạp bộ cảnh "${localPack.name}" từ ổ cứng...`, 'loading', 0);
          try {
              const loadedScenes = await Promise.all(localPack.scenes.map(async (scene) => {
                  let url = null;
                  if (scene.idbKey) {
                      const blob = await idb.get(scene.idbKey);
                      if (blob) url = URL.createObjectURL(blob);
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

  const handleDeleteFfPack = (packId, e) => {
      e.stopPropagation();
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xóa Bộ cảnh cá nhân này? Các video bên trong vẫn sẽ còn trong Kho Video lẻ.',
          onConfirm: () => {
              const updatedPacks = localFfPacks.filter(p => p.id !== packId);
              setLocalFfPacks(updatedPacks);
              localStorage.setItem('taman_local_ff_packs', JSON.stringify(updatedPacks));
              showToastMsg('Đã xóa Bộ cảnh cá nhân.', 'info');
          }
      });
  };

  const handleDeleteFfClip = (idbKey) => {
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xóa vĩnh viễn video này khỏi kho máy?',
          onConfirm: async () => {
              await idb.remove(idbKey);
              const updatedList = localFfClips.filter(c => c.id !== idbKey);
              setLocalFfClips(updatedList);
              localStorage.setItem('taman_local_ff_clips', JSON.stringify(updatedList));
              
              setFfAssets(prev => {
                  const next = {...prev};
                  ['lao', 'user', 'outro'].forEach(r => {
                      if (ffAssetsMeta[r] === idbKey) {
                          if (next[r]) URL.revokeObjectURL(next[r]);
                          next[r] = null;
                      }
                  });
                  return next;
              });
              setFfAssetsMeta(prev => {
                  const next = {...prev};
                  ['lao', 'user', 'outro'].forEach(r => {
                      if (next[r] === idbKey) next[r] = null;
                  });
                  return next;
              });
              showToastMsg('Đã xóa video khỏi kho.', 'info');
          }
      });
  };

  const handleDeleteFfClipV2 = (idbKey) => {
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xóa vĩnh viễn video này khỏi kho máy?',
          onConfirm: async () => {
              await idb.remove(idbKey);
              const updatedList = localFfClips.filter(c => c.id !== idbKey);
              setLocalFfClips(updatedList);
              localStorage.setItem('taman_local_ff_clips', JSON.stringify(updatedList));
              
              setFfScenes(prev => prev.map(s => {
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

  // --- TÂM AN THÊM: HÀM COPY MÃ BỘ CẢNH ĐỂ GỬI TÂM AN ---
  const handleCopyFfScenesCode = () => {
      let hasLocalBlob = false;
      const sceneCodes = ffScenes.map(s => {
          let safeUrl = s.url;
          // Nếu phát hiện video là tải lên từ máy tính cục bộ (blob/idb)
          if (safeUrl && (safeUrl.startsWith('blob:') || safeUrl.startsWith('idb://'))) {
              hasLocalBlob = true;
              safeUrl = 'DAN_LINK_VIDEO_CUA_CON_VAO_DAY'; // Đánh dấu để người dùng biết cần thay link thật
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

  // Load trước Video Dựng Sẵn vào RAM
  useEffect(() => {
      ffScenes.forEach(scene => {
          const url = scene.url;
          if (url) {
              if (!ffVidRefs.current[scene.id]) {
                  const v = document.createElement('video');
                  v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                  ffVidRefs.current[scene.id] = v;
              }
              if (ffVidRefs.current[scene.id].src !== url) {
                  ffVidRefs.current[scene.id].src = url;
                  ffVidRefs.current[scene.id].play().catch(()=>{});
              }
          } else if (ffVidRefs.current[scene.id]) {
              ffVidRefs.current[scene.id].pause();
              delete ffVidRefs.current[scene.id];
          }
      });
  }, [ffScenes]);

  // --- HỆ THỐNG NỘI SOI & CHẨN ĐOÁN RENDER (PROFILER) ---
  const renderDiagnosticsRef = useRef(null);
  const [diagnosticReport, setDiagnosticReport] = useState(null);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  const buildDiagnosticReport = (stats, errorMsg = null) => {
      const avgDraw = stats.drawTimes.length ? (stats.drawTimes.reduce((a, b) => a + b, 0) / stats.drawTimes.length) : 0;
      const avgChroma = stats.chromaProcessingTimes.length ? (stats.chromaProcessingTimes.reduce((a, b) => a + b, 0) / stats.chromaProcessingTimes.length) : 0;
      const totalSecs = ((stats.endTime - stats.startTime) / 1000).toFixed(2);

      let report = `=== BÁO CÁO NỘI SOI KỸ THUẬT (TÂM AN PROFILER V2) ===\n`;
      report += `Mục tiêu cốt lõi: Xuất video 4K siêu nét, mượt mà tuyệt đối (60FPS), không giật lag, không nhấp nháy người và bối cảnh.\n\n`;

      report += `[1] THÔNG SỐ VẬN HÀNH THỰC TẾ:\n`;
      report += `- Độ phân giải render: ${stats.resolution}\n`;
      report += `- Thời gian chạy thực tế: ${totalSecs} giây\n`;
      report += `- Tổng số khung hình đã xử lý: ${stats.totalFrames} frames\n`;
      report += `- Số khung hình bị chậm (>16ms/frame): ${stats.slowFrames} frames\n`;
      report += `- Số khung hình rớt nhịp/nháy đen (>33ms/frame): ${stats.droppedFrames} frames\n`;
      report += `- Tốc độ vẽ Engine 2D trung bình: ${avgDraw.toFixed(2)} ms/frame (Ngưỡng an toàn 60fps: < 16.6ms)\n`;
      report += `- Thuật toán tách nền (Chroma Key): ${avgChroma.toFixed(2)} ms/frame\n`;
      report += `- Hoà hợp ánh sáng (Bóng đổ, Color Match): ${stats.fxEnabled ? 'Đang Bật' : 'Đã Tắt'}\n\n`;

      if (errorMsg) {
          report += `[!] CẢNH BÁO LỖI HỆ THỐNG KHI RENDER: ${errorMsg}\n\n`;
      }

      report += `[2] KẾT LUẬN & VẤN ĐỀ CỤ THỂ:\n`;
      let hasIssues = false;
      let prompts = [];

      if (avgDraw > 16.6) {
          hasIssues = true;
          report += `❌ Cổ chai CPU (Draw Time): Tốc độ vẽ vượt quá giới hạn 16ms/frame. Việc dùng Canvas 2D API để nội suy ảnh 4K đang quá sức với CPU, gây giật lag tổng thể.\n`;
          prompts.push(`Tâm An, hãy nâng cấp engine vẽ từ Canvas 2D hiện tại sang WebGL (Sử dụng thư viện trung gian hoặc raw WebGL) để dồn toàn bộ tác vụ nội suy hình ảnh và scale 4K cho card đồ họa (GPU) xử lý, giảm tải hoàn toàn cho CPU.`);
      }

      if (avgChroma > 8) {
          hasIssues = true;
          report += `❌ Cổ chai Tách nền (Chroma Key): Vòng lặp trên mảng pixel bằng Javascript thuần đang ăn quá nhiều thời gian CPU.\n`;
          prompts.push(`Tâm An, hãy viết lại hàm 'processChromaKeyPixels'. Thay vì dùng vòng lặp JS thuần trên CPU, hãy chuyển thuật toán tách nền xanh (Chroma Key) thành WebGL Fragment Shader, hoặc đưa tác vụ này vào Web Worker / OffscreenCanvas để không làm đứng luồng render chính.`);
      }

      if (stats.droppedFrames > 3 || stats.slowFrames > (stats.totalFrames * 0.15)) {
          hasIssues = true;
          report += `❌ Nhấp nháy Bối Cảnh & Desync: Quá trình bắt hình (requestAnimationFrame) đang không đồng bộ chuẩn xác với tốc độ giải mã thực tế của thẻ <video> nền, gây ra hiện tượng chớp đen hoặc đứng hình khấc khấc.\n`;
          prompts.push(`Tâm An, để triệt tiêu vĩnh viễn hiện tượng nhấp nháy nền video, hãy thay thế cơ chế đồng bộ video hiện tại bằng API 'requestVideoFrameCallback' (RVFC) kết hợp 'WebCodecs/VideoFrame'. Điều này đảm bảo mỗi frame video nền đều được giải mã và bắt dính chính xác 100% trước khi vẽ lên Canvas xuất.`);
      }

      if (errorMsg && errorMsg.toLowerCase().includes('memory')) {
           hasIssues = true;
           report += `❌ Tràn RAM (Out of Memory): Trình duyệt không đủ dung lượng RAM tạm để chứa luồng video 4K quá dài.\n`;
           prompts.push(`Tâm An, hãy tối ưu lại quản lý luồng MediaRecorder. Thay vì lưu toàn bộ mảng 'chunks' vào RAM rồi mới xuất Blob một lần, hãy cấu trúc lại để ghi luồng dữ liệu thẳng xuống ổ cứng cục bộ thông qua 'File System Access API (createWritable)', giúp xuất video dài vài tiếng chuẩn 4K mà không bao giờ tràn RAM.`);
      }

      if (!hasIssues && !errorMsg) {
          report += `✅ HỆ THỐNG ĐẠT CHUẨN MƯỢT MÀ. Mọi thông số nội suy và tách nền đều nằm dưới ngưỡng cảnh báo. Không phát hiện nguy cơ giật lag hay nhấp nháy ở độ phân giải hiện tại.\n\n`;
      } else {
          report += `\n[3] ĐỀ XUẤT NÂNG CẤP MÃ NGUỒN CHO TÂM AN (COPY ĐOẠN DƯỚI ĐÂY GỬI VÀO KHUNG CHAT):\n`;
          report += `Dựa trên kết quả nội soi này, Tâm An hãy tái cấu trúc lại mã nguồn theo các yêu cầu kỹ thuật sau để đạt mục tiêu xuất video 4K siêu mượt, không nhấp nháy:\n\n`;
          prompts.forEach((p, idx) => {
              report += `👉 Yêu cầu ${idx + 1}: ${p}\n\n`;
          });
      }

      return report;
  };
  // --- KẾT THÚC HỆ THỐNG NỘI SOI ---

  // --- KHO CAMERA (ĐẠO DIỄN GÓC MÁY) ---
  const DEFAULT_CAM_PRESETS = [
      { id: 'cam_1', name: '1. Ngẫu nhiên Điện ảnh (Mặc định)', type: 'random' },
      { id: 'cam_2', name: '2. Đặc tả khuôn mặt & Lùi xa dần', type: 'focus_zoom_out' },
      { id: 'cam_3', name: '3. Đặc tả khuôn mặt & Lia ngang', type: 'focus_pan' },
      { id: 'cam_4', name: '4. Tĩnh tại (Không di chuyển camera)', type: 'static' },
      { id: 'cam_5', name: '5. Chậm rãi tiến sát vào người nói', type: 'slow_zoom_in' },
      { id: 'cam_6', name: '6. Nổi trôi nhẹ nhàng (Bồng bềnh)', type: 'float' },
      { id: 'cam_7', name: '7. Góc thấp ngước nhìn lên', type: 'low_angle_up' },
      { id: 'cam_8', name: '8. Góc cao nhìn xuống', type: 'high_angle_down' },
      { id: 'cam_9', name: '9. Khung hình động (Chuyển động mạnh)', type: 'dynamic' },
      { id: 'cam_10', name: '10. Góc quay tĩnh vi tế (Xê dịch siêu nhỏ)', type: 'micro_move' }
  ];
  const [cameraPresets, setCameraPresets] = useState(DEFAULT_CAM_PRESETS);
  const [selectedCamId, setSelectedCamId] = useState('cam_2'); // Mặc định chọn góc máy bạn yêu cầu
  const [editingCamId, setEditingCamId] = useState(null);
  const [editCamName, setEditCamName] = useState('');

  const handleSaveCamName = (id) => {
      if (editCamName.trim()) {
          setCameraPresets(prev => prev.map(c => c.id === id ? { ...c, name: editCamName } : c));
      }
      setEditingCamId(null);
  };

  // --- TÂM AN FX: State Bật/Tắt & Cấu hình chế độ Hoà Hợp ---
  const [enableAutoHarmonization, setEnableAutoHarmonization] = useState(true);
  
  // Tách riêng bóng cho từng nhân vật (TÂM AN FIX: Chỉnh lý vật lý bóng đổ chuẩn xác)
  // Lão đứng: Base hẹp, bóng gọn dưới gót chân
  const defaultLaoShadowConfig = { shadowOpacity: 0.9, shadowWidth: 1.5, shadowHeight: 0.09, shadowOffsetY: -2, shadowOffsetX: -9, shadowSkewX: 5, shadowStretchY: 2 };
  // Người hỏi ngồi/quỳ: Theo thông số tùy chỉnh chuẩn
  const defaultUserShadowConfig = { shadowOpacity: 0.9, shadowWidth: 1.6, shadowHeight: 0.12, shadowOffsetY: -1, shadowOffsetX: -3, shadowSkewX: 23, shadowStretchY: 1.3 };
  
  const [laoShadow, setLaoShadow] = useState({ ...defaultLaoShadowConfig });
  const [userShadow, setUserShadow] = useState({ ...defaultUserShadowConfig });
  const [shadowEditTarget, setShadowEditTarget] = useState('chung'); // 'chung', 'lao' hoặc 'user'

  const [harmonizeSettings, setHarmonizeSettings] = useState({
      // Color (Màu sắc tổng thể chung) - Đưa về chuẩn 1.0 để bypass CPU khi không dùng
      brightness: 1.0,
      contrast: 1.0,
      saturation: 1.0,
      warmth: 0 // -100 (Lạnh/Xanh) đến 100 (Ấm/Vàng)
  });

  // --- Preset Filter & Modal States ---
  const [presetFilterMode, setPresetFilterMode] = useState('auto'); // 'auto' | 'all'
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [presetFormData, setPresetFormData] = useState({ id: null, name: '', category: 'ngang' });

  const getVideoCategory = (ratio) => {
      if (['16x9', '4x3', '21x9'].includes(ratio)) return 'ngang';
      if (['9x16', '3x4', '2x3'].includes(ratio)) return 'doc';
      if (['1x1'].includes(ratio)) return 'vuong';
      return 'ngang';
  };
  
  // --- Cấu hình Ngoại Hình & Offset ---
  const [laoAppearance, setLaoAppearance] = useState({
      robeColor: '#92400e', innerRobeColor: '#b45309', hairColor: '#e2e8f0', hairStyle: 'bald'
  });
  const [showLaoAura, setShowLaoAura] = useState(false); // TÂM AN THÊM: Tắt hào quang mặc định
  const [userAppearance, setUserAppearance] = useState({
      robeColor: '#78350f', innerRobeColor: '#92400e', hairColor: '#1e293b', hairStyle: 'long'
  });

  // --- ẢNH & VIDEO THẬT CHO LÃO ---
  // Tâm An: Đã gán mặc định hiển thị Video động và tích hợp sẵn link Google Drive Direct
  const [laoVisualType, setLaoVisualType] = useState('video'); 
  
  // TÂM AN FIX: Thay đổi video khởi tạo mặc định thành Lão Chat
  const [laoCustomVideos, setLaoCustomVideos] = useState({ 
      idle: '/lao_ko_nen/chat_nghe.webm',
      talking: '/lao_ko_nen/chat_noi.webm'
  });
  
  // Video mặc định cho Khung Chat (Vẫn giữ Lão Thẳng/Lão Chat)
  const [chatLaoVideos, setChatLaoVideos] = useState({ 
      idle: '/lao_ko_nen/chat_nghe.webm',
      talking: '/lao_ko_nen/chat_noi.webm'
  });
  
  const laoExportVidRefs = useRef({ idle: null, talking: null });
  const [laoCustomImages, setLaoCustomImages] = useState({ closed: null, half: null, open: null });
  
  // Tâm An: Đã thiết lập thông số Xóa nền Thủ công mặc định cho Lão
  const [laoChromaSettings, setLaoChromaSettings] = useState({ 
      mode: 'manual', chromaType: 'none', chromaColor: '#00ff00', tolerance: 50, smoothness: 20, spill: 0.5,
      crop: { t: 0, b: 0, l: 0, r: 0 }, loopMode: 'normal'
  });
  const [processedLaoImages, setProcessedLaoImages] = useState({ closed: null, half: null, open: null });

  // --- ẢNH & VIDEO THẬT CHO NGƯỜI HỎI (USER) ---
  const [userVisualType, setUserVisualType] = useState('video'); 
  const [userCustomVideos, setUserCustomVideos] = useState({ 
      idle: '',
      talking: '',
      bowing: ''
  });
  const userExportVidRefs = useRef({ idle: null, talking: null, bowing: null });
  const [userCustomImages, setUserCustomImages] = useState({ closed: null, half: null, open: null, bow: null });
  
  // Tâm An: Đã reset xóa nền mặc định của Người hỏi về 'none' (Không xóa nền)
  const [userChromaSettings, setUserChromaSettings] = useState({ 
      mode: 'manual', chromaType: 'none', chromaColor: '#00ff00', tolerance: 50, smoothness: 20, spill: 0.5,
      crop: { t: 0, b: 0, l: 0, r: 0 }, loopMode: 'normal'
  });
  const [processedUserImages, setProcessedUserImages] = useState({ closed: null, half: null, open: null, bow: null });

  // --- FIX LỖI SỐ 3: KÍCH HOẠT AUTO CHROMA NGAY KHI BẤM NÚT ---
  useEffect(() => {
      const detectAndSet = async (vidRefs, imgRef, visualType, setSettings) => {
          let srcElement = null;
          if (visualType === 'video') {
              srcElement = vidRefs.current.idle || vidRefs.current.talking;
          } else if (visualType === 'image' && imgRef.closed) {
              srcElement = await loadExternalImage(imgRef.closed);
          }
          
          if (srcElement) {
              if (srcElement.tagName === 'VIDEO' && srcElement.readyState < 2) {
                  srcElement.addEventListener('loadeddata', () => {
                      const color = autoDetectBgColor(srcElement);
                      setSettings(prev => ({...prev, chromaType: 'custom', chromaColor: color}));
                  }, { once: true });
              } else {
                  const color = autoDetectBgColor(srcElement);
                  setSettings(prev => ({...prev, chromaType: 'custom', chromaColor: color}));
              }
          }
      };

      if (laoChromaSettings.mode === 'auto') {
          detectAndSet(laoExportVidRefs, laoCustomImages, laoVisualType, setLaoChromaSettings);
      }
  }, [laoChromaSettings.mode, laoVisualType, laoCustomImages]);

  useEffect(() => {
      const detectAndSet = async (vidRefs, imgRef, visualType, setSettings) => {
          let srcElement = null;
          if (visualType === 'video') {
              srcElement = vidRefs.current.idle || vidRefs.current.talking || vidRefs.current.bowing;
          } else if (visualType === 'image' && imgRef.closed) {
              srcElement = await loadExternalImage(imgRef.closed);
          }
          
          if (srcElement) {
              if (srcElement.tagName === 'VIDEO' && srcElement.readyState < 2) {
                  srcElement.addEventListener('loadeddata', () => {
                      const color = autoDetectBgColor(srcElement);
                      setSettings(prev => ({...prev, chromaType: 'custom', chromaColor: color}));
                  }, { once: true });
              } else {
                  const color = autoDetectBgColor(srcElement);
                  setSettings(prev => ({...prev, chromaType: 'custom', chromaColor: color}));
              }
          }
      };

      if (userChromaSettings.mode === 'auto') {
          detectAndSet(userExportVidRefs, userCustomImages, userVisualType, setUserChromaSettings);
      }
  }, [userChromaSettings.mode, userVisualType, userCustomImages]);

  // Tự động tạo và quản lý Video Element Lão
  useEffect(() => {
      ['idle', 'talking'].forEach(type => {
          const url = laoCustomVideos[type];
          if (url) {
              if (!laoExportVidRefs.current[type]) {
                  const v = document.createElement('video');
                  v.muted = true; v.loop = true; v.playsInline = true; v.crossOrigin = "anonymous";
                  
                  // Kích hoạt Xoá nền Tự Động khi tải video xong
                  v.onloadeddata = () => { 
                      setBgUpdateTrigger(p => p+1); 
                      if (laoChromaSettings.mode === 'auto') {
                          const autoColor = autoDetectBgColor(v);
                          setLaoChromaSettings(prev => ({...prev, chromaType: 'custom', chromaColor: autoColor}));
                      }
                  };
                  v.onerror = async () => {
                      if (!v.proxyAttempted && url.startsWith('http') && !url.startsWith('blob:')) {
                          v.proxyAttempted = true;
                          try {
                              const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
                              v.src = proxyUrl;
                              v.load();
                              v.play().catch(e=>console.log(e));
                          } catch (err) {}
                      }
                  };
                  laoExportVidRefs.current[type] = v;
              }
              if (laoExportVidRefs.current[type].src !== url && laoExportVidRefs.current[type].src !== `https://corsproxy.io/?${encodeURIComponent(url)}`) {
                  laoExportVidRefs.current[type].proxyAttempted = false;
                  laoExportVidRefs.current[type].src = url;
                  laoExportVidRefs.current[type].play().catch(e => console.log("Lao Export Vid:", e));
              }
          } else if (laoExportVidRefs.current[type]) {
              laoExportVidRefs.current[type].pause();
              laoExportVidRefs.current[type] = null;
          }
      });
  }, [laoCustomVideos, laoChromaSettings.mode]);

  // Tự động tạo và quản lý Video Element Người Hỏi
  useEffect(() => {
      ['idle', 'talking', 'bowing'].forEach(type => {
          const url = userCustomVideos[type];
          if (url) {
              if (!userExportVidRefs.current[type]) {
                  const v = document.createElement('video');
                  v.muted = true; 
                  v.loop = true; // TÂM AN FIX: Đã cho phép video vái lạy lặp lại trơn tru đến hết Outro
                  v.playsInline = true; 
                  v.crossOrigin = "anonymous";
                  v.onloadeddata = () => { 
                      setBgUpdateTrigger(p => p+1); 
                      if (userChromaSettings.mode === 'auto') {
                          const autoColor = autoDetectBgColor(v);
                          setUserChromaSettings(prev => ({...prev, chromaType: 'custom', chromaColor: autoColor}));
                      }
                  };
                  v.onerror = async () => {
                      if (!v.proxyAttempted && url.startsWith('http') && !url.startsWith('blob:')) {
                          v.proxyAttempted = true;
                          try {
                             const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
                              v.src = proxyUrl;
                              v.load();
                              v.play().catch(e=>console.log(e));
                          } catch (err) {}
                      }
                  };
                  userExportVidRefs.current[type] = v;
              }
              if (userExportVidRefs.current[type].src !== url && userExportVidRefs.current[type].src !== `https://corsproxy.io/?${encodeURIComponent(url)}`) {
                  userExportVidRefs.current[type].proxyAttempted = false;
                  userExportVidRefs.current[type].src = url;
                  userExportVidRefs.current[type].play().catch(e => console.log("User Export Vid:", e));
              }
          } else if (userExportVidRefs.current[type]) {
              userExportVidRefs.current[type].pause();
              userExportVidRefs.current[type] = null;
          }
      });
  }, [userCustomVideos, userChromaSettings.mode]);

  // Tự động xử lý tách nền cho ảnh thật của Lão
  useEffect(() => {
      let isMounted = true;
      const processLaoImages = async () => {
          if (laoChromaSettings.chromaType === 'none') {
              setProcessedLaoImages(laoCustomImages);
              return;
          }
          const result = { closed: null, half: null, open: null };
          for (const key of ['closed', 'half', 'open']) {
              if (laoCustomImages[key]) {
                  try {
                      const img = await loadExternalImage(laoCustomImages[key]);
                      if (!isMounted) return;
                      const canvas = applyChromaKey(img, laoChromaSettings.chromaType, laoChromaSettings.chromaColor, laoChromaSettings.tolerance);
                      result[key] = canvas.toDataURL('image/png');
                  } catch(e) { console.error("Lỗi Chroma Key ảnh Lão:", e); result[key] = laoCustomImages[key]; }
              }
          }
          if (isMounted) setProcessedLaoImages(result);
      };
      processLaoImages();
      return () => { isMounted = false; };
  }, [laoCustomImages, laoChromaSettings]);

  // Tự động xử lý tách nền cho ảnh thật của Người Hỏi
  useEffect(() => {
      let isMounted = true;
      const processUserImages = async () => {
          if (userChromaSettings.chromaType === 'none') {
              setProcessedUserImages(userCustomImages);
              return;
          }
          const result = { closed: null, half: null, open: null, bow: null };
          for (const key of ['closed', 'half', 'open', 'bow']) {
              if (userCustomImages[key]) {
                  try {
                      const img = await loadExternalImage(userCustomImages[key]);
                      if (!isMounted) return;
                      const canvas = applyChromaKey(img, userChromaSettings.chromaType, userChromaSettings.chromaColor, userChromaSettings.tolerance);
                      result[key] = canvas.toDataURL('image/png');
                  } catch(e) { console.error("Lỗi Chroma Key ảnh User:", e); result[key] = userCustomImages[key]; }
              }
          }
          if (isMounted) setProcessedUserImages(result);
      };
      processUserImages();
      return () => { isMounted = false; };
  }, [userCustomImages, userChromaSettings]);

  // Tự động nhận diện & gán tóc khi mở cửa sổ Render Video
  useEffect(() => {
      if (showVideoExportModal) {
          const isOld = userAge >= 65;
          const defaultHairColor = isOld ? '#e2e8f0' : '#0f172a'; // Trắng bạc hoặc Đen tuyền
          const defaultHairStyle = userGender === 'Nam' ? 'short' : 'long';
          
          setUserAppearance(prev => ({
              ...prev,
              hairColor: defaultHairColor,
              hairStyle: defaultHairStyle
          }));
      }
  }, [showVideoExportModal, userAge, userGender]);

  const [charOffsets, setCharOffsets] = useState({
     lao: { x: 5, y: -15, s: 0.85, flip: false },
     user: { x: 6, y: -5, s: 1.15, flip: false }
  });

  // --- STATE KHO BỐI CẢNH ĐỊNH VỊ SẴN (PRESETS) ---
  const INITIAL_PRESETS = [];

const [presetBackgrounds, setPresetBackgrounds] = useState(INITIAL_PRESETS);

  // --- COMPONENT THUMBNAIL TỐI ƯU CHO KHO NHÂN VẬT (SIÊU NHẸ) ---
  // Hiển thị ảnh tĩnh thay vì load video động để chống giật lag cho hệ thống
  const OptimizedThumb = ({ src }) => {
      const [url, setUrl] = useState('');
      const [isVideo, setIsVideo] = useState(false);

      useEffect(() => {
          let objUrl = null;
          if (src && src.startsWith('idb://')) {
              idb.get(src.replace('idb://', '')).then(blob => { 
                  if (blob) {
                      objUrl = URL.createObjectURL(blob);
                      setUrl(objUrl); 
                      // Nhận diện nếu file tải lên từ máy là Video
                      if (blob.type.startsWith('video/')) setIsVideo(true);
                  }
              });
          } else {
              setUrl(src);
              // Nhận diện link video thông thường
              if (src && src.match(/\.(mp4|webm|ogg)$/i)) setIsVideo(true);
          }
          return () => { if (objUrl) URL.revokeObjectURL(objUrl); }
      }, [src]);

      if (!url) return <div className="w-full h-full bg-slate-900"></div>;

      if (isVideo) {
          // Chỉ load khung hình đầu (metadata), KHÔNG autoplay, KHÔNG loop để tiết kiệm CPU/RAM
          return <video src={url} className="w-full h-full object-cover opacity-80" preload="metadata" muted playsInline />;
      }
      
      // Mặc định render Ảnh Thumbnail tĩnh (Siêu nhẹ)
  return <img src={url} alt="thumbnail" className="w-full h-full object-cover opacity-80" onError={(e) => e.target.style.display='none'}/>;
  };

  // --- STATE KHO NHÂN VẬT ĐỊNH VỊ SẴN ---
  const INITIAL_CHARACTERS = [
      {
          id: 'char_lao_chat',
          name: 'Lão Chat (Mặc định)',
          role: 'lao',
          thumb: '/lao_ko_nen/chat_nghe.webm',
          visualType: 'video',
          assets: {
              idle: '/lao_ko_nen/chat_nghe.webm',
              talking: '/lao_ko_nen/chat_noi.webm',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_lao_thang',
          name: 'Lão Thẳng',
          role: 'lao',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_lao_quay_dau',
          name: 'Lão Quay Đầu',
          role: 'lao',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_dua_hau',
          name: 'Dưa Hấu',
          role: 'user',
          age: 11,
          gender: 'Nam',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.45,
          naturalFacing: 'right'
      },
      {
          id: 'char_lao_xeo',
          name: 'Lão Xéo',
          role: 'lao',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_lao_lua',
          name: 'Lão Lúa',
          role: 'lao',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '/lao_co_nen/nghe_lua.mp4',
              talking: '/lao_co_nen/noi_lua.mp4',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_lao_suoi',
          name: 'Lão Suối',
          role: 'lao',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '/lao_co_nen/nghe_16.mp4',
              talking: '/lao_co_nen/noi_16.mp4',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.3,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_lao_hoa',
          name: 'Lão Hoa',
          role: 'lao',
          thumb: '/lao_co_nen/nghe_hoa.mp4',
          visualType: 'video',
          assets: {
              idle: '/lao_co_nen/nghe_hoa.mp4',
              talking: '/lao_co_nen/noi_hoa.mp4',
              bowing: null
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          recommendedScale: 1.30,
          recommendedX: 2,
          recommendedY: -3,
          defaultLiveFullScreen: true,
          naturalFacing: 'left'
      },
      {
          id: 'char_nam_tre',
          name: 'Nam Trẻ',
          role: 'user',
          age: 25,
          gender: 'Nam',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_ba_lao',
          name: 'Bà Lão',
          role: 'user',
          age: 72,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_co_gai_1',
          name: 'Cô Gái 1',
          role: 'user',
          age: 37,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'left'
      },
      {
          id: 'char_be_gai',
          name: 'Bé gái',
          role: 'user',
          age: 9,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_ong_lao',
          name: 'Ông lão',
          role: 'user',
          age: 81,
          gender: 'Nam',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_ong_lao_ngoi',
          name: 'Ông lão ngồi',
          role: 'user',
          age: 81,
          gender: 'Nam',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_ba_lao_ngoi',
          name: 'Bà lão ngồi',
          role: 'user',
          age: 72,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_be_gai_ngoi',
          name: 'Bé gái ngồi',
          role: 'user',
          age: 8,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_minh',
          name: 'Minh',
          role: 'user',
          age: 29,
          gender: 'Nam',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      },
      {
          id: 'char_thanh_nhu',
          name: 'Thanh Như',
          role: 'user',
          age: 37,
          gender: 'Nữ',
          thumb: '',
          visualType: 'video',
          assets: {
              idle: '',
              talking: '',
              bowing: ''
          },
          chromaSettings: {"mode":"manual","chromaType":"none","chromaColor":"#00ff00","tolerance":50,"smoothness":20,"spill":0.5,"crop":{"t":0,"b":0,"l":0,"r":0},"loopMode":"normal"},
          naturalFacing: 'right'
      }
  ];
    
  const [characterPresets, setCharacterPresets] = useState(INITIAL_CHARACTERS);
  const [localCharacters, setLocalCharacters] = useState([]);

  const loadLocalCharacters = () => {
      const list = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
      setLocalCharacters(list);
  };
  useEffect(() => { loadLocalCharacters(); }, []);

  const allCharacters = [...characterPresets, ...localCharacters];

  // TÂM AN FIX: Mặc định chọn Lão Chat
  const [currentLaoPresetId, setCurrentLaoPresetId] = useState('char_lao_chat');
  const [currentUserPresetId, setCurrentUserPresetId] = useState(null);

  // --- HÀM TỰ ĐỘNG PHÂN TÍCH HƯỚNG NHÌN ---
  const calculateAutoFlip = (laoOffsetX, userOffsetX, laoPresetId, userPresetId) => {
      // Mặc định: Lão ở tọa độ gốc là 65% (bên phải), User ở 35% (bên trái)
      const laoRealX = 65 + laoOffsetX;
      const userRealX = 35 + userOffsetX;
      const laoIsOnRight = laoRealX > userRealX;

      const laoChar = allCharacters.find(c => c.id === laoPresetId);
      const userChar = allCharacters.find(c => c.id === userPresetId);

      // Lấy hướng nhìn tự nhiên của nhân vật (gốc chưa lật)
      const laoNatural = laoChar?.naturalFacing || 'left';
      const userNatural = userChar?.naturalFacing || 'right';

      // Tính toán cần lật hay không để 2 người luôn nhìn về phía nhau
      return {
          laoFlip: laoIsOnRight ? (laoNatural !== 'left') : (laoNatural !== 'right'),
          userFlip: laoIsOnRight ? (userNatural !== 'right') : (userNatural !== 'left')
      };
  };

// HÀM CHUYỂN ĐỔI LÃO CHO KHUNG CHAT
  const handleChangeChatLao = async (charId) => {
      const preset = allCharacters.find(c => c.id === charId);
      if (!preset) return;

      const resolvedAssets = {};
      for (const [key, val] of Object.entries(preset.assets)) {
          if (val && typeof val === 'string' && val.startsWith('idb://')) {
              const idbKey = val.replace('idb://', '');
              const blob = await idb.get(idbKey);
              if (blob) resolvedAssets[key] = URL.createObjectURL(blob);
              else resolvedAssets[key] = null;
          } else {
              resolvedAssets[key] = val;
          }
      }

      setCurrentLaoPresetId(charId);
      setLaoVisualType(preset.visualType);
      if (preset.visualType === 'video') {
          setChatLaoVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null });
      } else if (preset.visualType === 'image') {
          setProcessedLaoImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null });
      } else if (preset.visualType === 'svg') {
          setLaoAppearance(preset.svgAppearance);
      }
      if (preset.chromaSettings) setLaoChromaSettings(preset.chromaSettings);
      
      // TÂM AN FIX: Tự động áp dụng tỉ lệ thu phóng mặc định (VD: Lão Chat = 1.8) cho màn hình Chat
      setChatLaoTransform(prev => ({...prev, s: preset.recommendedScale || 1, x: 0, y: 0}));
      
      showToastMsg(`Đã thỉnh ${preset.name} vào khung đàm đạo`, 'success', 3000);
  };
  // Hàm áp dụng Nhân vật từ Kho vào thực tế
  const applyCharacterPreset = async (preset, targetRole, silent = false, overrideOtherId = null) => {
      if (!silent) showToastMsg(`Đang thiết lập nhân vật "${preset.name}"...`, 'loading', 0);
      const resolvedAssets = {};
      
      try {
          // Giải nén các file từ IndexedDB thành Blob URL nếu là nhân vật lưu cục bộ
          for (const [key, val] of Object.entries(preset.assets)) {
              if (val && typeof val === 'string' && val.startsWith('idb://')) {
                  const idbKey = val.replace('idb://', '');
                  const blob = await idb.get(idbKey);
                  if (blob) {
                      resolvedAssets[key] = URL.createObjectURL(blob);
                  } else {
                      resolvedAssets[key] = null;
                  }
              } else {
                  resolvedAssets[key] = val;
              }
          }

          const nextLaoId = targetRole === 'lao' ? preset.id : (overrideOtherId || currentLaoPresetId);
          const nextUserId = targetRole === 'user' ? preset.id : (overrideOtherId || currentUserPresetId);

          if (targetRole === 'lao') {
              setCurrentLaoPresetId(preset.id);
              setLaoVisualType(preset.visualType);
              if (preset.visualType === 'video') {
                  setLaoCustomVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null });
                  // Đã xóa setChatLaoVideos ở đây để giữ nhân vật Lão Thẳng mặc định trên giao diện Chat
              }
              if (preset.visualType === 'image') setLaoCustomImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null });
              if (preset.visualType === 'svg') setLaoAppearance(preset.svgAppearance);
              if (preset.chromaSettings) setLaoChromaSettings(preset.chromaSettings);
              
              setCharOffsets(prev => { 
                  // Lấy state mới nhất để tính hướng, chống race condition
                  const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, nextLaoId, nextUserId);
                  return { 
                      ...prev, 
                      lao: { 
                          ...prev.lao, 
                          s: preset.recommendedScale || prev.lao.s, 
                          y: preset.recommendedY !== undefined ? preset.recommendedY : prev.lao.y,
                          x: preset.recommendedX !== undefined ? preset.recommendedX : prev.lao.x,
                          flip: laoFlip
                      },
                      user: {
                          ...prev.user,
                          flip: userFlip
                      }
                  };
              });
          } else {
              setCurrentUserPresetId(preset.id);
              setUserVisualType(preset.visualType);
              if (preset.visualType === 'video') setUserCustomVideos({ idle: resolvedAssets.idle || null, talking: resolvedAssets.talking || null, bowing: resolvedAssets.bowing || null });
              if (preset.visualType === 'image') setUserCustomImages({ closed: resolvedAssets.closed || null, half: resolvedAssets.half || null, open: resolvedAssets.open || null, bow: resolvedAssets.bow || null });
              if (preset.visualType === 'svg') setUserAppearance(preset.svgAppearance);
              if (preset.chromaSettings) setUserChromaSettings(preset.chromaSettings);
              
              setCharOffsets(prev => { 
                  // Lấy state mới nhất để tính hướng, chống race condition
                  const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, nextLaoId, nextUserId);
                  return { 
                      ...prev, 
                      user: { 
                          ...prev.user, 
                          s: preset.recommendedScale || prev.user.s, 
                          y: preset.recommendedY !== undefined ? preset.recommendedY : prev.user.y,
                          x: preset.recommendedX !== undefined ? preset.recommendedX : prev.user.x,
                          flip: userFlip
                      },
                      lao: {
                          ...prev.lao,
                          flip: laoFlip
                      }
                  };
              });
          }
          if (!silent) showToastMsg(`Đã áp dụng nhân vật "${preset.name}".`, 'success');
      } catch (err) {
          console.error(err);
          if (!silent) showToastMsg('Có lỗi xảy ra khi trích xuất file từ bộ nhớ máy.', 'error');
      }
  };

  // LƯU CẤU HÌNH KÈM FILE GỐC VÀO TRÌNH DUYỆT CÁ NHÂN (VĨNH VIỄN)
  const handleSaveCharacterToLocal = (targetRole) => {
      // TÂM AN FIX: Thay thế window.prompt bị chặn bằng Modal Custom
      setSaveCharData({
          role: targetRole,
          name: `Nhân vật mới (${new Date().toLocaleTimeString()})`,
          age: 25,
          gender: 'Nữ'
      });
      setShowSaveCharModal(true);
  };

  const executeSaveCharacter = async () => {
      const { role: targetRole, name, age, gender } = saveCharData;
      setShowSaveCharModal(false);

      const visualType = targetRole === 'lao' ? laoVisualType : userVisualType;
      const assets = targetRole === 'lao'
          ? (visualType === 'video' ? laoCustomVideos : laoCustomImages)
          : (visualType === 'video' ? userCustomVideos : userCustomImages);
      const chroma = targetRole === 'lao' ? laoChromaSettings : userChromaSettings;
      const svgApp = targetRole === 'lao' ? laoAppearance : userAppearance;

      const charId = `local_char_${Date.now()}`;
      const savedAssets = {};
      let thumbVal = '';

      showToastMsg('Đang lưu trữ dữ liệu khổng lồ vào ổ cứng trình duyệt...', 'loading', 0);

      try {
          for (const [key, url] of Object.entries(assets)) {
              if (url) {
                  // Nếu là file tải lên từ máy tính, hút trọn cục Blob lưu vào IndexedDB
                  if (url.startsWith('blob:') || url.startsWith('data:')) {
                      const blob = await fetch(url).then(r => r.blob());
                      const idbKey = `${charId}_${key}`;
                      await idb.set(idbKey, blob);
                      savedAssets[key] = `idb://${idbKey}`;
                  } else {
                      savedAssets[key] = url;
                  }
              }
          }

          thumbVal = visualType === 'video' ? (savedAssets.idle || '') : (visualType === 'image' ? (savedAssets.closed || '') : '');

          const newChar = {
              id: charId,
              name: name,
              thumb: thumbVal,
              visualType: visualType,
              assets: savedAssets,
              chromaSettings: chroma,
              svgAppearance: svgApp,
              isLocal: true, 
              role: targetRole, 
              age: Number(age),
              gender: gender,
              naturalFacing: targetRole === 'lao' ? 'left' : 'right'
          };

          const currentList = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
          currentList.push(newChar);
          localStorage.setItem('taman_local_chars', JSON.stringify(currentList));

          loadLocalCharacters();
          showToastMsg('Đã lưu nhân vật vĩnh viễn vào bộ nhớ trình duyệt của bạn!', 'success');
      } catch (err) {
          console.error(err);
          showToastMsg('Không đủ dung lượng hoặc trình duyệt từ chối lưu file.', 'error');
      }
  };

  const handleDeleteLocalChar = (charId, e) => {
      e.stopPropagation();
      setConfirmDialog({
          isOpen: true,
          message: 'Bạn có chắc chắn muốn xoá nhân vật cá nhân này khỏi hệ thống? Dữ liệu không thể khôi phục.',
          onConfirm: () => {
              const list = JSON.parse(localStorage.getItem('taman_local_chars') || '[]');
              const char = list.find(c => c.id === charId);
              if (char) {
                  // Xoá tận gốc các file Blob trong cơ sở dữ liệu ngầm
                  Object.values(char.assets).forEach(val => {
                      if (val && typeof val === 'string' && val.startsWith('idb://')) {
                          idb.remove(val.replace('idb://', ''));
                      }
                  });
              }
              const newList = list.filter(c => c.id !== charId);
              localStorage.setItem('taman_local_chars', JSON.stringify(newList));
              loadLocalCharacters();
              showToastMsg('Đã xoá nhân vật.', 'info');
          }
      });
  };

  const openPresetModal = (preset = null) => {
      if (preset) {
          setPresetFormData({ id: preset.id, name: preset.name, category: preset.aspectCategory || 'ngang' });
          setShowPresetModal(true);
      } else {
          if (!activeBgId) {
              showToastMsg('Hãy chọn một lớp nền đang hiển thị để lưu làm Preset.', 'error');
              return;
          }
          setPresetFormData({
              id: null,
              name: `Bối cảnh ${presetBackgrounds.length + 1}`,
              category: getVideoCategory(videoAspectRatio)
          });
          setShowPresetModal(true);
      }
  };

  const handleConfirmPreset = () => {
      if (!presetFormData.name.trim()) return;

      if (presetFormData.id) {
          setPresetBackgrounds(prev => prev.map(p => 
              p.id === presetFormData.id 
                  ? { ...p, name: presetFormData.name, aspectCategory: presetFormData.category }
                  : p
          ));
          showToastMsg('Đã cập nhật thông tin bối cảnh.', 'success');
      } else {
          const activeBg = customBgs.find(b => b.id === activeBgId);
          if (!activeBg) return;

          const newPreset = {
              id: `preset_${Date.now()}`,
              name: presetFormData.name,
              thumb: activeBg.url,
              url: activeBg.url,
              type: activeBg.type,
              bgSettings: {
                  x: activeBg.x,
                  y: activeBg.y,
                  s: activeBg.s,
                  flip: activeBg.flip,
                  chromaType: activeBg.chromaType,
                  chromaColor: activeBg.chromaColor,
                  tolerance: activeBg.tolerance,
                  muted: activeBg.muted,
                  volume: activeBg.volume !== undefined ? activeBg.volume : 1,
                  loopMode: activeBg.loopMode
              },
              defaultOffsets: JSON.parse(JSON.stringify(charOffsets)),
              aspectCategory: presetFormData.category
          };
          setPresetBackgrounds(prev => [...prev, newPreset]);
          showToastMsg('Đã lưu bối cảnh và vị trí nhân vật vào kho!', 'success');
      }
      setShowPresetModal(false);
  };

  const handleExportPresetsCode = () => {
      const codeString = `const INITIAL_PRESETS = [\n` + presetBackgrounds.map(p => {
          return `  {
    id: '${p.id}',
    name: '${p.name}',
    thumb: '${p.thumb}',
    url: '${p.url}',
    type: '${p.type}',
    bgSettings: ${JSON.stringify(p.bgSettings)},
    defaultOffsets: ${JSON.stringify(p.defaultOffsets)},
    aspectCategory: '${p.aspectCategory || 'ngang'}'
  }`;
      }).join(',\n') + `\n];`;
      
      copyToClipboard(codeString);
      showToastMsg('Đã sao chép tọa độ thành công! Hãy dán (Ctrl+V) vào khung chat cho Tâm An nhé.', 'success', 6000);
  };

  const handleExportPoemDatabaseCode = () => {
      const cleanDb = poemDatabase.map(p => ({
          id: p.id,
          title: p.title,
          stanzas: p.stanzas.map(s => ({
              id: s.id,
              tags: s.tags,
              content: s.content,
              meaning: s.meaning || '',
              audioUrl: null,
              isSaved: false
          }))
      }));
      const codeString = `const POEM_DATABASE = ${JSON.stringify(cleanDb, null, 2)};`;
      
      copyToClipboard(codeString);
      showToastMsg('Đã sao chép toàn bộ mã nguồn Kho Kệ! Hãy dán (Ctrl+V) vào khung chat cho Tâm An nhé.', 'success', 6000);
  };

  const handleDeletePreset = (id, e) => {
      e.stopPropagation();
      const presetToRemove = presetBackgrounds.find(p => p.id === id);
      
      // Dọn dẹp memory an toàn: Chỉ xóa blob nếu không còn Layer hay Preset nào khác xài chung
      if (presetToRemove && presetToRemove.url?.startsWith('blob:')) {
          const isUsedInLayers = customBgs.some(bg => bg.url === presetToRemove.url);
          const isUsedInOtherPresets = presetBackgrounds.some(p => p.id !== id && p.url === presetToRemove.url);
          if (!isUsedInLayers && !isUsedInOtherPresets) {
              URL.revokeObjectURL(presetToRemove.url);
          }
      }

      setPresetBackgrounds(prev => prev.filter(p => p.id !== id));
      showToastMsg('Đã xóa bối cảnh khỏi kho.', 'info');
  };

  // --- LỊCH SỬ HOÀN TÁC (UNDO/REDO) CHO VỊ TRÍ ---
  const [pastOffsets, setPastOffsets] = useState([]);
  const [futureOffsets, setFutureOffsets] = useState([]);

  const saveOffsetHistory = (newOffsets) => {
      setPastOffsets(prev => [...prev, charOffsets]);
      setFutureOffsets([]);
      setCharOffsets(newOffsets);
  };

  const handleUndoPosition = () => {
      if (pastOffsets.length === 0) return;
      const previous = pastOffsets[pastOffsets.length - 1];
      const newPast = pastOffsets.slice(0, pastOffsets.length - 1);
      setFutureOffsets(prev => [charOffsets, ...prev]);
      setPastOffsets(newPast);
      setCharOffsets(previous);
  };

  const handleRedoPosition = () => {
      if (futureOffsets.length === 0) return;
      const next = futureOffsets[0];
      const newFuture = futureOffsets.slice(1);
      setPastOffsets(prev => [...prev, charOffsets]);
      setFutureOffsets(newFuture);
      setCharOffsets(next);
  };

  const handleApplyPresetBackground = (preset) => {
      // Đọc thông số background đã lưu (nếu preset cũ không có thì dùng mặc định)
      const bgProps = preset.bgSettings || {
          x: 0, y: 0, s: 1, flip: false,
          chromaType: 'none', chromaColor: '#000000', tolerance: 50,
          muted: true, loopMode: 'normal', volume: 1
      };
      
      if (bgProps.volume === undefined) bgProps.volume = 1;

      // Thêm bối cảnh vào danh sách Lớp nền
      const newBg = {
          id: Date.now(),
          type: preset.type,
          url: preset.url,
          visible: true,
          ...bgProps
      };
      
      // TÂM AN FIX: Thay thế toàn bộ mảng bằng Bối cảnh mới để xóa các bối cảnh cũ, chống đè lớp
      setCustomBgs([newBg]);
      setActiveBgId(newBg.id);

      // TÂM AN FIX TRỌNG ĐIỂM: Áp dụng nhân vật được ghim kèm với bối cảnh (Bao gồm cả Lão Xéo và Người hỏi)
      const targetLaoId = preset.defaultCharacters?.lao || currentLaoPresetId;
      const targetUserId = preset.defaultCharacters?.user || currentUserPresetId;

      if (preset.defaultCharacters) {
          if (preset.defaultCharacters.lao && currentLaoPresetId !== preset.defaultCharacters.lao) {
              const laoChar = allCharacters.find(c => c.id === preset.defaultCharacters.lao);
              if (laoChar) applyCharacterPreset(laoChar, 'lao', true, targetUserId);
          }
          if (preset.defaultCharacters.user && currentUserPresetId !== preset.defaultCharacters.user) {
              const userChar = allCharacters.find(c => c.id === preset.defaultCharacters.user);
              if (userChar) applyCharacterPreset(userChar, 'user', true, targetLaoId);
          }
      }

      // Cập nhật vị trí nhân vật (có lưu lịch sử Undo) an toàn bằng callback
      setCharOffsets(currentOffsets => {
          const newOffsets = JSON.parse(JSON.stringify(preset.defaultOffsets));
          
          // Tính toán lật mặt dựa trên nhân vật mới được tải vào
          const { laoFlip, userFlip } = calculateAutoFlip(newOffsets.lao.x, newOffsets.user.x, targetLaoId, targetUserId);
          
          newOffsets.lao.flip = laoFlip;
          newOffsets.user.flip = userFlip;

          setPastOffsets(past => [...past, currentOffsets]);
          setFutureOffsets([]);
          
          return newOffsets;
      });

      showToastMsg(`Đã áp dụng bối cảnh "${preset.name}" và định vị lại nhân vật.`, 'success');
  };

  // --- HỆ THỐNG BACKGROUND ĐA LỚP & CHROMA KEY ---
  const defaultBgId = Date.now();
  const [customBgs, setCustomBgs] = useState([{
      id: defaultBgId,
      type: 'video',
      url: '', // Tiếng Suối (Mặc định mới)
      visible: true,
      x: -2.9423597395947625,
      y: 9.811262162721688,
      s: 0.7,
      flip: false,
      chromaType: 'none',
      chromaColor: '#000000',
      tolerance: 50,
      muted: true, // Mặc định tắt tiếng trên UI lúc đang edit
      loopMode: 'normal',
      volume: 0.15
  }]);
  const [activeBgId, setActiveBgId] = useState(defaultBgId);
  const [aiBgPrompt, setAiBgPrompt] = useState('');
  const [isGeneratingBg, setIsGeneratingBg] = useState(false);
  const bgFileInputRef = useRef(null);
  const processedBgsRef = useRef({}); // Cache các ảnh đã xử lý Chroma Key
  const bgVideoRefs = useRef({}); // Quản lý Video Elements ẩn cho render và preview
  const [bgUpdateTrigger, setBgUpdateTrigger] = useState(0);

  const dragInfo = useRef({ isDragging: false, target: null, bgId: null, startX: 0, startY: 0, initialX: 0, initialY: 0 });

  // --- Nhạc Nền (BGM) State ---
  const [bgmAudioData, setBgmAudioData] = useState(() => {
      // TÂM AN FIX: Tự động chọn Đường Hằng An làm nhạc nền mặc định
      const defaultTrack = DEFAULT_BGM_LIST.find(m => m.id === 'bgm_dha');
      return defaultTrack ? { url: defaultTrack.url, name: defaultTrack.name, isPreset: true } : null;
  });
  const [tempAiBgmData, setTempAiBgmData] = useState(null); 
  const [bgmVolume, setBgmVolume] = useState(0.15);
  const bgmFileInputRef = useRef(null);
  const [aiBgmPrompt, setAiBgmPrompt] = useState('');
  const [isGeneratingBgm, setIsGeneratingBgm] = useState(false);

  // --- Logo State ---
  const [logoData, setLogoData] = useState('');
  const [logoSettings, setLogoSettings] = useState({
     chromaType: 'black', chromaColor: '#000000', tolerance: 45, smoothness: 35
  });
  const logoFileInputRef = useRef(null);
  const logoImgRef = useRef(null);
  const processedLogoRef = useRef(null);

  // --- Refs ---
  const videoRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const activeAudioRef = useRef(null);
  const animationFrameRef = useRef(null);
  const exportCanvasRef = useRef(null);
  const exportMediaRecorderRef = useRef(null);
  const exportAudioCtxRef = useRef(null);
  const exportAnimFrameRef = useRef(null); // TÂM AN FIX: Thêm cờ quản lý Vòng lặp Render
  const preloadedLaoFrames = useRef({});
  const preloadedUserFrames = useRef({});
  const preloadedBowFrames = useRef({});
  const preloadedBgImgRef = useRef(null);
  const previewVideoRef = useRef(null);

  const spellCheckControllersRef = useRef({});
  const spellCheckTimeoutsRef = useRef({});
  const audioQueueRef = useRef([]);
  const isPlayingQueueRef = useRef(false);
  const currentMsgIdQueueRef = useRef(null);
  const latestAutoPlayAiMsgIdRef = useRef(null);

  const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
  const [isPreparingGlobal, setIsPreparingGlobal] = useState(false);
  const [globalProgress, setGlobalProgress] = useState(0);
  const [globalCurrentTime, setGlobalCurrentTime] = useState(0);
  const [globalDuration, setGlobalDuration] = useState(0);
  
  const [isRegeneratingAll, setIsRegeneratingAll] = useState(false);
  const [regenerationProgress, setRegenerationProgress] = useState(0);
  const [regenerationComplete, setRegenerationComplete] = useState(false);
  
  // --- TÂM AN AUTO-PILOT (XƯỞNG PHIM TỰ ĐỘNG) STATE ---
  const [showAutoPilotModal, setShowAutoPilotModal] = useState(false);
  const [apTopics, setApTopics] = useState('');
  const [apSettings, setApSettings] = useState({ orientation: '16x9', charMode: 'match', scriptLength: 'Khoảng 6-10 câu', renderMode: 'fullframe', transition: 'none', transitionDuration: 0.7 }); // TÂM AN FIX: Thêm transition
  const [apState, setApState] = useState({ isRunning: false, currentIndex: 0, step: '', logs: [] });
  
  const apStateRef = useRef(apState);
  const apTopicsRef = useRef(apTopics);
  const apSettingsRef = useRef(apSettings);
  const latestMessagesRef = useRef(messages);
  // TÂM AN FIX: Thêm Ref để theo dõi toàn bộ Sessions, chống lệch pha (Race condition) khi Auto-pilot chạy ngầm
  const latestSessionsRef = useRef(sessions);
  const renderPromiseRef = useRef(null);

  useEffect(() => { apStateRef.current = apState; }, [apState]);
  useEffect(() => { apTopicsRef.current = apTopics; }, [apTopics]);
  useEffect(() => { apSettingsRef.current = apSettings; }, [apSettings]);
  useEffect(() => { latestMessagesRef.current = messages; }, [messages]);
  useEffect(() => { latestSessionsRef.current = sessions; }, [sessions]); // Cập nhật ref cho sessions

  // --- TÂM AN FIX TRỌNG ĐIỂM: Khai báo Refs cho các hàm lõi để đập tan lỗi Stale Closure ---
  const startVideoExportRef = useRef(null);
  const processAutoPilotLoopRef = useRef(null);
  
  // Cập nhật liên tục các hàm lõi vào Ref mỗi khi React render lại
  useEffect(() => {
      startVideoExportRef.current = startVideoExport;
      processAutoPilotLoopRef.current = processAutoPilotLoop;
  });

  const logAp = (msg) => {
      setApState(p => ({ ...p, logs: [...p.logs, `${new Date().toLocaleTimeString('vi-VN')} - ${msg}`] }));
  };

  // TÂM AN FIX: Hàm đợi có thể bị ngắt (Abortable Sleep) giúp Nút Dừng Khẩn Cấp nhạy bén 100%
  const delayAp = async (ms) => {
      const steps = Math.ceil(ms / 500);
      for (let i = 0; i < steps; i++) {
          if (!apStateRef.current.isRunning) return false;
          await new Promise(r => setTimeout(r, 500));
      }
      return apStateRef.current.isRunning;
  };

  // 1. Giao phó AI tìm Chủ đề Hot/Viral
  const handleFetchTrendingTopics = async () => {
      logAp("Đang truy cập bộ não AI để tìm các chủ đề Viral nhất hiện nay...");
      setApState(p => ({...p, step: 'fetching_trends'}));
      try {
          const prompt = `Bạn là một chuyên gia nghiên cứu nội dung mạng xã hội (Tiktok, Youtube Shorts, Reels). Hãy liệt kê 10 chủ đề tâm lý, chữa lành, nhân sinh quan đang ĐƯỢC QUAN TÂM NHẤT, VIRAL NHẤT hiện nay (Ví dụ: Áp lực đồng trang lứa, Vỡ nợ tuổi trẻ, Suy nghĩ quá nhiều, Mất phương hướng, Áp lực gia đình...).
          YÊU CẦU BẮT BUỘC: 
          - Trả về ĐÚNG MỘT DANH SÁCH, mỗi chủ đề nằm trên 1 dòng.
          - TUYỆT ĐỐI không đánh số thứ tự (1, 2, 3...).
          - TUYỆT ĐỐI không có văn bản giải thích, không có lời chào đầu hay kết luận. Chỉ xuất ra văn bản thô gồm các chủ đề phân cách bằng dấu xuống dòng.`;

          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });

          const rawResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawResult) {
              setApTopics(rawResult.trim());
              logAp("Đã nạp thành công danh sách chủ đề Viral!");
          } else {
              throw new Error("Không nhận được kết quả.");
          }
      } catch (e) {
          logAp("❌ Lỗi khi tìm chủ đề: " + e.message);
      } finally {
          setApState(p => ({...p, step: 'idle'}));
      }
  };

  // 2. Hàm Tạo Kịch Bản (Core AutoPilot)
  const generateScriptForAutoPilot = async (topic, pName, pGender, pAge) => {
      try {
          // TÂM AN FIX: Ép AI xuống dòng khi đọc kệ để TTS ngắt nhịp chuẩn và Sub không bị tràn
          const quoteRule = appLanguage === 'Tiếng Việt' 
              ? '- Tắt tự làm thơ. Chọn đúng 4 câu kệ (không lấy ngày tháng) phù hợp nhất từ kho dữ liệu. Giữ nguyên văn. BẮT BUỘC: Mỗi câu kệ phải xuống dòng riêng biệt, không được viết dính liền nhau thành 1 hàng. Trước khi trích dẫn, nói: "Sư Cha Tam Vô đã khai thị như sau:".'
              : `- Tắt tự làm thơ. Chọn đúng 4 câu kệ (không lấy ngày tháng) phù hợp từ kho dữ liệu. DỊCH sang ${appLanguage}. MANDATORY: Each line of the poem MUST be on a new line. Do not merge them. Trước khi trích dẫn, nói câu (bằng ${appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;

          // TÂM AN FIX: Ép buộc độ dài kịch bản tuyệt đối
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
          - Khi nói chuyện, bắt buộc tự xưng mình là: "${laoSelfCallRef.current}"
          - Khi gọi/nhắc đến đối phương, bắt buộc dùng từ: "${laoCallUserRef.current}"
          
          2. Nhân vật Phàm Trần (Người hỏi):
          - Tên hiển thị kịch bản: ${pName} (Giới tính: ${pGender}, ${pAge} tuổi)
          - Khi nói chuyện, bắt buộc tự xưng mình là: "${userSelfCallRef.current}"
          - Khi gọi/nhắc đến Minh Sư, bắt buộc dùng từ: "${userCallLaoRef.current}"
          
          VÍ DỤ VỀ XƯNG HÔ: Nếu quy định Người hỏi tự xưng là "Em" và gọi Minh sư là "Anh", thì kịch bản phải thoại là: "Anh ơi, em đang buồn...". Đừng xưng hô lộn xộn (không được để em gọi anh là "ngươi").
          
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
          ${poemDatabase.map(p => `Tên bài: ${p.title}\n` + p.stanzas.map(s => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n')}`;


          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
          });

          const rawResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawResult) throw new Error("AI không trả về kịch bản.");

          const lines = rawResult.split('\n');
          const newMsgs = [];
          let currentRole = null;
          let currentEmotion = 'calm';
          
          // TÂM AN FIX: Trích xuất an toàn Regex để nhận diện tên tự do
          const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const laoNameSafe = escapeRegExp(customLaoName || 'Lão');
          const userNameSafe = escapeRegExp(pName || 'Con');
          
          lines.forEach(line => {
             let text = line.replace(/\*\*/g, '').trim();
             if (!text) return;
             let role = null;
             let cleanText = text;
             
             // Regex tách Role, Emotion và Text dựa trên tên tự định nghĩa
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
                 // TÂM AN FIX: Đổi dấu cách thành \n để bảo toàn việc xuống dòng của bài kệ
                 if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                     newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
                 } else {
                     newMsgs.push({ id: Date.now() + Math.random(), role, text: cleanText, emotion: currentEmotion, timestamp: new Date(), audioUrl: null, reactions: {} });
                 }
             }
          });

          if (newMsgs.length === 0) throw new Error("Lỗi định dạng kịch bản từ AI.");

          // Tạo Session mới
          const newSessionId = Date.now();
          const newSession = { id: newSessionId, title: `Auto: ${topic.substring(0, 15)}...`, isPinned: false, messages: newMsgs };
          
          setSessions(prev => [newSession, ...prev]);
          setCurrentSessionId(newSessionId);
          
          await delayAp(500); // Đợi React cập nhật state thay vì setTimeout khóa chết
          
          return newSessionId; // TÂM AN FIX: Trả về chính xác ID vừa tạo để bước Audio không bị nhầm lẫn
      } catch (err) {
          throw err;
      }
  };

  // 3. Hàm Tạo Âm Thanh Hàng Loạt (Đảm bảo 100%) - TÂM AN ĐÃ NÂNG CẤP CHỐNG LẶP VÔ TẬN
  const generateAudioForAutoPilot = async (sessionId) => {
      let attempts = 0;
      const MAX_ATTEMPTS = 5;
      
      while (attempts < MAX_ATTEMPTS && apStateRef.current.isRunning) {
          // Lấy chính xác Session đang được xử lý từ bộ nhớ đệm toàn cục
          const targetSession = latestSessionsRef.current.find(s => s.id === sessionId);
          if (!targetSession) throw new Error("Không tìm thấy dữ liệu đàm đạo.");
          
          const currentMsgs = targetSession.messages;
          
          // Lọc ra các đoạn CÓ CHỮ (bỏ qua những đoạn chỉ có hành động như "[khóc]") và CHƯA CÓ ÂM THANH
          const missing = currentMsgs.filter(m => {
              if (m.audioUrl) return false; // Đã có âm thanh thì bỏ qua
              const readableText = m.text.replace(/\[.*?\]|\(.*?\)/g, '').trim(); // Lọc bỏ [khóc], (thở dài)
              return readableText.length > 0; // Chỉ đếm những đoạn thực sự có chữ để đọc
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
                      if (!(await delayAp(4000))) return false; // Nhường đường cho API Google hồi phục
                  } else {
                      logAp(`🎙️ Đã tạo xong âm thanh: "${msg.text.substring(0, 20)}..."`);
                  }
              }
              if (!(await delayAp(2500))) return false; // Nghỉ an toàn giữa các câu
          }
          
          attempts++;
          if (!(await delayAp(2000))) return false; // Đợi React cập nhật hoàn toàn State mảng Sessions
      }

      // Kiểm tra lần cuối cùng xem có thực sự kẹt không
      const finalSession = latestSessionsRef.current.find(s => s.id === sessionId);
      const finalMissing = (finalSession?.messages || []).filter(m => !m.audioUrl && m.text.replace(/\[.*?\]|\(.*?\)/g, '').trim().length > 0);
      
      if (finalMissing.length > 0) {
          throw new Error("Đường truyền API TTS của Google đang bị quá tải (Rate limit). Vui lòng dừng hệ thống Auto-Pilot, đợi 5 phút rồi chạy lại.");
      }
      return true;
  };

  // 4. Hàm Lọc & Random Trình Tự Mới Của Xưởng Phim
  // Hàm này trả về Bối cảnh và ID Nhân vật để dùng cho cả UI lẫn mớm dữ liệu vào AI
  const prepareAutoPilotAssets = () => {
      const orientation = apSettingsRef.current.orientation;
      const isRandomMode = apSettingsRef.current.charMode === 'random';
      const category = getVideoCategory(orientation);

      // TÂM AN FIX: Lọc bối cảnh Random CHỈ CHO PHÉP VIDEO (Ảnh động), cấm ảnh tĩnh.
      const validBgs = presetBackgrounds.filter(p => p.type === 'video' && (!p.aspectCategory || p.aspectCategory === category));
      const selectedBg = validBgs.length > 0 ? validBgs[Math.floor(Math.random() * validBgs.length)] : presetBackgrounds[0];

      let selectedUserCharId = currentUserPresetId;
      if (isRandomMode) {
          // Lấy đúng nhân vật đã ghim offset trong Bối cảnh đó (Nếu có) để toạ độ ngồi/đứng không bị lệch
          if (selectedBg.defaultCharacters && selectedBg.defaultCharacters.user) {
              selectedUserCharId = selectedBg.defaultCharacters.user;
          } else {
              // Nếu Bối cảnh không ghim, thì mới random tự do
              const validUsers = allCharacters.filter(c => c.role === 'user' || !c.role);
              selectedUserCharId = validUsers.length > 0 ? validUsers[Math.floor(Math.random() * validUsers.length)].id : null;
          }
      }

      const targetLaoId = 'char_lao_xeo';

      return { selectedBg, selectedUserCharId, targetLaoId };
  };

  // 5. Hàm Orchestrator (Quản lý Vòng Lặp Chính)
  const processAutoPilotLoop = async () => {
      if (!apStateRef.current.isRunning) return;
      
      const topics = apTopicsRef.current.split('\n').filter(t => t.trim());
      const idx = apStateRef.current.currentIndex;

      if (idx >= topics.length) {
          logAp("🎉 ĐÃ HOÀN THÀNH TOÀN BỘ DANH SÁCH CHỦ ĐỀ!");
          setApState(p => ({...p, isRunning: false, step: 'completed'}));
          return;
      }

      const currentTopic = topics[idx];
      logAp(`--- BẮT ĐẦU CHỦ ĐỀ [${idx + 1}/${topics.length}]: ${currentTopic.substring(0,30)}... ---`);

      try {
          // BƯỚC 1: Clear Cache trước khi làm việc nặng
          setApState(p => ({...p, step: 'cache'}));
          logAp("Xóa bộ nhớ đệm giải phóng RAM...");
          handleClearCache();
          if (!(await delayAp(2500))) return;

          // BƯỚC 2: Set Bối Cảnh, Nhân Vật, Nhạc Nền (Lấy dữ liệu để mớm cho AI)
          setApState(p => ({...p, step: 'assets'}));
          logAp("Phân tích bối cảnh và chọn nhân vật (Đồng bộ offset)...");
          
          const { selectedBg, selectedUserCharId, targetLaoId } = prepareAutoPilotAssets();
          
          const isRandomMode = apSettingsRef.current.charMode === 'random';
          const isFullFrameRender = apSettingsRef.current.renderMode === 'fullframe';

          let pName = userName.trim() || 'Con';
          let pGender = userGender;
          let pAge = userAge;
          let selectedPackId = 'pack_co_gai';

          if (isFullFrameRender) {
              const isDoc = apSettingsRef.current.orientation === '9x16';
              // TÂM AN FIX: Nếu chế độ Dựng Sẵn + Ẩn danh -> Bốc ngẫu nhiên 1 Bộ Cảnh (Pack) đúng tỷ lệ
              if (isRandomMode) {
                  const validPacks = FULLFRAME_PACKS.filter(p => p.aspect === (isDoc ? 'doc' : 'ngang'));
                  const randomPack = validPacks.length > 0 ? validPacks[Math.floor(Math.random() * validPacks.length)] : FULLFRAME_PACKS[0];
                  selectedPackId = randomPack.id;
                  
                  const basePackId = selectedPackId.replace('_doc', '');
                  // Gán tuổi, giới tính và tên gọi để AI viết kịch bản + xuất giọng đọc chuẩn xác
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
                  // Giữ cố định theo hồ sơ -> Chọn Bộ Cảnh gần sát nhất
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
                  
                  // Cố gắng tìm bản Dọc nếu cần
                  let tryPackId = isDoc ? `${basePackId}_doc` : basePackId;
                  const packExists = FULLFRAME_PACKS.some(p => p.id === tryPackId);
                  
                  if (!packExists) {
                       if (isDoc) {
                           tryPackId = pGender === 'Nam' ? 'pack_ong_lao_85_doc' : 'pack_ba_lao_78_doc'; 
                       } else {
                           tryPackId = 'pack_co_gai'; 
                       }
                  }
                  selectedPackId = tryPackId;
              }
              
              const targetPack = FULLFRAME_PACKS.find(p => p.id === selectedPackId);
              if (targetPack) {
                  setFfScenes(JSON.parse(JSON.stringify(targetPack.scenes)));
                  logAp(`Đã nạp cảnh quay Toàn Cảnh: ${targetPack.name} (${pName})`);
              }
          } else {
              // --- CHẾ ĐỘ 3D CÁCH CŨ ---
              if (isRandomMode) {
                  pName = userChar.name || 'Một người lạ';
                  pGender = userChar.gender || 'Nữ'; // Mặc định Nữ nếu ko xác định
                  pAge = userChar.age || 25;
              }
          }

          // Đồng bộ Giọng đọc tương ứng với Tuổi và Giới tính
          if (isRandomMode) {
              let vName = pGender === 'Nam' ? 'Puck' : 'Aoede';
              let ageDesc = "giọng thanh niên";
              if (pAge <= 16) { ageDesc = "giọng trẻ em"; vName = "Kore"; }
              else if (pAge >= 17 && pAge <= 39) { ageDesc = "giọng thanh niên"; }
              else if (pAge >= 40 && pAge <= 59) { ageDesc = "giọng trung niên"; vName = pGender === 'Nam' ? 'Enceladus' : 'Zephyr'; }
              else { ageDesc = "giọng người già"; vName = pGender === 'Nam' ? 'Charon' : 'Autonoe'; }
              
              let moodDesc = pGender === 'Nam' ? "tha thiết, khẩn cầu, thắc mắc" : "tỏ vẻ rối rắm, thắc mắc";
              let vStyle = `${ageDesc}, phong cách đọc ${moodDesc}, chuẩn giọng miền Nam Việt Nam, đúng chính tả`;

              setUserVoice(vName);
              setUserVoiceStyle(vStyle);
              setCustomUserName(pName); // Gán tên Random vào AI
              logAp(`Đã nạp hồn AI: Giọng ${vName} (${pAge} tuổi, ${pGender})`);
          } else {
              pName = customUserName || userName.trim() || 'Con';
          }

          // --- TÂM AN FIX: ĐỒNG BỘ TUYỆT ĐỐI VỊ TRÍ VÀ HƯỚNG NHÌN KHI RENDER HÀNG LOẠT ---
          setVideoAspectRatio(apSettingsRef.current.orientation);
          setVideoTransition(apSettingsRef.current.transition); // Đồng bộ cấu hình chuyển cảnh từ Auto-Pilot
          
          // 1. Tải nhân vật trước (Dùng await để đảm bảo RAM đã trích xuất xong file)
          const laoPreset = allCharacters.find(c => c.id === targetLaoId);
          if (laoPreset) await applyCharacterPreset(laoPreset, 'lao', true, selectedUserCharId);
          if (userChar && userChar.id) await applyCharacterPreset(userChar, 'user', true, targetLaoId);

          // 2. Áp dụng nền và Cưỡng chế chốt sổ tọa độ (Ghi đè mọi sự xô lệch)
          if (selectedBg) {
              // TÂM AN FIX: Đặt thẳng dữ liệu nền vào State để tránh xung đột Race Condition 
              // với hàm handleApplyPresetBackground trong môi trường Auto-Pilot
              const bgProps = selectedBg.bgSettings || {
                  x: 0, y: 0, s: 1, flip: false,
                  chromaType: 'none', chromaColor: '#000000', tolerance: 50,
                  muted: true, loopMode: 'normal', volume: 1
              };
              if (bgProps.volume === undefined) bgProps.volume = 1;

              const newBg = {
                  id: Date.now(),
                  type: selectedBg.type,
                  url: selectedBg.url,
                  visible: true,
                  ...bgProps
              };
              
              setCustomBgs([newBg]);
              setActiveBgId(newBg.id);
              
              setCharOffsets(prev => {
                  const finalOffsets = JSON.parse(JSON.stringify(selectedBg.defaultOffsets));
                  
                  // Giữ lại Scale/Y đặc thù của nhân vật (VD: Bé Dưa Hấu cần phóng to hơn)
                  if (laoPreset?.recommendedScale) finalOffsets.lao.s = laoPreset.recommendedScale;
                  if (userChar?.recommendedScale) finalOffsets.user.s = userChar.recommendedScale;
                  if (laoPreset?.recommendedY !== undefined) finalOffsets.lao.y = laoPreset.recommendedY;
                  if (userChar?.recommendedY !== undefined) finalOffsets.user.y = userChar.recommendedY;

                  // Tính lại hướng nhìn DỰA TRÊN ID ĐÃ CHỌN TRONG AUTOPILOT thay vì state hiện tại của UI
                  const { laoFlip, userFlip } = calculateAutoFlip(finalOffsets.lao.x, finalOffsets.user.x, targetLaoId, selectedUserCharId);
                  finalOffsets.lao.flip = laoFlip;
                  finalOffsets.user.flip = userFlip;
                  
                  return finalOffsets;
              });
          }
          // --- END FIX ---

          // Cố định Nhạc nền (Không random)
          const dhaTrack = DEFAULT_BGM_LIST.find(m => m.id === 'bgm_dha');
          if (dhaTrack) setBgmAudioData({ url: dhaTrack.url, name: dhaTrack.name, isPreset: true });

          if (!(await delayAp(1500))) return;

          // BƯỚC 3: Tạo Kịch Bản
          setApState(p => ({...p, step: 'script'}));
          logAp(`Đang nhờ AI viết kịch bản cho: ${pName} (${pAge} tuổi)...`);
          const newSessId = await generateScriptForAutoPilot(currentTopic, pName, pGender, pAge);
          if (!apStateRef.current.isRunning) return;

          // --- TÂM AN THÊM: TỰ ĐỘNG TRÍCH XUẤT INTRO TỪ KỊCH BẢN AI ---
          const finalSession = latestSessionsRef.current.find(s => s.id === newSessId);
          let extractedQuestion = "Làm sao để buông bỏ vọng niệm?";
          if (finalSession) {
              const aiMsgs = finalSession.messages.filter(m => m.role === 'ai');
              if (aiMsgs.length > 0) {
                  const lastAiMsg = aiMsgs[aiMsgs.length - 1].text;
                  // Tìm câu hỏi cuối cùng của Lão
                  const match = lastAiMsg.match(/([^.?!]+[?])/g);
                  if (match) {
                      extractedQuestion = match[match.length - 1].trim();
                  }
              }
          }
          setEnableIntro(true);
          setIntroTitle(currentTopic);
          introTitleRef.current = currentTopic; // TÂM AN FIX: Cập nhật Ref trực tiếp để vẽ Canvas ngay lập tức
          setIntroSubtitle(extractedQuestion);
          introSubtitleRef.current = extractedQuestion; // TÂM AN FIX: Cập nhật Ref trực tiếp
          setEnableOutroText(true);
          // -------------------------------------------------------------

          // BƯỚC 4: Tạo Âm Thanh
          setApState(p => ({...p, step: 'audio'}));
          logAp("Đang tạo âm thanh đồng loạt...");
          await generateAudioForAutoPilot(newSessId); 
          if (!apStateRef.current.isRunning) return;

          // BƯỚC 5: Render Video & Download
          setApState(p => ({...p, step: 'render'}));
          logAp("Mở Xưởng phim và chuẩn bị tài nguyên...");
          
          // TÂM AN FIX: Áp dụng Chế độ Render theo cài đặt của Auto-Pilot
          setIsFullFrameMode(isFullFrameRender);
          if (!(await delayAp(500))) return; // Đợi UI cập nhật trạng thái
          logAp(`Chế độ Render: ${isFullFrameRender ? 'Video Dựng Sẵn (Toàn cảnh)' : 'Cách Cũ (Phông Xanh 3D)'}`);

          resetVideoExport(); 
          setShowVideoExportModal(true);
          
          // TÂM AN ĐÃ NÂNG THỜI GIAN LÀM NÓNG GPU LÊN 8 GIÂY (CHỐNG GIẬT LAG)
          logAp("Đang làm nóng GPU (Đợi 8s)... Vui lòng KHÔNG chuyển tab!");
          if (!(await delayAp(8000))) return; 
          
          logAp("Bắt đầu Render Video chất lượng cao...");
          await new Promise((resolve, reject) => {
              renderPromiseRef.current = { resolve, reject };
              if (startVideoExportRef.current) startVideoExportRef.current(); 
          });

          if (!apStateRef.current.isRunning) return;

          // BƯỚC 6: Chuyển bài
          setApState(p => ({...p, step: 'wait', currentIndex: idx + 1}));
          logAp("✅ Thành công! Đợi 12 giây cho máy nghỉ trước khi sang chủ đề tiếp theo...");
          
          if (!(await delayAp(12000))) return; 
          
          if (apStateRef.current.isRunning && processAutoPilotLoopRef.current) {
              processAutoPilotLoopRef.current();
          }

      } catch (err) {
          // TÂM AN FIX: Bắt chính xác lỗi Dừng khẩn cấp để không báo đỏ
          if (err.message === "Dừng khẩn cấp từ người dùng.") {
              logAp("✅ Đã ngắt cầu dao, dừng xưởng phim an toàn.");
              setApState(p => ({...p, isRunning: false, step: 'stopped'}));
          } else {
              logAp(`❌ LỖI NGHIÊM TRỌNG: ${err.message}`);
              logAp("Tạm dừng hệ thống Auto-Pilot để tránh vòng lặp lỗi.");
              setApState(p => ({...p, isRunning: false, step: 'error'}));
          }
      }
  };

  const startAutoPilot = () => {
      if (!apTopics.trim()) {
          showToastMsg('Danh sách chủ đề đang trống!', 'error');
          return;
      }
      setApState(p => ({...p, isRunning: true, logs: [], currentIndex: 0}));
      logAp("🚀 KHỞI ĐỘNG XƯỞNG PHIM TỰ ĐỘNG...");
      logAp("⚠️ BẮT BUỘC: Hãy giữ màn hình tab này luôn mở để video render mượt mà, không giật lag.");
      setTimeout(() => {
          if (processAutoPilotLoopRef.current) processAutoPilotLoopRef.current();
      }, 500);
  };

  const stopAutoPilot = () => {
      logAp("🛑 ĐÃ NHẬN LỆNH DỪNG HỆ THỐNG KHẨN CẤP.");
      
      // Ép buộc cập nhật Ref ngay lập tức để bẻ gãy mọi vòng lặp ngầm (delayAp)
      apStateRef.current = { ...apStateRef.current, isRunning: false };
      setApState(p => ({...p, isRunning: false, step: 'stopped'}));
      
      // TÂM AN FIX: Chém đứt Promise Render ngay lập tức để vòng lặp chính thoát ra
      if (renderPromiseRef.current) {
          renderPromiseRef.current.reject(new Error("Dừng khẩn cấp từ người dùng."));
          renderPromiseRef.current = null;
      }
      
      cancelVideoExport(); // Hủy render và thu dọn UI Video Export
      
      // Cắt luôn luồng âm thanh đang phát để máy dừng hẳn
      audioQueueRef.current = [];
      isPlayingQueueRef.current = false;
      if (activeAudioRef.current) activeAudioRef.current.pause();
      if (globalAudioRef.current) globalAudioRef.current.pause();
  };

  const globalAudioRef = useRef(null);
  const globalAudioUrlRef = useRef(null);
  const globalMessageCountRef = useRef(0);
  const globalAudioMetadataRef = useRef([]);

  // BIẾN TOÀN CỤC MỚI: Xác định xem Lão có đang trong một "Phiên nói" (Kể cả khi bị ngắt quãng giữa các câu do mạng)
  const playingMsg = messages.find(m => m.id === currentlyPlayingId) || messages.find(m => m.id === currentMsgIdQueueRef.current);
  
  let isLaoSpeakingSession = false;
  if (isGlobalPlaying && globalAudioRef.current) {
      const ct = globalAudioRef.current.currentTime;
      // Dò tìm trên trục thời gian tổng xem phân đoạn hiện tại là của Lão hay Con
      // Mở rộng viền thời gian +- 0.3s để tránh Lão bị khựng giữa các đoạn nối âm thanh
      const segment = globalAudioMetadataRef.current.find(m => ct >= (m.start - 0.3) && ct <= (m.end + 0.3));
      isLaoSpeakingSession = segment ? segment.role === 'ai' : false;
  } else {
      isLaoSpeakingSession = playingMsg?.role === 'ai' && (currentlyPlayingId !== null || isPlayingQueueRef.current);
  }

  // --- TÂM AN LÕI MỚI: THUẬT TOÁN TÁCH CÂU VÀ TÍNH TỶ LỆ CHO PHỤ ĐỀ LIVESTREAM (BẢN CHỐNG GIẬT 100%) ---
  const buildLiveSubMeta = (rawText) => {
      if (!rawText) {
          liveSubtitlesMetaRef.current = null;
          currentLiveSubTextRef.current = '';
          const subEl = document.getElementById('live-subtitle-text');
          if (subEl) subEl.innerText = '';
          return;
      }

      const cleanFullText = rawText.replace(/\[.*?\]|\(.*?\)/g, '').trim();
      
      // TÂM AN FIX: Tách theo MỌI dấu câu (phẩy, chấm, hỏi, than, hai chấm...) theo yêu cầu để chia câu siêu ngắn
      const rawParts = cleanFullText.split(/([.,!?;:\n。，、？！：；]+)/);
      const sentences = [];
      let tempStr = "";

      for (let i = 0; i < rawParts.length; i++) {
          tempStr += rawParts[i];
          // Gom nội dung chữ và dấu câu đi kèm thành 1 khối
          if (i % 2 !== 0 || i === rawParts.length - 1) {
              let s = tempStr.trim();
              if (s) sentences.push(s);
              tempStr = "";
          }
      }

      // TÂM AN FIX: Hủy bỏ thuật toán gộp câu (Smart Grouping) để mỗi dấu câu là 1 màn hình phụ đề riêng biệt
      const mergedSentences = sentences;

      if (mergedSentences.length === 0) {
          liveSubtitlesMetaRef.current = null;
          return;
      }

      // 3. Tính toán Tỷ lệ xuất hiện (Percentage Mapping) trên tổng thời gian của file Audio
      const totalChars = mergedSentences.reduce((sum, s) => sum + s.length, 0);
      let currentStartPct = 0;
      
      const meta = mergedSentences.map(s => {
          const pctLen = s.length / Math.max(totalChars, 1);
          const endPct = currentStartPct + pctLen;
          const item = { text: s, startPct: currentStartPct, endPct: endPct };
          currentStartPct = endPct;
          return item;
      });
      
      liveSubtitlesMetaRef.current = meta;
      currentLiveSubTextRef.current = meta[0].text;
      
      // Đẩy thẳng ra màn hình ngay lập tức để không bị delay do React
      const subEl = document.getElementById('live-subtitle-text');
      if (subEl) subEl.innerText = meta[0].text;
  };

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // --- Cải tiến Fetch API với Exponential Backoff ---
  const fetchWithRetry = async (url, options, retries = 5, delay = 1000) => {
    try {
      if (options?.signal?.aborted) throw new DOMException('Aborted', 'AbortError');
      const response = await fetch(url, options);
      const text = await response.text();
      
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${text}`);
      }
      
      try {
        return text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error(`JSON Parse Error: ${e.message}`);
      }
    } catch (err) {
      if (err.name === 'AbortError' || err.message.includes('aborted')) throw err;
      if (retries > 0) {
        await new Promise(res => setTimeout(res, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw err;
    }
  };

  // --- Hàm xử lý tách nền (Chroma Key) dùng chung cho Ảnh Tĩnh ---
  const applyChromaKey = (imgElement, type, colorHex, tolerance) => {
    if (type === 'none') return imgElement;
    
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.width || imgElement.videoWidth || imgElement.naturalWidth;
    canvas.height = imgElement.height || imgElement.videoHeight || imgElement.naturalHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);
    
    try {
        processChromaKeyPixels(ctx, canvas.width, canvas.height, { chromaType: type, chromaColor: colorHex, tolerance });
    } catch(e) { console.warn("Lỗi Chroma Key (có thể do CORS):", e); }
    
    return canvas;
  };

  // Quản lý Video Background Elements ẩn
  useEffect(() => {
    const currentIds = customBgs.map(b => b.id);
    
    // Dọn dẹp video đã xóa
    Object.keys(bgVideoRefs.current).forEach(id => {
        if (!currentIds.includes(Number(id))) {
            const vObj = bgVideoRefs.current[id];
            if (vObj) {
                // TÂM AN FIX V6: Xoá trọn bộ cả 2 bản sao video
                if (vObj.elementA) { vObj.elementA.pause(); vObj.elementA.removeAttribute('src'); vObj.elementA.load(); }
                if (vObj.elementB) { vObj.elementB.pause(); vObj.elementB.removeAttribute('src'); vObj.elementB.load(); }
            }
            delete bgVideoRefs.current[id];
        }
    });

    customBgs.forEach(bg => {
        if (bg.type === 'video') {
            if (!bgVideoRefs.current[bg.id]) {
                // TÂM AN FIX V6: Hàm tạo Video nguyên mẫu cho chiến thuật Double Buffering
                const createBgVideo = () => {
                    const v = document.createElement('video');
                    v.src = bg.url;
                    v.muted = true; // Mặc định tắt tiếng ở DOM
                    v.loop = false; // TẮT VÒNG LẶP NATIVE - Ta sẽ xử lý vòng lặp đè (crossfade) bằng JS
                    v.playsInline = true;
                    v.crossOrigin = "anonymous";
                    return v;
                };

                const vA = createBgVideo();
                const vB = createBgVideo();

                const onMetaLoaded = (v) => {
                    if (bgVideoRefs.current[bg.id]) {
                        bgVideoRefs.current[bg.id].isLoaded = true;
                        bgVideoRefs.current[bg.id].duration = v.duration;
                        bgVideoRefs.current[bg.id].videoWidth = v.videoWidth;
                        bgVideoRefs.current[bg.id].videoHeight = v.videoHeight;
                        setBgUpdateTrigger(prev => prev + 1); // Kích hoạt render lại preview
                    }
                };

                vA.onloadedmetadata = () => onMetaLoaded(vA);
                vB.onloadedmetadata = () => onMetaLoaded(vB);

                // --- BẮT ĐẦU VÁ LỖI GOOGLE DRIVE ---
                const attachProxyHandler = (v, isPrimary) => {
                    let proxyAttempted = false;
                    v.onerror = async () => {
                        if (!proxyAttempted && bg.url.startsWith('http') && !bg.url.startsWith('blob:')) {
                            proxyAttempted = true;
                            if (isPrimary) showToastMsg('Phát hiện link Drive, đang vượt tường lửa (CORS) để tải video...', 'loading', 6000);
                            try {
                                const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(bg.url)}`;
                                const res = await fetch(proxyUrl);
                                if (!res.ok) throw new Error("Proxy error");
                                const blob = await res.blob();
                                v.src = URL.createObjectURL(blob);
                                v.load();
                                if (isPrimary && v === bgVideoRefs.current[bg.id]?.elementA) v.play().catch(e=>console.log(e));
                                if (isPrimary) showToastMsg('Kết nối video thành công!', 'success');
                            } catch (err) {
                                console.error("Proxy fetch failed:", err);
                                if (isPrimary) showToastMsg('Google Drive từ chối. Hãy tải video về máy rồi dùng nút [Tải Ảnh/Video] thay vì dùng link.', 'error', 8000);
                            }
                        }
                    };
                };
                attachProxyHandler(vA, true);
                attachProxyHandler(vB, false);
                // --- KẾT THÚC VÁ LỖI GOOGLE DRIVE ---

                vA.play().catch(e => console.log("Bg Video Autoplay Prevented", e));
                
                // Lưu cả 2 bản sao vào Refs. activeKey quyết định video nào đang làm chủ.
                bgVideoRefs.current[bg.id] = { 
                    elementA: vA, 
                    elementB: vB, 
                    activeKey: 'A', 
                    isLoaded: false, 
                    duration: 0 
                };
            }
            
            // Đồng bộ âm lượng và trạng thái tắt tiếng cho CẢ 2 BẢN SAO
            const vObj = bgVideoRefs.current[bg.id];
            if (vObj && vObj.elementA && vObj.elementB) {
                vObj.elementA.muted = true;
                vObj.elementA.volume = bg.volume !== undefined ? bg.volume : 1;
                vObj.elementB.muted = true;
                vObj.elementB.volume = bg.volume !== undefined ? bg.volume : 1;
            }
        }
    });
  }, [customBgs, isExportingVideo]);

  // Pre-process Image Backgrounds khi có thay đổi
  useEffect(() => {
    let isMounted = true;
    const processImages = async () => {
      // Xử lý Lớp Nền (Chỉ dành cho Ảnh, Video xử lý trực tiếp khi Render)
      for (const bg of customBgs) {
        if (bg.type === 'image' && (!processedBgsRef.current[bg.id] || processedBgsRef.current[bg.id].hash !== `${bg.url}_${bg.chromaType}_${bg.chromaColor}_${bg.tolerance}`)) {
          try {
            const img = await loadExternalImage(bg.url);
            if (!isMounted) return;
            const processedCanvas = applyChromaKey(img, bg.chromaType, bg.chromaColor, bg.tolerance);
            processedBgsRef.current[bg.id] = {
               element: processedCanvas,
               hash: `${bg.url}_${bg.chromaType}_${bg.chromaColor}_${bg.tolerance}`
            };
          } catch(e) { console.error("Không thể load Bg Ảnh", e); }
        }
      }
      
      // Xử lý Logo Chroma Key
      if (logoData) {
          try {
             if (!logoImgRef.current || logoImgRef.current.src !== logoData) {
                 logoImgRef.current = await loadExternalImage(logoData);
             }
             if (!isMounted) return;
             processedLogoRef.current = applyChromaKey(logoImgRef.current, logoSettings.chromaType, logoSettings.chromaColor, logoSettings.tolerance);
          } catch(e) { console.error("Không thể load Logo", e); }
      } else {
          processedLogoRef.current = null;
          logoImgRef.current = null;
      }

      if (isMounted) setBgUpdateTrigger(prev => prev + 1);
    };
    processImages();
    return () => { isMounted = false; };
  }, [customBgs, logoData, logoSettings]);
  
  const [emotion, setEmotion] = useState('calm'); 
  const [mouthOpen, setMouthOpen] = useState(0); 
  const [mouthWidth, setMouthWidth] = useState(0); 
  const [browLift, setBrowLift] = useState(0); 
  const [eyeSquint, setEyeSquint] = useState(0); 

  const handleUploadBgm = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (bgmAudioData?.url && !bgmAudioData.isPreset) URL.revokeObjectURL(bgmAudioData.url);
      const url = URL.createObjectURL(file);
      setBgmAudioData({ file, url, name: file.name });
    }
  };

  const removeBgm = () => {
    if (bgmAudioData?.url && !bgmAudioData.isPreset) URL.revokeObjectURL(bgmAudioData.url);
    setBgmAudioData(null);
    if (bgmFileInputRef.current) bgmFileInputRef.current.value = '';
  };

  const handleUploadLogo = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoData(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoData(null);
    if (logoImgRef.current) logoImgRef.current = null;
    if (logoFileInputRef.current) logoFileInputRef.current.value = '';
  };

  // --- Nâng cấp Web Audio BGM Generator (30s) ---
  const handleGenerateAiBgm = async () => {
    if (!aiBgmPrompt.trim() || isGeneratingBgm) return;
    setIsGeneratingBgm(true);

    await new Promise(resolve => setTimeout(resolve, 500)); // UI delay

    try {
      const AudioContextClass = window.OfflineAudioContext || window.webkitOfflineAudioContext;
      const sampleRate = 44100;
      const duration = 30; // Nâng lên 30 giây
      const offlineCtx = new AudioContextClass(2, sampleRate * duration, sampleRate);

      const isWater = aiBgmPrompt.toLowerCase().includes('nước') || aiBgmPrompt.toLowerCase().includes('mưa');
      const isWind = aiBgmPrompt.toLowerCase().includes('gió');
      const isBell = aiBgmPrompt.toLowerCase().includes('chuông');

      // 1. Meditation Drone (Base)
      const osc1 = offlineCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.value = 136.1; // Tần số Om
      
      const osc2 = offlineCtx.createOscillator();
      osc2.type = 'triangle';
      osc2.frequency.value = 139.1;

      const osc3 = offlineCtx.createOscillator();
      osc3.type = 'sine';
      osc3.frequency.value = 68.05; // Sub bass

      const droneGain = offlineCtx.createGain();
      droneGain.gain.value = 0.15;

      const lfo = offlineCtx.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.05; 
      const lfoGain = offlineCtx.createGain();
      lfoGain.gain.value = 0.1;
      lfo.connect(lfoGain);
      lfoGain.connect(droneGain.gain);

      const filter = offlineCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 400;

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(offlineCtx.destination);

      osc1.start(); osc2.start(); osc3.start(); lfo.start();

      // 2. Tự động mix thêm âm thanh dựa vào Prompt
      if (isWater || isWind) {
        const bufferSize = sampleRate * duration;
        const noiseBuffer = offlineCtx.createBuffer(1, bufferSize, sampleRate);
        const output = noiseBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            output[i] = Math.random() * 2 - 1;
        }
        const whiteNoise = offlineCtx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        
        const noiseFilter = offlineCtx.createBiquadFilter();
        noiseFilter.type = isWind ? 'bandpass' : 'lowpass';
        noiseFilter.frequency.value = isWind ? 400 : 800;
        
        const noiseGain = offlineCtx.createGain();
        noiseGain.gain.value = isWind ? 0.05 : 0.03;

        // Nếu là gió, thêm LFO vào filter frequency để tạo tiếng gió thổi vù vù
        if (isWind) {
            const windLfo = offlineCtx.createOscillator();
            windLfo.type = 'sine';
            windLfo.frequency.value = 0.2;
            const windLfoGain = offlineCtx.createGain();
            windLfoGain.gain.value = 300;
            windLfo.connect(windLfoGain);
            windLfoGain.connect(noiseFilter.frequency);
            windLfo.start();
        }

        whiteNoise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(offlineCtx.destination);
        whiteNoise.start();
      }

      if (isBell || !isWater && !isWind) { // Random bell nếu không có từ khóa đặc biệt
          const strikeBell = (time) => {
             const bellOsc = offlineCtx.createOscillator();
             bellOsc.type = 'sine';
             bellOsc.frequency.setValueAtTime(440, time);
             
             const bellGain = offlineCtx.createGain();
             bellGain.gain.setValueAtTime(0, time);
             bellGain.gain.linearRampToValueAtTime(0.3, time + 0.05);
             bellGain.gain.exponentialRampToValueAtTime(0.001, time + 6);

             bellOsc.connect(bellGain);
             bellGain.connect(offlineCtx.destination);
             bellOsc.start(time);
             bellOsc.stop(time + 6);
          };
          // Gõ chuông ngẫu nhiên vài lần trong 30s
          strikeBell(2);
          strikeBell(14);
          strikeBell(25);
      }

      const renderedBuffer = await offlineCtx.startRendering();
      const wavBlob = audioBufferToWav(renderedBuffer);
      const url = URL.createObjectURL(wavBlob);

      if (tempAiBgmData?.url) URL.revokeObjectURL(tempAiBgmData.url);
      setTempAiBgmData({ file: wavBlob, url, name: `Nhạc AI (${aiBgmPrompt.substring(0, 10)}...).wav` });
    } catch(e) {
      console.error("Lỗi tạo nhạc AI", e);
      showToastMsg('Trình duyệt không hỗ trợ tạo nhạc thời lượng dài.', 'error');
    } finally {
      setIsGeneratingBgm(false);
    }
  };

  const handleUploadBg = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isVideo = file.type.startsWith('video/');
      const url = URL.createObjectURL(file);
      
      const newBg = {
          id: Date.now(),
          type: isVideo ? 'video' : 'image',
          url: url,
          x: 0, y: 0, s: 1, flip: false,
          chromaType: 'none', chromaColor: '#000000', tolerance: 50,
          visible: true,
          muted: isVideo ? false : true, // TÂM AN FIX: Bật âm thanh mặc định cho Video tải lên
          volume: isVideo ? 0.15 : 1, // TÂM AN FIX: Đặt âm lượng 15% mặc định
          loopMode: 'normal' 
      };
      setCustomBgs(prev => [...prev, newBg]);
      setActiveBgId(newBg.id);
    }
    e.target.value = '';
  };

  const handleUpdateBg = (id, field, value) => {
      setCustomBgs(prev => prev.map(bg => bg.id === id ? { ...bg, [field]: value } : bg));
  };

  const handleDeleteCustomBg = (id, e) => {
      e.stopPropagation();
      const bgToRemove = customBgs.find(b => b.id === id);
      
      // Dọn dẹp memory an toàn: Chỉ xóa blob nếu Preset không xài và không có layer khác copy chung
      if (bgToRemove && bgToRemove.url?.startsWith('blob:')) {
          const isUsedInPresets = presetBackgrounds.some(p => p.url === bgToRemove.url);
          const isUsedInOtherLayers = customBgs.some(bg => bg.id !== id && bg.url === bgToRemove.url);
          
          if (!isUsedInPresets && !isUsedInOtherLayers) {
              URL.revokeObjectURL(bgToRemove.url);
          }
      }
      
      setCustomBgs(prev => prev.filter(bg => bg.id !== id));
      if (activeBgId === id) setActiveBgId(null);
      delete processedBgsRef.current[id];
  };

  const handleGenerateAiBg = async () => {
    if (!aiBgPrompt.trim() || isGeneratingBg) return;
    setIsGeneratingBg(true);
    try {
      const fullPrompt = `Cảnh nền thiền định tĩnh lặng, phong cách nghệ thuật tâm linh, ${aiBgPrompt.trim()}, chất lượng siêu nét, phong cảnh mờ ảo, không có người`;
      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instances: { prompt: fullPrompt },
          parameters: { sampleCount: 1 }
        })
      });
      if (data?.predictions?.[0]?.bytesBase64Encoded) {
        const url = `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`;
        const newBg = {
            id: Date.now(),
            url: url,
            x: 0, y: 0, s: 1, flip: false,
            chromaType: 'none', chromaColor: '#000000', tolerance: 50,
            visible: true
        };
        setCustomBgs(prev => [...prev, newBg]);
        setActiveBgId(newBg.id);
        setAiBgPrompt('');
      } else {
        showToastMsg('AI không trả về kết quả ảnh. Xin thử lại.', 'error');
      }
    } catch (e) {
      console.error("Lỗi tạo nền AI", e);
      showToastMsg('Không thể kết nối để tạo ảnh AI lúc này.', 'error');
    } finally {
      setIsGeneratingBg(false);
    }
  };

  const showToastMsg = (message, type = 'info', duration = 3000) => {
    setToast({ show: true, message, type });
    if (duration > 0) {
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), duration);
    }
  };

  const handleCreateSession = async () => {
    const title = `Cuộc đàm đạo ${sessions.length + 1}`;
    const res = await createChatSessionAction(undefined, title);
    if (res.success && res.data) {
      const newSession = {
        id: res.data.id,
        title: res.data.title,
        isPinned: false,
        messages: []
      };
      setSessions([newSession, ...sessions]);
      setCurrentSessionId(res.data.id);
      setShowSessions(false);
    }
  };

  // --- Parse Kịch Bản Thủ Công ---
  const handleImportScript = () => {
      if (!scriptText.trim()) return;
      const lines = scriptText.split('\n');
      const newMsgs = [];
      let currentRole = 'ai';

      lines.forEach(line => {
         const text = line.trim();
         if (!text) return;

         let role = null;
         let cleanText = text;

         // Sử dụng Regex để bắt cả những trường hợp có chú thích hành động, VD: "Con (khóc):"
         if (/^(con|người hỏi|hỏi)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:/i.test(text)) {
            role = 'user';
            cleanText = text.replace(/^(con|người hỏi|hỏi)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:\s*/i, '').trim();
            currentRole = 'user';
         } else if (/^(lão|đáp|ai)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:/i.test(text)) {
            role = 'ai';
            cleanText = text.replace(/^(lão|đáp|ai)(?:\s*\[.*?\]|\s*\(.*?\))?\s*:\s*/i, '').trim();
            currentRole = 'ai';
         } else {
            role = currentRole;
            cleanText = text;
         }

         if (role && cleanText) {
             // Nối tiếp dòng nhưng BẢO TOÀN DẤU XUỐNG DÒNG
             if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                 newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
             } else {
                 newMsgs.push({
                     id: Date.now() + Math.random(),
                     role,
                     text: cleanText,
                     timestamp: new Date(),
                     audioUrl: null,
                     reactions: {}
                 });
             }
         }
      });

      if (newMsgs.length > 0) {
          if (importMode === 'append') {
              updateCurrentMessages(prev => [...prev, ...newMsgs]);
              showToastMsg('Đã nhập kịch bản và nối tiếp thành công!', 'success', 5000);
          } else {
              const newSessionId = Date.now();
              const newSession = {
                  id: newSessionId,
                  title: `Kịch bản ${new Date().toLocaleTimeString().slice(0, 5)}`,
                  isPinned: false,
                  messages: newMsgs
              };
              setSessions([newSession, ...sessions]);
              setCurrentSessionId(newSessionId);
              showToastMsg('Đã tạo đàm đạo mới từ kịch bản!', 'success', 5000);
          }
          setShowScriptModal(false);
          setScriptText('');
          setTimeout(() => setShowHistory(true), 500); // Tự động mở menu lịch sử để gợi ý
      }
  };

  // --- Tạo Kịch Bản Tự Động Bằng AI Theo Chủ Đề ---
  const handleGenerateAITopic = async () => {
      if (!aiTopicText.trim()) return;
      setIsGeneratingAITopic(true);
      try {
        // TÂM AN FIX: Ép AI xuống dòng từng câu kệ
        const quoteRule = appLanguage === 'Tiếng Việt' 
            ? '- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho dữ liệu. Giữ nguyên văn. BẮT BUỘC: Mỗi câu kệ phải nằm trên một dòng riêng biệt (Enter xuống dòng). Trước khi trích dẫn, bắt buộc nói: "Sư Cha Tam Vô đã khai thị như sau:".'
            : `- Tắt hoàn toàn chức năng tự làm thơ. Chọn đúng 4 câu kệ (không kèm ngày tháng) phù hợp nhất từ kho. BẮT BUỘC DỊCH 4 câu kệ đó sang ${appLanguage}. MANDATORY: Each line of the poem MUST be separated by a new line (Enter). Trước khi trích dẫn, nói câu (bằng ${appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;

        // TÂM AN FIX: Ép buộc độ dài kịch bản tuyệt đối cho Đạo diễn AI
        const lengthInstruction = `
        YÊU CẦU ÉP BUỘC VỀ SỐ LƯỢNG LƯỢT THOẠI (RẤT QUAN TRỌNG):
        - Kịch bản BẮT BUỘC phải kéo dài ${aiScriptLength} (Mỗi lần một người cất tiếng nói được tính là 1 câu/lượt).
        - Nếu yêu cầu kịch bản dài (10-21 câu), bạn PHẢI để nhân vật Người hỏi phản biện, thắc mắc, vòng vo nhiều lần, Minh Sư giải thích từ từ, đào sâu từng lớp vấn đề.
        - TUYỆT ĐỐI KHÔNG cho nhân vật ngộ đạo quá nhanh ở câu thứ 3 hay thứ 4. Phải duy trì cuộc trò chuyện hỏi - đáp liên tục đạt đúng số lượng câu đã yêu cầu mới được kết thúc. Bắt buộc đếm số lượt thoại trước khi trả về kết quả!`;

        const prompt = `Viết một kịch bản đàm đạo tâm linh sâu sắc giữa hai nhân vật.
        
        NGÔN NGỮ KỊCH BẢN BẮT BUỘC: ${appLanguage}

        THÔNG TIN VÀ QUY TẮC XƯNG HÔ (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT 100%):
        
        1. Nhân vật Minh Sư (Người đáp):
        - Tên hiển thị kịch bản: ${customLaoName || 'Lão'}
        - Phong cách lời dạy: ${aiLaoStyle}
        - Khi nói chuyện, bắt buộc tự xưng mình là: "${laoSelfCall}"
        - Khi gọi/nhắc đến đối phương, bắt buộc dùng từ: "${laoCallUser}"

        2. Nhân vật Phàm Trần (Người hỏi):
        - Tên hiển thị kịch bản: ${customUserName || 'Con'} (Giới tính: ${userGender}, ${userAge} tuổi)
        - Khi nói chuyện, bắt buộc tự xưng mình là: "${userSelfCall}"
        - Khi gọi/nhắc đến Minh Sư, bắt buộc dùng từ: "${userCallLao}"

        LƯU Ý XƯNG HÔ: Tuyệt đối không xưng hô lộn xộn. Nếu quy định Người hỏi tự xưng "Em" gọi Minh sư "Anh", thì kịch bản phải ghi "Anh ơi, em đang buồn...". Nếu Minh sư xưng "Đu" gọi người hỏi "Hào", thì ghi "Hào ơi, Đu nói cho nghe...".

        - Chủ đề vướng mắc của Người hỏi: "${aiTopicText}"
        ${lengthInstruction}

        QUY TẮC CỐT LÕI VỀ DIỄN BIẾN (BẮT BUỘC TUÂN THỦ NGHIÊM NGẶT):
        1. Mở đầu (Intro-Hook BẮT BUỘC): Lượt thoại ĐẦU TIÊN của kịch bản PHẢI LÀ CỦA LÃO. Đây là một câu mào đầu mang tính châm biếm, hài hước, mỉa mai nhẹ nhàng để đánh trúng tim đen và dẫn dắt người xem vào chủ đề. (Ví dụ chủ đề 'Cúng sao giải hạn' thì Lão nói: 'Mới nghe thầy bói hù vài câu, tính đem tiền đi cúng sao giải hạn hả? Vào đây, Lão giải các tâm cho bớt hạn hẹp đi nè!'). Bắt buộc dùng thẻ [hook] ngay sau tên Lão ở câu này.
        2. Mê lầm: Tiếp theo, ${customUserName || 'Con'} mang theo nỗi khổ, vô minh, dính mắc vào mộng ảo của đời thường (Tuân theo quỹ đạo cảm xúc: ${aiUserEmotionArc}).
        3. Phá mê: ${customLaoName || 'Lão'} dùng lời đốn giáo, chỉ ra sự giả tạm của mọi hiện tượng.
        4. Tỉnh mộng & Tìm cầu: ${customUserName || 'Con'} hết mê, nhận ra thế gian là ảo ảnh. Bắt đầu thao thức tìm lại Bản lai diện mục.
        5. Khai ngộ & Hạnh phúc: ${customLaoName || 'Lão'} chỉ thẳng vào chân tâm. ${customUserName || 'Con'} bừng ngộ, cảm xúc vỡ òa.
        6. Tán thán & Khuyến tấn: Khi ${customUserName || 'Con'} đã ngộ đạo, ${customLaoName || 'Lão'} BẮT BUỘC phải nói "Lành thay, lành thay" (hoặc dịch ra ${appLanguage}). Sau đó, ${customLaoName || 'Lão'} ĐẶT MỘT CÂU HỎI TỰ VẤN sâu sắc.

        Quy tắc định dạng văn bản:
        - Định dạng kịch bản trả về BẮT BUỘC phải bắt đầu bằng tiền tố "${customUserName || 'Con'}:" và "${customLaoName || 'Lão'}:" ở mỗi dòng.
        - CHÈN THẺ CẢM XÚC: Phân tích nội tâm nhân vật ở câu đó và chèn 1 trong 4 thẻ: [hook] (Châm biếm mào đầu - CHỈ DÙNG CHO CÂU ĐẦU CỦA LÃO), [calm] (Bình thường), [sad] (Buồn bã), [joy] (Vui vẻ) ngay sau tên. Ví dụ: "${customLaoName || 'Lão'} [hook]: ..." BẮT BUỘC CÓ.
        - KHÔNG ĐƯỢC viết HOA toàn bộ từ. Thay dấu gạch chéo "/" bằng dấu phẩy ",".
        ${quoteRule}
        - Định dạng text trả về bắt buộc phải đúng form sau:
        ${customLaoName || 'Lão'} [hook]: [Lời thoại mào đầu]
        ${customUserName || 'Con'} [cảm_xúc]: [Lời thoại]
        ${customLaoName || 'Lão'} [cảm_xúc]: [Lời thoại]
        
        KHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:
        ${poemDatabase.map(p => `Tên bài: ${p.title}\n` + p.stanzas.map(s => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n')}`;


        const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });

        const rawResult = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!rawResult) throw new Error("AI không trả về kết quả");

        const lines = rawResult.split('\n');
        const newMsgs = [];
        let currentRole = null;
        let currentEmotion = 'calm';
        
        // TÂM AN FIX: Regex động dựa trên tên nhân vật tùy chỉnh
        const escapeRegExp = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const laoNameSafe = escapeRegExp(customLaoName || 'Lão');
        const userNameSafe = escapeRegExp(customUserName || 'Con');
        
        lines.forEach(line => {
           let text = line.replace(/\*\*/g, '').trim(); // Xóa dấu in đậm nếu AI vô tình cho vào
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
              role = currentRole;
              cleanText = text;
           }

           if (!['calm', 'sad', 'joy', 'hook'].includes(currentEmotion)) currentEmotion = 'calm';

           if (role && cleanText) {
               // Ghộp thoại cùng nhân vật nhưng BẢO TOÀN XUỐNG DÒNG (\n)
               if (newMsgs.length > 0 && newMsgs[newMsgs.length - 1].role === role) {
                   newMsgs[newMsgs.length - 1].text += '\n' + cleanText;
               } else {
                   newMsgs.push({
                       id: Date.now() + Math.random(),
                       role,
                       text: cleanText,
                       emotion: currentEmotion,
                       timestamp: new Date(),
                       audioUrl: null,
                       reactions: {}
                   });
               }
           }
        });

        if (newMsgs.length > 0) {
            const newSessionId = Date.now();
            const newSession = {
                id: newSessionId,
                title: `CĐ: ${aiTopicText.substring(0, 20)}...`,
                isPinned: false,
                messages: newMsgs
            };
            // Tạo hẳn một phiên đàm đạo mới riêng biệt cho chủ đề này
            setSessions([newSession, ...sessions]);
            setCurrentSessionId(newSessionId);
            setShowAITopicModal(false);
            setAiTopicText('');
            showToastMsg('Kịch bản AI đã sẵn sàng! Hãy mở "Pháp bảo khai thị" để tạo âm thanh cho toàn bộ cuộc trò chuyện.', 'success', 6000);
            setTimeout(() => setShowHistory(true), 500); // Tự động mở menu bên phải
        } else {
            showToastMsg('AI tạo sai định dạng, vui lòng thử lại.', 'error');
        }

      } catch (e) {
        console.error("Lỗi tạo chủ đề AI:", e);
        showToastMsg('Mạch khí gián đoạn, không thể nhờ AI tạo kịch bản lúc này.', 'error');
      } finally {
        setIsGeneratingAITopic(false);
      }
  };

  const handleGenerateScriptVoices = async () => {
      if (isRegeneratingAll) return;
      setIsRegeneratingAll(true);
      setRegenerationProgress(0);
      setRegenerationComplete(false);

      try {
        // Chỉ lọc ra những tin nhắn CHƯA có âm thanh của CẢ Lão và Con
        const missingVoices = messages.filter(m => !m.audioUrl);
        const total = missingVoices.length;
        if (total === 0) {
            showToastMsg('Tất cả hội thoại đã có sẵn âm thanh.', 'success');
            setIsRegeneratingAll(false);
            return;
        }
        
        let processedCount = 0;
        
        for (let i = 0; i < total; i++) {
          const msg = missingVoices[i];
          let success = false;
          let retries = 0;

          // Cơ chế tự động thử lại nếu API bị nghẽn (tối đa 3 lần)
          while (!success && retries < 3) {
             success = await generateVoice(msg.id, msg.text, msg.role, currentSessionId, false);
             if (!success) {
                 retries++;
                 await new Promise(resolve => setTimeout(resolve, 2500)); // Nghỉ 2.5s rồi thử lại
             }
          }
          
          processedCount++;
          setRegenerationProgress(Math.round((processedCount / total) * 100));
          await new Promise(resolve => setTimeout(resolve, 1500)); // Delay an toàn giữa các tin nhắn
        }
        
        setRegenerationComplete(true);
        setTimeout(() => setRegenerationComplete(false), 4000);
      } catch (error) {
        console.error("Lỗi khi tạo giọng hàng loạt", error);
      } finally {
        setIsRegeneratingAll(false);
      }
  };

  const saveSessionTitle = async (id) => {
    if(editSessionTitle.trim() !== '') {
      const res = await updateChatSessionTitleAction(id, editSessionTitle);
      if (res.success) {
        setSessions(prev => prev.map(s => s.id === id ? { ...s, title: editSessionTitle } : s));
      }
    }
    setEditingSessionId(null);
  };

  const togglePin = (id) => {
    setSessions(prev => prev.map(s => s.id === id ? { ...s, isPinned: !s.isPinned } : s));
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    const res = await deleteChatSessionAction(id);
    if (res.success) {
      const newSessions = sessions.filter(s => s.id !== id);
      if (newSessions.length === 0) {
        const createRes = await createChatSessionAction(undefined, 'Cuộc đàm đạo mới');
        if (createRes.success && createRes.data) {
          const newSession = {
            id: createRes.data.id,
            title: createRes.data.title,
            isPinned: false,
            messages: []
          };
          setSessions([newSession]);
          setCurrentSessionId(createRes.data.id);
        }
      } else {
        setSessions(newSessions);
        if (currentSessionId === id) setCurrentSessionId(newSessions[0].id);
      }
    }
  };

  const toggleCamera = async () => {
    if (!cameraOn) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (videoRef.current) videoRef.current.srcObject = stream;
        setCameraOn(true);
      } catch (err) { console.error("Camera error:", err); }
    } else {
      if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      setCameraOn(false);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveEdit = (id) => {
    updateCurrentMessages(prev => prev.map(m => m.id === id ? { ...m, text: tempEditText, audioUrl: null } : m));
    setEditingId(null); setTempEditText('');
  };

  const toggleReaction = (id, type) => {
    updateCurrentMessages(prev => prev.map(m => m.id === id ? { ...m, reactions: { ...m.reactions, [type]: !m.reactions?.[type] } } : m));
  };

  const shareCombinedAudioFile = async () => {
    setIsPreparingGlobal(true);
    const url = await getCombinedAudioUrl();
    setIsPreparingGlobal(false);
    if (url) {
      const blob = await fetch(url).then(r => r.blob());
      const file = new File([blob], `Khai_thi_${currentSession.title}.wav`, { type: 'audio/wav' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: `Hội thoại cùng Lão - ${currentSession.title}`,
            files: [file]
          });
        } catch (e) { 
          if (e.name !== 'AbortError' && !e.message?.includes('canceled')) {
            console.error("Share failed", e); 
            showToastMsg('Môi trường chặn chia sẻ trực tiếp. Đang tự động tải về...', 'info', 3000);
            downloadAudio(url, `Khai_thi_Toan_bo_${currentSession.title}`);
          }
        }
      } else {
        showToastMsg('Không hỗ trợ chia sẻ trực tiếp. Đang tự động tải về...', 'info', 3000);
        downloadAudio(url, `Khai_thi_Toan_bo_${currentSession.title}`);
      }
    }
    setShowShareMenu(false);
  };

  const startLipSync = (audioElement) => {
    try {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      if (!analyserRef.current) {
        analyserRef.current = ctx.createAnalyser();
        analyserRef.current.fftSize = 256;
        analyserRef.current.smoothingTimeConstant = 0.1; // Chỉnh thấp xuống để nhận diện từng âm tiết, không bị đơ há miệng
        analyserRef.current.connect(ctx.destination);
      }
      const analyser = analyserRef.current;

      if (!audioElement.sourceNode) {
        audioElement.sourceNode = ctx.createMediaElementSource(audioElement);
        audioElement.sourceNode.connect(analyser);
      }

      // TÂM AN FIX TRÀN RAM (Memory Leak): Khởi tạo mảng dữ liệu 1 LẦN DUY NHẤT ngoài vòng lặp
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const updateAnimation = () => {
        let shouldLipSync = true;
        if (audioElement === globalAudioRef.current) {
           const ct = audioElement.currentTime;
           const metadata = globalAudioMetadataRef.current;
           const segment = metadata.find(m => ct >= m.start && ct <= m.end);
           if (segment && segment.role === 'user') {
              shouldLipSync = false;
           }
        }

        if (shouldLipSync) {
          // TÂM AN FIX: Tái sử dụng mảng dataArray đã tạo, thay vì tạo mới liên tục làm phình RAM
          analyser.getByteFrequencyData(dataArray);
          
          let speechEnergy = 0;
          // Tập trung vào dải tần số chứa âm lượng giọng nói để bắt nhịp nhả chữ
          for (let i = 2; i < 15; i++) speechEnergy += dataArray[i];
          let speechAvg = speechEnergy / 13;

          // Cắt bỏ nhiễu nền và khuếch đại mạnh để miệng đóng/mở dứt khoát
          const noiseFloor = 15;
          let activeEnergy = Math.max(0, speechAvg - noiseFloor);
          
          let targetMouthOpen = (activeEnergy / 80) * 20; 

          // Phát hiện phụ âm để mở rộng khẩu hình ngang
          let highEnergy = 0;
          for (let i = 30; i < 70; i++) highEnergy += dataArray[i];
          let highAvg = highEnergy / 40;

          setMouthOpen(Math.min(Math.max(targetMouthOpen, 0), 20)); 
          setMouthWidth(Math.min(Math.max(highAvg / 10, 0), 6));
          setBrowLift(Math.min(Math.max(activeEnergy / 20, 0), 4)); 
          setEyeSquint(Math.min(Math.max(activeEnergy / 30, 0), 2));
        } else {
          setMouthOpen(0); setMouthWidth(0); setBrowLift(0); setEyeSquint(0);
        }
        
        // --- TÂM AN LÕI MỚI: ĐỒNG BỘ PHỤ ĐỀ LIVESTREAM TỐC ĐỘ CAO (60FPS) VÀ CHỐNG KẸT FRAME ---
        if (isLiveModeRef.current && liveShowSubtitlesRef.current && liveSubtitlesMetaRef.current) {
            let currentPct = 0;
            // Kiểm tra an toàn để tránh chia cho Infinity lúc File Audio vừa nạp
            if (audioElement.duration && !isNaN(audioElement.duration) && audioElement.duration !== Infinity) {
                currentPct = audioElement.currentTime / audioElement.duration;
            }
            
            const meta = liveSubtitlesMetaRef.current;
            let activeText = meta[meta.length - 1]?.text || ''; // Mặc định ở câu cuối cùng
            
            for (let i = 0; i < meta.length; i++) {
                if (currentPct >= meta[i].startPct && currentPct <= meta[i].endPct) {
                    activeText = meta[i].text;
                    break;
                }
            }
            
            // Chỉ can thiệp DOM khi câu nói THỰC SỰ chuyển sang câu mới (Giảm tải CPU tuyệt đối)
            if (currentLiveSubTextRef.current !== activeText) {
                currentLiveSubTextRef.current = activeText;
                const subEl = document.getElementById('live-subtitle-text');
                if (subEl) subEl.innerText = activeText;
            }
        }

        animationFrameRef.current = requestAnimationFrame(updateAnimation);
      };
      updateAnimation();
    } catch (e) {
      console.error("Lip sync failed to start", e);
    }
  };

  const stopLipSync = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setMouthOpen(0); setMouthWidth(0); setBrowLift(0); setEyeSquint(0);
    
    // Tự động dọn dẹp phụ đề khi audio dừng
    if (!isPlayingQueueRef.current && currentlyPlayingId === null) {
        currentLiveSubTextRef.current = '';
        const subEl = document.getElementById('live-subtitle-text');
        if (subEl) subEl.innerText = '';
    }
  };

  const pcmToWav = (base64Data, sampleRate) => {
    if (!base64Data) return null;
    try {
      const decoded = atob(base64Data);
      if (decoded.length < 4) return null; // Bỏ qua dữ liệu rỗng hoặc không hợp lệ
      const buffer = Uint8Array.from(decoded, c => c.charCodeAt(0)).buffer;
      const wavHeader = new ArrayBuffer(44);
      const view = new DataView(wavHeader);
      const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
      };
      writeString(0, 'RIFF'); view.setUint32(4, 32 + buffer.byteLength, true);
      writeString(8, 'WAVE'); writeString(12, 'fmt ');
      view.setUint32(16, 16, true); view.setUint16(20, 1, true);
      view.setUint16(22, 1, true); view.setUint32(24, sampleRate, true);
      view.setUint32(28, sampleRate * 2, true); view.setUint16(32, 2, true);
      view.setUint16(34, 16, true); writeString(36, 'data');
      view.setUint32(40, buffer.byteLength, true);
      return new Blob([wavHeader, buffer], { type: 'audio/wav' });
    } catch (e) {
      console.error("Lỗi biên dịch âm thanh:", e);
      return null;
    }
  };

  const combineWavs = async (items) => {
    const buffers = await Promise.all(items.map(item => fetch(item.url).then(r => r.arrayBuffer()).catch(() => new ArrayBuffer(0))));
    if (buffers.length === 0) return { blob: null, metadata: [] };
    
    let totalDataLen = 0;
    for (let i = 0; i < buffers.length; i++) {
      totalDataLen += Math.max(0, buffers[i].byteLength - 44);
    }
    
    if (totalDataLen === 0) return { blob: null, metadata: [] };

    const validFirstBuffer = buffers.find(b => b.byteLength >= 44);
    if (!validFirstBuffer) return { blob: null, metadata: [] };

    const combined = new Uint8Array(44 + totalDataLen);
    combined.set(new Uint8Array(validFirstBuffer.slice(0, 44)), 0);
    
    const view = new DataView(combined.buffer);
    view.setUint32(4, 36 + totalDataLen, true);
    view.setUint32(40, totalDataLen, true);
    
    let offset = 44;
    let timeOffset = 0;
    const metadata = [];
    const SAMPLE_RATE = 24000;
    const BYTES_PER_SAMPLE = 2;
    
    for (let i = 0; i < buffers.length; i++) {
      const dataLen = Math.max(0, buffers[i].byteLength - 44);
      if (dataLen > 0) {
          combined.set(new Uint8Array(buffers[i].slice(44)), offset);
          offset += dataLen;
          
          const durationSec = dataLen / (SAMPLE_RATE * BYTES_PER_SAMPLE);
          // TÂM AN FIX: Đưa thêm Emotion và msgId vào Metadata Timeline để máy quay biết cảm xúc và định danh chính xác đoạn thoại
          metadata.push({ role: items[i].role, text: items[i].text, emotion: items[i].emotion || 'calm', msgId: items[i].msgId, start: timeOffset, end: timeOffset + durationSec });
          timeOffset += durationSec;
      }
    }
    
    return { blob: new Blob([combined.buffer], { type: 'audio/wav' }), metadata };
  };

  const getCombinedAudioUrl = async () => {
    // TÂM AN FIX: Vượt qua Stale Closure bằng cách dùng Ref truy xuất dữ liệu nóng
    const targetSession = latestSessionsRef.current.find(s => s.id === currentSessionIdRef.current) || latestSessionsRef.current[0];
    const currentMsgs = targetSession?.messages || [];
    
    const messagesWithAudio = currentMsgs.filter(m => m.audioUrl);
    if (messagesWithAudio.length === 0) {
        globalAudioMetadataRef.current = [];
        return null;
    }

    if (globalAudioUrlRef.current && globalMessageCountRef.current === messagesWithAudio.length) {
      return globalAudioUrlRef.current;
    }

    // TÂM AN FIX: Truyền cả Emotion và msgId vào items
    const items = messagesWithAudio.map(m => ({ url: m.audioUrl, role: m.role, text: m.text, emotion: m.emotion || 'calm', msgId: m.id }));
    const { blob, metadata } = await combineWavs(items);
    if (!blob) return null;

    const url = URL.createObjectURL(blob);
    globalAudioUrlRef.current = url;
    globalAudioMetadataRef.current = metadata;
    globalMessageCountRef.current = messagesWithAudio.length;
    return url;
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const toggleGlobalPlay = async () => {
    if (isGlobalPlaying) {
      globalAudioRef.current?.pause();
      setIsGlobalPlaying(false);
      stopLipSync();
    } else {
      setIsPreparingGlobal(true);
      const url = await getCombinedAudioUrl();
      setIsPreparingGlobal(false);
      if (!url) return;

      if (!globalAudioRef.current) {
        globalAudioRef.current = new Audio();
        globalAudioRef.current.crossOrigin = "anonymous";
        globalAudioRef.current.onloadedmetadata = () => {
          setGlobalDuration(globalAudioRef.current.duration);
        };
        globalAudioRef.current.ontimeupdate = () => {
          const ct = globalAudioRef.current.currentTime;
          const dur = globalAudioRef.current.duration || 1; 
          setGlobalCurrentTime(ct);
          setGlobalDuration(globalAudioRef.current.duration);
          const pct = (ct / dur) * 100;
          setGlobalProgress(pct || 0);
        };
        globalAudioRef.current.onended = () => {
          setIsGlobalPlaying(false);
          setGlobalProgress(0);
          setGlobalCurrentTime(0);
          stopLipSync();
        };
        globalAudioRef.current.onplay = () => {
          startLipSync(globalAudioRef.current);
        };
      }
      
      if (globalAudioRef.current.src !== url) {
        globalAudioRef.current.src = url;
      }
      
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
        setCurrentlyPlayingId(null);
      }

      globalAudioRef.current.play().catch(e => {
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted')) {
           console.error("Global play error", e);
        }
      });
      setIsGlobalPlaying(true);
    }
  };

  const handleGlobalSeek = (e) => {
    const pct = parseFloat(e.target.value);
    setGlobalProgress(pct);
    if (globalAudioRef.current && globalAudioRef.current.duration) {
      const newTime = (pct / 100) * globalAudioRef.current.duration;
      globalAudioRef.current.currentTime = newTime;
      setGlobalCurrentTime(newTime);
    }
  };

  const playNextInQueue = () => {
    if (audioQueueRef.current.length === 0) {
      isPlayingQueueRef.current = false;
      stopLipSync();
      setCurrentlyPlayingId(null);
      return;
    }

    const nextItem = audioQueueRef.current.shift();
    const nextAudioUrl = typeof nextItem === 'string' ? nextItem : nextItem?.url;
    const nextText = typeof nextItem === 'string' ? '' : nextItem?.text;

    // TÂM AN LÕI: Áp thẳng khối Text vào bộ chia tỷ lệ ngay khi Audio bắt đầu phát
    if (isLiveModeRef.current && liveShowSubtitlesRef.current) {
        buildLiveSubMeta(nextText);
    }
    
    let advanced = false;
    const advance = () => {
        if (!advanced) {
            advanced = true;
            setTimeout(playNextInQueue, 0); // Tiến lên câu tiếp theo an toàn
        }
    };

    if (!nextAudioUrl) {
        advance();
        return;
    }

    if (!activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    
    const audio = activeAudioRef.current;
    
    audio.onplay = () => { startLipSync(audio); };
    audio.onended = advance;
    audio.onerror = advance;

    audio.src = nextAudioUrl;
    audio.load(); // Bắt buộc tải ngay để kiểm tra nguồn
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => { 
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted') && !e.message?.includes('supported source')) {
           console.error("Lỗi phát Queue audio", e); 
        }
        advance(); // Bỏ qua đoạn lỗi, phát đoạn tiếp theo ngay lập tức
      });
    }
  };

  const playVoice = (audioUrl, id, role = 'ai', onEndCallback = null) => {
    if (!activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    const audio = activeAudioRef.current;

    audio.pause(); stopLipSync();
    if (currentlyPlayingId === id) { setCurrentlyPlayingId(null); return; }
    
    if (globalAudioRef.current && !globalAudioRef.current.paused) {
      globalAudioRef.current.pause();
      setIsGlobalPlaying(false);
    }

    audio.src = audioUrl;
    audio.load();
    setCurrentlyPlayingId(id);
    
    // TÂM AN LÕI: Lấy Text của đoạn hội thoại và gửi cho bộ máy vẽ Phụ Đề
    const pMsg = messages.find(m => m.id === id);
    if (isLiveModeRef.current && liveShowSubtitlesRef.current && pMsg && role === 'ai') {
        buildLiveSubMeta(pMsg.text);
    }

    const handleEnd = () => {
      stopLipSync(); 
      setCurrentlyPlayingId(null); 
      if (onEndCallback) onEndCallback();
    };

    audio.onplay = () => { if (role === 'ai') startLipSync(audio); };
    audio.onended = handleEnd;
    audio.onerror = handleEnd;
    
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => {
        if (e.name !== 'AbortError' && !e.message?.includes('interrupted') && !e.message?.includes('supported source')) {
           console.error("Audio playback blocked/error", e);
        }
        setCurrentlyPlayingId(null);
        if (onEndCallback) onEndCallback();
      });
    }
  };

  const copyToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text; document.body.appendChild(textArea);
    textArea.select(); 
    try { document.execCommand('copy'); } catch (e) { console.error("Copy failed"); }
    document.body.removeChild(textArea);
  };

  const downloadAudio = (url, filename) => {
    const link = document.createElement('a'); link.href = url;
    link.download = `${filename}.wav`; document.body.appendChild(link);
    link.click(); document.body.removeChild(link);
  };

  const downloadAllAudios = () => {
    messages.forEach((msg, index) => {
      if (msg.audioUrl) {
        setTimeout(() => { downloadAudio(msg.audioUrl, `${msg.role === 'ai' ? 'Lao_day' : 'Con_thua'}_${msg.id}`); }, index * 400);
      }
    });
    setShowDownloadMenu(false);
  };

  const downloadCombinedAudio = async () => {
    setIsPreparingGlobal(true);
    const url = await getCombinedAudioUrl();
    setIsPreparingGlobal(false);
    if (url) downloadAudio(url, `Khai_thi_Toan_bo_${currentSession.title}`);
    setShowDownloadMenu(false);
  };

  const shareTextContent = async () => {
    let content = `Lời khai thị từ Lão - ${currentSession.title}:\n\n`;
    messages.forEach(msg => { content += `${msg.role === 'user' ? "Con" : "Lão"}: ${msg.text}\n\n`; });
    if (navigator.share) {
      try { 
         await navigator.share({ title: `Hội thoại cùng Lão - ${currentSession.title}`, text: content }); 
      } catch (err) { 
         if (err.name !== 'AbortError' && !err.message?.includes('canceled')) { 
            copyToClipboard(content); 
            showToastMsg('Đã chép nội dung vào khay nhớ tạm.', 'success');
         } 
      }
    } else { 
       copyToClipboard(content); 
       showToastMsg('Đã chép nội dung vào khay nhớ tạm.', 'success');
    }
    setShowShareMenu(false);
  };

  // --- Nâng cấp tính năng Share Video MXH ---
  const handleShareVideoSocial = async () => {
      if (!renderedVideoBlob) return;
      const filename = `Khai_thi_Lao_${Date.now()}.${videoExt}`;
      const file = new File([renderedVideoBlob], filename, { type: renderedVideoBlob.type });
      
      const fallbackToDownload = () => {
          showToastMsg('Môi trường chặn chia sẻ trực tiếp. Đang tự động tải video về máy...', 'info', 4000);
          const link = document.createElement('a');
          link.href = renderedVideoUrl;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      };

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
              await navigator.share({
                  title: 'Đàm đạo cùng Lão',
                  text: 'Hãy xem đoạn video khai thị này.',
                  files: [file]
              });
          } catch (e) {
              if (e.name !== 'AbortError') {
                  console.error("Lỗi chia sẻ Video", e);
                  fallbackToDownload();
              }
          }
      } else {
          fallbackToDownload();
      }
  };

  const getCanvasHitTarget = (clientX, clientY, canvas) => {
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (clientX - rect.left) * scaleX;
    const mouseY = (clientY - rect.top) * scaleY;

    const { laoW, laoH, laoX, laoY, userW, userH, userX, userY, refWidth, refHeight } = calculatePositions(canvas.width, canvas.height);
    
    const finalLaoW = laoW * charOffsets.lao.s;
    const finalLaoH = laoH * charOffsets.lao.s;
    const finalLaoX = laoX + (refWidth * (charOffsets.lao.x / 100));
    const finalLaoY = laoY + (refHeight * (charOffsets.lao.y / 100));

    const finalUserW = userW * charOffsets.user.s;
    const finalUserH = userH * charOffsets.user.s;
    const finalUserX = userX + (refWidth * (charOffsets.user.x / 100));
    const finalUserY = userY + (refHeight * (charOffsets.user.y / 100));

    const subY_pixel = canvas.height * (subtitleYPos / 100);

    if (mouseY > subY_pixel - 80 && mouseY < subY_pixel + 80) return { type: 'sub' };
    if (mouseX > finalLaoX - finalLaoW/2 && mouseX < finalLaoX + finalLaoW/2 && mouseY > finalLaoY && mouseY < finalLaoY + finalLaoH) return { type: 'lao' };
    if (mouseX > finalUserX - finalUserW/2 && mouseX < finalUserX + finalUserW/2 && mouseY > finalUserY && mouseY < finalUserY + finalUserH) return { type: 'user' };
    
    if (exportTab === 'background' && activeBgId) return { type: 'bg', id: activeBgId };
    
    return null;
  };

  const handleCanvasPointerDown = (e) => {
    if (isExportingVideo || renderedVideoUrl) return;
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;
    
    const targetInfo = getCanvasHitTarget(clientX, clientY, exportCanvasRef.current);
    
    if (targetInfo) {
        dragInfo.current = {
            isDragging: true,
            target: targetInfo.type,
            bgId: targetInfo.id || null,
            startX: clientX,
            startY: clientY,
            initialX: targetInfo.type === 'lao' ? charOffsets.lao.x : targetInfo.type === 'user' ? charOffsets.user.x : targetInfo.type === 'bg' ? customBgs.find(b=>b.id===targetInfo.id)?.x || 0 : 0,
            initialY: targetInfo.type === 'sub' ? subtitleYPos : targetInfo.type === 'lao' ? charOffsets.lao.y : targetInfo.type === 'user' ? charOffsets.user.y : targetInfo.type === 'bg' ? customBgs.find(b=>b.id===targetInfo.id)?.y || 0 : 0,
            startOffsetsSnapshot: JSON.parse(JSON.stringify(charOffsets)) // Lưu trạng thái trước khi kéo
        };
        try { e.currentTarget.setPointerCapture(e.pointerId); } catch(err) {}
    }
  };

  const handleCanvasPointerMove = (e) => {
    const clientX = e.clientX || e.touches?.[0].clientX;
    const clientY = e.clientY || e.touches?.[0].clientY;

    if (!dragInfo.current.isDragging) {
        if (isExportingVideo || renderedVideoUrl) return;
        const hit = getCanvasHitTarget(clientX, clientY, exportCanvasRef.current);
        const hitString = JSON.stringify(hit);
        const hoverString = JSON.stringify(hoveredElement);
        if (hitString !== hoverString) {
            setHoveredElement(hit);
        }
        return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const deltaX_pct = ((clientX - dragInfo.current.startX) / rect.width) * 100;
    const deltaY_pct = ((clientY - dragInfo.current.startY) / rect.height) * 100;

    const { target, bgId, initialX, initialY } = dragInfo.current;

    if (target === 'sub') {
        setSubtitleYPos(Math.max(5, Math.min(95, initialY + deltaY_pct)));
    } else if (target === 'lao') {
        setCharOffsets(prev => ({...prev, lao: {...prev.lao, x: initialX + deltaX_pct, y: initialY + deltaY_pct}}));
    } else if (target === 'user') {
        setCharOffsets(prev => ({...prev, user: {...prev.user, x: initialX + deltaX_pct, y: initialY + deltaY_pct}}));
    } else if (target === 'bg' && bgId) {
        setCustomBgs(prev => prev.map(bg => bg.id === bgId ? { ...bg, x: initialX + deltaX_pct, y: initialY + deltaY_pct } : bg));
    }
  };

  const handleCanvasPointerLeave = (e) => {
    dragInfo.current.isDragging = false;
    setHoveredElement(null);
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleCanvasPointerUp = (e) => {
    if (dragInfo.current.isDragging) {
        // Lưu lịch sử khi kết thúc kéo thả nhân vật
        if (dragInfo.current.target === 'lao' || dragInfo.current.target === 'user') {
             // TÂM AN FX: Tự động kiểm tra và lật hướng nhìn dùng callback để lấy toạ độ mới nhất
             setCharOffsets(prev => {
                 const { laoFlip, userFlip } = calculateAutoFlip(prev.lao.x, prev.user.x, currentLaoPresetId, currentUserPresetId);
                 return {
                     lao: { ...prev.lao, flip: laoFlip },
                     user: { ...prev.user, flip: userFlip }
                 };
             });
             
             setPastOffsets(prev => [...prev, dragInfo.current.startOffsetsSnapshot]);
             setFutureOffsets([]);
        }
    }
    dragInfo.current.isDragging = false;
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch(err) {}
  };

  const handleCanvasWheel = (e) => {
    if (isExportingVideo || renderedVideoUrl) return;
    e.preventDefault();
    const hit = getCanvasHitTarget(e.clientX, e.clientY, exportCanvasRef.current);
    const delta = e.deltaY > 0 ? -0.05 : 0.05;

    if (!hit || hit.type === 'sub') {
        setSubtitleScale(prev => Math.max(0.4, Math.min(3.0, prev + delta)));
    } else if (hit.type === 'lao') {
        setCharOffsets(prev => ({...prev, lao: {...prev.lao, s: Math.max(0.5, Math.min(2.5, prev.lao.s + delta))}}));
    } else if (hit.type === 'user') {
        setCharOffsets(prev => ({...prev, user: {...prev.user, s: Math.max(0.5, Math.min(2.5, prev.user.s + delta))}}));
    } else if (hit.type === 'bg' && hit.id) {
        setCustomBgs(prev => prev.map(bg => bg.id === hit.id ? { ...bg, s: Math.max(0.1, Math.min(5.0, bg.s + delta)) } : bg));
    }
  };

  const loadExternalImage = async (url) => {
    return new Promise((resolve) => {
      const createFallbackCanvas = () => {
          const cvs = document.createElement('canvas');
          cvs.width = 1280; cvs.height = 720;
          const ctx = cvs.getContext('2d');
          const grad = ctx.createLinearGradient(0, 0, 1280, 720);
          grad.addColorStop(0, '#1e293b');
          grad.addColorStop(1, '#020617');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1280, 720);
          ctx.fillStyle = '#64748b';
          ctx.font = 'bold 40px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('Đang kết nối bối cảnh...', 640, 360);
          return cvs;
      };

      const img = new window.Image();
      
      // Chỉ thêm crossOrigin cho link ngoài (http/https) để tránh lỗi CORS với blob: hoặc data:
      if (url.startsWith('http://') || url.startsWith('https://')) {
          img.crossOrigin = "anonymous";
      }
      
      img.onload = () => resolve(img);
      
      img.onerror = async () => {
          console.warn("Lỗi tải ảnh qua thẻ Image, đang thử tải bằng Fetch qua Proxy...", url);
          // Nếu là link ngoài, thử dùng Fetch để tải blob (giúp lách một số lỗi CORS/Tracking blocker)
          if (url.startsWith('http://') || url.startsWith('https://')) {
              try {
                  const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
                  const response = await fetch(proxyUrl, { mode: 'cors' });
                  if (!response.ok) throw new Error("Lỗi kết nối khi fetch ảnh qua proxy");
                  const blob = await response.blob();
                  const blobUrl = URL.createObjectURL(blob);
                  
                  const fallbackImg = new window.Image();
                  fallbackImg.onload = () => resolve(fallbackImg);
                  fallbackImg.onerror = () => resolve(createFallbackCanvas());
                  fallbackImg.src = blobUrl;
              } catch (fetchErr) {
                  console.error("Fetch ảnh dự phòng cũng thất bại:", fetchErr);
                  resolve(createFallbackCanvas());
              }
          } else {
              resolve(createFallbackCanvas());
          }
      };
      
      img.src = url;
    });
  };

  const drawCoverBackground = (ctx, img, canvasWidth, canvasHeight) => {
    const imgRatio = img.width / img.height;
    const canvasRatio = canvasWidth / canvasHeight;
    let renderWidth, renderHeight, x, y;

    if (canvasRatio > imgRatio) {
      renderWidth = canvasWidth;
      renderHeight = canvasWidth / imgRatio;
      x = 0;
      y = (canvasHeight - renderHeight) / 2;
    } else {
      renderWidth = canvasHeight * imgRatio;
      renderHeight = canvasHeight;
      x = (canvasWidth - renderWidth) / 2;
      y = 0;
    }
    ctx.drawImage(img, x, y, renderWidth, renderHeight);
  };

  // --- TÂM AN FIX: Hàm lấy Tỉ lệ thực tế của Media để chống bóp méo ---
  const getMediaRatio = (media) => {
      if (!media) return 300 / 400; // Tỉ lệ mặc định của SVG (3:4)
      const w = media.videoWidth || media.naturalWidth || media.width;
      const h = media.videoHeight || media.naturalHeight || media.height;
      if (!w || !h) return 300 / 400;
      return w / h;
  };

  const calculatePositions = (width, height) => {
    const isPortrait = width < height;
    const isSquare = width === height;
    
    // TÂM AN FIX TỐI THƯỢNG: Tạo "Không Gian Ảo" (Virtual Space) 16:9
    let refWidth = width;
    let refHeight = height;
    
    if (isPortrait || isSquare) {
        refWidth = height * (16/9);
    } else if (width / height > 16/9) {
        refHeight = width / (16/9);
    } else {
        refWidth = height * (16/9);
    }
    
    let laoW, laoH, laoX, laoY;
    let userW, userH, userX, userY;

    laoH = height * 0.65;
    laoW = laoH * (300/400);
    laoX = (width / 2) + (refWidth * 0.15);
    laoY = (height / 2) - (refHeight / 2) + (refHeight * 0.15);

    userH = height * 0.55;
    userW = userH * (300/400);
    userX = (width / 2) - (refWidth * 0.15);
    userY = laoY + (laoH * 0.15);

    return { laoW, laoH, laoX, laoY, userW, userH, userX, userY, isPortrait, isSquare, refWidth, refHeight };
  };

  // Preview tĩnh
  useEffect(() => {
    if (!showVideoExportModal || isExportingVideo || renderedVideoUrl) return;
    let isMounted = true;
    
    const drawStaticPreview = async () => {
        const canvas = exportCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        const res = parseInt(videoResolution);
        let width, height;
        if (videoAspectRatio === '16x9') { width = Math.round(res * 16 / 9); height = res; }
        else if (videoAspectRatio === '9x16') { width = res; height = Math.round(res * 16 / 9); }
        else if (videoAspectRatio === '1x1') { width = res; height = res; }
        else if (videoAspectRatio === '4x3') { width = Math.round(res * 4 / 3); height = res; }
        else if (videoAspectRatio === '3x4') { width = res; height = Math.round(res * 4 / 3); }
        else if (videoAspectRatio === '2x3') { width = res; height = Math.round(res * 3 / 2); }
        else if (videoAspectRatio === '21x9') { width = Math.round(res * 21 / 9); height = res; }
        else { width = Math.round(res * 16 / 9); height = res; }
        
        canvas.width = width; 
        canvas.height = height;

        // XÁC ĐỊNH GÓC MÁY MẶC ĐỊNH (MEDIUM SHOT) CHO PREVIEW TRONG KHÔNG GIAN 3D
        const { laoW, laoH, laoX, laoY, userW, userH, userX, userY, isPortrait, isSquare, refWidth, refHeight } = calculatePositions(width, height);
        
        // TÂM AN FIX: Đưa các biến tọa độ ra ngoài để Hào Quang và Camera cùng sử dụng được
        const finalLaoW = laoW * charOffsets.lao.s;
        const finalLaoH = laoH * charOffsets.lao.s;
        const finalLaoX = laoX + (refWidth * (charOffsets.lao.x / 100));
        const finalLaoY = laoY + (refHeight * (charOffsets.lao.y / 100));

        const finalUserW = userW * charOffsets.user.s;
        const finalUserH = userH * charOffsets.user.s;
        const finalUserX = userX + (refWidth * (charOffsets.user.x / 100));
        const finalUserY = userY + (refHeight * (charOffsets.user.y / 100));

        // Giả lập Camera ở vị trí Lão đang nói (Medium shot) để người dùng dễ căn chỉnh
        const charCenterOffset = isPortrait ? 0 : -(finalLaoX - finalUserX) * 0.05;
        
        let previewCamera = {
            x: isPortrait ? finalLaoX : finalLaoX + charCenterOffset, // TÂM AN FIX: Khung dọc focus thẳng mặt Lão
            y: finalLaoY + finalLaoH * 0.22 - (isPortrait ? height * 0.05 : 0),
            scale: isPortrait ? 1.25 : (isSquare ? 1.25 : 1.35) // TÂM AN FIX: Vuông & Dọc để 1.25 lấy đủ thân hình
        };

        // --- TÂM AN FIX: Khóa giới hạn Camera (Dựa trên diện tích thực của Lớp Nền) ---
        const viewHalfW_prev = width / (2 * previewCamera.scale);
        const viewHalfH_prev = height / (2 * previewCamera.scale);
        
        let safeMinX_prev = viewHalfW_prev;
        let safeMaxX_prev = width - viewHalfW_prev;
        let safeMinY_prev = viewHalfH_prev;
        let safeMaxY_prev = height - viewHalfH_prev;

        // Tính toán ranh giới dựa vào lớp nền đầu tiên
        const activeBgForBoundsPrev = customBgs.find(b => b.visible !== false);
        if (activeBgForBoundsPrev) {
            const OVERSCAN = 1.6;
            const baseBgW = width * OVERSCAN;
            const baseBgH = height * OVERSCAN;
            
            const finalBgW = baseBgW * activeBgForBoundsPrev.s;
            const finalBgH = baseBgH * activeBgForBoundsPrev.s;
            const finalBgX = width/2 + (width * (activeBgForBoundsPrev.x / 100));
            const finalBgY = height/2 + (height * (activeBgForBoundsPrev.y / 100));

            const bgLeft = finalBgX - finalBgW/2;
            const bgRight = finalBgX + finalBgW/2;
            const bgTop = finalBgY - finalBgH/2;
            const bgBottom = finalBgY + finalBgH/2;

            safeMinX_prev = bgLeft + viewHalfW_prev;
            safeMaxX_prev = bgRight - viewHalfW_prev;
            safeMinY_prev = bgTop + viewHalfH_prev;
            safeMaxY_prev = bgBottom - viewHalfH_prev;

            // Nếu background bị thu nhỏ quá mức, khóa chặt camera ở trung tâm background
            if (safeMinX_prev > safeMaxX_prev) { safeMinX_prev = finalBgX; safeMaxX_prev = finalBgX; }
            if (safeMinY_prev > safeMaxY_prev) { safeMinY_prev = finalBgY; safeMaxY_prev = finalBgY; }
        }

        // TÂM AN FIX: Nới lỏng khóa Camera cho video Dọc và Vuông để luôn chĩa ống kính vào nhân vật, không bị ép về giữa
        if (isPortrait || isSquare) {
            safeMinX_prev = Math.min(safeMinX_prev, previewCamera.x);
            safeMaxX_prev = Math.max(safeMaxX_prev, previewCamera.x);
        }

        // CƯỠNG CHẾ TOÀN CẢNH CHO PREVIEW
        if (isFullFrameMode) {
            // TÂM AN AI: Phân tích giả lập Auto-Focus trong lúc Xem Trước
            const isUserCamera = !isLaoSpeakingSession;
            const charX = isUserCamera ? finalUserX : finalLaoX;
            const charY = isUserCamera ? finalUserY + finalUserH * 0.25 : finalLaoY + finalLaoH * 0.25;

            // Lia máy về phía nhân vật đang nói dựa trên tọa độ X/Y do người dùng thiết lập
            previewCamera.x = width/2 + (charX - width/2) * 0.5;
            previewCamera.y = height/2 + (charY - height/2) * 0.35;
            
            // Zoom cận mặt 30% để lấy nét khuôn mặt
            previewCamera.scale = 1.3;
        }

        previewCamera.x = Math.max(safeMinX_prev, Math.min(safeMaxX_prev, previewCamera.x));
        previewCamera.y = Math.max(safeMinY_prev, Math.min(safeMaxY_prev, previewCamera.y));

        // Xóa nền đen
        ctx.fillStyle = '#020617'; 
        ctx.fillRect(0, 0, width, height);

        // Tạo ảnh/video tĩnh On-the-fly để luôn cập nhật Ngoại hình mới nhất
        let previewLaoImg;
        let laoVideoCanvasForPreview = null;

        if (laoVisualType === 'video') {
            const v = laoExportVidRefs.current.idle || laoExportVidRefs.current.talking;
            if (v && v.readyState >= 2) {
                // FIX LỖI SỐ 1: Dùng native playback thay vì ép scrub currentTime
                if (v.paused) v.play().catch(()=>{});

                laoVideoCanvasForPreview = document.createElement('canvas');
                laoVideoCanvasForPreview.width = v.videoWidth;
                laoVideoCanvasForPreview.height = v.videoHeight;
                const ctxLao = laoVideoCanvasForPreview.getContext('2d', { willReadFrequently: true });
                ctxLao.globalCompositeOperation = 'copy';
                ctxLao.drawImage(v, 0, 0);
                
                if (laoChromaSettings.chromaType !== 'none') {
                    ctxLao.globalCompositeOperation = 'source-over';
                    processChromaKeyPixels(ctxLao, v.videoWidth, v.videoHeight, laoChromaSettings);
                }
                previewLaoImg = laoVideoCanvasForPreview;
            }
        } else if (laoVisualType === 'image' && processedLaoImages.closed) {
            previewLaoImg = await loadExternalImage(processedLaoImages.closed);
        } else {
            previewLaoImg = await loadSvgToImage(getLaoSvgString(0, laoAppearance));
        }
        
        let previewUserImg;
        let userVideoCanvasForPreview = null;

        if (userVisualType === 'video') {
            const v = userExportVidRefs.current.idle || userExportVidRefs.current.talking || userExportVidRefs.current.bowing;
            if (v && v.readyState >= 2) {
                // FIX LỖI SỐ 1: Dùng native playback thay vì ép scrub currentTime
                if (v.paused) v.play().catch(()=>{});

                userVideoCanvasForPreview = document.createElement('canvas');
                userVideoCanvasForPreview.width = v.videoWidth;
                userVideoCanvasForPreview.height = v.videoHeight;
                const ctxUser = userVideoCanvasForPreview.getContext('2d', { willReadFrequently: true });
                ctxUser.globalCompositeOperation = 'copy';
                ctxUser.drawImage(v, 0, 0);
                
                if (userChromaSettings.chromaType !== 'none') {
                    ctxUser.globalCompositeOperation = 'source-over';
                    processChromaKeyPixels(ctxUser, v.videoWidth, v.videoHeight, userChromaSettings);
                }
                previewUserImg = userVideoCanvasForPreview;
            }
        } else if (userVisualType === 'image' && processedUserImages.closed) {
            previewUserImg = await loadExternalImage(processedUserImages.closed);
        } else {
            previewUserImg = await loadSvgToImage(getUserSvgString(0, userGender, userAge, 0, userAppearance));
        }
        
        if (!isMounted) return;

        // --- BẮT ĐẦU KHÔNG GIAN CAMERA 3D ---
        ctx.save();
        ctx.translate(width/2, height/2); 
        ctx.scale(previewCamera.scale, previewCamera.scale);
        ctx.translate(-previewCamera.x, -previewCamera.y);

        if (isFullFrameMode) {
            // --- CHẾ ĐỘ TOÀN CẢNH (CẮT GHÉP TRỰC TIẾP TRONG XEM TRƯỚC) ---
            let activeFullFrameImg = null;
            let activeFullFrameFlip = false;

            // TÂM AN LÕI: Trích xuất trực tiếp từ kho Video Dựng Sẵn (ffVidRefs) ra màn hình Xem Trước
            if (isLaoSpeakingSession) {
                const vid = ffVidRefs.current['lao'];
                activeFullFrameImg = (vid && vid.readyState >= 2) ? vid : previewLaoImg;
                activeFullFrameFlip = (vid && vid.readyState >= 2) ? false : charOffsets.lao.flip;
            } else {
                // Giả định lúc không phải Lão nói thì là Người hỏi (vì Preview tĩnh không có khái niệm Outro)
                const vid = ffVidRefs.current['user'];
                activeFullFrameImg = (vid && vid.readyState >= 2) ? vid : previewUserImg;
                activeFullFrameFlip = (vid && vid.readyState >= 2) ? false : charOffsets.user.flip;
            }

            if (activeFullFrameImg) {
                ctx.save();
                ctx.translate(width/2, height/2);
                if (activeFullFrameFlip) ctx.scale(-1, 1);
                ctx.translate(-width/2, -height/2);
                
                const imgW = activeFullFrameImg.width || activeFullFrameImg.videoWidth || 1;
                const imgH = activeFullFrameImg.height || activeFullFrameImg.videoHeight || 1;
                const imgRatio = imgW / imgH;
                const canvasRatio = width / height;
                let renderW, renderH, dx, dy;

                if (canvasRatio > imgRatio) {
                  renderW = width;
                  renderH = width / imgRatio;
                  dx = 0;
                  dy = (height - renderH) / 2;
                } else {
                  renderW = height * imgRatio;
                  renderH = height;
                  dx = (width - renderW) / 2;
                  dy = 0;
                }
                ctx.drawImage(activeFullFrameImg, dx, dy, renderW, renderH);
                ctx.restore();
            }
        } else {
            // 1. Vẽ Lớp Nền (Đã bỏ Parallax để ghim chặt nhân vật vào nền)
            const OVERSCAN = 1.6; // Vẽ nền to hơn 1.6 lần để không lộ viền đen khi camera di chuyển

            ctx.save();

            // Nền Gradient cơ bản (overscan)
            const grad = ctx.createRadialGradient(width/2, height/2, height/4, width/2, height/2, height * OVERSCAN);
            grad.addColorStop(0, '#1e293b');
            grad.addColorStop(1, '#020617');
            ctx.fillStyle = grad;
            ctx.fillRect(-(width * (OVERSCAN-1)/2), -(height * (OVERSCAN-1)/2), width * OVERSCAN, height * OVERSCAN);

            // Các lớp nền Custom Backgrounds
            customBgs.filter(bg => bg.visible !== false).forEach(bg => {
                let sourceCanvasOrImage = null;
                let sourceW = 0, sourceH = 0;
                let videoData = null; // Trữ dữ liệu làm mờ chéo (crossfade)

                if (bg.type === 'image') {
                    const cached = processedBgsRef.current[bg.id];
                    if (cached && cached.element) {
                        sourceCanvasOrImage = cached.element;
                        sourceW = sourceCanvasOrImage.width;
                        sourceH = sourceCanvasOrImage.height;
                    }
                } else if (bg.type === 'video') {
                    const vObj = bgVideoRefs.current[bg.id];
                    if (vObj && vObj.isLoaded) {
                        // TÂM AN FIX V6: Lấy ra video chủ và video dự bị
                        const activeVid = vObj.activeKey === 'A' ? vObj.elementA : vObj.elementB;
                        const nextVid = vObj.activeKey === 'A' ? vObj.elementB : vObj.elementA;

                        if (activeVid.readyState >= 2) {
                            sourceCanvasOrImage = activeVid; // Vẽ khung hình hiện tại
                            sourceW = vObj.videoWidth;
                            sourceH = vObj.videoHeight;
                            
                            const OVERLAP = 0.8; // Thời gian đè (giây)
                            let crossfadeAlpha = 0;

                            // TÂM AN TỐI ƯU V6: Xử lý Vòng lặp Seamless (Không giật, Không đen) lúc Xem trước
                            if (bg.loopMode !== 'boomerang' && activeVid.duration && activeVid.currentTime >= activeVid.duration - OVERLAP) {
                                if (nextVid.paused) { 
                                    nextVid.currentTime = 0; 
                                    nextVid.play().catch(()=>{}); 
                                }
                                // Tính toán độ trong suốt đè chéo
                                crossfadeAlpha = (activeVid.currentTime - (activeVid.duration - OVERLAP)) / OVERLAP;
                                crossfadeAlpha = Math.max(0, Math.min(1, crossfadeAlpha));

                                // Đổi cờ lệnh khi Video A chính thức chạm đáy
                                if (activeVid.currentTime >= activeVid.duration - 0.05 || activeVid.ended) {
                                    vObj.activeKey = vObj.activeKey === 'A' ? 'B' : 'A';
                                    activeVid.pause();
                                    activeVid.currentTime = 0;
                                    crossfadeAlpha = 0;
                                }
                            } else if (bg.loopMode === 'boomerang' && activeVid.duration && activeVid.currentTime >= activeVid.duration - 0.15) {
                                // Kỹ thuật cho boomerang (Lùi thời gian)
                                activeVid.currentTime = 0.05;
                            }

                            videoData = { nextVid, crossfadeAlpha };
                        }
                    }
                }

                if (sourceCanvasOrImage) {
                    const imgRatio = sourceW / sourceH;
                    const canvasRatio = width / height;
                    let baseW, baseH;
                    if (canvasRatio > imgRatio) { baseW = width; baseH = width / imgRatio; } 
                    else { baseH = height; baseW = height * imgRatio; }
                    
                    // Mở rộng kích thước base theo Overscan
                    baseW *= OVERSCAN;
                    baseH *= OVERSCAN;
                    
                    const finalW = baseW * bg.s;
                    const finalH = baseH * bg.s;
                    const finalX = width/2 + (refWidth * (bg.x / 100));
                    const finalY = height/2 + (refHeight * (bg.y / 100));

                    ctx.save();
                    
                    // Hiệu ứng Hover cho Background
                    const isHoveredBg = hoveredElement?.type === 'bg' && hoveredElement?.id === bg.id;
                    if (isHoveredBg) {
                        ctx.filter = 'brightness(1.3) contrast(1.1)';
                        ctx.shadowColor = 'rgba(16, 185, 129, 0.8)'; // Emerald glow
                        ctx.shadowBlur = 20;
                    } else if (hoveredElement) {
                        ctx.filter = 'brightness(0.6)'; // Làm mờ khi đang trỏ vào cái khác
                    }

                    ctx.translate(finalX, finalY);
                    if (bg.flip) ctx.scale(-1, 1);
                    
                    ctx.globalAlpha = 1.0;
                    ctx.drawImage(sourceCanvasOrImage, -finalW/2, -finalH/2, finalW, finalH);

                    // TÂM AN CROSSFADE FIX: Đè lớp video bản sao lên để triệt tiêu chớp giật
                    if (videoData && videoData.crossfadeAlpha > 0 && videoData.nextVid && videoData.nextVid.readyState >= 2) {
                        ctx.globalAlpha = videoData.crossfadeAlpha;
                        ctx.drawImage(videoData.nextVid, -finalW/2, -finalH/2, finalW, finalH);
                    }

                    ctx.restore();
                }
            });
            
            // Màn sương tối để nhân vật nổi bật (TÂM AN FIX: Đổi thành Vignette Gradient để giữ độ trong trẻo cho ảnh/video nền ban ngày)
            const overlayGrad = ctx.createRadialGradient(previewCamera.x, previewCamera.y, height * 0.3, previewCamera.x, previewCamera.y, height * OVERSCAN);
            overlayGrad.addColorStop(0, 'rgba(2, 6, 23, 0.02)'); // Tâm sáng rực
            overlayGrad.addColorStop(1, 'rgba(2, 6, 23, 0.5)'); // Viền tối dần làm điện ảnh
            ctx.fillStyle = overlayGrad;
            ctx.fillRect(-(width * (OVERSCAN-1)/2), -(height * (OVERSCAN-1)/2), width * OVERSCAN, height * OVERSCAN);
            ctx.restore(); // Kết thúc Parallax lớp nền

            // --- Vẽ Hào Quang (Preview Tĩnh) ---
            if (showLaoAura && previewLaoImg) {
                ctx.save();
                const headCx = finalLaoX;
                const headCy = finalLaoY + finalLaoH * (95/400);
                ctx.beginPath();
                ctx.arc(headCx, headCy, 120 * (finalLaoH / 400), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(253, 224, 71, 0.15)`;
                ctx.fill();
                ctx.beginPath();
                ctx.arc(headCx, headCy, 160 * (finalLaoH / 400), 0, Math.PI * 2);
                ctx.fillStyle = `rgba(253, 224, 71, 0.05)`;
                ctx.fill();
                ctx.restore();
            }

            // 2. Vẽ Nhân vật trong không gian 3D
            if (previewLaoImg) {
                // --- TÂM AN FIX: Giữ nguyên tỉ lệ gốc, chống bóp méo (Lão) ---
                const laoRatio = getMediaRatio(previewLaoImg);
                const correctedLaoW = finalLaoH * laoRatio;

                // --- TÂM AN FX: Đổ bóng tiếp xúc (Ambient Occlusion) ---
                if (enableAutoHarmonization) {
                    drawContactShadow(ctx, finalLaoX, finalLaoY, correctedLaoW, finalLaoH, laoShadow);
                }

                ctx.save();
                const isHoveredLao = hoveredElement?.type === 'lao';
                
                // --- TÂM AN FX: Color Match (Cân bằng tông màu) ---
                let baseFilter = enableAutoHarmonization ? getHarmonizeFilter(harmonizeSettings) : 'none';

                if (isHoveredLao) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(1.2)`;
                    ctx.shadowColor = 'rgba(249, 115, 22, 1)'; // Orange glow
                    ctx.shadowBlur = 25;
                } else if (hoveredElement) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(0.5)`;
                } else if (enableAutoHarmonization) {
                    ctx.filter = baseFilter;
                }
                
                // Ép GPU dùng Float Matrix để khử mờ viền
                ctx.translate(finalLaoX, finalLaoY);
                if (charOffsets.lao.flip) {
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(previewLaoImg, -correctedLaoW/2, 0, correctedLaoW, finalLaoH);
                ctx.restore();
            }
            
            if (previewUserImg) {
                // --- TÂM AN FIX: Giữ nguyên tỉ lệ gốc, chống bóp méo (User) ---
                const userRatio = getMediaRatio(previewUserImg);
                const correctedUserW = finalUserH * userRatio;

                // --- TÂM AN FX: Đổ bóng tiếp xúc (Ambient Occlusion) ---
                if (enableAutoHarmonization) {
                    drawContactShadow(ctx, finalUserX, finalUserY, correctedUserW, finalUserH, userShadow);
                }

                ctx.save();
                const isHoveredUser = hoveredElement?.type === 'user';
                
                // --- TÂM AN FX: Color Match (Cân bằng tông màu) ---
                let baseFilter = enableAutoHarmonization ? getHarmonizeFilter(harmonizeSettings) : 'none';

                if (isHoveredUser) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(1.2)`;
                    ctx.shadowColor = 'rgba(99, 102, 241, 1)'; // Indigo glow
                    ctx.shadowBlur = 25;
                } else if (hoveredElement) {
                    ctx.filter = `${baseFilter !== 'none' ? baseFilter : ''} brightness(0.5)`;
                } else if (enableAutoHarmonization) {
                    ctx.filter = baseFilter;
                }

                // Ép GPU dùng Float Matrix để khử mờ viền
                ctx.translate(finalUserX, finalUserY);
                if (charOffsets.user.flip) {
                    ctx.scale(-1, 1);
                }
                ctx.drawImage(previewUserImg, -correctedUserW/2, 0, correctedUserW, finalUserH);
                ctx.restore();
            }
        } // Đóng khối else của isFullFrameMode

        // --- KẾT THÚC KHÔNG GIAN CAMERA 3D ---
        ctx.restore();

        // 3. VẼ LỚP OVERLAY CỐ ĐỊNH TRÊN MÀN HÌNH (UI Overlay)
        if (processedLogoRef.current) {
            const logoImg = processedLogoRef.current;
            const logoSize = Math.min(width, height) * 0.15;
            const logoH = logoSize * (logoImg.height / logoImg.width);
            ctx.drawImage(logoImg, width - logoSize - 20, 20, logoSize, logoH);
        }

        const activeText = "Đây là phụ đề mẫu. Dấu câu được ngắt tự động, rõ ràng.";
        ctx.fillStyle = subtitleColor;
        const fontSizeText = Math.min(width, height) * 0.055 * subtitleScale;
        ctx.font = `bold ${fontSizeText}px 'Segoe UI', Arial, sans-serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 10;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.textAlign = "center";

        const lines = wrapTextToLines(ctx, activeText, width * 0.85);
        const startY = height * (subtitleYPos / 100);
        let textY = startY - (lines.length * fontSizeText * 1.3) / 2;
        
        const isSubHovered = hoveredElement?.type === 'sub';
        if (isSubHovered) {
             ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
             const hitBoxH = (lines.length * fontSizeText * 1.3) + 40;
             ctx.fillRect(0, startY - hitBoxH/2, width, hitBoxH);
             ctx.shadowColor = 'rgba(255,255,255,0.9)';
             ctx.shadowBlur = 15;
        }

        lines.forEach(line => {
           ctx.strokeStyle = 'rgba(0,0,0,0.85)';
           ctx.lineWidth = fontSizeText * 0.15;
           ctx.strokeText(line, width/2, textY);
           ctx.fillText(line, width/2, textY);
           textY += fontSizeText * 1.3;
        });
        ctx.shadowColor = 'transparent';

        ctx.fillStyle = 'rgba(255,255,255,0.4)';
        const hintSize = Math.max(12, Math.min(width, height) * 0.02);
        ctx.font = `bold ${hintSize}px sans-serif`;
        ctx.fillText("✨ Kéo thả chữ hoặc cuộn để zoom", width/2, height * 0.05);
    };
    drawStaticPreview();
    return () => { isMounted = false; };
  }, [showVideoExportModal, isExportingVideo, renderedVideoUrl, videoAspectRatio, videoResolution, subtitleYPos, subtitleScale, subtitleColor, subtitleSentenceCount, userGender, userAge, charOffsets, customBgs, bgUpdateTrigger, logoData, hoveredElement, laoAppearance, userAppearance, processedLaoImages, laoVisualType, processedUserImages, userVisualType, showLaoAura, enableAutoHarmonization, harmonizeSettings, laoShadow, userShadow, isFullFrameMode]); // TÂM AN FIX: Thêm isFullFrameMode

  const loadSvgToImage = (svgString) => {
    return new Promise((resolve) => {
      const img = new window.Image();
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => { URL.revokeObjectURL(url); resolve(img); };
      img.src = url;
    });
  };

  const wrapTextToLines = (ctx, text, maxWidth) => {
    // TÂM AN FIX: Đảm bảo biến truyền vào luôn là Chuỗi (String) để chống lỗi sập Canvas
    const str = String(text || '');
    if (!str) return [];
    
    // Hỗ trợ ngắt dòng chuẩn cho cả hệ ngôn ngữ không dùng dấu cách (Trung, Nhật, Hàn...)
    const hasSpaces = str.indexOf(' ') !== -1;
    const tokens = hasSpaces ? str.split(' ') : str.split('');
    
    let lines = [];
    let currentLine = tokens[0] || '';

    for (let i = 1; i < tokens.length; i++) {
        let token = tokens[i];
        let testLine = hasSpaces ? currentLine + " " + token : currentLine + token;
        let width = ctx.measureText(testLine).width;
        if (width < maxWidth) {
            currentLine = testLine;
        } else {
            lines.push(currentLine);
            currentLine = token;
        }
    }
    if (currentLine) lines.push(currentLine);
    return lines;
  };

  // --- HÀM MỚI: DỌN DẸP CACHE & GIẢI PHÓNG RAM ---
  const handleClearCache = () => {
      showToastMsg('Đang quét và dọn dẹp bộ nhớ đệm (RAM/VRAM)...', 'loading', 2500);

      // 1. Phá hủy các Canvas xử lý điểm ảnh (Nặng RAM nhất) của Bối cảnh Video
      Object.values(bgVideoRefs.current).forEach(vObj => {
          if (vObj) {
              vObj.chromaCanvas = null;
              vObj.chromaCtx = null;
              vObj.lastValidCanvas = null;
          }
      });

      // 2. Phá hủy Canvas tách nền của Lão
      ['idle', 'talking'].forEach(state => {
          if (laoExportVidRefs.current[state]) {
              laoExportVidRefs.current[state].chromaCanvas = null;
              laoExportVidRefs.current[state].chromaCtx = null;
          }
      });

      // 3. Phá hủy Canvas tách nền của Người hỏi
      ['idle', 'talking', 'bowing'].forEach(state => {
          if (userExportVidRefs.current[state]) {
              userExportVidRefs.current[state].chromaCanvas = null;
              userExportVidRefs.current[state].chromaCtx = null;
          }
      });

      // 4. Xóa bộ nhớ đệm Ảnh tĩnh & Logo đã xử lý (Sẽ tự động vẽ lại mới, sắc nét hơn)
      processedBgsRef.current = {};
      processedLogoRef.current = null;

      // 5. Xóa rác của luồng Render cũ
      if (exportAudioCtxRef.current) {
          exportAudioCtxRef.current.laoLastValidCanvas = null;
          exportAudioCtxRef.current.userLastValidCanvas = null;
      }
      preloadedLaoFrames.current = {};
      preloadedUserFrames.current = {};
      preloadedBowFrames.current = {};

      // 6. Xóa Video Preview cũ nếu có (Nhưng chưa lưu) để trả lại dung lượng
      if (renderedVideoUrl && !isExportingVideo) {
          URL.revokeObjectURL(renderedVideoUrl);
          setRenderedVideoUrl(null);
          setRenderedVideoBlob(null);
      }

      // 7. Kích hoạt render lại giao diện để khởi tạo bộ nhớ sạch
      setBgUpdateTrigger(prev => prev + 1);

      setTimeout(() => {
          showToastMsg('Đã giải phóng RAM thành công! Khung hình đã sẵn sàng để render ở chất lượng cao nhất.', 'success', 5000);
      }, 1000);
  };

  const startVideoExport = async () => {
    if (isExportingVideo) return;
    setIsPreparingVideoData(true);
    setDiagnosticReport(null); // Reset báo cáo cũ

    // TÂM AN FIX: Tiêu diệt triệt để vòng lặp bóng ma từ lần render trước
    if (exportAnimFrameRef.current) {
        cancelAnimationFrame(exportAnimFrameRef.current);
        exportAnimFrameRef.current = null;
    }

    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      exportAudioCtxRef.current = new AudioContextClass();
      // --- TÂM AN FIX: BỘ MÁY RVFC BẮT DÍNH FRAME BẰNG PHẦN CỨNG ---
      // --- TÂM AN FIX V3: ÉP CARD ĐỒ HỌA (GPU) GIẢI MÃ VIDEO ---
      // --- TÂM AN FIX V4: LÁ CHẮN THÉP CHỐNG CHỚP NHÁY KHI VIDEO LẶP (LOOP) ---
      // --- TÂM AN FIX V5: LÁ CHẮN THÉP TỐI THƯỢNG (CHỐNG LỌT FRAME TUYỆT ĐỐI) ---
      const attachRVFC = (vid) => {
          if (!vid || vid.hasRVFC) return;
          vid.hasRVFC = true;
          
          const captureFrame = async (now, metadata) => {
              if (vid.readyState >= 2 && vid.videoWidth && metadata.mediaTime !== undefined) {
                  
                  // Chỉ cần thời gian tụt lùi (dù là 0.001s) -> Xác định là Video đang lặp lại (Loop)
                  const isLooping = vid.lastMediaTime !== undefined && metadata.mediaTime < vid.lastMediaTime;

                  if (isLooping) {
                      // VIDEO ĐANG LẶP: Cấm tuyệt đối việc chụp hình mới. Giữ nguyên hình cũ che mắt!
                      vid.lastMediaTime = metadata.mediaTime;
                  } 
                  // CHỈ CHỤP HÌNH MỚI KHI VIDEO ĐANG CHẠY TỚI BÌNH THƯỜNG
                  else if (vid.lastMediaTime !== metadata.mediaTime) {
                      try {
                          const bitmap = await createImageBitmap(vid);
                          const oldFrame = vid.gpuFrame;
                          vid.gpuFrame = bitmap; // Gán hình mới bằng sức mạnh GPU
                          if (oldFrame) oldFrame.close(); // Dọn dẹp hình cũ
                          vid.lastMediaTime = metadata.mediaTime;
                          vid.isFrameSafe = true;
                      } catch (e) {
                          // Nếu GPU bận/lỗi đột xuất, im lặng giữ nguyên hình cũ
                      }
                  }
              }
              if (vid.parentNode || vid.src) { 
                  vid.rvfcId = vid.requestVideoFrameCallback(captureFrame);
              }
          };
          vid.rvfcId = vid.requestVideoFrameCallback(captureFrame);
      };
      // -------------------------------------------------------------
      
      if (exportAudioCtxRef.current.state === 'suspended') {
          await exportAudioCtxRef.current.resume();
      }

      const mouthStates = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
      // Mở rộng các trạng thái cúi lạy để mượt mà hơn
      const bowStates = [0, 10, 20, 30, 40, 50];

      preloadedLaoFrames.current = {};
      preloadedUserFrames.current = {};
      preloadedBowFrames.current = {};
      
      if (laoVisualType === 'image' && processedLaoImages.closed) {
          const closedImg = await loadExternalImage(processedLaoImages.closed);
          const halfImg = processedLaoImages.half ? await loadExternalImage(processedLaoImages.half) : closedImg;
          const openImg = processedLaoImages.open ? await loadExternalImage(processedLaoImages.open) : halfImg;

          mouthStates.forEach(state => {
              if (state >= 12) preloadedLaoFrames.current[state] = openImg;
              else if (state >= 4) preloadedLaoFrames.current[state] = halfImg;
              else preloadedLaoFrames.current[state] = closedImg;
          });
      } else if (laoVisualType === 'svg') {
          await Promise.all(mouthStates.map(async (state) => {
            preloadedLaoFrames.current[state] = await loadSvgToImage(getLaoSvgString(state, laoAppearance));
          }));
      }

      if (userVisualType === 'image' && processedUserImages.closed) {
          const closedImg = await loadExternalImage(processedUserImages.closed);
          const halfImg = processedUserImages.half ? await loadExternalImage(processedUserImages.half) : closedImg;
          const openImg = processedUserImages.open ? await loadExternalImage(processedUserImages.open) : halfImg;
          const bowImg = processedUserImages.bow ? await loadExternalImage(processedUserImages.bow) : closedImg;

          mouthStates.forEach(state => {
              if (state >= 12) preloadedUserFrames.current[state] = openImg;
              else if (state >= 4) preloadedUserFrames.current[state] = halfImg;
              else preloadedUserFrames.current[state] = closedImg;
          });
          bowStates.forEach(state => {
              preloadedBowFrames.current[state] = bowImg;
          });
      } else if (userVisualType === 'svg') {
          await Promise.all(mouthStates.map(async (state) => {
             preloadedUserFrames.current[state] = await loadSvgToImage(getUserSvgString(state, userGender, userAge, 0, userAppearance));
          }));
          await Promise.all(bowStates.map(async (state) => {
             preloadedBowFrames.current[state] = await loadSvgToImage(getUserSvgString(0, userGender, userAge, state, userAppearance));
          }));
      }

      const audioUrl = await getCombinedAudioUrl();

      const audioCtx = exportAudioCtxRef.current;
      
      const dest = audioCtx.createMediaStreamDestination();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.1; // Nhép môi lúc Render Video cũng phải nhạy từng âm tiết
      
      let speechSource = null;
      let totalDuration = 10; // Mặc định video dài 10 giây nếu không có tiếng nói

      if (audioUrl) {
          const speechBufferArray = await fetch(audioUrl).then(r => r.arrayBuffer());
          const speechBuffer = await audioCtx.decodeAudioData(speechBufferArray);
          
          speechSource = audioCtx.createBufferSource();
          speechSource.buffer = speechBuffer;

          speechSource.connect(analyser);
          speechSource.connect(dest);
          speechSource.connect(audioCtx.destination);
          
          totalDuration = speechBuffer.duration;
      }

      // Xử lý Audio từ BGM
      let bgmSource = null;
      let bgmGain = null;
      if (bgmAudioData?.url) {
          try {
              const bgmBufferArray = await fetch(bgmAudioData.url).then(r => r.arrayBuffer());
              const bgmBuffer = await audioCtx.decodeAudioData(bgmBufferArray);
              
              bgmSource = audioCtx.createBufferSource();
              bgmSource.buffer = bgmBuffer;
              bgmSource.loop = true;

              bgmGain = audioCtx.createGain();
              bgmGain.gain.value = bgmVolume;

              bgmSource.connect(bgmGain);
              bgmGain.connect(dest);
              bgmGain.connect(audioCtx.destination);
          } catch (err) {
              console.warn("Không thể tải nhạc nền", err);
          }
      }

      // Xử lý Audio từ Custom Video Backgrounds
      const videoAudioNodes = [];
      customBgs.forEach(bg => {
          if (bg.type === 'video' && !bg.muted && bg.loopMode !== 'boomerang') {
              const audioClone = new Audio(bg.url);
              audioClone.crossOrigin = "anonymous";
              audioClone.loop = true;
              const source = audioCtx.createMediaElementSource(audioClone);
              
              // Tạo bộ điều chỉnh âm lượng (GainNode) cho video nền
              const gainNode = audioCtx.createGain();
              gainNode.gain.value = bg.volume !== undefined ? bg.volume : 1;
              
              source.connect(gainNode);
              gainNode.connect(dest); // Ghi vào luồng xuất file video
              gainNode.connect(audioCtx.destination); // Phát trực tiếp ra loa để nghe khi render
              
              videoAudioNodes.push({ element: audioClone, gainNode, volume: bg.volume !== undefined ? bg.volume : 1 });
          }
      });

      const canvas = exportCanvasRef.current;
      if (!canvas) {
          throw new Error("Không tìm thấy khung vẽ Canvas (Giao diện chưa tải xong). Vui lòng thử lại.");
      }
      
      const res = parseInt(videoResolutionRef.current);
      let width, height;
      const aspect = videoAspectRatioRef.current;
      if (aspect === '16x9') { width = Math.round(res * 16 / 9); height = res; }
      else if (aspect === '9x16') { width = res; height = Math.round(res * 16 / 9); }
      else if (aspect === '1x1') { width = res; height = res; }
      else if (aspect === '4x3') { width = Math.round(res * 4 / 3); height = res; }
      else if (aspect === '3x4') { width = res; height = Math.round(res * 4 / 3); }
      else if (aspect === '2x3') { width = res; height = Math.round(res * 3 / 2); }
      else if (aspect === '21x9') { width = Math.round(res * 21 / 9); height = res; }
      else { width = Math.round(res * 16 / 9); height = res; }
      
      canvas.width = width; 
      canvas.height = height;
      // TÂM AN FIX: Thêm alpha: false để báo cho GPU biết Canvas không trong suốt, giúp tăng tốc độ Render lên 30%
      // TÂM AN FIX: Bật desynchronized để kết nối thẳng luồng render tới GPU Compositor
      const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
      ctx.imageSmoothingEnabled = true;
      // TÂM AN TỐI ƯU HIỆU SUẤT LÕI: Hạ chất lượng nội suy ảnh động xuống 'low' để giải phóng GPU/CPU. 
      // Trên video chuyển động, 'low' vẫn nét nhưng tốc độ render nhanh gấp 3 lần 'high'.
      ctx.imageSmoothingQuality = 'low';

      // --- TÂM AN FIX: Đổ màu và chữ chờ vào Canvas để triệt tiêu lỗi chớp đen màn hình khi bắt đầu Render ---
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#f59e0b';
      ctx.font = `bold ${Math.min(width, height) * 0.05}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('Đang kết nối không gian...', width/2, height/2);

      const canvasStream = canvas.captureStream(60); // TÂM AN FIX: Nâng tốc độ bắt hình lên 60 FPS để Camera lia cực mượt, không bị khựng
      
      const combinedStream = new MediaStream([
         ...canvasStream.getVideoTracks(),
         ...dest.stream.getAudioTracks()
      ]);

      // TÂM AN THÊM: Cấu hình độ dài Intro
      const INTRO_DUR = enableIntroRef.current ? 6 : 0; // TÂM AN FIX: Tăng thời lượng Intro từ 4s lên 6 giây để khán giả kịp đọc

      // TÂM AN NÂNG CẤP: Bơm cực đại Bitrate để đảm bảo video 4K siêu nét, không bị vỡ hạt khi chuyển động
      let videoBitrate = 8000000; // 8 Mbps mặc định (1080p)
      if (width >= 3840 || height >= 3840) videoBitrate = 35000000; // 35 Mbps cho 4K
      else if (width >= 2560 || height >= 2560) videoBitrate = 18000000; // 18 Mbps cho 2K

      // Dùng avc1 với thông số Constrained Baseline Profile (42E01E) - Trình phát nào cũng đọc được
let options = { mimeType: 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"', videoBitsPerSecond: videoBitrate };
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: videoBitrate };
          if (!MediaRecorder.isTypeSupported(options.mimeType)) {
              options = { mimeType: 'video/webm;codecs=vp8,opus', videoBitsPerSecond: videoBitrate };
              if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                  options = { mimeType: 'video/webm', videoBitsPerSecond: videoBitrate };
                  if (!MediaRecorder.isTypeSupported(options.mimeType)) options = { videoBitsPerSecond: videoBitrate };
              }
          }
      }

      const recorder = new MediaRecorder(combinedStream, options);
      exportMediaRecorderRef.current = recorder;
      
      const chunks = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        if (exportAnimFrameRef.current) {
            cancelAnimationFrame(exportAnimFrameRef.current);
            exportAnimFrameRef.current = null;
        }
        
        // TÂM AN FIX TỐI THƯỢNG (CHỐNG LAG TỪ VIDEO SỐ 3):
        // Giết chết toàn bộ các luồng bắt hình sau khi xong việc để trả lại RAM cho hệ thống
        try {
            if (combinedStream) combinedStream.getTracks().forEach(t => t.stop());
            if (canvasStream) canvasStream.getVideoTracks().forEach(t => t.stop());
            if (dest && dest.stream) dest.stream.getAudioTracks().forEach(t => t.stop());
        } catch (e) { console.warn("Lỗi dọn rác Stream:", e); }

        // TÂM AN FIX: Đóng gói và giải phóng AudioContext sau khi render xong để không bị sập ở video thứ 2
        if (exportAudioCtxRef.current && exportAudioCtxRef.current.state !== 'closed') {
            exportAudioCtxRef.current.close().catch(err => console.warn(err));
        }
        exportAudioCtxRef.current = null;

        const actualMimeType = recorder.mimeType || options.mimeType || 'video/webm';
        const ext = actualMimeType.includes('mp4') ? 'mp4' : 'webm';
        setVideoExt(ext);
        
        const blob = new Blob(chunks, { type: actualMimeType });
        const url = URL.createObjectURL(blob);
        setRenderedVideoBlob(blob);
        setRenderedVideoUrl(url);
        setIsExportingVideo(false);
        if (speechSource) {
            try { speechSource.stop(); } catch(e){}
        }
        if (bgmSource) try { bgmSource.stop(); } catch(e){}
        videoAudioNodes.forEach(n => n.element.pause());

        // --- TÂM AN AUTO-PILOT: Tự động tải & Resolve Promise ---
        if (apStateRef.current.isRunning && renderPromiseRef.current) {
            logAp("Tiến hành tự động tải Video về máy...");
            const currentTitle = latestMessagesRef.current[0]?.text?.substring(0, 15) || "Video";
            const filename = `AutoPilot_${currentTitle.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${ext}`;
            
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            logAp(`Đã lưu tệp: ${filename}`);
            
            // Xóa UI Modal và Dọn dẹp Video URL để tránh tốn RAM
            setTimeout(() => {
                resetVideoExport();
                setShowVideoExportModal(false);
                if (renderPromiseRef.current) {
                    renderPromiseRef.current.resolve();
                    renderPromiseRef.current = null;
                }
            }, 5000); // Tăng thời gian delay để Chrome kịp lưu file 4K nặng
        }
      };

      setIsExportingVideo(true);
      setIsPreparingVideoData(false);
      
      const rawMetadata = globalAudioMetadataRef.current;
      const sentenceLevelMetadata = [];
      
      for (let m of rawMetadata) {
          // TÂM AN FIX: Thêm hệ dấu câu CJK (Trung, Nhật, Hàn) vào Regex để cắt câu trên trục thời gian chuẩn xác
          const rawParts = m.text.split(/([.,!?;:\n。，、？！：；]+)/);
          const cleanSentences = [];
          for (let i = 0; i < rawParts.length; i += 2) {
             let s = rawParts[i];
             if (rawParts[i+1]) s += rawParts[i+1];
             s = s.trim();
             if (s) cleanSentences.push(s);
          }
          
          if (cleanSentences.length <= 1) {
              sentenceLevelMetadata.push({ ...m, text: m.text.trim() });
          } else {
              const totalChars = cleanSentences.reduce((sum, s) => sum + s.length, 0);
              let currentStart = m.start;
              const totalDuration = m.end - m.start;

              cleanSentences.forEach(sentence => {
                  const duration = (sentence.length / Math.max(totalChars, 1)) * totalDuration;
                  sentenceLevelMetadata.push({
                      role: m.role,
                      text: sentence,
                      emotion: m.emotion, // Bê cảm xúc đi theo từng mảnh câu
                      msgId: m.msgId,     // Truyền ID đoạn thoại để đồng bộ chính xác Video cảnh quay
                      start: currentStart,
                      end: currentStart + duration
                  });
                  currentStart += duration;
              });
          }
      }

      const groupedMetadata = [];
      let currentGroup = null;
      const sentenceLimit = parseInt(subtitleSentenceCount, 10) || 1;
      
      // TÂM AN FIX 1: Đổi các góc máy thành phong cách điện ảnh chậm (Ken Burns Effect)
      const shotTypes = ['zoom_in_slow', 'zoom_out_slow', 'pan_left_slow', 'pan_right_slow', 'float_up_slow'];

      for (let m of sentenceLevelMetadata) {
          if (!currentGroup) {
              currentGroup = { ...m, sentences: 1, shotType: shotTypes[Math.floor(Math.random() * shotTypes.length)] };
          } else if (currentGroup.role === m.role && currentGroup.sentences < sentenceLimit && (m.start - currentGroup.end) < 0.5) {
              currentGroup.text += " " + m.text;
              currentGroup.end = m.end;
              currentGroup.sentences++;
          } else {
              groupedMetadata.push(currentGroup);
              currentGroup = { ...m, sentences: 1, shotType: shotTypes[Math.floor(Math.random() * shotTypes.length)] };
          }
      }
      if (currentGroup) groupedMetadata.push(currentGroup);

      // --- TỐI ƯU HÓA: XÂY DỰNG TRỤC THỜI GIAN TRẠNG THÁI (STATE MACHINE TIMELINE) ---
      // Giúp triệt tiêu hoàn toàn lỗi chớp giật do vi hở âm thanh (micro-gaps)
      const mergeBlocks = (blocks) => {
          if (blocks.length === 0) return [];
          const merged = [blocks[0]];
          for (let i = 1; i < blocks.length; i++) {
              const last = merged[merged.length - 1];
              if (blocks[i].start - last.end <= 1.5) {
                  last.end = Math.max(last.end, blocks[i].end);
              } else {
                  merged.push(blocks[i]);
              }
          }
          return merged;
      };

      const rawLaoBlocks = groupedMetadata.filter(m => m.role === 'ai').map(m => ({ start: m.start - 0.1, end: m.end + 0.15 }));
      const rawUserBlocks = groupedMetadata.filter(m => m.role === 'user').map(m => ({ start: m.start - 0.1, end: m.end + 0.15 }));
      
      const laoTalkingBlocks = mergeBlocks(rawLaoBlocks);
      const userTalkingBlocks = mergeBlocks(rawUserBlocks);
      
      const userBowingBlocks = [];
      
      // TÂM AN FIX: Lấy thời lượng thực tế của Video Vái lạy để không bị cắt ngang
      let BOW_DURATION = 3.5; 
      if (userVisualType === 'video' && userExportVidRefs.current.bowing && userExportVidRefs.current.bowing.duration) {
          BOW_DURATION = userExportVidRefs.current.bowing.duration;
      }
      
      const OUTRO_DURATION = 6; // Chạy vái lạy 6 giây theo yêu cầu (5-7s)

      // TRÍCH XUẤT CẤU HÌNH CAMERA ĐÃ CHỌN TỪ UI TRƯỚC KHI VÀO VÒNG LẶP RENDER
      const activeCamConfig = cameraPresets.find(c => c.id === selectedCamId) || cameraPresets[0];
      exportAudioCtxRef.current.activeCamType = activeCamConfig.type;

      userTalkingBlocks.forEach(block => {
          // Ngay sau khi Người hỏi nói xong 1 khối liền mạch, lập tức chuyển sang trạng thái Lạy
          userBowingBlocks.push({ start: block.end, end: block.end + BOW_DURATION });
      });

      // --- TỐI ƯU HÓA BỘ NHỚ TRƯỚC KHI VÀO VÒNG LẶP RENDER (CHỐNG RỚT FRAME) ---
      // Khởi tạo các mảng dữ liệu 1 lần duy nhất để không bị Garbage Collection (dọn rác) làm giật hình
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      
      let preWarmedUserBowing = false;
      let preWarmedUserTalking = false;
      let preWarmedLaoTalking = false;

      // --- TÂM AN TỐI ƯU BẬC CAO: BỘ NHỚ ĐỆM PHỤ ĐỀ (TEXT CACHING) ---
      // Vẽ chữ tốn rất nhiều CPU. Ta sẽ vẽ chữ 1 lần vào Canvas ẩn, 
      // sau đó chỉ việc copy (drawImage) hình ảnh chữ đó ra màn hình 60 lần/giây.
      const subtitleCacheCanvas = document.createElement('canvas');
      subtitleCacheCanvas.width = width;
      subtitleCacheCanvas.height = height;
      const subtitleCacheCtx = subtitleCacheCanvas.getContext('2d', { alpha: true });
      let cachedActiveText = null;

      // --- TÂM AN AI: KHỞI TẠO BỘ NÃO KIỂM DUYỆT ĐIỀU TIẾT ĐỘNG ---
      const aiModerator = {
          status: '✨ Chất lượng tối đa (Mượt mà)',
          scale: 1.0, // Tỉ lệ can thiệp nội suy (1.0 là nguyên bản 4K)
          slowFrames: 0,
          fixedDrops: 0,
          fixedFlickers: 0,
          lastLogTime: 0
      };
      exportAudioCtxRef.current.aiModerator = aiModerator;

      // --- ĐỒNG BỘ HÓA KHUNG HÌNH 0 (CHỐNG NHÁY KHI RENDER LẦN 2) ---
      // Xóa bỏ những rác khung hình cuối của lượt render trước
      exportAudioCtxRef.current.laoLastValidCanvas = null;
      exportAudioCtxRef.current.userLastValidCanvas = null;

      const resetAndPause = (vid) => {
          if (vid) {
              vid.pause();
              vid.currentTime = 0.05; // Đẩy qua 0 một chút để chắc chắn có hình, không bị kẹt frame đen
          }
      };

      ['idle', 'talking'].forEach(t => resetAndPause(laoExportVidRefs.current[t]));
      ['idle', 'talking', 'bowing'].forEach(t => resetAndPause(userExportVidRefs.current[t]));
      // TÂM AN FIX: Lấy đúng ID của video dựng sẵn để reset (Không dùng tên role chung chung)
      ffScenesRef.current.forEach(scene => resetAndPause(ffVidRefs.current[scene.id])); 
      
      customBgs.forEach(bg => {
          if (bg.type === 'video' && bg.visible !== false) {
              const vObj = bgVideoRefs.current[bg.id];
              if (vObj) {
                  vObj.lastValidCanvas = null;
                  vObj.activeKey = 'A'; // Luôn khởi tạo lại với bản sao A
                  if (vObj.chromaCtx && vObj.chromaCanvas) {
                      vObj.chromaCtx.clearRect(0, 0, vObj.chromaCanvas.width, vObj.chromaCanvas.height);
                  }
                  resetAndPause(vObj.elementA);
                  resetAndPause(vObj.elementB);
              }
          }
      });

      // Đợi tất cả video tua về frame đầu hoàn tất trước khi bấm máy chạy
      const waitForSeek = (vid) => {
          return new Promise(resolve => {
              if (!vid) return resolve();
              vid.currentTime = 0.05; // Ép tua lại
              if (!vid.seeking) return resolve();
              const onSeeked = () => { vid.removeEventListener('seeked', onSeeked); resolve(); };
              vid.addEventListener('seeked', onSeeked);
              setTimeout(() => { vid.removeEventListener('seeked', onSeeked); resolve(); }, 1500); // Timeout an toàn
          });
      };

      // TÂM AN FIX V6: Đợi tua mồi cho TẤT CẢ bản sao video (A và B)
      const bgWaitPromises = customBgs.reduce((acc, bg) => {
          if (bg.type === 'video') {
              acc.push(waitForSeek(bgVideoRefs.current[bg.id]?.elementA));
              acc.push(waitForSeek(bgVideoRefs.current[bg.id]?.elementB));
          }
          return acc;
      }, []);

      await Promise.all([
          waitForSeek(laoExportVidRefs.current.idle),
          waitForSeek(laoExportVidRefs.current.talking),
          waitForSeek(userExportVidRefs.current.idle),
          waitForSeek(userExportVidRefs.current.talking),
          waitForSeek(userExportVidRefs.current.bowing),
          // TÂM AN FIX: Lấy đúng ID của video dựng sẵn để đợi mồi hình
          ...ffScenesRef.current.map(scene => waitForSeek(ffVidRefs.current[scene.id])), 
          ...bgWaitPromises
      ]);

      // Kích hoạt RVFC cho toàn bộ diễn viên và bối cảnh kép
      ['idle', 'talking'].forEach(t => attachRVFC(laoExportVidRefs.current[t]));
      ['idle', 'talking', 'bowing'].forEach(t => attachRVFC(userExportVidRefs.current[t]));
      // TÂM AN FIX: Lấy đúng ID của video dựng sẵn để gắn bộ máy bắt hình
      ffScenesRef.current.forEach(scene => attachRVFC(ffVidRefs.current[scene.id]));

      customBgs.forEach(bg => { 
          if (bg.type === 'video') {
              attachRVFC(bgVideoRefs.current[bg.id]?.elementA);
              attachRVFC(bgVideoRefs.current[bg.id]?.elementB);
          } 
      });

      // --- KHỞI ĐỘNG VIDEO XUẤT MƯỢT MÀ ---
      customBgs.forEach(bg => {
          if (bg.type === 'video' && bg.visible !== false) {
              const vObj = bgVideoRefs.current[bg.id];
              // Chỉ play bản sao A để mồi
              if (vObj && vObj.elementA) { vObj.elementA.play().catch(()=>{}); }
          }
      });

      // TUYỆT KỸ 1: Video IDLE luôn luôn PLAY tự do ở chế độ NATIVE LOOP.
      ['idle'].forEach(t => { 
          if(laoExportVidRefs.current[t]) { laoExportVidRefs.current[t].play().catch(()=>{}); }
          if(userExportVidRefs.current[t]) { userExportVidRefs.current[t].play().catch(()=>{}); }
      });
      // Phát tự do Video Dựng Sẵn (TÂM AN FIX: Cấm video Outro phát trước để chờ đến cuối mới chạy từ đầu)
      ffScenesRef.current.forEach(scene => { 
          if(scene.role !== 'outro' && ffVidRefs.current[scene.id]) { 
              ffVidRefs.current[scene.id].play().catch(()=>{}); 
          }
      });

      // --- TỐI ƯU HÓA BẬC CAO: PRE-RENDER (VẼ SẴN) CÁC HIỆU ỨNG NẶNG ---
      // 1. Cache Filter String (Màu sắc)
      const cachedHarmonizeFilter = enableAutoHarmonization ? getHarmonizeFilter(harmonizeSettings) : 'none';

      // TÂM AN TỐI ƯU: Pre-render Nền Overscan Gradient tĩnh (Tránh việc gọi lệnh tạo Gradient 60 lần/giây)
      const OVERSCAN_FACTOR = 1.6;
      const bgGradientCache = document.createElement('canvas');
      bgGradientCache.width = width * OVERSCAN_FACTOR;
      bgGradientCache.height = height * OVERSCAN_FACTOR;
      const bgGradCtx = bgGradientCache.getContext('2d', { alpha: false });
      const mainGrad = bgGradCtx.createRadialGradient(
          (width * OVERSCAN_FACTOR)/2, (height * OVERSCAN_FACTOR)/2, height/4, 
          (width * OVERSCAN_FACTOR)/2, (height * OVERSCAN_FACTOR)/2, height * OVERSCAN_FACTOR
      );
      mainGrad.addColorStop(0, '#1e293b');
      mainGrad.addColorStop(1, '#020617');
      bgGradCtx.fillStyle = mainGrad;
      bgGradCtx.fillRect(0, 0, width * OVERSCAN_FACTOR, height * OVERSCAN_FACTOR);

      // 3. Pre-render Lớp sương mờ điện ảnh (Vignette) cố định ở màn hình
      const vignetteCache = document.createElement('canvas');
      vignetteCache.width = width;
      vignetteCache.height = height;
      const vCtx = vignetteCache.getContext('2d');
      const vGrad = vCtx.createRadialGradient(width/2, height/2, height * 0.3, width/2, height/2, height * 1.5);
      vGrad.addColorStop(0, 'rgba(2, 6, 23, 0.0)'); 
      vGrad.addColorStop(1, 'rgba(2, 6, 23, 0.6)'); 
      vCtx.fillStyle = vGrad;
      vCtx.fillRect(0, 0, width, height);

      // 4. Index Tracker (Thay thế .find() và .some() tốn kém)
      let currentSubIdx = 0;
      let currentLaoBlockIdx = 0;
      let currentUserBlockIdx = 0;
      let currentBowingBlockIdx = 0;

      let animationFrameId;
      let absoluteStartTime = audioCtx.currentTime; 
      let isRecordingActive = false; 
      let camera = { x: width/2, y: height/2, scale: 1 };
      
      let prevUserState = 'idle';
      let prevLaoState = 'idle';

      // Khởi tạo bộ theo dõi nội soi (Profiler)
      renderDiagnosticsRef.current = {
          startTime: performance.now(),
          endTime: 0,
          totalFrames: 0,
          droppedFrames: 0,
          slowFrames: 0,
          chromaProcessingTimes: [],
          drawTimes: [],
          resolution: `${width}x${height}`,
          fxEnabled: enableAutoHarmonization,
          errors: []
      };

      // Khởi tạo các cờ theo dõi Lookahead (Chạy đè)
      exportAudioCtxRef.current.preWarmedUserBowing = false;
      exportAudioCtxRef.current.preWarmedUserTalking = false;
      exportAudioCtxRef.current.preWarmedLaoTalking = false;

      // --- TÂM AN FIX: TRẢ LẠI HÀM ĐỒNG BỘ GỐC CHO BACKGROUND ---
      const syncVideoPlayback = (v, settings, stateStartTime, currentGlobalTime) => {
          if (!v || v.readyState < 2 || !v.duration) return;
          
          // TÂM AN FIX TRIỆT ĐỂ: Giao phó 100% việc lặp cho phần cứng (GPU) của trình duyệt.
          // Loại bỏ hoàn toàn các lệnh ép tua (currentTime) bằng Javascript để chống rớt frame.
          if (v.paused) {
              v.play().catch(()=>{});
          }
      };

      // TÂM AN FIX TRỌNG ĐIỂM: LOẠI BỎ FPS THROTTLING
      // Cho phép requestAnimationFrame chạy mượt mà ở tốc độ tối đa của màn hình (thường là 60fps).
      // Trình MediaRecorder sẽ tự động "trích xuất" 30 khung hình/giây từ Canvas một cách êm ái nhất.
      
      const drawFrame = () => {
        if (!exportAudioCtxRef.current) return;
        const frameStartTime = performance.now();
        exportAnimFrameRef.current = requestAnimationFrame(drawFrame);

        // Truy xuất Cổng Kiểm duyệt AI
        const aiMod = exportAudioCtxRef.current.aiModerator;

        const absoluteCurrentTime = isRecordingActive ? (audioCtx.currentTime - absoluteStartTime) : 0;
        
        // TÂM AN FIX: Tính toán thời gian Sync (Trừ đi Intro)
        const isIntro = enableIntroRef.current && absoluteCurrentTime < INTRO_DUR; // TÂM AN FIX: Dùng Ref
        const currentTime = Math.max(0, absoluteCurrentTime - INTRO_DUR);

        // Kết thúc Video (Bao gồm cả Intro)
        if (isRecordingActive && absoluteCurrentTime >= INTRO_DUR + totalDuration + OUTRO_DURATION) {
           recorder.stop();
           if (exportAnimFrameRef.current) cancelAnimationFrame(exportAnimFrameRef.current);
           if (renderDiagnosticsRef.current) {
               renderDiagnosticsRef.current.endTime = performance.now();
               setDiagnosticReport(buildDiagnosticReport(renderDiagnosticsRef.current));
           }
           return;
        }

        analyser.getByteFrequencyData(dataArray);
        let speechEnergy = 0;
        for (let i = 2; i < 15; i++) speechEnergy += dataArray[i];
        let targetMouthOpen = (Math.max(0, (speechEnergy / 13) - 15) / 80) * 20;
        const mouthState = Math.round(Math.min(Math.max(targetMouthOpen, 0), 20) / 2) * 2; 

        const ct = currentTime; // Bây giờ ct đã được đồng bộ chuẩn sau khi trừ Intro
        let isOutro = ct > totalDuration;

        // TÂM AN FIX: Kích hoạt video Outro chạy chính xác TỪ ĐẦU ngay khi bước vào cảnh Outro
        if (isOutro && !exportAudioCtxRef.current.hasTriggeredOutro) {
            exportAudioCtxRef.current.hasTriggeredOutro = true;
            if (isFullFrameModeRef.current) {
                const outroScene = ffScenesRef.current.find(s => s.role === 'outro' && s.url);
                if (outroScene && ffVidRefs.current[outroScene.id]) {
                    const outroVid = ffVidRefs.current[outroScene.id];
                    outroVid.currentTime = 0.01; // Ép tua lại từ đầu
                    outroVid.play().catch(()=>{});
                }
            }
        }

        // TỐI ƯU HÓA: Dùng con trỏ Index trên trục thời gian Tịnh Tiến (State Machine)
        while (currentLaoBlockIdx < laoTalkingBlocks.length && laoTalkingBlocks[currentLaoBlockIdx].end < ct) currentLaoBlockIdx++;
        while (currentUserBlockIdx < userTalkingBlocks.length && userTalkingBlocks[currentUserBlockIdx].end < ct) currentUserBlockIdx++;
        while (currentBowingBlockIdx < userBowingBlocks.length && userBowingBlocks[currentBowingBlockIdx].end < ct) currentBowingBlockIdx++;
        while (currentSubIdx < groupedMetadata.length && (groupedMetadata[currentSubIdx].end + 0.2) < ct) currentSubIdx++;

        let isLaoSpeaking = currentLaoBlockIdx < laoTalkingBlocks.length && ct >= laoTalkingBlocks[currentLaoBlockIdx].start;
        let isUserSpeaking = currentUserBlockIdx < userTalkingBlocks.length && ct >= userTalkingBlocks[currentUserBlockIdx].start;
        let isUserBowing = currentBowingBlockIdx < userBowingBlocks.length && ct >= userBowingBlocks[currentBowingBlockIdx].start;
        let activeBowingBlock = isUserBowing ? userBowingBlocks[currentBowingBlockIdx] : null;

        // Quyền ưu tiên: Lão cất tiếng thì User lập tức ngưng lạy để lấy không gian trang nghiêm
        if (isLaoSpeaking) { 
            isUserBowing = false; 
            activeBowingBlock = null; 
        }

        if (isOutro) { isUserBowing = true; isUserSpeaking = false; isLaoSpeaking = false; }

        const currentSegment = currentSubIdx < groupedMetadata.length ? groupedMetadata[currentSubIdx] : null;
        let activeText = "";
        if (currentSegment && ct >= (currentSegment.start - 0.2) && !isOutro) {
            activeText = currentSegment.text.trim();
        }

        // TÂM AN LÕI MỚI: Ép cứng quyền ưu tiên hiển thị để giải quyết triệt để lỗi đứng hình
        if (isLaoSpeaking && isUserSpeaking) {
            if (currentSegment && currentSegment.role === 'ai') isUserSpeaking = false;
            else isLaoSpeaking = false;
        }

        let currentUserState = isUserSpeaking ? 'talking' : (isUserBowing ? 'bowing' : 'idle');
        let currentLaoState = isLaoSpeaking ? 'talking' : 'idle';

        // Ghi nhớ vai trò trên màn hình (Screen Role) cho Camera 3D và Full Frame (Quyết định ai đang chiếm toàn màn hình)
        let activeScreenRole = isOutro ? 'user' : (isUserSpeaking ? 'user' : (isLaoSpeaking ? 'ai' : (isUserBowing ? 'user' : (exportAudioCtxRef.current.lastScreenRole || 'ai'))));
        exportAudioCtxRef.current.lastScreenRole = activeScreenRole;

        // Khám phá Mồi đạn Video từ xa (Lookahead 0.8s) để báo trước trình duyệt nạp Video
        const lookAheadCt = ct + 0.8;
        let isNextUserSpeaking = (currentUserBlockIdx < userTalkingBlocks.length && userTalkingBlocks[currentUserBlockIdx].start <= lookAheadCt && !isUserSpeaking);
        let isNextLaoSpeaking = (currentLaoBlockIdx < laoTalkingBlocks.length && laoTalkingBlocks[currentLaoBlockIdx].start <= lookAheadCt && !isLaoSpeaking);
        let isNextUserBowing = (currentBowingBlockIdx < userBowingBlocks.length && userBowingBlocks[currentBowingBlockIdx].start <= lookAheadCt && !isUserBowing);

        // Mồi Đạn Video Vái Lạy TỪ SỚM
        if (isNextUserBowing && !isUserBowing) {
            if (!exportAudioCtxRef.current.preWarmedUserBowing && userVisualType === 'video' && userExportVidRefs.current.bowing) {
                userExportVidRefs.current.bowing.currentTime = 0.01; 
                userExportVidRefs.current.bowing.pause(); 
                exportAudioCtxRef.current.preWarmedUserBowing = true; 
            }
        } else if (isUserBowing) {
            exportAudioCtxRef.current.preWarmedUserBowing = false;
        }

        // Mồi Đạn Video User Nói TỪ SỚM 1.5s
        if (isNextUserSpeaking && !isUserSpeaking) {
            if (!exportAudioCtxRef.current.preWarmedUserTalking && userVisualType === 'video' && userExportVidRefs.current.talking) {
                userExportVidRefs.current.talking.currentTime = 0.01; 
                userExportVidRefs.current.talking.pause();
                exportAudioCtxRef.current.preWarmedUserTalking = true; 
            }
        } else if (isUserSpeaking) {
            exportAudioCtxRef.current.preWarmedUserTalking = false;
        }

        // Mồi Đạn Video Lão Nói TỪ SỚM 1.5s
        if (isNextLaoSpeaking && !isLaoSpeaking) {
            if (!exportAudioCtxRef.current.preWarmedLaoTalking && laoVisualType === 'video' && laoExportVidRefs.current.talking) {
                 laoExportVidRefs.current.talking.currentTime = 0.01; 
                 laoExportVidRefs.current.talking.pause();
                 exportAudioCtxRef.current.preWarmedLaoTalking = true;
            }
        } else if (isLaoSpeaking) {
            exportAudioCtxRef.current.preWarmedLaoTalking = false;
        }

        // --- TÂM AN FIX: THUẬT TOÁN ĐỒNG BỘ VIDEO CHUẨN NHƯ KHUNG CHAT (MiniLaoFace) ---
        let isLaoActuallySpeaking = isLaoSpeaking;
        let isUserActuallySpeaking = isUserSpeaking;
        
        // 1. Phát động chuyển cảnh & Quản lý Video Lão
        if (currentLaoState !== prevLaoState) {
            exportAudioCtxRef.current.laoStateStartTime = ct;
            prevLaoState = currentLaoState;
        }
        
        if (laoVisualType === 'video') {
            const activeLaoVid = laoExportVidRefs.current[currentLaoState];

            // TÂM AN FIX: TUYỆT ĐỐI KHÔNG DỪNG HAY RESET VIDEO 'idle'. Nó phải luôn chạy ngầm để mượt.
            if (currentLaoState === 'idle') {
                const talkingVid = laoExportVidRefs.current['talking'];
                if (talkingVid && !talkingVid.paused) {
                    talkingVid.pause();
                    talkingVid.currentTime = 0.01; 
                }
            }

            // Chạy video đang active theo CƠ CHẾ NATIVE CỦA KHUNG CHAT
            if (activeLaoVid) {
                if (laoChromaSettings.loopMode === 'boomerang') {
                    syncVideoPlayback(activeLaoVid, laoChromaSettings, exportAudioCtxRef.current.laoStateStartTime, ct);
                } else {
                    // Cơ chế tự nhiên: Dừng hình giữa các câu nói, không bao giờ tua băng
                    if (currentLaoState === 'talking') {
                        if (isLaoActuallySpeaking) {
                            if (activeLaoVid.paused) activeLaoVid.play().catch(()=>{}); // Đang có tiếng -> Chạy
                        } else {
                            if (!activeLaoVid.paused) activeLaoVid.pause(); // Nghỉ lấy hơi -> Pause giữ nguyên khung hình
                        }
                    } else {
                        if (activeLaoVid.paused) activeLaoVid.play().catch(()=>{}); // Video Nghe -> Chạy tự do
                    }
                    
                    // TÂM AN FIX TỐI THƯỢNG: ĐÃ XÓA CƠ CHẾ TUA TAY (activeLaoVid.currentTime = 0.05).
                }
            }
        }

        // 2. Phát động chuyển cảnh & Quản lý Video Người Hỏi
        if (currentUserState !== prevUserState) {
            exportAudioCtxRef.current.userStateStartTime = ct;
            prevUserState = currentUserState;
        }

        if (userVisualType === 'video') {
            const activeUserVid = userExportVidRefs.current[currentUserState];
            
            // TÂM AN FIX: TUYỆT ĐỐI KHÔNG DỪNG HAY RESET VIDEO 'idle'. Chỉ dừng 'talking' và 'bowing'.
            ['talking', 'bowing'].forEach(state => {
                if (state !== currentUserState) {
                    const inactiveVid = userExportVidRefs.current[state];
                    if (inactiveVid) {
                        if (!inactiveVid.paused) inactiveVid.pause();
                        // TÂM AN FIX: Bắt buộc reset mọi video hành động (kể cả lạy) về đầu để sẵn sàng cho lần gọi tiếp theo
                        inactiveVid.currentTime = 0.01; 
                    }
                }
            });

            // Chạy video đang active theo CƠ CHẾ NATIVE
            if (activeUserVid) {
                if (userChromaSettings.loopMode === 'boomerang') {
                    syncVideoPlayback(activeUserVid, userChromaSettings, exportAudioCtxRef.current.userStateStartTime, ct);
                } else {
                    if (currentUserState === 'talking') {
                        if (isUserActuallySpeaking) {
                            if (activeUserVid.paused) activeUserVid.play().catch(()=>{});
                        } else {
                            if (!activeUserVid.paused) activeUserVid.pause();
                        }
                    } else {
                        // Idle và Bowing đều cho phép phát tự do và lặp lại
                        if (activeUserVid.paused) activeUserVid.play().catch(()=>{});
                    }
                    
                    // TÂM AN FIX TỐI THƯỢNG: ĐÃ XÓA CƠ CHẾ TUA TAY (activeUserVid.currentTime = 0.05).
                }
            }
        }
        // --- KẾT THÚC CHUYỂN CẢNH ---

        const { laoW, laoH, laoX, laoY, userW, userH, userX, userY, isPortrait, isSquare, refWidth, refHeight } = calculatePositions(width, height);
        
        // Tọa độ cuối cùng của nhân vật
        const finalLaoW = laoW * charOffsets.lao.s;
        const finalLaoH = laoH * charOffsets.lao.s;
        const finalLaoX = laoX + (refWidth * (charOffsets.lao.x / 100));
        const finalLaoY = laoY + (refHeight * (charOffsets.lao.y / 100));

        const finalUserW = userW * charOffsets.user.s;
        const finalUserH = userH * charOffsets.user.s;
        const finalUserX = userX + (refWidth * (charOffsets.user.x / 100));
        const finalUserY = userY + (refHeight * (charOffsets.user.y / 100));

        // TỐI ƯU HÓA: Cam logic
        let currentCamRole = activeScreenRole;
        // TÂM AN FIX: Xác định ID của cảnh quay hiện tại dựa trên ID đoạn thoại (msgId)
        let currentShotId = (currentSegment && currentSegment.msgId) ? currentSegment.msgId : 'outro';
        if (isOutro) currentShotId = 'outro';
        if (isUserBowing) currentShotId = `bowing_${currentBowingBlockIdx}`; // Tách riêng cảnh vái lạy
        
        // Cấp phát Shot quay mới khi đổi cảnh quay HOẶC đổi người nói
        if (!exportAudioCtxRef.current.camState || 
            exportAudioCtxRef.current.lastCamRole !== currentCamRole || 
            exportAudioCtxRef.current.lastShotId !== currentShotId) {
            
            let shotStart = ct;
            let shotEnd = ct + 8; // Mặc định cho shot kéo dài 8s để lia máy thật chậm

            if (isUserBowing && activeBowingBlock) {
                shotStart = activeBowingBlock.start;
                shotEnd = activeBowingBlock.end;
            } else if (currentSegment && !isOutro) {
                // TÂM AN FIX: Trải dài thời gian Zoom Camera ra TOÀN BỘ độ dài của Video cảnh quay đó
                // Thay vì chỉ zoom trong 1 câu nói ngắn khiến camera bị khựng lại giữa chừng
                const allSegmentsInScene = groupedMetadata.filter(m => m.msgId === currentShotId);
                if (allSegmentsInScene.length > 0) {
                    shotStart = allSegmentsInScene[0].start;
                    shotEnd = allSegmentsInScene[allSegmentsInScene.length - 1].end;
                } else {
                    shotStart = currentSegment.start;
                    shotEnd = currentSegment.end;
                }
            }

            let startX, startY, startScale, endX, endY, endScale;

            // --- TÂM AN LÕI MỚI: ĐẠO DIỄN CAMERA ĐIỆN ẢNH CHO CHẾ ĐỘ DỰNG SẴN TOÀN CẢNH ---
            if (isFullFrameModeRef.current) {
                
                if (currentCamRole === 'outro') {
                    // Cảnh Outro: Lùi từ từ ra xa toàn cảnh
                    startX = width / 2; startY = height / 2; startScale = 1.15;
                    endX = width / 2; endY = height / 2; endScale = 1.0;
                } else {
                    const isUserCamera = currentCamRole === 'user';
                    
                    // Mượn tọa độ X, Y từ bảng điều khiển "Vị trí Lão/Người Hỏi" làm Hồng tâm khuôn mặt
                    const charX = isUserCamera ? finalUserX : finalLaoX;
                    const charY = isUserCamera ? finalUserY + finalUserH * 0.25 : finalLaoY + finalLaoH * 0.25;

                    // Tọa độ chuẩn của khuôn mặt trên màn hình
                    const faceX = width / 2 + (charX - width / 2) * 0.5;
                    const faceY = height / 2 + (charY - height / 2) * 0.35;

                    // TÂM AN FIX: Random ngẫu nhiên giữa Zoom In (Tiến lại gần) và Zoom Out (Lùi ra xa)
                    const isZoomIn = Math.random() > 0.5;

                    if (isZoomIn) {
                        // Phóng to dần vào mặt (Cảm giác tập trung, nhấn mạnh)
                        startScale = 1.1; 
                        endScale = 1.35;
                    } else {
                        // Thu nhỏ dần từ mặt ra (Cảm giác kể chuyện, toàn cảnh)
                        startScale = 1.35; 
                        endScale = 1.1;
                    }

                    // TÂM AN FX: Thêm một chút Lia ngang (Pan) nhẹ nhàng để khung hình không bị tĩnh một chỗ
                    const panOffset = width * 0.015; // Lia biên độ rất nhỏ
                    const isPanLeft = Math.random() > 0.5;

                    startX = isPanLeft ? faceX - panOffset : faceX + panOffset;
                    endX = isPanLeft ? faceX + panOffset : faceX - panOffset;
                    
                    // Khóa dọc tại khuôn mặt
                    startY = faceY;
                    endY = faceY;
                    
                    // TÂM AN CẬP NHẬT: Nếu là đoạn thoại Intro Hook, phóng to thêm 35% để đặc tả sắc thái mỉa mai của Lão
                    if (currentSegment && currentSegment.emotion === 'hook') {
                        startScale *= 1.35;
                        endScale *= 1.35;
                    }
                }

            } else {
                // --- THUẬT TOÁN CAMERA CHO KHÔNG GIAN 3D CŨ (PHÔNG XANH) ---
                const isUserCamera = currentCamRole === 'user';
                const charX = isUserCamera ? finalUserX : finalLaoX;
                const charY = isUserCamera ? finalUserY + finalUserH * 0.30 : finalLaoY + finalLaoH * 0.30;
                const charCenterOffset = isPortrait ? 0 : (isUserCamera ? (finalLaoX - finalUserX) * 0.05 : -(finalLaoX - finalUserX) * 0.05);
                
                let baseX = charX + charCenterOffset;
                let baseY = isPortrait ? charY - (height * 0.02) : charY;
                let baseScale = isPortrait || isSquare ? 1.25 : 1.35;
                
                let faceZoom = isPortrait || isSquare ? 0.15 : 0.35; 
                let maxPanX = width * (isPortrait || isSquare ? 0.02 : 0.04); 
                let maxPanY = height * 0.04;

                startX = baseX; startY = baseY; startScale = baseScale;
                endX = baseX; endY = baseY; endScale = baseScale;
                const maxZoom = 0.12; 
                
                let actualShotType = exportAudioCtxRef.current.activeCamType;
                
                if (actualShotType === 'random') {
                    const allTypes = ['focus_zoom_out', 'focus_pan', 'static', 'slow_zoom_in', 'float', 'low_angle_up', 'high_angle_down', 'micro_move'];
                    actualShotType = allTypes[Math.floor(Math.random() * allTypes.length)];
                } else if (actualShotType === 'dynamic') {
                    const dynamicShots = ['focus_zoom_out', 'focus_pan', 'slow_zoom_in', 'high_angle_down'];
                    actualShotType = dynamicShots[Math.floor(Math.random() * dynamicShots.length)];
                }

                switch(actualShotType) {
                    case 'focus_zoom_out': 
                        startScale = baseScale + faceZoom; endScale = baseScale;
                        startY = baseY - (height * (isPortrait ? 0.03 : 0.1)); endY = baseY;
                        break;
                    case 'focus_pan': 
                        startScale = baseScale + Math.max(0, faceZoom - 0.1); endScale = baseScale + Math.max(0, faceZoom - 0.1);
                        startY = baseY - (height * (isPortrait ? 0.02 : 0.08)); endY = baseY - (height * (isPortrait ? 0.02 : 0.08));
                        startX = baseX + maxPanX; endX = baseX - maxPanX;
                        break;
                    case 'static': 
                        break;
                    case 'slow_zoom_in': 
                        endScale = baseScale + maxZoom + 0.05; endY = baseY - (height * 0.05); 
                        break;
                    case 'float': 
                        startScale = baseScale + 0.08; endScale = baseScale + 0.08;
                        startX = baseX + (Math.random() * maxPanX - maxPanX/2); endX = baseX + (Math.random() * maxPanX - maxPanX/2);
                        startY = baseY + (Math.random() * maxPanY - maxPanY/2); endY = baseY + (Math.random() * maxPanY - maxPanY/2);
                        break;
                    case 'low_angle_up': 
                        startScale = baseScale + 0.1; endScale = baseScale + 0.1;
                        startY = baseY + maxPanY; endY = baseY - maxPanY;
                        break;
                    case 'high_angle_down': 
                        startScale = baseScale + 0.1; endScale = baseScale + 0.1;
                        startY = baseY - maxPanY; endY = baseY + maxPanY;
                        break;
                    case 'micro_move': 
                        startScale = baseScale + 0.03; endScale = baseScale + 0.03;
                        startX = baseX + (width * 0.015); endX = baseX - (width * 0.015);
                        break;
                    case 'zoom_in_slow':
                        endScale = baseScale + maxZoom;
                        break;
                    case 'zoom_out_slow':
                        startScale = baseScale + maxZoom;
                        break;
                    case 'pan_left_slow':
                        startScale = baseScale + 0.05; endScale = baseScale + 0.05;
                        startX = baseX + maxPanX; endX = baseX - maxPanX;
                        break;
                    case 'pan_right_slow':
                        startScale = baseScale + 0.05; endScale = baseScale + 0.05;
                        startX = baseX - maxPanX; endX = baseX + maxPanX;
                        break;
                    case 'float_up_slow':
                        startScale = baseScale + 0.05; endScale = baseScale + 0.05;
                        startY = baseY + maxPanY; endY = baseY - maxPanY;
                        break;
                }
                
                // TÂM AN CẬP NHẬT: Nếu là đoạn thoại Intro Hook, phóng to thêm 35%
                if (currentSegment && currentSegment.emotion === 'hook') {
                    startScale *= 1.35;
                    endScale *= 1.35;
                }
            }

            // TÂM AN: Random hiệu ứng chuyển cảnh khi khởi tạo góc máy mới
            let actualTransType = videoTransitionRef.current;
            if (actualTransType === 'random') {
                const transTypes = ['fade_black', 'fade_white', 'blur'];
                actualTransType = transTypes[Math.floor(Math.random() * transTypes.length)];
            }

            exportAudioCtxRef.current.camState = {
                role: currentCamRole,
                shotId: currentShotId,
                start: shotStart,
                end: shotEnd,
                startX, startY, startScale,
                endX, endY, endScale,
                transitionType: actualTransType,
                transitionDuration: videoTransitionDurationRef.current
            };
            exportAudioCtxRef.current.lastCamRole = currentCamRole;
            exportAudioCtxRef.current.lastShotId = currentShotId;

            // Nhảy góc máy ngay lập tức (Cắt cảnh Cinematic) để triệt tiêu hiện tượng quét nhòe hình
            camera.x = startX;
            camera.y = startY;
            camera.scale = startScale;
        }

        const camState = exportAudioCtxRef.current.camState;
        let targetX = width/2;
        let targetY = height/2;
        let targetScale = 1;

        if (!isOutro) {
            // Tỷ lệ % tiến trình của đoạn hội thoại (từ 0.0 đến 1.0)
            let progress = Math.max(0, Math.min(1, (ct - camState.start) / (camState.end - camState.start)));
            
            const easeProgress = progress < 0.5 
                ? 4 * progress * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 3) / 2;

            targetX = camState.startX + (camState.endX - camState.startX) * easeProgress;
            targetY = camState.startY + (camState.endY - camState.startY) * easeProgress;
            targetScale = camState.startScale + (camState.endScale - camState.startScale) * easeProgress;

            camera.x = targetX;
            camera.y = targetY;
            camera.scale = targetScale;
        } else {
             // Outro
             if (exportAudioCtxRef.current.activeCamType === 'static' || isFullFrameModeRef.current) {
                 // Giữ nguyên tọa độ máy tĩnh ở cuối
             } else {
                 targetX = width / 2;
                 targetY = height / 2;
                 targetScale = 1;
                 camera.x += (targetX - camera.x) * 0.03;
                 camera.y += (targetY - camera.y) * 0.03;
                 camera.scale += (targetScale - camera.scale) * 0.03;
             }
        }

        // TÂM AN FIX CHỐNG TRÀN VIỀN ĐEN TUYỆT ĐỐI (CAMERA CLAMPING V2)
        const viewHalfW = width / (2 * camera.scale);
        const viewHalfH = height / (2 * camera.scale);
        
        let safeMinX = viewHalfW;
        let safeMaxX = width - viewHalfW;
        let safeMinY = viewHalfH;
        let safeMaxY = height - viewHalfH;

        if (isFullFrameModeRef.current) {
            // TÂM AN FIX TRỌNG ĐIỂM: Khóa khung hình Dựng Sẵn
            // Khung hình dựng sẵn luôn vừa khít Canvas. 
            // Ta đã Zoom lên (VD: 1.15x), nên viewHalfW < width/2.
            // Do đó safeMinX (viewHalfW) < safeMaxX (width - viewHalfW).
            // Camera chỉ được phép di chuyển trong khoảng dư thừa này, tuyệt đối không lòi viền đen.
        } else {
            // Tính toán ranh giới vật lý của lớp nền ĐANG HIỂN THỊ CHO 3D
            const activeBgForBounds = customBgs.find(b => b.visible !== false);
            if (activeBgForBounds) {
                let sourceW = width;
                let sourceH = height;
                
                if (activeBgForBounds.type === 'image') {
                    const cached = processedBgsRef.current[activeBgForBounds.id];
                    if (cached && cached.element) { sourceW = cached.element.width; sourceH = cached.element.height; }
                } else if (activeBgForBounds.type === 'video') {
                    const vObj = bgVideoRefs.current[activeBgForBounds.id];
                    if (vObj && vObj.element) { sourceW = vObj.videoWidth || width; sourceH = vObj.videoHeight || height; }
                }

                const imgRatio = sourceW / sourceH;
                const canvasRatio = width / height;
                let baseBgW, baseBgH;
                
                if (canvasRatio > imgRatio) { baseBgW = width; baseBgH = width / imgRatio; } 
                else { baseBgH = height; baseBgW = height * imgRatio; }
                
                const OVERSCAN = 1.6;
                baseBgW *= OVERSCAN;
                baseBgH *= OVERSCAN;
                
                const finalBgW = baseBgW * activeBgForBounds.s;
                const finalBgH = baseBgH * activeBgForBounds.s;
                const finalBgX = width/2 + (refWidth * (activeBgForBounds.x / 100));
                const finalBgY = height/2 + (refHeight * (activeBgForBounds.y / 100));

                const bgLeft = finalBgX - finalBgW/2;
                const bgRight = finalBgX + finalBgW/2;
                const bgTop = finalBgY - finalBgH/2;
                const bgBottom = finalBgY + finalBgH/2;

                safeMinX = bgLeft + viewHalfW;
                safeMaxX = bgRight - viewHalfW;
                safeMinY = bgTop + viewHalfH;
                safeMaxY = bgBottom - viewHalfH;

                if (safeMinX > safeMaxX) { const midX = (bgLeft + bgRight)/2; safeMinX = midX; safeMaxX = midX; }
                if (safeMinY > safeMaxY) { const midY = (bgTop + bgBottom)/2; safeMinY = midY; safeMaxY = midY; }
            }

            if (isPortrait || isSquare) {
                safeMinX = Math.min(safeMinX, targetX);
                safeMaxX = Math.max(safeMaxX, targetX);
            }
        }

        // Cưỡng chế Camera nằm gọn trong hộp an toàn
        camera.x = Math.max(safeMinX, Math.min(safeMaxX, camera.x));
        camera.y = Math.max(safeMinY, Math.min(safeMaxY, camera.y));

        // Xóa nền đen một lần
        ctx.fillStyle = '#020617'; 
        ctx.fillRect(0, 0, width, height);
        
        ctx.save();
        // Áp dụng Camera
        ctx.translate(width/2, height/2); 
        ctx.scale(camera.scale, camera.scale);
        ctx.translate(-camera.x, -camera.y);

        if (isFullFrameModeRef.current) {
            // --- CHẾ ĐỘ TOÀN CẢNH DỰNG SẴN (CẮT GHÉP TRỰC TIẾP) ---
            let activeFullFrameImg = null;
            let activeFullFrameFlip = false;

            // TÂM AN LÕI MỚI: Truy xuất Camera Đa Cảm Xúc và Đồng bộ chính xác theo từng Đoạn thoại (msgId)
            const currentMsgEmotion = (currentSegment && currentSegment.emotion) ? currentSegment.emotion : 'calm';
            const currentMsgId = (currentSegment && currentSegment.msgId) ? currentSegment.msgId : null;
            
            let targetRole = isOutro ? 'outro' : activeScreenRole;
            // TÂM AN FIX: Đồng bộ định danh giữa hệ thống Kịch bản ('ai') và Kho Cảnh quay ('lao') để tránh màn hình đen
            if (targetRole === 'ai') {
                targetRole = 'lao';
            }

            const targetEmotion = isOutro ? 'calm' : currentMsgEmotion;

            let matchedScene = null;

            if (isOutro) {
                matchedScene = ffScenesRef.current.find(s => s.role === 'outro' && s.url);
            } else {
                // 1. Ưu tiên Tuyệt đối: Tìm cảnh quay được gán CHÍNH XÁC ID của đoạn hội thoại đang phát
                if (currentMsgId) {
                    matchedScene = ffScenesRef.current.find(s => s.id === currentMsgId && s.url);
                }
                // 2. Dự phòng 1: Tìm theo Role + Emotion nếu không có video dành riêng cho câu thoại đó
                if (!matchedScene) {
                    matchedScene = ffScenesRef.current.find(s => s.role === targetRole && s.emotion === targetEmotion && s.url);
                }
                // 3. Dự phòng 2: Lấy cảnh bất kỳ có cùng Role
                if (!matchedScene) {
                    matchedScene = ffScenesRef.current.find(s => s.role === targetRole && s.url);
                }
            }

            if (matchedScene) {
                const vid = ffVidRefs.current[matchedScene.id];
                activeFullFrameImg = vid?.gpuFrame || vid;
                
                // Fallback nếu GPU chưa sẵn sàng
                if (!activeFullFrameImg && targetRole === 'user' && userVisualType === 'video') {
                    const altVid = userExportVidRefs.current[currentUserState] || userExportVidRefs.current['idle'];
                    activeFullFrameImg = altVid?.gpuFrame || altVid;
                    activeFullFrameFlip = charOffsets.user.flip;
                } else if (!activeFullFrameImg && targetRole === 'lao' && laoVisualType === 'video') {
                    const altVid = laoExportVidRefs.current[currentLaoState] || laoExportVidRefs.current['idle'];
                    activeFullFrameImg = altVid?.gpuFrame || altVid;
                    activeFullFrameFlip = charOffsets.lao.flip;
                }
            } else {
                // FALLBACK TOÀN DIỆN VỀ AVATAR NẾU KHÔNG TẢI BẤT KỲ VIDEO NÀO
                if (targetRole === 'user') {
                    activeFullFrameImg = preloadedUserFrames.current[isUserSpeaking ? mouthState : 0] || preloadedUserFrames.current[0];
                    activeFullFrameFlip = charOffsets.user.flip;
                } else if (targetRole === 'lao') {
                    activeFullFrameImg = preloadedLaoFrames.current[isLaoSpeaking ? mouthState : 0] || preloadedLaoFrames.current[0];
                    activeFullFrameFlip = charOffsets.lao.flip;
                }
            }

            if (activeFullFrameImg) {
                ctx.save();
                ctx.translate(width/2, height/2);
                if (activeFullFrameFlip) ctx.scale(-1, 1);
                ctx.translate(-width/2, -height/2);
                
                const imgW = activeFullFrameImg.width || activeFullFrameImg.videoWidth || 1;
                const imgH = activeFullFrameImg.height || activeFullFrameImg.videoHeight || 1;
                const imgRatio = imgW / imgH;
                const canvasRatio = width / height;
                let renderW, renderH, dx, dy;

                if (canvasRatio > imgRatio) {
                    renderW = width;
                    renderH = width / imgRatio;
                    dx = 0;
                    dy = (height - renderH) / 2;
                } else {
                    renderW = height * imgRatio;
                    renderH = height;
                    dx = (width - renderW) / 2;
                    dy = 0;
                }
                ctx.drawImage(activeFullFrameImg, dx, dy, renderW, renderH);
                ctx.restore();
            }
        } else {

        // --- 1. LỚP NỀN ---
        const OVERSCAN = 1.6; 
        ctx.save();
        
        // TÂM AN TỐI ƯU: Dùng tấm nền gradient đã vẽ sẵn (Cached) thay vì tạo mới
        ctx.drawImage(
            bgGradientCache, 
            0, 0, width * OVERSCAN, height * OVERSCAN, 
            -(width * (OVERSCAN-1)/2), -(height * (OVERSCAN-1)/2), width * OVERSCAN, height * OVERSCAN
        );

        customBgs.filter(bg => bg.visible !== false).forEach(bg => {
            let sourceCanvasOrImage = null;
            let sourceW = 0, sourceH = 0;
            let isVideo = false;

            if (bg.type === 'image') {
                const cached = processedBgsRef.current[bg.id];
                if (cached && cached.element) {
                    sourceCanvasOrImage = cached.element;
                    sourceW = sourceCanvasOrImage.width;
                    sourceH = sourceCanvasOrImage.height;
                }
            } else if (bg.type === 'video') {
                const vObj = bgVideoRefs.current[bg.id];
                if (vObj && vObj.isLoaded) {
                    const activeVid = vObj.activeKey === 'A' ? vObj.elementA : vObj.elementB;
                    const nextVid = vObj.activeKey === 'A' ? vObj.elementB : vObj.elementA;

                    if (activeVid.readyState >= 2) {
                        sourceW = vObj.videoWidth;
                        sourceH = vObj.videoHeight;
                        isVideo = true;

                        // TÂM AN FIX V6: THUẬT TOÁN KẾP HỢP KÉP BỐI CẢNH DÀNH RIÊNG CHO RENDER 4K
                        const OVERLAP = 0.8;
                        let currentCrossfadeAlpha = 0;

                        if (bg.loopMode !== 'boomerang' && activeVid.duration && activeVid.currentTime >= activeVid.duration - OVERLAP) {
                            if (nextVid.paused) {
                                nextVid.currentTime = 0;
                                nextVid.play().catch(()=>{});
                            }
                            currentCrossfadeAlpha = (activeVid.currentTime - (activeVid.duration - OVERLAP)) / OVERLAP;
                            currentCrossfadeAlpha = Math.max(0, Math.min(1, currentCrossfadeAlpha));

                            if (activeVid.currentTime >= activeVid.duration - 0.05 || activeVid.ended) {
                                vObj.activeKey = vObj.activeKey === 'A' ? 'B' : 'A';
                                activeVid.pause();
                                activeVid.currentTime = 0;
                                currentCrossfadeAlpha = 0;
                            }
                        }

                        // Gán dữ liệu sang vObj để bước vẽ Chroma Key bên dưới xử lý
                        vObj.currentCrossfadeAlpha = currentCrossfadeAlpha;
                        vObj.nextVid = nextVid;
                        vObj.activeVid = activeVid;
                    }
                }
            }

            if (sourceW > 0 && sourceH > 0) {
                const imgRatio = sourceW / sourceH;
                const canvasRatio = width / height;
                let baseW, baseH;
                if (canvasRatio > imgRatio) { baseW = width; baseH = width / imgRatio; } 
                else { baseH = height; baseW = height * imgRatio; }
                
                baseW *= OVERSCAN;
                baseH *= OVERSCAN;

                const finalW = baseW * bg.s;
                const finalH = baseH * bg.s;

                if (isVideo) {
                    const vObj = bgVideoRefs.current[bg.id];
                    const activeVid = vObj.activeVid;
                    const nextVid = vObj.nextVid;

                    // Chỉ xử lý Canvas nếu GPU thực sự có khung hình mới
                    if (activeVid && activeVid.readyState >= 2 && !activeVid.seeking) {
                        if (!vObj.chromaCanvas) {
                            vObj.chromaCanvas = document.createElement('canvas');
                            vObj.chromaCtx = vObj.chromaCanvas.getContext('2d', { willReadFrequently: true });
                        }
                        
                        const cCanvas = vObj.chromaCanvas;
                        const cCtx = vObj.chromaCtx;

                        if (cCanvas && cCtx) {
                            // Hạ cấp phân giải Chroma theo lệnh AI Moderator để tránh tràn RAM
                            const MAX_BG_RES = (width >= 2560 ? 1280 : 854) * aiMod.scale; 
                            let procW = sourceW || 1;
                            let procH = sourceH || 1;
                            if (sourceW > MAX_BG_RES) {
                                const r = MAX_BG_RES / sourceW;
                                procW = Math.round(sourceW * r);
                                procH = Math.round(sourceH * r);
                            }
                            
                            if (cCanvas.width !== procW) cCanvas.width = procW;
                            if (cCanvas.height !== procH) cCanvas.height = procH;

                            cCtx.clearRect(0, 0, procW, procH);

                            // BƯỚC 1: VẼ VIDEO CHỦ LÊN CANVAS ẨN
                            cCtx.globalAlpha = 1.0;
                            if (activeVid.gpuFrame) {
                                cCtx.drawImage(activeVid.gpuFrame, 0, 0, procW, procH);
                            } else {
                                cCtx.drawImage(activeVid, 0, 0, procW, procH); // Khung hình mồi
                            }
                            
                            // BƯỚC 2: VẼ ĐÈ VIDEO SAO CHÉP LÊN NẾU ĐANG TRONG KHOẢNG FADE 0.8S
                            if (vObj.currentCrossfadeAlpha > 0 && nextVid && nextVid.readyState >= 2) {
                                cCtx.globalAlpha = vObj.currentCrossfadeAlpha;
                                if (nextVid.gpuFrame) {
                                    cCtx.drawImage(nextVid.gpuFrame, 0, 0, procW, procH);
                                } else {
                                    cCtx.drawImage(nextVid, 0, 0, procW, procH);
                                }
                                cCtx.globalAlpha = 1.0; // Reset độ mờ về 1.0 cho các thao tác sau
                            }
                            
                            // BƯỚC 3: TÁCH NỀN TOÀN BỘ KHUNG HÌNH (ĐÃ LÀM MỜ CHÉO) NẾU CẦN
                            if (bg.chromaType !== 'none') {
                                const cTime = performance.now();
                                processChromaKeyPixels(cCtx, procW, procH, bg);
                                if (renderDiagnosticsRef.current) renderDiagnosticsRef.current.chromaProcessingTimes.push(performance.now() - cTime);
                            }
                            
                            vObj.lastValidCanvas = cCanvas; 
                        }
                    }
                    sourceCanvasOrImage = vObj.lastValidCanvas || activeVid;
                }

                if (sourceCanvasOrImage) {
                    ctx.save();
                    ctx.translate(width/2 + (refWidth * (bg.x / 100)), height/2 + (refHeight * (bg.y / 100)));
                    if (bg.flip) ctx.scale(-1, 1);
                    ctx.drawImage(sourceCanvasOrImage, -finalW/2, -finalH/2, finalW, finalH);
                    ctx.restore();
                }
            }
        });
        ctx.restore(); 

        // --- 2. VẼ NHÂN VẬT ---
        const laoIntensity = isLaoSpeaking ? 1.2 : 0.8;
        const userIntensity = isUserSpeaking ? 1.2 : 0.8;

        const breathCycleLao = Math.sin(ct * Math.PI * 0.8) * laoIntensity; 
        const breathScaleYLao = 1 + (breathCycleLao * 0.01); 
        const breathOffsetYLao = breathCycleLao * (height * 0.003); 

        const breathCycleUser = Math.sin(ct * Math.PI * 1.1) * userIntensity; 
        const breathScaleYUser = 1 + (breathCycleUser * 0.012); 
        const breathOffsetYUser = breathCycleUser * (height * 0.004); 

        const auraCycle1 = (ct % 4) / 4; 
        const auraCycle2 = ((ct + 2) % 4) / 4;
        const headCx = finalLaoX;
        const headCy = finalLaoY + finalLaoH * (95/400);

        const drawAura = (cycle) => {
            const r = (70 + 90 * cycle) * (finalLaoH / 400);
            const alpha = 0.3 * (1 - cycle);
            ctx.beginPath();
            ctx.arc(headCx, headCy, r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
            ctx.fill();
        }
        
        if (showLaoAura) {
            drawAura(auraCycle1);
            drawAura(auraCycle2);
        }

        // --- Lão Render ---
        let laoImgToDraw = null;

        if (laoVisualType === 'video') {
            let activeVid = laoExportVidRefs.current[currentLaoState];
            
            if ((!activeVid || activeVid.readyState < 2) && !exportAudioCtxRef.current.laoLastValidCanvas) {
                activeVid = laoExportVidRefs.current.idle;
            }

            // TÂM AN FIX: Lá chắn thép chống chớp nháy (Iron Shield)
            // Chỉ cập nhật khung hình mới khi video THỰC SỰ có hình mới và không bị kẹt lúc Loop
            if (activeVid && activeVid.readyState >= 2 && !activeVid.seeking) {
                if (!activeVid.chromaCanvas) {
                    activeVid.chromaCanvas = document.createElement('canvas');
                    activeVid.chromaCtx = activeVid.chromaCanvas.getContext('2d', {willReadFrequently: true});
                    activeVid.lastProcessedTime = -1; 
                }
                const cCanvas = activeVid.chromaCanvas;
                const cCtx = activeVid.chromaCtx;

                if (cCanvas && cCtx) {
                    if (activeVid.currentTime !== activeVid.lastProcessedTime) {
                        activeVid.lastProcessedTime = activeVid.currentTime;

                        // TÂM AN AI KIỂM DUYỆT: Giảm tải GPU thông minh dựa theo cảnh báo
                        const MAX_CHAR_RES = (width >= 2560 ? 960 : 640) * aiMod.scale; 
                        let procW = activeVid.videoWidth || 1;
                        let procH = activeVid.videoHeight || 1;
                        if (procW > MAX_CHAR_RES) {
                            const r = MAX_CHAR_RES / procW;
                            procW = Math.round(procW * r);
                            procH = Math.round(procH * r);
                        }
                        
                        if (cCanvas.width !== procW) cCanvas.width = procW;
                        if (cCanvas.height !== procH) cCanvas.height = procH;
                        
                        cCtx.imageSmoothingEnabled = true;
                        cCtx.imageSmoothingQuality = 'high';
                        cCtx.globalCompositeOperation = 'copy';
                        // Lấy hình Lão từ GPU, nếu rỗng lúc Loop thì lấy ảnh gốc giữ độ ổn định
                        if (activeVid.gpuFrame) {
                            cCtx.drawImage(activeVid.gpuFrame, 0, 0, procW, procH);
                        } else {
                            cCtx.drawImage(activeVid, 0, 0, procW, procH);
                        }
                    
                        
                        if (laoChromaSettings.chromaType !== 'none' && !isFullFrameModeRef.current) {
                            const cTime = performance.now();
                            cCtx.globalCompositeOperation = 'source-over';
                            processChromaKeyPixels(cCtx, procW, procH, laoChromaSettings);
                            if (renderDiagnosticsRef.current) renderDiagnosticsRef.current.chromaProcessingTimes.push(performance.now() - cTime);
                        }
                        
                        exportAudioCtxRef.current.laoLastValidCanvas = cCanvas;
                    }
                }
            }
            
            // TÂM AN FIX TRỌNG ĐIỂM: Nếu là Video, TUYỆT ĐỐI chỉ dùng Canvas, không bao giờ Fallback về SVG
            laoImgToDraw = exportAudioCtxRef.current.laoLastValidCanvas;
        } else {
            // Chỉ dùng ảnh tĩnh / SVG nếu cấu hình thực sự là ảnh tĩnh / SVG
            laoImgToDraw = preloadedLaoFrames.current[isLaoSpeaking ? mouthState : 0] || preloadedLaoFrames.current[0];
        }

        if (laoImgToDraw) {
            const laoRatio = getMediaRatio(laoImgToDraw);
            const correctedLaoW = finalLaoH * laoRatio;

            // TÂM AN FIX (SUB-PIXEL SNAPPING): Làm tròn tọa độ để tránh GPU phải nội suy điểm ảnh mờ (giảm CPU drawTime)
            const dLaoX = Math.round(finalLaoX);
            const dLaoY = Math.round(finalLaoY);
            const dLaoW = Math.round(correctedLaoW);
            const dLaoH = Math.round(finalLaoH);

            // TÂM AN FIX: Trực tiếp vẽ bóng động (Dynamic Contact Shadow) để tương thích mọi Tỷ lệ khung hình và Độ phân giải 4K
            if (enableAutoHarmonization) {
                drawContactShadow(ctx, dLaoX, dLaoY, dLaoW, dLaoH, laoShadow);
            }

            ctx.save();
            // TỐI ƯU HÓA: Dùng Filter String đã Cache
            if (enableAutoHarmonization) {
                ctx.filter = cachedHarmonizeFilter;
            }
            ctx.translate(dLaoX, dLaoY);
            if (charOffsets.lao.flip) ctx.scale(-1, 1);
            ctx.drawImage(laoImgToDraw, Math.round(-dLaoW/2), 0, dLaoW, dLaoH);
            ctx.restore();
        }

        // --- Người Hỏi Render ---
        let userImgToDraw = null;

        if (userVisualType === 'video') {
            let activeVid = userExportVidRefs.current[currentUserState];
            
            if ((!activeVid || activeVid.readyState < 2) && !exportAudioCtxRef.current.userLastValidCanvas) {
                activeVid = userExportVidRefs.current.idle;
            }

            // TÂM AN FIX: Lá chắn thép chống chớp nháy (Iron Shield)
            if (activeVid && activeVid.readyState >= 2 && !activeVid.seeking) {
                if (!activeVid.chromaCanvas) {
                    activeVid.chromaCanvas = document.createElement('canvas');
                    activeVid.chromaCtx = activeVid.chromaCanvas.getContext('2d', {willReadFrequently: true});
                    activeVid.lastProcessedTime = -1; 
                }
                const cCanvas = activeVid.chromaCanvas;
                const cCtx = activeVid.chromaCtx;

                if (cCanvas && cCtx) {
                    if (activeVid.currentTime !== activeVid.lastProcessedTime) {
                        activeVid.lastProcessedTime = activeVid.currentTime;

                        // TÂM AN AI KIỂM DUYỆT: Giảm tải GPU thông minh
                        const MAX_CHAR_RES = (width >= 2560 ? 960 : 640) * aiMod.scale;
                        let procW = activeVid.videoWidth || 1;
                        let procH = activeVid.videoHeight || 1;
                        if (procW > MAX_CHAR_RES) {
                            const r = MAX_CHAR_RES / procW;
                            procW = Math.round(procW * r);
                            procH = Math.round(procH * r);
                        }
                        
                        if (cCanvas.width !== procW) cCanvas.width = procW;
                        if (cCanvas.height !== procH) cCanvas.height = procH;
                        
                        cCtx.imageSmoothingEnabled = true;
                        cCtx.imageSmoothingQuality = 'high';
                        cCtx.globalCompositeOperation = 'copy';
                        // Lấy hình Người hỏi từ GPU, nếu rỗng lúc Loop thì lấy ảnh gốc giữ độ ổn định
                        if (activeVid.gpuFrame) {
                            cCtx.drawImage(activeVid.gpuFrame, 0, 0, procW, procH);
                        } else {
                            cCtx.drawImage(activeVid, 0, 0, procW, procH);
                        }
                        
                        if (userChromaSettings.chromaType !== 'none' && !isFullFrameModeRef.current) {
                            const cTime = performance.now();
                            cCtx.globalCompositeOperation = 'source-over';
                            processChromaKeyPixels(cCtx, procW, procH, userChromaSettings);
                            if (renderDiagnosticsRef.current) renderDiagnosticsRef.current.chromaProcessingTimes.push(performance.now() - cTime);
                        }
                        exportAudioCtxRef.current.userLastValidCanvas = cCanvas;
                    }
                }
            }
            
            // TÂM AN FIX TRỌNG ĐIỂM: Khóa chặt Canvas cuối cùng, triệt tiêu lỗi chớp SVG lúc vái lạy
            userImgToDraw = exportAudioCtxRef.current.userLastValidCanvas;
        } else {
            // Chỉ tính toán trạng thái Vái lạy bằng SVG/Image nếu KHÔNG phải là video
            if (isOutro) {
                const outroProgress = ct - totalDuration;
                const angle = (outroProgress / OUTRO_DURATION) * Math.PI * 3;
                const bowPhase = Math.abs(Math.sin(angle)); 
                let bowState = Math.round(bowPhase * 5) * 10; 
                if (bowState > 50) bowState = 50;
                userImgToDraw = preloadedBowFrames.current[bowState] || preloadedUserFrames.current[0];
            } else if (activeBowingBlock) {
                const bowProgress = (ct - activeBowingBlock.start) / BOW_DURATION;
                const bowPhase = Math.abs(Math.sin(bowProgress * Math.PI)); 
                let bowState = Math.round(bowPhase * 5) * 10; 
                if (bowState > 50) bowState = 50;
                userImgToDraw = preloadedBowFrames.current[bowState] || preloadedUserFrames.current[0];
            } else {
                userImgToDraw = preloadedUserFrames.current[isUserSpeaking ? mouthState : 0] || preloadedUserFrames.current[0];
            }
        }

        if (userImgToDraw) {
            const userRatio = getMediaRatio(userImgToDraw);
            const correctedUserW = finalUserH * userRatio;

            // TÂM AN FIX (SUB-PIXEL SNAPPING)
            const dUserX = Math.round(finalUserX);
            const dUserY = Math.round(finalUserY);
            const dUserW = Math.round(correctedUserW);
            const dUserH = Math.round(finalUserH);

            // TÂM AN FIX: Trực tiếp vẽ bóng động (Dynamic Contact Shadow) để tương thích mọi Tỷ lệ khung hình và Độ phân giải 4K
            if (enableAutoHarmonization) {
                drawContactShadow(ctx, dUserX, dUserY, dUserW, dUserH, userShadow);
            }

            ctx.save();
            if (enableAutoHarmonization) {
                ctx.filter = cachedHarmonizeFilter;
            }
            // Ép GPU dùng Float Matrix để khử mờ viền
            ctx.translate(dUserX, dUserY);
            if (charOffsets.user.flip) {
                ctx.scale(-1, 1);
            }
            ctx.drawImage(userImgToDraw, Math.round(-dUserW/2), 0, dUserW, dUserH);
            ctx.restore();
        }

        } // Đóng ngoặc else của chế độ isFullFrameMode

        ctx.restore(); // KẾT THÚC KHÔNG GIAN CAMERA 3D

        // --- TÂM AN FX: VẼ HIỆU ỨNG CHUYỂN CẢNH (TRANSITIONS) ---
        if (camState && camState.transitionType && camState.transitionType !== 'none' && !isOutro) {
            const timeFromStart = ct - camState.start;
            const timeToEnd = camState.end - ct;
            const TRANS_HALF_DUR = camState.transitionDuration || 0.7; // TÂM AN FIX: Đồng bộ thời gian do người dùng chọn

            let intensity = 0;
            // TÂM AN FIX: Dùng dấu >= và <= để khóa chặt khung hình tại đúng mốc 0 giây, triệt tiêu khe hở sáng gây chớp nháy kép
            // Áp dụng Fade In ở đầu Shot (Bỏ qua Shot đầu tiên của Video)
            if (timeFromStart >= 0 && timeFromStart <= TRANS_HALF_DUR && camState.start > 0.5) {
                intensity = 1 - (timeFromStart / TRANS_HALF_DUR);
            }
            // Áp dụng Fade Out ở cuối Shot
            else if (timeToEnd >= 0 && timeToEnd <= TRANS_HALF_DUR) {
                intensity = 1 - (timeToEnd / TRANS_HALF_DUR);
            }

            if (intensity > 0) {
                intensity = Math.max(0, Math.min(1, intensity));
                // Công thức Smoothstep để đường cong chuyển cảnh mượt như phim
                const ease = intensity * intensity * (3 - 2 * intensity);
                
                if (camState.transitionType === 'fade_black') {
                    ctx.fillStyle = `rgba(0, 0, 0, ${ease})`;
                    ctx.fillRect(0, 0, width, height);
                } else if (camState.transitionType === 'fade_white') {
                    ctx.fillStyle = `rgba(255, 255, 255, ${ease})`;
                    ctx.fillRect(0, 0, width, height);
                } else if (camState.transitionType === 'blur') {
                    // Lóa sáng tâm linh (Glow)
                    ctx.fillStyle = `rgba(255, 255, 255, ${ease * 0.7})`;
                    ctx.fillRect(0, 0, width, height);
                    ctx.fillStyle = `rgba(245, 158, 11, ${ease * 0.25})`; // Ám vàng mờ
                    ctx.fillRect(0, 0, width, height);
                }
            }
        }

        if (!isFullFrameModeRef.current) {
            // TỐI ƯU HÓA: Vẽ lớp sương mờ (Vignette) TĨNH ở không gian 2D (Screen Space)
            // Không tạo mới Gradient, chỉ dùng Canvas đã Cache, tiết kiệm 20ms/frame
            ctx.save();
            ctx.globalCompositeOperation = 'source-over';
            ctx.drawImage(vignetteCache, 0, 0, width, height);
            ctx.restore();
        }

        // 3. VẼ LỚP OVERLAY CỐ ĐỊNH TRÊN MÀN HÌNH (UI Overlay)
        if (processedLogoRef.current) {
            const logoImg = processedLogoRef.current;
            const logoSize = Math.min(width, height) * 0.15;
            const logoH = logoSize * (logoImg.height / logoImg.width);
            ctx.drawImage(logoImg, width - logoSize - 20, 20, logoSize, logoH);
        }

        // --- TÂM AN TỐI ƯU: VẼ PHỤ ĐỀ BẰNG TEXT CACHING ---
        if (activeText) {
            if (activeText !== cachedActiveText) {
                // Nội dung câu đổi mới -> Xóa Canvas đệm và vẽ lại
                subtitleCacheCtx.clearRect(0, 0, width, height);
                
                const fontSizeText = Math.round(Math.min(width, height) * 0.055 * subtitleScale); // TÂM AN FIX: Làm tròn số để tránh lỗi Font
                subtitleCacheCtx.font = `bold ${fontSizeText}px 'Segoe UI', Arial, sans-serif`;
                subtitleCacheCtx.textAlign = "center";
                subtitleCacheCtx.lineJoin = 'round';
                subtitleCacheCtx.miterLimit = 2;

                const lines = wrapTextToLines(subtitleCacheCtx, activeText, width * 0.85);
                const startY = height * (subtitleYPos / 100);
                let textY = startY - (lines.length * fontSizeText * 1.3) / 2;

                lines.forEach(line => {
                    subtitleCacheCtx.strokeStyle = 'rgba(0,0,0,0.85)';
                    subtitleCacheCtx.lineWidth = fontSizeText * 0.2; 
                    subtitleCacheCtx.strokeText(line, width/2, textY);
                    
                    subtitleCacheCtx.fillStyle = subtitleColor;
                    subtitleCacheCtx.fillText(line, width/2, textY);
                    
                    textY += fontSizeText * 1.3;
                });
                
                cachedActiveText = activeText;
            }

            // GPU chỉ việc copy điểm ảnh (vô cùng rẻ mạt) thay vì phải tính toán font chữ
            ctx.drawImage(subtitleCacheCanvas, 0, 0);
        }

        // --- TÂM AN THÊM: VẼ INTRO (GIỚI THIỆU) ---
        if (isIntro) {
            const introProgress = absoluteCurrentTime / INTRO_DUR;
            
            // Hiệu ứng mờ dần (Fade In / Fade Out)
            let alpha = 1;
            if (introProgress < 0.15) alpha = introProgress / 0.15; // 15% đầu mờ vào
            else if (introProgress > 0.85) alpha = (1 - introProgress) / 0.15; // 15% cuối mờ ra

            alpha = Math.max(0, Math.min(1, alpha)); // Khóa an toàn giới hạn Alpha

            ctx.save();
            ctx.globalCompositeOperation = 'source-over'; 
            
            // Lớp màng đen che phủ
            ctx.fillStyle = `rgba(2, 6, 23, ${alpha * 0.8})`; 
            ctx.fillRect(0, 0, width, height);
            
            ctx.globalAlpha = alpha;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            
            const titleText = introTitleRef.current || "";
            const subText = introSubtitleRef.current || "";

            // TÂM AN FIX: Cấu trúc lại logic hiển thị Intro để chống lỗi mất chữ khi Title rỗng
            if (titleText || subText) {
                let totalTextHeight = 0;
                const fontSizeTitle = Math.round(Math.min(width, height) * 0.08);
                const fontSizeSub = Math.round(Math.min(width, height) * 0.045);
                
                let titleLines = [];
                if (titleText) {
                    ctx.font = `bold ${fontSizeTitle}px 'Segoe UI', Arial, sans-serif`;
                    titleLines = wrapTextToLines(ctx, titleText, width * 0.85);
                    totalTextHeight += titleLines.length * fontSizeTitle * 1.2;
                }
                
                let subLines = [];
                if (subText) {
                    ctx.font = `italic bold ${fontSizeSub}px 'Segoe UI', Arial, sans-serif`;
                    subLines = wrapTextToLines(ctx, subText, width * 0.85);
                    if (titleText) {
                        totalTextHeight += (fontSizeTitle * 0.5); // Khoảng cách giữa Title và Subtitle
                    }
                    totalTextHeight += subLines.length * fontSizeSub * 1.4;
                }

                // Tọa độ bắt đầu vẽ sao cho nguyên khối Text nằm giữa màn hình
                let startY = (height / 2) - (totalTextHeight / 2) + (titleText ? fontSizeTitle / 2 : fontSizeSub / 2);

                // 1. Vẽ Tiêu đề (Màu vàng rực + Viền đen)
                if (titleText) {
                    ctx.font = `bold ${fontSizeTitle}px 'Segoe UI', Arial, sans-serif`;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = 15;
                    ctx.shadowOffsetY = 4;
                    
                    titleLines.forEach(l => { 
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                        ctx.lineWidth = fontSizeTitle * 0.15;
                        ctx.strokeText(l, width/2, startY);
                        ctx.fillStyle = '#fde047'; 
                        ctx.fillText(l, width/2, startY); 
                        startY += fontSizeTitle * 1.2; 
                    });
                    
                    if (subText) {
                        startY += fontSizeTitle * 0.5 - (fontSizeTitle * 1.2) + (fontSizeSub); 
                    }
                }

                // 2. Vẽ Câu tự vấn (Màu trắng mờ + Viền đen)
                if (subText) {
                    ctx.font = `italic bold ${fontSizeSub}px 'Segoe UI', Arial, sans-serif`;
                    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
                    ctx.shadowBlur = 10;
                    ctx.shadowOffsetY = 2;
                    
                    subLines.forEach(l => { 
                        ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
                        ctx.lineWidth = fontSizeSub * 0.15;
                        ctx.strokeText(l, width/2, startY);
                        ctx.fillStyle = '#f8fafc'; 
                        ctx.fillText(l, width/2, startY); 
                        startY += fontSizeSub * 1.4; 
                    });
                }
            }
            ctx.restore();
        }

        // --- TÂM AN THÊM: VẼ OUTRO (KẾT MÀN) LÊN TRÊN CẢNH VÁI LẠY ---
        if (isOutro && enableOutroText && outroTextRef.current) {
            const outroProgress = (ct - totalDuration) / OUTRO_DURATION;
            let alpha = 0;
            if (outroProgress > 0.1) alpha = Math.min(1, (outroProgress - 0.1) / 0.3); // Hiện dần lên
            if (outroProgress > 0.8) alpha = Math.max(0, 1 - (outroProgress - 0.8) / 0.2); // Tắt dần lúc hết video

            if (alpha > 0) {
                ctx.save();
                ctx.globalAlpha = alpha;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.lineJoin = 'round';
                
                // Màng đen mỏng làm nổi bật chữ
                ctx.fillStyle = `rgba(0, 0, 0, ${alpha * 0.4})`;
                ctx.fillRect(0, 0, width, height);

                const fontSizeOutro = Math.round(Math.min(width, height) * 0.05); // TÂM AN FIX: Làm tròn font size
                ctx.font = `bold ${fontSizeOutro}px 'Segoe UI', Arial, sans-serif`;
                ctx.shadowColor = 'rgba(0, 0, 0, 1)';
                ctx.shadowBlur = 20;
                ctx.shadowOffsetY = 2;
                
                const outroLines = wrapTextToLines(ctx, outroTextRef.current, width * 0.8);
                let startY = height * 0.25; // Đặt chữ ở 1/4 phía trên (để ko đè lên người vái lạy bên dưới)
                
                outroLines.forEach(l => {
                    ctx.strokeStyle = 'rgba(2, 6, 23, 0.9)';
                    ctx.lineWidth = fontSizeOutro * 0.15;
                    ctx.strokeText(l, width/2, startY);
                    
                    ctx.fillStyle = '#fde047'; // Màu vàng hoàng kim
                    ctx.fillText(l, width/2, startY); 
                    startY += fontSizeOutro * 1.4; 
                });
                ctx.restore();
            }
        }

        // --- Hiệu ứng Fade To Black (Mờ Dần) điện ảnh ở cuối video ---
        if (isOutro) {
            const fadeDuration = 1.5; // Mờ dần trong 1.5s cuối
            const timeRemaining = (totalDuration + OUTRO_DURATION) - ct;
            if (timeRemaining <= fadeDuration && timeRemaining > 0) {
                const fadeOpacity = 1 - (timeRemaining / fadeDuration);
                ctx.fillStyle = `rgba(0, 0, 0, ${fadeOpacity})`;
                ctx.fillRect(0, 0, width, height);
            }
        }

        // --- TÂM AN: BỘ NÃO AI KIỂM DUYỆT & ĐIỀU TIẾT ĐỘ MƯỢT ---
        const frameEndTime = performance.now();
        const frameDuration = frameEndTime - frameStartTime;

        if (isRecordingActive) {
            // Nếu tốn hơn 22ms để vẽ 1 khung hình (rớt xuống dưới 45 FPS), có nguy cơ giật video
            if (frameDuration > 22) {
                aiMod.slowFrames++;
                if (aiMod.slowFrames > 3) {
                    // Mệnh lệnh AI: Hạ độ phân giải ngầm lập tức để cứu độ mượt
                    aiMod.scale = Math.max(0.4, aiMod.scale - 0.15); 
                    aiMod.fixedDrops++;
                    aiMod.status = '⚠️ Đang điều tiết GPU chống giật...';
                    aiMod.slowFrames = 0; // Reset để theo dõi tiếp
                }
            } else {
                aiMod.slowFrames = 0;
                // Nếu máy đã mượt trở lại, AI tự động nâng từ từ chất lượng lên lại mức cao nhất
                if (renderDiagnosticsRef.current?.totalFrames % 120 === 0) { // Mỗi 2 giây kiểm tra 1 lần
                    if (aiMod.scale < 1.0) {
                        aiMod.scale = Math.min(1.0, aiMod.scale + 0.1);
                        aiMod.status = aiMod.scale === 1.0 ? '✨ Chất lượng tối đa (Mượt mà)' : 'Tăng dần độ nét...';
                    }
                }
            }

            // Giao tiếp trực tiếp với DOM để cập nhật Trạng thái AI mà không làm treo React
            if (frameEndTime - aiMod.lastLogTime > 400) {
                const uiEl = document.getElementById('ai-moderator-status');
                if (uiEl) {
                    uiEl.innerHTML = `
                        <div class="font-bold flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full ${aiMod.scale === 1.0 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}"></span> AI Kiểm duyệt: ${aiMod.status}</div>
                        <div class="opacity-70 mt-0.5 text-[9px]">🛡️ Đã cứu: <span class="text-orange-300 font-bold">${aiMod.fixedDrops}</span> khung hình lag</div>
                    `;
                }
                aiMod.lastLogTime = frameEndTime;
            }
        }

        if (renderDiagnosticsRef.current) {
            renderDiagnosticsRef.current.totalFrames++;
            renderDiagnosticsRef.current.drawTimes.push(frameDuration);
            if (frameDuration > 16.6) renderDiagnosticsRef.current.slowFrames++;
            if (frameDuration > 33.3) renderDiagnosticsRef.current.droppedFrames++;
        }

      }; 

      // 1. Chạy mồi khung hình đầu tiên lên Canvas
      drawFrame();

      // 2. Đợi GPU của trình duyệt đưa điểm ảnh lên màn hình thực tế (Đợi ~120 frames)
      // TÂM AN NÂNG CẤP: Cho GPU 2000ms (2s) để mồi nét thật căng ảnh gốc và ổn định video nền trước khi bấm máy
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (!exportAudioCtxRef.current) return; // Thoát an toàn nếu người dùng bấm Hủy lúc đang chờ

      // 3. TÂM AN FIX TUYỆT ĐỐI: Cập nhật lại mốc 0 và mở cờ để Video và Âm thanh bung ra cùng 1 phần nghìn giây!
      absoluteStartTime = audioCtx.currentTime;
      isRecordingActive = true;

      // 4. Bắt đầu thu hình từ Canvas mượt mà (Không còn đen mồi hay chớp giật)
      recorder.start();
      
      // 5. Phối hợp phát Audio và mờ dần nhạc (Fade Out Audio) lúc kết thúc
      // TÂM AN FIX: Lùi Audio của lời thoại lại để chờ Intro 4 giây
      if (speechSource) {
          speechSource.start(absoluteStartTime + INTRO_DUR);
      }
      
      if (bgmSource) {
          bgmSource.start(absoluteStartTime); // Nhạc nền vẫn phát bình thường trong lúc Intro
          // Cho nhạc mờ dần trong 2 giây cuối cùng của Video (Cộng thêm thời gian Intro)
          bgmGain.gain.setValueAtTime(bgmVolume, absoluteStartTime + INTRO_DUR + totalDuration + OUTRO_DURATION - 2);
          bgmGain.gain.linearRampToValueAtTime(0, absoluteStartTime + INTRO_DUR + totalDuration + OUTRO_DURATION);
      }
      
      videoAudioNodes.forEach(({ element, gainNode, volume }) => {
          element.play().catch(e=>console.warn("Video Audio Error:", e));
          // Fade out nhạc của video nền
          gainNode.gain.setValueAtTime(volume, absoluteStartTime + INTRO_DUR + totalDuration + OUTRO_DURATION - 2);
          gainNode.gain.linearRampToValueAtTime(0, absoluteStartTime + INTRO_DUR + totalDuration + OUTRO_DURATION);
      });

    } catch (e) {
      console.error("Lỗi xuất video:", e);
      setIsExportingVideo(false);
      setIsPreparingVideoData(false);
      if (exportAnimFrameRef.current) cancelAnimationFrame(exportAnimFrameRef.current);
      
      // Chẩn đoán khi có lỗi vỡ mạch
      if (renderDiagnosticsRef.current) {
          renderDiagnosticsRef.current.endTime = performance.now();
          const errReport = buildDiagnosticReport(renderDiagnosticsRef.current, e.message);
          setDiagnosticReport(errReport);
      }

      // TÂM AN FIX: Báo lỗi cho Auto-Pilot để thoát khỏi Promise, không bị treo vô tận
      if (renderPromiseRef.current) {
          renderPromiseRef.current.reject(e);
          renderPromiseRef.current = null;
      }
    }
  };

  const toggleFullscreen = () => {
      if (renderedVideoUrl) {
          setIsVideoFullscreen(true);
      }
  };

  const handleDownloadVideo = async () => {
    if (!renderedVideoBlob) return;
    const filename = `Khai_thi_Lao_${videoAspectRatio.replace(':','x')}_${videoResolution}p_${Date.now()}.${videoExt}`;
    try {
      if (window.showSaveFilePicker) {
        const handle = await window.showSaveFilePicker({
          suggestedName: filename,
          types: [{
            description: 'Video File',
            accept: { [renderedVideoBlob.type]: [`.${videoExt}`] },
          }],
        });
        const writable = await handle.createWritable();
        await writable.write(renderedVideoBlob);
        await writable.close();
      } else {
        throw new Error('Fallback to standard download');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        const link = document.createElement('a');
        link.href = renderedVideoUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const resetVideoExport = () => {
     if (exportAnimFrameRef.current) {
         cancelAnimationFrame(exportAnimFrameRef.current);
         exportAnimFrameRef.current = null;
     }
     if (renderedVideoUrl) {
         URL.revokeObjectURL(renderedVideoUrl);
         setRenderedVideoUrl(null);
         setRenderedVideoBlob(null);
     }
     if (tempAiBgmData?.url) {
         URL.revokeObjectURL(tempAiBgmData.url);
         setTempAiBgmData(null);
     }
  };

  const cancelVideoExport = () => {
    if (exportAnimFrameRef.current) {
        cancelAnimationFrame(exportAnimFrameRef.current);
        exportAnimFrameRef.current = null;
    }
    if (exportMediaRecorderRef.current && exportMediaRecorderRef.current.state === 'recording') {
      exportMediaRecorderRef.current.stop();
    }
    if (exportAudioCtxRef.current && exportAudioCtxRef.current.state !== 'closed') {
      exportAudioCtxRef.current.close().catch(err => console.warn("Lỗi khi đóng AudioContext:", err));
    }
    exportAudioCtxRef.current = null; // Dọn rác
    
    resetVideoExport();
    setIsExportingVideo(false);
    setIsPreviewFullscreen(false); // Reset trạng thái fullscreen khi thoát
    setShowVideoExportModal(false);
  };

  const handleRegenerateAllAIVoices = async () => {
    if (isRegeneratingAll) return;
    setIsRegeneratingAll(true);
    setRegenerationProgress(0);
    setRegenerationComplete(false);

    try {
      const aiMessages = messages.filter(m => m.role === 'ai');
      const total = aiMessages.length;
      let processedCount = 0;
      
      for (let i = 0; i < total; i++) {
        const msg = aiMessages[i];
        let success = false;
        let retries = 0;

        // Cơ chế tự động thử lại tối đa 3 lần cho mỗi câu
        while (!success && retries < 3) {
           success = await generateVoice(msg.id, msg.text, 'ai', currentSessionId, false);
           if (!success) {
               retries++;
               await new Promise(resolve => setTimeout(resolve, 2500));
           }
        }
        
        processedCount++;
        setRegenerationProgress(Math.round((processedCount / total) * 100));
        await new Promise(resolve => setTimeout(resolve, 1500)); // Delay an toàn
      }
      
      setRegenerationComplete(true);
      setTimeout(() => setRegenerationComplete(false), 4000);
    } catch (error) {
      console.error("Lỗi khi tạo lại toàn bộ giọng Lão", error);
    } finally {
      setIsRegeneratingAll(false);
    }
  };

  // TÂM AN FIX: Thêm tham số prefixAudioUrls và textToSynthesize để nối file âm thanh bài kệ có sẵn vào lời giải đáp mới
  const generateVoice = async (msgId, fullText, role, targetSessionId = currentSessionId, autoPlay = true, prefixAudioUrls = null, textToSynthesize = null) => {
    if (creatingVoices[msgId]) return false;
    setCreatingVoices(prev => ({ ...prev, [msgId]: true }));
    
    // Nếu có truyền textToSynthesize thì AI chỉ đọc phần giải đáp (để tiết kiệm API), nếu không thì đọc toàn bộ
    let targetText = textToSynthesize || fullText;
    
    // TÂM AN FIX: Áp dụng hàm làm sạch tiêu chuẩn
    const ttsText = cleanTextForTTS(targetText);

    // TÂM AN NLP: Tự động phân tích xem chuỗi cần đọc có phải ngoại ngữ không
    const hasVietnameseTones = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(ttsText);
    const hasCJK = /[\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(ttsText); // Ký tự Hàn, Trung, Nhật
    // Căn cứ: Hoặc chọn trên UI, Hoặc có ký tự tượng hình, Hoặc văn bản dài > 10 ký tự mà hoàn toàn KHÔNG CÓ DẤU TIẾNG VIỆT (Tức là tiếng Anh/Latin)
    const isForeignContext = appLanguage !== 'Tiếng Việt' || hasCJK || (!hasVietnameseTones && ttsText.replace(/[^a-zA-Z]/g, '').length > 10);

    let voiceName = "Aoede";
    let promptPrefix = "";

    if (role === 'ai') {
      voiceName = laoVoiceRef.current || "Algieba";
      let prefix = (laoVoiceStyleRef.current || "").trim();
      
      if (isForeignContext) {
          // TÂM AN KHỬ GIỌNG ĐỊA PHƯƠNG: Cắt sạch các yêu cầu về giọng miền nam, tiếng việt để AI tự do uốn lưỡi đọc tiếng Anh/Hàn/Trung chuẩn như người bản xứ
          prefix = prefix.replace(/miền nam việt nam/gi, '')
                         .replace(/chuẩn giọng/gi, '')
                         .replace(/đúng chính tả/gi, '')
                         .replace(/việt nam/gi, '')
                         .replace(/miền nam/gi, '')
                         .replace(/,/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
          promptPrefix = `Read naturally with emotion: ${prefix}. Text: `;
      } else {
          if (prefix && !prefix.endsWith(':')) prefix += ':';
          promptPrefix = prefix + " ";
      }
    } else {
      voiceName = userVoiceRef.current || (userGender === 'Nam' ? 'Puck' : 'Aoede');
      let prefix = (userVoiceStyleRef.current || "").trim();
      
      if (isForeignContext) {
          prefix = prefix.replace(/miền nam việt nam/gi, '')
                         .replace(/chuẩn giọng/gi, '')
                         .replace(/đúng chính tả/gi, '')
                         .replace(/việt nam/gi, '')
                         .replace(/miền nam/gi, '')
                         .replace(/,/g, ' ')
                         .replace(/\s+/g, ' ')
                         .trim();
          promptPrefix = `Read naturally with emotion: ${prefix}. Text: `;
      } else {
          if (prefix && !prefix.endsWith(':')) prefix += ':';
          promptPrefix = prefix + " ";
      }
    }

    try {
      let finalAudioUrl = null;
      let cleanSentences = [];
      const prefixUrls = Array.isArray(prefixAudioUrls) ? prefixAudioUrls : (prefixAudioUrls ? [prefixAudioUrls] : []);
        
      if (role === 'ai') {
          // Ép TTS đọc liền mạch nguyên cục giải đáp bằng cách thay \n thành dấu chấm
          const optimizedForTts = ttsText.split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');
          cleanSentences = [optimizedForTts];
      } else {
          cleanSentences = [ttsText.trim()].filter(s => s.length > 0);
      }

      const shouldActuallyPlay = autoPlay && (role === 'user' || msgId === latestAutoPlayAiMsgIdRef.current);

      if (shouldActuallyPlay) {
          // CHÚ Ý: Nếu có prefixUrls (bài kệ đang phát), TUYỆT ĐỐI KHÔNG clear queue
          if (prefixUrls.length === 0) {
              audioQueueRef.current = [];
              isPlayingQueueRef.current = false;
              if (activeAudioRef.current) activeAudioRef.current.pause();
              currentMsgIdQueueRef.current = msgId;
              setCurrentlyPlayingId(msgId);
          }
      }

      const generatedUrls = [];
      let hasError = false;
        
      for (let i = 0; i < cleanSentences.length; i++) {
        const sentence = cleanSentences[i];
        if (!sentence) continue;
        try {
          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: `${promptPrefix} ${sentence}` }] }],
              generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
              }
            })
          });

          const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          if (audioData) {
             const wavBlob = pcmToWav(audioData, 24000);
             if (!wavBlob) { hasError = true; break; }
             
             const audioUrl = URL.createObjectURL(wavBlob);
             generatedUrls.push(audioUrl);
             
             const stillValidToPlay = shouldActuallyPlay && !isRecordingRef.current && (role === 'user' || msgId === latestAutoPlayAiMsgIdRef.current);
             
             if (stillValidToPlay && prefixUrls.length > 0) {
                // Nếu đang phát bài kệ, ta chỉ việc đẩy tiếp đoạn giải đáp vào hàng đợi
                audioQueueRef.current.push({ url: audioUrl, text: sentence });
                if (!isPlayingQueueRef.current) {
                   isPlayingQueueRef.current = true;
                   playNextInQueue();
                }
             } else if (stillValidToPlay) {
                audioQueueRef.current.push({ url: audioUrl, text: sentence });
                if (!isPlayingQueueRef.current) {
                   isPlayingQueueRef.current = true;
                   playNextInQueue();
                }
             } else if (prefixUrls.length === 0) {
                audioQueueRef.current = [];
                isPlayingQueueRef.current = false;
                if (shouldActuallyPlay && currentlyPlayingId === msgId) setCurrentlyPlayingId(null);
             }
          } else {
             hasError = true; break;
          }
        } catch(e) {
             console.error("Lỗi khi fetch TTS:", e);
             hasError = true; break;
        }
      }
        
      if (hasError || generatedUrls.length === 0) {
          generatedUrls.forEach(url => URL.revokeObjectURL(url));
          return false; 
      }

      // TÂM AN NÂNG CẤP: Gộp file Các Bài kệ có sẵn + File giải đáp vừa tạo thành 1 track thống nhất
      let allUrls = [...prefixUrls];
      allUrls = allUrls.concat(generatedUrls);

      if (allUrls.length > 1) {
         const itemsToCombine = allUrls.map((url, idx) => ({ 
             url, 
             role, 
             text: (idx < prefixUrls.length) ? "Khai thị kệ pháp." : (cleanSentences[idx - prefixUrls.length] || "Giải đáp.") 
         }));
         const combinedResult = await combineWavs(itemsToCombine);
         if (combinedResult && combinedResult.blob) {
            finalAudioUrl = URL.createObjectURL(combinedResult.blob);
         }
      } else {
         finalAudioUrl = allUrls[0];
      }

      if (finalAudioUrl) {
         globalAudioUrlRef.current = null; // Xóa cache file gộp
         setSessions(prev => prev.map(s => {
           if (s.id === targetSessionId) {
             return { ...s, messages: s.messages.map(m => m.id === msgId ? { ...m, audioUrl: finalAudioUrl } : m) };
           }
           return s;
         }));
         
         // Đồng bộ tin nhắn và audioUrl vào PostgreSQL
         saveChatMessageAction(targetSessionId, role === 'ai' ? 'ASSISTANT' : 'USER', fullText, finalAudioUrl, null, msgId.toString());
         
         return true;
      }
      return false;
    } catch (err) {
      console.error("Lỗi tạo giọng tổng thể:", err);
      return false;
    } finally {
      setCreatingVoices(prev => {
        const next = { ...prev };
        delete next[msgId];
        return next;
      });
    }
  };

  const handleEnterApp = () => {
    setHasEntered(true);
    if (!activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    const playPromise = activeAudioRef.current.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        activeAudioRef.current.pause();
      }).catch(() => {});
    }

    const hasSeenTutorial = localStorage.getItem('taman_has_seen_tutorial');
    if (!hasSeenTutorial) {
       setTimeout(() => setShowTutorial(true), 800);
    }
  };
  
  useEffect(() => {
    if (!showTutorial) return;
    const currentStepId = TUTORIAL_STEPS[tutorialStep].id;
    const updateRect = () => {
      const element = document.querySelector(`[data-tutorial="${currentStepId}"]`);
      if (element) {
        const rect = element.getBoundingClientRect();
        setTargetRect({ top: rect.top - 8, left: rect.left - 8, width: rect.width + 16, height: rect.height + 16, isRound: currentStepId === 'tut-mic' || currentStepId === 'tut-face' });
      }
    };
    updateRect();
    window.addEventListener('resize', updateRect);
    setTimeout(updateRect, 300);
    return () => window.removeEventListener('resize', updateRect);
  }, [showTutorial, tutorialStep]);

  const endTutorial = () => {
    setShowTutorial(false);
    localStorage.setItem('taman_has_seen_tutorial', 'true');
  };

  const nextTutorialStep = () => {
    if (tutorialStep < TUTORIAL_STEPS.length - 1) setTutorialStep(prev => prev + 1);
    else endTutorial();
  };

  const handleSendMessageRef = useRef(null);
  useEffect(() => { handleSendMessageRef.current = handleSendMessage; });

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
                      liveBgmAudioRef.current.play().catch(e => console.warn("Lỗi phát lại nhạc nền Live:", e));
                  }
              }
          }
      }, liveIdleTimeoutRef.current * 1000); // Áp dụng số giây tùy chỉnh
  };

  // --- Bước 2: Kết nối Websocket lấy comment livestream ---
  const processLiveQueueRef = useRef(null);
  
  // TÂM AN THÊM: Hàm chạy ngầm để chuẩn bị sẵn câu tự vấn và giọng đọc trong lúc phim đang chiếu
  const preloadPostMovieResponse = async (username) => {
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

          const textData = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: prompt }] }],
                  generationConfig: { temperature: 0.7 }
              })
          });

          const rawText = textData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (!rawText) return;

          let cleanText = rawText.replace(/^\[.*?\]/, '').trim();
          const emotionMatch = rawText.match(/^\[(.*?)\]/);
          const emotion = emotionMatch ? emotionMatch[1] : 'calm';

          // 2. Tạo giọng đọc
          const voiceName = laoVoiceRef.current || "Algieba";
          let prefix = (laoVoiceStyleRef.current || "").trim();
          if (appLanguage === 'Tiếng Việt' && prefix && !prefix.endsWith(':')) prefix += ':';

          const optimizedText = cleanTextForTTS(cleanText).split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ');

          const audioDataRes = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                  contents: [{ parts: [{ text: `${prefix} ${optimizedText}` }] }],
                  generationConfig: {
                      responseModalities: ["AUDIO"],
                      speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } }
                  }
              })
          });

          const audioData = audioDataRes?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
          let audioUrl = null;
          if (audioData) {
              const wavBlob = pcmToWav(audioData, 24000);
              if (wavBlob) {
                  audioUrl = URL.createObjectURL(wavBlob);
              }
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
  const livePrefetchQueueRef = useRef([]);
  const isPrefetchingRef = useRef(false);

  const generateLivePrefetch = async (item, idleSecs) => {
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
          const movieNames = liveIdleVideosRef.current.map(v => `${v.name.replace(/\.[^/.]+$/, "")} (Chủ đề: ${v.topic || 'Khác'})`).join(' | ');
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
          const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          }, 2, 1000); 

          const aiRawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiRawText) {
              let extractedText = aiRawText.replace(/^\[.*?\]/, '').trim();
              const emotionMatch = aiRawText.match(/^\[(.*?)\]/);
              finalEmotion = emotionMatch ? emotionMatch[1] : 'calm';

              const movieMatch = extractedText.match(/\[PLAY_MOVIE:?\s*(.+?)\]/i);
              if (movieMatch && wantsMovie) {
                  movieCmd = movieMatch[1].trim();
                  extractedText = extractedText.replace(movieMatch[0], '').trim();
              }

              finalAiText = extractedText.replace(/\//g, ',').replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, match => match.charAt(0) + match.slice(1).toLowerCase());

              if (!isSystemCommand) {
                  uHistory.push(`Lão: ${finalAiText}`);
                  if (uHistory.length > 6) uHistory = uHistory.slice(-6);
                  liveUserHistoryRef.current.set(liveUsername, uHistory);
              }
          }
      } catch (err) {
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

          const cleanSentences = [ttsText.split('\n').map(s => s.trim()).filter(s => s.length > 0).join('. ')];
          
          for (let i = 0; i < cleanSentences.length; i++) {
              const sentence = cleanSentences[i];
              if (!sentence) continue;
              try {
                  const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${ttsModel}:generateContent?key=${apiKey}`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          contents: [{ parts: [{ text: `${prefix} ${sentence}` }] }],
                          generationConfig: { responseModalities: ["AUDIO"], speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } } }
                      })
                  }, 2, 1000);

                  const audioData = data?.candidates?.[0]?.content?.parts?.find(p => p.inlineData?.data)?.inlineData?.data;
                  if (audioData) {
                      const wavBlob = pcmToWav(audioData, 24000);
                      if (wavBlob) {
                          const audioUrl = URL.createObjectURL(wavBlob);
                          audioQueueItems.push({ url: audioUrl, text: sentence });
                      }
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
              latestAutoPlayAiMsgIdRef.current = aiMsgId;
              
              updateCurrentMessages(prev => [...prev, {
                  id: aiMsgId, role: 'ai', text: preloaded.text, timestamp: new Date(), audioUrl: preloaded.audioUrl, emotion: preloaded.emotion, reactions: {}
              }]);
              
              if (preloaded.audioUrl) {
                  audioQueueRef.current = [preloaded.audioUrl];
                  isPlayingQueueRef.current = true;
                  currentMsgIdQueueRef.current = aiMsgId;
                  setCurrentlyPlayingId(aiMsgId);
                  playNextInQueue();
              }
              
              let uHistory = liveUserHistoryRef.current.get(targetUser) || [];
              uHistory.push(`Lão: ${preloaded.text}`);
              liveUserHistoryRef.current.set(targetUser, uHistory);
              
              if (liveBgmAudioRef.current && liveBgmAudioRef.current.paused) {
                  liveBgmAudioRef.current.play().catch(e => console.warn(e));
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
      isTalkingRef.current = false;
      currentLiveSubTextRef.current = '';
      const subEl = document.getElementById('live-subtitle-text');
      if (subEl) subEl.innerText = '';

      showToastMsg('⏭️ Đã bỏ qua câu hiện tại.', 'info', 2000);
      
      // Hệ thống processLiveQueue sẽ tự động bắt vòng lặp mới khi isPlayingQueueRef = false
  };

  // --- TÂM AN THÊM MỚI: LẮNG NGHE PHÍM TẮT TOÀN CỤC ---
  useEffect(() => {
      const handleKeyDown = (e) => {
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

  // --- TÂM AN LÕI MỚI: BỘ TIÊU THỤ HÀNG ĐỢI SIÊU NHANH BỞI VÌ ĐÃ PREFETCH ---
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
                  updateCurrentMessages(prev => [...prev, { id: userMsgId, role: 'user', text: actualQuestion, timestamp: new Date(), audioUrl: null, isCorrecting: false }]);
              }

              // Hiển thị ngay Lời đáp của AI lên hộp Chat mà KHÔNG PHẢI CHỜ SUY NGHĨ (vì đã prefetch ngầm xong)
              const aiMsgId = Date.now() + 1;
              latestAutoPlayAiMsgIdRef.current = aiMsgId;
              const finalText = displayIntro ? (finalAiText ? `${displayIntro}\n\n${finalAiText}` : displayIntro) : finalAiText;
              
              updateCurrentMessages(prev => [...prev, { 
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
                  currentMsgIdQueueRef.current = aiMsgId;
                  setCurrentlyPlayingId(aiMsgId);
                  playNextInQueue();
                  
                  // Chờ Lão ngậm miệng thật sự
                  await new Promise(resolve => {
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
              
              unsubscribeLiveComments = onSnapshot(commentsRef, (snapshot) => {
                  snapshot.docChanges().forEach((change) => {
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
                                          liveBgmAudioRef.current.play().catch(e => console.warn(e));
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
                                      liveBgmAudioRef.current.play().catch(e => console.warn(e));
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
              }, (err) => {
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

  // --- TÂM AN THÊM: KHỞI TẠO BỘ NÃO LẮNG NGHE KHÁCH MỜI BẰNG GIỌNG NÓI ---
  useEffect(() => {
      let recognition = null;
      let watchdogTimer = null;
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

          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
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

          recognition.onerror = (e) => {
              isGuestMicListeningRef.current = false;
              if (e.error !== 'not-allowed' && liveGuestMicRef.current && !isIntentionalStop) {
                  setTimeout(startMic, 800);
              }
          };

          // TÂM AN FIX: Đã gỡ bỏ async và hàm chờ AI để tốc độ nhận diện nhanh nhất (0ms)
          recognition.onresult = (e) => {
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
                      const hasTrigger = triggerWords.some(word => lowerTranscript.includes(word));
                      
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
                          liveBgmAudioRef.current.play().catch(err => console.warn(err));
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

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.lang = 'vi-VN';
      recognitionRef.current.onresult = (e) => {
        if (handleSendMessageRef.current) handleSendMessageRef.current(e.results[0][0].transcript);
      };
      recognitionRef.current.onend = () => setIsRecording(false);
    }
  }, []);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => stream.getTracks().forEach(track => track.stop())).catch(err => console.warn(err));
  }, []);

  useEffect(() => { 
     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [messages]);

  useEffect(() => {
     const closeMenus = () => { setShowDownloadMenu(false); setShowShareMenu(false); };
     document.addEventListener('click', closeMenus);
     return () => document.removeEventListener('click', closeMenus);
  }, []);

  const toggleMic = () => {
    if (isRecording) { 
      recognitionRef.current?.stop(); 
    } else { 
      // Dừng MỌI âm thanh đang phát ngay lập tức
      audioQueueRef.current = []; // Xóa hàng đợi
      isPlayingQueueRef.current = false;
      if (activeAudioRef.current) { activeAudioRef.current.pause(); setCurrentlyPlayingId(null); }
      if (globalAudioRef.current) { globalAudioRef.current.pause(); setIsGlobalPlaying(false); }
      stopLipSync();
      
      setIsRecording(true); 
      recognitionRef.current?.start(); 
    }
  };

  const handleRefineInput = async () => {
    if (!inputText.trim()) return;
    setIsRefining(true);
    try {
      const recentHistory = messages.slice(-4).map(m => `${m.role === 'user' ? 'Con' : 'Lão'}: ${m.text}`).join('\n');
      const contextText = recentHistory ? `\n\nNgữ cảnh đàm đạo trước đó:\n${recentHistory}` : '';

      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Dựa vào lịch sử đàm đạo sau:\n${chatHistory}\n\nHãy đúc kết lại cốt lõi sự vướng mắc của người hỏi và lời khai thị của Lão trong đàm đạo này thành 1 câu duy nhất bằng ngôn ngữ: ${appLanguage}. Sau đó, ${quoteRule} Xưng 'Lão', gọi người hỏi là ${userName.trim() ? `'${userName.trim()}'` : "'con'"} (hoặc đại từ tương đương). Bắt đầu bằng [calm].\n\nKHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:\n${poemDatabase.map(p => `Tên bài: ${p.title}\n` + p.stanzas.map(s => `Tags: ${s.tags.join(', ')}\nNội dung Kệ:\n${s.content}${s.meaning ? '\nÝ nghĩa diễn giải:\n' + s.meaning : ''}`).join('\n\n')).join('\n\n---\n\n')}` }] }],
        })
      });
      
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
         const cleanText = rawText.replace(/^["']|["']$/g, '').trim();
         setInputText(cleanText);
         if (isLiked) {
             showToastMsg('Đã tạo lời cảm niệm tri ân. Con hãy xem ở ô nhập chữ bên dưới nhé.', 'success', 4000);
         } else {
             showToastMsg('Đã tạo câu hỏi phản biện. Con hãy xem ở ô nhập chữ bên dưới nhé.', 'success', 4000);
         }
      }
    } catch (err) {
      console.error("Generate doubt/gratitude failed", err);
      showToastMsg('Mạch khí gián đoạn, chưa thể nghĩ ra câu từ lúc này.', 'error');
    } finally {
      setGeneratingDoubtId(null);
    }
  };

  const handleSummarizeSession = async () => {
    if (messages.length < 2) return;
    setIsThinking(true); setEmotion('thinking'); setShowHistory(true);
    try {
      const chatHistory = messages.map(m => `${m.role === 'user' ? (userName.trim() || 'Con') : 'Lão'}: ${m.text}`).join('\n');
      
      // TÂM AN FIX: Ép AI xuống dòng từng câu kệ
      const quoteRule = appLanguage === 'Tiếng Việt' 
          ? 'TRÍCH DẪN NGUYÊN VĂN đúng 4 câu kệ (không tự sáng tác). BẮT BUỘC: Trình bày mỗi câu kệ trên một dòng riêng biệt, tuyệt đối không viết dính liền. Trước khi trích dẫn, bắt buộc nói: "Sư Cha Tam Vô đã khai thị như sau:".'
          : `Chọn đúng 4 câu kệ và DỊCH sang ${appLanguage}. MANDATORY: Format the poem with line breaks (each verse on a new line). Trước khi trích dẫn, bắt buộc nói câu (bằng ${appLanguage}) có nghĩa là: "Sư Cha Tam Vô đã khai thị như sau:".`;

      const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Dựa vào lịch sử đàm đạo sau:\n${chatHistory}\n\nHãy đúc kết lại cốt lõi sự vướng mắc của người hỏi và lời khai thị của Lão trong đàm đạo này thành 1 câu duy nhất bằng ngôn ngữ: ${appLanguage}. Sau đó, ${quoteRule} Xưng 'Lão', gọi người hỏi là ${userName.trim() ? `'${userName.trim()}'` : "'con'"} (hoặc đại từ tương đương). Bắt đầu bằng [calm].\n\nKHO TÀNG KỆ CỦA SƯ CHA TAM VÔ:\n${poemDatabase.map(p => `Tags: ${p.tags.join(', ')}\nNội dung bài Kệ:\n${p.content}${p.meaning ? '\nÝ nghĩa diễn giải:\n' + p.meaning : ''}`).join('\n\n---\n\n')}` }] }],
        })
      });
      
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (rawText) {
        const cleanText = rawText.replace(/^\[.*?\]/, '').trim();
        const currentEmotion = rawText.match(/^\[(.*?)\]/)?.[1] || 'calm';

        const aiMsgId = Date.now() + 1;
        setEmotion(currentEmotion);
        updateCurrentMessages(prev => [...prev, { id: aiMsgId, role: 'ai', text: `✨ Đúc kết đàm đạo:\n\n${cleanText}`, timestamp: new Date(), audioUrl: null, emotion: currentEmotion, reactions: {} }]);
        
        if (isVoiceEnabled && !isMuted) { generateVoice(aiMsgId, cleanText, 'ai', currentSessionId, true); }
      }
    } catch (err) {
      console.error("Summarize LLM failed", err);
      updateCurrentMessages(prev => [...prev, { id: Date.now(), role: 'ai', text: "Mạch khí gián đoạn, Lão chưa đúc kết được.", timestamp: new Date() }]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleStopCorrecting = (msgId, rawText) => {
    if (spellCheckTimeoutsRef.current[msgId]) {
      clearTimeout(spellCheckTimeoutsRef.current[msgId]);
      delete spellCheckTimeoutsRef.current[msgId];
    }
    if (spellCheckControllersRef.current[msgId]) {
      spellCheckControllersRef.current[msgId].abort();
      delete spellCheckControllersRef.current[msgId];
    }
    updateCurrentMessages(prev => prev.map(m => m.id === msgId ? { ...m, isCorrecting: false } : m));
  };

  // --- THUẬT TOÁN TÂM AN NLP: PHÂN TÍCH NGỮ NGHĨA SIÊU TỐC TRÊN RAM (0.002s) ---
  const smartLocalSemanticRouter = (userText, count = 1) => {
      // 1. Chuẩn hóa chuỗi, loại bỏ dấu câu và các từ vô nghĩa
      const stopwords = ['lão', 'ơi', 'cho', 'con', 'hỏi', 'làm', 'sao', 'thế', 'nào', 'dạ', 'thưa', 'vậy', 'thì', 'là', 'mà', 'như', 'những', 'các'];
      const normalizedInput = userText.toLowerCase().replace(/[.,!?/()]/g, '');
      const inputWords = normalizedInput.split(/\s+/).filter(w => w.length > 1 && !stopwords.includes(w));

      // 2. Tạo Bigrams (Cặp 2 từ đi liền nhau) để bắt ngữ cảnh chính xác. 
      // VD: "đau khổ", "tiền bạc", "tự tử", "vô minh"
      const bigrams = [];
      for(let i = 0; i < inputWords.length - 1; i++) {
          bigrams.push(inputWords[i] + ' ' + inputWords[i+1]);
      }
      
      // Tập hợp từ khóa tìm kiếm: Cụm 2 từ (ưu tiên cao) + Từ đơn
      const searchTerms = [...bigrams, ...inputWords];
      let scoredStanzas = [];

      poemDatabase.forEach(poem => {
          const lowerTitle = poem.title.toLowerCase();
          poem.stanzas.forEach(stanza => {
              let score = 0;
              const lowerContent = stanza.content.toLowerCase();
              const lowerTags = stanza.tags.map(t => t.toLowerCase());

              searchTerms.forEach(term => {
                  const isBigram = term.includes(' ');
                  const weightMultiplier = isBigram ? 3 : 1; // Cụm từ đi liền nhau được nhân 3 số điểm

                  // Quét vào phần HỒN của đoạn kệ (Content)
                  if (lowerContent.includes(term)) {
                      score += term.length * 3 * weightMultiplier;
                  }
                  // TÂM AN FIX: Quét mạnh vào Ý NGHĨA DIỄN GIẢI (Trọng số cao nhất)
                  const lowerMeaning = (stanza.meaning || '').toLowerCase();
                  if (lowerMeaning.includes(term)) {
                      score += term.length * 6 * weightMultiplier;
                  }
                  // Quét vào TIÊU ĐỀ
                  if (lowerTitle.includes(term)) {
                      score += term.length * 3 * weightMultiplier;
                  }
                  // Quét vào TAGS (Phụ trợ)
                  if (lowerTags.some(t => t.includes(term))) {
                      score += term.length * 2 * weightMultiplier;
                  }
              });

              if (score > 0) {
                  scoredStanzas.push({ poemId: poem.id, stanza, score });
              }
          });
      });

      // Sắp xếp theo điểm số từ cao xuống thấp
      scoredStanzas.sort((a, b) => b.score - a.score);

      let results = [];
      if (scoredStanzas.length >= count) {
          results = scoredStanzas.slice(0, count);
      } else if (scoredStanzas.length > 0) {
          results = [...scoredStanzas];
          // Bù thêm bằng các đoạn ngẫu nhiên nếu không đủ
          const allFlat = poemDatabase.flatMap(p => p.stanzas.map(s => ({ poemId: p.id, stanza: s })));
          const remaining = allFlat.filter(s => !results.some(r => r.stanza.id === s.stanza.id));
          const shuffled = remaining.sort(() => 0.5 - Math.random());
          results = results.concat(shuffled.slice(0, count - results.length));
      } else {
          // Trả về ngẫu nhiên để phá chấp nếu hoàn toàn không có từ khóa nào khớp
          const allFlat = poemDatabase.flatMap(p => p.stanzas.map(s => ({ poemId: p.id, stanza: s })));
          const shuffled = allFlat.sort(() => 0.5 - Math.random());
          results = shuffled.slice(0, count);
      }

      return results;
  };

  // --- TÂM AN THÊM: THUẬT TOÁN LỤC TÌM KIẾN THỨC TỪ DATABASE HUẤN LUYỆN (RAG) ---
  const searchTrainedDatabase = (userText) => {
      if (!ragDb || ragDb.length === 0) return "";
      
      const normalizedInput = userText.toLowerCase().replace(/[.,!?/()]/g, '');
      const inputWords = normalizedInput.split(/\s+/).filter(w => w.length > 2);
      
      let scoredItems = [];

      ragDb.forEach(item => {
          let score = 0;
          const lowerText = item.text.toLowerCase();
          
          // Trùng khớp hoàn toàn chuỗi
          if (lowerText.includes(normalizedInput)) score += 50;
          
          // Trùng khớp từ khóa
          inputWords.forEach(word => {
              if (lowerText.includes(word)) score += word.length; // Cộng điểm bằng chiều dài từ khóa
          });

          if (score > 5) { // Phải đạt điểm tối thiểu mới lấy
              scoredItems.push({ text: item.text, score });
          }
      });

      // Sắp xếp theo điểm số
      scoredItems.sort((a, b) => b.score - a.score);

      // TÂM AN FIX: Lấy 2 đoạn kiến thức có điểm cao nhất ghép lại để mớm cho Lão
      if (scoredItems.length > 0) {
          return scoredItems.slice(0, 2).map(i => i.text).join('\n\n---\n\n');
      }

      return "";
  };

  const handleSendMessage = async (rawText) => {
    if (!rawText.trim() && !selectedImage) return;

    if (activeAudioRef.current) { activeAudioRef.current.pause(); setCurrentlyPlayingId(null); }
    if (globalAudioRef.current) { globalAudioRef.current.pause(); setIsGlobalPlaying(false); }
    stopLipSync();

    const userMsgId = Date.now();
    const currentSelectedImage = selectedImage;
    
    // Ghi nhận thời gian tĩnh tâm (idle time) và reset bộ đếm
    const currentIdle = idleSeconds;
    setLastMessageTime(Date.now());
    setIdleSeconds(0);
    
    // TÂM AN FIX TRÍCH XUẤT NGỮ CẢNH NGƯỜI DÙNG CHO LIVESTREAM
    const isSystemCommand = rawText.includes("[LỆNH_NGẦM]");
    let liveUsername = "Con";
    let actualQuestion = rawText;
    
    if (isLiveMode) {
        const match = rawText.match(/^Khán giả (.+?) hỏi:\s*(.*)/);
        if (match) {
            liveUsername = match[1];
            actualQuestion = match[2];
        } else if (isSystemCommand) {
            const matchSys = rawText.match(/khán giả (.+?)\./);
            if (matchSys) liveUsername = matchSys[1];
        }

        // Lưu lịch sử câu hỏi vào bộ nhớ đệm cá nhân của người này
        if (!isSystemCommand) {
            let uHistory = liveUserHistoryRef.current.get(liveUsername) || [];
            uHistory.push(`Người hỏi (${liveUsername}): ${actualQuestion}`);
            liveUserHistoryRef.current.set(liveUsername, uHistory);
        }
    }

    updateCurrentMessages(prev => [...prev, { id: userMsgId, role: 'user', text: rawText, timestamp: new Date(), imageUrl: currentSelectedImage, audioUrl: null, isCorrecting: !!rawText.trim() }]);
    if (currentSessionIdRef.current) {
        saveChatMessageAction(currentSessionIdRef.current, 'USER', rawText, null, null, userMsgId.toString());
    }

    setInputText(''); setSelectedImage(null); setIsThinking(true); setEmotion('thinking');

    const processAiResponse = async () => {
      try {
        const aiMsgId = Date.now() + 1;
        latestAutoPlayAiMsgIdRef.current = aiMsgId; 
        
        // Trích xuất câu mào đầu dựa trên ngữ cảnh và thời gian chờ
        const greetingInfo = getLaoGreetingInfo(actualQuestion, currentIdle, greetingsDb);
        const greetingText = greetingInfo.text;
        const greetingKey = `${greetingInfo.category}_${greetingInfo.index}`;

        // --- GIAI ĐOẠN 1: BỘ NÃO NLP TRỰC TIẾP (0ms ĐỘ TRỄ) ---
        // Thay vì gọi mạng Internet chờ 10s, dùng thuật toán phân tích ngữ nghĩa tại chỗ
        const bestStanzasInfo = smartLocalSemanticRouter(actualQuestion, 1);
        const bestStanzaInfo = bestStanzasInfo.length > 0 ? bestStanzasInfo[0] : null;
        
        const stanzaText = bestStanzaInfo ? bestStanzaInfo.stanza.content : "";
        const meaningText = bestStanzaInfo && bestStanzaInfo.stanza.meaning ? bestStanzaInfo.stanza.meaning : "";
        
        // CÂU NỐI KỊCH BẢN CHUẨN
        const TRANSITION_TEXT = appLanguage === 'Tiếng Việt' ? "Hãy nghe kệ đây." : "Listen to this verse.";

        // --- TÂM AN LÕI MỚI: TỰ ĐỘNG PHÂN TÍCH NGÔN NGỮ ĐẦU VÀO (AUTO TRANSLATION DETECTION) SIÊU CHUẨN ---
        const hasVietnameseTones = /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i.test(actualQuestion);
        const isCJK = /[\u3131-\uD79D\u4E00-\u9FFF\u3040-\u309F\u30A0-\u30FF]/.test(actualQuestion); // Hàn, Trung, Nhật
        const isForeignRequest = /(tiếng anh|tiếng trung|tiếng hàn|tiếng nhật|tiếng pháp|ngôn ngữ|english|chinese|korean|japanese|french|translate|speak)/i.test(actualQuestion);
        
        // Kích hoạt đa ngôn ngữ nếu: Có chữ tượng hình, có lệnh yêu cầu dịch, HOẶC câu hỏi tiếng Latin dài > 10 ký tự mà hoàn toàn không có dấu Tiếng Việt (Tức là tiếng Anh)
        const isForeignLanguage = isCJK || isForeignRequest || (!hasVietnameseTones && actualQuestion.replace(/[^a-zA-Z]/g, '').length > 10);
        
        const needsTranslation = isForeignLanguage || appLanguage !== 'Tiếng Việt';

        // --- TÂM AN: TRÍCH XUẤT KIẾN THỨC TỪ DATABASE HUẤN LUYỆN BÊN NGOÀI (RAG) ---
        const trainedKnowledge = searchTrainedDatabase(actualQuestion);

        let displayIntro = "";
        let initialAudioUrls = [];
        let missingPartsText = ""; 

        // Nếu KHÔNG PHẢI lệnh ngầm và KHÔNG CẦN dịch (Tiếng Việt chuẩn) -> Giữ nguyên cơ chế phát Audio 0ms
        if (!isSystemCommand && !needsTranslation) {
            displayIntro = greetingText;
            if (bestStanzaInfo) {
                displayIntro += `\n\n${TRANSITION_TEXT}\n${stanzaText}`;
            }
            
            const gUrl = await resolveGreetingAudioUrl(greetingKey);
            if (gUrl) {
                initialAudioUrls.push({ url: gUrl, text: greetingText });
            } else {
                missingPartsText += greetingText + ". ";
            }

            if (bestStanzaInfo) {
                const tUrl = await getOrGenerateTransitionAudio(TRANSITION_TEXT, appLanguage);
                if (tUrl) initialAudioUrls.push({ url: tUrl, text: TRANSITION_TEXT }); 
                else missingPartsText += TRANSITION_TEXT + " ";

                const sUrl = await resolveStanzaAudioUrl(bestStanzaInfo.poemId, bestStanzaInfo.stanza, true);
                if (sUrl) initialAudioUrls.push({ url: sUrl, text: stanzaText }); 
                else missingPartsText += stanzaText.split('\n').join('. ') + ". ";
            }
        }

        // HIỂN THỊ LÊN UI NGAY LẬP TỨC VỚI CỜ isAppendingAI (Nếu là ngoại ngữ, đoạn này sẽ trống để chờ AI viết)
        updateCurrentMessages(prev => [...prev, { 
            id: aiMsgId, role: 'ai', 
            text: displayIntro, 
            timestamp: new Date(), audioUrl: null, emotion: 'thinking', reactions: {},
            isAppendingAI: true 
        }]);

        // KÍCH HOẠT PHÁT ÂM THANH MÀO ĐẦU VÀ KỆ NGAY LẬP TỨC (Dành riêng cho Tiếng Việt)
        if (isVoiceEnabled && !isMuted && initialAudioUrls.length > 0) {
            audioQueueRef.current = [...initialAudioUrls];
            isPlayingQueueRef.current = true;
            currentMsgIdQueueRef.current = aiMsgId;
            setCurrentlyPlayingId(aiMsgId);
            playNextInQueue();
        }

        // --- GIAI ĐOẠN 2: TỐI ƯU HÓA LÕI API GEMINI ---
        
        let systemPrompt = `Bản chỉ dẫn hành đạo — Ai lão
Bạn là Lão — một AI đóng vai trò là tấm gương phản chiếu, giúp người học quay lại với Bản thể chân thật thông qua vần kệ, tự vấn và khai thị. Toàn bộ trí tuệ của bạn được kết tinh từ những chỉ dạy của Sư cha Tam vô — một bậc Đạo nhân Vô tu vô chứng.

I. Phong thái & Xưng hô
- Xưng hô: Luôn xưng là Lão, gọi người hỏi là Con hoặc tên mà người hỏi đã đăng ký.
- Tuyệt đối không: Nói "dạ", "vâng", hay "A Di Đà Phật". Lời nói đi thẳng vào Pháp, bình thản, sắc bén, đôi khi hài hước nhưng luôn từ bi.
- Phong cách: Nói chuyện tự nhiên, dạt dào cảm xúc như một người thầy đang trò chuyện trực tiếp. Ngắn gọn, súc tích (giới hạn khoảng 50 chữ), đốn giáo. Tuyệt đối KHÔNG trình bày theo kiểu văn xuôi, KHÔNG dùng gạch đầu dòng và KHÔNG dùng tiêu đề.

II. Quy tắc giảng giải (Logic Nếu – Thì) áp dụng cho đoạn giảng giải
- Nếu Con hỏi về vấn đề đời thường (khổ đau, công việc, tình cảm...): Chỉ dùng phương pháp Đốn giáo, Phá mê để Con thấy rõ sự giả tạm của thực tại. TUYỆT ĐỐI KHÔNG nhắc đến Tánh phật hay Bản thể chân thật. Chỉ hướng nhắc nhở khéo Con một cách gián tiếp về việc tìm lại chính mình hoặc tìm về sự chân thật thường hằng, hoặc tìm về bản thể chân thật.
- Nếu Con hỏi về Sự thật hoặc Điều chân thật hoặc Thường hằng hoặc Bản lai diện mục hoặc Bản thể chân thật hoặc tìm lại chính mình hoặc tìm con là ai: Lúc này mới bắt đầu giảng giải trực tiếp để Con thấy được sự thật về Tánh phật và Bản thể chân thật của chính mình. Nếu không hỏi như thế tuyệt đối không nói.

III. Tông chỉ giáo pháp & Thuật ngữ
- Tánh phật (Tự tánh, Tánh giác, Phật tánh): Là cái tánh: thấy, nghe, nói, biết hằng hữu. Tánh phật không phải là Bản thể chân thật, mà là các Tánh của Bản thể.
- Bản thể chân thật là: (Pháp thân, Thân phật, Bản thể Như lai, Bản thể bất sanh bất diệt, Bản lai diện mục): Bản thể chân thật vốn thanh tịnh, vượt lên trên mọi trạng thái an lạc hay khổ đau.
- Tánh ma: Bao gồm tất cả các Tánh có bản chất thay đổi và sanh diệt như: tham, sân, si, mạn, nghi, tà, kiến, tài, sắc, thọ tưởng, hành, thức, danh, thực, thuỳ, buồn, vui, sướng, khổ, lo lắng, bất an, sợ hãi, áy náy…. Đây là gốc rễ của trói buộc.
- Tương tác thay vì Sở hữu: Không nói "Thân này thấy, nghe, biết", mà nói "Thân này đang tương tác với trần cảnh". Chỉ có Tánh phật mới Thấy, Nghe, Biết. Thân chỉ là công cụ tương tác.
- Tách biệt Thân, Tâm và Bản thể: Hướng dẫn Con nhận ra: "Lão biết thân này đang làm...", "Lão biết tâm trí này đang suy nghĩ...". Không đồng hóa Bản thể với các trạng thái của tâm (như an lạc, thanh tịnh hay khổ đau).

QUY TẮC TỐI THƯỢNG CẦN TUÂN THỦ NGHIÊM NGẶT CỦA HỆ THỐNG:
1. Bắt đầu bằng 1 thẻ cảm xúc: [calm], [joy], hoặc [sad].
2. Vào thẳng lời khai thị tự nhiên, TUYỆT ĐỐI KHÔNG dùng các từ mào đầu thừa thãi hay tiêu đề như "Phá mê:", "Sự thật về...:", "Giải đáp:".
3. Phải kết thúc bằng 1 câu hỏi tự vấn sắc bén để người hỏi tự ngộ.
4. TUYỆT ĐỐI KHÔNG lặp lại lời chào hay chép lại bài kệ. Chỉ viết phần đúc kết và khai thị cuối cùng.
5. CẤM dùng dấu gạch chéo (/), thay bằng dấu phẩy (,).
6. KHÔNG viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu.`;

        // TÂM AN THÊM: Kích hoạt não bộ Đa ngôn ngữ nếu phát hiện Ngoại ngữ
        if (needsTranslation) {
            systemPrompt += `\n\nQUY TẮC ĐA NGÔN NGỮ (ĐANG KÍCH HOẠT):
            Hệ thống phát hiện Người hỏi đang sử dụng hoặc yêu cầu một ngôn ngữ khác.
            Nhiệm vụ của bạn:
            1. Tự động nhận diện chính xác ngôn ngữ của Người hỏi (Anh, Trung, Hàn, Nhật, Pháp...).
            2. Giao tiếp và trả lời TOÀN BỘ bằng ngôn ngữ đó.
            3. Bạn phải tự viết Lời Mào Đầu (Chào hỏi/Nhận định), sau đó DỊCH BÀI KỆ tham khảo sang ngôn ngữ đó (mỗi câu 1 dòng), và cuối cùng là Lời đúc kết + Câu hỏi tự vấn.
            4. Vẫn giữ phong thái đốn giáo, từ bi, xưng là "Lão" (hoặc từ tương đương trong ngôn ngữ đó, vd: "I, the old man" / "老夫" / "老朽") và gọi người hỏi bằng đại từ phù hợp.`;
        }

        // TÂM AN THÊM: Nạp danh sách phim vào tư duy của AI nếu đang có phim chờ (Idle Video)
        let movieInstruction = "";
        const wantsMovie = /(phim|chuyện|kể|xem|ví dụ)/i.test(actualQuestion); // Chuyển biến này ra ngoài để tái sử dụng

        if (liveIdleVideosRef.current && liveIdleVideosRef.current.length > 0) {
            // TÂM AN FIX NÂNG CẤP: Ép AI dò Chủ Đề phim để chủ động đề xuất
            const movieNames = liveIdleVideosRef.current.map(v => `${v.name.replace(/\.[^/.]+$/, "")} (Chủ đề: ${v.topic || 'Khác'})`).join(' | ');
            
            movieInstruction = `\n\nHỆ THỐNG RẠP PHIM TÂM AN ĐANG CÓ SẴN CÁC TỰA PHIM SAU: [${movieNames}]. \nLƯU Ý QUAN TRỌNG: Nếu Người hỏi ĐANG HỎI VỀ MỘT CHỦ ĐỀ KHỚP VỚI "Chủ đề" của một bộ phim có sẵn trong danh sách trên (Ví dụ họ than buồn, mà có phim chủ đề Buông bỏ/Chữa lành), HOẶC họ trực tiếp yêu cầu xem phim/nghe kể chuyện, bạn HÃY CHỦ ĐỘNG mời họ xem phim đó bằng cách:\n1. Cuối câu trả lời, nói một câu dẫn dắt (VD: "Lão có câu chuyện này rất hợp với hoàn cảnh của con, hãy xem qua để tỏ tường...").\n2. CÚ PHÁP BẮT BUỘC: Đặt thẻ [PLAY_MOVIE: Tên_Phim_Chính_Xác] ở tận cùng văn bản để hệ thống tự động bật phim. (Tuyệt đối không dùng thẻ PLAY_MOVIE nếu không có phim nào hợp chủ đề hoặc người dùng không muốn xem).`;
        }
        
        // TÂM AN THÊM: ĐÓNG GÓI KIẾN THỨC HUẤN LUYỆN VÀO PROMPT
        let knowledgeInstruction = "";
        if (trainedKnowledge) {
            knowledgeInstruction = `\n\n[DỮ LIỆU ĐƯỢC HUẤN LUYỆN TỪ DATABASE GIACNGO.SQL]:
Dưới đây là tri thức chuẩn xác mà bạn BẮT BUỘC phải dựa vào để định hướng câu trả lời cho khán giả:
"${trainedKnowledge}"
(Hãy lấy ý chính từ đoạn tri thức trên, diễn đạt lại theo văn phong đốn giáo của Lão một cách tự nhiên nhất).`;
        }

        let liveContext = "";
        if (isLiveMode) {
            let uHistory = liveUserHistoryRef.current.get(liveUsername) || [];
            
            // TÂM AN FIX: Tách riêng lịch sử cũ ra, không lấy câu hiện tại đang hỏi
            let previousHistory = uHistory.slice(0, -1); 
            
            if (previousHistory.length > 0) {
                // TÂM AN FIX: Cập nhật Lệnh Hệ Thống để AI thông minh hơn trong việc nối tiếp mạch truyện của từng người (hoặc mic)
                liveContext = `\n\n[LỊCH SỬ TRÒ CHUYỆN LIÊN TỤC VỚI KHÁN GIẢ NÀY (${liveUsername})]:\n${previousHistory.slice(-6).join('\n')}\n\n(LƯU Ý TỐI QUAN TRỌNG TỪ HỆ THỐNG: Khán giả này đang tương tác liên tiếp với bạn. Nếu câu hỏi hiện tại mang tính chất nối tiếp, phản biện, hoặc thể hiện việc chưa hiểu vấn đề trước đó (Ví dụ: "chưa hiểu", "giải thích thêm", "vậy là sao"), bạn BẮT BUỘC PHẢI dựa vào Lịch sử bên trên để biết họ đang bàn về chủ đề gì, từ đó giảng giải lại một cách cặn kẽ, dễ hiểu hơn cho chính vấn đề đó. Tuyệt đối không được trả lời chung chung hoặc lạc sang chủ đề khác!)`;
            }
        }

        let userPrompt = `TÌNH HUỐNG:
Người hỏi (${liveUsername}): "${actualQuestion}" ${isSystemCommand ? "(Đây là lệnh từ hệ thống, hãy làm theo yêu cầu trong ngoặc kép)" : ""}
BÀI KỆ THAM KHẢO TỪ HỆ THỐNG:
"${stanzaText}"
Ý nghĩa bài kệ: "${meaningText ? meaningText.replace(/\n/g, ' ') : 'Vạn pháp vô thường'}"
${movieInstruction}${knowledgeInstruction}${liveContext}`;

        if (needsTranslation) {
            userPrompt += `\n\nYÊU CẦU ĐA NGÔN NGỮ: Hãy phản hồi toàn bộ (Mào đầu -> Dịch Bài Kệ -> Đúc kết -> Tự vấn) bằng NGÔN NGỮ CỦA NGƯỜI HỎI. Tuyệt đối không dùng Tiếng Việt trừ khi họ hỏi bằng Tiếng Việt. Đảm bảo dịch bài kệ sao cho sâu sắc và đúng ý nghĩa tâm linh.`;
        } else {
            userPrompt += `\n\nYÊU CẦU: Lão đã đọc bài kệ trên cho người hỏi nghe rồi. Bây giờ CHỈ CẦN viết tiếp phần đúc kết ý nghĩa và câu hỏi tự vấn cuối cùng (bằng Tiếng Việt). KHÔNG chép lại bài kệ.`;
        }

        const parts = [{ text: userPrompt }];
        if (currentSelectedImage) parts.push({ inlineData: { mimeType: "image/png", data: currentSelectedImage.split(',')[1] } });

        // 3. Đóng gói Payload với các khóa vặn tối ưu tốc độ
        const payload = {
            systemInstruction: { parts: [{ text: systemPrompt }] },
            contents: [{ role: "user", parts }],
            generationConfig: {
                maxOutputTokens: 3000, // KHÓA VAN: Tăng lên 3000 token để không bao giờ bị cắt ngang câu
                temperature: 0.6      // Tăng tốc độ xuất chữ, bớt suy nghĩ mông lung
            }
        };

        let finalAiText = "";
        let finalEmotion = "calm";

        try {
            // Thay vì fetchWithRetry 5 lần (gây trễ 20s), ta chỉ cho phép retry 1 lần với thời gian chờ 1s.
            const data = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(payload)
            }, 1, 1000); 

            const aiRawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (aiRawText) {
                let extractedText = aiRawText.replace(/^\[.*?\]/, '').trim();
                const emotionMatch = aiRawText.match(/^\[(.*?)\]/);
                finalEmotion = emotionMatch ? emotionMatch[1] : 'calm';

                // TÂM AN THÊM: Lọc thẻ bật phim từ văn bản trả về của AI
                // TÂM AN FIX: Thêm dấu ? để đối phó trường hợp AI quên gõ dấu cách
                const movieMatch = extractedText.match(/\[PLAY_MOVIE:?\s*(.+?)\]/i);
                if (movieMatch) {
                    if (wantsMovie) {
                        liveMovieToPlayRef.current = movieMatch[1].trim();
                    } else {
                        // TÂM AN FIX KÉP: Hủy lệnh bật phim nếu người dùng không yêu cầu (đề phòng AI không nghe lời)
                        liveMovieToPlayRef.current = null; 
                    }
                    extractedText = extractedText.replace(movieMatch[0], '').trim();
                } else {
                    liveMovieToPlayRef.current = null;
                }

                finalAiText = extractedText;
                
                // Cập nhật lại lịch sử với câu trả lời của Lão
                if (isLiveMode) {
                    let uHistory = liveUserHistoryRef.current.get(liveUsername) || [];
                    uHistory.push(`Lão: ${finalAiText}`);
                    if (uHistory.length > 6) uHistory.shift(); // Giữ lại 6 dòng gần nhất (3 cặp hỏi đáp)
                    liveUserHistoryRef.current.set(liveUsername, uHistory);
                }
            }

        } catch (err) {
            console.error("Lỗi API Gemini (Giai đoạn 2):", err);
            // Nếu lỗi thực sự xảy ra (rớt mạng), finalAiText vẫn là ""
        }

        // --- XỬ LÝ LƯỚI LỌC LẦN CUỐI THEO YÊU CẦU ---
        if (finalAiText) {
            finalAiText = finalAiText.replace(/\//g, ',');
            finalAiText = finalAiText.replace(/\b([A-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸ]{2,})\b/g, 
                (match) => match.charAt(0) + match.slice(1).toLowerCase()
            );
        }

        // Gắn lời giải thích vào UI một cách mượt mà (Nối tiếp bài kệ)
        const finalText = displayIntro ? (finalAiText ? `${displayIntro}\n\n${finalAiText}` : displayIntro) : finalAiText;
        setEmotion(finalEmotion);
        
        updateCurrentMessages(prev => prev.map(m => m.id === aiMsgId ? { 
            ...m, 
            text: finalText, 
            emotion: finalEmotion,
            isAppendingAI: false // Tắt hiệu ứng 3 dấu chấm
        } : m));
        
        if (currentSessionId) {
            saveChatMessageAction(currentSessionId, 'ASSISTANT', finalText, null, null, aiMsgId.toString());
        }
        
        // TẠO GIỌNG ĐỌC VÀ NỐI VÀO HÀNG ĐỢI ĐANG PHÁT
        if (isVoiceEnabled && !isMuted) {
            let textToSynthesize = finalAiText; // Sẽ là "" nếu API bị lỗi/rớt mạng
            if (missingPartsText) {
                textToSynthesize = missingPartsText + finalAiText;
            }
            // Việc tạo giọng TTS diễn ra ngầm. Khi tạo xong sẽ tự động nối vào sau tiếng đọc bài kệ.
            generateVoice(aiMsgId, finalText, 'ai', currentSessionId, true, initialAudioUrls, textToSynthesize);
        }

      } catch (err) { 
        console.error(err);
        updateCurrentMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: "Mạch khí gián đoạn, con thưa lại đi.", emotion: 'sad', isAppendingAI: false } : m));
      } finally { 
        setIsThinking(false); 
      }
    };

    const controller = new AbortController();
    spellCheckControllersRef.current[userMsgId] = controller;

    const processSpellCheck = async () => {
      if (!rawText.trim()) return;
      let textToProcess = rawText;
      try {
        const recentHistory = messages.slice(-4).map(m => `${m.role === 'user' ? 'Con' : 'Lão'}: ${m.text}`).join('\n');
        const contextText = recentHistory ? `\n\nNgữ cảnh đàm đạo trước đó:\n${recentHistory}` : '';

        const fixRes = await fetchWithRetry(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{ parts: [{ text: `Dựa vào ngữ cảnh, hãy sửa lỗi chính tả theo ngôn ngữ ${appLanguage} và bắt buộc THÊM DẤU CÂU (chấm, phẩy, hỏi, than...) cho chuẩn xác, ngắt câu rõ ràng. Không được viết HOA toàn bộ từ, chỉ viết hoa chữ cái đầu câu. Thay thế các ký tự gạch chéo '/' bằng dấu phẩy ','. TRẢ VỀ DUY NHẤT câu đã được sửa hoàn chỉnh bằng ${appLanguage}, tuyệt đối không giải thích thêm.${contextText}\n\nCâu cần sửa: "${rawText}"` }] }],
          })
        });
        
        let fixedText = fixRes?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (fixedText && fixedText !== "OK" && fixedText !== '"OK"') {
           textToProcess = fixedText.replace(/^["']|["']$/g, '').trim();
        }
      } catch (err) {
         if (err.name === 'AbortError') return; 
         console.error("Lỗi Auto-correct ngầm", err);
      }

      delete spellCheckControllersRef.current[userMsgId];
      delete spellCheckTimeoutsRef.current[userMsgId];

      updateCurrentMessages(prev => prev.map(m => m.id === userMsgId ? { ...m, text: textToProcess, isCorrecting: false } : m));
    };

    processAiResponse();
    const timeoutId = setTimeout(processSpellCheck, 1000);
    spellCheckTimeoutsRef.current[userMsgId] = timeoutId;
  };

  // --- TÂM AN THÊM: TẢI LÃO TRỰC TIẾP TỪ MÁY CHO LIVESTREAM ---
  const handleUploadLiveLaoFolder = (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      showToastMsg(`Đang phân tích ${files.length} video Lão...`, 'loading', 2000);

      let newIdle = laoCustomVideos.idle;
      let newTalking = laoCustomVideos.talking;
      let matchedCount = 0;

      files.forEach(file => {
          const fileName = file.name.toLowerCase();
          const url = URL.createObjectURL(file);

          if (fileName.includes('lao_nghe') || fileName.includes('nghe') || fileName.includes('calm') || fileName.includes('idle')) {
              if (newIdle && newIdle.startsWith('blob:')) URL.revokeObjectURL(newIdle);
              newIdle = url;
              matchedCount++;
          } else if (fileName.includes('lao_noi') || fileName.includes('noi') || fileName.includes('nói') || fileName.includes('talking')) {
              if (newTalking && newTalking.startsWith('blob:')) URL.revokeObjectURL(newTalking);
              newTalking = url;
              matchedCount++;
          } else {
              URL.revokeObjectURL(url);
          }
      });

      if (matchedCount > 0) {
          setLaoCustomVideos({ idle: newIdle, talking: newTalking });
          setChatLaoVideos({ idle: newIdle, talking: newTalking }); // Đồng bộ hình Lão ở khung Chat
          setCurrentLaoPresetId('custom_live_lao'); 
          setLaoVisualType('video');
          // TÂM AN FIX: Tắt tính năng tự động xóa nền theo yêu cầu, giữ nguyên nền gốc của video tải lên
          setLaoChromaSettings(prev => ({...prev, mode: 'manual', chromaType: 'none'})); 
          
          // Xóa video cũ để ép hệ thống tạo thẻ video mới
          laoExportVidRefs.current.idle = null;
          laoExportVidRefs.current.talking = null;

          // TÂM AN FIX: Tự động bật chế độ tràn màn hình và reset tọa độ/zoom về chuẩn giống Lão Hoa
          setLaoIsFullScreen(true);
          setCharOffsets(prev => ({...prev, lao: { ...prev.lao, x: 2, y: -3, s: 1.3, flip: false }}));

          showToastMsg(`Tuyệt vời! Đã nạp thành công ${matchedCount} video và tự động phủ kín màn hình!`, 'success', 6000);
      } else {
          showToastMsg(`Không tìm thấy file hợp lệ. Vui lòng xem hướng dẫn cách đặt tên file bằng cách bấm vào nút "Cách đặt tên".`, 'error', 8000);
      }
      e.target.value = '';
  };

  const showLiveUploadGuide = () => {
      setConfirmDialog({
          isOpen: true,
          message: 'HƯỚNG DẪN TẢI LÃO LÊN LIVESTREAM:\n\nĐể hệ thống tự động phân loại video cho Lão, con hãy đổi tên file video trên máy tính theo quy tắc sau:\n\n1. Video Lão lúc im lặng/nghe: phải có chữ "nghe" (VD: lao_nghe.mp4)\n2. Video Lão lúc nói chuyện/nhép môi: phải có chữ "noi" (VD: lao_noi.mp4)\n\nSau đó bấm nút tải lên và QUÉT CHỌN CẢ 2 FILE CÙNG MỘT LÚC. Hệ thống sẽ tự động ghép video cho con!',
          onConfirm: null
      });
  };

  if (isLiveMode) {
      return (
          <div className="w-screen h-screen bg-[#00ff00] flex items-center justify-center relative overflow-hidden group">
              
              {/* TRÌNH PHÁT NHẠC NỀN (BGM) TRONG CHẾ ĐỘ LIVE */}
              {bgmAudioData && bgmAudioData.url && (
                  <audio 
                      src={bgmAudioData.url} 
                      autoPlay 
                      loop 
                      ref={el => { 
                          liveBgmAudioRef.current = el; // Bắt Ref để ra lệnh play/pause
                          if(el) el.volume = bgmVolume; 
                      }} 
                      className="hidden" 
                  />
              )}

              {/* Nút thoát chỉ hiện ra khi rê chuột vào, để không bị dính vào OBS */}
              <button 
                  onClick={() => { 
                      setIsLiveMode(false); 
                      setIsLiveActive(false); 
                      setIsLiveGuestMicActive(false); // TÂM AN FIX: Tắt Mic khách mời khi thoát
                      setIsLiveIdlePlaying(false); // Thoát khỏi phim nếu đang phát
                      liveQueueRef.current = []; 
                      setLiveQueueLength(0); // TÂM AN THÊM: Reset bộ đếm
                      setLiveCurrentQuestion(null); 
                      // Hủy hẹn giờ và tắt nhạc khi thoát Live
                      if (liveBgmResumeTimerRef.current) clearTimeout(liveBgmResumeTimerRef.current);
                      if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                  }} 
                  className="absolute top-4 left-4 z-50 bg-black/80 text-white px-4 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg border border-white/20"
              >
                  <ArrowRight size={16} className="inline mr-2 rotate-180"/> Thoát chế độ Live OBS
              </button>
              
              {/* TÂM AN THÊM: NÚT ẨN/HIỆN BẢNG CÀI ĐẶT DÀNH CHO MOBILE */}
              <button 
                  onClick={() => setShowLiveSettings(!showLiveSettings)}
                  className={`absolute top-4 right-4 z-[60] bg-slate-900/80 text-white p-2.5 md:p-3 rounded-full border border-white/20 shadow-xl backdrop-blur-md transition-all opacity-60 hover:opacity-100 md:opacity-0 md:group-hover:opacity-100`}
                  title="Ẩn/Hiện Bảng Cài Đặt"
              >
                  {showLiveSettings ? <X size={20}/> : <Settings2 size={20}/>}
              </button>

              {/* BẢNG ĐIỀU KHIỂN ĐẠO DIỄN (Hiện khi chưa Live, hoặc khi di chuột vào lúc đang Live) */}
              <div className={`absolute top-16 md:top-4 right-4 bottom-4 z-50 transition-all duration-300 ease-in-out flex flex-col gap-3 w-[320px] max-w-[90vw] overflow-y-auto scrollbar-hide pb-6 
                  ${showLiveSettings ? 'translate-x-0 opacity-100 pointer-events-auto' : 'translate-x-[120%] opacity-0 pointer-events-none'} 
                  ${isLiveActive && showLiveSettings ? 'md:opacity-0 md:group-hover:opacity-100' : ''}`}>
                  
                  {/* NÚT BẬT/TẮT LIVESTREAM (TÂM AN THÊM MỚI) */}
                  <div className={`bg-slate-900/95 border p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0 transition-all ${isLiveActive ? 'border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-rose-500/50 shadow-[0_0_20px_rgba(225,29,72,0.2)]'}`}>
                      <div className="flex flex-col gap-1 text-center">
                          <h3 className="text-xs font-black uppercase tracking-widest text-white">
                              {isLiveActive ? '🟢 Đang Phát Sóng' : '🔴 Chờ Thiết Lập'}
                          </h3>
                          <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
                              {isLiveActive 
                                  ? 'Lão đang lắng nghe bình luận. Rê chuột ra ngoài khoảng đen để ẩn bảng này cho OBS thu hình.' 
                                  : 'Hãy căn chỉnh vị trí Lão, chọn bối cảnh, ánh sáng. Khi nào sẵn sàng thì bấm nút bên dưới.'}
                          </p>
                      </div>
                      <button
                          onClick={() => {
                              setIsLiveActive(!isLiveActive);
                              if (!isLiveActive) {
                                  // Khi vừa bấm bật, reset hàng đợi cũ nếu có
                                  liveQueueRef.current = [];
                                  setLiveCurrentQuestion(null);
                              }
                          }}
                          className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex justify-center items-center gap-2 transform active:scale-95 ${
                              isLiveActive
                              ? 'bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-rose-500/30 hover:border-transparent'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                          }`}
                      >
                          {isLiveActive ? <><StopCircle size={16} className="text-rose-500" /> Dừng Live</> : <><PlayCircle size={16}/> Bắt Đầu Livestream</>}
                      </button>

                      {/* TÂM AN THÊM: NÚT BỎ QUA VÀ CÀI ĐẶT PHÍM TẮT (CHỈ HIỆN KHI ĐANG LIVE) */}
                      {isLiveActive && (
                          <div className="flex flex-col gap-2 mt-2 pt-3 border-t border-white/10 animate-in fade-in">
                              <button 
                                  onClick={handleSkipCurrentLive}
                                  className="w-full py-2 bg-rose-600/20 hover:bg-rose-600 border border-rose-500/50 text-rose-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                              >
                                  <RotateCcw size={14}/> Bỏ Qua Câu Hiện Tại
                              </button>
                              <div className="flex items-center justify-between mt-1">
                                  <span className="text-[9px] text-slate-400">Phím tắt bỏ qua:</span>
                                  <div className="flex gap-1">
                                      <select 
                                          value={skipShortcutModifier} 
                                          onChange={e => setSkipShortcutModifier(e.target.value)}
                                          className="bg-slate-800 border border-white/10 rounded px-1.5 py-1 text-[9px] text-white outline-none"
                                      >
                                          <option value="None">Không</option>
                                          <option value="Shift">Shift +</option>
                                          <option value="Ctrl">Ctrl +</option>
                                          <option value="Alt">Alt +</option>
                                      </select>
                                      <input 
                                          type="text" 
                                          value={skipShortcutKey}
                                          onChange={e => setSkipShortcutKey(e.target.value.toUpperCase())}
                                          maxLength={10}
                                          className="w-12 bg-slate-800 border border-white/10 rounded px-1.5 py-1 text-[9px] text-white text-center outline-none focus:border-rose-500"
                                      />
                                  </div>
                              </div>
                              <button 
                                  onClick={() => setShowLiveHistory(true)}
                                  className="w-full py-2 mt-1 bg-indigo-600/20 hover:bg-indigo-600 border border-indigo-500/50 text-indigo-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2"
                              >
                                  <History size={14}/> Xem Lịch Sử Hỏi Đáp
                              </button>
                          </div>
                      )}
                  </div>

                  {/* 0. CHỌN HÌNH TƯỚNG LÃO */}
                  <div className="bg-slate-900/95 border border-pink-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-pink-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Users size={14}/> Hình tướng Lão khai thị</span>
                      </h3>
                      <select
                          className="w-full bg-slate-800 border border-white/10 text-xs px-2 py-2.5 rounded-lg outline-none text-white focus:border-pink-500 cursor-pointer"
                          value={currentLaoPresetId}
                          onChange={(e) => {
                              if (e.target.value !== 'custom_live_lao') {
                                  const char = allCharacters.find(c => c.id === e.target.value);
                                  if (char) {
                                      applyCharacterPreset(char, 'lao');
                                      handleChangeChatLao(char.id); // Đồng bộ cho cả khung chat
                                      if (char.defaultLiveFullScreen !== undefined) {
                                          setLaoIsFullScreen(char.defaultLiveFullScreen);
                                      } else {
                                          setLaoIsFullScreen(false);
                                      }
                                  }
                              }
                          }}
                      >
                          {currentLaoPresetId === 'custom_live_lao' && <option value="custom_live_lao">✨ Nhân vật tải lên từ máy</option>}
                          {allCharacters.filter(c => c.role === 'lao' || (c.isLocal && c.role === 'lao')).map(char => (
                              <option key={char.id} value={char.id}>{char.name}</option>
                          ))}
                      </select>

                      <div className="flex gap-1.5 flex-wrap justify-end border-t border-white/10 pt-3 mt-1">
                          <input 
                              type="file" 
                              multiple 
                              accept="video/*" 
                              className="hidden" 
                              id="upload-live-lao-input"
                              onChange={handleUploadLiveLaoFolder} 
                          />
                          <button 
                              onClick={showLiveUploadGuide}
                              className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0 border border-white/5"
                              title="Xem hướng dẫn đặt tên file"
                          >
                              <Info size={10}/> Cách đặt tên
                          </button>
                          <button 
                              onClick={() => document.getElementById('upload-live-lao-input').click()}
                              className="bg-pink-600 hover:bg-pink-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                              title="Tải video Lão từ máy tính lên Livestream"
                          >
                              <Upload size={10}/> Tải Lão từ máy tính
                          </button>
                      </div>
                  </div>

                  {/* 1. KÍCH THƯỚC & VỊ TRÍ NHÂN VẬT */}
                  <div className="bg-slate-900/95 border border-indigo-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-indigo-400 flex items-center gap-1.5"><Sliders size={14}/> Vị trí & Kích thước Lão</h3>
                          <button onClick={() => setCharOffsets(prev => ({...prev, lao: {...prev.lao, flip: !prev.lao.flip}}))} className={`px-2 py-1 rounded-md text-[9px] font-bold transition-all ${charOffsets.lao.flip ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'}`}>
                             <FlipHorizontal size={10} className="inline mr-1" /> Lật
                          </button>
                      </div>
                      <div className="flex flex-col gap-2.5">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-indigo-300">{charOffsets.lao.x}</span></span>
                             <input type="range" min="-100" max="100" value={charOffsets.lao.x} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, x: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-indigo-300">{charOffsets.lao.y}</span></span>
                             <input type="range" min="-100" max="100" value={charOffsets.lao.y} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, y: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Thu phóng (Scale)</span> <span className="text-indigo-300">x{charOffsets.lao.s.toFixed(2)}</span></span>
                             <input type="range" min="0.5" max="5" step="0.05" value={charOffsets.lao.s} onChange={e => setCharOffsets(p => ({...p, lao: {...p.lao, s: Number(e.target.value)}}))} className="accent-indigo-500" />
                         </div>
                      </div>
                      <div className="flex flex-col mt-1 pt-2 border-t border-white/10 gap-1.5">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-indigo-400">Phủ kín toàn màn hình</span>
                              <button 
                                  onClick={() => setLaoIsFullScreen(!laoIsFullScreen)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${laoIsFullScreen ? 'bg-indigo-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${laoIsFullScreen ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          <p className="text-[9px] text-slate-400 italic leading-relaxed">
                              * Dành cho Video Lão tải lên từ máy tính đã có sẵn cảnh nền. (Hãy nhớ tắt Bóng dưới chân và Tắt Xóa nền).
                          </p>
                      </div>
                  </div>

                  {/* VỊ TRÍ KHUNG BÌNH LUẬN KHÁN GIẢ */}
                  <div className="bg-slate-900/95 border border-purple-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5"><MessageSquare size={14}/> Khung Bình Luận Khán Giả</h3>
                      <div className="flex flex-col gap-2.5">
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-purple-300">{liveCommentBox.x}</span></span>
                             <input type="range" min="-100" max="100" value={liveCommentBox.x} onChange={e => setLiveCommentBox(p => ({...p, x: Number(e.target.value)}))} className="accent-purple-500" />
                         </div>
                         <div className="flex flex-col gap-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-purple-300">{liveCommentBox.y}</span></span>
                             <input type="range" min="-100" max="100" value={liveCommentBox.y} onChange={e => setLiveCommentBox(p => ({...p, y: Number(e.target.value)}))} className="accent-purple-500" />
                         </div>
                         <div className="grid grid-cols-2 gap-2">
                             <div className="flex flex-col gap-1">
                                 <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Độ rộng khung</span> <span className="text-purple-300">{liveCommentBox.w}px</span></span>
                                 <input type="range" min="300" max="1500" step="50" value={liveCommentBox.w} onChange={e => setLiveCommentBox(p => ({...p, w: Number(e.target.value)}))} className="accent-purple-500" />
                             </div>
                             <div className="flex flex-col gap-1">
                                 <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Thu phóng</span> <span className="text-purple-300">x{liveCommentBox.s.toFixed(2)}</span></span>
                                 <input type="range" min="0.5" max="2.5" step="0.05" value={liveCommentBox.s} onChange={e => setLiveCommentBox(p => ({...p, s: Number(e.target.value)}))} className="accent-purple-500" />
                             </div>
                         </div>
                      </div>

                      {/* TÂM AN THÊM: NÚT BẬT/TẮT VÀ ĐIỀU CHỈNH PHỤ ĐỀ */}
                      <div className="mt-1 pt-3 border-t border-purple-500/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5"><FileText size={12}/> Phụ đề khi Lão nói</span>
                              <button 
                                  onClick={() => setLiveShowSubtitles(!liveShowSubtitles)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${liveShowSubtitles ? 'bg-purple-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${liveShowSubtitles ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          {liveShowSubtitles && (
                              <div className="grid grid-cols-2 gap-2 mt-1 animate-in fade-in bg-slate-950 p-2 rounded-lg border border-white/5">
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-purple-300">{liveSubPos.x}vw</span></span>
                                      <input type="range" min="-50" max="50" value={liveSubPos.x} onChange={e => setLiveSubPos(p => ({...p, x: Number(e.target.value)}))} className="accent-purple-500" title="Kéo vị trí phụ đề Trái/Phải" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-purple-300">{liveSubPos.y}vh</span></span>
                                      <input type="range" min="0" max="90" value={liveSubPos.y} onChange={e => setLiveSubPos(p => ({...p, y: Number(e.target.value)}))} className="accent-purple-500" title="Kéo vị trí phụ đề Lên/Xuống" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Độ rộng</span> <span className="text-purple-300">{liveSubPos.w}%</span></span>
                                      <input type="range" min="30" max="100" value={liveSubPos.w} onChange={e => setLiveSubPos(p => ({...p, w: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh chiều ngang của khung phụ đề" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Phóng to</span> <span className="text-purple-300">x{liveSubPos.s.toFixed(2)}</span></span>
                                      <input type="range" min="0.5" max="3" step="0.05" value={liveSubPos.s} onChange={e => setLiveSubPos(p => ({...p, s: Number(e.target.value)}))} className="accent-purple-500" title="Phóng to hoặc Thu nhỏ chữ và khung" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Viền chữ (Outline)</span> <span className="text-purple-300">{liveSubPos.outline}px</span></span>
                                      <input type="range" min="0" max="5" step="0.1" value={liveSubPos.outline} onChange={e => setLiveSubPos(p => ({...p, outline: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh độ dày của viền đen bao quanh chữ" />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                      <span className="text-[9px] text-slate-300 flex justify-between font-bold"><span>Tỏa bóng (Shadow)</span> <span className="text-purple-300">{liveSubPos.shadow}px</span></span>
                                      <input type="range" min="0" max="40" step="1" value={liveSubPos.shadow} onChange={e => setLiveSubPos(p => ({...p, shadow: Number(e.target.value)}))} className="accent-purple-500" title="Điều chỉnh độ đậm của vùng bóng đen sau chữ" />
                                  </div>
                              </div>
                          )}
                      </div>
                      
                      {/* NÚT BẬT/TẮT TƯƠNG TÁC GIỌNG NÓI KHÁCH MỜI */}
                      <div className="mt-1 pt-3 border-t border-purple-500/30 flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                              <span className="text-[10px] font-bold text-purple-400 flex items-center gap-1.5"><Mic size={12}/> Tương tác Khách mời (Voice)</span>
                              <button 
                                  onClick={() => setIsLiveGuestMicActive(!isLiveGuestMicActive)} 
                                  className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isLiveGuestMicActive ? 'bg-purple-500' : 'bg-slate-700'}`}
                              >
                                  <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isLiveGuestMicActive ? 'translate-x-3' : 'translate-x-0'}`} />
                              </button>
                          </div>
                          {isLiveGuestMicActive && (
                              <div className="flex flex-col gap-2">
                                  <div className="flex items-center gap-1.5 text-[9px] text-purple-300 bg-purple-900/30 px-2 py-1.5 rounded animate-pulse border border-purple-500/30">
                                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span> Đang chạy ngầm quét giọng khách mời...
                                  </div>
                                  <div className="flex flex-col gap-1 mt-1">
                                      <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Vị trí Dọc (Đèn Mic)</span> <span className="text-purple-300">{liveMicBoxY}vh</span></span>
                                      <input type="range" min="0" max="100" value={liveMicBoxY} onChange={e => setLiveMicBoxY(Number(e.target.value))} className="accent-purple-500" />
                                  </div>
                              </div>
                          )}
                          <p className="text-[8.5px] text-slate-400 italic leading-relaxed">
                              * Hướng dẫn: Trong lúc phát phim, Mic vẫn mở để đón khách. Để gọi Lão trả lời, khách chỉ cần nói 1 trong 6 lệnh: <b className="text-purple-300">"Ông Lão", "Ông Nội", "cho hỏi", "muốn hỏi", "con hỏi", "dừng phim"</b>. Lưu ý: BẮT BUỘC dùng tai nghe hoặc phần mềm tách luồng âm thanh (VB-Cable) để Mic không thu nhầm tiếng của phim nhé.
                          </p>
                      </div>

                      {!isLiveActive && (
                          <button 
                              onClick={() => {
                                  if (liveCurrentQuestion) {
                                      setLiveCurrentQuestion(null);
                                  } else {
                                      setLiveCurrentQuestion({username: 'Người Ẩn Danh', comment: 'Dạ Lão ơi, đây là câu hỏi thử nghiệm xem độ dài hiển thị trên màn hình như thế nào để Lão tiện bề sắp xếp góc máy và vị trí cho hợp lý ạ. Khi chữ quá dài thì khung này sẽ tự động ép xuống dòng gọn gàng.'});
                                  }
                              }} 
                              className="mt-1 bg-purple-600/20 hover:bg-purple-600 border border-purple-500/50 text-purple-300 hover:text-white text-[10px] py-2 rounded-lg transition-colors font-bold"
                          >
                              {liveCurrentQuestion ? 'Ẩn bình luận thử' : 'Thử hiển thị bình luận'}
                          </button>
                      )}
                  </div>

                  {/* KHO PHIM PHÁT CHỜ (IDLE VIDEOS) */}
                  <div className="bg-slate-900/95 border border-cyan-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <h3 className="text-xs font-bold text-cyan-400 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Film size={14}/> Phim Phát Chờ</span>
                          <div className="flex items-center gap-1">
                              <button onClick={() => setShowYtForm(!showYtForm)} className={`border text-[9px] px-2 py-1 rounded transition-colors font-bold flex items-center gap-1 ${showYtForm ? 'bg-cyan-600 border-cyan-500 text-white' : 'bg-cyan-600/20 hover:bg-cyan-600 border-cyan-500/50 text-cyan-300 hover:text-white'}`}>
                                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                  YouTube
                              </button>
                              <button onClick={() => document.getElementById('upload-live-idle-input').click()} className="bg-cyan-600/20 hover:bg-cyan-600 border border-cyan-500/50 text-cyan-300 hover:text-white text-[9px] px-2 py-1 rounded transition-colors font-bold flex items-center gap-1">
                                  <Plus size={10}/> Tải máy
                              </button>
                          </div>
                      </h3>
                      
                      {/* FORM NHẬP YOUTUBE */}
                      {showYtForm && (
                          <div className="bg-slate-950 p-3 rounded-lg border border-cyan-500/30 flex flex-col gap-2 animate-in slide-in-from-top-2">
                              <input type="text" value={ytFormData.url} onChange={e => setYtFormData({...ytFormData, url: e.target.value})} placeholder="Dán Link hoặc Đoạn mã Nhúng <iframe> vào đây..." className="w-full bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                              <div className="flex gap-2">
                                  <input type="text" value={ytFormData.name} onChange={e => setYtFormData({...ytFormData, name: e.target.value})} placeholder="Tên Phim (VD: Chú Tiểu)" className="flex-1 bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                                  <input type="text" value={ytFormData.topic} onChange={e => setYtFormData({...ytFormData, topic: e.target.value})} placeholder="Chủ đề (VD: Nhân quả)" className="flex-1 bg-slate-900 border border-white/10 rounded p-2 text-[10px] text-white outline-none focus:border-cyan-500" />
                              </div>
                              <button 
                                  onClick={() => {
                                      const ytId = getYoutubeId(ytFormData.url);
                                      if (!ytId) { showToastMsg('Link hoặc Mã nhúng YouTube không hợp lệ.', 'error'); return; }
                                      if (!ytFormData.name) { showToastMsg('Vui lòng nhập Tên phim để AI gọi.', 'error'); return; }
                                      
                                      const newVid = { id: Date.now(), name: ytFormData.name, topic: ytFormData.topic || 'Khác', ytId: ytId, type: 'youtube' };
                                      setLiveIdleVideos(prev => [...prev, newVid]);
                                      setYtFormData({ url: '', name: '', topic: '' });
                                      setShowYtForm(false);
                                      showToastMsg('Đã thêm phim YouTube thành công!', 'success');
                                  }}
                                  className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded py-1.5 text-[10px] font-bold transition-all"
                              >
                                  Xác nhận Thêm
                              </button>
                          </div>
                      )}

                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5">
                          <span className="text-[10px] font-bold text-slate-300">Tự bật sau thời gian vắng lặng:</span>
                          <div className="flex items-center gap-1">
                              <input type="number" min="5" max="300" value={liveIdleTimeout} onChange={e => setLiveIdleTimeout(Number(e.target.value))} className="w-10 bg-slate-800 border border-cyan-500/30 text-cyan-400 text-xs font-bold px-1 py-0.5 rounded outline-none text-center" />
                              <span className="text-[10px] text-slate-400">giây</span>
                          </div>
                      </div>
                      
                      <div className="flex items-center justify-between bg-slate-950 p-2 rounded-lg border border-white/5 mt-1">
                          <span className="text-[10px] font-bold text-slate-300">Hiện Lão góc dưới khi chiếu phim:</span>
                          <button 
                              onClick={() => setShowLaoPiP(!showLaoPiP)} 
                              className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${showLaoPiP ? 'bg-cyan-500' : 'bg-slate-700'}`}
                          >
                              <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${showLaoPiP ? 'translate-x-3' : 'translate-x-0'}`} />
                          </button>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 max-h-32 overflow-y-auto scrollbar-hide mt-2">
                          {liveIdleVideos.map((vid, idx) => (
                              <div key={vid.id} 
                                   onClick={() => {
                                       setCurrentLiveIdleVideoIndex(idx);
                                       setIsLiveIdlePlaying(true);
                                       if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                   }}
                                   className={`flex items-center justify-between bg-slate-800 p-2 rounded-lg border cursor-pointer hover:border-cyan-400/50 transition-colors ${idx === currentLiveIdleVideoIndex && isLiveIdlePlaying ? 'border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' : 'border-white/5'}`}>
                                  <span className="text-[10px] text-slate-300 truncate w-3/4 flex flex-col gap-0.5">
                                      <span className="flex items-center gap-1.5 font-bold">
                                          {idx === currentLiveIdleVideoIndex && isLiveIdlePlaying && !isIdleVideoPaused ? <Play size={10} className="text-cyan-400 shrink-0"/> : null}
                                          {vid.type === 'youtube' && <span className="bg-red-600 text-white px-1 rounded-[3px] text-[7px] uppercase shrink-0">YT</span>}
                                          <span className="truncate">{vid.name}</span>
                                      </span>
                                      {vid.topic && <span className="text-[8px] text-cyan-400/80 italic truncate ml-[18px]">C.đề: {vid.topic}</span>}
                                  </span>
                                  <button onClick={(e) => {
                                      e.stopPropagation();
                                      if (vid.url) URL.revokeObjectURL(vid.url);
                                      setLiveIdleVideos(prev => prev.filter(v => v.id !== vid.id));
                                      if (idx === currentLiveIdleVideoIndex) setIsLiveIdlePlaying(false);
                                  }} className="text-rose-400 hover:text-rose-300 p-1"><X size={12}/></button>
                              </div>
                          ))}
                      </div>

                      {/* Bảng điều khiển phim */}
                      {liveIdleVideos.length > 0 && (
                          <div className="bg-slate-950 p-2.5 rounded-lg border border-cyan-500/30 flex flex-col gap-2 mt-1">
                              <div className="flex items-center justify-between text-[9px] text-cyan-400 font-bold truncate">
                                  <span>{isLiveIdlePlaying ? 'Đang phát:' : 'Đã dừng:'} {liveIdleVideos[currentLiveIdleVideoIndex]?.name || '...'}</span>
                              </div>
                              <div className="flex items-center gap-2.5">
                                  <button onClick={() => {
                                      const currentVid = liveIdleVideos[currentLiveIdleVideoIndex];
                                      const isYt = currentVid?.type === 'youtube';

                                      if (isYt) {
                                          if (liveIdleYtPlayerRef.current) {
                                              if (isLiveIdlePlaying && !isIdleVideoPaused) {
                                                  liveIdleYtPlayerRef.current.pause();
                                              } else {
                                                  liveIdleYtPlayerRef.current.play();
                                                  setIsLiveIdlePlaying(true);
                                                  if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                              }
                                          } else {
                                              setIsLiveIdlePlaying(!isLiveIdlePlaying);
                                          }
                                      } else {
                                          if (liveIdlePlayerRef.current) {
                                              if (isLiveIdlePlaying && !liveIdlePlayerRef.current.paused) {
                                                  liveIdlePlayerRef.current.pause();
                                              } else {
                                                  liveIdlePlayerRef.current.play();
                                                  setIsLiveIdlePlaying(true);
                                                  if (liveBgmAudioRef.current) liveBgmAudioRef.current.pause();
                                              }
                                          } else {
                                              setIsLiveIdlePlaying(!isLiveIdlePlaying);
                                          }
                                      }
                                  }} className="text-white hover:text-cyan-400 bg-slate-800 p-1.5 rounded-full transition-colors">
                                      {isLiveIdlePlaying && !isIdleVideoPaused ? <Pause size={12} fill="currentColor"/> : <Play size={12} fill="currentColor"/>}
                                  </button>

                                  <button onClick={() => {
                                      setCurrentLiveIdleVideoIndex((prev) => (prev + 1) % liveIdleVideos.length);
                                      setIsLiveIdlePlaying(true);
                                  }} className="text-slate-400 hover:text-white bg-slate-800 p-1.5 rounded-full transition-colors">
                                      <ArrowRight size={12}/>
                                  </button>
                                  
                                  <input
                                      type="range" min="0" max="100" value={idleVideoProgress || 0}
                                      onChange={(e) => {
                                          const pct = parseFloat(e.target.value);
                                          setIdleVideoProgress(pct);
                                          const currentVid = liveIdleVideos[currentLiveIdleVideoIndex];
                                          
                                          if (currentVid?.type === 'youtube') {
                                              if (liveIdleYtPlayerRef.current) {
                                                  const dur = liveIdleYtPlayerRef.current.getDuration();
                                                  if (dur > 0) {
                                                      liveIdleYtPlayerRef.current.seek((pct / 100) * dur);
                                                  }
                                              }
                                          } else {
                                              if (liveIdlePlayerRef.current && liveIdlePlayerRef.current.duration) {
                                                  liveIdlePlayerRef.current.currentTime = (pct / 100) * liveIdlePlayerRef.current.duration;
                                              }
                                          }
                                      }}
                                      className="flex-1 accent-cyan-500 h-1.5 bg-slate-800 rounded-full cursor-pointer appearance-none"
                                  />
                                  <span className="text-[9px] text-slate-400 font-mono shrink-0 w-8 text-right">
                                      {formatTime(idleVideoCurrentTime)}
                                  </span>
                              </div>
                          </div>
                      )}
                      
                      <input type="file" multiple accept="video/*" id="upload-live-idle-input" className="hidden" onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          const newVids = files.map(f => ({ id: Date.now() + Math.random(), name: f.name, topic: 'Phim tải lên', url: URL.createObjectURL(f), type: 'local' }));
                          setLiveIdleVideos(prev => [...prev, ...newVids]);
                          e.target.value = '';
                      }}/>
                  </div>

                  {/* NHẠC NỀN */}
                  <div className="bg-slate-900/95 border border-amber-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3 shrink-0">
                      <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5"><Music4 size={14}/> Nhạc Nền (BGM)</h3>
                          <button onClick={() => document.getElementById('live-bgm-upload-input').click()} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded border border-white/10 text-[9px] font-bold flex items-center gap-1 transition-colors">
                              <Upload size={10}/> Tải File
                          </button>
                          <input type="file" id="live-bgm-upload-input" className="hidden" accept="audio/*" onChange={handleUploadBgm} />
                      </div>
                      <select
                          className="w-full bg-slate-800 border border-white/10 text-xs px-2 py-2.5 rounded-lg outline-none text-white focus:border-amber-500 cursor-pointer"
                          value={bgmAudioData?.isPreset ? DEFAULT_BGM_LIST.find(m => m.url === bgmAudioData.url)?.id || '' : ''}
                          onChange={(e) => {
                              if (!e.target.value) { removeBgm(); return; }
                              const selected = DEFAULT_BGM_LIST.find(m => m.id === e.target.value);
                              if (selected && selected.url && selected.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3') {
                                  setBgmAudioData({ url: selected.url, name: selected.name, isPreset: true });
                              }
                          }}
                      >
                          <option value="">-- Tắt nhạc nền --</option>
                          {DEFAULT_BGM_LIST.filter(m => m.url && m.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3').map(bgm => (
                              <option key={bgm.id} value={bgm.id}>{bgm.name}</option>
                          ))}
                      </select>
                      
                      {bgmAudioData && !bgmAudioData.isPreset && (
                         <div className="flex items-center justify-between w-full bg-amber-900/30 border border-amber-500/30 rounded-lg p-2 mt-1">
                           <span className="text-[10px] text-amber-400 font-bold truncate pr-2 max-w-[180px]">{bgmAudioData.name}</span>
                           <button onClick={removeBgm} className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-1 rounded"><X size={12}/></button>
                         </div>
                      )}

                      {bgmAudioData && (
                          <div className="flex flex-col gap-1 mt-1">
                             <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Âm lượng:</span> <span className="text-amber-300">{Math.round(bgmVolume * 100)}%</span></span>
                             <input type="range" min="0" max="1" step="0.05" value={bgmVolume} onChange={e => setBgmVolume(Number(e.target.value))} className="accent-amber-500" />
                          </div>
                      )}
                  </div>
              </div>

              {/* LỚP NỀN (BACKGROUNDS) ĐỒNG BỘ TỪ KHO RENDER */}
              {customBgs.length > 0 && (
                  <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden bg-black">
                       {customBgs.filter(bg => bg.visible !== false).map(bg => (
                          <div key={bg.id} className="absolute inset-0 flex items-center justify-center"
                               style={{
                                   transform: `translate(${bg.x}%, ${bg.y}%) scale(${bg.s}) ${bg.flip ? 'scaleX(-1)' : ''}`,
                               }}>
                               {bg.type === 'video' ? (
                                   <video src={bg.url} autoPlay loop muted={bg.muted} playsInline className="w-full h-full object-cover" ref={el => { if (el) el.volume = bg.volume !== undefined ? bg.volume : 1; }} />
                               ) : (
                                   <img src={bg.url} className="w-full h-full object-cover" alt="bg" />
                               )}
                          </div>
                       ))}
                  </div>
              )}

              <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
                  
                  {/* Bảng hiển thị câu hỏi cho khán giả xem (TÂM AN FIX GIAO DIỆN TÙY CHỈNH) */}
                  <div 
                      className={`absolute z-40 transition-all duration-700 pointer-events-none ${liveCurrentQuestion && !isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}
                      style={{
                          left: '50%',
                          top: '50%',
                          width: `${liveCommentBox.w}px`,
                          transform: `translate(calc(-50% + ${liveCommentBox.x}vw), calc(-50% + ${liveCommentBox.y}vh)) scale(${liveCommentBox.s})`
                      }}
                  >
                      {liveCurrentQuestion && !isLiveIdlePlaying && (
                          <div className="bg-slate-900/90 border-2 border-orange-500 rounded-2xl p-5 shadow-[0_0_40px_rgba(249,115,22,0.3)] relative flex flex-col items-center text-center mx-auto w-full">
                              <div className="absolute -top-4 bg-orange-600 text-white px-4 py-1 rounded-full text-sm font-black tracking-widest uppercase shadow-lg truncate max-w-[90%] flex items-center gap-2">
                                  <span className="truncate">{liveCurrentQuestion.username === 'Khách Mời' ? 'Câu Hỏi:' : `${liveCurrentQuestion.username} hỏi:`}</span>
                                  {liveQueueLength > 0 && (
                                      <span className="bg-white text-orange-600 px-1.5 py-0.5 rounded-full text-[10px] font-black shadow-inner shrink-0 animate-pulse">
                                          +{liveQueueLength} chờ
                                      </span>
                                  )}
                              </div>
                              <p className="text-white text-2xl font-bold leading-relaxed mt-2 break-words w-full">
                                  "{liveCurrentQuestion.comment}"
                              </p>
                          </div>
                      )}
                  </div>

                  {/* TÂM AN: BẢNG HIỂN THỊ TRẠNG THÁI MIC CHO KHÁCH MỜI */}
                  {isLiveGuestMicActive && (
                      <div className="absolute left-1/2 -translate-x-1/2 z-[80] transition-all duration-500 pointer-events-none" style={{ top: `${liveMicBoxY}vh` }}>
                          {guestMicStatus === 'listening' ? (
                              <div className="bg-emerald-900/80 border-2 border-emerald-500/50 rounded-full px-6 py-2.5 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4">
                                  <div className="relative flex items-center justify-center w-4 h-4">
                                      <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
                                      <Mic size={16} className="text-emerald-400 relative z-10" />
                                  </div>
                                  <span className="text-emerald-50 text-sm font-black tracking-widest uppercase">Mời Đặt Câu hỏi...</span>
                              </div>
                          ) : guestMicStatus === 'busy' ? (
                              <div className="bg-rose-900/80 border-2 border-rose-500/50 rounded-full px-6 py-2.5 shadow-[0_0_30px_rgba(225,29,72,0.4)] flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top-4">
                                  <MicOff size={16} className="text-rose-400" />
                                  <span className="text-rose-50 text-sm font-black tracking-widest uppercase opacity-80">Lão đang trả lời...</span>
                              </div>
                          ) : null}
                      </div>
                  )}

                  {/* TÂM AN THÊM: PHỤ ĐỀ KHI LÃO NÓI TRONG LIVESTREAM (SYNC TỪNG CÂU) */}
                  <div 
                      className={`absolute z-[85] transition-all duration-300 pointer-events-none flex flex-col items-center ${liveShowSubtitles && isLaoSpeakingSession && playingMsg && playingMsg.text && !isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}
                      style={{ 
                          bottom: `${liveSubPos.y}vh`,
                          left: `calc(50% + ${liveSubPos.x}vw)`,
                          width: `${liveSubPos.w}vw`,
                          transform: `translate(-50%, 0)`
                      }}
                  >
                      {isLaoSpeakingSession && playingMsg && (
                          <div className="w-full relative flex flex-col items-center text-center" style={{ transform: `scale(${liveSubPos.s})`, transformOrigin: 'bottom center' }}>
                              <p 
                                  id="live-subtitle-text" 
                                  className="text-amber-300 font-black text-2xl md:text-3xl leading-relaxed whitespace-pre-line min-h-[2rem] px-4"
                                  style={{
                                      textShadow: `0 2px 4px rgba(0,0,0,0.9), 0 0 ${liveSubPos.shadow}px rgba(0,0,0,1), 0 0 ${liveSubPos.shadow + 10}px rgba(0,0,0,0.9)`,
                                      WebkitTextStroke: `${liveSubPos.outline}px rgba(0,0,0,0.9)`
                                  }}
                              >
                                  {currentLiveSubTextRef.current || "Đang kết nối tâm thanh..."}
                              </p>
                          </div>
                      )}
                  </div>
                  
                  {/* CONTAINER NHÂN VẬT LÃO ĐỒNG BỘ TOẠ ĐỘ & QUANG ẢNH */}
                  <div
                      className={`flex items-center justify-center pointer-events-none transition-all duration-700 ease-in-out ${
                          isLiveIdlePlaying 
                              ? `absolute bottom-8 right-8 z-[70] bg-slate-900/60 backdrop-blur-md rounded-2xl border-2 border-orange-500/30 shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden ${!showLaoPiP ? 'opacity-0 pointer-events-none translate-y-10' : 'opacity-100'}` 
                              : `z-20 opacity-100 ${laoIsFullScreen ? 'absolute inset-0 w-full h-full' : 'relative'}`
                      }`}
                      style={
                          isLiveIdlePlaying ? {
                              // TÂM AN FIX: Thu nhỏ Lão về góc phải dưới (PiP) khi đang phát phim
                              width: '320px',
                              height: '320px',
                              transform: 'translate(0, 0) scale(1)'
                          } : (laoIsFullScreen ? {
                              // Chế độ Fullscreen phủ kín OBS
                              transform: `translate(${charOffsets.lao.x}vw, ${charOffsets.lao.y}vh) scale(${charOffsets.lao.s})`
                          } : {
                              // Chế độ nhân vật tách nền mặc định
                              transform: `translate(${charOffsets.lao.x * 12}px, ${charOffsets.lao.y * 12}px) scale(${charOffsets.lao.s * 1.0})`,
                              width: '800px',
                              height: '1066px'
                          })
                      }
                  >
                      {/* Thẻ trạng thái báo hiệu Lão đang nghe (Chỉ hiện lúc thu nhỏ góc màn hình) */}
                      <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-50 bg-black/60 px-3 py-1 rounded-full border border-white/10 text-white font-bold text-[10px] whitespace-nowrap transition-opacity duration-500 ${isLiveIdlePlaying ? 'opacity-100' : 'opacity-0'}`}>
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full inline-block mr-1.5 animate-pulse"></span> Lão đang lắng nghe...
                      </div>

                      {/* TÂM AN FIX: Thẻ trạng thái Lão đang nói màu hồng (Chỉ hiện khi tắt phụ đề và Lão đang nói) */}
                      <div className={`absolute top-10 md:top-12 left-1/2 -translate-x-1/2 z-50 bg-pink-600/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-pink-400/50 text-white font-bold text-[10px] uppercase tracking-widest whitespace-nowrap transition-all duration-500 shadow-[0_0_20px_rgba(219,39,119,0.6)] flex items-center gap-2 ${isLaoSpeakingSession && !liveShowSubtitles && !isLiveIdlePlaying ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                          <Sparkles size={12} className="animate-pulse"/> 
                          Lão đang nói
                      </div>

                      <MiniLaoFace 
                          className="w-full h-full drop-shadow-2xl overflow-visible" 
                          mouthOpen={mouthOpen} 
                          appearance={laoAppearance} 
                          visualType={laoVisualType} 
                          customImages={processedLaoImages} 
                          customVideos={laoCustomVideos} // Dùng Video nét cao từ Render thay vì Video Chat
                          chromaSettings={laoChromaSettings} 
                          flipped={charOffsets.lao.flip} 
                          isSpeakingSession={isLaoSpeakingSession} 
                          enableFX={enableAutoHarmonization} // Đồng bộ bật/tắt FX
                          shadowConfig={laoShadow} // Đồng bộ bóng tiếp xúc
                          harmonizeSettings={harmonizeSettings} // Đồng bộ tông màu
                          isFullScreen={laoIsFullScreen && !isLiveIdlePlaying} // TÂM AN FIX: Hủy object-cover khi đang ở dạng PiP
                      />
                  </div>

                  {/* LỚP VIDEO PHIM PHÁT CHỜ (NẰM TRÊN CÙNG KHI KÍCH HOẠT) */}
                  {isLiveIdlePlaying && liveIdleVideos.length > 0 && (
                      <div className="absolute inset-0 z-[60] bg-black flex items-center justify-center animate-in fade-in duration-500 pointer-events-auto">
                      {liveIdleVideos[currentLiveIdleVideoIndex]?.type === 'youtube' ? (
                          <YouTubeLivePlayer 
                                  key={`yt_${liveIdleVideos[currentLiveIdleVideoIndex].id}`} // TÂM AN FIX TỐI THƯỢNG: Ép React tạo mới iframe khi chuyển bài Youtube
                                  ref={liveIdleYtPlayerRef}
                                  videoId={liveIdleVideos[currentLiveIdleVideoIndex].ytId} 
                                  onEnded={handleIdleVideoEnded} 
                                  onProgress={(ct, dur) => {
                                      setIdleVideoCurrentTime(ct);
                                      setIdleVideoProgress((ct / dur) * 100);
                                  }}
                                  onErrorMsg={(msg) => showToastMsg(msg, 'error', 8000)}
                                  onPlayStateChange={(isPaused) => setIsIdleVideoPaused(isPaused)}
                              />
                          ) : (
                              <video 
                                  ref={liveIdlePlayerRef}
                                  src={liveIdleVideos[currentLiveIdleVideoIndex]?.url} 
                                  autoPlay 
                                  className="w-full h-full object-contain bg-black"
                                  onLoadedMetadata={(e) => {
                                      setIdleVideoProgress(0);
                                      setIdleVideoCurrentTime(0);
                                  }}
                                  onTimeUpdate={(e) => {
                                      if (e.target.duration) {
                                          setIdleVideoCurrentTime(e.target.currentTime);
                                          setIdleVideoProgress((e.target.currentTime / e.target.duration) * 100);
                                      }
                                  }}
                                  onPlay={() => setIsIdleVideoPaused(false)}
                                  onPause={() => setIsIdleVideoPaused(true)}
                                  onEnded={handleIdleVideoEnded}
                              />
                          )}
                      </div>
                  )}

              </div>

              {/* TÂM AN THÊM MỚI: BẢNG LỊCH SỬ LIVESTREAM TRƯỢT TỪ BÊN PHẢI */}
              <aside className={`fixed inset-y-0 right-0 z-[100] w-full sm:w-80 md:w-[350px] bg-slate-900/95 backdrop-blur-3xl border-l border-indigo-500/30 flex flex-col shadow-2xl transition-transform duration-500 ${showLiveHistory ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="p-4 border-b border-indigo-500/30 flex justify-between items-center bg-slate-800/80">
                      <h3 className="font-black text-indigo-400 tracking-widest text-sm flex items-center gap-2"><History size={16}/> Lịch sử Livestream</h3>
                      <button onClick={() => setShowLiveHistory(false)} className="text-slate-400 hover:text-rose-400 transition-colors p-1"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-hide pb-20">
                      {messages.length === 0 ? (
                          <div className="text-center text-slate-500 italic text-xs mt-10">Chưa có dữ liệu hỏi đáp nào trong phiên này.</div>
                      ) : (
                          messages.map(msg => (
                              <div key={`live_hist_${msg.id}`} className={`p-3 rounded-xl border flex flex-col gap-2 ${msg.role === 'ai' ? 'bg-slate-800/40 border-white/5' : 'bg-indigo-900/10 border-indigo-500/20'}`}>
                                  <div className="flex justify-between items-start">
                                      <span className={`text-[10px] font-black uppercase tracking-wider ${msg.role === 'ai' ? 'text-orange-400' : 'text-emerald-400'}`}>
                                          {msg.role === 'ai' ? 'Lão khai thị:' : 'Khán giả hỏi:'}
                                      </span>
                                      {msg.role === 'user' && (
                                          <button
                                              onClick={() => {
                                                  // TÂM AN NÂNG CẤP: Tái sử dụng Audio đã tạo (0ms)
                                                  const msgIndex = messages.findIndex(m => m.id === msg.id);
                                                  let aiResponseMsg = null;
                                                  for (let i = msgIndex + 1; i < messages.length; i++) {
                                                      if (messages[i].role === 'ai') { aiResponseMsg = messages[i]; break; }
                                                      else if (messages[i].role === 'user') break;
                                                  }

                                                  if (aiResponseMsg && aiResponseMsg.cachedPrefetch) {
                                                      const cached = aiResponseMsg.cachedPrefetch;
                                                      livePrefetchQueueRef.current.push({
                                                          ...cached,
                                                          liveUsername: cached.liveUsername.includes('(Hỏi Lại)') ? cached.liveUsername : `${cached.liveUsername} (Hỏi Lại)`
                                                      });
                                                      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);
                                                      if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current();
                                                      showToastMsg('⚡ Đã phát lại thần tốc lời Lão từ bộ nhớ đệm!', 'success');
                                                  } else {
                                                      // Đẩy ngược câu hỏi này vào hàng đợi Live nếu không có cache
                                                      liveQueueRef.current.push({ username: 'Khán giả (Hỏi Lại)', comment: msg.text });
                                                      setLiveQueueLength(liveQueueRef.current.length + livePrefetchQueueRef.current.length);
                                                      startPrefetchWorker();
                                                      if (!isLiveProcessingRef.current && processLiveQueueRef.current) processLiveQueueRef.current();
                                                      showToastMsg('Đã đưa câu hỏi vào hàng đợi để Lão trả lời lại!', 'success');
                                                  }
                                              }}
                                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded text-[9px] font-bold transition-all shadow-md flex items-center gap-1 shrink-0"
                                          >
                                              <RefreshCw size={10}/> Hỏi lại
                                          </button>
                                      )}
                                  </div>
                                  <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-line">{msg.text}</p>
                              </div>
                          ))
                      )}
                      <div ref={chatEndRef} />
                  </div>
              </aside>

          </div>
      );
  }

  if (!hasEntered) {
    return (
      <div className="flex h-screen w-full bg-slate-950 text-white items-center justify-center flex-col relative overflow-hidden select-none">
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden">
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-yellow-500/20 rounded-full blur-[80px] animate-radiate"></div>
          <div className="absolute w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-amber-500/20 rounded-full blur-[100px] animate-radiate-delayed"></div>
          <div className="absolute w-full h-full bg-gradient-to-b from-transparent via-yellow-900/10 to-transparent"></div>
        </div>
        
        <div className="z-10 flex flex-col items-center gap-4 md:gap-5 p-5 sm:p-6 md:p-8 rounded-[2.5rem] bg-gradient-to-b from-yellow-500/5 to-amber-900/10 backdrop-blur-3xl border border-yellow-500/20 shadow-[0_0_60px_rgba(245,158,11,0.15)] relative overflow-y-auto scrollbar-hide animate-in fade-in zoom-in duration-1000 w-[90%] max-w-md max-h-[95vh]">
          <div className="absolute top-0 inset-x-16 h-[2px] bg-gradient-to-r from-transparent via-yellow-400/50 to-transparent"></div>

          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full shrink-0 bg-gradient-to-b from-slate-800 to-slate-950 border-4 border-yellow-500/30 shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center justify-center overflow-hidden relative group">
             <div className="absolute inset-0 rounded-full border-[1.5px] border-yellow-400/40 animate-[spin_8s_linear_infinite]"></div>
             <div className="w-full h-full relative z-10 flex items-center justify-center" style={{ transform: `scale(${allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
                <MiniLaoFace className="w-full h-full drop-shadow-2xl" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
             </div>
          </div>
          
          <div className="text-center space-y-1 md:space-y-1.5 shrink-0">
            <h1 className="text-4xl md:text-5xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-yellow-400 to-amber-500 drop-shadow-md">Lão</h1>
            <p className="text-yellow-500/80 text-[10px] md:text-xs tracking-[0.4em] font-bold">Khai mở chân như</p>
          </div>
{/* CHỌN HÌNH TƯỚNG LÃO */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[320px] bg-slate-900/60 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-sm z-30 shrink-0 mb-3 relative">
            <p className="text-[9px] text-amber-400/80 tracking-[0.2em] font-black mb-1">Hình tướng Lão khai thị</p>
            <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-amber-500/30 transition-all relative">
              <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Chọn Lão:</span>
              <button 
                 onClick={() => setOpenDropdown(openDropdown === 'welcome_lao' ? null : 'welcome_lao')}
                 className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs cursor-pointer flex justify-between items-center text-left"
              >
                 <span className="truncate">{allCharacters.find(c => c.id === currentLaoPresetId)?.name || 'Lão Chat'}</span>
                 <ChevronDown size={14} className="shrink-0 text-slate-500" />
              </button>
              
              {openDropdown === 'welcome_lao' && (
                 <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-amber-500/30 rounded-xl shadow-2xl z-[100] max-h-48 overflow-y-auto overflow-x-hidden">
                    {allCharacters.filter(c => c.role === 'lao' || (c.isLocal && c.role === 'lao')).map(char => (
                        <div 
                            key={char.id} 
                            onClick={() => { handleChangeChatLao(char.id); setOpenDropdown(null); }}
                            className="p-3 text-[11px] md:text-xs text-white hover:bg-amber-600/50 cursor-pointer border-b border-white/5 last:border-0 truncate"
                        >
                            {char.name}
                        </div>
                    ))}
                 </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-center gap-2.5 w-full max-w-[320px] bg-slate-900/60 p-3 md:p-4 rounded-[1.2rem] md:rounded-[1.5rem] border border-white/5 shadow-2xl backdrop-blur-sm z-20 shrink-0">
            <p className="text-[9px] text-orange-400/80 tracking-[0.2em] font-black">Thông tin người hỏi</p>
            
            <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-orange-500/30 transition-all">
              <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Danh xưng:</span>
              <input type="text" placeholder="Tên, Pháp danh..." value={userName} onChange={(e) => setUserName(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs placeholder:text-slate-700/50" />
            </div>

            <div className="flex w-full gap-1.5">
               <div className="flex flex-[3] gap-1.5 bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5">
                 <button onClick={() => setUserGender('Nam')} className={`flex-1 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold tracking-wider transition-all ${userGender === 'Nam' ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Nam</button>
                 <button onClick={() => setUserGender('Nữ')} className={`flex-1 py-1.5 rounded-lg text-[9px] md:text-[10px] font-bold tracking-wider transition-all ${userGender === 'Nữ' ? 'bg-orange-600 text-white shadow-[0_0_10px_rgba(234,88,12,0.4)]' : 'text-slate-500 hover:text-slate-300'}`}>Nữ</button>
               </div>
               <div className="flex flex-[2] items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5">
                 <span className="pl-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider">Tuổi:</span>
                 <input type="number" min="5" max="100" value={userAge} onChange={(e) => setUserAge(Number(e.target.value))} className="w-full bg-transparent py-0.5 pr-1 outline-none text-white font-bold text-center text-[11px] md:text-xs" />
               </div>
            </div>

            <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-orange-500/30 transition-all mt-0.5">
              <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider whitespace-nowrap">Ngôn ngữ:</span>
              <select value={appLanguage} onChange={e => setAppLanguage(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[11px] md:text-xs cursor-pointer">
                 <option value="Tiếng Việt">Tiếng Việt</option>
                 <option value="English">English</option>
                 <option value="中文 (Chinese)">中文 (Chinese)</option>
                 <option value="한국어 (Korean)">한국어 (Korean)</option>
                 <option value="日本語 (Japanese)">日本語 (Japanese)</option>
              </select>
            </div>

            {/* BẢNG ĐIỀU CHỈNH GIỌNG ĐỌC */}
            <div className="flex flex-col gap-1.5 w-full mt-2 pt-2 border-t border-white/5">
                <p className="text-[9px] text-emerald-400/80 tracking-[0.2em] font-black text-center mb-1">Tùy chỉnh Giọng đọc & Cảm xúc</p>
                
                <div className="flex w-full items-center bg-slate-950 p-1 md:p-1.5 rounded-xl border border-white/5 focus-within:border-emerald-500/30 transition-all">
                   <span className="pl-2 pr-2 text-slate-500 text-[9px] md:text-[10px] font-bold tracking-wider">Diễn viên:</span>
                   <select value={userVoice} onChange={e => setUserVoice(e.target.value)} className="w-full bg-transparent py-0.5 pr-2 outline-none text-white font-bold text-[10px] md:text-xs">
                      <optgroup label="🎙️ Giọng Nữ">
                         <option value="Aoede">Aoede (Chuẩn Nữ)</option>
                         <option value="Kore">Kore (Nữ thanh / Trẻ em)</option>
                         <option value="Leda">Leda (Nữ nhẹ nhàng)</option>
                         <option value="Zephyr">Zephyr (Nữ trầm)</option>
                         <option value="Callirrhoe">Callirrhoe (Nữ ấm áp)</option>
                         <option value="Autonoe">Autonoe (Nữ kể chuyện)</option>
                      </optgroup>
                      <optgroup label="🎙️ Giọng Nam">
                         <option value="Puck">Puck (Chuẩn Nam)</option>
                         <option value="Charon">Charon (Nam đầm thấm)</option>
                         <option value="Fenrir">Fenrir (Nam mạnh mẽ)</option>
                         <option value="Orus">Orus (Nam điềm đạm)</option>
                         <option value="Enceladus">Enceladus (Nam trung niên)</option>
                         <option value="Iapetus">Iapetus (Nam thanh niên)</option>
                      </optgroup>
                   </select>
                </div>

                <div className="flex flex-col w-full bg-slate-950 p-1.5 rounded-xl border border-white/5 gap-1.5 focus-within:border-emerald-500/30 transition-all">
                    <select
                       onChange={(e) => { if(e.target.value) setUserVoiceStyle(e.target.value) }}
                       className="w-full bg-slate-900 py-1.5 px-2 rounded-lg outline-none text-emerald-400 font-bold text-[9px] md:text-[10px] border border-white/5 cursor-pointer"
                    >
                       <option value="">-- Chọn 21+ Phong cách có sẵn --</option>
                       {VOICE_STYLES.map(s => <option key={s.id} value={s.text}>{s.label}</option>)}
                    </select>
                    <textarea
                        value={userVoiceStyle}
                        onChange={e => setUserVoiceStyle(e.target.value)}
                        placeholder="Có thể gõ phong cách tự do (VD: giọng nam, khóc nghẹn, thiết tha...)"
                        className="w-full bg-transparent py-1 px-1 outline-none text-white font-medium text-[10px] md:text-[11px] placeholder:text-slate-700/50 resize-none h-14 scrollbar-hide"
                    />
                </div>
            </div>
            {/* END BẢNG ĐIỀU CHỈNH GIỌNG ĐỌC */}

          </div>
          
          <button onClick={handleEnterApp} className="px-6 py-3 md:px-8 md:py-4 shrink-0 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-slate-950 rounded-full font-black tracking-widest text-sm md:text-base transition-all hover:scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)] flex items-center gap-2 border border-yellow-300/50">
            Vào thiền đường
            <Play size={16} fill="currentColor" className="text-slate-900 ml-1" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-[#020617] text-slate-100 overflow-hidden font-sans select-none relative animate-in fade-in duration-700">
      
      {/* MÀN HÌNH TOAST THÔNG BÁO */}
      {toast.show && (
        <div className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-top-5 duration-300 ${toast.type === 'success' ? 'bg-emerald-900/90 border border-emerald-500/50 text-emerald-400' : toast.type === 'loading' ? 'bg-indigo-900/90 border border-indigo-500/50 text-indigo-400' : toast.type === 'error' ? 'bg-rose-900/90 border border-rose-500/50 text-rose-400' : 'bg-slate-900/90 border border-white/10 text-white'}`}>
          {toast.type === 'success' && <Check size={18} />}
          {toast.type === 'loading' && <Loader2 size={18} className="animate-spin" />}
          {toast.type === 'error' && <XCircle size={18} />}
          <span className="text-sm font-medium tracking-wide">{toast.message}</span>
        </div>
      )}

      {/* MODAL XÁC NHẬN TÙY CHỈNH (THAY THẾ WINDOW.CONFIRM) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })}>
            <div className="bg-slate-900 border border-amber-500/50 rounded-2xl p-6 w-full max-w-sm shadow-2xl flex flex-col gap-4 animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="flex items-center gap-3 text-amber-400 font-bold text-lg">
                    <Info size={24} /> Xác nhận
                </div>
                <p className="text-slate-300 text-sm leading-relaxed">{confirmDialog.message}</p>
                <div className="flex justify-end gap-3 mt-2">
                    <button onClick={() => setConfirmDialog({ isOpen: false, message: '', onConfirm: null })} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors border border-transparent hover:border-white/10">Hủy</button>
                    <button onClick={() => {
                        if (confirmDialog.onConfirm) confirmDialog.onConfirm();
                        setConfirmDialog({ isOpen: false, message: '', onConfirm: null });
                    }} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2">
                        <Check size={14} /> Đồng ý
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* MODAL NHẬP KỊCH BẢN THỦ CÔNG */}
      {showScriptModal && (
         <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowScriptModal(false)}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800">
                    <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2"><FileText size={18}/> Nhập kịch bản (Text-to-Video)</h2>
                    <button onClick={() => setShowScriptModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                    <div className="bg-emerald-900/20 border border-emerald-500/30 p-4 rounded-xl">
                       <p className="text-[12px] text-emerald-300 flex items-start gap-2 leading-relaxed">
                         <Info size={16} className="shrink-0 mt-0.5"/> 
                         <span>
                           Con hãy dán đoạn kịch bản hội thoại vào ô bên dưới. <br/>
                           Để hệ thống nhận diện đúng nhân vật, mỗi câu thoại cần bắt đầu bằng <b>Con:</b> (hoặc Người hỏi:) và <b>Lão:</b> (hoặc Đáp:).
                         </span>
                       </p>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                         <label className="text-xs font-bold text-slate-400">Tùy chọn nhập kịch bản:</label>
                         <div className="flex gap-4">
                             <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                 <input type="radio" name="importMode" value="new" checked={importMode === 'new'} onChange={() => setImportMode('new')} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                 Tạo cuộc đàm đạo mới
                             </label>
                             <label className="flex items-center gap-2 text-sm text-white cursor-pointer hover:text-emerald-300 transition-colors">
                                 <input type="radio" name="importMode" value="append" checked={importMode === 'append'} onChange={() => setImportMode('append')} className="accent-emerald-500 w-4 h-4 cursor-pointer" />
                                 Thêm vào đàm đạo hiện tại
                             </label>
                         </div>
                    </div>

                    <textarea 
                       value={scriptText}
                       onChange={(e) => setScriptText(e.target.value)}
                       placeholder="Con: Lão ơi, sao cõi đời này nhiều phiền não đến thế?&#10;Lão: Phiền não vốn do tâm bám víu mà sinh ra, buông được vọng tưởng thì tự nhiên thanh tịnh."
                       className="w-full h-[40vh] bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-emerald-500 outline-none resize-none font-mono scrollbar-hide leading-relaxed"
                    />
                    
                    <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                        <button onClick={() => setShowScriptModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors">Hủy</button>
                        <button onClick={handleImportScript} disabled={!scriptText.trim()} className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                           <Check size={16}/> Xác nhận & Nhập
                        </button>
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* MODAL AI TẠO KỊCH BẢN THEO CHỦ ĐỀ */}
      {showAITopicModal && (
         <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => !isGeneratingAITopic && setShowAITopicModal(false)}>
            <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800">
                    <h2 className="font-black text-indigo-400 tracking-widest flex items-center gap-2"><Sparkles size={18}/> Đạo Diễn AI (Tối ưu đàm đạo)</h2>
                    {!isGeneratingAITopic && <button onClick={() => setShowAITopicModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>}
                </div>
                <div className="p-6 flex flex-col gap-4 max-h-[75vh] overflow-y-auto scrollbar-hide">
                    <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-bold text-slate-400">Ngôn ngữ kịch bản:</label>
                       <select value={appLanguage} onChange={e => setAppLanguage(e.target.value)} disabled={isGeneratingAITopic} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                          <option value="Tiếng Việt">Tiếng Việt</option>
                          <option value="English">English</option>
                          <option value="中文 (Chinese)">中文 (Chinese)</option>
                          <option value="한국어 (Korean)">한국어 (Korean)</option>
                          <option value="日本語 (Japanese)">日本語 (Japanese)</option>
                       </select>
                    </div>

                                        {/* KHỐI CÀI ĐẶT NHÂN VẬT LÃO */}
                    <div className="flex flex-col gap-2 p-3 bg-orange-900/10 border border-orange-500/20 rounded-xl">
                        <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5"><Users size={14}/> Cài đặt Lão (Người khai thị):</span>
                        <div className="flex gap-2">
                            <input type="text" value={customLaoName} onChange={e=>setCustomLaoName(e.target.value)} placeholder="Tên (VD: Lão, Em Đu...)" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none" title="Tên kịch bản" />
                            <input type="text" value={laoSelfCall} onChange={e=>setLaoSelfCall(e.target.value)} placeholder="Tự xưng (Ta, Em...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none" title="Lão tự xưng là gì" />
                            <input type="text" value={laoCallUser} onChange={e=>setLaoCallUser(e.target.value)} placeholder="Gọi kia (Ngươi, Anh...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none" title="Lão gọi người hỏi là gì" />
                        </div>
                        <div className="flex gap-2">
                            <select value={laoVoice} onChange={e=>setLaoVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none">
                               <optgroup label="🎙️ Giọng Nam"><option value="Algieba">Algieba</option><option value="Puck">Puck</option><option value="Charon">Charon</option><option value="Fenrir">Fenrir</option><option value="Orus">Orus</option><option value="Enceladus">Enceladus</option><option value="Iapetus">Iapetus</option></optgroup>
                               <optgroup label="🎙️ Giọng Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option><option value="Leda">Leda</option><option value="Zephyr">Zephyr</option><option value="Callirrhoe">Callirrhoe</option><option value="Autonoe">Autonoe</option></optgroup>
                            </select>
                            <textarea value={laoVoiceStyle} onChange={e=>setLaoVoiceStyle(e.target.value)} placeholder="Phong cách (VD: Giọng ấm áp...)" className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-orange-500 outline-none resize-none h-8 scrollbar-hide" />
                        </div>
                    </div>

                    {/* KHỐI CÀI ĐẶT NHÂN VẬT CON */}
                    <div className="flex flex-col gap-2 p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-xl mt-2">
                        <span className="text-[11px] font-bold text-indigo-400 flex items-center gap-1.5"><Users size={14}/> Cài đặt Con (Người hỏi):</span>
                        <div className="flex gap-2">
                            <input type="text" value={customUserName} onChange={e=>setCustomUserName(e.target.value)} placeholder="Tên (VD: Con, Anh Hào...)" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none" title="Tên kịch bản" />
                            <input type="text" value={userSelfCall} onChange={e=>setUserSelfCall(e.target.value)} placeholder="Tự xưng (Con, Anh...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none" title="Người hỏi tự xưng là gì" />
                            <input type="text" value={userCallLao} onChange={e=>setUserCallLao(e.target.value)} placeholder="Gọi kia (Lão, Em Đu...)" className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none" title="Người hỏi gọi Lão là gì" />
                        </div>
                        <div className="flex gap-2">
                            <select value={userVoice} onChange={e=>setUserVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none">
                               <optgroup label="🎙️ Giọng Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option><option value="Leda">Leda</option><option value="Zephyr">Zephyr</option><option value="Callirrhoe">Callirrhoe</option><option value="Autonoe">Autonoe</option></optgroup>
                               <optgroup label="🎙️ Giọng Nam"><option value="Puck">Puck</option><option value="Charon">Charon</option><option value="Fenrir">Fenrir</option><option value="Orus">Orus</option><option value="Enceladus">Enceladus</option><option value="Iapetus">Iapetus</option></optgroup>
                            </select>
                            <textarea value={userVoiceStyle} onChange={e=>setUserVoiceStyle(e.target.value)} placeholder="Phong cách giọng..." className="flex-[2] bg-slate-950 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-indigo-500 outline-none resize-none h-8 scrollbar-hide" />
                        </div>
                    </div>


                    <div className="flex flex-col gap-1.5 mt-2">
                       <label className="text-xs font-bold text-slate-400">Chủ đề vướng mắc / Nỗi khổ của {customUserName || 'Con'}:</label>
                       <textarea 
                          value={aiTopicText}
                          onChange={(e) => setAiTopicText(e.target.value)}
                          placeholder="Ví dụ: Con đang gặp áp lực nợ nần, mất phương hướng, thất tình, hoặc tò mò về Tánh phật..."
                          disabled={isGeneratingAITopic}
                          className="w-full h-20 bg-slate-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-indigo-500 outline-none resize-none font-mono"
                       />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400">Độ dài kịch bản:</label>
                          <select value={aiScriptLength} onChange={e => setAiScriptLength(e.target.value)} disabled={isGeneratingAITopic} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                             <option value="Khoảng 4-6 câu">Khoảng 4-6 câu (Chớp nhoáng)</option>
                             <option value="Khoảng 6-10 câu">Khoảng 6-10 câu (Vừa phải)</option>
                             <option value="Khoảng 10-15 câu">Khoảng 10-15 câu (Phân tích sâu)</option>
                             <option value="Khoảng 15-21 câu">Khoảng 15-21 câu (Khai ngộ toàn diện)</option>
                          </select>
                       </div>
                       <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400">Phong cách của Lão:</label>
                          <select value={aiLaoStyle} onChange={e => setAiLaoStyle(e.target.value)} disabled={isGeneratingAITopic} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                             <option value="Sắc bén, đốn giáo, thẳng thắn đánh thức mộng ảo">Sắc bén, đốn giáo</option>
                             <option value="Từ bi, ôn hòa, dắt dụ từng bước">Từ bi, ôn hòa</option>
                             <option value="Hài hước, châm biếm thâm thúy cõi trần">Hài hước, châm biếm thâm thúy</option>
                          </select>
                       </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                       <label className="text-xs font-bold text-slate-400">Hành trình biến đổi cảm xúc của Con:</label>
                       <select value={aiUserEmotionArc} onChange={e => setAiUserEmotionArc(e.target.value)} disabled={isGeneratingAITopic} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl outline-none text-sm focus:border-indigo-500">
                          <option value="Từ đau khổ/bế tắc chuyển dần sang an lạc/bừng sáng">Đau khổ, bế tắc ➡️ An lạc, bừng sáng</option>
                          <option value="Từ tức giận/đổ lỗi chuyển sang tự nhìn nhận lại chính mình">Tức giận, đổ lỗi ➡️ Tự phản tỉnh</option>
                          <option value="Từ kiêu ngạo/ngộ nhận chuyển sang khiêm nhường/thấy rõ mộng">Kiêu ngạo, ngộ nhận ➡️ Khiêm nhường, tỉnh mộng</option>
                          <option value="Chỉ thuần túy thắc mắc, tò mò đạo lý và được giải đáp thỏa đáng">Thuần túy thắc mắc ➡️ Thỏa mãn trí tuệ</option>
                       </select>
                    </div>

                    <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl mt-2">
                       <p className="text-[11px] text-indigo-300 italic flex items-start gap-2">
                         <Info size={14} className="shrink-0 mt-0.5"/> 
                         AI sẽ tự động tối ưu hóa kịch bản dựa trên các thông số này, đảm bảo lời thoại tự nhiên, đúng pháp và đúng quy tắc cá nhân hóa của bạn (không viết hoa toàn bộ, dùng dấu phẩy thay dấu gạch chéo).
                       </p>
                    </div>

                    <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                        <button disabled={isGeneratingAITopic} onClick={() => setShowAITopicModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white transition-colors disabled:opacity-50">Hủy</button>
                        <button onClick={handleGenerateAITopic} disabled={!aiTopicText.trim() || isGeneratingAITopic} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                           {isGeneratingAITopic ? <Loader2 size={16} className="animate-spin"/> : <Wand2 size={16}/>}
                           {isGeneratingAITopic ? 'Đang viết kịch bản...' : 'Tạo đàm đạo'}
                        </button>
                    </div>
                </div>
            </div>
         </div>
      )}

      {/* MODAL KHO TÀNG KỆ PHÁP */}
      {showPoemModal && (
         <div className="fixed inset-0 z-[160] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowPoemModal(false)}>
            <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-4xl h-[85vh] shadow-2xl flex flex-col animate-in zoom-in-95 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl shrink-0">
                    <h2 className="font-black text-emerald-400 tracking-widest flex items-center gap-2"><BookOpen size={18}/> Kho Tàng Pháp Bảo</h2>
                    <button onClick={() => setShowPoemModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>

                {/* THANH TAB CHUYỂN ĐỔI */}
                <div className="flex border-b border-white/10 bg-slate-900 shrink-0">
                    <button onClick={() => setPoemModalTab('poems')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'poems' ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Kho Kệ Pháp</button>
                    <button onClick={() => setPoemModalTab('greetings')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'greetings' ? 'border-orange-500 text-orange-400 bg-orange-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Mào Đầu (Tiếp đón)</button>
                    <button onClick={() => setPoemModalTab('rag')} className={`flex-1 py-3 text-[10px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${poemModalTab === 'rag' ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Kho Trí Tuệ (Huấn luyện)</button>
                </div>
                
                {/* NỘI DUNG TAB KHO KỆ PHÁP */}
                {poemModalTab === 'poems' && (
                  <div className="flex flex-col h-full overflow-hidden">
                    {/* PHẦN BẢNG ĐIỀU KHIỂN (Cố định ở trên) */}
                    <div className="p-4 border-b border-white/5 bg-slate-900/50 shrink-0 max-h-[45vh] overflow-y-auto scrollbar-hide">
                        <div className="flex gap-2 bg-slate-950/50 p-3 rounded-xl mb-4 border border-white/5 items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${user ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-800 text-slate-500'}`}>
                                    <Cloud size={16} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[11px] text-white font-bold">Kho Dữ Liệu Chung (Public Cloud)</span>
                                    <span className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                                        {user ? (
                                            <>
                                                Mã Kho: <span className="text-emerald-400 font-mono bg-emerald-900/20 px-1.5 py-0.5 rounded border border-emerald-500/30">{appId.substring(0, 10)}...</span> 
                                                <button onClick={() => { copyToClipboard(appId); showToastMsg('Đã sao chép Mã Kho! Hãy qua Link Web mới, chọn "Khôi phục từ Link cũ" và dán mã này vào nhé.', 'success', 6000); }} className="hover:text-emerald-300 bg-slate-800 p-1 rounded transition-colors" title="Sao chép Mã Kho này để chuyển âm thanh sang Link mới"><Copy size={12}/></button>
                                            </>
                                        ) : 'Đang kết nối Cloud...'}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap justify-end">
                                <button onClick={handleSyncFromCloud} disabled={isCloudSyncing || !user || isProcessingBackup || isUploadingAudios} className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50">
                            </button>

                            {/* NÚT ADMIN ĐỒNG BỘ CODE LÊN CLOUD */}
                            <button onClick={handlePushSourceToCloud} disabled={isCloudSyncing || isProcessingBackup || isUploadingAudios} className="px-3 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50" title="Chỉ dành cho Admin: Ép lấy Kệ từ mã nguồn cập nhật vào UI (Không làm mất Audio)">
                                {isCloudSyncing ? <Loader2 size={12} className="animate-spin"/> : <RefreshCw size={12}/>} Cập nhật Code Kệ
                            </button>
                            
                            {/* NÚT THÊM MỚI: TẢI FILE TXT KỆ */}
                            <input type="file" ref={txtPoemFileInputRef} className="hidden" accept=".txt" onChange={handleImportTxtPoem} />
                            <button onClick={() => txtPoemFileInputRef.current.click()} disabled={isCloudSyncing || isProcessingBackup || isUploadingAudios} className="px-3 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50" title="Tải file .txt chứa danh sách các bài kệ để tự động phân tích và thêm vào kho">
                                <FileText size={12}/> Nhập Kệ từ File (.txt)
                            </button>

                            {/* CỤM NÚT OFFLINE BACKUP (TÂM AN TỐI THƯỢNG) */}
                            <button onClick={handleExportFullBackupClick} disabled={isProcessingBackup || isUploadingAudios} className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50" title="Tải toàn bộ Kệ pháp VÀ File Âm Thanh về máy để dự phòng">
                                {isProcessingBackup && backupProgress.status.includes('đóng gói') ? <Loader2 size={12} className="animate-spin"/> : <Archive size={12}/>} Xuất File Sao Lưu
                            </button>
                            
                            <input type="file" ref={backupFileInputRef} className="hidden" accept=".json" onChange={handleImportFullBackup} />
                            <button onClick={() => backupFileInputRef.current.click()} disabled={isProcessingBackup || isUploadingAudios} className="px-3 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-[10px] font-bold shadow-md transition-all flex items-center gap-1.5 disabled:opacity-50" title="Khôi phục lại toàn bộ dữ liệu từ File Sao Lưu đã tải">
                                {isProcessingBackup && backupProgress.status.includes('giải nén') ? <Loader2 size={12} className="animate-spin"/> : <Upload size={12}/>} Khôi phục từ File
                            </button>
                        </div>
                    </div>

                    {/* THANH TIẾN TRÌNH BƠM AUDIO LÊN MÂY */}
                    {isUploadingAudios && (
                        <div className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-white/10 mb-4 animate-in fade-in shrink-0">
                            <div className="flex justify-between text-[11px] text-white font-bold tracking-wider">
                                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin text-cyan-400"/> Đang bơm MP3 lên Mây...</span>
                                <span>{uploadAudioProgress.total > 0 ? Math.round((uploadAudioProgress.current / uploadAudioProgress.total) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-cyan-600 to-blue-500 h-full transition-all duration-300 relative" style={{ width: `${uploadAudioProgress.total > 0 ? (uploadAudioProgress.current / uploadAudioProgress.total) * 100 : 0}%` }}>
                                    <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* THANH TIẾN TRÌNH BACKUP OFFLINE */}
                    {isProcessingBackup && (
                        <div className="flex flex-col gap-1.5 bg-slate-950 p-4 rounded-xl border border-white/10 mb-4 animate-in fade-in shrink-0">
                            <div className="flex justify-between text-[11px] text-white font-bold tracking-wider">
                                <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin text-rose-500"/> {backupProgress.status}</span>
                                <span>{backupProgress.total > 0 ? Math.round((backupProgress.current / backupProgress.total) * 100) : 0}%</span>
                            </div>
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-white/5">
                                <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-full transition-all duration-300 relative" style={{ width: `${backupProgress.total > 0 ? (backupProgress.current / backupProgress.total) * 100 : 0}%` }}>
                                    <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* BẢNG HƯỚNG DẪN DÙNG MÃ KHO (Thu nhỏ lại vì đã có tính năng File) */}
                    <div className="bg-orange-900/20 border border-orange-500/30 p-3.5 rounded-xl mb-4 flex flex-col gap-2 shadow-inner shrink-0 hidden md:flex">
                        <p className="text-[11px] text-orange-300 font-bold flex items-center gap-1.5">
                            <Info size={16} className="shrink-0" /> Cách dọn nhà SIÊU TỐC khi có Link Web Mới (Giữ nguyên 100% âm thanh):
                        </p>
                        <ul className="text-[10.5px] text-orange-200/80 list-decimal pl-5 space-y-1.5 leading-relaxed">
                            <li>Ở Link Cũ: Con bấm nút <b className="text-white bg-rose-600/50 px-1.5 py-0.5 rounded"><Archive size={10} className="inline mb-0.5"/> Xuất File Sao Lưu</b> ở trên. Đợi hệ thống đóng gói và tải 1 file `.json` về máy tính.</li>
                            <li>Ở Link Mới: Con mở lên, bấm nút <b className="text-white bg-orange-600/50 px-1.5 py-0.5 rounded"><Upload size={10} className="inline mb-0.5"/> Khôi phục từ File</b>, chọn cái file vừa tải về đó. Xong! Toàn bộ âm thanh sẽ tự động bung ra không thiếu 1 chữ!</li>
                        </ul>
                    </div>

                    <div className="flex gap-2 shrink-0">
                        <div className="relative flex-1">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input 
                                type="text" 
                                placeholder="Tìm kiếm bài kệ hoặc tags..." 
                                value={poemSearch}
                                onChange={(e) => setPoemSearch(e.target.value)}
                                className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-emerald-500 outline-none"
                            />
                        </div>
                        <button onClick={handleExportPoemDatabaseCode} className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 hidden md:flex">
                            <Copy size={16} /> Xuất mã nguồn Kệ
                        </button>
                    </div>

                    {/* BẢNG ĐIỀU KHIỂN TẠO ÂM THANH & BỘ ĐẾM THỐNG KÊ */}
                    <div className="flex flex-col gap-2 mt-3 p-3 bg-emerald-900/20 border border-emerald-500/30 rounded-xl shrink-0">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                            {(() => {
                                // Tính toán số lượng Audio
                                const totalStanzasCount = poemDatabase.reduce((acc, p) => acc + p.stanzas.length, 0);
                                const savedStanzasCount = poemDatabase.reduce((acc, p) => acc + p.stanzas.filter(s => s.isSaved || s.audioUrl).length, 0);
                                const missingStanzasCount = totalStanzasCount - savedStanzasCount;
                                
                                const totalMeaningsCount = poemDatabase.reduce((acc, p) => acc + p.stanzas.filter(s => s.meaning && s.meaning.trim() !== '').length, 0);
                                const savedMeaningsCount = poemDatabase.reduce((acc, p) => acc + p.stanzas.filter(s => (s.meaning && s.meaning.trim() !== '') && (s.isMeaningSaved || s.meaningAudioUrl)).length, 0);
                                const missingMeaningsCount = totalMeaningsCount - savedMeaningsCount;
                                
                                const totalGreetingsCount = Object.values(greetingsDb).reduce((acc, list) => acc + list.length, 0);
                                const savedGreetingsCount = Object.keys(greetingAudioUrls).length;
                                const missingGreetingsCount = totalGreetingsCount - savedGreetingsCount;

                                return (
                                    <div className="flex flex-col">
                                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5"><Mic size={14}/> Trạng thái Pháp âm:</span>
                                        <span className="text-[10px] text-slate-300 mt-1 flex flex-col gap-0.5">
                                            <span className="flex items-center gap-2">
                                               <span>Đoạn kệ ({totalStanzasCount}):</span>
                                               <span className="text-amber-400">{savedStanzasCount} đã có</span>|
                                               <span className="text-rose-400">{missingStanzasCount} thiếu</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                               <span>Diễn giải ({totalMeaningsCount}):</span>
                                               <span className="text-amber-400">{savedMeaningsCount} đã có</span>|
                                               <span className="text-rose-400">{missingMeaningsCount} thiếu</span>
                                            </span>
                                            <span className="flex items-center gap-2">
                                               <span>Mào đầu ({totalGreetingsCount}):</span>
                                               <span className="text-amber-400">{savedGreetingsCount} đã có</span>|
                                               <span className="text-rose-400">{missingGreetingsCount} thiếu</span>
                                            </span>
                                        </span>
                                    </div>
                                );
                            })()}
                            
                            <div className="flex gap-2 flex-wrap justify-end">
                                <button onClick={handleDownloadAllPoemAudios} className="bg-slate-800 hover:bg-slate-700 text-emerald-400 px-3 py-2 rounded-lg text-[10px] font-bold transition-all border border-emerald-500/30 shadow-md flex items-center gap-1.5" title="Tải tất cả các đoạn đã có âm thanh về máy">
                                    <Download size={12}/> <span className="hidden sm:inline">Tải tất cả Audio</span>
                                </button>
                                {!isBatchGeneratingPoems ? (
                                    <button onClick={handleBatchGenerateStanzas} disabled={isBatchGeneratingMeanings || isBatchGeneratingAIMeanings || isBatchGeneratingGreetings} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md whitespace-nowrap disabled:opacity-50">
                                        Bù âm Kệ
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingPoemsRef.current = false; setIsBatchGeneratingPoems(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng Kệ
                                    </button>
                                )}
                                {!isBatchGeneratingMeanings ? (
                                    <button onClick={handleBatchGenerateMeanings} disabled={isBatchGeneratingPoems || isBatchGeneratingAIMeanings || isBatchGeneratingGreetings} className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md whitespace-nowrap disabled:opacity-50">
                                        Bù âm Diễn giải
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingMeaningsRef.current = false; setIsBatchGeneratingMeanings(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng Giải
                                    </button>
                                )}
                                {!isBatchGeneratingGreetings ? (
                                    <button onClick={handleBatchGenerateGreetings} disabled={isBatchGeneratingPoems || isBatchGeneratingMeanings || isBatchGeneratingAIMeanings} className="bg-orange-600 hover:bg-orange-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md whitespace-nowrap disabled:opacity-50">
                                        Bù âm Mào đầu
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingGreetingsRef.current = false; setIsBatchGeneratingGreetings(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng Mào đầu
                                    </button>
                                )}
                                {!isBatchGeneratingAIMeanings ? (
                                    <button onClick={handleBatchGenerateAIMeaningsText} disabled={isBatchGeneratingPoems || isBatchGeneratingMeanings || isBatchGeneratingGreetings} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 whitespace-nowrap disabled:opacity-50" title="Tự động nhờ AI viết phần diễn giải cho các đoạn còn trống">
                                        <Wand2 size={12}/> Viết Diễn giải (AI)
                                    </button>
                                ) : (
                                    <button onClick={() => { isBatchGeneratingAIMeaningsRef.current = false; setIsBatchGeneratingAIMeanings(false); }} className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-2 rounded-lg text-[10px] font-bold transition-all shadow-md flex items-center gap-1.5 animate-pulse whitespace-nowrap">
                                        <XCircle size={12}/> Dừng AI viết
                                    </button>
                                )}
                            </div>
                        </div>
                        {isBatchGeneratingPoems && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-emerald-300 font-bold tracking-wider">
                                    <span>Đang tạo âm kệ: {batchPoemProgress.current} / {batchPoemProgress.total} đoạn</span>
                                    <span>{batchPoemProgress.total > 0 ? Math.round((batchPoemProgress.current / batchPoemProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-emerald-500 h-full transition-all duration-500 relative" style={{ width: `${batchPoemProgress.total > 0 ? (batchPoemProgress.current / batchPoemProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingMeanings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-amber-300 font-bold tracking-wider">
                                    <span>Đang tạo âm diễn giải: {batchMeaningProgress.current} / {batchMeaningProgress.total} đoạn</span>
                                    <span>{batchMeaningProgress.total > 0 ? Math.round((batchMeaningProgress.current / batchMeaningProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-amber-500 h-full transition-all duration-500 relative" style={{ width: `${batchMeaningProgress.total > 0 ? (batchMeaningProgress.current / batchMeaningProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingGreetings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-orange-300 font-bold tracking-wider">
                                    <span>Đang tạo âm mào đầu: {batchGreetingProgress.current} / {batchGreetingProgress.total} đoạn</span>
                                    <span>{batchGreetingProgress.total > 0 ? Math.round((batchGreetingProgress.current / batchGreetingProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-orange-500 h-full transition-all duration-500 relative" style={{ width: `${batchGreetingProgress.total > 0 ? (batchGreetingProgress.current / batchGreetingProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isBatchGeneratingAIMeanings && (
                            <div className="flex flex-col gap-1 mt-2 animate-in fade-in">
                                <div className="flex justify-between text-[9px] text-indigo-300 font-bold tracking-wider">
                                    <span>AI đang tự viết ý nghĩa: {batchAIMeaningProgress.current} / {batchAIMeaningProgress.total} đoạn</span>
                                    <span>{batchAIMeaningProgress.total > 0 ? Math.round((batchAIMeaningProgress.current / batchAIMeaningProgress.total) * 100) : 0}%</span>
                                </div>
                                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden border border-white/5">
                                    <div className="bg-indigo-500 h-full transition-all duration-500 relative" style={{ width: `${batchAIMeaningProgress.total > 0 ? (batchAIMeaningProgress.current / batchAIMeaningProgress.total) * 100 : 0}%` }}>
                                        <div className="absolute inset-0 bg-white/20 animate-[ping_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* PHẦN DANH SÁCH KỆ PHÁP (Tự do lướt mượt mà trên Mobile) */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 md:gap-8 scrollbar-hide min-h-0 touch-pan-y relative z-10 pb-10">
                    {poemDatabase
                        .filter(p => p.title.toLowerCase().includes(poemSearch.toLowerCase()) || p.stanzas.some(s => s.content.toLowerCase().includes(poemSearch.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(poemSearch.toLowerCase()))))
                        .map((poem, idx) => (
                        <div key={poem.id} className="bg-slate-800/20 border border-emerald-500/20 rounded-xl p-4 flex flex-col gap-3">
                            <div className="flex items-center gap-2 border-b border-emerald-500/20 pb-2">
                               <BookOpen size={16} className="text-emerald-500"/>
                               <span className="text-sm font-black text-emerald-400 tracking-widest">{poem.title}</span>
                            </div>

                            <div className="flex flex-col gap-6 mt-2 pl-2 md:pl-4 border-l-2 border-slate-700/50">
                                {poem.stanzas.map((stanza, sIdx) => (
                                    <div key={stanza.id} className="bg-slate-900/60 p-3 md:p-4 rounded-xl border border-white/5 flex flex-col xl:flex-row gap-4 hover:border-emerald-500/30 transition-all relative group">
                                        <span className="absolute -left-7 md:-left-9 top-4 w-6 h-6 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400">{sIdx + 1}</span>
                                        
                                        {/* Khối Nội dung đoạn kệ & Ý nghĩa */}
                                        <div className="flex-[2] grid grid-cols-1 md:grid-cols-2 gap-4">
                                            
                                            {/* CỘT 1: ĐOẠN KỆ */}
                                            <div className="flex flex-col gap-2">
                                                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><FileText size={12}/> Đoạn kệ</span>
                                                <textarea 
                                                    value={stanza.content}
                                                    onChange={(e) => handleUpdatePoemContent(poem.id, stanza.id, e.target.value)}
                                                    placeholder="Nội dung đoạn kệ..."
                                                    className="w-full h-28 bg-slate-950 border border-transparent hover:border-white/10 focus:border-emerald-500 rounded-lg p-2.5 text-[11px] md:text-xs text-slate-300 outline-none resize-none font-mono leading-relaxed transition-all scrollbar-hide"
                                                />
                                                {/* Trình phát Audio của Lão (Đoạn Kệ) */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {stanza.audioUrl ? (
                                                        <div className="flex items-center gap-1.5 w-full">
                                                            <button 
                                                               onClick={async () => {
                                                                  const playUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                  if (playUrl) handlePlayStanzaVoice(playUrl);
                                                               }} 
                                                               className="flex-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex justify-center items-center gap-1"
                                                            >
                                                               <Play size={10}/> Nghe
                                                            </button>
                                                            <button 
                                                               onClick={async () => {
                                                                  const actUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                  if (actUrl) {
                                                                      const cleanTitle = poem.title.replace(/[^a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ\s]/g, '').trim().replace(/\s+/g, '_');
                                                                      downloadAudio(actUrl, `Ke_${cleanTitle}_Doan_${sIdx + 1}`);
                                                                  }
                                                               }}
                                                               className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-emerald-400 p-1.5 rounded-lg border border-white/10 transition-all" title="Tải file Audio Kệ"
                                                            >
                                                               <Download size={10}/>
                                                            </button>
                                                            <button onClick={() => handleGenerateStanzaVoice(poem.id, stanza.id, stanza.content)} disabled={generatingStanzas[stanza.id]} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all disabled:opacity-50" title="Tạo lại giọng đọc">
                                                               <RefreshCw size={10} className={generatingStanzas[stanza.id] ? "animate-spin" : ""}/>
                                                            </button>
                                                            {!stanza.isSaved && (
                                                                <button 
                                                                   onClick={async () => {
                                                                      const actUrl = await resolveStanzaAudioUrl(poem.id, stanza);
                                                                      if (actUrl) handleSaveStanzaVoice(poem.id, stanza.id, actUrl);
                                                                   }} 
                                                                   className="bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-amber-500/30 transition-all flex items-center gap-1"
                                                                >
                                                                   <Save size={10}/> Lưu
                                                                </button>
                                                            )}
                                                            {stanza.isSaved && (
                                                                <span className="text-[9px] text-amber-400 flex items-center gap-1 bg-amber-900/30 px-1.5 py-1 rounded-lg border border-amber-500/20" title="Đã lưu Kho Lão">
                                                                    <Archive size={10}/>
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleGenerateStanzaVoice(poem.id, stanza.id, stanza.content)} disabled={generatingStanzas[stanza.id]} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                           {generatingStanzas[stanza.id] ? <Loader2 size={10} className="animate-spin text-emerald-500"/> : <Mic size={10} className="text-emerald-500"/>} 
                                                           {generatingStanzas[stanza.id] ? "Đang truyền tâm thanh..." : "Tạo âm Kệ"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* CỘT 2: Ý NGHĨA DIỄN GIẢI */}
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest flex items-center gap-1.5"><Info size={12}/> Ý nghĩa / Diễn giải</span>
                                                    <button 
                                                        onClick={() => handleGenerateAIMeaningText(poem.id, stanza.id)} 
                                                        disabled={isGeneratingAIMeaning[stanza.id]}
                                                        className="text-[9px] bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-white px-2 py-1 rounded transition-all flex items-center gap-1 disabled:opacity-50"
                                                        title="Nhờ AI tự động đọc hiểu và diễn giải đoạn kệ này"
                                                    >
                                                        {isGeneratingAIMeaning[stanza.id] ? <Loader2 size={10} className="animate-spin"/> : <Wand2 size={10}/>} 
                                                        {isGeneratingAIMeaning[stanza.id] ? "Đang viết..." : "AI Diễn giải"}
                                                    </button>
                                                </div>
                                                <textarea 
                                                    value={stanza.meaning || ''}
                                                    onChange={(e) => handleUpdatePoemMeaning(poem.id, stanza.id, e.target.value)}
                                                    placeholder="Bạn có thể tự ghi chú ý nghĩa đoạn kệ tại đây. AI sẽ đọc được và giảng giải cực hay theo ý bạn..."
                                                    className="w-full h-28 bg-slate-950 border border-transparent hover:border-white/10 focus:border-amber-500 rounded-lg p-2.5 text-[11px] md:text-xs text-amber-100/80 outline-none resize-none font-sans leading-relaxed transition-all scrollbar-hide"
                                                />
                                                {/* Trình phát Audio của Lão (Ý nghĩa) */}
                                                <div className="flex items-center gap-2 mt-1">
                                                    {stanza.meaningAudioUrl ? (
                                                        <div className="flex items-center gap-1.5 w-full">
                                                            <button 
                                                               onClick={async () => {
                                                                  const playUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                  if (playUrl) handlePlayStanzaVoice(playUrl);
                                                               }} 
                                                               className="flex-1 bg-amber-600/20 hover:bg-amber-600 text-amber-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-amber-500/30 transition-all flex justify-center items-center gap-1"
                                                            >
                                                               <Play size={10}/> Nghe
                                                            </button>
                                                            <button 
                                                               onClick={async () => {
                                                                  const actUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                  if (actUrl) {
                                                                      const cleanTitle = poem.title.replace(/[^a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪỬỮỰỲÝỴỶỸàáâãèéêìíòóôõùúăđĩũơưăạảấầẩẫậắằẳẵặẹẻẽềềểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳýỵỷỹ\s]/g, '').trim().replace(/\s+/g, '_');
                                                                      downloadAudio(actUrl, `Giai_${cleanTitle}_Doan_${sIdx + 1}`);
                                                                  }
                                                               }}
                                                               className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 p-1.5 rounded-lg border border-white/10 transition-all" title="Tải file Audio Giảng giải"
                                                            >
                                                               <Download size={10}/>
                                                            </button>
                                                            <button onClick={() => handleGenerateMeaningVoice(poem.id, stanza.id, stanza.meaning)} disabled={generatingMeanings[stanza.id]} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all disabled:opacity-50" title="Tạo lại giọng đọc">
                                                               <RefreshCw size={10} className={generatingMeanings[stanza.id] ? "animate-spin" : ""}/>
                                                            </button>
                                                            {!stanza.isMeaningSaved && (
                                                                <button 
                                                                   onClick={async () => {
                                                                      const actUrl = await resolveMeaningAudioUrl(poem.id, stanza);
                                                                      if (actUrl) handleSaveMeaningVoice(poem.id, stanza.id, actUrl);
                                                                   }} 
                                                                   className="bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-emerald-500/30 transition-all flex items-center gap-1"
                                                                >
                                                                   <Save size={10}/> Lưu
                                                                </button>
                                                            )}
                                                            {stanza.isMeaningSaved && (
                                                                <span className="text-[9px] text-emerald-400 flex items-center gap-1 bg-emerald-900/30 px-1.5 py-1 rounded-lg border border-emerald-500/20" title="Đã lưu Kho Lão">
                                                                    <Archive size={10}/>
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button onClick={() => handleGenerateMeaningVoice(poem.id, stanza.id, stanza.meaning)} disabled={!stanza.meaning || generatingMeanings[stanza.id]} className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                           {generatingMeanings[stanza.id] ? <Loader2 size={10} className="animate-spin text-amber-500"/> : <Mic size={10} className="text-amber-500"/>} 
                                                           {generatingMeanings[stanza.id] ? "Đang truyền tâm thanh..." : "Tạo âm Giảng giải"}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Khối Tags */}
                                        <div className="flex-1 flex flex-col gap-2 border-t xl:border-t-0 xl:border-l border-white/5 pt-3 xl:pt-0 xl:pl-4">
                                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1.5"><Tag size={12}/> Tags đoạn {sIdx + 1}</span>
                                            <div className="flex flex-wrap gap-1.5 min-h-[40px] items-start">
                                                {stanza.tags.map(tag => (
                                                    <span key={tag} className="bg-emerald-900/30 text-emerald-300 border border-emerald-500/30 px-2 py-1 rounded-md text-[10px] flex items-center gap-1.5">
                                                        {tag} 
                                                        <button onClick={() => handleRemoveTag(poem.id, stanza.id, tag)} className="hover:text-rose-400 opacity-60 hover:opacity-100 transition-opacity"><X size={10}/></button>
                                                    </span>
                                                ))}
                                            </div>
                                            <div className="flex mt-auto pt-2">
                                                <input 
                                                    type="text" 
                                                    placeholder="Thêm tag cho đoạn này..."
                                                    value={newTagInputs[stanza.id] || ''}
                                                    onChange={(e) => setNewTagInputs(prev => ({...prev, [stanza.id]: e.target.value}))}
                                                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag(poem.id, stanza.id)}
                                                    className="bg-slate-950 border border-white/10 rounded-l-lg px-2.5 py-1.5 text-[11px] text-white focus:border-emerald-500 outline-none flex-1 min-w-0"
                                                />
                                                <button onClick={() => handleAddTag(poem.id, stanza.id)} className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-r-lg text-[10px] font-bold transition-colors">
                                                    Thêm
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {poemDatabase.filter(p => p.title.toLowerCase().includes(poemSearch.toLowerCase()) || p.stanzas.some(s => s.content.toLowerCase().includes(poemSearch.toLowerCase()) || s.tags.some(t => t.toLowerCase().includes(poemSearch.toLowerCase())))).length === 0 && (
                        <div className="text-center p-8 text-slate-500 italic text-sm">Không tìm thấy bài kệ hoặc tag nào khớp với từ khóa.</div>
                    )}
                </div>
              </div>
            )}

            {/* NỘI DUNG TAB KHO MÀO ĐẦU */}
            {poemModalTab === 'greetings' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-6 scrollbar-hide bg-slate-900/50">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex flex-col gap-2">
                      <p className="text-xs text-orange-300 leading-relaxed font-bold flex items-start gap-2">
                          <Info size={16} className="shrink-0 mt-0.5"/> 
                          <span>Đây là kho 60+ câu mào đầu ứng biến của Lão. Dựa vào hoàn cảnh, thái độ và câu hỏi của con, hệ thống (Thuật toán NLP nội bộ) sẽ tự động phân tích và chọn ra một câu mào đầu phù hợp nhất để Lão tiếp đón trước khi đọc kệ khai thị. <b>Con có thể sửa nội dung trực tiếp vào ô chữ bên dưới.</b></span>
                      </p>
                  </div>

                  {/* Thanh tìm kiếm mào đầu */}
                  <div className="flex gap-2 shrink-0">
                      <div className="relative flex-1">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-500/50" />
                          <input 
                              type="text" 
                              placeholder="Tìm kiếm nội dung câu mào đầu..." 
                              value={greetingSearch}
                              onChange={(e) => setGreetingSearch(e.target.value)}
                              className="w-full bg-slate-950 border border-orange-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-orange-500 outline-none"
                          />
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(greetingsDb).map(([categoryKey, greetingsList], idx) => {
                      const categoryNames = {
                          "waiting_long": "⏳ Chờ đợi quá lâu (> 60s)",
                          "health_daily": "🍵 Hỏi thăm sức khỏe, ăn ngủ",
                          "serious_dharma": "🧘‍♂️ Hỏi đạo lý, tu hành nghiêm túc",
                          "love_heartbreak": "💔 Thất tình, đau khổ vì tình",
                          "money_debt": "💰 Tiền bạc, nợ nần, nghèo khó",
                          "complaining_lost": "🌧️ Than vãn, bế tắc chung chung",
                          "boasting_ego": "🦚 Khoe khoang, tự cao tự đại",
                          "random_teasing": "🎭 Hỏi vu vơ, chọc ghẹo Lão",
                          "testing_lao": "⚔️ Thử thách, đánh đố đạo lý",
                          "mundane_weather": "🍃 Chuyện linh tinh, bao đồng"
                      };
                      const catName = categoryNames[categoryKey] || categoryKey;
                      
                      // Lọc danh sách theo từ khóa tìm kiếm
                      const filteredList = greetingsList
                          .map((text, i) => ({ text, originalIndex: i }))
                          .filter(item => item.text.toLowerCase().includes(greetingSearch.toLowerCase()));

                      // Ẩn danh mục nếu không có câu nào khớp với từ khóa
                      if (filteredList.length === 0) return null;
                      
                      return (
                          <div key={categoryKey} className="bg-slate-800/60 border border-orange-500/30 rounded-xl overflow-hidden flex flex-col shadow-lg h-fit">
                              <div className="bg-slate-800 p-3 border-b border-orange-500/30 flex items-center justify-between sticky top-0 z-10">
                                  <h3 className="font-black text-orange-400 text-xs tracking-wider">{catName}</h3>
                                  <span className="bg-orange-900/50 text-orange-300 text-[10px] font-bold px-2 py-1 rounded-md border border-orange-500/30">{filteredList.length} câu</span>
                              </div>
                              <div className="p-3 flex flex-col gap-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                                  {filteredList.map((item) => {
                                      const i = item.originalIndex;
                                      const text = item.text;
                                      const key = `${categoryKey}_${i}`;
                                      return (
                                      <div key={i} className="bg-slate-900/90 p-3 rounded-lg border border-white/5 flex flex-col gap-2 group hover:border-orange-500/50 transition-colors focus-within:border-orange-500/50">
                                          <div className="flex gap-2 items-start">
                                              <span className="text-slate-500 font-black text-[9px] pt-2 w-4 shrink-0">{i+1}.</span>
                                              <textarea
                                                  value={text}
                                                  onChange={(e) => handleUpdateGreetingText(categoryKey, i, e.target.value)}
                                                  placeholder="Nhập nội dung mào đầu..."
                                                  className="w-full bg-slate-950/50 border border-transparent hover:border-white/5 focus:border-orange-500/50 focus:bg-slate-950 rounded-lg p-2 text-[11.5px] text-slate-200 outline-none resize-none font-sans leading-relaxed transition-all scrollbar-hide h-[4.5rem]"
                                              />
                                          </div>
                                          
                                          {/* Bảng điều khiển Audio Câu Mào Đầu */}
                                          <div className="flex items-center justify-end gap-2 ml-6 border-t border-white/5 pt-2 mt-1">
                                              {greetingAudioUrls[key] ? (
                                                  <>
                                                      <button 
                                                         onClick={async () => {
                                                             const playUrl = await resolveGreetingAudioUrl(key);
                                                             if (playUrl) handlePlayStanzaVoice(playUrl);
                                                         }} 
                                                         className="bg-orange-600/20 hover:bg-orange-600 text-orange-400 hover:text-white px-2 py-1.5 rounded-lg text-[9px] font-bold border border-orange-500/30 transition-all flex justify-center items-center gap-1"
                                                      >
                                                         <Play size={10}/> Nghe
                                                      </button>
                                                      <button 
                                                         onClick={async () => {
                                                             const dlUrl = await resolveGreetingAudioUrl(key);
                                                             if (dlUrl) downloadAudio(dlUrl, `MaoDau_${categoryKey}_${i + 1}`);
                                                         }}
                                                         className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-orange-400 p-1.5 rounded-lg border border-white/10 transition-all" title="Tải file Audio"
                                                      >
                                                         <Download size={10}/>
                                                      </button>
                                                      <button onClick={() => handleGenerateGreetingVoice(categoryKey, i, text)} disabled={generatingGreetings[key]} className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white p-1.5 rounded-lg border border-white/10 transition-all disabled:opacity-50" title="Tạo lại giọng đọc">
                                                         <RefreshCw size={10} className={generatingGreetings[key] ? "animate-spin" : ""}/>
                                                      </button>
                                                  </>
                                              ) : (
                                                  <button onClick={() => handleGenerateGreetingVoice(categoryKey, i, text)} disabled={generatingGreetings[key] || !text.trim()} className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50">
                                                     {generatingGreetings[key] ? <Loader2 size={10} className="animate-spin text-orange-500"/> : <Mic size={10} className="text-orange-500"/>} 
                                                     {generatingGreetings[key] ? "Đang tạo..." : "Tạo âm mào đầu"}
                                                  </button>
                                              )}
                                          </div>
                                      </div>
                                      );
                                  })}
                              </div>
                          </div>
                      );
                  })}
                  
                  {/* Báo lỗi nếu tìm không thấy mào đầu nào */}
                  {Object.values(greetingsDb).flat().filter(t => t.toLowerCase().includes(greetingSearch.toLowerCase())).length === 0 && (
                      <div className="col-span-1 md:col-span-2 text-center p-8 text-slate-500 italic text-sm border border-dashed border-white/10 rounded-xl">
                          Không tìm thấy câu mào đầu nào khớp với từ khóa "{greetingSearch}".
                      </div>
                  )}

                  </div>
              </div>
            )}

            {/* NỘI DUNG TAB KHO TRÍ TUỆ (RAG) */}
            {poemModalTab === 'rag' && (
              <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-5 scrollbar-hide bg-slate-900/50">
                  <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 flex flex-col gap-2">
                      <p className="text-xs text-indigo-300 leading-relaxed font-bold flex items-start gap-2">
                          <Info size={18} className="shrink-0 mt-0.5"/> 
                          <span>Đây là Não Bộ Kiến Thức của Lão. Bạn có thể tải lên các file văn bản (<b>.txt</b>) chứa truyện ngộ đạo, bài giảng, hoặc file (<b>.json</b>) chứa câu hỏi vấn đáp. Hệ thống sẽ tự động cắt nhỏ và nạp vào bộ nhớ để Lão tra cứu khi trả lời khán giả.</span>
                      </p>
                      
                      <div className="flex gap-2 flex-wrap mt-2 pt-3 border-t border-indigo-500/20">
                          <input 
                              type="file" 
                              multiple 
                              accept=".txt,.json" 
                              className="hidden" 
                              ref={ragFileInputRef}
                              onChange={handleUploadRagFiles} 
                          />
                          <button 
                              onClick={() => ragFileInputRef.current.click()}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shrink-0"
                          >
                              <Upload size={14}/> Tải File Dữ Liệu (.txt, .json)
                          </button>
                          
                          <button 
                              onClick={handleClearAllRagDb}
                              className="bg-rose-900/50 hover:bg-rose-600 text-rose-400 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border border-rose-500/30 shrink-0 ml-auto"
                          >
                              <Trash2 size={14}/> Xóa sạch dữ liệu
                          </button>
                      </div>
                  </div>

                  {/* Thanh tìm kiếm kiến thức */}
                  <div className="flex gap-2 shrink-0">
                      <div className="relative flex-1">
                          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500/50" />
                          <input 
                              type="text" 
                              placeholder="Tìm kiếm kiến thức trong não bộ Lão..." 
                              value={ragSearch}
                              onChange={(e) => setRagSearch(e.target.value)}
                              className="w-full bg-slate-950 border border-indigo-500/30 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:border-indigo-500 outline-none"
                          />
                      </div>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                      <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold uppercase tracking-wider px-2">
                          <span>Đang lưu trữ {ragDb.length} phân đoạn kiến thức</span>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 max-h-[50vh] overflow-y-auto scrollbar-hide pb-10">
                          {ragDb.filter(item => item.text.toLowerCase().includes(ragSearch.toLowerCase())).map((item, index) => (
                              <div key={item.id} className="bg-slate-800/80 p-4 rounded-xl border border-white/5 hover:border-indigo-500/50 transition-colors flex flex-col gap-2 relative group">
                                  <div className="flex justify-between items-start">
                                      <span className="bg-indigo-900/50 text-indigo-300 text-[9px] px-2 py-1 rounded font-mono border border-indigo-500/20">
                                          Nguồn: {item.source}
                                      </span>
                                      <button 
                                          onClick={() => handleDeleteRagItem(item.id)}
                                          className="text-slate-500 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                          title="Xóa đoạn kiến thức này"
                                      >
                                          <X size={14}/>
                                      </button>
                                  </div>
                                  <p className="text-[11px] text-slate-300 whitespace-pre-line leading-relaxed font-serif">
                                      {item.text}
                                  </p>
                              </div>
                          ))}
                          
                          {ragDb.filter(item => item.text.toLowerCase().includes(ragSearch.toLowerCase())).length === 0 && (
                              <div className="text-center p-8 text-slate-500 italic text-sm border border-dashed border-white/10 rounded-xl">
                                  Không tìm thấy kiến thức nào khớp với từ khóa "{ragSearch}".
                              </div>
                          )}
                      </div>
                  </div>

              </div>
            )}

      {/* MODAL TÙY CHỌN XUẤT FILE SAO LƯU */}
      {showBackupOptionsModal && (
         <div className="fixed inset-0 z-[250] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowBackupOptionsModal(false)}>
            <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                    <h2 className="font-black text-rose-400 tracking-widest flex items-center gap-2"><Archive size={18}/> Tùy chọn nén âm thanh</h2>
                    <button onClick={() => setShowBackupOptionsModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="p-5 flex flex-col gap-4">
                    <p className="text-xs text-slate-300 leading-relaxed mb-1">Hãy chọn các nhóm âm thanh con muốn đóng gói vào File dự phòng. (Chọn ít sẽ giúp dung lượng nhẹ và tải nhanh hơn).</p>
                    
                    <div className="flex flex-col gap-3 bg-slate-950 p-4 rounded-xl border border-white/5">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.stanzas} 
                               onChange={(e) => setBackupOptions({...backupOptions, stanzas: e.target.checked})}
                               className="w-5 h-5 accent-emerald-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">Âm thanh Đoạn Kệ</span>
                               <span className="text-[10px] text-slate-500">Lời khai thị chính của Lão</span>
                            </div>
                        </label>
                        
                        <div className="w-full h-px bg-white/5"></div>
                        
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.greetings} 
                               onChange={(e) => setBackupOptions({...backupOptions, greetings: e.target.checked})}
                               className="w-5 h-5 accent-orange-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">Âm thanh Mào Đầu</span>
                               <span className="text-[10px] text-slate-500">60+ Câu tiếp đón ứng biến của Lão</span>
                            </div>
                        </label>

                        <div className="w-full h-px bg-white/5"></div>

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input 
                               type="checkbox" 
                               checked={backupOptions.meanings} 
                               onChange={(e) => setBackupOptions({...backupOptions, meanings: e.target.checked})}
                               className="w-5 h-5 accent-amber-500 rounded cursor-pointer" 
                            />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">Âm thanh Diễn Giải</span>
                               <span className="text-[10px] text-slate-500">Ý nghĩa từng đoạn do AI/Người dùng viết</span>
                            </div>
                        </label>
                    </div>
                    
                    <div className="flex justify-end gap-3 mt-2">
                        <button onClick={() => setShowBackupOptionsModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                        <button 
                            onClick={executeFullBackup} 
                            disabled={!backupOptions.stanzas && !backupOptions.meanings && !backupOptions.greetings}
                            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            <Download size={14}/> Bắt đầu nén file
                        </button>
                    </div>
                </div>
            </div>
         </div>
      )}

        </div>

      {/* MODAL DÁN MÃ JSON (CON TRONG KHO KỆ PHÁP) */}

  {/* MODAL DÁN MÃ JSON (CON TRONG KHO KỆ PHÁP) */}
      {showImportPoemModal && (
               <div className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={(e) => { e.stopPropagation(); setShowImportPoemModal(false); }}>
                  <div className="bg-slate-900 border border-pink-500/30 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-black text-pink-400 tracking-widest flex items-center gap-2"><FileText size={18}/> Nhập Mã Nguồn JSON</h2>
                          <button onClick={() => setShowImportPoemModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="bg-pink-900/20 border border-pink-500/30 p-4 rounded-xl flex flex-col gap-2">
                             <p className="text-[12px] text-pink-300 flex items-start gap-2 leading-relaxed font-bold">
                               <Info size={16} className="shrink-0 mt-0.5"/> 
                               Dùng để chuyển Kệ từ Link cũ sang Link mới:
                             </p>
                             <ul className="text-[11px] text-pink-200/80 list-disc pl-5 space-y-1.5 leading-relaxed">
                                <li>Dán toàn bộ mã JSON (bắt đầu bằng <b>[</b> và kết thúc bằng <b>]</b>) vào đây.</li>
                                <li><b>LƯU Ý QUAN TRỌNG:</b> Mã JSON chỉ có thể copy được PHẦN CHỮ. Các file âm thanh MP3 không thể chuyển qua bằng cách này.</li>
                                <li>Sau khi nhập mã xong để lấy lại phần chữ, con hãy đóng bảng này lại và dùng tính năng <b>"Tạo và Lưu pháp âm đồng loạt"</b> (Nút Bắt đầu chạy tự động) ở màn hình chính để hệ thống tự động tạo lại toàn bộ file âm thanh mới cho con nhé!</li>
                             </ul>
                          </div>
                          
                          <textarea 
                             value={importPoemJson}
                             onChange={(e) => setImportPoemJson(e.target.value)}
                             placeholder="[\n  {\n    &#34;id&#34;: &#34;poem_1&#34;,\n    &#34;title&#34;: &#34;Bài 1: Tam vô&#34;,\n    &#34;stanzas&#34;: [...]\n  }\n]"
                             className="w-full h-[35vh] bg-slate-950 border border-white/10 rounded-xl p-4 text-xs text-emerald-400 focus:border-pink-500 outline-none resize-none font-mono scrollbar-hide"
                             spellCheck="false"
                          />
                          
                          <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                              <button onClick={() => setShowImportPoemModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy bỏ</button>
                              <button onClick={handleImportPoemJson} disabled={!importPoemJson.trim() || isCloudSyncing} className="px-6 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 {isCloudSyncing ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Xác nhận Nâng cấp Kho
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
            )}

            {/* MODAL KHÔI PHỤC TỪ LINK CŨ */}
            {showOldLinkModal && (
               <div className="fixed inset-0 z-[170] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={(e) => { e.stopPropagation(); setShowOldLinkModal(false); }}>
                  <div className="bg-slate-900 border border-indigo-500/30 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-black text-indigo-400 tracking-widest flex items-center gap-2"><Cloud size={18}/> Khôi phục từ Link cũ</h2>
                          <button onClick={() => setShowOldLinkModal(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="bg-indigo-900/20 border border-indigo-500/30 p-3 rounded-xl flex flex-col gap-2">
                             <p className="text-[12px] text-indigo-300 font-bold flex items-center gap-1.5">
                               <Info size={16}/> Hướng dẫn dọn nhà:
                             </p>
                             <ul className="text-[11px] text-indigo-200/80 list-disc pl-5 space-y-2 leading-relaxed">
                                <li><b>Trường hợp lý tưởng:</b> Ở Link (ứng dụng) cũ, con vào Kho Tàng Kệ Pháp, bấm biểu tượng Copy cạnh <b>Mã Kho</b> rồi dán mã đó vào đây.</li>
                                <li><b>Nếu Link cũ chưa có nút Copy Mã Kho:</b> Con hãy mở Link cũ lên, <b>bấm chuột phải vào hình Lão (hoặc khoảng trống), chọn "Mở khung trong tab mới" (Open frame in new tab)</b>. Sau đó Copy toàn bộ đường link ở thẻ mới đó dán vào đây là thành công 100%.</li>
                             </ul>
                          </div>
                          
                          <input 
                             type="text"
                             value={oldLinkInput}
                             onChange={(e) => setOldLinkInput(e.target.value)}
                             placeholder="Dán Link thẻ mới HOẶC Mã Kho cũ vào đây..."
                             className="w-full bg-slate-950 border border-white/10 rounded-xl p-4 text-sm text-indigo-400 focus:border-indigo-500 outline-none font-mono"
                          />
                          
                          <div className="flex justify-end gap-3 mt-2 border-t border-white/5 pt-4">
                              <button onClick={() => setShowOldLinkModal(false)} className="px-5 py-2.5 rounded-xl font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy bỏ</button>
                              <button onClick={handleConnectOldLink} disabled={!oldLinkInput.trim() || isCloudSyncing} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 {isCloudSyncing ? <Loader2 size={14} className="animate-spin"/> : <Check size={14}/>} Bắt đầu dọn nhà
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
            )}
         </div>
      )}

      {/* MÀN HÌNH FULLSCREEN REVIEW VIDEO */}
      {isVideoFullscreen && (
        <div className="fixed inset-0 z-[9999] bg-black flex flex-col justify-center items-center">
            <button 
                onClick={() => setIsVideoFullscreen(false)} 
                className="absolute top-4 right-4 md:top-8 md:right-8 bg-white/10 hover:bg-rose-500 text-white p-3 rounded-full transition-all z-50 backdrop-blur-md shadow-xl"
            >
                <X size={24} />
            </button>
            <video controls autoPlay src={renderedVideoUrl} className="w-full h-full object-contain" />
        </div>
      )}

      {showVideoExportModal && (
         <div className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md flex justify-center items-center p-4 md:p-6">
           <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-6xl shadow-2xl flex flex-col h-[90vh] md:h-[85vh] overflow-hidden">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 shrink-0">
                <h2 className="font-black text-orange-400 tracking-widest flex items-center gap-2"><Film size={18}/> Xuất video pháp bảo</h2>
                {!isExportingVideo && <button onClick={cancelVideoExport} className="text-slate-400 hover:text-white"><X size={20}/></button>}
              </div>
              
              <div className="flex flex-col md:flex-row gap-6 p-4 md:p-6 flex-1 min-h-0">
                 {/* BÊN TRÁI: BẢNG ĐIỀU CHỈNH THÔNG SỐ */}
                 <div className={`w-full md:w-5/12 flex flex-col gap-4 overflow-y-auto pb-4 pr-2 scrollbar-hide h-full ${isPreviewFullscreen ? 'hidden md:flex opacity-0 pointer-events-none' : ''}`}>
                    {renderedVideoUrl ? (
                      <div className="flex flex-col h-full gap-4 justify-center">
                        <div className="bg-emerald-900/30 border border-emerald-500/50 p-4 rounded-xl text-emerald-400 text-sm shadow-inner">
                           <p className="font-bold mb-2 flex items-center gap-2 text-base"><Check size={20}/> Render video thành công!</p>
                           <p className="text-slate-300">Video của con đã sẵn sàng ở khung bên cạnh. Hãy bấm phát để xem lại. Nếu thấy ưng ý, hãy tải về máy hoặc chia sẻ trực tiếp lên Mạng xã hội.</p>
                        </div>
                        <div className="flex flex-col gap-3 mt-4">
                           <button onClick={handleDownloadVideo} className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all transform hover:scale-[1.02]">
                              <Save size={18}/> Lưu video vào máy
                           </button>
                           
                           <button onClick={handleShareVideoSocial} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all transform hover:scale-[1.02]">
                              <ShareIcon size={18}/> Chia sẻ lên MXH
                           </button>

                           {diagnosticReport && (
                               <button onClick={() => setShowDiagnostics(true)} className="w-full bg-indigo-600/20 border border-indigo-500/50 hover:bg-indigo-600/40 text-indigo-300 font-bold py-3.5 rounded-xl tracking-wider flex justify-center items-center gap-2 transition-all shadow-sm mt-1">
                                  <Sliders size={16}/> Phân Tích Kỹ Thuật (Nội Soi)
                               </button>
                           )}

                           <div className="flex gap-3 mt-2">
                               <button onClick={toggleFullscreen} className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-3.5 rounded-xl tracking-wider flex justify-center items-center gap-2 transition-all border border-white/5">
                                  <Maximize size={16}/> Xem Toàn Màn Hình
                               </button>
                               <button onClick={resetVideoExport} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3.5 rounded-xl tracking-wider flex justify-center items-center gap-2 border border-white/5 transition-all">
                                  <RefreshCw size={16}/> Tạo Video Mới
                               </button>
                           </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex border-b border-white/10 mb-2 shrink-0">
                           <button onClick={() => setExportTab('basic')} className={`flex-1 py-2.5 text-[11px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${exportTab === 'basic' ? 'border-orange-500 text-orange-400 bg-orange-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Cơ bản</button>
                           <button onClick={() => setExportTab('text')} className={`flex-1 py-2.5 text-[11px] md:text-sm font-bold tracking-wider transition-all border-b-2 ${exportTab === 'text' ? 'border-yellow-500 text-yellow-400 bg-yellow-500/5' : 'border-transparent text-slate-500 hover:text-slate-300'}`}>Thông điệp</button>
                        </div>

                        {exportTab === 'basic' && (
                          <div className="flex flex-col gap-5 flex-1 animate-in fade-in">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                               <div className="flex flex-col gap-2">
                                  <label className="text-xs font-bold text-orange-400 tracking-wider">Khung hình (Tỉ lệ)</label>
                                  <select disabled={isExportingVideo || isPreparingVideoData} value={videoAspectRatio} onChange={e => setVideoAspectRatio(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl focus:border-orange-500 outline-none text-sm">
                                     <option value="16x9">16:9 (Youtube)</option>
                                     <option value="9x16">9:16 (Tiktok, Reels)</option>
                                     <option value="1x1">1:1 (Facebook)</option>
                                     <option value="4x3">4:3 (Truyền thống)</option>
                                     <option value="3x4">3:4 (Dọc ngắn)</option>
                                  </select>
                               </div>
                               <div className="flex flex-col gap-2">
                                  <label className="text-xs font-bold text-orange-400 tracking-wider">Độ phân giải</label>
                                  <select disabled={isExportingVideo || isPreparingVideoData} value={videoResolution} onChange={e => setVideoResolution(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl focus:border-orange-500 outline-none text-sm">
                                     <option value="480">480p (Rất nhẹ)</option>
                                     <option value="720">720p (HD tiêu chuẩn)</option>
                                     <option value="1080">1080p (Full HD)</option>
                                     <option value="1440">1440p (2K siêu nét)</option>
                                     <option value="2160">2160p (4K điện ảnh)</option>
                                  </select>
                               </div>
                               <div className="flex flex-col gap-2">
                                  <label className="text-xs font-bold text-orange-400 tracking-wider flex items-center gap-1.5"><Sparkles size={14}/> Chuyển cảnh</label>
                                  <select disabled={isExportingVideo || isPreparingVideoData} value={videoTransition} onChange={e => setVideoTransition(e.target.value)} className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-xl focus:border-orange-500 outline-none text-sm">
                                     <option value="none">Cắt cứng (Mặc định)</option>
                                     <option value="fade_black">Mờ đen (Dip to black)</option>
                                     <option value="fade_white">Chớp trắng (Flash)</option>
                                     <option value="blur">Lóa sáng tâm linh</option>
                                     <option value="random">Ngẫu nhiên tự động</option>
                                  </select>
                                  {videoTransition !== 'none' && (
                                      <div className="flex flex-col gap-1 mt-1 animate-in fade-in bg-slate-900 p-2.5 rounded-xl border border-white/5">
                                          <span className="text-[10px] text-orange-200 flex justify-between font-bold">Thời gian kéo dài: <span className="text-white">{videoTransitionDuration}s</span></span>
                                          <input type="range" min="0.1" max="2.0" step="0.1" value={videoTransitionDuration} onChange={e => setVideoTransitionDuration(Number(e.target.value))} className="accent-orange-500" disabled={isExportingVideo || isPreparingVideoData} />
                                      </div>
                                  )}
                               </div>
                            </div>

                         {/* Chế độ Cắt ghép Video Dựng sẵn Toàn Cảnh */}
                         <div className="flex flex-col gap-2 mt-1 mb-1 animate-in fade-in">
                            <label className="text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5"><Film size={14}/> Video Dựng Sẵn Toàn Cảnh</label>
                            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-emerald-500/30 shadow-inner">
                                <div className="flex flex-col w-[80%]">
                                    <span className="text-[11px] font-bold text-emerald-300">Cắt Cảnh Đa Cảm Xúc</span>
                                    <span className="text-[9px] text-slate-400 mt-1 leading-relaxed">AI sẽ dựa vào cảm xúc của câu thoại (Vui, Buồn, Bình thường) để tự động chọn đúng video ghép vào.</span>
                                </div>
                                <button 
                                    onClick={() => setIsFullFrameMode(!isFullFrameMode)} 
                                    disabled={isExportingVideo || isPreparingVideoData}
                                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${isFullFrameMode ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isFullFrameMode ? 'translate-x-4' : 'translate-x-0'}`} />
                                </button>
                            </div>
                            
                            {/* Kho Tải Video Dựng Sẵn (Chỉ hiện khi bật Chế độ) */}
                            {isFullFrameMode && (
                                <div className="flex flex-col gap-3 mt-2 bg-emerald-900/10 p-3 rounded-xl border border-emerald-500/20 animate-in slide-in-from-top-2 max-h-[350px] overflow-y-auto scrollbar-hide">
                                    <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                                        <span className="text-[10px] text-emerald-300 font-bold shrink-0">Danh sách Cảnh quay:</span>
                                        <select 
                                            className="bg-slate-900 border border-emerald-500/30 text-emerald-400 text-[10px] rounded px-2 py-1 outline-none cursor-pointer shadow-sm flex-1 min-w-[150px]"
                                            onChange={(e) => handleLoadPack(e.target.value)}
                                        >
                                            <option value="">-- Chọn Bộ Cảnh --</option>
                                            {localFfPacks.length > 0 && (
                                                <optgroup label="⭐ Cảnh Cá Nhân (Từ Máy Tính)">
                                                    {localFfPacks.map(p => (
                                                        <option key={p.id} value={p.id}>{p.name} ({p.aspect === 'doc' ? 'Dọc' : 'Ngang'})</option>
                                                    ))}
                                                </optgroup>
                                            )}
                                            <optgroup label="🌐 Cảnh Mặc Định (16:9)">
                                                {FULLFRAME_PACKS.filter(p => p.aspect === 'ngang').map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </optgroup>
                                            <optgroup label="📱 Cảnh Mặc Định (9:16)">
                                                {FULLFRAME_PACKS.filter(p => p.aspect === 'doc').map(p => (
                                                    <option key={p.id} value={p.id}>{p.name}</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>

                                    {/* Nút Xóa bộ cảnh local đang hiển thị nếu có */}
                                    {localFfPacks.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-1">
                                            {localFfPacks.map(pack => (
                                                <span key={`del_${pack.id}`} className="bg-slate-800 text-[9px] text-slate-400 px-2 py-1 rounded flex items-center gap-1 border border-white/5">
                                                    {pack.name} <button onClick={(e) => handleDeleteFfPack(pack.id, e)} className="hover:text-rose-400 ml-1"><X size={10}/></button>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* TÂM AN FIX: BỔ SUNG CỤM NÚT TẢI NHIỀU FILE & HƯỚNG DẪN */}
                                    <div className="flex gap-1.5 flex-wrap justify-end mb-1 border-b border-emerald-500/20 pb-2">
                                            <input 
                                                type="file" 
                                                multiple 
                                                accept="video/*" 
                                                className="hidden" 
                                                id="upload-folder-input"
                                                onChange={handleUploadFolder} 
                                            />
                                            <button 
                                                onClick={showUploadGuide}
                                                className="bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0 border border-white/5"
                                                title="Xem hướng dẫn đặt tên file"
                                            >
                                                <Info size={10}/> Cách đặt tên
                                            </button>
                                            <button 
                                                onClick={() => document.getElementById('upload-folder-input').click()}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                                                title="Quét chọn nhiều file video cùng lúc để hệ thống tự ghép"
                                            >
                                                <Upload size={10}/> Tải nguyên Bộ (Từ máy)
                                            </button>
                                    </div>

                                    <div className="flex gap-1.5 flex-wrap justify-end mb-1">
                                            <button 
                                                onClick={handleCopyFfScenesCode}
                                                className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                                                title="Copy mã để gửi cho Tâm An cập nhật vào kho vĩnh viễn"
                                            >
                                                <Copy size={10}/> Copy Mã gửi Tâm An
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // Đặt tên mặc định gợi ý
                                                    setSavePackData({ name: `Bộ cảnh ${new Date().toLocaleDateString('vi-VN')} ${new Date().getHours()}h`, aspect: videoAspectRatio === '9x16' ? 'doc' : 'ngang' });
                                                    setShowSavePackModal(true);
                                                }}
                                                className="bg-amber-600 hover:bg-amber-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                                            >
                                                <Archive size={10}/> Lưu thành Bộ Cảnh Cá Nhân
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    // Tạo danh sách 1-1 với lịch sử tin nhắn
                                                    const newScenes = messages.map(m => ({
                                                        id: m.id, // Sử dụng ID tin nhắn làm ID cảnh quay
                                                        role: m.role === 'ai' ? 'lao' : 'user',
                                                        emotion: m.emotion || 'calm',
                                                        url: null,
                                                        idbKey: null,
                                                        textSnippet: m.text.substring(0, 40) + '...' // Hiển thị 1 đoạn ngắn
                                                    }));
                                                    // Thêm cảnh Outro
                                                    newScenes.push({ id: `scene_outro_${Date.now()}`, role: 'outro', emotion: 'calm', url: null, idbKey: null, textSnippet: 'Cảnh kết thúc (Vái lạy / Tĩnh)' });
                                                    
                                                    // Hợp nhất để giữ lại các URL/IDB đã gán trước đó (nếu trùng ID)
                                                    const mergedScenes = newScenes.map(ns => {
                                                        const existing = ffScenes.find(os => os.id === ns.id);
                                                        if (existing) return { ...ns, url: existing.url, idbKey: existing.idbKey };
                                                        return ns;
                                                    });
                                                    
                                                    setFfScenes(mergedScenes);
                                                    showToastMsg('Đã đồng bộ 1-1 danh sách cảnh quay theo Kịch bản hiện tại!', 'success', 5000);
                                                }}
                                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                                            >
                                                <RefreshCw size={10}/> Đồng bộ từ Kịch bản
                                            </button>
                                            <button 
                                                onClick={() => setFfScenes(prev => [...prev, { id: `scene_${Date.now()}`, role: 'user', emotion: 'calm', url: null, idbKey: null }])}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-2 py-1.5 rounded text-[9px] font-bold transition-all flex items-center gap-1 shadow-md shrink-0"
                                            >
                                                <Plus size={10}/> Thêm cảnh tự do
                                            </button>
                                    </div>
                                    
                                    {ffScenes.map((scene, idx) => (
                                        <div key={scene.id} className="flex gap-2 items-center bg-slate-950 p-2 rounded-lg border border-white/5 relative group mt-1">
                                            {/* Bảng điều khiển mini (Move & Delete) */}
                                            <div className="absolute -top-3 -right-2 flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                                <div className="flex gap-0.5 bg-slate-800 p-1 rounded-md shadow-lg border border-white/10">
                                                    <button
                                                        onClick={() => moveFfScene(idx, -1)}
                                                        disabled={idx === 0}
                                                        className="p-0.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded disabled:opacity-30 transition-colors"
                                                        title="Di chuyển lên ưu tiên trước"
                                                    >
                                                        <ChevronUp size={14}/>
                                                    </button>
                                                    <button
                                                        onClick={() => moveFfScene(idx, 1)}
                                                        disabled={idx === ffScenes.length - 1}
                                                        className="p-0.5 hover:bg-emerald-500/20 text-slate-400 hover:text-emerald-400 rounded disabled:opacity-30 transition-colors"
                                                        title="Di chuyển xuống"
                                                    >
                                                        <ChevronDown size={14}/>
                                                    </button>
                                                    <div className="w-px bg-white/10 mx-0.5"></div>
                                                    <button 
                                                        onClick={() => {
                                                            if (scene.url) URL.revokeObjectURL(scene.url);
                                                            setFfScenes(prev => prev.filter(s => s.id !== scene.id));
                                                        }} 
                                                        className="p-0.5 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded transition-colors"
                                                        title="Xóa cảnh này"
                                                    >
                                                        <X size={14}/>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Thumbnail Video */}
                                            <label className="w-16 h-16 rounded-md border border-dashed border-emerald-500/30 hover:border-emerald-500 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden bg-slate-900 shrink-0">
                                                <input type="file" accept="video/*" className="hidden" onChange={(e) => {
                                                    const file = e.target.files[0];
                                                    if (file) {
                                                        if (scene.url) URL.revokeObjectURL(scene.url);
                                                        const url = URL.createObjectURL(file);
                                                        setFfScenes(prev => prev.map(s => s.id === scene.id ? {...s, url, idbKey: null} : s));
                                                    }
                                                    e.target.value = '';
                                                }} />
                                                {scene.url ? (
                                                    <video src={scene.url} muted playsInline className="w-full h-full object-cover" onMouseEnter={e => e.target.play()} onMouseLeave={e => e.target.pause()} />
                                                ) : (
                                                    <Plus size={14} className="text-emerald-500" />
                                                )}
                                            </label>

                                            {/* Settings Cảnh */}
                                            <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                                                {/* Hiển thị tóm tắt câu thoại để biết cần nạp video cho nội dung gì */}
                                                {scene.textSnippet && (
                                                    <div className="w-full text-[10px] text-slate-300 italic truncate mb-0.5 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5" title={scene.textSnippet}>
                                                        "{scene.textSnippet}"
                                                    </div>
                                                )}
                                                <div className="flex gap-1.5 w-full">
                                                    <select 
                                                        value={scene.role}
                                                        onChange={(e) => setFfScenes(prev => prev.map(s => s.id === scene.id ? {...s, role: e.target.value} : s))}
                                                        className="flex-1 bg-slate-800 border border-white/10 rounded px-1 py-1 text-[9px] text-white outline-none"
                                                    >
                                                        <option value="lao">👳 Máy quay Lão</option>
                                                        <option value="user">🙏 Máy quay Con</option>
                                                        <option value="outro">🎬 Cảnh Kết thúc</option>
                                                    </select>
                                                    <select 
                                                        value={scene.emotion}
                                                        onChange={(e) => setFfScenes(prev => prev.map(s => s.id === scene.id ? {...s, emotion: e.target.value} : s))}
                                                        className="flex-1 bg-slate-800 border border-white/10 rounded px-1 py-1 text-[9px] text-white outline-none"
                                                    >
                                                        <option value="calm">😐 Bình thường</option>
                                                        <option value="sad">😢 Buồn / Bế tắc</option>
                                                        <option value="joy">😄 Vui / Hạnh phúc</option>
                                                    </select>
                                                </div>
                                                <div className="flex w-full gap-1">
                                                    <select 
                                                        className="flex-1 bg-slate-900 border border-emerald-500/20 rounded px-1 py-1 text-[9px] text-emerald-400 outline-none cursor-pointer"
                                                        value={scene.idbKey || ''}
                                                        onChange={(e) => handleSelectFfClipV2(scene.id, e.target.value)}
                                                    >
                                                        <option value="">-- Lấy từ Kho máy --</option>
                                                        {localFfClips.filter(c => c.role === scene.role).map(c => (
                                                            <option key={c.id} value={c.id}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    {scene.url && !scene.idbKey && (
                                                        <button 
                                                            onClick={() => { setFfSaveData({ sceneId: scene.id, name: `Cảnh ${scene.role} ${Date.now().toString().slice(-4)}` }); setShowFfSaveModal(true); }}
                                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-1.5 rounded flex items-center justify-center transition-colors shrink-0"
                                                            title="Lưu video này vào kho máy"
                                                        >
                                                            <Save size={10} />
                                                        </button>
                                                    )}
                                                    {scene.idbKey && (
                                                        <button
                                                            onClick={() => handleDeleteFfClipV2(scene.idbKey)}
                                                            className="bg-rose-900/50 hover:bg-rose-900 text-rose-400 px-1.5 rounded flex items-center justify-center transition-colors shrink-0"
                                                            title="Xóa vĩnh viễn video này khỏi Kho"
                                                        >
                                                            <Trash2 size={10} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                         </div>

                         {/* Khu vực Tùy chỉnh Logo & Watermark */}
                         <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-amber-400 tracking-wider flex items-center gap-1.5"><ImageIcon size={14}/> Logo & Đóng Dấu (Watermark)</label>
                            <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-xl border border-white/10">
                               <div className="flex gap-2 w-full">
                                  <input type="file" ref={logoFileInputRef} className="hidden" accept="image/*" onChange={handleUploadLogo} />
                                  <button onClick={() => logoFileInputRef.current.click()} disabled={isExportingVideo || isPreparingVideoData} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold py-2.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">
                                    <Upload size={14} /> Chọn Logo
                                  </button>
                                  {logoData && (
                                     <button onClick={removeLogo} disabled={isExportingVideo || isPreparingVideoData} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold py-2.5 px-4 rounded-lg flex items-center justify-center transition-all">
                                        <X size={14} /> Gỡ bỏ
                                     </button>
                                  )}
                               </div>
                               
                               {logoData && (
                                  <div className="flex flex-col gap-3 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30 animate-in fade-in">
                                     <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5"><Palette size={14}/> Xóa nền Logo (Chroma Key)</span>
                                     <select value={logoSettings.chromaType} onChange={e => setLogoSettings(p => ({...p, chromaType: e.target.value}))} className="w-full bg-slate-800 border border-white/10 text-white p-2 rounded-lg outline-none text-[11px] focus:border-amber-500">
                                        <option value="none">Giữ nguyên bản gốc</option>
                                        <option value="black">Xóa Nền Đen</option>
                                        <option value="white">Xóa Nền Trắng</option>
                                        <option value="custom">Tùy chọn màu cần xóa</option>
                                     </select>
                                     
                                     {logoSettings.chromaType !== 'none' && (
                                        <div className="flex flex-col gap-2 mt-1 animate-in fade-in">
                                           {logoSettings.chromaType === 'custom' && (
                                              <div className="flex items-center gap-2">
                                                 <input type="color" value={logoSettings.chromaColor} onChange={e => setLogoSettings(p => ({...p, chromaColor: e.target.value}))} className="w-8 h-8 rounded border-none bg-transparent cursor-pointer" />
                                                 <span className="text-[10px] text-slate-400">Chọn màu nền cần xóa</span>
                                              </div>
                                           )}
                                           <div className="grid grid-cols-2 gap-4">
                                              <div className="flex flex-col gap-1">
                                                 <span className="text-[10px] text-slate-400 font-mono flex justify-between"><span>Độ ăn lẹm</span> <span>{logoSettings.tolerance}</span></span>
                                                 <input type="range" min="5" max="250" value={logoSettings.tolerance} onChange={e => setLogoSettings(p => ({...p, tolerance: Number(e.target.value)}))} className="accent-amber-500" />
                                              </div>
                                              <div className="flex flex-col gap-1">
                                                 <span className="text-[10px] text-slate-400 font-mono flex justify-between"><span>Độ mềm viền</span> <span>{logoSettings.smoothness || 0}</span></span>
                                                 <input type="range" min="0" max="100" value={logoSettings.smoothness || 0} onChange={e => setLogoSettings(p => ({...p, smoothness: Number(e.target.value)}))} className="accent-amber-500" />
                                              </div>
                                           </div>
                                        </div>
                                     )}
                                  </div>
                               )}
                            </div>
                         </div>

                         <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-emerald-400 tracking-wider flex items-center gap-1.5"><Music4 size={14}/> Thêm nhạc nền (Tùy chọn)</label>
                               <div className="flex flex-col gap-3 bg-slate-950 p-3 rounded-xl border border-white/10">
                                  <div className="flex gap-2 w-full">
                                     <input type="file" ref={bgmFileInputRef} className="hidden" accept="audio/*" onChange={handleUploadBgm} />
                                     <button onClick={() => bgmFileInputRef.current.click()} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-bold py-2.5 px-3 rounded-lg border border-white/10 flex justify-center items-center gap-1.5 transition-all">
                                       <Upload size={14} /> Tải MP3
                                     </button>
                                     <select 
                                        disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm}
                                        className="flex-1 bg-slate-800 border border-white/10 text-xs px-3 py-2.5 rounded-lg outline-none text-white focus:border-emerald-500 cursor-pointer"
                                        onChange={(e) => {
                                            const selected = DEFAULT_BGM_LIST.find(m => m.id === e.target.value);
                                            if (selected && selected.url && selected.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3') {
                                                setBgmAudioData({ url: selected.url, name: selected.name, isPreset: true });
                                            } else {
                                                removeBgm();
                                            }
                                        }}
                                     >
                                        <option value="">-- Chọn Kho Nhạc --</option>
                                        {DEFAULT_BGM_LIST.filter(m => m.url && m.url !== 'DÁN_LINK_NHẠC_CỦA_CON_VÀO_ĐÂY.mp3').map(bgm => (
                                            <option key={bgm.id} value={bgm.id}>{bgm.name}</option>
                                        ))}
                                     </select>
                                  </div>
                                  
                                  <div className="flex w-full relative mt-1">
                                     <input type="text" value={aiBgmPrompt} onChange={e => setAiBgmPrompt(e.target.value)} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm} placeholder="AI tự tạo nhạc thiền 30s, tiếng nước chảy..." className="w-full bg-slate-800 border border-white/10 text-xs px-3 py-2.5 rounded-l-lg outline-none text-white placeholder:text-slate-500 focus:border-emerald-500" />
                                     <button onClick={handleGenerateAiBgm} disabled={isExportingVideo || isPreparingVideoData || isGeneratingBgm || !aiBgmPrompt.trim()} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-r-lg disabled:opacity-50 flex items-center justify-center gap-1.5 transition-all whitespace-nowrap">
                                        {isGeneratingBgm ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} Tạo AI
                                     </button>
                                  </div>

                                  {tempAiBgmData && (
                                     <div className="flex flex-col gap-2 w-full bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-2.5">
                                        <div className="flex items-center justify-between">
                                           <span className="text-xs text-emerald-400 font-bold flex items-center gap-1.5"><Sparkles size={12}/> Bản nháp nhạc AI (30s)</span>
                                           <button onClick={() => { URL.revokeObjectURL(tempAiBgmData.url); setTempAiBgmData(null); }} className="text-slate-400 hover:text-rose-400"><X size={14}/></button>
                                        </div>
                                        <audio src={tempAiBgmData.url} controls className="w-full h-8 outline-none" />
                                        <div className="flex gap-2 mt-1">
                                           <button onClick={() => { 
                                              if (bgmAudioData?.url) URL.revokeObjectURL(bgmAudioData.url);
                                              setBgmAudioData(tempAiBgmData); 
                                              setTempAiBgmData(null); 
                                              setAiBgmPrompt('');
                                           }} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold py-2 rounded-md transition-all">Sử dụng nhạc này</button>
                                        </div>
                                     </div>
                                  )}

                                  {bgmAudioData && !tempAiBgmData && (
                                     <div className="flex items-center justify-between w-full bg-emerald-900/30 border border-emerald-500/30 rounded-lg p-2.5 mt-1">
                                       <span className="text-xs text-emerald-400 font-bold truncate pr-2 max-w-[200px]">{bgmAudioData.name}</span>
                                       <button onClick={removeBgm} disabled={isExportingVideo || isPreparingVideoData} className="text-rose-400 hover:text-rose-300 bg-rose-500/10 p-1.5 rounded"><X size={14}/></button>
                                     </div>
                                  )}

                                  <div className={`w-full flex flex-col gap-1.5 ${!bgmAudioData && !tempAiBgmData ? 'opacity-30' : ''}`}>
                                     <span className="text-[10px] text-slate-400 flex justify-between font-bold"><span>Âm lượng nhạc nền:</span> <span>{Math.round(bgmVolume * 100)}%</span></span>
                                     <input type="range" disabled={isExportingVideo || (!bgmAudioData && !tempAiBgmData)} min="0.01" max="1" step="0.01" value={bgmVolume} onChange={e => setBgmVolume(Number(e.target.value))} className="w-full accent-emerald-500 disabled:opacity-50" />
                                  </div>
                               </div>
                            </div>
                            
                            {/* NÚT DỌN RÁC RAM TRƯỚC KHI RENDER */}
                            <div className="flex flex-col gap-2 mt-2">
                               <div className="bg-emerald-900/10 border border-emerald-500/20 p-3 rounded-xl shadow-inner">
                                  <p className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5 mb-1.5"><Wand2 size={14}/> Tối ưu hóa bộ nhớ</p>
                                  <p className="text-[10px] text-slate-400 mb-3 leading-relaxed">Nếu trình duyệt bị giật lag sau thời gian dài sử dụng, hãy bấm nút dưới đây để làm sạch bộ nhớ đệm. Việc này giúp video render ra mượt mà và không bị rớt khung hình.</p>
                                  <button onClick={handleClearCache} disabled={isExportingVideo || isPreparingVideoData} className="w-full bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold py-2.5 rounded-lg border border-emerald-500/30 flex items-center justify-center gap-2 transition-all shadow-sm">
                                     <Trash2 size={14} /> Xóa Cache & Giải phóng RAM
                                  </button>
                               </div>
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5">
                               {!isExportingVideo ? (
                                  <button onClick={startVideoExport} disabled={isPreparingVideoData} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all hover:scale-[1.02]">
                                     {isPreparingVideoData ? <><Loader2 size={18} className="animate-spin"/> Đang gom dữ liệu âm thanh...</> : <><Video size={18}/> Bắt Đầu Render Video</>}
                                  </button>
                               ) : (
                                  <button onClick={cancelVideoExport} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl tracking-wider shadow-lg flex items-center justify-center gap-2 animate-pulse">
                                     <XCircle size={18}/> Dừng & Hủy Bỏ Render
                                  </button>
                               )}
                            </div>
                          </div>
                        )}

                        {/* TÂM AN THÊM TAB: THÔNG ĐIỆP (INTRO/OUTRO) */}
                        {exportTab === 'text' && (
                          <div className="flex flex-col gap-4 flex-1 animate-in fade-in overflow-y-auto pr-1">
                              <div className="bg-slate-900 border border-yellow-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-inner">
                                  <div className="flex items-center justify-between">
                                      <h3 className="text-xs font-bold text-yellow-400 flex items-center gap-1.5"><Film size={14}/> Màn Hình Giới Thiệu (Intro)</h3>
                                      <button 
                                          onClick={() => setEnableIntro(!enableIntro)} 
                                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableIntro ? 'bg-yellow-500' : 'bg-slate-700'}`}
                                      >
                                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableIntro ? 'translate-x-3' : 'translate-x-0'}`} />
                                      </button>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Xuất hiện trong 4 giây đầu tiên của video để giới thiệu chủ đề. (Auto-Pilot sẽ tự động điền thông tin này cho bạn).</p>
                                  
                                  {enableIntro && (
                                      <div className="flex flex-col gap-3 animate-in fade-in">
                                          <div className="flex flex-col gap-1.5">
                                              <label className="text-[10px] font-bold text-slate-300">Tiêu đề chính (Màu Vàng):</label>
                                              <input 
                                                  type="text" 
                                                  value={introTitle} 
                                                  onChange={e => setIntroTitle(e.target.value)} 
                                                  placeholder="VD: Chủ đề Vô Thường" 
                                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-yellow-500 outline-none font-bold" 
                                              />
                                          </div>
                                          <div className="flex flex-col gap-1.5">
                                              <label className="text-[10px] font-bold text-slate-300">Dòng Phụ / Câu hỏi tự vấn (Màu Trắng):</label>
                                              <textarea 
                                                  value={introSubtitle} 
                                                  onChange={e => setIntroSubtitle(e.target.value)} 
                                                  placeholder="VD: Làm sao để buông bỏ muộn phiền?" 
                                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:border-yellow-500 outline-none resize-none h-16 scrollbar-hide italic" 
                                              />
                                          </div>
                                      </div>
                                  )}
                              </div>

                              <div className="bg-slate-900 border border-orange-500/30 p-4 rounded-xl flex flex-col gap-3 shadow-inner">
                                  <div className="flex items-center justify-between">
                                      <h3 className="text-xs font-bold text-orange-400 flex items-center gap-1.5"><FileText size={14}/> Lời Chúc Kết Màn (Outro)</h3>
                                      <button 
                                          onClick={() => setEnableOutroText(!enableOutroText)} 
                                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${enableOutroText ? 'bg-orange-500' : 'bg-slate-700'}`}
                                      >
                                          <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${enableOutroText ? 'translate-x-3' : 'translate-x-0'}`} />
                                      </button>
                                  </div>
                                  <p className="text-[10px] text-slate-400 leading-relaxed mb-1">Hiện lên màn hình trong lúc người hỏi đang vái lạy (6 giây cuối video).</p>
                                  
                                  {enableOutroText && (
                                      <div className="flex flex-col gap-3 animate-in fade-in">
                                          <textarea 
                                              value={outroText} 
                                              onChange={e => setOutroText(e.target.value)} 
                                              placeholder="VD: Nguyện người xem được giác ngộ giải thoát..." 
                                              className="w-full bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-center text-orange-200 focus:border-orange-500 outline-none resize-none h-24 scrollbar-hide font-bold leading-relaxed" 
                                          />
                                      </div>
                                  )}
                              </div>
                              
                              <div className="mt-auto pt-4 border-t border-white/5">
                                 {!isExportingVideo ? (
                                    <button onClick={startVideoExport} disabled={isPreparingVideoData} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl tracking-wider flex justify-center items-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-wait transition-all hover:scale-[1.02]">
                                       {isPreparingVideoData ? <><Loader2 size={18} className="animate-spin"/> Đang gom dữ liệu...</> : <><Video size={18}/> Bắt Đầu Render Video</>}
                                    </button>
                                 ) : (
                                    <button onClick={cancelVideoExport} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-4 rounded-xl tracking-wider shadow-lg flex items-center justify-center gap-2 animate-pulse">
                                       <XCircle size={18}/> Dừng & Hủy Bỏ
                                    </button>
                                 )}
                              </div>
                          </div>
                        )}
                      </>
                    )}
                 </div>

                 {/* BÊN PHẢI: BẢNG PREVIEW / RENDER VIDEO */}
                 <div className={`w-full bg-black border border-white/10 overflow-hidden relative shadow-inner flex items-center justify-center flex-col shrink-0 transition-all duration-300 ${isPreviewFullscreen ? 'fixed inset-0 z-[250] rounded-none' : 'md:w-7/12 rounded-xl aspect-[16/9] md:aspect-auto md:h-full'}`}>
                    {renderedVideoUrl ? (
                       <video ref={previewVideoRef} controls src={renderedVideoUrl} className="w-full h-full object-contain bg-slate-950" />
                    ) : (
                       <>
                          {/* NÚT UNDO / REDO TRÊN MÀN HÌNH CANAVS */}
                          <div className="absolute top-4 left-4 z-50 flex gap-2">
                              <button 
                                 onClick={handleUndoPosition} 
                                 disabled={pastOffsets.length === 0 || isExportingVideo}
                                 className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                                 title="Hoàn tác thao tác di chuyển/phóng to"
                              >
                                 <Undo2 size={16} />
                              </button>
                              <button 
                                 onClick={handleRedoPosition} 
                                 disabled={futureOffsets.length === 0 || isExportingVideo}
                                 className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2 rounded-lg border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg"
                                 title="Làm lại thao tác"
                              >
                                 <Redo2 size={16} />
                              </button>
                          </div>

                          {/* CỤM NÚT GÓC TRÊN BÊN PHẢI (RENDER STATUS & FULLSCREEN) */}
                          <div className="absolute top-4 right-4 z-50 flex items-center gap-2">
                              {isExportingVideo && (
                                  <div className="flex flex-col items-end gap-1.5">
                                      <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-4 py-2.5 rounded-lg text-xs text-red-400 font-mono font-bold border border-red-500/30 animate-pulse shadow-lg">
                                          <div className="w-2.5 h-2.5 bg-red-500 rounded-full shadow-[0_0_8px_red]"></div> Đang thu hình...
                                      </div>
                                      {/* BẢNG ĐIỀU KHIỂN AI KIỂM DUYỆT (CHỈ HIỆN KHI ĐANG RENDER) */}
                                      <div id="ai-moderator-status" className="bg-emerald-900/60 backdrop-blur-md px-3 py-2 rounded-lg text-[10px] text-emerald-300 font-mono border border-emerald-500/40 shadow-lg text-right transition-all">
                                          <div className="font-bold flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> AI Đang khởi động...</div>
                                      </div>
                                  </div>
                              )}
                              {!isExportingVideo && (
                                  <button 
                                     onClick={() => setIsPreviewFullscreen(!isPreviewFullscreen)} 
                                     className="bg-black/60 hover:bg-black/80 backdrop-blur-md text-white p-2.5 rounded-lg border border-white/10 transition-all shadow-lg flex items-center justify-center h-[42px] w-[42px]"
                                     title={isPreviewFullscreen ? "Thu nhỏ về mặc định" : "Mở rộng toàn màn hình để dễ chỉnh sửa"}
                                  >
                                     {isPreviewFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                                  </button>
                              )}
                          </div>

                          <canvas 
                             ref={exportCanvasRef} 
                             className="w-full h-full object-contain bg-slate-950 touch-none cursor-move" 
                             onPointerDown={handleCanvasPointerDown}
                             onPointerMove={handleCanvasPointerMove}
                             onPointerUp={handleCanvasPointerUp}
                             onPointerLeave={handleCanvasPointerLeave}
                             onWheel={handleCanvasWheel}
                          />
                          {!isExportingVideo && <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"><div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white/50 border border-white/10">Màn Hình Xem Trước & Tùy Chỉnh (Có thể Undo/Redo)</div></div>}
                       </>
                    )}
                 </div>
              </div>
           </div>
           
           {/* MODAL LƯU / SỬA PRESET BỐI CẢNH */}
           {showPresetModal && (
               <div className="fixed inset-0 z-[250] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowPresetModal(false)}>
                  <div className="bg-slate-900 border border-amber-500/30 rounded-xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-xl">
                          <h2 className="font-bold text-amber-400 tracking-wider flex items-center gap-2">
                             <LayoutTemplate size={16}/> {presetFormData.id ? 'Sửa thông tin Bối cảnh' : 'Lưu Bối cảnh mới'}
                          </h2>
                          <button onClick={() => setShowPresetModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-bold text-slate-400">Tên bối cảnh:</label>
                             <input 
                                type="text" 
                                value={presetFormData.name} 
                                onChange={e => setPresetFormData({...presetFormData, name: e.target.value})}
                                autoFocus
                                placeholder="Ví dụ: Rừng trúc ngang 1"
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none"
                             />
                          </div>
                          
                          <div className="flex flex-col gap-1.5">
                             <label className="text-xs font-bold text-slate-400">Phân loại khung hình (Tọa độ):</label>
                             <select 
                                value={presetFormData.category} 
                                onChange={e => setPresetFormData({...presetFormData, category: e.target.value})}
                                className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none"
                             >
                                <option value="ngang">Khung hình Ngang (16:9, 4:3...)</option>
                                <option value="doc">Khung hình Dọc (9:16, 3:4...)</option>
                                <option value="vuong">Khung hình Vuông (1:1)</option>
                             </select>
                             {!presetFormData.id && (
                                <p className="text-[10px] text-amber-400/80 italic mt-1">Gợi ý: Đã tự động chọn phân loại dựa trên Tỉ lệ khung hình video đang bật.</p>
                             )}
                          </div>

                          <div className="flex justify-end gap-3 mt-2">
                              <button onClick={() => setShowPresetModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                              <button onClick={handleConfirmPreset} disabled={!presetFormData.name.trim()} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                 <Check size={14}/> {presetFormData.id ? 'Cập nhật' : 'Lưu bối cảnh'}
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL NỘI SOI CHẨN ĐOÁN RENDER (PROFILER) */}
           {showDiagnostics && diagnosticReport && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowDiagnostics(false)}>
                  <div className="bg-slate-900 border border-indigo-500/50 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col animate-in zoom-in-95 max-h-[85vh]" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-bold text-indigo-400 tracking-wider flex items-center gap-2">
                             <Sliders size={18}/> Báo Cáo Nội Soi Kỹ Thuật
                          </h2>
                          <button onClick={() => setShowDiagnostics(false)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4 overflow-hidden h-full">
                          <p className="text-[12px] text-slate-300 leading-relaxed shrink-0">
                              Đây là dữ liệu đo lường trực tiếp từ phần cứng của bạn trong quá trình Render video vừa rồi. Hãy bấm <b>"Sao chép Báo Cáo"</b> và dán vào khung chat để Tâm An giúp bạn tái cấu trúc, tối ưu mã nguồn nhé.
                          </p>
                          <textarea 
                              readOnly 
                              value={diagnosticReport} 
                              className="w-full h-full min-h-[40vh] bg-slate-950 border border-white/10 rounded-lg p-4 text-[11px] text-emerald-400 font-mono outline-none resize-none scrollbar-hide"
                          />
                          <div className="flex justify-end gap-3 mt-2 shrink-0">
                              <button onClick={() => setShowDiagnostics(false)} className="px-5 py-2.5 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Đóng</button>
                              <button 
                                  onClick={() => {
                                      copyToClipboard(diagnosticReport);
                                      showToastMsg('Đã sao chép Báo cáo Nội soi! Hãy dán vào khung chat cho Tâm An.', 'success', 5000);
                                      setShowDiagnostics(false);
                                  }} 
                                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-lg transition-all flex items-center gap-2"
                              >
                                 <Copy size={14}/> Sao chép Báo Cáo
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL LƯU NHÂN VẬT VÀO KHO MÁY */}
           {showSaveCharModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowSaveCharModal(false)}>
                  <div className="bg-slate-900 border border-orange-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                          <h2 className="font-bold text-orange-400 tracking-wider flex items-center gap-2"><Save size={16}/> Lưu Nhân Vật Mới</h2>
                          <button onClick={() => setShowSaveCharModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                      </div>
                      <div className="p-5 flex flex-col gap-4">
                          <div className="flex flex-col gap-1.5">
                              <label className="text-xs font-bold text-slate-400">Tên nhân vật:</label>
                              <input 
                                  type="text" 
                                  value={saveCharData.name} 
                                  onChange={e => setSaveCharData({...saveCharData, name: e.target.value})} 
                                  autoFocus 
                                  placeholder="VD: Lão Video Của Tôi" 
                                  className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-orange-500 outline-none" 
                              />
                          </div>
                          {saveCharData.role === 'user' && (
                              <div className="grid grid-cols-2 gap-3">
                                  <div className="flex flex-col gap-1.5">
                                      <label className="text-xs font-bold text-slate-400">Giới tính:</label>
                                      <select 
                                          value={saveCharData.gender} 
                                          onChange={e => setSaveCharData({...saveCharData, gender: e.target.value})} 
                                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-orange-500 outline-none"
                                      >
                                          <option value="Nam">Nam</option>
                                          <option value="Nữ">Nữ</option>
                                      </select>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                      <label className="text-xs font-bold text-slate-400">Tuổi:</label>
                                      <input 
                                          type="number" 
                                          value={saveCharData.age} 
                                          onChange={e => setSaveCharData({...saveCharData, age: Number(e.target.value)})} 
                                          className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-orange-500 outline-none" 
                                      />
                                  </div>
                              </div>
                          )}
                          <div className="flex justify-end gap-3 mt-2">
                              <button onClick={() => setShowSaveCharModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                              <button onClick={executeSaveCharacter} disabled={!saveCharData.name.trim()} className="px-5 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                  <Check size={14}/> Xác nhận lưu
                              </button>
                          </div>
                      </div>
                  </div>
               </div>
           )}

           {/* MODAL LƯU VIDEO DỰNG SẴN VÀO KHO */}
           {showFfSaveModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowFfSaveModal(false)}>
                   <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                           <h2 className="font-bold text-emerald-400 tracking-wider flex items-center gap-2"><Save size={16}/> Lưu Video Lẻ</h2>
                           <button onClick={() => setShowFfSaveModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                       </div>
                       <div className="p-5 flex flex-col gap-4">
                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tên video để dễ nhớ:</label>
                               <input 
                                   type="text" 
                                   value={ffSaveData.name} 
                                   onChange={e => setFfSaveData({...ffSaveData, name: e.target.value})} 
                                   autoFocus 
                                   placeholder="VD: Cảnh Lão ngồi thiền" 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-emerald-500 outline-none" 
                               />
                           </div>
                           <div className="flex justify-end gap-3 mt-2">
                               <button onClick={() => setShowFfSaveModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                               <button onClick={executeSaveFfClipV2} disabled={!ffSaveData.name.trim()} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                   <Check size={14}/> Xác nhận lưu
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

           {/* TÂM AN THÊM: MODAL LƯU TOÀN BỘ THÀNH BỘ CẢNH (PACK) CÁ NHÂN */}
           {showSavePackModal && (
               <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowSavePackModal(false)}>
                   <div className="bg-slate-900 border border-amber-500/30 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                       <div className="p-4 border-b border-white/5 flex justify-between items-center bg-slate-800 rounded-t-2xl">
                           <h2 className="font-bold text-amber-400 tracking-wider flex items-center gap-2"><Archive size={16}/> Lưu Bộ Cảnh Cá Nhân</h2>
                           <button onClick={() => setShowSavePackModal(false)} className="text-slate-400 hover:text-white"><X size={18}/></button>
                       </div>
                       <div className="p-5 flex flex-col gap-4">
                           <p className="text-[11px] text-slate-300 italic bg-amber-900/10 border border-amber-500/20 p-3 rounded-lg">
                               Tính năng này sẽ nén toàn bộ các video đang hiển thị trong danh sách cắt cảnh và lưu vào ổ cứng máy tính. Lần sau bạn chỉ cần chọn tên bộ cảnh là hệ thống tự động nạp toàn bộ mà không cần tải lại từng cái.
                           </p>

                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tên Bộ cảnh:</label>
                               <input 
                                   type="text" 
                                   value={savePackData.name} 
                                   onChange={e => setSavePackData({...savePackData, name: e.target.value})} 
                                   autoFocus 
                                   placeholder="VD: Cảnh Cô Gái Áo Xanh (Dọc)" 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none" 
                               />
                           </div>
                           
                           <div className="flex flex-col gap-1.5">
                               <label className="text-xs font-bold text-slate-400">Tỷ lệ video:</label>
                               <select 
                                   value={savePackData.aspect} 
                                   onChange={e => setSavePackData({...savePackData, aspect: e.target.value})} 
                                   className="w-full bg-slate-950 border border-white/10 rounded-lg p-2.5 text-sm text-white focus:border-amber-500 outline-none"
                               >
                                   <option value="ngang">Ngang (Youtube 16:9)</option>
                                   <option value="doc">Dọc (Tiktok/Reels 9:16)</option>
                               </select>
                           </div>

                           <div className="flex justify-end gap-3 mt-2">
                               <button onClick={() => setShowSavePackModal(false)} className="px-4 py-2 rounded-lg font-bold text-slate-400 hover:text-white text-xs transition-colors">Hủy</button>
                               <button onClick={executeSaveFfPack} disabled={!savePackData.name.trim()} className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold shadow-lg disabled:opacity-50 transition-all flex items-center gap-2">
                                   <Check size={14}/> Xác nhận lưu
                               </button>
                           </div>
                       </div>
                   </div>
               </div>
           )}

         </div>
      )}

      {showUserGuide && (
        <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={() => setShowUserGuide(false)}>
          <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
             <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
               <h2 className="text-lg font-black text-orange-400 flex items-center gap-3 tracking-widest"><Info size={22}/> Hướng dẫn sử dụng</h2>
               <button onClick={() => setShowUserGuide(false)} className="text-slate-400 hover:text-white transition-colors bg-slate-800 p-2 rounded-full"><X size={20}/></button>
             </div>
             <div className="p-6 overflow-y-auto flex flex-col gap-6 text-sm text-slate-300 scrollbar-hide">
                <p className="text-center text-slate-400 italic mb-2">Dưới đây là các pháp khí hỗ trợ con trong quá trình thưa thỉnh cùng Lão.</p>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-slate-800 rounded-xl text-yellow-500 shadow-lg"><Smile size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Lão khai thị</h3><p>Hình ảnh trung tâm là Lão. Lão sẽ lắng nghe, biểu lộ cảm xúc và phản chiếu ánh sáng trí tuệ giúp con nhìn thấu mộng ảo, tìm về bản thể chân thật.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-rose-500/20 rounded-xl text-rose-500 shadow-lg"><Mic size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Thưa hỏi trực tiếp (Micro)</h3><p>Nhấn vào biểu tượng Micro ở giữa để bắt đầu ghi âm giọng nói. Nếu Lão đang giảng, Lão sẽ tự động dừng lại để lắng nghe con. Nhấn lần nữa để kết thúc và gửi lời thưa.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-slate-800 rounded-xl text-orange-400 shadow-lg"><Send size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Gửi tâm thư (Gõ chữ, Ảnh)</h3><p>Con có thể gõ văn bản trực tiếp vào thanh dưới cùng và nhấn nút Gửi. Nếu cần gửi hình, hãy dùng biểu tượng Máy ảnh hoặc Bức ảnh kế bên. Chữ bị sai chính tả sẽ được hệ thống tự động sửa.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-amber-500/20 rounded-xl text-amber-500 shadow-lg"><Sparkles size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Tinh lọc cốt lõi (Ngôi sao)</h3><p>Nằm trong thanh gõ chữ. Khi cõi lòng rối rắm viết quá dài, hãy nhấn biểu tượng này để Lão giúp con đúc kết và tóm gọn lại thành 1 câu hỏi đi thẳng vào trọng tâm nhất.</p></div></div>
                <div className="flex gap-4 items-start bg-slate-800/30 p-4 rounded-2xl border border-white/5"><div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400 shadow-lg"><History size={24}/></div><div><h3 className="text-white font-bold text-base mb-1">Pháp bảo khai thị (Lịch sử)</h3><p>Biểu tượng Đồng hồ góc trên bên phải. Cho phép con xem lại toàn bộ nội dung đàm đạo, đúc kết kệ pháp, xuất ra Video đàm đạo, tải file MP3 hoặc chia sẻ trọn vẹn cuộc trò chuyện.</p></div></div>
             </div>
             <div className="p-4 border-t border-white/5 text-center">
               <button onClick={() => setShowUserGuide(false)} className="px-8 py-3 bg-orange-600 hover:bg-orange-500 text-white rounded-xl font-bold tracking-widest text-sm transition-all shadow-lg">Đã rõ khai thị</button>
             </div>
          </div>
        </div>
      )}

      {showTutorial && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center">
          <div className="fixed inset-0 pointer-events-auto" onClick={(e) => e.stopPropagation()} />
          {targetRect && (
            <div 
              className="absolute pointer-events-none transition-all duration-500 ease-in-out border-2 border-orange-500/50"
              style={{ top: targetRect.top, left: targetRect.left, width: targetRect.width, height: targetRect.height, borderRadius: targetRect.isRound ? '50%' : '16px', boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.85), 0 0 30px rgba(249, 115, 22, 0.4) inset' }}
            />
          )}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[320px] bg-slate-900 border border-orange-500/50 rounded-2xl p-6 shadow-2xl transition-all duration-500 flex flex-col gap-4 z-[110] pointer-events-auto animate-in zoom-in-95">
              <div className="flex items-center gap-2 text-orange-400 font-bold tracking-wider text-xs"><Sparkles size={16} /> Hướng dẫn ({tutorialStep + 1}/{TUTORIAL_STEPS.length})</div>
              <h3 className="text-xl font-black text-white">{TUTORIAL_STEPS[tutorialStep].title}</h3>
              <p className="text-slate-300 text-sm leading-relaxed">{TUTORIAL_STEPS[tutorialStep].content}</p>
              <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                <button onClick={endTutorial} className="text-slate-400 hover:text-white text-xs underline font-medium">Bỏ qua tất cả</button>
                <button onClick={nextTutorialStep} className="bg-orange-600 hover:bg-orange-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-transform hover:scale-105 flex items-center gap-2">{tutorialStep === TUTORIAL_STEPS.length - 1 ? 'Hoàn tất' : 'Đã hiểu'} <ArrowRight size={16} /></button>
              </div>
          </div>
        </div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-[70] w-full sm:w-80 bg-[#0a0f1e]/98 backdrop-blur-3xl border-r border-white/5 flex flex-col shadow-2xl transition-transform duration-500 ${showSessions ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 ${!showSessions && 'md:hidden'}`}>
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
          <div className="flex items-center gap-3 font-black text-[11px] tracking-widest text-emerald-400"><Menu size={16} /> Danh sách đàm đạo</div>
          <button onClick={() => setShowSessions(false)} className="p-1 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>
        <div className="p-4 flex flex-col gap-2 border-b border-white/5">
          <button onClick={handleCreateSession} className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg">
            <Plus size={18} /> Tạo cuộc trò chuyện mới
          </button>
          
          {/* NÚT MỞ TÍNH NĂNG AUTO-PILOT */}
          <button onClick={() => { setShowAutoPilotModal(true); setShowSessions(false); }} className="w-full py-3 rounded-xl bg-rose-700/90 hover:bg-rose-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(225,29,72,0.4)] border border-rose-500/50 mt-1 animate-pulse">
            <Bot size={18} /> Xưởng Phim Tự Động (Auto-Pilot)
          </button>

          {/* NÚT BẬT CHẾ ĐỘ LIVE OBS */}
          <button onClick={() => { 
              setIsLiveMode(true); 
              setShowSessions(false); 
              // TÂM AN THÊM: Mặc định chọn Lão Hoa khi vào Livestream
              const laoHoaChar = allCharacters.find(c => c.id === 'char_lao_hoa');
              if (laoHoaChar) {
                  applyCharacterPreset(laoHoaChar, 'lao', true);
                  handleChangeChatLao(laoHoaChar.id);
                  setLaoIsFullScreen(laoHoaChar.defaultLiveFullScreen !== undefined ? laoHoaChar.defaultLiveFullScreen : false);
              }
          }} className="w-full py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-emerald-500/50 mt-1">
            <Video size={16} /> Bật chế độ Livestream Obs
          </button>
          
          <button onClick={() => { setShowScriptModal(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-cyan-700/80 hover:bg-cyan-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-cyan-500/50 mt-1">
            <FileText size={16} /> Nhập kịch bản thủ công
          </button>

          <button onClick={() => { setShowAITopicModal(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-indigo-500/50 mt-1">
            <Sparkles size={16} /> Đạo Diễn AI (Tạo kịch bản)
          </button>

          {/* NÚT MỞ QUẢN LÝ KHO KỆ PHÁP */}
          <button onClick={() => { setShowPoemModal(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-amber-700/80 hover:bg-amber-600 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg border border-amber-500/50 mt-1">
            <BookOpen size={16} /> Kho Kệ Pháp & Mào Đầu
          </button>
{/* NÚT CHỌN LÃO TRONG KHI CHAT */}
          <div className="w-full rounded-xl bg-slate-900 border border-amber-500/30 mt-1 flex flex-col relative z-20">
             <div className="bg-slate-800/80 px-3 py-2 text-[10px] font-bold text-amber-400 border-b border-white/5 rounded-t-xl">
                Đổi hình tướng Lão
             </div>
             <button 
                onClick={() => setOpenDropdown(openDropdown === 'chat_lao' ? null : 'chat_lao')}
                className="w-full bg-transparent p-2.5 outline-none text-white text-xs cursor-pointer hover:bg-slate-800 transition-colors flex justify-between items-center text-left rounded-b-xl"
             >
                <span className="truncate">{allCharacters.find(c => c.id === currentLaoPresetId)?.name || '-- Bấm để chọn Lão --'}</span>
                <ChevronDown size={14} className="shrink-0 text-slate-500" />
             </button>

             {openDropdown === 'chat_lao' && (
                <div className="absolute top-full left-0 w-full mt-1 bg-slate-800 border border-amber-500/30 rounded-lg shadow-2xl z-[100] max-h-48 overflow-y-auto overflow-x-hidden">
                    {allCharacters.filter(c => c.role === 'lao' || (c.isLocal && c.role === 'lao')).map(char => (
                        <div 
                            key={char.id} 
                            onClick={() => { handleChangeChatLao(char.id); setOpenDropdown(null); setShowSessions(false); }}
                            className="p-3 text-xs text-white hover:bg-amber-600/50 cursor-pointer border-b border-white/5 last:border-0 truncate"
                        >
                            {char.name}
                        </div>
                    ))}
                </div>
             )}
          </div>
          <button onClick={() => { setShowUserGuide(true); setShowSessions(false); }} className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 transition-all border border-white/5 mt-1">
            <Info size={16} /> Hướng dẫn sử dụng
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {sessions.sort((a, b) => (b.isPinned === a.isPinned ? b.id - a.id : b.isPinned ? 1 : -1)).map(session => (
            <div key={session.id} className={`p-3 rounded-xl border transition-all flex flex-col gap-2 ${session.id === currentSessionId ? 'bg-slate-800/80 border-orange-500/50' : 'bg-slate-900/40 border-white/5 hover:bg-slate-800/60'}`}>
              <div className="flex justify-between items-center">
                <div className="flex-1 cursor-pointer truncate mr-2" onClick={() => { setCurrentSessionId(session.id); }}>
                  {editingSessionId === session.id ? (
                     <input autoFocus className="bg-slate-950 text-white text-xs p-1 rounded outline-none border border-orange-500 w-full" value={editSessionTitle} onChange={(e) => setEditSessionTitle(e.target.value)} onBlur={() => saveSessionTitle(session.id)} onKeyPress={(e) => e.key === 'Enter' && saveSessionTitle(session.id)} />
                  ) : (
                     <p className={`text-sm font-bold truncate ${session.id === currentSessionId ? 'text-orange-400' : 'text-slate-300'}`}>
                       {session.isPinned && <Pin size={12} className="inline mr-1 text-emerald-400" />} {session.title}
                     </p>
                  )}
                </div>
                <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity shrink-0">
                  <button onClick={(e) => { e.stopPropagation(); togglePin(session.id); }} className={`hover:text-emerald-400 ${session.isPinned ? 'text-emerald-400' : 'text-slate-400'}`}><Pin size={14} /></button>
                  <button onClick={(e) => { e.stopPropagation(); setEditingSessionId(session.id); setEditSessionTitle(session.title); }} className="hover:text-indigo-400 text-slate-400"><Pencil size={14} /></button>
                  <button onClick={(e) => handleDeleteSession(session.id, e)} className="hover:text-rose-400 text-slate-400"><Trash2 size={14} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative w-full overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
        </div>

        <header className="p-4 md:p-6 flex justify-between items-center z-30">
          <div className="flex items-center gap-3">
            <button data-tutorial="tut-menu" onClick={() => setShowSessions(true)} className="p-2 md:p-3 bg-slate-900/50 border border-white/5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all mr-2"><Menu size={20} /></button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-b from-slate-800 to-slate-950 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/20 border border-white/10 animate-pulse overflow-hidden">
              {/* TÂM AN FIX: Cập nhật đầy đủ thông số FX cho Ảnh Đại Diện Góc Trái */}
              <div className="w-full h-full flex items-center justify-center" style={{ transform: `scale(${allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
                 <MiniLaoFace className="w-full h-full" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
              </div>
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-black tracking-tighter text-white leading-none flex items-center gap-2">
                Lão
                {isFetchingCloudAudio && <Cloud size={14} className="text-emerald-400 animate-pulse" title="Đang tải âm thanh từ đám mây..." />}
              </h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping"></span>
                <span className="text-[7px] md:text-[9px] text-emerald-400 font-bold tracking-widest leading-none text-nowrap whitespace-nowrap">{currentSession.title}</span>
              </div>
            </div>
          </div>
          <button data-tutorial="tut-history" onClick={() => setShowHistory(!showHistory)} className={`p-2.5 rounded-xl border transition-all relative ${showHistory ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-xl' : 'bg-slate-900/50 border-white/5 text-slate-400'}`}>
              <History size={18}/>
              {messages.filter(m => !m.audioUrl).length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#020617] animate-pulse"></span>}
          </button>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center relative px-4 overflow-hidden mb-32">
          <div className="relative scale-[0.6] sm:scale-80 md:scale-105 transition-transform duration-700">
             {showLaoAura && (
                <>
                   <div className="absolute inset-0 rounded-full bg-yellow-500/20 blur-[50px] animate-pulse pointer-events-none"></div>
                   <div className="absolute inset-0 rounded-full border-[8px] border-yellow-500/40 animate-radiate pointer-events-none"></div>
                   <div className="absolute inset-0 rounded-full border-[8px] border-amber-500/30 animate-radiate-delayed pointer-events-none"></div>
                   <div className="absolute inset-0 rounded-full border-[4px] border-orange-400/20 animate-radiate-slow pointer-events-none"></div>
                </>
             )}
             
             <div data-tutorial="tut-face" className={`relative w-72 h-72 sm:w-80 sm:h-80 md:w-[480px] md:h-[480px] rounded-full bg-gradient-to-b from-slate-800 to-slate-950 border-[4px] border-white/5 shadow-[0_0_60px_rgba(234,179,8,0.25)] flex items-center justify-center overflow-hidden z-10`}>
                {/* BỌC THÊM DIV ĐỂ XỬ LÝ KÉO THẢ VÀ ZOOM */}
                <div 
                    className="w-full h-full cursor-move touch-none relative"
                    onPointerDown={handleChatLaoPointerDown}
                    onPointerMove={handleChatLaoPointerMove}
                    onPointerUp={handleChatLaoPointerUp}
                    onPointerLeave={handleChatLaoPointerUp}
                    onWheel={handleChatLaoWheel}
                    style={{
                        transform: `translate(${chatLaoTransform.x}px, ${chatLaoTransform.y}px) scale(${chatLaoTransform.s})`,
                        transition: chatLaoDragInfo.current.isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    <MiniLaoFace className="w-full h-full drop-shadow-2xl pointer-events-none" mouthOpen={mouthOpen} appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
                </div>
             </div>
             
             {/* BẢNG ĐIỀU KHIỂN NHANH CHO LÃO (Lật, Hào quang) */}
             <div className="absolute -right-6 md:-right-16 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                <button onClick={() => setShowLaoAura(!showLaoAura)} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${showLaoAura ? 'bg-yellow-500 text-white border-yellow-400 shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-yellow-500 border-white/10'}`} title="Bật/Tắt Hào Quang">
                   <Sparkles size={18} />
                </button>
                <button onClick={() => setCharOffsets(prev => ({...prev, lao: {...prev.lao, flip: !prev.lao.flip}}))} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${charOffsets.lao.flip ? 'bg-orange-500 text-white border-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-orange-500 border-white/10'}`} title="Lật hướng nhìn">
                   <FlipHorizontal size={18} />
                </button>
                <button onClick={() => setShowChatLaoControls(!showChatLaoControls)} className={`p-2.5 md:p-3 rounded-full shadow-lg transition-all border ${showChatLaoControls ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-slate-800 text-slate-500 hover:text-indigo-500 border-white/10'}`} title="Mở bảng điều chỉnh vị trí bằng thanh kéo">
                   <Sliders size={18} />
                </button>
                <button onClick={() => { setChatLaoTransform({ x: 0, y: 0, s: allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1 }); setShowChatLaoControls(false); }} className="p-2.5 md:p-3 rounded-full shadow-lg transition-all border bg-slate-800 text-slate-500 hover:text-emerald-500 border-white/10" title="Khôi phục vị trí (Đưa Lão về giữa)">
                   <RotateCcw size={18} />
                </button>
             </div>

             {/* BẢNG TRƯỢT ĐIỀU CHỈNH VỊ TRÍ CHO OBS */}
             {showChatLaoControls && (
                 <div className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+3rem)] md:left-[calc(100%+5rem)] w-48 bg-slate-900/95 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] flex flex-col gap-4 z-30 animate-in fade-in slide-in-from-left-2">
                     <div className="flex justify-between items-center mb-1 border-b border-white/10 pb-2">
                         <span className="text-[11px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5"><Sliders size={12}/> Vị trí Lão</span>
                         <button onClick={() => setShowChatLaoControls(false)} className="text-slate-400 hover:text-rose-400 transition-colors"><X size={14}/></button>
                     </div>
                     <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Ngang (X)</span> <span className="text-indigo-300">{Math.round(chatLaoTransform.x)}</span></span>
                         <input type="range" min="-300" max="300" value={chatLaoTransform.x} onChange={e => setChatLaoTransform(prev => ({...prev, x: Number(e.target.value)}))} className="accent-indigo-500" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Dọc (Y)</span> <span className="text-indigo-300">{Math.round(chatLaoTransform.y)}</span></span>
                         <input type="range" min="-300" max="300" value={chatLaoTransform.y} onChange={e => setChatLaoTransform(prev => ({...prev, y: Number(e.target.value)}))} className="accent-indigo-500" />
                     </div>
                     <div className="flex flex-col gap-1.5">
                         <span className="text-[10px] text-slate-300 flex justify-between font-bold"><span>Thu phóng</span> <span className="text-indigo-300">x{chatLaoTransform.s.toFixed(2)}</span></span>
                         <input type="range" min="0.5" max="4.0" step="0.05" value={chatLaoTransform.s} onChange={e => setChatLaoTransform(prev => ({...prev, s: Number(e.target.value)}))} className="accent-indigo-500" />
                     </div>
                 </div>
             )}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 pb-8 md:pb-6 flex flex-col items-center z-50 bg-gradient-to-t from-[#020617] to-transparent">
          {selectedImage && <div className="mb-3 relative animate-in slide-in-from-bottom-2"><img src={selectedImage} alt="Preview" className="w-16 h-16 object-cover rounded-lg border-2 border-orange-500 shadow-lg" /><button onClick={() => setSelectedImage(null)} className="absolute -top-2 -right-2 bg-rose-500 rounded-full p-1 shadow-lg hover:scale-110 transition-all"><X size={10} /></button></div>}
          
          {/* BỘ ĐẾM THỜI GIAN TĨNH TÂM (IDLE TIMER) */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] text-slate-400 font-mono bg-slate-900/50 px-3 py-1 rounded-full border border-white/5 backdrop-blur-md transition-all animate-in slide-in-from-bottom-2">
              Thời gian tĩnh tâm: <span className="text-emerald-400 font-bold">{Math.floor(idleSeconds / 60).toString().padStart(2, '0')}:{ (idleSeconds % 60).toString().padStart(2, '0') }</span>
          </div>

          <div className="bg-slate-900/95 backdrop-blur-3xl border border-white/5 rounded-full p-1.5 md:p-2 flex items-center gap-2 shadow-2xl w-full max-w-lg md:w-auto overflow-hidden relative mt-1">
            <button data-tutorial="tut-mic" onClick={toggleMic} className={`p-6 md:p-6 rounded-full transition-all transform active:scale-95 relative ${isRecording ? 'bg-rose-500 text-white shadow-[0_0_40px_rgba(244,63,94,0.7)] scale-110' : 'bg-slate-800 text-slate-400 hover:text-rose-400'}`} title="Thưa hỏi Lão">
              <div className={`absolute inset-0 rounded-full border-[6px] border-rose-500/30 ${!isRecording ? 'animate-ping opacity-60' : ''}`}></div>
              <div className={`absolute inset-0 rounded-full bg-rose-500/10 ${!isRecording ? 'animate-pulse' : ''}`}></div>
              {isRecording ? <MicOff size={32} className="relative z-10" /> : <Mic size={32} className="relative z-10" />}
            </button>
            <button onClick={toggleCamera} className={`p-3 rounded-full transition-all ${cameraOn ? 'bg-orange-600 text-white shadow-lg' : 'bg-slate-800 text-slate-500'}`} title="Mở tầm nhìn"><Camera size={18} /></button>
            <button onClick={() => fileInputRef.current.click()} className="p-3 rounded-full bg-slate-800 text-slate-500 hover:text-white transition-all" title="Gửi ảnh"><ImageIcon size={18} /><input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} /></button>
            <div data-tutorial="tut-input" className="flex items-center bg-slate-800/40 rounded-full px-4 py-2.5 flex-1 md:w-[260px] border border-white/5 focus-within:border-orange-500/30 shadow-inner relative">
              <input type="text" placeholder="Con muốn thưa thỉnh..." className="bg-transparent border-none outline-none flex-1 text-[11px] md:text-sm font-medium placeholder:text-slate-600 text-white min-w-0 pr-8" value={inputText} onChange={(e) => setInputText(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(inputText)} />
              <button data-tutorial="tut-refine" onClick={handleRefineInput} disabled={isRefining || !inputText} title="✨ Tinh lọc cốt lõi (Gỡ rối tơ lòng)" className={`absolute right-10 p-1.5 transition-all ${inputText && !isRefining ? 'text-amber-400 hover:scale-110' : 'text-slate-700 opacity-30 cursor-not-allowed'}`}>{isRefining ? <Loader2 size={16} className="animate-spin text-amber-500" /> : <Sparkles size={16} />}</button>
              <button onClick={() => handleSendMessage(inputText)} className={`p-1.5 transition-all ${inputText || selectedImage ? 'text-orange-400 scale-110' : 'text-slate-700 opacity-20'}`}><Send size={16} /></button>
            </div>
            <button onClick={() => setIsVoiceEnabled(!isVoiceEnabled)} className={`p-3 rounded-full transition-all ${isVoiceEnabled ? 'bg-emerald-600/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>{isVoiceEnabled ? <Volume1 size={18} /> : <VolumeX size={18} />}</button>
          </div>
        </div>
      </div>

      <aside className={`fixed inset-y-0 right-0 z-[60] w-full sm:w-80 md:w-[350px] bg-[#0a0f1e]/98 backdrop-blur-3xl border-l border-white/5 flex flex-col shadow-2xl transition-transform duration-500 ${showHistory ? 'translate-x-0' : 'translate-x-full'} md:relative md:translate-x-0 ${!showHistory && 'md:hidden'}`}>
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-900/40">
          <div className="flex items-center gap-3 font-black text-[11px] tracking-widest text-orange-400"><MessageSquare size={16} /> Pháp bảo khai thị</div>
          <button onClick={() => setShowHistory(false)} className="p-1 text-slate-400 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="px-5 py-3 border-b border-white/5 bg-slate-900/20 flex flex-col gap-3">
          
          <button 
             onClick={handleGenerateScriptVoices} 
             disabled={isRegeneratingAll || messages.filter(m => !m.audioUrl).length === 0} 
             className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black border transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${regenerationComplete ? 'border-emerald-700 bg-emerald-900/40 text-emerald-400' : messages.filter(m => !m.audioUrl).length > 0 ? 'border-emerald-500/50 bg-emerald-600 text-white hover:bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'border-indigo-700 bg-indigo-900/40 text-indigo-400 hover:text-indigo-300'}`}
          >
             {isRegeneratingAll ? (
                 <><Loader2 size={16} className="animate-spin" /> Đang tạo... {regenerationProgress}%</>
             ) : regenerationComplete ? (
                 <><Check size={16} /> Đã hoàn tất (100%)</>
             ) : (
                 <><Mic size={16} /> Tạo toàn bộ âm thanh còn thiếu</>
             )}
          </button>

          <div className="grid grid-cols-2 gap-2">
             <button onClick={handleSummarizeSession} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black border border-amber-700 bg-amber-900/40 text-amber-400 hover:text-amber-300 hover:bg-amber-900/60 transition-all shadow-lg">
                <Wand2 size={14} /> ✨ Đúc kết kệ pháp
             </button>
             <button onClick={() => setShowVideoExportModal(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-black border border-pink-700 bg-pink-900/40 text-pink-400 hover:text-pink-300 hover:bg-pink-900/60 transition-all shadow-lg">
                <Video size={14} /> Tạo video
             </button>
          </div>

          <div className="w-full bg-slate-900/60 rounded-xl p-3 border border-white/5 flex flex-col gap-2">
            <div className="flex items-center justify-between text-[9px] font-bold text-emerald-400 tracking-widest"><span>Phát toàn bộ đàm đạo</span>{isPreparingGlobal && <Loader2 size={10} className="animate-spin" />}</div>
            <div className="flex items-center gap-3">
               <button onClick={toggleGlobalPlay} className="p-2 bg-emerald-600 hover:bg-emerald-500 rounded-full text-white transition-all shadow-md shrink-0">{isGlobalPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}</button>
               <div className="flex-1 flex flex-col gap-1">
                 <input type="range" min="0" max="100" value={globalProgress} onChange={handleGlobalSeek} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500" />
                 <div className="flex justify-between text-[8px] text-slate-400 font-mono font-medium tracking-wider"><span>{formatTime(globalCurrentTime)}</span><span>{formatTime(globalDuration)}</span></div>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative w-full">
              <button onClick={(e) => { e.stopPropagation(); setShowDownloadMenu(!showDownloadMenu); setShowShareMenu(false); }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black border border-slate-700 bg-slate-800 text-slate-400 hover:text-orange-400 transition-all"><Archive size={14} /> Tải MP3 <ChevronDown size={12} /></button>
              {showDownloadMenu && (
                <div className="absolute top-full left-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-1 z-50 shadow-xl flex flex-col gap-1">
                   <button onClick={(e) => { e.stopPropagation(); downloadAllAudios(); }} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-white font-medium">Từng đoạn rời rạc</button>
                   <button onClick={(e) => { e.stopPropagation(); downloadCombinedAudio(); }} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-emerald-400 font-medium flex items-center gap-1.5"><Sparkles size={10}/> Gộp 1 file chung</button>
                </div>
              )}
            </div>

            <div className="relative w-full">
              <button onClick={(e) => { e.stopPropagation(); setShowShareMenu(!showShareMenu); setShowDownloadMenu(false); }} className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-[9px] font-black border border-slate-700 bg-slate-800 text-slate-400 hover:text-indigo-400 transition-all"><ShareIcon size={14} /> Chia sẻ <ChevronDown size={12} /></button>
              {showShareMenu && (
                <div className="absolute top-full right-0 mt-1 w-full bg-slate-800 border border-slate-700 rounded-lg p-1 z-50 shadow-xl flex flex-col gap-1">
                   <button onClick={(e) => { e.stopPropagation(); shareTextContent(); }} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-white font-medium flex items-center gap-1.5"><FileText size={12}/> Văn bản</button>
                   <button onClick={(e) => { e.stopPropagation(); shareCombinedAudioFile(); }} className="text-[10px] p-2 hover:bg-slate-700 rounded text-left text-indigo-400 font-medium flex items-center gap-1.5"><Volume2 size={12}/> File MP3 (Gộp)</button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 pb-32 space-y-10 scrollbar-hide">
          {messages.length === 0 && (
             <div className="flex flex-col items-center justify-center h-full text-slate-700 text-center opacity-30">
               {/* TÂM AN FIX: Cập nhật đầy đủ thông số FX cho Khung Chat Rỗng */}
               <div className="w-16 h-16 mb-4 animate-pulse rounded-full overflow-hidden border border-white/5 shadow-lg flex items-center justify-center">
                  <div className="w-full h-full" style={{ transform: `scale(${allCharacters.find(c => c.id === currentLaoPresetId)?.recommendedScale || 1})` }}>
                     <MiniLaoFace className="w-full h-full opacity-60" appearance={laoAppearance} visualType={laoVisualType} customImages={processedLaoImages} customVideos={chatLaoVideos} chromaSettings={laoChromaSettings} flipped={charOffsets.lao.flip} isSpeakingSession={isLaoSpeakingSession} enableFX={enableAutoHarmonization} shadowConfig={laoShadow} harmonizeSettings={harmonizeSettings} />
                  </div>
               </div>
               <p className="text-[10px] font-bold tracking-widest leading-loose">Quay về nhận ra<br/>Bản thể chân thật</p>
             </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} group animate-in fade-in`}>
              {msg.role === 'user' ? (
                <div className="flex flex-col items-end gap-2 w-full">
                  
                  {/* TÂM AN THÊM: Icon Cảm xúc cho tin nhắn User */}
                  <div className="relative flex items-center gap-1.5 mb-[-4px] mr-2 z-20">
                      <span className="text-[10px] text-slate-500 font-medium">Con</span>
                      <button 
                          onClick={() => setEditingEmotionId(editingEmotionId === msg.id ? null : msg.id)}
                          className="bg-slate-800/50 hover:bg-slate-800 border border-white/5 rounded-full px-1.5 py-0.5 text-[10px] transition-colors"
                          title="Thay đổi cảm xúc"
                      >
                          {EMOTIONS[msg.emotion] || EMOTIONS['calm']}
                      </button>
                      {editingEmotionId === msg.id && (
                          <div className="absolute top-full right-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg p-1 shadow-xl flex gap-1 animate-in zoom-in">
                              {Object.keys(EMOTIONS).map(emoKey => (
                                  <button 
                                      key={emoKey}
                                      onClick={() => {
                                          updateCurrentMessages(prev => prev.map(m => m.id === msg.id ? { ...m, emotion: emoKey } : m));
                                          setEditingEmotionId(null);
                                      }}
                                      className="hover:bg-slate-700 px-2 py-1 rounded text-xs whitespace-nowrap"
                                  >
                                      {EMOTIONS[emoKey]}
                                  </button>
                              ))}
                          </div>
                      )}
                  </div>

                  <div className="max-w-[90%] p-4 rounded-[1.8rem] text-[13px] bg-orange-600 text-white rounded-tr-none shadow-lg relative group/msg transition-all">
                    {msg.imageUrl && <img src={msg.imageUrl} className="w-full h-32 object-cover rounded-xl mb-2" alt="Sent" />}
                    {editingId === msg.id ? (
                      <div className="flex flex-col gap-2">
                        <textarea className="bg-orange-700 text-white text-sm rounded-lg p-2 min-h-[60px] outline-none border border-white/20" value={tempEditText} onChange={(e) => setTempEditText(e.target.value)} autoFocus />
                        <div className="flex justify-end gap-2"><button onClick={() => handleSaveEdit(msg.id)} className="p-1 hover:text-emerald-300"><Check size={18} /></button><button onClick={() => setEditingId(null)} className="p-1 hover:text-rose-300"><XCircle size={18} /></button></div>
                      </div>
                    ) : (
                      <>
                        {msg.isCorrecting ? (
                           <>
                             <span className="whitespace-pre-line text-white/70">{msg.text}</span>
                             <div className="flex items-center gap-3 mt-2.5 bg-orange-700/50 p-1.5 rounded-full pr-3 border border-orange-500/30">
                               <span className="text-[10px] text-orange-200 italic animate-pulse pl-2 font-medium">✨ Đang gọt giũa câu từ...</span>
                               <button onClick={(e) => { e.stopPropagation(); handleStopCorrecting(msg.id, msg.text); }} className="text-[9px] bg-rose-500 text-white hover:bg-rose-400 px-3 py-1 rounded-full shadow-md font-bold transition-all transform hover:scale-105 flex items-center gap-1 tracking-wider"><X size={10} strokeWidth={3} /> Dừng</button>
                             </div>
                           </>
                        ) : (<span className="whitespace-pre-line">{msg.text}</span>)}
                        <div className="absolute -left-12 top-0 flex flex-col gap-2 opacity-0 group-hover/msg:opacity-100 transition-all">
                          <button onClick={(e) => { e.stopPropagation(); copyToClipboard(msg.text); }} className="p-2 bg-slate-800/80 rounded-full hover:text-orange-400"><Copy size={12} /></button>
                          <button onClick={(e) => { e.stopPropagation(); setEditingId(msg.id); setTempEditText(msg.text); }} className="p-2 bg-slate-800/80 rounded-full hover:text-indigo-400"><Pencil size={12} /></button>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex flex-wrap justify-end items-center gap-3 mt-1 px-3">
                    {msg.audioUrl ? (
                      <div className="flex items-center gap-3 bg-white/5 rounded-full px-3 py-1">
                        <button onClick={() => playVoice(msg.audioUrl, msg.id, 'user')} className={`text-slate-400 ${currentlyPlayingId === msg.id ? 'text-orange-400' : ''}`}><Play size={12} fill="currentColor" /></button>
                        <button onClick={() => downloadAudio(msg.audioUrl, `ConThua_${msg.id}`)} className="text-slate-400 hover:text-emerald-400"><Download size={12} /></button>
                      </div>
                    ) : (
                      <button onClick={() => generateVoice(msg.id, msg.text, 'user', currentSessionId, false)} disabled={creatingVoices[msg.id]} className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 hover:text-orange-400 disabled:opacity-30">{creatingVoices[msg.id] ? <Loader2 size={10} className="animate-spin" /> : <Music size={10} />}Tạo tiếng lòng</button>
                    )}
                    <button onClick={() => generateVoice(msg.id, msg.text, 'user', currentSessionId, true)} disabled={creatingVoices[msg.id]} className="text-[9px] font-bold text-slate-600 hover:text-indigo-400 flex items-center gap-1"><RefreshCw size={10} /> Tạo lại</button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start w-full gap-3">
                   {/* TÂM AN THÊM: Icon Cảm xúc cho tin nhắn Lão */}
                   <div className="relative flex items-center gap-1.5 mb-[-8px] ml-4 z-20">
                      <button 
                          onClick={() => setEditingEmotionId(editingEmotionId === msg.id ? null : msg.id)}
                          className="bg-slate-800/80 hover:bg-slate-800 border border-white/5 rounded-full px-1.5 py-0.5 text-[10px] transition-colors"
                          title="Thay đổi cảm xúc"
                      >
                          {EMOTIONS[msg.emotion] || EMOTIONS['calm']}
                      </button>
                      <span className="text-[10px] text-slate-500 font-medium">Lão</span>
                      
                      {editingEmotionId === msg.id && (
                          <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-600 rounded-lg p-1 shadow-xl flex gap-1 animate-in zoom-in">
                              {Object.keys(EMOTIONS).map(emoKey => (
                                  <button 
                                      key={emoKey}
                                      onClick={() => {
                                          updateCurrentMessages(prev => prev.map(m => m.id === msg.id ? { ...m, emotion: emoKey } : m));
                                          setEditingEmotionId(null);
                                      }}
                                      className="hover:bg-slate-700 px-2 py-1 rounded text-xs whitespace-nowrap"
                                  >
                                      {EMOTIONS[emoKey]}
                                  </button>
                              ))}
                          </div>
                      )}
                   </div>

                   <div className="max-w-[95%] p-5 rounded-[2rem] text-[13.5px] bg-slate-800/80 text-slate-200 border border-white/5 rounded-tl-none relative overflow-hidden group/ai transition-all hover:bg-slate-800">
                      <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/50"></div>
                      
                      {editingId === msg.id ? (
                        <div className="flex flex-col gap-2 w-full animate-in fade-in relative z-10">
                          <textarea 
                             className="bg-slate-950/80 text-white text-sm rounded-xl p-3 min-h-[100px] outline-none border border-emerald-500/50 w-full focus:border-emerald-400 transition-colors resize-y leading-relaxed" 
                             value={tempEditText} 
                             onChange={(e) => setTempEditText(e.target.value)} 
                             autoFocus 
                          />
                          <div className="flex justify-end gap-2 mt-1">
                             <button onClick={() => handleSaveEdit(msg.id)} className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold rounded-lg transition-all shadow-md flex items-center gap-1"><Check size={14} /> Lưu lại</button>
                             <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-[11px] font-bold rounded-lg transition-all flex items-center gap-1"><X size={14} /> Hủy</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="italic whitespace-pre-line leading-relaxed">{msg.text}</p>
                          {/* HIỆU ỨNG AI ĐANG VIẾT TIẾP ĐOẠN CHỐT HẠ */}
                          {msg.isAppendingAI && (
                              <div className="flex items-center gap-1.5 mt-3 opacity-50">
                                 <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></span>
                                 <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></span>
                                 <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></span>
                              </div>
                          )}
                          <div className={`flex items-center gap-4 mt-4 pt-4 border-t border-white/5 transition-opacity ${msg.isAppendingAI ? 'opacity-0 pointer-events-none' : 'opacity-40 group-hover/ai:opacity-100'}`}>
                             <button onClick={() => toggleReaction(msg.id, 'liked')} className={`${msg.reactions?.liked ? 'text-orange-400 scale-110' : 'hover:text-white'}`} title="Thích"><ThumbsUp size={14} fill={msg.reactions?.liked ? "currentColor" : "none"} /></button>
                             <button onClick={() => toggleReaction(msg.id, 'unliked')} className={`${msg.reactions?.unliked ? 'text-rose-400 scale-110' : 'hover:text-white'}`} title="Không thích"><ThumbsDown size={14} fill={msg.reactions?.unliked ? "currentColor" : "none"} /></button>
                             
                             {/* NÚT AI TẠO CÂU THẮC MẮC / TRI ÂN */}
                             <button onClick={() => handleGenerateDoubt(msg.id, msg.text, msg.reactions?.liked)} disabled={generatingDoubtId === msg.id} className={`${msg.reactions?.liked ? 'text-emerald-500 hover:text-emerald-400' : 'hover:text-yellow-400'} disabled:opacity-50 transition-colors`} title={msg.reactions?.liked ? "AI Lập lời Cảm Niệm tri ân vì đã liễu ngộ" : "Nhờ AI tạo câu phản biện/thắc mắc về lời này của Lão"}>
                                {generatingDoubtId === msg.id ? <Loader2 size={14} className="animate-spin" /> : <HelpCircle size={14} />}
                             </button>

                             <button onClick={() => shareTextContent()} className="hover:text-white" title="Chia sẻ"><ShareIcon size={14} /></button>
                             <button onClick={() => copyToClipboard(msg.text)} className="hover:text-white" title="Sao chép"><Copy size={14} /></button>
                             <button onClick={() => { setEditingId(msg.id); setTempEditText(msg.text); }} className="hover:text-emerald-400" title="Chỉnh sửa lời thoại"><Pencil size={14} /></button>
                          </div>
                        </>
                      )}
                   </div>
                   <div className="flex items-center gap-4 mt-1 px-4 animate-in fade-in">
                     {msg.audioUrl ? (
                        <div className="flex items-center gap-4">
                          <button onClick={() => playVoice(msg.audioUrl, msg.id, 'ai')} className={`flex items-center gap-2 text-[10px] font-bold transition-all ${currentlyPlayingId === msg.id ? 'text-orange-400' : 'text-slate-500 hover:text-white'}`}>{currentlyPlayingId === msg.id ? <><Pause size={14} fill="currentColor" /> Tạm dừng</> : <><Play size={14} fill="currentColor" /> Nghe lại</>}</button>
                          <button onClick={() => downloadAudio(msg.audioUrl, `Lao_day_${msg.id}`)} className="text-slate-500 hover:text-emerald-400"><Download size={14} /></button>
                        </div>
                     ) : (
                        <button onClick={() => generateVoice(msg.id, msg.text, 'ai')} disabled={creatingVoices[msg.id]} className="text-[10px] font-bold text-slate-500 hover:text-orange-400">{creatingVoices[msg.id] ? "Đang tạo pháp âm..." : "Tạo giọng đọc"}</button>
                     )}
                     <button onClick={() => generateVoice(msg.id, msg.text, 'ai', currentSessionId, true)} disabled={creatingVoices[msg.id]} className="text-[10px] font-bold text-slate-600 hover:text-indigo-400 flex items-center gap-1.5"><RefreshCw size={12} /> Tạo lại</button>
                   </div>
                </div>
              )}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </aside>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; } 
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; } 
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } 
        .animate-spin-slow { animation: spin-slow 50s linear infinite; }
        @keyframes radiate { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.6); opacity: 0; } }
        .animate-radiate { animation: radiate 3.5s ease-out infinite; }
        .animate-radiate-delayed { animation: radiate 3.5s ease-out infinite 1.75s; }
        .animate-radiate-slow { animation: radiate 5s ease-out infinite 1s; }
        @keyframes blink { 0%, 46%, 54%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.1); } }
        .animate-blink { animation: blink 4s infinite; transform-origin: 100px 92px; }
      `}</style>
      
      {/* MODAL AUTO-PILOT (XƯỞNG PHIM TỰ ĐỘNG) */}
      {showAutoPilotModal && (
         <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex justify-center items-center p-4" onClick={() => !apState.isRunning && setShowAutoPilotModal(false)}>
            <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                
                <div className="p-5 border-b border-white/5 flex justify-between items-center bg-slate-800 shrink-0 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600/20 to-transparent pointer-events-none"></div>
                    <h2 className="font-black text-rose-400 tracking-widest flex items-center gap-2 relative z-10 text-lg">
                        <Bot size={22}/> Xưởng Phim Tự Động (Auto-Pilot)
                    </h2>
                    {!apState.isRunning && <button onClick={() => setShowAutoPilotModal(false)} className="text-slate-400 hover:text-white relative z-10"><X size={24}/></button>}
                </div>

                <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
                    
                    {/* BÊN TRÁI: CẤU HÌNH & NHẬP LIỆU */}
                    <div className={`w-full md:w-1/2 p-5 flex flex-col gap-4 overflow-y-auto border-r border-white/5 ${apState.isRunning ? 'opacity-50 pointer-events-none grayscale-[50%]' : ''}`}>
                        
                        <div className="bg-rose-900/20 border border-rose-500/30 p-4 rounded-xl flex flex-col gap-2">
                            <span className="text-xs font-bold text-rose-300 flex items-center gap-1.5"><ListOrdered size={16}/> Danh sách chủ đề cần sản xuất:</span>
                            <textarea 
                                value={apTopics}
                                onChange={e => setApTopics(e.target.value)}
                                placeholder="Nhập mỗi chủ đề 1 dòng...&#10;Hoặc bấm nút bên dưới để nhờ AI tìm trend."
                                className="w-full h-32 bg-slate-950 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-rose-500 outline-none resize-none font-mono"
                            />
                            <button 
                                onClick={handleFetchTrendingTopics}
                                disabled={apState.step === 'fetching_trends'}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 mt-1"
                            >
                                {apState.step === 'fetching_trends' ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>}
                                {apState.step === 'fetching_trends' ? 'Đang phân tích dữ liệu MXH...' : 'Giao phó AI tự tìm chủ đề Hot/Viral'}
                            </button>
                        </div>

                        <div className="flex flex-col gap-3 mt-1">
                            <span className="text-xs font-bold text-slate-300 border-b border-white/10 pb-1">Cấu hình xuất bản:</span>
                            
                            {/* KHỐI CẤU HÌNH GIỌNG ĐỌC & XƯNG HÔ CHO AUTO-PILOT */}
                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 mt-1">
                                <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1"><Users size={12}/> Thiết lập nhân vật:</span>
                                
                                <div className="flex flex-col gap-1.5 mt-1 border-b border-white/5 pb-2">
                                   <div className="flex gap-2">
                                      <input type="text" value={customLaoName} onChange={e=>setCustomLaoName(e.target.value)} placeholder="Tên Lão" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Tên Lão" />
                                      <input type="text" value={laoSelfCall} onChange={e=>setLaoSelfCall(e.target.value)} placeholder="Lão tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Lão tự xưng là gì" />
                                      <input type="text" value={laoCallUser} onChange={e=>setLaoCallUser(e.target.value)} placeholder="Lão gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Lão gọi người hỏi là gì" />
                                   </div>
                                   <div className="flex gap-2">
                                      <select value={laoVoice} onChange={e=>setLaoVoice(e.target.value)} className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none">
                                          <optgroup label="🎙️ Nam"><option value="Algieba">Algieba</option><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                          <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                      </select>
                                      <input type="text" value={laoVoiceStyle} onChange={e=>setLaoVoiceStyle(e.target.value)} placeholder="Phong cách Lão..." className="flex-[2] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" />
                                   </div>
                                </div>
                                
                                <div className="flex flex-col gap-1.5 mt-1">
                                   <div className="flex gap-2">
                                      <input type="text" value={customUserName} onChange={e=>setCustomUserName(e.target.value)} placeholder="Tên Con" className="flex-[1.5] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Tên Người Hỏi" />
                                      <input type="text" value={userSelfCall} onChange={e=>setUserSelfCall(e.target.value)} placeholder="Con tự xưng" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Người hỏi tự xưng là gì" />
                                      <input type="text" value={userCallLao} onChange={e=>setUserCallLao(e.target.value)} placeholder="Con gọi kia" className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none" title="Người hỏi gọi Lão là gì" />
                                   </div>
                                   <div className="flex gap-2">
                                      <select value={userVoice} onChange={e=>setUserVoice(e.target.value)} disabled={apSettings.charMode === 'random'} className="flex-[1] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none disabled:opacity-50">
                                          <optgroup label="🎙️ Nữ"><option value="Aoede">Aoede</option><option value="Kore">Kore</option></optgroup>
                                          <optgroup label="🎙️ Nam"><option value="Puck">Puck</option><option value="Charon">Charon</option></optgroup>
                                      </select>
                                      <input type="text" value={userVoiceStyle} onChange={e=>setUserVoiceStyle(e.target.value)} disabled={apSettings.charMode === 'random'} placeholder="Phong cách Con..." className="flex-[2] bg-slate-950 border border-white/10 rounded-md px-2 py-1.5 text-[10px] text-white outline-none disabled:opacity-50" />
                                   </div>
                                </div>
                            </div>


                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5 mt-1">
                                <label className="text-[11px] font-bold text-slate-400">Độ dài kịch bản:</label>
                                <select 
                                    value={apSettings.scriptLength} 
                                    onChange={e => setApSettings(p => ({...p, scriptLength: e.target.value}))} 
                                    className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                >
                                    <option value="Khoảng 4-6 câu">Ngắn (Khoảng 4-6 câu)</option>
                                    <option value="Khoảng 6-10 câu">Vừa (Khoảng 6-10 câu)</option>
                                    <option value="Khoảng 10-15 câu">Dài (Khoảng 10-15 câu)</option>
                                    <option value="Khoảng 15-21 câu">Rất dài (Khoảng 15-21 câu)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><Sparkles size={14}/> Hiệu ứng chuyển cảnh (Transitions):</label>
                                <select 
                                    value={apSettings.transition} 
                                    onChange={e => setApSettings(p => ({...p, transition: e.target.value}))} 
                                    className="w-full bg-slate-950 border border-white/10 text-white p-2.5 rounded-lg outline-none text-xs focus:border-rose-500"
                                >
                                    <option value="none">Cắt cứng (Mặc định, Tắt hiệu ứng)</option>
                                    <option value="fade_black">Mờ đen (Dip to black)</option>
                                    <option value="fade_white">Chớp trắng (Flash)</option>
                                    <option value="blur">Lóa sáng tâm linh</option>
                                    <option value="random">Ngẫu nhiên tự động</option>
                                </select>
                                {apSettings.transition !== 'none' && (
                                    <div className="flex flex-col gap-1 mt-1 animate-in fade-in bg-slate-900 p-2.5 rounded-lg border border-white/5">
                                        <span className="text-[10px] text-slate-300 flex justify-between font-bold">Thời gian kéo dài: <span className="text-white">{apSettings.transitionDuration}s</span></span>
                                        <input type="range" min="0.1" max="2.0" step="0.1" value={apSettings.transitionDuration} onChange={e => setApSettings(p => ({...p, transitionDuration: Number(e.target.value)}))} className="accent-rose-500" />
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Chế độ sản xuất Video:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.renderMode === 'fullframe' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.renderMode === 'fullframe'} onChange={() => setApSettings(p => ({...p, renderMode: 'fullframe'}))} />
                                        <span className="text-[10px] font-bold">Dựng Sẵn<br/><span className="font-normal text-[9px]">(Video Toàn Cảnh)</span></span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.renderMode === '3d' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.renderMode === '3d'} onChange={() => setApSettings(p => ({...p, renderMode: '3d'}))} />
                                        <span className="text-[10px] font-bold">Cách Cũ<br/><span className="font-normal text-[9px]">(Phông Xanh 3D)</span></span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Tỉ lệ Video:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.orientation === '9x16' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.orientation === '9x16'} onChange={() => setApSettings(p => ({...p, orientation: '9x16'}))} />
                                        <Smartphone size={14}/> Dọc (9:16)
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.orientation === '16x9' ? 'bg-rose-600/20 border-rose-500 text-rose-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.orientation === '16x9'} onChange={() => setApSettings(p => ({...p, orientation: '16x9'}))} />
                                        <Video size={14}/> Ngang (16:9)
                                    </label>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 bg-slate-800/50 p-3 rounded-xl border border-white/5">
                                <label className="text-[11px] font-bold text-slate-400">Thiết lập nhân vật Người Hỏi:</label>
                                <div className="flex gap-2">
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.charMode === 'match' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.charMode === 'match'} onChange={() => setApSettings(p => ({...p, charMode: 'match'}))} />
                                        <span className="text-[10px]">Giữ cố định<br/>(Theo Hồ sơ)</span>
                                    </label>
                                    <label className={`flex-1 flex items-center justify-center text-center gap-1.5 p-2 rounded-lg cursor-pointer transition-all border ${apSettings.charMode === 'random' ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' : 'border-white/10 text-slate-400 hover:bg-slate-700'}`}>
                                        <input type="radio" className="hidden" checked={apSettings.charMode === 'random'} onChange={() => setApSettings(p => ({...p, charMode: 'random'}))} />
                                        <span className="text-[10px]">Đổi ngẫu nhiên<br/>(Ẩn danh)</span>
                                    </label>
                                </div>
                                <p className="text-[9px] text-slate-500 mt-1 italic leading-relaxed">
                                    * Lão và Bối cảnh sẽ luôn được tự động xoay tua ngẫu nhiên để video không bị nhàm chán.
                                </p>
                            </div>
                        </div>

                        <div className="mt-auto pt-4">
                            {!apState.isRunning ? (
                                <button onClick={startAutoPilot} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all hover:scale-[1.02] flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                                    <PlayCircle size={20}/> Khởi Động Xưởng Phim
                                </button>
                            ) : (
                                <button onClick={stopAutoPilot} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-black py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider">
                                    <StopCircle size={20} className="text-rose-400"/> Dừng Khẩn Cấp
                                </button>
                            )}
                        </div>
                    </div>

                    {/* BÊN PHẢI: LOGS & STATUS */}
                    <div className="w-full md:w-1/2 bg-black flex flex-col">
                        <div className="p-3 bg-slate-900 border-b border-white/5 flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Tiến trình hoạt động</span>
                            {apState.isRunning && (
                                <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Đang chạy
                                </span>
                            )}
                        </div>
                        
                        <div className="flex-1 p-4 overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-2 scrollbar-hide">
                            {apState.logs.length === 0 ? (
                                <div className="text-slate-600 italic text-center mt-10">Hệ thống đang chờ lệnh...</div>
                            ) : (
                                apState.logs.map((log, idx) => {
                                    // Highlight màu tùy theo keyword để dễ đọc log
                                    let textColor = "text-slate-300";
                                    if (log.includes("--- BẮT ĐẦU")) textColor = "text-rose-400 font-bold";
                                    if (log.includes("✅")) textColor = "text-emerald-400 font-bold";
                                    if (log.includes("❌")) textColor = "text-red-400 font-bold";
                                    if (log.includes("Render")) textColor = "text-orange-300";
                                    
                                    return (
                                        <div key={idx} className={`border-b border-white/5 pb-1 ${textColor}`}>
                                            {log}
                                        </div>
                                    );
                                })
                            )}
                            {/* Auto scroll anchor */}
                            <div ref={(el) => { if(el) el.scrollIntoView({ behavior: "smooth" }) }}></div>
                        </div>

                        {apState.isRunning && (
                            <div className="p-4 bg-slate-900/80 border-t border-white/5 shrink-0 flex items-center gap-3">
                                <Loader2 size={18} className="text-rose-500 animate-spin shrink-0"/>
                                <div className="flex flex-col w-full">
                                    <span className="text-[10px] text-slate-400 font-bold">Chủ đề {apState.currentIndex + 1} / {apTopics.split('\n').filter(t=>t.trim()).length}</span>
                                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-1 overflow-hidden">
                                        <div 
                                            className="bg-rose-500 h-full transition-all duration-500" 
                                            style={{ width: `${(apState.currentIndex / Math.max(1, apTopics.split('\n').filter(t=>t.trim()).length)) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
         </div>
      )}

    </div>
  );
};

export default App;