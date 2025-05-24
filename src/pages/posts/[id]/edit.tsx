import Layout from '@/components/Layout';
import { StarRatingInput } from '@/components/StarRatingInput';
import { withAuth } from '@/hoc/withAuth';
import { supabase } from '@/lib/supabase';
import { FullRamenRecord, FullRamenPostDB } from '@/types/ramen-record';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

function camelCaseRecord(recordFromDB: FullRamenPostDB): FullRamenRecord {
  return {
    id: recordFromDB.id,
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

export const EditPost = () => {
  const router = useRouter();
  const { id } = router.query;
  const [record, SetRecord] = useState<FullRamenRecord | null>(null);

  // 入力用のstateを用意
  // 店名
  const [shopName, setShopName] = useState('');
  // 訪問日
  const [visitDate, setVisitDate] = useState('');
  // ラーメンの種類
  const [ramenType, setRamenType] = useState('');
  // ラーメンの種類（その他）
  const [customRamenType, setCustomRamenType] = useState('');
  // 価格
  const [price, setPrice] = useState('');
  // 写真は後々
  // 評価（味）
  const [tasteRating, setTasteRating] = useState(3);
  // 評価（コスパ）
  const [costRating, setCostRating] = useState(3);
  // 評価（接客）
  const [serviceRating, setServiceRating] = useState(3);
  // 評価（総合評価）
  const [overallRating, setOverallRating] = useState(3);
  // コメント
  const [comment, setComment] = useState('');
  // 画像
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // 画像削除モーダルの表示状態
  const [showImageDeleteModal, setShowImageDeleteModal] = useState(false);

  // ラーメンの種類が「その他」の場合は、カスタムラーメンの種類を表示
  const isOtherSelected = ramenType === 'その他';

  // 画面を開いた際、データ取得
  useEffect(() => {
    if (!id) {
      return;
    }

    let isMounted = true; // ⭐ マウントフラグを立てる
    const fetchPost = async () => {
      const { data, error } = await supabase.from('ramen_posts').select('*').eq('id', id).single();

      if (!isMounted) return; // ⭐ アンマウントされたら何もせず終了

      if (error) {
        console.error('Error fetching post:', error);
      } else {
        const convertedData = camelCaseRecord(data);
        SetRecord(convertedData);
        // フォームに反映させるために全てのstateを初期化
        setShopName(convertedData.shopName);
        setVisitDate(convertedData.visitDate);
        // 種類に関してはデフォルト値でない場合はその他での入力扱いとする
        if (
          !['醤油', '味噌', '豚骨', '塩', '家系', '二郎系', '混ぜそば', '油そば'].includes(
            convertedData.ramenType,
          )
        ) {
          setRamenType('その他');
          setCustomRamenType(convertedData.ramenType);
        } else {
          setRamenType(convertedData.ramenType);
        }
        setPrice(convertedData.price.toString());
        setTasteRating(convertedData.tasteRating);
        setCostRating(convertedData.costRating);
        setServiceRating(convertedData.serviceRating);
        setOverallRating(convertedData.overallRating);
        setComment(convertedData.comment);
        setImageUrl(convertedData.imageUrl);
      }
    };

    // データを取得
    fetchPost();

    return () => {
      isMounted = false; // クリーンアップでフラグを落とす
    };
  }, [id]);

  // 「保存」押下時の処理
  const handleSave = async () => {
    if (!id) {
      return;
    }

    const { error } = await supabase
      .from('ramen_posts')
      .update({
        shop_name: shopName,
        visit_date: visitDate,
        ramen_type: isOtherSelected ? customRamenType : ramenType,
        price: Number(price),
        taste_rating: tasteRating,
        cost_rating: costRating,
        service_rating: serviceRating,
        overall_rating: overallRating,
        comment,
      })
      .eq('id', id);

    if (error) {
      console.error('更新エラー', error);
      toast.error('更新に失敗しました。');
    } else {
      console.log('更新成功');
      toast.success('更新に成功しました。');
      router.push(`/posts/${id}`);
    }
  };

  // 「戻る」押下時の処理
  const handlePostDetail = () => {
    if (!id) {
      return;
    }
    router.push(`/posts/${id}`);
  };

  // 「画像を削除」押下時の処理
  const handleImageDelete = async () => {
    if (!id) {
      return;
    }

    const filePath = imageUrl?.split('/').pop(); // ファイル名のみ抽出

    // supabaseのストレージから画像を削除
    const {error: storageDeleteError} = await supabase.storage
      .from('ramen-images')
      .remove([filePath!]);

    if (storageDeleteError) {
      console.error('ストレージ削除失敗:', storageDeleteError.message);
      toast.error('ストレージ削除に失敗しました');
      return;
    }

    // ストレージも削除
    const {error: updateError} = await supabase
      .from('ramen_posts')
      .update({ image_url: null })
      .eq('id', id);
    
    if (updateError) {
      console.error('DB更新失敗:', updateError.message);
      toast.error('DB更新に失敗しました');
      return;
    }

    toast.success('画像を削除しました');
    setImageUrl(null);

  }

  if (!record) {
    return <div>読み込み中...</div>;
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center mt-10 mb-6">ラーメン投稿編集</h1>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 border-b-2 border-yellow-400 pb-2">
          投稿の編集
        </h2>

        {/* 店名 */}
        <div style={{ marginBottom: '1rem' }}>
          <label className="block font-medium text-gray-600 mb-1">店名:</label>
          <input
            type="text"
            value={shopName}
            onChange={(e) => setShopName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* 訪問日 */}
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label className="block font-medium text-gray-600 mb-1">訪問日:</label>
          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* 種類 */}
        <div>
          <label className="block font-medium text-gray-600 mb-1">種類</label>
          <select
            value={ramenType}
            onChange={(e) => setRamenType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          >
            {['醤油', '味噌', '豚骨', '塩', '家系', '二郎系', '混ぜそば', '油そば', 'その他'].map(
              (n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ),
            )}
          </select>
        </div>

        {/* 種類（その他） */}
        {/* ラーメンの種類が「その他」の場合のみここを表示 */}
        {isOtherSelected && (
          <div className="mt-3">
            <label className="block font-medium text-gray-600 mb-1">種類（自由入力）</label>
            <input
              type="text"
              value={customRamenType}
              onChange={(e) => setCustomRamenType(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="例：鶏白湯、台湾まぜそば など"
              required
            />
          </div>
        )}

        {/* 価格 */}
        <div>
          <label className="block font-medium text-gray-600 mb-1">価格</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="例: 900"
            required
          />
        </div>

        {/* 評価 */}
        <div className="grid grid-cols-1 gap-4">
          {[
            { label: '味', state: tasteRating, setter: setTasteRating },
            { label: 'コスパ', state: costRating, setter: setCostRating },
            { label: '接客', state: serviceRating, setter: setServiceRating },
            { label: '総合評価', state: overallRating, setter: setOverallRating },
          ].map(({ label, state, setter }) => (
            <div key={label}>
              <label className="block font-medium text-gray-600 mb-1">{label}</label>
              <StarRatingInput value={state} onChange={setter} />
            </div>
          ))}
        </div>

        {/*　コメント */}
        <div style={{ marginBottom: '1rem' }}>
          <label className="block font-medium text-gray-600 mb-1">コメント</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          />
        </div>

        {/* 画像（削除のみ可能） */}
        {imageUrl && (
          <div className="mt-6 pt-4 border-t text-sm text-gray-700">
            <h3 className="text-lg font-medium text-gray-600 mb-2">画像</h3>
            <img
              src={imageUrl}
              alt="投稿されたラーメンの画像"
              className="w-full h-auto rounded-md shadow-md"
            />
            <button
              onClick={() => setShowImageDeleteModal(true)}
              className="mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              画像を削除
            </button>
          </div>
        )}

        {/* 画像削除モーダル */}
        {showImageDeleteModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowImageDeleteModal(false)}
          >
            <div
              className="bg-white p-6 rounded-xl shadow-xl w-80 text-center"
              onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないように
            >
              <p className="mb-4 text-gray-800 font-semibold">本当に画像を削除しますか？<br />
              ※この処理は取り消すことができません</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => {
                    setShowImageDeleteModal(false);
                    handleImageDelete(); // 実際の削除処理を呼び出す
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  削除する
                </button>
                <button
                  onClick={() => setShowImageDeleteModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  キャンセル
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            保存
          </button>

          <button
            onClick={handlePostDetail}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            戻る
          </button>
        </div>
      </div>
    </Layout>
  );
}

export default withAuth(EditPost);
