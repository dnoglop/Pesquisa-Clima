import React from 'react';

export function FeedbackContent({ stats }: { stats: any }) {
  return (
    <div className="p-4 sm:p-8 mt-16 space-y-8 max-w-7xl mx-auto">
      <h2 className="text-secondary-style tracking-tight mb-8">Feedback Qualitativo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 sm:p-8 rounded-3xl">
          <h3 className="text-variant-style mb-6">Comunicação</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {stats.communicationFeedback
              .filter((item: any) => item.text && item.text.trim() !== '' && item.text !== '""')
              .map((item: any, index: number) => (
              <div key={index} className="p-4 bg-on-surface/5 rounded-xl text-xs leading-relaxed border border-outline-variant/10">
                <span className="font-bold text-primary block mb-1">{item.area}</span>
                "{item.text}"
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6 sm:p-8 rounded-3xl">
          <h3 className="text-variant-style mb-6">Visão 40 Anos</h3>
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {stats.visionFeedback
              .filter((item: any) => item.text && item.text.trim() !== '' && item.text !== '""')
              .map((item: any, index: number) => (
              <div key={index} className="p-4 bg-on-surface/5 rounded-xl text-xs leading-relaxed border border-outline-variant/10">
                <span className="font-bold text-primary block mb-1">{item.area}</span>
                "{item.text}"
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
