import { JSX } from 'react';

type StarRatingProps = {
  value: number; // 現在の評価（1〜5）
  onChange: (val: number) => void; // 星がクリックされたときの処理
};

/**
 * @summary 星評価コンポーネント
 * @description 星をクリックして評価を選択するコンポーネント（1~5まで）
 * @param value 現在の評価（1〜5）
 * @param onChange 星がクリックされたときの処理
 */
export const StarRating = ({ value, onChange }: StarRatingProps): JSX.Element => {
  return (
    <div className="flex space-x-1">
        {/* 1〜5までの星ボタンを作成していく */}
        {/* 各ボタンに1~5までのvalueが割り振られ、選択されると黄色、そうでなければ灰色 */}
        {/* onClickでonChangeを呼び出す（ここではsetterを渡す想定） */}
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`text-2xl focus:outline-none ${
            n <= value ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
    </div>
  );
};
