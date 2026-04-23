'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

export default function ChatInterface({ agent, systemPrompt }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0 && agent) {
      setMessages([{
        role: 'assistant',
        content: `السلام عليكم! أنا ${agent.nameAr} ${agent.avatar}\n\nأنا هنا لمساعدتك في التحضير للامتحان. اسألني عن أي شيء في المنهج — شرح، مراجعة، أسئلة تدريبية، أو نصائح للامتحان.\n\nكيف أقدر أساعدك اليوم؟`,
        timestamp: new Date().toISOString(),
      }]);
    }
  }, [agent, messages.length]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input.trim(), timestamp: new Date().toISOString() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Filter to only user/assistant messages for API
      const apiMessages = newMessages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }));

      // Remove the first assistant message (welcome) for cleaner context
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

  const quickQuestions = [
    'لخص لي المنهج المقرر',
    'ما هي أهم المواضيع في الامتحان؟',
    'اعطني أسئلة تدريبية',
    'ما هو المحتوى المحذوف؟',
    'نصائح للامتحان',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] max-w-4xl mx-auto" dir="rtl">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-t-2xl">
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
                <div className="flex items-center gap-2 mb-1 text-sm font-bold" style={{ color: agent?.color || '#1F4E79' }}>
                  <span>{agent?.avatar}</span>
                  <span>{agent?.nameAr}</span>
                </div>
              )}
              <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 text-sm" style={{ color: agent?.color }}>
                <span>{agent?.avatar}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-gray-500">يكتب...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick questions */}
      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-t border-gray-100">
          {quickQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => { setInput(q); }}
              className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
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
          placeholder="اكتب سؤالك هنا..."
          rows={1}
          className="flex-1 resize-none rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
          style={{ maxHeight: '120px' }}
          disabled={isLoading}
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'scaleX(-1)' }}>
            <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}
