import React from "react";
import {
  Paper,
  Tooltip,
} from "@mui/material";
import ClickAwayListener from '@mui/material/ClickAwayListener';

type TooltipProps = {
  title: React.ReactElement<any, any> | string;
  flow?: boolean;
  warning?: boolean;
  error?: boolean;
  children: React.ReactElement<any, any>;
}

const DetailTooltip = ( {title, children, flow = true, warning = false, error = false}: TooltipProps ) => {
  const [open, setOpen] = React.useState(false);
  
  const handleTooltipClose = () => setOpen(false);

  const handleTooltipOpen = () => setOpen(true);

  const sx = { display: "flex", m: 1, mb: 0, ml: 0, position: "relative", background: "none" };

  const classNames = [];
  if (warning || error) {
    classNames.push("warning");
  }
  if (error) {
    classNames.push("error");
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Paper
        elevation={0}
        sx={flow ? sx : {}}
        onClick={handleTooltipOpen}
        className={classNames.join(" ")}
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