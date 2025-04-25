import { useState } from "react";
import TableToolbar from "../../components/TableToolbar";
import PaginatedTable from "../../components/PaginatedTable";
import AddSupplierModal from "./AddSupplierModal";
import { query, remove } from "../../utils/storage";
import { Supplier } from "./types";
import { FiUser, FiTrash2 } from "react-icons/fi";

export default function SuppliersPage() {
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);

  const suppliers = query<Supplier>("suppliers").filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <TableToolbar
        title="Suppliers"
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search supplier",
        }}
        onAdd={() => setShowAdd(true)}
        addLabel="Add Supplier"
      />

      <PaginatedTable
        data={suppliers}
        cols={[
          {
            key: "img",
            header: "",
            render: (s: Supplier) =>
              s.img ? (
                <img
                  src={s.img}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
              ) : (
                <FiUser size={28} color="#9e9e9e" />
              ),
          },
          { key: "name", header: "Supplier Name" },
          { key: "contact", header: "Contact Number" },
          { key: "email", header: "Email" },
          {
            key: "del",
            header: "",
            render: (s: Supplier) => (
              <button
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => {
                  if (confirm("Delete this supplier?")) {
                    remove("suppliers", s.id);
                  }
                }}
              >
                <FiTrash2 size={18} color="#d32f2f" />
              </button>
            ),
          },
        ]}
      />

      <AddSupplierModal open={showAdd} onClose={() => setShowAdd(false)} />
    </>
  );
}
