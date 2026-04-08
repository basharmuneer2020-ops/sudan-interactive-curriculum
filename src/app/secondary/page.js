'use client'
import Link from 'next/link'

export default function SecondaryPage() {
  const grades = [
    { id: 'grade-1', title: 'الأول الثانوي', subjects: 10, emoji: '١', note: 'منهج موحد' },
    { id: 'grade-2', title: 'الثاني الثانوي', subjects: 8, emoji: '٢', note: 'علمي / أدبي' },
    { id: 'grade-3', title: 'الثالث الثانوي', subjects: 7, emoji: '٣', note: 'الشهادة السودانية', hasLabs: true },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <div className="bg-gradient-to-l from-purple-600 via-indigo-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="text-indigo-300 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← الصفحة الرئيسية
          </Link>
          <span className="text-5xl block mb-3">🏫</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">المرحلة الثانوية</h1>
          <p className="text-indigo-200">3 سنوات — التقسيم لعلمي/أدبي من الصف الثاني</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <div className="space-y-4">
          {grades.map((grade) => (
            <Link
              key={grade.id}
              href={`/secondary/${grade.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl shadow-lg border border-gray-100 p-5 hover:shadow-xl hover:border-indigo-200 transition-all"
            >
              <div className="w-14 h-14 bg-gradient-to-l from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <span className="text-xl text-white font-bold">{grade.emoji}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-800">{grade.title}</h3>
                <p className="text-sm text-gray-500">{grade.subjects} مادة — {grade.note}</p>
              </div>
              <div className="flex items-center gap-2">
                {grade.hasLabs && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-bold">4 معامل</span>
                )}
                <span className="text-indigo-600 font-bold">←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
