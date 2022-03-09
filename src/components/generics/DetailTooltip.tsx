import React from "react";
import {
  Paper,
  Tooltip,
} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';

type TooltipProps = {
  title: React.ReactElement<any, any> | string;
  flow?: boolean;
  children: React.ReactElement<any, any>;
}

const DetailTooltip = ( {title, children, flow = true}: TooltipProps ) => {
  const [open, setOpen] = React.useState(false);
  
  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

  const sx = { display: "flex", m: 1, mb: 0, ml: 0, position: "relative", background: "none" };

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Paper
        elevation={0}
        sx={flow ? sx : {}}
        onClick={handleTooltipOpen}
      >
        <Tooltip
          onClose={handleTooltipClose}
          open={open}
          arrow={true}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={title}
        >
          {children}
        </Tooltip>
      </Paper>
    </ClickAwayListener>
  );
}

export default DetailTooltip;