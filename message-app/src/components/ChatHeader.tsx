import type { Contact } from '../types';

interface ChatHeaderProps {
  selectedContact: Contact | null;
  onToggleSidebar: () => void;
  onLogout: () => void;
}

export const ChatHeader = ({ selectedContact, onToggleSidebar, onLogout }: ChatHeaderProps) => {
  return (
    <header className="chat-header glass-panel">
      <button style={{ color: 'var(--text-primary)' }} className="menu-button" onClick={onToggleSidebar}>
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
        <h1 style={{ color: 'var(--text-primary)' }}>Messaging App</h1>
      )}
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </header>
  );
};
