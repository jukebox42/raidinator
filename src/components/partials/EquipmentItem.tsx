import React, { useState, useEffect, useMemo } from "react";
import {
  Paper,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";
import { LIGHT_GG_URL } from "../../utils/constants";

interface EquipmentItemProps {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent;
  itemInstanceDetails: BI.Destiny.Entities.Items.DestinyItemInstanceComponent;
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Manifest.DestinyEnergyType[];
}

/**
 * Determine if we should display the equipment item or not. We only care about weapons and exotic armor.
 */
export const shouldDisplayEquipmentItem = (itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition) => {
  const isWeapon = itemDefinition.traitIds.includes("item_type.weapon");
  const isArmor = itemDefinition.traitIds.includes("item_type.armor");
  const isExoticArmor = itemDefinition.equippingBlock.uniqueLabel === "exotic_armor";

  return isWeapon || (isArmor && isExoticArmor);
}

/**
 * Builds the classes to put on the equipment (i.e. if it's masterworked or not)
 */
const buildClassString = (itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent, isExotic: boolean) => {
  const classes = ["icon-item"];

  // no idea if this is right. exotics seem to end at 4. norms end at 5?
  if ((itemInstance.state === 5 && !isExotic) || (itemInstance.state === 4 && isExotic)) {
    classes.push("masterworked");
  }
  return classes.join(" ");
}

const EquipmentItem = ( {itemDefinition, itemInstance, itemInstanceDetails, damageTypes, energyTypes}: EquipmentItemProps ) => {
  const [clickCount, setClickCount] = useState(0);
  const isWeapon = itemDefinition.traitIds.includes("item_type.weapon");
  const isArmor = itemDefinition.traitIds.includes("item_type.armor");
  const isExoticArmor = itemDefinition.equippingBlock.uniqueLabel === "exotic_armor";
  const isExoticWeapon = itemDefinition.equippingBlock.uniqueLabel === "exotic_weapon";

  // get item classes
  const classes = buildClassString(itemInstance,  isExoticArmor || isExoticWeapon);

  const elementTypes = isWeapon ? damageTypes : energyTypes;

  // find element type
  const elementType = elementTypes?.find(et => {
    // ignore kinetic
    if (et.hash === 3373582085) {
      return;
    }
    // if the item definition has an energy dict then it's armor
    if (isArmor) {
      return et.hash === itemInstanceDetails.energy?.energyTypeHash;
    }
    // otherwise it"s a weapon
    return et.hash === itemInstanceDetails.damageTypeHash;
  });

  const itemUrl = `${LIGHT_GG_URL}${itemDefinition.hash}`;

  const onClick = (e: any) => {
    setClickCount(clickCount + 1);
  }

  // handle open in new window
  useEffect(() => {
    if (clickCount === 0) {
      return;
    }

    // on the first click set a timeout
    if (clickCount === 1) {
      setTimeout(() => {
        setClickCount(0);
      }, 300);
      return;
    }

    setClickCount(0);
    window.open(itemUrl, '_blank')
  }, [clickCount])

  return (
    <Paper
      key={itemInstance.itemInstanceId}
      elevation={0}
      className={classes}
      onClick={onClick}
    >
      <img src={getAssetUrl(itemDefinition.displayProperties.icon)} className="icon" />
      <img
        src={getAssetUrl(itemDefinition.quality.displayVersionWatermarkIcons[itemInstance.versionNumber])}
        className="icon"

      />
      {elementType?.displayProperties.hasIcon &&
        <img src={getAssetUrl(elementType.displayProperties.icon)} className="icon-element"/>}
    </Paper>
  )
}

export default EquipmentItem;