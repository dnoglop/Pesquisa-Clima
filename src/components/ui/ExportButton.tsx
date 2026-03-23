import React, { useRef } from 'react';
import { Download, Copy, Check } from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { cn } from '../../lib/utils';
import { useState } from 'react';

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  fileName?: string;
  className?: string;
}

export function ExportButton({ targetRef, fileName = 'chart', className }: ExportButtonProps) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef.current) return;
    setExporting(true);
    try {
      const dataUrl = await toPng(targetRef.current, {
        backgroundColor: 'var(--background)',
        style: {
          padding: '20px',
          borderRadius: '24px',
        }
      });
      const link = document.createElement('a');
      link.download = `${fileName}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export image', err);
    } finally {
      setExporting(false);
    }
  };

  const handleCopy = async () => {
    if (!targetRef.current) return;
    try {
      const blob = await toBlob(targetRef.current, {
        backgroundColor: 'var(--background)',
        style: {
          padding: '20px',
          borderRadius: '24px',
        }
      });
      if (blob) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error('Failed to copy image', err);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        onClick={handleCopy}
        className="p-2 rounded-lg bg-on-surface/5 hover:bg-on-surface/10 text-secondary transition-colors"
        title="Copiar como imagem"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-tertiary" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
      <button
        onClick={handleExport}
        disabled={exporting}
        className="p-2 rounded-lg bg-on-surface/5 hover:bg-on-surface/10 text-secondary transition-colors"
        title="Baixar como PNG"
      >
        <Download className={cn("w-3.5 h-3.5", exporting && "animate-pulse")} />
      </button>
    </div>
  );
}
