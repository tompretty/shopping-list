import Button from "@material-ui/core/Button";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import DragHandleIcon from "@material-ui/icons/DragHandle";
import React, { useEffect, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { Item } from "../App";
import ActionsButton from "./ActionsButton";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    width: "100%",
  },

  viewingContainer: {
    display: "flex",
    alignItems: "center",
    padding: `${spacing(1)}px ${spacing(2)}px`,
  },

  editingContainer: {
    display: "flex",
    alignItems: "center",
    padding: `${spacing(2)}px ${spacing(2)}px`,
  },

  textContainer: {
    marginLeft: spacing(3),
  },

  quantityContainer: {
    display: "inline-block",
    width: "50px",
    textAlign: "right",
  },

  nameContainer: {
    marginLeft: spacing(1),
  },

  formContainer: {
    marginLeft: spacing(3),
    paddingRight: spacing(2),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",

    "& > * + *": {
      marginTop: spacing(2),
    },

    [breakpoints.up("sm")]: {
      paddingRight: 0,
      flexDirection: "row",

      "& > * + *": {
        marginLeft: spacing(2),
        marginTop: 0,
      },
    },
  },

  fieldsContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "column",

    "& > * + *": {
      marginTop: spacing(1),
    },

    [breakpoints.up("sm")]: {
      flexDirection: "row",

      "& > * + *": {
        marginLeft: spacing(2),
        marginTop: 0,
      },
    },
  },

  fieldContainer: {
    [breakpoints.up("md")]: {
      width: "200px",
    },
  },

  formButtonsContainer: {
    display: "flex",

    "& > * + *": {
      marginLeft: spacing(1),
    },
  },

  actionsButtonContainer: {
    marginLeft: "auto",
  },
}));

interface FormData {
  name: string;
  quantity: string;
}

export interface ItemsListItemProps {
  index: number;
  item: Item;
  onSave: (name: string, quantity: number) => void;
  onDelete: () => void;
}

const EMPTY_QUANTITY_ERROR_MESSAGE = "Please enter a quantity";
const EMPTY_NAME_ERROR_MESSAGE = "Please enter a name";

const ItemsListItem: React.FC<ItemsListItemProps> = ({
  index,
  item,
  onSave,
  onDelete,
}: ItemsListItemProps) => {
  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    defaultValues: {
      name: item.name,
      quantity: item.quantity.toString(),
    },
  });

  useEffect(() => {
    reset({
      name: item.name,
      quantity: item.quantity.toString(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.name, item.quantity]);

  const [showForm, setShowForm] = useState(false);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);
  const onSubmit = (data: FormData) => {
    closeForm();

    onSave(data.name, parseFloat(data.quantity));
  };

  const classes = useStyles();

  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.draggableProps}>
          <Paper className={classes.container}>
            {!showForm && (
              <div className={classes.viewingContainer}>
                <div {...provided.dragHandleProps}>
                  <DragHandleIcon />
                </div>

                <Typography className={classes.textContainer}>
                  <span className={classes.quantityContainer}>
                    {item.quantity}
                  </span>

                  <span className={classes.nameContainer}>{item.name}</span>
                </Typography>

                <div className={classes.actionsButtonContainer}>
                  <ActionsButton
                    id={item.id}
                    onEdit={openForm}
                    onDelete={onDelete}
                  />
                </div>
              </div>
            )}

            {showForm && (
              <div className={classes.editingContainer}>
                <div {...provided.dragHandleProps}>
                  <DragHandleIcon />
                </div>

                <ClickAwayListener onClickAway={closeForm}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={classes.formContainer}
                  >
                    <div className={classes.fieldsContainer}>
                      <TextField
                        id="quantity-input"
                        inputRef={register({
                          required: EMPTY_QUANTITY_ERROR_MESSAGE,
                        })}
                        helperText={errors.quantity?.message}
                        error={Boolean(errors.quantity)}
                        name="quantity"
                        className={classes.fieldContainer}
                        type="number"
                        autoFocus
                      />

                      <TextField
                        id="name-input"
                        inputRef={register({
                          required: EMPTY_NAME_ERROR_MESSAGE,
                        })}
                        helperText={errors.name?.message}
                        error={Boolean(errors.name)}
                        name="name"
                        className={classes.fieldContainer}
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
          </Paper>
        </div>
      )}
    </Draggable>
  );
};

export default ItemsListItem;
