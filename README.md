# CryptoNest - Cryptocurrency Exchange Platform

A modern cryptocurrency exchange platform built with React, Node.js, and Web3 technology.

## Features

- User registration and authentication
- Market data display with real-time updates
- Crypto wallet connectivity via Metamask
- Transaction history tracking
- Deposit and withdrawal functionality
- Dashboard with portfolio overview
- Exchange functionality for trading between cryptocurrencies

## Tech Stack

- **Frontend**: React, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth / Custom Auth
- **Blockchain Integration**: Web3.js, Ethers.js

## Local Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run the development server: `npm run dev`

## Deploying to Vercel

1. **Fork this repository** to your GitHub account.

2. **Link your GitHub repository to Vercel**:
   - Create a new project on Vercel dashboard
   - Import your GitHub repository
   - Configure the project with the following settings:
     - Framework Preset: `Other` (not Next.js)
     - Root Directory: `/` (default)
     - Build Command: `bash vercel-build.sh`
     - Output Directory: `dist`
     - Install Command: `npm install`

3. **Configure Environment Variables**:
   In the Vercel project settings, add all the required environment variables from `.env.example`.
   These are essential:
   - `DATABASE_URL`: Your PostgreSQL connection string (required)
   - `SESSION_SECRET`: A strong random string for secure sessions
   - `PGDATABASE`, `PGHOST`, `PGUSER`, `PGPASSWORD`, `PGPORT`: Database connection details
   - `REPLIT_DOMAINS`: Set this to your Vercel domain (e.g., `your-project.vercel.app`)
   - `REPL_ID`: A unique identifier (you can generate a random UUID or use any unique string)
   - `ISSUER_URL`: Set to `https://replit.com/oidc` (or leave as is)

4. **Set up PostgreSQL Database**:
   - Create a PostgreSQL database using Vercel Postgres, Neon, Railway, or Supabase
   - Get your connection details and update all database-related environment variables
   - The app uses Drizzle ORM which will create the tables on first run

5. **Deploy Your Application**:
   - Click "Deploy" in Vercel
   - Vercel will build and deploy your application based on the vercel.json configuration
   - Check deployment logs for any errors
   - The first build may take a few minutes

6. **After Deployment**:
   - Visit your new application at the Vercel-provided URL
   - The database tables should be automatically created on first access
   - If there are any database issues, check the environment variables and ensure the database is accessible

7. **Troubleshooting Common Issues**:
   - **404 Page Not Found errors**: 
     - Verify the routes in vercel.json are correctly pointing to your server entry point
     - Check that the build process completed successfully in the Vercel deployment logs
     - Make sure all paths in vercel.json match your project structure (especially the dest: values)

   - **Database Connection Errors**:
     - Confirm your DATABASE_URL environment variable is properly set in Vercel
     - Ensure your database is accessible from Vercel's servers (check network/firewall settings)
     - Try establishing a direct connection to your database using the credentials to verify they work

   - **Authentication Issues**:
     - Ensure SESSION_SECRET is set and is a strong random string
     - Verify REPLIT_DOMAINS includes your Vercel URL (e.g., your-app.vercel.app)
     - Set REPL_ID to a unique, consistent value for your application

   - **Build Process Failures**:
     - Check the Vercel deployment logs for specific error messages
     - Ensure all dependencies are properly listed in package.json
     - Try running the build locally with `bash build.sh` to identify issues

8. **Adding A Custom Domain**:
   - In the Vercel project settings, go to Domains section
   - Add your custom domain and follow verification steps
   - Update the REPLIT_DOMAINS environment variable to include your custom domain

## License

MIT License