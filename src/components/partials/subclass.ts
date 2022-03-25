const superIconNodeHashes = {
  arcStaff: 2936898795,
  whirlwindGuard: 3006627468,
  goldenGun: 675014898,
  bladeBarrage: 1590824323,
  shadowshot: 3931765019,
  spectralBlades: 499823166,

  stormtrance: 178252917,
  chaosReach: 3882393894,
  daybreak: 4102085486,
  wellOfRadiance: 935376049,
  novaBomb: 3082407249,
  novaWarp: 194702279,

  fistsOfHavoc: 1757742244,
  thundercrash: 2795355746,
  sentinelShield: 368405360,
  bannerShield: 3504292102,
  hammerOfSol: 1722642322,
  burningMaul: 1323416107,
};

// prettier-ignore
const nodeHashToSubclassPath: {
  [hash: number]: {
    position: 'top' | 'middle' | 'bottom';
    superHash: number;
  };
} = {
  // Hunter
  // Arcstrider
  1690891826: { position: 'top',    superHash: superIconNodeHashes.arcStaff       },
  3006627468: { position: 'middle', superHash: superIconNodeHashes.whirlwindGuard },
  313617030:  { position: 'bottom', superHash: superIconNodeHashes.arcStaff       },
  // Gunslinger
  2242504056: { position: 'top',    superHash: superIconNodeHashes.goldenGun      },
  1590824323: { position: 'middle', superHash: superIconNodeHashes.bladeBarrage   },
  2805396803: { position: 'bottom', superHash: superIconNodeHashes.goldenGun      },

  // === Warlock ===
  // Dawnblade
  1893159641: { position: 'top',    superHash: superIconNodeHashes.daybreak       },
  935376049:  { position: 'middle', superHash: superIconNodeHashes.wellOfRadiance },
  966868917:  { position: 'bottom', superHash: superIconNodeHashes.daybreak       },
  // Stormcaller
  487158888:  { position: 'top',    superHash: superIconNodeHashes.stormtrance    },
  3882393894: { position: 'middle', superHash: superIconNodeHashes.chaosReach     },
  3297679786: { position: 'bottom', superHash: superIconNodeHashes.stormtrance    },

  // === Titan ===
  // Striker
  4099943028: { position: 'top',    superHash: superIconNodeHashes.fistsOfHavoc   },
  2795355746: { position: 'middle', superHash: superIconNodeHashes.thundercrash   },
  4293830764: { position: 'bottom', superHash: superIconNodeHashes.fistsOfHavoc   },
  // Sunbreaker
  3928207649: { position: 'top',    superHash: superIconNodeHashes.hammerOfSol    },
  1323416107: { position: 'middle', superHash: superIconNodeHashes.burningMaul    },
  1236431642: { position: 'bottom', superHash: superIconNodeHashes.hammerOfSol    }
};

export function selectedSubclassPath(talentGrid: any) {
  for (const node of talentGrid.nodes) {
    const def = nodeHashToSubclassPath[node.hash];
    if (node.activated && def) {
      const superNode = talentGrid.nodes.find((n: any) => n.hash === def.superHash);
      return {
        position: def.position,
        super: superNode?.icon,
      };
    }
  }

  return null;
}