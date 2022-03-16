import { useState, useEffect, useMemo, useRef } from "react";
import { Box, Button, Stack } from "@mui/material";

import db from "../../store/db";
import { getProfile } from "../../bungie/api";
import { getAssetUrl } from "../../utils/functions";

// Components
import { Loading } from "../generics";
import { PlayerName, getClassSvg } from "../partials";

// Interfaces
import * as BI from "../../bungie/interfaces";
import { DataCollection, DataSingle } from "../../bungie/interfaces/Dictionaries";
import * as Entities from "../../bungie/interfaces/Destiny/Entities";
import * as Components from "../../bungie/interfaces/Destiny/Components";
import { GuardiansData, PlayerData } from "../../utils/interfaces";

type PickGuardianProps = {
  player: PlayerData;
  guardianId: string;
  pickedGuardian: (
    guardian: Entities.Characters.DestinyCharacterComponent,
    inventory: Entities.Inventory.DestinyInventoryComponent,
    itemComponents: Entities.Items.DestinyItemComponentSet,
    characterPlugSets: Components.PlugSets.DestinyPlugSetsComponent,
  ) => void;
}

interface CharactersData {
  characterId: number;
  characters: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  characterEquipment: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  itemComponents: Entities.Items.DestinyItemComponentSet;
  characterPlugSets: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;
}

const loadGuardianFromDb = async (playerId: number): Promise<GuardiansData> => {
  let characterId: number | undefined = 0;
  let characters!: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  let characterEquipment!: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  let itemComponents!: Entities.Items.DestinyItemComponentSet;
  let characterPlugSets!: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;

  characterId = await db.AppPlayersSelectedCharacter.get(playerId);
  characters = await db.AppCharacters.get(playerId);
  characterEquipment = await db.AppCharacterEquipment.get(playerId);
  itemComponents = await db.AppItemComponents.get(playerId);
  characterPlugSets = await db.AppCharacterPlugSets.get(playerId);

  if (!characterId) {
    characterId = 0;
  }

  return {
    characterId,
    characters,
    characterEquipment,
    itemComponents,
    characterPlugSets,
  };
}

const PickGuardian = ({ player, guardianId, pickedGuardian }: PickGuardianProps) => {
  const data = useRef<CharactersData>({
    characterId: 0,
    characters: { data: {}, privacy: 0 },
    characterEquipment: { data: {}, privacy: 0 },
    itemComponents: { instances: { data: {}, privacy: 0 }, sockets: { data: {}, privacy: 0 } },
    characterPlugSets: { data: {}, privacy: 0 },
  });
  const [loaded, setLoaded] = useState(false);
  const [characterNotInCache, setCharacterNotInCache] = useState(false);

  const loadCharacters = useMemo(() =>
    (
      membershipId: number,
      membershipType: number,
      callback: (response: BI.Destiny.Responses.DestinyProfileResponse) => void,
    ) => getProfile(membershipId, membershipType).then(callback),
    []
  );

  // Effect to load character from the DB
  useEffect(() => {
    loadGuardianFromDb(player.membershipId).then(response => {
      if (
        !response.characters ||
        !response.characterEquipment ||
        !response.itemComponents ||
        !response.characterPlugSets
      ) {
        setCharacterNotInCache(true);
        return;
      }

      console.log("loaded...", response);
      data.current.characters = response.characters;
      data.current.characterEquipment = response.characterEquipment;
      data.current.itemComponents = response.itemComponents;
      data.current.characterPlugSets = response.characterPlugSets;
      setLoaded(true);
    }).catch(e => {
      // do this so it pull from the api
      setCharacterNotInCache(true);
    });
  }, []);

  // load characters from the api
  useEffect(() => {
    if(!characterNotInCache) {
      return;
    }

    loadCharacters(player.membershipId, player.membershipType, (response) => {
      if (!response.characters.disabled) {
        data.current.characters = response.characters;
        data.current.characterEquipment = response.characterEquipment;
        data.current.itemComponents = response.itemComponents;
        data.current.characterPlugSets = response.characterPlugSets;

        // Store the data in the db so we have it on reload
        Promise.allSettled([
          db.AppCharacters.put(response.characters, player.membershipId),
          db.AppCharacterEquipment.put(response.characterEquipment, player.membershipId),
          db.AppItemComponents.put(response.itemComponents, player.membershipId),
          db.AppCharacterPlugSets.put(response.characterPlugSets, player.membershipId),
        ]).then(() => setLoaded(true));
      }
    });
  }, [characterNotInCache]);

  useEffect(() => {
    // if everything isn't loaded wait.
    if (!guardianId || !loaded) {
      return;
    }

    const character = data.current.characters.data[guardianId ? guardianId as any : 0];
    if(!character) {
      return;
    }

    pickedGuardian(
      character,
      data.current.characterEquipment.data[character.characterId],
      data.current.itemComponents,
      data.current.characterPlugSets.data[character.characterId],
    );
  }, [loaded]);

  if (!loaded) {
    return <Box sx={{ p: 0 }}><Loading marginTop="43px" /></Box>;
  }

  const handleEmblemClick = (character: BI.Destiny.Entities.Characters.DestinyCharacterComponent) => {
    db.AppPlayersSelectedCharacter.put(character.characterId, player.membershipId);
    pickedGuardian(
      character,
      data.current.characterEquipment.data[character.characterId],
      data.current.itemComponents,
      data.current.characterPlugSets.data[character.characterId],
    );
  }

  const sortedCharacterKeys = Object.keys(data.current.characters.data).sort((a: any, b: any) => {
    return (new Date(data.current.characters.data[a].dateLastPlayed) as any) +
           (new Date(data.current.characters.data[b].dateLastPlayed) as any);
  });

  // queue force selecting (dont publish this)
  // setTimeout(() => handleEmblemClick(characters.data[sortedCharacterKeys[0] as any]), 0);

  return (
    <>
      <PlayerName player={player} showCode={true} />
      <Stack direction="row" justifyContent="center" alignItems="center">
        {Object.keys(data.current.characters.data).map((i: string) => {
          const character = data.current.characters.data[i as any];
          // TODO: we can do better if we had player trajectory data so we knew if they were online now
          const isLastOnline = sortedCharacterKeys[0].toString() === character.characterId.toString();
          return (
            <Button
              className="icon-character-button"
              key={character.characterId}
              variant="text"
              onClick={_ => handleEmblemClick(character)}
            >
              <img src={getAssetUrl(character.emblemPath)} className="icon-character"/>
              {getClassSvg(character.classType)}
              {isLastOnline && <div className="online" />}
            </Button>
          )
        })}
      </Stack>
    </>
  );
}

export default PickGuardian;