"use client";

import { MessageCircle } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-full chat-background">
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-emerald-400/20 flex items-center justify-center">
          <MessageCircle className="h-12 w-12 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground/80">ChatMeme</h2>
          <p className="text-muted-foreground mt-2 max-w-xs">
            Select a chat from the sidebar or create a new one to start creating
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-6 max-w-sm">
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            Edit messages
          </span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            Change time
          </span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            Custom avatars
          </span>
          <span className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
            Multiple chats
          </span>
        </div>
      </div>
    </div>
  );
}
