import { NextRequest } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

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
          // Spawn Python process
          const pythonScript = path.join(process.cwd(), 'api', 'crew', 'route.py')
          const python = spawn('python3.11', [pythonScript], {
            env: { ...process.env },
          })

          // Send mission data to Python
          python.stdin.write(JSON.stringify({ mission }))
          python.stdin.end()

          // Stream Python output
          python.stdout.on('data', (data) => {
            const lines = data.toString().split('\n').filter((line: string) => line.trim())
            for (const line of lines) {
              try {
                const event = JSON.parse(line)
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
              } catch (e) {
                // Skip invalid JSON
              }
            }
          })

          python.stderr.on('data', (data) => {
            console.error('Python error:', data.toString())
          })

          python.on('close', (code) => {
            if (code !== 0) {
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'error', message: 'Python process failed' })}\n\n`
                )
              )
            }
            controller.close()
          })

          python.on('error', (error) => {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`
              )
            )
            controller.close()
          })
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
