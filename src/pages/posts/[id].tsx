'use client';

import Layout from '@/components/Layout';
import { StarRatingView } from '@/components/StarRatingView';
import { useUser } from '@/contexts/UserContext';
import { withAuth } from '@/hoc/withAuth';
import { supabase } from '@/lib/supabase';
import { FullRamenRecord, FullRamenPostDB } from '@/types/ramen-record';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export const PostDetail = () => {
  const router = useRouter();
  const { user } = useUser();
  const { id } = router.query;
  const [record, setRecord] = useState<FullRamenRecord | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // 依存関数はid
  // idが変わる度にデータを1件取得する
  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true; // コンポーネントのマウント状態を追跡

    // APIからデータを取得する処理
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('ramen_posts')
        .select(
          `
          id,
          user_id,
          shop_name,
          visit_date,
          ramen_type,
          price,
          taste_rating,
          cost_rating,
          service_rating,
          overall_rating,
          comment,
          image_url,
          profiles(
            nickname
          )
        `,
        )
        .eq('id', id)
        .single<FullRamenPostDB>();

      // コンポーネントがアンマウントされたときはsetしない
      if (isMounted) {
        if (error) {
          console.log(error);
        } else {
          // 取得したデータをstateにセット
          setRecord(camelCaseRecord(data));
          console.log('取得したレコード:', record);
        }
      }
    };

    // 呼出し
    fetchData();

    return () => {
      isMounted = false; // コンポーネントがアンマウントされたらフラグを更新
    };
  }, [id]);

  if (!record) {
    return <div className="text-center">読み込み中...</div>;
  }

  // 「編集」ボタン押下時の処理
  const handleEdit = () => {
    router.push(`/posts/${id}/edit`);
  };

  // 削除確認ダイアログの表示
  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  // 「削除」ボタン押下時の処理
  const handleDelete = async () => {
    // 削除確認ダイアログの表示
    // const comnfirmDelete = window.confirm('本当に削除してよろしいですか？');
    // if (!comnfirmDelete) {
    //   return;
    // }

    // 削除処理
    const { error } = await supabase.from('ramen_posts').delete().eq('id', id);

    if (error) {
      console.error('d削除エラー', error);
      toast.error('削除に失敗しました');
    } else {
      toast.success('削除しました');
      router.push('/');
    }
  };

  // 「一覧に戻る」ボタン押下時の処理
  const handleTop = () => {
    router.push('/');
  };

  return (
    <Layout>
      <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-md border border-gray-200">
          {/* タイトル（店名） */}
          <h2 className="text-center text-2xl font-semibold mb-6 text-gray-700 border-b-2 border-yellow-400 pb-2">
            {record.shopName}
          </h2>

          {/* 内容リスト */}
          <dl className="space-y-4 text-sm text-gray-700">
            <div>
              <dt className="text-lg font-medium text-gray-600">訪問日</dt>
              <dd className="ml-4 mt-2">{record.visitDate}</dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">投稿者</dt>
              <dd className="ml-4 mt-2">{record.profiles?.nickname} さん</dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">種類</dt>
              <dd className="ml-4 mt-2">{record.ramenType}</dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">価格</dt>
              <dd className="ml-4 mt-2">{record.price} 円</dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">味</dt>
              <dd className="ml-4 mt-2">
                <StarRatingView value={record.tasteRating} />
              </dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">コスパ</dt>
              <dd className="ml-4 mt-2">
                <StarRatingView value={record.costRating} />
              </dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">接客</dt>
              <dd className="ml-4 mt-2">
                <StarRatingView value={record.serviceRating} />
              </dd>
            </div>

            <div>
              <dt className="text-lg font-medium text-gray-600">総合評価</dt>
              <dd className="ml-4 mt-2">
                <StarRatingView value={record.overallRating} />
              </dd>
            </div>
          </dl>

          {/* コメント */}
          <div className="mt-6 pt-4 border-t text-sm text-gray-700">
            <h3 className="text-lg font-medium text-gray-600 mb-2">コメント</h3>
            <p className="leading-relaxed whitespace-pre-line ml-4 mt-2">
              {record.comment || '（コメントなし）'}
            </p>
          </div>

          {/* 画像 */}
          {record.imageUrl && (
            <div className="mt-6 pt-4 border-t text-sm text-gray-700">
              <h3 className="text-lg font-medium text-gray-600 mb-2">画像</h3>
              <img
                src={record.imageUrl}
                alt="ラーメンの画像"
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          )}

          {/* ボタン */}
          <div className="flex justify-center gap-4 mt-8">
            {record.userId === user?.userId && (
              // 投稿者本人のみ編集・削除ボタンを表示
              <>
                <button
                  onClick={handleEdit}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  編集
                </button>
                <button
                  onClick={openDeleteModal}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  削除
                </button>
              </>
            )}
            <button
              onClick={handleTop}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              一覧に戻る
            </button>
          </div>
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-xl shadow-xl w-80 text-center"
            onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないように
          >
            <p className="mb-4 text-gray-800 font-semibold">削除してよろしいですか？</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  handleDelete(); // 実際の削除処理を呼び出す
                }}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                削除
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              >
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

/**
 * DBから取得したレコードをオブジェクト用に変換
 * @param recordFromDB
 * @returns FullRamenRecord
 */
function camelCaseRecord(recordFromDB: FullRamenPostDB): FullRamenRecord {
  return {
    id: recordFromDB.id,
    userId: recordFromDB.user_id,
    profiles: recordFromDB.profiles,
    shopName: recordFromDB.shop_name,
    visitDate: recordFromDB.visit_date,
    ramenType: recordFromDB.ramen_type,
    price: recordFromDB.price,
    tasteRating: recordFromDB.taste_rating,
    costRating: recordFromDB.cost_rating,
    serviceRating: recordFromDB.service_rating,
    overallRating: recordFromDB.overall_rating,
    comment: recordFromDB.comment,
    imageUrl: recordFromDB.image_url,
  };
}

export default withAuth(PostDetail);
