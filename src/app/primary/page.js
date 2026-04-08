'use client'
import Link from 'next/link'

export default function PrimaryPage() {
  const grades = [
    { id: 'grade-1', title: 'الصف الأول', subjects: 5, emoji: '١' },
    { id: 'grade-2', title: 'الصف الثاني', subjects: 5, emoji: '٢' },
    { id: 'grade-3', title: 'الصف الثالث', subjects: 5, emoji: '٣' },
    { id: 'grade-4', title: 'الصف الرابع', subjects: 6, emoji: '٤' },
    { id: 'grade-5', title: 'الصف الخامس', subjects: 6, emoji: '٥' },
    { id: 'grade-6', title: 'الصف السادس', subjects: 9, emoji: '٦' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-gradient-to-l from-blue-500 via-cyan-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="text-blue-200 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← الصفحة الرئيسية
          </Link>
          <span className="text-5xl block mb-3">📚</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">المرحلة الابتدائية</h1>
          <p className="text-blue-100">الصفوف من الأول إلى السادس — أساس التعليم</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {grades.map((grade) => (
            <Link
              key={grade.id}
              href={`/primary/${grade.id}`}
              className="block bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-l from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white font-bold">{grade.emoji}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{grade.title}</h3>
                <p className="text-sm text-gray-500">{grade.subjects} مواد دراسية</p>
                <span className="inline-block mt-3 text-blue-600 text-sm font-bold">استعرض المواد ←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
