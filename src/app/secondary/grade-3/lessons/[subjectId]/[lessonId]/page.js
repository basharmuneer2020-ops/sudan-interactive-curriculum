// Server component — generates all lesson pages at build time for static export
import { lessonsIndex } from '@/data/lessons';
import LessonClient from './LessonClient';

export function generateStaticParams() {
  const params = [];
  for (const [subjectId, subject] of Object.entries(lessonsIndex)) {
    for (const lesson of subject.lessons) {
      params.push({ subjectId, lessonId: lesson.id });
    }
  }
  return params;
}

export default function Page() {
  return <LessonClient />;
}
