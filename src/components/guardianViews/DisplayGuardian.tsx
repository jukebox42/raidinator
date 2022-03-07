import React, { useState, useEffect, useMemo, useRef } from "react";
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

// Components
import { Loading } from "../generics";
import {
  Mods,
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
import { GuardianData, PlayerData } from "../../utils/interfaces";
import * as BI from "../../bungie/interfaces/";
import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";

interface DisplayGuardianProps {
  player: PlayerData;
  guardian: GuardianData;
  onChangeCharacter: () => void;
  onLoadFireteam: () => void;
}

const DisplayGuardian = ( { player, guardian, onChangeCharacter, onLoadFireteam }: DisplayGuardianProps ) => {
  const [loaded, setLoaded] = useState(false);
  let damageTypes =  useRef<BI.Destiny.Definitions.DestinyDamageTypeDefinition[]>([]);
  let energyTypes = useRef<BI.Manifest.DestinyEnergyType[]>([]);
  let statTypes = useRef<BI.Manifest.DestinyStatType[]>([]);
  let plugTypes = useRef<BI.Manifest.DestinyStatType[]>([]);
  let itemDefinitions = useRef<(DestinyInventoryItemDefinition | undefined)[]>([]);

  // Load character dbs
  useLiveQuery(async () => {
    damageTypes.current = await db.DestinyDamageTypeDefinition.toArray();
    energyTypes.current = await db.DestinyEnergyTypeDefinition.toArray();
    statTypes.current = await db.DestinyStatDefinition.toArray();
    plugTypes.current = await db.DestinyPlugSetDefinition.toArray();

    // push items into a map so they are easier to index
    itemDefinitions.current = await db.DestinyInventoryItemDefinition.bulkGet(
      guardian.inventory.items.map(item => item.itemHash.toString())
    );
    setLoaded(true);
  });

  

  // Wait for all the dbs to load
  if(!loaded) {
    return <Box sx={{ p: 0 }}><Loading marginTop="43px" /></Box>;
  }

  // Get the light stat type
  const lightStatType = statTypes.current.find(type => type.hash === 1935470627);

  // get subclass
  const subclassDefinition = itemDefinitions.current.find(itemDefinition => isSubClass(itemDefinition));
  const subclassInstance = guardian.inventory.items.find(
    gi => gi.itemHash === subclassDefinition?.hash);

  const weapons = (itemDefinitions.current as DestinyInventoryItemDefinition[])
    .filter(i => i.traitIds && i.traitIds.includes("item_type.weapon"));
  // get all the weapon energy types
  const weaponEnergyTypes = uniq(weapons.map(w => convertDamageTypeToEnergyType(w.damageTypes)).flat());
  // get all the weapon types. yes this will include item_type.weapon but we dont care.
  const weaponTypes = uniq(weapons.map(i => i.traitIds).flat())

  return (
    <>
      <Box sx={{p:0, m:0, ml: 1, display: "flex", flexDirection: "row"}}>
        <img
          src={getAssetUrl(guardian.character.emblemPath)}
          className="icon-emblem"
          onClick={onChangeCharacter}
        />
        <Box sx={{ flexGrow: 1 }}>
          <PlayerName player={player} classType={guardian.character.classType} />
          <CharacterStats stats={guardian.character.stats} statTypes={statTypes.current} />
        </Box>
        <Box sx={{ display: "flex", m: 1, mb: 0 }}>
          <img
            src={getAssetUrl((lightStatType as BI.Manifest.DestinyStatType).displayProperties.icon)}
            className="icon-light invert"
          />
          <Typography variant="subtitle1" sx={{ mt: "-3px" }}>
            {guardian.character.light}
          </Typography>
        </Box>
      </Box>
      <Stack direction="row" sx={{ ml: 1 }}>
        <CharacterSubclass
          itemDefinition={subclassDefinition}
          itemInstance={subclassInstance}
        />
        {itemDefinitions.current.map((itemDefinition: any) => {
          // only equipment has traits so dont render an item
          if (!itemDefinition.traitIds || !shouldDisplayEquipmentItem(itemDefinition)) {
            return;
          }
          const itemInstance = guardian.inventory.items.find(
            gi => gi.itemHash === itemDefinition.hash);
          const itemInstanceDetails =
            guardian.itemComponents.instances.data[(itemInstance as any).itemInstanceId];
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
          itemInstances={guardian.itemComponents.instances}
          itemSockets={guardian.itemComponents.sockets}
          characterEquipment={guardian.inventory}
          weaponTypes={weaponTypes}
          weaponEnergyTypes={weaponEnergyTypes}
          subclassEnergyType={getSubclassEnergyType(subclassDefinition)}
        />
        {/*<Mods
          characterId={guardian.character.characterId.toString()}
          characterPlugSets={guardian.characterPlugSets}
        />*/}
      </Box>
    </>
  )
}

export default DisplayGuardian;