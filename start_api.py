#!/usr/bin/env python3
"""
Simple script to start just the FastAPI backend server
"""
import subprocess
import sys

def main():
    print("🚀 Starting AI Agent Orchestration Hub API Server")
    print("📡 Server will be available at: http://localhost:8000")
    print("📚 API Documentation: http://localhost:8000/docs")
    print("🔄 Interactive API: http://localhost:8000/redoc")
    print("🌐 WebSocket Endpoint: ws://localhost:8000/ws")
    print("\n✨ Features:")
    print("  • Real-time execution monitoring")
    print("  • Multi-agent orchestration")
    print("  • Live task progress tracking")
    print("  • WebSocket-powered updates")
    print("\nPress Ctrl+C to stop the server")
    
    try:
        subprocess.run([
            "uv", "run", "uvicorn", 
            "src.ai_agent_orchestration_hub.api:app",
            "--host", "0.0.0.0",
            "--port", "8000",
            "--reload"
        ])
    except KeyboardInterrupt:
        print("\n🛑 Server stopped")

if __name__ == "__main__":
    main()