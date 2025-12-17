
import { User } from '../types';
import { supabase } from '../supabaseClient';

export const authService = {
  register: async (email: string, name: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error('Registration failed');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name || name,
    };
  },

  login: async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Login failed');

    return {
      id: data.user.id,
      email: data.user.email!,
      name: data.user.user_metadata.full_name || '',
    };
  },

  logout: async () => {
    await supabase.auth.signOut();
  },

  getCurrentUser: async (): Promise<User | null> => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return null;
    
    return {
      id: session.user.id,
      email: session.user.email!,
      name: session.user.user_metadata.full_name || '',
    };
  }
};
