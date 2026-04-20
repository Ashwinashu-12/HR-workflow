import { WorkflowGraph, SimulationResult, AutomationAction } from '@/types/workflow';
import { simulateWorkflow } from '@/utils/simulationEngine';

/**
 * Mock API layer for workflow operations.
 * Simulates network latency and async behavior.
 */
export const workflowApi = {
  /**
   * Fetches available automation actions from the backend.
   */
  async getAutomations(): Promise<AutomationAction[]> {
    await this.delay(800);
    return [
      { id: 'send-email', label: 'Send Welcome Email', params: ['recipient', 'templateId'] },
      { id: 'create-slack', label: 'Create Slack Channel', params: ['channelName'] },
      { id: 'update-hris', label: 'Update HRIS Record', params: ['employeeId', 'status'] },
      { id: 'notify-it', label: 'Notify IT Support', params: ['priority'] },
    ];
  },

  /**
   * Sends the workflow graph for server-side simulation.
   */
  async simulateRemote(graph: WorkflowGraph): Promise<SimulationResult> {
    await this.delay(1500);
    
    // In a real app, this would be a POST request to a specialized engine.
    // Here we use our shared utility to simulate server-side behavior.
    return await simulateWorkflow(graph);
  },

  /**
   * Helper to simulate network latency.
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
};
