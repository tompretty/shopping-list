import List from "@material-ui/core/List";
import { Meta, Story } from "@storybook/react/types-6-0";
import React from "react";
import ActionsButton, { ActionsButtonProps } from "./ActionsButton";

export default {
  title: "ActionsButton",
  component: ActionsButton,
} as Meta;

const Template: Story<ActionsButtonProps> = (args) => (
  <List>
    <ActionsButton {...args} />
  </List>
);

export const Default = Template.bind({});
Default.args = {
  id: "Apples",
};
