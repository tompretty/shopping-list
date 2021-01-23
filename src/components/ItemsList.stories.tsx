import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import { DragDropContext, Droppable } from "react-beautiful-dnd";
import ItemsList, { ItemsListProps } from "./ItemsList";

export default {
  title: "ItemsList",
  component: ItemsList,
} as Meta;

const onDragEnd = () => {
  console.log("onDragEnd");
};

const Template: Story<ItemsListProps> = (args) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="all-categories" type="category">
      {(provided) => (
        <div {...provided.droppableProps} ref={provided.innerRef}>
          <ItemsList {...args} />

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export const Default = Template.bind({});
Default.args = {
  index: 0,
  category: {
    id: "category-1",
    name: "Veg",
    itemIds: ["item-1", "item-2", "item-3"],
  },
  items: [
    { id: "item-1", name: "Apples", quantity: 3 },
    { id: "item-2", name: "Pears", quantity: 40 },
    { id: "item-3", name: "Mushrooms", quantity: 500 },
  ],
};
