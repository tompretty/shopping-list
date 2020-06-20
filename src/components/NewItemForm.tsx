import React, { useState, useRef } from "react";

export interface NewItemFormProps {
  completions: Array<string>;
  addItem: (name: string, quantity: number) => void;
}

const NewItemForm: React.FC<NewItemFormProps> = ({ completions, addItem }) => {
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");

  const form = useRef<HTMLFormElement>(null);
  const quantityInput = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.current && form.current.reportValidity()) {
      addItem(name, parseFloat(quantity));
      resetState();
    }
  }

  function resetState() {
    setQuantity("");
    setName("");

    quantityInput.current && quantityInput.current.focus();
  }

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setQuantity(event.target.value);
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setName(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit} ref={form} noValidate>
      <div className="form-row align-items-center font-weight-bold">
        <label className="col-3" htmlFor="quantityInput">
          Quantity
        </label>
        <div className="col-1"></div>
        <label className="col-8" htmlFor="nameInput">
          Name
        </label>
      </div>

      <div className="form-row align-items-center">
        <div className="col-3">
          <input
            id="quantityInput"
            type="number"
            className="form-control"
            onChange={handleQuantityChange}
            value={quantity}
            ref={quantityInput}
            required
          />
        </div>
        <div className="col-1 text-center">&times;</div>
        <div className="col-6">
          <input
            id="nameInput"
            type="text"
            list="completions"
            className="form-control"
            onChange={handleNameChange}
            value={name}
            required
          />
          <datalist id="completions">
            {completions.map((completion, index) => {
              return <option value={completion} key={index} />;
            })}
          </datalist>
        </div>
        <div className="col-2">
          <button className="btn btn-secondary btn-block" type="submit">
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default NewItemForm;
