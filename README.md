## Deploy to Vercel

This project can be deployed to Vercel with the full Express backend.

### Required environment variables
Set these in your Vercel project settings:

- `GEMINI_API_KEY`

If you use any other keys from `.env.example`, add them in the same way.

### Deployment steps
1. Push this repo to GitHub.
2. Import the repository into Vercel.
3. Use the default Vercel settings.
4. Set the build command to:
   ```bash
   npm run vercel-build
   ```
5. Keep the output directory as `dist`.
6. Add the required environment variables under Project > Settings > Environment Variables.
7. Deploy.

### API endpoints
Once deployed, the app should be available at:
- `https://<your-project>.vercel.app/api/health`
- `https://<your-project>.vercel.app/api/chat`
- `https://<your-project>.vercel.app/api/tts`

> Note: Vercel functions have cold starts and execution limits. If the Gemini TTS or multi-AI endpoints time out, consider moving those to a dedicated backend host.
