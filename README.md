# Mind AI by 40seconds.org

A mental health support AI assistant that provides empathetic conversations and support.

## Features

- Real-time AI-powered conversations
- Mental health support and coping strategies
- Modern, responsive UI
- Secure message handling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local` and add your OpenAI API key:
   ```bash
   cp .env.example .env.local
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com) and create a new project
3. Import your GitHub repository
4. Add the following environment variable in Vercel:
   - `OPENAI_API_KEY`: Your OpenAI API key
5. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm start
   ```

## Environment Variables

- `OPENAI_API_KEY`: Your OpenAI API key (required)

## Security Notes

- Never commit your `.env.local` file
- Keep your API keys secure
- Use environment variables for sensitive data

## License

Copyright © 2024 40seconds.org. All rights reserved.
