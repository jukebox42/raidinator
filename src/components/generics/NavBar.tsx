import { useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";

import MenuIcon from "@mui/icons-material/Menu";
import CachedIcon from "@mui/icons-material/Cached";
import GitHubIcon from "@mui/icons-material/GitHub";
import HelpIcon from "@mui/icons-material/Help";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import DownloadingIcon from '@mui/icons-material/Downloading';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';

import db from "store/db";
import { SOURCE_URL, VERSION } from "utils/constants";

// Components
import InstructionsDialog from "./InstructionsDialog";
import AboutDialog from "./AboutDialog";
import AreYouSureDialog from "./AreYouSureDialog";

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

type Props = {
  acting: boolean;
  refreshCallback: () => void;
  reloadManifestCallback: () => void;
}

const NavBar = ({ acting, refreshCallback, reloadManifestCallback }: Props) => {
  const [open, setOpen] = useState(false);
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [reloadOpen, setReloadOpen] = useState(false);

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
            color="inherit"
            onClick={() => refreshCallback()}
          >
            {!acting && <CachedIcon />}
            {acting && <CachedIcon sx={{animation: `${spin} 1s infinite ease`}} />}
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
          <ListItemButton key="help" onClick={() => setInstructionsOpen(true)}>
            <ListItemIcon><HelpIcon /></ListItemIcon>
            <ListItemText primary="Help" />
          </ListItemButton>
          <ListItemButton key="about" onClick={() => setAboutOpen(true)}>
            <ListItemIcon><AutoAwesomeIcon /></ListItemIcon>
            <ListItemText primary="About" />
          </ListItemButton>
          {/* I pulled this out because it's confusing for users and probably not that useful
          <ListItemButton key="reload" onClick={() => setReloadOpen(true)} disabled={acting}>
            <ListItemIcon><DownloadingIcon /></ListItemIcon>
            <ListItemText primary="Reload Manifest" />
          </ListItemButton>*/}
          <Divider variant="middle" />
          <ListItem key="git" component="a" href={SOURCE_URL} target="_blank">
            <ListItemIcon><GitHubIcon /></ListItemIcon>
            <ListItemText primary={`Source (${VERSION})`} />
          </ListItem>
          <ListItemButton key="reset" onClick={() => setResetOpen(true)} disabled={acting}>
            <ListItemIcon><DeleteSweepIcon /></ListItemIcon>
            <ListItemText primary="Reset App Data" />
          </ListItemButton>
        </List>
      </Drawer>
      <InstructionsDialog open={instructionsOpen} onClose={() => setInstructionsOpen(false)} />
      <AboutDialog open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <AreYouSureDialog
        open={reloadOpen}
        onYes={() => {
          setReloadOpen(false);
          reloadManifestCallback();
          setOpen(false);
        }}
        onNo={() => setReloadOpen(false)}
        text="This will rewrite the cached manifest. This will silently happen in the background and the fireteam will reload when complete." />
      <AreYouSureDialog
        open={resetOpen}
        onYes={() => {
          setResetOpen(false);
          refreshAll();
          setOpen(false);
        }}
        onNo={() => setResetOpen(false)}
        text="This will delete all cached data, reload the destiny database, and clear all guardians." />
    </Box>
  );
}

export default NavBar;
