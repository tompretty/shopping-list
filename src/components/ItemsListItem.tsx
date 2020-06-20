import React, { useState, useRef } from "react";
import { Item } from "../App";

export interface ItemsListItemProps {
  item: Item;
  remove: () => void;
  update: (newItem: Item) => void;
}

type state = "showing" | "editing-quantity" | "editing-name";

const ItemsListItem: React.FC<ItemsListItemProps> = ({
  item,
  remove,
  update,
}) => {
  const [state, setState] = useState<state>("showing");
  const [newName, setNewName] = useState(item.name);
  const [newQuantity, setNewQuantity] = useState(item.quantity.toString());

  const quantityForm = useRef<HTMLFormElement>(null);
  const nameForm = useRef<HTMLFormElement>(null);

  function handleQuantityChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewQuantity(event.target.value);
  }

  function handleNameChange(event: React.ChangeEvent<HTMLInputElement>) {
    setNewName(event.target.value);
  }

  function handleSubmitQuantity(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    if (quantityForm.current && quantityForm.current.reportValidity()) {
      let newItem = { ...item, quantity: parseInt(newQuantity) };
      update(newItem);
      updateState(newItem);
    }
  }

  function handleSubmitName(event: React.ChangeEvent<HTMLFormElement>) {
    event.preventDefault();
    if (nameForm.current && nameForm.current.reportValidity()) {
      let newItem = { ...item, name: newName };
      update(newItem);
      updateState(newItem);
    }
  }

  function updateState(newItem: Item) {
    setState("showing");
    setNewQuantity(newItem.quantity.toString());
    setNewName(newItem.name);
  }

  function resetState() {
    setState("showing");
    setNewQuantity(item.quantity.toString());
    setNewName(item.name);
  }

  return (
    <li className="list-group-item">
      <div className="row align-items-center">
        <div className="col-2 text-right">
          {state === "editing-quantity" ? (
            <form onSubmit={handleSubmitQuantity} ref={quantityForm} noValidate>
              <input
                className="form-control form-control-sm"
                type="number"
                value={newQuantity}
                onChange={handleQuantityChange}
                onBlur={resetState}
                ref={(newNameInput) => newNameInput && newNameInput.focus()}
                required
              />
              <button type="submit" hidden>
                Submit
              </button>
            </form>
          ) : (
            <div onClick={() => setState("editing-quantity")}>
              {item.quantity}
            </div>
          )}
        </div>

        <div className="col-2 text-center">&times;</div>

        <div className="col-6">
          {state === "editing-name" ? (
            <form onSubmit={handleSubmitName} ref={nameForm} noValidate>
              <input
                className="form-control form-control-sm"
                type="text"
                value={newName}
                onChange={handleNameChange}
                onBlur={resetState}
                ref={(newNameInput) => newNameInput && newNameInput.focus()}
                required
              />
              <button type="submit" hidden>
                Submit
              </button>
            </form>
          ) : (
            <div onClick={() => setState("editing-name")}>{item.name}</div>
          )}
        </div>

        <div className="col-2">
          <button className="btn btn-outline-danger btn-sm" onClick={remove}>
            &times;
          </button>
        </div>
      </div>
    </li>
  );
};

export default ItemsListItem;
