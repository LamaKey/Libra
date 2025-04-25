import React, { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import { Branch } from "./types";
import { insert } from "../../utils/storage";
import { v4 as uuid } from "uuid";
import { fileToDataURL } from "../../utils/fileToDataURL";
import { required } from "../../utils/validators";

export default function AddBranchModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [img, setImg] = useState<string>();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [street, setStreet] = useState("");
  const [contact, setContact] = useState("");
  const [zip, setZip] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (open) {
      setImg("");
      setName("");
      setAddress("");
      setStreet("");
      setContact("");
      setZip("");
      setSubmitted(false);
    }
  }, [open]);
  const pickImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImg(await fileToDataURL(e.target.files[0]));
  };

  const errors = {
    name: required(name),
    address: required(address),
    street: required(street),
    contact: required(contact),
  };
  const isValid = Object.values(errors).every((e) => !e);

  const save = () => {
    setSubmitted(true);
    if (!isValid) return;

    const rec: Branch = {
      id: uuid(),
      name,
      address,
      street,
      contact,
      img,
      zipcode: zip,
    };
    insert<Branch>("branches", rec);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="New Branch"
      width={480}
      onClose={onClose}
      onSubmit={save}
      submitLabel="Add branch"
    >
      <label>
        Image
        <input type="file" accept="image/*" onChange={pickImg} />
      </label>

      <label>
        Branch name*
        <input
          placeholder="Enter branch name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {submitted && errors.name && (
          <small className="err">{errors.name}</small>
        )}
      </label>

      <label>
        Address*
        <input
          placeholder="Address line 1"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        {submitted && errors.address && (
          <small className="err">{errors.address}</small>
        )}
      </label>

      <label>
        Street*
        <input
          placeholder="Street / area"
          value={street}
          onChange={(e) => setStreet(e.target.value)}
        />
        {submitted && errors.street && (
          <small className="err">{errors.street}</small>
        )}
      </label>

      <label>
        Contact*
        <input
          placeholder="Phone #"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        {submitted && errors.contact && (
          <small className="err">{errors.contact}</small>
        )}
      </label>

      <label>
        ZIP code
        <input
          placeholder="Optional"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
        />
      </label>
    </Modal>
  );
}
