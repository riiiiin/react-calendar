// サインアップ
export interface SignUpParams {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}

// サインイン
export interface SignInParams {
  email: string
  password: string
}

// ユーザー
export interface User {
  id: number
  uid: string
  provider: string
  email: string
  name: string
  nickname?: string
  image?: string
  allowPasswordChange: boolean
  created_at: Date
  updated_at: Date
}

// イベント
export interface Event {
  body: string
  date: string
  name: string
  title: string
  user_id: number
}

// イベント編集
export interface editEvent {
  id: number
  body: string
  date: string
  name: string
  title: string
  user_id: number
}

// フォロワー追加
export interface Follow {
  user_id: number
  follow_name: string
  follow_mail: string
  isApprove: string
}

// 承認更新
export interface updateFollow {
  user_id: number
  follower_id: number
  isApprove: string
}