#!/usr/bin/env python3
"""
Test script for NLP-based agent and task creation API endpoints
"""
import requests
import json
import time

BASE_URL = "http://localhost:8000"

def test_agent_creation():
    """Test the NLP-based agent creation endpoint"""
    print("🧪 Testing NLP Agent Creation API")
    print("=" * 50)
    
    test_cases = [
        {
            "description": "Create a marketing expert who specializes in social media campaigns and brand management",
            "expected_role": "Marketing"
        },
        {
            "description": "I need a data scientist with machine learning and statistical analysis expertise",
            "expected_role": "Research"
        },
        {
            "description": "Build a project coordinator for agile software development teams",
            "expected_role": "Technology"
        }
    ]
    
    created_agents = []
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{i}. Testing: '{test_case['description']}'")
        
        try:
            response = requests.post(
                f"{BASE_URL}/agents/create",
                json={"description": test_case["description"]},
                timeout=10
            )
            
            if response.status_code == 200:
                agent_data = response.json()
                created_agents.append(agent_data)
                print(f"   ✅ Agent created successfully!")
                print(f"      ID: {agent_data['agent_id']}")
                print(f"      Name: {agent_data['name']}")
                print(f"      Role: {agent_data['role']}")
                print(f"      Expertise: {agent_data['expertise_level']}")
                print(f"      Tools: {len(agent_data['tools'])} tools")
                print(f"      Specializations: {', '.join(agent_data['specializations'][:3])}")
            else:
                print(f"   ❌ Failed with status {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return created_agents

def test_task_creation():
    """Test the NLP-based task creation endpoint"""
    print("\n🧪 Testing NLP Task Creation API")
    print("=" * 50)
    
    test_cases = [
        "Research the latest trends in artificial intelligence and machine learning",
        "Create a comprehensive marketing strategy for a new SaaS product launch",
        "Analyze competitor pricing strategies in the e-commerce market",
        "Develop a content calendar for social media marketing campaigns"
    ]
    
    created_tasks = []
    
    for i, description in enumerate(test_cases, 1):
        print(f"\n{i}. Testing: '{description}'")
        
        try:
            response = requests.post(
                f"{BASE_URL}/tasks/create",
                json={"description": description},
                timeout=10
            )
            
            if response.status_code == 200:
                task_data = response.json()
                created_tasks.append(task_data)
                print(f"   ✅ Task created successfully!")
                print(f"      ID: {task_data['task_id']}")
                print(f"      Name: {task_data['name']}")
                print(f"      Priority: {task_data['priority']}")
                print(f"      Complexity: {task_data['complexity']}")
                print(f"      Agent: {task_data['agent']}")
                print(f"      Success Criteria: {len(task_data['success_criteria'])} criteria")
                print(f"      Deliverables: {len(task_data['deliverables'])} deliverables")
            else:
                print(f"   ❌ Failed with status {response.status_code}: {response.text}")
                
        except Exception as e:
            print(f"   ❌ Error: {e}")
    
    return created_tasks

def test_list_created_items():
    """Test listing created agents and tasks"""
    print("\n🧪 Testing List Created Items API")
    print("=" * 50)
    
    # Test listing created agents
    try:
        response = requests.get(f"{BASE_URL}/agents/created", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} created agents")
            for agent in data['agents'][:3]:  # Show first 3
                print(f"   - {agent['name']}: {agent['role']}")
        else:
            print(f"❌ Failed to get agents: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting agents: {e}")
    
    # Test listing created tasks
    try:
        response = requests.get(f"{BASE_URL}/tasks/created", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Found {data['total']} created tasks")
            for task in data['tasks'][:3]:  # Show first 3
                print(f"   - {task['name']}: {task['priority']} priority")
        else:
            print(f"❌ Failed to get tasks: {response.status_code}")
    except Exception as e:
        print(f"❌ Error getting tasks: {e}")

def test_task_execution():
    """Test executing a created task"""
    print("\n🧪 Testing Task Execution API")
    print("=" * 50)
    
    # First create a simple task
    try:
        response = requests.post(
            f"{BASE_URL}/tasks/create",
            json={"description": "Quick test task for execution"},
            timeout=10
        )
        
        if response.status_code == 200:
            task_data = response.json()
            task_id = task_data['task_id']
            print(f"✅ Created test task: {task_id}")
            
            # Now execute it
            exec_response = requests.post(
                f"{BASE_URL}/tasks/execute/{task_id}",
                timeout=10
            )
            
            if exec_response.status_code == 200:
                exec_data = exec_response.json()
                print(f"✅ Task execution started!")
                print(f"   Execution ID: {exec_data['execution_task_id']}")
                print(f"   Status: {exec_data['status']}")
                print(f"   Message: {exec_data['message']}")
            else:
                print(f"❌ Failed to execute task: {exec_response.status_code}")
        else:
            print(f"❌ Failed to create test task: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Run all tests"""
    print("🚀 Testing AI Agent Orchestration Hub NLP APIs")
    print("=" * 60)
    
    # Wait a moment for server to be ready
    time.sleep(2)
    
    # Test agent creation
    created_agents = test_agent_creation()
    
    # Test task creation
    created_tasks = test_task_creation()
    
    # Test listing items
    test_list_created_items()
    
    # Test task execution
    test_task_execution()
    
    print("\n🎉 All NLP API tests completed!")
    print(f"Created {len(created_agents)} agents and {len(created_tasks)} tasks")

if __name__ == "__main__":
    main()