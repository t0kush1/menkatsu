import Layout from '@/components/Layout';
import Ramencard from '@/components/Ramencard';
import { supabase } from '@/lib/supabase';
import { ShortRamenPostDB, ShortRamenRecord } from '@/types/ramen-record';
import { useEffect, useState } from 'react';


function camelCaseRecord(recordFromDB: ShortRamenPostDB): ShortRamenRecord {
  return {
    id: recordFromDB.id,
    shopName: recordFromDB.shop_name,
    visitDate: recordFromDB.visit_date,
    rating: recordFromDB.overall_rating,
    comment: recordFromDB.comment,
  }
}

export default function Home() {
  const [posts, setPosts] = useState<ShortRamenRecord[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase.from('ramen_posts').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error);
      } else {
        setPosts(data);
      }

      if (error) {
        console.error(error);
      } else {
        const convertData = data?.map(camelCaseRecord) ?? [];

        setPosts(convertData || []);
      }
    };

    fetchPosts();
  }, []);


  return (
    <Layout>
      <main style={{ padding: '2rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        {/* <h1 style={{ display: 'flex', alignItems: 'center', fontSize: '2rem', gap: '1rem' }}>
          <img src="/menkatsulogo.png" alt="menkatsu logo" style={{ height: '70px' }} />
        </h1> */}
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
          {posts.map((record) => (
            <Ramencard key={record.id} record={record} />
            // keyはmapの時など、要素を一意に識別するためのIDを付与するのが一般的
            // Reactで .map() を使うたびに key を付けるのは“お作法”みたいなもので、React使いの基本中の基本スキル
            // ちなみにindexの付与は順番が変わるとバグが起きたりするので非推奨
          ))}
        </ul>
      </main>
    </Layout>
  );
}
