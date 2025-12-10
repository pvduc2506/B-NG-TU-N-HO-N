
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { MoleculeData } from "../types";

const atomInfoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    symbol: { type: Type.STRING },
    name: { type: Type.STRING, description: "IUPAC Name (e.g., Sodium, Water, Carbon dioxide)" },
    atomicNumber: { type: Type.INTEGER },
    mass: { type: Type.NUMBER },
    shells: { 
      type: Type.ARRAY, 
      items: { type: Type.INTEGER },
      description: "Number of electrons in each shell, inner to outer. e.g., Na is [2, 8, 1]"
    },
    valenceElectrons: { type: Type.INTEGER },
    color: { type: Type.STRING, description: "A hex color code suitable for this element (CPK coloring preferred but muted for Wood theme)" }
  },
  required: ["symbol", "name", "atomicNumber", "shells", "valenceElectrons", "color"]
};

const bondInfoSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    fromIndex: { type: Type.INTEGER },
    toIndex: { type: Type.INTEGER },
    type: { type: Type.STRING, enum: ["single", "double", "triple", "ionic"] }
  },
  required: ["fromIndex", "toIndex", "type"]
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isAtom: { type: Type.BOOLEAN },
    name: { type: Type.STRING, description: "Official IUPAC Name" },
    commonName: { type: Type.STRING, description: "Common Vietnamese name if applicable" },
    formula: { type: Type.STRING },
    description: { type: Type.STRING, description: "General description in Vietnamese" },
    atoms: { type: Type.ARRAY, items: atomInfoSchema },
    bonds: { type: Type.ARRAY, items: bondInfoSchema },
    bondType: { type: Type.STRING, enum: ["ionic", "covalent", "metallic", "none"] },
    
    // SVGs for visual rendering - Enforce precise drawing
    electronFormulaSvg: { type: Type.STRING, description: "SVG string (viewBox='0 0 400 300'). Draw the ELECTRON FORMULA. Rules: 1. Draw element symbols (large text). 2. Draw ALL valence electrons as solid circles (dots). 3. Arrange dots in pairs on 4 sides (N, E, S, W). 4. Shared electrons must be placed BETWEEN the symbols. 5. Use high contrast colors (black/dark green)." },
    lewisStructureSvg: { type: Type.STRING, description: "SVG string (viewBox='0 0 400 300'). Draw the LEWIS STRUCTURE. Rules: 1. Shared pairs must be lines (single/double/triple). 2. Lone pairs must be drawn as dots or lines (dots preferred) on the atom. 3. Geometry should be chemically reasonable (e.g., V-shape for water, linear for CO2). 4. Clear labels." },
    structuralFormulaSvg: { type: Type.STRING, description: "SVG string (viewBox='0 0 400 300'). Draw the STRUCTURAL FORMULA. Rules: 1. Lines for bonds only. 2. No electrons shown. 3. Show correct connectivity." },
    
    // Fallback Text
    lewisStructure: { type: Type.STRING },
    electronFormula: { type: Type.STRING },
    structuralFormula: { type: Type.STRING },
    
    formationMechanism: { type: Type.STRING, description: "Vietnamese text. Describe step-by-step: 1. Electron configuration of atoms. 2. Tendency to gain/lose/share electrons to reach Octet. 3. The process (e.g., Na gives 1e to Cl). 4. Resulting ions or shared pairs. 5. Electrostatic attraction (if ionic)." },
    
    // Lewis Details
    lewisExplanation: { type: Type.STRING, description: "Giải thích chi tiết về công thức Lewis: tổng số e hóa trị, số cặp e liên kết, số cặp e riêng (lone pairs) trên từng nguyên tử." },

    // Hydrogen Bonds
    hasHydrogenBonds: { type: Type.BOOLEAN },
    hydrogenBondDescription: { type: Type.STRING, description: "Mô tả chi tiết về liên kết Hydrogen nếu có. CHỈ RÕ: 1. Nguyên tử cho (Hydrogen donor) - H linh động gắn với nguyên tố có độ âm điện lớn nào? 2. Nguyên tử nhận (Hydrogen acceptor) - nguyên tố nào còn cặp electron hóa trị tự do?" }
  },
  required: ["isAtom", "name", "formula", "atoms", "bondType", "formationMechanism", "lewisExplanation", "hasHydrogenBonds"]
};

export const analyzeChemical = async (input: string): Promise<MoleculeData | null> => {
  if (!process.env.API_KEY) {
    console.error("API Key missing");
    return null;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Đóng vai chuyên gia hóa học sư phạm. Phân tích chất: "${input}". 
      
      YÊU CẦU ĐẶC BIỆT VỀ SVG (RẤT QUAN TRỌNG):
      - Cần vẽ ĐẸP, CHUẨN SÁCH GIÁO KHOA, CÂN ĐỐI.
      - SVG không được bị cắt (padding tốt).
      - Font chữ trong SVG: sans-serif, đậm, rõ ràng.
      - Màu sắc: Dùng mã màu tối (#1e5b36, #000) cho nét vẽ chính, tránh màu nhạt.
      - Công thức Electron: Phải vẽ dấu chấm rõ (circle r=3), xếp theo cặp.
      - Công thức Lewis: Liên kết là đường thẳng, cặp e riêng là dấu chấm.
      
      YÊU CẦU VỀ NỘI DUNG:
      - Cơ chế hình thành: Phải chia rõ các bước (Bước 1, Bước 2...) từ cấu hình e -> xu hướng -> quá trình -> kết quả.
      - Liên kết Hydrogen: Nếu chất này tạo được liên kết hydro (như H2O, NH3, Alcohol, Acid...), hãy giải thích kỹ cơ chế cho-nhận.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as MoleculeData;
    }
    return null;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};
