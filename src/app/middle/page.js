'use client'
import Link from 'next/link'

export default function MiddlePage() {
  const grades = [
    { id: 'grade-7', title: 'الصف السابع', subjects: 8, emoji: '٧' },
    { id: 'grade-8', title: 'الصف الثامن', subjects: 8, emoji: '٨' },
    { id: 'grade-9', title: 'الصف التاسع', subjects: 8, emoji: '٩' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <div className="bg-gradient-to-l from-emerald-500 via-teal-600 to-emerald-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="text-emerald-200 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← الصفحة الرئيسية
          </Link>
          <span className="text-5xl block mb-3">🎓</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">المرحلة المتوسطة</h1>
          <p className="text-emerald-100">الصفوف السابع والثامن والتاسع — منهج موحد لجميع الطلاب</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {grades.map((grade) => (
            <Link
              key={grade.id}
              href={`/middle/${grade.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-emerald-200 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-l from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-white font-bold">{grade.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{grade.title}</h3>
                <p className="text-sm text-gray-500">{grade.subjects} مواد دراسية</p>
              </div>
              <span className="text-emerald-600 font-bold">←</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
