# NexusAgents 🚀

A production-ready AI agent orchestration platform powered by CrewAI, Groq, and Next.js.

## Features

- 🤖 **Multi-Agent System**: Researcher, Developer, and Manager agents working in harmony
- ⚡ **Real-time Streaming**: Live execution preview with Matrix-style terminal
- 🎨 **Stunning UI**: Glassmorphism effects, animations, and syntax highlighting
- 🗄️ **Supabase Integration**: Store mission history and results
- 🌐 **Serverless**: Fully deployable to Vercel
- 🔧 **Powered by Groq**: Lightning-fast LLM inference

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, Framer Motion
- **Backend**: Python 3.11, CrewAI, Groq API
- **Database**: Supabase (PostgreSQL)
- **Tools**: Serper (Search), Browserless (Web Scraping)
- **Deployment**: Vercel

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.11+
- Supabase account
- API keys (Groq, Serper, Browserless)

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/rajshah9305/crewsdashboardai.git
cd crewsdashboardai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys:
- `GROQ_API_KEY`: Your Groq API key
- `SERPER_API_KEY`: Your Serper API key
- `BROWSERLESS_API_KEY`: Your Browserless API key
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

4. Set up Supabase:
- Create a new Supabase project
- Run the SQL in `supabase/schema.sql` in the SQL editor

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Deployment to Vercel

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard:
   - `GROQ_API_KEY`
   - `SERPER_API_KEY`
   - `BROWSERLESS_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Deploy!

### 2. Vercel Configuration

The `vercel.json` file is configured for:
- Next.js framework
- Python 3.11 runtime for API routes
- 60-second max duration for CrewAI functions
- Automatic serverless function deployment

### 3. Environment Variables

Set these in your Vercel dashboard under Project Settings > Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `GROQ_API_KEY` | Your Groq API key for LLM inference | ✅ |
| `SERPER_API_KEY` | Your Serper API key for web search | ✅ |
| `BROWSERLESS_API_KEY` | Your Browserless API key for web scraping | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key | ✅ |

## Project Structure

```
nexusagents/
├── api/
│   ├── crew/
│   │   └── index.py          # CrewAI backend API
│   ├── index.py              # Health check API
│   └── requirements.txt      # Python dependencies
├── app/
│   ├── api/crew/
│   │   └── route.ts          # Local development API route
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── MissionControl.tsx    # Mission input component
│   ├── MatrixTerminal.tsx    # Live logs terminal
│   ├── HistoryPanel.tsx      # Mission history
│   └── ArtifactPanel.tsx     # Generated artifact display
├── lib/
│   └── supabase.ts           # Supabase client
├── supabase/
│   └── schema.sql            # Database schema
├── package.json              # Node dependencies
├── vercel.json               # Vercel configuration
└── README.md
```

## Usage

1. Enter your mission objective in the Mission Control panel
2. Click "Launch Mission" to start the agent execution
3. Watch the agents collaborate in real-time in the Matrix Terminal
4. View the generated artifact in the right panel
5. Mission results are automatically saved to Supabase

## Example Missions

- "Research the latest trends in AI agent orchestration and provide a comprehensive report"
- "Analyze the best practices for building serverless applications with Next.js"
- "Investigate the current state of LLM model performance and benchmarks"

## API Reference

### POST /api/crew

Execute a CrewAI mission with streaming response.

**Request Body:**
```json
{
  "mission": "Your mission objective here"
}
```

**Response:**
Server-Sent Events (SSE) stream with the following event types:

- `log`: Agent activity logs
- `artifact`: Generated content chunks
- `complete`: Mission completion
- `error`: Error messages

## Troubleshooting

### Vercel Deployment Issues

1. **Python Dependencies**: Ensure all dependencies in `api/requirements.txt` are compatible with Python 3.11
2. **Environment Variables**: Verify all required environment variables are set in Vercel dashboard
3. **Function Timeout**: CrewAI operations may take time; the timeout is set to 60 seconds
4. **Cold Starts**: First request may be slower due to serverless cold starts

### Local Development

- **API Routes**: Local development uses TypeScript API routes with simulated responses
- **Production**: Vercel deployment uses Python serverless functions with real CrewAI agents
- **Environment**: Make sure `.env.local` has all required API keys

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open a GitHub issue.
