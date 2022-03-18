import { useState, useRef } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import uniq from "lodash/uniq";

import db from "../../store/db";
import { getAssetUrl } from "../../utils/functions";
import { LIGHT_STAT_HASH } from "../../utils/constants";

// Components
import { Loading } from "../generics";
import {
  ItemMods,
  PlayerName,
  CharacterStats,
  CharacterSubclass,
  isSubClass,
  getSubclassEnergyType,
  EquipmentItem,
  shouldDisplayEquipmentItem,
  convertDamageTypeToEnergyType
} from "../partials";

// Interfaces
import { CharactersData, PlayerData } from "../../utils/interfaces";
import * as BI from "../../bungie/interfaces/";
import * as Definitions from "../../bungie/interfaces/Destiny/Definitions";

interface Props {
  player: PlayerData;
  data: CharactersData;
  characterId: number;
  onChangeCharacter: () => void;
  onLoadFireteam: () => void;
}

const DisplayCharacter = ( { player, data, characterId, onChangeCharacter, onLoadFireteam }: Props ) => {
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

  // Load character dbs
  useLiveQuery(async () => {
    damageTypes.current = await db.DestinyDamageTypeDefinition.toArray();
    energyTypes.current = await db.DestinyEnergyTypeDefinition.toArray();
    statTypes.current = await db.DestinyStatDefinition.toArray();
    plugTypes.current = await db.DestinyPlugSetDefinition.toArray();

    // push items into a map so they are easier to index
    itemDefinitions.current = await db.DestinyInventoryItemDefinition.bulkGet(
      items.map(item => item.itemHash.toString())
    ) as Definitions.DestinyInventoryItemDefinition[];
    setLoaded(true);
  });

  // Wait for all the dbs to load
  if(!loaded) {
    return <Box sx={{ p: 0 }}><Loading marginTop="43px" /></Box>;
  }

  // Get the light stat type
  const lightStatType = statTypes.current.find(t => t.hash.toString() === LIGHT_STAT_HASH);
  if (!lightStatType) {
    console.error("Error Could Not Find Stat Type", LIGHT_STAT_HASH);
    return <>Error Could Not Find Stat Type</>;
  }

  // get subclass
  const subclassDefinition = itemDefinitions.current.find(idef => isSubClass(idef));
  if (!subclassDefinition) {
    console.error("Error Could Not Find Subclass Definition");
    return <>Error Could Not Find Subclass Definition</>;
  }
  const subclassInstance = items.find(gi => gi.itemHash === subclassDefinition?.hash);

  const weapons = itemDefinitions.current
    .filter(i => i.traitIds && i.traitIds.includes("item_type.weapon"));
  // get all the weapon energy types
  const weaponEnergyTypes = uniq(weapons.map(w => convertDamageTypeToEnergyType(w.damageTypes)).flat());
  // get all the weapon types. yes this will include item_type.weapon but we dont care.
  const weaponTypes = uniq(weapons.map(i => i.traitIds).flat());

  return (
    <>
      <Box sx={{ p: 0, m: 0, ml: 1, display: "flex", flexDirection: "row" }}>
        <img
          src={getAssetUrl(character.emblemPath)}
          className="icon-emblem"
          onClick={onChangeCharacter}
        />
        <Box sx={{ flexGrow: 1 }}>
          <PlayerName player={player} classType={character.classType} />
          <CharacterStats stats={character.stats} statTypes={statTypes.current} />
        </Box>
        <Box sx={{ display: "flex", m: 1, mb: 0 }}>
          <img
            src={getAssetUrl(lightStatType.displayProperties.icon)}
            className="icon-light invert"
          />
          <Typography variant="subtitle1" sx={{ mt: "-3px" }}>
            {character.light}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" sx={{ ml: 1 }}>
        <CharacterSubclass
          sockets={sockets}
          itemDefinition={subclassDefinition}
          itemInstance={subclassInstance}
        />
        {itemDefinitions.current.map(itemDefinition => {
          // only equipment has traits so dont render an item
          if (!itemDefinition.traitIds || !shouldDisplayEquipmentItem(itemDefinition)) {
            return;
          }
          const itemInstance = items.find(
            gi => gi.itemHash === itemDefinition.hash);
          if (!itemInstance) {
            console.error("Could not find item instance for", itemDefinition.hash);
            return <>Error: Could not find item instance for {itemDefinition.hash}.</>
          }
          const itemInstanceDetails = itemComponents[itemInstance.itemInstanceId];
          return (
            <EquipmentItem
              key={(itemInstance as BI.Destiny.Entities.Items.DestinyItemComponent).itemInstanceId}
              itemInstance={itemInstance as BI.Destiny.Entities.Items.DestinyItemComponent}
              itemDefinition={itemDefinition}
              itemInstanceDetails={itemInstanceDetails}
              damageTypes={damageTypes.current}
              energyTypes={energyTypes.current}
            />
          )
        })}
      </Stack>
      <Box sx={{ ml: 1, display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "55px", mt: 1 }}>
          <IconButton size="small" onClick={onLoadFireteam} sx={{ p: 0 }}>
            <GroupAddIcon fontSize="small" />
          </IconButton>
        </Box>
        <ItemMods
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