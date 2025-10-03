'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Input } from './input';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Badge } from './badge';
import { Send, Smile } from 'lucide-react';

export interface ChatMessage {
  id: string;
  user: {
    id: string;
    username: string;
    avatar?: string;
    badges?: string[];
  };
  message: string;
  timestamp: Date;
  isSystem?: boolean;
}

export interface ChatProps {
  messages: ChatMessage[];
  currentUser?: {
    id: string;
    username: string;
    avatar?: string;
  };
  onSendMessage?: (message: string) => void;
  placeholder?: string;
  className?: string;
  maxHeight?: string;
}

export function Chat({
  messages,
  currentUser,
  onSendMessage,
  placeholder = "Send a message",
  className = '',
  maxHeight = '400px',
}: ChatProps) {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && onSendMessage) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`flex flex-col bg-card border border-border rounded-lg ${className}`}>
      {/* Chat header */}
      <div className="p-3 border-b border-border">
        <h3 className="font-semibold">Live Chat</h3>
      </div>

      {/* Messages */}
      <div
        className="flex-1 overflow-y-auto p-3 space-y-3"
        style={{ maxHeight }}
      >
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start space-x-2 ${msg.isSystem ? 'justify-center' : ''}`}>
            {!msg.isSystem && (
              <Avatar className="w-6 h-6 flex-shrink-0 mt-1">
                <AvatarImage src={msg.user.avatar} alt={msg.user.username} />
                <AvatarFallback className="text-xs">
                  {msg.user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}

            <div className="flex-1 min-w-0">
              {!msg.isSystem && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="font-medium text-sm">{msg.user.username}</span>
                  {msg.user.badges?.map((badge) => (
                    <Badge key={badge} variant="secondary" className="text-xs px-1 py-0">
                      {badge}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              <p className={`text-sm break-words ${msg.isSystem ? 'text-muted-foreground text-center italic' : ''}`}>
                {msg.message}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {currentUser && onSendMessage && (
        <div className="p-3 border-t border-border">
          <div className="flex items-end space-x-2">
            <div className="flex-1">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={placeholder}
                className="resize-none"
                rows={1}
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!message.trim()}
              size="icon"
              className="flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" className="flex-shrink-0">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
