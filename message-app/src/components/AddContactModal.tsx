import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { Contact } from '../types';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contact) => void;
}

export const AddContactModal = ({ isOpen, onClose, onSelectContact }: AddContactModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  }, [isOpen]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/contacts/search?q=${query}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSearchResults(data);
      }
    } catch (error) {
      console.error('Error searching contacts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Contact</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="search-input"
          />
          <div className="search-results">
            {isLoading ? (
              <p>Searching...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((contact) => (
                <div
                  key={contact.id}
                  className="search-result-item"
                  onClick={() => {
                    onSelectContact(contact);
                    onClose();
                  }}
                >
                  <div className="contact-avatar small">
                    <img src={contact.avatar_url} alt={contact.name} />
                  </div>
                  <span>{contact.name}</span>
                </div>
              ))
            ) : searchQuery.length >= 2 ? (
              <p>No users found.</p>
            ) : (
              <p>Type at least 2 characters to search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
