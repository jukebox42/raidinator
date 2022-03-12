import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  Stack,
} from "@mui/material";

import db from "../../store/db";
import { getProfile } from "../../bungie/api";
import { getAssetUrl } from "../../utils/functions";

// Components
import { Loading } from "../generics";
import { PlayerName, getClassSvg } from "../partials";

// Interfaces
import * as BI from "../../bungie/interfaces";
import { DataCollection } from "../../bungie/interfaces/Dictionaries";
import * as Entities from "../../bungie/interfaces/Destiny/Entities";
import * as Components from "../../bungie/interfaces/Destiny/Components";
import { PlayerData } from "../../utils/interfaces";

// TODO: WTF is this? why doesn't it match the other one in interfaces?
interface GuardiansData {
  characterId: number | undefined;
  characters: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  characterEquipment: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  itemComponents: Entities.Items.DestinyItemComponentSet;
  characterPlugSets: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;
};

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

const loadGuardianFromDb = async (playerId: number): Promise<GuardiansData> => {
  let characterId!: number | undefined;
  let characters!: DataCollection<Entities.Characters.DestinyCharacterComponent>;
  let characterEquipment!: DataCollection<Entities.Inventory.DestinyInventoryComponent>;
  let itemComponents!: Entities.Items.DestinyItemComponentSet;
  let characterPlugSets!: DataCollection<Components.PlugSets.DestinyPlugSetsComponent>;

  characterId = await db.AppPlayersSelectedCharacter.get(playerId);
  characters = await db.AppCharacters.get(playerId);
  characterEquipment = await db.AppCharacterEquipment.get(playerId);
  itemComponents = await db.AppItemComponents.get(playerId);
  characterPlugSets = (await db.AppCharacterPlugSets.get(playerId)).data;

  return {
    characterId,
    characters,
    characterEquipment,
    itemComponents,
    characterPlugSets,
  };
}

const PickGuardian = ({ player, guardianId, pickedGuardian }: PickGuardianProps) => {
  const [activeGuardianId, setActiveGuardianId] = useState(0);
  const [characterId, setCharacterId] = useState(0);
  const [characters, setCharacters] = useState<DataCollection<Entities.Characters.DestinyCharacterComponent> | null>(null);
  const [inventories, setInventories] = useState<DataCollection<Entities.Inventory.DestinyInventoryComponent> | null>(null);
  const [items, setItems] = useState<Entities.Items.DestinyItemComponentSet | null>(null);
  const [characterPlugSets, setCharacterPlugSets] = useState<DataCollection<Components.PlugSets.DestinyPlugSetsComponent> | null>(null);

  const [loadedCachedCharacter, setLoadedCachedCharacter] = useState(false);

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
    let active = true;

    loadGuardianFromDb(player.membershipId).then(result => {
      console.log("loaded...", result);
      setCharacters(result.characters);
      setInventories(result.characterEquipment);
      setItems(result.itemComponents);
      setCharacterPlugSets(result.characterPlugSets);
      setLoadedCachedCharacter(true);
    }).catch(e => {
      // do this so it pull from the api
      setLoadedCachedCharacter(true);
    })

    return () => {
      active = false;
    }
  }, []);

  // load characters from the api
  useEffect(() => {
    let active = true;

    if((characters && inventories && items && characterPlugSets) || !loadedCachedCharacter) {
      return () => {
        active = false;
      }
    }

    loadCharacters(player.membershipId, player.membershipType, (response) => {
      if (active && !response.characters.disabled) {
        // Character
        setCharacters(response.characters);
        db.AppCharacters.put(response.characters, player.membershipId);
        // Inventories
        setInventories(response.characterEquipment);
        db.AppCharacterEquipment.put(response.characterEquipment, player.membershipId);
        // Item Components
        setItems(response.itemComponents);
        db.AppItemComponents.put(response.itemComponents, player.membershipId);
        // Character Plug Sets
        setCharacterPlugSets(response.characterPlugSets);
        db.AppCharacterPlugSets.put(response.characterPlugSets, player.membershipId);

        // if this is set then the user is logged in
        if (response.profileTransitoryData.data) {
         // TODO this? How do you get an active guardian?
         // setActiveGuardianId()
        }
      }
    });

    return () => {
      active = false;
    }
  }, [loadedCachedCharacter]);

  useEffect(() => {
    let active = true;

    // if everything isn't loaded wait.
    if (
      (!guardianId && !activeGuardianId)
      || !characters || !inventories || !items || !characterPlugSets
    ) {
      return () => {
        active = false;
      }
    }

    const character = characters.data[guardianId ? guardianId as any : activeGuardianId];
    if(!character) {
      setCharacterId(0);
      return () => {
        active = false;
      }
    }

    pickedGuardian(
      character,
      inventories.data[character.characterId],
      items,
      characterPlugSets.data[character.characterId],
    );

    return () => {
      active = false;
    }
  }, [characters, inventories, items, characterPlugSets, activeGuardianId]);

  if (!characters || !inventories || !items || !characterPlugSets) {
    return <Box sx={{ p: 0 }}><Loading marginTop="43px" /></Box>;
  }

  return (
    <>
      <PlayerName player={player} showCode={true} />
      <Stack direction="row" justifyContent="center" alignItems="center">
      {characters && inventories && Object.keys(characters.data).map((i: string) => {
        const character = characters.data[i as any];
        return (
          <Button
            className="icon-character-button"
            key={character.characterId}
            variant="text"
            onClick={(_) => {
              setCharacterId(character.characterId);
              db.AppPlayersSelectedCharacter.put(character.characterId, player.membershipId);
              pickedGuardian(
                character,
                inventories.data[character.characterId],
                items,
                characterPlugSets.data[character.characterId],
              );
            }}
          >
            <img src={getAssetUrl(character.emblemPath)} className="icon-character"/>
            {getClassSvg(character.classType)}
          </Button>
        )
      })}
      </Stack>
    </>
  );
}

export default PickGuardian;