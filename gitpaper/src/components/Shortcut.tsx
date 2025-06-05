import React, { useRef, useCallback, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '~constants/itemTypes';
import './Shortcut.css';

export type ShortcutItem = {
  id: string;
  label: string;
  url: string;
  icon: string;
  side?: 'left' | 'right';
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

const ShortcutItemComponent: React.FC<ShortcutItemComponentProps> = ({ item, index, moveItem, onRemove, side, onDragStart, onDrop }) => {
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
    drop: (item: ShortcutItem) => {
      if (item.side !== side && onDrop) {
        onDrop(item);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver()
    }),
    hover: (item: DragItem, monitor) => {
      if (!ref.current || !moveItem) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      if (moveItem) {
        moveItem(dragIndex, hoverIndex);
        item.index = hoverIndex;
      }
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
    const newIsOpen = !isMenuOpen;
    setIsMenuOpen(newIsOpen);

    if (newIsOpen && menuButtonRef.current) {
      const rect = menuButtonRef.current.getBoundingClientRect();
      if (menuRef.current) {
        menuRef.current.style.setProperty('--menu-top', `${rect.bottom + window.scrollY}px`);
        menuRef.current.style.setProperty('--menu-left', `${rect.left + window.scrollX}px`);
        menuRef.current.dataset.visible = 'true';
      }
    } else if (menuRef.current) {
      menuRef.current.dataset.visible = 'false';
    }
  };

  const handleAction = (e: React.MouseEvent, action: string) => {
    e.stopPropagation();
    setIsMenuOpen(false);

    switch (action) {
      case 'edit':
        // Handle edit action
        console.log('Edit:', item.id);
        break;
      case 'open':
        window.open(item.url, '_blank');
        break;
      case 'private':
        window.open(item.url, '_blank', 'private');
        break;
      case 'delete':
        if (onRemove) {
          onRemove(item.id);
        }
        break;
    }
  };

  // Close menu when clicking outside
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
      style={{
        opacity,
      }}
    >
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
      <a
        href={item.url}
        style={{
          color: 'white',
          textDecoration: 'none',
          fontSize: "16px",
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.label}
      </a>
      <div className="menu-container" ref={menuRef}>
        <button
          ref={menuButtonRef}
          onClick={handleMenuToggle}
          className="menu-button"
          aria-label="Shortcut options"
          aria-expanded={isMenuOpen}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="6" r="2" fill="currentColor" />
            <circle cx="12" cy="12" r="2" fill="currentColor" />
            <circle cx="12" cy="18" r="2" fill="currentColor" />
          </svg>
        </button>
        {isMenuOpen && (
          <div className="dropdown-menu" role="menu">
            <button onClick={(e) => handleAction(e, 'edit')}>
              <span>Edit</span>
            </button>
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

const Shortcut: React.FC<ShortcutProps> = (props) => {
  const {
    side,
    shortcuts,
    setShortcuts,
    onAddClick = () => { },
    onDragStart = () => { },
    onDrop = () => { }
  } = props;
  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    const dragItem = shortcuts[dragIndex];
    const newItems = [...shortcuts];
    newItems.splice(dragIndex, 1);
    newItems.splice(hoverIndex, 0, dragItem);
    setShortcuts(newItems);
  }, [shortcuts, setShortcuts]);

  const handleRemove = useCallback((id: string) => {
    setShortcuts?.(shortcuts.filter((item) => item.id !== id));
  }, [shortcuts, setShortcuts]);

  return (
    <div
      className="shortcut-container"
    >
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
      <button
        onClick={onAddClick}
        className="add-shortcut-button"
      >
        ➕
      </button>
    </div>
  );
};

export default Shortcut;