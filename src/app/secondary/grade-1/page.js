'use client'
import Link from 'next/link'

export default function Grade1SecondaryPage() {
  const commonSubjects = [
    {
      id: "arabic-lit",
      title: "المطالعة والأدب",
      emoji: "📖",
      desc: "أدب جاهلي، إسلامي، أموي، أدب سوداني حديث",
      units: "5 أبواب",
      track: "مشترك"
    },
    {
      id: "arabic-grammar",
      title: "قواعد النحو",
      emoji: "✍️",
      desc: "المبتدأ والخبر، النواسخ، الفاعل، المفاعيل والتوابع",
      units: "5 أبواب",
      track: "مشترك"
    },
    {
      id: "english",
      title: "اللغة الإنجليزية",
      emoji: "🔤",
      desc: "People & Society, Science, Environment, Health, Culture",
      units: "5 وحدات",
      track: "مشترك"
    },
    {
      id: "math",
      title: "الرياضيات",
      emoji: "📐",
      desc: "المجموعات، الدوال، المتتاليات، الأعداد المركبة، المثلثات، الإحصاء",
      units: "7 وحدات",
      track: "مشترك"
    },
    {
      id: "islamic",
      title: "الدراسات الإسلامية",
      emoji: "🕌",
      desc: "العقيدة، الفقه والعبادات، السيرة النبوية، الأخلاق",
      units: "4 أبواب",
      track: "مشترك"
    },
    {
      id: "quran",
      title: "القرآن الكريم وعلومه",
      emoji: "📿",
      desc: "حفظ وتجويد، أسباب النزول، التفسير",
      units: "4 أقسام",
      track: "مشترك"
    },
  ]

  const scienceSubjects = [
    {
      id: "physics",
      title: "الفيزياء",
      emoji: "⚡",
      desc: "المادة والحركة، القوى والطاقة، الموجات، الضوء، الكهرباء",
      units: "5 وحدات",
      highlight: "الوحدة 1: القياس والحركة المتسارعة"
    },
    {
      id: "chemistry",
      title: "الكيمياء",
      emoji: "🧪",
      desc: "البنية الذرية، الروابط الكيميائية، التفاعلات، الحلول، الغازات",
      units: "5 وحدات",
      highlight: "الوحدة 1: الجدول الدوري"
    },
    {
      id: "biology",
      title: "الأحياء",
      emoji: "🧬",
      desc: "تصنيف الكائنات، تركيب الخلية، العمليات الحيوية، التكاثر",
      units: "5 وحدات",
      highlight: "الوحدة 2: تركيب الخلية"
    },
  ]

  const otherSubjects = [
    {
      id: "history",
      title: "التاريخ",
      emoji: "📜",
      desc: "الحضارات القديمة، الفتح الإسلامي، الثورة المهدية، الاستقلال",
      units: "5 أبواب"
    },
    {
      id: "geography",
      title: "الجغرافيا والدراسات البيئية",
      emoji: "🌍",
      desc: "الأرض وطبقاتها، مناخ السودان، الموارد الطبيعية، البيئة",
      units: "5 فصول"
    },
    {
      id: "cs",
      title: "علوم الحاسوب",
      emoji: "💻",
      desc: "أنظمة التشغيل، قواعد البيانات، الشبكات، البرمجة",
      units: "5 وحدات"
    },
    {
      id: "engineering",
      title: "أساسيات العلوم الهندسية",
      emoji: "⚙️",
      desc: "الرسم الهندسي، المواد الهندسية، الهندسة الميكانيكية والكهربائية",
      units: "4 وحدات"
    },
    {
      id: "home-science",
      title: "العلوم الأسرية",
      emoji: "🏠",
      desc: "التغذية والصحة، إدارة الموارد، الملبس، المسكن",
      units: "4 وحدات"
    },
    {
      id: "arts",
      title: "الفنون والتصميم",
      emoji: "🎨",
      desc: "أسس التصميم، الرسم والتلوين، الفنون السودانية التراثية",
      units: "4 وحدات"
    },
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
            <span className="text-3xl font-bold">١</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">الأول الثانوي</h1>
          <p className="text-indigo-200 mb-2">منهج موحد — جميع الطلاب</p>
          <p className="text-white/60 text-sm">18 مادة دراسية • يبدأ التخصص العلمي والأدبي</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* Common Subjects */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-slate-100 rounded-xl px-4 py-2">
              <span className="text-slate-600 font-bold text-sm">📋 المواد المشتركة</span>
            </div>
            <span className="text-gray-400 text-sm">للجميع</span>
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
                <div className="mt-3">
                  <span className="inline-block bg-gray-50 text-gray-400 px-3 py-1 rounded-full text-xs font-bold border border-gray-100">
                    معمل تفاعلي — قريباً
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Science Subjects */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-indigo-50 rounded-xl px-4 py-2">
              <span className="text-indigo-700 font-bold text-sm">🔬 المسار العلمي</span>
            </div>
            <span className="text-gray-400 text-sm">فيزياء + كيمياء + أحياء</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scienceSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-indigo-100 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">{subject.units}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mb-3 leading-relaxed">{subject.desc}</p>
                <div className="bg-indigo-50 rounded-lg p-2 text-xs text-indigo-700">
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

        {/* Other Subjects */}
        <section>
          <div className="flex items-center gap-3 mb-5">
            <div className="bg-emerald-50 rounded-xl px-4 py-2">
              <span className="text-emerald-700 font-bold text-sm">📚 المواد الإضافية والتخصصية</span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherSubjects.map((subject) => (
              <div key={subject.id} className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 opacity-80">
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-3xl">{subject.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 mb-1">{subject.title}</h3>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{subject.units}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{subject.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Info Banner */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h3 className="font-bold text-indigo-800 mb-2">📌 عن الأول الثانوي</h3>
          <p className="text-indigo-700 text-sm leading-relaxed">
            الأول الثانوي هو مرحلة الانتقال — يبدأ فيها الطالب التخصص بين المسار العلمي (فيزياء + كيمياء + أحياء) والمسار الأدبي (تاريخ + جغرافيا + لغات). المعامل التفاعلية المقبلة ستبدأ بأهم مواضيع الفيزياء والكيمياء والأحياء.
          </p>
        </div>
      </div>
    </div>
  )
}
