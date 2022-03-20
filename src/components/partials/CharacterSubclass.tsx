import { useLiveQuery } from "dexie-react-hooks";
import {
  Paper,
  Typography,
} from "@mui/material";

import { getAssetUrl } from "../../utils/functions";

// Components
import { Caption, DetailTooltip } from "../generics";
import { ReactComponent as HunterSymbol } from '../../assets/hunter_emblem.svg';
import { ReactComponent as WarlockSymbol } from '../../assets/warlock_emblem.svg';
import { ReactComponent as TitanSymbol } from '../../assets/titan_emblem.svg';

// Interfaces
import * as BI from "../../bungie/interfaces";
import { DataCollection } from "../../bungie/interfaces/Dictionaries";
import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";
import db from "../../store/db";
import { DestinyItemSocketsComponent } from "../../bungie/interfaces/Destiny/Entities/Items";

type Props = {
  sockets: DataCollection<DestinyItemSocketsComponent>;
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent | undefined;
}

/**
 * Conver an array of damage types to energy types. I dunno why these arent the same but they arent.
 * see DestinySamageTypeDefinition and DestinyEnergyTypeDefinition for proof.
 */
export const convertDamageTypeToEnergyType = (damageTypes: number[]): BI.Destiny.DestinyEnergyType[] => {
  return damageTypes.map(dt => {
    switch(dt) {
      case 2:
        return BI.Destiny.DestinyEnergyType.Arc;
      case 3:
        return BI.Destiny.DestinyEnergyType.Thermal;
      case 4:
        return BI.Destiny.DestinyEnergyType.Void;
      case 6:
        return BI.Destiny.DestinyEnergyType.Stasis;
      default:
        return BI.Destiny.DestinyEnergyType.Any;
    }
  });
}

/**
 * Returns the svg of the characters class
 */
export const getClassSvg = (classType: BI.Destiny.DestinyClass) => {
  if (classType === BI.Destiny.DestinyClass.Hunter) {
    return <HunterSymbol />;
  }
  if (classType === BI.Destiny.DestinyClass.Titan) {
    return <TitanSymbol />;
  }

  return <WarlockSymbol />;
}

/**
 * Get the energy of the subclass
 *
 * TODO: this is silly, there has to be a better way(and a better spot)
 */
export const getSubclassEnergyType = (subclassDefinition: DestinyInventoryItemDefinition) => {
  if (/^void/.test(subclassDefinition.talentGrid.buildName)) {
    return BI.Destiny.DestinyEnergyType.Void;
  }
  if (/^thermal/.test(subclassDefinition.talentGrid.buildName)) {
    return BI.Destiny.DestinyEnergyType.Thermal;
  }
  if (/^arc/.test(subclassDefinition.talentGrid.buildName)) {
    return BI.Destiny.DestinyEnergyType.Arc;
  }
  if (/^stasis/.test(subclassDefinition.talentGrid.buildName)) {
    return BI.Destiny.DestinyEnergyType.Stasis;
  }

  // fallthrough
  console.error("ENERGY TYPE NOT MATCHED", subclassDefinition);
  return BI.Destiny.DestinyEnergyType.Any;
}

/**
 * Determine if an item is a subclass
 */
export const isSubClass = (itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined) => {
  return itemDefinition && itemDefinition.traitIds && (
         itemDefinition.traitIds.includes("item_type.light_subclass") ||
         itemDefinition.traitIds.includes("item_type.dark_subclass"));
}

const CharacterSubclass = ( {itemDefinition, itemInstance, sockets}: Props ) => {
  // console.log("Subclass", itemDefinition, itemInstance);

  // Find super ability
  const superAbility = useLiveQuery(async () => {
    if (!itemInstance) {
      return;
    }
    const id = itemInstance.itemInstanceId;
    // New super 3.0
    if (sockets.data[id]) {
      const definitions = await db.DestinyInventoryItemDefinition.bulkGet(
        sockets.data[id].sockets.map(i => i.plugHash.toString())
      )

      return definitions.find(a => a?.itemTypeDisplayName === "Super Ability");
    }

    // I checked talent grid and there's nothing in there. I need to
    // find the super icons for non 3.0 supers.
    return itemDefinition;
  });

  if (!itemDefinition || !itemInstance || !superAbility) {
    return <></>;
  }

  // console.log("Subclass Socket", superAbility, itemInstance);

  return (
    <DetailTooltip title={
      <>
        <Typography variant="body1"><strong>{superAbility.displayProperties.name}</strong></Typography>
        <Caption fade>{itemDefinition.flavorText}</Caption>
        <Caption>{superAbility.displayProperties.description}</Caption>
      </>
    } flow={false}>
    <Paper key={itemInstance.itemInstanceId} elevation={0} className="icon-item subclass" sx={{ background: "none" }}>
      <img src={getAssetUrl(superAbility.displayProperties.icon)} className="icon" />
    </Paper>
    </DetailTooltip>
  )
}

export default CharacterSubclass;