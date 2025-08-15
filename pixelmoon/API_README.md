# PixelMoon Public API

## Overview
This project exposes a protected API for partners. API keys are issued by admins and must be included as an `Authorization` header:

```
Authorization: ApiKey <your_api_key_here>
```

## Example: Get products
GET /api/products?limit=50&q=diamond

## Creating keys (admin-only)
POST /admin/api-keys/create
Body: { "name": "Partner A", "scopes": ["read:products"], "expiresAt": null }
Response returns the raw key once — store it securely.

## Docs
Interactive docs available at `/api-docs` once server is running.


Admin Panel: You can generate API keys, set IP whitelist/blacklist, block/unblock keys, and download partner-specific PDF docs from the admin panel at /admin/api-keys (requires admin login).
