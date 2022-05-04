import { useLiveQuery } from "dexie-react-hooks";
import { Box, Link, Paper, Typography } from "@mui/material";

import db from "store/db";
import { getAssetUrl } from "utils/functions";
import { findElementType } from "./utils";

// Components
import { Description, DetailTooltip, Image } from "../../generics";

// Interfaces
import * as BI from "bungie/interfaces";
import { LIGHT_GG_URL } from "utils/constants";
import { getExoticArmorMods } from "../Mods/rules/exoticArmorRules";

type Props = {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent;
  itemInstanceDetails: BI.Destiny.Entities.Items.DestinyItemInstanceComponent;
  itemSockets: BI.Destiny.Entities.Items.DestinyItemSocketsComponent;
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition[];
}

const Item = ( {itemDefinition, itemInstance, itemInstanceDetails, itemSockets, damageTypes, energyTypes}: Props ) => {
  const isWeapon = itemDefinition.traitIds.includes("item_type.weapon");
  const elementTypes = isWeapon ? damageTypes : energyTypes;
  const elementType = findElementType(itemDefinition, itemInstanceDetails, elementTypes);
  const itemUrl = `${LIGHT_GG_URL}${itemDefinition.hash}`;
  const watermarkIcon = itemDefinition.quality.displayVersionWatermarkIcons[itemInstance.versionNumber];

  const exoticPlugs = useLiveQuery(async () => {
    const socketHashes = itemSockets.sockets.filter(s => !!s.plugHash).map(s => s.plugHash.toString());
    const plugs = await db.DestinyInventoryItemDefinition.bulkGet(socketHashes);
    return getExoticArmorMods(plugs as any);
  });

  const renderItemName = (
    itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition,
    elementType: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition
  ) => {
    if (elementType?.displayProperties.hasIcon) {
      return (
        <Box sx={{ p: 0, m: 0, display: "flex", flexDirection: "row" }}>
          <Typography variant="h6" sx={{ flexGrow: 1, mr: 2 }}>
            <Link href={itemUrl} target="_blank" color="inherit" underline="none">
              {itemDefinition.displayProperties.name}
            </Link>
          </Typography>
          <Image src={getAssetUrl(elementType.displayProperties.icon)} sx={{ width: 22, height: 22, mt: 1 }} />
        </Box>
      )
    }

    return (
      <Typography variant="h6">
        <Link href={itemUrl} target="_blank" color="inherit" underline="none">
          {itemDefinition.displayProperties.name}
        </Link>
      </Typography>
    )
  }

  const renderExoticPerks = (plugs: BI.Destiny.Definitions.DestinyInventoryItemDefinition[] | undefined) => {
    if (!plugs || plugs.length === 0) {
      return (<></>);
    }

    return plugs.map(plug => (
      <Box key={plug.hash}>
        <Box sx={{ p: 0, m: 0, mt: 2, display: "flex", flexDirection: "row" }}>
          <Image src={getAssetUrl(plug.displayProperties.icon)} sx={{ width: 22, height: 22, mt: 1, mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {plug.displayProperties.name}
          </Typography>
        </Box>
        <Description>{plug.displayProperties.description}</Description>
      </Box>
    ))
  }

  return (
    <DetailTooltip title={
      <>
        {renderItemName(itemDefinition, elementType)}
        <Description fade>{itemDefinition.itemTypeDisplayName}</Description>
        {renderExoticPerks(exoticPlugs)}
      </>
    } flow={false}>
      <Paper key={itemInstance.itemInstanceId} variant="equipment">
        <Image src={getAssetUrl(itemDefinition.displayProperties.icon)} variant="item" />
        <Image src={getAssetUrl(watermarkIcon)} variant="item" />
        {elementType?.displayProperties.hasIcon &&
          <Image src={getAssetUrl(elementType.displayProperties.icon)} variant="energy" />}
      </Paper>
    </DetailTooltip>
  )
}

export default Item;