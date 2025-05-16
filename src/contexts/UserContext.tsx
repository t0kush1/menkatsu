import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';

const UserContext = createContext<UserProfile>(null);
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile>(null);

  const fetchUser = async () => {
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setUserProfile(null);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, nickname')
      .eq('user_id', authData.user.id)
      .single();

    if (profileData && !profileError) {
      setUserProfile(profileData);
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    fetchUser(); // 初回取得

    // ログイン・ログアウト・再ログイン時に自動で再取得（イベントリスナーに似た形）
    const { data: subscription } = supabase.auth.onAuthStateChange(() => {
      fetchUser(); // ログイン・ログアウト時に再取得
    });

    return () => {
      subscription.subscription.unsubscribe(); // クリーンアップ
    };
  }, []);

  return <UserContext.Provider value={userProfile}>{children}</UserContext.Provider>;
};

