import { WorkflowNode, WorkflowEdge, WorkflowNodeType, SimulationResult, SimulationStep, StepStatus } from '@/types/workflow';
import { buildGraph, getExecutionPath } from './graph';
import { validateWorkflow } from './validation';

/**
 * Core simulation engine for HR workflow execution.
 */
export const simulateWorkflow = async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<SimulationResult> => {
  // 1. Validate first
  const validationErrors = validateWorkflow({ nodes, edges });
  const criticalErrors = validationErrors.filter(e => e.type === 'structure' || e.message.includes('loop') || e.message.includes('reachable'));
  
  if (criticalErrors.length > 0) {
    return {
      success: false,
      logs: [],
      errors: criticalErrors.map(e => e.message)
    };
  }

  const startNode = nodes.find(n => n.type === WorkflowNodeType.START);
  if (!startNode) {
    return { success: false, logs: [], errors: ['No Start node found to begin simulation.'] };
  }

  const graph = buildGraph(nodes, edges);
  const path = getExecutionPath(startNode.id, graph);
  
  const logs: SimulationStep[] = [];
  
  // Simulate step-by-step
  for (let i = 0; i < path.length; i++) {
    const nodeId = path[i];
    const node = graph.nodes.get(nodeId)!;
    
    // Simulate real-world delay (optional, but makes UI feel better)
    // await new Promise(resolve => setTimeout(resolve, 300));

    const status: StepStatus = i === path.length - 1 && node.type !== WorkflowNodeType.END ? 'pending' : 'completed';
    
    logs.push({
      step: i + 1,
      nodeId: node.id,
      nodeTitle: node.data.label,
      type: node.type as WorkflowNodeType,
      status,
      message: getStatusMessage(node.type as WorkflowNodeType, node.data.label),
      timestamp: new Date().toISOString()
    });
  }

  return {
    success: true,
    logs
  };
};

/**
 * Helper to generate descriptive logs for simulation.
 */
const getStatusMessage = (type: WorkflowNodeType, label: string): string => {
  switch (type) {
    case WorkflowNodeType.START:
      return `Initialization: Workflow session started.`;
    case WorkflowNodeType.TASK:
      return `Queue: Task "${label}" assigned to personnel.`;
    case WorkflowNodeType.APPROVAL:
      return `Pending: Waiting for management approval on "${label}".`;
    case WorkflowNodeType.AUTOMATED:
      return `Execution: System running automated script for "${label}".`;
    case WorkflowNodeType.END:
      return `Termination: Workflow reached successful conclusion.`;
    default:
      return `Processing: Node "${label}" active.`;
  }
};
