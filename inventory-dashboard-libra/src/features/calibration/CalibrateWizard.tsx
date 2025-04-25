import { useState } from "react";
import Modal from "../../components/Modal";
import SearchSelect, { Option } from "../../components/SearchSelect";
import { query, update } from "../../utils/storage";
import { Product } from "../products/types";
import { sanitizeNumberInput } from "../../utils/sanitizeNumberInput";

export default function CalibrateWizard({
  open,
  onClose,
  product,
}: {
  open: boolean;
  onClose: () => void;
  product?: Product;
}) {
  const products = query<Product>("products");
  const prodOpts: Option[] = products.map((p) => ({
    value: p.id,
    label: p.name,
  }));
  const [prodId, setProd] = useState(product?.id ?? "");
  const [crateWeight, setCrateWeight] = useState("");
  const [unitWeight, setUnitWeight] = useState("");
  const [units, setUnits] = useState("");

  const chosen = product ?? products.find((p) => p.id === prodId);

  const canSave =
    chosen &&
    +crateWeight > 0 &&
    +unitWeight > 0 &&
    +units > 0 &&
    Number.isFinite(+crateWeight) &&
    Number.isFinite(+unitWeight) &&
    Number.isFinite(+units);

  const save = () => {
    if (!chosen) return;
    update<Product>("products", chosen.id, {
      crateWeight: +crateWeight,
      unitWeight: +unitWeight,
      unitsPerCrate: +units,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title="Calibration"
      onClose={onClose}
      onSubmit={save}
      submitLabel="Save"
      submitDisabled={!canSave}
      width={420}
    >
      {!chosen && (
        <label>
          Select product*
          <SearchSelect
            value={prodId}
            onChange={setProd}
            options={prodOpts}
            placeholder="Search product"
          />
        </label>
      )}

      {chosen && (
        <>
          <p>
            Calibrating&nbsp;<strong>{chosen.name}</strong>
          </p>
          <label>
            Empty crate weight (g)*
            <input
              value={crateWeight}
              placeholder="e.g. 1050.5"
              onChange={(e) =>
                setCrateWeight(sanitizeNumberInput(e.target.value))
              }
            />
          </label>

          <label>
            Single unit weight (g)*
            <input
              value={unitWeight}
              placeholder="e.g. 330.25"
              onChange={(e) =>
                setUnitWeight(sanitizeNumberInput(e.target.value))
              }
            />
          </label>

          <label>
            Max units per crate*
            <input
              value={units}
              placeholder="e.g. 24"
              onChange={(e) => setUnits(sanitizeNumberInput(e.target.value))}
            />
          </label>
        </>
      )}
    </Modal>
  );
}
