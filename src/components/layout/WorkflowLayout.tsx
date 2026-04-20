'use client';

import React from 'react';
import { LayoutDashboard, Share2, HelpCircle, Terminal } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { ViewMode } from '@/types/workflow';
import clsx from 'clsx';

interface WorkflowLayoutProps {
  children: React.ReactNode;
}

export const WorkflowLayout: React.FC<WorkflowLayoutProps> = ({ children }) => {
  const { activeView, setView } = useWorkflowStore();

  return (
    <div className="flex flex-col h-screen bg-slate-100 overflow-hidden font-sans antialiased text-slate-900">
      {/* Global Header */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-md flex items-center justify-between px-8 shrink-0 z-50 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="bg-slate-900 p-2.5 rounded-[14px] shadow-lg shadow-slate-900/20 rotate-3">
            <LayoutDashboard className="text-white" size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight text-slate-900 leading-none">HRFlow</h1>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Intelligent HR Architect</span>
          </div>
          <div className="h-6 w-[1px] bg-slate-200 mx-2" />
          <nav className="flex gap-1 bg-slate-100/50 p-1 rounded-xl">
            {[
              { id: ViewMode.EXPLORER, label: 'Explorer' },
              { id: ViewMode.DESIGNER, label: 'Designer' },
              { id: ViewMode.ANALYTICS, label: 'Analytics' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setView(tab.id as ViewMode)}
                className={clsx(
                  "px-4 py-1.5 text-xs font-bold transition-all duration-200 rounded-lg",
                  activeView === tab.id 
                    ? "bg-white text-slate-900 shadow-sm" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center -space-x-2 mr-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold shadow-sm">
                U{i}
              </div>
            ))}
          </div>
          <button className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all">
            <Share2 size={20} />
          </button>
          <button className="px-6 py-2.5 bg-blue-600 text-white text-sm font-black rounded-xl hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20 transition-all active:scale-95">
            Deploy Workflow
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {children}

      {/* Terminal Footer Status */}
      <footer className="h-10 border-t bg-white flex items-center justify-between px-6 text-[10px] text-slate-400 font-bold shrink-0 z-50">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> 
            Engine: Operational
          </span>
          <span className="flex items-center gap-1.5 uppercase tracking-wider">
            Instance ID: <span className="text-slate-600">HR-992-PX</span>
          </span>
        </div>
        <div className="flex gap-4 items-center">
          <button className="hover:text-slate-600 flex items-center gap-1.5 transition-colors uppercase tracking-widest"><HelpCircle size={12} /> Documentation</button>
          <a href="#" className="hover:text-slate-600 flex items-center gap-1.5 transition-colors uppercase tracking-widest"><Terminal size={12} /> Logs</a>
        </div>
      </footer>
    </div>
  );
};
