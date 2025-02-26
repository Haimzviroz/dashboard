import { Dialog, DialogContent, Typography, DialogActions, Button } from "@mui/material";
import { Dispatch, FC, Fragment, SetStateAction } from "react";

interface ConfirmDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mes: string;
  confirmBtnText?: string;
  rejectBtnText?: string;
  cancelBtnText?: string;
  onConfirm?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ open, setOpen, mes, confirmBtnText, rejectBtnText, cancelBtnText, onConfirm, onReject, onCancel }) => {
  const handleCancel = () => {
    setOpen(false);
    onCancel && onCancel();
  }

  const handleConfirmation = () => {
    setOpen(false);
    onConfirm && onConfirm();
  }

  const handleReject = () => {
    setOpen(false);
    onReject && onReject();
  }

  return (
    <Fragment>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogContent>
          {mes}
        </DialogContent>
        <DialogActions>
          <Button sx={{ color: "red" }} onClick={handleCancel}>{cancelBtnText ?? "Cancel"}</Button>
          <Button onClick={handleConfirmation}>{confirmBtnText ?? "Yes"}</Button>
          <Button onClick={handleReject}>{rejectBtnText ?? "No"}</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmDialog;