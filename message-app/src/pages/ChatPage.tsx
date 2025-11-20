import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useNavigate } from 'react-router-dom';
import { ContactList } from '../components/ContactList';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { supabase } from '../supabaseClient';
import type { Contact, Message } from '../types';
import './ChatPage.css';

export const ChatPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.session?.user);
  const { messages, fetchMessages, sendMessage, addMessage } = useMessageStore();
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactListOpen, setIsContactListOpen] = useState(false);

  useEffect(() => {
    if (user && selectedContact) {
      fetchMessages(selectedContact.user_id);
    }
  }, [user, selectedContact, fetchMessages]);

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const newMessage = payload.new as Message;
          if (
            selectedContact &&
            ((newMessage.sender_id === user?.id && newMessage.receiver_id === selectedContact.user_id) ||
             (newMessage.sender_id === selectedContact.user_id && newMessage.receiver_id === user?.id))
          ) {
            addMessage(newMessage);
          }

          // Notification logic
          if (newMessage.receiver_id === user?.id && document.hidden) {
            new Notification('New Message', {
              body: newMessage.content || 'Sent an image',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedContact, user, addMessage]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      alert('Logout failed: ' + (error as Error).message);
    }
  };

  const handleSendMessage = async (message: string, imageUrl?: string) => {
    if (!selectedContact) return;
    try {
      await sendMessage(selectedContact.user_id, message, imageUrl);
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
          <ChatHeader
            selectedContact={selectedContact}
            onToggleSidebar={toggleContactList}
            onLogout={handleLogout}
          />
          {selectedContact ? (
            <>
              <MessageList messages={messages} currentUserId={user?.id} />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="no-contact-selected">
              <div>
                <h2>Messaging App</h2>
                <p>Select a contact to start chatting</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
