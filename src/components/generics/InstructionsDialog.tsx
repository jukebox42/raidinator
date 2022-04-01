import {
  Dialog,
  DialogContent,
  DialogTitle,
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

const InstructionsDialog = ({ onClose, open = false }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Instructions
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemIcon><CachedIcon /></ListItemIcon>
            <ListItemText>Click the refresh button to reload guardian data from API.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><GroupAddIcon /></ListItemIcon>
            <ListItemText>Click the group icon to load the active fireteam.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><SwipeIcon /></ListItemIcon>
            <ListItemText>Swipe a guardian card left or right to remove.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Tap the guardian emblem to change the guardian.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Tap on a mod to view it's details.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Double tap on an equipment item to open light.gg.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><DoNotDisturbAltIcon /></ListItemIcon>
            <ListItemText>Mods crossed out don't have their requirements met. Tap on the mod for details.</ListItemText>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;