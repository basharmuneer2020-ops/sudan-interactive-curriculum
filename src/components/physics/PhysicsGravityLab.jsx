import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// =============================================
// الباب الأول: المجال التثاقلي والحركة الدائرية
// وحركة الكواكب والأقمار الاصطناعية
// المنهج السوداني التفاعلي - فيزياء الصف الثالث ثانوي
// =============================================

// ========== CONSTANTS ==========
const G = 6.67e-11; // ثابت التثاقل الكوني
const M_EARTH = 6e24; // كتلة الأرض بالكجم
const R_EARTH = 6.4e6; // نصف قطر الأرض بالمتر
const g0 = 9.8; // عجلة الجاذبية على سطح الأرض

// ========== LESSON DATA ==========
const LESSONS = [
  { id: "intro", title: "مقدمة المجال التثاقلي", icon: "🌍" },
  { id: "gravityLaw", title: "قانون التثاقل الكوني", icon: "🍎" },
  { id: "gravityAccel", title: "عجلة الجاذبية الأرضية", icon: "⬇️" },
  { id: "gravField", title: "المجال التثاقلي وشدته", icon: "🧲" },
  { id: "potentialEnergy", title: "الطاقة التثاقلية والجهد", icon: "⚡" },
  { id: "circularMotion", title: "الحركة الدائرية المنتظمة", icon: "🔄" },
  { id: "centripetalForce", title: "قوة الجذب المركزية", icon: "🎯" },
  { id: "keplerLaws", title: "قوانين كبلر", icon: "🪐" },
  { id: "satellites", title: "الأقمار الاصطناعية", icon: "🛰️" },
  { id: "simulator", title: "المحاكاة التفاعلية", icon: "🔬" },
  { id: "quiz", title: "التمارين والاختبارات", icon: "📝" },
];

// ========== PLANET DATA ==========
const PLANETS = [
  { name: "عطارد", distance: 58, period: 88, radius: 4880, moons: 0, color: "#b0b0b0" },
  { name: "الزهرة", distance: 108, period: 225, radius: 12104, moons: 0, color: "#e8c56d" },
  { name: "الأرض", distance: 149, period: 365, radius: 12756, moons: 1, color: "#4a90d9" },
  { name: "المريخ", distance: 228, period: 687, radius: 6794, moons: 2, color: "#c1440e" },
  { name: "المشتري", distance: 778, period: 4333, radius: 142984, moons: 63, color: "#c88b3a" },
  { name: "زحل", distance: 1429, period: 10759, radius: 120536, moons: 34, color: "#e4d191" },
  { name: "أورانوس", distance: 2871, period: 30687, radius: 51118, moons: 27, color: "#7ec8e3" },
  { name: "نبتون", distance: 4504, period: 60190, radius: 49532, moons: 17, color: "#3f51b5" },
  { name: "بلوتو", distance: 5913, period: 90613, radius: 2274, moons: 1, color: "#9e9e9e" },
];

// ========== QUIZ DATA ==========
const QUIZ_QUESTIONS = [
  {
    q: "ما هو ثابت التثاقل الكوني (ج)؟",
    options: ["6.67 × 10⁻¹¹ نيوتن.م²/كجم²", "9.8 م/ث²", "6.4 × 10⁶ م", "6 × 10²⁴ كجم"],
    correct: 0,
    explanation: "ثابت التثاقل الكوني ج = 6.67 × 10⁻¹¹ نيوتن.م²/كجم² وقيمته ثابتة في كل أنحاء الكون"
  },
  {
    q: "طائرة ركاب تطير على ارتفاع 15 كم فوق سطح الأرض. ما قيمة عجلة الجاذبية داخل الطائرة تقريباً؟",
    options: ["9.75 م/ث²", "0 م/ث²", "5 م/ث²", "9.8 م/ث²"],
    correct: 0,
    explanation: "ف = نق + 15 كم = 6415 كم، د = 9.8 × (6400/6415)² ≈ 9.75 م/ث². الانخفاض طفيف جداً لأن 15 كم صغيرة مقارنة بنصف قطر الأرض"
  },
  {
    q: "ما هي القوة اللازمة لبقاء القمر في مداره حول الأرض؟",
    options: ["قوة الجذب المركزية = قوة التثاقل", "قوة الطرد المركزية فقط", "قوة الاحتكاك", "لا توجد قوة"],
    correct: 0,
    explanation: "للأجرام السماوية والأقمار الاصطناعية: قوة الجذب المركزية = قوة التثاقل الكوني بين الجسمين"
  },
  {
    q: "حسب قانون كبلر الأول، كيف يتحرك كل كوكب؟",
    options: ["في مدار إهليلجي والشمس في إحدى بؤرتيه", "في مدار دائري", "في خط مستقيم", "في مدار إهليلجي والشمس في المركز"],
    correct: 0,
    explanation: "قانون كبلر الأول (قانون المدارات): كل كوكب يتحرك في مدار إهليلجي بحيث تكون الشمس في إحدى بؤرتي هذا المدار"
  },
  {
    q: "ما العلاقة في قانون كبلر الثالث؟",
    options: ["نق³ تتناسب مع ز²", "نق² تتناسب مع ز³", "نق تتناسب مع ز", "نق³ تتناسب مع ز³"],
    correct: 0,
    explanation: "قانون كبلر الثالث: مكعب متوسط المسافة بين الشمس والكوكب يتناسب طردياً مع مربع الزمن الدوري"
  },
  {
    q: "لماذا لا تسقط الأجسام الثقيلة أسرع من الخفيفة؟",
    options: ["لأن عجلة الجاذبية لا تتوقف على كتلة الجسم", "لأن الأجسام الثقيلة أبطأ", "بسبب مقاومة الهواء فقط", "لأن قوة الجاذبية متساوية"],
    correct: 0,
    explanation: "من المعادلة د = ج.ك₁/ف² نجد أن عجلة الجاذبية تتوقف على كتلة الأرض والمسافة فقط، ولا تتوقف على كتلة الجسم نفسه - وهذا ما أثبته جاليلو"
  },
  {
    q: "قمر اصطناعي يدور حول الأرض مرة كل 90 دقيقة على ارتفاع 300 كم. ما تقريب سرعته؟",
    options: ["≈ 7.8 كم/ث", "≈ 3.1 كم/ث", "≈ 11 كم/ث", "≈ 1 كم/ث"],
    correct: 0,
    explanation: "ع = 2π نق ÷ ز = 2π × 6700000 ÷ 5400 ≈ 7796 م/ث ≈ 7.8 كم/ث"
  },
  {
    q: "ما هي السرعة الفلكية الأولى؟",
    options: ["أقل سرعة للدوران حول الأرض ≈ 8 كم/ث", "سرعة الإفلات من الجاذبية", "سرعة الضوء", "سرعة الصوت"],
    correct: 0,
    explanation: "السرعة الفلكية الأولى هي أقل سرعة تسمح للقمر الصناعي بالدوران حول الأرض بدون أن يسقط، وتساوي تقريباً 8 كم/ث"
  },
  {
    q: "ارتفاع قمر الاتصالات فوق سطح الأرض يساوي تقريباً:",
    options: ["35900 كم", "300 كم", "6400 كم", "380000 كم"],
    correct: 0,
    explanation: "قمر الاتصالات يدور مع الأرض في 24 ساعة فوق خط الاستواء. بحساب نق من قانون كبلر الثالث ثم طرح نصف قطر الأرض: ل = 42297.5 - 6400 ≈ 35900 كم"
  },
  {
    q: "شدة المجال التثاقلي تُعرّف بأنها:",
    options: ["القوة المؤثرة على وحدة الكتلة", "الطاقة الحركية", "القوة الكلية", "الكتلة × العجلة"],
    correct: 0,
    explanation: "شدة المجال التثاقلي = ق ÷ ك = ج.ك₁/ف² وهي تساوي عجلة الجاذبية في أي موقع فوق سطح الأرض"
  },
];

// ========== STYLES ==========
const colors = {
  primary: "#1a237e",
  secondary: "#0d47a1",
  accent: "#ff6f00",
  success: "#2e7d32",
  danger: "#c62828",
  warning: "#f57f17",
  dark: "#0a0a2e",
  light: "#e8eaf6",
  card: "#ffffff",
  glass: "rgba(255,255,255,0.12)",
  gradientPrimary: "linear-gradient(135deg, #0a0a2e 0%, #1a237e 50%, #0d47a1 100%)",
  gradientAccent: "linear-gradient(135deg, #ff6f00 0%, #ff8f00 100%)",
  gradientSuccess: "linear-gradient(135deg, #1b5e20 0%, #2e7d32 100%)",
  gradientDanger: "linear-gradient(135deg, #b71c1c 0%, #c62828 100%)",
  text: "#1a1a2e",
  textLight: "#ffffff",
  textMuted: "#78909c",
};

// ========== HELPER COMPONENTS ==========

const FormulaBox = ({ formula, label, color = colors.primary }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}15, ${color}08)`,
    border: `2px solid ${color}40`,
    borderRadius: 16,
    padding: "16px 24px",
    margin: "12px 0",
    direction: "ltr",
    textAlign: "center",
    fontFamily: "'Courier New', monospace",
    fontSize: 20,
    fontWeight: "bold",
    color: color,
    position: "relative",
  }}>
    {label && (
      <div style={{
        position: "absolute",
        top: -12,
        right: 16,
        background: color,
        color: "#fff",
        padding: "2px 12px",
        borderRadius: 8,
        fontSize: 12,
        fontFamily: "inherit",
        direction: "rtl",
      }}>{label}</div>
    )}
    {formula}
  </div>
);

const InfoCard = ({ title, children, color = colors.primary, icon }) => (
  <div style={{
    background: `linear-gradient(135deg, ${color}08, ${color}04)`,
    border: `1px solid ${color}30`,
    borderRadius: 16,
    padding: 20,
    margin: "16px 0",
    borderRight: `4px solid ${color}`,
  }}>
    {title && (
      <div style={{ fontSize: 18, fontWeight: "bold", color, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
        {icon && <span>{icon}</span>}
        {title}
      </div>
    )}
    <div style={{ fontSize: 15, lineHeight: 1.9, color: colors.text }}>{children}</div>
  </div>
);

const ExampleBox = ({ title, children }) => (
  <div style={{
    background: "linear-gradient(135deg, #fff3e010, #ff6f0008)",
    border: "1px solid #ff6f0030",
    borderRadius: 16,
    padding: 20,
    margin: "16px 0",
    borderRight: `4px solid ${colors.accent}`,
  }}>
    <div style={{ fontSize: 16, fontWeight: "bold", color: colors.accent, marginBottom: 10 }}>
      📌 {title || "مثال"}
    </div>
    <div style={{ fontSize: 15, lineHeight: 1.9, color: colors.text }}>{children}</div>
  </div>
);

// ========== GRAVITY SIMULATOR COMPONENT ==========
const GravitySimulator = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [mass1, setMass1] = useState(5.97); // ×10²⁴ كجم
  const [mass2, setMass2] = useState(1000); // كجم
  const [distance, setDistance] = useState(6400); // كم
  const [showField, setShowField] = useState(true);

  const force = useMemo(() => {
    const m1 = mass1 * 1e24;
    const m2 = mass2;
    const r = distance * 1000;
    return (G * m1 * m2) / (r * r);
  }, [mass1, mass2, distance]);

  const fieldStrength = useMemo(() => {
    const m1 = mass1 * 1e24;
    const r = distance * 1000;
    return (G * m1) / (r * r);
  }, [mass1, distance]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = 300;
    let time = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      // Background
      ctx.fillStyle = "#0a0a2e";
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (let i = 0; i < 50; i++) {
        const sx = (Math.sin(i * 127.1 + i) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 311.7 + i) * 0.5 + 0.5) * h;
        const brightness = 0.3 + 0.7 * Math.sin(time * 0.02 + i);
        ctx.fillStyle = `rgba(255,255,255,${brightness})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 1, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx1 = w * 0.3;
      const cx2 = w * 0.7;
      const cy = h / 2;

      // Field lines
      if (showField) {
        const numLines = 12;
        for (let i = 0; i < numLines; i++) {
          const angle = (i / numLines) * Math.PI * 2;
          const r1 = 50 + Math.sin(time * 0.03 + i) * 5;
          const r2 = 80 + Math.sin(time * 0.03 + i) * 8;

          ctx.strokeStyle = `rgba(100,181,246,${0.2 + 0.1 * Math.sin(time * 0.02 + i)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(cx1 + Math.cos(angle) * r1, cy + Math.sin(angle) * r1);
          ctx.lineTo(cx1 + Math.cos(angle) * r2, cy + Math.sin(angle) * r2);
          ctx.stroke();
        }
      }

      // Earth (mass 1)
      const earthRadius = Math.min(35, 20 + mass1 * 2);
      const gradient1 = ctx.createRadialGradient(cx1, cy, 0, cx1, cy, earthRadius);
      gradient1.addColorStop(0, "#64b5f6");
      gradient1.addColorStop(0.5, "#1976d2");
      gradient1.addColorStop(1, "#0d47a1");
      ctx.fillStyle = gradient1;
      ctx.beginPath();
      ctx.arc(cx1, cy, earthRadius, 0, Math.PI * 2);
      ctx.fill();

      // Glow
      ctx.shadowColor = "#42a5f5";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.arc(cx1, cy, earthRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Object (mass 2)
      const objRadius = Math.min(15, 5 + mass2 / 500);
      const gradient2 = ctx.createRadialGradient(cx2, cy, 0, cx2, cy, objRadius);
      gradient2.addColorStop(0, "#ffb74d");
      gradient2.addColorStop(1, "#e65100");
      ctx.fillStyle = gradient2;
      ctx.beginPath();
      ctx.arc(cx2, cy, objRadius, 0, Math.PI * 2);
      ctx.fill();

      // Force arrow
      const arrowLen = Math.min(80, Math.log10(force + 1) * 15);
      const pulse = 0.8 + 0.2 * Math.sin(time * 0.05);

      ctx.strokeStyle = `rgba(255,111,0,${pulse})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx2 - objRadius - 5, cy);
      ctx.lineTo(cx2 - objRadius - 5 - arrowLen, cy);
      ctx.stroke();

      // Arrow head
      ctx.fillStyle = `rgba(255,111,0,${pulse})`;
      ctx.beginPath();
      ctx.moveTo(cx2 - objRadius - 5 - arrowLen, cy);
      ctx.lineTo(cx2 - objRadius - 5 - arrowLen + 10, cy - 6);
      ctx.lineTo(cx2 - objRadius - 5 - arrowLen + 10, cy + 6);
      ctx.closePath();
      ctx.fill();

      // Opposite arrow
      ctx.strokeStyle = `rgba(100,181,246,${pulse})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx1 + earthRadius + 5, cy);
      ctx.lineTo(cx1 + earthRadius + 5 + arrowLen * 0.4, cy);
      ctx.stroke();

      ctx.fillStyle = `rgba(100,181,246,${pulse})`;
      ctx.beginPath();
      const ax = cx1 + earthRadius + 5 + arrowLen * 0.4;
      ctx.moveTo(ax, cy);
      ctx.lineTo(ax - 10, cy - 6);
      ctx.lineTo(ax - 10, cy + 6);
      ctx.closePath();
      ctx.fill();

      // Labels
      ctx.fillStyle = "#fff";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.fillText(`ك₁ = ${mass1} × 10²⁴ كجم`, cx1, cy + earthRadius + 25);
      ctx.fillText(`ك₂ = ${mass2} كجم`, cx2, cy + objRadius + 25);

      ctx.fillStyle = "#ff6f00";
      ctx.font = "bold 13px Arial";
      ctx.fillText(`ق = ${force.toExponential(2)} نيوتن`, w / 2, 30);

      // Distance label
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(cx1, cy + earthRadius + 45);
      ctx.lineTo(cx2, cy + earthRadius + 45);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = "#aaa";
      ctx.font = "12px Arial";
      ctx.fillText(`ف = ${distance} كم`, w / 2, cy + earthRadius + 60);

      time++;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [mass1, mass2, distance, force, showField]);

  return (
    <div style={{ margin: "20px 0" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 300, borderRadius: 16, border: "1px solid #1a237e30" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>
            كتلة الجسم الأول (×10²⁴ كجم)
          </label>
          <input type="range" min="0.5" max="20" step="0.5" value={mass1}
            onChange={e => setMass1(parseFloat(e.target.value))}
            style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontWeight: "bold", color: colors.secondary }}>{mass1}</div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>
            كتلة الجسم الثاني (كجم)
          </label>
          <input type="range" min="1" max="10000" step="100" value={mass2}
            onChange={e => setMass2(parseFloat(e.target.value))}
            style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontWeight: "bold", color: colors.accent }}>{mass2}</div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>
            المسافة (كم)
          </label>
          <input type="range" min="6400" max="50000" step="100" value={distance}
            onChange={e => setDistance(parseFloat(e.target.value))}
            style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontWeight: "bold", color: colors.success }}>{distance}</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
        <div style={{ background: `${colors.secondary}10`, borderRadius: 12, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: colors.textMuted }}>قوة التثاقل</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: colors.secondary }}>{force.toExponential(3)} N</div>
        </div>
        <div style={{ background: `${colors.accent}10`, borderRadius: 12, padding: 12, textAlign: "center" }}>
          <div style={{ fontSize: 12, color: colors.textMuted }}>شدة المجال التثاقلي</div>
          <div style={{ fontSize: 18, fontWeight: "bold", color: colors.accent }}>{fieldStrength.toFixed(4)} N/kg</div>
        </div>
      </div>
    </div>
  );
};

// ========== CIRCULAR MOTION SIMULATOR ==========
const CircularMotionSim = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [radius, setRadius] = useState(100);
  const [speed, setSpeed] = useState(3);
  const [showVectors, setShowVectors] = useState(true);

  const period = useMemo(() => (2 * Math.PI * radius) / speed, [radius, speed]);
  const frequency = useMemo(() => 1 / period, [period]);
  const omega = useMemo(() => (2 * Math.PI) / period, [period]);
  const centripetal = useMemo(() => (speed * speed) / radius, [speed, radius]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = 320;
    let angle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#f5f5ff";
      ctx.fillRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const r = Math.min(120, radius * 0.8);

      // Orbit circle
      ctx.strokeStyle = "#1a237e30";
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 4]);
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Center point
      ctx.fillStyle = "#1a237e";
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // Object position
      const objX = cx + r * Math.cos(angle);
      const objY = cy + r * Math.sin(angle);

      // Object
      ctx.fillStyle = "#ff6f00";
      ctx.shadowColor = "#ff6f00";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(objX, objY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Trail
      ctx.strokeStyle = "#ff6f0040";
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 30; i++) {
        const a = angle - i * 0.05;
        const tx = cx + r * Math.cos(a);
        const ty = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();

      if (showVectors) {
        // Velocity vector (tangential)
        const vScale = speed * 8;
        const vx = -Math.sin(angle) * vScale;
        const vy = Math.cos(angle) * vScale;

        ctx.strokeStyle = "#2e7d32";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(objX + vx, objY + vy);
        ctx.stroke();

        // Velocity arrow head
        const vAngle = Math.atan2(vy, vx);
        ctx.fillStyle = "#2e7d32";
        ctx.beginPath();
        ctx.moveTo(objX + vx, objY + vy);
        ctx.lineTo(objX + vx - 10 * Math.cos(vAngle - 0.3), objY + vy - 10 * Math.sin(vAngle - 0.3));
        ctx.lineTo(objX + vx - 10 * Math.cos(vAngle + 0.3), objY + vy - 10 * Math.sin(vAngle + 0.3));
        ctx.closePath();
        ctx.fill();

        // Centripetal acceleration (toward center)
        const aScale = centripetal * 5;
        const ax = (cx - objX) / r * Math.min(aScale, 60);
        const ay = (cy - objY) / r * Math.min(aScale, 60);

        ctx.strokeStyle = "#c62828";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(objX, objY);
        ctx.lineTo(objX + ax, objY + ay);
        ctx.stroke();

        const aAngle2 = Math.atan2(ay, ax);
        ctx.fillStyle = "#c62828";
        ctx.beginPath();
        ctx.moveTo(objX + ax, objY + ay);
        ctx.lineTo(objX + ax - 10 * Math.cos(aAngle2 - 0.3), objY + ay - 10 * Math.sin(aAngle2 - 0.3));
        ctx.lineTo(objX + ax - 10 * Math.cos(aAngle2 + 0.3), objY + ay - 10 * Math.sin(aAngle2 + 0.3));
        ctx.closePath();
        ctx.fill();

        // Labels
        ctx.font = "bold 13px Arial";
        ctx.fillStyle = "#2e7d32";
        ctx.fillText("ع (سرعة مماسة)", objX + vx + 5, objY + vy - 5);
        ctx.fillStyle = "#c62828";
        ctx.fillText("جـ (عجلة مركزية)", objX + ax + 5, objY + ay + 15);
      }

      // Radius line
      ctx.strokeStyle = "#1a237e60";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(objX, objY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#1a237e";
      ctx.font = "12px Arial";
      ctx.fillText("نق", (cx + objX) / 2 + 5, (cy + objY) / 2 - 5);

      angle += omega * 0.016;
      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animRef.current);
  }, [radius, speed, showVectors, omega, centripetal]);

  return (
    <div style={{ margin: "20px 0" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 320, borderRadius: 16, border: "1px solid #1a237e20" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted }}>نصف القطر (م)</label>
          <input type="range" min="30" max="200" value={radius} onChange={e => setRadius(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontWeight: "bold" }}>{radius} م</div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted }}>السرعة (م/ث)</label>
          <input type="range" min="1" max="10" step="0.5" value={speed} onChange={e => setSpeed(+e.target.value)} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontWeight: "bold" }}>{speed} م/ث</div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 12 }}>
        {[
          { label: "الزمن الدوري", value: `${period.toFixed(2)} ث`, color: colors.primary },
          { label: "التردد", value: `${frequency.toFixed(4)} Hz`, color: colors.secondary },
          { label: "السرعة الزاوية", value: `${omega.toFixed(3)} rad/s`, color: colors.accent },
          { label: "عجلة الجذب المركزية", value: `${centripetal.toFixed(2)} م/ث²`, color: colors.danger },
        ].map((item, i) => (
          <div key={i} style={{ background: `${item.color}10`, borderRadius: 10, padding: 10, textAlign: "center" }}>
            <div style={{ fontSize: 11, color: colors.textMuted }}>{item.label}</div>
            <div style={{ fontSize: 14, fontWeight: "bold", color: item.color, direction: "ltr" }}>{item.value}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <button onClick={() => setShowVectors(!showVectors)}
          style={{
            background: showVectors ? colors.primary : "#ccc",
            color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13,
          }}>
          {showVectors ? "إخفاء المتجهات" : "إظهار المتجهات"}
        </button>
      </div>
    </div>
  );
};

// ========== KEPLER ORBITS SIMULATOR ==========
const KeplerSimulator = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const [eccentricity, setEccentricity] = useState(0.3);
  const [showAreas, setShowAreas] = useState(true);
  const [selectedPlanet, setSelectedPlanet] = useState(2); // Earth

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = 350;
    let theta = 0;
    let areaPoints = [];

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#0a0a2e";
      ctx.fillRect(0, 0, w, h);

      // Stars
      for (let i = 0; i < 80; i++) {
        const sx = (Math.sin(i * 127.1) * 0.5 + 0.5) * w;
        const sy = (Math.cos(i * 311.7) * 0.5 + 0.5) * h;
        ctx.fillStyle = `rgba(255,255,255,${0.2 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      const cx = w / 2;
      const cy = h / 2;
      const a = Math.min(w, h) * 0.35; // semi-major axis
      const b = a * Math.sqrt(1 - eccentricity * eccentricity); // semi-minor
      const focusOffset = a * eccentricity;

      // Sun at focus
      const sunX = cx + focusOffset;
      const sunY = cy;

      // Draw orbit (ellipse)
      ctx.strokeStyle = "rgba(255,255,255,0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(cx, cy, a, b, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Perihelion and Aphelion labels
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.font = "11px Arial";
      ctx.textAlign = "center";
      ctx.fillText("الحضيض", cx - a + 5, cy - 15);
      ctx.fillText("الأوج", cx + a - 5, cy - 15);

      // Planet position using Kepler equation approximation
      const r = a * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(theta));
      const planetX = sunX + r * Math.cos(theta + Math.PI);
      const planetY = sunY + r * Math.sin(theta + Math.PI);

      // Area sweep visualization
      if (showAreas) {
        areaPoints.push({ x: planetX, y: planetY });
        if (areaPoints.length > 3) {
          // Draw area sectors at intervals
          const interval = Math.floor(areaPoints.length / 3);
          if (interval > 5) {
            for (let s = 0; s < 3; s++) {
              const start = s * interval;
              const end = Math.min(start + interval, areaPoints.length - 1);
              const sectorColors = ["rgba(76,175,80,0.15)", "rgba(33,150,243,0.15)", "rgba(255,152,0,0.15)"];
              ctx.fillStyle = sectorColors[s];
              ctx.beginPath();
              ctx.moveTo(sunX, sunY);
              for (let i = start; i <= end; i++) {
                ctx.lineTo(areaPoints[i].x, areaPoints[i].y);
              }
              ctx.closePath();
              ctx.fill();
            }
          }
        }
        if (areaPoints.length > 600) areaPoints = areaPoints.slice(-600);
      }

      // Sun
      const sunGrad = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 20);
      sunGrad.addColorStop(0, "#fff9c4");
      sunGrad.addColorStop(0.3, "#ffeb3b");
      sunGrad.addColorStop(0.7, "#ff9800");
      sunGrad.addColorStop(1, "#f4431600");
      ctx.fillStyle = sunGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 20, 0, Math.PI * 2);
      ctx.fill();

      // Sun core
      ctx.fillStyle = "#fff9c4";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Planet
      const planet = PLANETS[selectedPlanet];
      ctx.fillStyle = planet.color;
      ctx.shadowColor = planet.color;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(planetX, planetY, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Planet label
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px Arial";
      ctx.textAlign = "center";
      ctx.fillText(planet.name, planetX, planetY - 15);

      // Radius vector
      ctx.strokeStyle = "rgba(255,255,255,0.15)";
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(sunX, sunY);
      ctx.lineTo(planetX, planetY);
      ctx.stroke();
      ctx.setLineDash([]);

      // Focus markers
      ctx.fillStyle = "#ff980080";
      ctx.beginPath();
      ctx.arc(sunX, sunY, 3, 0, Math.PI * 2);
      ctx.fill();

      const focus2X = cx - focusOffset;
      ctx.fillStyle = "#ffffff30";
      ctx.beginPath();
      ctx.arc(focus2X, cy, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.font = "10px Arial";
      ctx.fillText("البؤرة أ (الشمس)", sunX, sunY + 30);
      ctx.fillText("البؤرة ب", focus2X, cy + 30);

      // Speed varies with position (Kepler's 2nd law)
      const speedFactor = 0.0003 * (a / r) * (a / r);
      theta += speedFactor;
      if (theta > Math.PI * 2) theta -= Math.PI * 2;

      animRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [eccentricity, showAreas, selectedPlanet]);

  return (
    <div style={{ margin: "20px 0" }}>
      <canvas ref={canvasRef} style={{ width: "100%", height: 350, borderRadius: 16 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted }}>اللامركزية (شكل المدار)</label>
          <input type="range" min="0" max="0.9" step="0.05" value={eccentricity}
            onChange={e => setEccentricity(parseFloat(e.target.value))} style={{ width: "100%" }} />
          <div style={{ textAlign: "center", fontSize: 13 }}>
            {eccentricity === 0 ? "دائري تام" : eccentricity < 0.3 ? "قريب من الدائري" : eccentricity < 0.6 ? "إهليلجي" : "إهليلجي ممدود"}
            {" "}({eccentricity})
          </div>
        </div>
        <div>
          <label style={{ fontSize: 13, color: colors.textMuted }}>اختر الكوكب</label>
          <select value={selectedPlanet} onChange={e => setSelectedPlanet(+e.target.value)}
            style={{ width: "100%", padding: 8, borderRadius: 8, border: "1px solid #ccc", fontSize: 14, marginTop: 4 }}>
            {PLANETS.map((p, i) => (
              <option key={i} value={i}>{p.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div style={{ marginTop: 8, textAlign: "center" }}>
        <button onClick={() => setShowAreas(!showAreas)}
          style={{
            background: showAreas ? colors.success : "#ccc",
            color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", cursor: "pointer", fontSize: 13,
          }}>
          {showAreas ? "إخفاء المساحات المتساوية" : "إظهار قانون كبلر الثاني"}
        </button>
      </div>
    </div>
  );
};

// ========== SATELLITE CALCULATOR ==========
const SatelliteCalculator = () => {
  const [altitude, setAltitude] = useState(300); // كم
  const [showDetails, setShowDetails] = useState(false);

  const results = useMemo(() => {
    const r = (R_EARTH + altitude * 1000); // متر
    const v = Math.sqrt((G * M_EARTH) / r);
    const T = (2 * Math.PI * r) / v;
    const omega = (2 * Math.PI) / T;
    const g_h = (G * M_EARTH) / (r * r);
    const escape_v = Math.sqrt(2) * v;

    return {
      orbitalSpeed: v,
      period: T,
      periodMin: T / 60,
      periodHours: T / 3600,
      omega,
      gravityAtAlt: g_h,
      escapeSpeed: escape_v,
      circumference: 2 * Math.PI * r,
    };
  }, [altitude]);

  const isGeostationary = Math.abs(results.periodHours - 24) < 0.5;

  return (
    <div style={{ background: "#f5f5ff", borderRadius: 16, padding: 20, margin: "16px 0" }}>
      <div style={{ fontSize: 18, fontWeight: "bold", color: colors.primary, marginBottom: 16, textAlign: "center" }}>
        🛰️ حاسبة الأقمار الاصطناعية
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 14, fontWeight: "bold" }}>الارتفاع فوق سطح الأرض: {altitude} كم</label>
        <input type="range" min="200" max="40000" step="100" value={altitude}
          onChange={e => setAltitude(+e.target.value)}
          style={{ width: "100%", marginTop: 8 }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: colors.textMuted }}>
          <span>200 كم (قمر قريب)</span>
          <span>35900 كم (قمر اتصالات)</span>
          <span>40000 كم</span>
        </div>
      </div>

      {isGeostationary && (
        <div style={{
          background: "linear-gradient(135deg, #ff6f0020, #ff8f0010)",
          border: "2px solid #ff6f00",
          borderRadius: 12,
          padding: 12,
          textAlign: "center",
          marginBottom: 12,
          animation: "pulse 2s infinite",
        }}>
          🛰️ <strong>قمر اتصالات!</strong> هذا الارتفاع يجعل القمر يدور مع الأرض في 24 ساعة فيبدو ثابتاً
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {[
          { label: "السرعة المدارية", value: `${(results.orbitalSpeed / 1000).toFixed(2)} كم/ث`, icon: "🚀", color: colors.primary },
          { label: "الزمن الدوري", value: results.periodHours > 1 ? `${results.periodHours.toFixed(2)} ساعة` : `${results.periodMin.toFixed(1)} دقيقة`, icon: "⏱️", color: colors.secondary },
          { label: "عجلة الجاذبية", value: `${results.gravityAtAlt.toFixed(3)} م/ث²`, icon: "⬇️", color: colors.accent },
          { label: "سرعة الإفلات", value: `${(results.escapeSpeed / 1000).toFixed(2)} كم/ث`, icon: "💫", color: colors.danger },
        ].map((item, i) => (
          <div key={i} style={{
            background: `${item.color}08`,
            border: `1px solid ${item.color}20`,
            borderRadius: 12,
            padding: 14,
            textAlign: "center",
          }}>
            <div style={{ fontSize: 24 }}>{item.icon}</div>
            <div style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>{item.label}</div>
            <div style={{ fontSize: 16, fontWeight: "bold", color: item.color, marginTop: 4, direction: "ltr" }}>{item.value}</div>
          </div>
        ))}
      </div>

      <button onClick={() => setShowDetails(!showDetails)}
        style={{
          width: "100%", marginTop: 12, padding: 10, borderRadius: 10,
          background: colors.primary, color: "#fff", border: "none", cursor: "pointer", fontSize: 14,
        }}>
        {showDetails ? "إخفاء الحسابات" : "عرض خطوات الحساب"}
      </button>

      {showDetails && (
        <div style={{ marginTop: 12, padding: 16, background: "#fff", borderRadius: 12, direction: "ltr", fontFamily: "monospace", fontSize: 13, lineHeight: 2 }}>
          <div>r = R_Earth + h = {R_EARTH/1e6} × 10⁶ + {altitude * 1000} = {((R_EARTH + altitude * 1000)/1e6).toFixed(3)} × 10⁶ m</div>
          <div>v = √(G·M/r) = √({G} × {M_EARTH} / {(R_EARTH + altitude * 1000).toExponential(3)})</div>
          <div>v = {results.orbitalSpeed.toFixed(2)} m/s = {(results.orbitalSpeed/1000).toFixed(2)} km/s</div>
          <div>T = 2πr/v = {results.period.toFixed(1)} s = {results.periodMin.toFixed(1)} min</div>
          <div>g(h) = G·M/r² = {results.gravityAtAlt.toFixed(4)} m/s²</div>
          <div>v_escape = √2 · v = {(results.escapeSpeed/1000).toFixed(2)} km/s</div>
        </div>
      )}
    </div>
  );
};

// ========== GRAVITY FIELD VISUALIZATION ==========
const GravityFieldViz = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width = canvas.offsetWidth;
    const h = canvas.height = 250;

    ctx.fillStyle = "#0a0a2e";
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;

    // Draw Earth
    const earthR = 35;
    const earthGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, earthR);
    earthGrad.addColorStop(0, "#64b5f6");
    earthGrad.addColorStop(0.7, "#1976d2");
    earthGrad.addColorStop(1, "#0d47a1");
    ctx.fillStyle = earthGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, earthR, 0, Math.PI * 2);
    ctx.fill();

    // Field lines (pointing inward = gravitational attraction)
    const numLines = 16;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const startR = earthR + 5;
      const endR = Math.min(w, h) / 2 - 10;

      // Arrow from outside to Earth surface
      ctx.strokeStyle = `rgba(100,181,246,${0.5})`;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * endR, cy + Math.sin(angle) * endR);
      ctx.lineTo(cx + Math.cos(angle) * startR, cy + Math.sin(angle) * startR);
      ctx.stroke();

      // Arrowhead pointing toward Earth
      const tipX = cx + Math.cos(angle) * startR;
      const tipY = cy + Math.sin(angle) * startR;
      const aLen = 8;
      ctx.fillStyle = "rgba(100,181,246,0.6)";
      ctx.beginPath();
      ctx.moveTo(tipX, tipY);
      ctx.lineTo(tipX + aLen * Math.cos(angle + 2.7), tipY + aLen * Math.sin(angle + 2.7));
      ctx.lineTo(tipX + aLen * Math.cos(angle - 2.7), tipY + aLen * Math.sin(angle - 2.7));
      ctx.closePath();
      ctx.fill();
    }

    // Labels
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("الأرض", cx, cy + 4);
    ctx.fillText("خطوط المجال التثاقلي", cx, 20);
    ctx.fillStyle = "#aaa";
    ctx.font = "11px Arial";
    ctx.fillText("(تتجه نحو مركز الأرض وتتباعد كلما بعدنا عنها)", cx, 38);
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: 250, borderRadius: 16 }} />;
};

// ========== MAIN APP COMPONENT ==========
export default function PhysicsGravityApp() {
  const [currentLesson, setCurrentLesson] = useState("intro");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [quizState, setQuizState] = useState({ current: 0, score: 0, answers: [], finished: false });
  const [progress, setProgress] = useState({});

  const markComplete = useCallback((lessonId) => {
    setProgress(p => ({ ...p, [lessonId]: true }));
  }, []);

  const completedCount = Object.values(progress).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / LESSONS.length) * 100);

  // ========== LESSON CONTENT RENDERER ==========
  const renderLesson = () => {
    switch (currentLesson) {
      case "intro":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🌍 مقدمة: المجال التثاقلي
            </h2>

            <InfoCard title="ارتباط حياتنا بالجاذبية" icon="🌏" color={colors.primary}>
              <p>ترتبط حياتنا بشكل مباشر بالمجال التثاقلي للأرض (مجال الجاذبية)، حيث تتأثر أجسامنا مباشرة وكل الأجسام الموجودة على كوكب الأرض بما في ذلك الغلاف الجوي حول الأرض بهذا المجال.</p>
              <p>كما يرتبط تعاقب الليل والنهار وتعاقب فصول السنة بدوران الأرض حول محورها ودورانها حول الشمس الناتج عن وجود تجاذب بين الشمس والأرض.</p>
              <p>بل إن التجاذب يمتد حتى يشمل التجاذب بين الشمس وكل نجوم المجرة وبين المجرات المختلفة في الكون!</p>
            </InfoCard>

            <InfoCard title="ماذا ستتعلم في هذا الباب؟" icon="📚" color={colors.secondary}>
              <p><strong>الفصل الأول:</strong> المجال التثاقلي - قانون نيوتن للتثاقل الكوني، عجلة الجاذبية، شدة المجال، الطاقة التثاقلية، والجهد التثاقلي.</p>
              <p><strong>الفصل الثاني:</strong> الحركة الدائرية المنتظمة - الزمن الدوري، التردد، السرعة الزاوية، قوة الجذب المركزية.</p>
              <p><strong>الفصل الثالث:</strong> حركة الكواكب والأقمار الاصطناعية - قوانين كبلر الثلاثة، الأقمار الاصطناعية، السرعة الفلكية، وسرعة الإفلات.</p>
            </InfoCard>

            <InfoCard title="إسهامات المسلمين في فهم الجاذبية" icon="🌙" color={colors.success}>
              <p>عرف المسلمون منذ القرن التاسع الميلادي قوة التثاقل الناشئة عن جذب الأرض للأجسام وأطلقوا عليها اسم <strong>القوة الطبيعية</strong>.</p>
              <p>عبّر <strong>البيروني</strong> عن ذلك بقوله أن الخلاء الذي في بطن الأرض يمسك الناس حواليها.</p>
              <p>ذكر <strong>الإدريسي</strong> (493 هـ - 565 هـ) في كتابه "نزهة المشتاق في اختراق الآفاق" أن الأرض جاذبة لما عليها من الثقل بمنزلة حجر المغناطيس الذي يجذب الحديد.</p>
              <p>أكد العالم <strong>الخازني</strong> (515 هـ) أن الأجسام الساقطة تنجذب نحو مركز الأرض، وأن اختلاف قوة الجذب يرجع إلى المسافة.</p>
            </InfoCard>

            <GravityFieldViz />

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("intro"); setCurrentLesson("gravityLaw"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                ابدأ الدراسة: قانون التثاقل الكوني ←
              </button>
            </div>
          </div>
        );

      case "gravityLaw":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🍎 قانون التثاقل الكوني (قانون نيوتن)
            </h2>

            <InfoCard title="من جاليليو إلى نيوتن" icon="🔭" color={colors.primary}>
              <p>أجرى العالم الإيطالي <strong>جاليليو</strong> (1564-1642م) تجربته الشهيرة من فوق برج بيزا المائل التي أثبتت أن <strong>الأجسام ذات الكتل المختلفة والتي تسقط من ارتفاع واحد تصل في نفس الزمن إلى الأرض</strong>.</p>
              <p>أما العالم الإنجليزي الشهير <strong>إسحق نيوتن</strong> (1642-1727م) فقد استطاع صياغة قانون التثاقل الأرضي في صورة معادلة رياضية.</p>
            </InfoCard>

            <InfoCard title="قانون التثاقل الكوني" icon="📐" color={colors.secondary}>
              <p>في عام 1666م استنتج إسحق نيوتن <strong>قانون التثاقل الكوني</strong> وينص على أن:</p>
            </InfoCard>

            <FormulaBox
              label="قانون التثاقل الكوني"
              formula="ق = ج × (ك₁ × ك₂) / ف²"
              color={colors.primary}
            />

            <InfoCard color={colors.accent}>
              <p>أي جسمين كتلتاهما ك₁ و ك₂ يتجاذبان بقوة ق تتناسب طردياً مع مضروب كتلتيهما وعكسياً مع مربع المسافة (ف) بين مركزيهما.</p>
              <p>حيث <strong>ج</strong> هو ثابت التناسب ويسمى <strong>ثابت التثاقل الكوني</strong> وقيمته ثابتة في كل أنحاء الكون:</p>
            </InfoCard>

            <FormulaBox
              label="ثابت التثاقل الكوني"
              formula="ج = 6.67 × 10⁻¹¹ نيوتن.م² / كجم²"
              color={colors.accent}
            />

            <h3 style={{ color: colors.primary, marginTop: 24 }}>🔬 محاكاة تفاعلية: قانون التثاقل</h3>
            <p style={{ color: colors.textMuted, fontSize: 14 }}>غيّر الكتل والمسافة وشاهد تأثيرها على قوة التثاقل:</p>
            <GravitySimulator />

            <ExampleBox title="مثال: كتلة الأرض">
              <p>من المعادلة د₀ = ج ك₁ / نق² يمكن إيجاد كتلة الأرض:</p>
              <FormulaBox formula="ك₁ = د₀ × نق² / ج" color={colors.success} />
              <p style={{ direction: "ltr", textAlign: "center" }}>
                ك₁ = (9.8 × (6.4 × 10⁶)²) / (6.67 × 10⁻¹¹) ≈ 6 × 10²⁴ كجم
              </p>
              <p>أي 6,000,000,000,000,000,000,000,000 كجم!</p>
            </ExampleBox>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("gravityLaw"); setCurrentLesson("gravityAccel"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: عجلة الجاذبية الأرضية ←
              </button>
            </div>
          </div>
        );

      case "gravityAccel":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              ⬇️ عجلة الجاذبية الأرضية (عجلة السقوط الحر)
            </h2>

            <InfoCard title="العلاقة بين الوزن وقانون التثاقل" icon="⚖️" color={colors.primary}>
              <p>نعرف من دراستنا في الصف الأول أن وزن جسم على سطح الأرض هو قوة وبالتالي تساوي الكتلة × العجلة:</p>
            </InfoCard>

            <FormulaBox label="الوزن" formula="و = ك × د" color={colors.primary} />

            <InfoCard color={colors.secondary}>
              <p>حيث ك ≡ كتلة الجسم ، د = 9.8 م/ث² على سطح الأرض</p>
              <p>ولكننا نعرف أيضاً أن هذا الجسم والأرض يتجاذبان حسب <strong>قانون التثاقل الكوني</strong> مما يعني أن:</p>
              <p style={{ textAlign: "center", fontWeight: "bold" }}>وزن الجسم = قوة التثاقل بين الأرض والجسم</p>
            </InfoCard>

            <FormulaBox label="عجلة الجاذبية" formula="د = ج × ك₁ / ف²" color={colors.accent} />

            <InfoCard title="خصائص عجلة الجاذبية" icon="📊" color={colors.success}>
              <p>المعادلة توضح أن عجلة الجاذبية الأرضية تتوقف على:</p>
              <p>✅ <strong>كتلة الأرض</strong> (وهي طبعاً كمية ثابتة)</p>
              <p>✅ <strong>بُعد الجسم من مركز الأرض</strong> (تقل كلما زاد هذا البُعد)</p>
              <p>❌ <strong>لا تتوقف على كتلة الجسم نفسه</strong> - فكل الأجسام الخفيفة والثقيلة تؤثر عليها نفس عجلة الجاذبية إذا كانت في نفس الموقع</p>
              <p style={{ fontSize: 13, color: colors.textMuted }}>(وهذا ما كان قد أثبته العالم جاليلو بالتجربة من برج بيزا المائل)</p>
            </InfoCard>

            <FormulaBox label="على سطح الأرض (ف = نق)" formula="د₀ = ج × ك₁ / نق² = 9.8 م/ث²" color={colors.primary} />
            <FormulaBox label="تغير د مع الارتفاع" formula="د = د₀ × (نق² / ف²)" color={colors.secondary} />

            <ExampleBox title="مثال (1-1): عجلة الجاذبية داخل طائرة">
              <p>طائرة ركاب تطير على ارتفاع 15 كم فوق سطح الأرض. جد عجلة الجاذبية داخل تلك الطائرة علماً بأن نصف قطر الأرض نق = 6400 كم.</p>
              <p><strong>الحل:</strong></p>
              <p style={{ direction: "ltr", textAlign: "center" }}>
                ف = نق + 15 كم = 6400 + 15 = 6415 كم<br/>
                د = 9.8 × (6400/6415)² = 9.8 × 0.99533 = 9.75 م/ث²
              </p>
              <p>أي أن هناك انخفاضاً طفيفاً في قيمة (د) وأن د = 99.533% من قيمة د₀</p>
            </ExampleBox>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("gravityAccel"); setCurrentLesson("gravField"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: المجال التثاقلي وشدته ←
              </button>
            </div>
          </div>
        );

      case "gravField":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🧲 المجال التثاقلي وشدته
            </h2>

            <InfoCard title="مفهوم المجال التثاقلي" icon="🌐" color={colors.primary}>
              <p>قانون التثاقل الكوني يدل على وجود قوة تجاذب بين أي جسمين ماديين بالرغم من وجود مسافة بينهما. وجود هذه القوة يعني أن أي جسم يؤثر على الجسم الآخر من بُعد.</p>
              <p>عند وجود تأثير قوة بالرغم من وجود مسافة يقال أن هناك <strong>مجالاً</strong>.</p>
            </InfoCard>

            <div style={{
              background: `linear-gradient(135deg, ${colors.primary}15, ${colors.primary}05)`,
              border: `2px solid ${colors.primary}`,
              borderRadius: 16, padding: 20, margin: "16px 0", textAlign: "center",
            }}>
              <div style={{ fontSize: 18, fontWeight: "bold", color: colors.primary }}>
                المجال التثاقلي لأي جسم هو المنطقة حول هذا الجسم التي يؤثر بها على الأجسام الموجودة فيها
              </div>
            </div>

            <h3 style={{ color: colors.secondary }}>شدة المجال التثاقلي</h3>

            <InfoCard color={colors.secondary}>
              <p>شدة المجال التثاقلي للأرض في نقطة ما على مسافة (ف) من مركز الأرض تُعرّف بأنها هي <strong>قوة التثاقل بين كتلة الأرض وبين ما مقداره وحدة الكتلة (أي ك=1) في نفس النقطة</strong>.</p>
            </InfoCard>

            <FormulaBox label="شدة المجال التثاقلي" formula="شد = ق ÷ ك = ج × ك₁ / ف²  (نيوتن/كجم)" color={colors.primary} />

            <InfoCard title="ملاحظات مهمة" icon="💡" color={colors.accent}>
              <p>✅ شدة المجال التثاقلي تتناسب <strong>طردياً</strong> مع كتلة الأرض فقط</p>
              <p>✅ وتتناسب <strong>عكسياً</strong> مع مربع المسافة من مركز الأرض</p>
              <p>✅ <strong>لا تتوقف على كتلة الجسم الموجود في المجال</strong></p>
              <p>✅ بمقارنة المعادلة مع معادلة عجلة الجاذبية نجد أن: <strong>شدة المجال = عجلة الجاذبية</strong> في أي موقع فوق سطح الأرض</p>
            </InfoCard>

            <FormulaBox label="قوة التثاقل بدلالة شدة المجال" formula="ق = شد × ك" color={colors.success} />

            <GravityFieldViz />

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("gravField"); setCurrentLesson("potentialEnergy"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: الطاقة التثاقلية والجهد ←
              </button>
            </div>
          </div>
        );

      case "potentialEnergy":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              ⚡ الطاقة التثاقلية (طاقة الوضع) والجهد التثاقلي
            </h2>

            <InfoCard title="طاقة الوضع" icon="📐" color={colors.primary}>
              <p><strong>الطاقة هي المقدرة على إنجاز الشغل</strong></p>
              <p>إذا رفعت جسماً من سطح الأرض إلى سطح مبنى مثلاً تكون قد بذلت عليه شغلاً وبذلك اكتسب طاقة اسمها <strong>طاقة الوضع</strong> (بسبب ارتفاعه عن الأرض).</p>
            </InfoCard>

            <FormulaBox label="طاقة الوضع (بالقرب من سطح الأرض)" formula="ط و = ك × د × ل" color={colors.primary} />

            <InfoCard title="طاقة الوضع العامة" icon="🌍" color={colors.secondary}>
              <p>باستعمال قانون التثاقل الكوني، طاقة الوضع لجسم كتلته ك على بُعد ف من مركز الأرض:</p>
            </InfoCard>

            <FormulaBox label="طاقة الوضع (العامة)" formula="ط و = - (ج × ك₁ × ك) / ف" color={colors.accent} />

            <InfoCard color={colors.warning}>
              <p>لاحظ أن طاقة الوضع <strong>سالبة</strong> وإنها تتناسب عكسياً مع المسافة ف (وليس مع مربع المسافة كما في حالة القوة).</p>
              <p>في مركز الأرض ف=صفر ولذلك <strong>طاقة الوضع تساوي صفراً</strong> في مركز الأرض.</p>
            </InfoCard>

            <h3 style={{ color: colors.secondary, marginTop: 24 }}>الجهد التثاقلي</h3>

            <InfoCard title="تعريف الجهد التثاقلي" icon="⚡" color={colors.secondary}>
              <p>الجهد في المجال التثاقلي لجسم ما هو <strong>طاقة وضع وحدة الكتلة</strong> (أي ك=1) في تلك النقطة.</p>
              <p>الجهد التثاقلي في أي نقطة حول الأرض <strong>لا يتوقف على كتلة الجسم</strong> في تلك النقطة.</p>
            </InfoCard>

            <FormulaBox label="الجهد التثاقلي" formula="ط و / ك = - ج × ك₁ / ف   (جول/كجم)" color={colors.primary} />

            <ExampleBox title="مثال (1-3)">
              <p>جد طاقة وضع جسم كتلته 1 طن يدور على ارتفاع 1000 كم من سطح الأرض، علماً بأن كتلة الأرض = 6 × 10²⁴ كجم ونصف قطر الأرض 6400 كم.</p>
              <p><strong>الحل:</strong></p>
              <p style={{ direction: "ltr", textAlign: "center" }}>
                ف = نق + 1000 كم = 6400 + 1000 = 7400 كم = 7.4 × 10⁶ م<br/>
                ط و = -(ج × ك₁ × ك) / ف<br/>
                = -(6.67 × 10⁻¹¹ × 6 × 10²⁴ × 1000) / (7.4 × 10⁶)<br/>
                = -5.41 × 10¹⁰ جول
              </p>
            </ExampleBox>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("potentialEnergy"); setCurrentLesson("circularMotion"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: الحركة الدائرية المنتظمة ←
              </button>
            </div>
          </div>
        );

      case "circularMotion":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🔄 الحركة الدائرية المنتظمة
            </h2>

            <InfoCard title="لماذا ندرس الحركة الدائرية؟" icon="🌏" color={colors.primary}>
              <p>ذكرنا عند الحديث عن قانون التثاقل الكوني أن القمر يدور حول الأرض، وأن الكواكب تدور حول الشمس. فإذا نظرنا حولنا على الأرض نجد أن في غالبها الأعم ليست حركة في خط مستقيم وإنما في منحنيات.</p>
              <p>لذلك لابد من دراسة حركة الأجسام التي تتحرك في دائرة أو جزء من دائرة.</p>
            </InfoCard>

            <h3 style={{ color: colors.secondary }}>قوانين الحركة الدائرية</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <FormulaBox label="1/ الزمن الدوري" formula="ز = المسافة ÷ السرعة = 2π نق ÷ ع" color={colors.primary} />
              </div>
              <div>
                <FormulaBox label="2/ التردد" formula="ذ = 1 ÷ ز  (هيرتز)" color={colors.secondary} />
              </div>
            </div>

            <FormulaBox label="3/ السرعة المماسة" formula="ع = 2π نق ÷ ز = 2π نق × ذ" color={colors.accent} />

            <h3 style={{ color: colors.success }}>السرعة الزاوية (ω)</h3>

            <InfoCard color={colors.success}>
              <p>مثل تغير المسافة في الزمن هي سرعة ولكنها خاصة بالحركة الدائرية (لوجود الزاوية هـ)، تسمى <strong>السرعة الزاوية</strong> وهي تمثل مقدار الزاوية المزاحة في الثانية الواحدة.</p>
            </InfoCard>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormulaBox label="السرعة الزاوية" formula="ω = هـ ÷ ن = 2π ÷ ز" color={colors.success} />
              <FormulaBox label="العلاقة مع السرعة المماسة" formula="ع = نق × ω" color={colors.warning} />
            </div>

            <h3 style={{ color: colors.primary, marginTop: 24 }}>🔬 محاكاة تفاعلية: الحركة الدائرية</h3>
            <CircularMotionSim />

            <ExampleBox title="مثال (1-4): قمر اصطناعي">
              <p>قمر اصطناعي يدور حول الأرض على ارتفاع 300 كم من سطح الأرض مرة كل 90 دقيقة. جد سرعته.</p>
              <p><strong>الحل:</strong></p>
              <p style={{ direction: "ltr", textAlign: "center" }}>
                ز = 90 دقيقة = 5400 ثانية<br/>
                نق = نصف قطر الأرض + 300 = 6400 + 300 = 6700 كم = 6.7 × 10⁶ م<br/>
                ع = 2π نق ÷ ز = (2 × 3.14 × 6.7 × 10⁶) ÷ 5400 ≈ 7796 م/ث ≈ 7.8 كم/ث
              </p>
            </ExampleBox>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("circularMotion"); setCurrentLesson("centripetalForce"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: قوة الجذب المركزية ←
              </button>
            </div>
          </div>
        );

      case "centripetalForce":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🎯 قوة الجذب المركزية وقوة الطرد المركزية
            </h2>

            <InfoCard title="قوة الجذب المركزية" icon="🎯" color={colors.primary}>
              <p>لكي يدور أي جسم في مسار دائري لا بد من وجود قوة تشده أو تربطه مع مركز الدائرة تسمى <strong>قوة الجذب المركزية</strong>.</p>
              <p>جسم في مسار دائري يسرعة <strong>منتظمة</strong> وبالرغم من أن قيمة السرعة ثابتة إلا أن تغيير الاتجاه له قيمة فيزيائية.</p>
            </InfoCard>

            <FormulaBox label="عجلة الجذب المركزية" formula="جـ = ع² / نق" color={colors.primary} />
            <FormulaBox label="قوة الجذب المركزية" formula="ق = ك × ع² / نق" color={colors.accent} />

            <InfoCard title="صيغ أخرى لقوة الجذب المركزية" icon="📐" color={colors.secondary}>
              <p>يمكن التعبير عن قوة الجذب المركزية بعدة صيغ:</p>
            </InfoCard>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <FormulaBox formula="ق = 4π² ك نق / ز²" color={colors.success} label="بدلالة الزمن الدوري" />
              <FormulaBox formula="ق = 4π² ك نق ذ²" color={colors.warning} label="بدلالة التردد" />
              <FormulaBox formula="ق = ك نق ω²" color={colors.primary} label="بدلالة السرعة الزاوية" />
              <FormulaBox formula="ق = ك ω ع" color={colors.secondary} label="صيغة مختلطة" />
            </div>

            <h3 style={{ color: colors.danger, marginTop: 24 }}>الحركة الدائرية على سطح الأرض (الميلان)</h3>

            <InfoCard title="لماذا تميل الدراجة في المنحنيات؟" icon="🏍️" color={colors.danger}>
              <p>الدراجات بكل أنواعها تحتاج مع راكبها إلى قوة الجذب المركزية عند سيرها في طريق دائري أو منحنى. وبما أنها غير مربوطة مع مركز الدائرة بأي وسيلة فإنها مع راكبها <strong>تميل تلقائياً لتوليد قوة الجذب المركزية</strong>.</p>
            </InfoCard>

            <FormulaBox label="قوة الجذب المركزية من الميلان" formula="ق = و × ظا(هـ)" color={colors.danger} />
            <FormulaBox label="السرعة المسموحة في منحنى" formula="ع = √(نق × د × ظا هـ)" color={colors.accent} />

            <h3 style={{ color: colors.warning, marginTop: 24 }}>قوة الطرد المركزية</h3>

            <InfoCard title="قوة الطرد المركزية" icon="💫" color={colors.warning}>
              <p>هي قوة رد فعل لقوة الجذب المركزية ويكون اتجاهها إلى الخارج. وهي قوة موجودة كرد فعل وليست قوة أصيلة. <strong>ولكن لهذه القوة تأثيراتها الملاحظة في الحياة العامة:</strong></p>
              <p>1️⃣ عند مناقشتنا لمثال الصامولة المربوطة في خيط - الشد في الخيط إلى الخارج</p>
              <p>2️⃣ قوة التثاقل هي التي تمد السفينة الفضائية - بينما قوة الطرد المركزية تمنع سقوطها</p>
              <p>3️⃣ الركاب في سيارة تغيّر اتجاهها يشعرون بميل أجسامهم في الاتجاه المعاكس</p>
              <p>4️⃣ تظهر بوضوح في السوائل (الماء في كوب يدور)</p>
              <p>5️⃣ تُستعمل في فرز المحاليل المختلفة الكثافة في جهاز <strong>النابذة (Centrifuge)</strong></p>
            </InfoCard>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("centripetalForce"); setCurrentLesson("keplerLaws"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: قوانين كبلر ←
              </button>
            </div>
          </div>
        );

      case "keplerLaws":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🪐 قوانين كبلر لحركة الكواكب
            </h2>

            <InfoCard title="من هو كبلر؟" icon="🔭" color={colors.primary}>
              <p>تمكّن العالم الألماني <strong>كبلر</strong> (1571-1630م) وبعد دراسة استمرت عشرين سنة للقياسات التي قام بها أستاذه الفلكي الدنماركي <strong>تيخو براهي</strong> (1601م) من استنتاج ثلاثة قوانين تحكم حركة الكواكب حول الشمس.</p>
              <p>وقد استفاد نيوتن من هذه القوانين في استنتاج قانون التثاقل الكوني.</p>
            </InfoCard>

            <div style={{
              background: `linear-gradient(135deg, ${colors.primary}12, ${colors.secondary}08)`,
              border: `2px solid ${colors.primary}50`,
              borderRadius: 20, padding: 24, margin: "20px 0",
            }}>
              <h3 style={{ color: colors.primary, textAlign: "center", marginBottom: 20 }}>القوانين الثلاثة</h3>

              {[
                { num: "الأول", title: "قانون المدارات", law: "كل كوكب يتحرك في مدار إهليلجي بحيث تكون الشمس في إحدى بؤرتي هذا المدار الإهليلجي", color: colors.primary },
                { num: "الثاني", title: "قانون المساحات", law: "الخط الواصل بين الشمس وكل كوكب يرسم مساحات متساوية في أزمنة متساوية", color: colors.secondary },
                { num: "الثالث", title: "قانون الزمن الدوري", law: "مكعب متوسط المسافة بين الشمس والكوكب يتناسب طردياً مع مربع الزمن الدوري للكوكب", color: colors.accent },
              ].map((item, i) => (
                <div key={i} style={{
                  background: `${item.color}08`,
                  border: `1px solid ${item.color}30`,
                  borderRadius: 14,
                  padding: 16,
                  marginBottom: i < 2 ? 12 : 0,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{
                      background: item.color,
                      color: "#fff",
                      borderRadius: "50%",
                      width: 30,
                      height: 30,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: "bold",
                      flexShrink: 0,
                    }}>{i + 1}</span>
                    <span style={{ fontWeight: "bold", color: item.color }}>القانون {item.num}: {item.title}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8 }}>{item.law}</p>
                </div>
              ))}
            </div>

            <FormulaBox label="قانون كبلر الثالث (رياضياً)" formula="نق³ / ز² = ج × كش / (4π²) = ثابت لكل الكواكب" color={colors.accent} />

            <h3 style={{ color: colors.primary, marginTop: 24 }}>🔬 محاكاة قوانين كبلر</h3>
            <KeplerSimulator />

            <h3 style={{ color: colors.secondary, marginTop: 20 }}>جدول بيانات الكواكب</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: colors.primary, color: "#fff" }}>
                    <th style={{ padding: 10, borderRadius: "0 8px 0 0" }}>الكوكب</th>
                    <th style={{ padding: 10 }}>البُعد (مليون كم)</th>
                    <th style={{ padding: 10 }}>الزمن الدوري</th>
                    <th style={{ padding: 10 }}>القطر (كم)</th>
                    <th style={{ padding: 10, borderRadius: "8px 0 0 0" }}>الأقمار</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANETS.map((p, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? "#f5f5ff" : "#fff" }}>
                      <td style={{ padding: 8, fontWeight: "bold", color: p.color, textAlign: "center" }}>
                        <span style={{ display: "inline-block", width: 12, height: 12, borderRadius: "50%", background: p.color, marginLeft: 6, verticalAlign: "middle" }} />
                        {p.name}
                      </td>
                      <td style={{ padding: 8, textAlign: "center" }}>{p.distance}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>{p.period > 365 ? `${(p.period / 365.25).toFixed(1)} سنة` : `${p.period} يوم`}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>{p.radius.toLocaleString()}</td>
                      <td style={{ padding: 8, textAlign: "center" }}>{p.moons}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("keplerLaws"); setCurrentLesson("satellites"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: الأقمار الاصطناعية ←
              </button>
            </div>
          </div>
        );

      case "satellites":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🛰️ الأقمار الاصطناعية
            </h2>

            <InfoCard title="ما هي الأقمار الاصطناعية؟" icon="🛰️" color={colors.primary}>
              <p>وهي أجسام صنعها الإنسان تحمل أجهزة (ولهذا تسمى اصطناعية) لكي تدور حول الأرض وتسمى أقماراً؛ لأنها أجسام تدور حول الأرض مثلها مثل القمر.</p>
              <p>وأول قمر اصطناعي أطلق في عام 1957م اسمه <strong>"سبوتنك"</strong> أطلقه الاتحاد السوفيتي (روسيا).</p>
            </InfoCard>

            <InfoCard title="أنواع الأقمار الاصطناعية" icon="📡" color={colors.secondary}>
              <p><strong>النوع الأول:</strong> أقمار على ارتفاعات منخفضة (300-1000 كم) - للتصوير والأرصاد الجوية والتجسس وتحديد المواقع GPS.</p>
              <p><strong>النوع الثاني:</strong> أقمار الاتصالات - على ارتفاع ≈ 35900 كم فوق خط الاستواء، تدور مع الأرض في 24 ساعة فتبدو ثابتة! تُستخدم للبث التلفزيوني والاتصالات.</p>
            </InfoCard>

            <h3 style={{ color: colors.accent }}>حساب ارتفاع قمر الاتصالات</h3>

            <InfoCard color={colors.accent}>
              <p>قمر الاتصالات يجب أن يدور في 24 ساعة مثل الأرض وفي نفس اتجاهها (من الغرب إلى الشرق). باستعمال قانون كبلر الثالث:</p>
            </InfoCard>

            <FormulaBox label="نصف قطر مدار قمر الاتصالات" formula="نق = ∛(ج × ك₁ × ز² / 4π²) = 42297.5 كم" color={colors.primary} />
            <FormulaBox label="الارتفاع فوق السطح" formula="ل = نق - نصف قطر الأرض = 42297.5 - 6400 ≈ 35900 كم" color={colors.accent} />

            <h3 style={{ color: colors.success, marginTop: 24 }}>السرعة الفلكية الأولى وسرعة الإفلات</h3>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <InfoCard title="السرعة الفلكية الأولى" icon="🚀" color={colors.primary}>
                <p>أقل سرعة للدوران حول الأرض في مدار دائري:</p>
                <FormulaBox formula="ع = √(ج ك₁ / ف) ≈ 8 كم/ث" color={colors.primary} />
              </InfoCard>
              <InfoCard title="سرعة الإفلات" icon="💫" color={colors.danger}>
                <p>السرعة اللازمة للإفلات من مجال الجاذبية:</p>
                <FormulaBox formula="ع = √(2 ج ك₁ / ف) ≈ 11.2 كم/ث" color={colors.danger} />
              </InfoCard>
            </div>

            <h3 style={{ color: colors.primary, marginTop: 24 }}>🛰️ حاسبة الأقمار الاصطناعية التفاعلية</h3>
            <SatelliteCalculator />

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("satellites"); setCurrentLesson("simulator"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: المحاكاة التفاعلية الشاملة ←
              </button>
            </div>
          </div>
        );

      case "simulator":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              🔬 المحاكاة التفاعلية الشاملة
            </h2>
            <p style={{ color: colors.textMuted }}>جرّب المحاكاة التفاعلية لكل مفاهيم الباب الأول:</p>

            <h3 style={{ color: colors.primary }}>1. محاكاة قانون التثاقل الكوني</h3>
            <GravitySimulator />

            <h3 style={{ color: colors.secondary, marginTop: 30 }}>2. محاكاة الحركة الدائرية</h3>
            <CircularMotionSim />

            <h3 style={{ color: colors.accent, marginTop: 30 }}>3. محاكاة قوانين كبلر</h3>
            <KeplerSimulator />

            <h3 style={{ color: colors.success, marginTop: 30 }}>4. حاسبة الأقمار الاصطناعية</h3>
            <SatelliteCalculator />

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button onClick={() => { markComplete("simulator"); setCurrentLesson("quiz"); }}
                style={{
                  background: colors.gradientAccent, color: "#fff", border: "none",
                  borderRadius: 12, padding: "12px 32px", fontSize: 16, cursor: "pointer", fontWeight: "bold",
                }}>
                التالي: الاختبار النهائي ←
              </button>
            </div>
          </div>
        );

      case "quiz":
        return (
          <div>
            <h2 style={{ color: colors.primary, borderBottom: `3px solid ${colors.accent}`, paddingBottom: 10 }}>
              📝 اختبار الباب الأول
            </h2>

            {!quizState.finished ? (
              <div>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 20,
                  background: `${colors.primary}08`,
                  borderRadius: 12,
                  padding: 12,
                }}>
                  <span>السؤال {quizState.current + 1} من {QUIZ_QUESTIONS.length}</span>
                  <span style={{ fontWeight: "bold", color: colors.success }}>
                    النتيجة: {quizState.score}/{quizState.current}
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{ height: 6, background: "#e0e0e0", borderRadius: 3, marginBottom: 20 }}>
                  <div style={{
                    height: "100%",
                    background: colors.gradientAccent,
                    borderRadius: 3,
                    width: `${((quizState.current) / QUIZ_QUESTIONS.length) * 100}%`,
                    transition: "width 0.3s",
                  }} />
                </div>

                <div style={{
                  background: "#fff",
                  borderRadius: 16,
                  padding: 24,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                }}>
                  <h3 style={{ color: colors.primary, marginBottom: 20, fontSize: 18 }}>
                    {QUIZ_QUESTIONS[quizState.current].q}
                  </h3>

                  <div style={{ display: "grid", gap: 12 }}>
                    {QUIZ_QUESTIONS[quizState.current].options.map((opt, i) => {
                      const answered = quizState.answers[quizState.current] !== undefined;
                      const isCorrect = i === QUIZ_QUESTIONS[quizState.current].correct;
                      const isSelected = quizState.answers[quizState.current] === i;

                      let bg = "#f5f5ff";
                      let border = "#ccc";
                      if (answered) {
                        if (isCorrect) { bg = "#e8f5e9"; border = "#4caf50"; }
                        else if (isSelected) { bg = "#ffebee"; border = "#f44336"; }
                      }

                      return (
                        <button key={i}
                          disabled={answered}
                          onClick={() => {
                            const correct = i === QUIZ_QUESTIONS[quizState.current].correct;
                            setQuizState(s => ({
                              ...s,
                              score: correct ? s.score + 1 : s.score,
                              answers: [...s.answers.slice(0, s.current), i, ...s.answers.slice(s.current + 1)],
                            }));
                          }}
                          style={{
                            background: bg,
                            border: `2px solid ${border}`,
                            borderRadius: 12,
                            padding: 14,
                            fontSize: 15,
                            cursor: answered ? "default" : "pointer",
                            textAlign: "right",
                            transition: "all 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}>
                          <span style={{
                            width: 28, height: 28, borderRadius: "50%",
                            background: answered && isCorrect ? "#4caf50" : answered && isSelected ? "#f44336" : colors.primary + "20",
                            color: answered && (isCorrect || isSelected) ? "#fff" : colors.primary,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 13, fontWeight: "bold", flexShrink: 0,
                          }}>
                            {answered && isCorrect ? "✓" : answered && isSelected ? "✗" : String.fromCharCode(1571 + i)}
                          </span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {quizState.answers[quizState.current] !== undefined && (
                    <div style={{
                      marginTop: 16,
                      padding: 16,
                      borderRadius: 12,
                      background: quizState.answers[quizState.current] === QUIZ_QUESTIONS[quizState.current].correct
                        ? "#e8f5e9" : "#fff3e0",
                      border: `1px solid ${quizState.answers[quizState.current] === QUIZ_QUESTIONS[quizState.current].correct
                        ? "#4caf50" : "#ff9800"}40`,
                    }}>
                      <div style={{ fontWeight: "bold", marginBottom: 6 }}>
                        {quizState.answers[quizState.current] === QUIZ_QUESTIONS[quizState.current].correct
                          ? "✅ إجابة صحيحة!" : "❌ إجابة خاطئة"}
                      </div>
                      <div style={{ fontSize: 14 }}>{QUIZ_QUESTIONS[quizState.current].explanation}</div>
                    </div>
                  )}

                  {quizState.answers[quizState.current] !== undefined && (
                    <div style={{ textAlign: "center", marginTop: 16 }}>
                      <button onClick={() => {
                        if (quizState.current < QUIZ_QUESTIONS.length - 1) {
                          setQuizState(s => ({ ...s, current: s.current + 1 }));
                        } else {
                          setQuizState(s => ({ ...s, finished: true }));
                          markComplete("quiz");
                        }
                      }}
                        style={{
                          background: colors.gradientAccent,
                          color: "#fff", border: "none", borderRadius: 10, padding: "10px 24px",
                          fontSize: 15, cursor: "pointer", fontWeight: "bold",
                        }}>
                        {quizState.current < QUIZ_QUESTIONS.length - 1 ? "السؤال التالي ←" : "عرض النتيجة النهائية"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center" }}>
                <div style={{
                  background: quizState.score >= 8 ? colors.gradientSuccess : quizState.score >= 5 ? "linear-gradient(135deg, #ff6f00, #ff8f00)" : colors.gradientDanger,
                  borderRadius: 20,
                  padding: 40,
                  color: "#fff",
                  marginBottom: 20,
                }}>
                  <div style={{ fontSize: 60 }}>
                    {quizState.score >= 8 ? "🏆" : quizState.score >= 5 ? "👍" : "📚"}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: "bold", marginTop: 10 }}>
                    النتيجة: {quizState.score} / {QUIZ_QUESTIONS.length}
                  </div>
                  <div style={{ fontSize: 16, marginTop: 10, opacity: 0.9 }}>
                    {quizState.score >= 8 ? "ممتاز! أداء رائع" : quizState.score >= 5 ? "جيد! استمر في المراجعة" : "راجع الدروس وحاول مرة أخرى"}
                  </div>
                  <div style={{ fontSize: 36, fontWeight: "bold", marginTop: 10 }}>
                    {Math.round((quizState.score / QUIZ_QUESTIONS.length) * 100)}%
                  </div>
                </div>
                <button onClick={() => setQuizState({ current: 0, score: 0, answers: [], finished: false })}
                  style={{
                    background: colors.primary, color: "#fff", border: "none",
                    borderRadius: 10, padding: "10px 24px", fontSize: 15, cursor: "pointer",
                  }}>
                  إعادة الاختبار
                </button>
              </div>
            )}
          </div>
        );

      default:
        return <div>اختر درساً من القائمة</div>;
    }
  };

  // ========== MAIN RENDER ==========
  return (
    <div dir="rtl" style={{
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: "100vh",
      background: "#f0f2ff",
      color: colors.text,
    }}>
      {/* Header */}
      <div style={{
        background: colors.gradientPrimary,
        color: "#fff",
        padding: "20px 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: "rgba(255,255,255,0.15)",
                border: "none",
                borderRadius: 8,
                padding: "6px 10px",
                color: "#fff",
                fontSize: 20,
                cursor: "pointer",
              }}>
              ☰
            </button>
            <div>
              <div style={{ fontSize: 18, fontWeight: "bold" }}>🌍 الفيزياء - الباب الأول</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>المجال التثاقلي والحركة الدائرية وحركة الكواكب</div>
            </div>
          </div>
          <div style={{ textAlign: "left" }}>
            <div style={{ fontSize: 13, opacity: 0.8 }}>التقدم</div>
            <div style={{ fontSize: 18, fontWeight: "bold" }}>{progressPercent}%</div>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ height: 4, background: "rgba(255,255,255,0.2)", borderRadius: 2, marginTop: 12 }}>
          <div style={{
            height: "100%", background: "#ff6f00", borderRadius: 2,
            width: `${progressPercent}%`, transition: "width 0.5s",
          }} />
        </div>
      </div>

      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          position: "fixed",
          top: 0, right: 0,
          width: 300,
          height: "100vh",
          background: "#fff",
          zIndex: 200,
          boxShadow: "-4px 0 20px rgba(0,0,0,0.15)",
          overflowY: "auto",
          padding: "20px 0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px", marginBottom: 16 }}>
            <h3 style={{ margin: 0, color: colors.primary }}>📚 فهرس الدروس</h3>
            <button onClick={() => setSidebarOpen(false)}
              style={{ background: "none", border: "none", fontSize: 24, cursor: "pointer", color: "#666" }}>✕</button>
          </div>
          {LESSONS.map(lesson => (
            <button key={lesson.id}
              onClick={() => { setCurrentLesson(lesson.id); setSidebarOpen(false); }}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "none",
                background: currentLesson === lesson.id ? `${colors.primary}12` : "transparent",
                borderRight: currentLesson === lesson.id ? `4px solid ${colors.primary}` : "4px solid transparent",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                fontSize: 14,
                textAlign: "right",
                transition: "all 0.2s",
              }}>
              <span style={{ fontSize: 20 }}>{lesson.icon}</span>
              <span style={{ flex: 1 }}>{lesson.title}</span>
              {progress[lesson.id] && <span style={{ color: colors.success, fontSize: 18 }}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {/* Overlay */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.3)", zIndex: 150,
          }} />
      )}

      {/* Main Content */}
      <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
        {renderLesson()}
      </div>

      {/* Footer */}
      <div style={{
        background: colors.dark,
        color: "rgba(255,255,255,0.6)",
        padding: 20,
        textAlign: "center",
        fontSize: 13,
        marginTop: 40,
      }}>
        <div style={{ fontSize: 16, fontWeight: "bold", color: "#fff", marginBottom: 8 }}>
          🌍 المنهج السوداني التفاعلي - الفيزياء
        </div>
        <div>الصف الثالث ثانوي - الباب الأول: المجال التثاقلي والحركة الدائرية</div>
        <div style={{ marginTop: 8, fontSize: 12 }}>مشروع تعليمي مجاني - صدقة جارية 💚</div>
      </div>
    </div>
  );
}
