export type StarRatingInputProps = {
  value: number; // 現在の評価（1〜5）
  onChange: (val: number) => void; // 星がクリックされたときの処理
};