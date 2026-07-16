"use client";
import React, { useState } from 'react';
import { Sparkles, FileText, X } from 'lucide-react';
import ScriptModal from './ScriptModal';
import AiDirectorModal from './AiDirectorModal';

interface CombinedScriptModalProps {
    show: boolean;
    onClose: () => void;
    // Script Props
    scriptText: string; setScriptText: (v: string) => void;
    importMode: string; setImportMode: (v: string) => void;
    onImport: () => void;
    
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

    if (!p.show) return null;

    return (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-sm flex justify-center items-center p-4" onClick={p.onClose}>
            <div className="bg-slate-900 border border-slate-600/50 rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-2xl flex flex-col animate-in zoom-in-95" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b border-white/5 flex flex-col gap-4 bg-slate-800 shrink-0">
                    <div className="flex justify-between items-center">
                        <h2 className="font-black text-slate-100 tracking-widest flex items-center gap-2">
                            <FileText size={18}/> Kịch bản Đàm đạo
                        </h2>
                        <button onClick={p.onClose} className="p-2 bg-white/5 hover:bg-red-500/80 hover:text-white rounded-full transition-colors"><X size={16} /></button>
                    </div>
                    
                    {/* Hide tab selector per user request: manual script is hidden */}
                    {/*
                    <div className="flex gap-2 p-1 bg-black/20 rounded-lg w-fit">
                        <button 
                            onClick={() => setActiveTab('manual')}
                            className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'manual' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <FileText size={16}/> Kịch bản Thủ công
                        </button>
                        <button 
                            onClick={() => setActiveTab('ai')}
                            className={`px-6 py-2 rounded-md font-bold text-sm transition-all flex items-center gap-2 ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                        >
                            <Sparkles size={16}/> Đạo diễn AI
                        </button>
                    </div>
                    */}
                </div>
                
                {activeTab === 'manual' && (
                    <ScriptModal
                        show={true}
                        asTab={true}
                        onClose={() => {}}
                        scriptText={p.scriptText}
                        setScriptText={p.setScriptText}
                        importMode={p.importMode}
                        setImportMode={p.setImportMode}
                        onImport={p.onImport}
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
    );
};
export default CombinedScriptModal;
