import React, { useState, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Copy, 
  Check, 
  Lightbulb,
  ShieldCheck,
  FileText,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyLeavePrompt?: (reason: string) => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  onApplyLeavePrompt
}) => {
  const { currentUser, isAdmin } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hello **${currentUser?.name || 'there'}**! I am **Dayflow AI**, your intelligent HR & statutory payroll copilot.

I can assist you with:
- 📝 **Drafting formal leave & WFH applications**
- 📊 **Explaining Indian statutory salary (Basic, HRA, EPF 12%, PT ₹200, Section 192 TDS)**
- 🏢 **Workplace policies (core hours, remote norms, holidays, maternity)**
- 📈 **Team attendance & organizational headcount summaries**

Select a quick topic below or type any question to begin!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'Draft a 2-day sick leave request due to viral fever',
    'Explain my monthly salary structure, EPF and tax deductions',
    'What is the Dayflow remote work & core hours policy?',
    'How do I calculate tax exemption on HRA under Section 10(13A)?',
    'Summarize workforce attendance across departments'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSend = async (userPrompt?: string) => {
    const promptToSend = (userPrompt || input).trim();
    if (!promptToSend || isLoading) return;

    const userMsg: Message = {
      role: 'user',
      content: promptToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather real-time context
      let stats = null;
      try {
        stats = await api.getStats();
      } catch {
        // Continue even if stats fails
      }

      const context = {
        currentUser,
        systemStats: stats,
        timestamp: new Date().toISOString()
      };

      const response = await api.askAi(promptToSend, context);

      const aiMsg: Message = {
        role: 'assistant',
        content: response.answer || 'I have reviewed your inquiry. Please check the relevant module in the Dayflow portal.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: Message = {
        role: 'assistant',
        content: `### 🤖 Dayflow HR Intelligence

Here is guidance regarding your request:

- **Leave Requests**: You can apply directly in the **Leave Requests** module. Standard allocation is 18 PL, 10 SL, 8 CL.
- **Salary & Payroll**: Itemized payslips with EPF, PT, and TDS calculations are accessible in the **Payroll & Slips** module.
- **Support**: For administrative escalations, HR Admins can review records in the Staff Directory.

*Feel free to ask another query or draft a leave note!*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: `Hello **${currentUser?.name || 'there'}**! How may I assist your workday today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        className="bg-slate-900/90 backdrop-blur-2xl max-w-2xl w-full h-[660px] max-h-[92vh] rounded-3xl border border-white/20 flex flex-col overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-4 border-b border-white/10 bg-slate-950/70 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 border border-white/20 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-manrope font-extrabold text-white text-base">
                  Dayflow AI HR Copilot
                </h2>
                <span className="text-[10px] font-mono-code bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2.5 py-0.5 rounded-full font-bold">
                  Gemini 2.5 Flash Active
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Context-aware Indian statutory HRMS assistant, draft generator & policy advisor
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              title="Reset conversation"
              className="p-1.5 px-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1 border border-white/10"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Clear</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Message Scroll Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-950/40">
          {messages.map((msg, idx) => {
            const isAi = msg.role === 'assistant';
            return (
              <div
                key={idx}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isAi ? 'items-start' : 'items-start flex-row-reverse'
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-md border ${
                    isAi
                      ? 'bg-indigo-600 text-white border-indigo-400/40 shadow-indigo-600/30'
                      : 'bg-slate-800 text-white border-white/10'
                  }`}
                >
                  {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[88%] rounded-2xl p-4 space-y-2 relative group shadow-xl ${
                    isAi
                      ? 'bg-slate-900/85 text-slate-100 border border-white/15 backdrop-blur-md'
                      : 'bg-indigo-600 text-white shadow-indigo-600/30 border border-indigo-400/30'
                  }`}
                >
                  <div className={`prose prose-xs max-w-none font-sans font-normal leading-relaxed ${
                    isAi ? 'text-slate-200' : 'text-white'
                  }`}>
                    {isAi ? (
                      <Markdown
                        components={{
                          h3: ({ node, ...props }) => <h3 className="text-sm font-bold text-white mt-2 mb-1" {...props} />,
                          h4: ({ node, ...props }) => <h4 className="text-xs font-bold text-white mt-2 mb-1" {...props} />,
                          p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed text-slate-200" {...props} />,
                          ul: ({ node, ...props }) => <ul className="list-disc pl-4 space-y-1 mb-2 text-slate-200" {...props} />,
                          ol: ({ node, ...props }) => <ol className="list-decimal pl-4 space-y-1 mb-2 text-slate-200" {...props} />,
                          li: ({ node, ...props }) => <li className="leading-snug" {...props} />,
                          strong: ({ node, ...props }) => <strong className="font-bold text-white" {...props} />,
                          code: ({ node, ...props }) => <code className="bg-slate-950/80 px-1.5 py-0.5 rounded text-indigo-300 font-mono-code text-[11px] border border-white/10" {...props} />,
                          hr: () => <hr className="my-2 border-white/10" />
                        }}
                      >
                        {msg.content}
                      </Markdown>
                    ) : (
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    )}
                  </div>

                  <div className={`flex items-center justify-between text-[10px] pt-2 border-t ${
                    isAi ? 'text-slate-400 border-white/10' : 'text-indigo-200 border-indigo-400/30'
                  }`}>
                    <span className="font-mono-code">{msg.timestamp}</span>

                    {isAi && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleCopy(msg.content, idx)}
                          className="hover:text-indigo-300 text-slate-400 flex items-center gap-1 text-[10px] font-medium cursor-pointer transition-colors"
                          title="Copy message to clipboard"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400 font-bold">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy Text</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md border border-indigo-400/40">
                <Sparkles className="w-4 h-4 animate-spin" />
              </div>
              <div className="px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/15 flex items-center gap-2.5 shadow-xl backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                <span className="font-mono-code text-indigo-300 font-medium">Dayflow AI is analyzing statutory context...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2 bg-slate-950/60 border-t border-white/10 overflow-x-auto flex gap-2 no-scrollbar">
          {promptSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => handleSend(sug)}
              disabled={isLoading}
              className="text-[11px] px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-indigo-600/30 text-slate-300 hover:text-white border border-white/15 shrink-0 transition-colors flex items-center gap-1.5 font-medium cursor-pointer disabled:opacity-50"
            >
              <Lightbulb className="w-3 h-3 text-amber-400 shrink-0" />
              <span>{sug}</span>
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-white/10 bg-slate-950/80">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about leaves, payroll, Indian taxes, or draft an email..."
              className="flex-1 bg-slate-900/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 transition-all font-sans"
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-40 transition-all shadow-lg shadow-indigo-600/30 cursor-pointer flex items-center justify-center shrink-0 border border-indigo-400/30"
              title="Send Prompt"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
