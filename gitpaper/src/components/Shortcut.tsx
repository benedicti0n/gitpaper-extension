import React, { useRef, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { ItemTypes } from '~constants/itemTypes';
import './Shortcut.css';

export type ShortcutItem = {
  id: string;
  label: string;
  url: string;
  icon: string;
};

interface ShortcutProps {
  side?: 'left' | 'right';
  shortcuts?: ShortcutItem[];
  setShortcuts?: (shortcuts: ShortcutItem[]) => void;
  onAddClick?: () => void;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
}

interface ShortcutItemComponentProps {
  item: ShortcutItem;
  index: number;
  moveItem?: (dragIndex: number, hoverIndex: number) => void;
  onRemove?: (id: string) => void;
}

const ShortcutItemComponent: React.FC<ShortcutItemComponentProps> = ({ item, index, moveItem, onRemove }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.SHORTCUT,
    item: { type: ItemTypes.SHORTCUT, id: item.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !!moveItem, // Only allow dragging if moveItem is provided
  });

  const [, drop] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: ItemTypes.SHORTCUT,
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

  const handleRemoveClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove?.(item.id);
  }, [onRemove, item.id]);

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
          width: '24px',
          height: '24px',
          borderRadius: '4px',
          objectFit: 'contain',
        }}
      />
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          color: 'white',
          textDecoration: 'none',
          flex: 1,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {item.label}
      </a>
      <button
        onClick={handleRemoveClick}
        className="remove-button"
      >
        ×
      </button>
    </div>
  );
};

const Shortcut: React.FC<ShortcutProps> = (props) => {
  const {
    side = 'left',
    shortcuts = [],
    setShortcuts = () => { },
    onAddClick = () => { }
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