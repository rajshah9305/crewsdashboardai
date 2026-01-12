import { Bot, Settings, Wifi, WifiOff } from 'lucide-react';

const Header = ({ isConnected, onSettingsClick }) => {
  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-neutral-200/60 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo and Brand - Enhanced with gradient */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 rounded-xl shadow-lg">
                <Bot className="w-7 h-7 text-white" />
              </div>
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-400 to-brand-600 rounded-xl opacity-20 blur-sm -z-10"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-600 via-brand-700 to-brand-800 bg-clip-text text-transparent">
                AI Agent Orchestration Hub
              </h1>
              <p className="text-sm text-neutral-600 font-medium">
                Enterprise Multi-Agent Intelligence Platform
              </p>
            </div>
          </div>
          
          {/* Right side - Enhanced styling */}
          <div className="flex items-center space-x-4">
            {/* Connection Status - Enhanced with animation */}
            <div className={`flex items-center space-x-3 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border backdrop-blur-sm ${
              isConnected 
                ? 'bg-success-50/80 text-success-700 border-success-200/60 hover:bg-success-100/80' 
                : 'bg-error-50/80 text-error-700 border-error-200/60 hover:bg-error-100/80'
            }`}>
              <div className="relative">
                {isConnected ? (
                  <Wifi className="w-4 h-4" />
                ) : (
                  <WifiOff className="w-4 h-4" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full relative ${
                  isConnected ? 'bg-success-500' : 'bg-error-500'
                }`}>
                  {isConnected && (
                    <div className="absolute inset-0 w-2 h-2 bg-success-500 rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
                <span className="font-semibold">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
            </div>
            
            {/* Settings Button - Enhanced */}
            <button
              onClick={onSettingsClick}
              className="flex items-center justify-center w-11 h-11 bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-700 hover:text-neutral-900 rounded-xl transition-all duration-200 hover:shadow-md active:scale-95 backdrop-blur-sm border border-neutral-200/60"
              title="Settings"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;