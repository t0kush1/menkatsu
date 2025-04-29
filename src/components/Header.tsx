import Link from 'next/link';

export default function Header() {
    return (
      <header className="bg-yellow-400 p-4 shadow-md">
        <div className="flex items-center justify-between">
          {/* ロゴ画像（トップページへ遷移） */}
          <Link href="/" className="text-2xl font-bold text-white">
            <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
          </Link>

          {/* 右側に遷移タグ */}
          <div className="flex items-center space-x-8 mr-4">
            <Link href="/post" className="text-white font-semibold hover:underline text-lg">
              投稿する
            </Link>
            <button className="text-white font-semibold hover:underline text-lg">ログアウト</button>
          </div>
        </div>
      </header>
    );
}