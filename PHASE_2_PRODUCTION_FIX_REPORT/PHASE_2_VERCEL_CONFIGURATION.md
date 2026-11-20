# PHASE 2 VERCEL CONFIGURATION REPORT
## Deployment Specification & Routing Analysis

### Updated `vercel.json`

```json
{
  "version": 2,
  "installCommand": "npm install && cd client && npm install",
  "buildCommand": "npx prisma generate --schema=server/prisma/schema.prisma && cd client && npm run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.js"
    },
    {
      "source": "/api",
      "destination": "/api/index.js"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

### Pipeline Verification

1. **Install Step (`installCommand`)**:
   * Installs root backend dependencies (`npm install`).
   * Installs frontend client dependencies (`cd client && npm install`).
2. **Build Step (`buildCommand`)**:
   * Generates Prisma Client: `npx prisma generate --schema=server/prisma/schema.prisma`.
   * Builds Vite production bundle: `cd client && npm run build`.
3. **Output Routing (`rewrites`)**:
   * Requests targeting `/api/(.*)` and `/api` rewrite directly to the serverless entrypoint `api/index.js`.
   * Single Page Application (SPA) routes rewrite to `/index.html`.
4. **Serverless Entrypoint (`api/index.js`)**:
   ```javascript
   import app from '../server/src/app.js';
   export default app;
   ```
   Exports the Express `app` directly for Vercel's Node.js Serverless Function runtime.
