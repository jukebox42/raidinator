import { Typography } from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const Intro = () => {
  return (
    <>
      <Typography variant="h4" component="h1" color="white" sx={{ textAlign: "center", mt: "100px" }}>
        Welcome to Raid Watch
      </Typography>
      <Typography variant="body1" component="p" color="white" sx={{ textAlign: "center", p: 2 }}>
        An tool to give fireteam members quick <br/>information about their loadouts.
      </Typography>
      <Typography variant="caption" component="p" color="white" sx={{ textAlign: "center" }}>
        Created by PlasmaticSpoon.
      </Typography>

      <ArrowDownwardIcon sx={{position: "fixed", bottom: "200px", left: "50%", ml: "-50px", fontSize: 100, color: "white"}} />
    </>
  );
}

export default Intro;