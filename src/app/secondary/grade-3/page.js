'use client'
import Link from 'next/link'

export default function Grade3Page() {
  const subjects = [
    {
      id: 'biology',
      title: 'الأحياء',
      emoji: '🧬',
      color: 'from-emerald-600 to-emerald-800',
      labs: [
        { id: 'genetics', title: 'تجارب مندل في الوراثة', unit: 'الوحدة الثانية', ready: true },
      ],
    },
    {
      id: 'chemistry',
      title: 'الكيمياء',
      emoji: '🧪',
      color: 'from-purple-600 to-purple-800',
      labs: [
        { id: 'qualitative-analysis', title: 'التحليل الكيميائي الكيفي', unit: 'الوحدة الثالثة', ready: true },
      ],
    },
    {
      id: 'physics',
      title: 'الفيزياء',
      emoji: '⚛️',
      color: 'from-blue-600 to-blue-800',
      labs: [
        { id: 'gravity', title: 'المجال التثاقلي والحركة الدائرية', unit: 'الباب الأول', ready: true },
      ],
    },
    {
      id: 'math',
      title: 'الرياضيات',
      emoji: '📐',
      color: 'from-orange-600 to-orange-800',
      labs: [
        { id: 'differentiation', title: 'التفاضل', unit: 'الوحدة الثانية', ready: true },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-l from-indigo-700 via-indigo-800 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="text-indigo-300 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← الصفحة الرئيسية
          </Link>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الصف الثالث الثانوي</h1>
          <p className="text-indigo-200">المرحلة الثانوية — المعامل الافتراضية والمحاكاة التفاعلية</p>
        </div>
      </div>

      {/* Subjects */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="space-y-8">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-l ${subject.color} p-5 text-white flex items-center gap-3`}>
                <span className="text-3xl">{subject.emoji}</span>
                <h2 className="text-xl font-bold">{subject.title}</h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {subject.labs.map((lab) => (
                  lab.ready ? (
                    <Link
                      key={lab.id}
                      href={`/secondary/grade-3/${subject.id}/${lab.id}`}
                      className="block p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all"
                    >
                      <p className="text-xs text-gray-400 mb-1">{lab.unit}</p>
                      <p className="font-bold text-gray-800">{lab.title}</p>
                      <span className="text-emerald-600 text-sm mt-2 inline-block">ابدأ التجربة ←</span>
                    </Link>
                  ) : (
                    <div key={lab.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                      <p className="text-xs text-gray-400 mb-1">{lab.unit}</p>
                      <p className="font-bold text-gray-500">{lab.title}</p>
                      <span className="text-gray-400 text-sm mt-2 inline-block">قريباً</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
