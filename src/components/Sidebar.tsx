'use client';

import React from 'react';
import { Play, ClipboardList, ShieldCheck, Cpu, Flag, Info } from 'lucide-react';
import { WorkflowNodeType } from '@/types/workflow';

const NODE_TYPES: { type: WorkflowNodeType; label: string; icon: React.ReactNode; color: string; desc: string }[] = [
  { 
    type: WorkflowNodeType.START, 
    label: 'Start Flow', 
    icon: <Play size={18} fill="currentColor" />, 
    color: 'bg-emerald-600',
    desc: 'The beginning of your HR process'
  },
  { 
    type: WorkflowNodeType.TASK, 
    label: 'Manual Task', 
    icon: <ClipboardList size={18} />, 
    color: 'bg-blue-600',
    desc: 'An action for a person to perform'
  },
  { 
    type: WorkflowNodeType.APPROVAL, 
    label: 'Approval', 
    icon: <ShieldCheck size={18} />, 
    color: 'bg-amber-500',
    desc: 'Decision point for management'
  },
  { 
    type: WorkflowNodeType.AUTOMATED, 
    label: 'Automation', 
    icon: <Cpu size={18} />, 
    color: 'bg-indigo-600',
    desc: 'System-triggered action or script'
  },
  { 
    type: WorkflowNodeType.END, 
    label: 'End Flow', 
    icon: <Flag size={18} fill="currentColor" />, 
    color: 'bg-slate-800',
    desc: 'The conclusion of the workflow'
  },
];

export const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: WorkflowNodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-72 border-r bg-white p-6 flex flex-col gap-8 shadow-[1px_0_10px_rgba(0,0,0,0.02)] z-10">
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Components</h2>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1 flex items-center gap-1">
          <Info size={12} /> Drag to the canvas
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {NODE_TYPES.map((node) => (
          <div
            key={node.type}
            className="group flex items-center gap-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl cursor-grab hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all active:scale-95 transition-all duration-300"
            onDragStart={(event) => onDragStart(event, node.type)}
            draggable
          >
            <div className={`${node.color} p-3 rounded-xl text-white group-hover:rotate-6 transition-transform shadow-lg`}>
              {node.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-black text-slate-800 tracking-tight">{node.label}</span>
              <span className="text-[10px] text-slate-400 font-medium">{node.desc}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto p-5 bg-blue-50/50 rounded-2xl border border-blue-100/50 backdrop-blur-sm">
        <h3 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em] mb-3">Best Practices</h3>
        <ul className="text-[11px] text-blue-800/70 space-y-3 font-medium">
            <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Workflows must contain exactly one <b>Start</b> node.</span>
            </li>
            <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>Ensure there are no <b>Disconnected</b> nodes.</span>
            </li>
            <li className="flex gap-2">
                <span className="text-blue-400">•</span>
                <span>All paths should eventually reach an <b>End</b> node.</span>
            </li>
        </ul>
      </div>
    </aside>
  );
};
