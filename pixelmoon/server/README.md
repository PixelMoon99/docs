# Pixel Moon Server (Added by audit)
This lightweight Express server provides:
- NOWPayments USDT payment creation endpoint
- Webhook receiver (log-only)
- Invoice PDF generation + email sending

## Setup
1. Copy `.env.example` to `.env` and fill values.
2. `cd server && npm install`
3. `npm run dev`

## Routes
- POST /api/nowpayments/create { amount, currency, orderId }
- POST /api/nowpayments/webhook { ...event }
- POST /api/invoice/send { invoice payload }
