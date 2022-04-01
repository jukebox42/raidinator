import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Paper,
  Typography,
} from "@mui/material";
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import db from "../../../store/db";
import { getAssetUrl } from "../../../utils/functions";
import { selectedSubclassNode } from "./utils";

// Components
import { Caption, DetailTooltip, Image } from "../../generics";
import { ReactComponent as HunterSymbol } from "../../../assets/hunter_emblem.svg";
import { ReactComponent as WarlockSymbol } from "../../../assets/warlock_emblem.svg";
import { ReactComponent as TitanSymbol } from "../../../assets/titan_emblem.svg";

// Interfaces
import * as BI from "../../../bungie/interfaces";
import { DataCollection } from "../../../bungie/interfaces/Dictionaries";
import { DestinyItemSocketsComponent, DestinyItemTalentGridComponent } from "../../../bungie/interfaces/Destiny/Entities/Items";

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

type Props = {
  sockets: DataCollection<DestinyItemSocketsComponent>;
  talentGrids: DataCollection<DestinyItemTalentGridComponent>;
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition | undefined;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent | undefined;
}

const Subclass = ( {itemDefinition, itemInstance, sockets, talentGrids}: Props ) => {
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
  const className = `subclass ${superType} superVersion${superVersion}`;
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
    <Paper key={itemInstance.itemInstanceId} variant="equipment" className={className}>
      <Image src={getAssetUrl(superAbility.displayProperties.icon)} variant="item" />
      {position === "T" && <ArrowDropUpIcon  sx={{ ...vArrowSx, top: "-14px" }} />}
      {position === "M" && <ArrowRightIcon sx={{ ...arrowSx, right: "-14px", top: "50%", mt: "-20px" }} />}
      {position === "B" && <ArrowDropDownIcon sx={{ ...vArrowSx, bottom: "-14px" }} />}
    </Paper>
    </DetailTooltip>
  )
}

export default Subclass;