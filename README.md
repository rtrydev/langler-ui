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

The static client requires these public build-time variables:

```sh
NEXT_PUBLIC_AWS_REGION=eu-central-1
NEXT_PUBLIC_COGNITO_CLIENT_ID=...
NEXT_PUBLIC_API_URL=https://....execute-api.eu-central-1.amazonaws.com
NEXT_PUBLIC_MACHINE_API_URL=https://....execute-api.eu-central-1.amazonaws.com
NEXT_PUBLIC_REFERENCE_ASSETS_URL=https://....cloudfront.net
```

The infrastructure deploy script obtains them from Terraform outputs. Authentication calls Cognito directly, handles the required first-login password change, rotates expired tokens, and persists the session in cookies (refresh token for 30 days, access/id tokens for an hour), so reloading the page keeps you signed in. The authenticated shell calls `GET /hello` through `lib/api/` with the Cognito access token.

## Constraints of static export

- No SSR/middleware/server actions; entity pages (e.g. lessons) use query params / client-side routing, not per-ID pre-rendering.
- `next/image` optimization disabled (`images.unoptimized: true`).
