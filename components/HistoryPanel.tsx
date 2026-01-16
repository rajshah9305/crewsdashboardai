'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getMissions, Mission } from '@/lib/supabase'

export default function HistoryPanel() {
  const [missions, setMissions] = useState<Mission[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const loadMissions = async () => {
    setLoading(true)
    const data = await getMissions(10)
    setMissions(data)
    setLoading(false)
  }

  useEffect(() => {
    if (isOpen) {
      loadMissions()
    }
  }, [isOpen])

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-nexus-purple to-nexus-blue rounded-full flex items-center justify-center shadow-lg hover:shadow-nexus-purple/50 transition-all z-50"
      >
        <span className="text-2xl">📜</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-full md:w-[500px] glass-dark border-l border-nexus-purple/30 z-50 overflow-hidden"
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white">Mission History</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-red-500/20 transition-all"
                  >
                    ✕
                  </button>
                </div>

                {loading ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin w-8 h-8 border-4 border-nexus-purple/30 border-t-nexus-purple rounded-full" />
                  </div>
                ) : missions.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No missions yet
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto space-y-4">
                    {missions.map((mission) => (
                      <motion.div
                        key={mission.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-xs px-2 py-1 rounded ${
                            mission.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {mission.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(mission.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 line-clamp-2">
                          {mission.mission}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
