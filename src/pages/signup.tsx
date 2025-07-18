'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { toast } from 'react-toastify';

const validatedNickName = (nickName: string): boolean => {
  const trimmed = nickName.trim();
  const regix = /^[^\s!-/:-@[-`{-~]{1,10}$/;
  return regix.test(trimmed);
};

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickName, setNickName] = useState('');
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [passwordError, setPasswordError] = useState('');


  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedNickName = nickName.trim();

    // ニックネームのバリデーションチェック
    if (!validatedNickName(trimmedNickName)) {
      setNicknameError('ニックネームはスペース・記号なしで10文字以内で入力して下さい。');
      return;
    }

    // パスワードのバリデーションチェック
    if (password.length < 6) {
      setPasswordError('パスワードは6文字以上で入力して下さい。');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      }
    });

    if (error) {
      toast.error(`サインアップに失敗しました: ${error.message}`);
      console.error(error);
    } else {
      console.log('BASE_URL', process.env.NEXT_PUBLIC_BASE_URL);
      toast.warning('ユーザ登録はまだ完了していません！')
      toast.success('確認メールを送信しました。メールを確認して、認証用リンクを押下してください。')
    }

    // 問題なければユーザIDの取得
    const userId = data?.user?.id;

    // ユーザIDが取得できた場合はプロフィール作成
    if (userId) {
      const { error } = await supabase.from('profiles').insert([
        {
          user_id: userId,
          nickname: trimmedNickName,
        },
      ]);

      setLoading(false);

      if (error) {
        toast.error(`プロフィールの作成に失敗しました: ${error.message}`);
        console.error(error);
        setLoading(false);
        return;
      }

    } else {
      setLoading(false);
      toast.error('ユーザIDの取得に失敗しました。');
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ユーザー登録</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">ニックネーム</label>
            <input
              type="text"
              value={nickName}
              onChange={(e) => setNickName(e.target.value)}
              maxLength={10}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="例: ラーメン太郎"
            />
          </div>

          {nicknameError && (
            <p className="text-red-500 text-sm">
              {nicknameError}
            </p>
          )}

          <div>
            <label className="block font-medium text-gray-700 mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {passwordError && (
            <p className="text-red-500 text-sm">
              {passwordError}
            </p>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? '登録中...' : '登録する'}
          </button>
        </form>
      </div>
    </Layout>
  );
}
