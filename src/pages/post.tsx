'use client';

import { useState } from 'react';
import { StarRatingInput } from '@/components/StarRatingInput';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';

/**
 * @summary 本日の日付を取得する関数
 * @returns YYYY-MM-DD形式の今日の日付
 */
const getTodayDate = (): string => {
  const today = new Date();
  const year = String(today.getFullYear());
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function Post() {
  // 店名
  const [shopName, setShopName] = useState('');
  // 訪問日
  const [visitDate, setVisitDate] = useState(getTodayDate());
  // ラーメンの種類
  const [ramenType, setRamenType] = useState('醤油');
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
  // 写真ファイル
  const [file, setFile] = useState<File | null>(null);
  // プレビュー表示用のURL
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ラーメンの種類が「その他」の場合は、カスタムラーメンの種類を表示
  const isOtherSelected = ramenType === 'その他';

  const router = useRouter();

  // 保存ボタン押下時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({
      shopName,
      visitDate,
      ramenType: isOtherSelected ? customRamenType : ramenType,
      price,
      tasteRating,
      costRating,
      serviceRating,
      overallRating,
      comment,
      file,
    });

    // Supabaseからユーザ情報の取得処理
    // ユーザ機能未開発につきコメントアウト
    // const {
    //   data: { user },
    //   error: userError,
    // } = await supabase.auth.getUser();

    // if (!user || userError) {
    //   alert('ログインが必要です');
    //   return;
    // }

    let imageUrl: string | null = null;

    try {
      if (file) {
        const options = {
          maxSizeMB: 0.3,
          maxWidthOrHeight: 1024,
          useWebWorker: true,
        }

        const compressedFile = await (await import('browser-image-compression')).default(file, options);
        const fileName = `${Date.now()}_${compressedFile.name}`;

        const { error: uploadError } = await supabase.storage
          .from('ramen-images')  // あなたが作ったバケット名
          .upload(fileName, compressedFile);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const { data: publicData } = supabase.storage
          .from('ramen-images')
          .getPublicUrl(fileName);

        imageUrl = publicData.publicUrl;
      }
    } catch (err) {
      console.error('画像アップロードエラー:', err);
      alert('画像のアップロードに失敗しました');
      return;
    }


    const { error } = await supabase.from('ramen_posts').insert([
      {
        user_id: '00000000-0000-0000-0000-000000000000', // ユーザ機能未開発につき仮のUUIDを使用
        shop_name: shopName,
        visit_date: visitDate,
        ramen_type: isOtherSelected ? customRamenType : ramenType,
        price: Number(price),
        taste_rating: tasteRating,
        cost_rating: costRating,
        service_rating: serviceRating,
        overall_rating: overallRating,
        comment,
        image_url: imageUrl,
      },
    ]);

    if (error) {
      console.error('Error inserting data:', error);
      alert('データの保存に失敗しました');
      return;
    } else {
      alert('投稿が完了しました');
      router.push('/');
    }

    setShopName('');
    setVisitDate('');
    setRamenType('');
    setPrice('');
    setTasteRating(3);
    setCostRating(3);
    setServiceRating(3);
    setOverallRating(3);
    setComment('');
    setFile(null);
  };

  const handleTop = () => {
    router.push('/');
  };

  // 画像のプレビュー表示を行う
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // ブラウザで表示できるURLの生成
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  }


  return (
    <Layout>
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 border-b-2 border-yellow-400 pb-2">
          🍜 ラーメン記録を投稿
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 店名 */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">店名</label>
            <input
              type="text"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* 訪問日 */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">訪問日</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              required
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

          {/* コメント */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">コメント</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            ></textarea>
          </div>

          {/* 写真（任意） */}
          <div>
            <label className="block font-medium text-gray-600 mb-1">写真（任意）</label>
            <div className="bg-red-50 border border-red-300 text-red-700 text-sm rounded-md p-3 mb-4">
              <ul className="list-disc list-inside space-y-1">
                <li>写真は1枚のみ投稿可能です</li>
                <li>投稿後、写真の変更はできません</li>
              </ul>
            </div>
            <p></p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                  handleFileChange(e);
                }
              }}
            />
            {previewUrl && (
              <div className="mt-6 pt-4 border-t text-sm text-gray-700">
                <img
                  src={previewUrl}
                  alt="プレビュー"
                  className="w-full h-auto rounded-md shadow-md"
                />
              </div>
            )}
          </div>

          {/* 投稿ボタン */}

          <div className="flex justify-center gap-4 mt-8">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors"
            >
              記録する
            </button>
            <button
              onClick={handleTop}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg"
            >
              一覧に戻る
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
