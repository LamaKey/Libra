import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import SearchSelect, { Option } from "../../components/SearchSelect";
import { query, insert } from "../../utils/storage";
import { Product } from "../products/types";
import { Supplier } from "../suppliers/types";
import { Order } from "./types";
import { required, positiveNumber, dateRequired } from "../../utils/validators";
import { v4 as uuid } from "uuid";

export default function AddOrderModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const productOpts: Option[] = query<Product>("products").map((p) => ({
    value: p.id,
    label: p.name,
  }));
  const supplierOpts: Option[] = query<Supplier>("suppliers").map((s) => ({
    value: s.id,
    label: s.name,
  }));

  const [product, setProduct] = useState("");
  const [supplier, setSupplier] = useState("");
  const [qty, setQty] = useState("");
  const [value, setValue] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [delivery, setDelivery] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setProduct("");
      setSupplier("");
      setQty("");
      setValue("");
      setDelivery("");
      setCurrency("USD");
      setSubmitted(false);
    }
  }, [open]);

  const num = (s: string) => s.replace(/[^0-9.]/g, "");

  const errors = {
    product: required(product),
    supplier: required(supplier),
    qty: required(qty) || positiveNumber(qty),
    value: required(value) || positiveNumber(value),
    delivery: dateRequired(delivery),
  };
  const isValid = Object.values(errors).every((e) => !e);

  const save = () => {
    setSubmitted(true);
    if (!isValid) return;
    insert<Order>("orders", {
      id: uuid(),
      product,
      supplier,
      qty: +qty,
      value: +value,
      currency,
      delivery,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Order"
      onClose={onClose}
      onSubmit={save}
      submitLabel="Add order"
      width={500}
    >
      <label>
        Product*
        <SearchSelect
          value={product}
          onChange={setProduct}
          options={productOpts}
          placeholder="Select product"
        />
        {submitted && errors.product && (
          <small className="err">{errors.product}</small>
        )}
      </label>

      <label>
        Supplier*
        <SearchSelect
          value={supplier}
          onChange={setSupplier}
          options={supplierOpts}
          placeholder="Select supplier"
        />
        {submitted && errors.supplier && (
          <small className="err">{errors.supplier}</small>
        )}
      </label>

      <label>
        Quantity*
        <input
          placeholder="e.g. 50"
          value={qty}
          onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
        />
        {submitted && errors.qty && <small className="err">{errors.qty}</small>}
      </label>

      <label>
        Order value*
        <input
          placeholder="0.00"
          value={value}
          onChange={(e) => setValue(num(e.target.value))}
        />
        {submitted && errors.value && (
          <small className="err">{errors.value}</small>
        )}
      </label>

      <label>
        Currency
        <SearchSelect
          value={currency}
          onChange={setCurrency}
          options={[
            { value: "USD", label: "USD" },
            { value: "EUR", label: "EUR" },
            { value: "GBP", label: "GBP" },
          ]}
        />
      </label>

      <label>
        Date of delivery*
        <input
          type="date"
          value={delivery}
          onChange={(e) => setDelivery(e.target.value)}
        />
        {submitted && errors.delivery && (
          <small className="err">{errors.delivery}</small>
        )}
      </label>
    </Modal>
  );
}
