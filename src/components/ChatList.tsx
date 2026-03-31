"use client";

import { useState } from "react";
import type { Chat } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, Edit2, Check, X, ImageIcon, Trash2 } from "lucide-react";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void;
  onAddChat: () => void;
  onDeleteChat: (chatId: string) => void;
}

export function ChatList({
  chats,
  activeChatId,
  onSelectChat,
  onUpdateChat,
  onAddChat,
  onDeleteChat,
}: ChatListProps) {
  const [editingChatId, setEditingChatId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLastMessage, setEditLastMessage] = useState("");

  const handleStartEdit = (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditName(chat.name);
    setEditLastMessage(chat.lastMessage);
  };

  const handleSaveEdit = (chatId: string) => {
    onUpdateChat(chatId, {
      name: editName,
      lastMessage: editLastMessage,
    });
    setEditingChatId(null);
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
  };

  const handleAvatarChange = (chatId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateChat(chatId, { avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleUnread = (chatId: string, currentCount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateChat(chatId, {
      unreadCount: currentCount > 0 ? 0 : 1
    });
  };

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          Telegram
        </h1>
        <Button
          size="sm"
          variant="ghost"
          onClick={onAddChat}
          className="h-8 w-8 p-0 hover:bg-primary/10"
        >
          <Plus className="h-5 w-5 text-primary" />
        </Button>
      </div>

      {/* Search */}
      <div className="p-3">
        <Input
          placeholder="Search..."
          className="h-9 bg-muted/50 border-0 focus-visible:ring-1"
        />
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 scrollbar-thin">
        <div className="px-2 pb-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={`relative group flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 mb-1 ${
                activeChatId === chat.id
                  ? "bg-primary/10 shadow-sm"
                  : "hover:bg-muted/50"
              }`}
            >
              {/* Avatar with edit option */}
              <Popover>
                <PopoverTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <div className="relative cursor-pointer group/avatar">
                    <Avatar className="h-12 w-12 ring-2 ring-background shadow-md">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-primary/80 to-emerald-400 text-white font-semibold">
                        {chat.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-background" />
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <label className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
                    <ImageIcon className="h-4 w-4" />
                    <span className="text-sm">Change Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleAvatarChange(chat.id, e)}
                    />
                  </label>
                </PopoverContent>
              </Popover>

              {/* Chat Info */}
              {editingChatId === chat.id ? (
                <div className="flex-1 space-y-2" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                  <Input
                    value={editName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditName(e.target.value)}
                    className="h-7 text-sm"
                    placeholder="Name"
                  />
                  <Input
                    value={editLastMessage}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditLastMessage(e.target.value)}
                    className="h-7 text-sm"
                    placeholder="Last message"
                  />
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() => handleSaveEdit(chat.id)}
                    >
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm truncate">{chat.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {chat.lastMessageTime}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground truncate mt-0.5">
                    {chat.lastMessage}
                  </p>
                </div>
              )}

              {/* Unread badge & actions */}
              {editingChatId !== chat.id && (
                <div className="flex flex-col items-end gap-1">
                  <div
                    onClick={(e) => toggleUnread(chat.id, chat.unreadCount, e)}
                    className={`min-w-[20px] h-5 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer transition-all ${
                      chat.unreadCount > 0
                        ? "bg-primary text-white px-1.5"
                        : "bg-muted text-muted-foreground px-1.5 opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {chat.unreadCount > 0 ? chat.unreadCount : "+"}
                  </div>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={(e: React.MouseEvent) => handleStartEdit(chat, e)}
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:text-red-500"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
