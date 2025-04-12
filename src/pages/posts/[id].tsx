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
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md space-y-4">
        <h2 className="text-2xl font-bold text-center">🍜 {record.shopName}</h2>
        {/* <p>
          <strong>店名：</strong>
          {record.shopName}
        </p> */}
        <p>
          <strong>訪問日：</strong>
          {record.visitDate}
        </p>
        <p>
          <strong>種類：</strong>
          {record.ramenType}
        </p>
        <p>
          <strong>価格：</strong>
          {record.price} 円
        </p>
        <p>
          <strong>味：</strong>
          <StarRatingView value={record.tasteRating}/>
        </p>
        <p>
          <strong>価格：</strong>
          <StarRatingView value={record.costRating}/>
        </p>
        <p>
          <strong>接客：</strong>
          <StarRatingView value={record.serviceRating}/>
        </p>
        <p>
          <strong>総合評価：</strong>
          <StarRatingView value={record.overallRating}/>
        </p>
        <p>
          <strong>コメント：</strong>
          {record.comment}
        </p>
      </div>
    );
}