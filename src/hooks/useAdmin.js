import { useEffect, useState } from "react";

const getSupabase = () => import("../utils/supabaseClient").then(m => m.supabase);

export default function useAdmin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    let mounted = true;
    let subscription = null;

    getSupabase().then(supabase => {
      if (!mounted) return;

      // Check whether a Supabase Auth session already exists
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (mounted) {
          setIsAdminLoggedIn(!!session);
        }
      });

      // Keep React state synchronized with Supabase Auth
      const {
        data: { subscription: sub },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        if (mounted) {
          setIsAdminLoggedIn(!!session);
        }
      });
      subscription = sub;
    }).catch(err => {
      console.warn("Supabase auth init error:", err);
    });

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email, password) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    return data;
  };

  const logout = async () => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }
  };

  return {
    isAdminLoggedIn,
    setIsAdminLoggedIn,
    login,
    logout,
  };
}