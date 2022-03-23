import { useContext } from "react";
import { Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

import { CharacterContext } from "../../context/CharacterContext";

const CharacterError = () => {
  // TODO: maybe make it red?
  const context = useContext(CharacterContext);

  return (
    <>
      <Typography variant="body1" sx={{textAlign: "center", mt: 5}}>
        <ErrorOutlineIcon sx={{fontSize: 60}} />
      </Typography>
      <Typography variant="body1" sx={{textAlign: "center"}}>{context.error}</Typography>
    </>
  );
}

export default CharacterError;