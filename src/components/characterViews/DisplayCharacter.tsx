import { useState, useRef, useEffect, useContext } from "react";
import { v4 as uuid } from "uuid";
import {
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import WarningIcon from "@mui/icons-material/Warning";
import uniq from "lodash/uniq";

import db from "../../store/db";
import { AppContext } from "../../context/AppContext";
import { getAssetUrl } from "../../utils/functions";
import { LIGHT_STAT_HASH } from "../../utils/constants";

// Components
import LoadingCharacter from "./LoadingCharacter";
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
import * as Definitions from "../../bungie/interfaces/Destiny/Definitions";
import { CharacterContext } from "../../context/CharacterContext";

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
  const lightStatType = statTypes.current.find(t => t.hash.toString() === LIGHT_STAT_HASH);
  if (!lightStatType) {
    //TODO: this really doesn't need to be so extreme. We need a "missing" icon
    const errorText = `Error: Could not find light stat for ${player.bungieGlobalDisplayName}`;
    appContext.addToast(errorText, "error");
    context.setError(errorText);
    return <></>;
  }

  // get subclass
  const subclassDefinition = itemDefinitions.current.find(idef => isSubClass(idef));
  if (!subclassDefinition) {
    // TODO see the one about light
    const errorText = `Error: Could not find subclass definition for ${player.bungieGlobalDisplayName}`;
    appContext.addToast(errorText, "error");
    context.setError(errorText);
    return <></>;
  }
  const subclassInstance = items.find(gi => gi.itemHash === subclassDefinition?.hash);

  const weapons = itemDefinitions.current
    .filter(i => i.traitIds && i.traitIds.includes("item_type.weapon"));
  // get all the weapon energy types
  const weaponEnergyTypes = uniq(weapons.map(w => convertDamageTypeToEnergyType(w.damageTypes)).flat());
  // get all the weapon types. yes this will include item_type.weapon but we dont care.
  const weaponTypes = uniq(weapons.map(i => i.traitIds).flat());

  // TODO: is last online should be a shared function
  let isLastOnline = true;
  if (context.data) {
    const characters = context.data.characters.data;
    const sortedCharacterKeys = Object.keys(characters).sort((a: any, b: any) => {
      return (new Date(characters[a].dateLastPlayed) as any) +
            (new Date(characters[b].dateLastPlayed) as any);
    });
    isLastOnline = character.characterId.toString() === sortedCharacterKeys[0].toString();
  }

  return (
    <>
      <Box sx={{ p: 0, m: 0, ml: 1, display: "flex", flexDirection: "row" }}>
        <Button
          key={character.characterId}
          variant="text"
          onClick={onChangeCharacter}
          sx={{ padding: 0, position: "relative" }}
        >
          <img src={getAssetUrl(character.emblemPath)} className="icon-character"/>
          {!isLastOnline && <WarningIcon color="warning" sx={{ position: "absolute", right: 0, top: 0, width: "20px", height: "20px" }} />}
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <PlayerName player={player} classType={character.classType} />
          <CharacterStats stats={character.stats} statTypes={statTypes.current} />
        </Box>
        <Box sx={{ display: "flex", m: 1, mb: 0 }}>
          <img src={getAssetUrl(lightStatType.displayProperties.icon)} className="icon-light invert" />
          <Typography variant="subtitle1" sx={{ mt: "-3px" }}>
            {character.light}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" sx={{ ml: 1 }}>
        <CharacterSubclass
          sockets={sockets}
          talentGrids={talentGrids}
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
            appContext.addToast(
              `Error: Could not find item instance for ${itemDefinition.displayProperties.name}`,
              "error"
            );
            return <Skeleton key={uuid()} variant="rectangular" width={55} height={55} sx={{mt:1, mr: 1}} />
          }
          const itemInstanceDetails = itemComponents[itemInstance.itemInstanceId];
          return (
            <EquipmentItem
              key={uuid()}
              itemInstance={itemInstance}
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