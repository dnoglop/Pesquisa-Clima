import React, { useRef } from 'react';
import { DashboardStats } from '../types';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, Users, Shield, Verified } from 'lucide-react';
import { InfoTooltip } from './ui/Tooltip';
import { ExportButton } from './ui/ExportButton';

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
  const personalityRef = useRef<HTMLDivElement>(null);
  const infoSourcesRef = useRef<HTMLDivElement>(null);
  const valuePerceptionRef = useRef<HTMLDivElement>(null);

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<Target className="w-5 h-5 text-primary" />}
          label="Identificação"
          value="8.7"
          subValue="Com os pilares"
          tooltip={METRIC_DESCRIPTIONS.identificacao}
        />
        <StatCard 
          icon={<Users className="w-5 h-5 text-primary" />}
          label="Liderança"
          value="7.9"
          subValue="Como embaixadora"
          tooltip={METRIC_DESCRIPTIONS.lideranca}
        />
        <StatCard 
          icon={<Shield className="w-5 h-5 text-primary" />}
          label="Segurança"
          value="8.2"
          subValue="Espaço para erro"
          tooltip={METRIC_DESCRIPTIONS.seguranca}
        />
        <StatCard 
          icon={<Verified className="w-5 h-5 text-primary" />}
          label="Reconhecimento"
          value="7.5"
          subValue="Sentimento de valor"
          tooltip={METRIC_DESCRIPTIONS.reconhecimento}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div ref={personalityRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Personalidade da Consistem</h3>
              <p className="text-xs sm:text-sm text-secondary">Adjetivos mais citados</p>
            </div>
            <ExportButton targetRef={personalityRef} fileName="personalidade-consistem" />
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {stats.personalityTraits.map((trait, index) => (
              <motion.div 
                key={trait.trait}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="px-4 py-2 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-on-surface/5 border border-outline-variant/10 flex items-center gap-2 sm:gap-3"
              >
                <span className="text-xs sm:text-sm font-bold">{trait.trait}</span>
                <span className="text-[10px] sm:text-xs text-primary font-extrabold">{trait.percentage.toFixed(0)}%</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div ref={infoSourcesRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
          <div className="flex justify-between items-start mb-6 sm:mb-8">
            <div>
              <h3 className="text-variant-style">Fontes de Informação</h3>
              <p className="text-xs sm:text-sm text-secondary">Canais diários</p>
            </div>
            <ExportButton targetRef={infoSourcesRef} fileName="fontes-informacao" />
          </div>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.infoSources} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--outline-variant)" opacity={0.1} horizontal={false} />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="source" 
                  type="category" 
                  width={80} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fontSize: 9, fontWeight: 600, fill: 'var(--on-surface)' }}
                />
                <RechartsTooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ backgroundColor: 'var(--surface)', border: 'none', borderRadius: '12px', fontSize: '10px' }}
                />
                <Bar dataKey="count" fill="var(--color-primary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div ref={valuePerceptionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
        <div className="flex justify-between items-start mb-6 sm:mb-8">
          <h3 className="text-variant-style">Percepção de Valor</h3>
          <ExportButton targetRef={valuePerceptionRef} fileName="percepcao-valor" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-primary/10 border border-primary/20">
            <h4 className="text-base sm:text-lg font-bold mb-3 sm:mb-4">O que fazemos aqui hoje?</h4>
            <p className="text-xs sm:text-sm leading-relaxed text-on-surface/80 italic">
              "A maioria dos colaboradores percebe a Consistem como uma empresa que gera valor através da tecnologia e do compromisso com o cliente."
            </p>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-on-surface/5">
              <span className="text-xs sm:text-sm font-medium">Foco no Cliente</span>
              <span className="text-xs sm:text-sm font-bold text-primary">85%</span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-on-surface/5">
              <span className="text-xs sm:text-sm font-medium">Inovação Tecnológica</span>
              <span className="text-xs sm:text-sm font-bold text-primary">72%</span>
            </div>
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-on-surface/5">
              <span className="text-xs sm:text-sm font-medium">Comprometimento</span>
              <span className="text-xs sm:text-sm font-bold text-primary">91%</span>
            </div>
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
