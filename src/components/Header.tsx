import Link from 'next/link';
import { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';

export default function Header() {
  // ハンバーガメニューの状態を管理するstate
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ログアウトモーダルの表示状態
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // ユーザ情報
  const {user} = useUser();

  // ルーターを使用してページ遷移を管理
  const router = useRouter();

  // ハンバーガーメニュー押下時モーダルオープン
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ログアウトボタン押下時モーダルオープン
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // const closeLogoutModal = () => {
  //   setIsLogoutModalOpen(false);
  // };

  // ログアウト処理
  const handleLogout = async () => {
    // Supabaseのauthを使用してログアウト処理を実行
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('ログアウトに失敗しました:', error.message);
    } else {
      // ログアウト成功時の処理（ログインページへリダイレクト）
      router.push('/login');
    }
  };

  return (
    <header className="bg-yellow-400 p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* ロゴ画像（ログイン時のみトップページへ遷移） */}
        {user ? (
          <Link href="/" className="text-2xl font-bold text-white">
            <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
          </Link>
        ) : (
          <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
        )}

        {/* ハンバーガーアイコン（モバイル用） */}
        {user && (
          <div className="md:hidden flex flex-col items-end text-right">
            {/* ユーザー名表示を上部に追加 */}
            {user && (
              <p className="text-white text-sm font-semibold pb-4">
                ようこそ、{user.nickname}さん！
              </p>
            )}
            <button onClick={openModal} className="text-white focus:outline-none">
              {/* ハンバーガーアイコンを作成（線3本） */}
              <div className="w-6 h-1 bg-white mb-1"></div>
              <div className="w-6 h-1 bg-white mb-1"></div>
              <div className="w-6 h-1 bg-white"></div>
            </button>
          </div>
        )}

        {/* PCサイズ時のメニュー */}
        <div className="hidden md:flex flex-col items-end space-y-1 text-right">
          {/* ユーザー名表示を上部に追加 */}
          {user && (
            <p className="text-white text-sm font-semibold pb-2">ようこそ、{user.nickname}さん！</p>
          )}

          <div className="flex space-x-4">
            {user && (
              <Link href="/post" className="text-white text-base font-semibold hover:underline">
                投稿する
              </Link>
            )}
            {user && (
              <button
                onClick={openLogoutModal}
                className="text-white text-base font-semibold hover:underline"
              >
                ログアウト
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ユーザ情報
      {user && <p className="text-white text-sm font-semibold">ようこそ、{user.nickname}さん！</p>} */}
      {/* モーダル（ハンバーガー押したら出現） */}
      {isModalOpen && user && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-8 w-72 flex flex-col items-center space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 閉じるボタン */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold focus:outline-none"
            >
              &times;
            </button>

            {/* メニュー項目 */}
            <Link
              href="/post"
              onClick={closeModal}
              className="w-full text-center bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              投稿する
            </Link>

            <button
              onClick={() => {
                /* ログアウト処理 */ closeModal();
              }}
              className="w-full text-center bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
            >
              ログアウト
            </button>
          </div>
        </div>
      )}

      {/* ログアウトモーダル */}
      {isLogoutModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsLogoutModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-80 text-center"
            onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないように
          >
            <p className="mb-4 text-gray-800 font-semibold">ログアウトしてよろしいですか？</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsLogoutModalOpen(false);
                  handleLogout(); // 実際の削除処理を呼び出す
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                ログアウト
              </button>
              <button
                onClick={() => setIsLogoutModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
