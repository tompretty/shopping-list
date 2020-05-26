import React, { useState, useEffect, useRef } from "react";

function ItemsForm({ items, addItem }) {
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [completions, setCompletions] = useState([]);
  const [selectedCompletion, setSelectedCompletion] = useState("");

  const quantityInput = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();

    if (selectedCompletion) {
      addItem(quantity, selectedCompletion);
    } else {
      addItem(quantity, name);
    }
    resetState();

    quantityInput.current.focus();
  }

  function resetState() {
    setQuantity("");
    setName("");
    setCompletions([]);
    setSelectedCompletion("");
  }

  function handleQuantityChange(event) {
    setQuantity(parseInt(event.target.value));
  }

  function handleNameChange(event) {
    setName(event.target.value);
    updateCompletions(event.target.value);
  }

  function updateCompletions(string) {
    if (string) {
      setCompletions(
        items.filter(item => item.name.includes(string)).map(item => item.name)
      );
    } else {
      setCompletions([]);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="row align-items-center">
        <div className="col-3">
          <input
            type="number"
            className="form-control"
            onChange={handleQuantityChange}
            value={quantity}
            ref={quantityInput}
          />
        </div>
        <div>&times;</div>
        <div className="col">
          <input
            type="text"
            className="form-control"
            onChange={handleNameChange}
            onFocus={() => setSelectedCompletion("")}
            value={name}
          />
        </div>
      </div>
      <button type="submit" hidden>
        Submit
      </button>
      <div>
        <ul>
          {completions.map((completion, index) => {
            return (
              <li key={index}>
                <input
                  type="text"
                  value={completion}
                  onFocus={() => setSelectedCompletion(completion)}
                  readonly
                />
              </li>
            );
          })}
        </ul>
      </div>
    </form>
  );
}

function ItemsList({ items, updateItem, removeItem }) {
  return (
    <ul className="list-group">
      {items.map((item, index) => {
        return (
          <ItemsListItem
            item={item}
            key={index}
            index={index}
            update={item => updateItem(index, item)}
            remove={() => removeItem(index)}
          />
        );
      })}
    </ul>
  );
}

function ItemsListItem({ item, update, remove }) {
  const [state, setState] = useState("showing"); // showing | editing-quantity | editing-name
  const [newName, setNewName] = useState(item.name);
  const [newQuantity, setNewQuantity] = useState(item.quantity);

  function handleSubmit(event) {
    event.preventDefault();

    update({ name: newName, quantity: newQuantity });
    setState("showing");
  }

  return (
    <li className="list-group-item">
      <div className="row align-items-center">
        <div className="col-2 text-right">
          {state === "editing-quantity" ? (
            <form onSubmit={handleSubmit}>
              <input
                className="form-control form-control-sm"
                type="number"
                value={newQuantity}
                onChange={e => setNewQuantity(e.target.value)}
                onBlur={() => setState("showing")}
                ref={newNameInput => newNameInput && newNameInput.focus()}
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

        <div className="col">
          {state === "editing-name" ? (
            <form onSubmit={handleSubmit}>
              <input
                className="form-control form-control-sm"
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onBlur={() => setState("showing")}
                ref={newNameInput => newNameInput && newNameInput.focus()}
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
}

function App() {
  const [items, setItems] = useState(
    JSON.parse(localStorage.getItem("items")) || []
  );

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  function addItem(quantity, name) {
    let id = items.findIndex(item => item.name === name);
    if (id >= 0) {
      let item = items[id];
      updateItem(id, { ...item, quantity: item.quantity + quantity });
    } else {
      addNewItem(quantity, name);
    }
  }

  function addNewItem(quantity, name) {
    setItems([...items, { quantity: quantity, name: name }]);
  }

  function updateItem(index, item) {
    var newItems = [...items];
    newItems[index] = item;
    setItems(newItems);
  }

  function removeItem(id) {
    setItems(items.filter((_, i) => i !== id));
  }

  function startNewList() {
    setItems([]);
  }

  function copyToClipboard() {
    let textArea = document.createElement("textarea");
    textArea.value = itemsToString();
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }

  function itemsToString() {
    return items.map(item => `${item.quantity} x ${item.name}`).join("\n");
  }

  return (
    <div className="App d-flex flex-column container mt-5">
      <ItemsForm items={items} addItem={addItem} />
      <ItemsList
        items={items}
        updateItem={updateItem}
        removeItem={removeItem}
      />
      <div className="d-flex justify-content-between mt-3">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={copyToClipboard}
        >
          Copy to clipboard
        </button>

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
}

export default App;
