import { useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import type { Contact } from '../types';

interface ContactListProps {
  onSelectContact: (contact: Contact) => void;
  selectedContact: Contact | null;
  isOpen: boolean;
}

export const ContactList = ({ onSelectContact, selectedContact, isOpen }: ContactListProps) => {
  const { contacts, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

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
              onClick={() => onSelectContact(contact)}
            >
              <div className="contact-avatar">
                <img src={contact.avatar_url} alt={contact.name} />
              </div>
              <div className="contact-info">
                <span className="contact-name">{contact.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
