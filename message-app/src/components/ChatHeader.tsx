import type { Contact } from '../types';

interface ChatHeaderProps {
  selectedContact: Contact | null;
  onLogout: () => void;
  onToggleSidebar: () => void;
  onAddContact: () => void;
}

export const ChatHeader = ({ selectedContact, onLogout, onToggleSidebar, onAddContact }: ChatHeaderProps) => {
  return (
    <header className="chat-header glass-panel">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button className="menu-button" onClick={onToggleSidebar}>
          ☰
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
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="add-contact-button" onClick={onAddContact} style={{ backgroundColor: 'var(--accent-color)', color: 'white', border: 'none' }}>
          Add Contact
        </button>
        <button className="logout-button" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

