import { useState, useEffect, useRef } from "react";

// ============================================
// محاكاة تجارب مندل - المعمل الافتراضي
// الوراثة - الصف الثالث الثانوي
// المنهج السوداني التفاعلي
// ============================================

const TRAITS = [
  {
    id: "flowerColor",
    name: "لون الأزهار",
    nameEn: "Flower Color",
    dominant: { label: "حمراء", value: "R", color: "#e74c3c", emoji: "🌺" },
    recessive: { label: "بيضاء", value: "r", color: "#f5f5f5", emoji: "🌸" },
  },
  {
    id: "seedShape",
    name: "شكل البذرة",
    nameEn: "Seed Shape",
    dominant: { label: "ملساء", value: "S", color: "#f39c12", emoji: "🟡" },
    recessive: { label: "مجعدة", value: "s", color: "#d4a017", emoji: "🟤" },
  },
  {
    id: "seedColor",
    name: "لون البذرة",
    nameEn: "Seed Color",
    dominant: { label: "صفراء", value: "Y", color: "#f1c40f", emoji: "🟡" },
    recessive: { label: "خضراء", value: "y", color: "#27ae60", emoji: "🟢" },
  },
  {
    id: "podShape",
    name: "شكل القرن",
    nameEn: "Pod Shape",
    dominant: { label: "أملس", value: "I", color: "#2ecc71", emoji: "🫛" },
    recessive: { label: "محزز", value: "i", color: "#1a8a4a", emoji: "🫛" },
  },
  {
    id: "podColor",
    name: "لون القرن",
    nameEn: "Pod Color",
    dominant: { label: "أخضر", value: "G", color: "#27ae60", emoji: "🟢" },
    recessive: { label: "أصفر", value: "g", color: "#f1c40f", emoji: "🟡" },
  },
  {
    id: "stemLength",
    name: "طول الساق",
    nameEn: "Stem Length",
    dominant: { label: "طويل", value: "T", color: "#2c3e50", emoji: "🌿" },
    recessive: { label: "قصير", value: "t", color: "#7f8c8d", emoji: "🌱" },
  },
  {
    id: "flowerPosition",
    name: "موضع الزهرة",
    nameEn: "Flower Position",
    dominant: { label: "إبطي", value: "A", color: "#8e44ad", emoji: "🌼" },
    recessive: { label: "طرفي", value: "a", color: "#9b59b6", emoji: "🌻" },
  },
];

// Punnett square logic
function getPunnettSquare(parent1Alleles, parent2Alleles) {
  const gametes1 = [parent1Alleles[0], parent1Alleles[1]];
  const gametes2 = [parent2Alleles[0], parent2Alleles[1]];
  const results = [];
  for (let g1 of gametes1) {
    for (let g2 of gametes2) {
      const upper = g1 === g1.toUpperCase() ? g1 : g2;
      const lower = g1 === g1.toUpperCase() ? g2 : g1;
      if (upper === upper.toUpperCase() && lower !== lower.toUpperCase()) {
        results.push(upper + lower);
      } else if (lower === lower.toUpperCase() && upper !== upper.toUpperCase()) {
        results.push(lower + upper);
      } else {
        results.push(g1 + g2);
      }
    }
  }
  return { gametes1, gametes2, results };
}

function getGenotypeName(alleles) {
  const a1 = alleles[0];
  const a2 = alleles[1];
  if (a1 === a1.toUpperCase() && a2 === a2.toUpperCase()) return "نقي سائد";
  if (a1 !== a1.toUpperCase() && a2 !== a2.toUpperCase()) return "نقي متنحي";
  return "هجين";
}

function getPhenotype(alleles, trait) {
  const hasD = alleles[0] === alleles[0].toUpperCase() || alleles[1] === alleles[1].toUpperCase();
  return hasD ? trait.dominant : trait.recessive;
}

function getRatios(results, trait) {
  let dominant = 0;
  let recessive = 0;
  const genotypeCounts = {};
  results.forEach((r) => {
    const sorted = r[0] === r[0].toUpperCase() ? r : r[1] + r[0];
    genotypeCounts[sorted] = (genotypeCounts[sorted] || 0) + 1;
    if (r[0] === r[0].toUpperCase() || r[1] === r[1].toUpperCase()) {
      dominant++;
    } else {
      recessive++;
    }
  });
  return { dominant, recessive, genotypeCounts };
}

// ====== Plant SVG Component ======
function PlantSVG({ trait, phenotype, genotype, size = 100, showLabel = true, animate = false }) {
  const isDominant =
    genotype[0] === genotype[0].toUpperCase() || genotype[1] === genotype[1].toUpperCase();
  const pheno = isDominant ? trait.dominant : trait.recessive;
  const stemH = trait.id === "stemLength" ? (isDominant ? 60 : 30) : 45;
  const flowerY = 100 - stemH - 25;

  return (
    <div
      className={`flex flex-col items-center ${animate ? "animate-bounce" : ""}`}
      style={{ width: size, minHeight: size + 30 }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100">
        {/* Pot */}
        <path d="M30 90 L35 75 L65 75 L70 90 Z" fill="#8B4513" />
        <rect x="28" y="72" width="44" height="5" rx="2" fill="#A0522D" />
        {/* Soil */}
        <ellipse cx="50" cy="75" rx="16" ry="3" fill="#5D3A1A" />
        {/* Stem */}
        <line
          x1="50"
          y1="75"
          x2="50"
          y2={flowerY + 10}
          stroke="#2ecc71"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Leaves */}
        <ellipse
          cx="40"
          cy={flowerY + 30}
          rx="10"
          ry="4"
          fill="#27ae60"
          transform={`rotate(-30 40 ${flowerY + 30})`}
        />
        <ellipse
          cx="60"
          cy={flowerY + 25}
          rx="10"
          ry="4"
          fill="#27ae60"
          transform={`rotate(30 60 ${flowerY + 25})`}
        />
        {/* Flower / Feature */}
        {trait.id === "flowerColor" || trait.id === "flowerPosition" ? (
          <>
            <circle cx="50" cy={flowerY} r="12" fill={pheno.color} opacity="0.9" />
            <circle cx="50" cy={flowerY} r="5" fill="#f1c40f" />
            {[0, 60, 120, 180, 240, 300].map((angle, i) => (
              <circle
                key={i}
                cx={50 + 8 * Math.cos((angle * Math.PI) / 180)}
                cy={flowerY + 8 * Math.sin((angle * Math.PI) / 180)}
                r="5"
                fill={pheno.color}
                stroke={pheno.color === "#f5f5f5" ? "#ddd" : "none"}
                strokeWidth="1"
              />
            ))}
          </>
        ) : trait.id === "seedShape" || trait.id === "seedColor" ? (
          <>
            {/* Pod with seeds */}
            <ellipse cx="50" cy={flowerY + 5} rx="15" ry="8" fill="#27ae60" />
            <circle cx="43" cy={flowerY + 5} r="4" fill={pheno.color} />
            <circle cx="50" cy={flowerY + 5} r="4" fill={pheno.color} />
            <circle cx="57" cy={flowerY + 5} r="4" fill={pheno.color} />
            {trait.id === "seedShape" && !isDominant && (
              <>
                <line x1="41" y1={flowerY + 3} x2="45" y2={flowerY + 7} stroke="#8B6914" strokeWidth="0.5" />
                <line x1="48" y1={flowerY + 3} x2="52" y2={flowerY + 7} stroke="#8B6914" strokeWidth="0.5" />
                <line x1="55" y1={flowerY + 3} x2="59" y2={flowerY + 7} stroke="#8B6914" strokeWidth="0.5" />
              </>
            )}
          </>
        ) : trait.id === "podShape" || trait.id === "podColor" ? (
          <ellipse
            cx="50"
            cy={flowerY + 5}
            rx="15"
            ry="7"
            fill={pheno.color}
            stroke={!isDominant && trait.id === "podShape" ? "#1a6b3a" : "none"}
            strokeWidth="1"
            strokeDasharray={!isDominant && trait.id === "podShape" ? "3 2" : "0"}
          />
        ) : (
          <>
            <circle cx="50" cy={flowerY} r="10" fill="#e74c3c" opacity="0.8" />
            <circle cx="50" cy={flowerY} r="4" fill="#f1c40f" />
          </>
        )}
      </svg>
      {showLabel && (
        <div className="text-center mt-1">
          <div className="text-xs font-bold" style={{ color: pheno.color === "#f5f5f5" ? "#999" : pheno.color }}>
            {pheno.label}
          </div>
          <div className="text-xs text-gray-500 font-mono">{genotype}</div>
          <div className="text-xs text-gray-400">{getGenotypeName(genotype)}</div>
        </div>
      )}
    </div>
  );
}

// ====== Punnett Square Visual ======
function PunnettSquareVisual({ parent1, parent2, trait, onCellClick }) {
  const { gametes1, gametes2, results } = getPunnettSquare(parent1, parent2);
  const [highlighted, setHighlighted] = useState(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <h3 className="text-lg font-bold text-emerald-700">مربع بانيت (Punnett Square)</h3>
      <div className="grid grid-cols-3 gap-0 border-2 border-emerald-600 rounded-lg overflow-hidden" style={{ direction: "ltr" }}>
        {/* Empty top-left */}
        <div className="w-20 h-20 bg-emerald-700 flex items-center justify-center">
          <span className="text-white text-xs">الأمشاج</span>
        </div>
        {/* Parent 2 gametes (top) */}
        {gametes2.map((g, i) => (
          <div
            key={`top-${i}`}
            className="w-20 h-20 bg-emerald-600 flex items-center justify-center"
          >
            <span className="text-2xl font-bold text-white">{g}</span>
          </div>
        ))}
        {/* Rows */}
        {gametes1.map((g1, i) => (
          <>
            <div
              key={`left-${i}`}
              className="w-20 h-20 bg-emerald-600 flex items-center justify-center"
            >
              <span className="text-2xl font-bold text-white">{g1}</span>
            </div>
            {gametes2.map((g2, j) => {
              const idx = i * 2 + j;
              const alleles = results[idx];
              const pheno = getPhenotype(alleles, trait);
              const isHighlighted = highlighted === idx;
              return (
                <div
                  key={`cell-${i}-${j}`}
                  className={`w-20 h-20 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border border-emerald-200 ${
                    isHighlighted ? "ring-4 ring-yellow-400 scale-110 z-10" : "hover:bg-emerald-50"
                  }`}
                  style={{ backgroundColor: isHighlighted ? pheno.color + "33" : "white" }}
                  onClick={() => {
                    setHighlighted(isHighlighted ? null : idx);
                    onCellClick && onCellClick(alleles, pheno);
                  }}
                >
                  <span className="text-xl font-bold font-mono">{alleles}</span>
                  <span className="text-xs mt-1" style={{ color: pheno.color === "#f5f5f5" ? "#999" : pheno.color }}>
                    {pheno.emoji} {pheno.label}
                  </span>
                </div>
              );
            })}
          </>
        ))}
      </div>
    </div>
  );
}

// ====== Ratio Bar ======
function RatioBar({ dominant, recessive, trait, total }) {
  const domPct = (dominant / total) * 100;
  const recPct = (recessive / total) * 100;
  return (
    <div className="w-full max-w-md">
      <div className="flex justify-between text-sm mb-1 font-bold">
        <span style={{ color: trait.dominant.color }}>
          {trait.dominant.emoji} {trait.dominant.label}: {dominant}
        </span>
        <span style={{ color: trait.recessive.color === "#f5f5f5" ? "#999" : trait.recessive.color }}>
          {trait.recessive.emoji} {trait.recessive.label}: {recessive}
        </span>
      </div>
      <div className="w-full h-8 rounded-full overflow-hidden flex border-2 border-gray-200">
        <div
          className="h-full flex items-center justify-center text-white text-xs font-bold transition-all duration-700"
          style={{ width: `${domPct}%`, backgroundColor: trait.dominant.color }}
        >
          {domPct > 15 && `${Math.round(domPct)}%`}
        </div>
        <div
          className="h-full flex items-center justify-center text-xs font-bold transition-all duration-700"
          style={{
            width: `${recPct}%`,
            backgroundColor: trait.recessive.color,
            color: trait.recessive.color === "#f5f5f5" ? "#666" : "white",
            border: trait.recessive.color === "#f5f5f5" ? "1px solid #ddd" : "none",
          }}
        >
          {recPct > 15 && `${Math.round(recPct)}%`}
        </div>
      </div>
      <div className="text-center text-sm mt-1 text-gray-600 font-bold">
        النسبة المظهرية: {dominant} : {recessive}
        {dominant === 3 && recessive === 1 && (
          <span className="text-emerald-600 mr-2"> ✓ نسبة مندل الكلاسيكية</span>
        )}
        {dominant === 4 && recessive === 0 && (
          <span className="text-blue-600 mr-2"> (سيادة تامة للصفة السائدة)</span>
        )}
        {dominant === 2 && recessive === 2 && (
          <span className="text-purple-600 mr-2"> (تلقيح اختباري)</span>
        )}
      </div>
    </div>
  );
}

// ====== Generation Display ======
function GenerationDisplay({ label, plants, trait, generation }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 border-2 border-emerald-100">
      <div className="flex items-center gap-2 mb-3">
        <div className="bg-emerald-600 text-white px-3 py-1 rounded-full text-sm font-bold">
          {generation}
        </div>
        <h3 className="font-bold text-gray-700">{label}</h3>
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {plants.map((p, i) => (
          <div key={i} className="transition-all duration-500" style={{ animationDelay: `${i * 200}ms` }}>
            <PlantSVG trait={trait} phenotype={p.phenotype} genotype={p.genotype} size={90} animate={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ====== Info Card ======
function InfoCard({ title, children, color = "emerald" }) {
  return (
    <div className={`bg-${color}-50 border-2 border-${color}-200 rounded-xl p-4`}>
      <h4 className={`font-bold text-${color}-700 mb-2`}>{title}</h4>
      <div className="text-sm text-gray-700 leading-relaxed">{children}</div>
    </div>
  );
}

// ====== MAIN COMPONENT ======
export default function MendelGeneticsLab() {
  const [selectedTrait, setSelectedTrait] = useState(TRAITS[0]);
  const [parent1Type, setParent1Type] = useState("homoDom"); // homoDom, hetero, homoRec
  const [parent2Type, setParent2Type] = useState("homoRec");
  const [showResults, setShowResults] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showF2, setShowF2] = useState(false);
  const [selectedCell, setSelectedCell] = useState(null);
  const [activeTab, setActiveTab] = useState("experiment");
  const resultsRef = useRef(null);

  const getGenotype = (type, trait) => {
    const d = trait.dominant.value;
    const r = trait.recessive.value;
    switch (type) {
      case "homoDom": return d + d;
      case "hetero": return d + r;
      case "homoRec": return r + r;
      default: return d + d;
    }
  };

  const parent1Genotype = getGenotype(parent1Type, selectedTrait);
  const parent2Genotype = getGenotype(parent2Type, selectedTrait);

  const punnett = getPunnettSquare(parent1Genotype, parent2Genotype);
  const ratios = getRatios(punnett.results, selectedTrait);

  // F2 generation (cross F1 with each other)
  const f1Genotype = punnett.results[0]; // representative F1
  const f2Punnett = getPunnettSquare(f1Genotype, f1Genotype);
  const f2Ratios = getRatios(f2Punnett.results, selectedTrait);

  const handleCross = () => {
    setShowResults(true);
    setCurrentStep(1);
    setShowF2(false);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 300);
  };

  const handleF2 = () => {
    setShowF2(true);
    setCurrentStep(2);
  };

  const genotypeOptions = [
    { value: "homoDom", label: "نقي سائد", sublabel: (t) => `(${t.dominant.value}${t.dominant.value})` },
    { value: "hetero", label: "هجين", sublabel: (t) => `(${t.dominant.value}${t.recessive.value})` },
    { value: "homoRec", label: "نقي متنحي", sublabel: (t) => `(${t.recessive.value}${t.recessive.value})` },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-emerald-700 to-emerald-900 text-white py-6 px-4 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <span className="text-3xl">🧬</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">المعمل الافتراضي - تجارب مندل</h1>
              <p className="text-emerald-200 text-sm">الوراثة | الأحياء - الصف الثالث الثانوي</p>
            </div>
          </div>
          <p className="text-emerald-100 text-sm mt-2">
            حاكِ تجارب العالم جريجور مندل على نبات البسلة واكتشف قوانين الوراثة بنفسك!
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-4xl mx-auto px-4 mt-4">
        <div className="flex gap-2 bg-white rounded-xl p-1 shadow-sm border border-emerald-100">
          {[
            { id: "experiment", label: "🔬 التجربة", desc: "نفّذ التهجين" },
            { id: "concepts", label: "📚 المفاهيم", desc: "المصطلحات" },
            { id: "quiz", label: "✏️ تدريب", desc: "اختبر نفسك" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? "bg-emerald-600 text-white shadow-md"
                  : "text-gray-500 hover:bg-emerald-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* ===== EXPERIMENT TAB ===== */}
        {activeTab === "experiment" && (
          <div className="space-y-6">
            {/* Step 1: Select Trait */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">١</span>
                <h2 className="text-lg font-bold text-gray-800">اختر الصفة الوراثية</h2>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                درس مندل 7 صفات متضادة في نبات البسلة. اختر واحدة منها:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRAITS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTrait(t);
                      setShowResults(false);
                      setShowF2(false);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-center ${
                      selectedTrait.id === t.id
                        ? "border-emerald-500 bg-emerald-50 shadow-md scale-105"
                        : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xl mb-1">
                      {t.dominant.emoji}
                    </div>
                    <div className="text-xs font-bold text-gray-700">{t.name}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {t.dominant.label} / {t.recessive.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Parents */}
            <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">٢</span>
                <h2 className="text-lg font-bold text-gray-800">اختر الطراز الوراثي للآباء (P)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Parent 1 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-emerald-700 flex items-center gap-2">
                    <span className="text-lg">♀</span> الأب/الأم الأول
                  </h3>
                  <div className="space-y-2">
                    {genotypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setParent1Type(opt.value); setShowResults(false); setShowF2(false); }}
                        className={`w-full p-3 rounded-lg border-2 text-right flex items-center justify-between transition-all ${
                          parent1Type === opt.value
                            ? "border-emerald-500 bg-emerald-50"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        <span className="font-bold text-sm">{opt.label}</span>
                        <span className="font-mono text-emerald-600 text-sm">{opt.sublabel(selectedTrait)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <PlantSVG trait={selectedTrait} phenotype={null} genotype={parent1Genotype} size={100} />
                  </div>
                </div>

                {/* Cross Symbol */}
                <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2">
                </div>

                {/* Parent 2 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-blue-700 flex items-center gap-2">
                    <span className="text-lg">♂</span> الأب/الأم الثاني
                  </h3>
                  <div className="space-y-2">
                    {genotypeOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setParent2Type(opt.value); setShowResults(false); setShowF2(false); }}
                        className={`w-full p-3 rounded-lg border-2 text-right flex items-center justify-between transition-all ${
                          parent2Type === opt.value
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        <span className="font-bold text-sm">{opt.label}</span>
                        <span className="font-mono text-blue-600 text-sm">{opt.sublabel(selectedTrait)}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center">
                    <PlantSVG trait={selectedTrait} phenotype={null} genotype={parent2Genotype} size={100} />
                  </div>
                </div>
              </div>

              {/* Cross Button */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCross}
                  className="bg-gradient-to-l from-emerald-600 to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-3"
                >
                  <span className="text-2xl">✕</span>
                  أجرِ التلقيح الخلطي!
                  <span className="text-2xl">🌱</span>
                </button>
              </div>
            </div>

            {/* Step 3: Results */}
            {showResults && (
              <div ref={resultsRef} className="space-y-6">
                {/* F1 Generation */}
                <div className="bg-gradient-to-l from-emerald-50 to-green-50 rounded-2xl shadow-md p-6 border-2 border-emerald-200">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-emerald-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">٣</span>
                    <h2 className="text-lg font-bold text-gray-800">نتائج التلقيح</h2>
                  </div>

                  {/* Parents summary */}
                  <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
                    <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">الأب/الأم ١</div>
                      <div className="font-mono font-bold text-lg">{parent1Genotype}</div>
                      <div className="text-xs">{getPhenotype(parent1Genotype, selectedTrait).label}</div>
                    </div>
                    <div className="text-3xl font-bold text-emerald-600">✕</div>
                    <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">الأب/الأم ٢</div>
                      <div className="font-mono font-bold text-lg">{parent2Genotype}</div>
                      <div className="text-xs">{getPhenotype(parent2Genotype, selectedTrait).label}</div>
                    </div>
                  </div>

                  {/* Punnett Square */}
                  <div className="flex justify-center mb-6">
                    <PunnettSquareVisual
                      parent1={parent1Genotype}
                      parent2={parent2Genotype}
                      trait={selectedTrait}
                      onCellClick={(alleles, pheno) => setSelectedCell({ alleles, pheno })}
                    />
                  </div>

                  {/* Selected cell info */}
                  {selectedCell && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-200 mb-4 text-center">
                      <p className="text-sm">
                        الطراز الوراثي: <span className="font-mono font-bold text-lg">{selectedCell.alleles}</span>
                        {" | "}
                        الطراز المظهري: <span className="font-bold" style={{ color: selectedCell.pheno.color === "#f5f5f5" ? "#999" : selectedCell.pheno.color }}>
                          {selectedCell.pheno.label}
                        </span>
                        {" | "}
                        النوع: <span className="font-bold">{getGenotypeName(selectedCell.alleles)}</span>
                      </p>
                    </div>
                  )}

                  {/* F1 Plants */}
                  <GenerationDisplay
                    label="الجيل الأول - جميع الأفراد"
                    generation="F₁"
                    trait={selectedTrait}
                    plants={punnett.results.map((r) => ({
                      genotype: r,
                      phenotype: getPhenotype(r, selectedTrait),
                    }))}
                  />

                  {/* Ratios */}
                  <div className="mt-4 flex justify-center">
                    <RatioBar
                      dominant={ratios.dominant}
                      recessive={ratios.recessive}
                      trait={selectedTrait}
                      total={4}
                    />
                  </div>

                  {/* Genotype breakdown */}
                  <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                    <h4 className="font-bold text-gray-700 mb-2">النسبة الوراثية (الجينية):</h4>
                    <div className="flex justify-center gap-4 flex-wrap">
                      {Object.entries(ratios.genotypeCounts).map(([geno, count]) => (
                        <div key={geno} className="bg-gray-50 rounded-lg p-3 text-center min-w-16">
                          <div className="font-mono font-bold text-lg">{geno}</div>
                          <div className="text-xs text-gray-500">{getGenotypeName(geno)}</div>
                          <div className="text-sm font-bold text-emerald-600">{count}/4</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* F2 Button */}
                  {!showF2 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={handleF2}
                        className="bg-gradient-to-l from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2"
                      >
                        🧬 تلقيح ذاتي للجيل الأول → الجيل الثاني (F₂)
                      </button>
                    </div>
                  )}
                </div>

                {/* F2 Generation */}
                {showF2 && (
                  <div className="bg-gradient-to-l from-blue-50 to-indigo-50 rounded-2xl shadow-md p-6 border-2 border-blue-200">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">٤</span>
                      <h2 className="text-lg font-bold text-gray-800">الجيل الثاني (F₂) - التلقيح الذاتي</h2>
                    </div>

                    <div className="flex items-center justify-center gap-4 mb-4">
                      <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">F₁</div>
                        <div className="font-mono font-bold">{f1Genotype}</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">✕</div>
                      <div className="text-center bg-white rounded-xl p-3 shadow-sm">
                        <div className="text-xs text-gray-500 mb-1">F₁</div>
                        <div className="font-mono font-bold">{f1Genotype}</div>
                      </div>
                    </div>

                    <div className="flex justify-center mb-6">
                      <PunnettSquareVisual
                        parent1={f1Genotype}
                        parent2={f1Genotype}
                        trait={selectedTrait}
                      />
                    </div>

                    <GenerationDisplay
                      label="الجيل الثاني - الأفراد"
                      generation="F₂"
                      trait={selectedTrait}
                      plants={f2Punnett.results.map((r) => ({
                        genotype: r,
                        phenotype: getPhenotype(r, selectedTrait),
                      }))}
                    />

                    <div className="mt-4 flex justify-center">
                      <RatioBar
                        dominant={f2Ratios.dominant}
                        recessive={f2Ratios.recessive}
                        trait={selectedTrait}
                        total={4}
                      />
                    </div>

                    {/* Mendel's Law explanation */}
                    {f2Ratios.dominant === 3 && f2Ratios.recessive === 1 && (
                      <div className="mt-4 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4">
                        <h4 className="font-bold text-yellow-800 flex items-center gap-2">
                          ⭐ قانون مندل الأول (قانون الانعزال)
                        </h4>
                        <p className="text-sm text-yellow-900 mt-2 leading-relaxed">
                          ظهرت الصفة المتنحية ({selectedTrait.recessive.label}) في الجيل الثاني بنسبة 1:3 تقريباً.
                          هذا يثبت أن الصفة المتنحية لم تختفِ في الجيل الأول، بل كانت مختفية خلف الصفة السائدة.
                          عند الانقسام الاختزالي، ينفصل (ينعزل) كل زوج من العوامل الوراثية عن بعضهما.
                        </p>
                      </div>
                    )}

                    <div className="mt-4 bg-white rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-700 mb-2">النسبة الوراثية (الجينية) في F₂:</h4>
                      <div className="flex justify-center gap-4 flex-wrap">
                        {Object.entries(f2Ratios.genotypeCounts).map(([geno, count]) => (
                          <div key={geno} className="bg-gray-50 rounded-lg p-3 text-center min-w-16">
                            <div className="font-mono font-bold text-lg">{geno}</div>
                            <div className="text-xs text-gray-500">{getGenotypeName(geno)}</div>
                            <div className="text-sm font-bold text-blue-600">{count}/4</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== CONCEPTS TAB ===== */}
        {activeTab === "concepts" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-800 mb-4">📚 المصطلحات الأساسية في الوراثة</h2>
              <div className="space-y-3">
                {[
                  { term: "الصفات المتضادة (المتبادلة)", def: "صفتان لا تظهران في وقت واحد في الطراز المظهري للفرد مثل الطول والقصر، ولون الأزهار الحمراء والبيضاء." },
                  { term: "الطراز المظهري (Phenotype)", def: "الصفات الخارجية للكائن الحي." },
                  { term: "الطراز الوراثي / الجيني (Genotype)", def: "المكونات الوراثية للكائن الحي التي تحملها صبغياته." },
                  { term: "العاملان المتضادان (Alleles)", def: "جينان يشغلان نفس الموضع (الموقع) على صبغيين متشابهين ويؤثران على صفة وراثية واحدة بطريقتين مختلفتين." },
                  { term: "السيادة (Dominance)", def: "ظاهرة يكون فيها لأحد الجينين المتضادين القدرة على التعبير عن نفسه دون الجين المتضاد الآخر، ويسمى الجين السائد والصفة التي يظهرها تسمى الصفة السائدة." },
                  { term: "التنحي (Recessiveness)", def: "ظاهرة يكون فيها أحد الجينين المتضادين غير قادر على التعبير عن نفسه في وجود الجين المتضاد الآخر، ويسمى الجين المتنحي." },
                  { term: "الفرد النقي (Homozygous)", def: "فرد يحمل جينين متماثلين لصفة ما وينتج نوعاً واحداً من الأمشاج مثل TT أو tt." },
                  { term: "الفرد الخليط / الهجين (Heterozygous)", def: "فرد يحمل جينين مختلفين لصفة ما وينتج نوعين من الأمشاج مثل Tt." },
                  { term: "مربع بانيت (Punnett Square)", def: "جدول يستخدم لتحديد النسب الوراثية والمظهرية المتوقعة من عملية تلقيح بين فردين معروفي الطراز الوراثي." },
                  { term: "قانون الانعزال (مندل الأول)", def: "عند تكوين الأمشاج ينفصل كل زوج من العوامل الوراثية (الجينات) عن بعضهما بحيث يحتوي كل مشيج على عامل واحد فقط من كل زوج." },
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 rounded-lg p-4 border-r-4 border-emerald-500">
                    <span className="font-bold text-emerald-700">{item.term}: </span>
                    <span className="text-gray-700 text-sm">{item.def}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== QUIZ TAB ===== */}
        {activeTab === "quiz" && <QuizSection selectedTrait={selectedTrait} />}
      </div>

      {/* Footer */}
      <div className="bg-emerald-900 text-emerald-200 py-4 px-4 text-center text-sm mt-8">
        <p>المنهج السوداني التفاعلي 🇸🇩 | وحدة الوراثة - الصف الثالث الثانوي</p>
        <p className="text-emerald-400 text-xs mt-1">صدقة جارية لطلاب السودان</p>
      </div>
    </div>
  );
}

// ====== QUIZ SECTION ======
function QuizSection() {
  const questions = [
    {
      q: "عند تهجين نبات بسلة طويل الساق نقي (TT) مع قصير الساق (tt)، ما الطراز الوراثي لأفراد الجيل الأول؟",
      options: ["TT", "Tt", "tt", "TT و tt"],
      correct: 1,
      explanation: "كل فرد يأخذ جين T من الأب الطويل وجين t من الأب القصير، فيكون الطراز Tt (هجين).",
    },
    {
      q: "ما الطراز المظهري لأفراد الجيل الأول (Tt) لصفة طول الساق؟",
      options: ["طويل الساق", "قصير الساق", "متوسط الطول", "لا يمكن التحديد"],
      correct: 0,
      explanation: "صفة الطول سائدة على القصر، لذلك جميع أفراد F₁ طويلة الساق رغم حملها لجين القصر.",
    },
    {
      q: "ما نسبة ظهور الصفة المتنحية في الجيل الثاني (F₂)؟",
      options: ["1/2", "1/3", "1/4", "3/4"],
      correct: 2,
      explanation: "في F₂ تظهر الصفة المتنحية بنسبة 1/4 (أي 25%) وفقاً لقانون مندل الأول، والنسبة المظهرية 3:1.",
    },
    {
      q: "إذا كان الطراز الوراثي لنبات Rr (أزهار حمراء)، ما نوع الأمشاج التي ينتجها؟",
      options: ["R فقط", "r فقط", "R و r", "Rr"],
      correct: 2,
      explanation: "عند الانقسام الاختزالي، ينفصل الجينان فينتج نوعين من الأمشاج: أمشاج تحمل R وأمشاج تحمل r.",
    },
    {
      q: "ما الفرق بين التلقيح الاختباري والتلقيح الرجعي؟",
      options: [
        "التلقيح الاختباري يكون مع فرد متنحي، والرجعي مع أحد الآباء",
        "لا فرق بينهما",
        "التلقيح الرجعي يكون مع فرد متنحي فقط",
        "التلقيح الاختباري يكون مع فرد سائد فقط",
      ],
      correct: 0,
      explanation: "التلقيح الاختباري (Test Cross) هو تلقيح فرد مجهول الطراز الوراثي مع فرد متنحي نقي لمعرفة طرازه. أما التلقيح الرجعي (Back Cross) فهو تلقيح فرد من F₁ مع أحد الآباء.",
    },
  ];

  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === questions[currentQ].correct) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-emerald-100">
        <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 60 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">النتيجة</h2>
        <p className="text-4xl font-bold text-emerald-600 mb-2">{score} / {questions.length}</p>
        <p className="text-gray-500 mb-6">
          {pct >= 80 ? "ممتاز! فهمت قوانين مندل بشكل رائع!" : pct >= 60 ? "جيد! راجع المفاهيم وحاول مرة أخرى." : "حاول مرة أخرى بعد مراجعة المفاهيم."}
        </p>
        <button onClick={handleReset} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all">
          أعد المحاولة
        </button>
      </div>
    );
  }

  const q = questions[currentQ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-emerald-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-emerald-800">✏️ اختبر فهمك</h2>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {currentQ + 1} / {questions.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div
          className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
        />
      </div>

      <p className="text-gray-800 font-bold mb-4 text-base leading-relaxed">{q.q}</p>

      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let bgColor = "bg-gray-50 hover:bg-gray-100 border-gray-200";
          if (selectedAnswer !== null) {
            if (i === q.correct) bgColor = "bg-green-100 border-green-500";
            else if (i === selectedAnswer) bgColor = "bg-red-100 border-red-500";
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={selectedAnswer !== null}
              className={`w-full p-4 rounded-xl border-2 text-right transition-all ${bgColor}`}
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {String.fromCharCode(1571 + i)}
                </span>
                <span className="text-sm">{opt}</span>
                {selectedAnswer !== null && i === q.correct && <span className="mr-auto text-green-600">✓</span>}
                {selectedAnswer === i && i !== q.correct && <span className="mr-auto text-red-600">✗</span>}
              </div>
            </button>
          );
        })}
      </div>

      {showExplanation && (
        <div className={`mt-4 p-4 rounded-xl ${selectedAnswer === q.correct ? "bg-green-50 border-2 border-green-200" : "bg-orange-50 border-2 border-orange-200"}`}>
          <p className="font-bold text-sm mb-1">
            {selectedAnswer === q.correct ? "✅ إجابة صحيحة!" : "❌ إجابة خاطئة"}
          </p>
          <p className="text-sm text-gray-700">{q.explanation}</p>
        </div>
      )}

      {selectedAnswer !== null && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleNext}
            className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            {currentQ < questions.length - 1 ? "السؤال التالي ←" : "عرض النتيجة"}
          </button>
        </div>
      )}
    </div>
  );
}
