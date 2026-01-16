#!/usr/bin/env python3.11
import json
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
from groq import Groq
from crewai import Agent, Task, Crew, Process
from langchain_groq import ChatGroq

# Load environment variables
env_path = Path(__file__).parent.parent.parent / '.env.local'
load_dotenv(env_path)

def analyze_mission(mission: str) -> dict:
    """Analyze mission to determine required agents and tasks"""
    mission_lower = mission.lower()
    
    # Determine which agents are needed
    needs_research = any(word in mission_lower for word in ['research', 'find', 'search', 'investigate', 'trends', 'latest', 'current'])
    needs_development = any(word in mission_lower for word in ['code', 'develop', 'build', 'implement', 'create', 'program', 'technical', 'analyze'])
    needs_management = any(word in mission_lower for word in ['report', 'comprehensive', 'summarize', 'synthesize', 'organize', 'plan'])
    
    # If nothing specific, use all agents
    if not (needs_research or needs_development or needs_management):
        needs_research = needs_development = needs_management = True
    
    # Always include management if multiple agents
    if (needs_research or needs_development) and not needs_management:
        needs_management = True
    
    return {
        'research': needs_research,
        'development': needs_development,
        'management': needs_management
    }

def main():
    """Main function to execute crew mission"""
    
    # Read input from stdin
    input_data = sys.stdin.read()
    data = json.loads(input_data)
    mission = data.get('mission', '')
    
    if not mission:
        print(json.dumps({"type": "error", "message": "Mission is required"}))
        return
    
    # Initialize Groq with OpenAI GPT-OSS model
    groq_api_key = os.environ.get("GROQ_API_KEY")
    if not groq_api_key:
        print(json.dumps({"type": "error", "message": "GROQ_API_KEY not found"}))
        return
    
    # Set environment variable for CrewAI
    os.environ["GROQ_API_KEY"] = groq_api_key
    
    print(json.dumps({"type": "log", "agent": "System", "message": "🚀 Initializing NexusAgents..."}))
    sys.stdout.flush()
    
    # Analyze mission to determine required agents
    required_agents = analyze_mission(mission)
    
    print(json.dumps({"type": "log", "agent": "System", "message": f"🎯 Mission Analysis: Research={required_agents['research']}, Development={required_agents['development']}, Management={required_agents['management']}"}))
    sys.stdout.flush()
    
    agents = []
    tasks = []
    
    # Create only required agents
    if required_agents['research']:
        researcher = Agent(
            role='Research Specialist',
            goal='Search, analyze and gather comprehensive information',
            backstory='Expert researcher with deep analytical skills and ability to find relevant information',
            llm="groq/openai/gpt-oss-120b",
            verbose=False
        )
        agents.append(researcher)
        print(json.dumps({"type": "log", "agent": "System", "message": "✅ Researcher Agent initialized"}))
        sys.stdout.flush()
        
        research_task = Task(
            description=f"Research and analyze: {mission}. Provide comprehensive insights with key findings.",
            agent=researcher,
            expected_output="Detailed research findings with sources and insights"
        )
        tasks.append(research_task)
    
    if required_agents['development']:
        developer = Agent(
            role='Code Generator & Developer',
            goal='Write actual, production-ready code with complete implementations',
            backstory='Expert full-stack developer who writes clean, working code with proper structure, error handling, and best practices. Always provides complete, runnable code files.',
            llm="groq/openai/gpt-oss-120b",
            verbose=False
        )
        agents.append(developer)
        print(json.dumps({"type": "log", "agent": "System", "message": "✅ Developer Agent initialized"}))
        sys.stdout.flush()
        
        dev_task = Task(
            description=f"""Write complete, production-ready code for: {mission}
            
            IMPORTANT: Generate actual code files, not descriptions or plans.
            - Provide full implementations with all necessary imports
            - Include proper error handling and validation
            - Add comments explaining key sections
            - Use modern best practices and patterns
            - Format code properly with syntax highlighting markers (```language)
            - Include multiple files if needed (components, utilities, configs)
            
            Output should be ready-to-use code that can be copied and run immediately.""",
            agent=developer,
            expected_output="Complete, working code files with proper structure and documentation"
        )
        tasks.append(dev_task)
    
    if required_agents['management']:
        manager = Agent(
            role='Code Organizer & Documentation Lead',
            goal='Organize code output clearly with proper file structure and usage instructions',
            backstory='Technical lead who presents code in a clear, organized manner with file names, structure, and setup instructions',
            llm="groq/openai/gpt-oss-120b",
            verbose=False
        )
        agents.append(manager)
        print(json.dumps({"type": "log", "agent": "System", "message": "✅ Manager Agent initialized"}))
        sys.stdout.flush()
        
        manager_task = Task(
            description=f"""Organize the code output for: {mission}
            
            Present the code in a clear, structured format:
            - List all files with their paths (e.g., src/App.tsx, package.json)
            - Show complete code for each file with proper syntax highlighting
            - Include setup/installation instructions
            - Add usage examples
            - Keep it concise and focused on the code
            
            Format: File paths as headers, then code blocks, then brief setup instructions.""",
            agent=manager,
            expected_output="Well-organized code files with clear structure and setup instructions"
        )
        tasks.append(manager_task)
    
    print(json.dumps({"type": "log", "agent": "System", "message": f"📋 {len(tasks)} task(s) configured with {len(agents)} agent(s)"}))
    sys.stdout.flush()
    
    # Create and execute crew
    crew = Crew(
        agents=agents,
        tasks=tasks,
        process=Process.sequential,
        verbose=False
    )
    
    print(json.dumps({"type": "log", "agent": "Manager", "message": f"🎯 Mission started: {mission}"}))
    sys.stdout.flush()
    
    try:
        if required_agents['research']:
            print(json.dumps({"type": "log", "agent": "Researcher", "message": "🔍 Analyzing information..."}))
            sys.stdout.flush()
        
        result = crew.kickoff()
        
        if required_agents['development']:
            print(json.dumps({"type": "log", "agent": "Developer", "message": "⚙️ Processing technical insights..."}))
            sys.stdout.flush()
        
        if required_agents['management']:
            print(json.dumps({"type": "log", "agent": "Manager", "message": "📊 Synthesizing results..."}))
            sys.stdout.flush()
        
        # Stream the final result
        result_text = str(result)
        
        # Split result into chunks
        chunk_size = 100
        for i in range(0, len(result_text), chunk_size):
            chunk = result_text[i:i+chunk_size]
            print(json.dumps({"type": "artifact", "content": chunk}))
            sys.stdout.flush()
        
        print(json.dumps({"type": "log", "agent": "Manager", "message": "✨ Mission completed successfully!"}))
        sys.stdout.flush()
        
        print(json.dumps({"type": "complete"}))
        sys.stdout.flush()
        
    except Exception as e:
        print(json.dumps({"type": "error", "message": str(e)}))
        sys.stdout.flush()

if __name__ == "__main__":
    main()
