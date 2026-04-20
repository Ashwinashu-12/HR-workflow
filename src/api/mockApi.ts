import { AutomationAction, SimulationResult, WorkflowNode, WorkflowEdge } from '@/types/workflow';

const MOCK_ACTIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'slack_notification', label: 'Slack Notification', params: ['channel', 'message'] },
  { id: 'create_jira_ticket', label: 'Create Jira Ticket', params: ['projectKey', 'summary', 'description'] },
  { id: 'update_crm', label: 'Update CRM', params: ['contactId', 'status'] },
];

export const mockApi = {
  getAutomations: async (): Promise<AutomationAction[]> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    return MOCK_ACTIONS;
  },

  simulateWorkflow: async (nodes: WorkflowNode[], edges: WorkflowEdge[]): Promise<SimulationResult> => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const errors: string[] = [];
    
    // Simple validation
    const startNodes = nodes.filter((n) => n.type === 'start');
    if (startNodes.length === 0) errors.push('Missing Start node.');
    if (startNodes.length > 1) errors.push('Only one Start node is allowed.');

    const endNodes = nodes.filter((n) => n.type === 'end');
    if (endNodes.length === 0) errors.push('Missing End node.');

    // Check for dangling nodes (disconnected)
    const connectedNodes = new Set<string>();
    edges.forEach(e => {
        connectedNodes.add(e.source);
        connectedNodes.add(e.target);
    });
    
    nodes.forEach(n => {
        if (!connectedNodes.has(n.id) && nodes.length > 1) {
            errors.push(`Node "${n.data.label}" is not connected.`);
        }
    });

    if (errors.length > 0) {
      return { success: false, logs: [], errors };
    }

    // Generate mock logs
    const logs = nodes.map((node, index) => ({
      step: index + 1,
      nodeId: node.id,
      nodeTitle: node.data.label,
      status: 'completed' as const,
      message: `Successfully executed ${node.type} step.`,
      timestamp: new Date().toISOString(),
    }));

    return {
      success: true,
      logs,
    };
  },
};
