import { useContext, useEffect, useState } from "react";
import { Button, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { getAssetUrl } from "../../utils/functions";
import { CharacterContext } from "../../context/CharacterContext";

// Components
import { PlayerName, getClassSvg } from "../partials";

// Interfaces
import { CharactersData, PlayerData } from "../../utils/interfaces";
import { DestinyCharacterComponent } from "../../bungie/interfaces/Destiny/Entities/Characters";
import { lastOnlineCharacterId } from "./utils";

type Props = {
  player: PlayerData;
  data: CharactersData;
}

const PickCharacter = ({ player, data }: Props) => {
  const context = useContext(CharacterContext);
  const [lastOnline, setLastOnline] = useState("");
  const characters = data.characters.data;

  // Get the last online so we can mark it
  useEffect(() => {
    const lastId = lastOnlineCharacterId(characters);
    setLastOnline(lastId);
  }, [context.data, data]);

  return (
    <>
      <PlayerName player={player} showCode={true} />
      <Stack direction="row" justifyContent="center" alignItems="center">
        {Object.keys(characters).map(i => {
          const character = characters[i] as DestinyCharacterComponent;
          const isLastOnline = character.characterId.toString() === lastOnline;
          return (
            <Button
              className="icon-character-button"
              key={character.characterId}
              variant="text"
              onClick={_ => context.setCharacterId(character.characterId)}
            >
              <img src={getAssetUrl(character.emblemPath)} className="icon-character"/>
              {getClassSvg(character.classType)}
              {isLastOnline && <StarIcon color="success" sx={{ position: "absolute", left: 0, top: 0 }} />}
            </Button>
          )
        })}
      </Stack>
    </>
  );
}

export default PickCharacter;