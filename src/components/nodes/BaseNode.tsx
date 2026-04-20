import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useWorkflowStore } from '@/store/useWorkflowStore';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BaseNodeProps {
  id: string;
  data: {
    label: string;
    type: string;
    [key: string]: unknown;
  };
  selected?: boolean;
  children?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  icon?: React.ReactNode;
  showInHandle?: boolean;
  showOutHandle?: boolean;
}

const BaseNode = ({
  id,
  data,
  selected,
  children,
  className,
  headerClassName,
  icon,
  showInHandle = true,
  showOutHandle = true,
}: BaseNodeProps) => {
  const validationErrors = useWorkflowStore(state => state.validationErrors);
  const hasError = validationErrors.some(e => e.nodeId === id);

  return (
    <div
      className={cn(
        'min-w-[220px] rounded-xl border-2 bg-white shadow-lg transition-all',
        selected ? 'border-blue-500 shadow-blue-500/20 scale-105' : 'border-slate-200',
        hasError && !selected && 'border-rose-400 shadow-rose-200 shadow-xl animate-pulse',
        className
      )}
    >
      {showInHandle && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-400 transition-colors"
        />
      )}
      
      <div className={cn('flex items-center gap-3 p-3 border-b rounded-t-[10px]', headerClassName)}>
        {icon && <div className="p-2 rounded-lg bg-black/10 text-white">{icon}</div>}
        <div className="flex flex-col">
          <span className="text-[9px] uppercase font-black tracking-widest opacity-60">
            {data.type}
          </span>
          <span className="text-sm font-bold truncate max-w-[140px] text-slate-800">
            {data.label}
          </span>
        </div>
      </div>

      <div className="p-4 text-xs text-slate-600 bg-white/50 backdrop-blur-sm">
        {children}
      </div>

      {showOutHandle && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-slate-300 !border-2 !border-white hover:!bg-blue-400 transition-colors"
        />
      )}

      {hasError && (
        <div className="absolute -top-2 -right-2 group/error">
          <div className="w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-lg ring-2 ring-white cursor-help">
            !
          </div>
          <div className="absolute top-6 right-0 w-48 bg-slate-900 text-white p-2 rounded-lg text-[10px] opacity-0 group-hover/error:opacity-100 pointer-events-none transition-opacity shadow-xl z-50">
            {validationErrors
              .filter(e => e.nodeId === id)
              .map((e, index) => (
                <div key={index} className="flex gap-1 mb-1 last:mb-0">
                  <span className="text-rose-400">•</span>
                  {e.message}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(BaseNode);
export { cn };
