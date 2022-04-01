import { Button } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";

import { getAssetUrl } from "../../../utils/functions";
import { DestinyCharacterComponent } from "../../../bungie/interfaces/Destiny/Entities/Characters";

type Props = {
  character: DestinyCharacterComponent;
  isLastOnline: boolean;
  onClick: () => void;
}

const Emblem = ({ character, isLastOnline, onClick }: Props) => {
  return (
    <Button
      key={character.characterId}
      variant="text"
      onClick={onClick}
      sx={{ padding: 0, position: "relative" }}
    >
      <img src={getAssetUrl(character.emblemPath)} className="icon-character"/>
      {!isLastOnline &&
        <WarningIcon color="warning" sx={{ position: "absolute", right: 0, top: 0, width: "20px", height: "20px" }} />}
    </Button>
  )
}

export default Emblem;