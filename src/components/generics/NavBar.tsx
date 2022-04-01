import { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CachedIcon from "@mui/icons-material/Cached";
import DataThresholdingIcon from "@mui/icons-material/DataThresholding";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";

import db from "../../store/db";
import { SOURCE_URL, VERSION } from "../../utils/constants";

// Components
import InstructionsDialog from "./InstructionsDialog";

type Props = {
  acting: boolean;
  refreshCallback: () => void;
}

const NavBar = ( { acting, refreshCallback }: Props) => {
  const [open, setOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);

  const refreshAll = () => {
    if (acting) {
      return Promise.resolve();
    }
    return db.clearAllCache().then(() => {
      window.location.reload();
    });
  }

  return (
    <Box sx={{ flexGrow: 1, maxWidth: "450px" }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, maxWidth: "450px", left: 0}}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setOpen(!open)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Raid Watch</Typography>
          <IconButton
            disabled={acting}
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            color="inherit"
            onClick={() => refreshCallback()}
          >
            <CachedIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Toolbar />
        <List>
          <ListItemButton key="reset" onClick={refreshAll}>
            <ListItemIcon><DataThresholdingIcon /></ListItemIcon>
            <ListItemText primary="Reset App Data" />
          </ListItemButton>
          <ListItemButton key="help" onClick={() => setInstructionsOpen(true)}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help" />
          </ListItemButton>
          <ListItem key="git" component="a" href={SOURCE_URL} target="_blank">
            <ListItemIcon><GitHubIcon /></ListItemIcon>
            <ListItemText primary={`Source (${VERSION})`} />
          </ListItem>
        </List>
      </Drawer>
      <InstructionsDialog open={instructionsOpen} onClose={() => setInstructionsOpen(false)} />
    </Box>
  );
}

export default NavBar;