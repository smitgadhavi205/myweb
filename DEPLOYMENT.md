# Deployment Guide for CodePractical Backend

This guide provides instructions for deploying the CodePractical Backend application to various hosting platforms.

## Application Overview

CodePractical Backend is a Next.js application that provides API endpoints for file uploads and processing. The application requires:

- Node.js runtime environment
- File system access for storing uploaded files
- API endpoints for file uploads, processing, and matching

## Deployment Options

### 1. Vercel (Recommended)

Vercel is the platform created by the team behind Next.js and offers the most seamless deployment experience.

#### Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Git repository with your code

#### Deployment Steps

1. **Push your code to a Git repository** (GitHub, GitLab, or Bitbucket)

2. **Connect your repository to Vercel**:
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your Git repository
   - Select the repository containing your CodePractical Backend code

3. **Configure project settings**:
   - Framework Preset: Next.js
   - Root Directory: `./` (or the directory containing your Next.js app)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

4. **Environment Variables**:
   Create the following environment variables if needed:
   - `NODE_ENV`: Set to `production`

5. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your application

#### Important Considerations for Vercel

- **File Storage**: Vercel's serverless functions have ephemeral file systems. For file uploads, you should:
  - Modify the application to use cloud storage (like AWS S3, Google Cloud Storage, or Azure Blob Storage)
  - Update the `upload.js` file to store files in cloud storage instead of the local file system

- **API Routes**: All API routes in the `pages/api` directory will be automatically deployed as serverless functions

### 2. Netlify

Netlify is another excellent platform for deploying Next.js applications.

#### Prerequisites

- A [Netlify account](https://app.netlify.com/signup)
- Git repository with your code

#### Deployment Steps

1. **Push your code to a Git repository**

2. **Connect your repository to Netlify**:
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Select your Git provider and repository

3. **Configure build settings**:
   - Build Command: `npm run build`
   - Publish Directory: `.next`

4. **Environment Variables**:
   - Add the same environment variables as mentioned in the Vercel section

5. **Deploy**:
   - Click "Deploy site"

#### Important Considerations for Netlify

- Similar to Vercel, Netlify Functions have ephemeral file systems, so you'll need to modify the application to use cloud storage for file uploads
- You may need to add a `netlify.toml` file to configure the Next.js adapter

### 3. Traditional Hosting (VPS, Dedicated Server)

For full control over the file system and server environment, you can deploy to a traditional hosting solution.

#### Prerequisites

- A server with Node.js installed (VPS, dedicated server, etc.)
- SSH access to the server
- Domain name (optional)

#### Deployment Steps

1. **Prepare your server**:
   ```bash
   # Install Node.js and npm if not already installed
   # Example for Ubuntu/Debian:
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone your repository**:
   ```bash
   git clone <your-repository-url>
   cd codepractical-backend
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the application**:
   ```bash
   npm run build
   ```

5. **Set up environment variables**:
   Create a `.env` file with necessary environment variables

6. **Start the application**:
   ```bash
   npm start
   ```

7. **Set up a process manager** (recommended):
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start the application with PM2
   pm2 start npm --name "codepractical-backend" -- start
   
   # Ensure PM2 starts on system boot
   pm2 startup
   pm2 save
   ```

8. **Set up a reverse proxy** (recommended):
   - Install and configure Nginx or Apache
   - Set up SSL with Let's Encrypt
   - Configure the reverse proxy to forward requests to your Next.js application

#### Advantages of Traditional Hosting

- Full access to the file system for storing uploaded files
- Complete control over the server environment
- No limitations on serverless function execution time

## Environment Variables

Create a `.env` file in the root directory with the following variables if needed:

```
NODE_ENV=production
PORT=3000  # The port your application will run on (default is 3000)
```

## File Storage Considerations

The current implementation stores uploaded files in the local file system under the `uploads` directory. For production deployments, especially on serverless platforms like Vercel and Netlify, you should consider:

1. **Cloud Storage Integration**:
   - AWS S3
   - Google Cloud Storage
   - Azure Blob Storage

2. **Database Storage**:
   - Store file metadata in a database
   - Store file contents in the database or cloud storage

## Monitoring and Maintenance

1. **Logging**:
   - Set up application logging
   - Consider using a logging service like Loggly, Papertrail, or ELK Stack

2. **Monitoring**:
   - Set up uptime monitoring
   - Monitor server resources
   - Set up alerts for critical errors

3. **Backups**:
   - Regularly back up your database and uploaded files
   - Test your backup restoration process

## Conclusion

Choose the deployment option that best fits your needs:

- **Vercel/Netlify**: Quick and easy deployment, but requires modifications for file storage
- **Traditional Hosting**: More setup required, but provides full control over the environment

Remember to test your deployment in a staging environment before going to production.