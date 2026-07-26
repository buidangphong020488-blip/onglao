"use client";
import React, { useState, useRef } from 'react';
import { Sparkles, FileText, X, Home, ChevronLeft } from 'lucide-react';
import ScriptModal, { ScriptModalHandle } from './ScriptModal';
import AiDirectorModal from './AiDirectorModal';

interface CombinedScriptModalProps {
    show: boolean;
    onClose: () => void;
    // Script Props
    scriptText: string; setScriptText: (v: string) => void;
    importMode: string; setImportMode: (v: string) => void;
    onImport: () => void;
    publicSettings?: any;
    
    // AI Props
    isGenerating: boolean;
    appLanguage: string; setAppLanguage: (v: string) => void;
    customLaoName: string; setCustomLaoName: (v: string) => void;
    laoSelfCall: string; setLaoSelfCall: (v: string) => void;
    laoCallUser: string; setLaoCallUser: (v: string) => void;
    laoVoice: string; setLaoVoice: (v: string) => void;
    laoVoiceStyle: string; setLaoVoiceStyle: (v: string) => void;
    customUserName: string; setCustomUserName: (v: string) => void;
    userSelfCall: string; setUserSelfCall: (v: string) => void;
    userCallLao: string; setUserCallLao: (v: string) => void;
    userVoice: string; setUserVoice: (v: string) => void;
    userVoiceStyle: string; setUserVoiceStyle: (v: string) => void;
    aiTopicText: string; setAiTopicText: (v: string) => void;
    aiScriptLength: string; setAiScriptLength: (v: string) => void;
    aiLaoStyle: string; setAiLaoStyle: (v: string) => void;
    aiUserEmotionArc: string; setAiUserEmotionArc: (v: string) => void;
    aiScriptTitle: string; setAiScriptTitle: (v: string) => void;
    aiScriptDate: string; setAiScriptDate: (v: string) => void;
    onGenerate: (overrides?: { topic?: string; laoName?: string; laoSelf?: string; laoCallU?: string; userName?: string; userSelf?: string; userCallL?: string; }) => void;
    generatedScriptText?: string;
    setGeneratedScriptText?: (v: string) => void;
    onSaveGeneratedScript?: (overrides?: { scriptText?: string; laoName?: string; userName?: string }) => void;
}

const CombinedScriptModal = (p: CombinedScriptModalProps) => {
    const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('ai');
    const scriptModalRef = useRef<ScriptModalHandle>(null);

    const handleCloseModal = () => {
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('modal');
            url.searchParams.delete('scriptid');
            url.searchParams.delete('action');
            url.searchParams.delete('id');
            url.searchParams.delete('type');
            window.history.replaceState(null, '', url.toString());
        }
        if (typeof p.onClose === 'function') p.onClose();
    };

    if (!p.show) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-slate-950 flex flex-col w-full h-full min-h-screen overflow-hidden animate-in fade-in duration-300">
            {/* Header Trang Fullscreen */}
            <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-slate-900/90 backdrop-blur-md shrink-0 shadow-lg z-20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h1 className="font-black text-slate-100 tracking-wide text-base sm:text-lg">Kịch Bản Đàm Đạo AI</h1>
                        <p className="text-xs text-slate-400">Soạn kịch bản mới, cấu hình nhân vật và tạo đàm đạo</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => {
                            handleCloseModal();
                            window.location.href = '/?modal=ai-director';
                        }} 
                        className="px-3.5 py-2 bg-indigo-900/60 hover:bg-indigo-800 border border-indigo-500/30 text-indigo-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        title="Quay lại Danh sách Kịch bản"
                    >
                        <ChevronLeft size={16} /> Quay lại Kịch bản
                    </button>
                    <button 
                        onClick={() => {
                            handleCloseModal();
                            window.location.href = '/';
                        }} 
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md cursor-pointer"
                        title="Quay lại Thiền đường"
                    >
                        <Home size={15} /> Quay lại Thiền đường
                    </button>
                </div>
            </div>

            {/* Body Content - Fullscreen */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 flex flex-col max-w-5xl w-full mx-auto">
                <div className="bg-slate-900/80 border border-indigo-500/20 rounded-3xl p-5 md:p-8 shadow-2xl backdrop-blur-xl flex-1 flex flex-col gap-6">
                    {activeTab === 'manual' && (
                        <ScriptModal
                            ref={scriptModalRef}
                            show={true}
                            asTab={true}
                            onClose={() => {}}
                            scriptText={p.scriptText}
                            setScriptText={p.setScriptText}
                            importMode={p.importMode}
                            setImportMode={p.setImportMode}
                            onImport={() => {
                                const latest = scriptModalRef.current?.getLatestText();
                                if (latest !== undefined) p.setScriptText(latest);
                                p.onImport();
                            }}
                            publicSettings={p.publicSettings}
                        />
                    )}

                    {activeTab === 'ai' && (
                        <AiDirectorModal
                            show={true}
                            asTab={true}
                            onClose={() => {}}
                            isGenerating={p.isGenerating}
                            appLanguage={p.appLanguage} setAppLanguage={p.setAppLanguage}
                            customLaoName={p.customLaoName} setCustomLaoName={p.setCustomLaoName}
                            laoSelfCall={p.laoSelfCall} setLaoSelfCall={p.setLaoSelfCall}
                            laoCallUser={p.laoCallUser} setLaoCallUser={p.setLaoCallUser}
                            laoVoice={p.laoVoice} setLaoVoice={p.setLaoVoice}
                            laoVoiceStyle={p.laoVoiceStyle} setLaoVoiceStyle={p.setLaoVoiceStyle}
                            customUserName={p.customUserName} setCustomUserName={p.setCustomUserName}
                            userSelfCall={p.userSelfCall} setUserSelfCall={p.setUserSelfCall}
                            userCallLao={p.userCallLao} setUserCallLao={p.setUserCallLao}
                            userVoice={p.userVoice} setUserVoice={p.setUserVoice}
                            userVoiceStyle={p.userVoiceStyle} setUserVoiceStyle={p.setUserVoiceStyle}
                            aiTopicText={p.aiTopicText} setAiTopicText={p.setAiTopicText}
                            aiScriptLength={p.aiScriptLength} setAiScriptLength={p.setAiScriptLength}
                            aiLaoStyle={p.aiLaoStyle} setAiLaoStyle={p.setAiLaoStyle}
                            aiUserEmotionArc={p.aiUserEmotionArc} setAiUserEmotionArc={p.setAiUserEmotionArc}
                            aiScriptTitle={p.aiScriptTitle} setAiScriptTitle={p.setAiScriptTitle}
                            aiScriptDate={p.aiScriptDate} setAiScriptDate={p.setAiScriptDate}
                            onGenerate={p.onGenerate}
                            generatedScriptText={p.generatedScriptText}
                            setGeneratedScriptText={p.setGeneratedScriptText}
                            onSaveGeneratedScript={p.onSaveGeneratedScript}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
export default CombinedScriptModal;
