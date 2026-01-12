import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Palette, 
  Globe, 
  Zap, 
  Monitor, 
  Save, 
  RotateCcw,
  X,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Smartphone,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Clock,
  Shield,
  Database,
  Activity
} from 'lucide-react';

const Settings = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'
  const [settings, setSettings] = useState({
    general: {
      theme: 'light',
      language: 'en',
      autoRefresh: true,
      refreshInterval: 10,
      notifications: true,
      compactMode: false,
      timezone: 'UTC'
    },
    agents: {
      maxConcurrentTasks: 5,
      defaultTimeout: 300,
      retryAttempts: 3,
      logLevel: 'info',
      enableAutoScaling: true,
      maxMemoryUsage: 80,
      healthCheckInterval: 30
    },
    api: {
      baseUrl: 'http://localhost:8000',
      timeout: 30,
      enableWebSocket: true,
      wsReconnectInterval: 5,
      rateLimitRequests: 100,
      enableCaching: true,
      cacheTimeout: 300
    },
    ui: {
      showTimestamps: true,
      animationsEnabled: true,
      soundEnabled: false,
      highContrast: false,
      fontSize: 'medium',
      sidebarCollapsed: false,
      showTooltips: true
    },
    security: {
      sessionTimeout: 3600,
      enableTwoFactor: false,
      logSecurityEvents: true,
      encryptLocalStorage: true,
      allowRemoteAccess: false
    },
    performance: {
      enableLazyLoading: true,
      maxLogEntries: 1000,
      enableDataCompression: true,
      preloadComponents: false,
      optimizeImages: true
    }
  });

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('aiAgentHubSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
  }, []);

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.setItem('aiAgentHubSettings', JSON.stringify(settings));
      setSaveStatus('saved');
      setHasChanges(false);
      
      // Clear saved status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      setSaveStatus('saving');
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        localStorage.removeItem('aiAgentHubSettings');
        // Reset to default values
        setSettings({
          general: {
            theme: 'light',
            language: 'en',
            autoRefresh: true,
            refreshInterval: 10,
            notifications: true,
            compactMode: false,
            timezone: 'UTC'
          },
          agents: {
            maxConcurrentTasks: 5,
            defaultTimeout: 300,
            retryAttempts: 3,
            logLevel: 'info',
            enableAutoScaling: true,
            maxMemoryUsage: 80,
            healthCheckInterval: 30
          },
          api: {
            baseUrl: 'http://localhost:8000',
            timeout: 30,
            enableWebSocket: true,
            wsReconnectInterval: 5,
            rateLimitRequests: 100,
            enableCaching: true,
            cacheTimeout: 300
          },
          ui: {
            showTimestamps: true,
            animationsEnabled: true,
            soundEnabled: false,
            highContrast: false,
            fontSize: 'medium',
            sidebarCollapsed: false,
            showTooltips: true
          },
          security: {
            sessionTimeout: 3600,
            enableTwoFactor: false,
            logSecurityEvents: true,
            encryptLocalStorage: true,
            allowRemoteAccess: false
          },
          performance: {
            enableLazyLoading: true,
            maxLogEntries: 1000,
            enableDataCompression: true,
            preloadComponents: false,
            optimizeImages: true
          }
        });
        setSaveStatus('saved');
        setHasChanges(false);
        setTimeout(() => setSaveStatus(null), 2000);
      } catch (error) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus(null), 3000);
      }
    }
  };

  if (!isOpen) return null;

  const tabs = [
    { 
      id: 'general', 
      label: 'General', 
      icon: SettingsIcon, 
      color: 'blue',
      description: 'Basic application settings'
    },
    { 
      id: 'agents', 
      label: 'Agents', 
      icon: Activity, 
      color: 'green',
      description: 'AI agent configuration'
    },
    { 
      id: 'api', 
      label: 'API & Network', 
      icon: Wifi, 
      color: 'purple',
      description: 'Connection and API settings'
    },
    { 
      id: 'ui', 
      label: 'Interface', 
      icon: Palette, 
      color: 'pink',
      description: 'User interface preferences'
    },
    { 
      id: 'security', 
      label: 'Security', 
      icon: Shield, 
      color: 'red',
      description: 'Security and privacy settings'
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: Zap, 
      color: 'yellow',
      description: 'Performance optimization'
    }
  ];

  const getTabColorClasses = (color, isActive) => {
    const colors = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-200' : 'text-blue-600 hover:bg-blue-50',
      green: isActive ? 'bg-green-100 text-green-700 border-green-200' : 'text-green-600 hover:bg-green-50',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-200' : 'text-purple-600 hover:bg-purple-50',
      pink: isActive ? 'bg-pink-100 text-pink-700 border-pink-200' : 'text-pink-600 hover:bg-pink-50',
      red: isActive ? 'bg-red-100 text-red-700 border-red-200' : 'text-red-600 hover:bg-red-50',
      yellow: isActive ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'text-yellow-600 hover:bg-yellow-50'
    };
    return colors[color] || colors.blue;
  };

  const ToggleSwitch = ({ checked, onChange, disabled = false }) => (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
        checked ? 'bg-blue-600' : 'bg-gray-200'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  const SettingCard = ({ title, description, children, icon: Icon, warning = false }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-soft hover:shadow-md transition-all duration-200">
      <div className="flex items-start space-x-4">
        {Icon && (
          <div className={`p-2 rounded-lg ${warning ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-100 text-gray-600'}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h4 className="font-semibold text-gray-900">{title}</h4>
            {warning && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
          </div>
          {description && <p className="text-sm text-gray-600 mb-4">{description}</p>}
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-5/6 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 bg-gradient-to-br from-gray-50 to-gray-100 border-r border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <SettingsIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                <p className="text-sm text-gray-500">Configure your workspace</p>
              </div>
            </div>
          </div>
          
          <nav className="p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive 
                      ? `${getTabColorClasses(tab.color, true)} border shadow-sm` 
                      : `${getTabColorClasses(tab.color, false)} hover:shadow-sm`
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs opacity-75 truncate">{tab.description}</div>
                  </div>
                </button>
              );
            })}
          </nav>
          
          {/* Status Indicator */}
          {hasChanges && (
            <div className="mx-4 mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Unsaved Changes</span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {tabs.find(t => t.id === activeTab)?.label}
                </h3>
                <p className="text-gray-600 mt-1">
                  {tabs.find(t => t.id === activeTab)?.description}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="space-y-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <>
                  <SettingCard
                    title="Theme Preference"
                    description="Choose your preferred color scheme"
                    icon={settings.general.theme === 'dark' ? Moon : Sun}
                  >
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'auto', label: 'Auto', icon: Monitor }
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => handleSettingChange('general', 'theme', value)}
                          className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                            settings.general.theme === value
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <Icon className="w-5 h-5 mx-auto mb-2" />
                          <div className="text-sm font-medium">{label}</div>
                        </button>
                      ))}
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Language & Region"
                    description="Set your preferred language and timezone"
                    icon={Globe}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                        <select
                          value={settings.general.language}
                          onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="en">English</option>
                          <option value="es">Español</option>
                          <option value="fr">Français</option>
                          <option value="de">Deutsch</option>
                          <option value="zh">中文</option>
                          <option value="ja">日本語</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                        <select
                          value={settings.general.timezone}
                          onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="UTC">UTC</option>
                          <option value="America/New_York">Eastern Time</option>
                          <option value="America/Chicago">Central Time</option>
                          <option value="America/Denver">Mountain Time</option>
                          <option value="America/Los_Angeles">Pacific Time</option>
                          <option value="Europe/London">London</option>
                          <option value="Europe/Paris">Paris</option>
                          <option value="Asia/Tokyo">Tokyo</option>
                        </select>
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Auto Refresh"
                    description="Automatically refresh data at regular intervals"
                    icon={Clock}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Auto Refresh</span>
                        <ToggleSwitch
                          checked={settings.general.autoRefresh}
                          onChange={(checked) => handleSettingChange('general', 'autoRefresh', checked)}
                        />
                      </div>
                      {settings.general.autoRefresh && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Refresh Interval: {settings.general.refreshInterval} seconds
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="300"
                            step="5"
                            value={settings.general.refreshInterval}
                            onChange={(e) => handleSettingChange('general', 'refreshInterval', parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>5s</span>
                            <span>5min</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Notifications"
                    description="Control how you receive notifications"
                    icon={settings.general.notifications ? Volume2 : VolumeX}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Notifications</span>
                        <ToggleSwitch
                          checked={settings.general.notifications}
                          onChange={(checked) => handleSettingChange('general', 'notifications', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Compact Mode</span>
                        <ToggleSwitch
                          checked={settings.general.compactMode}
                          onChange={(checked) => handleSettingChange('general', 'compactMode', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>
                </>
              )}

              {/* Agent Settings */}
              {activeTab === 'agents' && (
                <>
                  <SettingCard
                    title="Task Management"
                    description="Configure how agents handle tasks"
                    icon={Activity}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Concurrent Tasks
                        </label>
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={settings.agents.maxConcurrentTasks}
                          onChange={(e) => handleSettingChange('agents', 'maxConcurrentTasks', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Default Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          min="30"
                          max="3600"
                          value={settings.agents.defaultTimeout}
                          onChange={(e) => handleSettingChange('agents', 'defaultTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Error Handling"
                    description="Configure retry behavior and logging"
                    icon={AlertTriangle}
                    warning
                  >
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Retry Attempts</label>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={settings.agents.retryAttempts}
                            onChange={(e) => handleSettingChange('agents', 'retryAttempts', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Log Level</label>
                          <select
                            value={settings.agents.logLevel}
                            onChange={(e) => handleSettingChange('agents', 'logLevel', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="debug">Debug</option>
                            <option value="info">Info</option>
                            <option value="warning">Warning</option>
                            <option value="error">Error</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Performance Monitoring"
                    description="Monitor and optimize agent performance"
                    icon={Monitor}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Auto Scaling</span>
                        <ToggleSwitch
                          checked={settings.agents.enableAutoScaling}
                          onChange={(checked) => handleSettingChange('agents', 'enableAutoScaling', checked)}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Memory Usage: {settings.agents.maxMemoryUsage}%
                        </label>
                        <input
                          type="range"
                          min="50"
                          max="95"
                          step="5"
                          value={settings.agents.maxMemoryUsage}
                          onChange={(e) => handleSettingChange('agents', 'maxMemoryUsage', parseInt(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Health Check Interval (seconds)
                        </label>
                        <input
                          type="number"
                          min="10"
                          max="300"
                          value={settings.agents.healthCheckInterval}
                          onChange={(e) => handleSettingChange('agents', 'healthCheckInterval', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </SettingCard>
                </>
              )}

              {/* API Settings */}
              {activeTab === 'api' && (
                <>
                  <SettingCard
                    title="Connection Settings"
                    description="Configure API endpoints and connection parameters"
                    icon={Wifi}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Base URL</label>
                        <input
                          type="url"
                          value={settings.api.baseUrl}
                          onChange={(e) => handleSettingChange('api', 'baseUrl', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="http://localhost:8000"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Request Timeout (seconds)
                          </label>
                          <input
                            type="number"
                            min="5"
                            max="300"
                            value={settings.api.timeout}
                            onChange={(e) => handleSettingChange('api', 'timeout', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rate Limit (requests/min)
                          </label>
                          <input
                            type="number"
                            min="10"
                            max="1000"
                            value={settings.api.rateLimitRequests}
                            onChange={(e) => handleSettingChange('api', 'rateLimitRequests', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="WebSocket Configuration"
                    description="Real-time communication settings"
                    icon={settings.api.enableWebSocket ? Wifi : WifiOff}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable WebSocket</span>
                        <ToggleSwitch
                          checked={settings.api.enableWebSocket}
                          onChange={(checked) => handleSettingChange('api', 'enableWebSocket', checked)}
                        />
                      </div>
                      {settings.api.enableWebSocket && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reconnect Interval (seconds)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="60"
                            value={settings.api.wsReconnectInterval}
                            onChange={(e) => handleSettingChange('api', 'wsReconnectInterval', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Caching & Performance"
                    description="Optimize API performance with caching"
                    icon={Database}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Caching</span>
                        <ToggleSwitch
                          checked={settings.api.enableCaching}
                          onChange={(checked) => handleSettingChange('api', 'enableCaching', checked)}
                        />
                      </div>
                      {settings.api.enableCaching && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Cache Timeout (seconds)
                          </label>
                          <input
                            type="number"
                            min="60"
                            max="3600"
                            value={settings.api.cacheTimeout}
                            onChange={(e) => handleSettingChange('api', 'cacheTimeout', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  </SettingCard>
                </>
              )}

              {/* UI Settings */}
              {activeTab === 'ui' && (
                <>
                  <SettingCard
                    title="Display Preferences"
                    description="Customize the visual appearance"
                    icon={Palette}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Show Timestamps</span>
                        <ToggleSwitch
                          checked={settings.ui.showTimestamps}
                          onChange={(checked) => handleSettingChange('ui', 'showTimestamps', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Animations</span>
                        <ToggleSwitch
                          checked={settings.ui.animationsEnabled}
                          onChange={(checked) => handleSettingChange('ui', 'animationsEnabled', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">High Contrast Mode</span>
                        <ToggleSwitch
                          checked={settings.ui.highContrast}
                          onChange={(checked) => handleSettingChange('ui', 'highContrast', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Show Tooltips</span>
                        <ToggleSwitch
                          checked={settings.ui.showTooltips}
                          onChange={(checked) => handleSettingChange('ui', 'showTooltips', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Layout & Navigation"
                    description="Customize the interface layout"
                    icon={Smartphone}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                        <select
                          value={settings.ui.fontSize}
                          onChange={(e) => handleSettingChange('ui', 'fontSize', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="small">Small</option>
                          <option value="medium">Medium</option>
                          <option value="large">Large</option>
                          <option value="extra-large">Extra Large</option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Collapse Sidebar by Default</span>
                        <ToggleSwitch
                          checked={settings.ui.sidebarCollapsed}
                          onChange={(checked) => handleSettingChange('ui', 'sidebarCollapsed', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Audio & Feedback"
                    description="Sound and haptic feedback settings"
                    icon={settings.ui.soundEnabled ? Volume2 : VolumeX}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Sound Notifications</span>
                        <ToggleSwitch
                          checked={settings.ui.soundEnabled}
                          onChange={(checked) => handleSettingChange('ui', 'soundEnabled', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>
                </>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <>
                  <SettingCard
                    title="Session Management"
                    description="Control user sessions and authentication"
                    icon={Shield}
                    warning
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Session Timeout (seconds)
                        </label>
                        <input
                          type="number"
                          min="300"
                          max="86400"
                          value={settings.security.sessionTimeout}
                          onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Two-Factor Authentication</span>
                        <ToggleSwitch
                          checked={settings.security.enableTwoFactor}
                          onChange={(checked) => handleSettingChange('security', 'enableTwoFactor', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Privacy & Data Protection"
                    description="Control data handling and privacy settings"
                    icon={Shield}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Log Security Events</span>
                        <ToggleSwitch
                          checked={settings.security.logSecurityEvents}
                          onChange={(checked) => handleSettingChange('security', 'logSecurityEvents', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Encrypt Local Storage</span>
                        <ToggleSwitch
                          checked={settings.security.encryptLocalStorage}
                          onChange={(checked) => handleSettingChange('security', 'encryptLocalStorage', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Allow Remote Access</span>
                        <ToggleSwitch
                          checked={settings.security.allowRemoteAccess}
                          onChange={(checked) => handleSettingChange('security', 'allowRemoteAccess', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>
                </>
              )}

              {/* Performance Settings */}
              {activeTab === 'performance' && (
                <>
                  <SettingCard
                    title="Loading & Optimization"
                    description="Optimize application performance"
                    icon={Zap}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Lazy Loading</span>
                        <ToggleSwitch
                          checked={settings.performance.enableLazyLoading}
                          onChange={(checked) => handleSettingChange('performance', 'enableLazyLoading', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Preload Components</span>
                        <ToggleSwitch
                          checked={settings.performance.preloadComponents}
                          onChange={(checked) => handleSettingChange('performance', 'preloadComponents', checked)}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Optimize Images</span>
                        <ToggleSwitch
                          checked={settings.performance.optimizeImages}
                          onChange={(checked) => handleSettingChange('performance', 'optimizeImages', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>

                  <SettingCard
                    title="Data Management"
                    description="Control data storage and compression"
                    icon={Database}
                  >
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max Log Entries
                        </label>
                        <input
                          type="number"
                          min="100"
                          max="10000"
                          value={settings.performance.maxLogEntries}
                          onChange={(e) => handleSettingChange('performance', 'maxLogEntries', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Enable Data Compression</span>
                        <ToggleSwitch
                          checked={settings.performance.enableDataCompression}
                          onChange={(checked) => handleSettingChange('performance', 'enableDataCompression', checked)}
                        />
                      </div>
                    </div>
                  </SettingCard>
                </>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {saveStatus && (
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                    saveStatus === 'saving' ? 'bg-blue-50 text-blue-700' :
                    saveStatus === 'saved' ? 'bg-green-50 text-green-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {saveStatus === 'saving' && (
                      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    {saveStatus === 'saved' && <Check className="w-4 h-4" />}
                    {saveStatus === 'error' && <AlertTriangle className="w-4 h-4" />}
                    <span className="text-sm font-medium">
                      {saveStatus === 'saving' ? 'Saving...' :
                       saveStatus === 'saved' ? 'Settings saved!' :
                       'Error saving settings'}
                    </span>
                  </div>
                )}
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset to Default</span>
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!hasChanges || saveStatus === 'saving'}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;