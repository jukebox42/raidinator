import { useState, useRef, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Stack,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import uniq from "lodash/uniq";

import db from "store/db";
import { AppContext } from "context/AppContext";
import { LIGHT_STAT_HASH } from "utils/constants";

// Components
import LoadingCharacter from "./LoadingCharacter";
import {
  Emblem,
  Light,
  ModList,
  PlayerName,
  StatList,
  Subclass,
  isSubClass,
  getSubclassEnergyType,
  ItemList,
  convertDamageTypeToEnergyType
} from "../partials";

// Interfaces
import { CharactersData, PlayerData } from "utils/interfaces";
import * as Definitions from "bungie/interfaces/Destiny/Definitions";
import { CharacterContext } from "context/CharacterContext";
import { lastOnlineCharacterId } from "./utils";

interface Props {
  player: PlayerData;
  data: CharactersData;
  characterId: number;
  onChangeCharacter: () => void;
  onLoadFireteam: () => void;
}

const DisplayCharacter = ( { player, data, characterId, onChangeCharacter, onLoadFireteam }: Props ) => {
  const appContext = useContext(AppContext);
  const context = useContext(CharacterContext);
  const [loaded, setLoaded] = useState(false);
  const damageTypes =  useRef<Definitions.DestinyDamageTypeDefinition[]>([]);
  const energyTypes = useRef<Definitions.EnergyTypes.DestinyEnergyTypeDefinition[]>([]);
  const statTypes = useRef<Definitions.DestinyStatDefinition[]>([]);
  const plugTypes = useRef<Definitions.Sockets.DestinyPlugSetDefinition[]>([]);
  const itemDefinitions = useRef<Definitions.DestinyInventoryItemDefinition[]>([]);

  // Data from the data...
  const character = data.characters.data[characterId];
  const items = data.characterEquipment.data[characterId].items;
  const itemComponents = data.itemComponents.instances.data;
  const sockets = data.itemComponents.sockets;
  const talentGrids = data.itemComponents.talentGrids;

  const loadManifestDetails = async () => {
    damageTypes.current = await db.DestinyDamageTypeDefinition.toArray();
    energyTypes.current = await db.DestinyEnergyTypeDefinition.toArray();
    statTypes.current = await db.DestinyStatDefinition.toArray();
    plugTypes.current = await db.DestinyPlugSetDefinition.toArray();

    // push items into a map so they are easier to index
    itemDefinitions.current = await db.DestinyInventoryItemDefinition.bulkGet(
      items.map(item => item.itemHash.toString())
    ) as Definitions.DestinyInventoryItemDefinition[];
    setLoaded(true);
  }

  // Load character dbs
  useEffect(() => {
    loadManifestDetails();
  }, [data]);

  // Wait for all the dbs to load
  if(!loaded) {
    return <LoadingCharacter />;
  }

  // Get the light stat type
  const lightStatType= statTypes.current.find(t => t.hash.toString() === LIGHT_STAT_HASH);
  if (!lightStatType) {
    const errorText = `Error: Could not find light stat for ${player.bungieGlobalDisplayName}`;
    appContext.addToast(errorText, "error");
    return <></>;
  }

  // get subclass
  let subclassDefinition = itemDefinitions.current.find(idef => isSubClass(idef));
  if (!subclassDefinition) {
    const errorText = `Error: Could not find subclass definition for ${player.bungieGlobalDisplayName}`;
    appContext.addToast(errorText, "error");
    return <></>;
  }
  const subclassInstance = items.find(gi => gi.itemHash === subclassDefinition?.hash);

  // get all weapons
  const weapons = itemDefinitions.current
    .filter(i => i.traitIds && i.traitIds.includes("item_type.weapon"));
  // get all the weapon energy types
  const weaponEnergyTypes = uniq(weapons.map(w => convertDamageTypeToEnergyType(w.damageTypes)).flat());
  // get all the weapon types. yes this will include item_type.weapon but we dont care.
  const weaponTypes = uniq(weapons.map(i => i.traitIds).flat());

  let isLastOnline = true;
  if (context.data) {
    const lastOnlineId = lastOnlineCharacterId(context.data.characters.data);
    isLastOnline = character.characterId.toString() === lastOnlineId;
  }

  return (
    <>
      <Box sx={{ p: 0, m: 0, ml: 1, display: "flex", flexDirection: "row" }}>
        <Emblem emblemPath={character.emblemPath} isLastOnline={isLastOnline} onClick={onChangeCharacter} />
        <Box sx={{ flexGrow: 1 }}>
          <PlayerName player={player} classType={character.classType} />
          <StatList stats={character.stats} statTypes={statTypes.current} />
        </Box>
        <Box sx={{ display: "flex", m: 1, mb: 0 }}>
          <Light imageUrl={lightStatType.displayProperties.icon} light={character.light} />
        </Box>
      </Box>
      <Stack direction="row" sx={{ ml: 1 }}>
        <Subclass
          sockets={sockets}
          talentGrids={talentGrids}
          itemDefinition={subclassDefinition}
          itemInstance={subclassInstance}
        />
        <ItemList
          items={items}
          itemDefinitions={itemDefinitions.current}
          itemComponents={itemComponents}
          damageTypes={damageTypes.current}
          energyTypes={energyTypes.current}
          sockets={sockets.data}
        />
      </Stack>
      <Box sx={{ ml: 1, display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "65px", mt: 1 }}>
          <IconButton size="small" onClick={onLoadFireteam} sx={{ p: 0 }}>
            <GroupAddIcon fontSize="small" />
          </IconButton>
        </Box>
        <ModList
          data={data}
          characterId={characterId}
          weaponTypes={weaponTypes}
          weaponEnergyTypes={weaponEnergyTypes}
          subclassEnergyType={getSubclassEnergyType(subclassDefinition)}
        />
      </Box>
    </>
  )
}

export default DisplayCharacter;
