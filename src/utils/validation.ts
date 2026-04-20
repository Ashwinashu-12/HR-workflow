import { WorkflowGraph, ValidationError, WorkflowNodeType } from '@/types/workflow';
import { buildGraph, hasCycle, getReachableNodes } from './graph';

/**
 * Advanced validation engine for HR workflows.
 */
export const validateWorkflow = (graph: WorkflowGraph): ValidationError[] => {
  const errors: ValidationError[] = [];
  const { nodes, edges } = graph;

  if (nodes.length === 0) {
    return [{ message: 'Your canvas is empty. Start by adding a Start Flow node.', type: 'structure' }];
  }

  const adjGraph = buildGraph(nodes, edges);

  // 1. Exactly one Start node
  const startNodes = nodes.filter(n => n.type === WorkflowNodeType.START);
  if (startNodes.length === 0) {
    errors.push({ message: 'No Start node found. Every workflow needs a beginning.', type: 'structure' });
  } else if (startNodes.length > 1) {
    errors.push({ message: 'Multiple Start nodes detected. Only one entry point is allowed.', type: 'structure' });
  }

  // 2. At least one End node
  const endNodes = nodes.filter(n => n.type === WorkflowNodeType.END);
  if (endNodes.length === 0) {
    errors.push({ message: 'No End node found. The workflow will never terminate.', type: 'structure' });
  }

  // 3. Detect Cycles
  if (hasCycle(adjGraph)) {
    errors.push({ message: 'Infinite loop detected. Please ensure your flow terminates.', type: 'logic' });
  }

  // 4. Connectivity & Orphan Checks
  nodes.forEach(node => {
    const hasIncoming = adjGraph.reverseAdjacencyList.get(node.id)?.length! > 0;
    const hasOutgoing = adjGraph.adjacencyList.get(node.id)?.length! > 0;

    if (node.type !== WorkflowNodeType.START && !hasIncoming) {
      errors.push({ 
        nodeId: node.id, 
        message: `Node "${node.data.label}" is unreachable (missing entry connection).`, 
        type: 'logic' 
      });
    }

    if (node.type !== WorkflowNodeType.END && !hasOutgoing) {
      errors.push({ 
        nodeId: node.id, 
        message: `Node "${node.data.label}" is a dead end (missing exit connection).`, 
        type: 'logic' 
      });
    }
  });

  // 5. Reachability Check (from Start to End)
  if (startNodes.length === 1) {
    const reachableFromStart = getReachableNodes([startNodes[0].id], adjGraph);
    
    // Check if all nodes are reachable from Start
    nodes.forEach(node => {
        if (!reachableFromStart.has(node.id) && node.type !== WorkflowNodeType.START) {
            // Already caught by "hasIncoming" mostly, but good for disjoint graphs
            if (!errors.some(e => e.nodeId === node.id && e.message.includes('unreachable'))) {
                errors.push({
                    nodeId: node.id,
                    message: `Node "${node.data.label}" is not part of the main flow path.`,
                    type: 'logic'
                });
            }
        }
    });

    // Check if at least one End node is reachable from Start
    const reachableEndNodes = endNodes.filter(n => reachableFromStart.has(n.id));
    if (endNodes.length > 0 && reachableEndNodes.length === 0) {
        errors.push({ message: 'No End node is reachable from the Start point.', type: 'logic' });
    }
  }

  return errors;
};
