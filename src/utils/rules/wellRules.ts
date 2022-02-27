enum energy {
  VOID = 0,
  SOLAR,
  ARC,
  STASIS,
};

enum src {
  ABILITY = 0,
  WEAPON,
  EXPLOSIVE,
  FINISHER,
};

interface Generators {
  name: string;
  hash: number; // the mod type hash
  matchSubclass: boolean; // if the source and subclass need to match
  sources: src[]; // the source of the well generation
  energy: energy[]; // the energy type this is generated. this is empty if it matches the subclass
  alwaysTrue?: boolean; // if the mod is always going to generate. denotes smething we can't really track well
}

interface Spenders {
  name: string;
  hash: number; // the mod type hash
  matchSubclass: boolean; // if the well type and subclass need to match
  energy: energy[]; // the well energy type that is needed. empty means any (see matchSubclass)
}

const wellGenerators: Generators[] = [
  // === Artifact ===
  { name: "Melee Wellmaker", hash: 288409047, matchSubclass: true, sources: [src.ABILITY], energy: [], },
  // === Rest ===
  { name: "Elemental Armaments", hash: 1515669996, matchSubclass: true, sources: [src.WEAPON], energy: [], },
  { name: "Elemental Light", hash: 2823326549, matchSubclass: true, sources: [src.ABILITY], energy: [], },
  { name: "Elemental Ordnance", hash: 1824486242, matchSubclass: true, sources: [src.ABILITY], energy: [], },
  // TODO: stasis shards could come from anywhere so always show true
  { name: "Elemental Shards", hash: 1977242752, matchSubclass: false, sources: [], energy: [energy.STASIS], alwaysTrue: true, },
  // TODO: this isn't tracked atm. will always show true
  { name: "Explosive Wellmaker", hash: 825650462, matchSubclass: false, sources: [src.EXPLOSIVE], energy: [energy.SOLAR], alwaysTrue: true, },
  { name: "Melee Wellmaker", hash: 4213142382, matchSubclass: true, sources: [src.ABILITY], energy: [], },
  { name: "Overcharge Wellmaker", hash: 3097132144, matchSubclass: false, sources: [src.FINISHER], energy: [energy.ARC], },
  { name: "Reaping Wellmaker", hash: 240958661, matchSubclass: false, sources: [], energy: [energy.VOID], },
  // TODO: this isn't properly tracked. will always show true
  { name: "Shieldcrash Wellmaker", hash: 1052528480, matchSubclass: false, sources: [], energy: [energy.VOID], alwaysTrue: true, },
  { name: "Supreme Wellmaker", hash: 1977242753, matchSubclass: false, sources: [src.ABILITY], energy: [energy.STASIS], },
];

const wellSpenders: Spenders[] = [
  // === Artifact ===
  { name: "Font of Might", hash: 2119661524, matchSubclass: true, energy: [], },
  { name: "Volatile Flow", hash: 2129265545, matchSubclass: false, energy: [energy.VOID], },
  // === Rest ===
  { name: "Font of Might", hash: 1740246051, matchSubclass: true, energy: [], },
  { name: "Font of Wisdom", hash: 1196831979, matchSubclass: true, energy: [], },
  { name: "Well of Ions", hash: 1680735357, matchSubclass: false, energy: [energy.ARC], },
  { name: "Well of Life", hash: 2164090163, matchSubclass: false, energy: [energy.SOLAR], },
  { name: "Well of Ordnance", hash: 4288515061, matchSubclass: false, energy: [energy.SOLAR], },
  { name: "Well of Restoration", hash: 1977242755, matchSubclass: false, energy: [energy.STASIS], },
  { name: "Well of Striking", hash: 4044800076, matchSubclass: false, energy: [energy.ARC], },
  { name: "Well of Tenacity", hash: 3809244044, matchSubclass: false, energy: [energy.VOID], },
  { name: "Well of Utility", hash: 1358633824, matchSubclass: false, energy: [energy.VOID], },
];

export const placeholder = true;