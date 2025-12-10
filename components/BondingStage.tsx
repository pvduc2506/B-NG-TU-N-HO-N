import React, { useEffect, useRef, useState } from 'react';
import { MoleculeData } from '../types';

interface BondingStageProps {
  data: MoleculeData;
}

const BondingStage: React.FC<BondingStageProps> = ({ data }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stage, setStage] = useState<'initial' | 'bonding' | 'final'>('initial');
  
  useEffect(() => {
    setStage('initial');
  }, [data]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let startTime: number | null = null;
    
    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;
    
    const atomCount = data.atoms.length;
    // Calculate spacing based on number of atoms to fit screen
    const baseSpacing = 160;
    const spacing = Math.min(width / (atomCount + 1), baseSpacing);
    const totalWidth = (atomCount - 1) * spacing;
    const startX = (width - totalWidth) / 2;

    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      
      ctx.clearRect(0, 0, width, height);

      // Determine Animation Progress Factors
      let moveProgress = 0; 
      let actionProgress = 0; // Transfer or Share
      
      if (stage === 'initial') {
        moveProgress = 0;
        actionProgress = 0;
      } else if (stage === 'bonding') {
        // Phase 1: Move closer
        moveProgress = Math.min(progress / 1500, 1);
        // Phase 2: Transfer/Share electrons (starts after move finishes)
        if (moveProgress >= 1) {
           actionProgress = Math.min((progress - 1500) / 1500, 1);
        }
      } else if (stage === 'final') {
        moveProgress = 1;
        actionProgress = 1;
      }

      // Draw Atoms
      data.atoms.forEach((atom, index) => {
        // Calculate Position
        const initialX = startX + index * spacing;
        
        let offsetX = 0;
        // Determine offset direction based on bond partners
        // Simple logic: Move towards center if it's involved in bonding
        const centerIndex = (atomCount - 1) / 2;
        
        // Ionic: Move close but not overlap
        // Covalent: Move close to overlap shells
        const moveDistance = data.bondType === 'ionic' ? spacing * 0.25 : spacing * 0.35;
        
        if (index < centerIndex) offsetX = moveDistance * moveProgress;
        else if (index > centerIndex) offsetX = -moveDistance * moveProgress;

        const x = initialX + offsetX;
        const y = centerY;
        
        // Draw Atom
        // 1. Nucleus
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fillStyle = atom.color;
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.symbol, x, y);

        // 2. Shells
        const valenceShellIndex = atom.shells.length - 1;
        atom.shells.forEach((count, shellIdx) => {
           // Skip inner shells drawing for clarity if needed, but let's keep them faint
           const shellRadius = 30 + (shellIdx + 1) * 20;
           
           // If Covalent and "bonding" stage, outer shells might overlap visually
           ctx.beginPath();
           ctx.arc(x, y, shellRadius, 0, Math.PI * 2);
           
           // Highlight valence shell
           if (shellIdx === valenceShellIndex) {
              ctx.strokeStyle = `rgba(234, 179, 8, 0.8)`; // yellow-500
              ctx.lineWidth = 2;
           } else {
              ctx.strokeStyle = `rgba(37, 144, 78, 0.2)`;
              ctx.lineWidth = 1;
           }
           ctx.stroke();

           // 3. Electrons
           for (let e = 0; e < count; e++) {
              // Static position logic for stable visualization
              // Distribute evenly
              const angleOffset = (Math.PI * 2) / count;
              // Add slow spin
              const spin = timestamp * 0.0002 * (shellIdx % 2 === 0 ? 1 : -1);
              const angle = (e * angleOffset) + spin;

              let ex = x + shellRadius * Math.cos(angle);
              let ey = y + shellRadius * Math.sin(angle);

              // --- LOGIC FOR IONIC TRANSFER ---
              if (data.bondType === 'ionic' && shellIdx === valenceShellIndex && actionProgress > 0) {
                 const isDonor = atom.valenceElectrons <= 3; // heuristic: metals lose e
                 // Find bond connected to this atom
                 const bond = data.bonds.find(b => b.fromIndex === index && b.type === 'ionic');
                 
                 // Only animate if this is a donor and has a defined bond
                 if (isDonor && bond) {
                    const targetIdx = bond.toIndex;
                    // Re-calculate target position (same logic as atom loop)
                    const targetInitialX = startX + targetIdx * spacing;
                    let targetOffsetX = 0;
                    if (targetIdx < centerIndex) targetOffsetX = moveDistance * moveProgress;
                    else if (targetIdx > centerIndex) targetOffsetX = -moveDistance * moveProgress;
                    
                    const targetX = targetInitialX + targetOffsetX;
                    const targetY = centerY;
                    
                    // Target radius: outer shell of receiver
                    const targetRadius = 30 + (data.atoms[targetIdx].shells.length) * 20;
                    
                    // Move specific electrons.
                    // If atom has 1 valence e, move it. If 2, move both.
                    // For visualization, we just interpolate position of ALL valence electrons of donor to target
                    const targetAngle = Math.PI + (e * 0.5); // Arrive at opposite side or spread
                    
                    const destX = targetX + targetRadius * Math.cos(targetAngle);
                    const destY = targetY + targetRadius * Math.sin(targetAngle);
                    
                    // Interpolate
                    ex = ex + (destX - ex) * actionProgress;
                    ey = ey + (destY - ey) * actionProgress;
                 }
              }

              // --- LOGIC FOR COVALENT SHARING ---
              // (Visualized by atoms getting close, electrons orbit is hard to make perfect without physics)
              // We rely on the "moveProgress" creating overlap.
              
              ctx.beginPath();
              ctx.arc(ex, ey, 6, 0, Math.PI * 2);
              
              // Color: Valence electrons distinct
              ctx.fillStyle = shellIdx === valenceShellIndex ? '#eab308' : '#34b165';
              ctx.fill();
           }
        });

        // Ions Charge Label (After transfer)
        if (data.bondType === 'ionic' && actionProgress > 0.8) {
             const isPositive = atom.valenceElectrons <= 3;
             ctx.fillStyle = isPositive ? '#ef4444' : '#3b82f6'; // Red for +, Blue for -
             ctx.font = 'bold 20px sans-serif';
             const chargeText = isPositive ? `+${atom.valenceElectrons}` : `-${8 - atom.valenceElectrons}`;
             ctx.fillText(chargeText, x + 25, y - 25);
        }
      });
      
      // Shared region annotation for Covalent
      if (data.bondType === 'covalent' && moveProgress > 0.8) {
         // Draw a subtle "cloud" or brace
         ctx.font = 'bold 16px sans-serif';
         ctx.fillStyle = '#1e5b36';
         ctx.fillText("Vùng xen phủ orbital", width/2, centerY + 130);
         
         ctx.beginPath();
         ctx.moveTo(width/2 - 40, centerY + 110);
         ctx.lineTo(width/2 + 40, centerY + 110);
         ctx.strokeStyle = '#1e5b36';
         ctx.lineWidth = 2;
         ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render(0);
    return () => cancelAnimationFrame(animationId);
  }, [data, stage]);

  return (
    <div className="flex flex-col items-center w-full bg-white rounded-xl shadow-md p-4 mt-6 border border-wood-200">
      <div className="w-full flex justify-between items-center mb-4 px-2">
         <h4 className="font-bold text-wood-800">Mô phỏng quá trình:</h4>
         <div className="text-sm text-wood-500 font-mono">
            {stage === 'initial' && "Trạng thái nguyên tử tự do"}
            {stage === 'bonding' && (data.bondType === 'ionic' ? "Chuyển electron & Hút tĩnh điện" : "Tiến lại gần & Góp chung e")}
            {stage === 'final' && "Hình thành phân tử bền vững"}
         </div>
      </div>

      <div className="relative w-full overflow-hidden flex justify-center bg-wood-50 rounded-lg border border-wood-100">
        <canvas ref={canvasRef} width={800} height={400} className="max-w-full" />
      </div>

      <div className="flex gap-4 mt-6">
        <button 
          onClick={() => setStage('initial')}
          className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm ${stage === 'initial' ? 'bg-wood-600 text-white scale-105' : 'bg-white text-wood-600 border border-wood-200 hover:bg-wood-50'}`}
        >
          1. Ban đầu
        </button>
        <button 
           onClick={() => setStage('bonding')}
           className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm ${stage === 'bonding' ? 'bg-wood-600 text-white scale-105' : 'bg-white text-wood-600 border border-wood-200 hover:bg-wood-50'}`}
        >
          2. {data.bondType === 'ionic' ? 'Cho - Nhận' : 'Góp chung'}
        </button>
        <button 
           onClick={() => setStage('final')}
           className={`px-6 py-2 rounded-full font-medium transition-all shadow-sm ${stage === 'final' ? 'bg-wood-600 text-white scale-105' : 'bg-white text-wood-600 border border-wood-200 hover:bg-wood-50'}`}
        >
          3. Kết quả
        </button>
      </div>
    </div>
  );
};

export default BondingStage;
