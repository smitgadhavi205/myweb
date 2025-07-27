# CodePractical Backend

This is the backend service for the CodePractical application, built with [Next.js](https://nextjs.org). It provides API endpoints for file uploads, document processing, and AI-based matching of aims with code blocks.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## API Endpoints

The backend provides the following API endpoints:

- **POST /api/upload** - Upload files (PDF or Word documents)
- **POST /api/process-aims** - Process uploaded aims documents
- **POST /api/match-generate** - Match aims with code blocks and generate reports
- **GET /api/health** - Check the health status of the backend

## File Storage

By default, uploaded files are stored in the local filesystem under the `uploads` directory, with subdirectories for different file types:

- `uploads/aims` - For aims documents
- `uploads/code` - For code documents

For production deployments, especially on serverless platforms, consider using cloud storage. See the `lib/storage` module for a storage adapter implementation.

## Deployment

This project can be deployed to various platforms:

### Vercel (Recommended)

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```bash
vercel
```

### Other Deployment Options

For detailed deployment instructions, including Netlify and traditional hosting options, see the [DEPLOYMENT.md](./DEPLOYMENT.md) file.

## Environment Variables

See [.env.example](./.env.example) for a list of supported environment variables.
