# repuposemate - AI-Powered Content Repurposer

🚀 **Transform your long-form content into engaging social media posts with AI**

Perfect for indie makers, solopreneurs, and content creators who want to scale their content without hiring a team.

## ✨ Features

- **AI-Powered Content Transformation** - Turn blog posts, articles, and long-form content into platform-optimized social media posts
- **3 Social Media Formats** - Twitter Threads, LinkedIn Carousels, and Instagram Reels
- **Real-time Content Analysis** - Get readability scores, engagement metrics, and improvement tips as you type
- **Content Preferences** - Customize tone, style, and format preferences for each platform
- **Content Library** - Save and manage your generated content with search and filtering
- **Usage Tracking** - Monitor your daily usage with clear limits and remaining credits
- **Export & Share** - Copy to clipboard, download as files, or share directly
- **Secure Authentication** - Built with Supabase for secure user management
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 via OpenRouter
- **Database**: Supabase (PostgreSQL)
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Lucide React
- **UI Components**: Radix UI

## 🎨 Design System

### Colors
- **Primary**: Blue gradients (#3B82F6 to #8B5CF6)
- **Secondary**: Purple accents (#8B5CF6)
- **Success**: Green (#10B981)
- **Background**: Slate grays (#F8FAFC to #64748B)

### Key Features
- Glassmorphism effects
- Smooth micro-interactions
- Gradient text and buttons
- Custom scrollbars
- Pulse animations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. **Clone and install**
   ```bash
   git clone <repository>
   cd content-repurposer
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Fill in your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🔒 Authentication Flow

1. **Landing Page** → User discovers value proposition
2. **Auth Page** → User signs up/logs in with Supabase
3. **Dashboard** → Protected content creation area
4. **Logout** → Clean session termination

## 🎯 Content Transformation

### Supported Formats

1. **Twitter Threads**
   - 5-15 engaging tweets with viral hooks
   - Strategic emoji usage and hashtags
   - Thread structure optimized for engagement
   - Platform-specific character limits

2. **LinkedIn Carousels**
   - 6-8 professional slides
   - Business-focused content with actionable insights
   - Professional tone and industry expertise
   - Statistics and data-driven content

3. **Instagram Reels**
   - Short-form video script format
   - Visual storytelling elements
   - Engagement prompts and calls-to-action
   - Mobile-optimized content structure

### Content Analysis Features
- **Readability Scoring** - Flesch Reading Ease scores and reading level assessment
- **Engagement Metrics** - Question detection, emotional language analysis, action word identification
- **Content Quality** - Sentence length analysis, passive voice detection, jargon identification
- **Improvement Tips** - Real-time suggestions for better content optimization

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile content creation
- **Tablet Friendly**: Perfect for on-the-go editing
- **Desktop Power**: Full feature set for power users

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes (transform, usage, history, etc.)
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Main content transformation interface
│   ├── history/        # Content library and history
│   ├── settings/       # User settings and preferences
│   ├── help/           # Help center and FAQ
│   ├── contact/        # Contact form and support
│   ├── privacy/        # Privacy policy
│   ├── cookies/        # Cookie policy
│   └── pricing/        # Pricing plans (coming soon)
├── components/         # Reusable components
│   ├── content-analysis-display.tsx
│   ├── content-preferences.tsx
│   ├── content-preview-modal.tsx
│   ├── interactive-demo.tsx
│   └── ui/            # UI component library
└── lib/               # Utilities and configurations
    ├── auth-context-production.tsx
    ├── content-analysis.ts
    ├── prompt-engine.ts
    ├── supabase-production.ts
    └── openrouter-client.ts
```

### Key Files
- `middleware.ts` - Route protection and auth handling
- `src/app/api/transform/route.ts` - AI transformation endpoint
- `src/lib/prompt-engine.ts` - Advanced prompt engineering system
- `src/lib/content-analysis.ts` - Content analysis and metrics
- `src/lib/auth-context-production.tsx` - Production authentication context
- `src/components/ui/` - Reusable UI components

## 🎨 Customization

### Adding New Content Formats
1. Add new format to `contentTypes` array in dashboard
2. Create prompt in `src/app/api/transform/route.ts`
3. Add mock content for development

### Styling
- Global styles in `src/app/globals.css`
- Component variants in `src/components/ui/`
- Custom animations and effects

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Environment Variables
Set the same environment variables in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## 🔐 Security

- Protected routes with middleware
- Secure environment variable handling
- Supabase RLS (Row Level Security) ready
- Client-side auth state management

## 📊 Analytics & Monitoring

Ready to integrate:
- Google Analytics
- PostHog
- Mixpanel
- Custom usage tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

- **Documentation**: Check this README
- **Issues**: GitHub Issues
- **Feature Requests**: GitHub Discussions

## 📄 License

MIT License - feel free to use this for your own projects!

---

**Built with ❤️ for the indie maker community**
