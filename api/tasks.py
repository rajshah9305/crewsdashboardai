"""Tasks endpoint - Create and manage tasks."""
from http.server import BaseHTTPRequestHandler
import json
from datetime import datetime
from urllib.parse import urlparse
import uuid

# In-memory task storage (resets on each cold start)
# For production, use a database like Vercel KV, Supabase, or PlanetScale
TASKS = {}


def create_task(description, user_id=None):
    """Create a new task."""
    task_id = str(uuid.uuid4())
    
    task = {
        "task_id": task_id,
        "status": "created",
        "description": description,
        "user_id": user_id,
        "created_at": datetime.now().isoformat(),
        "completed_at": None,
        "result": None,
        "execution_log": [
            {
                "timestamp": datetime.now().isoformat(),
                "agent": "system",
                "action": "task_created",
                "message": f"Task created: {description}",
                "status": "info"
            }
        ],
        "current_agent": None,
        "current_step": None,
        "progress": 0
    }
    
    TASKS[task_id] = task
    return task


def get_task(task_id):
    """Get a task by ID."""
    return TASKS.get(task_id)


def get_all_tasks():
    """Get all tasks."""
    return list(TASKS.values())


def create_task_from_nlp(description, available_agents=None):
    """Create a task specification from natural language."""
    task_id = str(uuid.uuid4())
    
    # Determine priority and complexity from description
    priority = "medium"
    complexity = "moderate"
    
    desc_lower = description.lower()
    if any(word in desc_lower for word in ["urgent", "asap", "immediately", "critical"]):
        priority = "high"
    elif any(word in desc_lower for word in ["when possible", "low priority", "eventually"]):
        priority = "low"
    
    if any(word in desc_lower for word in ["simple", "quick", "basic"]):
        complexity = "simple"
    elif any(word in desc_lower for word in ["complex", "comprehensive", "detailed", "thorough"]):
        complexity = "complex"
    
    # Determine best agent
    agent = "orchestration_coordinator"
    if any(word in desc_lower for word in ["research", "analyze", "investigate", "study"]):
        agent = "research_intelligence_agent"
    elif any(word in desc_lower for word in ["data", "process", "transform", "clean"]):
        agent = "data_processing_specialist"
    elif any(word in desc_lower for word in ["quality", "test", "validate", "verify"]):
        agent = "quality_assurance_specialist"
    elif any(word in desc_lower for word in ["monitor", "track", "observe"]):
        agent = "execution_monitor"
    elif any(word in desc_lower for word in ["assign", "allocate", "distribute"]):
        agent = "task_allocation_manager"
    
    task = {
        "task_id": task_id,
        "name": description[:50] + "..." if len(description) > 50 else description,
        "description": description,
        "expected_output": f"Completed analysis and results for: {description}",
        "agent": agent,
        "priority": priority,
        "complexity": complexity,
        "success_criteria": [
            "Task completed successfully",
            "Results meet quality standards",
            "Deliverables provided"
        ],
        "deliverables": [
            "Summary report",
            "Detailed findings",
            "Recommendations"
        ],
        "created_at": datetime.now().isoformat()
    }
    
    return task


class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        
        # /api/tasks - List all tasks
        if len(path_parts) == 1 or (len(path_parts) == 2 and path_parts[1] == ''):
            self.send_response(200)
            self.end_headers()
            tasks = get_all_tasks()
            response = {"tasks": tasks, "total": len(tasks)}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # /api/tasks/created - List created task specs
        if len(path_parts) >= 2 and path_parts[1] == 'created':
            self.send_response(200)
            self.end_headers()
            response = {"tasks": [], "total": 0, "message": "Created tasks are stored in session"}
            self.wfile.write(json.dumps(response).encode())
            return
        
        # /api/tasks/{task_id} - Get specific task
        if len(path_parts) >= 2:
            task_id = path_parts[1]
            
            # /api/tasks/{task_id}/logs
            if len(path_parts) >= 3 and path_parts[2] == 'logs':
                task = get_task(task_id)
                if task:
                    self.send_response(200)
                    self.end_headers()
                    response = {"task_id": task_id, "logs": task.get("execution_log", [])}
                    self.wfile.write(json.dumps(response).encode())
                else:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Task not found"}).encode())
                return
            
            task = get_task(task_id)
            if task:
                self.send_response(200)
                self.end_headers()
                self.wfile.write(json.dumps(task).encode())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Task not found"}).encode())
            return
        
        self.send_response(400)
        self.end_headers()
        self.wfile.write(json.dumps({"error": "Invalid request"}).encode())

    def do_POST(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-type', 'application/json')
        
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.strip('/').split('/')
        
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode('utf-8')
        
        try:
            data = json.loads(body) if body else {}
        except json.JSONDecodeError:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Invalid JSON"}).encode())
            return
        
        # /api/tasks - Create and execute task
        if len(path_parts) == 1 or (len(path_parts) == 2 and path_parts[1] == ''):
            description = data.get('task_description', '')
            user_id = data.get('user_id')
            
            if not description:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "task_description is required"}).encode())
                return
            
            task = create_task(description, user_id)
            
            # Simulate task execution (in serverless, this would trigger a background job)
            task["status"] = "running"
            task["current_agent"] = "orchestration_coordinator"
            task["current_step"] = "Analyzing task requirements"
            task["progress"] = 10
            task["execution_log"].append({
                "timestamp": datetime.now().isoformat(),
                "agent": "orchestration_coordinator",
                "action": "task_started",
                "message": "Starting task analysis",
                "status": "info"
            })
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(task).encode())
            return
        
        # /api/tasks/create - Create task from NLP
        if len(path_parts) >= 2 and path_parts[1] == 'create':
            description = data.get('description', '')
            available_agents = data.get('available_agents')
            
            if not description:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": "description is required"}).encode())
                return
            
            task = create_task_from_nlp(description, available_agents)
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(task).encode())
            return
        
        # /api/tasks/execute/{task_id}
        if len(path_parts) >= 3 and path_parts[1] == 'execute':
            task_id = path_parts[2]
            
            # Create execution record
            execution_id = str(uuid.uuid4())
            execution = {
                "execution_task_id": execution_id,
                "original_task_id": task_id,
                "status": "running",
                "message": "Task execution started",
                "started_at": datetime.now().isoformat()
            }
            
            self.send_response(200)
            self.end_headers()
            self.wfile.write(json.dumps(execution).encode())
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
