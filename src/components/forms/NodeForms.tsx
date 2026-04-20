'use client';

import React from 'react';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { WorkflowNodeData, WorkflowNodeType } from '@/types/workflow';

interface NodeFormProps {
  nodeId: string;
  data: WorkflowNodeData;
}

export const TaskForm: React.FC<NodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  
  if (data.type !== WorkflowNodeType.TASK) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
        <textarea
          value={data.description || ''}
          onChange={(e) => updateNodeData(nodeId, { description: e.target.value })}
          className="w-full px-3 py-2 bg-slate-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px] text-sm"
          placeholder="What needs to be done?"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assignee</label>
          <input
            type="text"
            value={data.assignee || ''}
            onChange={(e) => updateNodeData(nodeId, { assignee: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Due Date</label>
          <input
            type="date"
            value={data.dueDate || ''}
            onChange={(e) => updateNodeData(nodeId, { dueDate: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm"
          />
        </div>
      </div>
    </div>
  );
};

export const ApprovalForm: React.FC<NodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  
  if (data.type !== WorkflowNodeType.APPROVAL) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Approver Role</label>
        <select
          value={data.approverRole}
          onChange={(e) => updateNodeData(nodeId, { approverRole: e.target.value })}
          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm"
        >
          <option value="Manager">Direct Manager</option>
          <option value="HR">HR Business Partner</option>
          <option value="Finance">Finance Team</option>
          <option value="Director">Department Director</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">
          Auto-Approve Threshold ({data.autoApproveThreshold}%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={data.autoApproveThreshold}
          onChange={(e) => updateNodeData(nodeId, { autoApproveThreshold: parseInt(e.target.value) })}
          className="w-full accent-blue-600"
        />
      </div>
    </div>
  );
};

export const AutomatedForm: React.FC<NodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  
  if (data.type !== WorkflowNodeType.AUTOMATED) return null;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Automation Tool</label>
        <select
          value={data.actionId}
          onChange={(e) => updateNodeData(nodeId, { actionId: e.target.value })}
          className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm"
        >
          <option value="">Select Action...</option>
          <option value="send-email">Send Welcome Email</option>
          <option value="create-slack">Create Slack Channel</option>
          <option value="update-hris">Update HRIS Record</option>
        </select>
      </div>
    </div>
  );
};

export const EndForm: React.FC<NodeFormProps> = ({ nodeId, data }) => {
  const updateNodeData = useWorkflowStore(state => state.updateNodeData);
  
  if (data.type !== WorkflowNodeType.END) return null;

  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Completion Message</label>
      <input
        type="text"
        value={data.message}
        onChange={(e) => updateNodeData(nodeId, { message: e.target.value })}
        className="w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm"
      />
    </div>
  );
};
