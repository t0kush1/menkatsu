import Ramencard from '@/components/Ramencard';

type RamenRecord = {
  id: number;
  shopName: string;
  visitDate: string;
  rating: number; // 1~5
  comment: string;
};

const dummyRecord: RamenRecord[] = [
  {
    id: 1,
    shopName: '麺屋玄洋',
    visitDate: '2025-03-29',
    rating: 5,
    comment: '貝出汁スープが絶品！',
  },
  {
    id: 2,
    shopName: 'ラーメン二郎 亀戸店',
    visitDate: '2025-03-28',
    rating: 3,
    comment: 'ガッツリ最高！',
  },
];

export default function Home() {
  return (
    <main style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2rem' }}>🍜 menkatsu</h1>
      <h2 style={{ marginBottom: '1.5rem' }}>ラーメン記録一覧</h2>

      <ul style={{ padding: 0 }}>
        {dummyRecord.map((record) => (
          <Ramencard key={record.id} record={record} />
          // keyはmapの時など、要素を一意に識別するためのIDを付与するのが一般的
          // Reactで .map() を使うたびに key を付けるのは“お作法”みたいなもので、React使いの基本中の基本スキル
          // ちなみにindexの付与は順番が変わるとバグが起きたりするので非推奨
        ))}
      </ul>
    </main>
  );
}
