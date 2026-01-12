import React, { useState } from 'react';
import { 
  BookOpen, 
  MessageSquare, 
  Settings, 
  Activity, 
  Users, 
  ChevronRight,
  X,
  Lightbulb,
  Zap,
  Shield
} from 'lucide-react';

const WelcomeGuide = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Welcome to AI Agent Orchestration Hub",
      icon: BookOpen,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Your enterprise-grade platform for managing intelligent AI agents. This powerful system 
            allows you to create, deploy, and monitor AI agents that work together to accomplish complex tasks.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Key Features</span>
            </div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Multi-agent collaboration and orchestration</li>
              <li>• Real-time task monitoring and execution</li>
              <li>• Intelligent agent creation from natural language</li>
              <li>• Comprehensive logging and error tracking</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      title: "Understanding the Interface",
      icon: Activity,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            The interface is divided into three main sections for optimal workflow:
          </p>
          <div className="grid grid-cols-1 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">📊 Left Panel - Activity Monitor</h4>
              <p className="text-sm text-gray-600">
                View real-time logs and task status. Switch between "Logs" and "Tasks" tabs 
                to monitor system activity and track task progress.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">🖥️ Center Panel - Live Execution</h4>
              <p className="text-sm text-gray-600">
                Watch agents work in real-time. See conversations, task execution steps, 
                and system status updates as they happen.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">⚙️ Right Panel - Agent Control</h4>
              <p className="text-sm text-gray-600">
                Manage your agents and view system errors. Create new agents, monitor 
                their status, and handle any issues that arise.
              </p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Using the AI Chat",
      icon: MessageSquare,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            The chat interface at the bottom is your primary way to interact with the AI system.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">💬 What you can do:</h4>
            <ul className="text-sm text-green-700 space-y-1">
              <li>• <strong>Create tasks:</strong> "Analyze the latest market trends"</li>
              <li>• <strong>Create agents:</strong> "Create a data analysis agent"</li>
              <li>• <strong>Get status:</strong> "Show me all running tasks"</li>
              <li>• <strong>Execute workflows:</strong> "Run a web scraping task"</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Quick Actions</span>
            </div>
            <p className="text-sm text-yellow-700">
              Use the quick action buttons below the chat input for common tasks like 
              "Create Agent", "View Tasks", and "Execute Task".
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Managing Agents",
      icon: Users,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Agents are the core of your AI orchestration system. Each agent has specialized capabilities.
          </p>
          <div className="space-y-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm">🎯 Orchestration Coordinator</h4>
              <p className="text-xs text-gray-600">Manages overall task coordination and workflow</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm">📋 Task Allocation Manager</h4>
              <p className="text-xs text-gray-600">Distributes tasks efficiently across agents</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm">🔍 Research Intelligence Agent</h4>
              <p className="text-xs text-gray-600">Gathers and analyzes information from various sources</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm">⚡ Data Processing Specialist</h4>
              <p className="text-xs text-gray-600">Processes and transforms data efficiently</p>
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-700">
              <strong>Tip:</strong> Click "New Agent" in the right panel to create custom agents 
              tailored to your specific needs using natural language descriptions.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Settings & Configuration",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Customize your experience through the comprehensive settings panel.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">🎨 General</h4>
              <p className="text-xs text-gray-600">Theme, language, refresh settings</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">🤖 Agents</h4>
              <p className="text-xs text-gray-600">Task limits, timeouts, performance</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">🌐 API & Network</h4>
              <p className="text-xs text-gray-600">Connection, WebSocket, caching</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">🎯 Interface</h4>
              <p className="text-xs text-gray-600">Display, animations, accessibility</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">🔒 Security</h4>
              <p className="text-xs text-gray-600">Sessions, privacy, data protection</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3">
              <h4 className="font-semibold text-gray-800 text-sm mb-1">⚡ Performance</h4>
              <p className="text-xs text-gray-600">Optimization, caching, resources</p>
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Shield className="w-4 h-4 text-purple-600" />
              <span className="font-semibold text-purple-800">Security Note</span>
            </div>
            <p className="text-sm text-purple-700">
              All settings are saved locally and encrypted for your security. 
              You can reset to defaults at any time.
            </p>
          </div>
        </div>
      )
    }
  ];

  if (!isOpen) return null;

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-5/6 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{currentStepData.title}</h2>
                <p className="text-sm text-gray-500">Step {currentStep + 1} of {steps.length}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-gray-50">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {currentStepData.content}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentStep ? 'bg-blue-600' : 
                    index < currentStep ? 'bg-blue-300' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {currentStep < steps.length - 1 ? (
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Get Started
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeGuide;