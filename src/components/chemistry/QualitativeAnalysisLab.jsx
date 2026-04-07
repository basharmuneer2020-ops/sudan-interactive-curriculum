import { useState, useEffect, useCallback } from "react";

// =============================================
// الوحدة الثالثة: التحليل الكيميائي الكيفي
// المنهج السوداني التفاعلي - الصف الثالث ثانوي
// =============================================

// ========== DATA ==========
const LESSONS = [
  { id: "intro", title: "مقدمة التحليل الكيفي", icon: "🔬" },
  { id: "acidRadicals", title: "الشقوق الحمضية", icon: "⚗️" },
  { id: "group1", title: "المجموعة الأولى (HCl)", icon: "🧪" },
  { id: "group2", title: "المجموعة الثانية (H₂SO₄)", icon: "🧫" },
  { id: "group3", title: "المجموعة الثالثة (العامة)", icon: "🔎" },
  { id: "cations", title: "الشقوق القاعدية", icon: "⚡" },
  { id: "flameTest", title: "كشف اللهب", icon: "🔥" },
  { id: "flowchart", title: "المخطط العام للكشف", icon: "📊" },
  { id: "virtualLab", title: "المعمل الافتراضي", icon: "🏗️" },
  { id: "quiz", title: "التمارين والاختبارات", icon: "📝" },
];

const SALT_TYPES = [
  {
    type: "متعادل",
    desc: "ناتج من تفاعل حمض قوي + قاعدة قوية",
    example: "NaCl",
    acid: "HCl (قوي)",
    base: "NaOH (قوية)",
    color: "#4CAF50",
    indicator: "لا يتغير لون الدليل",
  },
  {
    type: "حمضي",
    desc: "ناتج من تفاعل حمض قوي + قاعدة ضعيفة",
    example: "NH₄NO₃",
    acid: "HNO₃ (قوي)",
    base: "NH₄OH (ضعيفة)",
    color: "#f44336",
    indicator: "يتحول الدليل للون الحمضي",
  },
  {
    type: "قاعدي",
    desc: "ناتج من تفاعل حمض ضعيف + قاعدة قوية",
    example: "CH₃COONa",
    acid: "CH₃COOH (ضعيف)",
    base: "NaOH (قوية)",
    color: "#2196F3",
    indicator: "يتحول الدليل للون القاعدي",
  },
];

const GROUP1_ANIONS = [
  {
    name: "الكربونات / البيكربونات",
    formula: "CO₃²⁻ / HCO₃⁻",
    reagent: "HCl المخفف",
    observation: "يتصاعد غاز CO₂ عديم اللون يعكر ماء الجير",
    equation: "CO₃²⁻ + 2HCl → 2Cl⁻ + H₂O + CO₂↑",
    gasColor: "#e0e0e0",
    confirmTest: "إضافة محلول كبريتات المغنيسيوم أو كلوريد الزئبق",
    bubbleColor: "rgba(200,200,200,0.6)",
  },
  {
    name: "الكبريتيد",
    formula: "S²⁻",
    reagent: "HCl المخفف",
    observation: "يتصاعد غاز H₂S ذو رائحة البيض الفاسد، يسوّد ورقة مبللة بخلات الرصاص",
    equation: "S²⁻ + 2HCl → 2Cl⁻ + H₂S↑",
    gasColor: "#fff9c4",
    confirmTest: "محلول خلات الرصاص (راسب أسود) أو نترات الفضة (راسب أسود)",
    bubbleColor: "rgba(255,249,196,0.7)",
  },
  {
    name: "الكبريتيت",
    formula: "SO₃²⁻",
    reagent: "HCl المخفف",
    observation: "يتصاعد غاز SO₂ ذو رائحة نفاذة خانقة، يحوّل ثنائي كرومات البوتاسيوم للأخضر",
    equation: "SO₃²⁻ + 2HCl → 2Cl⁻ + H₂O + SO₂↑",
    gasColor: "#fff3e0",
    confirmTest: "اختزال محلول ثنائي كرومات البوتاسيوم المحمض (يتحول للأخضر)",
    bubbleColor: "rgba(255,243,224,0.7)",
  },
  {
    name: "النتريت",
    formula: "NO₂⁻",
    reagent: "HCl المخفف",
    observation: "أبخرة بنية من NO₂ عند فوهة الأنبوبة (NO عديم اللون يتأكسد)",
    equation: "NO₂⁻ + HCl → HNO₂ + Cl⁻  ثم  3HNO₂ → HNO₃ + 2NO↑ + H₂O",
    gasColor: "#8d6e63",
    confirmTest: "اختزال محلول بيرمنجنات البوتاسيوم البنفسجي المحمض (يختفي اللون)",
    bubbleColor: "rgba(141,110,99,0.5)",
  },
];

const GROUP2_ANIONS = [
  {
    name: "الكلوريد",
    formula: "Cl⁻",
    reagent: "H₂SO₄ المركز",
    observation: "يتصاعد غاز HCl يكوّن سحباً بيضاء مع محلول الأمونيا",
    equation: "2Cl⁻ + H₂SO₄ → 2HCl↑ + SO₄²⁻",
    confirmTests: [
      { test: "AgNO₃", result: "راسب أبيض من AgCl يذوب في NH₄OH", color: "#ffffff" },
      { test: "Pb(CH₃COO)₂", result: "راسب أبيض من PbCl₂ يذوب بالتسخين", color: "#ffffff" },
    ],
    vaporColor: "#f5f5f5",
  },
  {
    name: "البروميد",
    formula: "Br⁻",
    reagent: "H₂SO₄ المركز",
    observation: "أبخرة بنية محمرة (خليط HBr + Br₂ + SO₂)، تحول النشا للأصفر",
    equation: "2NaBr + H₂SO₄ → Na₂SO₄ + 2HBr↑",
    confirmTests: [
      { test: "AgNO₃", result: "راسب أبيض مصفر من AgBr قليل الذوبان في NH₄OH", color: "#fffde7" },
      { test: "Pb(CH₃COO)₂", result: "راسب أبيض من PbBr₂ يذوب بالتسخين", color: "#fff8e1" },
    ],
    vaporColor: "#bf360c",
  },
  {
    name: "اليوديد",
    formula: "I⁻",
    reagent: "H₂SO₄ المركز",
    observation: "أبخرة بنفسجية من I₂ تحول ورقة النشا المبللة إلى اللون الأزرق",
    equation: "2NaI + H₂SO₄ → Na₂SO₄ + 2HI↑",
    confirmTests: [
      { test: "AgNO₃", result: "راسب أصفر من AgI لا يذوب في NH₄OH أو HNO₃", color: "#ffeb3b" },
      { test: "Pb(CH₃COO)₂", result: "راسب أصفر من PbI₂ يذوب بالتسخين", color: "#fdd835" },
    ],
    vaporColor: "#7b1fa2",
  },
  {
    name: "النترات",
    formula: "NO₃⁻",
    reagent: "H₂SO₄ المركز + Cu",
    observation: "أبخرة بنية قاتمة من NO₂ + تجربة الحلقة السمراء",
    equation: "NaNO₃ + H₂SO₄ → HNO₃ + NaHSO₄",
    confirmTests: [
      { test: "تجربة الحلقة السمراء", result: "حلقة سمراء عند سطح الفصل بين المحلولين", color: "#5d4037" },
    ],
    vaporColor: "#795548",
  },
];

const GROUP3_ANIONS = [
  {
    name: "الكبريتات",
    formula: "SO₄²⁻",
    tests: [
      { reagent: "BaCl₂", result: "راسب أبيض من BaSO₄ لا يذوب في الحموض المعدنية", color: "#ffffff" },
      { reagent: "Pb(CH₃COO)₂", result: "راسب أبيض من PbSO₄ لا يذوب في الحموض المعدنية", color: "#f5f5f5" },
      { reagent: "AgNO₃", result: "راسب أبيض من Ag₂SO₄", color: "#eeeeee" },
    ],
  },
  {
    name: "الفوسفات",
    formula: "HPO₄²⁻",
    tests: [
      { reagent: "BaCl₂", result: "راسب أبيض من BaHPO₄ يذوب في الحموض المعدنية المخففة", color: "#ffffff" },
      { reagent: "AgNO₃", result: "راسب أصفر من Ag₃PO₄ يذوب في هيدروكسيد الأمونيوم وحمض النتريك", color: "#fff176" },
    ],
  },
];

const CATIONS = [
  {
    name: "أيون الفضة",
    formula: "Ag⁺",
    tests: [
      { reagent: "HCl المخفف", result: "راسب أبيض من AgCl يتلون بالبنفسجي عند التعرض للضوء", precipColor: "#e8e8f0" },
      { reagent: "K₂CrO₄", result: "راسب أحمر من Ag₂CrO₄", precipColor: "#c62828" },
      { reagent: "H₂S", result: "راسب أسود من Ag₂S", precipColor: "#212121" },
    ],
    flameColor: null,
  },
  {
    name: "أيون النحاس (II)",
    formula: "Cu²⁺",
    tests: [
      { reagent: "H₂S", result: "راسب أسود من CuS", precipColor: "#212121" },
      { reagent: "NaOH", result: "راسب أزرق باهت من Cu(OH)₂", precipColor: "#90caf9" },
      { reagent: "NH₄OH", result: "راسب أزرق يذوب بالزيادة مكوناً محلولاً أزرق داكن", precipColor: "#1565c0" },
    ],
    flameColor: "#4caf50",
    flameName: "أخضر",
  },
  {
    name: "أيون الألمنيوم",
    formula: "Al³⁺",
    tests: [
      { reagent: "NH₄OH", result: "راسب أبيض جلاتيني من Al(OH)₃ يذوب في الحموض والقلويات", precipColor: "#f5f5f5" },
      { reagent: "NaOH", result: "راسب أبيض من Al(OH)₃ يذوب بإضافة المزيد من القلوي", precipColor: "#eeeeee" },
    ],
    flameColor: null,
  },
  {
    name: "أيون الكالسيوم",
    formula: "Ca²⁺",
    tests: [
      { reagent: "(NH₄)₂CO₃", result: "راسب أبيض من CaCO₃ يذوب في الحموض المعدنية المخففة", precipColor: "#ffffff" },
      { reagent: "(NH₄)₂C₂O₄", result: "راسب أبيض من CaC₂O₄ يذوب في الحموض المعدنية المخففة", precipColor: "#fafafa" },
      { reagent: "H₂SO₄", result: "راسب أبيض من CaSO₄", precipColor: "#f5f5f5" },
    ],
    flameColor: "#e53935",
    flameName: "أحمر طوبي",
  },
];

const FLAME_TEST_DATA = [
  { ion: "Cu²⁺", name: "النحاس", color: "#4caf50", flameName: "أخضر" },
  { ion: "Ca²⁺", name: "الكالسيوم", color: "#e53935", flameName: "أحمر طوبي" },
  { ion: "Na⁺", name: "الصوديوم", color: "#ffd600", flameName: "أصفر ذهبي" },
  { ion: "K⁺", name: "البوتاسيوم", color: "#9c27b0", flameName: "بنفسجي" },
];

const QUIZ_QUESTIONS = [
  {
    q: "عند إضافة محلول نترات الفضة إلى محلول ملح ما، يتكون راسب أبيض يذوب تماماً في هيدروكسيد الأمونيوم. الملح المجهول هو:",
    options: ["ملح البروميد", "ملح الكلوريد", "ملح اليوديد", "ملح النترات"],
    correct: 1,
    explanation: "راسب AgCl الأبيض يذوب في NH₄OH، بينما AgBr يذوب قليلاً و AgI لا يذوب",
  },
  {
    q: "الغاز الذي يعكر ماء الجير هو:",
    options: ["غاز CO₂", "غاز H₂S", "غاز SO₂", "غاز HCl"],
    correct: 0,
    explanation: "CO₂ + Ca(OH)₂ → CaCO₃↓ + H₂O (راسب أبيض يعكر ماء الجير)",
  },
  {
    q: "عند استخدام كشف اللهب فإن اللهب غير المضيء عندما يتلون باللون البنفسجي يدل على وجود أيون:",
    options: ["Cu²⁺", "Na⁺", "Ca²⁺", "K⁺"],
    correct: 3,
    explanation: "أيون البوتاسيوم K⁺ يكسب اللهب لوناً بنفسجياً مميزاً",
  },
  {
    q: "الملح الناتج من تفاعل حمض قوي وقاعدة ضعيفة يكون محلوله في الماء:",
    options: ["قاعدياً", "حمضياً", "متعادلاً", "لا يذوب في الماء"],
    correct: 1,
    explanation: "لأن الحمض القوي تام التأين والقاعدة الضعيفة غير تامة التأين، فتزيد أيونات H₃O⁺ ويصبح المحلول حمضياً",
  },
  {
    q: "تُستخدم تجربة الحلقة السمراء للكشف عن أيون:",
    options: ["الكبريتيت SO₃²⁻", "الكربونات CO₃²⁻", "النترات NO₃⁻", "الكلوريد Cl⁻"],
    correct: 2,
    explanation: "تجربة الحلقة السمراء خاصة بالكشف عن أيون النترات NO₃⁻ باستخدام FeSO₄ و H₂SO₄ المركز",
  },
  {
    q: "الكاشف المستخدم للمجموعة الثانية من الشقوق الحمضية هو:",
    options: ["HCl المخفف", "H₂SO₄ المركز", "NaOH", "AgNO₃"],
    correct: 1,
    explanation: "حمض الكبريتيك المركز يطرد الحموض الأقل ثباتاً من أملاحها ويكشف عن Cl⁻, Br⁻, I⁻, NO₃⁻",
  },
  {
    q: "عند إضافة محلول كلوريد الباريوم إلى محلول ملح الكبريتات يتكون:",
    options: ["راسب أبيض يذوب في الحموض", "راسب أبيض لا يذوب في الحموض المعدنية", "راسب أصفر", "لا يحدث تفاعل"],
    correct: 1,
    explanation: "Na₂SO₄ + BaCl₂ → BaSO₄↓ + 2NaCl  (كبريتات الباريوم لا تذوب في الحموض المعدنية)",
  },
  {
    q: "هيدروكسيد الألمنيوم Al(OH)₃ يتميز بأنه:",
    options: ["قاعدي فقط", "حمضي فقط", "متردد (أمفوتيري)", "لا يتفاعل مع الحموض أو القواعد"],
    correct: 2,
    explanation: "هيدروكسيد الألمنيوم متردد الخواص: يذوب في الحموض (يتفاعل كقاعدة) ويذوب في القلويات (يتفاعل كحمض)",
  },
];

// ========== COMPONENTS ==========

// --- Animated Test Tube ---
function TestTube({ liquid = "#90caf9", level = 70, precipitate = null, gas = null, label = "", bubbles = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "0 12px" }}>
      <div style={{ position: "relative", width: 50, height: 140 }}>
        {/* Tube body */}
        <div style={{
          position: "absolute", bottom: 0, width: 50, height: 130,
          border: "3px solid #78909c", borderTop: "none",
          borderRadius: "0 0 20px 20px", overflow: "hidden", background: "#fafafa",
        }}>
          {/* Liquid */}
          <div style={{
            position: "absolute", bottom: 0, width: "100%", height: `${level}%`,
            background: liquid, transition: "all 0.8s ease",
            borderRadius: "0 0 17px 17px",
          }}>
            {/* Bubbles animation */}
            {bubbles && (
              <div style={{ position: "absolute", width: "100%", height: "100%" }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    position: "absolute",
                    width: 6, height: 6, borderRadius: "50%",
                    background: gas || "rgba(255,255,255,0.6)",
                    left: `${20 + i * 25}%`,
                    animation: `bubbleUp ${1.5 + i * 0.3}s infinite ease-in`,
                    bottom: 0,
                  }} />
                ))}
              </div>
            )}
          </div>
          {/* Precipitate */}
          {precipitate && (
            <div style={{
              position: "absolute", bottom: 0, width: "100%", height: "20%",
              background: precipitate, borderRadius: "0 0 17px 17px",
              transition: "all 0.5s ease",
            }} />
          )}
        </div>
        {/* Tube opening */}
        <div style={{
          position: "absolute", top: 0, width: 56, left: -3,
          height: 12, borderRadius: "4px 4px 0 0",
          border: "3px solid #78909c", borderBottom: "none",
          background: "#eceff1",
        }} />
        {/* Gas rising */}
        {gas && (
          <div style={{
            position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)",
            width: 30, height: 25, borderRadius: "50%",
            background: gas, opacity: 0.5,
            animation: "gasRise 2s infinite ease-out",
          }} />
        )}
      </div>
      <span style={{ fontSize: 11, marginTop: 6, color: "#455a64", textAlign: "center", maxWidth: 80 }}>{label}</span>
    </div>
  );
}

// --- Flame Animation ---
function FlameAnimation({ color = "#ffd600", size = 120 }) {
  return (
    <div style={{ position: "relative", width: size, height: size * 1.5, margin: "0 auto" }}>
      {/* Bunsen burner base */}
      <div style={{
        position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: size * 0.3, height: size * 0.6,
        background: "linear-gradient(to bottom, #90a4ae, #607d8b)",
        borderRadius: "4px 4px 8px 8px",
      }} />
      {/* Flame outer */}
      <div style={{
        position: "absolute", bottom: size * 0.55, left: "50%", transform: "translateX(-50%)",
        width: size * 0.4, height: size * 0.7,
        background: `radial-gradient(ellipse at bottom, ${color} 0%, ${color}88 40%, transparent 70%)`,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        animation: "flicker 0.3s infinite alternate",
        filter: `drop-shadow(0 0 ${size * 0.15}px ${color})`,
      }} />
      {/* Flame inner */}
      <div style={{
        position: "absolute", bottom: size * 0.55, left: "50%", transform: "translateX(-50%)",
        width: size * 0.2, height: size * 0.45,
        background: `radial-gradient(ellipse at bottom, #fff 0%, ${color}cc 60%, transparent 100%)`,
        borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
        animation: "flicker 0.2s infinite alternate",
      }} />
    </div>
  );
}

// --- Flowchart Node ---
function FlowNode({ text, color = "#1976d2", onClick, active, small }) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: small ? "6px 10px" : "10px 16px",
        background: active ? color : "#fff",
        color: active ? "#fff" : color,
        border: `2px solid ${color}`,
        borderRadius: 10,
        cursor: onClick ? "pointer" : "default",
        fontSize: small ? 11 : 13,
        fontWeight: 600,
        textAlign: "center",
        transition: "all 0.3s",
        minWidth: small ? 80 : 120,
        boxShadow: active ? `0 4px 12px ${color}44` : "0 1px 4px rgba(0,0,0,0.1)",
      }}
    >
      {text}
    </div>
  );
}

function Arrow({ vertical = true }) {
  return (
    <div style={{
      display: "flex", justifyContent: "center", alignItems: "center",
      padding: vertical ? "4px 0" : "0 4px",
    }}>
      <span style={{ fontSize: 18, color: "#90a4ae" }}>{vertical ? "⬇" : "⬅"}</span>
    </div>
  );
}

// ========== LESSON COMPONENTS ==========

function IntroLesson() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedSalt, setSelectedSalt] = useState(null);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#0d47a1", margin: "0 0 12px", fontSize: 22 }}>التحليل الكيميائي الكيفي</h2>
        <h3 style={{ color: "#1565c0", margin: "0 0 16px", fontSize: 16, fontWeight: 400 }}>Qualitative Chemical Analysis</h3>
        <p style={{ color: "#1a237e", lineHeight: 1.9, fontSize: 15 }}>
          هو التحليل الذي يهتم بالتعرف على مكونات المادة دون التعرض لتعيين كميتها.
          ينقسم التحليل الكيميائي إلى قسمين: <strong>التحليل الكيفي</strong> (ما هي المكونات؟) و<strong>التحليل الكمي</strong> (كم كميتها؟).
        </p>
      </div>

      {/* Types of tests */}
      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        {["الاختبارات الجافة (Dry-tests)", "الاختبارات الرطبة (Wet-tests)"].map((t, i) => (
          <div key={i} onClick={() => setActiveTab(i)} style={{
            flex: 1, minWidth: 200, padding: 16, borderRadius: 12,
            background: activeTab === i ? (i === 0 ? "#ff7043" : "#42a5f5") : "#f5f5f5",
            color: activeTab === i ? "#fff" : "#333",
            cursor: "pointer", transition: "all 0.3s", textAlign: "center",
            fontWeight: 600, fontSize: 14,
          }}>
            {t}
          </div>
        ))}
      </div>
      <div style={{ background: "#fafafa", borderRadius: 12, padding: 16, marginBottom: 24, minHeight: 60 }}>
        {activeTab === 0 ? (
          <p style={{ margin: 0, lineHeight: 1.8 }}>تجرى على المادة الصلبة مثل <strong>كشف اللهب</strong>. يُستخدم لتأكيد وجود أيون فلز ما بناءً على لون اللهب المميز.</p>
        ) : (
          <p style={{ margin: 0, lineHeight: 1.8 }}>تجرى على محاليل المواد. تعتمد على إضافة كواشف محددة لمحلول الملح وملاحظة التغيرات (راسب، غاز، لون).</p>
        )}
      </div>

      {/* Salt definition */}
      <div style={{ background: "#fff3e0", borderRadius: 16, padding: 20, marginBottom: 20, borderRight: "5px solid #ff9800" }}>
        <h3 style={{ color: "#e65100", margin: "0 0 10px", fontSize: 17 }}>تعريف الملح</h3>
        <p style={{ lineHeight: 1.9, margin: 0, fontSize: 14 }}>
          مركب كيميائي يتكون من شقين: أحدهما موجب الشحنة (أيون فلز أو أمونيوم) يسمى <strong style={{ color: "#1565c0" }}>الشق القاعدي</strong>، والآخر سالب الشحنة يسمى <strong style={{ color: "#c62828" }}>الشق الحمضي</strong>.
        </p>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, margin: "16px 0", flexWrap: "wrap" }}>
          <div style={{ padding: "8px 16px", background: "#c62828", color: "#fff", borderRadius: 8, fontWeight: 600 }}>شق حمضي (أنيون) ⁻</div>
          <span style={{ fontSize: 20 }}>+</span>
          <div style={{ padding: "8px 16px", background: "#1565c0", color: "#fff", borderRadius: 8, fontWeight: 600 }}>شق قاعدي (كاتيون) ⁺</div>
          <span style={{ fontSize: 20 }}>→</span>
          <div style={{ padding: "8px 16px", background: "#2e7d32", color: "#fff", borderRadius: 8, fontWeight: 600 }}>ملح</div>
        </div>
      </div>

      {/* Salt hydrolysis */}
      <h3 style={{ color: "#1a237e", fontSize: 17, marginBottom: 12 }}>تميّؤ الملح (التحلل المائي)</h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12, marginBottom: 16 }}>
        {SALT_TYPES.map((s, i) => (
          <div
            key={i}
            onClick={() => setSelectedSalt(selectedSalt === i ? null : i)}
            style={{
              padding: 16, borderRadius: 14,
              border: `3px solid ${s.color}`,
              background: selectedSalt === i ? `${s.color}15` : "#fff",
              cursor: "pointer", transition: "all 0.3s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{ width: 14, height: 14, borderRadius: "50%", background: s.color }} />
              <strong style={{ color: s.color, fontSize: 16 }}>ملح {s.type}</strong>
            </div>
            <p style={{ fontSize: 13, color: "#555", margin: "4px 0", lineHeight: 1.7 }}>{s.desc}</p>
            <div style={{ background: "#f5f5f5", borderRadius: 8, padding: 8, fontSize: 13, textAlign: "center", fontWeight: 600 }}>
              مثال: {s.example}
            </div>
            {selectedSalt === i && (
              <div style={{ marginTop: 10, padding: 10, background: "#fafafa", borderRadius: 8, fontSize: 13, lineHeight: 1.8 }}>
                <div>الحمض: <strong>{s.acid}</strong></div>
                <div>القاعدة: <strong>{s.base}</strong></div>
                <div style={{ color: s.color, fontWeight: 600, marginTop: 6 }}>{s.indicator}</div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AcidRadicalsLesson() {
  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#880e4f", margin: "0 0 12px", fontSize: 22 }}>الشقوق الحمضية للأملاح غير العضوية</h2>
        <p style={{ lineHeight: 1.9, color: "#4a148c", fontSize: 14 }}>
          الشق الحمضي هو الأيون السالب الذي ينتج عن تأين الحمض في الماء. تم تقسيم الشقوق الحمضية إلى <strong>ثلاث مجموعات تحليلية</strong> على أساس ثبات الحموض المشتقة منها.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        {[
          {
            title: "المجموعة الأولى",
            subtitle: "مجموعة حمض الهيدروكلوريك المخفف",
            reagent: "HCl المخفف",
            anions: "CO₃²⁻, HCO₃⁻, S²⁻, SO₃²⁻, NO₂⁻",
            color: "#e91e63",
            desc: "الحموض الأقل ثباتاً التي يطردها HCl المخفف",
          },
          {
            title: "المجموعة الثانية",
            subtitle: "مجموعة حمض الكبريتيك المركز",
            reagent: "H₂SO₄ المركز",
            anions: "Cl⁻, Br⁻, I⁻, NO₃⁻",
            color: "#9c27b0",
            desc: "حموض أكثر ثباتاً تحتاج حمضاً أقوى لطردها",
          },
          {
            title: "المجموعة الثالثة",
            subtitle: "المجموعة العامة",
            reagent: "كواشف خاصة لكل شق",
            anions: "SO₄²⁻, HPO₄²⁻",
            color: "#673ab7",
            desc: "لا تتأثر بالكواشف العامة، يُكشف عنها في محاليلها",
          },
        ].map((g, i) => (
          <div key={i} style={{
            borderRadius: 16, overflow: "hidden",
            border: `2px solid ${g.color}20`,
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}>
            <div style={{ background: g.color, color: "#fff", padding: "14px 18px" }}>
              <h3 style={{ margin: 0, fontSize: 16 }}>{g.title}</h3>
              <p style={{ margin: "4px 0 0", fontSize: 12, opacity: 0.9 }}>{g.subtitle}</p>
            </div>
            <div style={{ padding: 16 }}>
              <div style={{ background: `${g.color}10`, borderRadius: 8, padding: 10, marginBottom: 10 }}>
                <strong style={{ fontSize: 12, color: g.color }}>الكاشف:</strong>
                <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{g.reagent}</div>
              </div>
              <div style={{ fontSize: 13, marginBottom: 8 }}><strong>الشقوق:</strong> {g.anions}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.7, margin: 0 }}>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24, background: "#e8f5e9", borderRadius: 14, padding: 18 }}>
        <h3 style={{ color: "#2e7d32", margin: "0 0 10px", fontSize: 16 }}>مبدأ الكشف عن الشقوق الحمضية</h3>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 12, flexWrap: "wrap", fontSize: 14, fontWeight: 600 }}>
          <div style={{ padding: "8px 14px", background: "#fff", borderRadius: 8 }}>الحمض الأكثر ثباتاً</div>
          <span>يطرد</span>
          <div style={{ padding: "8px 14px", background: "#fff", borderRadius: 8 }}>الحمض الأقل ثباتاً</div>
          <span>من أملاحه</span>
        </div>
        <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, direction: "ltr" }}>
          Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂↑
          <br />
          2NaCl + H₂SO₄ → Na₂SO₄ + 2HCl↑
        </div>
      </div>
    </div>
  );
}

function AnionGroupLesson({ groupNum, title, anions, reagentName, reagentColor }) {
  const [selected, setSelected] = useState(0);
  const [showReaction, setShowReaction] = useState(false);
  const a = anions[selected];

  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${reagentColor}15 0%, ${reagentColor}25 100%)`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: reagentColor, margin: "0 0 8px", fontSize: 20 }}>{title}</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#555" }}>الكاشف: <strong>{reagentName}</strong></p>
      </div>

      {/* Anion selector */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {anions.map((an, i) => (
          <button key={i} onClick={() => { setSelected(i); setShowReaction(false); }} style={{
            padding: "10px 16px", borderRadius: 10,
            border: selected === i ? `2px solid ${reagentColor}` : "2px solid #e0e0e0",
            background: selected === i ? `${reagentColor}15` : "#fff",
            color: selected === i ? reagentColor : "#333",
            cursor: "pointer", fontWeight: 600, fontSize: 13,
            transition: "all 0.3s", fontFamily: "inherit",
          }}>
            {an.name}
            <div style={{ fontSize: 11, fontWeight: 400, marginTop: 2 }}>{an.formula}</div>
          </button>
        ))}
      </div>

      {/* Experiment visualization */}
      <div style={{ background: "#fafafa", borderRadius: 16, padding: 20, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end", gap: 24, marginBottom: 16, flexWrap: "wrap" }}>
          <TestTube liquid="#e3f2fd" level={60} label="محلول الملح" />
          <div style={{ textAlign: "center", paddingBottom: 30 }}>
            <button onClick={() => setShowReaction(true)} style={{
              padding: "10px 20px", background: reagentColor, color: "#fff",
              border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14,
              fontWeight: 600, fontFamily: "inherit",
              boxShadow: `0 4px 12px ${reagentColor}44`,
            }}>
              أضف {reagentName} ⬇
            </button>
          </div>
          <TestTube
            liquid={showReaction ? (a.gasColor || "#e3f2fd") : "#e3f2fd"}
            level={60}
            gas={showReaction ? (a.bubbleColor || a.gasColor) : null}
            bubbles={showReaction}
            label={showReaction ? "بعد التفاعل" : "أنبوبة اختبار"}
          />
        </div>

        {showReaction && (
          <div style={{ animation: "fadeIn 0.5s ease" }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e0e0e0" }}>
              <h4 style={{ color: reagentColor, margin: "0 0 8px", fontSize: 15 }}>المشاهدة:</h4>
              <p style={{ margin: 0, lineHeight: 1.8, fontSize: 14 }}>{a.observation}</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, border: "1px solid #e0e0e0" }}>
              <h4 style={{ color: "#1565c0", margin: "0 0 8px", fontSize: 15 }}>المعادلة:</h4>
              <div style={{ direction: "ltr", textAlign: "center", fontSize: 14, fontWeight: 500, background: "#f5f5f5", padding: 10, borderRadius: 8 }}>
                {a.equation}
              </div>
            </div>
            <div style={{ background: "#e8f5e9", borderRadius: 12, padding: 16, border: "1px solid #c8e6c9" }}>
              <h4 style={{ color: "#2e7d32", margin: "0 0 8px", fontSize: 15 }}>التجربة التأكيدية:</h4>
              <p style={{ margin: 0, lineHeight: 1.8, fontSize: 14 }}>{a.confirmTest}</p>
            </div>
            {/* Confirm tests for group 2 */}
            {a.confirmTests && (
              <div style={{ marginTop: 12 }}>
                <h4 style={{ color: "#1565c0", margin: "0 0 8px", fontSize: 15 }}>التجارب التأكيدية:</h4>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {a.confirmTests.map((ct, ci) => (
                    <div key={ci} style={{ flex: 1, minWidth: 200, background: "#fff", borderRadius: 10, padding: 12, border: "1px solid #e0e0e0" }}>
                      <strong style={{ fontSize: 13 }}>مع {ct.test}:</strong>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                        <div style={{ width: 20, height: 20, borderRadius: "50%", background: ct.color, border: "1px solid #bbb" }} />
                        <span style={{ fontSize: 12, lineHeight: 1.6 }}>{ct.result}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Group3Lesson() {
  const [selected, setSelected] = useState(0);
  const a = GROUP3_ANIONS[selected];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #ede7f6 0%, #d1c4e9 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#4a148c", margin: "0 0 8px", fontSize: 20 }}>المجموعة الثالثة (المجموعة العامة)</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#555" }}>
          أملاح هذه المجموعة لا تتأثر بحمض الهيدروكلوريك المخفف أو الكبريتيك المركز. يتم الكشف عنها في محاليلها بكواشف خاصة.
        </p>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
        {GROUP3_ANIONS.map((an, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            flex: 1, padding: "12px", borderRadius: 10,
            border: selected === i ? "2px solid #7b1fa2" : "2px solid #e0e0e0",
            background: selected === i ? "#7b1fa215" : "#fff",
            cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
          }}>
            {an.name} ({an.formula})
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {a.tests.map((t, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e0e0e0", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: t.color, border: "2px solid #bbb", flexShrink: 0 }} />
            <div>
              <strong style={{ color: "#7b1fa2", fontSize: 14 }}>مع {t.reagent}:</strong>
              <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.7 }}>{t.result}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CationsLesson() {
  const [selected, setSelected] = useState(0);
  const c = CATIONS[selected];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#004d40", margin: "0 0 8px", fontSize: 20 }}>الكشف عن الشقوق القاعدية (الكاتيونات)</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#00695c", lineHeight: 1.8 }}>
          الشقوق القاعدية هي أيونات الفلزات الموجبة. تقسم إلى مجموعات تحليلية وفقاً للهيئة التي تترسب عليها كأملاح.
          سندرس: Ag⁺, Cu²⁺, Al³⁺, Ca²⁺
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {CATIONS.map((cat, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            padding: "10px 14px", borderRadius: 10,
            border: selected === i ? "2px solid #00897b" : "2px solid #e0e0e0",
            background: selected === i ? "#00897b15" : "#fff",
            cursor: "pointer", fontWeight: 600, fontSize: 13, fontFamily: "inherit",
          }}>
            {cat.formula} {cat.name}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {c.tests.map((t, i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 12, padding: 16, border: "1px solid #e0e0e0" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: t.precipColor, border: "2px solid #bbb", flexShrink: 0 }} />
              <div>
                <strong style={{ color: "#00695c", fontSize: 14 }}>مع {t.reagent}:</strong>
                <p style={{ margin: "4px 0 0", fontSize: 13, lineHeight: 1.7 }}>{t.result}</p>
              </div>
            </div>
          </div>
        ))}
        {c.flameColor && (
          <div style={{ background: "#fff8e1", borderRadius: 12, padding: 16, border: "2px solid #ffe082", textAlign: "center" }}>
            <strong>كشف اللهب:</strong> يكسب اللهب لوناً <strong style={{ color: c.flameColor }}>{c.flameName}</strong>
            <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.flameColor, margin: "10px auto 0", boxShadow: `0 0 20px ${c.flameColor}88` }} />
          </div>
        )}
      </div>
    </div>
  );
}

function FlameTestLesson() {
  const [selectedFlame, setSelectedFlame] = useState(null);

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#e65100", margin: "0 0 12px", fontSize: 20 }}>كشف اللهب (Flame Test)</h2>
        <p style={{ lineHeight: 1.9, color: "#bf360c", fontSize: 14, margin: 0 }}>
          تظهر بعض الأيونات ألواناً مميزة عند تعرضها للهب الموقد غير المضيء (اللهب الأزرق).
          يُستعمل سلك بلاتيني يُغمس في حمض HCl المركز ثم في الملح الصلب ويوضع في اللهب.
        </p>
      </div>

      <h3 style={{ textAlign: "center", color: "#e65100", marginBottom: 16 }}>اختر أيوناً لمشاهدة لون اللهب</h3>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap", marginBottom: 24 }}>
        {FLAME_TEST_DATA.map((f, i) => (
          <button key={i} onClick={() => setSelectedFlame(i)} style={{
            padding: "12px 20px", borderRadius: 12,
            border: selectedFlame === i ? `3px solid ${f.color}` : "2px solid #e0e0e0",
            background: selectedFlame === i ? `${f.color}20` : "#fff",
            cursor: "pointer", fontWeight: 600, fontSize: 14, fontFamily: "inherit",
            minWidth: 120, transition: "all 0.3s",
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{f.ion}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{f.name}</div>
          </button>
        ))}
      </div>

      {selectedFlame !== null && (
        <div style={{ textAlign: "center", animation: "fadeIn 0.5s ease" }}>
          <FlameAnimation color={FLAME_TEST_DATA[selectedFlame].color} size={100} />
          <div style={{ marginTop: 16, fontSize: 18, fontWeight: 700, color: FLAME_TEST_DATA[selectedFlame].color }}>
            لهب {FLAME_TEST_DATA[selectedFlame].flameName}
          </div>
          <div style={{ fontSize: 14, color: "#666", marginTop: 4 }}>
            يدل على وجود أيون {FLAME_TEST_DATA[selectedFlame].name} {FLAME_TEST_DATA[selectedFlame].ion}
          </div>
        </div>
      )}

      {/* Steps */}
      <div style={{ marginTop: 30, background: "#fafafa", borderRadius: 14, padding: 20 }}>
        <h3 style={{ color: "#e65100", margin: "0 0 14px", fontSize: 16 }}>خطوات إجراء كشف اللهب:</h3>
        {[
          "ينظف السلك البلاتيني بوضعه في حمض HCl المركز ثم يسخن في منطقة اللهب غير المضيء",
          "تكرر الخطوة عدة مرات حتى يصبح السلك نظيفاً",
          "يُغمس طرف السلك (وهو بارد) في HCl المركز، ثم يُغمس في الملح الصلب",
          "يوضع السلك في اللهب ويُلاحظ اللون",
        ].map((step, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 10 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#e65100", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
              {i + 1}
            </div>
            <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, paddingTop: 3 }}>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlowchartLesson() {
  const [step, setStep] = useState(0);

  const steps = [
    { title: "الخطوة الأولى", desc: "أضف HCl المخفف إلى الملح الصلب ولاحظ", color: "#e91e63" },
    { title: "إذا تصاعد غاز...", desc: "حدد نوع الغاز من خصائصه → الشق من المجموعة الأولى", color: "#f44336" },
    { title: "إذا لم يتصاعد غاز → الخطوة الثانية", desc: "أضف H₂SO₄ المركز إلى الملح الصلب", color: "#9c27b0" },
    { title: "إذا تصاعدت أبخرة...", desc: "حدد نوعها → الشق من المجموعة الثانية", color: "#7b1fa2" },
    { title: "إذا لم تتصاعد أبخرة → الخطوة الثالثة", desc: "أجرِ تجارب خاصة على محلول الملح → المجموعة الثالثة", color: "#673ab7" },
  ];

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#4a148c", margin: "0 0 12px", fontSize: 20 }}>المخطط العام للكشف عن شق حمضي مجهول</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#6a1b9a", lineHeight: 1.8 }}>
          إذا أُعطيت ملحاً مجهولاً، اتبع الخطوات بالترتيب من (1) إلى (3) للتعرف على شقه الحمضي.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
        {steps.map((s, i) => (
          <div key={i}>
            <FlowNode
              text={s.title}
              color={s.color}
              active={step === i}
              onClick={() => setStep(i)}
            />
            {i < steps.length - 1 && <Arrow />}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20, background: `${steps[step].color}10`, borderRadius: 14, padding: 20, border: `2px solid ${steps[step].color}30`, textAlign: "center" }}>
        <h3 style={{ color: steps[step].color, margin: "0 0 8px" }}>{steps[step].title}</h3>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8 }}>{steps[step].desc}</p>
      </div>

      {/* Gas identification guide */}
      <div style={{ marginTop: 24, background: "#e8f5e9", borderRadius: 14, padding: 18 }}>
        <h3 style={{ color: "#2e7d32", margin: "0 0 12px", fontSize: 16 }}>دليل التعرف على الغازات:</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
          {[
            { gas: "CO₂", test: "يعكر ماء الجير", icon: "💨" },
            { gas: "H₂S", test: "رائحة بيض فاسد + يسوّد ورقة الرصاص", icon: "🥚" },
            { gas: "SO₂", test: "رائحة خانقة + يحول الكرومات للأخضر", icon: "⚠️" },
            { gas: "NO", test: "أبخرة بنية عند فوهة الأنبوبة", icon: "🟤" },
            { gas: "HCl", test: "سحب بيضاء مع الأمونيا", icon: "☁️" },
            { gas: "Br₂", test: "يحول النشا للأصفر + أحمر محمر", icon: "🔴" },
            { gas: "I₂", test: "يحول النشا للأزرق + بنفسجي", icon: "🟣" },
          ].map((g, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 10, padding: 10, fontSize: 12, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{g.icon} {g.gas}</div>
              {g.test}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function VirtualLabLesson() {
  const [selectedSalt, setSelectedSalt] = useState(null);
  const [step, setStep] = useState(0);
  const [results, setResults] = useState([]);

  const unknownSalts = [
    {
      name: "ملح مجهول A",
      actual: "كربونات الصوديوم (Na₂CO₃)",
      anion: "CO₃²⁻",
      steps: [
        { action: "أضف HCl المخفف إلى الملح الصلب", result: "يتصاعد غاز عديم اللون بفوران!", gasType: "CO₂", color: "#e0e0e0" },
        { action: "مرر الغاز في ماء الجير", result: "يتعكر ماء الجير! → الغاز هو CO₂", gasType: "confirmed", color: "#81c784" },
        { action: "النتيجة", result: "الشق الحمضي هو الكربونات CO₃²⁻ → الملح كربونات الصوديوم", gasType: "done", color: "#4caf50" },
      ],
    },
    {
      name: "ملح مجهول B",
      actual: "كلوريد الصوديوم (NaCl)",
      anion: "Cl⁻",
      steps: [
        { action: "أضف HCl المخفف إلى الملح الصلب", result: "لا يتصاعد غاز! → الشق ليس من المجموعة الأولى", gasType: "none", color: "#ffcc80" },
        { action: "أضف H₂SO₄ المركز إلى الملح الصلب", result: "يتصاعد غاز يكوّن سحباً بيضاء مع الأمونيا → HCl", gasType: "HCl", color: "#f5f5f5" },
        { action: "أضف AgNO₃ لمحلول الملح", result: "راسب أبيض يذوب في NH₄OH → الكلوريد Cl⁻", gasType: "confirmed", color: "#81c784" },
        { action: "النتيجة", result: "الشق الحمضي هو الكلوريد Cl⁻ → الملح كلوريد الصوديوم", gasType: "done", color: "#4caf50" },
      ],
    },
    {
      name: "ملح مجهول C",
      actual: "كبريتات الصوديوم (Na₂SO₄)",
      anion: "SO₄²⁻",
      steps: [
        { action: "أضف HCl المخفف", result: "لا يتصاعد غاز", gasType: "none", color: "#ffcc80" },
        { action: "أضف H₂SO₄ المركز", result: "لا تتصاعد أبخرة", gasType: "none", color: "#ffab91" },
        { action: "أضف BaCl₂ لمحلول الملح", result: "راسب أبيض من BaSO₄ لا يذوب في الحموض المعدنية!", gasType: "confirmed", color: "#81c784" },
        { action: "النتيجة", result: "الشق الحمضي هو الكبريتات SO₄²⁻ → الملح كبريتات الصوديوم", gasType: "done", color: "#4caf50" },
      ],
    },
  ];

  const handleStep = () => {
    if (selectedSalt === null) return;
    const salt = unknownSalts[selectedSalt];
    if (step < salt.steps.length) {
      setResults(prev => [...prev, salt.steps[step]]);
      setStep(step + 1);
    }
  };

  const resetLab = () => {
    setSelectedSalt(null);
    setStep(0);
    setResults([]);
  };

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #e8eaf6 0%, #c5cae9 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#1a237e", margin: "0 0 12px", fontSize: 20 }}>🏗️ المعمل الافتراضي</h2>
        <p style={{ margin: 0, fontSize: 14, color: "#283593", lineHeight: 1.8 }}>
          جرّب بنفسك! اختر ملحاً مجهولاً واتبع خطوات الكشف عن شقه الحمضي.
        </p>
      </div>

      {selectedSalt === null ? (
        <div>
          <h3 style={{ textAlign: "center", color: "#1a237e", marginBottom: 16 }}>اختر ملحاً مجهولاً للتحليل:</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            {unknownSalts.map((s, i) => (
              <button key={i} onClick={() => { setSelectedSalt(i); setStep(0); setResults([]); }} style={{
                padding: "20px 30px", borderRadius: 16,
                border: "3px solid #3f51b5",
                background: "#fff", cursor: "pointer",
                fontSize: 16, fontWeight: 700, fontFamily: "inherit",
                color: "#3f51b5", transition: "all 0.3s",
              }}>
                🧪 {s.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ color: "#3f51b5", margin: 0 }}>{unknownSalts[selectedSalt].name}</h3>
            <button onClick={resetLab} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #e0e0e0", background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 13 }}>
              ↩ اختر ملحاً آخر
            </button>
          </div>

          {/* Progress */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
            {unknownSalts[selectedSalt].steps.map((_, i) => (
              <div key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: i < step ? "#4caf50" : "#e0e0e0", transition: "all 0.3s" }} />
            ))}
          </div>

          {/* Results */}
          <div style={{ display: "grid", gap: 10, marginBottom: 16 }}>
            {results.map((r, i) => (
              <div key={i} style={{ background: `${r.color}30`, borderRadius: 12, padding: 14, border: `2px solid ${r.color}`, animation: "fadeIn 0.5s ease" }}>
                <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6 }}>الخطوة {i + 1}: {r.action}</div>
                <div style={{ fontSize: 14, lineHeight: 1.7, color: "#333" }}>{r.result}</div>
              </div>
            ))}
          </div>

          {step < unknownSalts[selectedSalt].steps.length ? (
            <div style={{ textAlign: "center" }}>
              <button onClick={handleStep} style={{
                padding: "14px 32px", borderRadius: 12,
                background: "#3f51b5", color: "#fff", border: "none",
                cursor: "pointer", fontSize: 16, fontWeight: 700, fontFamily: "inherit",
                boxShadow: "0 4px 16px rgba(63,81,181,0.3)",
              }}>
                {step === 0 ? "ابدأ التجربة 🧪" : "الخطوة التالية ⬇"}
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center", background: "#e8f5e9", borderRadius: 14, padding: 20, border: "2px solid #4caf50" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
              <h3 style={{ color: "#2e7d32", margin: "0 0 8px" }}>تم التحليل بنجاح!</h3>
              <p style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
                الملح هو: <strong>{unknownSalts[selectedSalt].actual}</strong>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function QuizLesson() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const q = QUIZ_QUESTIONS[current];
  const score = Object.entries(answers).filter(([k, v]) => QUIZ_QUESTIONS[parseInt(k)].correct === v).length;

  const selectAnswer = (idx) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [current]: idx }));
  };

  const submitQuiz = () => {
    setSubmitted(true);
    setShowResult(true);
  };

  const resetQuiz = () => {
    setCurrent(0);
    setAnswers({});
    setShowResult(false);
    setSubmitted(false);
  };

  if (showResult) {
    const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
    return (
      <div style={{ textAlign: "center", padding: 20 }}>
        <div style={{ fontSize: 60, marginBottom: 16 }}>{pct >= 70 ? "🎉" : pct >= 50 ? "👍" : "📚"}</div>
        <h2 style={{ color: pct >= 70 ? "#2e7d32" : pct >= 50 ? "#f57c00" : "#c62828", marginBottom: 8 }}>
          النتيجة: {score} / {QUIZ_QUESTIONS.length}
        </h2>
        <div style={{ width: 200, height: 12, background: "#e0e0e0", borderRadius: 6, margin: "0 auto 16px", overflow: "hidden" }}>
          <div style={{ width: `${pct}%`, height: "100%", background: pct >= 70 ? "#4caf50" : pct >= 50 ? "#ff9800" : "#f44336", borderRadius: 6, transition: "width 1s ease" }} />
        </div>
        <p style={{ fontSize: 16, marginBottom: 20 }}>
          {pct >= 70 ? "ممتاز! أحسنت" : pct >= 50 ? "جيد، راجع الدروس لتحسين درجتك" : "تحتاج لمراجعة الوحدة مرة أخرى"}
        </p>

        {/* Review answers */}
        <div style={{ textAlign: "right", maxWidth: 600, margin: "0 auto" }}>
          {QUIZ_QUESTIONS.map((qq, i) => {
            const userAns = answers[i];
            const isCorrect = userAns === qq.correct;
            return (
              <div key={i} style={{ background: isCorrect ? "#e8f5e9" : "#fce4ec", borderRadius: 12, padding: 14, marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{i + 1}. {qq.q}</div>
                <div style={{ fontSize: 12, color: isCorrect ? "#2e7d32" : "#c62828" }}>
                  {isCorrect ? "✅ صحيح" : `❌ إجابتك: ${qq.options[userAns]} | الصحيح: ${qq.options[qq.correct]}`}
                </div>
                {!isCorrect && <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>{qq.explanation}</div>}
              </div>
            );
          })}
        </div>

        <button onClick={resetQuiz} style={{
          padding: "12px 30px", borderRadius: 10, border: "none", background: "#1976d2", color: "#fff",
          fontSize: 15, fontWeight: 600, cursor: "pointer", marginTop: 16, fontFamily: "inherit",
        }}>
          أعد الاختبار
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ background: "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)", borderRadius: 16, padding: 24, marginBottom: 20 }}>
        <h2 style={{ color: "#0d47a1", margin: "0 0 12px", fontSize: 20 }}>📝 تمارين واختبارات تفاعلية</h2>
        <p style={{ margin: 0, color: "#1565c0", fontSize: 14 }}>
          السؤال {current + 1} من {QUIZ_QUESTIONS.length}
        </p>
      </div>

      {/* Progress */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
        {QUIZ_QUESTIONS.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 8, borderRadius: 4, cursor: "pointer",
            background: i === current ? "#1976d2" : answers[i] !== undefined ? "#81c784" : "#e0e0e0",
            transition: "all 0.3s",
          }} onClick={() => setCurrent(i)} />
        ))}
      </div>

      {/* Question */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 20, marginBottom: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
        <p style={{ fontSize: 15, lineHeight: 1.9, fontWeight: 600, margin: "0 0 16px" }}>{q.q}</p>
        <div style={{ display: "grid", gap: 10 }}>
          {q.options.map((opt, i) => {
            const isSelected = answers[current] === i;
            return (
              <button key={i} onClick={() => selectAnswer(i)} style={{
                padding: "12px 16px", borderRadius: 10, textAlign: "right",
                border: isSelected ? "2px solid #1976d2" : "2px solid #e0e0e0",
                background: isSelected ? "#e3f2fd" : "#fafafa",
                cursor: "pointer", fontSize: 14, fontFamily: "inherit",
                transition: "all 0.2s",
              }}>
                <span style={{ fontWeight: 600, marginLeft: 8 }}>{String.fromCharCode(1571 + i)})</span> {opt}
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <button
          onClick={() => setCurrent(Math.max(0, current - 1))}
          disabled={current === 0}
          style={{
            padding: "10px 20px", borderRadius: 10, border: "1px solid #e0e0e0",
            background: "#fff", cursor: current === 0 ? "not-allowed" : "pointer",
            opacity: current === 0 ? 0.5 : 1, fontFamily: "inherit", fontSize: 14,
          }}
        >
          ← السابق
        </button>
        {current < QUIZ_QUESTIONS.length - 1 ? (
          <button onClick={() => setCurrent(current + 1)} style={{
            padding: "10px 20px", borderRadius: 10, border: "none",
            background: "#1976d2", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
          }}>
            التالي →
          </button>
        ) : (
          <button onClick={submitQuiz} disabled={Object.keys(answers).length < QUIZ_QUESTIONS.length} style={{
            padding: "10px 24px", borderRadius: 10, border: "none",
            background: Object.keys(answers).length < QUIZ_QUESTIONS.length ? "#bdbdbd" : "#4caf50",
            color: "#fff", cursor: Object.keys(answers).length < QUIZ_QUESTIONS.length ? "not-allowed" : "pointer",
            fontFamily: "inherit", fontSize: 14, fontWeight: 600,
          }}>
            ✅ إرسال الإجابات
          </button>
        )}
      </div>
    </div>
  );
}

// ========== MAIN APP ==========
export default function QualitativeAnalysisUnit() {
  const [activeLesson, setActiveLesson] = useState("intro");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [progress, setProgress] = useState({});

  const handleLessonChange = (id) => {
    setActiveLesson(id);
    setProgress(prev => ({ ...prev, [id]: true }));
  };

  const completedCount = Object.keys(progress).length;
  const progressPct = Math.round((completedCount / LESSONS.length) * 100);

  const renderLesson = () => {
    switch (activeLesson) {
      case "intro": return <IntroLesson />;
      case "acidRadicals": return <AcidRadicalsLesson />;
      case "group1": return <AnionGroupLesson groupNum={1} title="المجموعة الأولى: مجموعة حمض الهيدروكلوريك المخفف" anions={GROUP1_ANIONS} reagentName="HCl المخفف" reagentColor="#e91e63" />;
      case "group2": return <AnionGroupLesson groupNum={2} title="المجموعة الثانية: مجموعة حمض الكبريتيك المركز" anions={GROUP2_ANIONS} reagentName="H₂SO₄ المركز" reagentColor="#9c27b0" />;
      case "group3": return <Group3Lesson />;
      case "cations": return <CationsLesson />;
      case "flameTest": return <FlameTestLesson />;
      case "flowchart": return <FlowchartLesson />;
      case "virtualLab": return <VirtualLabLesson />;
      case "quiz": return <QuizLesson />;
      default: return <IntroLesson />;
    }
  };

  return (
    <div dir="rtl" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif", minHeight: "100vh", background: "#f0f2f5" }}>
      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes bubbleUp { 0% { transform: translateY(0); opacity: 0.8; } 100% { transform: translateY(-60px); opacity: 0; } }
        @keyframes gasRise { 0% { opacity: 0.5; transform: translateX(-50%) translateY(0); } 100% { opacity: 0; transform: translateX(-50%) translateY(-20px); } }
        @keyframes flicker { 0% { transform: translateX(-50%) scaleX(1) scaleY(1); } 100% { transform: translateX(-50%) scaleX(0.95) scaleY(1.03); } }
        @keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        * { box-sizing: border-box; }
        button:hover { filter: brightness(1.05); }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #bbb; border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 50%, #01579b 100%)",
        color: "#fff", padding: "16px 24px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, opacity: 0.8, marginBottom: 2 }}>المنهج السوداني التفاعلي | الصف الثالث ثانوي</div>
            <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>🔬 الوحدة الثالثة: التحليل الكيميائي الكيفي</h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 12 }}>التقدم: {progressPct}%</div>
            <div style={{ width: 100, height: 8, background: "rgba(255,255,255,0.2)", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${progressPct}%`, height: "100%", background: "#4caf50", borderRadius: 4, transition: "width 0.5s" }} />
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{
              background: "rgba(255,255,255,0.15)", border: "none", color: "#fff",
              padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontSize: 16,
            }}>
              {sidebarOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", minHeight: "calc(100vh - 80px)" }}>
        {/* Sidebar */}
        {sidebarOpen && (
          <div style={{
            width: 260, background: "#fff", borderLeft: "1px solid #e0e0e0",
            padding: "16px 12px", overflowY: "auto", flexShrink: 0,
            boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
          }}>
            <h3 style={{ fontSize: 14, color: "#78909c", margin: "0 0 12px", paddingRight: 4 }}>محتويات الوحدة</h3>
            {LESSONS.map(l => (
              <div
                key={l.id}
                onClick={() => handleLessonChange(l.id)}
                style={{
                  padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                  background: activeLesson === l.id ? "#e3f2fd" : "transparent",
                  color: activeLesson === l.id ? "#1565c0" : "#333",
                  cursor: "pointer", fontSize: 13, fontWeight: activeLesson === l.id ? 700 : 400,
                  display: "flex", alignItems: "center", gap: 8,
                  transition: "all 0.2s", borderRight: activeLesson === l.id ? "3px solid #1565c0" : "3px solid transparent",
                }}
              >
                <span style={{ fontSize: 16 }}>{l.icon}</span>
                <span>{l.title}</span>
                {progress[l.id] && <span style={{ marginRight: "auto", fontSize: 12, color: "#4caf50" }}>✓</span>}
              </div>
            ))}
          </div>
        )}

        {/* Main Content */}
        <div style={{ flex: 1, padding: "20px 24px", maxWidth: 900, overflowY: "auto" }}>
          <div style={{ animation: "fadeIn 0.4s ease" }} key={activeLesson}>
            {renderLesson()}
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, paddingBottom: 20 }}>
            <button
              onClick={() => {
                const idx = LESSONS.findIndex(l => l.id === activeLesson);
                if (idx > 0) handleLessonChange(LESSONS[idx - 1].id);
              }}
              disabled={LESSONS.findIndex(l => l.id === activeLesson) === 0}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "1px solid #e0e0e0",
                background: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 14,
                opacity: LESSONS.findIndex(l => l.id === activeLesson) === 0 ? 0.4 : 1,
              }}
            >
              ← الدرس السابق
            </button>
            <button
              onClick={() => {
                const idx = LESSONS.findIndex(l => l.id === activeLesson);
                if (idx < LESSONS.length - 1) handleLessonChange(LESSONS[idx + 1].id);
              }}
              disabled={LESSONS.findIndex(l => l.id === activeLesson) === LESSONS.length - 1}
              style={{
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: "#1976d2", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontSize: 14, fontWeight: 600,
                opacity: LESSONS.findIndex(l => l.id === activeLesson) === LESSONS.length - 1 ? 0.4 : 1,
              }}
            >
              الدرس التالي →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
