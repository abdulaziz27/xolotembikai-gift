# Panduan Deployment ke Vercel

## Environment Variables yang Diperlukan

### 1. Supabase (WAJIB)
```
NEXT_PUBLIC_SUPABASE_URL=https://tyctyqiadfzfvklmbdya.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### 2. App Configuration (WAJIB)
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NEXT_PUBLIC_API_URL=https://your-app.vercel.app/api
```

### 3. Optional Services (jika digunakan)
```
RESEND_API_KEY=re_YourResendAPIKey
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
INNGEST_EVENT_KEY=your_inngest_key
INNGEST_SIGNING_KEY=your_signing_key
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ORG=your-sentry-org
SENTRY_PROJECT=xolotembikai-gift
SENTRY_AUTH_TOKEN=your-sentry-auth-token
```

## Langkah-langkah Deployment

### Via Vercel Dashboard:
1. Push code ke GitHub
2. Import project di vercel.com
3. Tambahkan environment variables
4. Deploy!

### Via CLI:
```bash
vercel
```

## Checklist Pre-deployment
- [x] Build berhasil (`npm run build`)
- [x] Environment variables disiapkan
- [x] Supabase production ready
- [x] Domain/subdomain planning
- [ ] DNS configuration (jika custom domain)

## Post-deployment
1. Test semua fitur di production
2. Setup monitoring
3. Configure custom domain (opsional)
4. Setup CI/CD (opsional) 