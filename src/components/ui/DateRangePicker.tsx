import React, { useState, useRef, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isWithinInterval, addMonths, subMonths, startOfWeek, endOfWeek, isAfter, isBefore, parseISO, isValid, isToday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

interface DateRangePickerProps {
  startDate: string;
  endDate: string;
  onRangeChange: (start: string, end: string) => void;
}

export function DateRangePicker({ startDate, endDate, onRangeChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  const start = startDate ? parseISO(startDate) : null;
  const end = endDate ? parseISO(endDate) : null;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateClick = (date: Date) => {
    if (!start || (start && end)) {
      onRangeChange(format(date, 'yyyy-MM-dd'), '');
    } else {
      if (isBefore(date, start)) {
        onRangeChange(format(date, 'yyyy-MM-dd'), format(start, 'yyyy-MM-dd'));
      } else {
        onRangeChange(format(start, 'yyyy-MM-dd'), format(date, 'yyyy-MM-dd'));
      }
      setIsOpen(false);
    }
  };

  const renderCalendar = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="p-4 bg-surface border border-outline-variant/20 rounded-2xl shadow-2xl min-w-[300px]">
        <div className="flex items-center justify-between mb-4">
          <button 
            type="button"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-1 hover:bg-primary/10 rounded-lg text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h3 className="text-xs font-extrabold uppercase tracking-widest text-on-surface">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </h3>
          <button 
            type="button"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-primary/10 rounded-lg text-primary transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
            <div key={day} className="text-[10px] font-extrabold text-secondary text-center uppercase py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            const isSelected = (start && isSameDay(day, start)) || (end && isSameDay(day, end));
            const isInRange = start && end && isWithinInterval(day, { start, end });
            const isCurrentMonth = isSameDay(startOfMonth(day), monthStart);
            const isTodayDate = isToday(day);

            return (
              <button
                key={i}
                type="button"
                onClick={() => handleDateClick(day)}
                className={cn(
                  "h-8 w-8 flex items-center justify-center rounded-lg text-[11px] font-bold transition-all relative",
                  !isCurrentMonth && "opacity-20",
                  isTodayDate && !isSelected && "text-primary border border-primary/20",
                  isSelected 
                    ? "bg-primary text-white shadow-lg shadow-primary/30 z-10" 
                    : isInRange 
                      ? "bg-primary/10 text-primary" 
                      : "hover:bg-primary/5 text-on-surface/80"
                )}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-outline-variant/10 flex justify-between items-center">
          <button 
            type="button"
            onClick={() => {
              onRangeChange('', '');
              setIsOpen(false);
            }}
            className="text-[9px] font-extrabold uppercase tracking-widest text-secondary hover:text-primary transition-colors"
          >
            Limpar
          </button>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="text-[9px] font-extrabold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    );
  };

  const displayRange = () => {
    if (start && end && isValid(start) && isValid(end)) {
      return `${format(start, 'dd/MM/yy')} - ${format(end, 'dd/MM/yy')}`;
    }
    if (start && isValid(start)) {
      return `${format(start, 'dd/MM/yy')} - ...`;
    }
    return 'Escolher datas';
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center bg-surface-low/30 border border-outline-variant/10 rounded-2xl p-1 transition-all hover:border-primary/40 group",
          isOpen && "border-primary/60 bg-surface-low/50"
        )}
      >
        <div className="flex items-center px-2 sm:px-4 py-1.5 gap-3">
          <CalendarIcon className={cn(
            "w-4 h-4 sm:w-3.5 sm:h-3.5 transition-colors",
            isOpen ? "text-primary" : "text-primary/60 group-hover:text-primary"
          )} />
          <div className="hidden sm:flex flex-col items-start">
            <span className="text-[8px] font-extrabold text-secondary uppercase tracking-widest leading-none mb-0.5">Período</span>
            <span className="text-[10px] sm:text-xs text-on-surface font-extrabold transition-all">
              {displayRange()}
            </span>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="absolute top-full mt-2 right-0 z-50 origin-top-right"
          >
            {renderCalendar()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
