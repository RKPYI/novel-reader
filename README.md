This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### API Configuration

Before running the development server, you need to configure the API base URL:

1. Copy the environment variables example file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Update the `NEXT_PUBLIC_API_URL` in `.env.local` with your API server URL:
   ```env
   # For local development
   NEXT_PUBLIC_API_URL=http://localhost:8000
   
   # For production
   NEXT_PUBLIC_API_URL=https://your-api-domain.com
   ```

## API Configuration

The application uses a centralized API configuration system located in `app/config/api.ts`. This makes it easy to manage API endpoints and change the base URL for different environments.

### Key Features:
- **Environment-based configuration**: Uses `NEXT_PUBLIC_API_URL` environment variable
- **Centralized endpoints**: All API endpoints are defined in one place
- **Type-safe**: Full TypeScript support for all API endpoints
- **Easy deployment**: Simply change the environment variable for different environments

### API Endpoints Structure:
```typescript
API_ENDPOINTS.novels.search(query)           // Search novels
API_ENDPOINTS.novels.popular                 // Popular novels
API_ENDPOINTS.novels.latest                  // Latest novels
API_ENDPOINTS.novels.detail(slug)            // Novel details
API_ENDPOINTS.novels.chapters(slug)          // Novel chapters
API_ENDPOINTS.novels.chapter(slug, num)      // Specific chapter
API_ENDPOINTS.novels.readingProgress(slug)   // Reading progress
API_ENDPOINTS.novels.updateProgress(slug)    // Update progress
API_ENDPOINTS.novels.genres                  // Available genres
API_ENDPOINTS.novels.recommendations         // Recommended novels
```

### Changing the API URL:
1. **Development**: Update `.env.local`
2. **Production**: Set the `NEXT_PUBLIC_API_URL` environment variable in your deployment platform
3. **Manual override**: Modify `API_BASE_URL` in `app/config/api.ts`

### Running the Development Server

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

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
