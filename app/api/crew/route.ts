import { NextRequest } from 'next/server'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Backend API URL - set via environment variable
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

export async function POST(request: NextRequest) {
  try {
    const { mission } = await request.json()

    if (!mission) {
      return new Response(
        JSON.stringify({ error: 'Mission is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          // Call the FastAPI backend
          const response = await fetch(`${BACKEND_URL}/tasks`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ task_description: mission }),
          })

          if (!response.ok) {
            throw new Error(`Backend API error: ${response.statusText}`)
          }

          const data = await response.json()
          const taskId = data.task_id

          // Send initial log
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'log', 
              agent: 'System', 
              message: '🚀 Mission initiated...' 
            })}\n\n`)
          )

          // Poll for task updates
          let completed = false
          let lastLogCount = 0

          while (!completed) {
            await sleep(1000)

            // Get task status
            const statusResponse = await fetch(`${BACKEND_URL}/tasks/${taskId}`)
            const taskData = await statusResponse.json()

            // Stream new logs
            if (taskData.execution_log && taskData.execution_log.length > lastLogCount) {
              for (let i = lastLogCount; i < taskData.execution_log.length; i++) {
                const log = taskData.execution_log[i]
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'log', 
                    agent: log.agent, 
                    message: log.message 
                  })}\n\n`)
                )
              }
              lastLogCount = taskData.execution_log.length
            }

            // Check if completed
            if (taskData.status === 'completed' || taskData.status === 'failed') {
              completed = true

              if (taskData.result) {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'artifact', 
                    content: taskData.result 
                  })}\n\n`)
                )
              }

              if (taskData.status === 'completed') {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'log', 
                    agent: 'System', 
                    message: '✅ Mission complete!' 
                  })}\n\n`)
                )
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`)
                )
              } else {
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ 
                    type: 'error', 
                    message: taskData.result || 'Task failed' 
                  })}\n\n`)
                )
              }
            }
          }

          controller.close()
        } catch (error) {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', message: String(error) })}\n\n`
            )
          )
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
