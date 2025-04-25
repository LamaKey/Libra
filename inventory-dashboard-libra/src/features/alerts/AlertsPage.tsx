import { useState } from "react";
import TableToolbar from "../../components/TableToolbar";
import PaginatedTable from "../../components/PaginatedTable";
import { query, remove } from "../../utils/storage";
import { Alert } from "./types";
import { Room } from "../rooms/types";

export default function AlertsPage() {
  const [search, setSearch] = useState("");

  const alerts = query<Alert>("alerts")
    .filter((a) => a.message.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const clearAll = () => {
    alerts.forEach((a) => remove("alerts", a.id));
    window.location.reload();
  };

  return (
    <>
      <TableToolbar
        title="Alerts"
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search alerts",
        }}
        onAdd={clearAll}
        addLabel="Clear All"
      />

      <PaginatedTable
        data={alerts}
        cols={[
          {
            key: "room",
            header: "Room",
            render: (a) => {
              const room = query<Room>("rooms").find(
                (r) => r.id === (a as Alert).roomId
              );
              return room?.name ?? "—";
            },
          },
          { key: "message", header: "Alert" },
          {
            key: "date",
            header: "Date",
            render: (a) => new Date((a as Alert).date).toLocaleString(),
          },
        ]}
      />
    </>
  );
}
