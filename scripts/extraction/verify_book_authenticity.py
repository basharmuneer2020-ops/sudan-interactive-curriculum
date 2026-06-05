"""
التحقق من أصالة كتاب PDF — هل هو كتاب وزاري رسمي أم مذكرة تدريس خاصة؟

علامات الكتاب الوزاري:
- "وزارة التربية والتعليم"
- "المركز القومي للمناهج"
- "جمهورية السودان"
- "بخت الرضا"

علامات المذكرة غير الرسمية:
- تكرار نفس العنوان/الرأس في كل صفحة
- أرقام هواتف واتساب
- أسماء مؤسسات تدريس خاصة
- عبارات: "يمنع التصوير والنسخ"، "سلسلة مذكرات"، "للإسناد الأكاديمي"
"""

import fitz
import json
import re
import sys
from collections import Counter
from pathlib import Path


OFFICIAL_MARKERS = [
    'وزارة التربية والتعليم',
    'المركز القومي للمناهج',
    'جمهورية السودان',
    'بخت الرضا',
    'بخت الرsا',
    'بخت الرzا',
    'المركز القومي للمنـاهج',
    'Ministry of Education',
    'National Centre for Curriculum',
]

UNOFFICIAL_MARKERS = [
    'سلسلة مذكرات',
    'للإسناد الأكاديمي',
    'لالسناد الأكاديمي',
    'يمنع التصوير',
    'يمنع النسخ',
    'واتس',
    'WhatsApp',
    'مؤسسة تدريس',
    'مركز تقوية',
    'مذكرة شرح',
    'ملخص شامل',
    'المفيد في',
    'الرائد في',
]


def check_authenticity(pdf_path: Path, max_pages: int = 30) -> dict:
    """فحص شامل لأصالة الكتاب."""
    doc = fitz.open(str(pdf_path))
    total_pages = len(doc)
    pages_to_check = min(max_pages, total_pages)

    full_text = ""
    page_top_lines = []  # أول سطر من كل صفحة
    for i in range(pages_to_check):
        try:
            page_text = doc.load_page(i).get_text()
            full_text += page_text + "\n"
            # أول 3 سطور غير فارغة من كل صفحة للكشف عن رأس متكرر
            non_empty = [l.strip() for l in page_text.split('\n') if l.strip()]
            if non_empty:
                for line in non_empty[:3]:
                    page_top_lines.append(line[:80])
        except Exception:
            pass

    # 1) فحص علامات الرسمية
    official_hits = []
    for marker in OFFICIAL_MARKERS:
        if marker in full_text:
            official_hits.append(marker)

    # 2) فحص علامات عدم الرسمية
    unofficial_hits = []
    for marker in UNOFFICIAL_MARKERS:
        if marker in full_text:
            unofficial_hits.append(marker)

    # 3) كشف الرؤوس المتكررة (bad sign لو كتاب مذكرة)
    line_counts = Counter(page_top_lines)
    repeating_headers = [(line, count) for line, count in line_counts.most_common(5) if count >= 5 and len(line) > 15]

    # 4) فحص أرقام الهواتف
    phone_patterns = re.findall(r'(?:\d{9,12}|\+\d{3}\d{8,10})', full_text)
    # إزالة السنوات والأرقام العادية (أكبر من 8 أرقام متتالية)
    real_phones = [p for p in phone_patterns if len(p) >= 9]

    # 5) أسماء المؤسسات
    institution_pattern = re.findall(r'مؤسسة\s+\S+\s+\S+|مركز\s+\S+\s+\S+|معهد\s+\S+', full_text)
    unique_institutions = list(set(institution_pattern))[:5]

    # 6) التقييم العام
    is_official = len(official_hits) >= 2 and len(unofficial_hits) == 0 and not repeating_headers
    is_likely_unofficial = (
        len(unofficial_hits) >= 2
        or len(repeating_headers) > 0
        or (len(real_phones) >= 3 and len(official_hits) == 0)
    )

    verdict = "غير مؤكد"
    confidence = 0.5
    if is_official:
        verdict = "كتاب وزاري رسمي"
        confidence = 0.95
    elif is_likely_unofficial:
        verdict = "مذكرة/ملخص غير رسمي"
        confidence = 0.9
    elif len(official_hits) >= 1:
        verdict = "محتمل رسمي"
        confidence = 0.7
    elif len(unofficial_hits) >= 1:
        verdict = "محتمل غير رسمي"
        confidence = 0.65

    doc.close()

    return {
        "file": str(pdf_path.name),
        "total_pages": total_pages,
        "pages_checked": pages_to_check,
        "verdict": verdict,
        "confidence": confidence,
        "official_markers": official_hits,
        "unofficial_markers": unofficial_hits,
        "repeating_headers": [{"text": h[0], "count": h[1]} for h in repeating_headers],
        "phone_numbers_found": real_phones[:5],
        "institutions_mentioned": unique_institutions,
    }


def verify_batch(pdf_paths: list) -> list:
    """فحص مجموعة كتب."""
    results = []
    for path in pdf_paths:
        path = Path(path)
        if not path.exists():
            results.append({"file": str(path), "error": "file not found"})
            continue
        try:
            r = check_authenticity(path)
            results.append(r)
        except Exception as e:
            results.append({"file": str(path.name), "error": str(e)})
    return results


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: verify_book_authenticity.py <pdf1> [pdf2] ...")
        sys.exit(1)

    results = verify_batch(sys.argv[1:])

    print(f"\n{'='*70}")
    print(f"تقرير التحقق من أصالة {len(results)} كتاب")
    print('='*70)

    for r in results:
        print(f"\n📖 {r.get('file', 'N/A')}")
        if 'error' in r:
            print(f"   ❌ خطأ: {r['error']}")
            continue

        verdict = r['verdict']
        icon = "✅" if "رسمي" in verdict and "غير" not in verdict else "🚨" if "غير رسمي" in verdict or "مذكرة" in verdict else "⚠️"
        print(f"   {icon} {verdict} (ثقة: {r['confidence']*100:.0f}%)")

        if r['official_markers']:
            print(f"   📗 علامات رسمية: {', '.join(r['official_markers'][:3])}")
        if r['unofficial_markers']:
            print(f"   📕 علامات غير رسمية: {', '.join(r['unofficial_markers'][:3])}")
        if r['repeating_headers']:
            print(f"   🔁 رؤوس متكررة:")
            for h in r['repeating_headers'][:2]:
                print(f"      × {h['count']} مرة: {h['text'][:60]}")
        if r['institutions_mentioned']:
            print(f"   🏢 مؤسسات: {', '.join(r['institutions_mentioned'][:2])}")
        if r['phone_numbers_found']:
            print(f"   📞 أرقام: {', '.join(r['phone_numbers_found'][:3])}")

    # حفظ النتيجة
    out_path = Path("docs/curriculum-analysis/authenticity_report.json")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f"\n💾 حُفظ التقرير في {out_path}")
