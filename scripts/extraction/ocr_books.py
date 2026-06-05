"""
OCR للكتب المشوَّهة والممسوحة (Tesseract Arabic).

- المدخل: قائمة الكتب التي تحتاج OCR (من _status.json)
- المخرج: <code>.ocr.txt لكل كتاب
- resumable على مستوى الصفحة (يكتب بعد كل صفحة)
- يقبل أولوية وحد زمني عبر env var

الاستخدام:
    TESSDATA_PREFIX=~/tessdata python3 ocr_books.py [--max-seconds N] [--priority-only]

env vars:
    TESSDATA_PREFIX  : مسار tessdata (إلزامي إن لم يكن في النظام)
    OCR_DPI          : DPI للصورة (افتراضي 200 — خفض لـ 150 لسرعة، رفع لـ 300 للدقة)
    OCR_MAX_SECONDS  : توقُّف بعد N ثانية (للاستئناف من جديد)
"""

import json
import os
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

import fitz  # PyMuPDF

# ────────────────────────────────────────────────────────────────────────────
# مسارات
# ────────────────────────────────────────────────────────────────────────────

SCRIPT_DIR = Path(__file__).parent
REPO_ROOT = SCRIPT_DIR.parent.parent
LIBRARY_DIR = REPO_ROOT / "docs" / "library"
EXTRACTED_DIR = REPO_ROOT / "docs" / "library-extracted"
OCR_DIR = REPO_ROOT / "docs" / "library-ocr"
STATUS_JSON = EXTRACTED_DIR / "_status.json"
OCR_LOG = OCR_DIR / "_ocr_progress.log"
OCR_STATE = OCR_DIR / "_ocr_state.json"

DPI = int(os.environ.get("OCR_DPI", "200"))
MAX_SECONDS = int(os.environ.get("OCR_MAX_SECONDS", "0"))  # 0 = بلا حد


# ────────────────────────────────────────────────────────────────────────────
# سجل
# ────────────────────────────────────────────────────────────────────────────

def log(msg: str):
    ts = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    line = f"[{ts}] {msg}"
    print(line, flush=True)
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    with open(OCR_LOG, "a", encoding="utf-8") as f:
        f.write(line + "\n")


# ────────────────────────────────────────────────────────────────────────────
# تحديد الكتب المرشَّحة
# ────────────────────────────────────────────────────────────────────────────

def needs_ocr_books() -> list[dict]:
    """
    يقرأ _status.json ويُرجع الكتب التي:
    - rating = very_garbled, garbled, empty
    - أو needs_ocr = True
    أوّل أولوية: G11-MAT.
    """
    status = json.loads(STATUS_JSON.read_text(encoding="utf-8"))
    candidates = []
    for r in status.get("results", []):
        if not r.get("ok"):
            continue
        if r.get("needs_ocr") or r.get("extraction_rating") in ("very_garbled", "garbled", "empty"):
            candidates.append(r)

    # أولوية: G11-MAT > بقية G11/G12 > G10 > بقية المتوسط > الابتدائي
    def priority(r):
        f = r["file"]
        if "SEC-G11-MAT" in f:
            return 0
        if f.startswith("secondary/grade-11"):
            return 1
        if f.startswith("secondary/grade-12"):
            return 2
        if f.startswith("secondary/grade-10"):
            return 3
        if f.startswith("middle/"):
            return 4
        if f.startswith("primary/"):
            return 5
        return 9

    candidates.sort(key=lambda r: (priority(r), r["file"]))
    return candidates


# ────────────────────────────────────────────────────────────────────────────
# OCR لصفحة واحدة
# ────────────────────────────────────────────────────────────────────────────

def ocr_page(page, tmp_dir: Path) -> str:
    """تحويل صفحة → صورة → نص عبر Tesseract.
    tmp_dir يجب أن يكون خارج المجلد المثبَّت (mounted)
    لأن mounted FS لا يدعم unlink أحياناً.
    """
    img_path = tmp_dir / "page.png"
    txt_stem = tmp_dir / "page"
    pix = page.get_pixmap(dpi=DPI)
    pix.save(str(img_path))
    # tesseract <input> <output_stem> -l ara
    subprocess.run(
        ["tesseract", str(img_path), str(txt_stem), "-l", "ara"],
        capture_output=True,
        text=True,
        timeout=180,
    )
    txt_path = txt_stem.with_suffix(".txt")
    text = ""
    if txt_path.exists():
        text = txt_path.read_text(encoding="utf-8", errors="replace")
        try:
            txt_path.unlink()
        except OSError:
            pass
    try:
        img_path.unlink(missing_ok=True)
    except OSError:
        pass
    return text


# ────────────────────────────────────────────────────────────────────────────
# OCR لكتاب
# ────────────────────────────────────────────────────────────────────────────

def load_state() -> dict:
    if OCR_STATE.exists():
        return json.loads(OCR_STATE.read_text(encoding="utf-8"))
    return {"books": {}}


def save_state(state: dict):
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    OCR_STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2), encoding="utf-8")


def ocr_book(rel_path: str, deadline: float | None) -> dict:
    """
    OCR لكتاب. يكتب في <OCR_DIR>/<rel>.ocr.txt تدريجياً.
    يُرجع {ok, pages_done, total_pages, finished}.
    deadline: time.time() الذي إن تجاوزناه نتوقف.
    """
    state = load_state()
    book_state = state["books"].setdefault(rel_path, {"pages_done": 0, "finished": False})

    if book_state.get("finished"):
        return {"ok": True, "pages_done": book_state["pages_done"], "total_pages": book_state.get("total_pages"), "finished": True}

    pdf_path = LIBRARY_DIR / rel_path
    out_path = OCR_DIR / rel_path
    out_path = out_path.with_suffix(".ocr.txt")
    out_path.parent.mkdir(parents=True, exist_ok=True)

    # IMPORTANT: tmp خارج المجلد المثبَّت (mounted FS لا يدعم unlink)
    # نستخدم مجلداً يحدِّده env var أو افتراضياً /tmp/ocr_workspace
    # (إن كان قديماً وغير قابل للكتابة، يمكن تجاوزه عبر OCR_TMP_DIR)
    tmp_dir = Path(os.environ.get("OCR_TMP_DIR", "/tmp/ocr_workspace"))
    tmp_dir.mkdir(parents=True, exist_ok=True)

    doc = fitz.open(str(pdf_path))
    total = len(doc)
    book_state["total_pages"] = total

    start_page = book_state["pages_done"]
    if start_page == 0 and out_path.exists():
        # truncate بدل unlink (mounted FS قد لا يدعم unlink)
        try:
            with open(out_path, "w", encoding="utf-8") as f:
                f.write("")
        except OSError:
            pass

    log(f"  📖 {rel_path}: {start_page}/{total} → بدء OCR")

    pages_in_run = 0
    for i in range(start_page, total):
        if deadline is not None and time.time() >= deadline:
            log(f"  ⏰ توقف للحد الزمني — {rel_path} عند صفحة {i}/{total}")
            break
        try:
            page = doc.load_page(i)
            text = ocr_page(page, tmp_dir)
        except Exception as e:
            text = f"[OCR ERROR p.{i+1}: {e}]"
        with open(out_path, "a", encoding="utf-8") as f:
            f.write(f"\n\n=== صفحة {i + 1} ===\n\n{text}\n")
        book_state["pages_done"] = i + 1
        pages_in_run += 1
        # save state every page (resumable)
        save_state(state)

    finished = book_state["pages_done"] >= total
    book_state["finished"] = finished
    save_state(state)
    doc.close()
    log(f"  ✅ {rel_path}: انتهت {pages_in_run} صفحة هذه الجولة. الإجمالي {book_state['pages_done']}/{total}. {'🏁 مكتمل' if finished else '↩️ يستأنف لاحقاً'}")
    return {"ok": True, "pages_done": book_state["pages_done"], "total_pages": total, "finished": finished, "pages_in_run": pages_in_run}


# ────────────────────────────────────────────────────────────────────────────
# الـ main
# ────────────────────────────────────────────────────────────────────────────

def main():
    OCR_DIR.mkdir(parents=True, exist_ok=True)
    started = time.time()
    deadline = (started + MAX_SECONDS) if MAX_SECONDS > 0 else None

    books = needs_ocr_books()
    log(f"═══════════════════════════════════════════════════")
    log(f"OCR Run — {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log(f"DPI: {DPI}, Max seconds: {MAX_SECONDS or 'بلا حد'}")
    log(f"إجمالي الكتب المرشَّحة: {len(books)}")
    log(f"═══════════════════════════════════════════════════")

    total_pages_run = 0
    for r in books:
        if deadline is not None and time.time() >= deadline:
            log(f"⏰ تم بلوغ الحد الزمني الكلي — توقف.")
            break
        res = ocr_book(r["file"], deadline)
        total_pages_run += res.get("pages_in_run", 0)

    elapsed = time.time() - started
    log(f"═══════════════════════════════════════════════════")
    log(f"انتهت الجولة. {total_pages_run} صفحة في {elapsed:.0f} ثانية.")
    if total_pages_run > 0:
        log(f"معدل: {elapsed / total_pages_run:.1f} ثانية/صفحة.")
    log(f"═══════════════════════════════════════════════════")


if __name__ == "__main__":
    main()
