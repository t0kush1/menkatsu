import { JSX } from 'react'


/**
 * @summary 星評価viewコンポーネント
 * @description ラーメン詳細にて入力された星数で表示を行うコンポーネント（1~5まで）
 * @param value 現在の評価（1〜5）
 */
export const StarRatingView = ({ value }: { value: number }): JSX.Element => {
    return (
        <span>
            {/* 1からvalueまでが黄色、そうでなければ灰色 */}
            {[1, 2, 3, 4, 5].map((n) => (
                <span
                    key={n}
                    className={`text-2xl focus:outline-none ${
                        n <= value ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                >
                    ★
                </span>
            ))}
        </span>
    )
}