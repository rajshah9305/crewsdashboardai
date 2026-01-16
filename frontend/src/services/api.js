import axios from 'axios';

// For Vercel deployment, use relative URLs which will be handled by the API routes
// For local development, use the full URL
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // Health check
  healthCheck: () => api.get('/health'),

  // Agents
  getAgents: () => api.get('/agents'),
  getAgent: (agentName) => api.get(`/agents/${agentName}`),
  createAgent: (description) => api.post('/agents/create', { description }),

  // Tasks
  createTask: (taskDescription, userId = null) => 
    api.post('/tasks', { task_description: taskDescription, user_id: userId }),
  
  getTask: (taskId) => api.get(`/tasks/${taskId}`),
  
  getTaskLogs: (taskId) => api.get(`/tasks/${taskId}/logs`),
  
  getAllTasks: () => api.get('/tasks'),
  
  createTaskFromNLP: (description, availableAgents = null) =>
    api.post('/tasks/create', { description, available_agents: availableAgents }),
  
  executeTask: (taskId) => api.post(`/tasks/execute/${taskId}`),
};

// Polling-based updates for serverless (replaces WebSocket)
export class PollingService {
  constructor() {
    this.listeners = new Map();
    this.pollingInterval = null;
    this.isPolling = false;
    this.pollRate = 5000; // Poll every 5 seconds
  }

  start() {
    if (this.isPolling) {
      console.log('Polling already active');
      return;
    }

    this.isPolling = true;
    this.emit('connected');
    console.log('Polling service started');

    // Initial fetch
    this.poll();

    // Set up polling interval
    this.pollingInterval = setInterval(() => this.poll(), this.pollRate);
  }

  stop() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    this.emit('disconnected');
    console.log('Polling service stopped');
  }

  async poll() {
    try {
      // Fetch agents
      const agentsResponse = await apiService.getAgents();
      if (agentsResponse.data) {
        this.emit('agent_update', {
          type: 'agent_statuses',
          agents: agentsResponse.data.agents
        });
      }

      // Fetch tasks
      const tasksResponse = await apiService.getAllTasks();
      if (tasksResponse.data) {
        this.emit('task_update', {
          type: 'tasks_updated',
          tasks: tasksResponse.data.tasks
        });
      }
    } catch (error) {
      console.error('Polling error:', error);
      this.emit('error', error);
    }
  }

  // Alias for compatibility
  connect() {
    this.start();
  }

  disconnect() {
    this.stop();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in polling event handler for ${event}:`, error);
        }
      });
    }
  }

  getConnectionState() {
    return this.isPolling ? 'CONNECTED' : 'DISCONNECTED';
  }
}

// WebSocket service for local development (when backend supports it)
export class WebSocketService {
  constructor() {
    this.ws = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 3;
    this.reconnectDelay = 3000;
    this.isConnecting = false;
    this.heartbeatInterval = null;
  }

  connect() {
    // Skip WebSocket in production (Vercel serverless doesn't support persistent connections)
    if (API_BASE_URL === '/api' || API_BASE_URL.includes('vercel')) {
      console.log('WebSocket not available in serverless mode, using polling');
      this.emit('disconnected');
      return;
    }

    if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connecting or connected');
      return;
    }

    this.isConnecting = true;
    const wsUrl = API_BASE_URL.replace('http', 'ws') + '/ws';
    
    try {
      console.log('Attempting to connect to WebSocket:', wsUrl);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log('WebSocket connected successfully');
        this.isConnecting = false;
        this.reconnectAttempts = 0;
        this.emit('connected');
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.emit('message', data);
          this.emit(data.type, data);
          
          switch (data.type) {
            case 'execution_log':
              this.emit('execution_log', data);
              break;
            case 'agent_heartbeat':
            case 'agent_statuses':
              this.emit('agent_update', data);
              break;
            case 'task_created':
            case 'task_started':
            case 'task_completed':
            case 'task_failed':
              this.emit('task_update', data);
              break;
            default:
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      this.ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        this.isConnecting = false;
        this.emit('disconnected');
        this.stopHeartbeat();
        
        if (event.code !== 1000 && this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          setTimeout(() => this.connect(), this.reconnectDelay);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        this.isConnecting = false;
        this.emit('error', error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      this.isConnecting = false;
      this.emit('error', error);
    }
  }

  disconnect() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.isConnecting = false;
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.send({ type: 'heartbeat', timestamp: new Date().toISOString() });
      }
    }, 30000);
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  off(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event);
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  getConnectionState() {
    if (!this.ws) return 'DISCONNECTED';
    
    switch (this.ws.readyState) {
      case WebSocket.CONNECTING:
        return 'CONNECTING';
      case WebSocket.OPEN:
        return 'CONNECTED';
      case WebSocket.CLOSING:
        return 'CLOSING';
      case WebSocket.CLOSED:
        return 'DISCONNECTED';
      default:
        return 'UNKNOWN';
    }
  }
}

// Export the appropriate service based on environment
// Use polling for serverless, WebSocket for local development
export const wsService = API_BASE_URL === '/api' || API_BASE_URL.includes('vercel')
  ? new PollingService()
  : new WebSocketService();
