import { useLiveQuery } from "dexie-react-hooks";
import {
  Paper,
  Typography,
} from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import { getAssetUrl } from "../../utils/functions";
import { selectedSubclassNode } from "./subclass";

// Components
import { Caption, DetailTooltip } from "../generics";
import { ReactComponent as HunterSymbol } from "../../assets/hunter_emblem.svg";
import { ReactComponent as WarlockSymbol } from "../../assets/warlock_emblem.svg";
import { ReactComponent as TitanSymbol } from "../../assets/titan_emblem.svg";

// Interfaces
import * as BI from "../../bungie/interfaces";
import { DataCollection } from "../../bungie/interfaces/Dictionaries";
import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";
import db from "../../store/db";
import { DestinyItemSocketsComponent, DestinyItemTalentGridComponent } from "../../bungie/interfaces/Destiny/Entities/Items";
import { useState } from "react";

type Props = {
  sockets: DataCollection<DestinyItemSocketsComponent>;
  talentGrids: DataCollection<DestinyItemTalentGridComponent>;
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

const CharacterSubclass = ( {itemDefinition, itemInstance, sockets, talentGrids}: Props ) => {
  const [position, setPosition] = useState("");
  const [superVersion, setSuperVersion] = useState(3);

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

    setSuperVersion(2);

    // Get the current talent grid
    const talentGrid = talentGrids.data[itemInstance.itemInstanceId];
    if (!talentGrid) {
      console.error("Failed to find the talent grid");
      return itemDefinition; // fallback show element
    }

    // get the definition for the talent grid
    const gridDef = await db.DestinyTalentGridDefinition.get(talentGrid.talentGridHash.toString());
    if (!gridDef) {
      console.error("Failed to find the grid definition");
      return itemDefinition; // fallback show element
    }

    // get only the active talent grid nodes
    const activeGridDefNodes = gridDef.nodes.filter(dn => {
      // filters down to only active nodes that are not hidden
      return !!talentGrid.nodes.find(tn => tn.nodeHash === dn.nodeHash && tn.isActivated && !tn.hidden);
    });

    // get the super node
    const { superNode, position } = selectedSubclassNode(activeGridDefNodes);
    if (superNode) {
      setPosition(position);
      return superNode.steps[0];
    }

    return itemDefinition;
  });

  if (!itemDefinition || !itemInstance || !superAbility) {
    return <></>;
  }

  const superType = itemDefinition.talentGrid.buildName.replace(/_.*/, "");

  const arrowSx = { position: "absolute", fontSize: "40px"};
  const vArrowSx = { ...arrowSx, left: "50%", ml: "-20px"};

  return (
    <DetailTooltip title={
      <>
        <Typography variant="body1"><strong>{superAbility.displayProperties.name}</strong></Typography>
        <Caption fade>{itemDefinition.flavorText}</Caption>
        <Caption>{superAbility.displayProperties.description}</Caption>
      </>
    } flow={false}>
    <Paper key={itemInstance.itemInstanceId} elevation={0} className={`icon-item subclass ${superType} superVersion${superVersion}`} sx={{ background: "none" }}>
      <img src={getAssetUrl(superAbility.displayProperties.icon)} className="icon" />
      {position === "T" && <ArrowDropUpIcon  sx={{ ...vArrowSx, top: "-14px" }} />}
      {position === "M" && <ArrowRightIcon sx={{ ...arrowSx, right: "-14px", top: "50%", mt: "-20px" }} />}
      {position === "B" && <ArrowDropDownIcon sx={{ ...vArrowSx, bottom: "-14px" }} />}
    </Paper>
    </DetailTooltip>
  )
}

export default CharacterSubclass;