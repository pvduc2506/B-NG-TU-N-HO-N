
import React, { useState, useMemo } from 'react';
import AtomCanvas from './components/AtomCanvas';
import BondingStage from './components/BondingStage';
import { AtomInfo, MoleculeData } from './types';
import { getAllElements, CATEGORY_COLORS } from './services/periodicTableData';
import { analyzeChemical } from './services/gemini';
import { Atom, X, Info, Beaker, Search, Grid3X3, ArrowRight, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'periodic' | 'molecule'>('periodic');
  const [selectedAtom, setSelectedAtom] = useState<AtomInfo | null>(null);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [moleculeData, setMoleculeData] = useState<MoleculeData | null>(null);
  
  // Memoize the list to prevent regeneration
  const elements = useMemo(() => getAllElements(), []);

  // Helper to render grid cell
  const renderCell = (z: number) => {
    const atom = elements.find(e => e.atomicNumber === z);
    if (!atom) return <div className="w-full h-full" />; // Empty placeholder

    return (
      <button
        onClick={() => setSelectedAtom(atom)}
        className="relative w-full aspect-square border border-wood-200 hover:border-wood-600 rounded-lg p-1 flex flex-col justify-between transition-all hover:scale-110 hover:shadow-lg hover:z-10 group"
        style={{ backgroundColor: `${atom.color}20` }} // 20 hex = 12% opacity
      >
        <span className="text-[10px] md:text-xs text-wood-500 font-mono absolute top-1 left-1">{atom.atomicNumber}</span>
        <span className="text-sm md:text-lg font-bold text-wood-900 self-center mt-2 group-hover:text-black">{atom.symbol}</span>
        <span className="text-[9px] text-wood-400 truncate w-full text-center hidden md:block">{atom.name}</span>
        
        {/* Color stripe bottom */}
        <div className="h-1 w-full rounded-full mt-1" style={{ backgroundColor: atom.color }}></div>
      </button>
    );
  };

  // Periodic Table Grid Layout Map
  // row, col -> z. 
  // Standard 18 columns.
  const gridMap: Record<string, number> = {
    // Period 1
    "1-1": 1, "1-18": 2,
    // Period 2
    "2-1": 3, "2-2": 4, "2-13": 5, "2-14": 6, "2-15": 7, "2-16": 8, "2-17": 9, "2-18": 10,
    // Period 3
    "3-1": 11, "3-2": 12, "3-13": 13, "3-14": 14, "3-15": 15, "3-16": 16, "3-17": 17, "3-18": 18,
    // Period 4
    "4-1": 19, "4-2": 20, "4-3": 21, "4-4": 22, "4-5": 23, "4-6": 24, "4-7": 25, "4-8": 26, "4-9": 27, "4-10": 28, "4-11": 29, "4-12": 30, "4-13": 31, "4-14": 32, "4-15": 33, "4-16": 34, "4-17": 35, "4-18": 36,
    // Period 5
    "5-1": 37, "5-2": 38, "5-3": 39, "5-4": 40, "5-5": 41, "5-6": 42, "5-7": 43, "5-8": 44, "5-9": 45, "5-10": 46, "5-11": 47, "5-12": 48, "5-13": 49, "5-14": 50, "5-15": 51, "5-16": 52, "5-17": 53, "5-18": 54,
    // Period 6
    "6-1": 55, "6-2": 56, "6-3": 57, /* Lanthanides gap */ "6-4": 72, "6-5": 73, "6-6": 74, "6-7": 75, "6-8": 76, "6-9": 77, "6-10": 78, "6-11": 79, "6-12": 80, "6-13": 81, "6-14": 82, "6-15": 83, "6-16": 84, "6-17": 85, "6-18": 86,
    // Period 7
    "7-1": 87, "7-2": 88, "7-3": 89, /* Actinides gap */ "7-4": 104, "7-5": 105, "7-6": 106, "7-7": 107, "7-8": 108, "7-9": 109, "7-10": 110, "7-11": 111, "7-12": 112, "7-13": 113, "7-14": 114, "7-15": 115, "7-16": 116, "7-17": 117, "7-18": 118,
  };

  // Lanthanides (58-71) & Actinides (90-103)
  const lanthanides = Array.from({length: 14}, (_, i) => 58 + i);
  const actinides = Array.from({length: 14}, (_, i) => 90 + i);

  // Helper function to get accurate chemical description
  const getAtomDescription = (atom: AtomInfo) => {
    if (atom.category === 'noble-gas') {
      return 'Khí hiếm bền vững, trơ về mặt hóa học do có lớp vỏ ngoài cùng bão hòa (8e hoặc 2e với He).';
    }
    
    const metalCategories = [
      'alkali-metal', 
      'alkaline-earth-metal', 
      'transition-metal', 
      'post-transition-metal', 
      'lanthanide', 
      'actinide'
    ];
    
    if (metalCategories.includes(atom.category || '')) {
       return 'Nguyên tử kim loại, có xu hướng nhường electron để đạt cấu hình bền vững.';
    }

    if (atom.category === 'metalloid') {
       return 'Á kim, có tính chất trung gian giữa kim loại và phi kim.';
    }

    if (['nonmetal', 'halogen'].includes(atom.category || '')) {
       if (atom.atomicNumber === 1) {
          return 'Nguyên tử phi kim đặc biệt, có xu hướng góp chung electron hoặc nhận 1 electron.';
       }
       return 'Nguyên tử phi kim, có xu hướng nhận electron hoặc góp chung electron để đạt cấu hình bền vững.';
    }

    // Fallback based on valence if category is unknown/missing
    if (atom.valenceElectrons <= 3) return 'Nguyên tử kim loại, có xu hướng nhường electron.';
    if (atom.valenceElectrons >= 5) return 'Nguyên tử phi kim, có xu hướng nhận electron.';
    return 'Nguyên tử có 4 electron lớp ngoài cùng, xu hướng tạo liên kết cộng hóa trị.';
  };

  const handleAnalysis = async () => {
    if (!userInput.trim()) return;
    setLoading(true);
    setMoleculeData(null);
    const result = await analyzeChemical(userInput);
    setMoleculeData(result);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-wood-50 text-wood-900 font-sans selection:bg-wood-200 flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-wood-800 to-wood-900 text-white shadow-lg border-b-4 border-earth-500 sticky top-0 z-20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-3">
                <Atom size={32} className="text-wood-300 animate-spin-slow" />
                <div>
                   <h1 className="text-2xl font-bold tracking-tight font-serif uppercase leading-none">Mộc Hóa Học</h1>
                   <p className="text-wood-200 text-xs font-medium tracking-wide">TRỰC QUAN HÓA & PHONG THỦY</p>
                </div>
             </div>
             
             {/* Navigation Tabs */}
             <div className="flex bg-wood-700/50 p-1 rounded-full backdrop-blur-sm">
                <button 
                  onClick={() => setActiveTab('periodic')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'periodic' ? 'bg-wood-100 text-wood-900 shadow-md' : 'text-wood-200 hover:bg-wood-700'}`}
                >
                   <Grid3X3 size={16} /> Bảng Tuần Hoàn
                </button>
                <button 
                  onClick={() => setActiveTab('molecule')}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full text-sm font-bold transition-all ${activeTab === 'molecule' ? 'bg-wood-100 text-wood-900 shadow-md' : 'text-wood-200 hover:bg-wood-700'}`}
                >
                   <Beaker size={16} /> Phân Tích Phân Tử
                </button>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 py-6 flex-grow flex flex-col">
        
        {/* VIEW 1: PERIODIC TABLE */}
        {activeTab === 'periodic' && (
           <div className="animate-fade-in-up w-full overflow-x-auto">
              <div className="min-w-[1000px] mx-auto">
                 {/* Legend */}
                 <div className="flex flex-wrap gap-3 justify-center mb-6 text-xs">
                    {Object.entries(CATEGORY_COLORS).map(([cat, color]) => (
                      <div key={cat} className="flex items-center gap-1">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
                        <span className="capitalize text-wood-600">{cat.replace(/-/g, ' ')}</span>
                      </div>
                    ))}
                 </div>

                 {/* Grid Container */}
                 <div className="grid grid-cols-18 gap-1 md:gap-2 mb-8" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
                    {Array.from({ length: 7 }).map((_, rowIdx) => (
                      <React.Fragment key={rowIdx}>
                         {Array.from({ length: 18 }).map((_, colIdx) => {
                            const row = rowIdx + 1;
                            const col = colIdx + 1;
                            const z = gridMap[`${row}-${col}`];
                            return (
                              <div key={`${row}-${col}`} className="aspect-square">
                                 {z ? renderCell(z) : null}
                              </div>
                            );
                         })}
                      </React.Fragment>
                    ))}
                 </div>

                 {/* Lanthanides & Actinides */}
                 <div className="flex gap-4 items-center mb-1">
                    <div className="w-20 text-right text-xs font-bold text-wood-500">Lanthanides</div>
                    <div className="grid grid-cols-14 gap-1 md:gap-2 flex-grow" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                       {lanthanides.map(z => <div key={z}>{renderCell(z)}</div>)}
                    </div>
                 </div>
                 <div className="flex gap-4 items-center">
                    <div className="w-20 text-right text-xs font-bold text-wood-500">Actinides</div>
                    <div className="grid grid-cols-14 gap-1 md:gap-2 flex-grow" style={{ gridTemplateColumns: 'repeat(14, minmax(0, 1fr))' }}>
                       {actinides.map(z => <div key={z}>{renderCell(z)}</div>)}
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW 2: MOLECULE ANALYSIS */}
        {activeTab === 'molecule' && (
           <div className="animate-fade-in-up max-w-4xl mx-auto w-full">
              {/* Search Bar */}
              <div className="bg-white p-6 rounded-2xl shadow-lg border border-wood-100 mb-8">
                 <h2 className="text-xl font-bold text-wood-800 mb-4 text-center">Nhập công thức hoặc tên chất hóa học</h2>
                 <div className="flex gap-2">
                    <input 
                       type="text" 
                       value={userInput}
                       onChange={(e) => setUserInput(e.target.value)}
                       placeholder="Ví dụ: H2O, NaCl, CO2, Axit Sunfuric..."
                       className="flex-grow px-4 py-3 rounded-xl border border-wood-200 focus:outline-none focus:ring-2 focus:ring-wood-400 bg-wood-50 font-mono text-lg"
                       onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
                    />
                    <button 
                       onClick={handleAnalysis}
                       disabled={loading}
                       className="px-8 py-3 bg-wood-600 text-white rounded-xl font-bold hover:bg-wood-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                       {loading ? <Loader2 className="animate-spin" /> : <Search />}
                       Phân Tích
                    </button>
                 </div>
              </div>

              {/* Results */}
              {moleculeData && (
                <div className="space-y-6">
                   {/* Main Info Card */}
                   <div className="bg-white p-6 rounded-2xl shadow-md border border-wood-100">
                      <div className="flex justify-between items-start mb-4">
                         <div>
                            <h2 className="text-3xl font-bold text-wood-900 font-serif">{moleculeData.formula}</h2>
                            <p className="text-xl text-wood-600">{moleculeData.name}</p>
                            {moleculeData.commonName && <p className="text-sm text-wood-400 italic">({moleculeData.commonName})</p>}
                         </div>
                         <div className="px-4 py-2 bg-wood-100 text-wood-700 rounded-lg font-bold text-sm uppercase">
                            Liên kết: {moleculeData.bondType === 'ionic' ? 'Ion' : moleculeData.bondType === 'covalent' ? 'Cộng Hóa Trị' : 'Kim Loại'}
                         </div>
                      </div>
                      <p className="text-wood-700 leading-relaxed bg-wood-50 p-4 rounded-xl border border-wood-200">
                         {moleculeData.description}
                      </p>
                   </div>
                   
                   {/* Hydrogen Bond Card (Conditional) */}
                   {moleculeData.hasHydrogenBonds && (
                      <div className="bg-blue-50 p-6 rounded-2xl shadow-md border border-blue-100">
                         <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                           Liên Kết Hydrogen
                         </h3>
                         <p className="text-blue-900 leading-relaxed whitespace-pre-line">
                           {moleculeData.hydrogenBondDescription || "Phân tử này có khả năng tạo liên kết hydrogen liên phân tử."}
                         </p>
                      </div>
                   )}

                   {/* Formation Mechanism */}
                   <div className="bg-white p-6 rounded-2xl shadow-md border border-wood-100">
                      <h3 className="text-lg font-bold text-wood-800 mb-3 border-b pb-2 border-wood-100">Cơ chế hình thành</h3>
                      <p className="whitespace-pre-line text-wood-700 leading-relaxed">
                         {moleculeData.formationMechanism}
                      </p>
                      
                      {/* Dynamic Bonding Stage Visualization */}
                      <BondingStage data={moleculeData} />
                   </div>

                   {/* Formulas Grid */}
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Lewis Structure */}
                      <div className="bg-white p-6 rounded-2xl shadow-md border border-wood-100 col-span-1 md:col-span-2">
                         <h3 className="text-lg font-bold text-wood-800 mb-3 text-center">Công thức Lewis</h3>
                         <div className="flex flex-col items-center">
                            {moleculeData.lewisStructureSvg ? (
                               <div className="w-full max-w-[400px]" dangerouslySetInnerHTML={{ __html: moleculeData.lewisStructureSvg }} />
                            ) : (
                               <div className="text-3xl font-mono py-8">{moleculeData.lewisStructure}</div>
                            )}
                            
                            {/* Lewis Explanation Details */}
                            {moleculeData.lewisExplanation && (
                              <div className="mt-4 w-full bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3">
                                 <Info className="text-amber-500 flex-shrink-0 mt-1" size={20} />
                                 <p className="text-sm text-amber-900 leading-relaxed">{moleculeData.lewisExplanation}</p>
                              </div>
                            )}
                         </div>
                      </div>

                      <div className="bg-white p-6 rounded-2xl shadow-md border border-wood-100">
                         <h3 className="text-lg font-bold text-wood-800 mb-3 text-center">Công thức Electron</h3>
                         <div className="flex justify-center">
                            {moleculeData.electronFormulaSvg ? (
                               <div className="w-full" dangerouslySetInnerHTML={{ __html: moleculeData.electronFormulaSvg }} />
                            ) : (
                               <div className="text-2xl font-mono py-8">{moleculeData.electronFormula}</div>
                            )}
                         </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-2xl shadow-md border border-wood-100">
                         <h3 className="text-lg font-bold text-wood-800 mb-3 text-center">Công thức Cấu tạo</h3>
                         <div className="flex justify-center">
                            {moleculeData.structuralFormulaSvg ? (
                               <div className="w-full" dangerouslySetInnerHTML={{ __html: moleculeData.structuralFormulaSvg }} />
                            ) : (
                               <div className="text-2xl font-mono py-8">{moleculeData.structuralFormula}</div>
                            )}
                         </div>
                      </div>
                   </div>
                </div>
              )}
           </div>
        )}
      </main>

      {/* ATOM DETAIL MODAL (Shared) */}
      {selectedAtom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-wood-900/80 backdrop-blur-sm animate-fade-in-up" onClick={() => setSelectedAtom(null)}>
           <div 
             className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden relative"
             onClick={e => e.stopPropagation()}
           >
              <button 
                onClick={() => setSelectedAtom(null)}
                className="absolute top-4 right-4 p-2 bg-wood-100 hover:bg-wood-200 rounded-full text-wood-600 transition-colors z-10"
              >
                <X size={24} />
              </button>

              {/* Left: Visualizer */}
              <div className="w-full md:w-1/2 bg-wood-50 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-wood-100 relative">
                 <div className="absolute top-6 left-6 text-6xl font-black text-wood-100 select-none z-0">{selectedAtom.atomicNumber}</div>
                 <div className="z-10 relative">
                    <AtomCanvas atom={selectedAtom} size={300} animate={true} />
                 </div>
                 <div className="mt-6 text-center z-10">
                    <h2 className="text-4xl font-bold text-wood-900 font-serif mb-1">{selectedAtom.name}</h2>
                    <h3 className="text-2xl font-mono text-wood-600">{selectedAtom.symbol}</h3>
                 </div>
              </div>

              {/* Right: Info */}
              <div className="w-full md:w-1/2 p-8 flex flex-col">
                 <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white mb-4" style={{ backgroundColor: selectedAtom.color }}>
                       {selectedAtom.category?.replace(/-/g, ' ')}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                       <div className="bg-wood-50 p-4 rounded-2xl border border-wood-100">
                          <span className="text-wood-400 text-xs uppercase font-bold block mb-1">Điện tích hạt nhân</span>
                          <span className="text-xl font-mono font-bold text-rose-600">+{selectedAtom.atomicNumber}</span>
                       </div>

                       <div className="bg-wood-50 p-4 rounded-2xl border border-wood-100">
                          <span className="text-wood-400 text-xs uppercase font-bold block mb-1">Khối lượng</span>
                          <span className="text-xl font-mono font-bold text-wood-800">{selectedAtom.mass} u</span>
                       </div>
                       
                       <div className="bg-wood-50 p-4 rounded-2xl border border-wood-100">
                          <span className="text-wood-400 text-xs uppercase font-bold block mb-1">Electron hóa trị</span>
                          <span className="text-xl font-mono font-bold text-amber-600">{selectedAtom.valenceElectrons}</span>
                       </div>
                       
                       <div className="bg-wood-50 p-4 rounded-2xl border border-wood-100 col-span-1">
                          <span className="text-wood-400 text-xs uppercase font-bold block mb-1">Cấu hình Electron</span>
                          <span className="text-sm font-mono font-bold text-wood-900 break-words leading-relaxed">{selectedAtom.electronConfig || 'N/A'}</span>
                       </div>

                       <div className="bg-wood-50 p-4 rounded-2xl border border-wood-100 col-span-2">
                          <span className="text-wood-400 text-xs uppercase font-bold block mb-1">Lớp Electron</span>
                          <div className="flex items-center gap-2 flex-wrap">
                            {selectedAtom.shells.map((n, i) => (
                               <div key={i} className="flex flex-col items-center">
                                  <span className="w-8 h-8 rounded-full bg-wood-200 flex items-center justify-center font-bold text-wood-800 text-sm shadow-inner">{n}</span>
                                  <span className="text-[10px] text-wood-400 mt-1">{i+1}</span>
                               </div>
                            ))}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* New Section: Periodic Trends */}
                 <div className="mt-auto space-y-3">
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                        <h4 className="flex items-center gap-2 font-bold text-emerald-800 mb-2 text-sm uppercase">
                            <ArrowRight size={16} /> Quy luật tuần hoàn
                        </h4>
                        <ul className="space-y-3 text-sm text-emerald-800">
                            <li className="flex flex-col sm:flex-row sm:gap-2">
                                <span className="font-bold min-w-[100px] text-emerald-900">Độ âm điện:</span>
                                <span className="italic">{selectedAtom.trends?.electronegativity}</span>
                            </li>
                            <li className="flex flex-col sm:flex-row sm:gap-2">
                                <span className="font-bold min-w-[100px] text-emerald-900">Bán kính:</span>
                                <span className="italic">{selectedAtom.trends?.radius}</span>
                            </li>
                            <li className="flex flex-col sm:flex-row sm:gap-2">
                                <span className="font-bold min-w-[100px] text-emerald-900">Tính chất:</span>
                                <span className="italic">{selectedAtom.trends?.character}</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                        <h4 className="flex items-center gap-2 font-bold text-blue-800 mb-2">
                        <Info size={16} /> Mô tả
                        </h4>
                        <p className="text-sm text-blue-700 leading-relaxed">
                        {getAtomDescription(selectedAtom)}
                        </p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
