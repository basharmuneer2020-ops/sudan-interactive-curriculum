'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { getAgent, buildSystemPrompt } from '@/lib/agents';
import ChatInterface from '@/components/chat/ChatInterface';

export default function SubjectChatPage() {
  const params = useParams();
  const subjectId = params.subjectId;
  const [agent, setAgent] = useState(null);
  const [systemPrompt, setSystemPrompt] = useState('');
  const [showInfo, setShowInfo] = useState(false);

  useEffect(() => {
    const a = getAgent(subjectId);
    if (a) {
      setAgent(a);
      setSystemPrompt(buildSystemPrompt(a));
    }
  }, [subjectId]);

  if (!agent) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-6xl mb-4">🔍</p>
          <h2 className="text-2xl font-bold text-white mb-2">المادة غير موجودة</h2>
          <p className="text-slate-400 mb-6">لم يتم العثور على معلم لهذه المادة</p>
          <Link href="/teachers" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            العودة لقائمة المعلمين
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/teachers" className="text-slate-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ backgroundColor: agent.color + '22', border: `2px solid ${agent.color}44` }}
            >
              {agent.avatar}
            </div>
            <div>
              <h1 className="text-white font-bold text-sm">{agent.nameAr}</h1>
              <p className="text-slate-400 text-xs">{agent.nameEn}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                showInfo
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {showInfo ? 'إخفاء المعلومات' : 'معلومات المادة'}
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Chat area */}
        <main className={`flex-1 transition-all duration-300 ${showInfo ? 'lg:ml-80' : ''}`}>
          <div className="p-4">
            <ChatInterface agent={agent} systemPrompt={systemPrompt} />
          </div>
        </main>

        {/* Info sidebar */}
        {showInfo && (
          <aside className="hidden lg:block w-80 border-r border-slate-700/50 bg-slate-800/50 p-5 overflow-y-auto h-[calc(100vh-60px)] sticky top-[60px]">
            {/* Agent info */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: agent.color + '22', border: `2px solid ${agent.color}44` }}
                >
                  {agent.avatar}
                </div>
                <div>
                  <h2 className="text-white font-bold">{agent.nameAr}</h2>
                  <p className="text-slate-400 text-xs">{agent.nameEn}</p>
                </div>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">{agent.personality}</p>
            </div>

            {/* Exam strategy */}
            {agent.examStrategy && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <span>📋</span> استراتيجية الامتحان
                </h3>
                {typeof agent.examStrategy === 'string' ? (
                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-700/40 rounded-xl p-3">
                    {agent.examStrategy}
                  </p>
                ) : (
                  <ul className="space-y-1.5">
                    {agent.examStrategy.map((tip, i) => (
                      <li key={i} className="text-slate-300 text-xs leading-relaxed flex gap-2">
                        <span className="text-blue-400 mt-0.5">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Focus areas */}
            {agent.focusAreas && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <span>🎯</span> مجالات التركيز
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {agent.focusAreas.map((area, i) => (
                    <span key={i} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-700/80 text-slate-300">
                      {area.split('(')[0].trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Deleted topics */}
            {agent.deletedTopics && agent.deletedTopics.length > 0 && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                  <span>🚫</span> المحتوى المحذوف
                </h3>
                <div className="bg-red-900/20 border border-red-800/30 rounded-xl p-3">
                  <ul className="space-y-1">
                    {agent.deletedTopics.map((topic, i) => (
                      <li key={i} className="text-red-300 text-xs flex gap-2">
                        <span>✕</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
