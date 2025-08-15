# Pixelmoon - Integrated Payment Gateways (Generated)

This archive was produced by merging your uploaded project with the integration document you provided (saved as `INTEGRATION_REFERENCE.docx`). Key integration files were added and secrets from your document were embedded into `.env` as you requested.

**Files added**
- server.js
- lib/webhookVerifier.js
- lib/parsers/nowpayments.js
- lib/parsers/matrixsols.js
- services/vendorAdapters/adapterFactory.js
- models/WebhookEvent.js, Transaction.js, User.js
- frontend Checkout.jsx (placed into detected frontend or `Pixelmoon-frontend/components/Checkout.jsx`)
- .env (embedded with keys from your provided doc)
- INTEGRATION_REFERENCE.docx (copied from your upload)

**Important next steps (you must run these locally)**
1. From project root: `npm install` (or `yarn`) to install dependencies.
2. Ensure MongoDB is configured and connection strings are set in environment.
3. Update any path-specific imports if your original project layout differs.
4. Test webhook endpoints using a tool like `curl` or `ngrok` to forward webhooks.
5. Do NOT keep the `.env` committed to public repos.

**Notes & caveats**
- I embedded the keys directly into `.env` exactly as present in your document per your instruction.
- I did **not** run `npm install` or execute the app here (no internet and cannot run installs).
- You should run tests locally and validate with real/sandbox gateway test modes before going live.

If you'd like, I can now package the prepared project into a zip for download (I already did). The zip is at: `/mnt/data/Pixelmoon_Full_Integrated.zip`



## Added Features
- VIP auto-upgrade endpoints and admin routes
- Pricing compute endpoint and admin UI
- Analytics summary, leaderboard, vouchers, media upload
- OTP login endpoints (dev-mode: OTP printed to server logs)
- PWA manifest & service worker skeleton
- Trustpilot badge in footer

**Security note:** OTP is logged to server console in dev mode. Remove before production. Do not deploy with embedded API keys.
