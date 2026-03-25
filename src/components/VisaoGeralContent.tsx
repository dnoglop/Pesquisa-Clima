import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { motion } from 'motion/react';
import { PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { Target, Users, Shield, Verified, Award, TrendingUp } from 'lucide-react';
import { InfoTooltip } from './ui/Tooltip';
import { ExportButton } from './ui/ExportButton';
import { cn } from '../lib/utils';

interface VisaoGeralContentProps {
  stats: DashboardStats;
}

const METRIC_DESCRIPTIONS = {
  identificacao: "Mede o alinhamento com os 5 pilares da Consistem.",
  lideranca: "Avalia se as lideranças são vistas como embaixadoras da marca.",
  seguranca: "O 'espaço seguro' no time para admitir erros sem julgamento.",
  reconhecimento: "Sentimento de valorização das suas entregas.",
};

export function VisaoGeralContent({ stats }: VisaoGeralContentProps) {
  const enpsRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<HTMLDivElement>(null);
  const infoSourcesRef = useRef<HTMLDivElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  const enpsZone = stats.enpsScore >= 85 ? 'ZONA DE EXCELÊNCIA' : 
                   stats.enpsScore >= 70 ? 'ZONA DE QUALIDADE' : 
                   stats.enpsScore >= 50 ? 'ZONA DE MELHORIA' : 'ZONA CRÍTICA';

  const enpsDistributionData = [
    { name: 'Promotores', value: stats.enpsDistribution.promoters, fill: '#049C7A' },
    { name: 'Passivos', value: stats.enpsDistribution.passives, fill: '#F27D26' },
    { name: 'Detratores', value: stats.enpsDistribution.detractors, fill: '#E84F3D' }
  ];

  const enpsData = [
    { name: 'Score', value: Math.max(0, stats.enpsScore), fill: '#E84F3D' },
    { name: 'Rest', value: 100 - Math.max(0, stats.enpsScore), fill: '#F27D26' }
  ];

  return (
    <div className="p-4 mt-5 space-y-4 max-full mx-[30px]">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <StatCard 
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Identificação"
          value={`${stats.identificationScore.toFixed(0)}%`}
          subValue="dos Consisters identificam os pilares no dia a dia"
          tooltip={METRIC_DESCRIPTIONS.identificacao}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Liderança"
          value={`${stats.leadershipScore.toFixed(0)}%`}
          subValue="dos Consisters olham suas lideranças como embaixadora"
          tooltip={METRIC_DESCRIPTIONS.lideranca}
        />
        <StatCard 
          icon={<Shield className="w-5 h-5 text-primary" />}
          label="Segurança"
          value={`${stats.safetyScore.toFixed(0)}%`}
          subValue="dos Consisters sentem segurança dentro do time"
          tooltip={METRIC_DESCRIPTIONS.seguranca}
        />
        <StatCard 
          icon={<Award className="w-5 h-5 text-primary" />}
          label="Reconhecimento"
          value={`${stats.recognitionScore.toFixed(0)}%`}
          subValue="dos Consisters sentem que são valorizados"
          tooltip={METRIC_DESCRIPTIONS.reconhecimento}
        />
        <StatCard 
          icon={<Verified className="w-5 h-5 text-white" />}
          label="Respostas"
          value={stats.totalResponses.toString()}
          subValue="Quantidade de respostas da pesquisa"
          highlight
          tooltip="Quantidade total de formulários respondidos e analisados."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* eNPS Distribuição */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-variant-style">Distribuição eNPS</h3>
              <p className="text-xs text-secondary">Como as notas estão distribuidas</p>
            </div>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enpsDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={85}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={6}
                >
                  {enpsDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(26, 24, 26, 0.95)', border: 'none', borderRadius: '16px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-on-surface leading-none">{stats.enpsScore.toFixed(0)}%</span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-2">Média NPS</span>
            </div>
          </div>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {enpsDistributionData.map((item) => (
              <div key={item.name} className="flex flex-col items-center p-2 rounded-2xl bg-on-surface/5 border border-outline-variant/5">
                <span className="text-[8px] font-bold text-secondary uppercase tracking-wider mb-1">{item.name}</span>
                <span className="text-sm font-black" style={{ color: item.fill }}>{item.value.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* eNPS Geral / NPS Total */}
        <div ref={enpsRef} className="glass-card p-6 sm:p-8 rounded-3xl relative overflow-hidden group mb-[15px]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
          <div className="flex justify-between items-start mb-4 relative z-10">
            <h3 className="text-variant-style text-center w-full">NPS total</h3>
            <div className="absolute right-0">
              <ExportButton targetRef={enpsRef} fileName="enps-geral" />
            </div>
          </div>
          <div className="h-56 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Score', value: stats.enpsScore, fill: stats.enpsScore >= 85 ? '#049C7A' : stats.enpsScore >= 70 ? '#F27D26' : '#E84F3D' },
                    { name: 'Rest', value: 100 - stats.enpsScore, fill: 'rgba(0,0,0,0.05)' }
                  ]}
                  cx="50%"
                  cy="65%"
                  innerRadius={75}
                  outerRadius={95}
                  startAngle={210}
                  endAngle={-30}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={10}
                >
                  <Cell fill={stats.enpsScore >= 85 ? '#049C7A' : stats.enpsScore >= 70 ? '#F27D26' : '#E84F3D'} />
                  <Cell fill="rgba(0,0,0,0.05)" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
              <span className="text-4xl font-black text-on-surface leading-none drop-shadow-sm">
                {stats.enpsScore.toFixed(0)}%
              </span>
              <div className={cn(
                "mt-3 px-4 py-1 text-[10px] font-black tracking-widest uppercase",
                stats.enpsScore >= 85 ? "text-[#049C7A]" : 
                stats.enpsScore >= 70 ? "text-[#F27D26]" : "text-[#E84F3D]"
              )}>
                {enpsZone}
              </div>
            </div>
          </div>
          <div className="relative z-10 text-center">
            <p className="text-[14px] text-secondary px-4 italic leading-relaxed max-w-[3600px] mx-auto">
              "O quanto você recomendaria a Consistem como um bom lugar para se trabalhar?"
            </p>
          </div>
        </div>

        {/* Distribuição por Área */}
        <div ref={distributionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative mt-[15px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-variant-style">Distribuição por área</h3>
              <p className="text-xs text-secondary">Onde nossos talentos atuam hoje</p>
            </div>
            <ExportButton targetRef={distributionRef} fileName="distribuicao-area" />
          </div>
          <div className="space-y-4">
            {stats.areaDistribution.slice(0, 4).map((area, index) => {
              return (
                <div key={area.area} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="truncate max-w-[120px]">{area.area}</span>
                    <span>{area.percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-1.5 bg-on-surface/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${area.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-[#1A181A]"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Saúde & Bem-estar */}
        <div ref={healthRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-variant-style">Saúde & Bem-estar</h3>
              <p className="text-xs text-secondary">Prática de exercícios entre os Consisters</p>
            </div>
            <ExportButton targetRef={healthRef} fileName="saude-bem-estar" />
          </div>
          <div className="flex items-center gap-8">
            <div className="h-40 w-40 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Ativos', value: stats.habits.exercise, fill: '#049C7A' },
                      { name: 'Sedentários', value: 100 - stats.habits.exercise, fill: '#F5F5F5' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={0}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill="#049C7A" />
                    <Cell fill="#F5F5F5" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-2xl font-black">{stats.habits.exercise.toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#049C7A]"></div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase">Ativos</p>
                  <p className="text-xs font-bold">Praticam exercícios</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-[#F5F5F5] border border-outline-variant/20"></div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase">Sedentários</p>
                  <p className="text-xs font-bold">Não praticam</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fontes de Informação */}
        <div ref={infoSourcesRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Fontes de informação</h3>
              <p className="text-xs text-secondary">Canais diários</p>
            </div>
            <ExportButton targetRef={infoSourcesRef} fileName="fontes-informacao" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={stats.infoSources.map((s, i) => ({
                    name: s.source,
                    shortName: `S${i + 1}`,
                    percentage: (s.count / stats.totalResponses) * 100,
                    fill: i === 0 ? '#E84F3D' : i === 1 ? '#049C7A' : i === 2 ? '#F27D26' : '#312D31'
                  }))}
                  margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="barGradient0" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E84F3D" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#E84F3D" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="barGradient1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#049C7A" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#049C7A" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="barGradient2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F27D26" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#F27D26" stopOpacity={0.6}/>
                    </linearGradient>
                    <linearGradient id="barGradient3" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#312D31" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#312D31" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis 
                    dataKey="shortName" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fontWeight: 800, fill: 'var(--secondary)' }}
                  />
                  <YAxis hide />
                  <RechartsTooltip 
                    cursor={{ fill: 'rgba(0,0,0,0.02)' }}
                    contentStyle={{ backgroundColor: '#1A181A', border: 'none', borderRadius: '16px', color: '#fff', fontSize: '10px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value: number, name: string, props: any) => [`${value.toFixed(0)}%`, props.payload.name]}
                  />
                  <Bar 
                    dataKey="percentage" 
                    radius={[6, 6, 0, 0]} 
                    barSize={32}
                  >
                    {stats.infoSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={`url(#barGradient${index % 4})`} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] font-black text-secondary uppercase tracking-widest mb-4">Legenda de Canais</p>
              {stats.infoSources.map((s, i) => (
                <div key={i} className="flex items-start gap-3 group">
                  <div 
                    className="w-2.5 h-2.5 rounded-full mt-1 shrink-0 shadow-sm" 
                    style={{ backgroundColor: i === 0 ? '#E84F3D' : i === 1 ? '#049C7A' : i === 2 ? '#F27D26' : '#312D31' }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">
                      {s.source}
                    </p>
                    <p className="text-[9px] text-secondary font-medium uppercase tracking-tighter">
                      {((s.count / stats.totalResponses) * 100).toFixed(0)}% dos respondentes
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, subValue, tooltip, highlight }: { icon: React.ReactNode, label: string, value: string, subValue: string, tooltip?: string, highlight?: boolean }) {
  return (
    <div className={cn(
      "p-6 rounded-3xl border transition-all group relative overflow-hidden",
      highlight 
        ? "bg-tertiary border-tertiary shadow-xl shadow-tertiary/20 text-white" 
        : "glass-card border-outline-variant/10 hover:border-primary/30"
    )}>
      {highlight && (
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
      )}
      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className={cn(
          "p-3 rounded-2xl transition-colors",
          highlight ? "bg-white/20" : "bg-on-surface/5 group-hover:bg-primary/10"
        )}>
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <p className={cn(
              "text-[10px] font-bold uppercase tracking-widest",
              highlight ? "text-white/90" : "text-secondary"
            )}>{label}</p>
            {tooltip && <InfoTooltip content={tooltip} variant={highlight ? 'light' : 'dark'} />}
          </div>
          <p className={cn(
            "text-3xl font-black font-sora",
            highlight ? "text-white" : "text-on-surface"
          )}>{value}</p>
        </div>
      </div>
      <p className={cn(
        "text-[10px] relative z-10",
        highlight ? "text-white/70" : "text-secondary"
      )}>{subValue}</p>
    </div>
  );
}
