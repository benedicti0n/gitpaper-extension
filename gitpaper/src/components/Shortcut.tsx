import React, { useRef, useCallback, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '~constants/itemTypes';
import './Shortcut.css';
import { Menu } from 'lucide-react';

export type ShortcutItem = {
  id: string;
  label: string;
  url: string;
  icon: string;
  side: 'left' | 'right';
};

interface ShortcutProps {
  side: 'left' | 'right';
  shortcuts: ShortcutItem[];
  setShortcuts: (shortcuts: ShortcutItem[]) => void;
  onAddClick?: () => void;
  onDragStart?: (item: ShortcutItem) => void;
  onDrop?: (item: ShortcutItem) => void;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
  side: 'left' | 'right';
  url: string;
  label: string;
  icon: string;
}

interface ShortcutItemComponentProps {
  item: ShortcutItem;
  index: number;
  moveItem?: (dragIndex: number, hoverIndex: number) => void;
  onRemove?: (id: string) => void;
  side: 'left' | 'right';
  onDragStart?: (item: ShortcutItem) => void;
  onDrop?: (item: ShortcutItem) => void;
}

const ShortcutItemComponent: React.FC<ShortcutItemComponentProps> = ({
  item,
  index,
  moveItem,
  onRemove,
  side,
  onDragStart,
  onDrop
}) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SHORTCUT,
    item: () => ({
      type: ItemTypes.SHORTCUT,
      id: item.id,
      index,
      side,
      ...item
    }),
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    })
  });

  const [, drop] = useDrop({
    accept: ItemTypes.SHORTCUT,
    drop: (draggedItem: ShortcutItem) => {
      if (draggedItem.side !== side && onDrop) {
        onDrop(draggedItem);
      }
    },
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current || !moveItem) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;

      const hoverRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset?.y ?? 0) - hoverRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveItem(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  const opacity = isDragging ? 0.4 : 1;
  const dragDropRef = useCallback((node: HTMLDivElement) => {
    drag(drop(node));
    ref.current = node;
  }, [drag, drop]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setIsMenuOpen(false);

    switch (action) {
      case 'open':
        window.open(item.url, '_blank');
        break;
      case 'private':
        window.open(item.url, '_blank', 'noopener,noreferrer');
        break;
      case 'delete':
        onRemove?.(item.id);
        break;
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dragDropRef}
      className="shortcut-item"
      style={{ opacity }}
    >
      <a
        href={item.url}
        style={{
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '4px',
          width: '100%',
          padding: '8px',
          boxSizing: 'border-box'
        }}>
          <img
            src={item.icon}
            alt={item.label}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '4px',
              objectFit: 'contain',
            }}
          />
          <h1
            style={{
              color: 'white',
              fontSize: "12px",
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              margin: 0,
              flex: 1
            }}
          >
            {item.label}
          </h1>
        </div>
      </a>
      <div className="menu-container" ref={menuRef}>
        <button
          ref={menuButtonRef}
          onClick={handleMenuToggle}
          className="menu-button"
          aria-label="Shortcut options"
          aria-expanded={isMenuOpen}
        >
          <Menu
            style={{
              width: '12px',
              height: '12px',
            }}
          />
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu" role="menu">
            <button onClick={(e) => handleAction(e, 'open')}>
              <span>Open in new window</span>
            </button>
            <button onClick={(e) => handleAction(e, 'private')}>
              <span>Open in private window</span>
            </button>
            <button onClick={(e) => handleAction(e, 'delete')} className="danger">
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const Shortcut: React.FC<ShortcutProps> = ({
  side,
  shortcuts,
  setShortcuts,
  onAddClick = () => { },
  onDragStart = () => { },
  onDrop = () => { }
}) => {
  const MAX_ITEMS = 4;

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    const updated = [...shortcuts];
    const [movedItem] = updated.splice(dragIndex, 1);
    updated.splice(hoverIndex, 0, movedItem);
    setShortcuts(updated);
  }, [shortcuts, setShortcuts]);

  const handleRemove = useCallback((id: string) => {
    setShortcuts(shortcuts.filter((item) => item.id !== id));
  }, [shortcuts, setShortcuts]);

  return (
    <div className="shortcut-container">
      {shortcuts.map((item, index) => (
        <ShortcutItemComponent
          key={item.id}
          index={index}
          item={item}
          moveItem={moveItem}
          onRemove={handleRemove}
          side={side}
          onDragStart={onDragStart}
          onDrop={onDrop}
        />
      ))}
      {shortcuts.length < MAX_ITEMS && (
        <button onClick={onAddClick} className="add-shortcut-button">
          ➕
        </button>
      )}
    </div>
  );
};

export default Shortcut;
