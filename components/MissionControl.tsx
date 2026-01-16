'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface MissionControlProps {
  onMissionStart: (mission: string) => void
  isExecuting: boolean
}

export default function MissionControl({ onMissionStart, isExecuting }: MissionControlProps) {
  const [mission, setMission] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mission.trim() && !isExecuting) {
      onMissionStart(mission)
    }
  }

  const exampleMissions = [
    "Research the latest trends in AI agent orchestration and provide a comprehensive report",
    "Analyze the best practices for building serverless applications with Next.js",
    "Investigate the current state of LLM model performance and benchmarks"
  ]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass rounded-2xl p-6 md:p-8"
    >
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse"></div>
          <h2 className="text-2xl font-bold text-gray-900">Mission Control</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <textarea
              value={mission}
              onChange={(e) => setMission(e.target.value)}
              placeholder="Enter your mission objective..."
              className="w-full h-32 bg-white border-2 border-gray-300 rounded-xl p-4 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-600 focus:ring-4 focus:ring-orange-600/10 transition-all resize-none font-medium"
              disabled={isExecuting}
            />
            <div className="absolute bottom-4 right-4 text-xs text-gray-600 font-semibold">
              {mission.length} characters
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {exampleMissions.map((example, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setMission(example)}
                disabled={isExecuting}
                className="text-xs px-3 py-2 glass-dark rounded-lg text-gray-700 font-semibold hover:text-gray-900 hover:border-orange-600/50 transition-all disabled:opacity-50"
              >
                Example {idx + 1}
              </button>
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={!mission.trim() || isExecuting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 bg-gradient-to-r from-orange-600 via-orange-500 to-orange-600 rounded-xl font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-orange-500/50"
          >
            {isExecuting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Executing Mission...
              </span>
            ) : (
              '🚀 Launch Mission'
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  )
}
