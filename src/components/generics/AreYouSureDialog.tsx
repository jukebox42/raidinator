import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

type Props = {
  text: string;
  open: boolean;
  onYes: () => void
  onNo: () => void;
}

const AreYouSureDialog = ({ onYes, onNo, text, open = false }: Props) => {
  return (
    <Dialog open={open} onClose={onNo}>
      <DialogTitle>
        Are You Sure?
      </DialogTitle>
      <DialogContent>
        {text}
      </DialogContent>
      <DialogActions>
        <Button onClick={onYes}  color="secondary" autoFocus>
          Yes
        </Button>
        <Button onClick={onNo} color="secondary" autoFocus>
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AreYouSureDialog;
