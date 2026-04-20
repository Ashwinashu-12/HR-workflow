import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { 
  WorkflowNode, 
  WorkflowNodeData, 
  WorkflowNodeType, 
  WorkflowGraph, 
  ValidationError,
  SimulationResult,
  ViewMode,
  SavedWorkflow
} from '@/types/workflow';
import { v4 as uuidv4 } from 'uuid';
import { validateWorkflow } from '@/utils/validation';
import { simulateWorkflow } from '@/utils/simulationEngine';

interface WorkflowState {
  // State
  nodes: WorkflowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  validationErrors: ValidationError[];
  simulationResult: SimulationResult | null;
  activeView: ViewMode;
  savedWorkflows: SavedWorkflow[];
  activeWorkflowId: string | null;
  
  // History
  history: { nodes: WorkflowNode[]; edges: Edge[] }[];
  historyIndex: number;

  // Flow Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  
  // Node Actions
  addNode: (type: WorkflowNodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  
  // System Actions
  validate: () => ValidationError[];
  runSimulation: () => Promise<void>;
  setSimulationResult: (result: SimulationResult | null) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
  setView: (view: ViewMode) => void;
  
  // Persistence Actions
  saveCurrentWorkflow: () => void;
  loadWorkflow: (id: string) => void;
  createNewWorkflow: () => void;
  deleteWorkflow: (id: string) => void;
  
  // History Actions
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  validationErrors: [],
  simulationResult: null,
  activeView: ViewMode.DESIGNER,
  activeWorkflowId: null,
  savedWorkflows: [
    { id: '1', name: 'Annual Performance Review 2026', author: 'Ashwin K.', status: 'Draft', updated: '2 hours ago', nodes: [], edges: [] },
    { id: '2', name: 'Onboarding Flow: Engineering', author: 'Sarah J.', status: 'Active', updated: '1 day ago', nodes: [], edges: [] },
    { id: '3', name: 'Offboarding Automation', author: 'Mike R.', status: 'Review', updated: '3 days ago', nodes: [], edges: [] },
    { id: '4', name: 'Benefits Enrollment v2', author: 'Ashwin K.', status: 'Draft', updated: '1 week ago', nodes: [], edges: [] },
  ],
  history: [],
  historyIndex: -1,

  onNodesChange: (changes: NodeChange[]) => {
    const nextNodes = applyNodeChanges(changes, get().nodes) as WorkflowNode[];
    set({ nodes: nextNodes });
  },

  onEdgesChange: (changes: EdgeChange[]) => {
    const nextEdges = applyEdgeChanges(changes, get().edges);
    set({ edges: nextEdges });
  },

  onConnect: (connection: Connection) => {
    set({ edges: addEdge(connection, get().edges) });
    get().saveHistory();
  },

  addNode: (type, position) => {
    const id = uuidv4();
    const label = `New ${type.charAt(0).toUpperCase() + type.slice(1)}`;
    
    let defaultData: WorkflowNodeData;
    
    switch (type) {
      case WorkflowNodeType.START:
        defaultData = { type, label, metadata: {} };
        break;
      case WorkflowNodeType.TASK:
        defaultData = { type, label, customFields: {} };
        break;
      case WorkflowNodeType.APPROVAL:
        defaultData = { type, label, approverRole: 'Manager', autoApproveThreshold: 80 };
        break;
      case WorkflowNodeType.AUTOMATED:
        defaultData = { type, label, actionId: '', params: {} };
        break;
      case WorkflowNodeType.END:
        defaultData = { type, label, message: 'Workflow completed successfully' };
        break;
    }

    const newNode: WorkflowNode = { id, type, position, data: defaultData };
    
    set({ nodes: [...get().nodes, newNode] });
    get().saveHistory();
  },

  updateNodeData: (nodeId, data) => {
    const nodes = get().nodes.map((node) =>
      node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
    );
    set({ nodes });
    get().saveHistory();
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter((edge) => edge.source !== nodeId && edge.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
    get().saveHistory();
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  validate: () => {
    const errors = validateWorkflow({ nodes: get().nodes, edges: get().edges });
    set({ validationErrors: errors });
    return errors;
  },

  runSimulation: async () => {
    const { nodes, edges } = get();
    const result = await simulateWorkflow(nodes, edges);
    set({ simulationResult: result });
  },

  setSimulationResult: (result) => set({ simulationResult: result }),

  exportWorkflow: () => {
    const graph: WorkflowGraph = { nodes: get().nodes, edges: get().edges };
    return JSON.stringify(graph, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges, selectedNodeId: null, validationErrors: [], simulationResult: null });
      get().saveHistory();
    } catch (e) {
      console.error('Failed to import workflow', e);
    }
  },

  saveHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    
    // Simple deep check to avoid redundant saves
    const currentState = JSON.stringify({ nodes, edges });
    const lastState = newHistory.length > 0 ? JSON.stringify(newHistory[newHistory.length - 1]) : null;
    
    if (currentState === lastState) return;

    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) });
    if (newHistory.length > 50) newHistory.shift();
    
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
    }
  },

  setView: (view: ViewMode) => {
    const { activeView, saveCurrentWorkflow } = get();
    if (activeView === ViewMode.DESIGNER) {
      saveCurrentWorkflow();
    }
    set({ activeView: view });
  },

  saveCurrentWorkflow: () => {
    const { nodes, edges, activeWorkflowId, savedWorkflows } = get();
    if (!activeWorkflowId) return;

    const updatedWorkflows = savedWorkflows.map(w => 
      w.id === activeWorkflowId ? { ...w, nodes, edges, updated: 'Just now' } : w
    );
    set({ savedWorkflows: updatedWorkflows });
  },

  loadWorkflow: (id: string) => {
    const workflow = get().savedWorkflows.find(w => w.id === id);
    if (workflow) {
      set({ 
        nodes: workflow.nodes, 
        edges: workflow.edges, 
        activeWorkflowId: id,
        activeView: ViewMode.DESIGNER,
        selectedNodeId: null,
        simulationResult: null,
        validationErrors: []
      });
      get().saveHistory();
    }
  },

  createNewWorkflow: () => {
    const newId = uuidv4();
    const newWorkflow: SavedWorkflow = {
      id: newId,
      name: 'Untitled Workflow',
      author: 'You',
      status: 'Draft',
      updated: 'Just now',
      nodes: [],
      edges: []
    };

    set({
      savedWorkflows: [newWorkflow, ...get().savedWorkflows],
      nodes: [],
      edges: [],
      activeWorkflowId: newId,
      activeView: ViewMode.DESIGNER,
      selectedNodeId: null,
      simulationResult: null,
      validationErrors: []
    });
    get().saveHistory();
  },

  deleteWorkflow: (id: string) => {
    set({
      savedWorkflows: get().savedWorkflows.filter(w => w.id !== id),
      activeWorkflowId: get().activeWorkflowId === id ? null : get().activeWorkflowId
    });
  }
}));
