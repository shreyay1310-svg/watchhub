# PHASE 2 PRISMA BUILD REPORT
## Prisma Client Generation & Multi-Platform Engine Binaries

### Generator Configuration

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "rhel-openssl-3.0.x", "debian-openssl-3.0.x"]
}

datasource db {
  provider = "sqlserver"
  url      = env("DATABASE_URL")
}
```

---

### Verified Compiled Query Engines in `node_modules/.prisma/client`

| File Name | File Size | Target Platform | Description |
|---|---|---|---|
| `libquery_engine-rhel-openssl-3.0.x.so.node` | 17.5 MB | Amazon Linux 2023 / RHEL | Used by Vercel Serverless Functions (`nodejs20.x`, `nodejs22.x`) |
| `libquery_engine-debian-openssl-3.0.x.so.node` | 17.5 MB | Debian 12 / Ubuntu 22+ | Used by Debian-based container environments |
| `query_engine-windows.dll.node` | 21.1 MB | Windows x64 | Used during local development and testing |
| `query_engine_bg.wasm` | 2.2 MB | WebAssembly Engine | WebAssembly fallback |

* **Prisma Version**: 6.19.3
* **Generation Timing**: Completed in 216ms.
* **Compound Selector Verified**: `where: { identifier_purpose: { identifier, purpose } }` generated and verified.
