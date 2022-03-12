// TODO: Unused
import { createContext } from "react";

import { GuardianData } from "../utils/interfaces";
import * as BI from "../bungie/interfaces";
import { DestinyInventoryItemDefinition } from "../bungie/interfaces/Destiny/Definitions";

export interface IGuardianContext {
  damageTypes: BI.Destiny.Definitions.DestinyDamageTypeDefinition[];
  energyTypes: BI.Destiny.Definitions.EnergyTypes.DestinyEnergyTypeDefinition[];
  statTypes: BI.Destiny.Definitions.DestinyStatDefinition[];
  plugTypes: BI.Destiny.Definitions.DestinyItemPlugDefinition[];
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
