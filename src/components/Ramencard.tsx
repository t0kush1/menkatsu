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
      <h3>{record.shopName}</h3>
      <p>訪問日: {record.visitDate}</p>
      <p>評価: {record.rating}</p>
      <p>感想: {record.comment}</p>
    </li>
  );
}
