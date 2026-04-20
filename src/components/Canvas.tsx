'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  Panel,
  ReactFlowInstance,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { nodeTypes } from './nodes';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { WorkflowNodeType, WorkflowNode } from '@/types/workflow';
import { Undo2, Redo2, Trash2, Download, Upload, ShieldCheck, AlertCircle } from 'lucide-react';

export const Canvas = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);
  const [showErrors, setShowErrors] = React.useState(false);
  
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    addNode,
    undo,
    redo,
    historyIndex,
    history,
    selectNode,
    deleteNode,
    selectedNodeId,
    validate,
    validationErrors,
    exportWorkflow,
    importWorkflow
  } = useWorkflowStore();

  // Auto-validate on changes
  useEffect(() => {
    validate();
  }, [nodes, edges, validate]);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow') as WorkflowNodeType;

      if (!type || !reactFlowInstance) return;

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      addNode(type, position);
    },
    [reactFlowInstance, addNode]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: WorkflowNode) => {
      selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `workflow-${new Date().getTime()}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      importWorkflow(json);
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setReactFlowInstance}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        connectionMode={ConnectionMode.Loose}
        snapToGrid
        snapGrid={[15, 15]}
      >
        <Background gap={20} color="#f1f5f9" />
        <Controls />
        
        <Panel position="top-right" className="flex flex-col gap-3">
          {/* Action Tools */}
          <div className="flex gap-2 p-1 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2.5 hover:bg-slate-100 disabled:opacity-30 transition-all rounded-xl text-slate-600"
              title="Undo"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2.5 hover:bg-slate-100 disabled:opacity-30 transition-all rounded-xl text-slate-600 border-l"
              title="Redo"
            >
              <Redo2 size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 my-auto mx-1" />
            <button
              onClick={handleExport}
              className="p-2.5 hover:bg-slate-100 transition-all rounded-xl text-slate-600"
              title="Export JSON"
            >
              <Download size={18} />
            </button>
            <label className="p-2.5 hover:bg-slate-100 transition-all rounded-xl text-slate-600 cursor-pointer">
               <Upload size={18} />
               <input type="file" className="hidden" onChange={handleImport} accept=".json" />
            </label>
            {selectedNodeId && (
              <>
                <div className="w-px h-6 bg-slate-200 my-auto mx-1" />
                <button
                  onClick={() => deleteNode(selectedNodeId)}
                  className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-100 transition-all rounded-xl"
                  title="Delete Selected"
                >
                  <Trash2 size={18} />
                </button>
              </>
            )}
          </div>

          {/* Validation Status */}
          <div className="flex flex-col items-end gap-2 group/val">
            <button 
              onClick={() => setShowErrors(!showErrors)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl border shadow-lg transition-all hover:scale-105 active:scale-95 ${
              validationErrors.length === 0 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              {validationErrors.length === 0 ? (
                  <>
                      <ShieldCheck size={18} className="animate-bounce" />
                      <span className="text-xs font-black uppercase">Flow Validated</span>
                  </>
              ) : (
                  <>
                      <AlertCircle size={18} className="animate-pulse" />
                      <span className="text-xs font-black uppercase">{validationErrors.length} logic Issues</span>
                  </>
              )}
            </button>

            {showErrors && validationErrors.length > 0 && (
              <div className="w-80 bg-white/90 backdrop-blur-md border border-amber-100 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-2 items-center mb-3 text-amber-700">
                  <AlertCircle size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Workflow Issues</span>
                </div>
                <ul className="space-y-2">
                  {validationErrors.map((err, i) => (
                    <li key={i} className="text-xs text-slate-600 flex gap-2 leading-relaxed bg-amber-50/50 p-2 rounded-lg">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{err.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};
