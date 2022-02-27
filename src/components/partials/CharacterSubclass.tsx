import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";

enum EnergyType {
  VOID = 3,
  SOLAR = 2,
  ARC = 1,
  STASIS = 6,
};

interface CharacterSubclassProps {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent | undefined;
}

/**
 * Get the energy of the subclass
 *
 * TODO: this is silly, there has to be a better way(and a better spot)
 */
export const getSubclassEnergyType = (subclassDefinition: any) => {
  if (/^void/.test(subclassDefinition.talentGrid.buildName)) {
    return EnergyType.VOID;
  }
  if (/^thermal/.test(subclassDefinition.talentGrid.buildName)) {
    return EnergyType.SOLAR;
  }
  if (/^arc/.test(subclassDefinition.talentGrid.buildName)) {
    return EnergyType.ARC;
  }
  if (/^stasis/.test(subclassDefinition.talentGrid.buildName)) {
    return EnergyType.STASIS;
  }

  // fallthrough
  console.error("ENERGY TYPE NOT MATCHED", subclassDefinition);
  return EnergyType.SOLAR;
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
  console.log("Subclass", itemDefinition, itemInstance);
  return (
    <Paper key={itemInstance.itemInstanceId} elevation={0} className="icon-item">
      <img src={getAssetUrl(itemDefinition.displayProperties.icon)} className="icon" />
    </Paper>
  )
}

export default CharacterSubclass;