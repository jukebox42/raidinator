import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Components
import { ReactComponent as HunterSymbol } from '../../assets/hunter_emblem.svg';
import { ReactComponent as WarlockSymbol } from '../../assets/warlock_emblem.svg';
import { ReactComponent as TitanSymbol } from '../../assets/titan_emblem.svg';

// Interfaces
import * as BI from "../../bungie/interfaces";

// so I dont need to get them from the DB
enum ClassType {
  WARLOCK = 2,
  TITAN = 0,
  HUNTER = 1,
};

enum EnergyType {
  KINETIC = 0,
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
 * Conver an array of damage types to energy types. I dunno why these arent the same but they arent.
 * see DestinySamageTypeDefinition and DestinyEnergyTypeDefinition for proof.
 */
export const convertDamageTypeToEnergyType = (damageTypes: number[]): EnergyType[] => {
  return damageTypes.map(dt => {
    switch(dt) {
      case 2:
        return EnergyType.ARC;
      case 3:
        return EnergyType.SOLAR;
      case 4:
        return EnergyType.VOID;
      case 6:
        return EnergyType.STASIS;
      default:
        return EnergyType.KINETIC;
    }
  });
}

/**
 * Returns the svg of the characters class
 */
export const getClassSvg = (classType: ClassType) => {
  if (classType === ClassType.HUNTER) {
    return <HunterSymbol />;
  }
  if (classType === ClassType.TITAN) {
    return <TitanSymbol />;
  }

  return <WarlockSymbol />;
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