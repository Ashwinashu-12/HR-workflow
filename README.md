# 🚀 Antigravity HR: Workflow Architect v2.0

A production-quality, architecture-focused HR Workflow Designer built with Next.js, TypeScript, and React Flow. This system allows for the creation, validation, and simulation of complex enterprise workflows with senior-level engineering principles.

## 🏗️ Architecture Overview

The project follows a clean, modular architecture designed for scalability and maintainability:

```text
/src
  /api          # API Abstraction Layer (Mocked with latency)
  /components   # UI Components
    /nodes      # Custom React Flow Node implementations
    /forms      # Dynamic Property Form system
    /layout     # Application shell and global layout
  /hooks        # Reusable business logic hooks
  /store        # Centralized Zustand state management
  /types        # Strict TypeScript models & Discriminated Unions
  /utils        # Logic engines (Simulation, Validation)
```

## 🧠 Simulation Engine

The core logic resides in `src/utils/simulationEngine.ts`. 

- **Graph Traversal**: Uses DFS-based traversal to simulate work flow steps.
- **Cycle Detection**: Prevents infinite loops by tracking visited nodes during traversal.
- **Step-by-Step Logging**: Generates detailed JSON logs for each execution step, including timestamps and status updates.
- **Asynchronous Processing**: Simulates real-world execution latency.

## ✅ Validation System

Ensures workflow integrity before deployment:
- **Structural Integrity**: Validates exactly one Start node and at least one End node.
- **Connectivity Analysis**: Identifies disconnected nodes and logical dead ends.
- **Interactive Feedback**: Invalid nodes are visually highlighted in the UI with pulse animations and error badges.

## 🛠️ Technology Stack

- **Next.js 15 (App Router)**: Modern React framework.
- **TypeScript**: Strict type safety with discriminated unions for all workflow elements.
- **React Flow (@xyflow/react)**: Industry-standard graph library.
- **Zustand**: Clean, centralized state management with history support.
- **Tailwind CSS**: Premium, custom UI with glassmorphism and modern aesthetics.
- **Lucide React**: High-quality SVG icons.

## ⚙️ How to Run

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Run development server**:
    ```bash
    npm run dev
    ```
3.  **Access the app**:
    Open [http://localhost:3000](http://localhost:3000)

## 💎 Key Design Decisions

1.  **Discriminated Unions for Nodes**: Ensures that a `TaskNode` only ever has task-related properties, preventing runtime errors.
2.  **API Abstraction**: Components never talk to the engine directly; they go through `workflowApi`, making it trivial to swap the mock for a real backend.
3.  **Decoupled Logic**: The simulation engine is a pure ES6 class that doesn't depend on React, allowing it to be tested or run server-side easily.
4.  **Premium UX**: Hover states, micro-animations, and a "Terminal" style execution panel provide an elite developer/admin experience.

## 🚀 Future Improvements

- [ ] Persistent storage using MongoDB/PostgreSQL.
- [ ] Multi-user collaborative editing via Yjs.
- [ ] Logic-based branching with "If/Else" nodes.
- [ ] Native PDF export for workflow documentation.