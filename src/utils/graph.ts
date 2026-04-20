import { WorkflowNode, WorkflowEdge, WorkflowNodeType } from '@/types/workflow';

/**
 * Internal graph structure for traversal algorithms.
 */
export interface AdjacencyGraph {
  nodes: Map<string, WorkflowNode>;
  adjacencyList: Map<string, string[]>;
  reverseAdjacencyList: Map<string, string[]>;
}

/**
 * Converts React Flow data into an adjacency list representation.
 */
export const buildGraph = (nodes: WorkflowNode[], edges: WorkflowEdge[]): AdjacencyGraph => {
  const nodeMap = new Map<string, WorkflowNode>();
  const adj = new Map<string, string[]>();
  const revAdj = new Map<string, string[]>();

  nodes.forEach((node) => {
    nodeMap.set(node.id, node);
    adj.set(node.id, []);
    revAdj.set(node.id, []);
  });

  edges.forEach((edge) => {
    // Only track edges between existing nodes
    if (adj.has(edge.source) && adj.has(edge.target)) {
      adj.get(edge.source)!.push(edge.target);
      revAdj.get(edge.target)!.push(edge.source);
    }
  });

  return { nodes: nodeMap, adjacencyList: adj, reverseAdjacencyList: revAdj };
};

/**
 * Depth-First Search to detect cycles in the workflow.
 */
export const hasCycle = (graph: AdjacencyGraph): boolean => {
  const visited = new Set<string>();
  const recStack = new Set<string>();

  const check = (nodeId: string): boolean => {
    if (recStack.has(nodeId)) return true;
    if (visited.has(nodeId)) return false;

    visited.add(nodeId);
    recStack.add(nodeId);

    const neighbors = graph.adjacencyList.get(nodeId) || [];
    for (const neighbor of neighbors) {
      if (check(neighbor)) return true;
    }

    recStack.delete(nodeId);
    return false;
  };

  for (const nodeId of graph.nodes.keys()) {
    if (check(nodeId)) return true;
  }

  return false;
};

/**
 * Returns a set of node IDs reachable from the given starting nodes.
 */
export const getReachableNodes = (startNodeIds: string[], graph: AdjacencyGraph): Set<string> => {
  const reachable = new Set<string>();
  const queue: string[] = [...startNodeIds];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (!reachable.has(current)) {
      reachable.add(current);
      const neighbors = graph.adjacencyList.get(current) || [];
      queue.push(...neighbors);
    }
  }

  return reachable;
};

/**
 * Breadth-First Search to traverse the graph and generate a flat execution path.
 */
export const getExecutionPath = (startNodeId: string, graph: AdjacencyGraph): string[] => {
  const path: string[] = [];
  const queue: string[] = [startNodeId];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;

    visited.add(current);
    path.push(current);

    const neighbors = graph.adjacencyList.get(current) || [];
    // Prioritize traversal if needed, but BFS works for simulation
    queue.push(...neighbors);
  }

  return path;
};
