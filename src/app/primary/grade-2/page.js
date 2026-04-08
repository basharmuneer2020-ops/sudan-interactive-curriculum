'use client'
import Link from 'next/link'

export default function grade2Page() {
  const subjects = [
    { id: "arabic", title: "اللغة العربية", emoji: "📝" },
    { id: "english", title: "اللغة الإنجليزية", emoji: "🔤" },
    { id: "math", title: "الرياضيات", emoji: "🔢" },
    { id: "science", title: "العلوم", emoji: "🔬" },
    { id: "islamic", title: "التربية الإسلامية", emoji: "🕌" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="bg-gradient-to-l from-blue-500 via-cyan-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/primary" className="text-white/70 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← المرحلة الابتدائية
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الصف الثاني</h1>
          <p className="text-white/70">المرحلة الابتدائية — المواد الدراسية</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 text-center opacity-75">
              <span className="text-3xl block mb-2">{subject.emoji}</span>
              <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
              <span className="inline-block bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold">
                قريباً
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
