import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../store/authStore";
import { useMessageStore } from "../store/messageStore";
import { useNavigate } from "react-router-dom";
import { ContactList } from "../components/ContactList";
import type { Contact } from "../types";
import "./ChatPage.css";

export const ChatPage = () => {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.session?.user);
  const { messages, fetchMessages, sendMessage } = useMessageStore();
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
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
      navigate("/login");
    } catch (error) {
      alert("Logout failed: " + (error as Error).message);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === "" || !selectedContact) return;
    try {
      await sendMessage(selectedContact.user_id, message);
      setMessage("");
    } catch (error) {
      alert("Send message failed: " + (error as Error).message);
    }
  };

  return (
    <div className="chat-page">
      <ContactList onSelectContact={setSelectedContact} />
      <main className="chat-main">
        {selectedContact ? (
          <>
            <header className="chat-header">
              <h1>{selectedContact.name}</h1>
              <button onClick={handleLogout}>Logout</button>
            </header>
            <div className="message-list" ref={messageListRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.sender_id === user?.id ? "self" : "other"
                  }`}
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
              />
              <button type="submit">Send</button>
            </form>
          </>
        ) : (
          <div className="no-contact-selected">
            <h1>Select a contact to start chatting</h1>
          </div>
        )}
      </main>
    </div>
  );
};
