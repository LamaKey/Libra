import React, { useState, useEffect } from "react";
import Modal from "../../components/Modal";
import { Supplier } from "./types";
import { insert } from "../../utils/storage";
import { v4 as uuid } from "uuid";
import { fileToDataURL } from "../../utils/fileToDataURL";
import { required, emailFormat, positiveNumber } from "../../utils/validators";

export default function AddSupplierModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [img, setImg] = useState<string>();
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  useEffect(() => {
    if (open) {
      setImg("");
      setName("");
      setContact("");
      setEmail("");
      setSubmitted(false);
    }
  }, [open]);
  const errors = {
    name: required(name),
    contact: required(contact) || positiveNumber(contact),
    email: required(email) || emailFormat(email),
  };
  const isValid = Object.values(errors).every((e) => !e);

  const pickImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImg(await fileToDataURL(e.target.files[0]));
  };

  const save = () => {
    setSubmitted(true);
    if (!isValid) return;
    insert<Supplier>("suppliers", { id: uuid(), name, contact, email, img });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Supplier"
      onClose={onClose}
      onSubmit={save}
      submitLabel="Add supplier"
      width={420}
    >
      <label>
        Image
        <input type="file" accept="image/*" onChange={pickImg} />
      </label>

      <label>
        Supplier name*
        <input
          placeholder="Enter supplier name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {submitted && errors.name && (
          <small className="err">{errors.name}</small>
        )}
      </label>

      <label>
        Contact number*
        <input
          placeholder="Phone #"
          value={contact}
          onChange={(e) => setContact(e.target.value.replace(/\D/g, ""))}
        />
        {submitted && errors.contact && (
          <small className="err">{errors.contact}</small>
        )}
      </label>

      <label>
        Email*
        <input
          placeholder="someone@mail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {submitted && errors.email && (
          <small className="err">{errors.email}</small>
        )}
      </label>
    </Modal>
  );
}
