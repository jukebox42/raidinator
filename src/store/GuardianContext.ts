import React, { createContext } from "react";

import { GuardianData } from "../utils/interfaces";
import * as BI from "../bungie/interfaces";
import { DestinyInventoryItemDefinition } from "../bungie/interfaces/Destiny/Definitions";

export interface IGuardianContext {
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Manifest.DestinyEnergyType[];
  statTypes: BI.Manifest.DestinyStatType[];
  plugTypes: BI.Manifest.DestinyStatType[];
  itemDefinitions: DestinyInventoryItemDefinition[];
  guardian?: GuardianData;
}

export const defaultGuardianContext = {
  damageTypes: [],
  energyTypes: [],
  statTypes: [],
  plugTypes: [],
  itemDefinitions: [],
};
export const GuardianContext = createContext<IGuardianContext>(defaultGuardianContext);
