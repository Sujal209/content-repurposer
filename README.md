# ContentCraft - AI-Powered Content Repurposer

🚀 **Transform your long-form content into viral social media posts with AI**

Perfect for indie makers, solopreneurs, and content creators who want to scale their content without hiring a team.

## ✨ Features

- **Premium Landing Page** - Conversion-focused design with smooth animations
- **Unified Auth System** - Seamless login/signup with Supabase
- **AI-Powered Transformation** - Turn blog posts into Twitter threads, LinkedIn carousels, and Instagram stories
- **Real-time Content Processing** - Lightning-fast AI transformations
- **Responsive Design** - Perfect experience on all devices
- **Protected Routes** - Secure access to authenticated content
- **Copy & Export** - Easy sharing and downloading of generated content

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4
- **Animations**: Framer Motion
- **Language**: TypeScript
- **Icons**: Lucide React

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
   - 10 engaging tweets with hooks
   - Strategic emoji usage
   - Viral-ready format
   - Call-to-action endings

2. **LinkedIn Carousels**
   - 6-8 professional slides
   - Business-focused content
   - Actionable insights
   - Statistics and data

3. **Instagram Stories**
   - 5-7 visual story slides
   - Interactive elements
   - Engagement prompts
   - Visual direction guides

### AI Prompts
Each format uses carefully crafted prompts that:
- Understand platform-specific best practices
- Maintain the author's voice and tone
- Optimize for engagement and virality
- Include platform-specific features (hashtags, mentions, etc.)

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile content creation
- **Tablet Friendly**: Perfect for on-the-go editing
- **Desktop Power**: Full feature set for power users

## 🔧 Development

### Project Structure
```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Protected dashboard
│   └── globals.css     # Global styles
├── components/         # Reusable components
│   └── ui/            # UI component library
└── lib/               # Utilities and configurations
    ├── auth-context.tsx
    ├── supabase.ts
    └── utils.ts
```

### Key Files
- `middleware.ts` - Route protection and auth handling
- `src/app/api/transform/route.ts` - AI transformation endpoint
- `src/lib/auth-context.tsx` - Authentication state management
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
