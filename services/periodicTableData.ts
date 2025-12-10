
import { AtomInfo } from '../types';

// Categories for coloring
export const CATEGORY_COLORS: Record<string, string> = {
  'alkali-metal': '#ef4444',     // Red
  'alkaline-earth-metal': '#f97316', // Orange
  'transition-metal': '#eab308', // Yellow
  'post-transition-metal': '#84cc16', // Lime
  'metalloid': '#10b981',       // Emerald
  'nonmetal': '#06b6d4',        // Cyan
  'halogen': '#3b82f6',         // Blue
  'noble-gas': '#8b5cf6',       // Violet
  'lanthanide': '#d946ef',      // Fuchsia
  'actinide': '#f43f5e',        // Rose
  'unknown': '#9ca3af'          // Gray
};

export const ELEMENT_DATA_RAW = [
  { z: 1, s: "H", n: "Hydrogen", m: 1.008, c: "nonmetal", g: 1, p: 1 },
  { z: 2, s: "He", n: "Helium", m: 4.0026, c: "noble-gas", g: 18, p: 1 },
  { z: 3, s: "Li", n: "Lithium", m: 6.94, c: "alkali-metal", g: 1, p: 2 },
  { z: 4, s: "Be", n: "Beryllium", m: 9.0122, c: "alkaline-earth-metal", g: 2, p: 2 },
  { z: 5, s: "B", n: "Boron", m: 10.81, c: "metalloid", g: 13, p: 2 },
  { z: 6, s: "C", n: "Carbon", m: 12.011, c: "nonmetal", g: 14, p: 2 },
  { z: 7, s: "N", n: "Nitrogen", m: 14.007, c: "nonmetal", g: 15, p: 2 },
  { z: 8, s: "O", n: "Oxygen", m: 15.999, c: "nonmetal", g: 16, p: 2 },
  { z: 9, s: "F", n: "Fluorine", m: 18.998, c: "halogen", g: 17, p: 2 },
  { z: 10, s: "Ne", n: "Neon", m: 20.180, c: "noble-gas", g: 18, p: 2 },
  { z: 11, s: "Na", n: "Sodium", m: 22.990, c: "alkali-metal", g: 1, p: 3 },
  { z: 12, s: "Mg", n: "Magnesium", m: 24.305, c: "alkaline-earth-metal", g: 2, p: 3 },
  { z: 13, s: "Al", n: "Aluminium", m: 26.982, c: "post-transition-metal", g: 13, p: 3 },
  { z: 14, s: "Si", n: "Silicon", m: 28.085, c: "metalloid", g: 14, p: 3 },
  { z: 15, s: "P", n: "Phosphorus", m: 30.974, c: "nonmetal", g: 15, p: 3 },
  { z: 16, s: "S", n: "Sulfur", m: 32.06, c: "nonmetal", g: 16, p: 3 },
  { z: 17, s: "Cl", n: "Chlorine", m: 35.45, c: "halogen", g: 17, p: 3 },
  { z: 18, s: "Ar", n: "Argon", m: 39.948, c: "noble-gas", g: 18, p: 3 },
  { z: 19, s: "K", n: "Potassium", m: 39.098, c: "alkali-metal", g: 1, p: 4 },
  { z: 20, s: "Ca", n: "Calcium", m: 40.078, c: "alkaline-earth-metal", g: 2, p: 4 },
  { z: 21, s: "Sc", n: "Scandium", m: 44.956, c: "transition-metal", g: 3, p: 4 },
  { z: 22, s: "Ti", n: "Titanium", m: 47.867, c: "transition-metal", g: 4, p: 4 },
  { z: 23, s: "V", n: "Vanadium", m: 50.942, c: "transition-metal", g: 5, p: 4 },
  { z: 24, s: "Cr", n: "Chromium", m: 51.996, c: "transition-metal", g: 6, p: 4 },
  { z: 25, s: "Mn", n: "Manganese", m: 54.938, c: "transition-metal", g: 7, p: 4 },
  { z: 26, s: "Fe", n: "Iron", m: 55.845, c: "transition-metal", g: 8, p: 4 },
  { z: 27, s: "Co", n: "Cobalt", m: 58.933, c: "transition-metal", g: 9, p: 4 },
  { z: 28, s: "Ni", n: "Nickel", m: 58.693, c: "transition-metal", g: 10, p: 4 },
  { z: 29, s: "Cu", n: "Copper", m: 63.546, c: "transition-metal", g: 11, p: 4 },
  { z: 30, s: "Zn", n: "Zinc", m: 65.38, c: "transition-metal", g: 12, p: 4 },
  { z: 31, s: "Ga", n: "Gallium", m: 69.723, c: "post-transition-metal", g: 13, p: 4 },
  { z: 32, s: "Ge", n: "Germanium", m: 72.630, c: "metalloid", g: 14, p: 4 },
  { z: 33, s: "As", n: "Arsenic", m: 74.922, c: "metalloid", g: 15, p: 4 },
  { z: 34, s: "Se", n: "Selenium", m: 78.96, c: "nonmetal", g: 16, p: 4 },
  { z: 35, s: "Br", n: "Bromine", m: 79.904, c: "halogen", g: 17, p: 4 },
  { z: 36, s: "Kr", n: "Krypton", m: 83.798, c: "noble-gas", g: 18, p: 4 },
  { z: 37, s: "Rb", n: "Rubidium", m: 85.468, c: "alkali-metal", g: 1, p: 5 },
  { z: 38, s: "Sr", n: "Strontium", m: 87.62, c: "alkaline-earth-metal", g: 2, p: 5 },
  { z: 39, s: "Y", n: "Yttrium", m: 88.906, c: "transition-metal", g: 3, p: 5 },
  { z: 40, s: "Zr", n: "Zirconium", m: 91.224, c: "transition-metal", g: 4, p: 5 },
  { z: 41, s: "Nb", n: "Niobium", m: 92.906, c: "transition-metal", g: 5, p: 5 },
  { z: 42, s: "Mo", n: "Molybdenum", m: 95.95, c: "transition-metal", g: 6, p: 5 },
  { z: 43, s: "Tc", n: "Technetium", m: 98, c: "transition-metal", g: 7, p: 5 },
  { z: 44, s: "Ru", n: "Ruthenium", m: 101.07, c: "transition-metal", g: 8, p: 5 },
  { z: 45, s: "Rh", n: "Rhodium", m: 102.91, c: "transition-metal", g: 9, p: 5 },
  { z: 46, s: "Pd", n: "Palladium", m: 106.42, c: "transition-metal", g: 10, p: 5 },
  { z: 47, s: "Ag", n: "Silver", m: 107.87, c: "transition-metal", g: 11, p: 5 },
  { z: 48, s: "Cd", n: "Cadmium", m: 112.41, c: "transition-metal", g: 12, p: 5 },
  { z: 49, s: "In", n: "Indium", m: 114.82, c: "post-transition-metal", g: 13, p: 5 },
  { z: 50, s: "Sn", n: "Tin", m: 118.71, c: "post-transition-metal", g: 14, p: 5 },
  { z: 51, s: "Sb", n: "Antimony", m: 121.76, c: "metalloid", g: 15, p: 5 },
  { z: 52, s: "Te", n: "Tellurium", m: 127.60, c: "metalloid", g: 16, p: 5 },
  { z: 53, s: "I", n: "Iodine", m: 126.90, c: "halogen", g: 17, p: 5 },
  { z: 54, s: "Xe", n: "Xenon", m: 131.29, c: "noble-gas", g: 18, p: 5 },
  { z: 55, s: "Cs", n: "Cesium", m: 132.91, c: "alkali-metal", g: 1, p: 6 },
  { z: 56, s: "Ba", n: "Barium", m: 137.33, c: "alkaline-earth-metal", g: 2, p: 6 },
  { z: 57, s: "La", n: "Lanthanum", m: 138.91, c: "lanthanide", g: 3, p: 6 },
  { z: 58, s: "Ce", n: "Cerium", m: 140.12, c: "lanthanide", g: 3, p: 6 },
  { z: 59, s: "Pr", n: "Praseodymium", m: 140.91, c: "lanthanide", g: 3, p: 6 },
  { z: 60, s: "Nd", n: "Neodymium", m: 144.24, c: "lanthanide", g: 3, p: 6 },
  { z: 61, s: "Pm", n: "Promethium", m: 145, c: "lanthanide", g: 3, p: 6 },
  { z: 62, s: "Sm", n: "Samarium", m: 150.36, c: "lanthanide", g: 3, p: 6 },
  { z: 63, s: "Eu", n: "Europium", m: 151.96, c: "lanthanide", g: 3, p: 6 },
  { z: 64, s: "Gd", n: "Gadolinium", m: 157.25, c: "lanthanide", g: 3, p: 6 },
  { z: 65, s: "Tb", n: "Terbium", m: 158.93, c: "lanthanide", g: 3, p: 6 },
  { z: 66, s: "Dy", n: "Dysprosium", m: 162.50, c: "lanthanide", g: 3, p: 6 },
  { z: 67, s: "Ho", n: "Holmium", m: 164.93, c: "lanthanide", g: 3, p: 6 },
  { z: 68, s: "Er", n: "Erbium", m: 167.26, c: "lanthanide", g: 3, p: 6 },
  { z: 69, s: "Tm", n: "Thulium", m: 168.93, c: "lanthanide", g: 3, p: 6 },
  { z: 70, s: "Yb", n: "Ytterbium", m: 173.05, c: "lanthanide", g: 3, p: 6 },
  { z: 71, s: "Lu", n: "Lutetium", m: 174.97, c: "lanthanide", g: 3, p: 6 },
  { z: 72, s: "Hf", n: "Hafnium", m: 178.49, c: "transition-metal", g: 4, p: 6 },
  { z: 73, s: "Ta", n: "Tantalum", m: 180.95, c: "transition-metal", g: 5, p: 6 },
  { z: 74, s: "W", n: "Tungsten", m: 183.84, c: "transition-metal", g: 6, p: 6 },
  { z: 75, s: "Re", n: "Rhenium", m: 186.21, c: "transition-metal", g: 7, p: 6 },
  { z: 76, s: "Os", n: "Osmium", m: 190.23, c: "transition-metal", g: 8, p: 6 },
  { z: 77, s: "Ir", n: "Iridium", m: 192.22, c: "transition-metal", g: 9, p: 6 },
  { z: 78, s: "Pt", n: "Platinum", m: 195.08, c: "transition-metal", g: 10, p: 6 },
  { z: 79, s: "Au", n: "Gold", m: 196.97, c: "transition-metal", g: 11, p: 6 },
  { z: 80, s: "Hg", n: "Mercury", m: 200.59, c: "transition-metal", g: 12, p: 6 },
  { z: 81, s: "Tl", n: "Thallium", m: 204.38, c: "post-transition-metal", g: 13, p: 6 },
  { z: 82, s: "Pb", n: "Lead", m: 207.2, c: "post-transition-metal", g: 14, p: 6 },
  { z: 83, s: "Bi", n: "Bismuth", m: 208.98, c: "post-transition-metal", g: 15, p: 6 },
  { z: 84, s: "Po", n: "Polonium", m: 209, c: "metalloid", g: 16, p: 6 },
  { z: 85, s: "At", n: "Astatine", m: 210, c: "halogen", g: 17, p: 6 },
  { z: 86, s: "Rn", n: "Radon", m: 222, c: "noble-gas", g: 18, p: 6 },
  { z: 87, s: "Fr", n: "Francium", m: 223, c: "alkali-metal", g: 1, p: 7 },
  { z: 88, s: "Ra", n: "Radium", m: 226, c: "alkaline-earth-metal", g: 2, p: 7 },
  { z: 89, s: "Ac", n: "Actinium", m: 227, c: "actinide", g: 3, p: 7 },
  { z: 90, s: "Th", n: "Thorium", m: 232.04, c: "actinide", g: 3, p: 7 },
  { z: 92, s: "U", n: "Uranium", m: 238.03, c: "actinide", g: 3, p: 7 },
];

const ELECTRONEGATIVITY: Record<number, number> = {
  1: 2.20, 2: 0, 
  3: 0.98, 4: 1.57, 5: 2.04, 6: 2.55, 7: 3.04, 8: 3.44, 9: 3.98, 10: 0,
  11: 0.93, 12: 1.31, 13: 1.61, 14: 1.90, 15: 2.19, 16: 2.58, 17: 3.16, 18: 0,
  19: 0.82, 20: 1.00, 26: 1.83, 29: 1.90, 30: 1.65, 35: 2.96, 
  37: 0.82, 47: 1.93, 53: 2.66, 79: 2.54, 80: 2.00
};

const ORBITAL_ORDER = [
  { n: 1, l: 's', cap: 2 },
  { n: 2, l: 's', cap: 2 }, { n: 2, l: 'p', cap: 6 },
  { n: 3, l: 's', cap: 2 }, { n: 3, l: 'p', cap: 6 },
  { n: 4, l: 's', cap: 2 }, { n: 3, l: 'd', cap: 10 }, { n: 4, l: 'p', cap: 6 },
  { n: 5, l: 's', cap: 2 }, { n: 4, l: 'd', cap: 10 }, { n: 5, l: 'p', cap: 6 },
  { n: 6, l: 's', cap: 2 }, { n: 4, l: 'f', cap: 14 }, { n: 5, l: 'd', cap: 10 }, { n: 6, l: 'p', cap: 6 },
  { n: 7, l: 's', cap: 2 }, { n: 5, l: 'f', cap: 14 }, { n: 6, l: 'd', cap: 10 }, { n: 7, l: 'p', cap: 6 }
];

const NOBLE_GASES = [
  { z: 2, symbol: 'He' },
  { z: 10, symbol: 'Ne' },
  { z: 18, symbol: 'Ar' },
  { z: 36, symbol: 'Kr' },
  { z: 54, symbol: 'Xe' },
  { z: 86, symbol: 'Rn' },
];

export const getElectronConfigString = (z: number): string => {
  // Specific overrides for accuracy (Exceptions to Aufbau)
  const exceptions: Record<number, string> = {
    24: "[Ar] 3d⁵ 4s¹",
    29: "[Ar] 3d¹⁰ 4s¹",
    41: "[Kr] 4d⁴ 5s¹",
    42: "[Kr] 4d⁵ 5s¹",
    44: "[Kr] 4d⁷ 5s¹",
    45: "[Kr] 4d⁸ 5s¹",
    46: "[Kr] 4d¹⁰",
    47: "[Kr] 4d¹⁰ 5s¹",
    78: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
    79: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
  };

  if (exceptions[z]) return exceptions[z];

  // Basic Aufbau implementation
  let remaining = z;
  let configStr = "";

  // Find nearest noble gas
  let nobleGas = null;
  for (let i = NOBLE_GASES.length - 1; i >= 0; i--) {
    if (z > NOBLE_GASES[i].z) {
      nobleGas = NOBLE_GASES[i];
      break;
    }
  }

  if (nobleGas) {
    configStr += `[${nobleGas.symbol}] `;
    remaining -= nobleGas.z;
    
    // Resume filling from the orbital after the noble gas
    let startIndex = 0;
    if (nobleGas.symbol === 'He') startIndex = 1; // Start 2s
    if (nobleGas.symbol === 'Ne') startIndex = 3; // Start 3s
    if (nobleGas.symbol === 'Ar') startIndex = 5; // Start 4s
    if (nobleGas.symbol === 'Kr') startIndex = 8; // Start 5s
    if (nobleGas.symbol === 'Xe') startIndex = 11; // Start 6s
    if (nobleGas.symbol === 'Rn') startIndex = 15; // Start 7s

    for (let i = startIndex; i < ORBITAL_ORDER.length; i++) {
      if (remaining <= 0) break;
      const orbital = ORBITAL_ORDER[i];
      const take = Math.min(remaining, orbital.cap);
      
      const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
      const countStr = take.toString().split('').map(d => superscripts[parseInt(d)]).join('');
      
      configStr += `${orbital.n}${orbital.l}${countStr} `;
      remaining -= take;
    }
  } else {
    // Hydrogen / Helium case (no previous noble gas)
     for (let i = 0; i < ORBITAL_ORDER.length; i++) {
      if (remaining <= 0) break;
      const orbital = ORBITAL_ORDER[i];
      const take = Math.min(remaining, orbital.cap);
      const superscripts = "⁰¹²³⁴⁵⁶⁷⁸⁹";
      const countStr = take.toString().split('').map(d => superscripts[parseInt(d)]).join('');
      configStr += `${orbital.n}${orbital.l}${countStr} `;
      remaining -= take;
    }
  }

  return configStr.trim();
}

// Calculate Periodic Trends
export const calculateTrends = (z: number, group: number, period: number, category: string): { radius: string, electronegativity: string, character: string } => {
    let radiusTrend = "";
    let enTrend = "";
    let charTrend = "";

    // Radius Trend
    if (period === 1) {
      radiusTrend = "Bán kính nguyên tử rất nhỏ do chỉ có 1 lớp electron.";
    } else {
      if (group === 1) {
          radiusTrend = "Bán kính nguyên tử lớn nhất trong chu kỳ do điện tích hạt nhân nhỏ nhất, lực hút electron yếu.";
      } else if (group === 18) {
          radiusTrend = "Bán kính nguyên tử nhỏ nhất trong chu kỳ do điện tích hạt nhân lớn, hút mạnh lớp vỏ.";
      } else {
          radiusTrend = `Bán kính trung bình. Trong chu kỳ ${period}, bán kính giảm dần từ trái sang phải do điện tích hạt nhân tăng dần, hút e mạnh hơn.`;
      }
    }

    // Electronegativity Trend
    const enVal = ELECTRONEGATIVITY[z];
    const valStr = enVal ? ` (${enVal})` : "";
    
    if (category === 'noble-gas') {
      enTrend = "Không xác định (Khí hiếm có cấu hình bền vững, khó nhận hay nhường e).";
    } else {
      if (group === 1 || group === 2) {
          enTrend = `Độ âm điện nhỏ${valStr}. Dễ nhường electron, thể hiện tính khử mạnh.`;
      } else if (group >= 16) {
          enTrend = `Độ âm điện lớn${valStr}. Dễ nhận electron, thể hiện tính oxi hóa mạnh.`;
      } else {
          enTrend = `Độ âm điện trung bình${valStr}. Trong chu kỳ, độ âm điện tăng dần từ trái sang phải.`;
      }
    }

    // Character Trend
    if (category.includes('metal') || group <= 12 || (group === 13 && period > 2)) { // Rough metal check
        charTrend = "Tính kim loại: Xu hướng nhường electron. Tính kim loại giảm dần trong chu kỳ, tăng dần trong nhóm.";
    } else if (category === 'noble-gas') {
        charTrend = "Tính trơ: Cấu hình electron bão hòa bền vững, thực tế không tham gia phản ứng.";
    } else if (category === 'metalloid') {
        charTrend = "Á kim: Có tính chất trung gian giữa kim loại và phi kim.";
    } else {
        charTrend = "Tính phi kim: Xu hướng nhận electron. Tính phi kim tăng dần trong chu kỳ, giảm dần trong nhóm.";
    }

    return {
        radius: radiusTrend,
        electronegativity: enTrend,
        character: charTrend
    };
};

// Helper to calculate shells based on Z (Aufbau + exceptions)
export const getElementConfig = (z: number): AtomInfo => {
  const baseData = ELEMENT_DATA_RAW.find(e => e.z === z) || {
    z: z, s: "Uu", n: `Element ${z}`, m: z * 2, c: "unknown", g: 0, p: 0
  };

  // Exceptions for shells
  const exceptions: Record<number, number[]> = {
    24: [2, 8, 13, 1], // Cr
    29: [2, 8, 18, 1], // Cu
    42: [2, 8, 18, 13, 1], // Mo
    46: [2, 8, 18, 18], // Pd
    47: [2, 8, 18, 18, 1], // Ag
    79: [2, 8, 18, 32, 18, 1], // Au
  };

  let shells: number[] = [];

  if (exceptions[z]) {
    shells = exceptions[z];
  } else {
    // Basic Algo (simplified for visualization)
    if (z <= 2) shells = [z];
    else if (z <= 10) shells = [2, z - 2];
    else if (z <= 18) shells = [2, 8, z - 10];
    else if (z <= 20) shells = [2, 8, 8, z - 18];
    else if (z <= 30) shells = [2, 8, 8 + (z - 20), 2];
    else if (z <= 36) shells = [2, 8, 18, z - 28];
    else if (z <= 38) shells = [2, 8, 18, 8, z - 36];
    else if (z <= 48) shells = [2, 8, 18, 8 + (z - 38), 2]; 
    else if (z <= 54) shells = [2, 8, 18, 18, z - 46];
    else if (z <= 56) shells = [2, 8, 18, 18, 8, z - 54];
    else shells = [2, 8, 18, 32, 18, z - 78]; // Rough approx
  }
  
  const trends = calculateTrends(baseData.z, baseData.g, baseData.p, baseData.c);

  return {
    symbol: baseData.s,
    name: baseData.n,
    atomicNumber: baseData.z,
    mass: baseData.m,
    shells: shells,
    valenceElectrons: shells[shells.length - 1],
    color: CATEGORY_COLORS[baseData.c] || '#9ca3af',
    category: baseData.c,
    group: baseData.g,
    period: baseData.p,
    electronConfig: getElectronConfigString(z),
    trends: trends
  };
};

export const getAllElements = () => {
  // Generate valid data for 1-118, using defaults for missing entries
  const elements = [];
  for (let i = 1; i <= 118; i++) {
     elements.push(getElementConfig(i));
  }
  return elements;
}
