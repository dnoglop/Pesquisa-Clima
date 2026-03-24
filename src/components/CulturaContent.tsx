import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { Megaphone, Shield, Users, Target, Zap, Smile, Heart, MessageSquare } from 'lucide-react';
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
  const testimonialsRef = useRef<HTMLDivElement>(null);

  const COLORS = ['#049C7A', '#312D31', '#E84F3D', '#F27D26'];

  const totalSentiment = stats.leadershipSentiment.reduce((acc, curr) => acc + curr.value, 0);
  const positivePercentage = totalSentiment > 0 
    ? ((stats.leadershipSentiment.find(s => s.label.toLowerCase().includes('embaixadora'))?.value || 0) / totalSentiment * 100)
    : 0;

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div ref={leadershipRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Percepção da Liderança</h3>
              <p className="text-xs sm:text-sm text-secondary">Como os colaboradores veem a atuação das lideranças</p>
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

        <div ref={psychologicalSafetyRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <h3 className="text-variant-style">Segurança & Sincronia</h3>
            <ExportButton targetRef={psychologicalSafetyRef} fileName="seguranca-sincronia" />
          </div>
          <div className="space-y-4 sm:space-y-8">
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold">Espaço Seguro para Erros</p>
                  <p className="text-[9px] sm:text-[10px] text-secondary">Cultura de aprendizado vs punição</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.safetyScore / 5) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold">{stats.safetyScore.toFixed(1)}/5</span>
              </div>
            </div>

            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10">
              <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                  <Megaphone className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold">Sincronia Cultural</p>
                  <p className="text-[9px] sm:text-[10px] text-secondary">Alinhamento entre discurso e prática</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(stats.culturalSyncScore / 5) * 100}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary"
                  />
                </div>
                <span className="text-xs sm:text-sm font-bold">{stats.culturalSyncScore.toFixed(1)}/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div ref={personalityRef} className="lg:col-span-1 glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style">Personalidade</h3>
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
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Canal de Elogio</p>
            </div>
            <p className="text-xs leading-relaxed">
              <span className="font-black text-primary">{stats.elogioInterest.toFixed(0)}%</span> dos colaboradores gostariam de um canal oficial para elogios públicos.
            </p>
          </div>
        </div>

        <div ref={valuePerceptionRef} className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style">Percepção de Valor (Propósito)</h3>
            <ExportButton targetRef={valuePerceptionRef} fileName="percepcao-valor" />
          </div>
          <div className="space-y-4">
            {stats.valuePerceptionRanking.map((item, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-2xl bg-on-surface/5 border border-outline-variant/10">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold leading-tight">"{item.phrase}"</p>
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

      <div ref={testimonialsRef} className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
        <div className="flex justify-between items-start mb-8 sm:mb-12 relative">
          <div>
            <h3 className="text-variant-style">Voz do Colaborador</h3>
            <p className="text-xs sm:text-sm text-secondary">O que se diz honestamente nos primeiros 10 segundos</p>
          </div>
          <ExportButton targetRef={testimonialsRef} fileName="testemunhos-colaboradores" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {stats.testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={cn(
                "p-6 sm:p-8 rounded-[2rem] relative flex flex-col justify-between min-h-[200px] transition-all hover:scale-[1.02]",
                i % 3 === 0 ? "bg-[#1A181A] text-white" : 
                i % 3 === 1 ? "bg-primary/5 border border-primary/10" : 
                "bg-on-surface/5 border border-outline-variant/10"
              )}
            >
              <Zap className={cn(
                "absolute top-6 right-6 w-5 h-5",
                i % 3 === 0 ? "text-primary/40" : "text-primary/20"
              )} />
              
              <div className="relative">
                <span className={cn(
                  "text-4xl font-serif absolute -top-4 -left-2 opacity-20",
                  i % 3 === 0 ? "text-white" : "text-primary"
                )}>"</span>
                <p className="text-sm sm:text-base italic leading-relaxed relative z-10 mb-6">
                  {t.text}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                <div className={cn(
                  "w-10 h-10 rounded-2xl flex items-center justify-center text-xs font-black",
                  i % 3 === 0 ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
                )}>
                  {t.role.charAt(0)}
                </div>
                <div>
                  <p className={cn(
                    "text-[10px] font-black uppercase tracking-[0.2em]",
                    i % 3 === 0 ? "text-primary" : "text-on-surface"
                  )}>Colaborador</p>
                  <p className={cn(
                    "text-[10px] font-bold uppercase tracking-wider",
                    i % 3 === 0 ? "text-white/60" : "text-secondary"
                  )}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
