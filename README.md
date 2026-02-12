# Save The Paws - Dog Rescue Community

A web application to help stray dogs in the Agadir-Taghazout region of Morocco. Report, rescue, and vaccinate dogs with our community.

## About

Save The Paws is a community-driven platform that helps coordinate dog rescue efforts, track vaccinations, and connect volunteers with dogs in need.

## Author

**Niklas Schlichting**

## Technologies

This project is built with:

- Next.js 15.5+ (React Server Components)
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase (Authentication & Database)
- i18next (Internationalization)

## Getting Started

### Prerequisites

- Node.js 20.x or higher
- npm, yarn, or pnpm
- Supabase account (for database and authentication)

### Local Development

```sh
# Clone the repository
git clone https://github.com/nikiwaikiki/PAWS-AGADIR.git

# Navigate to the project directory
cd PAWS-AGADIR

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your Supabase credentials
# NEXT_PUBLIC_SUPABASE_URL=your-project-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (for production)
NODE_ENV=production
PORT=3000
HOSTNAME=0.0.0.0
```

## Deployment to Hostinger

### Prerequisites

1. Hostinger Node.js hosting plan
2. SSH access to your Hostinger account
3. Domain configured in Hostinger panel

### Step 1: Prepare Your Hostinger Environment

1. **Login to Hostinger Panel**
   - Navigate to your Node.js hosting
   - Enable Node.js version 20.x

2. **Setup SSH Access**
   ```sh
   # Connect via SSH
   ssh your-username@your-domain.com
   ```

3. **Install PM2 globally** (if not already installed)
   ```sh
   npm install -g pm2
   ```

### Step 2: Deploy Application

#### Method A: Git Deployment (Recommended)

1. **Clone repository on Hostinger**
   ```sh
   cd ~/domains/your-domain.com/public_html
   git clone https://github.com/nikiwaikiki/PAWS-AGADIR.git
   cd PAWS-AGADIR
   ```

2. **Configure environment variables**
   ```sh
   cp .env.example .env
   nano .env  # Edit with your credentials
   ```

3. **Build and start the application**
   ```sh
   # Run the optimized build script
   npm run build:hostinger
   
   # Start with PM2
   npm run pm2:start
   ```

4. **Configure Hostinger to use your app**
   - In Hostinger panel, set the application path to your PAWS-AGADIR directory
   - Set the entry point to `ecosystem.config.js`
   - Port: 3000 (or as configured)

#### Method B: Manual Deployment

1. **Build locally**
   ```sh
   npm run build
   ```

2. **Upload files via SFTP/SCP**
   - Upload entire project to your Hostinger hosting
   - Exclude: `node_modules`, `.next` (will be rebuilt)

3. **On server, install and build**
   ```sh
   cd ~/domains/your-domain.com/public_html/PAWS-AGADIR
   npm install
   npm run build
   npm run pm2:start
   ```

#### Method C: Automated CI/CD with GitHub Actions

1. **Set up GitHub Secrets**
   - Go to your repository Settings > Secrets
   - Add the following secrets:
     - `HOSTINGER_HOST`: Your Hostinger server hostname
     - `HOSTINGER_USERNAME`: SSH username
     - `HOSTINGER_PASSWORD`: SSH password
     - `HOSTINGER_PORT`: SSH port (usually 22)
     - `HOSTINGER_APP_PATH`: Path to your app (e.g., `/home/username/public_html/PAWS-AGADIR`)
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

2. **Push to main branch**
   ```sh
   git push origin main
   ```
   
   The GitHub Actions workflow will automatically build and deploy to Hostinger.

### Step 3: Verify Deployment

1. **Check PM2 status**
   ```sh
   npm run pm2:status
   ```

2. **View logs**
   ```sh
   npm run pm2:logs
   ```

3. **Access your application**
   - Visit `https://your-domain.com`

## Production Management

### PM2 Commands

```sh
# Start application
npm run pm2:start

# Stop application
npm run pm2:stop

# Restart application
npm run pm2:restart

# View logs
npm run pm2:logs

# Check status
npm run pm2:status
```

### Updating the Application

```sh
# Pull latest changes
git pull origin main

# Install dependencies
npm install

# Rebuild
npm run build

# Restart
npm run pm2:restart
```

### Monitoring & Logs

- Application logs: `./logs/out.log`
- Error logs: `./logs/error.log`
- PM2 logs: `pm2 logs paws-agadir`

## Performance Optimizations

This application includes several production optimizations:

- **Standalone output** for smaller deployment size
- **Image optimization** with AVIF/WebP support
- **Code splitting** for faster page loads
- **Console removal** in production (except errors/warnings)
- **Security headers** (HSTS, CSP, X-Frame-Options, etc.)
- **Compression** enabled
- **Cache optimization** for static assets

## Troubleshooting

### Build Issues

```sh
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use

```sh
# Check what's using port 3000
lsof -i :3000

# Kill the process or change PORT in .env
```

### PM2 Not Starting

```sh
# Check PM2 logs
pm2 logs

# Delete and restart
pm2 delete paws-agadir
npm run pm2:start
```

## Support

For issues or questions:
- Open an issue on [GitHub](https://github.com/nikiwaikiki/PAWS-AGADIR/issues)
- Contact: Niklas Schlichting

## License

© 2024 Niklas Schlichting. All rights reserved.
