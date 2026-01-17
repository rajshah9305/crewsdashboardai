'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface ArtifactPanelProps {
  artifact: string
  isExecuting: boolean
}

export default function ArtifactPanel({ artifact, isExecuting }: ArtifactPanelProps) {
  const [copied, setCopied] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new content is added
  useEffect(() => {
    if (contentRef.current && artifact) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight
    }
  }, [artifact])

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = artifact.split(/\s+/).filter(w => w.length > 0).length
  const charCount = artifact.length
  const lineCount = artifact.split('\n').length

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-dark rounded-2xl p-6 h-[700px] flex flex-col border-2 border-orange-600/30 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-orange-200">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ 
              boxShadow: ['0 0 8px rgba(234, 88, 12, 0.5)', '0 0 20px rgba(234, 88, 12, 0.8)', '0 0 8px rgba(234, 88, 12, 0.5)']
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3.5 h-3.5 rounded-full bg-orange-600 shadow-lg"
          />
          <span className="text-base font-black text-black tracking-tight">
            Generated Artifact
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {artifact && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCopy}
              className={`text-xs px-5 py-2.5 rounded-lg transition-all flex items-center gap-2 font-bold tracking-wide ${
                copied 
                  ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' 
                  : 'bg-white text-black border-2 border-black hover:border-orange-600 hover:text-orange-600 hover:bg-orange-50'
              }`}
            >
              {copied ? '✓ Copied!' : '📋 Copy'}
            </motion.button>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      {artifact && (
        <div className="flex gap-5 mb-4 text-sm text-black font-bold">
          <span className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <span className="text-orange-600 text-base">📝</span> {wordCount} words
          </span>
          <span className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <span className="text-orange-600 text-base">🔤</span> {charCount} chars
          </span>
          <span className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <span className="text-orange-600 text-base">📄</span> {lineCount} lines
          </span>
        </div>
      )}

      {/* Content Area */}
      <div 
        ref={contentRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-600/50 scrollbar-track-transparent max-h-[500px]"
      >
        {!artifact && !isExecuting && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-5"
          >
            <motion.div 
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.15, 1]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-9xl opacity-40"
            >
              ✨
            </motion.div>
            <p className="text-black text-center font-bold text-lg">Artifacts will appear here</p>
            <p className="text-black text-sm text-center max-w-xs font-bold">
              Generated content, code, and reports will be displayed in this panel
            </p>
          </motion.div>
        )}

        {artifact && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
          >
            <div className="prose prose-sm max-w-none bg-gradient-to-br from-orange-50/30 to-white p-8 rounded-xl border-2 border-orange-200 shadow-inner">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom styling for markdown elements
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-orange-200">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold text-gray-800 mb-3 mt-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 mb-3 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 mb-1">
                      {children}
                    </li>
                  ),
                  code: ({ inline, className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : 'text'
                    
                    return !inline ? (
                      <div className="relative mb-4">
                        <div className="absolute top-2 right-2 text-xs text-gray-400 font-mono bg-gray-800 px-2 py-1 rounded z-10">
                          {language}
                        </div>
                        <SyntaxHighlighter
                          style={oneDark}
                          language={language}
                          PreTag="div"
                          className="rounded-lg text-sm"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    ) : (
                      <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  },
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-orange-400 pl-4 italic text-gray-600 mb-4">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto mb-4">
                      <table className="min-w-full border border-gray-300">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="border border-gray-300 px-4 py-2">
                      {children}
                    </td>
                  ),
                  hr: () => (
                    <hr className="border-t-2 border-orange-200 my-6" />
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-gray-900">
                      {children}
                    </strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">
                      {children}
                    </em>
                  ),
                }}
              >
                {artifact}
              </ReactMarkdown>
            </div>
          </motion.div>
        )}

        {isExecuting && !artifact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 gap-7"
          >
            <div className="relative w-28 h-28">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[5px] border-orange-200 rounded-full"
              />
              <motion.div 
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-3 border-[5px] border-transparent border-t-orange-600 rounded-full shadow-lg"
              />
              <motion.div 
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="absolute inset-8 bg-orange-600/30 rounded-full shadow-inner"
              />
            </div>
            <div className="text-center">
              <p className="text-black font-black mb-2 text-xl tracking-tight">Generating artifact...</p>
              <p className="text-black text-base font-bold">AI agents are crafting your content</p>
            </div>
            <div className="flex gap-2.5">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{ 
                    y: [0, -15, 0],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.1
                  }}
                  className="w-3 h-3 rounded-full bg-orange-600 shadow-xl"
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      {artifact && (
        <div className="mt-4 pt-4 border-t-2 border-orange-200 flex items-center justify-between text-sm text-black font-bold">
          <span>Generated by NexusAgents</span>
          <span className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-200">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-600 shadow-lg"></span>
            Ready
          </span>
        </div>
      )}
    </motion.div>
  )
}
