# Claude Blueprint 🏙️

> **Autonomous City Designer powered by Claude AI**

Watch Claude autonomously design and build complete virtual cities in real-time. Claude Blueprint showcases the power of AI-driven urban planning through an immersive 3D visualization experience.

![Claude Blueprint](https://img.shields.io/badge/Powered%20by-Claude%20AI-CC785C?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)

## ✨ Features

### 🤖 Autonomous AI City Building
- **Real-time Generation**: Watch Claude design and place buildings autonomously
- **5-Phase Construction**: Infrastructure → Commercial → Residential → Office → Public Facilities
- **50+ Buildings**: Complete cities with diverse building types and layouts
- **Intelligent Placement**: AI-driven spatial distribution across the entire city grid

### 🎨 Immersive Visualization
- **3D City View**: Interactive Three.js-powered city visualization
- **Real-time Updates**: See buildings appear as Claude creates them
- **Dynamic Camera**: Explore your city from any angle
- **Glassmorphism UI**: Modern, warm orange-themed interface

### 🧠 Claude's Thought Process
- **Live Thoughts**: View Claude's reasoning as it designs your city
- **Building Blueprint**: See the technical specifications for each structure
- **Progress Tracking**: Monitor construction phases and completion percentage
- **City Statistics**: Real-time stats on buildings, infrastructure, and more

### 🎮 Two Modes

**Auto Mode** (Default)
- Fully autonomous city generation
- No input required - just watch Claude work
- Perfect for demonstrations and inspiration

**Manual Mode**
- Guide Claude with custom prompts
- Influence architectural style and city layout
- Requires access code for advanced users

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern UI library
- **TypeScript** - Type-safe development
- **Three.js** - 3D city visualization
- **Tailwind CSS 4** - Utility-first styling
- **Framer Motion** - Smooth animations
- **tRPC** - End-to-end typesafe APIs

### Backend
- **Express 4** - Node.js web framework
- **Drizzle ORM** - TypeScript-first ORM
- **MySQL/TiDB** - Distributed SQL database
- **Claude AI API** - Autonomous city generation
- **Python Services** - AI algorithms and analytics
  - NumPy/SciPy for spatial algorithms
  - Pandas for data analysis
  - Flask microservices for compute-intensive tasks

### Development
- **Vite** - Lightning-fast build tool
- **pnpm** - Efficient package manager
- **ESLint** - Code quality
- **Prettier** - Code formatting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- MySQL database (or TiDB Cloud)

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Weezythegods69/claude-blueprint.git
cd claude-blueprint
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# Claude AI API
BUILT_IN_FORGE_API_URL=your_api_url
BUILT_IN_FORGE_API_KEY=your_api_key

# Authentication (optional for manual mode)
JWT_SECRET=your_jwt_secret
OAUTH_SERVER_URL=your_oauth_url
VITE_OAUTH_PORTAL_URL=your_portal_url

# Application
VITE_APP_TITLE=Claude Blueprint
VITE_APP_ID=your_app_id
```

4. **Initialize database**
```bash
pnpm db:push
```

5. **Start development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 🎯 Usage

### Quick Start

1. Open the application in your browser
2. Click **"Start Building"** button
3. Watch Claude autonomously design your city!

### Manual Mode

1. Toggle **Auto Mode** off
2. Enter access code when prompted
3. Provide custom prompts to guide Claude's design
4. Watch your vision come to life

### Exploring Your City

- **Rotate**: Click and drag
- **Zoom**: Scroll wheel
- **Pan**: Right-click and drag
- **View Thoughts**: Click "Claude's Thoughts" tab
- **View Blueprint**: Click "Building Blueprint" tab

## 🏗️ Project Structure

```
claude-blueprint/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── lib/         # Utilities and tRPC client
│   │   └── hooks/       # Custom React hooks
│   └── public/          # Static assets
├── server/              # Backend Express application
│   ├── _core/           # Core server utilities
│   ├── routers.ts       # tRPC API routes
│   ├── db.ts            # Database queries
│   └── llmOrchestrator.ts # Claude AI orchestration
├── python/              # Python AI services
│   ├── ai_city_generator.py  # Spatial algorithms
│   ├── city_analytics.py     # Analytics engine
│   ├── api_service.py        # Flask microservice
│   └── requirements.txt      # Python dependencies
├── drizzle/             # Database schema and migrations
└── shared/              # Shared types and constants
```

## 🔧 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Build for production
pnpm preview      # Preview production build

# Database
pnpm db:push      # Push schema changes
pnpm db:studio    # Open Drizzle Studio

# Code Quality
pnpm lint         # Run ESLint
pnpm format       # Format with Prettier
pnpm typecheck    # TypeScript type checking
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Manual Deployment

```bash
pnpm build
```

Deploy the `dist/` directory to your hosting provider.

## 🎨 Customization

### Branding

Edit `client/src/lib/constants.ts`:

```typescript
export const APP_TITLE = "Your App Name";
export const APP_TAGLINE = "Your Tagline";
```

### Colors

Edit `client/src/index.css` to customize the color scheme:

```css
:root {
  --primary: #CC785C;  /* Claude orange */
  --background: #1C1816;
  /* ... */
}
```

### Building Generation

Modify `server/llmOrchestrator.ts` to adjust:
- Number of buildings
- Construction phases
- Spatial distribution rules
- AI prompts and behavior

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Anthropic** - For Claude AI
- **Three.js** - For 3D visualization capabilities
- **shadcn/ui** - For beautiful UI components
- **Vercel** - For hosting and deployment platform

## 📧 Contact

For questions, feedback, or support, please open an issue on GitHub.

---

<p align="center">
  <strong>Built with ❤️ using Claude AI</strong>
</p>

<p align="center">
  <a href="https://github.com/Weezythegods69/claude-blueprint">⭐ Star this repository</a>
</p>
