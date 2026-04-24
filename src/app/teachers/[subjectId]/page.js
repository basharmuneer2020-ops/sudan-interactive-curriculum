// Server component — generates teacher pages at build time for static export
import agentsData from '@/data/subject-agents.json';
import TeacherClient from './TeacherClient';

export function generateStaticParams() {
  return agentsData.agents.map(a => ({ subjectId: a.subjectId }));
}

export default function Page() {
  return <TeacherClient />;
}
