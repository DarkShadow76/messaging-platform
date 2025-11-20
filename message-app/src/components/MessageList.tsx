import { useEffect, useRef } from 'react';
import type { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  currentUserId: string | undefined;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const MessageList = ({ messages, currentUserId }: MessageListProps) => {
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="message-list" ref={messageListRef}>
      {messages.map((msg) => (
        <div
          key={msg.id}
          className={`message ${msg.sender_id === currentUserId ? 'self' : 'other'}`}
        >
          <div className="message-content glass-panel">
            {msg.image_url && (
              <img
                src={msg.image_url}
                alt="Shared image"
                style={{ maxWidth: '200px', borderRadius: '8px', marginBottom: '8px', display: 'block' }}
              />
            )}
            <p style={{ margin: 0 }}>{msg.content}</p>
          </div>
          <span className="message-timestamp">{formatTime(msg.created_at)}</span>
        </div>
      ))}
    </div>
  );
};
