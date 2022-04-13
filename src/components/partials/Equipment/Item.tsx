import { useState, useEffect } from "react";
import { Paper, Typography } from "@mui/material";

import { getAssetUrl } from "../../../utils/functions";
import { findElementType } from "./utils";

// Components
import { Caption, DetailTooltip, Image } from "../../generics";

// Interfaces
import * as BI from "../../../bungie/interfaces";
import { LIGHT_GG_URL } from "../../../utils/constants";

type Props = {
  itemDefinition: BI.Destiny.Definitions.DestinyInventoryItemDefinition;
  itemInstance: BI.Destiny.Entities.Items.DestinyItemComponent;
  itemInstanceDetails: BI.Destiny.Entities.Items.DestinyItemInstanceComponent;
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition[];
}

const Item = ( {itemDefinition, itemInstance, itemInstanceDetails, damageTypes, energyTypes}: Props ) => {
  const [clickCount, setClickCount] = useState(0);
  const isWeapon = itemDefinition.traitIds.includes("item_type.weapon");
  const elementTypes = isWeapon ? damageTypes : energyTypes;
  const elementType = findElementType(itemDefinition, itemInstanceDetails, elementTypes);
  const itemUrl = `${LIGHT_GG_URL}${itemDefinition.hash}`;
  const watermarkIcon = itemDefinition.quality.displayVersionWatermarkIcons[itemInstance.versionNumber];

  const onClick = () => {
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
  }, [clickCount]);

  return (
    <DetailTooltip title={
      <>
        <Typography variant="body1">
          {elementType?.displayProperties.hasIcon &&
            <img src={getAssetUrl(elementType.displayProperties.icon)} width="12" style={{ marginRight: 5 }} />}
          <strong>{itemDefinition.displayProperties.name}</strong>
        </Typography>
        <Caption fade>{itemDefinition.itemTypeDisplayName}</Caption>
        <Caption>{itemDefinition.flavorText}</Caption>
      </>
    } flow={false}>
      <Paper key={itemInstance.itemInstanceId} variant="equipment" onClick={onClick}>
        <Image src={getAssetUrl(itemDefinition.displayProperties.icon)} variant="item" />
        <Image src={getAssetUrl(watermarkIcon)} variant="item" />
        {elementType?.displayProperties.hasIcon &&
          <Image src={getAssetUrl(elementType.displayProperties.icon)} variant="energy" />}
      </Paper>
    </DetailTooltip>
  )
}

export default Item;