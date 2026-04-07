import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Line, ReferenceLine,
  ReferenceDot, ResponsiveContainer, Area, AreaChart
} from 'recharts';

// Helper function to evaluate functions
const evaluateFunction = (x, type = 'default') => {
  const types = {
    default: (x) => Math.pow(x, 3) - 3 * x,
    quadratic: (x) => Math.pow(x, 2),
    powerN: (x, n = 2) => Math.pow(x, n),
    exponential: (x) => Math.exp(x / 2) - 1,
    sine: (x) => Math.sin(x),
  };
  return types[type] ? types[type](x) : types.default(x);
};

// Derivative functions
const getDerivative = (x, type = 'default', h = 0.0001) => {
  const f = (val) => evaluateFunction(val, type);
  return (f(x + h) - f(x)) / h;
};

// Second derivative
const getSecondDerivative = (x, type = 'default', h = 0.0001) => {
  const f = (val) => getDerivative(val, type, h);
  return (f(x + h) - f(x)) / h;
};

// Generate data points for graphs
const generateCurveData = (start, end, step = 0.1, type = 'default') => {
  const data = [];
  for (let x = start; x <= end; x += step) {
    data.push({
      x: parseFloat(x.toFixed(2)),
      y: evaluateFunction(x, type),
      derivative: getDerivative(x, type),
      secondDerivative: getSecondDerivative(x, type),
    });
  }
  return data;
};

// Calculate tangent line
const getTangentLine = (x0, type = 'default') => {
  const y0 = evaluateFunction(x0, type);
  const slope = getDerivative(x0, type);
  return {
    x0,
    y0,
    slope,
    equation: (x) => y0 + slope * (x - x0),
  };
};

// Interactive Coordinate Plane Component
const CoordinatePlane = ({
  data,
  onPointDrag,
  draggedPoint,
  tangentPoint,
  tangentData,
  showTangent = false,
  showDerivative = false,
  xRange = [-3, 3],
  yRange = [-5, 5],
  width = 500,
  height = 400,
  curveColor = '#06b6d4',
  derivativeColor = '#fbbf24',
  tangentColor = '#ec4899',
  secondDerivativeColor = '#a78bfa',
  gridColor = '#334155',
  showSecondDerivative = false,
}) => {
  const svgRef = useRef(null);
  const padding = 50;
  const plotWidth = width - 2 * padding;
  const plotHeight = height - 2 * padding;

  const xToPixel = (x) => padding + ((x - xRange[0]) / (xRange[1] - xRange[0])) * plotWidth;
  const yToPixel = (y) => padding + ((yRange[1] - y) / (yRange[1] - yRange[0])) * plotHeight;

  const handleMouseMove = (e) => {
    if (!draggedPoint || !onPointDrag) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const x = xRange[0] + (pixelX - padding) / plotWidth * (xRange[1] - xRange[0]);
    const clampedX = Math.max(xRange[0] + 0.1, Math.min(xRange[1] - 0.1, x));
    onPointDrag(clampedX);
  };

  const handleTouchMove = (e) => {
    if (!draggedPoint || !onPointDrag) return;
    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const pixelX = e.touches[0].clientX - rect.left;
    const x = xRange[0] + (pixelX - padding) / plotWidth * (xRange[1] - xRange[0]);
    const clampedX = Math.max(xRange[0] + 0.1, Math.min(xRange[1] - 0.1, x));
    onPointDrag(clampedX);
  };

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="bg-slate-900 rounded-lg cursor-move"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Grid */}
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={gridColor} strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x={padding} y={padding} width={plotWidth} height={plotHeight} fill="url(#grid)" />

      {/* Axes */}
      <line x1={padding} y1={padding + plotHeight} x2={padding + plotWidth} y2={padding + plotHeight} stroke="#64748b" strokeWidth="2" />
      <line x1={padding} y1={padding} x2={padding} y2={padding + plotHeight} stroke="#64748b" strokeWidth="2" />

      {/* Axis labels */}
      <text x={padding + plotWidth - 20} y={padding + plotHeight + 25} className="text-xs fill-slate-400" textAnchor="end">س</text>
      <text x={padding - 30} y={padding + 15} className="text-xs fill-slate-400" textAnchor="end">د(س)</text>

      {/* Main curve */}
      {data.length > 1 && (
        <polyline
          points={data.map(d => `${xToPixel(d.x)},${yToPixel(d.y)}`).join(' ')}
          fill="none"
          stroke={curveColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Derivative curve */}
      {showDerivative && data.length > 1 && (
        <polyline
          points={data.map(d => `${xToPixel(d.x)},${yToPixel(d.derivative)}`).join(' ')}
          fill="none"
          stroke={derivativeColor}
          strokeWidth="2"
          strokeDasharray="5,5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Second derivative curve */}
      {showSecondDerivative && data.length > 1 && (
        <polyline
          points={data.map(d => `${xToPixel(d.x)},${yToPixel(d.secondDerivative)}`).join(' ')}
          fill="none"
          stroke={secondDerivativeColor}
          strokeWidth="2"
          strokeDasharray="10,5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}

      {/* Tangent line */}
      {showTangent && tangentData && (
        <line
          x1={xToPixel(tangentData.x0 - 2)}
          y1={yToPixel(tangentData.equation(tangentData.x0 - 2))}
          x2={xToPixel(tangentData.x0 + 2)}
          y2={yToPixel(tangentData.equation(tangentData.x0 + 2))}
          stroke={tangentColor}
          strokeWidth="2"
          strokeDasharray="5,5"
        />
      )}

      {/* Dragged point */}
      {draggedPoint !== null && (
        <circle
          cx={xToPixel(draggedPoint)}
          cy={yToPixel(evaluateFunction(draggedPoint))}
          r="6"
          fill={tangentColor}
          stroke="white"
          strokeWidth="2"
        />
      )}

      {/* Tangent point */}
      {tangentPoint !== null && (
        <circle
          cx={xToPixel(tangentPoint)}
          cy={yToPixel(evaluateFunction(tangentPoint))}
          r="6"
          fill="#10b981"
          stroke="white"
          strokeWidth="2"
        />
      )}
    </svg>
  );
};

// Lesson 1: Introduction
const IntroductionLesson = () => (
  <div className="space-y-6 text-right" dir="rtl">
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">مقدمة التفاضل</h2>
      <p className="text-slate-300 leading-relaxed mb-4">
        حساب التفاضل (Calculus) هو فرع من الرياضيات يدرس التغير والحركة. يساعدنا في فهم كيفية تغير الأشياء بمرور الوقت وكيفية قياس سرعة هذا التغير.
      </p>
      <div className="bg-slate-900 rounded p-4 border-l-4 border-blue-500 mb-4">
        <p className="text-slate-300">
          في هذه الوحدة، سنتعلم عن <span className="font-bold text-cyan-400">المشتقة</span> (Derivative)، وهي أداة قوية لقياس معدل التغير اللحظي للدالة في أي نقطة.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold text-yellow-400 mb-2">التطبيقات في الحياة الواقعية</h3>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>📊 حساب السرعة اللحظية للسيارة</li>
          <li>📈 معدل نمو الاستثمار المالي</li>
          <li>🌡️ معدل تغير درجة الحرارة</li>
          <li>💊 تركيز الدواء في الدم بمرور الوقت</li>
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold text-pink-400 mb-2">أهم المفاهيم</h3>
        <ul className="text-slate-300 text-sm space-y-2">
          <li>✓ الدالة والمتغير</li>
          <li>✓ معدل التغير المتوسط</li>
          <li>✓ معدل التغير اللحظي</li>
          <li>✓ قواعد التفاضل</li>
        </ul>
      </div>
    </div>

    <div className="bg-slate-900 rounded-lg p-4 border border-purple-500 border-l-4">
      <h3 className="text-lg font-bold text-purple-400 mb-2">رموز مهمة</h3>
      <div className="grid grid-cols-2 gap-3 text-slate-300 text-sm">
        <div>د(س) = الدالة</div>
        <div>د'(س) = المشتقة</div>
        <div>Δس = التغير في س</div>
        <div>Δد = التغير في د</div>
      </div>
    </div>
  </div>
);

// Lesson 2: Rate of Change
const RateOfChangeLesson = () => {
  const [pointA, setPointA] = useState(-1.5);
  const [pointB, setPointB] = useState(1.5);

  const dataPoints = generateCurveData(-3, 3, 0.15, 'quadratic');
  const yA = evaluateFunction(pointA, 'quadratic');
  const yB = evaluateFunction(pointB, 'quadratic');
  const deltaX = pointB - pointA;
  const deltaY = yB - yA;
  const averageRate = deltaX !== 0 ? deltaY / deltaX : 0;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">التغير ومتوسط معدل التغير</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <CoordinatePlane
              data={dataPoints}
              draggedPoint={pointA}
              tangentPoint={pointB}
              xRange={[-3, 3]}
              yRange={[-0.5, 9]}
              width={500}
              height={400}
              curveColor="#06b6d4"
              tangentColor="#ec4899"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">نقطة أ</h3>
            <p className="text-slate-300 text-sm mb-2">س = {pointA.toFixed(2)}</p>
            <input
              type="range"
              min="-3"
              max="1.5"
              step="0.1"
              value={pointA}
              onChange={(e) => setPointA(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-slate-400 text-sm mt-2">د(س) = {yA.toFixed(2)}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-pink-400 mb-3">نقطة ب</h3>
            <p className="text-slate-300 text-sm mb-2">س = {pointB.toFixed(2)}</p>
            <input
              type="range"
              min="-1.5"
              max="3"
              step="0.1"
              value={pointB}
              onChange={(e) => setPointB(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-slate-400 text-sm mt-2">د(س) = {yB.toFixed(2)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-4 border border-blue-500">
            <h3 className="text-lg font-bold text-blue-300 mb-3">متوسط معدل التغير</h3>
            <p className="text-slate-300 text-sm mb-2">Δس = {deltaX.toFixed(2)}</p>
            <p className="text-slate-300 text-sm mb-2">Δد = {deltaY.toFixed(2)}</p>
            <div className="bg-slate-900 rounded p-2 mt-3">
              <p className="text-yellow-300 font-bold text-center">
                {averageRate.toFixed(3)} = Δد/Δس
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
        <h3 className="text-lg font-bold text-cyan-400 mb-2">الشرح</h3>
        <p className="text-slate-300 text-sm leading-relaxed">
          متوسط معدل التغير يمثل ميل الخط الذي يصل بين نقطتين على المنحنى (secant line).
          عندما نقرب النقطة ب من النقطة أ (Δس → 0)، يتحول هذا الخط ليصبح خطاً مماساً (tangent line)
          وبذلك نحصل على المشتقة (معدل التغير اللحظي).
        </p>
      </div>
    </div>
  );
};

// Lesson 3: Derivative (Main Interactive)
const DerivativeLesson = () => {
  const [draggedPoint, setDraggedPoint] = useState(0.5);
  const [functionType, setFunctionType] = useState('default');
  const [h, setH] = useState(0.5);

  const dataPoints = generateCurveData(-3, 3, 0.1, functionType);
  const tangentData = getTangentLine(draggedPoint, functionType);
  const derivativeValue = getDerivative(draggedPoint, functionType);

  const secantPoint = draggedPoint + h;
  const ySecant = evaluateFunction(secantPoint, functionType);
  const yCurrent = evaluateFunction(draggedPoint, functionType);
  const secantSlope = (ySecant - yCurrent) / h;

  const functionNames = {
    default: 'د(س) = س³ - 3س',
    quadratic: 'د(س) = س²',
    sine: 'د(س) = جا(س)',
  };

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">مشتقة الدالة</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          {/* Main Graph */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">المنحنى الأصلي</h3>
            <CoordinatePlane
              data={dataPoints}
              draggedPoint={draggedPoint}
              showTangent={true}
              tangentData={tangentData}
              xRange={[-3, 3]}
              yRange={functionType === 'sine' ? [-2, 2] : [-5, 5]}
              width={550}
              height={380}
              curveColor="#06b6d4"
              tangentColor="#ec4899"
            />
          </div>

          {/* Derivative Graph */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">مشتقة الدالة د'(س)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => value.toFixed(3)}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="derivative"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={false}
                />
                <ReferenceLine
                  x={draggedPoint}
                  stroke="#ec4899"
                  strokeDasharray="5,5"
                  strokeWidth={2}
                />
                <ReferenceDot
                  x={draggedPoint}
                  y={derivativeValue}
                  r={5}
                  fill="#ec4899"
                  stroke="white"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Animation for h value */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-purple-400 mb-3">انتقال من معدل التغير المتوسط إلى المشتقة</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-slate-300 text-sm mb-2">قيمة h (الفجوة):</p>
                <input
                  type="range"
                  min="0.01"
                  max="1"
                  step="0.01"
                  value={h}
                  onChange={(e) => setH(parseFloat(e.target.value))}
                  className="w-full"
                />
                <p className="text-slate-400 text-sm mt-1">h = {h.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
              <div className="bg-slate-900 rounded p-3">
                <p className="text-slate-400">ميل الخط القاطع:</p>
                <p className="text-yellow-400 font-bold text-lg">{secantSlope.toFixed(3)}</p>
              </div>
              <div className="bg-slate-900 rounded p-3">
                <p className="text-slate-400">ميل الخط المماس:</p>
                <p className="text-pink-400 font-bold text-lg">{derivativeValue.toFixed(3)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">الموضع</h3>
            <p className="text-slate-300 text-sm mb-2">س = {draggedPoint.toFixed(2)}</p>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={draggedPoint}
              onChange={(e) => setDraggedPoint(parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-slate-400 text-sm mt-3">د(س) = {yCurrent.toFixed(2)}</p>
            <p className="text-pink-400 text-sm font-bold mt-2">د'(س) = {derivativeValue.toFixed(2)}</p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">اختر الدالة</h3>
            {Object.entries(functionNames).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setFunctionType(key)}
                className={`w-full text-right py-2 px-3 rounded text-sm mb-2 transition ${
                  functionType === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {name}
              </button>
            ))}
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-4 border border-purple-500">
            <h3 className="text-lg font-bold text-purple-300 mb-3">تعريف المشتقة</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              د'(س) = lim(h→0) [د(س+h) - د(س)] / h
            </p>
            <p className="text-slate-400 text-xs mt-2 leading-relaxed">
              المشتقة هي حد معدل التغير عندما تقترب الفجوة من الصفر.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson 4: Rules of Differentiation
const RulesLesson = () => {
  const [selectedRule, setSelectedRule] = useState(0);
  const [n, setN] = useState(3);

  const rules = [
    {
      name: 'قاعدة القوة',
      formula: 'د/دس[سⁿ] = نسⁿ⁻¹',
      example: `د(س) = س${n}`,
      derivative: `د'(س) = ${n}س${n - 1}`,
      description: 'ننزل الأس أمام س ثم ننقص الأس بمقدار واحد',
    },
    {
      name: 'قاعدة الجمع والطرح',
      formula: 'د/دس[د(س) ± ق(س)] = د\'(س) ± ق\'(س)',
      example: 'د(س) = س³ + 2س² - 5',
      derivative: 'د\'(س) = 3س² + 4س',
      description: 'نفاضل كل حد على حدة',
    },
    {
      name: 'قاعدة الضرب',
      formula: 'د/دس[د(س)·ق(س)] = د\'(س)·ق(س) + د(س)·ق\'(س)',
      example: 'د(س) = (س² + 1)(س - 3)',
      derivative: 'د\'(س) = 2س(س - 3) + (س² + 1)',
      description: 'مشتقة الأول × الثاني + الأول × مشتقة الثاني',
    },
    {
      name: 'قاعدة القسمة',
      formula: 'د/دس[د(س)/ق(س)] = [د\'(س)·ق(س) - د(س)·ق\'(س)] / [ق(س)]²',
      example: 'د(س) = س² / (س + 1)',
      derivative: 'د\'(س) = [2س(س + 1) - س²] / (س + 1)²',
      description: '(مشتقة البسط × المقام - البسط × مشتقة المقام) / (المقام)²',
    },
    {
      name: 'قاعدة الثابت',
      formula: 'د/دس[ك·د(س)] = ك·د\'(س)',
      example: 'د(س) = 5س³',
      derivative: 'د\'(س) = 15س²',
      description: 'الثابت يبقى ونفاضل باقي الدالة',
    },
  ];

  const currentRule = rules[selectedRule];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">القواعس الأساسية للتفاضل</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Rules List */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {rules.map((rule, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRule(idx)}
                className={`w-full text-right py-3 px-4 rounded-lg transition border ${
                  selectedRule === idx
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 text-white'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
              >
                <p className="font-bold">{rule.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Rule Details */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4">{currentRule.name}</h3>

            <div className="bg-slate-900 rounded p-4 mb-4 border-l-4 border-blue-500">
              <p className="text-slate-400 text-sm mb-1">الصيغة:</p>
              <p className="text-cyan-300 font-bold text-lg">{currentRule.formula}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">مثال:</p>
                <p className="text-pink-400 font-bold text-lg">{currentRule.example}</p>
              </div>

              <div className="bg-slate-900 rounded p-4 border border-slate-700">
                <p className="text-slate-400 text-sm mb-2">المشتقة:</p>
                <p className="text-green-400 font-bold text-lg">{currentRule.derivative}</p>
              </div>
            </div>

            <div className="bg-blue-900/30 rounded p-4 border border-blue-500">
              <p className="text-blue-300 text-sm leading-relaxed">{currentRule.description}</p>
            </div>
          </div>

          {/* Power Rule Interactive */}
          {selectedRule === 0 && (
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h4 className="text-lg font-bold text-yellow-400 mb-4">تفاعل - غيّر قيمة الأس</h4>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-slate-300 text-sm mb-2">قيمة n:</p>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={n}
                    onChange={(e) => setN(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">د(س) = س<sup>{n}</sup></p>
                  <p className="text-yellow-400 font-bold mt-2">د'(س) = {n}س<sup>{n - 1}</sup></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Lesson 5: Chain Rule
const ChainRuleLesson = () => {
  const [complexity, setComplexity] = useState(0);

  const examples = [
    {
      title: 'مثال بسيط',
      outer: 'د = ع²',
      inner: 'ع = س + 1',
      composite: 'd(س) = (س + 1)²',
      result: 'د\'(س) = 2(س + 1)·1 = 2(س + 1)',
      explanation: 'نفاضل الدالة الخارجية ثم نضرب في مشتقة الدالة الداخلية',
    },
    {
      title: 'مثال متوسط',
      outer: 'د = ع³',
      inner: 'ع = 2س + 3',
      composite: 'd(س) = (2س + 3)³',
      result: 'د\'(س) = 3(2س + 3)²·2 = 6(2س + 3)²',
      explanation: 'نطبق القاعدة: د\'(س) = د\'(ع)·ع\'(س)',
    },
    {
      title: 'مثال متقدم',
      outer: 'd = جا(ع)',
      inner: 'ع = س²',
      composite: 'd(س) = جا(س²)',
      result: 'd\'(س) = جتا(س²)·2س',
      explanation: 'مشتقة الجيب هي جتا، ثم نضرب في مشتقة الزاوية',
    },
  ];

  const current = examples[complexity];

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">دالة الدالة (قاعدة السلسلة)</h2>

      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg p-6 border border-slate-700 mb-4">
        <h3 className="text-xl font-bold text-yellow-400 mb-4">الصيغة العامة</h3>
        <div className="bg-slate-900 rounded p-4 border-l-4 border-purple-500">
          <p className="text-cyan-300 font-bold text-lg text-center">
            d'(س) = د'(ع) × ع'(س)
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {examples.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setComplexity(idx)}
            className={`w-full text-right py-2 px-4 rounded-lg transition border ${
              complexity === idx
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {examples[idx].title}
          </button>
        ))}
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-2xl font-bold text-yellow-400 mb-6">{current.title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-900 rounded p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">الدالة الخارجية:</p>
            <p className="text-cyan-400 font-bold text-lg">{current.outer}</p>
          </div>

          <div className="bg-slate-900 rounded p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">الدالة الداخلية:</p>
            <p className="text-pink-400 font-bold text-lg">{current.inner}</p>
          </div>

          <div className="bg-slate-900 rounded p-4 border border-slate-700">
            <p className="text-slate-400 text-sm mb-2">الدالة المركبة:</p>
            <p className="text-yellow-400 font-bold text-lg">{current.composite}</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500 mb-4">
          <p className="text-slate-300 text-sm mb-3">النتيجة:</p>
          <p className="text-green-400 font-bold text-xl text-center mb-3">{current.result}</p>
          <p className="text-blue-300 text-sm leading-relaxed">{current.explanation}</p>
        </div>

        <div className="bg-slate-900 rounded-lg p-4 border border-slate-700">
          <h4 className="text-lg font-bold text-cyan-400 mb-3">خطوات الحل:</h4>
          <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
            <li>حدد الدالة الخارجية والداخلية</li>
            <li>ادحسب مشتقة الدالة الخارجية بالنسبة للداخلية</li>
            <li>احسب مشتقة الدالة الداخلية بالنسبة لـ س</li>
            <li>اضرب النتيجتين معاً</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

// Lesson 6: Implicit Differentiation
const ImplicitDifferentiationLesson = () => (
  <div className="space-y-6 text-right" dir="rtl">
    <h2 className="text-2xl font-bold text-cyan-400">التفاضل الضمني</h2>

    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">تعريف التفاضل الضمني</h3>
      <p className="text-slate-300 mb-4 leading-relaxed">
        بعض العلاقات بين س و د لا يمكن كتابتها بشكل صريح بالصيغة د = د(س).
        في هذه الحالات، نستخدم التفاضل الضمني لإيجاد د'(س) دون الحاجة لحل المعادلة بالنسبة لـ د.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-bold text-pink-400 mb-4">مثال 1: الدائرة</h4>
        <div className="bg-slate-900 rounded p-4 mb-4 border-l-4 border-blue-500">
          <p className="text-slate-400 text-sm mb-2">المعادلة:</p>
          <p className="text-cyan-400 font-bold">س² + د² = 25</p>
        </div>
        <div className="bg-slate-900 rounded p-4 mb-4">
          <p className="text-slate-400 text-sm mb-2">خطوات الحل:</p>
          <p className="text-yellow-300 text-sm mb-1">نفاضل الطرفين بالنسبة لـ س:</p>
          <p className="text-slate-300 text-sm">2س + 2د·د' = 0</p>
          <p className="text-slate-300 text-sm mt-2">د' = -س/د</p>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-bold text-pink-400 mb-4">مثال 2: القطع الناقص</h4>
        <div className="bg-slate-900 rounded p-4 mb-4 border-l-4 border-blue-500">
          <p className="text-slate-400 text-sm mb-2">المعادلة:</p>
          <p className="text-cyan-400 font-bold">س²/9 + د²/4 = 1</p>
        </div>
        <div className="bg-slate-900 rounded p-4 mb-4">
          <p className="text-slate-400 text-sm mb-2">خطوات الحل:</p>
          <p className="text-yellow-300 text-sm mb-1">نفاضل الطرفين:</p>
          <p className="text-slate-300 text-sm">2س/9 + 2د·د'/4 = 0</p>
          <p className="text-slate-300 text-sm mt-2">د' = -4س/(9د)</p>
        </div>
      </div>
    </div>

    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-6 border border-purple-500">
      <h3 className="text-lg font-bold text-purple-300 mb-3">قواعد التفاضل الضمني</h3>
      <ul className="text-slate-300 text-sm space-y-2">
        <li>✓ نفاضل كل حد في المعادلة بالنسبة لـ س</li>
        <li>✓ عند تفاضل د، نكتب د' أو د/دس</li>
        <li>✓ استخدم قاعدة السلسلة عند الحاجة</li>
        <li>✓ اجمع الحدود التي تحتوي على د'</li>
        <li>✓ حل المعادلة بالنسبة لـ د'</li>
      </ul>
    </div>

    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h4 className="text-lg font-bold text-cyan-400 mb-4">مثال 3: معادلة أكثر تعقيداً</h4>
      <div className="space-y-3">
        <div className="bg-slate-900 rounded p-4 border-l-4 border-pink-500">
          <p className="text-slate-400 text-sm mb-1">المعادلة:</p>
          <p className="text-cyan-400 font-bold">س·د + س² = د³ + 2</p>
        </div>
        <div className="bg-slate-900 rounded p-4">
          <p className="text-yellow-300 text-sm mb-2">التفاضل:</p>
          <p className="text-slate-300 text-sm mb-2">د + س·د' + 2س = 3د²·د'</p>
          <p className="text-slate-300 text-sm mb-2">د + 2س = 3د²·د' - س·د'</p>
          <p className="text-green-400 font-bold text-sm mt-2">د' = (د + 2س) / (3د² - س)</p>
        </div>
      </div>
    </div>
  </div>
);

// Lesson 7: Higher Derivatives
const HigherDerivativesLesson = () => {
  const [showDerivatives, setShowDerivatives] = useState({
    first: true,
    second: true,
    third: false,
  });

  const dataPoints = generateCurveData(-3, 3, 0.1, 'default');

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">المشتقات العليا</h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">مقارنة المشتقات</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} domain={[-5, 5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => value.toFixed(3)}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={false}
                  name="د(س)"
                  isAnimationActive={false}
                />
                {showDerivatives.first && (
                  <Line
                    type="monotone"
                    dataKey="derivative"
                    stroke="#fbbf24"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5,5"
                    name="د'(س)"
                    isAnimationActive={false}
                  />
                )}
                {showDerivatives.second && (
                  <Line
                    type="monotone"
                    dataKey="secondDerivative"
                    stroke="#ec4899"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="10,5"
                    name="د''(س)"
                    isAnimationActive={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">التحكم بالعرض</h3>
            <div className="grid grid-cols-3 gap-2">
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                <input
                  type="checkbox"
                  checked={showDerivatives.first}
                  onChange={(e) => setShowDerivatives({ ...showDerivatives, first: e.target.checked })}
                />
                <span className="text-sm">د'(س)</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                <input
                  type="checkbox"
                  checked={showDerivatives.second}
                  onChange={(e) => setShowDerivatives({ ...showDerivatives, second: e.target.checked })}
                />
                <span className="text-sm">د''(س)</span>
              </label>
              <label className="flex items-center justify-center gap-2 p-3 bg-slate-700 rounded cursor-pointer hover:bg-slate-600">
                <input
                  type="checkbox"
                  checked={showDerivatives.third}
                  onChange={(e) => setShowDerivatives({ ...showDerivatives, third: e.target.checked })}
                />
                <span className="text-sm">د'''(س)</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">التعريفات</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-slate-900 rounded p-3 border-l-4 border-cyan-500">
                <p className="text-cyan-400 font-bold">د'(س)</p>
                <p className="text-slate-400">المشتقة الأولى</p>
              </div>
              <div className="bg-slate-900 rounded p-3 border-l-4 border-yellow-500">
                <p className="text-yellow-400 font-bold">د''(س)</p>
                <p className="text-slate-400">المشتقة الثانية</p>
              </div>
              <div className="bg-slate-900 rounded p-3 border-l-4 border-pink-500">
                <p className="text-pink-400 font-bold">د'''(س)</p>
                <p className="text-slate-400">المشتقة الثالثة</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-pink-400 mb-3">مثال</h3>
            <p className="text-slate-300 text-sm mb-2">د(س) = س³ - 3س</p>
            <div className="bg-slate-900 rounded p-3 mt-2 border-l-4 border-cyan-500">
              <p className="text-cyan-300 text-sm">د'(س) = 3س² - 3</p>
            </div>
            <div className="bg-slate-900 rounded p-3 mt-2 border-l-4 border-yellow-500">
              <p className="text-yellow-300 text-sm">د''(س) = 6س</p>
            </div>
            <div className="bg-slate-900 rounded p-3 mt-2 border-l-4 border-pink-500">
              <p className="text-pink-300 text-sm">د'''(س) = 6</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson 8: Applications - Tangent and Normal Lines
const ApplicationsLesson = () => {
  const [pointX, setPointX] = useState(1);

  const dataPoints = generateCurveData(-3, 3, 0.1, 'default');
  const y = evaluateFunction(pointX, 'default');
  const slope = getDerivative(pointX, 'default');
  const normalSlope = slope !== 0 ? -1 / slope : Infinity;

  // Tangent line equation: y - y0 = m(x - x0)
  const tangentEquation = (x) => y + slope * (x - pointX);
  const normalEquation = (x) => y + normalSlope * (x - pointX);

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">تطبيقات على الهندسة التحليلية</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">الخط المماس والخط الناظم</h3>
            <CoordinatePlane
              data={dataPoints}
              draggedPoint={pointX}
              showTangent={true}
              tangentData={getTangentLine(pointX, 'default')}
              xRange={[-3, 3]}
              yRange={[-5, 5]}
              width={500}
              height={400}
              curveColor="#06b6d4"
              tangentColor="#ec4899"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">نقطة الاتصال</h3>
            <p className="text-slate-300 text-sm mb-2">س = {pointX.toFixed(2)}</p>
            <input
              type="range"
              min="-3"
              max="3"
              step="0.1"
              value={pointX}
              onChange={(e) => setPointX(parseFloat(e.target.value))}
              className="w-full mb-3"
            />
            <div className="bg-slate-900 rounded p-3">
              <p className="text-slate-400 text-xs">د(س) = {y.toFixed(2)}</p>
              <p className="text-yellow-400 font-bold text-sm mt-1">النقطة: ({pointX.toFixed(2)}, {y.toFixed(2)})</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-pink-400 mb-3">الخط المماس</h3>
            <div className="bg-slate-900 rounded p-3 mb-3 border-l-4 border-pink-500">
              <p className="text-slate-400 text-xs mb-1">الميل:</p>
              <p className="text-pink-400 font-bold">{slope.toFixed(3)}</p>
            </div>
            <div className="bg-slate-900 rounded p-3 border-l-4 border-pink-500">
              <p className="text-slate-400 text-xs mb-1">المعادلة:</p>
              <p className="text-pink-300 text-xs font-mono">د - {y.toFixed(2)} = {slope.toFixed(2)}(س - {pointX.toFixed(2)})</p>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-green-400 mb-3">الخط الناظم</h3>
            <div className="bg-slate-900 rounded p-3 mb-3 border-l-4 border-green-500">
              <p className="text-slate-400 text-xs mb-1">الميل:</p>
              <p className="text-green-400 font-bold">{normalSlope.toFixed(3)}</p>
            </div>
            <div className="bg-slate-900 rounded p-3 border-l-4 border-green-500">
              <p className="text-slate-400 text-xs mb-1">المعادلة:</p>
              <p className="text-green-300 text-xs font-mono">د - {y.toFixed(2)} = {normalSlope.toFixed(2)}(س - {pointX.toFixed(2)})</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-900 to-purple-900 rounded-lg p-6 border border-blue-500">
        <h3 className="text-lg font-bold text-blue-300 mb-3">ملخص المفاهيم</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-300 font-bold mb-2">الخط المماس (Tangent Line):</p>
            <p className="text-slate-300 leading-relaxed">
              خط يلمس المنحنى في نقطة واحدة فقط، وميله يساوي مشتقة الدالة عند تلك النقطة.
            </p>
          </div>
          <div>
            <p className="text-blue-300 font-bold mb-2">الخط الناظم (Normal Line):</p>
            <p className="text-slate-300 leading-relaxed">
              خط عمودي على الخط المماس، وميله يساوي سالب مقلوب ميل المماس.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lesson 9: Max and Min
const MaxMinLesson = () => {
  const [showCalculus, setShowCalculus] = useState(true);

  const dataPoints = generateCurveData(-3, 3, 0.1, 'default');

  // Critical points for d(s) = s^3 - 3s: d'(s) = 3s^2 - 3 = 0 => s = ±1
  const criticalPoints = [-1, 1];
  const criticalValues = criticalPoints.map(x => ({
    x,
    y: evaluateFunction(x, 'default'),
    derivative: getDerivative(x, 'default'),
    secondDerivative: getSecondDerivative(x, 'default'),
  }));

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">النهايات العظمى والصغرى</h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Main Function Graph */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">المنحنى الأصلي</h3>
            <CoordinatePlane
              data={dataPoints}
              showDerivative={showCalculus}
              xRange={[-3, 3]}
              yRange={[-5, 5]}
              width={550}
              height={350}
              curveColor="#06b6d4"
              derivativeColor="#fbbf24"
            />
          </div>

          {/* Critical Points Graph */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-yellow-400 mb-3">المشتقة الأولى (لإيجاد النقاط الحرجة)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dataPoints}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="x" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #475569',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => value.toFixed(3)}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <ReferenceLine y={0} stroke="#64748b" strokeDasharray="5,5" />
                <Line
                  type="monotone"
                  dataKey="derivative"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  dot={false}
                />
                {criticalPoints.map((cp, idx) => (
                  <ReferenceDot
                    key={idx}
                    x={cp}
                    y={0}
                    r={6}
                    fill={criticalValues[idx].secondDerivative > 0 ? '#10b981' : '#ec4899'}
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showCalculus}
                onChange={(e) => setShowCalculus(e.target.checked)}
              />
              <span className="text-sm text-slate-300">عرض المشتقة الأولى</span>
            </label>
          </div>

          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h3 className="text-lg font-bold text-cyan-400 mb-3">النقاط الحرجة</h3>
            <div className="space-y-3">
              {criticalValues.map((cp, idx) => (
                <div
                  key={idx}
                  className={`rounded p-3 border-l-4 ${
                    cp.secondDerivative > 0
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-pink-900/30 border-pink-500'
                  }`}
                >
                  <p className="text-slate-300 text-sm">
                    س = {cp.x.toFixed(2)}
                  </p>
                  <p className="text-slate-300 text-sm">
                    د(س) = {cp.y.toFixed(2)}
                  </p>
                  <p className="text-yellow-300 text-xs mt-1">
                    د'(س) ≈ {cp.derivative.toFixed(3)}
                  </p>
                  <p className={`text-xs font-bold mt-1 ${
                    cp.secondDerivative > 0
                      ? 'text-green-400'
                      : 'text-pink-400'
                  }`}>
                    {cp.secondDerivative > 0
                      ? '📉 نهاية صغرى (Minimum)'
                      : '📈 نهاية عظمى (Maximum)'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-4 border border-purple-500">
            <h3 className="text-lg font-bold text-purple-300 mb-3">اختبار المشتقة الثانية</h3>
            <ul className="text-slate-300 text-xs space-y-2">
              <li>✓ إذا د''(س) {'>'} 0 → نهاية صغرى</li>
              <li>✓ إذا د''(س) {'<'} 0 → نهاية عظمى</li>
              <li>✓ إذا د''(س) = 0 → اختبار إضافي</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-bold text-yellow-400 mb-4">خطوات إيجاد النهايات العظمى والصغرى</h3>
        <ol className="text-slate-300 text-sm space-y-2 list-decimal list-inside">
          <li>احسب المشتقة الأولى د'(س)</li>
          <li>ضع د'(س) = 0 وحل المعادلة للحصول على النقاط الحرجة</li>
          <li>احسب المشتقة الثانية د''(س)</li>
          <li>عوّض النقاط الحرجة في د''(س):</li>
          <ul className="list-disc list-inside mr-4 mt-1">
            <li>إذا د''(س) {'>'} 0 → نهاية صغرى</li>
            <li>إذا د''(س) {'<'} 0 → نهاية عظمى</li>
          </ul>
          <li>احسب قيمة د عند النقاط الحرجة</li>
        </ol>
      </div>
    </div>
  );
};

// Lesson 10: Interactive Exercises
const ExercisesLesson = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const questions = [
    {
      question: 'جد مشتقة د(س) = 3س⁴ + 2س² - 5',
      options: ['د\'(س) = 12س³ + 4س', 'د\'(س) = 12س⁴ + 4س', 'د\'(س) = 3س³ + 2س', 'د\'(س) = 4س³ + س'],
      correct: 0,
      explanation: 'باستخدام قاعدة القوة: مشتقة ك·سⁿ = ك·ن·سⁿ⁻¹',
    },
    {
      question: 'إذا كان د(س) = س² - 4س + 3، جد النقاط الحرجة',
      options: ['س = 2', 'س = 1', 'س = 3', 'س = 0'],
      correct: 0,
      explanation: 'د\'(س) = 2س - 4 = 0 ⟹ س = 2',
    },
    {
      question: 'جد مشتقة د(س) = (2س + 1)³ باستخدام قاعدة السلسلة',
      options: ['د\'(س) = 6(2س + 1)²', 'د\'(س) = 3(2س + 1)²', 'د\'(س) = 2(2س + 1)²', 'د\'(س) = (2س + 1)²'],
      correct: 0,
      explanation: 'د\'(س) = 3(2س + 1)² · 2 = 6(2س + 1)²',
    },
    {
      question: 'إذا كان د(س) = س³ - 3س، جد مشتقة الثانية د\'\'(س)',
      options: ['د\'\'(س) = 6س', 'د\'\'(س) = 3س² - 3', 'د\'\'(س) = 3س', 'د\'\'(س) = 9س²'],
      correct: 0,
      explanation: 'د\'(س) = 3س² - 3، ثم د\'\'(س) = 6س',
    },
    {
      question: 'جد مشتقة د(س) = (س² + 1)(س - 3)',
      options: ['د\'(س) = 3س² - 6س + 1', 'د\'(س) = 2س(س - 3) + س² + 1', 'د\'(س) = س²', 'د\'(س) = 2س - 3'],
      correct: 1,
      explanation: 'استخدم قاعدة الضرب: د\'(س) = 2س(س - 3) + (س² + 1)·1',
    },
    {
      question: 'في أي نقطة يكون للدالة د(س) = س² - 6س + 5 نهاية صغرى؟',
      options: ['س = 3', 'س = 1', 'س = 5', 'س = 0'],
      correct: 0,
      explanation: 'د\'(س) = 2س - 6 = 0 ⟹ س = 3، وبما أن د\'\'(س) = 2 > 0، فهي نهاية صغرى',
    },
    {
      question: 'جد مشتقة د(س) = جا(س) · س²',
      options: ['د\'(س) = جتا(س)·س² + 2س·جا(س)', 'د\'(س) = جتا(س) + 2س', 'د\'(س) = جتا(س)·س²', 'د\'(س) = 2س·جا(س)'],
      correct: 0,
      explanation: 'استخدم قاعدة الضرب: د\'(س) = جتا(س)·س² + جا(س)·2س',
    },
    {
      question: 'جد معادلة المماس للدالة د(س) = س² عند النقطة (1, 1)',
      options: ['د = 2س - 1', 'د = س', 'د = 2س - 2', 'د = س + 1'],
      correct: 0,
      explanation: 'د\'(1) = 2، والمماس: د - 1 = 2(س - 1) ⟹ د = 2س - 1',
    },
    {
      question: 'إذا كان س² + د² = 25، جد د\' باستخدام التفاضل الضمني',
      options: ['د\' = -س/د', 'د\' = س/د', 'د\' = د/س', 'د\' = -د/س'],
      correct: 0,
      explanation: '2س + 2د·د\' = 0 ⟹ د\' = -س/د',
    },
    {
      question: 'جد مشتقة د(س) = 5/س³',
      options: ['د\'(س) = -15/س⁴', 'د\'(س) = -15س⁻⁴', 'د\'(س) = -15س⁻³', 'د\'(س) = 15/س⁴'],
      correct: 0,
      explanation: 'د(س) = 5س⁻³، د\'(س) = 5·(-3)س⁻⁴ = -15س⁻⁴ = -15/س⁴',
    },
  ];

  const currentQ = questions[currentQuestion];
  const handleAnswer = (idx) => {
    if (answered) return;
    setSelectedAnswer(idx);
    setAnswered(true);
    if (idx === currentQ.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setScore(0);
    setAnswered(false);
    setSelectedAnswer(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="space-y-6 text-right" dir="rtl">
      <h2 className="text-2xl font-bold text-cyan-400">التمارين التفاعلية</h2>

      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-yellow-400 font-bold">الدرجة: {score}/{questions.length}</span>
            <span className="text-slate-400">السؤال {currentQuestion + 1} من {questions.length}</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <h3 className="text-2xl font-bold text-yellow-400 mb-6">{currentQ.question}</h3>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQ.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleAnswer(idx)}
              disabled={answered}
              className={`w-full text-right py-4 px-4 rounded-lg transition border-2 text-lg font-semibold ${
                !answered
                  ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600 hover:border-slate-500 cursor-pointer'
                  : idx === currentQ.correct
                  ? 'bg-green-900 border-green-500 text-green-300'
                  : idx === selectedAnswer
                  ? 'bg-red-900 border-red-500 text-red-300'
                  : 'bg-slate-700 border-slate-600 text-slate-300'
              }`}
            >
              {option}
            </button>
          ))}
        </div>

        {/* Explanation */}
        {answered && (
          <div className={`rounded-lg p-4 mb-6 border-l-4 ${
            selectedAnswer === currentQ.correct
              ? 'bg-green-900/30 border-green-500'
              : 'bg-red-900/30 border-red-500'
          }`}>
            <p className={`font-bold text-lg mb-2 ${
              selectedAnswer === currentQ.correct ? 'text-green-400' : 'text-red-400'
            }`}>
              {selectedAnswer === currentQ.correct ? '✓ إجابة صحيحة!' : '✗ إجابة خاطئة'}
            </p>
            <p className="text-slate-300">{currentQ.explanation}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 justify-between">
          {answered && (
            <>
              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  السؤال التالي
                </button>
              ) : (
                <button
                  onClick={handleReset}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition"
                >
                  إعادة البدء
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Final Score */}
      {currentQuestion === questions.length - 1 && answered && (
        <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-lg p-8 border border-purple-500 text-center">
          <h3 className="text-3xl font-bold text-yellow-400 mb-4">نتيجتك النهائية</h3>
          <div className="text-6xl font-bold text-cyan-400 mb-4">
            {score}/{questions.length}
          </div>
          <p className="text-slate-300 text-lg mb-4">
            {score === questions.length
              ? 'ممتاز! أنت أتقنت جميع الموضوعات! 🎉'
              : score >= questions.length * 0.8
              ? 'أداء رائع! استمر في التدريب! 👏'
              : score >= questions.length * 0.6
              ? 'أداء جيد! حاول مراجعة المواضيع التي تحتاج لتحسين'
              : 'اجتهد أكثر! راجع الدروس وحاول مرة أخرى'}
          </p>
          <button
            onClick={handleReset}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition text-lg"
          >
            إعادة الاختبار
          </button>
        </div>
      )}
    </div>
  );
};

// Main Component
export default function DifferentiationUnit() {
  const [activeLesson, setActiveLesson] = useState('intro');
  const [completedLessons, setCompletedLessons] = useState(new Set());

  const lessons = [
    { id: 'intro', name: 'مقدمة التفاضل', icon: '📚', component: IntroductionLesson },
    { id: 'rateOfChange', name: 'التغير ومتوسط معدل التغير', icon: '📈', component: RateOfChangeLesson },
    { id: 'derivative', name: 'مشتقة الدالة', icon: '🔍', component: DerivativeLesson },
    { id: 'rules', name: 'القواعس الأساسية للتفاضل', icon: '📝', component: RulesLesson },
    { id: 'chainRule', name: 'دالة الدالة (قاعدة السلسلة)', icon: '⛓️', component: ChainRuleLesson },
    { id: 'implicit', name: 'التفاضل الضمني', icon: '🔐', component: ImplicitDifferentiationLesson },
    { id: 'higherDerivatives', name: 'المشتقات العليا', icon: '📊', component: HigherDerivativesLesson },
    { id: 'applications', name: 'تطبيقات على الهندسة التحليلية', icon: '📐', component: ApplicationsLesson },
    { id: 'maxMin', name: 'النهايات العظمى والصغرى', icon: '⛰️', component: MaxMinLesson },
    { id: 'exercises', name: 'التمارين التفاعلية', icon: '✏️', component: ExercisesLesson },
  ];

  const markAsCompleted = (lessonId) => {
    setCompletedLessons(new Set([...completedLessons, lessonId]));
  };

  const CurrentComponent = lessons.find(l => l.id === activeLesson)?.component || IntroductionLesson;

  const progressPercentage = (completedLessons.size / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-slate-900 text-white flex" dir="rtl">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-slate-800 to-slate-900 border-l border-slate-700 overflow-y-auto">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-cyan-400 mb-2">الوحدة الثانية</h1>
          <p className="text-sm text-slate-400">التفاضل</p>

          {/* Progress */}
          <div className="mt-4">
            <p className="text-xs text-slate-400 mb-2">التقدم: {completedLessons.size}/{lessons.length}</p>
            <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => {
                setActiveLesson(lesson.id);
                if (lesson.id !== 'exercises') {
                  markAsCompleted(lesson.id);
                }
              }}
              className={`w-full text-right py-3 px-4 rounded-lg transition flex items-center justify-between gap-2 ${
                activeLesson === lesson.id
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/50'
                  : completedLessons.has(lesson.id)
                  ? 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="text-lg">{lesson.icon}</span>
              <span className="text-sm flex-1">{lesson.name}</span>
              {completedLessons.has(lesson.id) && <span className="text-green-400">✓</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-6xl mx-auto">
          <CurrentComponent />
        </div>
      </div>
    </div>
  );
}
