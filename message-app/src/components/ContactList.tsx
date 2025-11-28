import { useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import { useChatStore } from '../store/chatStore';
import type { Contact } from '../types';

interface ContactListProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactList = ({ isOpen, onClose }: ContactListProps) => {
  const { contacts, fetchContacts } = useContactStore();
  const { setSelectedContact, selectedContact } = useChatStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    onClose();
  };

  return (
    <aside className={`contact-list ${isOpen ? 'open' : ''}`}>
      <header className="contact-list-header">
        <h2>Chats</h2>
      </header>
      <div className="contact-list-body">
        <ul>
          {contacts.map((contact) => (
            <li
              key={contact.id}
              className={`contact-item ${
                selectedContact?.id === contact.id ? 'selected' : ''
              }`}
              onClick={() => handleContactClick(contact)}
            >
              <div className="contact-avatar">
                <img src={contact.avatar_url} alt={contact.full_name || contact.email || contact.user_id} />
              </div>
              <div className="contact-info">
                <span className="contact-name">
                  {contact.full_name || contact.email || 'Unknown Contact'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
