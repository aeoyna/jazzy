import React from 'react';
import { Search, ExternalLink, MessageSquare, HelpCircle, Shield, Mail, FileText, AlertTriangle } from 'lucide-react';

export const WelcomeCard: React.FC = () => {
    const infoLinks = [
        { label: '更新情報', icon: <ExternalLink size={14} /> },
        { label: '掲示板', icon: <MessageSquare size={14} /> },
        { label: 'FAQ', icon: <HelpCircle size={14} /> },
        { label: 'セキュリティ', icon: <Shield size={14} /> },
        { label: 'お問い合わせ', icon: <Mail size={14} /> },
        { label: '利用規約', icon: <FileText size={14} /> },
        { label: '障害情報', icon: <AlertTriangle size={14} /> },
    ];

    return (
        <div className="flex flex-col items-center justify-center min-h-[85dvh] p-4 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-[#2a2a2a] border border-zinc-800 rounded-xl p-6 w-full max-w-[340px] shadow-2xl">
                <h1 className="text-2xl font-bold text-white tracking-widest mb-6">JAM</h1>

                <div className="space-y-2 mb-6 text-white">
                    <p className="text-base font-medium tracking-tight">
                        左下の <Search className="inline-block w-4 h-4 mb-1 text-white" strokeWidth={3} /> アイコンから楽曲を
                    </p>
                    <p className="text-base font-medium tracking-tight">
                        検索・選択してください
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-6">
                    {infoLinks.map((link) => (
                        <button
                            key={link.label}
                            className="flex items-center gap-2 px-3 py-2 bg-zinc-800/50 hover:bg-zinc-700/50 border border-zinc-700/30 rounded-md text-[13px] text-zinc-300 transition-colors text-left"
                        >
                            <span className="text-zinc-500">{link.icon}</span>
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="w-full h-[1px] bg-zinc-800" />
            </div>
        </div>
    );
};
