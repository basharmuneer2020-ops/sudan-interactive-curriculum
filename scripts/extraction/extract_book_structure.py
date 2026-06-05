"""
استخلاص الهيكل من كتاب PDF سوداني

المدخل: مسار كتاب PDF
المخرج: JSON فيه الهيكل (صفحات، فهرس، وحدات، فصول)

الاستخدام:
    python extract_book_structure.py <pdf_path> [output.json]
"""

import fitz  # PyMuPDF
import json
import re
import sys
from pathlib import Path


def clean_arabic(text: str) -> str:
    """تنظيف النص العربي من المسافات الزائدة والرموز."""
    text = re.sub(r'\s+', ' ', text)
    text = text.strip()
    return text


def extract_toc(doc: fitz.Document) -> list:
    """استخلاص فهرس المحتويات (TOC) من الكتاب."""
    toc = doc.get_toc(simple=False)
    entries = []
    for item in toc:
        if len(item) >= 3:
            level, title, page = item[0], item[1], item[2]
            entries.append({
                "level": level,
                "title": clean_arabic(title),
                "page": page,
            })
    return entries


def find_toc_from_text(doc: fitz.Document, search_pages: int = 15) -> list:
    """
    محاولة اكتشاف فهرس المحتويات نصياً إذا لم يكن منظماً في PDF.
    يبحث في أول 15 صفحة عن كلمات مفتاحية مثل 'المحتويات' أو 'الفهرس'.
    """
    toc_markers = ['المحتويات', 'الفهرس', 'Contents', 'Table of Contents', 'فهرس']
    chapter_patterns = [
        r'^الوحدة\s+(الأولى|الثانية|الثالثة|الرابعة|الخامسة|[0-9]+)',
        r'^الفصل\s+(الأول|الثاني|الثالث|الرابع|الخامس|[0-9]+)',
        r'^الدرس\s+',
        r'^Unit\s+[0-9]+',
        r'^Chapter\s+[0-9]+',
        r'^Lesson\s+[0-9]+',
    ]

    found_toc_page = None
    candidate_lines = []

    for pnum in range(min(search_pages, len(doc))):
        page = doc.load_page(pnum)
        text = page.get_text()
        if any(m in text for m in toc_markers):
            found_toc_page = pnum
            # Extract lines after the marker
            for line in text.split('\n'):
                line = clean_arabic(line)
                if not line:
                    continue
                # A TOC line typically has text + page number
                if re.search(r'\d+\s*$', line) and len(line) > 10:
                    candidate_lines.append({
                        "raw": line,
                        "page": pnum + 1,
                    })
            break

    return {
        "toc_page": found_toc_page,
        "lines": candidate_lines,
    }


def detect_book_structure(doc: fitz.Document, sample_pages: int = 200) -> dict:
    """
    يمر على كل صفحات الكتاب ويتعرف على:
    - عناوين الوحدات
    - عناوين الفصول
    - عناوين الدروس

    يأخذ العنوان من السطر الذي فيه الكلمة المفتاحية + السطر التالي إن كان العنوان فارغاً.
    """
    patterns = {
        'unit_ar': re.compile(r'الوحدة\s+(\S+)[\s:：-]*(.*)'),
        'chapter_ar': re.compile(r'الفصل\s+(\S+)[\s:：-]*(.*)'),
        'lesson_ar': re.compile(r'الدرس\s+(\S+)[\s:：-]*(.*)'),
        'unit_en': re.compile(r'Unit\s+(\d+)[\s:：-]*(.*)', re.IGNORECASE),
        'chapter_en': re.compile(r'Chapter\s+(\d+)[\s:：-]*(.*)', re.IGNORECASE),
    }

    hits = {k: [] for k in patterns}
    total_pages = len(doc)
    # افحص كل صفحة (أو حتى 200 صفحة موزعة لو أكبر)
    step = 1 if total_pages <= sample_pages else max(1, total_pages // sample_pages)

    seen_keys = set()  # لتجنب تكرار نفس الوحدة على صفحات متجاورة

    for pnum in range(0, total_pages, step):
        try:
            page = doc.load_page(pnum)
        except Exception:
            continue
        text = page.get_text()
        lines = [clean_arabic(l) for l in text.split('\n')]
        # فحص أول 8 سطور (الغالب في أعلى الصفحة)
        for idx, line in enumerate(lines[:8]):
            for key, pat in patterns.items():
                m = pat.match(line)
                if m:
                    number = m.group(1)
                    same_line_title = clean_arabic(m.group(2))[:100] if m.lastindex >= 2 else ""
                    # خذ السطر التالي كعنوان إن كان عنوان نفس السطر فارغاً
                    next_line_title = ""
                    if not same_line_title and idx + 1 < len(lines):
                        next_line_title = lines[idx + 1][:100]
                    # السطر الذي بعده أيضاً (قد يكون العنوان مستمرا)
                    extra_title = ""
                    if idx + 2 < len(lines):
                        extra_title = lines[idx + 2][:100]

                    title = same_line_title or next_line_title
                    unique_key = (key, number, title)
                    # تجنب التكرار إذا ظهرت نفس الوحدة في صفحات متجاورة (رأس كل صفحة)
                    if unique_key in seen_keys:
                        continue
                    # تجنب التكرار إذا ظهرت الوحدة بنفس الرقم قبل صفحتين
                    recent = [h for h in hits[key] if h['number'] == number and pnum + 1 - h['page'] < 3]
                    if recent:
                        continue
                    seen_keys.add(unique_key)
                    hits[key].append({
                        "page": pnum + 1,
                        "number": number,
                        "title": title,
                        "title_next": extra_title if next_line_title else "",
                    })

    return hits


# خريطة تصحيح الحروف العربية المشوهة (مبنية بالتجربة لخطوط الكتب السودانية)
ARABIC_FIX_MAP = {
    'ال{': 'الص',
    '{ص': 'صص',
    'ال~': 'ال',
    'بùس': 'بس',
    'ùس': 'س',
    '8ص': 'ص',
    'العنا8': 'العناص',
    'ي{س': 'يس',
    'الأوىل': 'الأولى',
    'الث{اني': 'الثاني',
    'الث{اين': 'الثاني',
    'الر}': 'الر',
    'ال}': 'ال',
    'الxص': 'الص',
    'ا9': 'ا',
    'و9': 'و',
    'ا_': 'ا',
    'ب_': 'ب',
}


def normalize_arabic(text: str) -> str:
    """تطبيق قاموس التصحيحات على النص المشوه."""
    for bad, good in ARABIC_FIX_MAP.items():
        text = text.replace(bad, good)
    # إزالة الحروف اللاتينية المعزولة وسط كلمات عربية
    text = re.sub(r'([\u0600-\u06FF])[a-zA-Z](?=[\u0600-\u06FF])', r'\1', text)
    return text


def assess_extraction_quality(text: str) -> dict:
    """
    تقييم جودة استخلاص النص العربي.
    يحسب نسبة الحروف العربية النظيفة والمشوهة.
    """
    if not text:
        return {"score": 0, "rating": "empty"}
    arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text))
    suspicious_chars = len(re.findall(r'[{}~ù8xX_]', text))
    latin_in_arabic = len(re.findall(r'[\u0600-\u06FF][a-zA-Z][\u0600-\u06FF]', text))
    total_meaningful = arabic_chars + len(re.findall(r'[a-zA-Z]', text))
    if total_meaningful == 0:
        return {"score": 0, "rating": "empty"}
    # نسبة التشوه
    garble_ratio = (suspicious_chars + latin_in_arabic) / max(1, arabic_chars)
    if garble_ratio < 0.01:
        rating = "clean"
    elif garble_ratio < 0.05:
        rating = "mostly_clean"
    elif garble_ratio < 0.15:
        rating = "garbled"
    else:
        rating = "very_garbled"
    return {
        "arabic_chars": arabic_chars,
        "suspicious_chars": suspicious_chars,
        "garble_ratio": round(garble_ratio, 3),
        "rating": rating,
    }


def extract_first_pages_text(doc: fitz.Document, n: int = 3) -> str:
    """استخلاص نص أول N صفحات (للمقدمة والأهداف)."""
    text = []
    for i in range(min(n, len(doc))):
        try:
            text.append(doc.load_page(i).get_text())
        except Exception:
            continue
    return '\n\n'.join(text)


def detect_language(text: str) -> str:
    """تحديد اللغة الأساسية للكتاب."""
    arabic_chars = len(re.findall(r'[\u0600-\u06FF]', text))
    latin_chars = len(re.findall(r'[a-zA-Z]', text))
    if arabic_chars > latin_chars * 2:
        return 'ar'
    elif latin_chars > arabic_chars * 2:
        return 'en'
    else:
        return 'mixed'


def detect_text_quality(doc: fitz.Document) -> dict:
    """تحديد هل الكتاب نصي (text-based) أم ممسوح (scanned/needs OCR)."""
    total_text_chars = 0
    pages_sampled = min(10, len(doc))
    for i in range(pages_sampled):
        try:
            total_text_chars += len(doc.load_page(i).get_text())
        except Exception:
            pass
    avg_per_page = total_text_chars / max(1, pages_sampled)
    return {
        "avg_chars_per_page": int(avg_per_page),
        "quality": "text" if avg_per_page > 200 else "scanned",
        "needs_ocr": avg_per_page < 50,
    }


def extract_book(pdf_path: Path) -> dict:
    """الاستخلاص الرئيسي."""
    doc = fitz.open(str(pdf_path))

    file_stem = pdf_path.stem  # مثل SEC-G11-CHE
    parts = file_stem.split('-')

    result = {
        "meta": {
            "file": str(pdf_path.name),
            "code": file_stem,
            "stage": parts[0] if parts else None,
            "grade": parts[1] if len(parts) > 1 else None,
            "subject": parts[2] if len(parts) > 2 else None,
            "variant": '-'.join(parts[3:]) if len(parts) > 3 else None,
            "page_count": len(doc),
        },
        "quality": detect_text_quality(doc),
        "first_pages_preview": "",
        "structure": {},
        "toc": [],
        "toc_from_text": {},
    }

    # اللغة من أول النص
    first_text = extract_first_pages_text(doc, 3)
    result["meta"]["language"] = detect_language(first_text)
    result["first_pages_preview"] = first_text[:500]

    # تقييم جودة الاستخلاص (من عينة 20 صفحة موزعة)
    sample_text = ""
    for i in range(0, len(doc), max(1, len(doc) // 20)):
        try:
            sample_text += doc.load_page(i).get_text()
        except Exception:
            pass
    result["extraction_quality"] = assess_extraction_quality(sample_text)

    # TOC رسمي (من bookmarks)
    result["toc"] = extract_toc(doc)

    # TOC من النص (احتياطي)
    if not result["toc"]:
        result["toc_from_text"] = find_toc_from_text(doc)

    # هيكل الوحدات والفصول
    result["structure"] = detect_book_structure(doc, sample_pages=100)

    # إحصائيات سريعة
    result["summary"] = {
        "units_detected": len(result["structure"].get("unit_ar", [])) + len(result["structure"].get("unit_en", [])),
        "chapters_detected": len(result["structure"].get("chapter_ar", [])) + len(result["structure"].get("chapter_en", [])),
        "lessons_detected": len(result["structure"].get("lesson_ar", [])),
        "has_toc": len(result["toc"]) > 0,
    }

    doc.close()
    return result


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: extract_book_structure.py <pdf_path> [output.json]")
        sys.exit(1)

    pdf_path = Path(sys.argv[1])
    if not pdf_path.exists():
        print(f"Error: {pdf_path} not found")
        sys.exit(1)

    output_path = Path(sys.argv[2]) if len(sys.argv) >= 3 else pdf_path.with_suffix('.structure.json')

    print(f"📖 قراءة {pdf_path.name} ...")
    result = extract_book(pdf_path)

    output_path.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"✅ حُفظ في {output_path}")
    print(f"\n--- ملخص ---")
    print(f"عدد الصفحات: {result['meta']['page_count']}")
    print(f"اللغة: {result['meta']['language']}")
    print(f"جودة النص: {result['quality']['quality']} ({result['quality']['avg_chars_per_page']} حرف/صفحة)")
    print(f"فهرس رسمي: {'نعم' if result['summary']['has_toc'] else 'لا'}")
    print(f"الوحدات المكتشفة: {result['summary']['units_detected']}")
    print(f"الفصول المكتشفة: {result['summary']['chapters_detected']}")
    print(f"الدروس المكتشفة: {result['summary']['lessons_detected']}")
