'use client'

import { useState } from 'react'
import MissionControl from '@/components/MissionControl'
import MatrixTerminal from '@/components/MatrixTerminal'
import ArtifactPanel from '@/components/ArtifactPanel'
import HistoryPanel from '@/components/HistoryPanel'
import { motion } from 'framer-motion'
import { saveMission } from '@/lib/supabase'

export default function Home() {
  const [logs, setLogs] = useState<Array<{ agent: string; message: string; timestamp: Date }>>([])
  const [artifact, setArtifact] = useState<string>('')
  const [isExecuting, setIsExecuting] = useState(false)

  const handleMissionStart = async (mission: string) => {
    setIsExecuting(true)
    setLogs([])
    setArtifact('')
    
    let finalArtifact = ''
    let missionStatus: 'completed' | 'failed' = 'completed'

    try {
      const response = await fetch('/api/crew', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mission }),
      })

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No reader available')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'log') {
              setLogs(prev => [...prev, {
                agent: data.agent,
                message: data.message,
                timestamp: new Date()
              }])
            } else if (data.type === 'artifact') {
              const newContent = data.content
              finalArtifact += newContent
              setArtifact(prev => prev + newContent)
            } else if (data.type === 'complete') {
              setIsExecuting(false)
              // Save to Supabase
              await saveMission(mission, finalArtifact, missionStatus)
            } else if (data.type === 'error') {
              missionStatus = 'failed'
              setLogs(prev => [...prev, {
                agent: 'System',
                message: `❌ Error: ${data.message}`,
                timestamp: new Date()
              }])
              setIsExecuting(false)
              await saveMission(mission, data.message, missionStatus)
            }
          }
        }
      }
    } catch (error) {
      missionStatus = 'failed'
      const errorMsg = error instanceof Error ? error.message : String(error)
      setLogs(prev => [...prev, {
        agent: 'System',
        message: `❌ Connection error: ${errorMsg}`,
        timestamp: new Date()
      }])
      setIsExecuting(false)
      await saveMission(mission, errorMsg, missionStatus)
    }
  }

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-gradient">
            NexusAgents
          </h1>
          <p className="text-gray-400 text-lg">
            AI Agent Orchestration Platform
          </p>
        </motion.div>

        {/* Mission Control */}
        <MissionControl onMissionStart={handleMissionStart} isExecuting={isExecuting} />

        {/* Split View: Terminal + Artifact */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MatrixTerminal logs={logs} isExecuting={isExecuting} />
          <ArtifactPanel artifact={artifact} isExecuting={isExecuting} />
        </div>

        {/* History Panel */}
        <HistoryPanel />
      </div>
    </main>
  )
}
