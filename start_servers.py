#!/usr/bin/env python3
"""
Startup script to run both backend API and frontend development server
"""
import subprocess
import sys
import time
import os
import signal
from pathlib import Path

def run_backend():
    """Start the FastAPI backend server"""
    print("🚀 Starting FastAPI backend server on http://localhost:8000")
    return subprocess.Popen([
        "uv", "run", "uvicorn", 
        "src.ai_agent_orchestration_hub.api:app",
        "--host", "0.0.0.0",
        "--port", "8000",
        "--reload"
    ])

def run_frontend():
    """Start the React frontend development server"""
    print("🌐 Starting React frontend server on http://localhost:3000")
    frontend_dir = Path("frontend")
    
    # Check if node_modules exists, if not install dependencies
    if not (frontend_dir / "node_modules").exists():
        print("📦 Installing frontend dependencies...")
        subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
    
    # Set environment variables for stable development
    env = os.environ.copy()
    env.update({
        'FAST_REFRESH': 'false',
        'CHOKIDAR_USEPOLLING': 'false',
        'WATCHPACK_POLLING': 'false',
        'WDS_SOCKET_HOST': 'localhost',
        'WDS_SOCKET_PORT': '3000',
        'GENERATE_SOURCEMAP': 'false',
        'WDS_HOT': 'false'
    })
    
    return subprocess.Popen(["npm", "start"], cwd=frontend_dir, env=env)

def main():
    """Main function to start both servers"""
    processes = []
    
    try:
        # Start backend
        backend_process = run_backend()
        processes.append(backend_process)
        
        # Wait a moment for backend to start
        time.sleep(3)
        
        # Start frontend
        frontend_process = run_frontend()
        processes.append(frontend_process)
        
        print("\n" + "="*60)
        print("🎉 AI Agent Orchestration Hub is starting up!")
        print("="*60)
        print("📡 Backend API: http://localhost:8000")
        print("🌐 Frontend UI: http://localhost:3000")
        print("📚 API Docs: http://localhost:8000/docs")
        print("🔄 WebSocket: ws://localhost:8000/ws")
        print("="*60)
        print("\n✨ Features:")
        print("  • Real-time agent monitoring")
        print("  • Live task execution tracking")
        print("  • Multi-agent orchestration")
        print("  • WebSocket-powered updates")
        print("\nPress Ctrl+C to stop all servers")
        
        # Wait for processes
        for process in processes:
            process.wait()
            
    except KeyboardInterrupt:
        print("\n🛑 Shutting down servers...")
        
        # Terminate all processes
        for process in processes:
            if process.poll() is None:  # Process is still running
                process.terminate()
                try:
                    process.wait(timeout=5)
                except subprocess.TimeoutExpired:
                    process.kill()
        
        print("✅ All servers stopped")
        sys.exit(0)
    
    except Exception as e:
        print(f"❌ Error starting servers: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()