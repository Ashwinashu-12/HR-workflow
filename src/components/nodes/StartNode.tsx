import React, { memo } from 'react';
import { Play } from 'lucide-react';
import BaseNode from './BaseNode';
import { StartNodeData } from '@/types/workflow';

const StartNode = (props: { id: string; data: StartNodeData; selected?: boolean }) => {
  return (
    <BaseNode
      {...props}
      headerClassName="bg-emerald-600 text-white"
      icon={<Play size={16} fill="currentColor" />}
      showInHandle={false}
    >
      <div className="flex flex-col gap-1">
        <p className="font-medium">Workflow Trigger</p>
        <p className="text-[10px] opacity-70 italic">Initial step of the HR process.</p>
      </div>
    </BaseNode>
  );
};

export default memo(StartNode);
