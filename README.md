# PAWS Agadir - Dog Rescue & Adoption Platform

A production-ready web application to help stray dogs in the Agadir-Taghazout region of Morocco. Report, rescue, and vaccinate dogs with our community.

## About

PAWS Agadir is a community-driven platform that helps coordinate dog rescue efforts, track vaccinations, and connect volunteers with dogs in need. Built with modern web technologies and optimized for production deployment on Hostinger.

## Author

**Niklas Schlichting**

## Technologies

This project is built with:

- **Next.js 15.5+** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library
- **Supabase** - Backend and database
- **PM2** - Process management (production)

## Getting Started

### Development

```bash
# Clone the repository
git clone https://github.com/nikiwaikiki/PAWS-AGADIR.git

# Navigate to the project directory
cd PAWS-AGADIR

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Start the development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Production Deployment

### Prerequisites

- Node.js 20.x or higher
- npm 9.x or higher
- Supabase account with project configured
- Hostinger Node.js hosting (or similar Node.js hosting)

### Hostinger Deployment

#### 1. Prepare Environment Variables

Create a `.env` file on your server based on `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
NODE_ENV=production
```

#### 2. Build the Application

```bash
npm run build:production
```

This script will:
- Clean previous builds
- Install dependencies
- Run linting
- Build the Next.js application with standalone output

#### 3. Start the Application

**With PM2 (Recommended):**

```bash
npm run start:production
```

The application will run with PM2 process manager using the configuration in `ecosystem.config.js`.

**Manual Start:**

```bash
npm run start
```

#### 4. Configure Hostinger

Upload the following files/folders to your Hostinger Node.js hosting:

```
.env
.next/
node_modules/
public/
package.json
ecosystem.config.js
scripts/
```

Set the start command in Hostinger control panel:
```bash
npm run start:production
```

### Deployment Scripts

- `npm run build:production` - Build for production with optimizations
- `npm run start:production` - Start with PM2 or Node.js
- `npm run clean:artifacts` - Check for AI platform artifacts
- `npm run deploy` - Build and start in one command

### Environment Variables

Required environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbG...` |
| `NODE_ENV` | Node environment | `production` |
| `PORT` | Server port (optional) | `3000` |

### Configuration Files

- `.env.example` - Environment variables template
- `ecosystem.config.js` - PM2 process manager configuration
- `.hostinger.json` - Hostinger-specific deployment configuration
- `next.config.mjs` - Next.js production configuration

## Security

This application:
- ✅ Uses latest Next.js with all security patches (15.5.12+)
- ✅ Has no external AI platform dependencies
- ✅ Contains no tracking or telemetry to external platforms
- ✅ Uses secure Supabase authentication
- ✅ Implements proper CORS and security headers
- ✅ Runs in standalone mode for optimal security

## Database Setup

The application uses Supabase for database and authentication. Database migrations are located in `supabase/migrations/`.

To set up your database:

1. Create a Supabase project
2. Run migrations using Supabase CLI or dashboard
3. Configure environment variables with your Supabase credentials

## Development Features

- Hot reload with Turbopack
- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- Component library with shadcn/ui
- Internationalization (i18n) ready

## Production Features

- Standalone Next.js output for optimal performance
- PM2 process management with auto-restart
- Compressed assets
- Optimized images
- Security headers
- Health check endpoints

## Monitoring

When running with PM2, you can monitor the application:

```bash
# View logs
pm2 logs paws-agadir

# View status
pm2 status

# Restart
pm2 restart paws-agadir

# Stop
pm2 stop paws-agadir
```

## Support

For issues or questions:
- Check the [GitHub Issues](https://github.com/nikiwaikiki/PAWS-AGADIR/issues)
- Contact the maintainer

## License

© 2024 Niklas Schlichting. All rights reserved.

---

**Note:** This application is independent from v0, bolt.new, Vercel Analytics, and other AI platforms. It contains no external tracking or telemetry.
