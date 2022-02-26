import React, { useState, useEffect, useMemo } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";

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
  EquipmentItem,
  shouldDisplayEquipmentItem
} from "../partials";

// Interfaces
import { GuardianData, PlayerData } from "../../utils/interfaces";
import * as BI from "../../bungie/interfaces/";

interface DisplayGuardianProps {
  player: PlayerData;
  guardian: GuardianData;
  onLoadFireteam: () => void
}

const DisplayGuardian = ( { player, guardian, onLoadFireteam }: DisplayGuardianProps ) => {
  const [damageTypes, setDamageTypes] = useState<BI.Destiny.Definitions.DestinyDamageTypeDefinition[]>([]);
  const [energyTypes, setEnergyTypes] = useState<BI.Manifest.DestinyEnergyType[]>([]);
  const [statTypes, setStatTypes] = useState<BI.Manifest.DestinyStatType[]>([]);
  const [plugTypes, setPlugTypes] = useState<BI.Manifest.DestinyStatType[]>([]);

  // Load character dbs
  const itemDefinitions = useLiveQuery(async () => {
    setDamageTypes(await db.DestinyDamageTypeDefinition.toArray());
    setEnergyTypes(await db.DestinyEnergyTypeDefinition.toArray());
    setStatTypes(await db.DestinyStatDefinition.toArray());
    setPlugTypes(await db.DestinyPlugSetDefinition.toArray());

    // push items into a map so they are easier to index
    return await db.DestinyInventoryItemDefinition.bulkGet(
      guardian.inventory.items.map(item => item.itemHash.toString())
    );
  });

  // Get the light stat type
  const lightStatType = statTypes.find(type => type.hash === 1935470627);

  // Wait for all the dbs to load
  if(
    damageTypes.length === 0 ||
    energyTypes.length === 0 ||
    statTypes.length === 0 ||
    plugTypes.length === 0 ||
    !itemDefinitions || itemDefinitions.length === 0 ||
    !lightStatType
  ) {
    return <Box sx={{ p: 0 }}><Loading marginTop="43px" /></Box>;
  }

  const subclassDefinition = itemDefinitions.find(itemDefinition => isSubClass(itemDefinition));
  const subclassInstance = guardian.inventory.items.find(gi => gi.itemHash === subclassDefinition?.hash);

  return (
    <>
      <Box sx={{p:0, m:0, ml: 1, display: "flex", flexDirection: "row"}}>
        <img src={getAssetUrl(guardian.character.emblemPath)} className="icon-emblem"/>
        <Box sx={{ flexGrow: 1 }}>
          <PlayerName player={player} />
          <CharacterStats stats={guardian.character.stats} statTypes={statTypes} />
        </Box>
        <Box sx={{ display: "flex", m: 1, mb: 0 }}>
          <img src={getAssetUrl(lightStatType.displayProperties.icon)} className="icon-light invert" />
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
        {itemDefinitions?.map((itemDefinition: any) => {
          // only equipment has traits so dont render an item
          if (!itemDefinition.traitIds || !shouldDisplayEquipmentItem(itemDefinition)) {
            return;
          }
          const itemInstance = guardian.inventory.items.find(gi => gi.itemHash === itemDefinition.hash);
          const itemInstanceDetails = guardian.itemComponents.instances.data[(itemInstance as any).itemInstanceId];
          return (
            <EquipmentItem key={(itemInstance as BI.Destiny.Entities.Items.DestinyItemComponent).itemInstanceId}
              itemInstance={itemInstance as BI.Destiny.Entities.Items.DestinyItemComponent}
              itemDefinition={itemDefinition}
              itemInstanceDetails={itemInstanceDetails}
              damageTypes={damageTypes}
              energyTypes={energyTypes}
            />
          )
        })}
      </Stack>
      <Box sx={{ ml: 1, display: "flex", flexDirection: "row" }}>
        <Box sx={{ width: "55px" }}>
          <IconButton size="small" onClick={onLoadFireteam}>
            <GroupAddIcon fontSize="small" />
          </IconButton>
        </Box>
        <ItemMods
          itemInstances={guardian.itemComponents.instances}
          itemSockets={guardian.itemComponents.sockets}
          characterEquipment={guardian.inventory}
        />
        {/*<Mods characterId={guardian.character.characterId.toString()} characterPlugSets={guardian.characterPlugSets} />*/}
      </Box>
    </>
  )
}

export default DisplayGuardian;