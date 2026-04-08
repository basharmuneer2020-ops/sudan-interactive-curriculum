<div dir="rtl" align="right">

# 🇸🇩 المنهج السوداني التفاعلي

[![المساهمة مرحب بها](https://img.shields.io/badge/المساهمة-مرحب%20بها-brightgreen.svg)](CONTRIBUTING.md)
[![الترخيص: MIT](https://img.shields.io/badge/الترخيص-MIT-blue.svg)](LICENSE)

**منصة تعليمية تفاعلية مجانية شاملة للمنهج السوداني — من الروضة حتى الشهادة السودانية**

معامل افتراضية ومحاكاة تفاعلية لمواد الكيمياء والفيزياء والرياضيات والأحياء — لأن طلابنا يستحقون أن يتعلموا بالتجربة لا بالحفظ.

🌐 **[تصفح الموقع](https://basharmuneer2020-ops.github.io/sudan-interactive-curriculum/)**

---

## لماذا هذا المشروع؟

المدارس الحكومية في السودان تفتقر للمعامل والأجهزة. الطلاب يحفظون أن التفاعل ينتج لوناً أحمر دون أن يروه بأعينهم. هذا المشروع **صدقة جارية** يوفر معامل افتراضية تفاعلية مجانية يمكن الوصول إليها من أي جهاز.

---

## ما المتاح حالياً؟

### المراحل الدراسية المفهرسة

| المرحلة | الصفوف | عدد المواد | المعامل |
|---------|--------|-----------|---------|
| 🌱 الروضة | 1 | 5 | — |
| 📚 الابتدائية | 6 | 36 | — |
| 🎓 المتوسطة | 3 | 24 | — |
| 🏫 الثانوية | 3 | 33 | ✅ 4 معامل |

**المجموع:** 98 مادة مفهرسة من 100+ كتاب مدرسي

### المعامل التفاعلية (الصف الثالث الثانوي)

| المادة | المعمل | الباب |
|--------|--------|-------|
| 🧪 الكيمياء | التحليل الكيميائي الكيفي | الباب الثالث |
| ⚛️ الفيزياء | المجال التثاقلي والجاذبية | الباب الأول |
| 📐 الرياضيات | التفاضل وتطبيقاته | الباب الثاني |
| 🧬 الأحياء | تجارب مندل في الوراثة | الباب الثاني |

### 🔬 معامل تنتظر مساهمين! (11 معمل)

استخرجنا هيكل منهج الثالث ثانوي بالكامل (19 مادة، 67 وحدة، 195 موضوع) وحددنا 11 معمل تفاعلي مطلوب. كل واحد له [Issue مفتوح](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues) جاهز للمساهمة:

| المعمل | المادة | الصعوبة |
|--------|--------|---------|
| [الموجات والضوء](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/1) | فيزياء | 🔴 متقدم |
| [المجالات المغناطيسية](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/2) | فيزياء | 🔴 متقدم |
| [التحليل الكيفي](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/3) | كيمياء | 🟡 متوسط |
| [التحليل الحجمي](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/4) | كيمياء | 🟡 متوسط |
| [الاتزان الكيميائي](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/5) | كيمياء | 🟡 متوسط |
| [الكيمياء الكهربائية](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/6) | كيمياء | 🔴 متقدم |
| [التكاثر في النباتات](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/7) | أحياء | 🟡 متوسط |
| [تجارب مندل](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/8) | أحياء | 🟡 متوسط |
| [الدورات البيوجيوكيميائية](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/9) | أحياء | 🟡 متوسط |
| [قواعد البيانات](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/10) | حاسوب | 🟡 متوسط |
| [الثورة المهدية](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues/11) | تاريخ | 🟢 مبتدئ |

### المسارات الدراسية (الثانوية)

الصفان الثاني والثالث ثانوي يشملان 4 مسارات: **علمي** • **أدبي** • **هندسي** • **حاسوب**

---

## التشغيل المحلي

</div>

```bash
# 1. استنسخ المشروع
git clone https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum.git
cd sudan-interactive-curriculum

# 2. ثبّت المكتبات
npm install

# 3. شغّل خادم التطوير
npm run dev

# 4. افتح المتصفح
# http://localhost:3000/sudan-interactive-curriculum/
```

<div dir="rtl" align="right">

---

## التقنيات المستخدمة

| التقنية | الاستخدام |
|---------|----------|
| Next.js 14 | إطار العمل الأساسي (App Router) |
| React | بناء الواجهات التفاعلية |
| Tailwind CSS | التنسيق والتصميم |
| Three.js | المحاكاة ثلاثية الأبعاد |
| Recharts | الرسوم البيانية |
| GitHub Pages | الاستضافة المجانية |

---

## خارطة الطريق

- [x] **المرحلة 1** — فهرسة كل المراحل + 4 معامل تفاعلية (الثالث ثانوي) ✅
- [ ] **المرحلة 2** — معامل الأول والثاني ثانوي + محتوى المتوسطة 🔄
- [ ] **المرحلة 3** — نظام تقييم + ألعاب تعليمية + تغطية شاملة 📋

📍 التفاصيل الكاملة: **[docs/ROADMAP.md](docs/ROADMAP.md)**

---

## 🤝 كيف تساهم؟

نرحب بأي مساهمة! سواء كنت مطوراً، معلماً، طالباً، أو مهتماً بالتعليم في السودان.

### أسرع طريقة للبدء:

1. **اختر Issue** من [المعامل المطلوبة](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues?q=label%3Alab) — مقسمة حسب الصعوبة
2. **علّق على الـ Issue** وأخبرنا أنك تريد العمل عليه
3. **اقرأ [دليل المساهمة](CONTRIBUTING.md)** للتفاصيل التقنية والمرجع العلمي
4. **قدّم Pull Request** عند الانتهاء

### أنواع المساهمات المطلوبة:

| النوع | الوصف | المستوى |
|-------|-------|---------|
| 🔬 معمل تفاعلي | بناء محاكاة تفاعلية لدرس علمي | متوسط-متقدم |
| 📝 محتوى تعليمي | كتابة شروحات وأسئلة | مبتدئ-متوسط |
| 🎨 تحسين التصميم | تحسين الواجهة وتجربة المستخدم | مبتدئ-متوسط |
| 🐛 إصلاح أخطاء | إصلاح مشاكل تقنية أو محتوى | مبتدئ |

---

## الترخيص

هذا المشروع مرخص تحت **رخصة MIT** — انظر ملف [LICENSE](LICENSE).

---

**صدقة جارية لطلاب السودان** 🤲

جميع المحتويات مبنية على منهج وزارة التربية والتعليم — المركز القومي للمناهج والبحث التربوي.

</div>

---

## Sudan Interactive Curriculum (English)

A free, open-source interactive educational platform for the Sudanese school curriculum. Provides virtual labs and interactive simulations for Chemistry, Physics, Mathematics, and Biology — from kindergarten through secondary school.

**Why?** Government schools in Sudan lack labs and equipment. Students memorize without experiencing. This project provides free virtual labs accessible from any device.

**Features:** 4 stages (Kindergarten → Secondary), 98 subjects indexed from 100+ textbooks, 4 interactive labs (Grade 12) + 11 more awaiting contributors, 4 study tracks (Science/Humanities/Engineering/CS)

**Tech Stack:** Next.js 14, React, Tailwind CSS, Three.js, Recharts, GitHub Pages

**Contributing:** See [CONTRIBUTING.md](CONTRIBUTING.md) and [ROADMAP.md](docs/ROADMAP.md)

**License:** MIT
