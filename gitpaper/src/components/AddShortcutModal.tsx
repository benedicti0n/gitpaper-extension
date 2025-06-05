import React, { useState, useEffect } from 'react';

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
        // Try to get favicon using Google's service
        const domain = new URL(url.startsWith('http') ? url : `https://${url}`).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        // Check if favicon exists
        const response = await fetch(faviconUrl);
        if (response.ok) {
          setIconUrl(faviconUrl);
        }
      } catch (err) {
        console.error('Error fetching favicon:', err);
      }
    };

    const timer = setTimeout(() => {
      if (url) {
        fetchFavicon();
      }
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
      // Ensure URL has protocol
      const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
      new URL(formattedUrl); // Validate URL

      const newShortcut: ShortcutItem = {
        id: Math.floor(Math.random() * 1000000).toString(),
        label: title.trim(),
        url: formattedUrl,
        icon: iconUrl || '🔗' // Fallback to link emoji if no favicon
      };

      onAdd(newShortcut);

      // Reset form
      setTitle('');
      setUrl('');
      setIconUrl('');
      onClose();
    } catch (err) {
      setError('Please enter a valid URL');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div
        className="bg-white rounded-lg p-6 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Shortcut</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Google"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="url">
              URL *
            </label>
            <input
              id="url"
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., google.com or https://google.com"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Icon
            </label>
            <div className="flex items-center">
              {iconUrl ? (
                <img
                  src={iconUrl}
                  alt="Website icon"
                  className="w-10 h-10 rounded-full border border-gray-200 mr-4"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border border-gray-200 mr-4 flex items-center justify-center text-gray-400">
                  🔗
                </div>
              )}
              <span className="text-sm text-gray-500">
                {iconUrl ? 'Favicon detected' : 'Default icon will be used'}
              </span>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Shortcut'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddShortcutModal;
