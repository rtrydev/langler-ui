# langler-ui

Frontend for [Langler](https://langler.rtrydev.com) — an invitation-only, BYOAI language-learning app for Japanese, Burmese, and Polish.

Next.js **static export** (`output: "export"`, `trailingSlash: true`) deployed to a private S3 bucket behind CloudFront. There is no server runtime: all dynamic data is fetched client-side from the Langler API, and auth gating is a client-side Cognito check (the real security boundary is the API).

## Development

```sh
npm install
npm run dev
```

## Build (static export)

```sh
npm run build   # outputs to out/
```

Deployment (S3 sync with split cache headers + CloudFront invalidation) is driven from `langler-tf-infrastructure`.

## Constraints of static export

- No SSR/middleware/server actions; entity pages (e.g. lessons) use query params / client-side routing, not per-ID pre-rendering.
- `next/image` optimization disabled (`images.unoptimized: true`).
