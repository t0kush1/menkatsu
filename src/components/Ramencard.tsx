import { ShortRamenRecord } from '@/types/ramen-record';
import { StarRatingView } from './StarRatingView';
import Link  from 'next/link';

type RamenRecordProps = {
  record: ShortRamenRecord;
};

export default function RamenCard({ record }: RamenRecordProps) {
  return (
    <li
      style={{
        marginBottom: '1.5rem',
        border: '1px solid #ccc',
        padding: '1rem',
        borderRadius: '8px',
      }}
    >
      <Link href={`/posts/${record.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <h3 className="text-2xl font-bold">{record.shopName}</h3>
        {/* 画像 */}
        {record.imageUrl && (
          <div className="mt-6 pt-4 border-t text-sm text-gray-700">
            <img
              src={record.imageUrl}
              alt="ラーメンの画像"
              className="w-72 h-48 h-auto rounded-md shadow-md"
            />
          </div>
        )}
        <p>訪問日: {record.visitDate}</p>
        <p>
          総合評価: <StarRatingView value={record.rating} />
        </p>
        <p>感想: {record.comment}</p>
      </Link>
    </li>
  );
}
