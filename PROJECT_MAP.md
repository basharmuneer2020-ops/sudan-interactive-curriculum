<div dir="rtl" align="right">

# 🗺️ خريطة المشروع — Project Map

> **ابدأ من هنا** إذا كنت مطوراً جديداً أو عائداً للمشروع بعد فترة.
>
> **آخر تحديث:** 2026-04-23

---

## 📍 أين الفرونت وأين الباك؟

```
┌─────────────────────────────────────────────────────────────┐
│                        المشروع الواحد                         │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │   GitHub Repo (المصدر الأساسي — source of truth)     │  │
│   │                                                      │  │
│   │   https://github.com/basharmuneer2020-ops/           │  │
│   │   sudan-interactive-curriculum                       │  │
│   │                                                      │  │
│   │   • الكود الكامل                                      │  │
│   │   • البيانات (JSON)                                    │  │
│   │   • مكتبة الكتب (Git LFS)                             │  │
│   │   • الوثائق                                            │  │
│   └────────────────────┬─────────────────────────────────┘  │
│                        │                                    │
│                        │ git push → GitHub Actions          │
│                        │ (.github/workflows/deploy.yml)     │
│                        ▼                                    │
│   ┌──────────────────────────────────────────────────────┐  │
│   │   GitHub Pages (الموقع المنشور — published site)     │  │
│   │                                                      │  │
│   │   https://basharmuneer2020-ops.github.io/            │  │
│   │   sudan-interactive-curriculum/                      │  │
│   │                                                      │  │
│   │   يُبنى تلقائياً من نفس الريبو (static export)        │  │
│   │   لا حاجة لريبو منفصل للفرونت                         │  │
│   └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**باختصار:** الريبو واحد، والموقع يُنشر تلقائياً من نفس الريبو عبر GitHub Actions. لا يوجد فصل بين "باك" و"فرونت" — المشروع كله Next.js يصدر كموقع ثابت (static export).

---

## 🎯 نقاط الدخول السريعة

| أريد أن... | اذهب إلى |
|-----------|---------|
| أفهم حالة المشروع الكاملة | [`PROJECT_STATUS_AND_ROADMAP.docx`](./PROJECT_STATUS_AND_ROADMAP.docx) |
| أساهم بمعمل جديد | [`CONTRIBUTING.md`](./CONTRIBUTING.md) + [Issues](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues) |
| أفهم نظام الترميز (SEC-G12-CHE-...) | [`docs/CODING-SYSTEM.md`](./docs/CODING-SYSTEM.md) |
| أعرف خارطة الطريق | [`docs/ROADMAP.md`](./docs/ROADMAP.md) |
| أشغّل المشروع محلياً | [التشغيل المحلي](#️-التشغيل-المحلي) أدناه |
| أفهم بنية المنهج | [`src/data/curriculum.json`](./src/data/curriculum.json) |

---

## 🏗️ بنية المجلدات — شجرة مُعلَّقة

```
sudan-interactive-curriculum/
│
├── 📄 README.md                    ← الواجهة للعامة (عربي)
├── 📄 PROJECT_MAP.md               ← هذا الملف (للمطورين)
├── 📄 PROJECT_STATUS_AND_ROADMAP.docx  ← الحالة + خارطة الطريق
├── 📄 CONTRIBUTING.md              ← كيف تساهم (14 KB — مفصّل)
├── 📄 CODE_OF_CONDUCT.md
├── 📄 LICENSE                      ← MIT
│
├── ⚙️ package.json                 ← Next.js 14 + React 18 + Tailwind
├── ⚙️ next.config.js               ← static export switch (GitHub Pages)
├── ⚙️ tailwind.config.js
├── ⚙️ jsconfig.json
├── ⚙️ .env.example                 ← متغيرات البيئة المطلوبة
│
├── 📂 .github/workflows/
│   ├── deploy.yml                  ← نشر تلقائي على كل push (main)
│   └── ci.yml                      ← فحص Lint + Build على الـ PRs
│
├── 📂 src/                         ═══════ كل الكود هنا ═══════
│   │
│   ├── 📂 app/                     ← Next.js App Router (الصفحات)
│   │   ├── layout.js, page.js, globals.css
│   │   ├── kindergarten/           ← الروضة
│   │   ├── primary/                ← الابتدائية (grade-1 ... grade-6)
│   │   ├── middle/                 ← المتوسطة (grade-7 ... grade-9)
│   │   ├── secondary/              ← الثانوية (grade-1/2/3)
│   │   │   └── grade-3/            ← الأكثر تطوراً
│   │   │       ├── chemistry/qualitative-analysis/
│   │   │       ├── physics/gravity/
│   │   │       ├── math/differentiation/
│   │   │       ├── biology/genetics/
│   │   │       └── lessons/[subjectId]/[lessonId]/
│   │   ├── teachers/               ← بوابة المعلمين (جديد — غير مرفوع بعد)
│   │   └── api/chat/               ← Anthropic API endpoint (جديد)
│   │
│   ├── 📂 components/              ← مكونات React
│   │   ├── biology/MendelGeneticsLab.jsx         (955 سطر)
│   │   ├── chemistry/QualitativeAnalysisLab.jsx  (1294 سطر)
│   │   ├── physics/PhysicsGravityLab.jsx         (1846 سطر)
│   │   ├── math/DifferentiationUnit.jsx          (1496 سطر)
│   │   ├── chat/ChatInterface.jsx                ← واجهة AI Chat
│   │   ├── lesson/LessonPage.jsx                 ← عرض الدروس
│   │   └── MathRenderer.jsx                      ← KaTeX
│   │
│   ├── 📂 data/                    ═══ قلب المشروع المعرفي ═══
│   │   ├── curriculum.json              (23 KB)  ← هيكل عام
│   │   ├── grade-12-curriculum.json     (37 KB)  ← الصف 3ث مفصّل
│   │   ├── official-curriculum-2025.json (35 KB) ← منهج الوزارة الرسمي
│   │   ├── subject-agents.json          (31 KB)  ← 17 وكيل AI
│   │   └── lessons/                               ← 11 درس متخصص
│   │       ├── physics/{unit1-gravity, unit2-circular-motion}.json
│   │       ├── chemistry/unit1-organic.json
│   │       ├── biology/unit1-molecular-genetics.json
│   │       ├── english/unit1-grammar-writing.json
│   │       ├── arabic/unit1-nahw.json
│   │       ├── islamic-education/unit1-quran-tafsir.json
│   │       ├── history/unit1-modern-sudan.json
│   │       ├── geography/unit1-physical-geography.json
│   │       ├── basic-mathematics/unit1-algebra-functions.json
│   │       └── specialized-mathematics/unit-differentiation.json
│   │
│   └── 📂 lib/                     ← أدوات مساعدة (جديد)
│
├── 📂 docs/
│   ├── README.md
│   ├── ROADMAP.md
│   ├── CODING-SYSTEM.md            ← نظام SEC-G12-CHE-C03-LAB-01
│   ├── AI-GUIDE.md                 ← دليل التعامل مع وكلاء AI
│   ├── خريطة المنهج السوداني الشاملة.xlsx
│   ├── task-matrix.xlsx            ← WBS + MoSCoW + CPM
│   ├── notes/                      ← ملاحظات العمل
│   └── 📂 library/                 ← 113 كتاب PDF (2.6 GB عبر Git LFS)
│       ├── CATALOG.md              (18 KB فهرس شامل)
│       ├── primary/                (صفوف 1-6)
│       ├── middle/                 (صفوف 7-9)
│       └── secondary/              (صفوف 10-12)
│
├── 📂 scripts/
│   └── create-lab-issues.sh        ← سكريبت لإنشاء Issues للمعامل
│
├── 📂 public/                      ← أصول ثابتة (فارغ حالياً)
└── 📂 node_modules/                ← [لا تلمس — git ignored]
```

---

## 🖥️ التشغيل المحلي

```bash
# 1. استنسخ الريبو (مع Git LFS للكتب)
git lfs install
git clone https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum.git
cd sudan-interactive-curriculum

# 2. ثبّت الحزم
npm install

# 3. انسخ ملف البيئة وأضف مفتاح Anthropic (اختياري — فقط للشات)
cp .env.example .env.local
# افتح .env.local وأضف ANTHROPIC_API_KEY=sk-...

# 4. شغّل الخادم
npm run dev
# يفتح على http://localhost:3000

# 5. لاختبار النشر الستاتيكي محلياً (GitHub Pages mode)
npm run build:static
# الناتج في /out
```

---

## 🚀 كيف يُنشر الموقع؟

**تلقائي 100%.** عند أي `git push` إلى فرع `main`:
1. يُشغَّل `.github/workflows/deploy.yml`
2. يبني المشروع بـ `STATIC_EXPORT=true` (static export)
3. يرفع الناتج إلى فرع `gh-pages`
4. GitHub Pages يخدم الموقع من هناك

**لا حاجة لإجراء يدوي.** كل ما يُرفع إلى main يظهر على الموقع في دقائق.

---

## 🧠 المفاهيم الأساسية التي يجب أن يفهمها كل مساهم

### 1. نظام الترميز (Coding System)
كل معمل/درس له كود فريد بصيغة:
```
{المرحلة}-{الصف}-{المادة}-{الباب}-{النوع}-{التسلسل}

مثال: SEC-G12-CHE-C03-LAB-01
معناه: الثانوية - الصف الثالث - كيمياء - الباب الثالث - معمل - الأول
```
التفاصيل في `docs/CODING-SYSTEM.md`.

### 2. مصادر الحقيقة (Source of Truth)
عند أي تعارض بين البيانات، الأولوية كالتالي:
1. `src/data/official-curriculum-2025.json` — المنهج الرسمي من الوزارة
2. `المنهج_المعتمد_الرسمي_2025.docx` (في مجلد الأب) — المصدر الأصلي للـ JSON
3. `src/data/grade-12-curriculum.json` — تفصيل الصف الثالث
4. `src/data/curriculum.json` — الهيكل العام

### 3. وكلاء الـ AI (Subject Agents)
`src/data/subject-agents.json` يحتوي 17 وكيل — واحد لكل مادة في الصف الثالث ثانوي. كل وكيل يحتوي `systemPrompt` كامل بأوزان الامتحان والمواضيع المحذوفة. يُستخدم عبر `src/app/api/chat/` و `src/components/chat/ChatInterface.jsx`.

### 4. مكتبة الـ PDF عبر Git LFS
113 كتاب PDF (2.6 GB) محفوظة عبر **Git LFS** (Large File Storage). إذا لم تثبّت `git lfs`، ستحصل على ملفات pointer فقط وليس الكتب الفعلية.

---

## 🔥 المناطق الحارّة (Hot Paths) — ابدأ منها

| أريد المساهمة في... | اذهب لـ... | المرجع |
|-------------------|-----------|--------|
| معمل تفاعلي جديد | `src/components/{مادة}/` | [11 issue مفتوح](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues) |
| درس جديد | `src/data/lessons/{مادة}/` | دروس موجودة كنماذج |
| صفحة صف جديد | `src/app/{مرحلة}/{صف}/page.js` | grade-3 هو النموذج الأغنى |
| تحسين بيانات المنهج | `src/data/*.json` | `official-curriculum-2025.json` هو المرجع |
| تحسين وكيل AI | `src/data/subject-agents.json` | docs/AI-GUIDE.md |

---

## ⚠️ مناطق لا تلمسها دون نقاش

- `src/data/official-curriculum-2025.json` — مستخرج من وثيقة الوزارة. أي تعديل يحتاج مرجعاً رسمياً.
- `.github/workflows/deploy.yml` — النشر يعتمد عليه. إفساده يعطّل الموقع.
- `docs/library/*.pdf` — محفوظ عبر LFS. الإضافة فقط، لا تحذف دون سبب.

---

## 🏷️ الحالة الراهنة — ملخّص في سطر واحد

**~85% من البنية التحتية جاهز** • **الصف الثالث ثانوي = المنطقة الأكثر اكتمالاً** (4 معامل + دروس لـ 10 مواد) • **11 معمل مطلوب وله issues مفتوحة** • **113 كتاباً مفهرساً** • **17 وكيل AI جاهز للدمج في واجهة الشات**.

التفاصيل الكاملة في `PROJECT_STATUS_AND_ROADMAP.docx`.

---

## 🙏 للمساهمين

هذا المشروع **صدقة جارية** لطلاب السودان. المساهمة فيه زكاة علم ونية خير.

- اقرأ [`CONTRIBUTING.md`](./CONTRIBUTING.md) أولاً
- اختر [Issue مفتوح](https://github.com/basharmuneer2020-ops/sudan-interactive-curriculum/issues) أو افتح واحداً جديداً
- تواصل مع صاحب المشروع: بشار — [basharmuneer2020@gmail.com](mailto:basharmuneer2020@gmail.com)

</div>
