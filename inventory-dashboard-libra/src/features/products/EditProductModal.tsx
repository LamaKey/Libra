// src/features/products/EditProductModal.tsx
import React, { useState } from 'react';
import Modal from '../../components/Modal';
import SearchSelect, { Option } from '../../components/SearchSelect';
import { query, update } from '../../utils/storage';
import { fileToDataURL } from '../../utils/fileToDataURL';
import { required, positiveNumber } from '../../utils/validators';
import { Product } from './types';
import { Supplier } from '../suppliers/types';
import { branchOptions } from '../../utils/branchOptions';

export default function EditProductModal({
  open,
  onClose,
  product
}: {
  open: boolean;
  onClose: () => void;
  product: Product;
}) {
  const supplierOpts: Option[] = query<Supplier>('suppliers').map(s => ({
    value: s.id,
    label: s.name
  }));

  const branchOpts: Option[] = branchOptions();

  const [state, setState] = useState<Product>({ ...product });
  const [submitted, setSubmitted] = useState(false);

  const errors = {
    name: required(state.name),
    price: positiveNumber(state.price.toString())
  };
  const isValid = Object.values(errors).every(e => !e);

  const currencyOpts: Option[] = [
    { value: 'USD', label: 'USD' },
    { value: 'EUR', label: 'EUR' },
    { value: 'GBP', label: 'GBP' }
  ];

  const pickImg = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const dataUrl = await fileToDataURL(e.target.files[0]);
      setState({ ...state, img: dataUrl });
    }
  };

  const change = (k: keyof Product) => (e: any) =>
    setState({ ...state, [k]: e.target.value });

  const save = () => {
    setSubmitted(true);
    if (!isValid) return;
    update<Product>('products', product.id, state);
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Edit product"
      onClose={onClose}
      onSubmit={save}
      submitLabel="Save"
    >
      <label>
        Image
        <input type="file" accept="image/*" onChange={pickImg} />
      </label>

      <label>
        Name*
        <input value={state.name} onChange={change('name')} />
        {submitted && errors.name && <small className="err">{errors.name}</small>}
      </label>

      <label>
        Price*
        <input value={state.price} onChange={change('price')} />
        {submitted && errors.price && <small className="err">{errors.price}</small>}
      </label>

      <label>
        Location
        <SearchSelect
          value={state.location ?? ''}
          onChange={v => setState({ ...state, location: v })}
          options={branchOpts}
          placeholder="Select branch"
        />
      </label>

      <label>
        Suppliers*
        <SearchSelect
          value={state.suppliers}
          onChange={(v: string[]) => setState({ ...state, suppliers: v })}
          options={supplierOpts}
          multi
        />
      </label>

      <label>
        Currency
        <SearchSelect
          value={state.currency ?? 'USD'}
          onChange={(v: string) => setState({ ...state, currency: v })}
          options={currencyOpts}
        />
      </label>

      <p style={{ fontSize: 13, color: '#666', marginTop: 24 }}>
        Stock is calculated from scale readings.&nbsp;
        Use <strong>Calibrate</strong> to update weight parameters.
      </p>
    </Modal>
  );
}
