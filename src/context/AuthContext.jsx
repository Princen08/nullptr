import { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isMocked } from '../lib/supabase';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isMocked) {
      const mockUser = JSON.parse(localStorage.getItem('nullptr_user'));
      setUser(mockUser);
      setLoading(false);
      return;
    }

    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    if (isMocked) {
      const mockUser = {
        id: 'mock-id-123',
        email: 'engineer@example.com',
        user_metadata: {
          full_name: 'Dev Engineer',
          avatar_url: 'https://ui-avatars.com/api/?name=Dev+Engineer'
        }
      };
      setUser(mockUser);
      localStorage.setItem('nullptr_user', JSON.stringify(mockUser));
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    return { error };
  };

  const logout = async () => {
    if (isMocked) {
      setUser(null);
      localStorage.removeItem('nullptr_user');
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
