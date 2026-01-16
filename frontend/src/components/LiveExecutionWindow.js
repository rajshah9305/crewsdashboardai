import React, { useState, useEffect, useRef } from 'react';
import SystemStatus from './SystemStatus';

const LiveExecutionWindow = ({ executionData, onExecutionUpdate }) => {
  const [conversations, setConversations] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentExecution, setCurrentExecution] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversations]);

  useEffect(() => {
    if (executionData) {
      setCurrentExecution(executionData);
      setIsExecuting(true);
      
      // Add execution start message
      setConversations(prev => [...prev, {
        id: Date.now(),
        type: 'system',
        message: `Starting execution: ${executionData.task_name || 'New Task'}`,
        timestamp: new Date(),
        agent: executionData.agent_name || 'System'
      }]);
    }
  }, [executionData]);



  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getMessageTypeColor = (type) => {
    switch (type) {
      case 'agent': return 'bg-blue-50 border-blue-200';
      case 'user': return 'bg-green-50 border-green-200';
      case 'system': return 'bg-gray-50 border-gray-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'success': return 'bg-green-50 border-green-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getMessageIcon = (type) => {
    switch (type) {
      case 'agent':
        return (
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        );
      case 'user':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        );
      case 'system':
        return (
          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'error':
        return (
          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const clearExecution = () => {
    setConversations([]);
    setCurrentExecution(null);
    setIsExecuting(false);
    onExecutionUpdate(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 bg-white border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-800">Live Execution Monitor</h2>
            {isExecuting && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-600">Active</span>
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearExecution}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
        
        {currentExecution && (
          <div className="mt-2 p-2 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-blue-800">
                {currentExecution.task_name || 'Executing Task'}
              </span>
              <span className="text-blue-600">
                Agent: {currentExecution.agent_name || 'Unknown'}
              </span>
            </div>
            {currentExecution.description && (
              <p className="text-sm text-blue-700 mt-1">{currentExecution.description}</p>
            )}
          </div>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversations.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-6">
              <div>
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg font-medium mb-2 text-gray-500">No Active Execution</p>
                <p className="text-sm text-gray-400">Start a task or send a message to see live execution here</p>
              </div>
              
              {/* System Status when no execution */}
              <div className="max-w-md mx-auto">
                <SystemStatus />
              </div>
            </div>
          </div>
        ) : (
          conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`border rounded-lg p-3 ${getMessageTypeColor(conversation.type)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getMessageIcon(conversation.type)}
                  <span className="font-medium text-sm text-gray-800">
                    {conversation.agent}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    conversation.type === 'agent' ? 'bg-blue-100 text-blue-700' :
                    conversation.type === 'user' ? 'bg-green-100 text-green-700' :
                    conversation.type === 'error' ? 'bg-red-100 text-red-700' :
                    conversation.type === 'success' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {conversation.type}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(conversation.timestamp)}
                </span>
              </div>
              <div className="text-sm text-gray-700 whitespace-pre-wrap">
                {conversation.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Execution Status Bar */}
      {isExecuting && (
        <div className="p-3 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-blue-700">Execution in progress...</span>
            </div>
            <button
              onClick={() => setIsExecuting(false)}
              className="px-2 py-1 text-xs text-red-600 hover:text-red-800 border border-red-300 rounded hover:bg-red-50"
            >
              Stop
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveExecutionWindow;