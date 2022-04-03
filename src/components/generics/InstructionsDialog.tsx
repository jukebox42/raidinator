import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CachedIcon from "@mui/icons-material/Cached";
import SwipeIcon from "@mui/icons-material/Swipe";
import TouchAppIcon from "@mui/icons-material/TouchApp";
import DoNotDisturbAltIcon from "@mui/icons-material/DoNotDisturbAlt";

type Props = {
  open: boolean;
  onClose: () => void;
}

const instructions = [
  {
    icon: <CachedIcon />,
    text: "Click the refresh button to reload guardian data from API.",
  },
  {
    icon: <GroupAddIcon />,
    text: "Click the group icon to load the active fireteam.",
  },
  {
    icon: <SwipeIcon />,
    text: "Swipe a guardian card left or right to remove.",
  },
  {
    icon: <TouchAppIcon />,
    text: "Tap the emblem to change the guardian.",
  },
  {
    icon: <TouchAppIcon />,
    text: "Tap on a mod, equipped item or subclass to view it's details.",
  },
  {
    icon: <TouchAppIcon />,
    text: "Double tap on an equipped item to open light.gg.",
  },
  {
    icon: <DoNotDisturbAltIcon />,
    text: "Mods crossed out don't have their requirements met. Tap on the mod for details.",
  },
]

const InstructionsDialog = ({ onClose, open = false }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Instructions
      </DialogTitle>
      <DialogContent>
        <List>
          {instructions.map((instruct, i) => (
            <ListItem key={i}>
              <ListItemIcon>{instruct.icon}</ListItemIcon>
              <ListItemText>{instruct.text}</ListItemText>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}  color="secondary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionsDialog;
