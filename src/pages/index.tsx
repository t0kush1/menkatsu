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
      <h1 style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', gap: '1rem' }}>
        <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
      </h1>
      <h2
        style={{
          marginTop: '2rem',
          marginBottom: '2rem',
          fontSize: '1.8rem',
          fontWeight: 'bold',
          borderBottom: '2px solid #FFCC00', // 赤系の下線
          paddingBottom: '0.5rem',
          color: '#333',
        }}
      >
        ラーメン記録一覧
      </h2>

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
