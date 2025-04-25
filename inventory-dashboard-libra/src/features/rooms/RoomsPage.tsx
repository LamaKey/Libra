import { useState } from "react";
import { useNavigate } from "react-router-dom";
import TableToolbar from "../../components/TableToolbar";
import PaginatedTable from "../../components/PaginatedTable";
import AddRoomModal from "./AddRoomModal";
import { query, remove } from "../../utils/storage";
import { Room, Scale } from "./types";
import { Option } from "../../components/SearchSelect";
import { FiTrash2 } from "react-icons/fi";
import { Alert } from "../alerts/types";

export default function RoomsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [loc, setLoc] = useState("");
  const branchMap = Object.fromEntries(
    query<{ id: string; name: string }>("branches").map((b) => [b.id, b.name])
  );

  const locations = Array.from(
    new Set(
      query<Room>("rooms")
        .map((r) => r.location)
        .filter(Boolean)
    )
  );
  const locOpts: Option[] = [
    { value: "", label: "All" },
    ...locations.map((id) => ({
      value: id,
      label: branchMap[id] ?? "Unknown",
    })),
  ];

  const rooms = query<Room>("rooms")
    .filter((r) => !loc || r.location === loc)
    .filter((r) => r.name.toLowerCase().includes(search.toLowerCase()));

  const [showAdd, setShowAdd] = useState(false);

  return (
    <>
      <TableToolbar
        title="Rooms"
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search room",
        }}
        combinedFilters={{
          location: { value: loc, onChange: setLoc, options: locOpts },
        }}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Room"
      />

      <PaginatedTable
        cols={[
          { key: "name", header: "Rooms" },
          {
            key: "location",
            header: "Location",
            render: (r) => branchMap[(r as Room).location] ?? "—",
          },
          {
            key: "scales",
            header: "Scales",
            render: (r) => {
              const cnt = query<Scale>("scales").filter(
                (s) => s.roomId === (r as Room).id && s.id != null
              ).length;
              return cnt;
            },
          },
          {
            key: "alerts",
            header: "Alerts",
            render: (r) => {
              const cnt = query<Alert>("alerts").filter(
                (a) => a.roomId === (r as Room).id
              ).length;
              const colour =
                cnt === 0
                  ? "var(--color-success-600)"
                  : cnt <= 5
                  ? "var(--color-warning-600)"
                  : "var(--color-error-600)";

              return (
                <span style={{ color: colour, fontWeight: 600 }}>
                  {cnt || "No"} Alerts
                </span>
              );
            },
          },
          {
            key: "del",
            header: "",
            render: (r) => (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (confirm("Delete this room?")) {
                    remove("rooms", (r as Room).id);
                  }
                }}
              >
                <FiTrash2 size={18} color="#d32f2f" />
              </button>
            ),
          },
        ]}
        data={rooms}
        onRowClick={(r) => navigate(`/rooms/${r.id}`)}
      />

      <AddRoomModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
