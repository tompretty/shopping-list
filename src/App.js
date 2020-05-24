import React, { useState, useRef } from "react";

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

function ItemsList({ items }) {
  return (
    <ul>
      {items.map((item, index) => {
        return (
          <li key={index}>
            <span>{item.quantity}</span>
            <span>&times;</span>
            <span>{item.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

function App() {
  const [items, setItems] = useState([]);

  function addItem(quantity, name) {
    let id = items.findIndex(item => item.name === name);
    if (id >= 0) {
      updateItem(id, quantity);
    } else {
      addNewItem(quantity, name);
    }
  }

  function addNewItem(quantity, name) {
    setItems([...items, { quantity: quantity, name: name }]);
  }

  function updateItem(id, quantity) {
    var newItems = [...items];
    newItems[id].quantity += quantity;
    setItems(newItems);
  }

  return (
    <div className="App">
      <ItemsForm items={items} addItem={addItem} />
      <ItemsList items={items} />
    </div>
  );
}

export default App;
