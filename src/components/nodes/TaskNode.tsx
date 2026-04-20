import React, { memo } from 'react';
import { ClipboardList, User } from 'lucide-react';
import BaseNode from './BaseNode';
import { TaskNodeData } from '@/types/workflow';

const TaskNode = (props: { id: string; data: TaskNodeData; selected?: boolean }) => {
  return (
    <BaseNode
      {...props}
      headerClassName="bg-blue-600 text-white"
      icon={<ClipboardList size={16} />}
    >
      <div className="space-y-2">
        <p className="line-clamp-2 italic">{props.data.description || 'No description provided.'}</p>
        <div className="flex items-center gap-1.5 pt-1 border-t border-slate-100">
           <User size={12} className="text-slate-400" />
           <span className="font-bold text-slate-700">{props.data.assignee || 'Unassigned'}</span>
        </div>
      </div>
    </BaseNode>
  );
};

export default memo(TaskNode);
