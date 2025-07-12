import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export default function AuthCallBackPage() {
    const router = useRouter();

    useEffect(() => {
      // ここでセッションを読んでいるが、セッションを呼ぶとログインが完了したことになってしまう
      // 今回はあくまで認証のみでログイン画面に遷移し、自分でログインしてもらうのでコメントアウト
      // const {error} = await supabase.auth.getSession();
      toast.success('メール認証が完了しました！ログイン画面に遷移します。');

      // 3秒後にログイン画面に遷移
      const timer = setTimeout(() => {
        router.push('/login');
      }, 3000);

      return () => clearTimeout(timer);
    }, [router])

    return <div className="text-center mt-20">メール認証が完了しました。ログイン画面に移動します...</div>;
}