from http.server import BaseHTTPRequestHandler
import json
import os
import sys
import traceback

# CrewAI imports
try:
    from crewai import Agent, Task, Crew, Process
    from crewai_tools import SerperDevTool
    from langchain_groq import ChatGroq
except ImportError as e:
    print(f"Import error: {e}")
    # Fallback imports or error handling

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        try:
            # Add CORS headers
            self.send_response(200)
            self.send_header('Content-type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            
            # Parse request data
            content_length = int(self.headers.get('Content-Length', 0))
            if content_length == 0:
                error_event = json.dumps({"type": "error", "message": "No data received"})
                self.wfile.write(f"data: {error_event}\n\n".encode())
                return
                
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8'))
            
            mission = data.get('mission', '').strip()
            
            if not mission:
                error_event = json.dumps({"type": "error", "message": "Mission is required"})
                self.wfile.write(f"data: {error_event}\n\n".encode())
                return
            
            # Execute crew and stream results
            try:
                for event in execute_crew_mission(mission):
                    event_data = f"data: {json.dumps(event)}\n\n"
                    self.wfile.write(event_data.encode())
                    self.wfile.flush()
                
                # Send completion event
                complete_event = json.dumps({'type': 'complete'})
                self.wfile.write(f"data: {complete_event}\n\n".encode())
                
            except Exception as e:
                error_event = json.dumps({"type": "error", "message": f"Execution error: {str(e)}"})
                self.wfile.write(f"data: {error_event}\n\n".encode())
                print(f"Execution error: {traceback.format_exc()}")
            
        except json.JSONDecodeError:
            try:
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': 'Invalid JSON'}).encode())
            except:
                pass
        except Exception as e:
            try:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode())
            except:
                pass
            print(f"Handler error: {traceback.format_exc()}")
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()


def execute_crew_mission(mission: str):
    """Execute CrewAI mission with streaming updates"""
    
    try:
        yield {"type": "log", "agent": "System", "message": "🚀 Initializing NexusAgents..."}
        
        # Check API keys
        groq_key = os.environ.get("GROQ_API_KEY")
        serper_key = os.environ.get("SERPER_API_KEY")
        
        if not groq_key:
            yield {"type": "error", "message": "GROQ_API_KEY not found in environment"}
            return
            
        if not serper_key:
            yield {"type": "error", "message": "SERPER_API_KEY not found in environment"}
            return
        
        # Initialize Groq LLM with error handling
        try:
            llm = ChatGroq(
                api_key=groq_key,
                model="llama-3.1-70b-versatile",  # More stable model
                temperature=0.7,
                max_tokens=4096
            )
            yield {"type": "log", "agent": "System", "message": "✅ LLM initialized"}
        except Exception as e:
            yield {"type": "error", "message": f"Failed to initialize LLM: {str(e)}"}
            return
        
        # Initialize search tool with error handling
        try:
            search_tool = SerperDevTool(api_key=serper_key)
            yield {"type": "log", "agent": "System", "message": "✅ Search tool initialized"}
        except Exception as e:
            yield {"type": "error", "message": f"Failed to initialize search tool: {str(e)}"}
            return
        
        # Define Agents with simpler configuration
        try:
            researcher = Agent(
                role='Research Specialist',
                goal='Search and gather comprehensive information from the web',
                backstory='Expert researcher with deep knowledge of information retrieval',
                tools=[search_tool],
                llm=llm,
                verbose=False,  # Reduce verbosity for serverless
                allow_delegation=False
            )
            yield {"type": "log", "agent": "System", "message": "✅ Researcher Agent initialized"}
            
            analyst = Agent(
                role='Content Analyst',
                goal='Analyze and synthesize information into actionable insights',
                backstory='Senior analyst skilled in parsing and understanding complex information',
                llm=llm,
                verbose=False,
                allow_delegation=False
            )
            yield {"type": "log", "agent": "System", "message": "✅ Analyst Agent initialized"}
            
        except Exception as e:
            yield {"type": "error", "message": f"Failed to initialize agents: {str(e)}"}
            return
        
        # Define Tasks
        try:
            research_task = Task(
                description=f"""Research the following mission: {mission}
                
                Provide comprehensive information including:
                - Key facts and data points
                - Recent developments
                - Relevant resources
                """,
                agent=researcher,
                expected_output="Detailed research findings with sources"
            )
            
            analysis_task = Task(
                description="""Analyze the research findings and create a comprehensive report.
                
                Include:
                - Executive summary
                - Key findings
                - Practical recommendations
                - Next steps
                """,
                agent=analyst,
                expected_output="Complete analysis report with recommendations"
            )
            
            yield {"type": "log", "agent": "System", "message": "📋 Tasks configured"}
            
        except Exception as e:
            yield {"type": "error", "message": f"Failed to configure tasks: {str(e)}"}
            return
        
        # Create and execute crew
        try:
            crew = Crew(
                agents=[researcher, analyst],
                tasks=[research_task, analysis_task],
                process=Process.sequential,
                verbose=False
            )
            
            yield {"type": "log", "agent": "Manager", "message": "🎯 Mission started: " + mission[:100] + "..."}
            
            # Execute crew
            yield {"type": "log", "agent": "Researcher", "message": "🔍 Searching for information..."}
            
            result = crew.kickoff()
            
            yield {"type": "log", "agent": "Analyst", "message": "📊 Analyzing and synthesizing results..."}
            
            # Stream the final result with proper formatting
            result_text = str(result)
            
            # Split by lines to preserve formatting
            lines = result_text.split('\n')
            current_chunk = ''
            
            for line in lines:
                # Add line to current chunk
                current_chunk += line + '\n'
                
                # Send chunk when it reaches a reasonable size or at logical breaks
                if (len(current_chunk) > 200 or 
                    line.strip() == '' or 
                    line.startswith('#') or 
                    line.startswith('```') or
                    line.startswith('##')):
                    
                    if current_chunk.strip():
                        yield {"type": "artifact", "content": current_chunk}
                    current_chunk = ''
            
            # Send any remaining content
            if current_chunk.strip():
                yield {"type": "artifact", "content": current_chunk}
            
            yield {"type": "log", "agent": "Manager", "message": "✨ Mission completed successfully!"}
            
        except Exception as e:
            error_msg = f"Error during crew execution: {str(e)}"
            yield {"type": "error", "message": error_msg}
            print(f"Crew execution error: {traceback.format_exc()}")
            
    except Exception as e:
        error_msg = f"Critical error in mission execution: {str(e)}"
        yield {"type": "error", "message": error_msg}
        print(f"Critical error: {traceback.format_exc()}")
