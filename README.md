# AI Agent Orchestration Hub

**Enterprise-Grade Multi-Agent Intelligence Platform**

Welcome to the AI Agent Orchestration Hub, a professional-grade platform powered by [CrewAI](https://crewai.com) for orchestrating intelligent AI agents. This enterprise-ready solution enables seamless collaboration between specialized AI agents to handle complex business tasks with unprecedented efficiency and transparency.

## ✨ Key Features

### 🎯 **Multi-Agent Orchestration**
- **6 Specialized AI Agents** working in perfect harmony
- **Real-time coordination** and task handoffs
- **Intelligent workload distribution** across agents
- **Fault-tolerant execution** with automatic recovery

### 🌐 **Professional Web Interface**
- **Modern React-based UI** with enterprise design system
- **Real-time dashboard** with live metrics and KPIs
- **Interactive task management** with filtering and search
- **Live execution monitoring** with detailed progress tracking
- **Responsive design** optimized for desktop and mobile

### 📊 **Advanced Monitoring & Analytics**
- **Real-time WebSocket updates** for instant feedback
- **Comprehensive execution logs** with detailed tracing
- **Performance metrics** and efficiency tracking
- **System health monitoring** with resource utilization
- **Historical data analysis** and trend visualization

### 🚀 **Enterprise-Ready Architecture**
- **FastAPI backend** with automatic API documentation
- **WebSocket-powered** real-time communication
- **Scalable microservices** architecture
- **Professional error handling** and logging
- **Security-first design** with CORS and validation

## 🏗️ Architecture Overview

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   React Frontend    │    │   FastAPI Backend    │    │   CrewAI Agents     │
│   (Port 3000)       │◄──►│   (Port 8000)        │◄──►│   Multi-Agent       │
│                     │    │                      │    │   Orchestration     │
│ • Dashboard         │    │ • REST API           │    │                     │
│ • Live Monitoring   │    │ • WebSocket Server   │    │ • 6 Specialized     │
│ • Task Management   │    │ • Real-time Updates  │    │   Agents            │
│ • Agent Overview    │    │ • Execution Tracking │    │ • Task Processing   │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
         │                           │                           │
         │                           │                           │
    WebSocket                   REST API                 Agent Execution
    Real-time                   Task Management          Task Processing
    Updates                                              
```

## 🤖 AI Agent Workforce

Our platform deploys **6 specialized AI agents**, each optimized for specific business functions:

| Agent | Role | Specialization | Model |
|-------|------|----------------|-------|
| 🎯 **Orchestration Coordinator** | Strategic Planning | Task analysis, workflow design, resource allocation | Groq Llama 3.3 70B |
| 📊 **Task Allocation Manager** | Resource Management | Dynamic task distribution, load balancing | Groq Llama 3.3 70B |
| � **Research Intelligence Agent** | Information Gathering | Data collection, source analysis, intelligence synthesis | Groq Llama 3.3 70B |
| ⚙️ **Data Processing Specialist** | Data Engineering | Data transformation, quality validation, pipeline management | Groq Llama 3.3 70B |
| � **Execution Monitor** | Performance Tracking | Progress monitoring, bottleneck identification, analytics | Groq Llama 3.3 70B |
| ✅ **Quality Assurance Specialist** | Quality Control | Output validation, compliance checking, certification | Groq Llama 3.3 70B |

## 🚀 Quick Start

### Prerequisites

- **Python 3.10-3.13** with [UV](https://docs.astral.sh/uv/) package manager
- **Node.js 16+** with npm
- **Groq API Key** for LLM access

### Installation

1. **Clone and setup the project:**
```bash
git clone <repository-url>
cd ai_agent_orchestration_hub
uv sync
```

2. **Install frontend dependencies:**
```bash
cd frontend
npm install
cd ..
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env and add your GROQ_API_KEY
```

### Running the Application

#### 🌟 **Full Stack (Recommended)**
```bash
uv run python start_servers.py
```
- 🌐 **Frontend UI**: http://localhost:3000
- 📡 **Backend API**: http://localhost:8000
- 📚 **API Docs**: http://localhost:8000/docs

#### 🔧 **Backend Only**
```bash
uv run python start_api.py
```

#### 🎨 **Frontend Only**
```bash
cd frontend && npm start
```

#### 🖥️ **Traditional CLI**
```bash
uv run crewai run    # Execute tasks
uv run crewai chat   # Interactive mode
```

## 💼 Professional Features

### 📊 **Executive Dashboard**
- **Real-time KPIs** and performance metrics
- **Agent utilization** and efficiency tracking
- **Task completion rates** and success analytics
- **System health** monitoring with resource usage
- **Historical trends** and predictive insights

### 🎛️ **Advanced Task Management**
- **Priority-based** task scheduling
- **Category-based** organization and filtering
- **Real-time progress** tracking with live updates
- **Detailed execution logs** with agent activity
- **Result management** with export capabilities

### 👥 **Agent Workforce Management**
- **Individual agent** performance monitoring
- **Workload distribution** visualization
- **Capacity planning** and resource optimization
- **Agent health** and status tracking
- **Performance benchmarking** and analytics

### 🔍 **Live Execution Monitoring**
- **Real-time agent activity** with step-by-step tracking
- **Interactive execution logs** with filtering and search
- **Progress visualization** with completion percentages
- **Error tracking** and debugging capabilities
- **Performance profiling** and optimization insights

## 🛠️ Development & Testing

### Run Tests
```bash
# Test backend functionality
uv run python test_api.py

# Test frontend build
uv run python test_frontend.py

# Full integration test
uv run python -m pytest tests/
```

### Development Mode
```bash
# Backend with hot reload
uv run uvicorn src.ai_agent_orchestration_hub.api:app --reload

# Frontend with hot reload
cd frontend && npm start
```

## 📈 Use Cases

### 🏢 **Enterprise Applications**
- **Market Research & Analysis** - Comprehensive competitive intelligence
- **Business Process Automation** - Complex workflow orchestration
- **Data Pipeline Management** - Multi-source data processing
- **Quality Assurance** - Automated testing and validation
- **Strategic Planning** - Multi-factor analysis and recommendations

### 🔬 **Research & Development**
- **Literature Reviews** - Academic paper analysis and synthesis
- **Technical Documentation** - Automated documentation generation
- **Code Analysis** - Multi-repository code review and optimization
- **Compliance Auditing** - Regulatory compliance checking

### 📊 **Data & Analytics**
- **Multi-source Data Integration** - Complex ETL processes
- **Real-time Analytics** - Live data processing and insights
- **Predictive Modeling** - Multi-agent model development
- **Report Generation** - Automated business reporting

## 🔧 Configuration

### Agent Configuration
Customize agents in `src/ai_agent_orchestration_hub/config/agents.yaml`:
```yaml
orchestration_coordinator:
  role: Orchestration Coordinator
  goal: Analyze and optimize task execution strategies
  backstory: Expert workflow architect with deep AI orchestration knowledge
```

### Task Configuration
Define task templates in `src/ai_agent_orchestration_hub/config/tasks.yaml`:
```yaml
strategic_analysis:
  description: Perform comprehensive strategic analysis
  expected_output: Detailed strategic recommendations with actionable insights
  agent: orchestration_coordinator
```

## 🌐 API Reference

### REST Endpoints
- `GET /` - API status and health check
- `GET /agents` - List all agents with current status
- `POST /tasks` - Create and execute new tasks
- `GET /tasks` - Retrieve all tasks with filtering
- `GET /tasks/{id}` - Get specific task details
- `GET /tasks/{id}/logs` - Detailed execution logs
- `WS /ws` - WebSocket for real-time updates

### WebSocket Events
- `task_created` - New task initiated
- `task_started` - Task execution began
- `execution_log` - Real-time execution updates
- `task_completed` - Task finished successfully
- `agent_heartbeat` - Agent status updates

## 🔒 Security & Compliance

- **API Key Authentication** for LLM services
- **CORS Configuration** for secure cross-origin requests
- **Input Validation** with Pydantic models
- **Error Handling** with detailed logging
- **Rate Limiting** and resource protection

## 📚 Documentation

- **API Documentation**: http://localhost:8000/docs (Swagger UI)
- **Interactive API**: http://localhost:8000/redoc (ReDoc)
- **WebSocket Testing**: Built-in connection testing
- **Agent Specifications**: Detailed agent role definitions

## 🤝 Support & Community

- **Documentation**: [CrewAI Docs](https://docs.crewai.com)
- **GitHub**: [CrewAI Repository](https://github.com/joaomdmoura/crewai)
- **Discord**: [Join Community](https://discord.com/invite/X4JWnZnxPb)
- **Support**: [Get Help](https://chatg.pt/DWjSBZn)

## 📄 License

This project is built on the CrewAI framework. Please refer to the respective licenses for usage terms.

---

**Transform your business operations with intelligent AI agent orchestration. Deploy, monitor, and scale your AI workforce with enterprise-grade reliability and transparency.**
