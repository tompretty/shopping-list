import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { Item } from "../App";

export interface ItemsListItemProps {
  item: Item;
  remove: () => void;
  update: (updates: Partial<Item>) => void;
}

type state = "SHOWING" | "EDITING-QUANTITY" | "EDITING-NAME";

interface QuantityFormData {
  quantity: string;
}
interface NameFormData {
  name: string;
}

const ItemsListItem: React.FC<ItemsListItemProps> = ({
  item,
  remove,
  update,
}: ItemsListItemProps) => {
  const [state, setState] = useState<state>("SHOWING");
  const {
    register: registerQuantity,
    handleSubmit: handleSubmitQuantity,
    errors: quantityErrors,
  } = useForm<QuantityFormData>({
    defaultValues: { quantity: item.quantity.toString() },
  });

  const {
    register: registerName,
    handleSubmit: handleSubmitName,
    errors: nameErrors,
  } = useForm<NameFormData>({
    defaultValues: { name: item.name },
  });

  const onSubmitQuantity = ({ quantity }: QuantityFormData) => {
    update({ ...item, quantity: parseFloat(quantity) });
    reset();
  };

  const onSubmitName = ({ name }: NameFormData) => {
    update({ name });
    reset();
  };

  const reset = () => setState("SHOWING");

  useEffect(() => {
    if (state === "EDITING-QUANTITY") {
      newQuantityInput.current?.focus();
      newQuantityInput.current?.select();
    } else if (state === "EDITING-NAME") {
      newNameInput.current?.focus();
      newNameInput.current?.select();
    }
  }, [state]);

  const newQuantityInput = useRef<HTMLInputElement | null>(null);
  const newNameInput = useRef<HTMLInputElement | null>(null);

  return (
    <li className="list-group-item">
      <div className="row">
        <div className="col-2 text-right">
          {state === "EDITING-QUANTITY" ? (
            <form onSubmit={handleSubmitQuantity(onSubmitQuantity)}>
              <input
                ref={(ref) => {
                  registerQuantity(ref, { required: true });
                  newQuantityInput.current = ref;
                }}
                onBlur={reset}
                name="quantity"
                className={classNames("form-control", "form-control-sm", {
                  "is-invalid": quantityErrors.quantity,
                })}
                type="number"
              />
              <div className="invalid-feedback">Please enter a quantity</div>
              <button type="submit" hidden>
                Submit
              </button>
            </form>
          ) : (
            <div onClick={() => setState("EDITING-QUANTITY")}>
              {item.quantity}
            </div>
          )}
        </div>

        <div className="col-2 text-center">&times;</div>

        <div className="col-6">
          {state === "EDITING-NAME" ? (
            <form onSubmit={handleSubmitName(onSubmitName)}>
              <input
                ref={(ref) => {
                  registerName(ref, { required: true });
                  newNameInput.current = ref;
                }}
                onBlur={reset}
                name="name"
                className={classNames("form-control", "form-control-sm", {
                  "is-invalid": nameErrors.name,
                })}
                type="text"
              />
              <div className="invalid-feedback">Please enter a name</div>
              <button type="submit" hidden>
                Submit
              </button>
            </form>
          ) : (
            <div onClick={() => setState("EDITING-NAME")}>{item.name}</div>
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
