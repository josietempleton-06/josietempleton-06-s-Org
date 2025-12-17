
import { JournalEntry } from '../types.ts';
import { supabase } from '../supabaseClient.ts';

export const journalService = {
  getEntries: async (userId: string): Promise<JournalEntry[]> => {
    const { data, error } = await supabase
      .from('journal_entries')
      .select('id, user_id, title, content, date, last_modified, mood, ai_summary')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching entries:', error);
      throw new Error(`Could not fetch journal entries: ${error.message}`);
    }

    return (data || []).map(row => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      date: row.date,
      lastModified: row.last_modified,
      mood: row.mood,
      aiSummary: row.ai_summary,
    }));
  },

  saveEntry: async (entry: JournalEntry): Promise<JournalEntry> => {
    const row = {
      id: entry.id,
      user_id: entry.userId,
      title: entry.title,
      content: entry.content,
      date: entry.date,
      last_modified: entry.lastModified,
      mood: entry.mood,
      ai_summary: entry.aiSummary,
    };

    const { error } = await supabase
      .from('journal_entries')
      .upsert(row);

    if (error) {
      console.error('Error saving entry:', error);
      throw new Error(`Failed to save entry: ${error.message}`);
    }
    
    return entry;
  },

  deleteEntry: async (entryId: string): Promise<void> => {
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', entryId);

    if (error) {
      console.error('Error deleting entry:', error);
      throw new Error(`Failed to delete entry: ${error.message}`);
    }
  }
};
