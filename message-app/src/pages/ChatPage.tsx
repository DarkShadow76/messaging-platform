import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../components/ContactList';
import type { Contact } from '../types';
import './ChatPage.css';

// A simple utility function to format the timestamp
const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export const ChatPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.session?.user);
  const { messages, fetchMessages, sendMessage } = useMessageStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactListOpen, setIsContactListOpen] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && selectedContact) {
      fetchMessages(selectedContact.user_id);
    }
  }, [user, selectedContact, fetchMessages]);

  useEffect(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messages]);

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

  const toggleContactList = () => {
    setIsContactListOpen(!isContactListOpen);
  };

  return (
    <div className="chat-container">
      <div className="chat-page">
        <div
          className={`overlay ${isContactListOpen ? 'open' : ''}`}
          onClick={toggleContactList}
        ></div>
        <ContactList
          onSelectContact={setSelectedContact}
          selectedContact={selectedContact}
          isOpen={isContactListOpen}
        />
        <main className="chat-main">
          <header className="chat-header">
            <button style={{color: 'black'}} className="menu-button" onClick={toggleContactList}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z"></path>
              </svg>
            </button>
            {selectedContact ? (
              <>
                <div className="contact-avatar">
                  <img src={selectedContact.avatar_url} alt={selectedContact.name} />
                </div>
                <h1>{selectedContact.name}</h1>
              </>
            ) : (
              <h1 style={{color: 'black'}}>Messaging App</h1>
            )}
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </header>
          {selectedContact ? (
            <>
              <div className="message-list" ref={messageListRef}>
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message ${
                      msg.sender_id === user?.id ? 'self' : 'other'
                    }`}
                  >
                    <p className="message-content">{msg.content}</p>
                    <span className="message-timestamp">
                      {formatTime(msg.created_at)}
                    </span>
                  </div>
                ))}
              </div>
              <form className="message-form" onSubmit={handleSendMessage}>
                <input
                  type="text"
                  placeholder="Type a message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button type="submit">
                  <svg viewBox="0 0 24 24" width="24" height="24" className="">
                    <path
                      fill="currentColor"
                      d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z"
                    ></path>
                  </svg>
                </button>
              </form>
            </>
          ) : (
            <div className="no-contact-selected">
              <div>
                <h2>Messaging App</h2>
                <p>Send and receive messages without keeping your phone online.</p>
                <p>Use this app on up to 4 linked devices and 1 phone at the same time.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
