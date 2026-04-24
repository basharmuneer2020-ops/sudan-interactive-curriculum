'use client';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { RichText } from '@/components/lesson/MathRenderer';

// Simple markdown-like renderer for chat messages
function ChatMessage({ content }) {
  // Split content into lines and process
  const lines = content.split('\n');
  const elements = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (listItems.length > 0) {
      if (listType === 'ol') {
        elements.push(
          <ol key={`list-${elements.length}`} className="list-decimal list-inside space-y-1 my-2 mr-2">
            {listItems.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
          </ol>
        );
      } else {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-1 my-2 mr-2">
            {listItems.map((item, i) => <li key={i} className="text-sm leading-relaxed">{item}</li>)}
          </ul>
        );
      }
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Headers
    if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={idx} className="font-bold text-sm mt-3 mb-1">{trimmed.slice(4)}</h4>);
    } else if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={idx} className="font-bold mt-3 mb-1">{trimmed.slice(3)}</h3>);
    } else if (trimmed.startsWith('# ')) {
      flushList();
      elements.push(<h2 key={idx} className="font-bold text-lg mt-3 mb-1">{trimmed.slice(2)}</h2>);
    }
    // Bullet lists
    else if (trimmed.match(/^[-•]\s/)) {
      if (listType !== 'ul') { flushList(); listType = 'ul'; }
      listItems.push(<RichText text={trimmed.replace(/^[-•]\s/, '')} />);
    }
    // Numbered lists
    else if (trimmed.match(/^\d+[.)]\s/)) {
      if (listType !== 'ol') { flushList(); listType = 'ol'; }
      listItems.push(<RichText text={trimmed.replace(/^\d+[.)]\s/, '')} />);
    }
    // Display math ($$...$$)
    else if (trimmed.startsWith('$$') && trimmed.endsWith('$$') && trimmed.length > 4) {
      flushList();
      const math = trimmed.slice(2, -2);
      elements.push(
        <div key={idx} className="my-3 text-center overflow-x-auto" dir="ltr">
          <RichText text={`$$${math}$$`} />
        </div>
      );
    }
    // Separator
    else if (trimmed === '---' || trimmed === '***') {
      flushList();
      elements.push(<hr key={idx} className="my-3 border-gray-200" />);
    }
    // Bold text line (like **title**)
    else if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
      flushList();
      elements.push(
        <p key={idx} className="font-bold text-sm mt-2 mb-1">
          <RichText text={trimmed.slice(2, -2)} />
        </p>
      );
    }
    // Empty line
    else if (trimmed === '') {
      flushList();
      elements.push(<div key={idx} className="h-2" />);
    }
    // Regular text with inline formatting
    else {
      flushList();
      elements.push(
        <p key={idx} className="text-sm leading-relaxed">
          <RichText text={trimmed} />
        </p>
      );
    }
  });

  flushList();
  return <div className="space-y-0.5">{elements}</div>;
}

export default function ChatInterface({ agent, systemPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeMode, setActiveMode] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Personalized welcome message
  useEffect(() => {
    if (messages.length === 0 && agent) {
      const welcome = agent.welcomeMessage || `السلام عليكم! أنا ${agent.nameAr} ${agent.avatar}\n\nأنا هنا لمساعدتك في التحضير للامتحان.\n\nكيف أقدر أساعدك اليوم؟`;
      setMessages([{
        role: 'assistant',
        content: welcome,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [agent, messages.length]);

  // Teaching modes from agents data
  const teachingModes = useMemo(() => [
    { id: 'explain', label: 'اشرح لي', icon: '💡', prompt: 'اشرح الموضوع بطريقة بسيطة ومشوقة مع أمثلة من الحياة اليومية.' },
    { id: 'quiz', label: 'اختبرني', icon: '🧠', prompt: 'اعطني سؤال اختيار من متعدد (4 خيارات) من المنهج. بعد إجابتي، أخبرني إذا كنت صحيحاً واشرح. ثم اسألني سؤالاً آخر.' },
    { id: 'practice', label: 'تمرين', icon: '✏️', prompt: 'اعطني مسألة/تمرين عملي أحلها خطوة بخطوة. انتظر إجابتي ثم صححها.' },
    { id: 'summary', label: 'ملخص', icon: '📋', prompt: 'لخص لي أهم النقاط مع التركيز على ما يأتي في الامتحان.' },
    { id: 'examTips', label: 'نصائح', icon: '🎯', prompt: 'أعطني أهم نصائح الامتحان: ما يتكرر؟ أين يخطئ الطلاب؟ كيف أحصل درجات عالية؟' },
  ], []);

  // Subject-specific quick questions
  const quickQuestions = useMemo(() => {
    return agent?.quickQuestions || [
      'لخص لي المنهج المقرر',
      'ما هي أهم المواضيع في الامتحان؟',
      'اعطني أسئلة تدريبية',
      'ما هو المحتوى المحذوف؟',
      'نصائح للامتحان',
    ];
  }, [agent]);

  const sendMessage = async (overrideText) => {
    const text = overrideText || input.trim();
    if (!text || isLoading) return;

    const userMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      const apiMessages = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      // Remove welcome message for cleaner context
      if (apiMessages[0]?.role === 'assistant') {
        apiMessages.shift();
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: apiMessages,
          systemPrompt,
          agentName: agent.nameAr,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ في الاتصال');
      }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.message,
        timestamp: new Date().toISOString(),
      }]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, {
        role: 'system',
        content: `⚠️ ${err.message}`,
        timestamp: new Date().toISOString(),
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleModeClick = (mode) => {
    setActiveMode(activeMode === mode.id ? null : mode.id);
    sendMessage(mode.prompt);
  };

  const handleQuickQuestion = (q) => {
    sendMessage(q);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto" dir="rtl">

      {/* Teaching modes bar */}
      <div className="flex gap-1.5 p-2 bg-slate-800/60 rounded-t-2xl border-b border-slate-700/50 overflow-x-auto">
        {teachingModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => handleModeClick(mode)}
            disabled={isLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeMode === mode.id
                ? 'text-white shadow-md'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/60 hover:text-white'
            } disabled:opacity-50`}
            style={activeMode === mode.id ? { backgroundColor: agent?.color || '#1565C0' } : {}}
          >
            <span>{mode.icon}</span>
            <span>{mode.label}</span>
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-slate-900/40">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-md'
                : msg.role === 'system'
                ? 'bg-yellow-100 text-yellow-800 rounded-bl-md'
                : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
            }`}>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-gray-100">
                  <span className="text-lg">{agent?.avatar}</span>
                  <span className="text-sm font-bold" style={{ color: agent?.color || '#1F4E79' }}>
                    {agent?.nameAr}
                  </span>
                </div>
              )}
              {msg.role === 'user' ? (
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
              ) : (
                <ChatMessage content={msg.content} />
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-lg">{agent?.avatar}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: agent?.color || '#666', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: agent?.color || '#666', animationDelay: '150ms' }} />
                  <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: agent?.color || '#666', animationDelay: '300ms' }} />
                </div>
                <span className="text-gray-500 text-xs">{agent?.nameAr} يفكّر...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions — show only at start */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-t border-gray-100">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleQuickQuestion(q)}
              disabled={isLoading}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="flex items-end gap-2 p-3 bg-white rounded-b-2xl border-t border-gray-200">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`اسأل ${agent?.nameAr || 'المعلم'}...`}
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          style={{ maxHeight: '120px' }}
          disabled={isLoading}
        />
        <button
          onClick={() => sendMessage()}
          disabled={isLoading || !input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-xl text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ backgroundColor: agent?.color || '#1565C0' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
