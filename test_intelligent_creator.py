#!/usr/bin/env python3
"""
Test script for the Intelligent Agent Creator
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.ai_agent_orchestration_hub.intelligent_agent_creator import intelligent_agent_creator

def test_agent_creation():
    """Test NLP-based agent creation"""
    print("🧪 Testing Intelligent Agent Creator")
    print("=" * 50)
    
    # Test cases for agent creation
    test_inputs = [
        "Create a marketing expert who specializes in social media campaigns",
        "I need a data analyst with machine learning expertise",
        "Build a project coordinator for software development teams",
        "Create a research specialist focused on competitive intelligence",
        "I want a quality assurance expert for testing and validation"
    ]
    
    print("1. Testing Agent Creation from NLP...")
    for i, user_input in enumerate(test_inputs, 1):
        print(f"\n   Test {i}: '{user_input}'")
        try:
            agent_spec = intelligent_agent_creator.create_agent_from_nlp(user_input)
            print(f"   ✅ Created agent: {agent_spec.name}")
            print(f"      Role: {agent_spec.role}")
            print(f"      Expertise: {agent_spec.expertise_level}")
            print(f"      Tools: {len(agent_spec.tools)} tools")
            print(f"      Specializations: {', '.join(agent_spec.specializations[:3])}")
        except Exception as e:
            print(f"   ❌ Failed: {e}")
    
    print("\n2. Testing Task Creation from NLP...")
    task_inputs = [
        "Research the latest trends in artificial intelligence",
        "Create a comprehensive marketing strategy for a new product launch",
        "Analyze competitor pricing and market positioning",
        "Develop a content calendar for social media marketing",
        "Optimize our customer support workflow processes"
    ]
    
    for i, user_input in enumerate(task_inputs, 1):
        print(f"\n   Test {i}: '{user_input}'")
        try:
            task_spec = intelligent_agent_creator.create_task_from_nlp(user_input)
            print(f"   ✅ Created task: {task_spec.name}")
            print(f"      Priority: {task_spec.priority}")
            print(f"      Complexity: {task_spec.complexity}")
            print(f"      Agent: {task_spec.agent}")
            print(f"      Success Criteria: {len(task_spec.success_criteria)} criteria")
        except Exception as e:
            print(f"   ❌ Failed: {e}")
    
    print("\n🎉 Intelligent Agent Creator tests completed!")

if __name__ == "__main__":
    test_agent_creation()