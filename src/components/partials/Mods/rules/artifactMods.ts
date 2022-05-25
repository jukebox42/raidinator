import { DestinyInventoryItemDefinition } from "bungie/interfaces/Destiny/Definitions";

export const specialDamageMods = [
  "Revitalizing Blast",
  "Withering Heat",
];

export const isArtifactMod = (mod: DestinyInventoryItemDefinition) => {
  return mod.displayProperties && specialDamageMods.includes(mod.displayProperties.name);
}
