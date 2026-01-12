#!/usr/bin/env python
import asyncio
import json
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import uvicorn
import threading
import time
from .crew import AiAgentOrchestrationHubCrew
from .intelligent_agent_creator import intelligent_agent_creator, AgentSpecification, TaskSpecification

app = FastAPI(title="AI Agent Orchestration Hub API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data models
class TaskRequest(BaseModel):
    task_description: str
    user_id: Optional[str] = None

class AgentCreationRequest(BaseModel):
    description: str
    user_id: Optional[str] = None

class TaskCreationRequest(BaseModel):
    description: str
    available_agents: Optional[List[str]] = None
    user_id: Optional[str] = None

class AgentCreationResponse(BaseModel):
    agent_id: str
    name: str
    role: str
    goal: str
    backstory: str
    tools: List[str]
    specializations: List[str]
    collaboration_style: str
    expertise_level: str
    created_at: datetime

class TaskCreationResponse(BaseModel):
    task_id: str
    name: str
    description: str
    expected_output: str
    agent: str
    priority: str
    complexity: str
    success_criteria: List[str]
    deliverables: List[str]
    created_at: datetime

class TaskResponse(BaseModel):
    task_id: str
    status: str
    result: Optional[str] = None
    created_at: datetime
    completed_at: Optional[datetime] = None
    execution_log: List[dict] = []
    current_agent: Optional[str] = None
    current_step: Optional[str] = None
    progress: int = 0

class AgentStatus(BaseModel):
    name: str
    role: str
    status: str
    current_task: Optional[str] = None
    last_activity: Optional[datetime] = None
    total_tasks_completed: int = 0

class ExecutionLog(BaseModel):
    timestamp: datetime
    agent: str
    action: str
    message: str
    status: str

# In-memory storage (in production, use a proper database)
active_tasks: Dict[str, TaskResponse] = {}
task_results: Dict[str, str] = {}
connected_clients: List[WebSocket] = []
agent_statuses: Dict[str, AgentStatus] = {}
execution_logs: Dict[str, List[ExecutionLog]] = {}
created_agents: Dict[str, AgentCreationResponse] = {}
created_tasks: Dict[str, TaskCreationResponse] = {}

# Initialize agent statuses
def initialize_agents():
    agent_configs = [
        {"name": "orchestration_coordinator", "role": "Orchestration Coordinator"},
        {"name": "task_allocation_manager", "role": "Task Allocation Manager"},
        {"name": "research_intelligence_agent", "role": "Research Intelligence Agent"},
        {"name": "data_processing_specialist", "role": "Data Processing Specialist"},
        {"name": "execution_monitor", "role": "Execution Monitor"},
        {"name": "quality_assurance_specialist", "role": "Quality Assurance Specialist"}
    ]
    
    for agent_config in agent_configs:
        agent_statuses[agent_config["name"]] = AgentStatus(
            name=agent_config["name"],
            role=agent_config["role"],
            status="ready",
            last_activity=datetime.now(),
            total_tasks_completed=0
        )

initialize_agents()

@app.get("/")
async def root():
    return {"message": "AI Agent Orchestration Hub API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

@app.get("/agents")
async def get_agents():
    """Get information about all available agents"""
    return {"agents": list(agent_statuses.values()), "total": len(agent_statuses)}

@app.get("/agents/{agent_name}")
async def get_agent_status(agent_name: str):
    """Get specific agent status"""
    if agent_name not in agent_statuses:
        raise HTTPException(status_code=404, detail="Agent not found")
    return agent_statuses[agent_name]

@app.post("/tasks", response_model=TaskResponse)
async def create_task(task_request: TaskRequest):
    """Create and execute a new task"""
    task_id = str(uuid.uuid4())
    
    # Create task response
    task_response = TaskResponse(
        task_id=task_id,
        status="created",
        created_at=datetime.now(),
        execution_log=[],
        progress=0
    )
    
    active_tasks[task_id] = task_response
    execution_logs[task_id] = []
    
    # Log task creation
    await log_execution(task_id, "system", "task_created", f"Task created: {task_request.task_description}", "info")
    
    # Notify connected clients
    await broadcast_message({
        "type": "task_created",
        "task_id": task_id,
        "task_description": task_request.task_description,
        "status": "created"
    })
    
    # Execute task asynchronously
    asyncio.create_task(execute_crew_task(task_id, task_request.task_description))
    
    return task_response

@app.get("/tasks/{task_id}", response_model=TaskResponse)
async def get_task(task_id: str):
    """Get task status and result"""
    if task_id not in active_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task = active_tasks[task_id]
    if task_id in task_results:
        task.result = task_results[task_id]
    
    # Add execution logs
    if task_id in execution_logs:
        task.execution_log = [log.dict() for log in execution_logs[task_id]]
    
    return task

@app.get("/tasks/{task_id}/logs")
async def get_task_logs(task_id: str):
    """Get detailed execution logs for a task"""
    if task_id not in execution_logs:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return {"task_id": task_id, "logs": [log.dict() for log in execution_logs[task_id]]}

@app.get("/tasks")
async def get_all_tasks():
    """Get all tasks"""
    tasks = []
    for task_id, task in active_tasks.items():
        if task_id in task_results:
            task.result = task_results[task_id]
        if task_id in execution_logs:
            task.execution_log = [log.dict() for log in execution_logs[task_id][-5:]]  # Last 5 logs
        tasks.append(task)
    
    return {"tasks": tasks, "total": len(tasks)}

@app.post("/agents/create", response_model=AgentCreationResponse)
async def create_agent_from_nlp(request: AgentCreationRequest):
    """Create a new agent from natural language description"""
    try:
        # Use intelligent agent creator to generate agent specification
        agent_spec = intelligent_agent_creator.create_agent_from_nlp(request.description)
        
        # Generate unique agent ID
        agent_id = str(uuid.uuid4())
        
        # Create response
        agent_response = AgentCreationResponse(
            agent_id=agent_id,
            name=agent_spec.name,
            role=agent_spec.role,
            goal=agent_spec.goal,
            backstory=agent_spec.backstory,
            tools=agent_spec.tools,
            specializations=agent_spec.specializations,
            collaboration_style=agent_spec.collaboration_style,
            expertise_level=agent_spec.expertise_level,
            created_at=datetime.now()
        )
        
        # Store created agent
        created_agents[agent_id] = agent_response
        
        # Save agent configuration
        try:
            config_path = intelligent_agent_creator.save_agent_config(agent_spec)
            print(f"Agent configuration saved to: {config_path}")
        except Exception as e:
            print(f"Warning: Could not save agent config: {e}")
        
        # Broadcast agent creation
        await broadcast_message({
            "type": "agent_created",
            "agent_id": agent_id,
            "name": agent_spec.name,
            "role": agent_spec.role,
            "description": request.description
        })
        
        return agent_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create agent: {str(e)}")

@app.post("/tasks/create", response_model=TaskCreationResponse)
async def create_task_from_nlp(request: TaskCreationRequest):
    """Create a new task from natural language description"""
    try:
        # Use intelligent agent creator to generate task specification
        available_agents = request.available_agents or list(agent_statuses.keys())
        task_spec = intelligent_agent_creator.create_task_from_nlp(request.description, available_agents)
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Create response
        task_response = TaskCreationResponse(
            task_id=task_id,
            name=task_spec.name,
            description=task_spec.description,
            expected_output=task_spec.expected_output,
            agent=task_spec.agent,
            priority=task_spec.priority,
            complexity=task_spec.complexity,
            success_criteria=task_spec.success_criteria,
            deliverables=task_spec.deliverables,
            created_at=datetime.now()
        )
        
        # Store created task
        created_tasks[task_id] = task_response
        
        # Save task configuration
        try:
            config_path = intelligent_agent_creator.save_task_config(task_spec)
            print(f"Task configuration saved to: {config_path}")
        except Exception as e:
            print(f"Warning: Could not save task config: {e}")
        
        # Broadcast task creation
        await broadcast_message({
            "type": "task_created",
            "task_id": task_id,
            "name": task_spec.name,
            "description": task_spec.description,
            "agent": task_spec.agent,
            "priority": task_spec.priority
        })
        
        return task_response
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {str(e)}")

@app.get("/agents/created")
async def get_created_agents():
    """Get all created agents"""
    return {"agents": list(created_agents.values()), "total": len(created_agents)}

@app.get("/agents/created/{agent_id}")
async def get_created_agent(agent_id: str):
    """Get specific created agent"""
    if agent_id not in created_agents:
        raise HTTPException(status_code=404, detail="Agent not found")
    return created_agents[agent_id]

@app.get("/tasks/created")
async def get_created_tasks():
    """Get all created tasks"""
    return {"tasks": list(created_tasks.values()), "total": len(created_tasks)}

@app.get("/tasks/created/{task_id}")
async def get_created_task(task_id: str):
    """Get specific created task"""
    if task_id not in created_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    return created_tasks[task_id]

@app.post("/tasks/execute/{task_id}")
async def execute_created_task(task_id: str):
    """Execute a previously created task"""
    if task_id not in created_tasks:
        raise HTTPException(status_code=404, detail="Task not found")
    
    created_task = created_tasks[task_id]
    
    # Create execution task request
    execution_task_id = str(uuid.uuid4())
    task_response = TaskResponse(
        task_id=execution_task_id,
        status="created",
        created_at=datetime.now(),
        execution_log=[],
        progress=0
    )
    
    active_tasks[execution_task_id] = task_response
    execution_logs[execution_task_id] = []
    
    # Log task creation
    await log_execution(execution_task_id, "system", "task_created", f"Executing created task: {created_task.name}", "info")
    
    # Execute task asynchronously
    asyncio.create_task(execute_crew_task(execution_task_id, created_task.description))
    
    return {
        "execution_task_id": execution_task_id,
        "original_task_id": task_id,
        "status": "started",
        "message": f"Started execution of task: {created_task.name}"
    }

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time updates"""
    await websocket.accept()
    connected_clients.append(websocket)
    
    print(f"WebSocket client connected. Total clients: {len(connected_clients)}")
    
    try:
        # Send initial data
        await websocket.send_text(json.dumps({
            "type": "agent_statuses",
            "agents": [agent.dict() for agent in agent_statuses.values()],
            "timestamp": datetime.now().isoformat()
        }, default=str))
        
        while True:
            # Wait for messages from client
            try:
                data = await asyncio.wait_for(websocket.receive_text(), timeout=60.0)
                message = json.loads(data)
                
                # Handle different message types
                if message.get('type') == 'heartbeat':
                    # Respond to heartbeat
                    await websocket.send_text(json.dumps({
                        "type": "heartbeat", 
                        "timestamp": datetime.now().isoformat()
                    }))
                else:
                    # Echo back other messages
                    await websocket.send_text(json.dumps({
                        "type": "echo", 
                        "original": message,
                        "timestamp": datetime.now().isoformat()
                    }))
                    
            except asyncio.TimeoutError:
                # Send periodic heartbeat if no messages received
                await websocket.send_text(json.dumps({
                    "type": "server_heartbeat",
                    "timestamp": datetime.now().isoformat()
                }))
                
    except WebSocketDisconnect:
        print(f"WebSocket client disconnected. Remaining clients: {len(connected_clients) - 1}")
        if websocket in connected_clients:
            connected_clients.remove(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        if websocket in connected_clients:
            connected_clients.remove(websocket)

async def broadcast_message(message: dict):
    """Broadcast message to all connected clients"""
    if not connected_clients:
        return
        
    disconnected = []
    message_str = json.dumps(message, default=str)
    
    for client in connected_clients[:]:  # Create a copy to iterate over
        try:
            await client.send_text(message_str)
        except Exception as e:
            print(f"Failed to send message to client: {e}")
            disconnected.append(client)
    
    # Remove disconnected clients
    for client in disconnected:
        if client in connected_clients:
            connected_clients.remove(client)
            
    if disconnected:
        print(f"Removed {len(disconnected)} disconnected clients. Active clients: {len(connected_clients)}")

async def log_execution(task_id: str, agent: str, action: str, message: str, status: str):
    """Log execution step and broadcast to clients"""
    log_entry = ExecutionLog(
        timestamp=datetime.now(),
        agent=agent,
        action=action,
        message=message,
        status=status
    )
    
    if task_id not in execution_logs:
        execution_logs[task_id] = []
    
    execution_logs[task_id].append(log_entry)
    
    # Update task progress and current step
    if task_id in active_tasks:
        active_tasks[task_id].current_agent = agent
        active_tasks[task_id].current_step = action
        
        # Calculate progress based on execution steps
        total_expected_steps = 20  # Estimated total steps
        current_steps = len(execution_logs[task_id])
        progress = min(95, (current_steps / total_expected_steps) * 100)
        active_tasks[task_id].progress = int(progress)
    
    # Update agent status
    if agent in agent_statuses and agent != "system":
        agent_statuses[agent].last_activity = datetime.now()
        agent_statuses[agent].status = "busy" if status == "running" else "ready"
        if action == "task_completed":
            agent_statuses[agent].total_tasks_completed += 1
    
    # Broadcast update
    await broadcast_message({
        "type": "execution_log",
        "task_id": task_id,
        "log": log_entry.dict(),
        "task_progress": active_tasks[task_id].progress if task_id in active_tasks else 0,
        "current_agent": agent,
        "current_step": action
    })

class CrewExecutionMonitor:
    """Monitor crew execution and provide real-time updates"""
    
    def __init__(self, task_id: str):
        self.task_id = task_id
        self.step_count = 0
        
    async def log_step(self, agent: str, action: str, message: str, status: str = "running"):
        """Log a step in the execution process"""
        self.step_count += 1
        await log_execution(self.task_id, agent, action, message, status)
        
        # Add small delay to make progress visible
        await asyncio.sleep(0.5)

async def execute_crew_task(task_id: str, task_description: str):
    """Execute CrewAI task asynchronously with detailed monitoring"""
    monitor = CrewExecutionMonitor(task_id)
    
    try:
        # Update task status
        active_tasks[task_id].status = "running"
        await monitor.log_step("system", "task_started", f"Starting task execution: {task_description}", "running")
        
        await broadcast_message({
            "type": "task_started",
            "task_id": task_id,
            "status": "running"
        })
        
        # Initialize crew
        await monitor.log_step("system", "crew_initialization", "Initializing AI Agent Orchestration Hub", "running")
        crew_instance = AiAgentOrchestrationHubCrew()
        
        # Simulate detailed agent execution steps
        agents = [
            ("orchestration_coordinator", "Orchestration Coordinator"),
            ("task_allocation_manager", "Task Allocation Manager"), 
            ("research_intelligence_agent", "Research Intelligence Agent"),
            ("data_processing_specialist", "Data Processing Specialist"),
            ("execution_monitor", "Execution Monitor"),
            ("quality_assurance_specialist", "Quality Assurance Specialist")
        ]
        
        # Pre-execution phase
        await monitor.log_step("orchestration_coordinator", "strategy_analysis", "Analyzing task requirements and creating orchestration strategy", "running")
        await monitor.log_step("orchestration_coordinator", "agent_selection", "Selecting optimal agents for task execution", "running")
        await monitor.log_step("task_allocation_manager", "resource_allocation", "Allocating computational resources and task priorities", "running")
        
        # Execute the crew with monitoring
        inputs = {"task_description": task_description}
        
        await monitor.log_step("system", "crew_execution", "Starting multi-agent collaboration", "running")
        
        # Run crew in a separate thread to avoid blocking
        import concurrent.futures
        
        def run_crew():
            return crew_instance.crew().kickoff(inputs=inputs)
        
        # Simulate agent activities during execution
        async def simulate_agent_activities():
            activities = [
                ("research_intelligence_agent", "data_gathering", "Collecting information from academic sources and web resources"),
                ("research_intelligence_agent", "source_analysis", "Analyzing and validating information sources"),
                ("data_processing_specialist", "data_processing", "Processing and structuring collected data"),
                ("data_processing_specialist", "quality_check", "Performing data quality validation"),
                ("execution_monitor", "progress_tracking", "Monitoring task execution progress"),
                ("execution_monitor", "performance_analysis", "Analyzing agent performance metrics"),
                ("quality_assurance_specialist", "output_validation", "Validating intermediate outputs"),
                ("quality_assurance_specialist", "compliance_check", "Ensuring quality standards compliance"),
                ("orchestration_coordinator", "coordination", "Coordinating agent interactions and workflow"),
                ("task_allocation_manager", "load_balancing", "Optimizing task distribution and resource usage")
            ]
            
            for agent, action, message in activities:
                await monitor.log_step(agent, action, message, "running")
                await asyncio.sleep(2)  # Simulate processing time
        
        # Start simulation task
        simulation_task = asyncio.create_task(simulate_agent_activities())
        
        # Execute crew
        with concurrent.futures.ThreadPoolExecutor() as executor:
            result = await asyncio.get_event_loop().run_in_executor(executor, run_crew)
        
        # Cancel simulation if crew finishes early
        simulation_task.cancel()
        
        # Final steps
        await monitor.log_step("quality_assurance_specialist", "final_validation", "Performing final quality validation", "running")
        await monitor.log_step("system", "result_compilation", "Compiling final results", "running")
        
        # Store result
        task_results[task_id] = str(result)
        active_tasks[task_id].status = "completed"
        active_tasks[task_id].completed_at = datetime.now()
        active_tasks[task_id].progress = 100
        
        await monitor.log_step("system", "task_completed", f"Task completed successfully. Result length: {len(str(result))} characters", "completed")
        
        # Update all agent statuses to ready
        for agent_name in agent_statuses:
            agent_statuses[agent_name].status = "ready"
            agent_statuses[agent_name].current_task = None
        
        await broadcast_message({
            "type": "task_completed",
            "task_id": task_id,
            "status": "completed",
            "result": str(result),
            "execution_time": (datetime.now() - active_tasks[task_id].created_at).total_seconds()
        })
        
    except Exception as e:
        # Handle errors
        active_tasks[task_id].status = "failed"
        active_tasks[task_id].progress = 0
        task_results[task_id] = f"Error: {str(e)}"
        
        await monitor.log_step("system", "error", f"Task execution failed: {str(e)}", "error")
        
        # Reset agent statuses
        for agent_name in agent_statuses:
            agent_statuses[agent_name].status = "ready"
            agent_statuses[agent_name].current_task = None
        
        await broadcast_message({
            "type": "task_failed",
            "task_id": task_id,
            "status": "failed",
            "error": str(e)
        })

# Background task to update agent heartbeats
async def agent_heartbeat():
    """Send periodic agent status updates"""
    while True:
        await asyncio.sleep(5)  # Update every 5 seconds
        await broadcast_message({
            "type": "agent_heartbeat",
            "agents": [agent.dict() for agent in agent_statuses.values()],
            "timestamp": datetime.now().isoformat()
        })

# Start background tasks
@app.on_event("startup")
async def startup_event():
    asyncio.create_task(agent_heartbeat())

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)