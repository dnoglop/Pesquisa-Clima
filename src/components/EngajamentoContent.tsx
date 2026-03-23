import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { Users, Heart, Star, TrendingUp, CheckCircle2, Award, GraduationCap, Brain, History } from 'lucide-react';
import { motion } from 'motion/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { cn } from '../lib/utils';
import { InfoTooltip } from './ui/Tooltip';
import { ExportButton } from './ui/ExportButton';

interface EngajamentoContentProps {
  stats: DashboardStats;
}

const ENGAJAMENTO_DESCRIPTIONS = {
  enps: "Employee Net Promoter Score. Mede a lealdade dos colaboradores. Calculado como % de Promotores (9-10) menos % de Detratores (0-6).",
  bemEstar: "Percentual de colaboradores que praticam exercícios físicos regularmente, um indicador chave de saúde e equilíbrio.",
  mentoria: "Interesse em participar de programas de mentoria (ensinar ou aprender). Reflete a cultura de compartilhamento de conhecimento.",
  ia: "Percentual de colaboradores que utilizam IA (Gemini, ChatGPT) diariamente ou algumas vezes por semana em suas tarefas."
};

export function EngajamentoContent({ stats }: EngajamentoContentProps) {
  const enpsDistRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const areaEngagementRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<HTMLDivElement>(null);
  const perceptionRef = useRef<HTMLDivElement>(null);

  const enpsData = [
    { name: 'Promotores', value: stats.enpsDistribution.promoters, color: '#049C7A' },
    { name: 'Passivos', value: stats.enpsDistribution.passives, color: '#312D31' },
    { name: 'Detratores', value: stats.enpsDistribution.detractors, color: '#E84F3D' },
  ];

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          label="eNPS Geral"
          value={stats.enpsScore.toFixed(1)}
          subValue="Média de recomendação"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.enps}
        />
        <StatCard 
          icon={<Heart className="w-5 h-5 text-primary" />}
          label="Bem-estar"
          value={`${stats.habits.exercise.toFixed(0)}%`}
          subValue="Praticam exercícios"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.bemEstar}
        />
        <StatCard 
          icon={<Star className="w-5 h-5 text-primary" />}
          label="Mentoria"
          value={`${stats.mentorshipInterest.toFixed(0)}%`}
          subValue="Interesse em participar"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.mentoria}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Engajamento IA"
          value={`${stats.iaUsageHigh.toFixed(0)}%`}
          subValue="Uso frequente"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.ia}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div ref={enpsDistRef} className="lg:col-span-2 glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Distribuição de eNPS</h3>
              <p className="text-[10px] sm:text-xs text-secondary">Promotores vs Detratores</p>
            </div>
            <ExportButton targetRef={enpsDistRef} fileName="distribuicao-enps" />
          </div>
          
          <div className="flex flex-col gap-6 sm:gap-8 items-center">
            <div className="h-48 sm:h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={enpsData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                  >
                    {enpsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: 'none', borderRadius: '12px', fontSize: '10px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: 'var(--on-surface)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[8px] sm:text-[10px] font-bold text-secondary uppercase tracking-widest">Score</span>
                <span className="text-2xl sm:text-4xl font-extrabold text-primary">{stats.enpsScore.toFixed(1)}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 w-full">
              {enpsData.map((item) => (
                <div key={item.name} className="flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/5 hover:border-primary/20 transition-all text-center">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full shadow-sm mb-2 sm:mb-3" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-secondary mb-1">{item.name}</span>
                  <p className="text-lg sm:text-2xl font-extrabold text-on-surface">{item.value.toFixed(1)}%</p>
                  <div className="mt-2 px-2 py-0.5 rounded-full bg-primary/10">
                    <span className="text-[8px] sm:text-[9px] font-bold text-primary uppercase tracking-tighter">Peso: {item.name === 'Promotores' ? '+1' : item.name === 'Passivos' ? '0' : '-1'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div ref={actionsRef} className="lg:col-span-1 glass-card p-6 sm:p-8 rounded-3xl relative bg-[#F27D26]/10 border-[#F27D26]/20">
          <div className="flex justify-between items-start mb-4 sm:mb-6">
            <h3 className="text-variant-style text-[#F27D26]">Ações Prioritárias</h3>
            <ExportButton targetRef={actionsRef} fileName="acoes-prioritarias" />
          </div>
          <div className="space-y-2 sm:space-y-3">
            {stats.priorityActions.map((action, index) => (
              <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-white/40 border border-[#F27D26]/10 hover:bg-white/60 transition-all">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#F27D26] text-white flex items-center justify-center shrink-0 text-[10px] sm:text-xs font-bold shadow-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-bold leading-tight text-on-surface">{action.action}</p>
                  <p className="text-[8px] sm:text-[10px] font-bold text-[#F27D26] uppercase mt-1">{action.count} votos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div ref={areaEngagementRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <h3 className="text-variant-style">Engajamento por Área</h3>
            <ExportButton targetRef={areaEngagementRef} fileName="engajamento-por-area" />
          </div>
          <div className="space-y-4 sm:space-y-6">
            {stats.areaEngagement.map((area, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-xs sm:text-sm">
                  <span className="font-medium">{area.area}</span>
                  <span className="text-primary font-bold">{area.score.toFixed(1)}</span>
                </div>
                <div className="h-2 bg-on-surface/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(area.score / 10) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div ref={recognitionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <h3 className="text-variant-style">Preferências de Reconhecimento</h3>
            <ExportButton targetRef={recognitionRef} fileName="preferencias-reconhecimento" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {stats.recognitionPreferences.map((pref, index) => (
              <div key={index} className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-on-surface/5 border border-outline-variant/10 flex flex-col items-center text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                </div>
                <p className="text-xs sm:text-sm font-bold mb-1">{pref.type}</p>
                <p className="text-xl sm:text-2xl font-extrabold text-primary">{pref.percentage.toFixed(0)}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, tooltip }: { icon: React.ReactNode, label: string, value: string, subValue: string, tooltip?: string }) {
  return (
    <div className="glass-card p-6 rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-all group">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-3 rounded-2xl bg-on-surface/5 group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">{label}</p>
            {tooltip && <InfoTooltip content={tooltip} />}
          </div>
          <p className="text-2xl font-extrabold font-sora">{value}</p>
        </div>
      </div>
      <p className="text-[10px] text-secondary">{subValue}</p>
    </div>
  );
}
