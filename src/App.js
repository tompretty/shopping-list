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
      <input
        type="number"
        onChange={handleQuantityChange}
        value={quantity}
        ref={quantityInput}
      />
      <span>&times;</span>
      <input
        type="text"
        onChange={handleNameChange}
        onFocus={() => setSelectedCompletion("")}
        value={name}
      />
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
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            <span>{item.quantity}</span>
            <span>&times;</span>
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
              <span>{item.name}</span>
            )}
            <span>
              <button onClick={() => incrementItemQuantity(index, item)}>
                +
              </button>
              <button onClick={() => decrementItemQuantity(index, item)}>
                -
              </button>
              <button onClick={() => removeItem(index)}>remove</button>
              <button onClick={() => toggleEditing(index)}>edit</button>
            </span>
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
    <div className="App">
      <ItemsForm items={items} addItem={addItem} />
      <ItemsList
        items={items}
        updateItem={updateItem}
        removeItem={removeItem}
      />
      <button onClick={startNewList}>Start new list</button>
      <button onClick={copyToClipboard}>Copy to clipboard</button>
    </div>
  );
}

export default App;
