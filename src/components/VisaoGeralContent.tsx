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
          <div className="space-y-4">
            {stats.personalityTraits.map((trait, index) => (
              <div key={trait.trait} className="space-y-1">
                <div className="flex justify-between text-xs sm:text-sm font-bold">
                  <span>{trait.trait}</span>
                  <span>{trait.percentage.toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-on-surface/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${trait.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
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
          <div className="space-y-4">
            {stats.infoSources.map((source, index) => {
              const total = stats.infoSources.reduce((acc, curr) => acc + curr.count, 0);
              const percentage = (source.count / total) * 100;
              return (
                <div key={source.source} className="space-y-1">
                  <div className="flex justify-between text-xs sm:text-sm font-bold">
                    <span>{source.source}</span>
                    <span>{percentage.toFixed(0)}%</span>
                  </div>
                  <div className="h-2 bg-on-surface/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div ref={valuePerceptionRef} className="glass-card p-6 sm:p-8 rounded-3xl relative">
        <div className="flex justify-between items-start mb-6 sm:mb-8">
          <h3 className="text-variant-style">Percepção de Valor</h3>
          <ExportButton targetRef={valuePerceptionRef} fileName="percepcao-valor" />
        </div>
        <div className="h-12 w-full flex rounded-lg overflow-hidden">
          {stats.valuePerceptionRanking.map((item, index) => {
            const total = stats.valuePerceptionRanking.reduce((acc, curr) => acc + curr.count, 0);
            const percentage = (item.count / total) * 100;
            return (
              <div 
                key={item.phrase} 
                style={{ 
                  width: `${percentage}%`,
                  backgroundColor: index === 0 ? '#049C7A' : index === 1 ? '#F27D26' : '#E84F3D'
                }}
                title={`${item.phrase}: ${percentage.toFixed(0)}%`}
              />
            );
          })}
        </div>
        <div className="mt-6 space-y-2">
          {stats.valuePerceptionRanking.map((item, index) => (
            <div key={item.phrase} className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: index === 0 ? '#049C7A' : index === 1 ? '#F27D26' : '#E84F3D' }}></div>
              <span className="text-secondary">{item.phrase}</span>
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
          <p className="text-2xl font-extrabold font-sora">{value}</p>
        </div>
      </div>
      <p className="text-[10px] text-secondary">{subValue}</p>
    </div>
  );
}
