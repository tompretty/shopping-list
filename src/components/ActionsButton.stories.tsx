import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";

import ActionsButton, { ActionsButtonProps } from "./ActionsButton";
import List from "@material-ui/core/List";

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
