/**
 * DBから取得したデータをキャメルケースに変換する際に使用
 */
export type UserProfile = {
  id: string;
  userId: string;
  nickname: string;
} | null;

/**
 * DBから取得する際のDTO（カラム名に合わせてスネークケース指定）
 */
export type UserProfileGetDB = {
  id: string;
  user_id: string;
  nickname: string;
} | null;
