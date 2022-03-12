import { breakerType } from "../../../enums";
import { DataCollection } from "../../Dictionaries";

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemComponent.html#schema_Destiny-Entities-Items-DestinyItemComponent
 */
export interface DestinyItemComponent {
  itemHash: number;
  itemInstanceId: number;
  quantity: number;
  bindStatus: number;
  location: number;
  bucketHash: number;
  transferStatus: number;
  lockable: boolean;
  state: number;
  overrideStyleItemHash: number;
  expirationDate: any;
  isWrapper: boolean;
  tooltipNotificationIndexes: number;
  metricHash: number;
  metricObjective: any;
  versionNumber: number;
  itemValueVisibility: boolean[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemStatsComponent.html#schema_Destiny-Entities-Items-DestinyItemStatsComponent
 */
export interface DestinyItemStatsComponent {
  stats: {
    [key: number]: {statHash: number; value: number; }
  }
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemSocketState.html#schema_Destiny-Entities-Items-DestinyItemSocketState
 */
export interface DestinyItemSocketState {
  plugHash: number;
  isEnabled: boolean;
  isVisible: boolean;
  enableFailIndexes: number[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemSocketsComponent.html#schema_Destiny-Entities-Items-DestinyItemSocketsComponent
 */
export interface DestinyItemSocketsComponent {
  sockets: DestinyItemSocketState[];
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemInstanceComponent.html#schema_Destiny-Entities-Items-DestinyItemInstanceComponent
 */
export interface DestinyItemInstanceComponent {
  damageType: number;
  damageTypeHash?: number;
  breakerType?: breakerType;
  breakerTypeHash?: number;
  primaryStat: {
      statHash: number;
      value: number;
  };
  energy?: {
    energyCapacity: number;
    energyType: number;
    energyTypeHash: number;
    energyUnused: number;
    energyUsed: number;
  };
  itemLevel: number;
  quality: number;
  isEquipped: boolean;
  canEquip: boolean;
  equipRequiredLevel: number;
  unlockHashesRequiredToEquip: number[];
  cannotEquipReason: number;
}

/**
 * https://bungie-net.github.io/multi/schema_Destiny-Entities-Items-DestinyItemSocketsComponent.html#schema_Destiny-Entities-Items-DestinyItemSocketsComponent
 */
export interface DestinyItemSocketsComponent {
  sockets: DestinyItemSocketState[]
}

/**
 * https://bungie-net.github.io/multi/schema_DestinyItemComponentSetOfint64.html#schema_DestinyItemComponentSetOfint64
 */
export interface DestinyItemComponentSet {
  instances: DataCollection<DestinyItemInstanceComponent>;
  sockets: DataCollection<DestinyItemSocketsComponent>;
  // there is more here but these are all I care about right now
}
