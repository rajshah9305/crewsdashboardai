import { useState, useEffect, useCallback } from 'react';
import AgentLogsPanel from './AgentLogsPanel';
import AgentManagementPanel from './AgentManagementPanel';
import LiveExecutionWindow from './LiveExecutionWindow';
import ChatBox from './ChatBox';
import Header from './Header';
import Settings from './Settings';
import WelcomeGuide from './WelcomeGuide';
import { ToastContainer, useToast } from './Toast';
import { apiService, wsService } from '../services/api';

const MainLayout = () => {
  const [agents, setAgents] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [executionData, setExecutionData] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const { toasts, removeToast, showSuccess, showError, showInfo } = useToast();

  // Define fetch functions first
  const fetchAgents = useCallback(async () => {
    try {
      const response = await apiService.getAgents();
      setAgents(response.data.agents || []);
    } catch (error) {
      console.error('Error fetching agents:', error);
      setErrors(prev => [...prev, { type: 'fetch', message: 'Failed to fetch agents', timestamp: new Date() }]);
    }
  }, []);

  const fetchTasks = useCallback(async () => {
    try {
      const response = await apiService.getAllTasks();
      setTasks(response.data.tasks || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setErrors(prev => [...prev, { type: 'fetch', message: 'Failed to fetch tasks', timestamp: new Date() }]);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      // Get logs from tasks since there's no direct logs endpoint
      const response = await apiService.getAllTasks();
      const allLogs = [];
      (response.data.tasks || []).forEach(task => {
        if (task.execution_log) {
          task.execution_log.forEach(log => {
            allLogs.push({
              ...log,
              task_id: task.task_id,
              agent_name: log.agent
            });
          });
        }
      });
      setLogs(allLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error('Error fetching logs:', error);
      setErrors(prev => [...prev, { type: 'fetch', message: 'Failed to fetch logs', timestamp: new Date() }]);
    }
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      await Promise.all([
        fetchAgents(),
        fetchTasks(),
        fetchLogs()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      showError('Failed to load initial data');
    }
  }, [fetchAgents, fetchTasks, fetchLogs, showError]);

  const setupWebSocket = useCallback(() => {
    // WebSocket event handlers
    const handleConnected = () => {
      setIsConnected(true);
      showSuccess('Connected to server', 2000);
    };

    const handleDisconnected = () => {
      setIsConnected(false);
      showError('Disconnected from server', 3000);
    };

    const handleAgentUpdate = (data) => {
      if (data.agents) {
        setAgents(data.agents);
      }
    };

    const handleTaskUpdate = (data) => {
      // Refresh tasks when task updates occur
      fetchTasks();
      
      if (data.type === 'task_completed') {
        showSuccess(`Task completed: ${data.task_id.slice(0, 8)}...`);
      } else if (data.type === 'task_failed') {
        showError(`Task failed: ${data.error}`);
      }
    };

    const handleExecutionLog = (data) => {
      // Update logs in real-time
      setLogs(prev => [data, ...prev].slice(0, 100)); // Keep last 100 logs
      
      // Update execution data if it matches current task
      if (executionData && data.task_id === executionData.task_id) {
        setExecutionData(prev => ({
          ...prev,
          ...data
        }));
      }
    };

    // Clean up existing listeners
    wsService.off('connected', handleConnected);
    wsService.off('disconnected', handleDisconnected);
    wsService.off('agent_update', handleAgentUpdate);
    wsService.off('task_update', handleTaskUpdate);
    wsService.off('execution_log', handleExecutionLog);

    // Register event handlers
    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('agent_update', handleAgentUpdate);
    wsService.on('task_update', handleTaskUpdate);
    wsService.on('execution_log', handleExecutionLog);

    // Connect to WebSocket
    wsService.connect();
  }, [showSuccess, showError, executionData, fetchTasks]);

  useEffect(() => {
    // Check if user has seen welcome guide
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
    }

    // Initialize data fetching
    fetchInitialData();
    
    return () => {
      // Cleanup WebSocket
      wsService.disconnect();
    };
  }, [fetchInitialData]);

  // Separate effect for WebSocket connection
  useEffect(() => {
    const connectWebSocket = async () => {
      try {
        // Wait for backend to be ready
        await apiService.healthCheck();
        console.log('Backend is ready, setting up WebSocket...');
        setupWebSocket();
      } catch (error) {
        console.log('Backend not ready, retrying in 3 seconds...');
        setTimeout(connectWebSocket, 3000);
      }
    };

    // Start connection attempt after a delay
    const timer = setTimeout(connectWebSocket, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [setupWebSocket]);

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    localStorage.setItem('hasSeenWelcome', 'true');
  };

  const handleChatMessage = async (message) => {
    try {
      showInfo('Processing your request...', 2000);
      
      const response = await apiService.createTask(message);
      const data = response.data;
      
      // Trigger execution monitoring
      setExecutionData({
        task_id: data.task_id,
        task_name: message,
        agent_name: 'AI Assistant',
        description: 'Processing user request...',
        timestamp: new Date()
      });
      
      showSuccess('Task created successfully!');
      
      // Refresh tasks
      fetchTasks();
      
      return { message: 'Task created successfully', task_id: data.task_id };
    } catch (error) {
      console.error('Error sending chat message:', error);
      showError('Failed to create task. Please try again.');
      setErrors(prev => [...prev, { type: 'chat', message: 'Failed to send message', timestamp: new Date() }]);
      throw error;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-neutral-50 via-white to-blue-50/30 overflow-hidden">
      {/* Header */}
      <Header 
        isConnected={isConnected}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      {/* Main Content Area - Enhanced responsive layout */}
      <div className="flex-1 flex overflow-hidden min-h-0 gap-1 p-1">
        {/* Left Panel - Agent Logs and Tasks */}
        <div className="w-1/4 min-w-[320px] bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-xl flex flex-col shadow-soft">
          <AgentLogsPanel 
            logs={logs} 
            tasks={tasks} 
            onRefresh={() => {
              fetchLogs();
              fetchTasks();
            }}
          />
        </div>
        
        {/* Center Panel - Live Execution Window */}
        <div className="flex-1 bg-white/60 backdrop-blur-sm border border-neutral-200/60 rounded-xl flex flex-col min-w-0 shadow-soft">
          <LiveExecutionWindow 
            executionData={executionData}
            onExecutionUpdate={setExecutionData}
          />
        </div>
        
        {/* Right Panel - Agent Management and Errors */}
        <div className="w-1/4 min-w-[320px] bg-white/80 backdrop-blur-sm border border-neutral-200/60 rounded-xl flex flex-col shadow-soft">
          <AgentManagementPanel 
            agents={agents}
            errors={errors}
            onAgentCreate={fetchAgents}
            onErrorClear={() => setErrors([])}
          />
        </div>
      </div>
      
      {/* Bottom Chat Box - Enhanced with better spacing */}
      <div className="h-56 bg-white/90 backdrop-blur-sm border-t border-neutral-200/60 flex-shrink-0 shadow-lg m-1 mb-0 rounded-t-xl">
        <ChatBox 
          onSendMessage={handleChatMessage}
          onExecutionStart={setExecutionData}
        />
      </div>
      
      {/* Settings Modal */}
      <Settings 
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
      
      {/* Welcome Guide */}
      <WelcomeGuide 
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
      />
      
      {/* Help Button - Fixed position, adjusted to avoid ChatBox overlap */}
      <button
        onClick={() => setShowWelcome(true)}
        className="fixed bottom-60 right-6 w-12 h-12 bg-gradient-to-r from-brand-500 to-brand-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 z-40 flex items-center justify-center group hover:scale-105 active:scale-95"
        title="Help & Guide"
        aria-label="Open help and guide"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </button>
      
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </div>
  );
};

export default MainLayout;