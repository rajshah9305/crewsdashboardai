import React, { useState } from 'react';

const AgentManagementPanel = ({ agents = [], errors = [], onAgentCreate, onErrorClear }) => {
  const [activeTab, setActiveTab] = useState('agents');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: '',
    role: '',
    goal: '',
    backstory: ''
  });

  const handleCreateAgent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/agents/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: `Create an agent named ${newAgent.name} with role ${newAgent.role}. Goal: ${newAgent.goal}. Backstory: ${newAgent.backstory}`
        }),
      });
      
      if (response.ok) {
        setNewAgent({ name: '', role: '', goal: '', backstory: '' });
        setShowCreateForm(false);
        onAgentCreate();
      }
    } catch (error) {
      console.error('Error creating agent:', error);
    }
  };

  const getAgentStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'idle': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Panel Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Agent Control</h2>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
          >
            + New Agent
          </button>
        </div>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('agents')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'agents' 
                ? 'bg-blue-100 text-blue-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Agents ({agents.length})
          </button>
          <button
            onClick={() => setActiveTab('errors')}
            className={`px-3 py-1 text-sm rounded ${
              activeTab === 'errors' 
                ? 'bg-red-100 text-red-700' 
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Errors ({errors.length})
          </button>
        </div>
      </div>

      {/* Create Agent Form */}
      {showCreateForm && (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <form onSubmit={handleCreateAgent} className="space-y-3">
            <input
              type="text"
              placeholder="Agent Name"
              value={newAgent.name}
              onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              placeholder="Role"
              value={newAgent.role}
              onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              placeholder="Goal"
              value={newAgent.goal}
              onChange={(e) => setNewAgent({...newAgent, goal: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
              required
            />
            <textarea
              placeholder="Backstory"
              value={newAgent.backstory}
              onChange={(e) => setNewAgent({...newAgent, backstory: e.target.value})}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-16 resize-none"
            />
            <div className="flex space-x-2">
              <button
                type="submit"
                className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'agents' && (
          <div className="space-y-3">
            {agents.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p>No agents created</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  Create your first agent
                </button>
              </div>
            ) : (
              agents.map((agent, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-800">{agent.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded-full ${getAgentStatusColor(agent.status || 'idle')}`}>
                      {agent.status || 'idle'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{agent.role}</p>
                  <p className="text-xs text-gray-500 mb-2">{agent.goal}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Tasks: {agent.task_count || 0}</span>
                    <span>Created: {formatTimestamp(agent.created_at || new Date())}</span>
                  </div>
                  <div className="flex space-x-2 mt-2">
                    <button className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded hover:bg-blue-200">
                      View
                    </button>
                    <button className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded hover:bg-green-200">
                      Start
                    </button>
                    <button className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200">
                      Stop
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'errors' && (
          <div className="space-y-2">
            {errors.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>No errors detected</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-600">{errors.length} error(s)</span>
                  <button
                    onClick={onErrorClear}
                    className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded hover:bg-red-200"
                  >
                    Clear All
                  </button>
                </div>
                {errors.map((error, index) => (
                  <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-red-800 text-sm">{error.type}</span>
                      <span className="text-xs text-red-600">{formatTimestamp(error.timestamp)}</span>
                    </div>
                    <p className="text-sm text-red-700">{error.message}</p>
                    {error.details && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-600 cursor-pointer">Details</summary>
                        <pre className="text-xs text-red-600 mt-1 whitespace-pre-wrap">{error.details}</pre>
                      </details>
                    )}
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentManagementPanel;