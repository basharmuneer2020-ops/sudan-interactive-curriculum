'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { RichText } from './MathRenderer';

/**
 * LessonPage — مكون الدرس الرئيسي
 * يعرض المحتوى التعليمي بشكل تفاعلي مع دعم المعادلات والاختبارات السريعة
 *
 * @param {Object} lesson — بيانات الدرس من JSON
 * @param {Object} subject — بيانات المادة (الاسم، اللون، الأيقونة)
 * @param {string} backUrl — رابط العودة
 * @param {string} nextLessonUrl — رابط الدرس التالي
 * @param {string} prevLessonUrl — رابط الدرس السابق
 */
export default function LessonPage({ lesson, subject, backUrl, nextLessonUrl, prevLessonUrl }) {
  const [activeSection, setActiveSection] = useState(0);
  const [completedSections, setCompletedSections] = useState(new Set());
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // حفظ التقدم في localStorage
  useEffect(() => {
    if (lesson?.id) {
      const saved = localStorage.getItem(`lesson-progress-${lesson.id}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCompletedSections(new Set(parsed.completed || []));
        } catch {}
      }
    }
  }, [lesson?.id]);

  useEffect(() => {
    if (lesson?.id && completedSections.size > 0) {
      localStorage.setItem(`lesson-progress-${lesson.id}`, JSON.stringify({
        completed: [...completedSections],
        lastVisit: new Date().toISOString(),
      }));
    }
  }, [completedSections, lesson?.id]);

  const markComplete = (idx) => {
    setCompletedSections(prev => new Set([...prev, idx]));
  };

  const progress = lesson?.sections ? Math.round((completedSections.size / lesson.sections.length) * 100) : 0;

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-slate-800 via-slate-900 to-slate-950 text-white">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link href={backUrl || '/secondary/grade-3'} className="text-slate-400 hover:text-white text-sm mb-3 inline-block transition-colors">
            ← العودة
          </Link>
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: (subject?.color || '#3B82F6') + '22', border: `2px solid ${subject?.color || '#3B82F6'}44` }}>
              {subject?.icon || '📖'}
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">{subject?.name || 'المادة'} — {lesson.unit || ''}</p>
              <h1 className="text-2xl font-bold mt-1">{lesson.title}</h1>
              {lesson.description && <p className="text-slate-300 text-sm mt-1">{lesson.description}</p>}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 bg-slate-700 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <span className="text-xs text-slate-400">{progress}%</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar — فهرس الأقسام */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-bold text-gray-400 mb-3">أقسام الدرس</p>
              <nav className="space-y-1">
                {lesson.sections?.map((sec, i) => (
                  <button
                    key={i}
                    onClick={() => { setActiveSection(i); setShowQuiz(false); }}
                    className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      activeSection === i && !showQuiz
                        ? 'bg-blue-50 text-blue-700 font-bold'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {completedSections.has(i) ? (
                      <span className="text-emerald-500 text-xs">✓</span>
                    ) : (
                      <span className="text-gray-300 text-xs">{i + 1}</span>
                    )}
                    <span className="truncate">{sec.title}</span>
                  </button>
                ))}
                {lesson.quiz && (
                  <button
                    onClick={() => setShowQuiz(true)}
                    className={`w-full text-right text-sm px-3 py-2 rounded-xl transition-all flex items-center gap-2 ${
                      showQuiz ? 'bg-amber-50 text-amber-700 font-bold' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-amber-500 text-xs">📝</span>
                    <span>اختبر نفسك</span>
                  </button>
                )}
              </nav>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            {!showQuiz ? (
              <LessonSection
                section={lesson.sections?.[activeSection]}
                index={activeSection}
                total={lesson.sections?.length || 0}
                completed={completedSections.has(activeSection)}
                onComplete={() => markComplete(activeSection)}
                onNext={() => {
                  if (activeSection < (lesson.sections?.length || 0) - 1) {
                    markComplete(activeSection);
                    setActiveSection(activeSection + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  } else if (lesson.quiz) {
                    markComplete(activeSection);
                    setShowQuiz(true);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                onPrev={() => {
                  if (activeSection > 0) {
                    setActiveSection(activeSection - 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }
                }}
                subjectColor={subject?.color}
              />
            ) : (
              <QuizSection
                quiz={lesson.quiz}
                answers={quizAnswers}
                setAnswers={setQuizAnswers}
                submitted={quizSubmitted}
                onSubmit={() => setQuizSubmitted(true)}
                onReset={() => { setQuizAnswers({}); setQuizSubmitted(false); }}
              />
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
              {prevLessonUrl ? (
                <Link href={prevLessonUrl} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                  → الدرس السابق
                </Link>
              ) : <div />}
              {nextLessonUrl ? (
                <Link href={nextLessonUrl} className="text-sm px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
                  الدرس التالي ←
                </Link>
              ) : <div />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}


// ==================== LESSON SECTION ====================
function LessonSection({ section, index, total, completed, onComplete, onNext, onPrev, subjectColor }) {
  if (!section) return null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Section header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-xs text-gray-400">القسم {index + 1} من {total}</p>
          <h2 className="text-lg font-bold text-gray-800 mt-0.5">{section.title}</h2>
        </div>
        {completed && <span className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold">مكتمل ✓</span>}
      </div>

      {/* Content blocks */}
      <div className="px-6 py-5 space-y-5">
        {section.blocks?.map((block, i) => (
          <ContentBlock key={i} block={block} subjectColor={subjectColor} />
        ))}
      </div>

      {/* Key points */}
      {section.keyPoints && (
        <div className="mx-6 mb-5 bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-sm font-bold text-blue-800 mb-2">النقاط الأساسية:</p>
          <ul className="space-y-1.5">
            {section.keyPoints.map((point, i) => (
              <li key={i} className="text-sm text-blue-700 flex gap-2">
                <span className="text-blue-400 mt-0.5">●</span>
                <RichText content={point} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Footer nav */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={index === 0}
          className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          → السابق
        </button>
        <button
          onClick={onNext}
          className="text-sm px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          {index === total - 1 ? 'اختبر نفسك 📝' : 'التالي ←'}
        </button>
      </div>
    </div>
  );
}


// ==================== CONTENT BLOCK ====================
function ContentBlock({ block, subjectColor }) {
  if (!block) return null;

  switch (block.type) {
    case 'text':
      return (
        <div className="text-gray-700 text-sm leading-[1.9]">
          <RichText content={block.content} />
        </div>
      );

    case 'heading':
      return (
        <h3 className="text-base font-bold text-gray-800 mt-2">
          <RichText content={block.content} />
        </h3>
      );

    case 'formula':
      return (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 my-3">
          {block.label && <p className="text-xs font-bold text-gray-500 mb-2">{block.label}</p>}
          <div className="text-center overflow-x-auto py-1" dir="ltr">
            <RichText content={`$$${block.content}$$`} />
          </div>
          {block.note && <p className="text-xs text-gray-400 mt-2 text-center">{block.note}</p>}
        </div>
      );

    case 'example':
      return (
        <div className="bg-emerald-50 border-r-4 border-emerald-500 rounded-lg p-4 my-3">
          <p className="text-xs font-bold text-emerald-700 mb-2">{block.label || 'مثال:'}</p>
          <div className="text-sm text-emerald-800 leading-[1.9]">
            <RichText content={block.content} />
          </div>
          {block.solution && (
            <div className="mt-3 pt-3 border-t border-emerald-200">
              <p className="text-xs font-bold text-emerald-600 mb-1">الحل:</p>
              <div className="text-sm text-emerald-800 leading-[1.9]">
                <RichText content={block.solution} />
              </div>
            </div>
          )}
        </div>
      );

    case 'warning':
      return (
        <div className="bg-red-50 border-r-4 border-red-400 rounded-lg p-4 my-3">
          <p className="text-xs font-bold text-red-700 mb-1">{block.label || 'تنبيه مهم:'}</p>
          <div className="text-sm text-red-700 leading-[1.9]">
            <RichText content={block.content} />
          </div>
        </div>
      );

    case 'tip':
      return (
        <div className="bg-amber-50 border-r-4 border-amber-400 rounded-lg p-4 my-3">
          <p className="text-xs font-bold text-amber-700 mb-1">{block.label || 'نصيحة:'}</p>
          <div className="text-sm text-amber-800 leading-[1.9]">
            <RichText content={block.content} />
          </div>
        </div>
      );

    case 'definition':
      return (
        <div className="bg-purple-50 border-r-4 border-purple-400 rounded-lg p-4 my-3">
          <p className="text-xs font-bold text-purple-700 mb-1">{block.label || 'تعريف:'}</p>
          <div className="text-sm text-purple-800 leading-[1.9]">
            <RichText content={block.content} />
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="overflow-x-auto my-3">
          {block.label && <p className="text-xs font-bold text-gray-500 mb-2">{block.label}</p>}
          <table className="w-full text-sm border-collapse">
            {block.headers && (
              <thead>
                <tr>
                  {block.headers.map((h, i) => (
                    <th key={i} className="bg-gray-100 text-gray-700 font-bold px-3 py-2 border border-gray-200 text-right">
                      <RichText content={h} />
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {block.rows?.map((row, ri) => (
                <tr key={ri}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-2 border border-gray-200 text-gray-700">
                      <RichText content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'image':
      return (
        <figure className="my-4 text-center">
          <div className="bg-gray-100 rounded-xl p-4 inline-block">
            <p className="text-gray-400 text-sm">[رسم توضيحي: {block.alt || block.content}]</p>
          </div>
          {block.caption && <figcaption className="text-xs text-gray-400 mt-2">{block.caption}</figcaption>}
        </figure>
      );

    case 'list':
      return (
        <ul className="space-y-1.5 my-3 mr-4">
          {block.items?.map((item, i) => (
            <li key={i} className="text-sm text-gray-700 flex gap-2 leading-[1.9]">
              <span className="text-gray-400 mt-0.5">{block.ordered ? `${i+1}.` : '●'}</span>
              <RichText content={item} />
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
}


// ==================== QUIZ SECTION ====================
function QuizSection({ quiz, answers, setAnswers, submitted, onSubmit, onReset }) {
  if (!quiz || !quiz.questions) return null;

  const score = submitted ? quiz.questions.reduce((s, q, i) => {
    return s + (answers[i] === q.correct ? 1 : 0);
  }, 0) : 0;

  const percentage = Math.round((score / quiz.questions.length) * 100);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 bg-amber-50">
        <h2 className="text-lg font-bold text-amber-800">📝 اختبر نفسك</h2>
        <p className="text-sm text-amber-600 mt-1">{quiz.questions.length} أسئلة — اختر الإجابة الصحيحة</p>
      </div>

      {submitted && (
        <div className={`px-6 py-4 text-center ${percentage >= 70 ? 'bg-emerald-50' : percentage >= 50 ? 'bg-amber-50' : 'bg-red-50'}`}>
          <p className="text-3xl font-bold" style={{ color: percentage >= 70 ? '#059669' : percentage >= 50 ? '#D97706' : '#DC2626' }}>
            {score}/{quiz.questions.length}
          </p>
          <p className="text-sm mt-1" style={{ color: percentage >= 70 ? '#065F46' : percentage >= 50 ? '#92400E' : '#991B1B' }}>
            {percentage >= 70 ? 'أحسنت! أداء ممتاز' : percentage >= 50 ? 'جيد، لكن تحتاج مراجعة' : 'تحتاج مراجعة الدرس مرة أخرى'}
          </p>
        </div>
      )}

      <div className="px-6 py-5 space-y-6">
        {quiz.questions.map((q, qi) => {
          const isCorrect = submitted && answers[qi] === q.correct;
          const isWrong = submitted && answers[qi] !== undefined && answers[qi] !== q.correct;

          return (
            <div key={qi} className={`rounded-xl p-4 ${submitted ? (isCorrect ? 'bg-emerald-50 border border-emerald-200' : isWrong ? 'bg-red-50 border border-red-200' : 'bg-gray-50 border border-gray-200') : 'bg-gray-50 border border-gray-200'}`}>
              <p className="text-sm font-bold text-gray-800 mb-3">
                <span className="text-gray-400 ml-2">{qi + 1}.</span>
                <RichText content={q.question} />
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi;
                  const isThisCorrect = submitted && oi === q.correct;

                  return (
                    <button
                      key={oi}
                      onClick={() => !submitted && setAnswers({ ...answers, [qi]: oi })}
                      disabled={submitted}
                      className={`w-full text-right text-sm px-4 py-2.5 rounded-lg border transition-all flex items-center gap-3 ${
                        submitted
                          ? isThisCorrect
                            ? 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold'
                            : isSelected && !isThisCorrect
                            ? 'bg-red-100 border-red-400 text-red-800'
                            : 'bg-white border-gray-200 text-gray-500'
                          : isSelected
                          ? 'bg-blue-50 border-blue-400 text-blue-800'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs shrink-0 ${
                        submitted && isThisCorrect ? 'border-emerald-500 bg-emerald-500 text-white' :
                        submitted && isSelected && !isThisCorrect ? 'border-red-500 bg-red-500 text-white' :
                        isSelected ? 'border-blue-500 bg-blue-500 text-white' :
                        'border-gray-300'
                      }`}>
                        {submitted && isThisCorrect ? '✓' : submitted && isSelected && !isThisCorrect ? '✕' : String.fromCharCode(1571 + oi)}
                      </span>
                      <RichText content={opt} />
                    </button>
                  );
                })}
              </div>
              {submitted && q.explanation && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs font-bold text-blue-700 mb-1">التفسير:</p>
                  <p className="text-xs text-blue-600 leading-relaxed"><RichText content={q.explanation} /></p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-center gap-3">
        {!submitted ? (
          <button
            onClick={onSubmit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            تسليم الإجابات
          </button>
        ) : (
          <button onClick={onReset} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors">
            أعد المحاولة
          </button>
        )}
      </div>
    </div>
  );
}
