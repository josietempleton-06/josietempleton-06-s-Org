
import React, { useState, useMemo } from 'react';
import { User, JournalEntry } from '../types';

interface DashboardProps {
  user: User;
  entries: JournalEntry[];
  onLogout: () => void;
  onNew: () => void;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, entries, onLogout, onNew, onEdit, onDelete }) => {
  const [search, setSearch] = useState('');

  const filteredEntries = useMemo(() => 
    entries.filter(e => 
      e.title.toLowerCase().includes(search.toLowerCase()) || 
      e.content.toLowerCase().includes(search.toLowerCase())
    ), [entries, search]);

  // Returns an object containing the specific classes for the card theme
  const getMoodTheme = (mood?: string) => {
    const base = {
      card: 'bg-white border-slate-100 group-hover:border-indigo-100',
      title: 'text-slate-900',
      content: 'text-slate-500',
      meta: 'text-slate-300',
      date: 'text-slate-900',
      tag: 'bg-white border-slate-100 text-slate-800',
      icon: 'text-slate-200'
    };

    if (!mood) return base;
    const m = mood.toLowerCase();

    if (m.includes('happy') || m.includes('joy') || m.includes('excit')) {
      return {
        ...base,
        card: 'bg-amber-50/50 border-amber-100 group-hover:shadow-amber-100/50',
        title: 'text-amber-900',
        content: 'text-amber-800/70',
        meta: 'text-amber-400',
        tag: 'bg-white/80 border-amber-200 text-amber-900'
      };
    }
    
    if (m.includes('sad') || m.includes('blue') || m.includes('lonely')) {
      return {
        ...base,
        card: 'bg-blue-50/50 border-blue-100 group-hover:shadow-blue-100/50',
        title: 'text-blue-900',
        content: 'text-blue-800/70',
        meta: 'text-blue-400',
        tag: 'bg-white/80 border-blue-200 text-blue-900'
      };
    }

    if (m.includes('angry') || m.includes('frustrat')) {
      return {
        ...base,
        card: 'bg-red-50/50 border-red-100 group-hover:shadow-red-100/50',
        title: 'text-red-900',
        content: 'text-red-800/70',
        meta: 'text-red-400',
        tag: 'bg-white/80 border-red-200 text-red-900'
      };
    }

    // "Gray" or "Neutral" theme with white text for high contrast
    if (m.includes('neutral') || m.includes('gray') || m.includes('reflect') || m.includes('stoic') || m.includes('calm')) {
      return {
        card: 'bg-slate-800 border-slate-700 shadow-2xl group-hover:bg-slate-700',
        title: 'text-white group-hover:text-indigo-200',
        content: 'text-slate-300',
        meta: 'text-slate-500',
        date: 'text-white',
        tag: 'bg-slate-900/50 border-slate-600 text-slate-300',
        icon: 'text-slate-600'
      };
    }

    return {
      ...base,
      card: 'bg-indigo-50/50 border-indigo-100 group-hover:shadow-indigo-100/50',
      title: 'text-indigo-950',
      content: 'text-indigo-800/70',
      meta: 'text-indigo-300',
      tag: 'bg-white/80 border-indigo-200 text-indigo-900'
    };
  };

  const getReadTime = (text: string) => {
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-24">
      {/* Navbar */}
      <nav className="sticky top-0 z-20 backdrop-blur-md bg-white/80 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 flex items-center justify-center transition-transform group-hover:scale-110">
              <span className="text-white font-serif font-bold italic text-lg">A</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-serif italic tracking-tight">Aura</h2>
          </div>
          
          <div className="flex items-center space-x-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-slate-900 text-sm font-bold tracking-tight">{user.name}</span>
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-widest">Mindful Member</span>
            </div>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all text-sm font-bold uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-bold text-slate-900 font-serif">Your Sanctuary</h1>
            <p className="text-slate-400 font-medium flex items-center space-x-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></span>
              <span>{entries.length} reflections captured in your journey</span>
            </p>
          </div>
          <div className="relative flex-1 max-w-md w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search through your memories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-6 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-200 transition-all text-slate-600 placeholder:text-slate-300"
            />
          </div>
        </div>

        {filteredEntries.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <svg className="w-24 h-24 mx-auto text-slate-200 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3 font-serif italic">Your story awaits</h3>
            <p className="text-slate-400 mb-10 max-w-xs mx-auto leading-relaxed">The page is empty, but your mind is full. Let's start capturing today's aura.</p>
            <button
              onClick={onNew}
              className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
            >
              Begin New Reflection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredEntries.map(entry => {
              const theme = getMoodTheme(entry.mood);
              return (
                <div
                  key={entry.id}
                  onClick={() => onEdit(entry)}
                  className={`group relative p-10 rounded-[2.5rem] border transition-all cursor-pointer overflow-hidden flex flex-col h-full ${theme.card}`}
                >
                  {/* Aura Glow Effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 blur-3xl rounded-full group-hover:scale-150 transition-transform"></div>
                  
                  <div className="flex justify-between items-center mb-8 relative z-10">
                    <div className="flex flex-col">
                      <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${theme.meta}`}>
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </span>
                      <span className={`text-lg font-bold ${theme.date}`}>
                        {new Date(entry.date).getDate()}
                      </span>
                    </div>
                    {entry.mood && (
                      <div className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm border ${theme.tag}`}>
                        {entry.mood}
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-2xl font-bold mb-6 font-serif line-clamp-2 leading-tight transition-colors ${theme.title}`}>
                    {entry.title}
                  </h3>
                  
                  <p className={`text-base leading-relaxed line-clamp-4 mb-8 font-serif italic opacity-80 flex-grow ${theme.content}`}>
                    {entry.content}
                  </p>

                  <div className={`flex items-center justify-between pt-6 border-t relative z-10 ${theme.card.includes('bg-slate-800') ? 'border-slate-700' : 'border-slate-50'}`}>
                     <div className={`flex items-center space-x-2 ${theme.meta}`}>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{getReadTime(entry.content)}</span>
                     </div>
                     <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to permanently delete this memory?')) {
                          onDelete(entry.id);
                        }
                      }}
                      className={`p-3 rounded-xl transition-all ${theme.card.includes('bg-slate-800') ? 'text-slate-500 hover:text-red-400 hover:bg-slate-900/50' : 'text-slate-200 hover:text-red-400 hover:bg-red-50'}`}
                      title="Delete entry"
                     >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                     </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Action Button */}
      <button
        onClick={onNew}
        className="fixed bottom-12 right-12 w-20 h-20 bg-indigo-600 text-white rounded-[2rem] shadow-2xl flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all z-30 group"
      >
        <div className="absolute inset-0 bg-indigo-400 rounded-[2rem] animate-ping opacity-20 group-hover:opacity-0 transition-opacity"></div>
        <svg className="w-10 h-10 relative" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  );
};

export default Dashboard;
