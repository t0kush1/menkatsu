'use client';

import { useState } from 'react';
import { StarRating } from '@/components/StarRating';

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

  // ラーメンの種類が「その他」の場合は、カスタムラーメンの種類を表示
  const isOtherSelected = ramenType === 'その他';

  const handleSubmit = (e: React.FormEvent) => {
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
    });

    setShopName('');
    setVisitDate('');
    setRamenType('');
    setPrice('');
    setTasteRating(3);
    setCostRating(3);
    setServiceRating(3);
    setOverallRating(3);
    setComment('');
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">🍜 ラーメン記録を投稿</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 店名 */}
        <div>
          <label className="block font-medium mb-1">店名</label>
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
          <label className="block font-medium mb-1">訪問日</label>
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
          <label className="block font-medium mb-1">種類</label>
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
            <label className="block font-medium mb-1">種類（自由入力）</label>
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
          <label className="block font-medium mb-1">価格</label>
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
              <label className="block font-medium mb-1">{label}</label>
              <StarRating value={state} onChange={setter} />
            </div>
          ))}
        </div>

        <div>
          <label className="block font-medium mb-1">コメント</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md transition-colors"
        >
          記録する
        </button>
      </form>
    </div>
  );
}
