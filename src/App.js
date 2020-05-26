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
      <div class="row align-items-center">
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
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [newName, setNewName] = useState("");
  function toggleEditing(index) {
    if (editingItemIndex === index) {
      setEditingItemIndex(null);
      setNewName("");
    } else {
      setEditingItemIndex(index);
      setNewName(items[index].name);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    updateItem(editingItemIndex, { ...items[editingItemIndex], name: newName });

    setNewName("");
    setEditingItemIndex(null);
  }

  function handleNewNameChange(event) {
    setNewName(event.target.value);
  }

  function incrementItemQuantity(index, item) {
    updateItem(index, { ...item, quantity: item.quantity + 1 });
  }

  function decrementItemQuantity(index, item) {
    updateItem(index, { ...item, quantity: item.quantity - 1 });
  }

  return (
    <ul className="list-group">
      {items.map((item, index) => {
        return (
          <li className="list-group-item" key={index}>
            <div class="row align-items-center">
              <div class="col-2 text-right">{item.quantity}</div>
              <div class="col-2 text-center">&times;</div>
              {index === editingItemIndex ? (
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNewNameChange}
                    ref={newNameInput => newNameInput && newNameInput.focus()}
                  />
                  <button type="submit" hidden>
                    Submit
                  </button>
                </form>
              ) : (
                <div className="col">{item.name}</div>
              )}
              <div className="col-2">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => removeItem(index)}
                >
                  &times;
                </button>
              </div>
              <span hidden>
                <button onClick={() => incrementItemQuantity(index, item)}>
                  +
                </button>
                <button onClick={() => decrementItemQuantity(index, item)}>
                  -
                </button>
                <button onClick={() => removeItem(index)}>remove</button>
                <button onClick={() => toggleEditing(index)}>edit</button>
              </span>
            </div>
          </li>
        );
      })}
    </ul>
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
