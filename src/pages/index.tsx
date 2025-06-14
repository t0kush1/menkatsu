import Layout from '@/components/Layout';
import Ramencard from '@/components/Ramencard';
import { withAuth } from '@/hoc/withAuth';
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
    imageUrl: recordFromDB.image_url,
  }
}

export const Home = () => {
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
        <h2 className="mt-8 mb-8 text-3xl text-center font-bold text-white bg-yellow-400 rounded-md px-4 py-2 shadow-md">
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

export default withAuth(Home);
