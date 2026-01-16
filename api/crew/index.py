from http.server import BaseHTTPRequestHandler
import json
import os
from groq import Groq
from crewai import Agent, Task, Crew, Process
from crewai_tools import SerperDevTool, BrowserbaseLoadTool
from langchain_groq import ChatGroq
import sys

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            mission = data.get('mission', '')
            
            if not mission:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Mission is required'}).encode())
                return
            
            # Set up streaming response
            self.send_response(200)
            self.send_header('Content-type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()
            
            # Execute crew and stream results
            for event in execute_crew_mission(mission):
                self.wfile.write(f"data: {json.dumps(event)}\n\n".encode())
                self.wfile.flush()
            
            # Send completion event
            self.wfile.write(f"data: {json.dumps({'type': 'complete'})}\n\n".encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def execute_crew_mission(mission: str):
    """Execute CrewAI mission with streaming updates"""
    
    # Initialize Groq LLM
    llm = ChatGroq(
        api_key=os.environ.get("GROQ_API_KEY"),
        model="llama-3.3-70b-versatile",
        temperature=1,
        max_tokens=32768
    )
    
    # Initialize tools
    search_tool = SerperDevTool(api_key=os.environ.get("SERPER_API_KEY"))
    
    # Create custom browser tool (simplified for serverless)
    class SimpleBrowserTool:
        def __init__(self):
            self.api_key = os.environ.get("BROWSERLESS_API_KEY")
        
        def run(self, url: str):
            import requests
            try:
                response = requests.get(
                    f"https://chrome.browserless.io/content?token={self.api_key}",
                    params={"url": url}
                )
                return response.text[:5000]  # Limit content
            except Exception as e:
                return f"Error fetching content: {str(e)}"
    
    browser_tool = SimpleBrowserTool()
    
    yield {"type": "log", "agent": "System", "message": "🚀 Initializing NexusAgents..."}
    
    # Define Agents
    researcher = Agent(
        role='Research Specialist',
        goal='Search and gather comprehensive information from the web',
        backstory='Expert researcher with deep knowledge of information retrieval',
        tools=[search_tool],
        llm=llm,
        verbose=True,
        allow_delegation=False
    )
    
    yield {"type": "log", "agent": "System", "message": "✅ Researcher Agent initialized"}
    
    developer = Agent(
        role='Developer & Content Analyst',
        goal='Analyze documentation and extract technical insights',
        backstory='Senior developer skilled in parsing and understanding technical content',
        llm=llm,
        verbose=True,
        allow_delegation=False
    )
    
    yield {"type": "log", "agent": "System", "message": "✅ Developer Agent initialized"}
    
    manager = Agent(
        role='Mission Coordinator',
        goal='Orchestrate the team and synthesize findings into actionable results',
        backstory='Strategic leader who coordinates complex multi-agent operations',
        llm=llm,
        verbose=True,
        allow_delegation=True
    )
    
    yield {"type": "log", "agent": "System", "message": "✅ Manager Agent initialized"}
    
    # Define Tasks
    research_task = Task(
        description=f"""Research the following mission: {mission}
        
        Gather comprehensive information including:
        - Key facts and data points
        - Recent developments
        - Relevant resources and references
        """,
        agent=researcher,
        expected_output="Detailed research findings with sources"
    )
    
    analysis_task = Task(
        description="""Analyze the research findings and extract key insights.
        
        Focus on:
        - Technical details
        - Practical applications
        - Important considerations
        """,
        agent=developer,
        expected_output="Technical analysis and insights"
    )
    
    synthesis_task = Task(
        description="""Synthesize all findings into a comprehensive, actionable report.
        
        Include:
        - Executive summary
        - Key findings
        - Recommendations
        - Next steps
        """,
        agent=manager,
        expected_output="Complete mission report with recommendations"
    )
    
    yield {"type": "log", "agent": "System", "message": "📋 Tasks configured"}
    
    # Create and execute crew
    crew = Crew(
        agents=[researcher, developer, manager],
        tasks=[research_task, analysis_task, synthesis_task],
        process=Process.sequential,
        verbose=True
    )
    
    yield {"type": "log", "agent": "Manager", "message": "🎯 Mission started: " + mission}
    
    # Execute with streaming
    try:
        yield {"type": "log", "agent": "Researcher", "message": "🔍 Searching for information..."}
        
        result = crew.kickoff()
        
        yield {"type": "log", "agent": "Developer", "message": "⚙️ Analyzing findings..."}
        yield {"type": "log", "agent": "Manager", "message": "📊 Synthesizing results..."}
        
        # Stream the final result
        result_text = str(result)
        
        # Split result into chunks for streaming effect
        chunk_size = 100
        for i in range(0, len(result_text), chunk_size):
            chunk = result_text[i:i+chunk_size]
            yield {"type": "artifact", "content": chunk}
        
        yield {"type": "log", "agent": "Manager", "message": "✨ Mission completed successfully!"}
        
    except Exception as e:
        yield {"type": "error", "message": f"Error during execution: {str(e)}"}
