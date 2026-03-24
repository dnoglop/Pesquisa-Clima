import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { motion } from 'motion/react';
import { PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, BarChart, Bar } from 'recharts';
import { Target, Users, Shield, Verified } from 'lucide-react';
import { InfoTooltip } from './ui/Tooltip';
import { ExportButton } from './ui/ExportButton';
import { cn } from '../lib/utils';

interface VisaoGeralContentProps {
  stats: DashboardStats;
}

const METRIC_DESCRIPTIONS = {
  identificacao: "Mede o quanto os colaboradores conhecem e se sentem alinhados com os 5 pilares da Consistem. Calculado pela média das respostas de 1 a 10.",
  lideranca: "Avalia se as lideranças são vistas como embaixadoras da marca. Baseado na percepção de exemplo prático dos gestores.",
  seguranca: "O 'espaço seguro' para admitir erros sem julgamento pessoal. Essencial para inovação e aprendizado contínuo.",
  reconhecimento: "Sentimento de que o esforço diário é valorizado pela empresa. Reflete a eficácia das políticas de feedback e elogio."
};

export function VisaoGeralContent({ stats }: VisaoGeralContentProps) {
  const enpsRef = useRef<HTMLDivElement>(null);
  const distributionRef = useRef<HTMLDivElement>(null);
  const healthRef = useRef<HTMLDivElement>(null);
  const infoSourcesRef = useRef<HTMLDivElement>(null);

  const enpsZone = stats.enpsScore >= 75 ? 'ZONA DE EXCELÊNCIA' : 
                   stats.enpsScore >= 50 ? 'ZONA DE QUALIDADE' : 
                   stats.enpsScore >= 0 ? 'ZONA DE APERFEIÇOAMENTO' : 'ZONA CRÍTICA';

  const enpsDistributionData = [
    { name: 'Promotores', value: stats.enpsDistribution.promoters, fill: '#049C7A' },
    { name: 'Passivos', value: stats.enpsDistribution.passives, fill: '#312D31' },
    { name: 'Detratores', value: stats.enpsDistribution.detractors, fill: '#E84F3D' }
  ];

  const enpsData = [
    { name: 'Score', value: Math.max(0, stats.enpsScore), fill: '#E84F3D' },
    { name: 'Rest', value: 100 - Math.max(0, stats.enpsScore), fill: '#312D31' }
  ];

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Identificação"
          value={stats.identificationScore.toFixed(1)}
          subValue="Com os pilares"
          tooltip={METRIC_DESCRIPTIONS.identificacao}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Liderança"
          value={stats.leadershipScore.toFixed(1)}
          subValue="Como embaixadora"
          tooltip={METRIC_DESCRIPTIONS.lideranca}
        />
        <StatCard 
          icon={<Shield className="w-5 h-5 text-primary" />}
          label="Segurança"
          value={stats.safetyScore.toFixed(1)}
          subValue="Espaço para erro"
          tooltip={METRIC_DESCRIPTIONS.seguranca}
        />
        <StatCard 
          icon={<Verified className="w-5 h-5 text-white" />}
          label="Respostas"
          value={stats.totalResponses.toString()}
          subValue="Total de envios"
          highlight
          tooltip="Quantidade total de formulários respondidos e processados."
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* eNPS Distribuição */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold">Distribuição eNPS</h3>
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enpsDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {enpsDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1A181A', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-on-surface">{stats.enpsScore.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mt-1">Score eNPS</span>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            {enpsDistributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-secondary uppercase">{item.name}</span>
                </div>
                <span>{item.value.toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* eNPS Geral / NPS Total */}
        <div ref={enpsRef} className="glass-card p-6 sm:p-8 rounded-3xl relative bg-[#1A181A] text-white">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-center w-full">NPS Total</h3>
            <ExportButton targetRef={enpsRef} fileName="enps-geral" />
          </div>
          <div className="h-48 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enpsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  startAngle={225}
                  endAngle={-45}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {enpsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black">{stats.enpsScore.toFixed(0)}</span>
              <span className="text-[10px] font-bold text-[#E84F3D] uppercase tracking-widest mt-1">{enpsZone}</span>
            </div>
          </div>
          <p className="text-[10px] text-center text-secondary mt-4 px-4 italic">
            "O quanto você recomendaria a Consistem como um bom lugar para se trabalhar?"
          </p>
        </div>

        {/* Distribuição por Área */}
        <div ref={distributionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-variant-style">Distribuição por Área</h3>
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
            <h3 className="text-variant-style">Saúde & Bem-estar</h3>
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
                  <p className="text-xs font-bold">Praticam Exercícios</p>
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
              <h3 className="text-variant-style">Fontes de Informação</h3>
              <p className="text-xs sm:text-sm text-secondary">Canais diários</p>
            </div>
            <ExportButton targetRef={infoSourcesRef} fileName="fontes-informacao" />
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={stats.infoSources.map(s => ({
                  name: s.source.toUpperCase(),
                  percentage: (s.count / stats.totalResponses) * 100
                }))}
                margin={{ top: 20, right: 10, left: -20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 8, fontWeight: 700, fill: 'var(--secondary)' }}
                  interval={0}
                />
                <YAxis hide />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: '#1A181A', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '10px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value: number) => [`${value.toFixed(0)}%`, 'Uso']}
                />
                <Bar 
                  dataKey="percentage" 
                  fill="#1A181A" 
                  radius={[4, 4, 0, 0]} 
                  barSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
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
