'use client'
import Link from 'next/link'

export default function Home() {
  const stages = [
    {
      id: 'secondary',
      title: 'المرحلة الثانوية',
      emoji: '🎓',
      color: 'from-indigo-600 to-indigo-800',
      grades: [
        { id: 'grade-3', title: 'الصف الثالث', ready: true },
        { id: 'grade-2', title: 'الصف الثاني', ready: false },
        { id: 'grade-1', title: 'الصف الأول', ready: false },
      ],
    },
    {
      id: 'middle',
      title: 'المرحلة المتوسطة',
      emoji: '📚',
      color: 'from-teal-600 to-teal-800',
      grades: [
        { id: 'grade-3', title: 'الصف الثالث', ready: false },
        { id: 'grade-2', title: 'الصف الثاني', ready: false },
        { id: 'grade-1', title: 'الصف الأول', ready: false },
      ],
    },
    {
      id: 'primary',
      title: 'المرحلة الأساسية',
      emoji: '✏️',
      color: 'from-amber-600 to-amber-800',
      grades: [],
    },
  ]

  const subjects = [
    { emoji: '🧪', name: 'الكيمياء', color: 'bg-purple-100 text-purple-700' },
    { emoji: '⚛️', name: 'الفيزياء', color: 'bg-blue-100 text-blue-700' },
    { emoji: '📐', name: 'الرياضيات', color: 'bg-orange-100 text-orange-700' },
    { emoji: '🧬', name: 'الأحياء', color: 'bg-green-100 text-green-700' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="bg-gradient-to-l from-slate-800 via-slate-900 to-slate-950 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-white bg-opacity-10 p-4 rounded-2xl backdrop-blur-sm">
              <span className="text-5xl">🇸🇩</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">
            المنهج السوداني التفاعلي
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6">
            منصة تعليمية تفاعلية مجانية — معامل افتراضية ومحاكاة تفاعلية
            لمنهج وزارة التربية والتعليم السودانية
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {subjects.map((s, i) => (
              <span key={i} className={`${s.color} px-4 py-2 rounded-full text-sm font-bold`}>
                {s.emoji} {s.name}
              </span>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-4 flex-wrap text-sm text-slate-400">
            <span>📱 يعمل على الجوال</span>
            <span>•</span>
            <span>🆓 مجاني بالكامل</span>
            <span>•</span>
            <span>🌐 بدون إنترنت قوي</span>
          </div>
        </div>
      </div>

      {/* Stages */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">اختر المرحلة الدراسية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stages.map((stage) => (
            <div key={stage.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className={`bg-gradient-to-l ${stage.color} p-6 text-white text-center`}>
                <span className="text-4xl block mb-2">{stage.emoji}</span>
                <h3 className="text-xl font-bold">{stage.title}</h3>
              </div>
              <div className="p-5 space-y-3">
                {stage.grades.length > 0 ? (
                  stage.grades.map((grade) => (
                    grade.ready ? (
                      <Link
                        key={grade.id}
                        href={`/${stage.id}/${grade.id}`}
                        className="block w-full text-center bg-gradient-to-l from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold hover:opacity-90 transition-all"
                      >
                        {grade.title} ←
                      </Link>
                    ) : (
                      <div
                        key={grade.id}
                        className="w-full text-center bg-gray-100 text-gray-400 py-3 rounded-xl font-bold"
                      >
                        {grade.title} — قريباً
                      </div>
                    )
                  ))
                ) : (
                  <div className="text-center text-gray-400 py-4">قريباً إن شاء الله</div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Content */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
          <h3 className="text-lg font-bold text-emerald-800 mb-2">المرحلة الأولى — متاحة الآن</h3>
          <p className="text-emerald-600 mb-4">الصف الثالث الثانوي: 4 معامل افتراضية في الكيمياء والفيزياء والرياضيات والأحياء</p>
          <Link
            href="/secondary/grade-3"
            className="inline-block bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            ابدأ التعلّم ←
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4 text-center">
        <p className="font-bold text-white text-lg">المنهج السوداني التفاعلي 🇸🇩</p>
        <p className="text-emerald-400 text-sm mt-2">صدقة جارية لطلاب السودان</p>
        <p className="text-slate-500 text-xs mt-2">
          جميع المحتويات مبنية على منهج وزارة التربية والتعليم — المركز القومي للمناهج والبحث التربوي
        </p>
        <div className="mt-4 flex justify-center gap-4 text-sm">
          <a href="https://github.com/your-username/sudan-interactive-curriculum" className="text-slate-400 hover:text-white transition-colors">
            GitHub ⭐
          </a>
        </div>
      </footer>
    </div>
  )
}
