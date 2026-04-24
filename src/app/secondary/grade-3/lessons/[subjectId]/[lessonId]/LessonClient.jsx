'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LessonPage from '@/components/lesson/LessonPage';
import { getLesson, getAdjacentLessons } from '@/data/lessons';
import Link from 'next/link';

// KaTeX CSS
import 'katex/dist/katex.min.css';

export default function LessonClient() {
  const params = useParams();
  const { subjectId, lessonId } = params;
  const [data, setData] = useState(null);

  useEffect(() => {
    const { subject, lesson } = getLesson(subjectId, lessonId);
    const { prev, next } = getAdjacentLessons(subjectId, lessonId);
    setData({ subject, lesson, prev, next });
  }, [subjectId, lessonId]);

  if (!data) return null;

  if (!data.lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-6xl mb-4">📚</p>
          <h2 className="text-2xl font-bold text-white mb-2">الدرس غير موجود</h2>
          <p className="text-slate-400 mb-6">لم يتم العثور على هذا الدرس</p>
          <Link href="/secondary/grade-3" className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors">
            العودة للمواد
          </Link>
        </div>
      </div>
    );
  }

  const basePath = '/secondary/grade-3/lessons';
  const prevUrl = data.prev ? `${basePath}/${subjectId}/${data.prev.id}` : null;
  const nextUrl = data.next ? `${basePath}/${subjectId}/${data.next.id}` : null;

  return (
    <LessonPage
      lesson={data.lesson}
      subject={{
        name: data.subject.name,
        icon: data.subject.icon,
        color: data.subject.color,
      }}
      backUrl={`/secondary/grade-3`}
      prevLessonUrl={prevUrl}
      nextLessonUrl={nextUrl}
    />
  );
}
