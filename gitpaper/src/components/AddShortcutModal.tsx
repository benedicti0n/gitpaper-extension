import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { ShortcutItem } from '~components/Shortcut';

interface AddShortcutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (shortcut: Omit<ShortcutItem, 'id'>) => void;
}

const AddShortcutModal: React.FC<AddShortcutModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [iconUrl, setIconUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFavicon = async () => {
      if (!url) return;

      try {
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        const response = await fetch(faviconUrl);
        if (response.ok) {
          setIconUrl(faviconUrl);
        }
      } catch (err) {
        console.error('Error fetching favicon:', err);
      }
    };

    const timer = setTimeout(() => {
      if (url) fetchFavicon();
    }, 500);

    return () => clearTimeout(timer);
  }, [url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !url.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(formattedUrl);

      const newShortcut: ShortcutItem = {
        id: Math.floor(Math.random() * 1000000).toString(),
        label: title.trim(),
        url: formattedUrl,
        icon: iconUrl || '🔗',
        side: 'left', // or 'right', adjust based on usage
      };

      onAdd(newShortcut);

      setTitle('');
      setUrl('');
      setIconUrl('');
      onClose();
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '24px',
          maxWidth: '400px',
          width: '100%',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          zIndex: 10000
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            border: 'none',
            background: 'transparent',
            fontSize: '18px',
            cursor: 'pointer',
          }}
        >
          ✕
        </button>

        <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Add New Shortcut</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '6px' }}>Title *</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="url" style={{ display: 'block', marginBottom: '6px' }}>URL *</label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px' }}>Icon</label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {iconUrl ? (
                <img src={iconUrl} alt="icon" style={{ width: 40, height: 40, marginRight: 10 }} />
              ) : (
                <span style={{ width: 40, height: 40, marginRight: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #ccc' }}>🔗</span>
              )}
              <span style={{ fontSize: '12px', color: '#777' }}>
                {iconUrl ? 'Favicon detected' : 'Default icon will be used'}
              </span>
            </div>
          </div>

          {error && (
            <div style={{ color: 'red', marginBottom: '16px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} style={{ padding: '8px 16px', backgroundColor: '#eee', border: 'none', borderRadius: '4px' }}>
              Cancel
            </button>
            <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
              {isLoading ? 'Adding...' : 'Add Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddShortcutModal;
