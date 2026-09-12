# hos-fe


## Backend connection

Browser API requests and media use the same-origin `/api/cms/api/*` proxy.
Server-side GraphQL and sitemap requests connect directly to the backend.
Set `API_INTERNAL_URL` (default `http://127.0.0.1:3000`) when the backend
runs elsewhere. Rebuild and restart the frontend after changing this setting,
because Next.js builds the proxy rewrite into its routing configuration.
