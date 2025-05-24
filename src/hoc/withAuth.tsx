import { useUser } from '@/contexts/UserContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ComponentWithAuth = (props: P) => {
        const {user, isLoading} = useUser();
        const router = useRouter();

        useEffect(() => {
            if (!isLoading && user === null) {
                router.push('/login');
            }
        }, [user, isLoading]);

        // ログインチェック中やリダイレクト中は何も表示しない
        if (isLoading) return null;
        if (user === null) return null;

        return <WrappedComponent {...props}/>;
    }

    return ComponentWithAuth;
};