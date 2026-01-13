# AI Agent Orchestration Hub

Multi-agent intelligence platform powered by [CrewAI](https://crewai.com) for orchestrating AI agents to handle complex tasks.

## Features

- **6 Specialized AI Agents** - Orchestration, research, data processing, task allocation, monitoring, and QA
- **Real-time Web Dashboard** - React-based UI with live execution monitoring
- **WebSocket Updates** - Live task progress and agent status
- **NLP Agent Creation** - Create agents and tasks from natural language descriptions

## Architecture

```
┌─────────────────────┐    ┌──────────────────────┐    ┌─────────────────────┐
│   React Frontend    │◄──►│   FastAPI Backend    │◄──►│   CrewAI Agents     │
│   (Port 3000)       │    │   (Port 8000)        │    │                     │
└─────────────────────┘    └──────────────────────┘    └─────────────────────┘
```

## Prerequisites

- Python 3.10-3.13 with [UV](https://docs.astral.sh/uv/)
- Node.js 16+
- Groq API Key

## Quick Start

1. **Setup:**
```bash
git clone <repository-url>
cd ai_agent_orchestration_hub
uv sync
cd frontend && npm install && cd ..
```

2. **Configure:**
```bash
cp .env.example .env
# Add your GROQ_API_KEY to .env
```

3. **Run:**
```bash
# Full stack
uv run python start_servers.py

# Backend only
uv run python start_api.py

# Frontend only
cd frontend && npm start
```

## Endpoints

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs
- WebSocket: ws://localhost:8000/ws

## API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/agents` | GET | List all agents |
| `/agents/create` | POST | Create agent from NLP |
| `/tasks` | GET/POST | List/create tasks |
| `/tasks/{id}` | GET | Get task details |
| `/tasks/{id}/logs` | GET | Get task logs |
| `/ws` | WS | Real-time updates |

## Testing

```bash
uv run python test_api.py
uv run python test_frontend.py
```

## License

Built on [CrewAI](https://github.com/joaomdmoura/crewai). See respective licenses for usage terms.
