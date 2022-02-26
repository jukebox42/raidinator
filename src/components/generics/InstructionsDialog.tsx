import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import CachedIcon from "@mui/icons-material/Cached";
import SwipeIcon from '@mui/icons-material/Swipe';
import TouchAppIcon from '@mui/icons-material/TouchApp';

interface CardData {
  id?: string,
  key: string,
}

interface InstructionsDialogProps {
  open: boolean;
  onClose: () => void;
}

const InstructionsDialog = ({ onClose, open = false }: InstructionsDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Instructions
      </DialogTitle>
      <DialogContent>
        <List>
          <ListItem>
            <ListItemIcon><CachedIcon /></ListItemIcon>
            <ListItemText>Refresh guardian data from API.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><GroupAddIcon /></ListItemIcon>
            <ListItemText>Load active fireteam (Will silently fail if not logged in).</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><SwipeIcon /></ListItemIcon>
            <ListItemText>Swipe guardian card left or right to remove.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Tap emblem to change character.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Tap mods to view name.</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemIcon><TouchAppIcon /></ListItemIcon>
            <ListItemText>Double tap equipment to open light.gg.</ListItemText>
          </ListItem>
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default InstructionsDialog;