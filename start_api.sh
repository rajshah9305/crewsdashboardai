#!/bin/bash
# Start the FastAPI backend server for production
PORT=${PORT:-8000}
uvicorn src.ai_agent_orchestration_hub.api:app --host 0.0.0.0 --port $PORT
