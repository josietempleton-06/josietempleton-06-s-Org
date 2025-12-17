
import React from 'react';

interface LandingProps {
  onAuth: () => void;
}

const Landing: React.FC<LandingProps> = ({ onAuth }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-[#FDFCFB] to-[#F5F7FA]">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <div className="inline-block px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide uppercase">
            Your Digital Sanctuary
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight font-serif italic">
            Aura Journal
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Write down your thoughts, capture your moods, and reflect on your journey with a journaling experience designed for peace of mind.
          </p>
        </div>

        <div className="pt-8">
          <button
            onClick={onAuth}
            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-xl hover:shadow-indigo-100 hover:-translate-y-1 active:scale-95"
          >
            Start Your Reflection
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 pt-16 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2 text-slate-800">Private & Secure</h3>
            <p className="text-slate-500 text-sm">Your thoughts are yours alone. All entries are stored securely on your device.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2 text-slate-800">AI Insights</h3>
            <p className="text-slate-500 text-sm">Powered by Gemini to help you summarize entries and understand your mood patterns.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
            <h3 className="font-bold text-lg mb-2 text-slate-800">Calming Design</h3>
            <p className="text-slate-500 text-sm">A distraction-free environment tailored for mindful writing and deep reflection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
