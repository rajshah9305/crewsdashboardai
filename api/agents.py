"""Agents endpoint - List and manage agents."""
from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
from urllib.parse import urlparse, parse_qs

# Agent configurations
AGENT_CONFIGS = [
    {
        "name": "orchestration_coordinator",
        "role": "Orchestration Coordinator",
        "goal": "Analyze incoming tasks and determine optimal agent composition, task breakdown, and execution strategy.",
        "status": "ready",
        "total_tasks_completed": 0
    },
    {
        "name": "task_allocation_manager",
        "role": "Task Allocation Manager",
        "goal": "Dynamically assign and reallocate tasks among available agents based on capabilities and workload.",
        "status": "ready",
        "total_tasks_completed": 0
    },
    {
        "name": "research_intelligence_agent",
        "role": "Research Intelligence Agent",
        "goal": "Conduct deep research and information gathering from academic sources, websites, and documents.",
        "status": "ready",
        "total_tasks_completed": 0
    },
    {
        "name": "data_processing_specialist",
        "role": "Data Processing Specialist",
        "goal": "Process, transform, and analyze data from multiple sources for workflow pipelines.",
        "status": "ready",
        "total_tasks_completed": 0
    },
    {
        "name": "execution_monitor",
        "role": "Execution Monitor",
        "goal": "Monitor execution of all agents, track performance metrics, and identify bottlenecks.",
        "status": "ready",
        "total_tasks_completed": 0
    },
    {
        "name": "quality_assurance_specialist",
        "role": "Quality Assurance Specialist",
        "goal": "Validate outputs and deliverables, ensure quality standards and completeness.",
        "status": "ready",
        "total_tasks_completed": 0
    }
]


def get_agents():
    """Get all agents with current status."""
    agents = []
    for config in AGENT_CONFIGS:
        agents.append({
            **config,
            "last_activity": datetime.now().isoformat(),
            "current_task": None
        })
    return agents


def get_agent_by_name(name):
    """Get a specific agent by name."""
    for config in AGENT_CONFIGS:
        if config["name"] == name:
            return {
                **config,
                "last_activity": datetime.now().isoformat(),
                "current_task": None
            }
    return None


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        
        # /api/agents - List all agents
        if len(path_parts) == 1 or (len(path_parts) == 2 and path_parts[1] == ''):
            self.send_response(200)
            self.end_headers()
            agents = get_agents()
            response = {"agents": agents, "total": len(agents)}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # /api/agents/created - List created agents (empty for serverless)
        if len(path_parts) >= 2 and path_parts[1] == 'created':
            self.send_response(200)
            self.end_headers()
            response = {"agents": [], "total": 0, "message": "Created agents are stored in session"}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # /api/agents/{agent_name} - Get specific agent
        if len(path_parts) >= 2:
            agent_name = path_parts[1]
            agent = get_agent_by_name(agent_name)
            
            if agent:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(agent).encode())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Agent not found"}).encode())
            return
        
        self.send_response(400)
        self.end_headers()
        self.wfile.write(json.dumps({"error": "Invalid request"}).encode())

    def do_POST(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        
        # /api/agents/create - Create agent from NLP
        if len(path_parts) >= 2 and path_parts[1] == 'create':
            content_length = int(self.headers.get('Content-Length', 0))
            body = self.rfile.read(content_length).decode('utf-8')
            
            try:
                data = json.loads(body) if body else {}
                description = data.get('description', '')
                
                if not description:
                    self.send_response(400)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Description is required"}).encode())
                    return
                
                # Generate agent from description (simplified for serverless)
                import uuid
                agent_id = str(uuid.uuid4())
                
                # Extract role from description
                role = "Custom Agent"
                if "research" in description.lower():
                    role = "Research Specialist"
                elif "data" in description.lower():
                    role = "Data Analyst"
                elif "marketing" in description.lower():
                    role = "Marketing Expert"
                elif "project" in description.lower():
                    role = "Project Coordinator"
                elif "quality" in description.lower():
                    role = "Quality Assurance"
                
                response = {
                    "agent_id": agent_id,
                    "name": f"agent_{agent_id[:8]}",
                    "role": role,
                    "goal": description,
                    "backstory": f"An AI agent specialized in: {description}",
                    "tools": ["web_search", "file_read", "data_analysis"],
                    "specializations": [role.lower().replace(" ", "_")],
                    "collaboration_style": "cooperative",
                    "expertise_level": "intermediate",
                    "created_at": datetime.now().isoformat()
                }
                
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(response).encode())
                return
                
            except json.JSONDecodeError:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
                return
        
        self.send_response(400)
        self.end_headers()
        self.wfile.write(json.dumps({"error": "Invalid request"}).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
