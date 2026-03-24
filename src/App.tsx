import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EngajamentoContent } from './components/EngajamentoContent';
import { VisaoGeralContent } from './components/VisaoGeralContent';
import { CulturaContent } from './components/CulturaContent';
import { ComparativoContent } from './components/ComparativoContent';
import { HeatmapContent } from './components/HeatmapContent';
import { FeedbackContent } from './components/FeedbackContent';
import { DashboardSkeleton } from './components/skeletons/DashboardSkeleton';
import { fetchSurveyData, processStats } from './services/dataService';
import { DashboardStats } from './types';
import { Loader2 } from 'lucide-react';
import { cn } from './lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState('geral');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [rawData, setRawData] = useState<any[]>([]);

  const loadData = async () => {
    setLoading(true);
    setShowSkeleton(false);
    try {
      const data = await fetchSurveyData();
      setRawData(data);
      const processed = processStats(data, 'Todas', startDate, endDate);
      setStats(processed);
    } catch (error) {
      console.error('Error loading survey data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => {
        setShowSkeleton(true);
      }, 2000);
    } else {
      setShowSkeleton(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    if (rawData.length > 0) {
      const processed = processStats(rawData, 'Todas', startDate, endDate);
      setStats(processed);
    }
  }, [rawData, startDate, endDate]);

  if (loading && !stats) {
    return showSkeleton ? (
      <DashboardSkeleton />
    ) : (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-primary">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }
  

  return (
    <div className="light">
      <div className="min-h-screen bg-background text-on-surface transition-colors duration-300">
        <Header 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          startDate={startDate}
          onStartDateChange={setStartDate}
          endDate={endDate}
          onEndDateChange={setEndDate}
          onRefresh={loadData}
          isRefreshing={loading}
        />
        
        <main className="flex-1 flex flex-col min-h-screen pt-14 sm:pt-20">
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'geral' && stats && <VisaoGeralContent stats={stats} />}
            {activeTab === 'engajamento' && stats && <EngajamentoContent stats={stats} />}
            {activeTab === 'cultura' && stats && <CulturaContent stats={stats} />}
            {activeTab === 'comparativo' && stats && <ComparativoContent stats={stats} />}
            {activeTab === 'heatmap' && stats && <HeatmapContent stats={stats} />}
            {activeTab === 'feedback' && stats && <FeedbackContent stats={stats} />}
          </div>
        </main>
      </div>
    </div>
  );
}
