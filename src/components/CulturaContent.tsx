import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { Megaphone, Shield, Users, Target, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExportButton } from './ui/ExportButton';
import { cn } from '../lib/utils';

interface CulturaContentProps {
  stats: DashboardStats;
}

export function CulturaContent({ stats }: CulturaContentProps) {
  const leadershipRef = useRef<HTMLDivElement>(null);
  const psychologicalSafetyRef = useRef<HTMLDivElement>(null);
  const personalityRef = useRef<HTMLDivElement>(null);
  const valuePerceptionRef = useRef<HTMLDivElement>(null);

  const COLORS = ['#049C7A', '#312D31', '#E84F3D', '#F27D26'];

  const totalSentiment = stats.leadershipSentiment.reduce((acc, curr) => acc + curr.value, 0);
  const positivePercentage = totalSentiment > 0 
    ? ((stats.leadershipSentiment.find(s => s.label.toLowerCase().includes('embaixadora'))?.value || 0) / totalSentiment * 100)
    : 0;

  return (
    <div className="p-4 mt-5 space-y-4 max-full mx-[30px] sm:space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div ref={leadershipRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Percepção da liderança</h3>
              <p className="text-xs text-secondary">Como os Consisters veem a atuação das lideranças</p>
            </div>
            <ExportButton targetRef={leadershipRef} fileName="percepcao-lideranca" />
          </div>
          
          <div className="h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.leadershipSentiment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="label"
                  stroke="none"
                >
                  {stats.leadershipSentiment.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--surface)', border: 'none', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  content={({ payload }) => (
                    <div className="flex flex-wrap justify-center gap-4 mt-4">
                      {payload?.map((entry: any, index: number) => (
                        <div key={`item-${index}`} className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">
                            {entry.value}: {((stats.leadershipSentiment[index].value / totalSentiment) * 100).toFixed(0)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-12">
              <span className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">Favorável</span>
              <span className="text-2xl sm:text-3xl font-extrabold text-primary">{positivePercentage.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div ref={psychologicalSafetyRef} className="glass-card p-6 sm:p-8 rounded-3xl relative flex flex-col gap-4">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Ambiente seguro</h3>
              <p className="text-xs text-secondary">Como os Consisters se sentem no time e com a cultura</p>
            </div>
            <ExportButton targetRef={psychologicalSafetyRef} fileName="seguranca-sincronia" />
          </div>
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold">Espaço seguro para erros</p>
                  <p className="text-[9px] sm:text-[10px] text-secondary">Cultura de aprendizado vs exposição</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.safetyScore}%` }} // Usa a porcentagem direta
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
                {/* Converte de volta para escala 0 a 5 */}
                <span className="text-xs sm:text-sm font-bold">{((stats.safetyScore / 100) * 5).toFixed(1)}/5</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold">Alinhamento Cultural</p>
                  <p className="text-[9px] sm:text-[10px] text-secondary">Alinhamento entre o discurso e a prática</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.culturalSyncScore}%` }} // Usa a porcentagem direta
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
                {/* Converte de volta para escala 0 a 5 */}
                <span className="text-xs sm:text-sm font-bold">{((stats.culturalSyncScore / 100) * 5).toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div ref={personalityRef} className="lg:col-span-1 glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style">Personalidade Consistem</h3>
            <ExportButton targetRef={personalityRef} fileName="personalidade-empresa" />
          </div>
          <div className="flex flex-wrap gap-2">
            {stats.personalityTraits.map((trait, index) => (
              <div 
                key={index}
                className={cn(
                  "px-4 py-2 rounded-2xl text-[10px] sm:text-xs font-bold transition-all",
                  index === 0 ? "bg-primary text-white" : "bg-on-surface/5 text-secondary border border-outline-variant/10"
                )}
              >
                {trait.trait} ({trait.percentage.toFixed(0)}%)
              </div>
            ))}
          </div>
          <div className="mt-8 p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="w-4 h-4 text-primary" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Canal de elogio</p>
            </div>
            <p className="text-xs leading-relaxed">
              <span className="font-black text-primary">{stats.elogioInterest.toFixed(0)}%</span> dos Consisters tem interesse em um canal oficial para elogios públicos.
            </p>
          </div>
        </div>

        <div ref={valuePerceptionRef} className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style">Percepção de valor</h3>
            <ExportButton targetRef={valuePerceptionRef} fileName="percepcao-valor" />
          </div>
          <div className="space-y-4">
            {stats.valuePerceptionRanking.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-on-surface/5 border border-outline-variant/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs italic sm:text-sm leading-tight">"{item.phrase}"</p>
                  <div className="mt-2 h-1.5 bg-on-surface/10 rounded-full overflow-hidden w-full">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(item.count / stats.totalResponses) * 100}%` }}
                      transition={{ duration: 1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
                <span className="text-xs font-black text-secondary">{((item.count / stats.totalResponses) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
