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
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

type Props = {
  open: boolean;
  onClose: () => void;
}

const instructions = [
  {
    icon: [<CachedIcon />],
    text: "Click the refresh button to reload guardian data from API.",
  },
  {
    icon: [<GroupAddIcon />],
    text: "Click the group icon to load the active fireteam.",
  },
  {
    icon: [<SwipeIcon />],
    text: "Swipe a guardian card left or right to remove.",
  },
  {
    icon: [<TouchAppIcon />],
    text: "Tap the emblem to change the guardian.",
  },
  {
    icon: [<TouchAppIcon />],
    text: "Tap on a mod, equipped item or subclass to view it's details.",
  },
  {
    icon: [<DoNotDisturbAltIcon />],
    text: "Mods crossed out don't have their requirements met. Tap on the mod for details.",
  },
  {
    icon: [
      <LightModeIcon color="success" sx={{mt:-3}} />,
      <DarkModeIcon color="warning" sx={{mt:3}} />
    ],
    text: "The sun indicates the last played guardian for that player. The moon indicates the guardian was not the last played.",
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
              {instruct.icon.length === 1 && <ListItemIcon>{instruct.icon[0]}</ListItemIcon>}
              {instruct.icon.length === 2 && <ListItemIcon sx={{ml: -3, mr: 3}}>{instruct.icon[0]}/{instruct.icon[1]}</ListItemIcon>}
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
