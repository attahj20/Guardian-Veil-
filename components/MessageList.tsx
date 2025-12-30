
import React, { useEffect, useRef } from 'react';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isTyping }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const BLOCKED_PHRASE = "detected content that may contain sensitive information";

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-4">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
             <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
             </svg>
          </div>
          <div className="text-center max-w-sm">
            <h3 className="text-lg font-semibold text-slate-300">Guardian Veil Active</h3>
            <p className="text-sm">I'm monitoring this session for PII, secrets, and internal data. Ask me any general work query.</p>
          </div>
        </div>
      )}

      {messages.map((msg) => {
        const isAssistant = msg.role === 'assistant';
        const isBlocked = msg.content.includes(BLOCKED_PHRASE);

        return (
          <div
            key={msg.id}
            className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-sm ${
                isAssistant
                  ? isBlocked
                    ? 'bg-red-950/40 border border-red-500/50 text-red-200'
                    : 'bg-slate-800 border border-slate-700 text-slate-200'
                  : 'bg-blue-600 text-white'
              }`}
            >
              {isAssistant && isBlocked && (
                <div className="flex items-center space-x-2 mb-2 text-red-400 font-bold text-xs uppercase tracking-wider">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>Security Block</span>
                </div>
              )}
              <p className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</p>
              <span className={`text-[10px] mt-1 block opacity-50 ${isAssistant ? 'text-slate-400' : 'text-blue-100'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        );
      })}

      {isTyping && (
        <div className="flex justify-start">
          <div className="bg-slate-800 border border-slate-700 text-slate-200 rounded-2xl px-4 py-3 flex space-x-1 items-center">
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
