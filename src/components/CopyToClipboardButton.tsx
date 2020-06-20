import React, { useState } from "react";
import { Item } from "../App";

export interface CopyToClipboardButtonProps {
  items: Array<Item>;
}

const CopyToClipboardButton: React.FC<CopyToClipboardButtonProps> = ({
  items,
}) => {
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

export default CopyToClipboardButton;
