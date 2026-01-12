import { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

const ChatBox = ({ onSendMessage, onExecutionStart }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const currentMessage = message;
    setMessage('');
    setIsLoading(true);

    try {
      // Check if message is a task execution request
      const isTaskExecution = currentMessage.toLowerCase().includes('execute') || 
                             currentMessage.toLowerCase().includes('run') ||
                             currentMessage.toLowerCase().includes('start task') ||
                             currentMessage.toLowerCase().includes('create');

      if (isTaskExecution) {
        onExecutionStart({
          task_name: currentMessage,
          agent_name: 'AI Assistant',
          description: 'Processing user request...',
          timestamp: new Date()
        });
      }

      await onSendMessage(currentMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      // Restore message on error
      setMessage(currentMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };



  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-sm rounded-t-xl overflow-hidden">
      {/* Enhanced Header */}
      <div className="px-6 py-4 border-b border-neutral-100/60 bg-gradient-to-r from-neutral-50/80 to-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-3 h-3 bg-success-500 rounded-full"></div>
              <div className="absolute inset-0 w-3 h-3 bg-success-500 rounded-full animate-ping opacity-75"></div>
            </div>
            <div>
              <span className="text-sm font-semibold text-neutral-800">AI Assistant</span>
              <p className="text-xs text-neutral-500">Ready to help with your tasks</p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs text-neutral-400">
            <span>Press Enter to send</span>
            <kbd className="px-2 py-1 bg-neutral-100/80 rounded-md text-neutral-600 font-mono border border-neutral-200/60">⏎</kbd>
          </div>
        </div>
      </div>

      {/* Enhanced Input Area */}
      <div className="flex-1 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`relative transition-all duration-300 ${isFocused ? 'transform scale-[1.01]' : ''}`}>
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Describe your task or ask a question... (Shift+Enter for new line)"
              className={`w-full px-4 py-3 text-sm border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-400 resize-none transition-all duration-300 backdrop-blur-sm ${
                isFocused 
                  ? 'border-brand-300 shadow-lg bg-white/95 shadow-brand-500/10' 
                  : 'border-neutral-300/60 shadow-sm bg-white/80'
              } ${isLoading ? 'opacity-75' : ''}`}
              rows="3"
              disabled={isLoading}
              maxLength={1000}
            />
            
            {/* Character Counter */}
            <div className="absolute bottom-2 left-4 text-xs text-neutral-400">
              <span className={message.length > 900 ? 'text-warning-500' : ''}>{message.length}</span>/1000
            </div>
            
            {/* Send Button - Enhanced */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading}
              className={`absolute bottom-2 right-2 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 backdrop-blur-sm ${
                !message.trim() || isLoading
                  ? 'bg-neutral-100/80 text-neutral-400 cursor-not-allowed border border-neutral-200/60'
                  : 'bg-gradient-to-r from-brand-500 to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 hover:shadow-md active:scale-95 shadow-sm hover:shadow-brand-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatBox;