import { useContext } from "react";
import { v4 as uuid } from "uuid";
import { Skeleton } from "@mui/material";

import { shouldDisplayEquipmentItem } from "./utils";
import { AppContext } from "../../../context/AppContext";

// Components
import Item from "./Item";

// Interfaces
import * as BI from "../../../bungie/interfaces";

type Props = {
  items: BI.Destiny.Entities.Items.DestinyItemComponent[];
  itemDefinitions: BI.Destiny.Definitions.DestinyInventoryItemDefinition[];
  itemComponents: { [id: number]: BI.Destiny.Entities.Items.DestinyItemInstanceComponent; };
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition[];
}

const ItemList = ({ items, itemDefinitions, itemComponents, damageTypes, energyTypes }: Props) => {
  const appContext = useContext(AppContext);
  return (
    <>
      {itemDefinitions.map(itemDefinition => {
          // only equipment has traits so dont render an item
          if (!itemDefinition.traitIds || !shouldDisplayEquipmentItem(itemDefinition)) {
            return;
          }
          const itemInstance = items.find(
            gi => gi.itemHash === itemDefinition.hash);
          if (!itemInstance) {
            console.error("Could not find item instance for", itemDefinition.hash);
            appContext.addToast(
              `Error: Could not find item instance for ${itemDefinition.displayProperties.name}`,
              "error"
            );
            return <Skeleton key={uuid()} variant="rectangular" width={55} height={55} sx={{mt:1, mr: 1}} />
          }
          const itemInstanceDetails = itemComponents[itemInstance.itemInstanceId];
          return (
            <Item
              key={uuid()}
              itemInstance={itemInstance}
              itemDefinition={itemDefinition}
              itemInstanceDetails={itemInstanceDetails}
              damageTypes={damageTypes}
              energyTypes={energyTypes}
            />
          )
        })}
    </>
  )
}

export default ItemList;