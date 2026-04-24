// Server component — generates subject pages at build time for static export
import { lessonsIndex } from '@/data/lessons';
import SubjectClient from './SubjectClient';

export function generateStaticParams() {
  return Object.keys(lessonsIndex).map(subjectId => ({ subjectId }));
}

export default function Page() {
  return <SubjectClient />;
}
