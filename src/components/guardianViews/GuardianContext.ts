import React, { createContext } from "react";

import { GuardianData, PlayerData } from "../../utils/interfaces";
import * as BI from "../../bungie/interfaces/";
import { DestinyInventoryItemDefinition } from "../../bungie/interfaces/Destiny/Definitions";

export interface IGuardianContext {
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Manifest.DestinyEnergyType[];
  statTypes: BI.Manifest.DestinyStatType[];
  plugTypes: BI.Manifest.DestinyStatType[];
  itemDefinitions: DestinyInventoryItemDefinition[];
  guardian?: GuardianData;
}

const defaultContext = {
  damageTypes: [],
  energyTypes: [],
  statTypes: [],
  plugTypes: [],
  itemDefinitions: [],
};
export const GuardianContext = createContext<IGuardianContext>(defaultContext);
