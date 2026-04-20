import React, { memo } from 'react';
import { Cpu, Zap } from 'lucide-react';
import BaseNode from './BaseNode';
import { AutomatedNodeData } from '@/types/workflow';

const AutomatedNode = (props: { id: string; data: AutomatedNodeData; selected?: boolean }) => {
  return (
    <BaseNode
      {...props}
      headerClassName="bg-indigo-600 text-white"
      icon={<Cpu size={16} />}
    >
      <div className="space-y-2">
        <p className="font-bold text-slate-800 flex items-center gap-1">
            <Zap size={12} className="text-indigo-500" />
            {props.data.actionId || 'None'}
        </p>
        <p className="text-[10px] text-slate-400 italic">Automated system action.</p>
      </div>
    </BaseNode>
  );
};

export default memo(AutomatedNode);
