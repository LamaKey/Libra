// src/features/rooms/ScaleCanvas.tsx
import React from 'react';
import { Link }                         from 'react-router-dom';
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragEndEvent
} from '@dnd-kit/core';
import { restrictToParentElement }      from '@dnd-kit/modifiers';
import { snap, CELL }                  from '../../utils/gridSnap';
import { query, remove, update }       from '../../utils/storage';
import { Scale }                       from './types';
import ScaleTile                       from './ScaleTile';
import { Product }                     from '../products/types';

function DraggableScale({ scale }: { scale: Scale }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: scale.id,
    data: scale
  });

  // find the product for label + link target
  const prod  = query<Product>('products').find(p => p.id === scale.productId);
  const label = prod?.name ?? 'Scale';

  // style to position the tile
  const style: React.CSSProperties = {
    position: 'absolute',
    left:      scale.x,
    top:       scale.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    userSelect: 'none'
  };

  // right-click to delete
  const onContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm(`Delete scale for “${label}”?`)) {
      remove('scales', scale.id);
      window.dispatchEvent(new CustomEvent('scales-changed'));
    }
  };

  return (
    <div style={style} onContextMenu={onContextMenu}>
      {/* only this inner handle is draggable */}
      <div ref={setNodeRef} {...listeners} {...attributes}>
        {/* wrap the tile in a Link just like your products page */}
        <Link
          to={`/inventory/${scale.productId}`}
          style={{ display: 'inline-block', textDecoration: 'none' }}
        >
          <ScaleTile
            label={label}
            low={!!scale.alerts}
            imgUrl={prod?.img}
          />
        </Link>
      </div>
    </div>
  );
}

export default function ScaleCanvas({ roomId }: { roomId: string }) {
  const [scales, setScales] = React.useState<Scale[]>(() =>
    query<Scale>('scales').filter(s => s.roomId === roomId)
  );

  React.useEffect(() => {
    const refresh = () =>
      setScales(query<Scale>('scales').filter(s => s.roomId === roomId));
    window.addEventListener('scales-changed', refresh);
    return () => window.removeEventListener('scales-changed', refresh);
  }, [roomId]);

  const handleDragEnd = (e: DragEndEvent) => {
    const s = e.active.data.current as Scale;
    if (!e.delta) return;
    const newX = snap(s.x + e.delta.x);
    const newY = snap(s.y + e.delta.y);
    update<Scale>('scales', s.id, { x: newX, y: newY });
    // storage.update will dispatch the “scales-changed” event for us
  };

  const { setNodeRef } = useDroppable({ id: 'canvas' });

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
      <div
        ref={setNodeRef}
        style={{
          position: 'relative',
          width:    '78vw',
          height:   '85vh',
          backgroundSize:  `${CELL}px ${CELL}px`,
          backgroundImage:
            'linear-gradient(to right,#eee 1px,transparent 1px),' +
            'linear-gradient(to bottom,#eee 1px,transparent 1px)',
          border:       '1px solid #ddd',
          borderRadius: 12,
          overflow:     'hidden'
        }}
      >
        {scales.map(s => (
          <DraggableScale key={s.id} scale={s} />
        ))}
      </div>
    </DndContext>
  );
}
