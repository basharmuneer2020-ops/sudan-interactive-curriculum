<div dir="rtl" align="right">

# 🇸🇩 المنهج السوداني التفاعلي

**منصة تعليمية تفاعلية مجانية للمنهج السوداني**

معامل افتراضية ومحاكاة تفاعلية لمواد الكيمياء والفيزياء والرياضيات والأحياء — لأن طلابنا يستحقون أن يتعلموا بالتجربة لا بالحفظ.

---

## المشكلة

المدارس الحكومية في السودان تفتقر للمعامل والأجهزة. الطلاب يحفظون أن التفاعل ينتج لوناً أحمر دون أن يروه بأعينهم. هذا المشروع يوفر معامل افتراضية تفاعلية مجانية يمكن الوصول إليها من أي جهاز.

## المحتوى المتاح (المرحلة الأولى)

| المادة | الوحدة | المعمل |
|--------|--------|--------|
| 🧬 الأحياء | الوراثة | تجارب مندل في الوراثة |
| 🧪 الكيمياء | التحليل الكيميائي الكيفي | معمل التحليل الكيفي |
| ⚛️ الفيزياء | المجال التثاقلي | الجاذبية والحركة الدائرية |
| 📐 الرياضيات | التفاضل | التفاضل وتطبيقاته |

## هيكل المشروع

</div>

```
sudan-interactive-curriculum/
├── src/
│   ├── app/
│   │   ├── page.js                          # الصفحة الرئيسية
│   │   ├── layout.js                        # التخطيط العام
│   │   ├── globals.css                      # الأنماط العامة
│   │   ├── secondary/                       # المرحلة الثانوية
│   │   │   └── grade-3/                     # الصف الثالث
│   │   │       ├── page.js                  # صفحة الصف
│   │   │       ├── biology/genetics/        # معمل الوراثة
│   │   │       ├── chemistry/qualitative-analysis/
│   │   │       ├── physics/gravity/
│   │   │       └── math/differentiation/
│   │   ├── middle/                          # المرحلة المتوسطة (قريباً)
│   │   └── primary/                         # المرحلة الأساسية (قريباً)
│   └── components/
│       ├── biology/                         # مكونات الأحياء
│       ├── chemistry/                       # مكونات الكيمياء
│       ├── physics/                         # مكونات الفيزياء
│       └── math/                            # مكونات الرياضيات
├── docs/                                    # وثائق المشروع
├── public/                                  # الملفات الثابتة
└── package.json
```

<div dir="rtl" align="right">

## التشغيل المحلي

</div>

```bash
# استنساخ المشروع
git clone https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum.git
cd sudan-interactive-curriculum

# تثبيت التبعيات
npm install

# تشغيل سيرفر التطوير
npm run dev

# بناء نسخة الإنتاج
npm run build
```

<div dir="rtl" align="right">

## التقنيات المستخدمة

- **Next.js 14** — إطار عمل React
- **Tailwind CSS** — التنسيق
- **Recharts** — الرسوم البيانية (الرياضيات)
- **GitHub Pages** — الاستضافة المجانية

## خارطة الطريق

- [x] المرحلة الأولى: الصف الثالث الثانوي (4 معامل)
- [ ] المرحلة الثانية: توسيع الصف الثالث الثانوي (بقية الوحدات)
- [ ] المرحلة الثالثة: الصف الثاني والأول الثانوي
- [ ] المرحلة الرابعة: المرحلة المتوسطة
- [ ] المرحلة الخامسة: المرحلة الأساسية

## المساهمة

المشروع مفتوح المصدر ونرحب بأي مساهمة! إذا كنت معلماً أو مطوراً سودانياً وتريد المساهمة، افتح Issue أو Pull Request.

## الترخيص

هذا المشروع مرخص تحت رخصة MIT — انظر ملف [LICENSE](LICENSE).

---

**صدقة جارية لطلاب السودان** 🤲

جميع المحتويات مبنية على منهج وزارة التربية والتعليم — المركز القومي للمناهج والبحث التربوي.

</div>

---

## Sudan Interactive Curriculum (English)

A free, open-source interactive educational platform for the Sudanese school curriculum. Provides virtual labs and interactive simulations for Chemistry, Physics, Mathematics, and Biology.

**Why?** Government schools in Sudan lack labs and equipment. Students memorize without experiencing. This project provides free virtual labs accessible from any device.

**Tech Stack:** Next.js 14, React, Tailwind CSS, Recharts, GitHub Pages

**License:** MIT
