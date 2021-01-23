import React from "react";
import { Item } from "../App";
import ItemsListItem from "./ItemsListItem";

export interface ItemsListProps {
  items: Item[];
  removeItem: (index: number) => void;
  updateItem: (index: number, updates: Partial<Item>) => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
  items,
  removeItem,
  updateItem,
}: ItemsListProps) => {
  return (
    <ul className="list-group">
      {items.map((item, index) => {
        return (
          <ItemsListItem
            item={item}
            key={index}
            update={(updates) => updateItem(index, updates)}
            remove={() => removeItem(index)}
          />
        );
      })}
    </ul>
  );
};

export default ItemsList;
