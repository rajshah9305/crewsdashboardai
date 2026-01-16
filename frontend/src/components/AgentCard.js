import React from 'react';
import { 
  User, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Activity, 
  Zap, 
  MoreVertical,
  TrendingUp,
  Eye
} from 'lucide-react';

const AgentCard = ({ agent, onViewActivity, onViewDetails }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'ready':
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case 'busy':
        return <Activity className="w-5 h-5 text-warning-500 animate-pulse" />;
      case 'error':
        return <AlertTriangle className="w-5 h-5 text-error-500" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ready':
        return 'status-success';
      case 'busy':
        return 'status-warning';
      case 'error':
        return 'status-error';
      default:
        return 'status-neutral';
    }
  };

  const getAgentIcon = (agentName) => {
    const icons = {
      'orchestration_coordinator': '🎯',
      'task_allocation_manager': '📊',
      'research_intelligence_agent': '🔍',
      'data_processing_specialist': '⚙️',
      'execution_monitor': '📈',
      'quality_assurance_specialist': '✅'
    };
    return icons[agentName] || '🤖';
  };

  const getAgentColor = (agentName) => {
    const colors = {
      'orchestration_coordinator': 'from-blue-500 to-blue-600',
      'task_allocation_manager': 'from-green-500 to-green-600',
      'research_intelligence_agent': 'from-purple-500 to-purple-600',
      'data_processing_specialist': 'from-orange-500 to-orange-600',
      'execution_monitor': 'from-red-500 to-red-600',
      'quality_assurance_specialist': 'from-indigo-500 to-indigo-600'
    };
    return colors[agentName] || 'from-neutral-500 to-neutral-600';
  };

  const formatLastActivity = (timestamp) => {
    if (!timestamp) return 'Never';
    const now = new Date();
    const lastActivity = new Date(timestamp);
    const diffMs = now - lastActivity;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return lastActivity.toLocaleDateString();
  };

  const getPerformanceScore = () => {
    // Mock performance calculation
    const completed = agent.total_tasks_completed || 0;
    const baseScore = Math.min(95, 60 + (completed * 2));
    return Math.max(baseScore, 60);
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-neutral-200/60 rounded-xl p-6 group relative overflow-hidden hover:shadow-medium transition-all duration-300 hover:bg-white/95">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-3">
        <div className={`w-full h-full bg-gradient-to-br ${getAgentColor(agent.name)}`}></div>
      </div>
      
      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${getAgentColor(agent.name)} rounded-xl shadow-medium text-white text-xl font-semibold relative`}>
            {getAgentIcon(agent.name)}
            {/* Subtle glow effect */}
            <div className={`absolute inset-0 bg-gradient-to-br ${getAgentColor(agent.name)} rounded-xl opacity-30 blur-sm -z-10`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 text-lg">{agent.role}</h3>
            <p className="text-sm text-neutral-500 capitalize">
              {agent.name.replace(/_/g, ' ')}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {getStatusIcon(agent.status)}
          <button className="btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {/* Status and Performance */}
      <div className="relative space-y-4">
        <div className="flex items-center justify-between">
          <span className={`${getStatusStyle(agent.status)} backdrop-blur-sm`}>
            {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
          </span>
          
          <div className="flex items-center space-x-1 text-xs text-neutral-500 bg-neutral-50/80 px-2 py-1 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-3 h-3" />
            <span>{getPerformanceScore()}% efficiency</span>
          </div>
        </div>
        
        {/* Current Task */}
        {agent.current_task && (
          <div className="p-3 bg-warning-50/80 backdrop-blur-sm rounded-lg border border-warning-200/60">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-warning-700">Current Task</p>
              {agent.status === 'busy' && onViewActivity && (
                <button
                  onClick={() => onViewActivity(agent)}
                  className="btn-ghost btn-sm text-warning-600 hover:text-warning-700"
                  title="View live activity"
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
            </div>
            <p className="text-xs text-warning-600 line-clamp-2">
              {agent.current_task}
            </p>
          </div>
        )}
        
        {/* Activity Indicator for Busy Agents */}
        {agent.status === 'busy' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-neutral-600">Processing</span>
              <Activity className="w-4 h-4 text-warning-500 animate-pulse" />
            </div>
            <div className="progress-bar h-1.5 bg-neutral-200/60 backdrop-blur-sm">
              <div className="h-full bg-gradient-to-r from-warning-400 to-warning-500 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
        
        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-neutral-100/60">
          <div className="text-center p-3 bg-neutral-50/60 backdrop-blur-sm rounded-lg">
            <div className="text-xl font-bold text-neutral-900">
              {agent.total_tasks_completed || 0}
            </div>
            <div className="text-xs text-neutral-500">Completed</div>
          </div>
          
          <div className="text-center p-3 bg-neutral-50/60 backdrop-blur-sm rounded-lg">
            <div className="text-xl font-bold text-neutral-900">
              {getPerformanceScore()}%
            </div>
            <div className="text-xs text-neutral-500">Performance</div>
          </div>
        </div>
        
        {/* Last Activity */}
        <div className="flex items-center justify-between text-xs text-neutral-500 pt-2 border-t border-neutral-100/60">
          <span>Last active</span>
          <span className="font-medium">{formatLastActivity(agent.last_activity)}</span>
        </div>
        
        {/* Action Buttons */}
        <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(agent)}
              className="btn-secondary btn-sm flex-1 backdrop-blur-sm"
            >
              View Details
            </button>
          )}
          {agent.status === 'busy' && onViewActivity && (
            <button
              onClick={() => onViewActivity(agent)}
              className="btn-primary btn-sm flex-1"
            >
              <Zap className="w-3 h-3 mr-1" />
              Live View
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentCard;