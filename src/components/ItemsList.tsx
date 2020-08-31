import React from "react";
import { Item } from "../App";
import ItemsListItem from "./ItemsListItem";

export interface ItemsListProps {
  items: Array<Item>;
  removeItem: (index: number) => void;
  updateItem: (index: number, item: Item) => void;
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
            update={(item) => updateItem(index, item)}
            remove={() => removeItem(index)}
          />
        );
      })}
    </ul>
  );
};

export default ItemsList;
