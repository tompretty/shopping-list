import React, { useState, useRef } from "react";

function ItemsForm({ addItem }) {
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const quantityInput = useRef(null);

  function handleSubmit(event) {
    event.preventDefault();

    addItem(quantity, name);
    resetState();

    quantityInput.current.focus();
  }

  function resetState() {
    setQuantity("");
    setName("");
  }

  function handleQuantityChange(event) {
    setQuantity(event.target.value);
  }

  function handleNameChange(event) {
    setName(event.target.value);
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
      <input type="text" onChange={handleNameChange} value={name} />
      <button type="submit" hidden>
        Submit
      </button>
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
    setItems([...items, { quantity: quantity, name: name }]);
  }

  return (
    <div className="App">
      <ItemsForm addItem={addItem} />
      <ItemsList items={items} />
    </div>
  );
}

export default App;
