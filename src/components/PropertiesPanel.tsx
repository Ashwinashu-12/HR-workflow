'use client';

import React from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { WorkflowNodeType } from '@/types/workflow';
import { Settings2, Trash2, X, AlertCircle } from 'lucide-react';
import { TaskForm, ApprovalForm, AutomatedForm, EndForm } from '@/components/forms/NodeForms';

export const PropertiesPanel = () => {
  const { nodes, selectedNodeId, selectNode, updateNodeData, deleteNode, validationErrors } = useWorkflowStore();
  
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const nodeErrors = validationErrors.filter(e => e.nodeId === selectedNodeId);

  if (!selectedNode) return null;

  const renderForm = () => {
    switch (selectedNode.data.type) {
      case WorkflowNodeType.TASK:
        return <TaskForm nodeId={selectedNode.id} data={selectedNode.data} />;
      case WorkflowNodeType.APPROVAL:
        return <ApprovalForm nodeId={selectedNode.id} data={selectedNode.data} />;
      case WorkflowNodeType.AUTOMATED:
        return <AutomatedForm nodeId={selectedNode.id} data={selectedNode.data} />;
      case WorkflowNodeType.END:
        return <EndForm nodeId={selectedNode.id} data={selectedNode.data} />;
      default:
        return <p className="text-sm text-slate-500 italic">No advanced configuration for this node type.</p>;
    }
  };

  return (
    <aside className="w-80 border-l bg-white flex flex-col h-full shadow-2xl z-20 animate-in slide-in-from-right duration-300">
      <header className="p-4 border-b flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
           <Settings2 size={18} className="text-blue-600" />
           <span className="font-bold text-slate-800">Node Properties</span>
        </div>
        <button 
          onClick={() => selectNode(null)}
          className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Name/Label */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Display Label</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => updateNodeData(selectedNode.id, { label: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
          />
        </div>

        <div className="h-px bg-slate-100" />

        {/* Dynamic Type-specific Form */}
        {renderForm()}

        {/* Validation Errors */}
        {nodeErrors.length > 0 && (
          <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl space-y-2 mt-4">
            <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase">
              <AlertCircle size={14} />
              <span>Logic Warnings</span>
            </div>
            <ul className="space-y-1">
              {nodeErrors.map((err, i) => (
                <li key={i} className="text-xs text-rose-500 leading-relaxed font-medium">
                  • {err.message}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <footer className="p-4 border-t bg-slate-50/50 mt-auto">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-rose-100 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all font-bold text-sm"
        >
          <Trash2 size={16} />
          Delete Node
        </button>
      </footer>
    </aside>
  );
};
