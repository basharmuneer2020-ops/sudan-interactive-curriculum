'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const [activeLabIndex, setActiveLabIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveLabIndex((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const stages = [
    {
      id: 'kindergarten',
      title: 'مرحلة الروضة',
      icon: '🌱',
      color: 'from-pink-500 to-rose-600',
      shadow: 'shadow-pink-200',
      desc: 'أساسيات التعلم للأطفال',
      grades: 'روضة',
      gradesCount: 1,
      subjectsCount: 5,
      subjects: ['العربية', 'الإنجليزية', 'الرياضيات', 'التربية الإسلامية', 'الفنية'],
      status: 'مفهرسة',
      hasLabs: false,
    },
    {
      id: 'primary',
      title: 'المرحلة الابتدائية',
      icon: '📚',
      color: 'from-blue-500 to-cyan-600',
      shadow: 'shadow-blue-200',
      desc: 'الصف الأول — السادس',
      grades: '6 صفوف',
      gradesCount: 6,
      subjectsCount: 36,
      subjects: ['العربية', 'الإنجليزية', 'الرياضيات', 'العلوم', 'التربية الإسلامية', 'أخرى'],
      status: 'مفهرسة',
      hasLabs: false,
    },
    {
      id: 'middle',
      title: 'المرحلة المتوسطة',
      icon: '🎓',
      color: 'from-emerald-500 to-teal-600',
      shadow: 'shadow-emerald-200',
      desc: 'الصف السابع — التاسع',
      grades: '3 صفوف',
      gradesCount: 3,
      subjectsCount: 24,
      subjects: ['العربية', 'الإنجليزية', 'الرياضيات', 'الفيزياء', 'الكيمياء', 'الأحياء', 'التاريخ', 'الحاسوب'],
      status: 'مفهرسة',
      hasLabs: false,
    },
    {
      id: 'secondary',
      title: 'المرحلة الثانوية',
      icon: '🏫',
      color: 'from-purple-600 to-indigo-700',
      shadow: 'shadow-purple-200',
      desc: 'الأول — الثالث ثانوي',
      grades: '3 صفوف',
      gradesCount: 3,
      subjectsCount: 35,
      subjects: ['الفيزياء', 'الكيمياء', 'الرياضيات', 'الأحياء', 'الإنجليزية', 'العربية'],
      status: 'معامل جاهزة',
      hasLabs: true,
      tracks: ['علمي أحياء', 'علمي هندسية', 'علمي حاسوب', 'أدبي'],
    },
  ]

  const labs = [
    {
      title: 'التحليل الكيميائي الكيفي',
      subject: 'الكيمياء',
      icon: '🧪',
      color: 'from-purple-500 to-violet-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      desc: 'تعرّف على الكشف عن الأيونات والأملاح بالتفاعلات اللونية',
      href: '/secondary/grade-3/chemistry/qualitative-analysis',
      chapter: 'الباب الثالث',
    },
    {
      title: 'المجال التثاقلي والجاذبية',
      subject: 'الفيزياء',
      icon: '⚛️',
      color: 'from-blue-500 to-sky-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      desc: 'محاكاة تفاعلية لقوانين نيوتن والحركة الدائرية',
      href: '/secondary/grade-3/physics/gravity',
      chapter: 'الباب الأول',
    },
    {
      title: 'التفاضل وتطبيقاته',
      subject: 'الرياضيات',
      icon: '📐',
      color: 'from-amber-500 to-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      desc: 'رسم بياني تفاعلي لفهم المشتقات والتكامل',
      href: '/secondary/grade-3/math/differentiation',
      chapter: 'الباب الثاني',
    },
    {
      title: 'تجارب مندل في الوراثة',
      subject: 'الأحياء',
      icon: '🧬',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      desc: 'محاكاة تهجين البازلاء واكتشاف قوانين الوراثة',
      href: '/secondary/grade-3/biology/genetics',
      chapter: 'الباب الثاني',
    },
  ]

  const features = [
    {
      icon: '🔬',
      title: 'معامل افتراضية',
      desc: 'تجارب تفاعلية ثلاثية الأبعاد تحاكي المعمل الحقيقي',
    },
    {
      icon: '📱',
      title: 'يعمل على أي جهاز',
      desc: 'متوافق مع الجوال والتابلت والكمبيوتر بدون تحميل',
    },
    {
      icon: '🆓',
      title: 'مجاني بالكامل',
      desc: 'صدقة جارية — لا إعلانات ولا اشتراكات',
    },
    {
      icon: '🌐',
      title: 'إنترنت ضعيف كفاية',
      desc: 'مُحسّن للعمل على شبكات بطيئة وأجهزة قديمة',
    },
    {
      icon: '📖',
      title: 'متوافق مع المنهج',
      desc: 'مبني على منهج المركز القومي للمناهج والبحث التربوي',
    },
    {
      icon: '🎮',
      title: 'تعلّم بالتجربة',
      desc: 'بدل الحفظ — شوف التفاعل بعينك وجرّب بإيدك',
    },
  ]

  const totalSubjects = stages.reduce((sum, s) => sum + s.subjectsCount, 0)
  const totalGrades = stages.reduce((sum, s) => sum + s.gradesCount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white" dir="rtl">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-bl from-slate-800 via-slate-900 to-slate-950 text-white">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-72 h-72 bg-emerald-500 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
          <div className="text-center">
            {/* Logo */}
            <div className={`flex justify-center mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="bg-white/10 backdrop-blur-md p-5 rounded-3xl border border-white/20 shadow-2xl">
                <span className="text-6xl block">🇸🇩</span>
              </div>
            </div>

            {/* Title */}
            <h1 className={`text-3xl md:text-5xl lg:text-6xl font-extrabold mb-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              المنهج السوداني التفاعلي
            </h1>

            {/* Subtitle */}
            <p className={`text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              منصة تعليمية تفاعلية مجانية شاملة لكل المراحل الدراسية
              <br />
              <span className="text-emerald-400 font-semibold">من الروضة وحتى الشهادة السودانية</span>
              <br />
              <span className="text-slate-400 text-base">معامل افتراضية ومحاكاة تفاعلية لمنهج وزارة التربية والتعليم</span>
            </p>

            {/* Subject pills */}
            <div className={`flex justify-center gap-3 flex-wrap mb-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {[
                { emoji: '🧪', name: 'الكيمياء', color: 'bg-purple-500/20 text-purple-300 border-purple-400/30' },
                { emoji: '⚛️', name: 'الفيزياء', color: 'bg-blue-500/20 text-blue-300 border-blue-400/30' },
                { emoji: '📐', name: 'الرياضيات', color: 'bg-orange-500/20 text-orange-300 border-orange-400/30' },
                { emoji: '🧬', name: 'الأحياء', color: 'bg-green-500/20 text-green-300 border-green-400/30' },
              ].map((s, i) => (
                <span key={i} className={`${s.color} px-5 py-2.5 rounded-full text-sm font-bold border backdrop-blur-sm`}>
                  {s.emoji} {s.name}
                </span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className={`flex justify-center gap-4 flex-wrap transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Link
                href="/secondary/grade-3"
                className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3.5 rounded-2xl font-bold text-lg transition-all hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/30"
              >
                جرّب المعامل التفاعلية ←
              </Link>
              <a
                href="#stages"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-2xl font-bold text-lg border border-white/20 transition-all hover:scale-105"
              >
                تصفّح المراحل
              </a>
            </div>

            {/* Quick features */}
            <div className={`flex justify-center gap-6 mt-8 flex-wrap text-sm text-slate-400 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <span className="flex items-center gap-1.5">📱 يعمل على الجوال</span>
              <span className="flex items-center gap-1.5">🆓 مجاني بالكامل</span>
              <span className="flex items-center gap-1.5">🌐 بدون إنترنت قوي</span>
              <span className="flex items-center gap-1.5">🔓 مفتوح المصدر</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'مرحلة دراسية', value: '4', emoji: '🏫', desc: 'روضة — ثانوي' },
            { label: 'صف دراسي', value: String(totalGrades), emoji: '📊', desc: 'بكل المراحل' },
            { label: 'مادة مفهرسة', value: `${totalSubjects}+`, emoji: '📖', desc: 'بالفصول والوحدات' },
            { label: 'معمل تفاعلي', value: '4+', emoji: '🔬', desc: 'والمزيد قيد الإنشاء' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 text-center hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <span className="text-3xl block mb-1">{stat.emoji}</span>
              <p className="text-3xl font-extrabold text-gray-800">{stat.value}</p>
              <p className="text-sm font-bold text-gray-600">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Labs Preview */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <span className="bg-emerald-100 text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full">متاحة الآن</span>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">المعامل التفاعلية</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">الصف الثالث الثانوي — الشهادة السودانية (SACE) — نماذج أولية والمزيد قادم</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {labs.map((lab, i) => (
            <Link
              key={i}
              href={lab.href}
              className={`group block ${lab.bgColor} border-2 ${lab.borderColor} rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1 ${activeLabIndex === i ? 'ring-2 ring-emerald-400 shadow-lg' : ''}`}
            >
              <div className="flex items-start gap-4">
                <div className={`bg-gradient-to-bl ${lab.color} w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-white shadow-md shrink-0`}>
                  {lab.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-gray-400">{lab.subject} • {lab.chapter}</span>
                    <span className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">تفاعلي</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 group-hover:text-gray-900">{lab.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{lab.desc}</p>
                </div>
                <span className="text-gray-300 group-hover:text-gray-500 text-xl transition-colors mt-2">←</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Study Stages */}
      <div id="stages" className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">اختر المرحلة الدراسية</h2>
            <p className="text-gray-500 mt-2">كل المراحل مفهرسة بالكامل — المعامل التفاعلية متاحة للثالث ثانوي حالياً</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stages.map((stage) => (
              <Link
                key={stage.id}
                href={`/${stage.id}`}
                className={`group block bg-white rounded-2xl shadow-lg ${stage.shadow} border border-gray-100 overflow-hidden hover:shadow-xl hover:scale-[1.02] transition-all`}
              >
                <div className={`bg-gradient-to-l ${stage.color} p-6 text-white`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-4xl block mb-2">{stage.icon}</span>
                      <h3 className="text-xl font-bold">{stage.title}</h3>
                      <p className="text-white/70 text-sm mt-1">{stage.desc}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-3xl font-extrabold">{stage.subjectsCount}</p>
                      <p className="text-white/60 text-xs">مادة</p>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  {/* Subjects preview */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {stage.subjects.slice(0, 5).map((sub, i) => (
                      <span key={i} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                        {sub}
                      </span>
                    ))}
                    {stage.subjects.length > 5 && (
                      <span className="bg-gray-100 text-gray-400 text-xs px-2.5 py-1 rounded-full">
                        +{stage.subjects.length - 5}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500">{stage.grades}</span>
                      {stage.tracks && (
                        <span className="text-xs text-gray-400">
                          ({stage.tracks.join(' • ')})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {stage.hasLabs ? (
                        <span className="bg-emerald-100 text-emerald-700 text-xs px-3 py-1 rounded-full font-bold animate-pulse-glow">
                          🔬 معامل متاحة
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-500 text-xs px-3 py-1 rounded-full font-bold">
                          📋 {stage.status}
                        </span>
                      )}
                      <span className="text-gray-300 group-hover:text-gray-500 font-bold transition-colors">←</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">ليه المنهج التفاعلي؟</h2>
          <p className="text-gray-500 mt-2">مدارس السودان بتفتقر للمعامل والأجهزة — نحن بنوفر البديل الرقمي المجاني</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
              <span className="text-4xl block mb-3">{f.icon}</span>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tracks Section (Secondary) */}
      <div className="bg-gradient-to-bl from-purple-50 to-indigo-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="bg-purple-100 text-purple-700 text-sm font-bold px-4 py-1.5 rounded-full">المرحلة الثانوية</span>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mt-4">المسارات الدراسية</h2>
            <p className="text-gray-500 mt-2">الصف الثاني والثالث ثانوي — اختر مسارك</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'علمي — أحياء', icon: '🧬', desc: 'فيزياء، كيمياء، أحياء، رياضيات', color: 'bg-blue-50 border-blue-200 text-blue-800' },
              { name: 'علمي — هندسية', icon: '⚙️', desc: 'فيزياء، كيمياء، رياضيات متقدمة، علوم هندسية', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
              { name: 'علمي — حاسوب', icon: '💻', desc: 'فيزياء، كيمياء، رياضيات، علوم حاسوب', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
              { name: 'المسار الأدبي', icon: '📝', desc: 'تاريخ، جغرافيا، لغات، أدب، علوم إسلامية', color: 'bg-amber-50 border-amber-200 text-amber-800' },
            ].map((track, i) => (
              <div key={i} className={`${track.color} border-2 rounded-2xl p-5 text-center hover:shadow-md transition-all`}>
                <span className="text-3xl block mb-2">{track.icon}</span>
                <h3 className="font-bold text-sm mb-1">{track.name}</h3>
                <p className="text-xs opacity-70">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gradient-to-l from-emerald-600 to-teal-700 rounded-3xl p-8 md:p-12 text-white text-center shadow-2xl shadow-emerald-200">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">ابدأ التعلّم الآن</h2>
          <p className="text-emerald-100 mb-6 max-w-xl mx-auto">
            بدأنا بالصف الثالث الثانوي — معامل تفاعلية في الكيمياء والفيزياء والرياضيات والأحياء، والمزيد قادم بإذن الله
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link
              href="/secondary/grade-3"
              className="bg-white text-emerald-700 px-8 py-3.5 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all hover:scale-105"
            >
              الثالث ثانوي — الشهادة ←
            </Link>
            <Link
              href="/secondary"
              className="bg-white/20 text-white px-8 py-3.5 rounded-2xl font-bold text-lg border border-white/30 hover:bg-white/30 transition-all hover:scale-105"
            >
              كل المرحلة الثانوية
            </Link>
          </div>
        </div>
      </div>

      {/* Roadmap / What's Coming */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">خارطة الطريق</h2>
            <p className="text-gray-500 mt-2">المشروع قيد التطوير المستمر — إليك ما أنجزناه وما هو قادم</p>
          </div>
          <div className="space-y-4">
            {[
              { phase: 'المرحلة 1', title: 'فهرسة كل المراحل + معامل الثالث ثانوي', status: 'done', statusText: 'مكتمل' },
              { phase: 'المرحلة 2', title: 'إضافة معامل للأول والثاني ثانوي + محتوى تفاعلي للمتوسطة', status: 'current', statusText: 'قيد التطوير' },
              { phase: 'المرحلة 3', title: 'محتوى تفاعلي لكل المراحل + نظام تقييم وألعاب تعليمية', status: 'upcoming', statusText: 'قادم' },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                  item.status === 'done'
                    ? 'bg-emerald-50 border-emerald-200'
                    : item.status === 'current'
                    ? 'bg-blue-50 border-blue-300 shadow-md'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 ${
                  item.status === 'done'
                    ? 'bg-emerald-500'
                    : item.status === 'current'
                    ? 'bg-blue-500 animate-pulse'
                    : 'bg-gray-300'
                }`}>
                  {item.status === 'done' ? '✓' : i + 1}
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-gray-400">{item.phase}</span>
                  <p className="font-bold text-gray-800">{item.title}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                  item.status === 'done'
                    ? 'bg-emerald-200 text-emerald-800'
                    : item.status === 'current'
                    ? 'bg-blue-200 text-blue-800'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {item.statusText}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-bl from-slate-800 via-slate-900 to-slate-950 text-slate-300 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="text-center md:text-right">
              <p className="font-extrabold text-white text-xl mb-2">🇸🇩 المنهج السوداني التفاعلي</p>
              <p className="text-emerald-400 text-sm">صدقة جارية لطلاب السودان</p>
              <p className="text-slate-500 text-xs mt-2">تعلّم بالتجربة... مش بالحفظ</p>
            </div>
            {/* Quick links */}
            <div className="text-center">
              <p className="font-bold text-white mb-3">روابط سريعة</p>
              <div className="flex flex-col gap-2 text-sm">
                <Link href="/secondary/grade-3" className="text-slate-400 hover:text-emerald-400 transition-colors">المعامل التفاعلية</Link>
                <Link href="/secondary" className="text-slate-400 hover:text-emerald-400 transition-colors">المرحلة الثانوية</Link>
                <Link href="/middle" className="text-slate-400 hover:text-emerald-400 transition-colors">المرحلة المتوسطة</Link>
                <Link href="/primary" className="text-slate-400 hover:text-emerald-400 transition-colors">المرحلة الابتدائية</Link>
              </div>
            </div>
            {/* Source */}
            <div className="text-center md:text-left">
              <p className="font-bold text-white mb-3">المصادر</p>
              <p className="text-slate-500 text-xs leading-relaxed">
                جميع المحتويات مبنية على منهج وزارة التربية والتعليم السودانية — المركز القومي للمناهج والبحث التربوي
              </p>
              <a
                href="https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum"
                className="inline-flex items-center gap-2 mt-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                GitHub ⭐ — مفتوح المصدر
              </a>
            </div>
          </div>
          <div className="border-t border-slate-700 pt-6 text-center">
            <p className="text-slate-500 text-xs">
              © {new Date().getFullYear()} المنهج السوداني التفاعلي — مشروع مجاني ومفتوح المصدر
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
