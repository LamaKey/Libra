import React from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragEndEvent,
} from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { snap, CELL } from "../../utils/gridSnap";
import { query, remove, update } from "../../utils/storage";
import { Scale } from "./types";
import ScaleTile from "./ScaleTile";
import { Product } from "../products/types";

function DraggableScale({ scale }: { scale: Scale }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: scale.id,
    data: scale,
  });

  const style: React.CSSProperties = {
    position: "absolute",
    left: scale.x,
    top: scale.y,
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    userSelect: "none",
  };

  const prod = query<Product>("products").find((p) => p.id === scale.productId);

  const onRightClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Delete this scale?")) {
      remove("scales", scale.id);
      window.dispatchEvent(new CustomEvent("scales-changed"));
    }
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      onContextMenu={onRightClick}
    >
      <ScaleTile
        label={prod?.name ?? "Scale"}
        low={!!scale.alerts}
        imgUrl={prod?.img}
      />
    </div>
  );
}

export default function ScaleCanvas({ roomId }: { roomId: string }) {
  const [scales, setScales] = React.useState<Scale[]>(() =>
    query<Scale>("scales").filter((s) => s.roomId === roomId)
  );

  React.useEffect(() => {
    const refresh = () =>
      setScales(query<Scale>("scales").filter((s) => s.roomId === roomId));
    window.addEventListener("scales-changed", refresh);
    return () => window.removeEventListener("scales-changed", refresh);
  }, [roomId]);

  const handleDragEnd = (e: DragEndEvent) => {
    const s = e.active.data.current as Scale;
    if (!e.delta) return;
    const newX = snap(s.x + e.delta.x);
    const newY = snap(s.y + e.delta.y);
    update<Scale>("scales", s.id, { x: newX, y: newY });
  };

  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement]}>
      <div
        ref={setNodeRef}
        style={{
          position: "relative",
          width: "100%",
          height: "94%",
          backgroundSize: `${CELL}px ${CELL}px`,
          backgroundImage:
            "linear-gradient(to right,#eee 1px,transparent 1px)," +
            "linear-gradient(to bottom,#eee 1px,transparent 1px)",
          border: "1px solid #ddd",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {scales.map((s) => (
          <DraggableScale key={s.id} scale={s} />
        ))}
      </div>
    </DndContext>
  );
}
