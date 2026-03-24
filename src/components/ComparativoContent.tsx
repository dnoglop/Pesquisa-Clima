import React, { useState, useRef, useMemo } from 'react';
import { GitCompare } from 'lucide-react';
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
          let val = areaStats[m.key as keyof AreaComparison] as number;
          // Normalize eNPS (-100 to 100) to 0-10 scale for radar consistency
          if (m.key === 'enps') {
            val = (val + 100) / 20;
          }
          obj[area] = val;
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

  const colors = ['#049C7A', '#F27D26', '#3B82F6']; // Updated colors for better contrast

  const metricsList = [
    { key: 'enps', label: 'eNPS', isPercentage: false, max: 100 },
    { key: 'seguranca', label: 'Segurança Psicológica', isPercentage: false, max: 10 },
    { key: 'lideranca', label: 'Exemplo da Liderança', isPercentage: false, max: 10 },
    { key: 'identificacao', label: 'Identificação Cultural', isPercentage: false, max: 10 },
    { key: 'reconhecimento', label: 'Sentimento de Reconhecimento', isPercentage: false, max: 10 },
    { key: 'iaUsage', label: 'Adoção de IA', isPercentage: true, max: 100 },
    { key: 'mentorshipInterest', label: 'Interesse em Mentoria', isPercentage: true, max: 100 },
  ];

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 sm:mb-8 gap-4">
        <div>
          <h2 className="text-secondary-style tracking-tight">Comparativo Estratégico</h2>
          <p className="text-secondary text-[10px] sm:text-sm mt-1 sm:mt-2">Selecione até 3 áreas para cruzar dados e identificar benchmarks internos</p>
        </div>
        <ExportButton targetRef={containerRef} fileName="comparativo-estrategico" />
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

      <div ref={containerRef} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Radar Chart - Now normalized */}
          <div className="lg:col-span-5 glass-card p-6 sm:p-8 rounded-3xl h-[450px] sm:h-[550px] flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-variant-style">Equilíbrio Cultural</h3>
                <p className="text-[10px] text-secondary">Escala normalizada (0-10) para comparação visual</p>
              </div>
            </div>
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
                      fillOpacity={0.15}
                      strokeWidth={3}
                    />
                  ))}
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            
            <div className="mt-4 flex flex-wrap justify-center gap-4 sm:gap-6">
              {selectedAreas.map((area, idx) => (
                <div key={area} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" style={{ backgroundColor: colors[idx] }}></div>
                  <span className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">{area}</span>
                </div>
              ))}
            </div>
          </div>

          {/* New Comparison Matrix */}
          <div className="lg:col-span-7 glass-card p-6 sm:p-8 rounded-3xl overflow-hidden">
            <h3 className="text-variant-style mb-6">Matriz de Benchmarking</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-outline-variant/10">
                    <th className="text-left py-4 text-[9px] font-black text-secondary uppercase tracking-widest">Métrica</th>
                    {selectedAreas.map((area, idx) => (
                      <th key={area} className="text-center py-4 px-2">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colors[idx] }} />
                          <span className="text-[8px] font-black text-on-surface uppercase tracking-tighter truncate max-w-[80px]">{area}</span>
                        </div>
                      </th>
                    ))}
                    <th className="text-right py-4 text-[9px] font-black text-tertiary uppercase tracking-widest">Gap Max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {metricsList.map((m) => {
                    const areaValues = selectedAreas.map(area => {
                      const s = stats.comparisons.find(c => c.area === area);
                      return (s?.[m.key as keyof AreaComparison] as number) || 0;
                    });
                    const maxVal = Math.max(...areaValues);
                    const minVal = Math.min(...areaValues);
                    const gap = maxVal - minVal;

                    return (
                      <tr key={m.key} className="group hover:bg-on-surface/[0.02] transition-colors">
                        <td className="py-4 pr-4">
                          <p className="text-[10px] font-bold text-on-surface">{m.label}</p>
                          <div className="w-full h-1 bg-on-surface/5 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-secondary/20 rounded-full" style={{ width: `${(maxVal / m.max) * 100}%` }} />
                          </div>
                        </td>
                        {areaValues.map((val, idx) => (
                          <td key={idx} className="text-center py-4 px-2">
                            <span className={cn(
                              "text-xs font-black",
                              val === maxVal && areaValues.length > 1 ? "text-tertiary" : "text-on-surface/70",
                              val === minVal && areaValues.length > 1 && val !== maxVal ? "text-primary" : ""
                            )}>
                              {val.toFixed(1)}{m.isPercentage ? '%' : ''}
                            </span>
                          </td>
                        ))}
                        <td className="text-right py-4 pl-4">
                          <span className={cn(
                            "text-[10px] font-black px-2 py-1 rounded-lg",
                            gap > (m.max * 0.2) ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
                          )}>
                            {gap.toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-4 rounded-2xl bg-surface-low/50 border border-outline-variant/10 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-tertiary/10 text-tertiary">
                <GitCompare className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-on-surface uppercase tracking-widest mb-1">Dica de Análise</p>
                <p className="text-[10px] text-secondary leading-relaxed">
                  Valores em <span className="text-tertiary font-bold">verde</span> representam o benchmark (melhor desempenho) entre as áreas selecionadas. Gaps superiores a 20% da escala indicam oportunidades críticas de compartilhamento de boas práticas.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deep Dive Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-outline-variant/20" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Análise Detalhada por Área</h3>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedAreas.map((area, idx) => {
              const areaStats = stats.comparisons.find(c => c.area === area);
              if (!areaStats) return null;

              return (
                <motion.div 
                  key={area}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-6 rounded-3xl border-t-4"
                  style={{ borderTopColor: colors[idx] }}
                >
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-wider text-on-surface">{area}</h4>
                      <p className="text-[10px] text-secondary">Perfil de Engajamento</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-on-surface/5 text-[9px] font-bold text-primary">
                      {areaStats.enps.toFixed(0)} NPS
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* eNPS Distribution Mini Chart */}
                    <div className="space-y-2">
                      <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Distribuição eNPS</p>
                      <div className="flex h-2 rounded-full overflow-hidden bg-on-surface/5">
                        <div className="bg-tertiary" style={{ width: `${areaStats.enpsDistribution.promoters}%` }} />
                        <div className="bg-background" style={{ width: `${areaStats.enpsDistribution.passives}%` }} />
                        <div className="bg-primary" style={{ width: `${areaStats.enpsDistribution.detractors}%` }} />
                      </div>
                      <div className="flex justify-between text-[8px] font-bold text-secondary">
                        <span>P: {areaStats.enpsDistribution.promoters.toFixed(0)}%</span>
                        <span>D: {areaStats.enpsDistribution.detractors.toFixed(0)}%</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/10">
                      <div>
                        <p className="text-[8px] font-bold text-secondary uppercase">Uso de IA</p>
                        <p className="text-xs font-black text-on-surface">{areaStats.iaUsage.toFixed(0)}%</p>
                      </div>
                      <div>
                        <p className="text-[8px] font-bold text-secondary uppercase">Mentoria</p>
                        <p className="text-xs font-black text-on-surface">{areaStats.mentorshipInterest.toFixed(0)}%</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-outline-variant/10">
                      <p className="text-[8px] font-bold text-secondary uppercase mb-1">Prioridade da Área</p>
                      <p className="text-[10px] font-bold text-on-surface leading-tight">{areaStats.topPriorityAction}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Cross Insights Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-variant-style mb-6">IA vs Engajamento</h3>
            <p className="text-[10px] text-secondary mb-6">Como a frequência de uso de IA impacta o eNPS</p>
            <div className="space-y-4">
              {stats.crossInsights.iaUsageVsEnps.map((item, idx) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-24 text-[9px] font-bold text-secondary uppercase truncate" title={item.label}>{item.label}</div>
                  <div className="flex-1 h-2 bg-on-surface/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, (item.enps + 100) / 200 * 100)}%` }}
                      className={cn(
                        "h-full",
                        item.enps > 50 ? "bg-tertiary" : item.enps > 0 ? "bg-primary" : "bg-destructive"
                      )}
                    />
                  </div>
                  <div className="w-12 text-right text-[10px] font-black">{item.enps.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl">
            <h3 className="text-variant-style mb-6">Bem-estar vs Engajamento</h3>
            <p className="text-[10px] text-secondary mb-6">Impacto da prática de exercícios no eNPS</p>
            <div className="space-y-4">
              {stats.crossInsights.exerciseVsEnps.map((item, idx) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="w-24 text-[9px] font-bold text-secondary uppercase truncate" title={item.label}>{item.label}</div>
                  <div className="flex-1 h-2 bg-on-surface/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, (item.enps + 100) / 200 * 100)}%` }}
                      className={cn(
                        "h-full",
                        item.enps > 50 ? "bg-tertiary" : item.enps > 0 ? "bg-primary" : "bg-destructive"
                      )}
                    />
                  </div>
                  <div className="w-12 text-right text-[10px] font-black">{item.enps.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
