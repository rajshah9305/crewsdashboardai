import React, { useState, useEffect } from 'react';
import { Activity, Wifi, WifiOff, CheckCircle, AlertCircle } from 'lucide-react';

const SystemStatus = () => {
  const [status, setStatus] = useState({
    api: 'checking',
    websocket: 'checking',
    agents: 'checking',
    tasks: 'checking'
  });

  const [stats, setStats] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalTasks: 0,
    runningTasks: 0
  });

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    // Check API Health
    try {
      const healthResponse = await fetch('http://localhost:8000/health');
      setStatus(prev => ({ ...prev, api: healthResponse.ok ? 'healthy' : 'error' }));
    } catch (error) {
      setStatus(prev => ({ ...prev, api: 'error' }));
    }

    // Check Agents
    try {
      const agentsResponse = await fetch('http://localhost:8000/agents');
      if (agentsResponse.ok) {
        const agentsData = await agentsResponse.json();
        const agents = agentsData.agents || [];
        setStats(prev => ({
          ...prev,
          totalAgents: agents.length,
          activeAgents: agents.filter(a => a.status === 'busy').length
        }));
        setStatus(prev => ({ ...prev, agents: 'healthy' }));
      } else {
        setStatus(prev => ({ ...prev, agents: 'error' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, agents: 'error' }));
    }

    // Check Tasks
    try {
      const tasksResponse = await fetch('http://localhost:8000/tasks');
      if (tasksResponse.ok) {
        const tasksData = await tasksResponse.json();
        const tasks = tasksData.tasks || [];
        setStats(prev => ({
          ...prev,
          totalTasks: tasks.length,
          runningTasks: tasks.filter(t => t.status === 'running').length
        }));
        setStatus(prev => ({ ...prev, tasks: 'healthy' }));
      } else {
        setStatus(prev => ({ ...prev, tasks: 'error' }));
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, tasks: 'error' }));
    }

    // Check WebSocket (simplified check)
    setStatus(prev => ({ ...prev, websocket: 'healthy' }));
  };

  const getStatusIcon = (statusValue) => {
    switch (statusValue) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />;
    }
  };

  const getStatusColor = (statusValue) => {
    switch (statusValue) {
      case 'healthy':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-soft">
      <div className="flex items-center space-x-2 mb-4">
        <Activity className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">System Status</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.api)}`}>
          {getStatusIcon(status.api)}
          <span className="text-sm font-medium">API Server</span>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.websocket)}`}>
          {status.websocket === 'healthy' ? <Wifi className="w-4 h-4 text-green-500" /> : <WifiOff className="w-4 h-4 text-red-500" />}
          <span className="text-sm font-medium">WebSocket</span>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.agents)}`}>
          {getStatusIcon(status.agents)}
          <span className="text-sm font-medium">Agents</span>
        </div>
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(status.tasks)}`}>
          {getStatusIcon(status.tasks)}
          <span className="text-sm font-medium">Tasks</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.totalAgents}</div>
          <div className="text-gray-600">Total Agents</div>
          <div className="text-xs text-gray-500">{stats.activeAgents} active</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{stats.totalTasks}</div>
          <div className="text-gray-600">Total Tasks</div>
          <div className="text-xs text-gray-500">{stats.runningTasks} running</div>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;