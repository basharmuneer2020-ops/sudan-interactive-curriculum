'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getSubjectLessons } from '@/data/lessons';

export default function SubjectLessonsPage() {
  const params = useParams();
  const { subjectId } = params;
  const [subject, setSubject] = useState(null);

  useEffect(() => {
    setSubject(getSubjectLessons(subjectId));
  }, [subjectId]);

  if (!subject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-6xl mb-4">📚</p>
          <h2 className="text-2xl font-bold text-white mb-2">المادة غير متاحة بعد</h2>
          <p className="text-slate-400 mb-6">نعمل على إضافة دروس هذه المادة قريباً</p>
          <Link href="/secondary/grade-3" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            العودة للمواد
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-slate-800 via-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Link href="/secondary/grade-3" className="text-slate-400 hover:text-white text-sm mb-3 inline-block transition-colors">
            ← الثالث ثانوي
          </Link>
          <div className="flex items-center gap-4 mt-2">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: subject.color + '22', border: `2px solid ${subject.color}44` }}>
              {subject.icon}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{subject.name}</h1>
              <p className="text-slate-400 text-sm mt-1">{subject.lessons.length} دروس متاحة — الشهادة السودانية</p>
            </div>
          </div>
        </div>
      </div>

      {/* Lessons list */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {subject.lessons.map((lesson, i) => {
            const progress = (() => {
              try {
                const saved = localStorage.getItem(`lesson-progress-${lesson.id}`);
                if (saved) {
                  const p = JSON.parse(saved);
                  return Math.round(((p.completed?.length || 0) / (lesson.sections?.length || 1)) * 100);
                }
              } catch {}
              return 0;
            })();

            return (
              <Link
                key={lesson.id}
                href={`/secondary/grade-3/lessons/${subjectId}/${lesson.id}`}
                className="block bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <div className="flex items-stretch">
                  {/* Number badge */}
                  <div className="w-16 flex items-center justify-center shrink-0"
                    style={{ backgroundColor: subject.color + '11' }}>
                    <span className="text-2xl font-bold" style={{ color: subject.color }}>{i + 1}</span>
                  </div>

                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">{lesson.unit} — صفحات {lesson.pages || ''}</p>
                        <h3 className="font-bold text-gray-800">{lesson.title}</h3>
                        {lesson.description && <p className="text-sm text-gray-500 mt-1">{lesson.description}</p>}
                      </div>
                      <div className="text-left shrink-0">
                        {lesson.examWeight && (
                          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-bold">
                            {lesson.examWeight}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progress + metadata */}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex-1">
                        <div className="bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: subject.color }} />
                        </div>
                      </div>
                      <span className="text-xs text-gray-400">{lesson.sections?.length || 0} أقسام</span>
                      {lesson.quiz && <span className="text-xs text-amber-600">📝 اختبار</span>}
                      {progress > 0 && <span className="text-xs font-bold" style={{ color: subject.color }}>{progress}%</span>}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="w-10 flex items-center justify-center text-gray-300">
                    ←
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Teacher link */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-5 flex items-center gap-4">
          <span className="text-3xl">🤖</span>
          <div className="flex-1">
            <p className="font-bold text-blue-800">عندك سؤال في المادة؟</p>
            <p className="text-sm text-blue-600">اسأل المعلم الافتراضي — متخصص في {subject.name} ويعرف المنهج كاملاً</p>
          </div>
          <Link href={`/teachers/${subjectId}`} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors shrink-0">
            اسأل المعلم ←
          </Link>
        </div>
      </div>
    </div>
  );
}
