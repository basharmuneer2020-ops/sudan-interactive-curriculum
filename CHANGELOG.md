<div dir="rtl" align="right">

# 📋 سجل التغييرات — Changelog

كل التغييرات الملحوظة في هذا المشروع تُوثَّق في هذا الملف.

الصيغة مستوحاة من [Keep a Changelog](https://keepachangelog.com/ar/1.1.0/)،
ويتبع المشروع [الإصدار الدلالي](https://semver.org/lang/ar/).

---

## [غير مُصدَر] — Unreleased

### مخطَّط له
- رفع 11 معملاً تفاعلياً متبقياً للصف الثالث ثانوي (Issues #1-11)
- إضافة Error Boundaries حول كل معمل
- اختبارات smoke للمعامل الأربعة الحالية
- PWA + دعم العمل بلا إنترنت

---

## [1.1.0] — 2026-04-23

**إصدار «إعادة التموضع»** — تنظيم المشروع وفتح الباب للمساهمين.

### 🆕 أُضيف
- `PROJECT_MAP.md` — خريطة المشروع الشاملة للمطورين (بنية، نقاط دخول، قواعد ذهبية)
- `PROJECT_STATUS_AND_ROADMAP.docx` — تقرير الحالة وخارطة الطريق (4 مراحل)
- `CHANGELOG.md` — سجل التغييرات (هذا الملف)
- `.env.example` — قالب متغيرات البيئة (ANTHROPIC_API_KEY)
- `src/app/api/chat/` — نقطة نهاية Chat API مع Anthropic
- `src/app/teachers/` — بوابة المعلّمين (صفحات جديدة)
- `src/app/secondary/grade-3/lessons/[subjectId]/[lessonId]/` — صفحات الدروس الديناميكية
- `src/components/chat/ChatInterface.jsx` — واجهة الشات مع وكلاء AI
- `src/components/lesson/LessonPage.jsx` — مكوّن عرض الدروس
- `src/components/lesson/MathRenderer.jsx` — عرض المعادلات الرياضية (KaTeX)
- `src/lib/agents.js` — أدوات وكلاء AI
- `src/data/lessons/` — 11 ملف درس متخصّص في 10 مواد (4137 سطر)
- `src/data/official-curriculum-2025.json` — المنهج الرسمي من الوزارة (864 سطر)
- `src/data/subject-agents.json` — 17 وكيل AI متخصّص
- 15 ملف PDF جديد في `docs/library/` عبر Git LFS

### 🔄 تغيّر
- `README.md` — أُضيف قسم «روابط سريعة للمطورين» مع روابط بارزة للوثائق الجديدة
- `src/app/secondary/grade-3/page.js` — توسيع كبير (303 سطر)
- `src/data/curriculum.json` — تحديث شامل للهيكل
- `src/data/grade-12-curriculum.json` — إضافة تفاصيل جديدة
- `next.config.js` — تحسينات التكوين
- `package.json` — تحديث الاعتماديات + سكريبت build:static

### 🗄️ أُرشف (خارج الريبو)
- 5 ملفات JSX كانت نسخاً مكرّرة في جذر مجلد العمل (نُقلت إلى `../_archive/`)
- 7 مستندات Word تخطيطية قديمة (مُدمَج محتواها في ROADMAP الجديد)
- المجلد المستقل `sudan-bio-lab/` (محتواه مُدمَج بالفعل في الريبو الرئيسي)

---

## [1.0.0] — 2026-04-08

**الإصدار الأول — تجهيز المشروع للمساهمين.**

### 🆕 أُضيف
- `README.md` شامل بالعربية والإنجليزية
- `CONTRIBUTING.md` بتفاصيل المعايير التقنية
- `CODE_OF_CONDUCT.md` ميثاق السلوك
- `LICENSE` — MIT
- `.github/workflows/deploy.yml` — نشر تلقائي على GitHub Pages
- `.github/workflows/ci.yml` — فحص Lint + Build على الـ PRs
- `.github/ISSUE_TEMPLATE/` — 4 قوالب (new-lab, bug-report, content-request, feature-request)
- `scripts/create-lab-issues.sh` — سكريبت توليد Issues للمعامل

---

## [0.9.0] — 2026-04-07

**الإصدار التأسيسي — البنية التحتية الأولى.**

### 🆕 أُضيف
- هيكل Next.js 14 + React 18 + Tailwind CSS
- صفحات المراحل الدراسية (روضة، ابتدائية، متوسطة، ثانوية)
- 4 معامل تفاعلية للصف الثالث ثانوي:
  - التحليل الكيميائي الكيفي (كيمياء)
  - المجال التثاقلي والجاذبية (فيزياء)
  - التفاضل وتطبيقاته (رياضيات)
  - تجارب مندل في الوراثة (أحياء)
- مكتبة رقمية: 100+ كتاب PDF عبر Git LFS (2.6 جيجابايت)
- نظام الترميز الشامل (SEC-G12-CHE-C03-LAB-01)
- استخراج هيكل منهج الصف الثالث ثانوي من 19 كتاباً
- إعداد GitHub Pages + نشر موقع `.github.io/sudan-interactive-curriculum/`

---

## كيف تُكتب إدخالات هذا الملف؟

عند كل Pull Request مهم، أضف سطراً تحت قسم **[غير مُصدَر]** بالشكل:

```markdown
### الفئة
- وصف التغيير — اسم المُساهم (#رقم PR)
```

**الفئات المُستخدمة:**
- `🆕 أُضيف` — ميزات جديدة
- `🔄 تغيّر` — تحسينات لميزات موجودة
- `🐛 أُصلح` — إصلاحات أخطاء
- `🗑️ حُذف` — ميزات/ملفات أُزيلت
- `🔐 أمان` — إصلاحات أمنية
- `🗄️ أُرشف` — ملفات نُقلت إلى الأرشيف

عند الإصدار، حوّل `[غير مُصدَر]` إلى رقم الإصدار + التاريخ.

</div>
