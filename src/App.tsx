import React, { useState, useEffect } from "react";
import NewItemForm from "./components/NewItemForm";
import ItemsList from "./components/ItemsList";
import CopyToClipboardButton from "./components/CopyToClipboardButton"

export interface Item {
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
