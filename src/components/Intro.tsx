import { Typography } from "@mui/material";

const Intro = () => {
  return (
    <>
      <Typography variant="h4" component="h1" color="white" sx={{ textAlign: "center", mt: "100px" }}>
        Welcome to Raid Watch
      </Typography>
      <Typography variant="body1" component="p" color="white" sx={{ textAlign: "center", p: 2 }}>
        A tool to give fireteam members quick <br/>information about their loadouts.
      </Typography>
      <Typography variant="caption" component="p" color="white" sx={{ textAlign: "center" }}>
        Created by PlasmaticSpoon.
      </Typography>
    </>
  );
}

export default Intro;