#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# تشغيل OCR للكتب المشوَّهة + الممسوحة طوال الليل (Mac)
#
# الاستخدام (من Terminal على جهاز Mac):
#   cd "/Users/basharhassan/Documents/Claude/Projects/مشروع المنهج التعليمي السوداني التفاعلي/sudan-interactive-curriculum/scripts/extraction"
#   bash run_ocr_overnight.sh
#
# يقوم بـ:
#   1. التأكُّد من وجود Tesseract + بيانات اللغة العربية
#   2. التأكُّد من وجود Python + PyMuPDF
#   3. تشغيل ocr_books.py حتى ينتهي
#   4. إيقاف Mac من النوم أثناء التشغيل (caffeinate)
# ─────────────────────────────────────────────────────────────────

set -e

REPO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OCR_DIR="$REPO_ROOT/docs/library-ocr"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

mkdir -p "$OCR_DIR"

echo "════════════════════════════════════════════════════════"
echo "  تشغيل OCR الليلي — منهج السودان"
echo "════════════════════════════════════════════════════════"
echo "Repo root: $REPO_ROOT"
echo "OCR output: $OCR_DIR"
echo ""

# ─── ١. التأكد من Homebrew ───
if ! command -v brew &> /dev/null; then
    echo "❌ Homebrew غير مثبَّت. ثبِّته أوّلاً من https://brew.sh"
    exit 1
fi

# ─── ٢. التأكد من Tesseract + اللغة العربية ───
if ! command -v tesseract &> /dev/null; then
    echo "📦 تثبيت Tesseract..."
    brew install tesseract tesseract-lang
fi

if ! tesseract --list-langs 2>&1 | grep -q "^ara$"; then
    echo "📦 تثبيت بيانات اللغة العربية..."
    brew install tesseract-lang
fi

echo "✅ Tesseract جاهز ($(tesseract --version 2>&1 | head -1))"
echo "   اللغات: $(tesseract --list-langs 2>&1 | tail -n +2 | tr '\n' ' ')"
echo ""

# ─── ٣. التأكد من Python + PyMuPDF ───
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 غير مثبَّت. ثبِّته من python.org أو brew install python"
    exit 1
fi

if ! python3 -c "import fitz" 2>/dev/null; then
    echo "📦 تثبيت PyMuPDF..."
    python3 -m pip install --user PyMuPDF
fi

echo "✅ Python: $(python3 --version)"
echo ""

# ─── ٤. عرض الكتب التي ستُعالَج ───
echo "📚 الكتب المرشَّحة للمعالجة:"
python3 - << 'PY'
import json
from pathlib import Path
state_file = Path(__file__).parent.parent.parent / "docs" / "library-extracted" / "_status.json"
ocr_state = Path(__file__).parent.parent.parent / "docs" / "library-ocr" / "_ocr_state.json"

if state_file.exists():
    s = json.loads(state_file.read_text(encoding="utf-8"))
    candidates = [
        r for r in s.get("results", [])
        if r.get("ok") and (r.get("needs_ocr") or r.get("extraction_rating") in ("very_garbled", "garbled", "empty"))
    ]
    print(f"  إجمالي: {len(candidates)} كتاباً")

    if ocr_state.exists():
        st = json.loads(ocr_state.read_text(encoding="utf-8"))
        done = sum(1 for v in st.get("books", {}).values() if v.get("finished"))
        total_pages = sum(v.get("total_pages", 0) for v in st.get("books", {}).values() if v.get("finished"))
        print(f"  مكتمل سابقاً: {done} كتاباً ({total_pages} صفحة)")
        remaining = len(candidates) - done
        print(f"  متبقٍّ: {remaining} كتاباً")
else:
    print("  ⚠️  _status.json غير موجود — شغِّل extract_all_books.py أولاً.")
PY
echo ""

# ─── ٥. التشغيل مع caffeinate (يمنع النوم) ───
echo "🌙 بدء OCR الليلي — Mac سيبقى مستيقظاً حتى الانتهاء..."
echo "   (يمكنك إغلاق الشاشة لكن لا تُغلق Terminal)"
echo ""

# OCR_MAX_SECONDS=0 → بلا حد زمني (يكمل حتى الانتهاء)
# caffeinate -i → يمنع النوم بسبب عدم النشاط
caffeinate -i bash -c "
    cd '$SCRIPT_DIR' && \
    OCR_MAX_SECONDS=0 OCR_DPI=200 python3 -u ocr_books.py
"

echo ""
echo "════════════════════════════════════════════════════════"
echo "  ✅ اكتمل OCR الليلي"
echo "════════════════════════════════════════════════════════"
echo ""
echo "📊 التقرير:"
python3 - << 'PY'
import json
from pathlib import Path
ocr_state = Path(__file__).parent.parent.parent / "docs" / "library-ocr" / "_ocr_state.json"
if ocr_state.exists():
    st = json.loads(ocr_state.read_text(encoding="utf-8"))
    books = st.get("books", {})
    done = [k for k, v in books.items() if v.get("finished")]
    pending = [k for k, v in books.items() if not v.get("finished")]
    total_pages = sum(v.get("pages_done", 0) for v in books.values())
    print(f"  كتب مكتملة: {len(done)}")
    print(f"  كتب جزئية: {len(pending)}")
    print(f"  إجمالي صفحات OCR: {total_pages}")
PY

echo ""
echo "النصوص في: $OCR_DIR/<stage>/<grade>/<code>.ocr.txt"
echo "السجل: $OCR_DIR/_ocr_progress.log"
