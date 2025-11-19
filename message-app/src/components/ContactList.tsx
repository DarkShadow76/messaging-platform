import { useEffect } from 'react';
import { useContactStore } from '../store/contactStore';
import type { Contact } from '../types';

interface ContactListProps {
  onSelectContact: (contact: Contact) => void;
}

export const ContactList = ({ onSelectContact }: ContactListProps) => {
  const { contacts, fetchContacts } = useContactStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  return (
    <div className="contact-list">
      <h2>Contacts</h2>
      <ul>
        {contacts.map((contact) => (
          <li key={contact.id} onClick={() => onSelectContact(contact)}>
            <img src={contact.avatar_url} alt={contact.name} />
            <span>{contact.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
