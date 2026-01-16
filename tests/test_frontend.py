#!/usr/bin/env python3
"""
Test script to verify the frontend and backend integration
"""
import sys
import os
import subprocess
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

def test_frontend_build():
    """Test if the frontend can build successfully"""
    print("🧪 Testing frontend build...")
    
    # Get the project root directory
    project_root = Path(__file__).parent.parent
    frontend_dir = project_root / "frontend"
    if not frontend_dir.exists():
        print("❌ Frontend directory not found")
        return False
    
    try:
        # Check if dependencies are installed
        if not (frontend_dir / "node_modules").exists():
            print("📦 Installing frontend dependencies...")
            result = subprocess.run(
                ["npm", "install"], 
                cwd=frontend_dir, 
                capture_output=True, 
                text=True
            )
            if result.returncode != 0:
                print(f"❌ Failed to install dependencies: {result.stderr}")
                return False
        
        # Test build
        print("🔨 Testing build process...")
        result = subprocess.run(
            ["npm", "run", "build"], 
            cwd=frontend_dir, 
            capture_output=True, 
            text=True
        )
        
        if result.returncode == 0:
            print("✅ Frontend build successful")
            return True
        else:
            print(f"❌ Frontend build failed: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing frontend: {e}")
        return False

def test_backend_api():
    """Test if the backend API can start"""
    print("🧪 Testing backend API...")
    
    try:
        # Test API import
        from src.ai_agent_orchestration_hub.api import app
        from src.ai_agent_orchestration_hub.crew import AiAgentOrchestrationHubCrew
        
        print("✅ Backend imports successful")
        
        # Test crew instantiation
        crew_instance = AiAgentOrchestrationHubCrew()
        crew = crew_instance.crew()
        
        print(f"✅ Crew created with {len(crew.agents)} agents")
        return True
        
    except Exception as e:
        print(f"❌ Backend test failed: {e}")
        return False

def check_dependencies():
    """Check if all required dependencies are available"""
    print("🧪 Checking dependencies...")
    
    # Check Python dependencies
    try:
        import fastapi
        import uvicorn
        import websockets
        print("✅ Python dependencies available")
    except ImportError as e:
        print(f"❌ Missing Python dependency: {e}")
        return False
    
    # Check Node.js
    try:
        result = subprocess.run(["node", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ Node.js available: {result.stdout.strip()}")
        else:
            print("❌ Node.js not available")
            return False
    except FileNotFoundError:
        print("❌ Node.js not found")
        return False
    
    # Check npm
    try:
        result = subprocess.run(["npm", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print(f"✅ npm available: {result.stdout.strip()}")
        else:
            print("❌ npm not available")
            return False
    except FileNotFoundError:
        print("❌ npm not found")
        return False
    
    return True

def main():
    """Main test function"""
    print("🚀 AI Agent Orchestration Hub - Frontend Test Suite")
    print("=" * 60)
    
    all_tests_passed = True
    
    # Test 1: Dependencies
    if not check_dependencies():
        all_tests_passed = False
    
    print()
    
    # Test 2: Backend API
    if not test_backend_api():
        all_tests_passed = False
    
    print()
    
    # Test 3: Frontend Build
    if not test_frontend_build():
        all_tests_passed = False
    
    print()
    print("=" * 60)
    
    if all_tests_passed:
        print("🎉 All tests passed! The application is ready to run.")
        print()
        print("To start the application:")
        print("  Full stack: uv run python start_servers.py")
        print("  Backend only: uv run python start_api.py")
        print("  Frontend only: cd frontend && npm start")
        print()
        print("🌐 Frontend will be available at: http://localhost:3000")
        print("📡 Backend API will be available at: http://localhost:8000")
        print("📚 API Documentation: http://localhost:8000/docs")
    else:
        print("❌ Some tests failed. Please check the errors above.")
        sys.exit(1)

if __name__ == "__main__":
    main()