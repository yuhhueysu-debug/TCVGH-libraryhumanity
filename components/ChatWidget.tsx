import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Loader2 } from 'lucide-react';
import { ChatMessage } from '../types';
import { generateChatResponse } from '../services/geminiService';

const ChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'welcome', 
      role: 'model', 
      text: '你好！我是醫文小幫手。有什麼關於醫學人文、倫理或歷史的問題，我都可以和你聊聊喔！', 
      timestamp: Date.now() 
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    // Filter out welcome message from history if it's the only one
    const chatHistoryForAPI = messages.filter(msg => msg.id !== 'welcome');
    const responseText = await generateChatResponse(chatHistoryForAPI, userMsg.text);

    const modelMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl transition-all duration-300 z-40 
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100 bg-indigo-600 hover:bg-indigo-700 text-white'}`}
        aria-label="Open AI Chat"
      >
        <MessageCircle size={28} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-6 right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl z-50 flex flex-col transition-all duration-300 ease-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}
        style={{ maxHeight: 'calc(100vh - 100px)', height: '500px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-stone-100 bg-indigo-100/60 backdrop-blur-sm rounded-t-2xl">
          <div className="flex items-center gap-2 text-indigo-900">
            <Sparkles size={20} className="text-indigo-600" />
            <h3 className="font-bold text-base">醫文小幫手 (AI)</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-stone-500 hover:text-stone-700 p-1 rounded-full hover:bg-stone-100 transition-colors"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] rounded-xl px-4 py-3 text-sm leading-relaxed shadow-sm
                  ${msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none' 
                    : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none'}`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-xl rounded-bl-none px-4 py-3 shadow-sm">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 border-t border-stone-100 bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="問問關於醫學倫理的問題..."
              className="flex-1 px-4 py-2 bg-stone-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-300 outline-none transition-all"
              aria-label="Chat input"
            />
            <button 
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-stone-400">AI 可能會產生錯誤訊息，請查核重要資訊。</p>
          </div>
        </form>
      </div>
    </>
  );
};

export default ChatWidget;