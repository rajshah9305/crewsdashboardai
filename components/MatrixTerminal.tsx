'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Log {
  agent: string
  message: string
  timestamp: Date
}

interface MatrixTerminalProps {
  logs: Log[]
  isExecuting: boolean
}

export default function MatrixTerminal({ logs, isExecuting }: MatrixTerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState<string>('all')

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  const getAgentColor = (agent: string) => {
    const colors: Record<string, string> = {
      'System': 'text-orange-700',
      'Researcher': 'text-orange-600',
      'Developer': 'text-blue-700',
      'Manager': 'text-amber-700'
    }
    return colors[agent] || 'text-gray-700'
  }

  const getAgentIcon = (agent: string) => {
    const icons: Record<string, string> = {
      'System': '⚙️',
      'Researcher': '🔍',
      'Developer': '⚡',
      'Manager': '🎯'
    }
    return icons[agent] || '💬'
  }

  const filteredLogs = filter === 'all' 
    ? logs 
    : logs.filter(log => log.agent.toLowerCase() === filter.toLowerCase())

  const agentCounts = logs.reduce((acc, log) => {
    acc[log.agent] = (acc[log.agent] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-dark rounded-2xl p-6 h-[700px] flex flex-col border-2 border-orange-600/25 shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-gray-200">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-md"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-md"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-md"></div>
          </div>
          <span className="text-sm font-bold text-gray-900">
            Agent Terminal
          </span>
        </div>
        {isExecuting && (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 border-2 border-green-600"
          >
            <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
            <span className="text-xs font-bold text-green-800">LIVE</span>
          </motion.div>
        )}
      </div>

      {/* Stats Bar */}
      {logs.length > 0 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`text-xs px-3 py-2 rounded-lg transition-all font-semibold ${
              filter === 'all' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-orange-600/50 hover:bg-gray-50'
            }`}
          >
            All ({logs.length})
          </button>
          {Object.entries(agentCounts).map(([agent, count]) => (
            <button
              key={agent}
              onClick={() => setFilter(agent)}
              className={`text-xs px-3 py-2 rounded-lg transition-all font-semibold ${
                filter === agent
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 border-2 border-gray-300 hover:border-orange-600/50 hover:bg-gray-50'
              }`}
            >
              {getAgentIcon(agent)} {agent} ({count})
            </button>
          ))}
        </div>
      )}

      {/* Terminal Content */}
      <div
        ref={terminalRef}
        className="flex-1 overflow-y-auto space-y-2 matrix-text text-sm scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {filteredLogs.length === 0 && !isExecuting && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className="text-6xl opacity-30">🤖</div>
              <p className="text-gray-600 font-medium">Waiting for mission...</p>
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-600/40 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-orange-600/40 animate-pulse delay-75"></div>
                <div className="w-2 h-2 rounded-full bg-orange-600/40 animate-pulse delay-150"></div>
              </div>
            </motion.div>
          )}

          {filteredLogs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.2, delay: idx * 0.02 }}
              className="flex gap-3 p-3 rounded-lg hover:bg-orange-50 transition-colors group border border-transparent hover:border-orange-200"
            >
              <span className="text-gray-600 text-xs font-mono min-w-[75px] font-semibold">
                {log.timestamp.toLocaleTimeString()}
              </span>
              <span className={`font-bold text-sm ${getAgentColor(log.agent)} min-w-[110px] flex items-center gap-1.5`}>
                <span className="text-base">{getAgentIcon(log.agent)}</span>
                <span>[{log.agent}]</span>
              </span>
              <span className="text-gray-800 flex-1 leading-relaxed font-medium">{log.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>

        {isExecuting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 text-orange-700 p-3 font-semibold"
          >
            <motion.span
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="text-lg"
            >
              ▊
            </motion.span>
            <span>Processing...</span>
            <div className="flex gap-1 ml-2">
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                className="w-2 h-2 rounded-full bg-orange-600"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                className="w-2 h-2 rounded-full bg-orange-600"
              />
              <motion.div
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                className="w-2 h-2 rounded-full bg-orange-600"
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer Stats */}
      {logs.length > 0 && (
        <div className="mt-4 pt-4 border-t-2 border-gray-200 flex items-center justify-between text-xs text-gray-700 font-semibold">
          <span>{filteredLogs.length} messages</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-orange-600"></span>
            Terminal Active
          </span>
        </div>
      )}
    </motion.div>
  )
}
