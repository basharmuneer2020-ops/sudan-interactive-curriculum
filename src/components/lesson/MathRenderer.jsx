'use client';
import { useEffect, useRef } from 'react';
import katex from 'katex';

/**
 * MathRenderer — يعرض المعادلات الرياضية والكيميائية
 * @param {string} math — نص LaTeX (e.g. "F = G\\frac{m_1 m_2}{r^2}")
 * @param {boolean} block — عرض ككتلة (display) أو داخل السطر (inline)
 */
export default function MathRenderer({ math, block = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && math) {
      try {
        katex.render(math, ref.current, {
          displayMode: block,
          throwOnError: false,
          trust: true,
          strict: false,
        });
      } catch (e) {
        ref.current.textContent = math;
      }
    }
  }, [math, block]);

  return block ? (
    <div ref={ref} className="my-4 text-center overflow-x-auto py-2" dir="ltr" />
  ) : (
    <span ref={ref} dir="ltr" />
  );
}

/**
 * RichText — يعرض نص مع معادلات مضمنة
 * القاعدة: $...$ للمعادلات داخل السطر، $$...$$ للمعادلات المنفصلة
 */
export function RichText({ content, className = '' }) {
  if (!content) return null;

  // Split by $$...$$ (block) and $...$ (inline)
  const parts = [];
  let remaining = content;
  let key = 0;

  while (remaining.length > 0) {
    // Check for block math $$...$$
    const blockMatch = remaining.match(/^\$\$([\s\S]*?)\$\$/);
    if (blockMatch && remaining.indexOf(blockMatch[0]) === 0) {
      parts.push(<MathRenderer key={key++} math={blockMatch[1].trim()} block />);
      remaining = remaining.slice(blockMatch[0].length);
      continue;
    }

    // Check for inline math $...$
    const inlineMatch = remaining.match(/^\$((?!\$)[^\$]*?)\$/);
    if (inlineMatch && remaining.indexOf(inlineMatch[0]) === 0) {
      parts.push(<MathRenderer key={key++} math={inlineMatch[1].trim()} />);
      remaining = remaining.slice(inlineMatch[0].length);
      continue;
    }

    // Find next math delimiter
    const nextBlock = remaining.indexOf('$$');
    const nextInline = remaining.indexOf('$');
    let nextMath = -1;

    if (nextBlock > 0) nextMath = nextBlock;
    else if (nextInline > 0) nextMath = nextInline;

    if (nextMath > 0) {
      parts.push(<span key={key++}>{remaining.slice(0, nextMath)}</span>);
      remaining = remaining.slice(nextMath);
    } else {
      parts.push(<span key={key++}>{remaining}</span>);
      remaining = '';
    }
  }

  return <span className={className}>{parts}</span>;
}
