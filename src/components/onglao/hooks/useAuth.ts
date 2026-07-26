import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  createChatSessionAction, 
  getChatSessionsAction 
} from "@/actions/chat";
import { updateUserProfileAction } from "@/actions/auth";
import { VOICE_STYLES } from '../constants';

interface UseAuthProps {
  setSessions?: (sessions: any) => void;
  setCurrentSessionId?: (id: any) => void;
  showToastMsg?: (msg: string, type?: string, duration?: number) => void;
  activeAudioRef?: React.MutableRefObject<HTMLAudioElement | null>;
}

export const useAuth = (props: Partial<UseAuthProps> = {}) => {
  const {
    setSessions,
    setCurrentSessionId,
    showToastMsg,
    activeAudioRef
  } = props;
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [publicAis, setPublicAis] = useState<any[]>([]);
  const [selectedAiConfigId, setSelectedAiConfigId] = useState<number | undefined>(undefined);
  const selectedAiConfigIdRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    selectedAiConfigIdRef.current = selectedAiConfigId;
  }, [selectedAiConfigId]);
  const [hasEntered, setHasEntered] = useState(false);
  const [isProfileCompleted, setIsProfileCompleted] = useState(false);
  const [userName, setUserName] = useState('');

  // --- STATE QUẢN LÝ GIỚI HẠN & THANH TOÁN (FREEMIUM) ---
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const [publicSettings, setPublicSettings] = useState<any>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [activationCode, setActivationCode] = useState('');
  const [activationError, setActivationError] = useState('');
  const [userGender, setUserGender] = useState('Nữ');
  const [userAge, setUserAge] = useState(25);
  const [appLanguage, setAppLanguage] = useState('Tiếng Việt');
  const [openDropdown, setOpenDropdown] = useState<any>(null);

  // --- STATE LƯU TRỮ TÊN FILE TẢI LÊN TỪ MÁY TÍNH ---
  const [localFileNames, setLocalFileNames] = useState({});

  const [userVoice, setUserVoice] = useState('');
  const [userVoiceStyle, setUserVoiceStyle] = useState('giọng thanh niên, phong cách đọc tỏ vẻ rối rắm, thắc mắc, chuẩn giọng miền Nam Việt Nam, đúng chính tả');
  
  // State quản lý tên, giọng, phong cách và XƯNG HÔ của Lão
  const [laoVoice, setLaoVoice] = useState('');
  const [laoVoiceStyle, setLaoVoiceStyle] = useState('Giọng ấm áp, mạnh mẽ, dứt khoát, miền nam việt nam, đúng chính tả, ngắt nhịp rõ ràng giữa các câu');
  
  const [customLaoName, setCustomLaoName] = useState('Lão'); // Tên hiển thị kịch bản
  const [laoSelfCall, setLaoSelfCall] = useState('Lão'); // Lão tự xưng là gì
  const [laoCallUser, setLaoCallUser] = useState('Con'); // Lão gọi người kia là gì

  const [customUserName, setCustomUserName] = useState('Con'); // Tên hiển thị kịch bản
  const [userSelfCall, setUserSelfCall] = useState('Con'); // Người hỏi tự xưng là gì
  const [userCallLao, setUserCallLao] = useState('Lão'); // Người hỏi gọi Lão là gì

  // Refs cho Giọng đọc và Xưng hô để Auto-Pilot bắt đúng khi Render ngầm
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
  // customUserName luôn mặc định là 'Con', không bị ghi đè bởi tên tài khoản đăng nhập (Giac Ngo)

  useEffect(() => {
    fetch('/api/settings/public')
      .then(res => res.json())
      .then(data => {
        setPublicSettings(data);
        if (data.defaultAiConfigId) {
          setSelectedAiConfigId(Number(data.defaultAiConfigId));
        }
        if (data.laoVoiceName) setLaoVoice(data.laoVoiceName);
        if (data.laoVoiceStyle) setLaoVoiceStyle(data.laoVoiceStyle);
        if (data.userVoiceName) setUserVoice(data.userVoiceName);
        if (data.userVoiceStyle) setUserVoiceStyle(data.userVoiceStyle);
      })
      .catch(err => console.error("Lỗi tải cấu hình công khai:", err));

    if (typeof window !== 'undefined') {
      setIsSubscribed(localStorage.getItem('onglao_subscribed') === 'true');
      setMsgCount(Number(localStorage.getItem('onglao_msg_count') || '0'));
    }
  }, []);

  // Firebase anonymous auth đã bị bỏ — dùng GiacNgo SSO (currentUser) làm duy nhất

  // --- LƯU TRỮ PROFILE NGƯỜI DÙNG ---
  const saveUserProfile = (userId?: string) => {
    const key = userId ? `onglao_profile_${userId}` : 'onglao_profile_guest';
    const completedKey = userId ? `onglao_profile_completed_${userId}` : 'onglao_profile_completed_guest';
    const profile = {
      userName,
      userGender,
      userAge,
      appLanguage,
      userVoice,
      userVoiceStyle,
      laoVoice,
      laoVoiceStyle,
      customLaoName,
      laoSelfCall,
      laoCallUser,
      customUserName,
      userSelfCall,
      userCallLao
    };
    localStorage.setItem(key, JSON.stringify(profile));
    localStorage.setItem(completedKey, 'true');
    setIsProfileCompleted(true);

    if (userId) {
      updateUserProfileAction(userId, profile).then((res) => {
        if (res.success) {
          console.log("Đã cập nhật profile vào database thành công.");
          setCurrentUser((prev: any) => {
            if (!prev) return null;
            const updated = {
              ...prev,
              profileCompleted: true,
              name: userName,
              userGender,
              userAge,
              appLanguage,
              userVoice,
              userVoiceStyle,
              laoVoice,
              laoVoiceStyle,
              customLaoName,
              laoSelfCall,
              laoCallUser,
              customUserName,
              userSelfCall,
              userCallLao
            };
            localStorage.setItem('onglao_user', JSON.stringify(updated));
            return updated;
          });
        } else {
          console.error("Lỗi khi lưu profile vào DB:", res.error);
        }
      });
    }
  };

  const loadUserProfile = (userId?: string, userObjFromAuth?: any) => {
    const key = userId ? `onglao_profile_${userId}` : 'onglao_profile_guest';
    const completedKey = userId ? `onglao_profile_completed_${userId}` : 'onglao_profile_completed_guest';
    
    const targetUser = userObjFromAuth || currentUser;
    const isCompleted = (localStorage.getItem(completedKey) === 'true') || (targetUser?.profileCompleted === true);
    
    if (isCompleted) {
      setIsProfileCompleted(true);
      
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const profile = JSON.parse(saved);
          if (profile.userName) setUserName(profile.userName);
          if (profile.userGender) setUserGender(profile.userGender);
          if (profile.userAge) setUserAge(Number(profile.userAge));
          if (profile.appLanguage) setAppLanguage(profile.appLanguage);
          if (profile.userVoice) setUserVoice(profile.userVoice);
          if (profile.userVoiceStyle) setUserVoiceStyle(profile.userVoiceStyle);
          if (profile.laoVoice) setLaoVoice(profile.laoVoice);
          if (profile.laoVoiceStyle) setLaoVoiceStyle(profile.laoVoiceStyle);
          if (profile.customLaoName) setCustomLaoName(profile.customLaoName);
          if (profile.laoSelfCall) setLaoSelfCall(profile.laoSelfCall);
          if (profile.laoCallUser) setLaoCallUser(profile.laoCallUser);
          if (profile.customUserName && profile.customUserName !== 'Giac Ngo') setCustomUserName(profile.customUserName);
          if (profile.userSelfCall) setUserSelfCall(profile.userSelfCall);
          if (profile.userCallLao) setUserCallLao(profile.userCallLao);
          return true;
        } catch (e) {
          console.error("Error loading user profile from localStorage:", e);
        }
      }
      
      if (targetUser && targetUser.profileCompleted) {
        if (targetUser.name) setUserName(targetUser.name);
        if (targetUser.userGender) setUserGender(targetUser.userGender);
        if (targetUser.userAge) setUserAge(Number(targetUser.userAge));
        if (targetUser.appLanguage) setAppLanguage(targetUser.appLanguage);
        if (targetUser.userVoice) setUserVoice(targetUser.userVoice);
        if (targetUser.userVoiceStyle) setUserVoiceStyle(targetUser.userVoiceStyle);
        if (targetUser.laoVoice) setLaoVoice(targetUser.laoVoice);
        if (targetUser.laoVoiceStyle) setLaoVoiceStyle(targetUser.laoVoiceStyle);
        if (targetUser.customLaoName) setCustomLaoName(targetUser.customLaoName);
        if (targetUser.laoSelfCall) setLaoSelfCall(targetUser.laoSelfCall);
        if (targetUser.laoCallUser) setLaoCallUser(targetUser.laoCallUser);
        if (targetUser.customUserName && targetUser.customUserName !== 'Giac Ngo') setCustomUserName(targetUser.customUserName);
        if (targetUser.userSelfCall) setUserSelfCall(targetUser.userSelfCall);
        if (targetUser.userCallLao) setUserCallLao(targetUser.userCallLao);
        
        const profile = {
          userName: targetUser.name,
          userGender: targetUser.userGender,
          userAge: targetUser.userAge,
          appLanguage: targetUser.appLanguage,
          userVoice: targetUser.userVoice,
          userVoiceStyle: targetUser.userVoiceStyle,
          laoVoice: targetUser.laoVoice,
          laoVoiceStyle: targetUser.laoVoiceStyle,
          customLaoName: targetUser.customLaoName,
          laoSelfCall: targetUser.laoSelfCall,
          laoCallUser: targetUser.laoCallUser,
          customUserName: targetUser.customUserName,
          userSelfCall: targetUser.userSelfCall,
          userCallLao: targetUser.userCallLao
        };
        localStorage.setItem(key, JSON.stringify(profile));
        localStorage.setItem(completedKey, 'true');
        return true;
      }
    }
    setIsProfileCompleted(false);
    return false;
  };

  // --- XÁC THỰC TÀI KHOẢN (GiacNgo SSO) ---
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const currentUserRef = useRef<any>(null);
  useEffect(() => { currentUserRef.current = currentUser; }, [currentUser]);

  useEffect(() => {
    const fetchPublicAis = async () => {
        const token = localStorage.getItem('onglao_token');
        try {
            const res = await fetch('/api/giacngo/public-ais', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data)) {
                    setPublicAis(data);
                    if (!selectedAiConfigId && data.length > 0) {
                        setSelectedAiConfigId(data[0].id);
                    }
                }
            }
        } catch (e) {
            console.error("Lỗi khi tải danh sách AI:", e);
        }
    };
    fetchPublicAis();
  }, [isLoggedIn]);

  // Khôi phục phiên đăng nhập từ localStorage khi khởi động
  useEffect(() => {
    const savedUser = localStorage.getItem('onglao_user');
    const savedToken = localStorage.getItem('onglao_token');
    if (savedUser && savedToken) {
      try {
        const userObj = JSON.parse(savedUser);
        setCurrentUser(userObj);
        setIsLoggedIn(true);
        currentUserRef.current = userObj;

        // Tải profile của tài khoản này
        const profileLoaded = loadUserProfile(userObj.id, userObj);
        if (profileLoaded) {
          setHasEntered(true);
        } else {
          setUserName(userObj.name || '');
          setHasEntered(false);
        }
      } catch {
        localStorage.removeItem('onglao_user');
        localStorage.removeItem('onglao_token');
      }
    } else {
      const profileLoaded = loadUserProfile();
      if (profileLoaded) {
        setHasEntered(true);
      }
    }
  }, []);

  // Tải danh sách đàm đạo từ PostgreSQL DB khi user mở trang hoặc đổi trạng thái đăng nhập
  const isFetchingSessionsRef = useRef<string | null>(null);
  
  useEffect(() => {
    const targetUserId = currentUser?.id || 'guest_user';
    
    const loadUserSessions = async () => {
      try {
        const fetchRes = await fetch(`/api/sessions?userId=${encodeURIComponent(targetUserId)}`);
        const res = await fetchRes.json().catch(() => ({ success: false }));
      
        if (res.success && res.data && res.data.length > 0) {
          const pinnedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('onglao_pinned_sessions') || '[]') : [];
          const dbSessions = res.data.map((s: any) => ({
            id: s.id,
            title: s.title || 'Cuộc đàm đạo',
            isPinned: pinnedIds.includes(s.id),
            messages: [],
            messageCount: s._count?.messages || 0,
            messagesLoaded: false,
            type: s.type || 'chat',
            createdAt: s.createdAt
          }));
          setSessions?.(dbSessions);
          setCurrentSessionId?.(dbSessions[0].id);
        } else {
          let defaultSession: any = null;
          try {
            const createRes = await createChatSessionAction(targetUserId !== 'guest_user' ? targetUserId : null, 'Cuộc đàm đạo 1');
            if (createRes.success && createRes.data) {
              const pinnedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('onglao_pinned_sessions') || '[]') : [];
              defaultSession = { id: createRes.data.id, title: createRes.data.title, isPinned: pinnedIds.includes(createRes.data.id), messages: [], messageCount: 0, messagesLoaded: true, createdAt: createRes.data.createdAt };
            }
          } catch (e) {
            console.warn("[useAuth] Không thể tạo session DB, dùng fallback local:", e);
          }

          if (!defaultSession) {
            defaultSession = {
              id: `session_${Date.now()}`,
              title: 'Cuộc đàm đạo 1',
              isPinned: false,
              messages: [],
              messageCount: 0,
              messagesLoaded: true,
              type: 'chat',
              createdAt: new Date().toISOString()
            };
          }
          setSessions?.([defaultSession]);
          setCurrentSessionId?.(defaultSession.id);
        }
      } catch (err) {
        console.error("=== useAuth loadUserSessions ERROR ===", err);
      }
    };
    loadUserSessions();
  }, [currentUser?.id]);

  const handleLogin = (loginUser: any, _token: string) => {
    setCurrentUser(loginUser);
    setIsLoggedIn(true);
    setIsProfileCompleted(true);
    setHasEntered(true);
    setShowAuthModal(false);
    currentUserRef.current = loginUser;

    const completedKey = loginUser?.id ? `onglao_profile_completed_${loginUser.id}` : 'onglao_profile_completed_guest';
    const profileKey = loginUser?.id ? `onglao_profile_${loginUser.id}` : 'onglao_profile_guest';
    localStorage.setItem(completedKey, 'true');

    if (!localStorage.getItem(profileKey)) {
      const defaultProfile = {
        userName: loginUser.name || 'Giac Ngo',
        userGender: loginUser.userGender || 'Nam',
        userAge: loginUser.userAge || 25,
        appLanguage: 'Tiếng Việt'
      };
      localStorage.setItem(profileKey, JSON.stringify(defaultProfile));
    }
    
    loadUserProfile(loginUser.id, loginUser);
    if (loginUser.name) setUserName(loginUser.name);
    
    if (activeAudioRef && !activeAudioRef.current) {
      activeAudioRef.current = new Audio();
      activeAudioRef.current.crossOrigin = "anonymous";
    }
    const playPromise = activeAudioRef?.current?.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        activeAudioRef?.current?.pause();
      }).catch(() => {});
    }

    showToastMsg?.(`Chào mừng trở lại, ${loginUser.name}!`, 'success', 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    setIsLoggedIn(false);
    currentUserRef.current = null;
    setSessions?.([]);
    setCurrentSessionId?.(null);
    setHasEntered(false);
    setIsProfileCompleted(false);
    setUserName('');
    setShowAuthModal(true);
    showToastMsg?.('Đã đăng xuất và xóa sạch bộ nhớ tạm.', 'info', 2000);
  };

  useEffect(() => {
      if (hasEntered || isProfileCompleted) return;
      
      if (!userVoice) {
        setUserVoice(userGender === 'Nam' ? 'Puck' : 'Kore');
      }

      let ageDesc = "giọng thanh niên";
      if (userAge <= 16) ageDesc = "giọng trẻ em";
      else if (userAge >= 17 && userAge <= 39) ageDesc = "giọng thanh niên";
      else if (userAge >= 40 && userAge <= 59) ageDesc = "giọng trung niên";
      else ageDesc = "giọng người già";

      let moodDesc = userGender === 'Nam' ? "tha thiết, khẩn cầu, thắc mắc" : "tỏ vẻ rối rắm, thắc mắc";
      setUserVoiceStyle(`${ageDesc}, phong cách đọc ${moodDesc}, chuẩn giọng miền Nam Việt Nam, đúng chính tả`);
  }, [userGender, userAge, hasEntered, isProfileCompleted]);

  const handleEnterApp = useCallback(() => {
    const targetUserId = currentUser?.id || null;
    saveUserProfile(targetUserId);
    setHasEntered(true);
    showToastMsg?.('Đã lưu thay đổi thông tin profile thành công!', 'success', 2000);
  }, [currentUser, saveUserProfile, showToastMsg]);

  // Alias user = currentUser để tương thích với code cũ dùng authState.user
  return {
    user: currentUser, setUser: setCurrentUser,
    isCloudSyncing, setIsCloudSyncing,
    hasEntered, setHasEntered,
    isProfileCompleted, setIsProfileCompleted,
    userName, setUserName,
    isSubscribed, setIsSubscribed,
    msgCount, setMsgCount,
    publicSettings, setPublicSettings,
    showPaymentModal, setShowPaymentModal,
    activationCode, setActivationCode,
    activationError, setActivationError,
    userGender, setUserGender,
    userAge, setUserAge,
    appLanguage, setAppLanguage,
    openDropdown, setOpenDropdown,
    localFileNames, setLocalFileNames,
    userVoice, setUserVoice,
    userVoiceStyle, setUserVoiceStyle,
    laoVoice, setLaoVoice,
    laoVoiceStyle, setLaoVoiceStyle,
    customLaoName, setCustomLaoName,
    laoSelfCall, setLaoSelfCall,
    laoCallUser, setLaoCallUser,
    customUserName, setCustomUserName,
    userSelfCall, setUserSelfCall,
    userCallLao, setUserCallLao,
    currentUser, setCurrentUser,
    isLoggedIn, setIsLoggedIn,
    showAuthModal, setShowAuthModal,
    currentUserRef,
    userVoiceRef,
    userVoiceStyleRef,
    laoVoiceRef,
    laoVoiceStyleRef,
    laoSelfCallRef,
    laoCallUserRef,
    userSelfCallRef,
    userCallLaoRef,
    saveUserProfile,
    loadUserProfile,
    handleEnterApp,
    handleLogin,
    handleLogout,
    publicAis, setPublicAis,
    selectedAiConfigId, setSelectedAiConfigId,
    selectedAiConfigIdRef
  };
};
