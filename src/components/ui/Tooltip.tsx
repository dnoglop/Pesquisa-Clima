import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX + rect.width / 2,
      });
    }
  };

  useEffect(() => {
    if (isVisible) {
      updateCoords();
      window.addEventListener('scroll', updateCoords);
      window.addEventListener('resize', updateCoords);
    }
    return () => {
      window.removeEventListener('scroll', updateCoords);
      window.removeEventListener('resize', updateCoords);
    };
  }, [isVisible]);

  return (
    <div className="relative inline-flex items-center group">
      <div 
        ref={triggerRef}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      
      {isVisible && createPortal(
        <div 
          style={{ 
            position: 'absolute', 
            top: coords.top, 
            left: coords.left, 
            zIndex: 9999,
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%) translateY(-8px)'
          }}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 5 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 5 }}
              className="w-64 p-4 bg-surface border border-outline-variant/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[9999]"
            >
              <p className="text-xs leading-relaxed text-on-surface font-opensans font-medium">
                {content}
              </p>
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-surface"></div>
            </motion.div>
          </AnimatePresence>
        </div>,
        document.body
      )}
    </div>
  );
}

export function InfoTooltip({ content, variant = 'dark' }: { content: string, variant?: 'light' | 'dark' }) {
  return (
    <Tooltip content={content}>
      <Info className={`w-3 h-3 transition-colors ${variant === 'light' ? 'text-white/60 hover:text-white' : 'text-secondary hover:text-primary'}`} />
    </Tooltip>
  );
}
