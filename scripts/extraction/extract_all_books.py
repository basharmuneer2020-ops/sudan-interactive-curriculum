"""
استخراج جماعي لكل كتب المنهج السوداني (PDF → JSON + TXT).

- يمر على كل ملفات PDF في docs/library/
- لكل كتاب: ينتج structure.json (هيكل) + fulltext.txt (نص خام)
- قابل للاستئناف: يتخطى الكتب المنتهية بالفعل
- يكتب progress.log مفصَّلاً + final_report.md عند الانتهاء

الاستخدام:
    python3 extract_all_books.py

المخرجات في:
    docs/library-extracted/<stage>/<grade>/<code>.structure.json
    docs/library-extracted/<stage>/<grade>/<code>.fulltext.txt
    docs/library-extracted/_progress.log
    docs/library-extracted/_status.json
    docs/library-extracted/_final_report.md
"""

import json
import os
import sys
import time
import traceback
from datetime import datetime
from pathlib import Path

# استيراد دوال الاستخراج من السكربت الأصلي (نفس المجلد)
SCRIPT_DIR = Path(__file__).parent
sys.path.insert(0, str(SCRIPT_DIR))

from extract_book_structure import (
    extract_book,
    normalize_arabic,
    clean_arabic,
    detect_text_quality,
)
import fitz  # type: ignore


# ────────────────────────────────────────────────────────────────────────────
# تحديد المسارات
# ────────────────────────────────────────────────────────────────────────────

REPO_ROOT = SCRIPT_DIR.parent.parent  # sudan-interactive-curriculum/
LIBRARY_DIR = REPO_ROOT / "docs" / "library"
OUT_DIR = REPO_ROOT / "docs" / "library-extracted"
PROGRESS_LOG = OUT_DIR / "_progress.log"
STATUS_JSON = OUT_DIR / "_status.json"
FINAL_REPORT = OUT_DIR / "_final_report.md"


# ────────────────────────────────────────────────────────────────────────────
# أدوات السجل
# ────────────────────────────────────────────────────────────────────────────

def log(msg: str):
    """كتابة سطر في progress.log + stdout."""
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    with open(PROGRESS_LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


def save_status(data: dict):
    """حفظ الحالة الحالية في JSON قابل للقراءة الآلية."""
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    STATUS_JSON.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )


# ────────────────────────────────────────────────────────────────────────────
# استخراج النص الخام لكل صفحة
# ────────────────────────────────────────────────────────────────────────────

def extract_full_text(pdf_path: Path) -> tuple[str, int]:
    """
    استخراج النص الخام من كل صفحات الكتاب، مع تنظيف عربي أساسي.
    يُرجع (النص_الكامل, عدد_الصفحات).
    """
    doc = fitz.open(str(pdf_path))
    parts = []
    for i in range(len(doc)):
        try:
            page = doc.load_page(i)
            text = page.get_text()
            text = normalize_arabic(text)
            parts.append(f"\n\n=== صفحة {i + 1} ===\n\n{text}")
        except Exception as e:
            parts.append(f"\n\n=== صفحة {i + 1} (خطأ: {e}) ===\n\n")
    page_count = len(doc)
    doc.close()
    return "\n".join(parts), page_count


# ────────────────────────────────────────────────────────────────────────────
# المنطق الرئيسي
# ────────────────────────────────────────────────────────────────────────────

def derive_output_paths(pdf_path: Path) -> tuple[Path, Path]:
    """
    من docs/library/<stage>/<grade>/<code>.pdf
    ينتج:
        docs/library-extracted/<stage>/<grade>/<code>.structure.json
        docs/library-extracted/<stage>/<grade>/<code>.fulltext.txt
    """
    rel = pdf_path.relative_to(LIBRARY_DIR)
    stem = rel.with_suffix("")  # حذف .pdf
    out_stem = OUT_DIR / stem
    return (
        out_stem.with_suffix(".structure.json"),
        out_stem.with_suffix(".fulltext.txt"),
    )


def is_already_done(pdf_path: Path) -> bool:
    """هل الكتاب مُستخرَج بالفعل؟"""
    json_out, txt_out = derive_output_paths(pdf_path)
    return json_out.exists() and txt_out.exists()


def process_book(pdf_path: Path) -> dict:
    """
    معالجة كتاب واحد: ينتج structure.json + fulltext.txt.
    يُرجع dict بالملخص (للتقرير النهائي).
    """
    json_out, txt_out = derive_output_paths(pdf_path)
    json_out.parent.mkdir(parents=True, exist_ok=True)

    started = time.time()

    # ١. استخراج الهيكل
    try:
        structure = extract_book(pdf_path)
    except Exception as e:
        return {
            "file": str(pdf_path.relative_to(LIBRARY_DIR)),
            "ok": False,
            "error": f"structure: {e}",
            "trace": traceback.format_exc(limit=2),
        }

    # ٢. استخراج النص الكامل
    try:
        full_text, page_count = extract_full_text(pdf_path)
        txt_out.write_text(full_text, encoding="utf-8")
    except Exception as e:
        return {
            "file": str(pdf_path.relative_to(LIBRARY_DIR)),
            "ok": False,
            "error": f"text: {e}",
            "trace": traceback.format_exc(limit=2),
        }

    # ٣. حفظ الهيكل
    try:
        json_out.write_text(
            json.dumps(structure, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )
    except Exception as e:
        return {
            "file": str(pdf_path.relative_to(LIBRARY_DIR)),
            "ok": False,
            "error": f"save: {e}",
        }

    elapsed = time.time() - started

    return {
        "file": str(pdf_path.relative_to(LIBRARY_DIR)),
        "ok": True,
        "elapsed_sec": round(elapsed, 1),
        "page_count": structure["meta"].get("page_count"),
        "language": structure["meta"].get("language"),
        "quality": structure["quality"]["quality"],
        "needs_ocr": structure["quality"]["needs_ocr"],
        "extraction_rating": structure.get("extraction_quality", {}).get("rating"),
        "units": structure["summary"]["units_detected"],
        "chapters": structure["summary"]["chapters_detected"],
        "lessons": structure["summary"]["lessons_detected"],
        "has_toc": structure["summary"]["has_toc"],
    }


# ────────────────────────────────────────────────────────────────────────────
# التقرير النهائي
# ────────────────────────────────────────────────────────────────────────────

def write_final_report(results: list[dict], started_at: str, ended_at: str, total_books: int):
    """تقرير نهائي بالماركداون."""
    ok = [r for r in results if r.get("ok")]
    failed = [r for r in results if not r.get("ok")]
    needs_ocr = [r for r in ok if r.get("needs_ocr")]
    scanned = [r for r in ok if r.get("quality") == "scanned"]
    very_garbled = [r for r in ok if r.get("extraction_rating") == "very_garbled"]
    clean = [r for r in ok if r.get("extraction_rating") in ("clean", "mostly_clean")]

    lines = [
        f"# تقرير الاستخراج النهائي",
        "",
        f"- **بدأ:** {started_at}",
        f"- **انتهى:** {ended_at}",
        f"- **إجمالي الكتب:** {total_books}",
        f"- **نجح:** {len(ok)}",
        f"- **فشل:** {len(failed)}",
        "",
        "## تصنيف الجودة",
        "",
        f"- نظيف / شبه نظيف: **{len(clean)}** كتاباً",
        f"- مُشوَّه بشدة (يحتاج تنظيف يدوي): **{len(very_garbled)}** كتاباً",
        f"- يحتاج OCR (ممسوح ضوئياً): **{len(needs_ocr)}** كتاباً",
        f"- تصنيف خام \"ممسوح\": **{len(scanned)}** كتاباً",
        "",
        "## الكتب التي تحتاج OCR",
        "",
    ]
    if needs_ocr:
        for r in sorted(needs_ocr, key=lambda x: x["file"]):
            lines.append(f"- `{r['file']}` ({r.get('page_count', '?')} صفحة)")
    else:
        lines.append("_لا يوجد._")

    lines += [
        "",
        "## الكتب المشوَّهة بشدة",
        "",
    ]
    if very_garbled:
        for r in sorted(very_garbled, key=lambda x: x["file"]):
            lines.append(f"- `{r['file']}`")
    else:
        lines.append("_لا يوجد._")

    if failed:
        lines += ["", "## الكتب التي فشل استخراجها", ""]
        for r in failed:
            lines.append(f"- `{r['file']}` — {r.get('error', '?')}")

    lines += [
        "",
        "## كل الكتب — جدول مختصر",
        "",
        "| الملف | الحالة | صفحات | اللغة | الجودة | الوحدات | الفصول |",
        "|---|---|---|---|---|---|---|",
    ]
    for r in sorted(results, key=lambda x: x.get("file", "")):
        if r.get("ok"):
            lines.append(
                f"| `{r['file']}` | ✅ | {r.get('page_count', '?')} | {r.get('language', '?')} | "
                f"{r.get('extraction_rating', '?')} | {r.get('units', 0)} | {r.get('chapters', 0)} |"
            )
        else:
            lines.append(f"| `{r['file']}` | ❌ | - | - | {r.get('error', '?')[:40]} | - | - |")

    FINAL_REPORT.write_text("\n".join(lines), encoding="utf-8")


# ────────────────────────────────────────────────────────────────────────────
# الـ main
# ────────────────────────────────────────────────────────────────────────────

def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    started_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # جمع كل الـ PDFs
    pdfs = sorted(LIBRARY_DIR.rglob("*.pdf"))
    log(f"═══════════════════════════════════════════════════")
    log(f"بداية الاستخراج الجماعي — {started_at}")
    log(f"إجمالي ملفات PDF: {len(pdfs)}")
    log(f"المجلد الناتج: {OUT_DIR}")
    log(f"═══════════════════════════════════════════════════")

    # تصنيف: المنتهي vs المتبقي
    todo = [p for p in pdfs if not is_already_done(p)]
    skipped = len(pdfs) - len(todo)
    log(f"تم تخطي {skipped} كتاباً (مستخرَج بالفعل).")
    log(f"المتبقي: {len(todo)} كتاباً.")

    results = []

    # تحميل النتائج السابقة إن وُجدت
    if STATUS_JSON.exists():
        try:
            prev = json.loads(STATUS_JSON.read_text(encoding="utf-8"))
            results = prev.get("results", [])
        except Exception:
            results = []

    for idx, pdf in enumerate(todo, 1):
        rel = pdf.relative_to(LIBRARY_DIR)
        log(f"[{idx}/{len(todo)}] جارٍ معالجة: {rel}")
        try:
            r = process_book(pdf)
        except Exception as e:
            r = {
                "file": str(rel),
                "ok": False,
                "error": f"unexpected: {e}",
                "trace": traceback.format_exc(limit=3),
            }
        results.append(r)

        if r.get("ok"):
            log(
                f"   ✅ {r.get('page_count', '?')} صفحة، "
                f"{r.get('extraction_rating', '?')}، "
                f"{r.get('units', 0)} وحدة، "
                f"{r.get('elapsed_sec', '?')} ثانية"
            )
        else:
            log(f"   ❌ خطأ: {r.get('error', '?')}")

        # تحديث الحالة بعد كل كتاب
        save_status({
            "started_at": started_at,
            "last_update": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "total_pdfs": len(pdfs),
            "completed": len(results),
            "results": results,
        })

    ended_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    log(f"═══════════════════════════════════════════════════")
    log(f"اكتمل الاستخراج — {ended_at}")
    log(f"═══════════════════════════════════════════════════")

    # كتابة التقرير النهائي
    write_final_report(results, started_at, ended_at, len(pdfs))
    log(f"التقرير النهائي: {FINAL_REPORT}")


if __name__ == "__main__":
    main()
