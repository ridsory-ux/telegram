"use client";

import { useState } from "react";
import type { Chat, Message } from "@/types/chat";
import { ChatList } from "@/components/ChatList";
import { ChatArea } from "@/components/ChatArea";
import { EmptyState } from "@/components/EmptyState";

const defaultAvatars = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop&crop=face",
];

const initialChats: Chat[] = [
  {
    id: "chat-1",
    name: "Alex Johnson",
    avatar: defaultAvatars[0],
    lastMessage: "Hey, are you coming tonight?",
    lastMessageTime: "12:45",
    unreadCount: 2,
    isOnline: true,
    messages: [
      { id: "msg-1", text: "Hey! How's it going?", time: "12:30", isOutgoing: false, isRead: true },
      { id: "msg-2", text: "Pretty good! Just working on some stuff", time: "12:32", isOutgoing: true, isRead: true },
      { id: "msg-3", text: "Nice! We're having a party tonight", time: "12:40", isOutgoing: false, isRead: true },
      { id: "msg-4", text: "Hey, are you coming tonight?", time: "12:45", isOutgoing: false, isRead: false },
    ],
  },
  {
    id: "chat-2",
    name: "Sarah Miller",
    avatar: defaultAvatars[1],
    lastMessage: "Thanks for the help!",
    lastMessageTime: "11:20",
    unreadCount: 0,
    isOnline: false,
    messages: [
      { id: "msg-1", text: "Can you help me with something?", time: "11:00", isOutgoing: false, isRead: true },
      { id: "msg-2", text: "Sure, what do you need?", time: "11:05", isOutgoing: true, isRead: true },
      { id: "msg-3", text: "I need help with the project", time: "11:10", isOutgoing: false, isRead: true },
      { id: "msg-4", text: "I'll send you the files", time: "11:15", isOutgoing: true, isRead: true },
      { id: "msg-5", text: "Thanks for the help!", time: "11:20", isOutgoing: false, isRead: true },
    ],
  },
  {
    id: "chat-3",
    name: "Mike Chen",
    avatar: defaultAvatars[2],
    lastMessage: "See you tomorrow!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    isOnline: true,
    messages: [
      { id: "msg-1", text: "Yo!", time: "18:00", isOutgoing: false, isRead: true },
      { id: "msg-2", text: "What's up?", time: "18:05", isOutgoing: true, isRead: true },
      { id: "msg-3", text: "Wanna grab lunch tomorrow?", time: "18:10", isOutgoing: false, isRead: true },
      { id: "msg-4", text: "Sounds good!", time: "18:15", isOutgoing: true, isRead: true },
      { id: "msg-5", text: "See you tomorrow!", time: "18:20", isOutgoing: false, isRead: true },
    ],
  },
];

export default function Home() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeChat = chats.find((chat) => chat.id === activeChatId);

  const handleUpdateChat = (chatId: string, updates: Partial<Chat>) => {
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, ...updates } : chat))
    );
  };

  const handleAddChat = () => {
    const randomAvatar = defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)];
    const newChat: Chat = {
      id: `chat-${Date.now()}`,
      name: "New Contact",
      avatar: randomAvatar,
      lastMessage: "Start a conversation...",
      lastMessageTime: "Now",
      unreadCount: 0,
      isOnline: Math.random() > 0.5,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const handleAddMessage = (chatId: string, message: Message) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, message],
            lastMessage: message.text,
            lastMessageTime: message.time,
          };
        }
        return chat;
      })
    );
  };

  const handleUpdateMessage = (
    chatId: string,
    messageId: string,
    updates: Partial<Message>
  ) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.map((msg) =>
            msg.id === messageId ? { ...msg, ...updates } : msg
          );
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: lastMessage?.text || chat.lastMessage,
            lastMessageTime: lastMessage?.time || chat.lastMessageTime,
          };
        }
        return chat;
      })
    );
  };

  const handleDeleteMessage = (chatId: string, messageId: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = chat.messages.filter((msg) => msg.id !== messageId);
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          return {
            ...chat,
            messages: updatedMessages,
            lastMessage: lastMessage?.text || "No messages",
            lastMessageTime: lastMessage?.time || "",
          };
        }
        return chat;
      })
    );
  };

  return (
    <main className="h-screen flex overflow-hidden bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 shrink-0 h-full">
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={setActiveChatId}
          onUpdateChat={handleUpdateChat}
          onAddChat={handleAddChat}
          onDeleteChat={handleDeleteChat}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-1 h-full">
        {activeChat ? (
          <ChatArea
            chat={activeChat}
            onUpdateChat={handleUpdateChat}
            onAddMessage={handleAddMessage}
            onUpdateMessage={handleUpdateMessage}
            onDeleteMessage={handleDeleteMessage}
          />
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Meme Watermark */}
     
    </main>
  );
}
