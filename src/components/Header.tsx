import React from 'react';
import { 
  RefreshCw, 
  LayoutDashboard, 
  BarChart3, 
  Users, 
  GitCompare, 
  Flame,
  MessageSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { DateRangePicker } from './ui/DateRangePicker';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  startDate: string;
  onStartDateChange: (date: string) => void;
  endDate: string;
  onEndDateChange: (date: string) => void;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function Header({ 
  activeTab,
  setActiveTab,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onRefresh,
  isRefreshing
}: HeaderProps) {
  const menuItems = [
    { id: 'geral', label: 'Visão Geral', icon: LayoutDashboard },
    { id: 'engajamento', label: 'Engajamento', icon: BarChart3 },
    { id: 'cultura', label: 'Cultura', icon: Users },
    { id: 'comparativo', label: 'Comparativo', icon: GitCompare },
    { id: 'heatmap', label: 'Mapa de Calor', icon: Flame },
    { id: 'feedback', label: 'Voz do Time', icon: MessageSquare },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 h-20 z-40 bg-background/80 backdrop-blur-xl border-b border-outline-variant/10 flex items-center px-4 sm:px-8 transition-all duration-300">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto gap-4">
        {/* Logo Section */}
        <div className="flex items-center shrink-0">
          <div className="w-32 h-12 flex items-center justify-center">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeXyRP1EBwBnu6AeqXq9N5I0sfG_Go0DkOaQ&s" 
              alt="Consistem Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Navigation Tabs - Centralized */}
        <nav className="hidden md:flex items-center gap-1 bg-surface-low/50 p-1 rounded-2xl border border-outline-variant/10">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 text-[9px] font-sora uppercase tracking-widest transition-all duration-300 rounded-xl whitespace-nowrap",
                activeTab === item.id 
                  ? "text-primary font-bold bg-white shadow-sm" 
                  : "text-secondary hover:text-on-surface hover:bg-white/50"
              )}
              title={item.label}
            >
              <item.icon className={cn("w-3.5 h-3.5", activeTab === item.id && "fill-primary/10")} />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Actions Section */}
        <div className="flex items-center gap-2 sm:gap-4">
          <DateRangePicker 
            startDate={startDate}
            endDate={endDate}
            onRangeChange={(start, end) => {
              onStartDateChange(start);
              onEndDateChange(end);
            }}
          />

          <button 
            onClick={onRefresh}
            disabled={isRefreshing}
            className={cn(
              "p-3 rounded-2xl transition-all flex items-center justify-center group",
              isRefreshing 
                ? "bg-surface-low text-secondary cursor-not-allowed" 
                : "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0"
            )}
            title="Atualizar Dados"
          >
            <RefreshCw className={cn("w-5 h-5", isRefreshing && "animate-spin", !isRefreshing && "group-hover:rotate-180 transition-transform duration-500")} />
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Scrollable bar */}
      <div className="md:hidden absolute top-20 left-0 right-0 bg-background/60 backdrop-blur-md border-b border-outline-variant/10 flex flex-col">
        <div className="p-2 border-b border-outline-variant/5">
        </div>
        <nav className="flex items-center gap-1 p-2 min-w-max justify-center w-full overflow-x-auto no-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex items-center justify-center p-3 transition-all duration-300 rounded-xl",
                activeTab === item.id 
                  ? "text-primary bg-white shadow-sm" 
                  : "text-secondary"
              )}
              title={item.label}
            >
              <item.icon className={cn("w-5 h-5", activeTab === item.id && "fill-primary/10")} />
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
