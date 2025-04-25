import { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import SearchSelect, { Option } from "../../components/SearchSelect";
import { query, insert } from "../../utils/storage";
import { Product } from "../products/types";
import { Room, Scale } from "./types";
import { v4 as uuid } from "uuid";
import { snap } from "../../utils/gridSnap";

export default function AddScaleModal({
  roomId,
  open,
  onClose,
}: {
  roomId: string;
  open: boolean;
  onClose: () => void;
}) {
  const products = query<Product>("products");
  const room = query<Room>("rooms").find((r) => r.id == roomId);

  const prodOpts: Option[] = products
    .map((p) => ({
      value: p.id,
      label: p.name,
      location: p.location,
    }))
    .filter((p) => p.location == room?.location);

  const [prodId, setProd] = useState(prodOpts[0]?.value ?? "");

  useEffect(() => {
    if (open) {
      setProd("");
    }
  }, [open]);
  const save = () => {
    if (!prodId) return;
    const rec: Scale = {
      id: uuid(),
      roomId,
      productId: prodId,
      alerts: false,
      x: snap(0),
      y: snap(0),
    };
    insert("scales", rec);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Scale"
      onClose={onClose}
      onSubmit={save}
      submitLabel="Add scale"
      width={400}
    >
      <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        Select product*
        <SearchSelect value={prodId} onChange={setProd} options={prodOpts} />
      </label>
    </Modal>
  );
}
