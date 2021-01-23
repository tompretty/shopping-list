import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export interface ActionsButtonProps {
  id: string;
  onEdit: () => void;
  onDelete: () => void;
}

const ActionsButton: React.FC<ActionsButtonProps> = ({
  id,
  onEdit,
  onDelete,
}: ActionsButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  const onOpenMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const onCloseMenu = () => {
    setAnchorEl(null);
  };

  const onConfirmEdit = () => {
    onCloseMenu();
    onEdit();
  };

  const onOpenDialog = () => {
    onCloseMenu();
    setShowDialog(true);
  };

  const onCloseDialog = () => {
    setShowDialog(false);
  };

  const onConfirmDelete = () => {
    onCloseDialog();
    onDelete();
  };

  const menuId = `${id}-action-menu`;
  const dialogTitleId = `${id}-alert-dialog-title`;
  const dialogDescriptionId = `${id}-alert-dialog-description`;

  return (
    <div>
      <IconButton
        aria-controls={menuId}
        aria-haspopup="true"
        edge="end"
        onClick={onOpenMenu}
      >
        <MoreVertIcon />
      </IconButton>

      <Menu
        id={menuId}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onCloseMenu}
        keepMounted
      >
        <MenuItem onClick={onConfirmEdit}>Edit</MenuItem>
        <MenuItem onClick={onOpenDialog}>Delete</MenuItem>
      </Menu>

      <Dialog
        open={showDialog}
        onClose={onCloseDialog}
        aria-labelledby={dialogTitleId}
        aria-describedby={dialogDescriptionId}
      >
        <DialogTitle id={dialogTitleId}>Are you sure?</DialogTitle>

        <DialogContent>
          <DialogContentText id={dialogDescriptionId}>
            This action can&apos;t be undone. Make sure you want to delete this.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={onCloseDialog} color="primary">
            Cancel
          </Button>

          <Button onClick={onConfirmDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ActionsButton;
