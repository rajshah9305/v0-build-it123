# NexusAI - Advanced Multi-Provider AI Chatbot

A sophisticated, open-source chatbot application that supports multiple AI service providers with advanced tools, collaboration features, and a modern interface design.

## 🚀 Project Vision

NexusAI is designed as a spiritual successor to ChatWise, focusing on:
- **Multi-Provider Support**: Seamlessly switch between OpenAI, Anthropic, Google, and other AI providers
- **Advanced Tools**: Code execution, image generation, and collaborative features
- **Modern Interface**: Clean, responsive design with dark/light theme support
- **Extensibility**: Built for easy customization and feature additions

## ✨ Key Features

### Core Functionality
- **Multi-Provider AI Integration**: Support for GPT-4, Claude 3, Gemini Pro, and more
- **Real-time Chat Interface**: Fast, responsive messaging with typing indicators
- **Theme Support**: Beautiful dark and light modes
- **Provider Management**: Easy switching between AI providers with status indicators

### Advanced Tools (Coming Soon)
- **Code Execution**: Safe, sandboxed environment for running code
- **Image Generation**: Integration with DALL-E, Stable Diffusion, and other models
- **Collaborative Workspaces**: Multi-user chat sessions and shared projects
- **Generative UI**: Create React components and HTML/CSS from prompts

## 🛠 Tech Stack

- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens
- **UI Components**: shadcn/ui component library
- **Database**: Supabase (PostgreSQL) with real-time subscriptions
- **Authentication**: Supabase Auth with multiple providers
- **AI Integration**: Vercel AI SDK for unified provider interface
- **Deployment**: Vercel with automatic deployments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Supabase account (for database and auth)
- AI provider API keys (OpenAI, Anthropic, etc.)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/yourusername/nexusai.git
   cd nexusai
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Fill in your environment variables:
   \`\`\`env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # AI Providers
   OPENAI_API_KEY=your_openai_key
   ANTHROPIC_API_KEY=your_anthropic_key
   GOOGLE_AI_API_KEY=your_google_ai_key
   
   # Optional: Additional providers
   GROQ_API_KEY=your_groq_key
   DEEPINFRA_API_KEY=your_deepinfra_key
   \`\`\`

4. **Run the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   \`\`\`

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### API Keys Management
API keys are securely managed through environment variables and can be configured per user through the settings interface. The application supports:

- **OpenAI**: GPT-4, GPT-4 Vision, DALL-E 3
- **Anthropic**: Claude 3 (Opus, Sonnet, Haiku)
- **Google**: Gemini Pro, Gemini Pro Vision
- **Additional**: Groq, DeepInfra, and other compatible providers

### Database Setup
The application uses Supabase for data persistence. Run the included SQL migrations to set up the required tables:

\`\`\`sql
-- Users table (handled by Supabase Auth)
-- Conversations table
-- Messages table
-- User settings and API keys (encrypted)
\`\`\`

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure environment variables
   - Deploy automatically

3. **Set up Supabase Integration**
   - Add Supabase integration in Vercel dashboard
   - Configure environment variables automatically

### Manual Deployment
\`\`\`bash
npm run build
npm start
\`\`\`

## 🏗 Architecture

\`\`\`
NexusAI/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── chat/              # Chat pages
│   └── settings/          # Settings pages
├── components/            # React components
│   ├── chat/             # Chat-specific components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility functions
│   ├── ai/              # AI provider integrations
│   ├── db/              # Database utilities
│   └── utils.ts         # General utilities
├── types/               # TypeScript type definitions
└── public/              # Static assets
\`\`\`

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by [ChatWise](https://github.com/egoist/chatwise-releases) for its multi-provider approach
- Built with [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- Powered by [Vercel AI SDK](https://sdk.vercel.ai/) for AI integrations

## 📞 Support

- 📧 Email: support@nexusai.dev
- 💬 Discord: [Join our community](https://discord.gg/nexusai)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/nexusai/issues)

---

**NexusAI** - Connecting you to the future of AI collaboration.
