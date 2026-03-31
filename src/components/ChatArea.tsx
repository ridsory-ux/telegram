"use client";

import { useState, useRef, useEffect } from "react";
import type { Chat, Message } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Send,
  ImageIcon,
  Edit2,
  Check,
  X,
  Clock,
  MoreVertical,
  Trash2,
  CheckCheck,
  Phone,
  Video,
  Search,
} from "lucide-react";

interface ChatAreaProps {
  chat: Chat;
  onUpdateChat: (chatId: string, updates: Partial<Chat>) => void;
  onAddMessage: (chatId: string, message: Message) => void;
  onUpdateMessage: (chatId: string, messageId: string, updates: Partial<Message>) => void;
  onDeleteMessage: (chatId: string, messageId: string) => void;
}

export function ChatArea({
  chat,
  onUpdateChat,
  onAddMessage,
  onUpdateMessage,
  onDeleteMessage,
}: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("");
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editTime, setEditTime] = useState("");
  const [isOutgoing, setIsOutgoing] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat.messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;

    const message: Message = {
      id: `msg-${Date.now()}`,
      text: newMessage,
      time,
      isOutgoing,
      isRead: true,
    };

    onAddMessage(chat.id, message);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleStartEdit = (message: Message) => {
    setEditingMessageId(message.id);
    setEditText(message.text);
    setEditTime(message.time);
  };

  const handleSaveEdit = (messageId: string) => {
    onUpdateMessage(chat.id, messageId, {
      text: editText,
      time: editTime,
    });
    setEditingMessageId(null);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateChat(chat.id, { avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleMessageRead = (messageId: string, currentIsRead: boolean) => {
    onUpdateMessage(chat.id, messageId, { isRead: !currentIsRead });
  };

  const toggleMessageDirection = (messageId: string, currentIsOutgoing: boolean) => {
    onUpdateMessage(chat.id, messageId, { isOutgoing: !currentIsOutgoing });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <div className="flex items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer group">
                <Avatar className="h-10 w-10 ring-2 ring-background shadow-md">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-primary/80 to-emerald-400 text-white font-semibold">
                    {chat.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <ImageIcon className="h-4 w-4 text-white" />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <label className="flex items-center gap-2 p-2 hover:bg-muted rounded-lg cursor-pointer">
                <ImageIcon className="h-4 w-4" />
                <span className="text-sm">Change Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </PopoverContent>
          </Popover>
          <div>
            <h2 className="font-semibold text-sm">{chat.name}</h2>
            <p className="text-xs text-muted-foreground">
              {chat.isOnline ? "online" : "last seen recently"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Phone className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Video className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 chat-background scrollbar-thin" ref={scrollRef}>
        <div className="p-4 space-y-3">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isOutgoing ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`group relative max-w-[75%] ${
                  message.isOutgoing ? "chat-bubble-out" : "chat-bubble-in"
                } px-4 py-2 shadow-sm`}
              >
                {editingMessageId === message.id ? (
                  <div className="space-y-2 min-w-[200px]">
                    <Textarea
                      value={editText}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditText(e.target.value)}
                      className="min-h-[60px] text-sm resize-none bg-white/20 border-white/30"
                    />
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 opacity-70" />
                      <Input
                        value={editTime}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditTime(e.target.value)}
                        className="h-7 w-20 text-sm bg-white/20 border-white/30"
                        placeholder="00:00"
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => handleSaveEdit(message.id)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-white/20"
                        onClick={() => setEditingMessageId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                    <div
                      className={`flex items-center gap-1 mt-1 ${
                        message.isOutgoing ? "justify-end" : "justify-start"
                      }`}
                    >
                      <span className={`text-[10px] ${message.isOutgoing ? "text-white/70" : "text-muted-foreground"}`}>
                        {message.time}
                      </span>
                      {message.isOutgoing && (
                        <CheckCheck
                          className={`h-3.5 w-3.5 cursor-pointer ${
                            message.isRead ? "text-sky-300" : "text-white/50"
                          }`}
                          onClick={() => toggleMessageRead(message.id, message.isRead)}
                        />
                      )}
                    </div>

                    {/* Edit Actions */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`absolute -right-1 -top-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                            message.isOutgoing
                              ? "bg-white/20 hover:bg-white/30 text-white"
                              : "bg-black/10 hover:bg-black/20"
                          }`}
                        >
                          <MoreVertical className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-1.5" align="end">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8"
                          onClick={() => handleStartEdit(message)}
                        >
                          <Edit2 className="h-3 w-3" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8"
                          onClick={() => toggleMessageDirection(message.id, message.isOutgoing)}
                        >
                          <span className="text-xs">
                            {message.isOutgoing ? "Make Incoming" : "Make Outgoing"}
                          </span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-start gap-2 h-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                          onClick={() => onDeleteMessage(chat.id, message.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-3 bg-card border-t border-border">
        <div className="flex items-center gap-2">
          {/* Message Direction Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className={`h-9 w-9 rounded-full shrink-0 ${
              isOutgoing ? "bg-primary/10 text-primary" : "bg-muted"
            }`}
            onClick={() => setIsOutgoing(!isOutgoing)}
            title={isOutgoing ? "Sending as: You" : "Sending as: Them"}
          >
            <span className="text-xs font-bold">
              {isOutgoing ? "ME" : "TH"}
            </span>
          </Button>

          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a message..."
              className="pr-12 h-10 rounded-full bg-muted/50 border-0 focus-visible:ring-1"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary hover:bg-primary/90"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
              </div>
    </div>
  );
}
