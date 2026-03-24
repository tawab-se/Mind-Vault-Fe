# Mind Vault - Application Flows

**Version**: 1.0.0
**Maintained By**: Tawab Khan
**Last Updated**: March 23, 2026

---

## Table of Contents

1. [Authentication Flows](#1-authentication-flows)
2. [User Management Flows](#2-user-management-flows)
3. [Invitation Flow](#3-invitation-flow)
4. [Dashboard & Navigation](#4-dashboard--navigation)
5. [API Endpoints Reference](#5-api-endpoints-reference)

---

## 1. Authentication Flows

### 1.0 Middleware Protection

**Purpose**: Server-side route protection and automatic redirects

**How It Works**:

```
1. User navigates to any route
2. Next.js middleware runs (server-side)
3. Check for 'token' cookie
4. Apply redirect rules:
   - If authenticated + on / or /auth/login or /auth/signup → redirect to /dashboard
   - If NOT authenticated + on protected route → redirect to /auth/login
   - Otherwise → allow access
```

**Technical Details**:

- **File**: `src/middleware.ts`
- **Runs on**: Server/Edge (before page render)
- **Checks**: Cookie `token` (not localStorage)
- **Protected Routes**: All routes except `/`, `/auth/login`, `/auth/signup`, `/auth/accept-invite`
- **Auth Routes**: `/`, `/auth/login`, `/auth/signup` (authenticated users redirected to /dashboard)

**Benefits**:

✅ Server-side protection (can't be bypassed by disabling JavaScript)
✅ Automatic redirects (no manual navigation needed)
✅ Prevents authenticated users from seeing login/signup pages
✅ Redirects unauthenticated users before page loads

---

### 1.1 Normal Signup Flow

**User Journey:**

```
1. User visits /auth/signup
2. User fills form:
   - Email
   - Password
   - Organization Name
   - First Name (optional)
   - Last Name (optional)
3. Frontend validates inputs
4. POST /api/v1/auth/signup
5. Backend creates:
   - Organization
   - Admin user
   - Returns access_token, refresh_token, user
6. Frontend stores token in HTTP cookie (7-day expiry, SameSite: lax)
7. Frontend stores user in Zustand
8. Redirect to /dashboard
```

**Technical Details:**

- **Endpoint**: `POST /api/v1/auth/signup`
- **Request Body**:
  ```json
  {
    "email": "admin@example.com",
    "password": "password123",
    "organization_name": "Acme Corp",
    "first_name": "John",
    "last_name": "Doe"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "organization_id": "org-uuid",
      "role": "admin",
      "created_at": "2026-03-23T..."
    },
    "organization": {
      "id": "org-uuid",
      "name": "Acme Corp",
      "created_at": "2026-03-23T..."
    }
  }
  ```

**Files Involved:**

- `/src/app/auth/signup/page.tsx`
- `/src/components/forms/SignupForm.tsx`
- `/src/services/auth-api.ts`
- `/src/hooks/useAuth.ts`

---

### 1.2 Normal Login Flow

**User Journey:**

```
1. User visits /auth/login
2. User enters email and password
3. Frontend validates inputs
4. POST /api/v1/auth/login
5. Backend validates credentials
6. Returns access_token, refresh_token, user
7. Frontend stores token in HTTP cookie (7-day expiry, SameSite: lax)
8. Frontend stores user in Zustand
9. Redirect to /dashboard
```

**Technical Details:**

- **Endpoint**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- **Response**:
  ```json
  {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "organization_id": "org-uuid",
      "role": "member",
      "created_at": "2026-03-23T..."
    }
  }
  ```

**Files Involved:**

- `/src/app/auth/login/page.tsx`
- `/src/components/forms/LoginForm.tsx`
- `/src/services/auth-api.ts`
- `/src/hooks/useAuth.ts`

---

### 1.3 Page Refresh / Token Persistence

**User Journey:**

```
1. User is logged in
2. User refreshes page
3. Middleware checks cookie for token (server-side)
4. If token exists:
   - Allow page to load
   - Zustand initializes with token from cookie
   - Auto-fetch user profile (GET /api/v1/auth/me) - ONCE
5. If no token:
   - Middleware redirects to /auth/login
```

**Technical Details:**

- Tokens stored in HTTP cookie: `Cookies.get('token')`
- **Middleware** checks cookie server-side BEFORE page loads
- Zustand store initializes with token from cookie
- `useAuth` hook automatically fetches user profile on mount if token exists
- **Deduplication**: Only ONE `/auth/me` call on refresh using:
  1. Module-level singleton flag: `isCurrentlyFetchingProfile`
  2. Zustand flag: `isFetchingUser`
  3. Per-instance ref: `hasFetchedRef`

**Files Involved:**

- `/src/middleware.ts` - Server-side route protection
- `/src/stores/auth-store.ts` - Token and user state
- `/src/hooks/useAuth.ts` - Auth logic with deduplication
- `/src/components/guards/AuthGuard.tsx` - Loading state only

---

## 2. User Management Flows

### 2.1 Admin Invites User

**User Journey:**

```
1. Admin logs in and goes to /auth/invite
2. Admin fills form:
   - Email
   - Role (admin or member)
3. POST /api/v1/invitations
4. Backend:
   - Creates invitation
   - Sends email with link
5. Frontend displays invitation link
6. Admin can copy and share link
```

**Technical Details:**

- **Endpoint**: `POST /api/v1/invitations`
- **Request Body**:
  ```json
  {
    "email": "newuser@example.com",
    "role": "member"
  }
  ```
- **Response**:
  ```json
  {
    "invitation": {
      "id": "uuid",
      "email": "newuser@example.com",
      "role": "member",
      "status": "pending",
      "token": "abc123...",
      "organization_id": "org-uuid",
      "invited_by": "admin-uuid",
      "expires_at": "2026-03-30T...",
      "created_at": "2026-03-23T..."
    },
    "invitation_link": "http://localhost:3000/auth/accept-invite?token=abc123..."
  }
  ```

**Files Involved:**

- `/src/app/auth/invite/page.tsx`
- `/src/components/forms/InviteForm.tsx`
- `/src/services/invitations-api.ts`
- `/src/components/guards/AuthGuard.tsx`
- `/src/components/guards/AdminGuard.tsx`

---

## 3. Invitation Flow

### 3.1 Complete Invitation Flow Diagram

```
┌────────────────────────────────────┐
│ 1. ADMIN INVITES USER              │
│    POST /api/v1/invitations        │
│    → Email sent with link          │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 2. USER CLICKS LINK                │
│    /auth/accept-invite?token=xyz   │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│ 3. VALIDATE INVITATION             │
│    GET /api/v1/invitations/        │
│    validate?token=xyz              │
└────────────┬───────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
action:           action:
"signup"          "login"
    │                 │
    ▼                 ▼
┌─────────┐      ┌─────────┐
│ Show    │      │ Show    │
│ Signup  │      │ Login   │
│ Form    │      │ Form    │
└────┬────┘      └────┬────┘
     │                │
     ▼                ▼
┌─────────┐      ┌─────────┐
│ POST    │      │ POST    │
│ /auth/  │      │ /auth/  │
│ signup  │      │ login   │
│         │      │         │
│ with    │      │ with    │
│ token   │      │ token   │
└────┬────┘      └────┬────┘
     │                │
     └────────┬───────┘
              │
              ▼
     ┌────────────────┐
     │ Returns tokens │
     │ Store in zustand│
     └────────┬───────┘
              │
              ▼
     ┌────────────────┐
     │ Redirect to    │
     │ /dashboard     │
     └────────────────┘
```

---

### 3.2 Step-by-Step Invitation Acceptance

#### Step 1: Validate Invitation Token

**Endpoint**: `GET /api/v1/invitations/validate?token={token}`

**Response (User doesn't exist)**:

```json
{
  "valid": true,
  "invitation": {
    "email": "newuser@example.com",
    "organization_name": "Acme Corp",
    "role": "member",
    "expires_at": "2026-03-30T..."
  },
  "user_exists": false,
  "action_required": "signup",
  "message": "Please create your account to join Acme Corp"
}
```

**Response (User exists)**:

```json
{
  "valid": true,
  "invitation": {
    "email": "existinguser@example.com",
    "organization_name": "Acme Corp",
    "role": "member",
    "expires_at": "2026-03-30T..."
  },
  "user_exists": true,
  "action_required": "login",
  "message": "Please login to join Acme Corp"
}
```

**Response (Invalid/Expired)**:

```json
{
  "valid": false,
  "invitation": null,
  "user_exists": false,
  "action_required": null,
  "message": "This invitation has expired or is invalid"
}
```

---

#### Step 2A: New User Signup (with invitation)

**Endpoint**: `POST /api/v1/auth/signup`

**Request Body**:

```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "invitation_token": "abc123..."
}
```

**Notes**:

- `organization_name` is NOT required when `invitation_token` is provided
- Backend automatically joins user to the invited organization
- Backend sets role from invitation

**Response**:

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "newuser@example.com",
    "organization_id": "org-uuid",
    "role": "member",
    "created_at": "2026-03-23T..."
  }
}
```

---

#### Step 2B: Existing User Login (with invitation)

**Endpoint**: `POST /api/v1/auth/login`

**Request Body**:

```json
{
  "email": "existinguser@example.com",
  "password": "password123",
  "invitation_token": "abc123..."
}
```

**Notes**:

- Backend validates credentials
- Backend adds user to the invited organization
- Backend sets role from invitation
- User now belongs to multiple organizations (if applicable)

**Response**:

```json
{
  "access_token": "eyJ...",
  "refresh_token": "eyJ...",
  "user": {
    "id": "uuid",
    "email": "existinguser@example.com",
    "organization_id": "org-uuid",
    "role": "member",
    "created_at": "2026-03-23T..."
  }
}
```

---

### 3.3 Invitation Flow - Frontend Logic

**File**: `/src/components/forms/AcceptInvitationForm.tsx`

**State Machine**:

```
States:
- loading: Validating invitation token
- signup: Show signup form (new user)
- login: Show login form (existing user)
- error: Show error message
- expired: Show expired message
```

**Component Logic**:

1. **On Mount**:
   - Get `token` from query params
   - Call `invitationsApi.validateInvitation(token)`
   - Set mode based on `actionRequired`
2. **Render**:
   - Show loading spinner if validating
   - Show error if invalid/expired
   - Show signup form if `action_required === 'signup'`
   - Show login form if `action_required === 'login'`
3. **On Submit**:
   - Call `authApi.signup()` or `authApi.login()` with `invitationToken`
   - Store tokens in Zustand
   - Redirect to `/dashboard`

**Files Involved**:

- `/src/app/auth/accept-invite/page.tsx`
- `/src/components/forms/AcceptInvitationForm.tsx`
- `/src/services/invitations-api.ts`
- `/src/services/auth-api.ts`
- `/src/types/auth.ts`

---

## 4. Dashboard & Navigation

### 4.1 Dashboard Access

**User Journey**:

```
1. User navigates to /dashboard
2. Middleware intercepts (server-side)
3. Checks cookie for token
4. If no token:
   - Middleware redirects to /auth/login
5. If token exists:
   - Page loads
   - AuthGuard shows loading state
   - Fetch user profile (if not already fetched) - ONCE
   - Render dashboard
6. Display user info and admin actions
```

**Two-Layer Protection**:

1. **Middleware** (Server-side):
   - Runs before page loads
   - Checks cookie
   - Redirects if no token
   - Can't be bypassed by JavaScript

2. **AuthGuard** (Client-side):
   - Shows loading state
   - Triggers user profile fetch
   - Final verification

**Admin Actions** (only visible to admins):

- Invite Team Member button → `/auth/invite`

**Files Involved**:

- `/src/app/dashboard/page.tsx`
- `/src/components/guards/AuthGuard.tsx`
- `/src/components/guards/AdminGuard.tsx`

---

### 4.2 Logout Flow

**User Journey**:

```
1. User clicks Logout button
2. Frontend calls authApi.logout()
3. Remove token from HTTP cookie
4. Clear Zustand state
5. Redirect to /auth/login
```

**Files Involved**:

- `/src/app/dashboard/page.tsx`
- `/src/services/auth-api.ts`
- `/src/hooks/useAuth.ts`
- `/src/stores/auth-store.ts`

---

## 5. API Endpoints Reference

### Authentication Endpoints

| Method | Endpoint                 | Purpose                    | Auth Required |
| ------ | ------------------------ | -------------------------- | ------------- |
| POST   | /api/v1/auth/signup      | Create account             | No            |
| POST   | /api/v1/auth/login       | Login                      | No            |
| GET    | /api/v1/auth/me          | Get current user           | Yes           |
| POST   | /api/v1/auth/logout      | Logout (optional)          | Yes           |

### Invitation Endpoints

| Method | Endpoint                                   | Purpose                     | Auth Required |
| ------ | ------------------------------------------ | --------------------------- | ------------- |
| POST   | /api/v1/invitations                        | Create invitation           | Yes (Admin)   |
| GET    | /api/v1/invitations/validate?token={token} | Validate invitation         | No            |
| GET    | /api/v1/invitations                        | List all invitations        | Yes (Admin)   |
| GET    | /api/v1/invitations/{token}                | Get invitation by token     | No            |

---

## 6. Key Implementation Notes

### 6.1 Token Management

- **Storage**: HTTP Cookies (via `js-cookie`)
  - Cookie name: `token`
  - Expiration: 7 days
  - SameSite: `lax` (CSRF protection)
  - Secure: `true` in production, `false` in development
- **Zustand**: Synced with cookies
- **Axios Interceptor**: Automatically adds `Authorization: Bearer {token}` header
- **Middleware**: Reads cookie server-side for route protection
- **Refresh**: Token persistence across page reloads

### 6.2 State Management (Zustand)

**Auth Store** (`/src/stores/auth-store.ts`):

```typescript
{
  token: string | null;
  currentUser: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFetchingUser: boolean; // Prevents duplicate API calls
  error: string | null;
}
```

**Actions**:

- `setToken(token)` - Store token in HTTP cookie and state
- `login(token, user)` - Set token and user
- `logout()` - Clear token and user
- `setCurrentUser(user)` - Update user data
- `setFetchingUser(fetching)` - Prevent duplicate API calls

### 6.3 Case Conversion

**Base API** automatically converts:

- **Request**: camelCase → snake_case
- **Response**: snake_case → camelCase

Example:

```typescript
// Frontend sends:
{ invitationToken: "abc123" }

// Backend receives:
{ invitation_token: "abc123" }

// Backend returns:
{ access_token: "eyJ..." }

// Frontend receives:
{ accessToken: "eyJ..." }
```

### 6.4 Guards

**AuthGuard** (`/src/components/guards/AuthGuard.tsx`):

- Shows loading spinner while user profile is being fetched
- Does NOT handle redirects (middleware handles authentication redirects)
- Used to wrap protected pages and provide loading state

**AdminGuard** (`/src/components/guards/AdminGuard.tsx`):

- Checks if user role is `admin`
- Shows "Access Denied" if not admin

---

## 7. Error Handling

### 7.1 API Error Responses

All API errors return:

```json
{
  "detail": "Error message here"
}
```

Frontend catches and displays via:

- `useAuth` hook sets `error` state
- Components display with `<Alert type="error">`

### 7.2 Common Errors

| Error                         | Cause                      | Solution                     |
| ----------------------------- | -------------------------- | ---------------------------- |
| "Email already exists"        | Duplicate signup           | Use login instead            |
| "Invalid credentials"         | Wrong password             | Check email/password         |
| "Invitation expired"          | Token expired              | Request new invitation       |
| "Unauthorized"                | Missing/invalid token      | Login again                  |
| "Access denied"               | Not admin                  | Contact admin                |

---

## 8. Testing Flows

### 8.1 Test Normal Signup

```bash
1. Visit http://localhost:3000/auth/signup
2. Fill form:
   - Email: test@example.com
   - Password: password123
   - Organization: Test Org
3. Submit
4. Verify redirect to /dashboard
5. Check browser cookies for 'token' cookie
```

### 8.2 Test Invitation Flow

```bash
1. Login as admin
2. Go to /auth/invite
3. Enter email: newuser@example.com
4. Copy invitation link
5. Logout
6. Visit invitation link
7. Create password
8. Verify redirect to /dashboard
9. Check user is in correct organization
```

### 8.3 Test Page Refresh

```bash
1. Login successfully
2. Navigate to /dashboard
3. Refresh page (F5)
4. Verify still logged in
5. Verify only ONE /auth/me API call
```

---

## 9. Middleware Behavior

### 9.1 Route Classification

**Public Routes** (accessible without auth):
- `/` - Home page
- `/auth/login` - Login page
- `/auth/signup` - Signup page
- `/auth/accept-invite` - Invitation acceptance

**Auth Routes** (redirect authenticated users away):
- `/` - Home page
- `/auth/login`
- `/auth/signup`

**Protected Routes** (require authentication):
- `/dashboard`
- `/auth/invite` (admin only via AdminGuard)
- All other routes not listed as public

### 9.2 Redirect Logic

| User State      | Target Route       | Action                                    |
| --------------- | ------------------ | ----------------------------------------- |
| Authenticated   | /                  | Redirect to /dashboard                    |
| Authenticated   | /auth/login        | Redirect to /dashboard                    |
| Authenticated   | /auth/signup       | Redirect to /dashboard                    |
| Authenticated   | /dashboard         | Allow access                              |
| NOT Authenticated | /auth/login       | Allow access                              |
| NOT Authenticated | /dashboard        | Redirect to /auth/login?redirect=/dashboard |
| NOT Authenticated | /                 | Allow access                              |

### 9.3 Original URL Preservation

When redirecting unauthenticated users:
```
User tries: /dashboard
Redirected to: /auth/login?redirect=/dashboard
After login: Redirect back to /dashboard
```

This feature allows users to be redirected back to their intended destination after logging in.

---

## 10. Security Considerations

### 10.1 Token Security

- **Tokens stored in HTTP Cookies**:
  - `SameSite: lax` - Prevents CSRF attacks
  - `Secure: true` (production) - HTTPS only
  - `Expires: 7 days` - Auto-cleanup
  - Accessible by middleware (server-side)
- **XSS Protection**:
  - Still vulnerable to XSS (not httpOnly for client-side access)
  - Sanitize all user inputs
  - Use Content Security Policy (CSP)
- Always validate tokens server-side
- Use HTTPS in production
- Implement token expiration and refresh

**Why not httpOnly cookies?**
- Need client-side access for API calls
- Axios needs to read token for Authorization header
- Trade-off: accessibility vs security

### 9.2 Invitation Security

- Invitations expire after configured time
- Tokens are single-use
- Validate token before accepting
- Check user permissions server-side

### 9.3 Password Requirements

- Minimum 8 characters
- Validated on frontend and backend
- Never stored in plain text (backend responsibility)

---

**End of Application Flows Documentation**
