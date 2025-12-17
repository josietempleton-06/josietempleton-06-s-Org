
import React, { useState, useEffect } from 'react';
import { User, JournalEntry, AppView } from './types';
import { authService } from './services/authService';
import { journalService } from './services/journalService';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import Editor from './components/Editor';
import Landing from './components/Landing';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>(AppView.LANDING);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<JournalEntry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEntries = async (userId: string) => {
    const userEntries = await journalService.getEntries(userId);
    setEntries(userEntries);
  };

  // Initialize Auth
  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        await fetchEntries(currentUser.id);
        setView(AppView.DASHBOARD);
      }
      setIsLoading(false);
    };
    checkUser();
  }, []);

  const handleLogin = async (u: User) => {
    setUser(u);
    await fetchEntries(u.id);
    setView(AppView.DASHBOARD);
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setEntries([]);
    setView(AppView.LANDING);
  };

  const handleCreateNew = () => {
    setCurrentEntry(null);
    setView(AppView.EDITOR);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    setCurrentEntry(entry);
    setView(AppView.EDITOR);
  };

  const handleSaveEntry = async (entry: JournalEntry) => {
    await journalService.saveEntry(entry);
    if (user) await fetchEntries(user.id);
    setView(AppView.DASHBOARD);
  };

  const handleDeleteEntry = async (id: string) => {
    await journalService.deleteEntry(id);
    if (user) await fetchEntries(user.id);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFCFB]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-indigo-200 rounded-full mb-4"></div>
          <p className="text-slate-400 font-medium">Connecting to Aura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {view === AppView.LANDING && (
        <Landing onAuth={() => setView(AppView.AUTH)} />
      )}

      {view === AppView.AUTH && (
        <AuthForm 
          onSuccess={handleLogin} 
          onCancel={() => setView(AppView.LANDING)} 
        />
      )}

      {user && view === AppView.DASHBOARD && (
        <Dashboard 
          user={user} 
          entries={entries} 
          onLogout={handleLogout}
          onNew={handleCreateNew}
          onEdit={handleEditEntry}
          onDelete={handleDeleteEntry}
        />
      )}

      {user && view === AppView.EDITOR && (
        <Editor 
          userId={user.id}
          existingEntry={currentEntry}
          onSave={handleSaveEntry}
          onCancel={() => setView(AppView.DASHBOARD)}
        />
      )}
    </div>
  );
};

export default App;
