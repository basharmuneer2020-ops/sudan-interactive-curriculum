'use client';
import { useState } from 'react';
import Link from 'next/link';
import { getAllAgents, trackLabels, trackOrder, getAgentsByTrack } from '@/lib/agents';

export default function TeachersPage() {
  const [selectedTrack, setSelectedTrack] = useState('all');
  const allAgents = getAllAgents();

  const filteredAgents = selectedTrack === 'all'
    ? allAgents
    : getAgentsByTrack(selectedTrack);

  const trackColors = {
    common: 'from-emerald-500 to-teal-600',
    'scientific-fixed': 'from-blue-500 to-indigo-600',
    'literary-fixed': 'from-amber-500 to-orange-600',
    'scientific-7th': 'from-purple-500 to-violet-600',
    'literary-7th': 'from-rose-500 to-pink-600',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" dir="rtl">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-300 transition-colors">
            <span className="text-2xl">🇸🇩</span>
            <span className="font-bold text-lg">المنهج السوداني التفاعلي</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span>17 معلم متصل</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            🎓 المعلم الافتراضي
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            اختر مادتك وتحدث مع معلم متخصص يعرف المنهج المعتمد وتوزيع الدرجات والمحذوفات ونصائح الامتحان
          </p>
        </div>

        {/* Track filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedTrack('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedTrack === 'all'
                ? 'bg-white text-slate-900 shadow-lg'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
            }`}
          >
            الكل ({allAgents.length})
          </button>
          {trackOrder.map(track => (
            <button
              key={track}
              onClick={() => setSelectedTrack(track)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedTrack === track
                  ? 'bg-white text-slate-900 shadow-lg'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
              }`}
            >
              {trackLabels[track]}
            </button>
          ))}
        </div>

        {/* Agents grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAgents.map(agent => {
            const track = agent.subjectId === 'arts-and-design' ? 'scientific-7th' :
              allAgents.indexOf(agent) < 3 ? 'common' :
              ['specialized-mathematics', 'physics', 'chemistry'].includes(agent.subjectId) ? 'scientific-fixed' :
              ['basic-mathematics', 'geography', 'history'].includes(agent.subjectId) ? 'literary-fixed' :
              ['biology', 'computer-science', 'engineering-sciences', 'home-science'].includes(agent.subjectId) ? 'scientific-7th' :
              'literary-7th';

            return (
              <Link
                key={agent.id}
                href={`/teachers/${agent.subjectId}`}
                className="group relative bg-slate-800/60 backdrop-blur rounded-2xl border border-slate-700/50 p-5 hover:border-slate-500/50 hover:bg-slate-700/60 transition-all duration-300 hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
              >
                {/* Track badge */}
                <div className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${trackColors[track] || 'from-gray-500 to-gray-600'}`}>
                  {trackLabels[track]?.replace('مواد ', '').replace('المسار ', '').replace(' — ثابتة', '').replace('المادة السابعة — ', '7: ')}
                </div>

                <div className="flex items-start gap-4 mt-4">
                  {/* Avatar */}
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                    style={{ backgroundColor: agent.color + '22', border: `2px solid ${agent.color}44` }}
                  >
                    {agent.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-base mb-1 group-hover:text-blue-300 transition-colors">
                      {agent.nameAr}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                      {agent.personality.substring(0, 80)}...
                    </p>
                  </div>
                </div>

                {/* Focus areas */}
                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.focusAreas.slice(0, 3).map((area, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-700/80 text-slate-300">
                      {area.split('(')[0].trim().substring(0, 25)}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-400 group-hover:text-blue-300">
                  <span>ابدأ المحادثة</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
