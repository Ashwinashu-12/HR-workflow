'use client';

import { ReactFlowProvider } from '@xyflow/react';
import { Sidebar } from '@/components/Sidebar';
import { Canvas } from '@/components/Canvas';
import { PropertiesPanel } from '@/components/PropertiesPanel';
import { SimulationPanel } from '@/components/SimulationPanel';
import { WorkflowLayout } from '@/components/layout/WorkflowLayout';
import { useWorkflowStore } from '@/store/useWorkflowStore';
import { ViewMode } from '@/types/workflow';
import { Explorer } from '@/components/Explorer';
import { Analytics } from '@/components/Analytics';

export default function Home() {
  const { activeView } = useWorkflowStore();

  const renderContent = () => {
    switch (activeView) {
      case ViewMode.EXPLORER:
        return <Explorer />;
      case ViewMode.ANALYTICS:
        return <Analytics />;
      case ViewMode.DESIGNER:
      default:
        return (
          <ReactFlowProvider>
            <Sidebar />
            <Canvas />
            <PropertiesPanel />
            <SimulationPanel />
          </ReactFlowProvider>
        );
    }
  };

  return (
    <WorkflowLayout>
      <main className="flex flex-1 overflow-hidden relative">
        {renderContent()}
      </main>
    </WorkflowLayout>
  );
}
