import React, { memo } from 'react';
import { GitPullRequest, ShieldCheck } from 'lucide-react';
import BaseNode from './BaseNode';
import { ApprovalNodeData } from '@/types/workflow';

const ApprovalNode = (props: { id: string; data: ApprovalNodeData; selected?: boolean }) => {
  return (
    <BaseNode
      {...props}
      headerClassName="bg-amber-500 text-white"
      icon={<GitPullRequest size={16} />}
    >
      <div className="space-y-2">
        <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
          <span>Role</span>
          <span>Threshold</span>
        </div>
        <div className="flex justify-between items-center">
            <span className="flex items-center gap-1 font-bold text-slate-800">
                <ShieldCheck size={12} className="text-amber-500" />
                {props.data.approverRole}
            </span>
            <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-black">
                {props.data.autoApproveThreshold}%
            </span>
        </div>
      </div>
    </BaseNode>
  );
};

export default memo(ApprovalNode);
