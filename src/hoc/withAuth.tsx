import { useUser } from '@/contexts/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    const ComponentWithAuth = (props: P) => {
        const {user, isLoading} = useUser();
        const router = useRouter();

        useEffect(() => {
          // useEffectはクリーンアップ関数を返すため、Promiseを戻り値にできない
          // async/awaitを使う場合は、useEffect内でasync関数を定義する必要がある
          // そのため、async関数を定義して呼び出す
          const redirect = async () => {
            if (!isLoading && user === null) {
              await router.push('/login');
            }
          };

          redirect();
        }, [user, isLoading]);

        // ログインチェック中やリダイレクト中は何も表示しない
        if (isLoading) {
            return (
              <div className="text-center mt-10 text-gray-500">
                <p className="text-center mt-10 text-gray-500">認証確認中...</p>
                <p className="mt-2">
                  自動で遷移しない場合は
                  <Link href="/login" className="text-yellow-500 hover:underline ml-1">
                    こちらをクリック
                  </Link>
                </p>
              </div>
            );
        }
        if (user === null) {
            return (
              <div className="text-center mt-10 text-gray-500">
                <p className="text-center mt-10 text-gray-500">ログインしてください</p>
                <p className="mt-2">
                  自動で遷移しない場合は
                  <Link href="/login" className="text-yellow-500 hover:underline ml-1">
                    こちらをクリック
                  </Link>
                </p>
              </div>
            );
            
        }

        return <WrappedComponent {...props}/>;
    }

    return ComponentWithAuth;
};