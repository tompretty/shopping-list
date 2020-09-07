import React, { useRef } from "react";
import { useForm } from "react-hook-form";

export interface NewItemFormProps {
  completions: Array<string>;
  addItem: (name: string, quantity: number) => void;
}

interface FormData {
  quantity: string;
  name: string;
}

const NewItemForm: React.FC<NewItemFormProps> = ({
  completions,
  addItem,
}: NewItemFormProps) => {
  const { register, handleSubmit, errors, reset } = useForm<FormData>();
  const quantityInputRef = useRef<HTMLInputElement | null>(null);

  const focusQuantityInput = () => {
    quantityInputRef.current?.focus();
  };

  const onSubmit = ({ quantity, name }: FormData) => {
    addItem(name, parseFloat(quantity));
    reset();
    focusQuantityInput();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-row align-items-center font-weight-bold">
        <label className="col-3" htmlFor="quantity">
          Quantity
        </label>
        <div className="col-1"></div>
        <label className="col-8" htmlFor="name">
          Name
        </label>
      </div>

      <div className="form-row">
        <div className="col-3">
          <input
            ref={(ref) => {
              register(ref, { required: true });
              quantityInputRef.current = ref;
            }}
            name="quantity"
            id="quantity"
            type="number"
            className={`form-control ${errors.quantity ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">Please enter a quantity</div>
        </div>
        <div className="col-1 text-center">&times;</div>
        <div className="col-6">
          <input
            ref={register({ required: true })}
            name="name"
            id="name"
            type="text"
            list="completions"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          <div className="invalid-feedback">Please enter a name</div>
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
