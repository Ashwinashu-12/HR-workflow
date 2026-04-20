import React, { useState } from 'react';
import { Search, FileText, Clock, Filter, Plus, MoreVertical, Trash2, ExternalLink } from 'lucide-react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import clsx from 'clsx';

export const Explorer: React.FC = () => {
  const { savedWorkflows, createNewWorkflow, loadWorkflow, deleteWorkflow } = useWorkflowStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const filteredWorkflows = savedWorkflows.filter(w => 
    w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    w.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-in fade-in duration-500">
      <div className="p-8 border-b bg-slate-50/50">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Workflow Explorer</h2>
            <p className="text-slate-500 text-sm font-medium mt-1">Manage and organize your HR automation assets</p>
          </div>
          <button 
            onClick={createNewWorkflow}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95"
          >
            <Plus size={18} /> New Workflow
          </button>
        </div>

        <div className="flex gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search workflows, authors, or IDs..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-8">
        {filteredWorkflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="font-bold text-sm uppercase tracking-widest">No workflows found</p>
          </div>
        ) : (
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                <th className="pb-4 font-black px-4">Workflow Name</th>
                <th className="pb-4 font-black px-4">Author</th>
                <th className="pb-4 font-black px-4">Status</th>
                <th className="pb-4 font-black px-4">Last Updated</th>
                <th className="pb-4 font-black px-4 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredWorkflows.map((workflow) => (
                <tr key={workflow.id} className="group cursor-pointer">
                  <td 
                    onClick={() => loadWorkflow(workflow.id)}
                    className="bg-slate-50 group-hover:bg-slate-100/80 transition-colors rounded-l-2xl p-4 border border-r-0 border-slate-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                        <FileText size={20} />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{workflow.name}</span>
                    </div>
                  </td>
                  <td className="bg-slate-50 group-hover:bg-slate-100/80 transition-colors p-4 border-y border-slate-100">
                    <span className="text-sm font-semibold text-slate-500">{workflow.author}</span>
                  </td>
                  <td className="bg-slate-50 group-hover:bg-slate-100/80 transition-colors p-4 border-y border-slate-100">
                    <span className={clsx(
                      "px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
                      workflow.status === 'Draft' ? "bg-slate-200 text-slate-600" :
                      workflow.status === 'Active' ? "bg-emerald-100 text-emerald-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {workflow.status}
                    </span>
                  </td>
                  <td className="bg-slate-50 group-hover:bg-slate-100/80 transition-colors p-4 border-y border-slate-100">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-xs font-semibold">{workflow.updated}</span>
                    </div>
                  </td>
                  <td className="bg-slate-50 group-hover:bg-slate-100/80 transition-colors rounded-r-2xl p-4 border border-l-0 border-slate-100 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === workflow.id ? null : workflow.id);
                      }}
                      className="p-2 text-slate-300 hover:text-slate-900 transition-colors"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {activeMenuId === workflow.id && (
                      <div className="absolute right-4 top-14 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in duration-200">
                        <button 
                          onClick={() => { loadWorkflow(workflow.id); setActiveMenuId(null); }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                        >
                          <ExternalLink size={16} /> Open Editor
                        </button>
                        <button 
                          onClick={() => { deleteWorkflow(workflow.id); setActiveMenuId(null); }}
                          className="flex items-center gap-3 w-full px-4 py-2 text-left text-sm font-bold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={16} /> Delete Workflow
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
