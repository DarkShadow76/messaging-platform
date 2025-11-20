import { useState, useRef } from 'react';
import { supabase } from '../supabaseClient';

interface MessageInputProps {
  onSendMessage: (message: string, imageUrl?: string) => void;
}

export const MessageInput = ({ onSendMessage }: MessageInputProps) => {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    onSendMessage(message);
    setMessage('');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('chat-images').getPublicUrl(filePath);
      
      // Send message with image immediately or let user add text?
      // Let's send it immediately as an image message.
      // Or better, just append the image URL to the message?
      // The backend supports image_url.
      // Let's assume we send it as a separate message or with empty text if just image.
      // But the backend requires content to be not empty (IsNotEmpty).
      // So we should probably send "Sent an image" or allow empty content if image is present.
      // But I didn't change IsNotEmpty in backend.
      // So I will send a default text "Image" if message is empty.
      
      onSendMessage(message || 'Image', data.publicUrl);
      setMessage('');
    } catch (error) {
      alert('Error uploading image: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form className="message-form glass-panel" onSubmit={handleSubmit}>
      <button
        type="button"
        className="icon-button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <svg viewBox="0 0 24 24" width="24" height="24">
          <path
            fill="currentColor"
            d="M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z"
          ></path>
        </svg>
      </button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        disabled={isUploading}
      />
      <button type="submit" disabled={isUploading}>
        {isUploading ? (
          <span className="loader">...</span>
        ) : (
          <svg viewBox="0 0 24 24" width="24" height="24">
            <path
              fill="currentColor"
              d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
            ></path>
          </svg>
        )}
      </button>
    </form>
  );
};
