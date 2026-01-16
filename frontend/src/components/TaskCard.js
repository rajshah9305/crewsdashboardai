import React from 'react';
import { 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Eye, 
  Activity, 
  Play,
  MoreVertical,
  Calendar,
  Timer,
  User,
  TrendingUp
} from 'lucide-react';

const TaskCard = ({ task, onViewDetails, onViewLiveExecution }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success-500" />;
      case 'running':
        return <Activity className="w-5 h-5 text-warning-500 animate-pulse" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-error-500" />;
      case 'created':
        return <AlertTriangle className="w-5 h-5 text-info-500" />;
      default:
        return <Clock className="w-5 h-5 text-neutral-400" />;
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'status-success';
      case 'running':
        return 'status-warning';
      case 'failed':
        return 'status-error';
      case 'created':
        return 'status-info';
      default:
        return 'status-neutral';
    }
  };

  const getStatusGradient = (status) => {
    switch (status) {
      case 'completed':
        return 'from-success-500 to-success-600';
      case 'running':
        return 'from-warning-500 to-warning-600';
      case 'failed':
        return 'from-error-500 to-error-600';
      case 'created':
        return 'from-info-500 to-info-600';
      default:
        return 'from-neutral-400 to-neutral-500';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getExecutionTime = () => {
    if (!task.completed_at) return null;
    const start = new Date(task.created_at);
    const end = new Date(task.completed_at);
    const diff = Math.round((end - start) / 1000);
    
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.round(diff / 60)}m`;
    return `${Math.round(diff / 3600)}h`;
  };

  const getCurrentAgent = () => {
    if (!task.current_agent) return null;
    return task.current_agent.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getCurrentStep = () => {
    if (!task.current_step) return null;
    return task.current_step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getTaskPreview = () => {
    // Extract task description from execution logs or use a default
    if (task.execution_log && task.execution_log.length > 0) {
      const firstLog = task.execution_log[0];
      if (firstLog.message && firstLog.message.includes(':')) {
        return firstLog.message.split(':')[1]?.trim().slice(0, 60) + '...';
      }
    }
    return 'Task execution in progress...';
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-neutral-200/60 rounded-xl p-6 group relative overflow-hidden hover:shadow-medium transition-all duration-300 hover:bg-white/95">
      {/* Status Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient(task.status)}`}></div>
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="relative">
            {getStatusIcon(task.status)}
            {task.status === 'running' && (
              <div className="absolute inset-0 bg-warning-400 rounded-full opacity-20 animate-ping"></div>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className={`${getStatusStyle(task.status)} backdrop-blur-sm`}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
              {task.progress !== undefined && task.status === 'running' && (
                <span className="text-xs text-neutral-500 bg-neutral-100/80 px-2 py-1 rounded-full backdrop-blur-sm">
                  {task.progress}%
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 font-mono mt-1 bg-neutral-50/60 px-2 py-1 rounded backdrop-blur-sm">
              ID: {task.task_id.slice(0, 8)}...
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {task.status === 'running' && (
            <button
              onClick={() => onViewLiveExecution(task)}
              className="btn-ghost btn-sm text-warning-600 hover:text-warning-700 backdrop-blur-sm"
              title="View live execution"
            >
              <Play className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onViewDetails(task)}
            className="btn-ghost btn-sm backdrop-blur-sm"
            title="View details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button className="btn-ghost btn-sm backdrop-blur-sm">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Bar for Running Tasks */}
      {task.status === 'running' && task.progress !== undefined && (
        <div className="mb-4">
          <div className="progress-bar h-2 bg-neutral-200/60 backdrop-blur-sm">
            <div 
              className="progress-fill"
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Current Activity for Running Tasks */}
      {task.status === 'running' && (getCurrentAgent() || getCurrentStep()) && (
        <div className="mb-4 p-3 bg-warning-50/80 backdrop-blur-sm rounded-lg border border-warning-200/60">
          <div className="flex items-center space-x-2 mb-2">
            <Activity className="w-4 h-4 text-warning-600 animate-pulse" />
            <span className="text-xs font-medium text-warning-700">Live Activity</span>
          </div>
          {getCurrentAgent() && (
            <div className="flex items-center space-x-2 mb-1">
              <User className="w-3 h-3 text-warning-600" />
              <span className="text-xs text-warning-600 font-medium">{getCurrentAgent()}</span>
            </div>
          )}
          {getCurrentStep() && (
            <p className="text-xs text-warning-600 pl-5">
              {getCurrentStep()}
            </p>
          )}
        </div>
      )}

      {/* Task Preview */}
      <div className="mb-4">
        <p className="text-sm text-neutral-700 line-clamp-2">
          {getTaskPreview()}
        </p>
      </div>
      
      {/* Timestamps */}
      <div className="space-y-2 text-xs text-neutral-500 mb-4">
        <div className="flex items-center space-x-2 bg-neutral-50/60 px-2 py-1 rounded backdrop-blur-sm">
          <Calendar className="w-3 h-3" />
          <span>Created: {formatDate(task.created_at)}</span>
        </div>
        
        {task.completed_at && (
          <div className="flex items-center justify-between bg-neutral-50/60 px-2 py-1 rounded backdrop-blur-sm">
            <div className="flex items-center space-x-2">
              <Timer className="w-3 h-3" />
              <span>Completed: {formatDate(task.completed_at)}</span>
            </div>
            {getExecutionTime() && (
              <span className="px-2 py-1 bg-neutral-100/80 rounded-full text-2xs font-medium backdrop-blur-sm">
                {getExecutionTime()}
              </span>
            )}
          </div>
        )}
      </div>
      
      {/* Results Preview */}
      {task.result && task.status === 'completed' && (
        <div className="p-3 bg-success-50/80 backdrop-blur-sm rounded-lg border border-success-200/60 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle2 className="w-4 h-4 text-success-600" />
            <span className="text-xs font-medium text-success-700">Result Preview</span>
          </div>
          <p className="text-xs text-success-600 line-clamp-2">
            {task.result.length > 100 ? `${task.result.slice(0, 100)}...` : task.result}
          </p>
        </div>
      )}
      
      {task.result && task.status === 'failed' && (
        <div className="p-3 bg-error-50/80 backdrop-blur-sm rounded-lg border border-error-200/60 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <XCircle className="w-4 h-4 text-error-600" />
            <span className="text-xs font-medium text-error-700">Error Details</span>
          </div>
          <p className="text-xs text-error-600 line-clamp-2">
            {task.result.length > 100 ? `${task.result.slice(0, 100)}...` : task.result}
          </p>
        </div>
      )}

      {/* Recent Activity Logs */}
      {task.execution_log && task.execution_log.length > 0 && (
        <div className="border-t border-neutral-100/60 pt-4">
          <div className="flex items-center space-x-2 mb-3">
            <TrendingUp className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-medium text-neutral-600">
              Recent Activity ({task.execution_log.length})
            </span>
          </div>
          <div className="space-y-2">
            {task.execution_log.slice(-2).map((log, index) => (
              <div key={index} className="flex items-start space-x-2 p-2 bg-neutral-50/60 backdrop-blur-sm rounded">
                <div className="w-1.5 h-1.5 bg-brand-400 rounded-full mt-1.5 flex-shrink-0"></div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-2xs font-medium text-neutral-700">
                      {log.agent.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-2xs text-neutral-500">
                      {new Date(log.timestamp).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  <p className="text-2xs text-neutral-600 line-clamp-1">
                    {log.message.length > 60 ? `${log.message.slice(0, 60)}...` : log.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;