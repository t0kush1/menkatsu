/**
 * トップ画面表示用の短縮データ
 */
export type ShortRamenRecord = {
  id: number;
  profiles: {
    nickname: string | null;
  };
  shopName: string;
  visitDate: string;
  rating: number; // 1~5
  comment: string;
  imageUrl: string | null;
};

/**
 * フルverのラーメン投稿データ
 */
export type FullRamenRecord = {
  id: number;
  userId: string | null;
  profiles: {
    nickname: string | null;
  };
  shopName: string;
  visitDate: string;
  ramenType: string;
  price: number;
  tasteRating: number;
  costRating: number;
  serviceRating: number;
  overallRating: number;
  comment: string;
  imageUrl: string | null;
};

/**
 * フルverのラーメン投稿データ取得時に使用するDTO
 */
export type FullRamenPostDB = {
  id: number;
  user_id: string;
  profiles: {
    nickname: string | null;
  };
  shop_name: string;
  visit_date: string;
  ramen_type: string;
  price: number;
  taste_rating: number;
  cost_rating: number;
  service_rating: number;
  overall_rating: number;
  comment: string;
  image_url: string | null;
};

/**
 * トップ画面用のラーメン投稿の短縮データ取得時に使用するDTO
 */
export type ShortRamenPostDB = {
  id: number;
  profiles: {
    nickname: string | null;
  };
  shop_name: string;
  visit_date: string;
  overall_rating: number;
  comment: string;
  image_url: string | null;
};

