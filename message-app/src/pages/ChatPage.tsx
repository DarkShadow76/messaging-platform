import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../components/ContactList';
import type { Contact } from '../types';

export const ChatPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.session?.user);
  const { messages, fetchMessages, sendMessage } = useMessageStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    if (user && selectedContact) {
      fetchMessages(selectedContact.user_id);
    }
  }, [user, selectedContact, fetchMessages]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Logout failed: ' + (error as Error).message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '' || !selectedContact) return;
    try {
      await sendMessage(selectedContact.user_id, message);
      setMessage('');
    } catch (error) {
      alert('Send message failed: ' + (error as Error).message);
    }
  };

  return (
    <div className="chat-page">
      <ContactList onSelectContact={setSelectedContact} />
      <main className="chat-main">
        <header className="chat-header">
          <h1>{selectedContact ? selectedContact.name : 'Select a contact'}</h1>
          <button onClick={handleLogout}>Logout</button>
        </header>
        <div className="message-list">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.sender_id === user?.id ? 'self' : 'other'}`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <form className="message-form" onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!selectedContact}
          />
          <button type="submit" disabled={!selectedContact}>Send</button>
        </form>
      </main>
    </div>
  );
};
