import { useState } from "react";
import { useParams } from "react-router-dom";
import TableToolbar from "../../components/TableToolbar";
import ScaleCanvas from "./ScaleCanvas";
import AddScaleModal from "./AddScaleModal";
import { query } from "../../utils/storage";
import { Room } from "./types";

export default function ScaleInfoPage() {
  const { id } = useParams<{ id: string }>() as { id: string };
  const room = query<Room>("rooms").find((r) => r.id === id);
  const [showAdd, setShowAdd] = useState(false);

  if (!room) return <p>Room not found.</p>;

  return (
    <>
      <TableToolbar
        title={room.name}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Scales"
      />
      <ScaleCanvas roomId={id} />
      <AddScaleModal
        roomId={id}
        open={showAdd}
        onClose={() => setShowAdd(false)}
      />
    </>
  );
}
