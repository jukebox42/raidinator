import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";

interface CharacterSubclassProps {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent | undefined;
}

/**
 * Determine if an item is a subclass
 */
export const isSubClass = (itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined) => {
  return itemDefinition && itemDefinition.traitIds && (
         itemDefinition.traitIds.includes("item_type.light_subclass") ||
         itemDefinition.traitIds.includes("item_type.dark_subclass"));
}

const CharacterSubclass = ( {itemDefinition, itemInstance}: CharacterSubclassProps ) => {
  if (!itemDefinition || !itemInstance) {
    return <></>;
  }
  // console.log("Subclass", itemDefinition, itemInstance);
  return (
    <Paper key={itemInstance.itemInstanceId} elevation={0} className="icon-item">
      <img src={getAssetUrl(itemDefinition.displayProperties.icon)} className="icon" />
    </Paper>
  )
}

export default CharacterSubclass;