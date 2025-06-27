# Email AI Writer Backend

AI-powered email sequence generator backend using the LEGO framework.

## 🚀 Railway Deployment

This backend is configured for Railway deployment.

### Environment Variables Required

Set these in your Railway project settings:

- `OPENAI_API_KEY` - Your OpenAI API key
- `OPENAI_MODEL` - Model to use (default: gpt-4o)
- `PORT` - Port number (Railway sets this automatically)

### Health Check

The app includes a health check endpoint at `/health` for Railway monitoring.

### API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/generate-sequence` - Generate email sequence
- `POST /api/edit-email` - Edit email with AI

## Local Development

```bash
npm install
npm run dev
```

The server will start on port 3001 (or PORT environment variable). 