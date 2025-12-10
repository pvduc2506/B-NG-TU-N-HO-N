
export interface AtomInfo {
  symbol: string;
  name: string; // IUPAC name
  atomicNumber: number;
  mass: number;
  shells: number[]; // e.g. [2, 8, 1]
  valenceElectrons: number;
  color: string;
  group?: number;
  period?: number;
  category?: string;
  summary?: string;
  electronConfig?: string; // e.g. [Ar] 4s2
  trends?: {
    radius: string;
    electronegativity: string;
    character: string;
  };
}

export interface BondInfo {
  fromIndex: number;
  toIndex: number;
  type: "single" | "double" | "triple" | "ionic";
}

export interface MoleculeData {
  isAtom: boolean;
  name: string;
  commonName?: string;
  formula: string;
  description: string;
  atoms: AtomInfo[];
  bonds: BondInfo[];
  bondType: "ionic" | "covalent" | "metallic" | "none";
  
  // SVGs
  electronFormulaSvg?: string;
  lewisStructureSvg?: string;
  structuralFormulaSvg?: string;
  
  // Fallback Text
  lewisStructure?: string;
  electronFormula?: string;
  structuralFormula?: string;
  
  formationMechanism: string;
  lewisExplanation: string;

  hasHydrogenBonds: boolean;
  hydrogenBondDescription?: string;
}
