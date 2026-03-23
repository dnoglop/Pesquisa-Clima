import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { motion } from 'motion/react';
import { ExportButton } from './ui/ExportButton';
import { InfoTooltip } from './ui/Tooltip';

interface HeatmapContentProps {
  stats: DashboardStats;
}

export function HeatmapContent({ stats }: HeatmapContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const metrics = ['Identificação', 'Liderança', 'Segurança', 'Reconhecimento', 'eNPS'];

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-secondary-style tracking-tight">Mapa de Calor da Cultura</h2>
          <p className="text-secondary text-xs sm:text-sm mt-2">Visão transversal dos pilares por área de atuação</p>
        </div>
        <ExportButton targetRef={containerRef} fileName="mapa-calor-cultura" />
      </div>

      <div ref={containerRef} className="glass-card p-4 sm:p-8 rounded-3xl overflow-x-auto">
        <div className="min-w-[640px] sm:min-w-0">
          <div className="grid grid-cols-[140px_repeat(5,1fr)] sm:grid-cols-[200px_repeat(5,1fr)] gap-2 sm:gap-4 mb-6">
            <div className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">Área</div>
            {metrics.map(m => (
              <div key={m} className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest text-center flex items-center justify-center gap-1">
                <span className="hidden sm:inline">{m}</span>
                <span className="sm:hidden">{m.charAt(0)}</span>
                <InfoTooltip content={`Média de ${m} para esta área.`} />
              </div>
            ))}
          </div>

          <div className="space-y-2 sm:space-y-3">
            {stats.heatmap.map((row, idx) => (
              <motion.div 
                key={row.area}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="grid grid-cols-[140px_repeat(5,1fr)] sm:grid-cols-[200px_repeat(5,1fr)] gap-2 sm:gap-4 items-center"
              >
                <div className="text-[10px] sm:text-xs font-bold truncate pr-2 sm:pr-4">{row.area}</div>
                {row.metrics.map((m, mIdx) => (
                  <div 
                    key={mIdx}
                    className="h-10 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-[10px] sm:text-xs font-extrabold transition-all hover:scale-105 cursor-default"
                    style={{ 
                      backgroundColor: `${m.color}20`, 
                      color: m.color,
                      border: `1px solid ${m.color}40`
                    }}
                    title={`${m.label}: ${m.score.toFixed(1)}`}
                  >
                    {m.score.toFixed(1)}
                  </div>
                ))}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-8 sm:mt-12 flex flex-wrap items-center justify-center gap-4 sm:gap-8 border-t border-outline-variant/10 pt-6 sm:pt-8">
          <LegendItem color="#049C7A" label="Excelente (8.5+)" />
          <LegendItem color="#F27D26" label="Atenção (7.0 - 8.4)" />
          <LegendItem color="#E84F3D" label="Crítico (< 7.0)" />
        </div>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string, label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div>
      <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</span>
    </div>
  );
}
