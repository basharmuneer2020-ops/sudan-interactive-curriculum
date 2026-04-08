'use client'
import Link from 'next/link'

export default function KindergartenPage() {
  const subjects = [
    { id: 'arabic', title: 'اللغة العربية', emoji: '📝', desc: 'الحروف والكلمات الأولى' },
    { id: 'english', title: 'اللغة الإنجليزية', emoji: '🔤', desc: 'الحروف والأرقام بالإنجليزية' },
    { id: 'math', title: 'الرياضيات', emoji: '🔢', desc: 'الأرقام والأشكال' },
    { id: 'islamic', title: 'التربية الإسلامية', emoji: '🕌', desc: 'القرآن والأذكار' },
    { id: 'art', title: 'التربية الفنية', emoji: '🎨', desc: 'الرسم والتلوين' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <div className="bg-gradient-to-l from-pink-500 via-rose-500 to-pink-600 text-white">
        <div className="max-w-5xl mx-auto px-4 py-10 text-center">
          <Link href="/" className="text-pink-200 hover:text-white text-sm mb-4 inline-block transition-colors">
            ← الصفحة الرئيسية
          </Link>
          <span className="text-5xl block mb-3">🌱</span>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2">مرحلة الروضة</h1>
          <p className="text-pink-100">أساسيات التعلم للأطفال — أنشطة تفاعلية ممتعة</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden opacity-75">
              <div className="p-6 text-center">
                <span className="text-4xl block mb-3">{subject.emoji}</span>
                <h3 className="text-lg font-bold text-gray-800 mb-1">{subject.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{subject.desc}</p>
                <span className="inline-block bg-pink-100 text-pink-600 px-4 py-2 rounded-full text-sm font-bold">
                  قريباً إن شاء الله
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
