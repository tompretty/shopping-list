import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import TextField from "@material-ui/core/TextField";
import ReplayIcon from "@material-ui/icons/Replay";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

const useStyles = makeStyles(({ spacing, breakpoints }) => ({
  container: {
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: spacing(3),

    [breakpoints.up("md")]: {
      width: "max-content",
    },
  },

  formContainer: {
    width: "100%",
  },

  fieldsContainer: {
    marginTop: spacing(2),
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "baseline",

    "& > * + *": {
      marginTop: spacing(2),
    },

    [breakpoints.up("sm")]: {
      flexDirection: "row",

      "& > * + *": {
        marginTop: 0,
        marginLeft: spacing(2),
      },
    },
  },

  buttonsContainer: {
    marginTop: spacing(2),
    width: "100%",
    display: "flex",
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

interface FormData {
  quantity: string;
  name: string;
  categoryId: string;
}

export interface NewItemFormProps {
  existingNames: string[];
  existingCategoryNames: string[];
  onCreateItem: (name: string, quantity: number, category: string) => void;
  onCopyToClipboard: () => void;
  onStartNewList: () => void;
}

const EMPTY_QUANTITY_ERROR_MESSAGE = "Please enter a quantity";
const EMPTY_NAME_ERROR_MESSAGE = "Please enter a name";

const NewItemForm: React.FC<NewItemFormProps> = ({
  existingNames,
  existingCategoryNames,
  onCreateItem,
  onCopyToClipboard,
  onStartNewList,
}: NewItemFormProps) => {
  const defaultValues: FormData = {
    quantity: "",
    name: "",
    categoryId: "",
  };

  const { register, handleSubmit, errors, reset } = useForm<FormData>({
    defaultValues,
  });

  const quantityInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = (formData: FormData) => {
    onCreateItem(
      formData.name,
      parseFloat(formData.quantity),
      formData.categoryId
    );

    reset();

    quantityInputRef.current?.focus();
  };

  const [showOnCopySnackbar, setShowOnCopySnackbar] = useState(false);

  const openOnCopySnackbar = () => setShowOnCopySnackbar(true);
  const closeOnCopySnackbar = () => setShowOnCopySnackbar(false);

  const onCopyToClipboardClicked = () => {
    openOnCopySnackbar();
    onCopyToClipboard();
  };

  const [showStartNewListDialog, setShowStartNewListDialog] = useState(false);

  const openStartNewListDialog = () => setShowStartNewListDialog(true);
  const closeStartNewListDialog = () => setShowStartNewListDialog(false);

  const onConfirmStartNewList = () => {
    closeStartNewListDialog();
    onStartNewList();
  };

  const classes = useStyles();

  return (
    <Paper>
      <div className={classes.container}>
        <Typography variant="h5">Add a new item</Typography>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={classes.formContainer}
        >
          <div className={classes.fieldsContainer}>
            <TextField
              id="new-quantity-input"
              inputRef={(ref) => {
                register(ref, { required: EMPTY_QUANTITY_ERROR_MESSAGE });
                quantityInputRef.current = ref;
              }}
              name="quantity"
              error={Boolean(errors.quantity)}
              helperText={errors.quantity?.message}
              label="Quantity"
              type="number"
              variant="outlined"
              autoFocus
              fullWidth
            />

            <TextField
              id="new-name-input"
              name="name"
              inputRef={register({ required: EMPTY_NAME_ERROR_MESSAGE })}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
              InputProps={{
                inputProps: { list: "new-name-completions" },
              }}
              label="Name"
              variant="outlined"
              fullWidth
            />

            <datalist id="new-name-completions">
              {existingNames.map((name) => (
                <option value={name} key={name} />
              ))}
            </datalist>

            <TextField
              id="category-input"
              name="categoryId"
              inputRef={register()}
              error={Boolean(errors.categoryId)}
              helperText={errors.categoryId?.message}
              InputProps={{
                inputProps: { list: "category-completions" },
              }}
              label="Category"
              variant="outlined"
              fullWidth
            />
          </div>

          <datalist id="category-completions">
            {existingCategoryNames.map((name) => (
              <option value={name} key={name} />
            ))}
          </datalist>

          <div className={classes.buttonsContainer}>
            <Button color="primary" variant="contained" type="submit">
              Add
            </Button>

            <div>
              <Tooltip title="Copy to clipboard">
                <IconButton onClick={onCopyToClipboardClicked}>
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>

              <Snackbar
                open={showOnCopySnackbar}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                autoHideDuration={2000}
                onClose={closeOnCopySnackbar}
                message="Copied to clipboard"
              />

              <Tooltip title="Start a new list">
                <IconButton onClick={openStartNewListDialog}>
                  <ReplayIcon />
                </IconButton>
              </Tooltip>

              <Dialog
                open={showStartNewListDialog}
                onClose={closeStartNewListDialog}
                aria-labelledby=""
                aria-describedby=""
              >
                <DialogTitle id="">Are you sure?</DialogTitle>

                <DialogContent>
                  <DialogContentText id="">
                    This action can&apos;t be undone. Are you sure you want to
                    start a new list?
                  </DialogContentText>
                </DialogContent>

                <DialogActions>
                  <Button onClick={closeStartNewListDialog} color="primary">
                    Cancel
                  </Button>

                  <Button
                    onClick={onConfirmStartNewList}
                    color="primary"
                    autoFocus
                  >
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </div>
        </form>
      </div>
    </Paper>
  );
};

export default NewItemForm;
