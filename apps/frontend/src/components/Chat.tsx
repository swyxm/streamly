'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  user: string;
  content: string;
  room: string;
  time: string;
}

interface ChatProps {
  streamKey: string;
}

export function Chat({ streamKey }: ChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const formatTime = (timestamp: string) => {
    const now = new Date();
    let messageTime: Date;

    if (timestamp === 'now') {
      messageTime = now;
    } else {
      messageTime = new Date(timestamp);
    }

    const diffInSeconds = Math.floor((now.getTime() - messageTime.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes}m ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours}h ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days}d ago`;
    }
  };

  useEffect(() => {
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isClosing = false;

    const connect = () => {
      if (isClosing) return;
      socket = new WebSocket(`ws://localhost:8084/ws/${streamKey}`);

      socket.onopen = () => {
        if (reconnectTimeout) {
          clearTimeout(reconnectTimeout);
          reconnectTimeout = null;
        }
      };

      socket.onmessage = (event) => {
        try {
          const newMessage: Message = JSON.parse(event.data);
          if (newMessage && typeof newMessage === 'object' && newMessage.content) {
            if (newMessage.user === 'System' && newMessage.content.startsWith('{')) {
              try {
                const nestedMsg = JSON.parse(newMessage.content);
                if (nestedMsg && nestedMsg.content && nestedMsg.user) {
                  setMessages((prev) => [...prev, nestedMsg]);
                  return;
                }
              } catch {
              }
              return;
            }
            setMessages((prev) => {
              if (prev.some(m => m.id === newMessage.id)) {
                return prev;
              }
              return [...prev, newMessage];
            });
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
          console.error('Raw message data:', event.data);
        }
      };

      socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      socket.onclose = (event) => {
        console.log('Disconnected from chat WebSocket', event.code, event.reason);
        setWs(null);
        
        if (!isClosing && event.code !== 1000) {
          reconnectTimeout = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connect();
          }, 3000);
        }
      };

      setWs(socket);
    };
    connect();

    return () => {
      isClosing = true;
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
      if (socket) {
        socket.close(1000, 'Component unmounting');
      }
    };
  }, [streamKey]);

  useEffect(() => {
    const savedMessages = localStorage.getItem(`chat-messages-${streamKey}`);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to load saved messages:', error);
      }
    }
  }, [streamKey]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(`chat-messages-${streamKey}`, JSON.stringify(messages));
    }
  }, [messages, streamKey]);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => [...prev]);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    
    if (ws && ws.readyState === WebSocket.OPEN) {
      const msg: Message = {
        id: Date.now().toString(),
        user: user?.username || 'User',
        content: message,
        room: streamKey,
        time: new Date().toISOString(),
      };
      try {
        ws.send(JSON.stringify(msg));
        setMessage('');
      } catch (error) {
        console.error('Failed to send message:', error);
      }
    } else {
      console.warn('WebSocket is not open. Current state:', ws?.readyState);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="w-full h-full bg-card rounded-lg border border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold">Live Chat</h3>
      </div>

      <div className="flex-1 p-4 overflow-y-auto max-h-96">
        <div>
          {messages.map((msg) => (
            <div key={msg.id} className="flex items-center gap-2">
              <span className="font-semibold text-primary">{msg.user}:</span>
              <span className="text-sm">{msg.content}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-border">
        <div className="flex space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={sendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
