'use client'

import { StarRatingView } from '@/components/StarRatingView';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

type RamenRecord = {
    id : number;
    shopName: string;
    visitDate: string;
    ramenType: string;
    price: number;
    tasteRating: number;
    costRating: number;
    serviceRating: number;
    overallRating: number;
    comment: string;
}

export default function PostDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [record, setRecord] = useState<RamenRecord | null>(null);
    
    useEffect(() => {
        if (!id) {
            return
        }
        // APIからデータを取得する処理（今回はダミーデータを表示）
        const dummyData: RamenRecord = {
            id: Number(id),
            shopName: '麺屋玄洋',
            visitDate: '2023-10-01',
            ramenType: '塩',
            price: 800,
            tasteRating: 5,
            costRating: 4,
            serviceRating: 5,
            overallRating: 4,
            comment: '美味しかった！',
        };
        // 取得したデータをstateにセット
        setRecord(dummyData);
    }, [id]);

    if (!record) {
        return <div className="text-center">読み込み中...</div>;
    }

    return (
      <div className="max-w-xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-md border border-gray-200">
        {/* タイトル（店名） */}
        <h2 className="text-center text-2xl font-semibold mb-6 text-gray-800 border-b-2 border-yellow-400 pb-2">
          {record.shopName}
        </h2>

        {/* 内容リスト */}
        <dl className="space-y-4 text-sm text-gray-700">
          <div>
            <dt className="text-lg font-medium text-gray-600">訪問日</dt>
            <dd className="ml-4 mt-2">{record.visitDate}</dd>
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
      </div>
    );
}