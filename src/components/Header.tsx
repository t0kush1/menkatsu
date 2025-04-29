import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  // ハンバーガメニューの状態を管理するstate
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ハンバーガーメニュー押下時モーダルオープン
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  } 

  return (
    <header className="bg-yellow-400 p-4 shadow-md">
      <div className="flex items-center justify-between">
        {/* ロゴ画像（トップページへ遷移） */}
        <Link href="/" className="text-2xl font-bold text-white">
          <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
        </Link>

        {/* ハンバーガーアイコン（モバイル用） */}
        <div className="md:hidden">
          <button onClick={openModal} className="text-white focus:outline-none">
            {/* ハンバーガーアイコンを作成（線3本） */}
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white mb-1"></div>
            <div className="w-6 h-1 bg-white"></div>
          </button>
        </div>

        {/* PCサイズ時のメニュー */}
        <div className="hidden md:flex items-center space-x-4">
          <Link href="/post" className="text-white text-base font-semibold hover:underline">
            投稿する
          </Link>
          <button className="text-white text-base font-semibold hover:underline">ログアウト</button>
        </div>
      </div>

      {/* モーダル（ハンバーガー押したら出現） */}
      {isModalOpen && (
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
    </header>
  );
}
