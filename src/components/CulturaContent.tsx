import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { Megaphone, Shield, Users, Target, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExportButton } from './ui/ExportButton';

interface CulturaContentProps {
  stats: DashboardStats;
}

export function CulturaContent({ stats }: CulturaContentProps) {
  const leadershipRef = useRef<HTMLDivElement>(null);
  const psychologicalSafetyRef = useRef<HTMLDivElement>(null);
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
            <h3 className="text-variant-style">Segurança Psicológica</h3>
            <ExportButton targetRef={psychologicalSafetyRef} fileName="seguranca-psicologica" />
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
                  <div className="h-full bg-primary w-[82%]"></div>
                </div>
                <span className="text-xs sm:text-sm font-bold">8.2/10</span>
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
                  <div className="h-full bg-primary w-[75%]"></div>
                </div>
                <span className="text-xs sm:text-sm font-bold">7.5/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={testimonialsRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
        <div className="flex justify-between items-start mb-6 sm:mb-8">
          <h3 className="text-variant-style">Voz do Colaborador (Testemunhos)</h3>
          <ExportButton targetRef={testimonialsRef} fileName="testemunhos-colaboradores" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {stats.testimonials.map((t, i) => (
            <div key={i} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10 relative">
              <Zap className="absolute top-4 right-4 sm:top-6 sm:right-6 w-3 h-3 sm:w-4 sm:h-4 text-primary/20" />
              <p className="text-xs sm:text-sm italic leading-relaxed mb-3 sm:mb-4">"{t.text}"</p>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-primary">
                  {t.role.charAt(0)}
                </div>
                <div>
                  <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">Colaborador</p>
                  <p className="text-[8px] sm:text-[10px] text-secondary">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
