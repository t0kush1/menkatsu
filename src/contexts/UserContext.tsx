import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { UserProfile } from '@/types/user';

type userContextType = {
  user: UserProfile,
  isLoading: boolean,
}

const UserContext = createContext<userContextType>({
  user: null,
  isLoading: true,
});

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = async () => {
    setIsLoading(true);
    const { data: authData, error: authError } = await supabase.auth.getUser();
    if (authError || !authData.user) {
      setUser(null);
      return;
    }

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id, nickname')
      .eq('user_id', authData.user.id)
      // 取得結果をUserProfile型にアサーション
      .single<UserProfile>();

    if (profileData && !profileError) {
      // userIdのみプロパティ名を変換してセット
      const normalizedProfile: UserProfile = {
        id: profileData.id,
        userId: profileData.user_id, // userIdをuser_idから変換
        nickname: profileData.nickname,
      }
      setUser(normalizedProfile);
    } else {
      setUser(null);
    }

    setIsLoading(false);
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

  return <UserContext.Provider value={{user, isLoading}}>{children}</UserContext.Provider>;
};

