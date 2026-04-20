# HR Workflow Designer 🚀

A production-grade workflow builder that allows users to visually design, validate, and simulate HR processes using a drag-and-drop interface.

Built with modern technologies like React Flow, Next.js, TypeScript, and Zustand, this project demonstrates graph-based system design and workflow execution logic.

---

## ✨ Features

- Drag-and-drop workflow builder (React Flow)
- Custom node types:
  - Start Node
  - Task Node
  - Approval Node
  - Automated Node
  - End Node
- Dynamic node configuration panel
- Graph-based validation system
- Workflow simulation engine (step-by-step execution)
- Clean modular architecture

---

## 🛠️ Tech Stack

- Next.js (App Router)
- TypeScript
- React Flow (@xyflow/react)
- Zustand (State Management)
- Tailwind CSS

---

## 🧠 Workflow Engine Design

The workflow is internally represented as a **directed graph**:

- Nodes → workflow steps  
- Edges → transitions between steps  

### Validation Engine
- Ensures exactly one Start node  
- Detects cycles (infinite loops)  
- Validates all nodes are connected  
- Ensures End node is reachable  

### Simulation Engine
- Converts workflow into graph structure  
- Traverses using BFS/DFS  
- Executes nodes step-by-step  
- Generates execution logs  

Example:


Step 1: Start Node executed
Step 2: Task assigned
Step 3: Approval pending


---

## 📂 Project Structure


src/
├── components/ # UI components (nodes, panels)
├── store/ # Zustand state management
├── utils/ # Graph + simulation logic
├── api/ # Mock API layer
└── types/ # TypeScript definitions


---

## ▶️ Getting Started

```bash
npm install
npm run dev
📸 Demo

(Add screenshots here)

🔮 Future Improvements
Undo / Redo support
Export / Import workflow
Backend integration
Real-time collaboration

---

## 🚀 Now fix your Git issue

After replacing README:

```powershell
git add README.md
git commit -m "Fix README and resolve merge conflict"
git push -u origin main