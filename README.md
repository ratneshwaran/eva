# Eva by 40seconds.org / Ratneshwaran M

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

## Author

- **Name**: Ratneshwaran Maheswaran
- **Affiliation**: University College London
- **Email**: ratneshwaran.maheswaran.21@ucl.ac.uk

## License

Licensed under the Creative Commons Attribution 4.0 International License.
To view a copy of this license, visit https://creativecommons.org/licenses/by/4.0/
