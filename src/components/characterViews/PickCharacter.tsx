import { useContext } from "react";
import { Button, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

import { getAssetUrl } from "../../utils/functions";
import { CharacterContext } from "../../context/CharacterContext";

// Components
import { PlayerName, getClassSvg } from "../partials";

// Interfaces
import { CharactersData, PlayerData } from "../../utils/interfaces";
import { DestinyCharacterComponent } from "../../bungie/interfaces/Destiny/Entities/Characters";

type Props = {
  player: PlayerData;
  data: CharactersData;
}

const PickCharacter = ({ player, data }: Props) => {
  const context = useContext(CharacterContext);
  const characters = data.characters.data;

  // Sort by loaded
  const sortedCharacterKeys = Object.keys(characters).sort((a: any, b: any) => {
    return (new Date(characters[a].dateLastPlayed) as any) +
           (new Date(characters[b].dateLastPlayed) as any);
  });

  return (
    <>
      <PlayerName player={player} showCode={true} />
      <Stack direction="row" justifyContent="center" alignItems="center">
        {Object.keys(characters).map(i => {
          const character = characters[i as any] as DestinyCharacterComponent;
          const isLastOnline = sortedCharacterKeys[0].toString() === character.characterId.toString();
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