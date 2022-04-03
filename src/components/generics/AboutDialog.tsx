import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";

type Props = {
  open: boolean;
  onClose: () => void;
}

const AboutDialog = ({ onClose, open = false }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        About
      </DialogTitle>
      <DialogContent>
        <p>Raidwatch is a tool to give fireteam members quick information about their loadouts.</p>
        <p>It was made mostly for fun but if you find bugs feel free to file them on the github issues page.</p>
        <p>Created by PlasmaticSpoon.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  color="secondary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AboutDialog;
