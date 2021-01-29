import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import NewItemForm, { NewItemFormProps } from "./NewItemForm";

export default {
  title: "NewItemForm",
  component: NewItemForm,
} as Meta;

const Template: Story<NewItemFormProps> = (args) => <NewItemForm {...args} />;

export const Default = Template.bind({});
Default.args = {
  existingNames: ["Apples", "Sweetcorn"],
  existingCategoryNames: ["Veg", "Tins"],
};
