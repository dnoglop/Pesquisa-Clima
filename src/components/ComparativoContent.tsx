import React, { useState, useRef, useMemo } from 'react';
import { DashboardStats, AreaComparison } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip as RechartsTooltip } from 'recharts';
import { ExportButton } from './ui/ExportButton';
import { cn } from '../lib/utils';
import { InfoTooltip } from './ui/Tooltip';

interface ComparativoContentProps {
  stats: DashboardStats;
}

export function ComparativoContent({ stats }: ComparativoContentProps) {
  const [selectedAreas, setSelectedAreas] = useState<string[]>([stats.areas[0], stats.areas[1] || stats.areas[0]]);
  const containerRef = useRef<HTMLDivElement>(null);

  const comparisonData = useMemo(() => {
    const metrics = [
      { key: 'enps', label: 'eNPS' },
      { key: 'seguranca', label: 'Segurança' },
      { key: 'lideranca', label: 'Liderança' },
      { key: 'identificacao', label: 'Identificação' },
      { key: 'reconhecimento', label: 'Reconhecimento' },
    ];

    return metrics.map(m => {
      const obj: any = { subject: m.label, fullMark: 10 };
      selectedAreas.forEach(area => {
        const areaStats = stats.comparisons.find(c => c.area === area);
        if (areaStats) {
          obj[area] = areaStats[m.key as keyof AreaComparison];
        }
      });
      return obj;
    });
  }, [selectedAreas, stats.comparisons]);

  const toggleArea = (area: string) => {
    if (selectedAreas.includes(area)) {
      if (selectedAreas.length > 1) {
        setSelectedAreas(selectedAreas.filter(a => a !== area));
      }
    } else {
      if (selectedAreas.length < 3) {
        setSelectedAreas([...selectedAreas, area]);
      }
    }
  };

  const colors = ['#049C7A', '#F27D26', '#E84F3D'];

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-secondary-style tracking-tight">Comparativo entre Áreas</h2>
          <p className="text-secondary text-[10px] sm:text-sm mt-1 sm:mt-2">Selecione até 3 áreas para comparar o desempenho cultural</p>
        </div>
        <ExportButton targetRef={containerRef} fileName="comparativo-areas" />
      </div>

      <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
        {stats.areas.map(area => (
          <button
            key={area}
            onClick={() => toggleArea(area)}
            className={cn(
              "px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-bold uppercase tracking-widest transition-all",
              selectedAreas.includes(area)
                ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                : "bg-surface-low text-secondary hover:bg-on-surface/5"
            )}
          >
            {area}
          </button>
        ))}
      </div>

      <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="glass-card p-6 sm:p-8 rounded-3xl h-[450px] sm:h-[550px] flex flex-col">
          <h3 className="text-variant-style mb-4 sm:mb-6">Radar de Performance</h3>
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={comparisonData}>
                <PolarGrid stroke="#e5e7eb" strokeWidth={1} />
                <PolarAngleAxis 
                  dataKey="subject" 
                  tick={{ fontSize: 9, fontWeight: 700, fill: '#4b5563' }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
                {selectedAreas.map((area, idx) => (
                  <Radar
                    key={area}
                    name={area}
                    dataKey={area}
                    stroke={colors[idx]}
                    fill={colors[idx]}
                    fillOpacity={0.2}
                  />
                ))}
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Custom Legend for better export support */}
          <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
            {selectedAreas.map((area, idx) => (
              <div key={area} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-sm" style={{ backgroundColor: colors[idx] }}></div>
                <span className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">{area}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl">
          <h3 className="text-variant-style mb-6 sm:mb-8">Diferenças Principais</h3>
          <div className="space-y-4 sm:space-y-6">
            {['enps', 'seguranca', 'lideranca', 'identificacao', 'reconhecimento'].map((metric) => {
              const values = selectedAreas.map(area => {
                const s = stats.comparisons.find(c => c.area === area);
                return { area, val: (s?.[metric as keyof AreaComparison] as number) || 0 };
              }).sort((a, b) => b.val - a.val);

              const diff = values[0].val - values[values.length - 1].val;

              return (
                <div key={metric} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <p className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">{metric.toUpperCase()}</p>
                    <span className={cn(
                      "text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-full",
                      diff > 2 ? "bg-tertiary/20 text-tertiary" : "bg-primary/20 text-primary"
                    )}>
                      GAP: {diff.toFixed(1)}
                    </span>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {values.map((v, idx) => (
                      <div key={v.area} className="flex items-center gap-3 sm:gap-4">
                        <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: colors[selectedAreas.indexOf(v.area)] }}></div>
                        <div className="flex-1 h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(v.val / 10) * 100}%` }}
                            className="h-full"
                            style={{ backgroundColor: colors[selectedAreas.indexOf(v.area)] }}
                          />
                        </div>
                        <span className="text-[10px] sm:text-xs font-extrabold w-8 text-right">{v.val.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
