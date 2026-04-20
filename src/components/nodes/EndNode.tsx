import React, { memo } from 'react';
import { Flag } from 'lucide-react';
import BaseNode from './BaseNode';
import { EndNodeData } from '@/types/workflow';

const EndNode = (props: { id: string; data: EndNodeData; selected?: boolean }) => {
  return (
    <BaseNode
      {...props}
      headerClassName="bg-slate-800 text-white"
      icon={<Flag size={16} fill="currentColor" />}
      showOutHandle={false}
    >
      <div className="flex flex-col gap-1">
        <p className="font-bold text-slate-700">Workflow Complete</p>
        <p className="text-[10px] opacity-70 italic">{props.data.message}</p>
      </div>
    </BaseNode>
  );
};

export default memo(EndNode);
