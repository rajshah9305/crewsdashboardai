import { useEffect, useState } from 'react';
import { wsService } from '../services/api';

export const useWebSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleConnected = () => setIsConnected(true);
    const handleDisconnected = () => setIsConnected(false);
    const handleMessage = (data) => {
      setMessages(prev => [...prev, { ...data, timestamp: new Date() }]);
    };

    wsService.on('connected', handleConnected);
    wsService.on('disconnected', handleDisconnected);
    wsService.on('message', handleMessage);

    wsService.connect();

    return () => {
      wsService.off('connected', handleConnected);
      wsService.off('disconnected', handleDisconnected);
      wsService.off('message', handleMessage);
    };
  }, []);

  return {
    isConnected,
    messages,
    clearMessages: () => setMessages([])
  };
};