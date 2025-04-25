import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import SearchSelect, { Option } from "../../components/SearchSelect";
import { query, insert } from "../../utils/storage";
import { Supplier } from "../suppliers/types";
import { Product } from "./types";
import { fileToDataURL } from "../../utils/fileToDataURL";
import { required, positiveNumber } from "../../utils/validators";
import { v4 as uuid } from "uuid";
import { branchOptions } from "../../utils/branchOptions";

export default function AddProductModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const supplierOpts: Option[] = query<Supplier>("suppliers").map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const [img, setImg] = useState<string>();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [location, setLoc] = useState("");
  const [suppliers, setSup] = useState<string[]>([]);
  const [currency, setCur] = useState("USD");
  const [submitted, setSub] = useState(false);

  useEffect(() => {
    if (open) {
      setImg("");
      setName("");
      setPrice("");
      setLoc("");
      setSup([]);
      setCur("USD");
      setSub(false);
    }
  }, [open]);

  const errors = {
    name: required(name),
    price: required(price) || positiveNumber(price),
    suppliers: suppliers.length ? "" : "Select ≥1 supplier",
  };
  const isValid = Object.values(errors).every((e) => !e);

  const numberOnly = (s: string) => s.replace(/[^0-9.]/g, "");
  const pickImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImg(await fileToDataURL(e.target.files[0]));
  };

  const save = () => {
    setSub(true);
    if (!isValid) return;

    const rec: Product = {
      id: uuid(),
      name,
      price: +price,
      qty: 0,
      unitWeight: 0,
      low: false,
      suppliers,
      location,
      img,
      currency,
    };
    insert("products", rec);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Product"
      onClose={onClose}
      width={520}
      onSubmit={save}
      submitLabel="Add product"
    >
      <label>
        Image <input type="file" accept="image/*" onChange={pickImg} />
      </label>

      <label>
        Product name*
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter product name"
        />
        {submitted && errors.name && (
          <small className="err">{errors.name}</small>
        )}
      </label>

      <label>
        Buying price*
        <input
          value={price}
          onChange={(e) => setPrice(numberOnly(e.target.value))}
          placeholder="0.00"
        />
        {submitted && errors.price && (
          <small className="err">{errors.price}</small>
        )}
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

      <label>
        Suppliers*
        <SearchSelect
          value={suppliers}
          onChange={setSup}
          options={supplierOpts}
          multi
          placeholder="Select suppliers"
        />
        {submitted && errors.suppliers && (
          <small className="err">{errors.suppliers}</small>
        )}
      </label>

      <label>
        Currency
        <SearchSelect
          value={currency}
          onChange={setCur}
          options={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
        />
      </label>

      <p style={{ fontSize: 13, color: "#666", marginTop: 24 }}>
        Stock quantity is calculated automatically from scale readings.
      </p>
    </Modal>
  );
}
