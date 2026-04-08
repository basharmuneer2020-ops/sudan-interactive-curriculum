'use client'
import Link from 'next/link'

export default function Grade2SecondaryPage() {
  const commonSubjects = [
    {
      id: "arabic-lit",
      title: "المطالعة والأدب",
      emoji: "📖",
      desc: "الأدب الحديث، الشعر المعاصر، فن الرواية، الأدب السوداني",
      units: "5 أبواب"
    },
    {
      id: "rhetoric",
      title: "البلاغة والتعبير",
      emoji: "✍️",
      desc: "علم البيان (تشبيه، استعارة، كناية)، علم المعاني، البديع",
      units: "4 فصول"
    },
    {
      id: "english",
      title: "اللغة الإنجليزية",
      emoji: "🔤",
      desc: "Global Issues, Literature & Arts, Science & Discovery, Academic Writing",
      units: "5 وحدات"
    },
    {
      id: "math",
      title: "الرياضيات",
      emoji: "📐",
      desc: "الحساب المتجهي، التفاضل والتكامل، المصفوفات، الهندسة، الإحصاء",
      units: "5 وحدات"
    },
    {
      id: "islamic",
      title: "الدراسات الإسلامية",
      emoji: "🕌",
      desc: "الفقه المقارن، الاقتصاد الإسلامي، الحضارة الإسلامية",
      units: "4 أبواب"
    },
    {
      id: "quran",
      title: "القرآن الكريم وعلومه",
      emoji: "📿",
      desc: "حفظ وتجويد متقدم، تفسير موضوعي",
      units: "3 أقسام"
    },
  ]

  const scienceSubjects = [
    {
      id: "physics",
      title: "الفيزياء",
      emoji: "⚡",
      desc: "الديناميكا المتقدمة، الكهرومغناطيسية، التيار المتردد، الفيزياء الحرارية، الذرية",
      units: "5 وحدات",
      highlight: "الوحدة 2: الكهرباء والمغناطيسية"
    },
    {
      id: "chemistry",
      title: "الكيمياء",
      emoji: "🧪",
      desc: "الكيمياء العضوية، الهيدروكربونات، المركبات الأكسجينية، الكيمياء الحيوية",
      units: "5 وحدات",
      highlight: "الوحدة 2: الهيدروكربونات 3D"
    },
    {
      id: "biology",
      title: "الأحياء",
      emoji: "🧬",
      desc: "الوراثة الجزيئية، الوراثة الصفاتية، الجهاز الدفاعي، الجهاز العصبي، البيئة",
      units: "5 وحدات",
      highlight: "الوحدة 1: DNA والتعبير الجيني"
    },
  ]

  const humanitiesSubjects = [
    {
      id: "history",
      title: "التاريخ",
      emoji: "📜",
      desc: "تاريخ أفريقيا الحديث، الثورات العالمية، الحرب العالمية، استقلال السودان",
      units: "4 أبواب"
    },
    {
      id: "geography",
      title: "الجغرافيا والدراسات البيئية",
      emoji: "🌍",
      desc: "الجغرافيا الاقتصادية، موارد السودان، التنمية البشرية، التغير المناخي",
      units: "4 فصول"
    },
    {
      id: "french",
      title: "اللغة الفرنسية",
      emoji: "🇫🇷",
      desc: "La vie quotidienne, Culture et arts, Société contemporaine",
      units: "4 وحدات"
    },
  ]

  const otherElectives = [
    { id: "cs", title: "علوم الحاسوب", emoji: "💻", desc: "البرمجة المتقدمة، قواعد البيانات" },
    { id: "engineering", title: "أساسيات العلوم الهندسية", emoji: "⚙️", desc: "تصميم وهندسة تطبيقية" },
    { id: "home-science", title: "العلوم الأسرية", emoji: "🏠", desc: "علوم تطبيقية أسرية" },
    { id: "arts", title: "الفنون والتصميم", emoji: "🎨", desc: "فنون بصرية وتصميم جرافيك" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-purple-600 via-indigo-700 to-indigo-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/secondary" className="text-white/70 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← المرحلة الثانوية
          </Link>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold">٢</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الثاني الثانوي</h1>
          <p className="text-indigo-200 mb-2">مسارات متخصصة — علمي / أدبي / هندسي / حاسوبي</p>
          <p className="text-white/60 text-sm">مواد مشتركة + تخصصات حسب المسار</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Tracks Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "المسار العلمي", emoji: "🔬", color: "bg-blue-50 border-blue-200 text-blue-700" },
            { label: "المسار الأدبي", emoji: "📚", color: "bg-amber-50 border-amber-200 text-amber-700" },
            { label: "المسار الهندسي", emoji: "⚙️", color: "bg-gray-50 border-gray-200 text-gray-700" },
            { label: "مسار الحاسوب", emoji: "💻", color: "bg-emerald-50 border-emerald-200 text-emerald-700" },
          ].map((track, i) => (
            <div key={i} className={`${track.color} border rounded-xl p-3 text-center`}>
              <span className="text-2xl block mb-1">{track.emoji}</span>
              <p className="text-xs font-bold">{track.label}</p>
            </div>
          ))}
        </div>

        {/* Common Subjects */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-slate-100 rounded-xl px-4 py-2">
              <span className="text-slate-600 font-bold text-sm">📋 المواد المشتركة لجميع المسارات</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {commonSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{subject.units}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{subject.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Science Track */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-blue-50 rounded-xl px-4 py-2">
              <span className="text-blue-700 font-bold text-sm">🔬 المسار العلمي</span>
            </div>
            <span className="text-gray-400 text-sm">فيزياء + كيمياء + أحياء</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scienceSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-blue-100 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{subject.units}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{subject.desc}</p>
                <div className="bg-blue-50 rounded-lg p-2 text-xs text-blue-700">
                  🎯 {subject.highlight}
                </div>
                <div className="mt-3">
                  <span className="inline-block bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                    🔬 معمل قادم
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Humanities Track */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-amber-50 rounded-xl px-4 py-2">
              <span className="text-amber-700 font-bold text-sm">📚 المسار الأدبي</span>
            </div>
            <span className="text-gray-400 text-sm">التاريخ + الجغرافيا + اللغات</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {humanitiesSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-amber-100 p-5 opacity-85">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">{subject.units}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{subject.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Other Tracks */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-gray-100 rounded-xl px-4 py-2">
              <span className="text-gray-600 font-bold text-sm">🛠️ مسارات أخرى</span>
            </div>
            <span className="text-gray-400 text-sm">هندسي، حاسوب، أسري، فنون</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {otherElectives.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-4 text-center opacity-75">
                <span className="text-3xl block mb-2">{subject.emoji}</span>
                <h3 className="font-bold text-gray-800 text-sm mb-1">{subject.title}</h3>
                <p className="text-xs text-gray-400">{subject.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-5">
          <h3 className="font-bold text-purple-800 mb-2">📌 عن الثاني الثانوي</h3>
          <p className="text-purple-700 text-sm leading-relaxed">
            في الثاني الثانوي يختار الطالب مساره الدراسي نهائياً. المسار العلمي يؤهل لدراسة الطب والهندسة والعلوم في الجامعة. المعامل التفاعلية ستبدأ بالكهرومغناطيسية والكيمياء العضوية — المواضيع الأصعب في هذا الصف.
          </p>
        </div>
      </div>
    </div>
  )
}
