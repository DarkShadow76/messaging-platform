import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useMessageStore } from '../store/messageStore';
import { useContactStore } from '../store/contactStore'; // Added import
import { useChatStore } from '../store/chatStore';
import { ContactList } from '../components/ContactList';
import { ChatHeader } from '../components/ChatHeader';
import { MessageList } from '../components/MessageList';
import { MessageInput } from '../components/MessageInput';
import { supabase } from '../supabaseClient';
import type { Contact, Message, UserSearchResult } from '../types'; // Added UserSearchResult
import { AddContactModal } from '../components/AddContactModal';
import './ChatPage.css';

export const ChatPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const userSession = useAuthStore((state) => state.session); // Renamed user to userSession for clarity
  const { messages, fetchMessages, sendMessage, addMessage } = useMessageStore();
  const { addContact: addContactToStore, fetchContacts } = useContactStore(); // Get addContact and fetchContacts from contactStore
  const { selectedContact, setSelectedContact } = useChatStore();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddContactModalOpen, setIsAddContactModalOpen] = useState(false);

  useEffect(() => {
    if (userSession?.user && selectedContact) { // Use userSession?.user
      fetchMessages(selectedContact.user_id);
    }
  }, [userSession?.user, selectedContact, fetchMessages]); // Use userSession?.user

  useEffect(() => {
    if (userSession?.user) {
      fetchContacts();
    }
  }, [userSession?.user, fetchContacts]);

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
            ((newMessage.sender_id === userSession?.user?.id && newMessage.receiver_id === selectedContact.user_id) || // Use userSession?.user?.id
             (newMessage.sender_id === selectedContact.user_id && newMessage.receiver_id === userSession?.user?.id)) // Use userSession?.user?.id
          ) {
            addMessage(newMessage);
          }

          // Notification logic
          if (newMessage.receiver_id === userSession?.user?.id && document.hidden) { // Use userSession?.user?.id
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
  }, [selectedContact, userSession?.user, addMessage]); // Use userSession?.user

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

  // New function to handle adding a contact
  const handleOnAddContact = async (user: UserSearchResult) => {
    if (!user || !user.id || !userSession?.access_token) return;
    try {
      const response = await fetch('http://localhost:3000/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userSession.access_token}`,
        },
        body: JSON.stringify({ contactUserId: user.id }),
      });

      if (response.ok) {
        const newContact: Contact = await response.json();
        addContactToStore(newContact); // Add the newly created contact to the store
        setSelectedContact(newContact); // Select the new contact
        alert(`Contact ${newContact.name} added successfully!`);
      } else {
        const errorData = await response.json();
        alert('Failed to add contact: ' + (errorData.message || response.statusText));
      }
    } catch (error) {
      alert('Failed to add contact: ' + (error as Error).message);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-page glass-panel">
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <ContactList
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
          />
        </div>
        
        <main className="chat-main">
          <ChatHeader
            selectedContact={selectedContact}
            onLogout={handleLogout}
            onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            onAddContact={() => setIsAddContactModalOpen(true)}
          />
          
          {selectedContact ? (
            <>
              <MessageList
                messages={messages}
                currentUserId={userSession?.user?.id || ''} // Use userSession?.user?.id
              />
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            <div className="no-contact-selected">
              <div>
                <h2>Welcome, {userSession?.user?.email}</h2> {/* Use userSession?.user?.email */}
                <p>Select a contact to start messaging</p>
              </div>
            </div>
          )}
        </main>
      </div>
      <AddContactModal
        isOpen={isAddContactModalOpen}
        onClose={() => setIsAddContactModalOpen(false)}
        onAddContact={handleOnAddContact} // Changed prop name and passed new handler
      />
    </div>
  );
};
