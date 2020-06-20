import React, { useState, useEffect, useRef } from "react";
import NewItemForm from "./components/NewItemForm";

interface ItemsListProps {
  items: Array<Item>;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Item) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
  items,
  removeItem,
  updateItem,
}) => {
  return (
    <ul className="list-group">
      {items.map((item, index) => {
        return (
          <ItemsListItem
            item={item}
            key={index}
            update={(item) => updateItem(index, item)}
            remove={() => removeItem(index)}
          />
        );
      })}
    </ul>
  );
};

interface ItemsListItemProps {
  item: Item;
  remove: () => void;
  update: (newItem: Item) => void;
}

const ItemsListItem: React.FC<ItemsListItemProps> = ({
  item,
  remove,
  update,
}) => {
  const [state, setState] = useState("showing"); // showing | editing-quantity | editing-name
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

interface CopyToClipboardProps {
  items: Array<Item>;
}

const CopyToClipboardButton: React.FC<CopyToClipboardProps> = ({ items }) => {
  const [text, setText] = useState("Copy to clipboard");

  function copyToClipboard() {
    let textArea = document.createElement("textarea");
    textArea.value = itemsToString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setText("Copied!");
    setTimeout(() => setText("Copy to clipboard"), 2000);
  }

  function itemsToString() {
    return items.map((item) => `${item.quantity} x ${item.name}`).join("\n");
  }

  return (
    <div className="" style={{ width: "175px" }}>
      <button
        type="button"
        className="btn btn-secondary btn-block"
        onClick={copyToClipboard}
      >
        {text}
      </button>
    </div>
  );
};

interface Item {
  name: string;
  quantity: number;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Array<Item>>(
    JSON.parse(localStorage.getItem("items") || "[]")
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function getCompletions(): Array<string> {
    return items.map((item) => item.name);
  }

  function addItem(name: string, quantity: number): void {
    const id = items.findIndex((item) => item.name === name);
    if (id > -1) {
      const item = items[id];
      updateItem(id, { ...item, quantity: item.quantity + quantity });
    } else {
      addNewItem(name, quantity);
    }
  }

  function addNewItem(name: string, quantity: number): void {
    setItems([...items, { name: name, quantity: quantity }]);
  }

  function updateItem(id: number, item: Item) {
    var newItems = [...items];
    newItems[id] = item;
    setItems(newItems);
  }

  function removeItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  function startNewList() {
    setItems([]);
  }

  return (
    <div className="App d-flex flex-column container mt-5">
      <header className="d-flex align-items-center">
        <span className="h1" role="img" aria-label="shopping cart">
          &#128722;
        </span>
        <h1 className="ml-4">Build My Shopping List</h1>
      </header>

      <div className="mt-3">
        <NewItemForm completions={getCompletions()} addItem={addItem} />
      </div>

      <div className="mt-4">
        <ItemsList
          items={items}
          updateItem={updateItem}
          removeItem={removeItem}
        />
      </div>
      <div className="d-flex justify-content-between mt-4">
        <CopyToClipboardButton items={items} />

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={startNewList}
        >
          Start new list
        </button>
      </div>
    </div>
  );
};

export default App;
