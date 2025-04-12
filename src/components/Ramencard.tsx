import { StarRatingView } from './StarRatingView';
import Link  from 'next/link';

type RamenRecord = {
  id: number;
  shopName: string;
  visitDate: string;
  rating: number; // 1~5
  comment: string;
};

type RamenRecordProps = {
  record: RamenRecord;
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
        <p>訪問日: {record.visitDate}</p>
        <p>
          総合評価: <StarRatingView value={record.rating} />
        </p>
        <p>感想: {record.comment}</p>
      </Link>
    </li>
  );
}
