'use client'; // App Routerの場合のみ必要（Pages Routerなら削除OK）

import { useState } from 'react';
import { useRouter } from 'next/router'; // App Routerの場合は `useRouter` ではなく `usePathname` などに置換
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMessage('エラーメッセージセット');
      setLoading(false);
      return;
    }

    // 成功時→トップページへ遷移
    setLoading(false);
    router.push('/');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">ログイン</h2>

        <form onSubmit={handleLogin} className="space-y-4">
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
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">
              ログインに失敗しました。<br />
              メールアドレス、またはパスワードを確認してください。
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>

          {/* 🔽 ここに追加 */}
          <div className="text-right text-sm mt-2">
            <Link href="/signup" className="text-blue-500 hover:underline text-base">
              ユーザー登録はこちら
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
