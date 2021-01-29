import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import React, { useEffect, useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { Category, Item } from "../App";
import ActionsButton from "./ActionsButton";
import ItemsListItem from "./ItemsListItem";

const useStyles = makeStyles(({ spacing }) => ({
  container: {
    paddingTop: spacing(3),
    paddingBottom: spacing(5),
    paddingLeft: spacing(4),
    paddingRight: spacing(4),

    "& > * + *": {
      marginTop: spacing(2),
    },
  },

  headerContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftHeaderContainer: {
    display: "flex",
    alignItems: "center",

    "& > * + *": {
      marginLeft: spacing(3),
    },
  },

  formContainer: {
    marginLeft: spacing(3),
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",

    "& > * + *": {
      marginLeft: spacing(2),
      marginTop: 0,
    },
  },

  formButtonsContainer: {
    display: "flex",

    "& > * + *": {
      marginLeft: spacing(1),
    },
  },

  listContainer: {
    "& > * + *": {
      marginTop: spacing(1),
    },
  },
}));

const EMPTY_NAME_ERROR_MESSAGE = "Please enter a name";

interface FormData {
  name: string;
}
export interface ItemsListProps {
  index: number;
  category: Category;
  items: Item[];
  onSave: (name: string) => void;
  onDelete: () => void;
  onSaveItem: (itemId: string) => (name: string, quantity: number) => void;
  onDeleteItem: (itemId: string) => () => void;
}

const ItemsList: React.FC<ItemsListProps> = ({
  index,
  category,
  items,
  onSave,
  onDelete,
  onSaveItem,
  onDeleteItem,
}: ItemsListProps) => {
  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    defaultValues: { name: category.name },
  });

  useEffect(() => {
    reset({ name: category.name });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category.name]);

  const [showForm, setShowForm] = useState(false);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const onSubmit = (formData: FormData) => {
    setShowForm(false);

    onSave(formData.name);
  };

  const classes = useStyles();

  return (
    <Draggable draggableId={category.id} index={index}>
      {(provided) => (
        <Paper
          className={classes.container}
          innerRef={provided.innerRef}
          {...provided.draggableProps}
        >
          {!showForm && (
            <div className={classes.headerContainer}>
              <div className={classes.leftHeaderContainer}>
                <div {...provided.dragHandleProps}>
                  <DragHandleIcon />
                </div>

                <Typography variant="h6">{category.name}</Typography>
              </div>

              <ActionsButton
                id={category.id}
                onEdit={openForm}
                onDelete={onDelete}
              />
            </div>
          )}

          {showForm && (
            <div className={classes.headerContainer}>
              <div {...provided.dragHandleProps}>
                <DragHandleIcon />
              </div>

              <ClickAwayListener
                onClickAway={closeForm}
                mouseEvent="onMouseDown"
              >
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className={classes.formContainer}
                >
                  <div>
                    <TextField
                      id="name-input"
                      inputRef={register({
                        required: EMPTY_NAME_ERROR_MESSAGE,
                      })}
                      error={Boolean(errors.name)}
                      helperText={errors.name?.message}
                      name="name"
                      autoFocus
                    />
                  </div>

                  <div className={classes.formButtonsContainer}>
                    <Button color="primary" variant="outlined" type="submit">
                      Save
                    </Button>

                    <Button onClick={closeForm}>Cancel</Button>
                  </div>
                </form>
              </ClickAwayListener>
            </div>
          )}

          <Droppable droppableId={category.id}>
            {(provided) => (
              <div
                className={classes.listContainer}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {items.map((item, index) => (
                  <ItemsListItem
                    key={item.id}
                    index={index}
                    item={item}
                    onSave={onSaveItem(item.id)}
                    onDelete={onDeleteItem(item.id)}
                  />
                ))}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </Paper>
      )}
    </Draggable>
  );
};

export default ItemsList;
