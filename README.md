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

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd nexusagents
```

2. Install dependencies:
```bash
npm install
pip install -r requirements.txt
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

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The Python API routes will automatically be deployed as serverless functions.

## Project Structure

```
nexusagents/
├── api/
│   └── crew/
│       └── index.py          # CrewAI backend API
├── app/
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── MissionControl.tsx    # Mission input component
│   ├── MatrixTerminal.tsx    # Live logs terminal
│   └── ArtifactPanel.tsx     # Generated artifact display
├── lib/
│   └── supabase.ts           # Supabase client
├── supabase/
│   └── schema.sql            # Database schema
├── requirements.txt          # Python dependencies
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

## Configuration

### Vercel Configuration

The `vercel.json` file configures:
- Python 3.11 runtime for API routes
- 60-second max duration for serverless functions
- API route rewrites

### CrewAI Agents

The platform includes three specialized agents:

1. **Researcher**: Searches the web using Serper
2. **Developer**: Analyzes content and documentation
3. **Manager**: Coordinates the team and synthesizes results

## Troubleshooting

### Python Dependencies

If you encounter issues with Python dependencies:
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Vercel Deployment

- Ensure Python 3.11 is selected in Vercel settings
- Check that all environment variables are set
- Review function logs in Vercel dashboard

### Supabase Connection

- Verify your Supabase URL and keys
- Check that the missions table exists
- Ensure RLS policies are configured correctly

## License

MIT

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Support

For issues and questions, please open a GitHub issue.
