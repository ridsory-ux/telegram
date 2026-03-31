export interface Message {
  id: string;
  text: string;
  time: string;
  isOutgoing: boolean;
  isRead: boolean;
}

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
}
