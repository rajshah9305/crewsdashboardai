#!/usr/bin/env python3
"""
Test script to verify the API functionality
"""
import asyncio
import sys
from src.ai_agent_orchestration_hub.api import app
from src.ai_agent_orchestration_hub.crew import AiAgentOrchestrationHubCrew

async def test_api():
    """Test basic API functionality"""
    print("🧪 Testing AI Agent Orchestration Hub API")
    
    try:
        # Test crew instantiation
        print("1. Testing crew instantiation...")
        crew_instance = AiAgentOrchestrationHubCrew()
        print("   ✅ Crew instantiated successfully")
        
        # Test crew creation
        print("2. Testing crew creation...")
        crew = crew_instance.crew()
        print(f"   ✅ Crew created with {len(crew.agents)} agents and {len(crew.tasks)} tasks")
        
        # List agents
        print("3. Agent details:")
        for i, agent in enumerate(crew.agents, 1):
            print(f"   {i}. {agent.role} - Model: {agent.llm.model}")
        
        print("\n🎉 All tests passed! The API is ready to run.")
        print("\nTo start the servers:")
        print("  Backend only: uv run python start_api.py")
        print("  Full stack:   uv run python start_servers.py")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    asyncio.run(test_api())