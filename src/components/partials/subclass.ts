// This file is an iteration of the file found in DIM to process talent nodes. Dim devs, thank you. I struggled hard
// trying to figure out how to get this data.
// https://github.com/DestinyItemManager/DIM/blob/233e247b4abd23a55a3e987389e04b08e3ddc91b/src/app/inventory/subclass.ts

import { DestinyTalentNodeDefinition } from "../../bungie/interfaces/Destiny/Definitions";

export type SuperPosition = "T" | "M" | "B" | "";

const superNodeHashes = {
  // hunter
  arcStaff: 2936898795,
  whirlwindGuard: 3006627468,
  goldenGun: 675014898,
  bladeBarrage: 1590824323,

  // warlock
  stormtrance: 178252917,
  chaosReach: 3882393894,
  daybreak: 4102085486,
  wellOfRadiance: 935376049,

  // titan
  hammerOfSol: 1722642322,
  burningMaul: 1323416107,
  fistsOfHavoc: 1757742244,
  thundercrash: 2795355746,
};

/**
 * A map to find the super hash.
 * 
 * You like I might be wondering how this works. Or maybe it's me again and I havent looked at this in a few weeks.
 * Either way here's the breakdown: In each talent group there's one(or more) abilities that are unique to the grid so
 * we find that grid item and that tells us which one they wanted to use. We then map it to the grid item that defines
 * what the user is. Because only one of them has a layoutIdentifier called "super". Otherwise this would have been too
 * easy.
 */
const nodeHashToSubclassPath: {
  [hash: number]: {
    position: SuperPosition;
    superHash: number;
  };
} = {
  // === Hunter ===
  // Arcstrider
  1690891826: { position: "T", superHash: superNodeHashes.arcStaff },
  3006627468: { position: "M", superHash: superNodeHashes.whirlwindGuard },
  313617030:  { position: "B", superHash: superNodeHashes.arcStaff },
  // Gunslinger
  2242504056: { position: "T", superHash: superNodeHashes.goldenGun },
  1590824323: { position: "M", superHash: superNodeHashes.bladeBarrage },
  2805396803: { position: "B", superHash: superNodeHashes.goldenGun },

  // === Warlock ===
  // Dawnblade
  1893159641: { position: "T", superHash: superNodeHashes.daybreak },
  935376049:  { position: "M", superHash: superNodeHashes.wellOfRadiance },
  966868917:  { position: "B", superHash: superNodeHashes.daybreak },
  // Stormcaller
  487158888:  { position: "T", superHash: superNodeHashes.stormtrance },
  3882393894: { position: "M", superHash: superNodeHashes.chaosReach },
  3297679786: { position: "B", superHash: superNodeHashes.stormtrance },

  // === Titan ===
  // Striker
  4099943028: { position: "T", superHash: superNodeHashes.fistsOfHavoc },
  2795355746: { position: "M", superHash: superNodeHashes.thundercrash },
  4293830764: { position: "B", superHash: superNodeHashes.fistsOfHavoc },
  // Sunbreaker
  3928207649: { position: "T", superHash: superNodeHashes.hammerOfSol },
  1323416107: { position: "M", superHash: superNodeHashes.burningMaul },
  1236431642: { position: "B", superHash: superNodeHashes.hammerOfSol }
};

export const selectedSubclassNode = (activeGridDefNodes: DestinyTalentNodeDefinition[]) => {
  for (const node of activeGridDefNodes) {
    const def = nodeHashToSubclassPath[node.steps[0].nodeStepHash];
    if (!def) {
      continue;
    }
    const superNode = activeGridDefNodes.find(n => n.steps[0].nodeStepHash.toString() === def.superHash.toString());
    return {
      superNode,
      position: def.position,
    }
  }

  return { superNode: null, position: "" };
}