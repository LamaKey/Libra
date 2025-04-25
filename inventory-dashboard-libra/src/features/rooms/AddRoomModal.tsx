import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import styles from "./AddRoomModal.module.css";
import { insert } from "../../utils/storage";
import { Room } from "./types";
import { v4 as uuid } from "uuid";
import { branchOptions } from "../../utils/branchOptions";
import SearchSelect from "../../components/SearchSelect";

export default function AddRoomModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [location, setLoc] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setLoc("");
    }
  }, [open]);
  const submit = () => {
    if (!name.trim() || !location.trim()) return;
    const record: Room = { id: uuid(), name, location, alerts: 0, scales: 0 };
    insert("rooms", record);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Room"
      onClose={onClose}
      onSubmit={submit}
      submitLabel="Add room"
    >
      <div className={styles.form}>
        <label>
          Room Name*
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter room name"
          />
        </label>
        <label>
          Location
          <SearchSelect
            value={location}
            onChange={setLoc}
            options={branchOptions()}
            placeholder="Select branch"
          />
        </label>
      </div>
    </Modal>
  );
}
