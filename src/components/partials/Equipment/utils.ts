import { KINETIC_DAMAGE_HASH } from "../../../utils/constants";

// Interfaces
import * as BI from "../../../bungie/interfaces";
import {
  DestinyDamageTypeDefinition as DamageType,
} from "../../../bungie/interfaces/Destiny/Definitions";
import {
  DestinyEnergyTypeDefinition as EnergyType,
} from "../../../bungie/interfaces/Destiny/Definitions/EnergyTypes";

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
 * Find the element type of the particular item
 */
export const findElementType = (
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition,
  itemInstanceDetails: BI.Destiny.Entities.Items.DestinyItemInstanceComponent,
  elementTypes: DamageType[] | EnergyType[],
) => {
  const isArmor = itemDefinition.traitIds.includes("item_type.armor");
  // find element type
  const elementType = (elementTypes as any).find((et: DamageType | EnergyType) => {
    // ignore kinetic
    if (et.hash === KINETIC_DAMAGE_HASH) {
      return;
    }
    // if the item definition has an energy dict then it's armor
    if (isArmor) {
      return et.hash === itemInstanceDetails.energy?.energyTypeHash;
    }
    // otherwise it"s a weapon
    return et.hash === itemInstanceDetails.damageTypeHash;
  });

  return elementType;
}