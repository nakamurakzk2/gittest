
// 事前相談チャット
export type PreTalkChat = {
  chatId: string
  userId: string
  townId: string
  businessId: string
  productId: string
  chatCount: number
  userUnreadCount: number
  adminUnreadCount: number
  status: ChatStatus
  updatedAt: number
}

// 購入後チャット
export type ProductChat = {
  chatId: string
  userId: string
  townId: string
  businessId: string
  productId: string
  tokenId: number
  chatCount: number
  userUnreadCount: number
  adminUnreadCount: number
  updatedAt: number
}

export type ChatItem = {
  chatItemId: string
  chatUserType: ChatUserType
  message: string
  images: string[]
  createdAt: number
  deletedAt: number | null
}

export type SimpleChat = {
  chatId: string
  unreadCount: number
  chatItems: ChatItem[]
}

export enum ChatStatus {
  OPEN = 'open',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

export enum ChatUserType {
  USER = 'user',
  ADMIN = 'admin',
}
