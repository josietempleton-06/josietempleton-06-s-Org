
import React, { useState, useMemo } from 'react';
import { JournalEntry } from '../types';
import { geminiService } from '../services/geminiService';

interface EditorProps {
  userId: string;
  existingEntry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
  onCancel: () => void;
}

const Editor: React.FC<EditorProps> = ({ userId, existingEntry, onSave, onCancel }) => {
  const [title, setTitle] = useState(existingEntry?.title || '');
  const [content, setContent] = useState(existingEntry?.content || '');
  const [mood, setMood] = useState(existingEntry?.mood || '');
  const [summary, setSummary] = useState(existingEntry?.aiSummary || '');
  const [advice, setAdvice] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Sync with Dashboard's theme logic for consistent Aura experience
  const theme = useMemo(() => {
    const base = {
      bg: 'bg-white',
      title: 'text-slate-900',
      content: 'text-slate-700',
      placeholder: 'placeholder:text-slate-200',
      meta: 'text-slate-400',
      header: 'bg-white/95 border-slate-50'
    };

    if (!mood) return base;
    const m = mood.toLowerCase();

    if (m.includes('neutral') || m.includes('gray') || m.includes('reflect') || m.includes('stoic') || m.includes('calm')) {
      return {
        bg: 'bg-slate-800',
        title: 'text-white',
        content: 'text-slate-200',
        placeholder: 'placeholder:text-slate-500',
        meta: 'text-slate-400',
        header: 'bg-slate-900/95 border-slate-800'
      };
    }
    
    if (m.includes('happy') || m.includes('joy') || m.includes('excit')) {
      return { ...base, bg: 'bg-amber-50/30', title: 'text-amber-900', content: 'text-amber-800' };
    }

    if (m.includes('sad') || m.includes('blue') || m.includes('lonely')) {
      return { ...base, bg: 'bg-blue-50/30', title: 'text-blue-900', content: 'text-blue-800' };
    }

    return base;
  }, [mood]);

  const counts = useMemo(() => ({
    chars: content.length,
    words: content.trim() ? content.trim().split(/\s+/).length : 0
  }), [content]);

  const handleAnalyze = async () => {
    if (!content.trim()) return;
    setIsAnalyzing(true);
    try {
      const result = await geminiService.analyzeEntry(content);
      setMood(result.mood);
      setSummary(result.summary);
      setAdvice(result.advice);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    setIsSaving(true);
    
    try {
      const entry: JournalEntry = {
        id: existingEntry?.id || crypto.randomUUID(),
        userId,
        title: title.trim(),
        content: content.trim(),
        date: existingEntry?.date || new Date().toISOString(),
        lastModified: new Date().toISOString(),
        mood: mood || undefined,
        aiSummary: summary || undefined,
      };

      await onSave(entry);
    } catch (error) {
      console.error("Failed to save entry:", error);
      alert("Something went wrong while saving your reflection.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-700 ${theme.bg}`}>
      {/* Top Bar */}
      <header className={`h-24 border-b sticky top-0 backdrop-blur-md z-20 flex items-center justify-between px-8 transition-colors duration-700 ${theme.header}`}>
        <button
          onClick={onCancel}
          className={`group flex items-center space-x-3 transition-all font-bold uppercase tracking-widest text-[10px] ${mood && theme.bg.includes('slate-800') ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
        >
          <div className="p-2 rounded-lg transition-colors group-hover:bg-black/5">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
          </div>
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !content.trim()}
            className="hidden sm:flex items-center space-x-2 px-5 py-2.5 text-indigo-500 font-bold text-xs uppercase tracking-widest hover:bg-indigo-500/10 rounded-xl transition-all disabled:opacity-30 group"
          >
            {isAnalyzing ? (
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
            <span>{isAnalyzing ? 'Analyzing' : 'AI Analysis'}</span>
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-xl shadow-indigo-900/20 hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 transition-all disabled:opacity-30"
          >
            {isSaving ? 'Saving...' : 'Complete Entry'}
          </button>
        </div>
      </header>

      {/* Editor Main */}
      <main className="max-w-4xl mx-auto p-8 md:pt-20 pb-40">
        <div className="space-y-12">
          <div className="space-y-6">
            <input
              type="text"
              placeholder="Title of your reflection..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-5xl md:text-7xl font-bold font-serif outline-none border-none bg-transparent transition-colors duration-700 tracking-tight leading-tight ${theme.title} ${theme.placeholder}`}
            />

            <div className="flex flex-wrap gap-4 items-center">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.meta}`}>Aura State</span>
              {mood ? (
                <div className="px-4 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full flex items-center space-x-3 shadow-lg shadow-indigo-900/40 animate-in zoom-in-95 duration-300">
                  <span>{mood}</span>
                  <button onClick={() => setMood('')} className="hover:scale-125 transition-transform opacity-60 hover:opacity-100">×</button>
                </div>
              ) : (
                <span className={`text-xs font-serif italic ${theme.meta}`}>Waiting for your words...</span>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              placeholder="How are you feeling today? Let it all out..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={`w-full min-h-[500px] text-xl md:text-2xl leading-relaxed outline-none border-none resize-none font-serif bg-transparent transition-colors duration-700 ${theme.content} ${theme.placeholder}`}
            />
            
            {/* Counts */}
            <div className={`absolute -bottom-10 right-0 flex items-center space-x-6 text-[10px] font-black uppercase tracking-widest ${theme.meta}`}>
              <div className="flex items-center space-x-2">
                <span className="opacity-50">Words</span>
                <span className="font-black">{counts.words}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="opacity-50">Chars</span>
                <span className="font-black">{counts.chars}</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Section */}
        {(summary || advice) && (
          <div className={`mt-24 p-12 rounded-[3rem] border space-y-10 animate-in slide-in-from-bottom-8 duration-500 ${theme.bg.includes('slate-800') ? 'bg-slate-900/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 rounded-2xl shadow-sm flex items-center justify-center ${theme.bg.includes('slate-800') ? 'bg-slate-800' : 'bg-white'}`}>
                  <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h4 className={`text-xl font-bold font-serif italic ${theme.title}`}>The AI Perspective</h4>
              </div>
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Analyzed by Aura AI</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              {summary && (
                <div className="space-y-4">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.meta}`}>Summary</p>
                  <p className={`leading-relaxed text-lg font-serif italic ${theme.content}`}>"{summary}"</p>
                </div>
              )}

              {advice && (
                <div className="space-y-4">
                  <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${theme.meta}`}>Encouragement</p>
                  <p className={`leading-relaxed text-lg font-serif ${theme.content}`}>
                    {advice}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Editor;
