# Deploying CryptoNest to Vercel

This guide shows how to deploy the CryptoNest cryptocurrency exchange platform to Vercel.

## Simplified Deployment

1. **Fork & Deploy**
   - Fork this repository to your GitHub account
   - Go to [Vercel](https://vercel.com) and create a new project
   - Import your GitHub repository
   - No need to configure build settings - they're defined in `vercel.json`
   - Click "Deploy"

That's it! Vercel will automatically:
- Build your frontend using Vite
- Set up your API as a serverless function
- Configure the routing properly

## Required Environment Variables

Add these environment variables in your Vercel project settings:

```
SESSION_SECRET=your-strong-session-secret
```

**NOTE**: This deployment will use in-memory storage by default.

## Optional: Database Integration

For persistent storage, add these environment variables:

```
DATABASE_URL=postgresql://user:password@host:port/database
```

You can get a database from:
- [Neon](https://neon.tech) (recommended)
- [Supabase](https://supabase.com)
- [Railway](https://railway.app)

## How It Works

The deployment uses two key components:
1. **Frontend**: Static files built with Vite
2. **Backend**: Serverless API function

All configuration is in the `vercel.json` file with predefined routes and build settings.

## Troubleshooting

### Common Issues and Solutions

- **404 NOT_FOUND Error**:
  - Make sure you've used the correct build command: `npm install && npm run build`
  - Verify the build process completed successfully by checking deployment logs
  - Check that vercel.json is at the root of your repository and has the correct configuration

- **500 Internal Server Error**:
  - Check that your SESSION_SECRET is set correctly in environment variables
  - If using a database, verify DATABASE_URL is correctly formatted and accessible
  - Inspect the function logs in Vercel dashboard for specific error messages

- **Database Connection Issues**:
  - Verify all database environment variables are correctly set
  - Ensure your database is accessible from Vercel's servers (check IP restrictions)
  - Try connecting to your database from another tool to verify credentials

- **White Screen or Missing Assets**:
  - Check browser console for JavaScript errors
  - Verify that client-side code is being properly built and served
  - Check network requests to ensure API endpoints are being called correctly

## Using In-Memory Storage Mode

If you don't need persistent data storage, the application can run without a database connection. In this case:

- Skip setting DATABASE_URL and other database environment variables
- The app will automatically use in-memory storage
- Note that all data will be lost when the server restarts or when Vercel's serverless functions are recycled

To explicitly run in memory-only mode, set these environment variables:
```
DATABASE_URL=
SESSION_SECRET=your-secret-key
REPLIT_DOMAINS=your-app.vercel.app
REPL_ID=some-unique-identifier
NODE_ENV=production
```

The empty DATABASE_URL will trigger the in-memory fallback mode.

## Adding a Custom Domain

Once your app is successfully deployed, you can add a custom domain:

1. Go to your project settings in Vercel
2. Navigate to the "Domains" section
3. Add your custom domain
4. Update the `REPLIT_DOMAINS` environment variable to include your custom domain