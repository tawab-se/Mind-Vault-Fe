# Mind Vault Frontend - AI Development Guidelines

@AGENTS.md

## Critical Architecture (DON'T BREAK)

### Authentication
- ✅ Tokens stored in **HTTP cookies** (7-day expiry, SameSite: lax)
- ❌ **NEVER use localStorage** - breaks SSR and middleware
- Files: `src/middleware.ts`, `src/stores/auth-store.ts`, `src/services/base-api.ts`

### Middleware Route Protection
- Bug to avoid: `pathname.startsWith('/')` matches ALL routes
- Fix: Use exact match for `/`: `route === '/' ? pathname === '/' : pathname.startsWith(route)`
- Auth routes: `/`, `/auth/login`, `/auth/signup` (redirect authenticated users)
- Public routes: `/`, `/auth/login`, `/auth/signup`, `/auth/accept-invite`

### API Convention
- Backend: snake_case
- Frontend: camelCase
- Auto-conversion in `src/services/base-api.ts` (don't modify interceptors)

### Deduplication Pattern
- `/auth/me` must be called ONCE on refresh
- Triple-layer protection:
  1. Module-level singleton: `isCurrentlyFetchingProfile`
  2. Zustand flag: `isFetchingUser`
  3. Per-instance ref: `hasFetchedRef`

## Code Standards (from docs/coding-sop.md)

### Type System
- ❌ **No `any` types** - use `unknown`, `Partial<T>`, or `Record<string, unknown>`
- ✅ Interfaces: `I` prefix (IUser, ILoginRequest, ISignupResponse)
- ✅ Types: `T` prefix (TUserRole, TFormMode)
- ✅ API responses: Define proper interfaces, avoid `any`

### Error Handling
```typescript
// ❌ Wrong
} catch (err: any) {
  const msg = err.response?.data?.detail || err.message;
}

// ✅ Correct
} catch (err: unknown) {
  const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail ||
              (err as { message?: string })?.message || 'Fallback message';
}
```

### React Best Practices
- Escape apostrophes in JSX: `Don't` → `Don&apos;t`
- No unnecessary comments, docstrings unless logic is complex
- Keep components simple, avoid over-engineering

## Key Files

### Authentication Flow
- `src/middleware.ts` - Server-side route protection (runs before page loads)
- `src/stores/auth-store.ts` - Zustand state (token, user, flags)
- `src/hooks/useAuth.ts` - Auth logic with deduplication
- `src/services/auth-api.ts` - Auth API calls (signup, login, getCurrentUser)
- `src/services/base-api.ts` - Base HTTP client with interceptors

### Documentation
- `docs/app-flows.md` - Complete application flows (keep updated)
- `docs/coding-sop.md` - Full coding standards (must follow)

## Common Tasks

### Adding New Routes
1. If public: Add to `publicRoutes` in `src/middleware.ts`
2. If auth page: Add to `authRoutes` in `src/middleware.ts`
3. Update `docs/app-flows.md` with new flow

### API Changes
1. Define interface in `src/types/auth.ts` (or create new type file)
2. Add method in appropriate service (auth-api, invitations-api, etc.)
3. Case conversion happens automatically in base-api

### Auth State Changes
1. Update `src/stores/auth-store.ts` (state + actions)
2. Update `src/hooks/useAuth.ts` if needed
3. Update `docs/app-flows.md` to reflect changes

## Known Issues
- Next.js 16 shows deprecation warning: `"middleware" → "proxy"` (safe to ignore for now)
- Empty `src/utils/` directory exists for future utility functions

## Testing
```bash
npm run lint          # ESLint check (must pass)
npx tsc --noEmit     # TypeScript check (must pass)
npm run build        # Production build (must pass)
npm run dev          # Development server
```
