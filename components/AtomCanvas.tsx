import React, { useEffect, useRef } from 'react';
import { AtomInfo } from '../types';

interface AtomCanvasProps {
  atom: AtomInfo;
  size?: number;
  highlightValence?: boolean;
  animate?: boolean;
  className?: string;
}

const AtomCanvas: React.FC<AtomCanvasProps> = ({ 
  atom, 
  size = 300, 
  highlightValence = false, 
  animate = true,
  className = ""
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const centerX = size / 2;
    const centerY = size / 2;
    
    const maxShells = Math.max(atom.shells.length, 3); 
    const nucleusRadius = size * 0.08;
    const maxRadius = (size / 2) * 0.9;
    const shellSpacing = (maxRadius - nucleusRadius) / maxShells;

    const render = (time: number) => {
      ctx.clearRect(0, 0, size, size);

      // Draw Nucleus
      ctx.beginPath();
      ctx.arc(centerX, centerY, nucleusRadius, 0, 2 * Math.PI);
      ctx.fillStyle = atom.color; 
      ctx.fill();
      ctx.strokeStyle = '#1e5b36';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw Nuclear Charge (e.g., +1, +6)
      ctx.fillStyle = '#ffffff';
      // Adjust font size slightly for larger numbers (e.g., +118)
      const fontSize = atom.atomicNumber > 99 ? size * 0.05 : size * 0.065;
      ctx.font = `bold ${fontSize}px monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`+${atom.atomicNumber}`, centerX, centerY);

      // Draw Shells and Electrons
      atom.shells.forEach((electronCount, shellIndex) => {
        const radius = nucleusRadius + (shellIndex + 1) * shellSpacing;
        
        // Draw Shell Ring
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.strokeStyle = highlightValence && shellIndex === atom.shells.length - 1 
          ? '#eab308' 
          : '#94e0ad';
        ctx.lineWidth = 1;
        ctx.setLineDash(shellIndex === atom.shells.length - 1 ? [] : [5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw Electrons
        for (let i = 0; i < electronCount; i++) {
          const angleOffset = (2 * Math.PI) / electronCount;
          // Very slow animation: 0.00005 speed
          const speed = 0.0001 * (shellIndex % 2 === 0 ? 1 : -1); 
          const currentAngle = (i * angleOffset) + (animate ? time * speed : 0);

          const ex = centerX + radius * Math.cos(currentAngle);
          const ey = centerY + radius * Math.sin(currentAngle);

          ctx.beginPath();
          ctx.arc(ex, ey, size * 0.012, 0, 2 * Math.PI);
          ctx.fillStyle = highlightValence && shellIndex === atom.shells.length - 1 
             ? '#fbbf24' 
             : '#34b165';
          ctx.fill();
        }
      });

      if (animate) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render(0);

    return () => cancelAnimationFrame(animationFrameId);
  }, [atom, size, highlightValence, animate]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className={`rounded-full bg-wood-50 border-4 border-wood-100 shadow-inner ${className}`}
    />
  );
};

export default AtomCanvas;