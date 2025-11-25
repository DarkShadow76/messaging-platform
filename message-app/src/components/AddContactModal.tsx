import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import type { UserSearchResult } from '../types';

interface AddContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddContact: (user: UserSearchResult) => Promise<void>; // Changed prop name and type
}

export const AddContactModal = ({ isOpen, onClose, onAddContact }: AddContactModalProps) => { // Changed prop name
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([]); // Changed type
  const [isLoading, setIsLoading] = useState(false);
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/contacts/search-by-email?email=${query}`, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      if (response.ok) {
        const data: UserSearchResult[] = await response.json(); // Cast data type
        setSearchResults(Array.isArray(data) ? data : []);
      } else {
         setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching users:', error); // Changed log message
      setSearchResults([]);
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
            type="email"
            placeholder="Enter email address..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="search-input"
          />
          <div className="search-results">
            {isLoading ? (
              <p>Searching...</p>
            ) : searchResults.length > 0 ? (
              searchResults.map((user) => ( // Changed variable name to user
                <div
                  key={user.id}
                  className="search-result-item"
                  onClick={async () => { // Made onClick async
                    await onAddContact(user); // Call onAddContact
                    onClose();
                  }}
                >
                  <div className="contact-avatar small">
                    <img src={user.avatar_url || 'https://www.gravatar.com/avatar/?d=mp'} alt={user.full_name || user.email} /> // Use user.avatar_url, fallback to gravatar, use full_name or email
                  </div>
                  <span>{user.full_name || user.email}</span> // Use user.full_name or email
                </div>
              ))
            ) : searchQuery.length >= 3 ? (
              <p>No user found with this email.</p>
            ) : (
              <p>Type at least 3 characters to search.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
