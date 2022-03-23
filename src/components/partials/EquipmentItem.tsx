import { useState, useEffect } from "react";
import { Paper } from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Interfaces
import * as BI from "../../bungie/interfaces";
import {
  DestinyDamageTypeDefinition as DamageType,
} from "../../bungie/interfaces/Destiny/Definitions";
import {
  DestinyEnergyTypeDefinition as EnergyType,
} from "../../bungie/interfaces/Destiny/Definitions/EnergyTypes";
import { LIGHT_GG_URL } from "../../utils/constants";

type EquipmentItemProps = {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent;
  itemInstanceDetails: BI.Destiny.Entities.Items.DestinyItemInstanceComponent;
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition[];
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

const EquipmentItem = ( {itemDefinition, itemInstance, itemInstanceDetails, damageTypes, energyTypes}: EquipmentItemProps ) => {
  const [clickCount, setClickCount] = useState(0);
  const isWeapon = itemDefinition.traitIds.includes("item_type.weapon");
  const isArmor = itemDefinition.traitIds.includes("item_type.armor");

  const elementTypes = isWeapon ? damageTypes : energyTypes;

  // find element type
  const elementType = (elementTypes as any).find((et: DamageType | EnergyType) => {
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

  const onClick = (_: any) => {
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
    window.open(itemUrl, "_blank")
  }, [clickCount])

  return (
    <Paper
      key={itemInstance.itemInstanceId}
      elevation={0}
      className={"icon-item"}
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