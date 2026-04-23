/**
 * فهرس الدروس — يربط كل مادة بدروسها
 */

// === الفيزياء ===
import physicsUnit1 from './physics/unit1-gravity.json';
import physicsUnit2 from './physics/unit2-circular-motion.json';

// === الكيمياء ===
import chemistryUnit1 from './chemistry/unit1-organic.json';

// === الأحياء ===
import biologyUnit1 from './biology/unit1-molecular-genetics.json';

// === الرياضيات المتخصصة ===
import mathDifferentiation from './specialized-mathematics/unit-differentiation.json';

// === اللغة العربية ===
import arabicUnit1 from './arabic/unit1-nahw.json';

// === اللغة الإنجليزية ===
import englishUnit1 from './english/unit1-grammar-writing.json';

// === التربية الإسلامية ===
import islamicUnit1 from './islamic-education/unit1-quran-tafsir.json';

// === الجغرافيا (أدبي) ===
import geographyUnit1 from './geography/unit1-physical-geography.json';

// === التاريخ (أدبي) ===
import historyUnit1 from './history/unit1-modern-sudan.json';

// === الرياضيات الأساسية (أدبي) ===
import basicMathUnit1 from './basic-mathematics/unit1-algebra-functions.json';

// === فهرس المواد ===
export const lessonsIndex = {
  // ─── المواد المشتركة (جميع الطلاب) ───
  arabic: {
    id: 'arabic',
    name: 'اللغة العربية',
    nameEn: 'Arabic Language',
    icon: '📖',
    color: '#C62828',
    track: 'common',
    lessons: [arabicUnit1],
  },
  english: {
    id: 'english',
    name: 'اللغة الإنجليزية',
    nameEn: 'English Language',
    icon: '🔤',
    color: '#1565C0',
    track: 'common',
    lessons: [englishUnit1],
  },
  'islamic-education': {
    id: 'islamic-education',
    name: 'التربية الإسلامية',
    nameEn: 'Islamic Education',
    icon: '🕌',
    color: '#00695C',
    track: 'common',
    lessons: [islamicUnit1],
  },

  // ─── المواد العلمية (المسار العلمي) ───
  physics: {
    id: 'physics',
    name: 'الفيزياء',
    nameEn: 'Physics',
    icon: '⚡',
    color: '#E65100',
    track: 'scientific-fixed',
    lessons: [physicsUnit1, physicsUnit2],
  },
  chemistry: {
    id: 'chemistry',
    name: 'الكيمياء',
    nameEn: 'Chemistry',
    icon: '🧪',
    color: '#6A1B9A',
    track: 'scientific-fixed',
    lessons: [chemistryUnit1],
  },
  biology: {
    id: 'biology',
    name: 'الأحياء',
    nameEn: 'Biology',
    icon: '🧬',
    color: '#2E7D32',
    track: 'scientific-7th',
    lessons: [biologyUnit1],
  },
  'specialized-mathematics': {
    id: 'specialized-mathematics',
    name: 'الرياضيات المتخصصة',
    nameEn: 'Specialized Mathematics',
    icon: '📐',
    color: '#4A148C',
    track: 'scientific-fixed',
    lessons: [mathDifferentiation],
  },

  // ─── المواد الأدبية (المسار الأدبي) ───
  geography: {
    id: 'geography',
    name: 'الجغرافيا',
    nameEn: 'Geography',
    icon: '🌍',
    color: '#33691E',
    track: 'literary',
    lessons: [geographyUnit1],
  },
  history: {
    id: 'history',
    name: 'التاريخ',
    nameEn: 'History',
    icon: '📜',
    color: '#4E342E',
    track: 'literary',
    lessons: [historyUnit1],
  },
  'basic-mathematics': {
    id: 'basic-mathematics',
    name: 'الرياضيات الأساسية',
    nameEn: 'Basic Mathematics',
    icon: '🔢',
    color: '#E65100',
    track: 'literary',
    lessons: [basicMathUnit1],
  },
};

export function getLesson(subjectId, lessonId) {
  const subject = lessonsIndex[subjectId];
  if (!subject) return { subject: null, lesson: null };
  const lesson = subject.lessons.find(l => l.id === lessonId);
  return { subject, lesson };
}

export function getSubjectLessons(subjectId) {
  return lessonsIndex[subjectId] || null;
}

export function getAdjacentLessons(subjectId, lessonId) {
  const subject = lessonsIndex[subjectId];
  if (!subject) return { prev: null, next: null };
  const idx = subject.lessons.findIndex(l => l.id === lessonId);
  return {
    prev: idx > 0 ? subject.lessons[idx - 1] : null,
    next: idx < subject.lessons.length - 1 ? subject.lessons[idx + 1] : null,
  };
}

export function getAllSubjects() {
  return Object.values(lessonsIndex);
}

export function getSubjectsByTrack(track) {
  return Object.values(lessonsIndex).filter(s => s.track === track);
}

export function getCommonSubjects() {
  return getSubjectsByTrack('common');
}
