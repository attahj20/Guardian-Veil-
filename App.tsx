
import React, { useState, useCallback } from 'react';
import MessageList from './components/MessageList';
import ChatInput from './components/ChatInput';
import { Message } from './types';
import { sendMessageStreamToGuardian } from './services/geminiService';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showAssets, setShowAssets] = useState(false);

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const stream = sendMessageStreamToGuardian(content);
      let fullContent = '';

      for await (const chunk of stream) {
        fullContent += chunk;
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMessageId ? { ...msg, content: fullContent } : msg
          )
        );
      }
    } catch (error) {
      console.error('Error in communication:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMessageId
            ? { ...msg, content: 'Communication error occurred. Please try again.' }
            : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  }, []);

  const clearChat = () => {
    if (window.confirm('Are you sure you want to clear the session? All history will be wiped.')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 overflow-hidden">
      {/* Sidebar for Assets */}
      {showAssets && (
        <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col transition-all duration-300">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Deployment Assets</h2>
            <button onClick={() => setShowAssets(false)} className="text-slate-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="p-4 space-y-4 overflow-y-auto">
            <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
              <h3 className="text-xs font-semibold text-blue-400 mb-1">Organization</h3>
              <p className="text-sm text-slate-300">GuardianVeil-SecOps-Global</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs font-semibold text-slate-500 uppercase">Repository Files</p>
              {['LICENSE (MIT)', 'README.md', 'datadog_config.json', 'traffic_generator.js'].map(file => (
                <div key={file} className="flex items-center space-x-2 text-sm text-slate-400 p-2 hover:bg-slate-800 rounded cursor-pointer transition-colors">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  <span>{file}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full relative">
        <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 leading-none">Guardian Veil</h1>
              <div className="flex items-center mt-1">
                <span className="relative flex h-2 w-2 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium uppercase tracking-tighter">Compliance Protocol Active</span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {!showAssets && (
              <button 
                onClick={() => setShowAssets(true)}
                className="text-slate-400 hover:text-blue-400 text-sm font-medium flex items-center space-x-1 border border-slate-700 px-3 py-1 rounded-md transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
                <span>View Repo Assets</span>
              </button>
            )}
            <button
              onClick={clearChat}
              className="text-slate-400 hover:text-red-400 transition-colors flex items-center space-x-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-sm font-medium hidden sm:inline">Reset</span>
            </button>
          </div>
        </header>

        <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full overflow-hidden">
          <MessageList messages={messages} isTyping={isTyping} />
          <ChatInput onSendMessage={handleSendMessage} disabled={isTyping} />
        </main>

        <footer className="hidden md:block py-2 text-center text-[10px] text-slate-600 bg-slate-900 border-t border-slate-800">
          Organization: <span className="text-slate-400">GuardianVeil-SecOps-Global</span> • Public Repo instrumentation enabled.
        </footer>
      </div>
    </div>
  );
};

export default App;
