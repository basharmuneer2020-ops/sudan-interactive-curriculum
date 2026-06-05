#!/usr/bin/env bash
# ───────────────────────────────────────────────────────────────────────────
# سكربت كومت جلسة 2026-06-01 — تثبيت OCR + library-extracted + scripts/extraction
# ───────────────────────────────────────────────────────────────────────────
# ⚠️ يُشغَّل من جهاز بشار فقط، ليس من Cowork sandbox.
# المرجع: SOPs/SOP-تعامل_مع_الريبو.md
# ولَّده ناظِم في جلسة 2026-06-01 — AX1 — كومت OCR كامل المنهج للريبو.
# ───────────────────────────────────────────────────────────────────────────

set -euo pipefail

# الانتقال لجذر الريبو
cd "$(dirname "$0")/../.."
echo "📂 الموقع الحالي: $(pwd)"

# ─── خطوة 1: حماية — التأكد من أننا لسنا في Cowork sandbox ───
if [ -d "/sessions" ] && [ -e "/sessions/hopeful-beautiful-mccarthy" ]; then
  echo "❌ يبدو أنك في Cowork sandbox. شغِّل هذا السكربت من جهازك المحلي."
  exit 1
fi

# ─── خطوة 2: التحقق من تثبيت git-lfs ───
if ! command -v git-lfs &> /dev/null; then
  echo "❌ git-lfs غير مثبَّت. ثبِّته: brew install git-lfs && git lfs install"
  exit 1
fi
echo "✅ git-lfs متوفر"

# ─── خطوة 3: تنظيف index.lock إن كان موجوداً من جلسة سابقة ───
if [ -f .git/index.lock ]; then
  echo "🧹 إزالة .git/index.lock القديم"
  rm -f .git/index.lock
fi

# ─── خطوة 4: حذف المجلد المتداخل الفارغ (مخلَّف جلسة سابقة) ───
if [ -d "sudan-interactive-curriculum" ]; then
  echo "🧹 حذف المجلد المتداخل الفارغ sudan-interactive-curriculum/"
  rm -rf sudan-interactive-curriculum
fi

# ─── خطوة 5: إعادة جلب PDFs الحقيقية عبر LFS ───
echo "📥 git lfs pull (لإصلاح PDFs التي قد تبدو modified)..."
git lfs pull

# ─── خطوة 6: التحقق من أن PDFs لم تعد modified ───
modified_pdfs=$(git status --short | grep "^ M" | grep "library/.*\.pdf" | wc -l | tr -d ' ')
if [ "$modified_pdfs" -gt 0 ]; then
  echo "⚠️ لا يزال $modified_pdfs ملف PDF يظهر كـ modified. تحقق يدوياً قبل المتابعة."
  echo "   git status -- 'docs/library/*.pdf' | head"
  read -p "متابعة على أي حال؟ (y/N) " confirm
  [ "$confirm" = "y" ] || exit 0
fi

# ─── خطوة 7: إضافة التغييرات المقصودة ───
echo "📦 إضافة الملفات المقصودة..."
git add docs/library-ocr/
git add docs/library-extracted/
git add scripts/extraction/
git add docs/curriculum-analysis/ 2>/dev/null || true
git add docs/ROADMAP.md

# ─── خطوة 8: عرض ما سيُكوْمت ───
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "ما سيُكوْمت:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git status --short
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "متابعة الكومت والرفع؟ (y/N) " confirm
[ "$confirm" = "y" ] || { echo "⏸  أُلغيَ الكومت."; exit 0; }

# ─── خطوة 9: الكومت ───
git commit -m "data(AX1): إضافة OCR كامل + المنهج الخام المستخرج + سكربتات الاستخراج

دفعة تثبيت ضخمة بعد 5 أسابيع بلا كومت:

- docs/library-ocr/: نتيجة OCR لـ 62 كتاب (9,185 صفحة، 14MB) — جلسة 2026-05-09
- docs/library-extracted/: المنهج الخام المستخرج (68 كتاب نظيف، 18MB) — جلسة 2026-04-24
- scripts/extraction/: ocr_books.py + extract_all_books.py + verify_book_authenticity.py
- docs/curriculum-analysis/: تحليلات وسائط المنهج
- docs/ROADMAP.md: تحديث متن المخطط الزمني

المحاور المتأثرة: AX1 (المحتوى والبيانات) — قفزة من 70% إلى 90%
المراجع: أرشيف-الجلسات/2026-05-09_AX1_OCR-كامل-المنهج.md
       SOPs/SOP-تعامل_مع_الريبو.md
"

# ─── خطوة 10: الرفع ───
echo "🚀 git push..."
git push

echo ""
echo "✅ تم بنجاح. حدِّث 00-أين_توقفنا.md وحالة_المحاور_الحية.md."
