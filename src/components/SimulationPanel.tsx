'use client';

import React, { useState } from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { workflowApi } from '@/api/workflowApi';
import { SimulationResult, SimulationStep } from '@/types/workflow';
import { Play, Loader2, X, CheckCircle2, AlertCircle, Clock, Terminal } from 'lucide-react';

export const SimulationPanel = () => {
  const { runSimulation: processSimulation, setSimulationResult, simulationResult } = useWorkflowStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const handleRunSimulation = async () => {
    setIsOpen(true);
    setIsRunning(true);
    setSimulationResult(null);

    // Minor delay to show simulation "thinking"
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      await processSimulation();
    } catch (err) {
      console.error('Simulation Failed:', err);
      setSimulationResult({
        success: false,
        logs: [],
        errors: ['Simulation engine encountered an unexpected error.'],
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <>
      <button
        onClick={handleRunSimulation}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-black shadow-2xl hover:bg-black transition-all hover:scale-105 active:scale-95 z-50 group border border-white/20"
      >
        <div className="bg-blue-500 p-1.5 rounded-full group-hover:rotate-12 transition-transform">
          <Play size={16} fill="white" className="text-white" />
        </div>
        <span className="tracking-tight">Run Workflow Simulation</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-3xl rounded-[32px] shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-slate-200">
            <header className="p-6 border-b flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
                  <Terminal size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Execution Engine</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Simulation Logs</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
              >
                <X size={24} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-20 gap-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-slate-100 border-t-blue-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Play size={20} className="text-blue-600 animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">Processing Graph...</p>
                    <p className="text-sm text-slate-400 font-medium">Analyzing nodes and validating connections</p>
                  </div>
                </div>
              ) : simulationResult ? (
                <div className="space-y-8">
                  {!simulationResult.success && simulationResult.errors && (
                    <div className="p-5 bg-rose-50 border-2 border-rose-100 rounded-2xl flex gap-4">
                      <div className="p-2 bg-rose-500 text-white rounded-lg h-fit">
                        <AlertCircle size={20} />
                      </div>
                      <div>
                        <h3 className="font-black text-rose-800 uppercase text-xs mb-1">Critical Errors</h3>
                        <ul className="space-y-1">
                          {simulationResult.errors.map((err, i) => (
                            <li key={i} className="text-sm text-rose-600 font-medium font-mono">{err}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {simulationResult.success && (
                    <div className="space-y-6">
                      <div className="p-5 bg-emerald-50 border-2 border-emerald-100 rounded-2xl flex items-center gap-4">
                        <div className="p-2 bg-emerald-500 text-white rounded-lg">
                            <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <p className="font-black text-emerald-900 uppercase text-xs">Path Validated</p>
                          <p className="text-sm text-emerald-700 font-medium">Success! {simulationResult.logs.length} operations completed without error.</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Execution Stack</h3>
                        {simulationResult.logs.map((log: SimulationStep) => (
                          <div key={`${log.nodeId}-${log.step}`} className="flex gap-6 group">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center shadow-sm text-slate-600 font-black text-sm group-hover:border-blue-300 group-hover:text-blue-600 transition-all">
                                    {log.step}
                                </div>
                                <div className="w-0.5 flex-1 bg-slate-100 my-2" />
                            </div>
                            <div className="flex-1 pb-8">
                                <div className="flex justify-between items-start">
                                    <div className="flex flex-col">
                                      <div className="flex items-center gap-2">
                                        <span className="font-black text-slate-800 text-lg tracking-tight">{log.nodeTitle}</span>
                                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border ${
                                          log.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                        }`}>
                                          {log.status}
                                        </span>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{log.type}</span>
                                    </div>
                                    <span className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                        <Clock size={10} /> {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                    </span>
                                </div>
                                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:border-blue-50 transition-all">
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed">{log.message}</p>
                                </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <footer className="p-6 border-t bg-slate-50 flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-black transition-all shadow-lg hover:shadow-black/20"
              >
                Acknowledge Result
              </button>
            </footer>
          </div>
        </div>
      )}
    </>
  );
};
