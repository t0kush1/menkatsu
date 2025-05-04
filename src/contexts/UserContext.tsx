import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

type UserProfile = {
  id: string;
  nickname: string;
} | null;

const UserContext = createContext<UserProfile>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: {children: ReactNode }) => {
    const [userProfile, setUserProfile] = useState<UserProfile>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: authData, error: authError } = await supabase.auth.getUser();
            if (authError || !authData.user) return;

            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id, nickname')
                .eq('user_id', authData.user.id)
                .single();

            if (profileData && !profileError) {
                setUserProfile(profileData);
            }  
        };

        fetchUser();
    }, []);


    return (
        <UserContext.Provider value={userProfile}>
            {children}
        </UserContext.Provider>
    );
}
