import React, { useState, useMemo } from 'react';
import { DashboardStats } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Quote, Eye, Megaphone, Filter, Search } from 'lucide-react';
import { cn } from '../lib/utils';

export function FeedbackContent({ stats }: { stats: DashboardStats }) {
  const [selectedArea, setSelectedArea] = useState<string>('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCommunication = useMemo(() => {
    return stats.communicationFeedback
      .filter(item => item.text && item.text.trim() !== '' && item.text !== '""')
      .filter(item => selectedArea === 'Todas' || item.area === selectedArea)
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stats.communicationFeedback, selectedArea, searchTerm]);

  const filteredVision = useMemo(() => {
    return stats.visionFeedback
      .filter(item => item.text && item.text.trim() !== '' && item.text !== '""')
      .filter(item => selectedArea === 'Todas' || item.area === selectedArea)
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stats.visionFeedback, selectedArea, searchTerm]);

  const filteredTestimonials = useMemo(() => {
    return stats.testimonials
      .filter(item => item.text && item.text.trim() !== '' && item.text !== '""')
      .filter(item => selectedArea === 'Todas' || item.role === selectedArea)
      .filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [stats.testimonials, selectedArea, searchTerm]);

  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-secondary-style tracking-tight">Voz do Time</h2>
          <p className="text-secondary text-[10px] sm:text-sm mt-1">Insights qualitativos e percepções diretas dos colaboradores</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <input 
              type="text"
              placeholder="Buscar feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-low border border-outline-variant/10 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="relative flex-1 sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
            <select 
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-low border border-outline-variant/10 rounded-xl text-xs appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="Todas">Todas as Áreas</option>
              {stats.areas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Testimonials - Editorial Style */}
        <div className="lg:col-span-12 space-y-6">
          <div className="flex items-center gap-4">
            <Quote className="w-5 h-5 text-primary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">"Como é trabalhar aí?" (10 Segundos)</h3>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredTestimonials.length > 0 ? (
                filteredTestimonials.map((item, index) => (
                  <motion.div 
                    key={index}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-6 rounded-3xl relative group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500"
                  >
                    <div className="absolute -top-3 -left-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-lg">
                      <Quote className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium italic leading-relaxed text-on-surface mb-4">
                      "{item.text}"
                    </p>
                    <div className="pt-4 border-t border-outline-variant/10 flex justify-between items-center">
                      <span className="text-[9px] font-black uppercase tracking-widest text-primary">{item.role}</span>
                      <span className="text-[8px] font-bold text-secondary">DEPOIMENTO REAL</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-secondary text-xs italic">
                  Nenhum depoimento encontrado para os filtros selecionados.
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Communication Feedback */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-4">
            <Megaphone className="w-5 h-5 text-tertiary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Sugestões de Comunicação</h3>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredCommunication.map((item, index) => (
                <motion.div 
                  key={index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-surface-low rounded-2xl border border-outline-variant/10 hover:border-tertiary/30 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-tertiary uppercase tracking-widest">{item.area}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-on-surface">"{item.text}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Vision Feedback */}
        <div className="lg:col-span-6 space-y-6">
          <div className="flex items-center gap-4">
            <Eye className="w-5 h-5 text-secondary" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-secondary">Visão Consistem 40 Anos</h3>
            <div className="h-px flex-1 bg-outline-variant/20" />
          </div>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {filteredVision.map((item, index) => (
                <motion.div 
                  key={index}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-5 bg-[#1A181A] text-white rounded-2xl border border-white/5 hover:border-white/20 transition-all"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-secondary uppercase tracking-widest">{item.area}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-white/90">"{item.text}"</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
