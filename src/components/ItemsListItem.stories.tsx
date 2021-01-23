import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ItemsListItem, { ItemsListItemProps } from "./ItemsListItem";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

export default {
  title: "ItemsListItem",
  component: ItemsListItem,
  argTypes: {
    item: { name: "Apples", quantity: 3 },
  },
} as Meta;

const onDragEnd = () => {
  console.log("onDragEnd");
};

const Template: Story<ItemsListItemProps> = (args) => (
  <DragDropContext onDragEnd={onDragEnd}>
    <Droppable droppableId="list">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          <ItemsListItem {...args} />

          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);

export const Default = Template.bind({});
Default.args = {
  item: { id: "item-1", name: "Apples", quantity: 3 },
  index: 0,
};
