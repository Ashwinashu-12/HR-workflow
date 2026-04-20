import { Node, Edge } from '@xyflow/react';

/**
 * Node Types supported by the system
 */
export enum WorkflowNodeType {
  START = 'start',
  TASK = 'task',
  APPROVAL = 'approval',
  AUTOMATED = 'automated',
  END = 'end',
}

/**
 * Base data structure for all nodes
 */
export interface BaseNodeData {
  label: string;
  type: WorkflowNodeType;
  isValid?: boolean;
  errors?: string[];
}

/**
 * Specific data for Start Node
 */
export interface StartNodeData extends BaseNodeData {
  type: WorkflowNodeType.START;
  metadata: Record<string, string>;
}

/**
 * Specific data for Task Node
 */
export interface TaskNodeData extends BaseNodeData {
  type: WorkflowNodeType.TASK;
  description?: string;
  assignee?: string;
  dueDate?: string;
  customFields: Record<string, string>;
}

/**
 * Specific data for Approval Node
 */
export interface ApprovalNodeData extends BaseNodeData {
  type: WorkflowNodeType.APPROVAL;
  approverRole: string;
  autoApproveThreshold: number;
}

/**
 * Specific data for Automated Node
 */
export interface AutomatedNodeData extends BaseNodeData {
  type: WorkflowNodeType.AUTOMATED;
  actionId: string;
  params: Record<string, string>;
}

/**
 * Specific data for End Node
 */
export interface EndNodeData extends BaseNodeData {
  type: WorkflowNodeType.END;
  message: string;
}

/**
 * Discriminated Union for all Node Data types
 */
export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

/**
 * React Flow Node type safety
 */
export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

/**
 * Graph structure for internal logic
 */
export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

/**
 * Simulation related types
 */
export type StepStatus = 'pending' | 'completed' | 'failed' | 'skipped';

export interface SimulationStep {
  step: number;
  nodeId: string;
  nodeTitle: string;
  type: WorkflowNodeType;
  status: StepStatus;
  message: string;
  timestamp: string;
}

export interface SimulationResult {
  success: boolean;
  logs: SimulationStep[];
  errors?: string[];
}

/**
 * Validation Error structure
 */
export interface ValidationError {
  nodeId?: string;
  message: string;
  type: 'structure' | 'logic' | 'data';
}

/**
 * View modes for the application
 */
export enum ViewMode {
  EXPLORER = 'explorer',
  DESIGNER = 'designer',
  ANALYTICS = 'analytics',
}

export interface SavedWorkflow {
  id: string;
  name: string;
  author: string;
  status: 'Draft' | 'Active' | 'Review';
  updated: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}
