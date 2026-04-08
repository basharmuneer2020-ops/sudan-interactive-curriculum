'use client'
import Link from 'next/link'

export default function Grade3Page() {
  const subjects = [
    {
      id: 'biology',
      title: 'الأحياء',
      emoji: '🧬',
      color: 'from-emerald-600 to-emerald-800',
      badgeColor: 'bg-emerald-100 text-emerald-700',
      chapters: [
        { num: '1', title: 'الوراثة الجزيئية', desc: 'DNA، التعبير الجيني، البروتين' },
        { num: '2', title: 'وراثة مندل الصفاتية', desc: 'قوانين مندل والتهجين' },
        { num: '3', title: 'التطور ونظرية دارون', desc: 'الانتخاب الطبيعي والتنوع' },
        { num: '4', title: 'التنوع البيولوجي والبيئة', desc: 'الأنظمة البيئية والتوازن' },
      ],
      labs: [
        { id: 'genetics', title: 'تجارب مندل في الوراثة', unit: 'الوحدة الثانية', ready: true },
      ],
    },
    {
      id: 'chemistry',
      title: 'الكيمياء',
      emoji: '🧪',
      color: 'from-purple-600 to-purple-800',
      badgeColor: 'bg-purple-100 text-purple-700',
      chapters: [
        { num: '1', title: 'الكيمياء العضوية المتقدمة', desc: 'هيدروكربونات، مجموعات وظيفية' },
        { num: '2', title: 'كيمياء الإشعاع والنظائر', desc: 'الانحلال الإشعاعي والتطبيقات' },
        { num: '3', title: 'التحليل الكيميائي الكيفي', desc: 'تعرف المواد عبر التفاعلات' },
        { num: '4', title: 'الكيمياء الصناعية والتطبيقية', desc: 'الصناعات الكيميائية في السودان' },
      ],
      labs: [
        { id: 'qualitative-analysis', title: 'التحليل الكيميائي الكيفي', unit: 'الوحدة الثالثة', ready: true },
      ],
    },
    {
      id: 'physics',
      title: 'الفيزياء',
      emoji: '⚛️',
      color: 'from-blue-600 to-blue-800',
      badgeColor: 'bg-blue-100 text-blue-700',
      chapters: [
        { num: '1', title: 'المجال التثاقلي والحركة الدائرية', desc: 'الجاذبية، حركة الأقمار' },
        { num: '2', title: 'الكهرومغناطيسية والمحاثة', desc: 'قانون فاراداي، المحثات' },
        { num: '3', title: 'الفيزياء النووية والإشعاع', desc: 'النواة الذرية والانحلال' },
        { num: '4', title: 'الإلكترونيات والدوائر الرقمية', desc: 'شبه الموصلات، الترانزستور' },
      ],
      labs: [
        { id: 'gravity', title: 'المجال التثاقلي والحركة الدائرية', unit: 'الباب الأول', ready: true },
      ],
    },
    {
      id: 'math',
      title: 'الرياضيات',
      emoji: '📐',
      color: 'from-orange-600 to-orange-800',
      badgeColor: 'bg-orange-100 text-orange-700',
      chapters: [
        { num: '1', title: 'حساب التكامل وتطبيقاته', desc: 'التكامل المحدود وغير المحدود، المساحات' },
        { num: '2', title: 'التفاضل وتطبيقاته', desc: 'المشتقات، التطرف، المماس والقاطع' },
        { num: '3', title: 'الأعداد المركبة والمتجهات', desc: 'الإحداثيات القطبية، العمليات المركبة' },
        { num: '4', title: 'المعادلات التفاضلية', desc: 'التعريف والأمثلة التطبيقية' },
        { num: '5', title: 'الإحصاء والتوزيعات', desc: 'التوزيع الطبيعي والاحتمالات' },
      ],
      labs: [
        { id: 'differentiation', title: 'التفاضل', unit: 'الوحدة الثانية', ready: true },
      ],
    },
  ]

  const coreSubjects = [
    { emoji: '📖', title: 'اللغة العربية', desc: 'المطالعة + النحو + البلاغة (3 كتب)' },
    { emoji: '🔤', title: 'اللغة الإنجليزية', desc: 'Reading, Writing, Literature' },
    { emoji: '🕌', title: 'التربية الدينية', desc: 'الدراسات الإسلامية أو المسيحية' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-l from-indigo-700 via-indigo-800 to-indigo-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/secondary" className="text-indigo-300 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← المرحلة الثانوية
          </Link>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">٣</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الصف الثالث الثانوي</h1>
          <p className="text-indigo-200 mb-2">الشهادة السودانية — SACE</p>
          <div className="flex justify-center gap-3 mt-3 flex-wrap">
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">7 مواد امتحانية</span>
            <span className="bg-emerald-500/80 px-3 py-1 rounded-full text-sm font-bold">4 معامل تفاعلية ✅</span>
          </div>
        </div>
      </div>

      {/* Core subjects bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <p className="text-xs text-gray-400 mb-3 font-bold">المواد الإلزامية لجميع الطلاب:</p>
          <div className="flex gap-3 flex-wrap">
            {coreSubjects.map((s, i) => (
              <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
                <span>{s.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-gray-700">{s.title}</p>
                  <p className="text-xs text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Science Subjects with Labs */}
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8">
          <h2 className="text-xl font-bold text-gray-800">المواد العلمية — المسار العلمي</h2>
          <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold">معامل افتراضية</span>
        </div>

        <div className="space-y-8">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Subject Header */}
              <div className={`bg-gradient-to-l ${subject.color} p-5 text-white`}>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold">{subject.title}</h2>
                    <p className="text-white/70 text-sm">{subject.chapters.length} أبواب/وحدات في المنهج</p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                {/* Chapters */}
                <div className="mb-5">
                  <p className="text-xs font-bold text-gray-500 mb-3">أبواب الكتاب:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {subject.chapters.map((ch) => (
                      <div key={ch.num} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                        <span className={`w-7 h-7 ${subject.badgeColor} rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                          {ch.num}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-700">{ch.title}</p>
                          <p className="text-xs text-gray-400">{ch.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Labs */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-3">المعامل التفاعلية:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

                    {/* Placeholder for upcoming labs */}
                    <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="text-xs text-amber-500 mb-1">🔮 قادم قريباً</p>
                      <p className="font-bold text-amber-700 text-sm">معامل إضافية من نفس الكتاب</p>
                      <span className="text-amber-500 text-xs mt-1 inline-block">نعمل على إضافة المزيد...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        <div className="mt-8 bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h3 className="font-bold text-indigo-800 mb-2">📌 عن الثالث الثانوي</h3>
          <p className="text-indigo-700 text-sm leading-relaxed">
            الشهادة السودانية للتعليم العام (SACE) تتطلب 7 مواد. الطالب يختار مجموعته من المواد العلمية أو الإنسانية. المعامل الأربعة المتاحة حالياً تغطي المواضيع الأهم في الفيزياء والكيمياء والأحياء والرياضيات. نعمل على إضافة معامل لبقية الأبواب.
          </p>
        </div>
      </div>
    </div>
  )
}
