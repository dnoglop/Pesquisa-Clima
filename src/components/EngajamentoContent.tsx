import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { Users, Heart, Star, TrendingUp, CheckCircle2, Award, GraduationCap, Brain, History } from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
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
  const actionsRef = useRef<HTMLDivElement>(null);
  const areaEngagementRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<HTMLDivElement>(null);

  const iaRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<TrendingUp className="w-5 h-5 text-primary" />}
          label="eNPS Geral"
          value={stats.enpsScore.toFixed(1)}
          subValue="nota de indicação da Consistem"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.enps}
        />
        <StatCard 
          icon={<Heart className="w-5 h-5 text-primary" />}
          label="Bem-estar"
          value={`${stats.habits.exercise.toFixed(0)}%`}
          subValue="taxa de Consisters que praticam atividades"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.bemEstar}
        />
        <StatCard 
          icon={<GraduationCap className="w-5 h-5 text-primary" />}
          label="Mentoria"
          value={`${stats.mentorshipInterest.toFixed(0)}%`}
          subValue="quantidade de interessados em participar"
          tooltip={ENGAJAMENTO_DESCRIPTIONS.mentoria}
        />
        <StatCard 
          icon={<History className="w-5 h-5 text-primary" />}
          label="Legado"
          value={stats.legacyMotivation.toFixed(1)}
          subValue="quantidade de pessoas que apoiam partilhar"
          tooltip="Média de motivação para documentar e partilhar conhecimentos (0-5)."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Coluna 1: IA */}
        <div ref={iaRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-variant-style">Engajamento em IA</h3>
              <p className="text-[10px] text-secondary">utilização diária por área</p>
            </div>
            <Brain className="w-5 h-5 text-primary/20" />
          </div>
          <div className="space-y-4">
            {stats.iaUsageByArea.slice(0, 5).map((area, index) => (
              <div key={index} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                  <span className="truncate max-w-[100px]">{area.area}</span>
                  <span className="text-primary">{area.percentage.toFixed(0)}%</span>
                </div>
                <div className="h-1.5 bg-on-surface/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${area.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/10 text-center">
            <span className="text-4xl font-black text-on-surface">{stats.iaUsageHigh.toFixed(0)}%</span>
            <p className="text-[9px] font-bold text-secondary uppercase tracking-widest mt-1">Adoção Geral de IA</p>
          </div>
        </div>

        {/* Coluna 2: Reconhecimento */}
        <div ref={recognitionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style">Reconhecimento</h3>
            <Award className="w-5 h-5 text-primary/20" />
          </div>
          <div className="bg-on-surface/5 rounded-2xl p-6 mb-6 text-center">
            <p className="text-4xl font-black text-[#E84F3D] mb-1">{stats.recognitionScore.toFixed(1)}</p>
            <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Média de Valorização</p>
          </div>
          <div className="space-y-3">
            <p className="text-[9px] font-bold text-secondary uppercase tracking-widest">Preferências</p>
            <div className="flex flex-wrap gap-2">
              {stats.recognitionPreferences.map((pref, index) => (
                <div key={index} className="px-3 py-1.5 rounded-xl bg-on-surface/5 text-[10px] font-bold border border-outline-variant/10">
                  {pref.type}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Coluna 3: Ações Prioritárias */}
        <div ref={actionsRef} className="glass-card p-6 sm:p-8 rounded-3xl relative bg-[#F27D26]/5 border-[#F27D26]/10">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-variant-style text-[#F27D26]">Prioridades</h3>
            <TrendingUp className="w-5 h-5 text-[#F27D26]/20" />
          </div>
          <div className="space-y-3">
            {stats.priorityActions.slice(0, 4).map((action, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white/50 border border-[#F27D26]/5">
                <div className="w-6 h-6 rounded-full bg-[#F27D26] text-white flex items-center justify-center shrink-0 text-[10px] font-bold">
                  {index + 1}
                </div>
                <p className="text-[11px] font-bold leading-tight text-on-surface line-clamp-2">{action.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Engajamento por Área - Full Width */}
      <div ref={areaEngagementRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-variant-style">Engajamento por Área (eNPS)</h3>
            <p className="text-xs text-secondary">Comparativo de lealdade entre os grupos</p>
          </div>
          <ExportButton targetRef={areaEngagementRef} fileName="engajamento-por-area" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
          {stats.areaEngagement.map((area, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider">
                <span>{area.area}</span>
                <span className="text-primary">{area.score.toFixed(1)}</span>
              </div>
              <div className="h-1.5 bg-on-surface/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(area.score / 10) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.05 }}
                  className="h-full bg-primary"
                />
              </div>
            </div>
          ))}
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
          <p className="text-3xl font-extrabold font-sora">{value}</p>
        </div>
      </div>
      <p className="text-[10px] text-secondary">{subValue}</p>
    </div>
  );
}
