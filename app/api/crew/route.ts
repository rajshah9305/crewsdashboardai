import { NextRequest } from 'next/server'

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
          // Demo mode - simulate agent execution
          const agents = ['Research Agent', 'Analysis Agent', 'Writer Agent']
          
          // Send initial log
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'log', 
              agent: 'System', 
              message: '🚀 Mission initiated...' 
            })}\n\n`)
          )

          await sleep(1000)

          // Simulate agent work
          for (const agent of agents) {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ 
                type: 'log', 
                agent, 
                message: `Working on: ${mission}` 
              })}\n\n`)
            )
            await sleep(1500)
          }

          // Generate artifact
          const artifact = `# Mission Report: ${mission}\n\n## Analysis\n\nThis is a demo response. To enable full AI agent capabilities:\n\n1. Deploy the Python backend separately (Railway, Render, etc.)\n2. Update the API endpoint in this file\n3. Or run the full stack locally\n\n## Summary\n\nMission objective received and processed in demo mode.\n\n**Status:** Demo Mode Active\n**Mission:** ${mission}\n**Timestamp:** ${new Date().toISOString()}`

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'artifact', 
              content: artifact 
            })}\n\n`)
          )

          await sleep(500)

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ 
              type: 'log', 
              agent: 'System', 
              message: '✅ Mission complete (Demo Mode)' 
            })}\n\n`)
          )

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ type: 'complete' })}\n\n`)
          )

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
