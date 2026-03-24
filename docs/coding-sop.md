# Standard Operating Procedure (SOP) for Coding with Standards
## Mind Vault Frontend

**Version**: 0.1.0
**Maintained By**: Development Team
**Changelog**: Initial SOP for Mind Vault Frontend project

---

## Table of Contents
1. [Pre-Development Checklist](#1-pre-development-checklist)
2. [Development Standards](#2-development-standards)
3. [Quality Gates Workflow](#3-quality-gates-workflow)
4. [Component Development Standards](#4-component-development-standards)
5. [State Management Standards](#5-state-management-standards)
6. [API Integration Standards](#6-api-integration-standards)
7. [Testing Requirements](#7-testing-requirements)
8. [Git & Version Control](#8-git--version-control)
9. [Performance Standards](#9-performance-standards)
10. [Documentation Requirements](#10-documentation-requirements)
11. [Quick Reference](#11-quick-reference)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Pre-Development Checklist

### 1.1 Environment Setup Verification

**Before starting any development work:**

- [ ] Environment variables configured (`.env.local` file created from `.env.example`)
- [ ] Dependencies installed: `npm install`
- [ ] Development server starts successfully: `npm run dev`
- [ ] Git configured with correct user credentials
- [ ] IDE/Editor configured with ESLint and TypeScript support

**Verify your setup:**
```bash
# Check Node version (should be v20 or higher for Next.js 16.2.1)
node -v

# Verify dependencies are installed
npm list --depth=0

# Start dev server to ensure everything works
npm run dev
# Server should start at http://localhost:3000
```

### 1.2 Documentation Review Requirements

**Read before coding:**

- [ ] Review [README.md](../README.md) for project setup
- [ ] Review [CLAUDE.md](../CLAUDE.md) and [AGENTS.md](../AGENTS.md) for AI assistant guidelines
- [ ] Check relevant feature documentation in `docs/` directory
- [ ] Understand Next.js App Router conventions
- [ ] Review existing components before creating new ones

**Key documentation files:**

- `docs/coding-sop.md` (this file) - Development standards
- Next.js 16 docs in `node_modules/next/dist/docs/` - Framework reference
- `README.md` - Project setup and overview

### 1.3 Codebase Familiarity Guidelines

**Before implementing new functionality:**

1. **Search for existing solutions:**
   ```bash
   # Search for similar components
   find src/ -name "*[keyword]*"

   # Search for similar functionality in code
   grep -r "functionName" src/
   ```

2. **Check existing components:**
   - Browse `src/app/` for page components
   - Check `src/components/` for reusable components (if exists)
   - Review `src/lib/` for utility functions (if exists)

3. **Review Next.js patterns:**
   - Understand App Router file conventions
   - Check `layout.tsx` and `page.tsx` patterns
   - Review Server vs Client Component usage

---

## 2. Development Standards

### 2.1 Code Style & Formatting

#### ESLint Configuration
**Base Rules** (Next.js with ESLint 9 Flat Config):

The project uses Next.js ESLint config with TypeScript support:
- `eslint-config-next/core-web-vitals`
- `eslint-config-next/typescript`

```javascript
// Key rules enforced by Next.js config:
// - React Hooks rules
// - Next.js specific rules (Image, Link, etc.)
// - TypeScript type checking
// - Accessibility rules (jsx-a11y)
```

**Quick Style Rules:**
- ✅ Use double quotes for JSX/TSX: `<Component name="value" />`
- ✅ Use single quotes for regular strings: `'hello'`
- ✅ Semicolons are optional (follow existing patterns)
- ✅ 2-space indentation
- ✅ Use Prettier defaults (if configured)
- ❌ No `any` types (use `unknown` if type is truly unknown)
- ❌ No unused variables or imports
- ❌ No debugger statements in production code
- ❌ Minimize console.log usage (use proper debugging tools)

#### TypeScript Standards

**Type Safety Requirements:**
```typescript
// ✅ GOOD: Explicit interfaces
interface ComponentProps {
  title: string;
  count: number;
  onAction: (id: string) => void;
  isVisible?: boolean;  // Optional props marked with ?
}

const Component: React.FC<ComponentProps> = ({ title, count, onAction, isVisible = true }) => {
  // Implementation
};

// ❌ BAD: Using any
const handleData = (data: any) => {  // Avoid any!
  // ...
};

// ✅ GOOD: Proper typing
interface DataResponse {
  id: string;
  value: number;
}

const handleData = (data: DataResponse) => {
  // ...
};
```

**Type Export Pattern:**
```typescript
// ✅ GOOD: Interfaces with 'I' prefix (extendable)
export interface IUserModel {
  id: string;
  email: string;
  name: string;
}

// ✅ GOOD: Types with 'T' prefix
export type TUserStatus = 'active' | 'inactive' | 'pending';
export type TUserRole = 'admin' | 'user' | 'guest';

// Generic types
export type TApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

// Export type-only imports
export type { ISpecificType } from './types';

// Benefits of I/T prefix convention:
// - Developers can identify extendable types (interfaces) at a glance
// - Clear distinction between interfaces and type aliases
// - Easier to understand which types can be extended/implemented
```

### 2.2 Architecture Compliance

#### Naming Conventions

**Files & Folders:**
```
kebab-case for files:       button-component.tsx
kebab-case for folders:     common-components/
Index files:                index.tsx, index.ts
```

**TypeScript Naming:**
```typescript
// PascalCase for components and classes
export const ButtonComponent: React.FC<IButtonProps> = () => {};
export class ApiClient {}

// Interfaces: 'I' prefix (extendable types)
export interface IUserModel {
  id: string;
  name: string;
}
export interface IButtonProps {
  label: string;
  onClick: () => void;
}

// Types: 'T' prefix (type aliases)
export type TUserStatus = 'active' | 'inactive';
export type TApiResponse<T> = {
  data: T;
  status: number;
};

// camelCase for functions, variables, parameters
export const getUserData = () => {};
const isActive = true;
const handleClick = (userId: string) => {};

// UPPER_SNAKE_CASE for constants
export const API_BASE_URL = 'https://api.example.com';
export const MAX_RETRY_COUNT = 3;

// Hook naming
export function useHomeData() {}
```

### 2.3 Component Architecture Patterns

#### Next.js App Router Structure

**Component Hierarchy:**

1. **Server Components** (default in Next.js 16):
   - Located in `src/app/` directories
   - Can fetch data directly
   - No useState, useEffect, or browser-only APIs
   - Better performance and SEO

2. **Client Components** (with `'use client'`):
   - Interactive components with hooks
   - Browser-only features
   - Event handlers (onClick, onChange, etc.)
   - Use Context, useState, useEffect

3. **Shared/Reusable Components**:
   - Located in `src/components/` (create if needed)
   - Can be Server or Client components
   - Shared across multiple pages/features

4. **Page Components** (`page.tsx`):
   - Route-level components in `src/app/`
   - Default to Server Components
   - Handle data fetching and layout

**Decision Tree - Server vs Client Component:**
```
Need a component?
├─ Does it use hooks (useState, useEffect, etc.)?
│  └─ YES → Client Component ('use client')
├─ Does it need browser APIs (window, document)?
│  └─ YES → Client Component ('use client')
├─ Does it have event handlers (onClick, etc.)?
│  └─ YES → Client Component ('use client')
├─ Can it be static/fetch data on server?
│  └─ YES → Server Component (default)
└─ When in doubt → Start with Server Component
```

---

## 3. Quality Gates Workflow

### 3.1 Build Verification

**Before finalizing MR/PR:**

```bash
# Run linter
npm run lint

# Type check
npx tsc --noEmit

# Production build test
npm run build

# If build succeeds, test production build locally
npm run start
# Visit http://localhost:3000 to verify

# Bundle analysis (add @next/bundle-analyzer if needed)
# See: https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer
```

### 3.2 Quality Gate Checklist

**Before every commit:**
- [ ] No console errors in development
- [ ] Component renders correctly
- [ ] No TypeScript errors

**Before every MR/PR:**
- [ ] `npx tsc --noEmit` passes with no errors
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] Manual testing completed (see Section 7.2)
- [ ] Accessibility verified (keyboard nav, screen readers - Section 7.5)
- [ ] No unused imports or variables
- [ ] No commented-out code (clean it up)
- [ ] Responsive design verified (if UI changes)
- [ ] Server/Client components used appropriately
- [ ] No props spreading anti-patterns
- [ ] Functions with 3+ params use object destructuring
- [ ] Interfaces use `I` prefix, types use `T` prefix

**Periodically (weekly/sprint):**
- [ ] Review bundle size (add @next/bundle-analyzer if needed)
- [ ] Review and update documentation

---

## 4. Component Development Standards

### 4.1 Component Structure Template

**Client Component with TypeScript:**

```typescript
// src/components/MyComponent.tsx
'use client';

import { useState, useEffect } from 'react';

// Props interface (use 'I' prefix for interfaces)
interface IMyComponentProps {
  title: string;
  userId: string;
  onComplete?: (data: string) => void;
  isVisible?: boolean;
}

// Component implementation
export function MyComponent({
  title,
  userId,
  onComplete,
  isVisible = true
}: IMyComponentProps) {
  // Local state
  const [isLoading, setIsLoading] = useState(false);

  // Effects
  useEffect(() => {
    // Initialization logic
    return () => {
      // Cleanup logic
    };
  }, [userId]);

  // Event handlers
  const handleAction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/action/${userId}`, {
        method: 'POST'
      });
      const data = await response.json();
      onComplete?.(data);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Early return for conditional rendering
  if (!isVisible) {
    return null;
  }

  // Render with Tailwind CSS
  return (
    <div className="p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <button
        onClick={handleAction}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {isLoading ? 'Loading...' : 'Execute Action'}
      </button>
    </div>
  );
}
```

**Server Component with TypeScript:**

```typescript
// src/app/dashboard/page.tsx
import { getData } from '@/lib/api';

// Server Component (no 'use client')
export default async function DashboardPage() {
  // Fetch data directly in Server Component
  const data = await getData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-4">
        {data.map((item) => (
          <div key={item.id}>{item.name}</div>
        ))}
      </div>
    </div>
  );
}
```

### 4.2 Component Best Practices

#### ✅ DO:

```typescript
// ✅ Use 'use client' for components with interactivity
'use client';
export function Component() {
  return <div>Interactive content</div>;
}

// ✅ Use React.memo for expensive components
import { memo } from 'react';
export const PureComponent = memo(function PureComponent({ data }: Props) {
  return <div>{data}</div>;
});

// ✅ Define handlers outside JSX
const handleClick = () => {
  // Logic here
};
return <button onClick={handleClick}>Click</button>;

// ✅ Use proper key props in lists
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// ✅ Use nullish coalescing for default values
const count = data?.count ?? 0;

// ✅ Use object parameters for 3+ params
interface IGetUserDataParams {
  id: string;
  firstName: string;
  lastName: string;
  isSubscribed: boolean;
}

async function getUserData({
  id,
  firstName,
  lastName,
  isSubscribed
}: IGetUserDataParams) {
  // Implementation
}

// ✅ Pass primitive values as props
<Component userId={user.id} isActive={user.isActive} />

// ✅ Use Tailwind CSS for styling
<div className="flex items-center gap-4 p-4">
  <span className="text-lg font-semibold">Title</span>
</div>

// ✅ Server Components for data fetching
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

#### ❌ DON'T:

```typescript
// Don't create functions in render
{items.map(item => (
  <Item key={item.id} onClick={() => handleClick(item)} />  // BAD
))}

// Don't use inline objects/arrays in JSX
<Component style={{marginTop: 10}} />  // Creates new object every render
<Component items={[1, 2, 3]} />        // Creates new array every render

// Don't use index as key
{items.map((item, index) => (
  <Item key={index} />  // BAD: Use item.id instead
))}

// Don't mutate props
props.items.push(newItem);  // BAD: Props are immutable

// ❌ CRITICAL: Don't use too many function parameters (3+ params)
const getUserData = (
  id: string,
  firstName: string,
  lastName: string,
  isSubscribed: boolean
) => {};  // BAD - Use object destructuring instead

// ❌ CRITICAL: Don't spread arrays/objects as props
<Component items={[...items]} />  // BAD - Breaks React diffing, causes infinite re-renders
<Component {...props} />           // BAD - Same reference issue, hard to track props

// ❌ CRITICAL: Don't spread inline arrays
<Component data={[...originalData, newItem]} />  // BAD - Creates new array every render
```

### 4.3 Common Patterns

**Button with Tailwind:**
```typescript
<button
  onClick={handleClick}
  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 active:bg-blue-700 disabled:opacity-50"
  disabled={isLoading}
>
  {isLoading ? 'Loading...' : 'Click Me'}
</button>
```

**Next.js Link:**
```typescript
import Link from 'next/link';

<Link href="/about" className="text-blue-500 hover:underline">
  About Page
</Link>
```

**Next.js Image:**
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="Logo"
  width={200}
  height={100}
  priority // For above-the-fold images
/>
```

**Error Boundary (Create Custom):**
```typescript
// src/components/ErrorBoundary.tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }
    return this.props.children;
  }
}
```

## 5. State Management Standards

### 5.1 React State Management

**State Management Options:**

1. **React useState** (Component-level state):
   ```typescript
   'use client';

   import { useState } from 'react';

   export function Counter() {
     const [count, setCount] = useState(0);
     return <button onClick={() => setCount(count + 1)}>{count}</button>;
   }
   ```

2. **React Context** (Cross-component state):
   ```typescript
   'use client';

   import { createContext, useContext, useState, ReactNode } from 'react';

   interface IThemeContext {
     theme: 'light' | 'dark';
     setTheme: (theme: 'light' | 'dark') => void;
   }

   const ThemeContext = createContext<IThemeContext | undefined>(undefined);

   export function ThemeProvider({ children }: { children: ReactNode }) {
     const [theme, setTheme] = useState<'light' | 'dark'>('light');

     return (
       <ThemeContext.Provider value={{ theme, setTheme }}>
         {children}
       </ThemeContext.Provider>
     );
   }

   export function useTheme() {
     const context = useContext(ThemeContext);
     if (!context) throw new Error('useTheme must be used within ThemeProvider');
     return context;
   }
   ```

3. **URL State** (Next.js searchParams):
   ```typescript
   // Server Component
   export default async function SearchPage({
     searchParams
   }: {
     searchParams: Promise<{ q?: string }>
   }) {
     const params = await searchParams;
     const query = params.q || '';

     return <div>Search: {query}</div>;
   }
   ```

4. **Third-party libraries** (if needed):
   - Zustand (lightweight)
   - Redux Toolkit (complex apps)
   - Jotai (atomic state)

**Key Rules for useEffect Dependencies:**

1. **Use primitives** (boolean, number, string)
   - ✅ `[userId, isActive, count]`
   - ❌ `[user, config, data]`

2. **Use useMemo/useCallback for object dependencies:**
   ```typescript
   const memoizedValue = useMemo(
     () => ({ key: value }),
     [value]
   );
   ```

3. **Consider moving state to URL** for shareable state
---

## 6. API Integration Standards

### 6.1 Next.js API Routes Pattern

**API Route Structure:**

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    // Fetch data
    const users = await fetchUsers(query);

    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    if (!body.name || !body.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Create user
    const user = await createUser(body);

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
```

**Dynamic Route:**
```typescript
// src/app/api/users/[id]/route.ts
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = await fetchUser(id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ user });
}
```

### 6.2 Client-Side API Calls

**Using fetch in Client Components:**
```typescript
'use client';

import { useState, useEffect } from 'react';

interface IUser {
  id: string;
  name: string;
  email: string;
}

export function UserList() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data.users);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### 6.3 Server Component Data Fetching

**Fetch in Server Components:**
```typescript
// src/app/users/page.tsx
interface IUser {
  id: string;
  name: string;
  email: string;
}

async function getUsers(): Promise<IUser[]> {
  const response = await fetch('https://api.example.com/users', {
    next: { revalidate: 3600 } // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return response.json();
}

export default async function UsersPage() {
  const users = await getUsers();

  return (
    <div>
      <h1>Users</h1>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 6.4 API Best Practices

#### ✅ DO:

```typescript
// ✅ Use Next.js API Routes
// src/app/api/users/route.ts
export async function GET(request: NextRequest) {
  const users = await db.users.findMany();
  return NextResponse.json({ users });
}

// ✅ Use proper TypeScript interfaces
interface IGetUsersResponse {
  users: IUser[];
  total: number;
}

async function getUsers(): Promise<IGetUsersResponse> {
  const response = await fetch('/api/users');
  return response.json();
}

// ✅ Handle errors properly
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Fetch failed:', error);
    throw error;
  }
}

// ✅ Use Next.js caching
const response = await fetch('https://api.example.com/data', {
  next: { revalidate: 3600 } // ISR: revalidate every hour
});

// ✅ Use Server Components for data fetching when possible
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

#### ❌ DON'T:

```typescript
// ❌ Don't use any types
async function getData(params: any): Promise<any> {
  // BAD - use proper interfaces
}

// ❌ Don't ignore errors
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json(); // What if response is not ok?
}

// ❌ Don't fetch in Client Components if Server Component works
'use client';
export default function Page() {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch('/api/data').then(r => r.json()).then(setData);
  }, []);
  // Better: Use Server Component
}

// ❌ Don't forget to handle loading/error states
async function loadData() {
  const data = await fetch('/api/data');
  // What about loading? What about errors?
  return data;
}
```

---

## 7. Testing Requirements

### 7.1 Testing Setup

**Testing Libraries (to be added):**

```bash
# Install testing libraries (when needed)
npm install -D @testing-library/react @testing-library/jest-dom jest jest-environment-jsdom

# For E2E testing
npm install -D @playwright/test
npx playwright install
```

**Jest Configuration (create when adding tests):**
```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

**Component Testing Example:**
```typescript
// src/components/__tests__/Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByText('Click me')).toBeDisabled();
  });
});
```

**Running Tests (after setup):**
```bash
# Run all tests
npm run testHere’s a **highly optimized prompt for Claude** to generate the frontend for your authentication flow, fully aligned with your backend, Tailwind + ShadeCN design system, minimal state management using **Zustand only where necessary**, and best practices for structure and reusable components.

---

**Prompt for Claude (Frontend Auth Flow)**

You are a senior frontend architect.

Tech Stack:

* React 18 + Next.js 13 (app router)
* TypeScript
* TailwindCSS for styling
* ShadeCN components
* Axios for API calls
* Zustand for state management (only where necessary, e.g., auth state)

Backend:

* Running on **[http://localhost:8000](http://localhost:8000)**
* Endpoints:

  * POST `/auth/signup` → signup (organization + admin user)
  * GET `/auth/me` → get current user profile
  * POST `/invitations` → create invitation (admin only)
  * POST `/invitations/accept` → accept invitation

---

### 🎯 Goal

Build a **clean, modular, production-ready authentication frontend** with:

* Signup (organization + admin)
* Login (token verification + profile fetch)
* Invite users (admin only)
* Accept invitations

---

### ⚠️ Rules & Best Practices

1. **Minimal State Management**:

   * Use **Zustand** **only** for auth state (current user info + token).
   * Do not create unnecessary stores.

2. **Centralized API**:

   * Create `src/services/base-api.ts` with Axios instance.
   * Automatically convert all API responses from snake_case to camelCase.
   * All other API modules (signup, login, invitations) should **extend base-api**.

3. **UI & Styling**:

   * Use **ShadeCN components** wherever possible.
   * Reusable common components for buttons, inputs, modals, alerts.
   * Tailwind + project theme colors:

     * **Dark mode**:

       * App background: `#0C0E12`
       * Button border: `transparent`
       * Button background: `#936BDA`
       * Button text: `#fff`
       * Font: `Inter`
     * **Light mode**:

       * App background: `#fff`
       * Button border: `1px solid #121212`
       * Button background: `transparent`
       * Button text: `#121212`
       * Font: `Inter`

4. **Folder Structure**:

```plaintext
src/
├── app/
│   ├── auth/
│   │   ├── login/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── invite/page.tsx
│   │   └── accept-invite/page.tsx
├── components/
│   ├── forms/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── InviteForm.tsx
│   │   └── AcceptInvitationForm.tsx
│   └── ui/                # Common reusable UI components (buttons, inputs, modals, alerts)
├── contexts/             # Optional, minimal usage if needed
├── hooks/
│   └── useAuth.ts         # Custom hook for auth interactions
├── services/
│   ├── base-api.ts        # Axios instance, snake_case → camelCase conversion
│   ├── auth-api.ts        # Extend base-api for auth endpoints
│   ├── invitations-api.ts # Extend base-api for invitation endpoints
│   └── users-api.ts       # Extend base-api for user-related endpoints
├── stores/
│   └── auth-store.ts      # Zustand store for auth state (only)
├── types/
│   └── auth.ts            # Types for User, Organization, Invitation
└── utils/
```

---

### 🧩 Frontend Auth Flow

1️⃣ **Signup (`/auth/signup`)**

* Form: `email`, `password`, `organizationName`
* On submit → POST `/auth/signup` via `auth-api.ts`
* Store token in Zustand + redirect to `/auth/me`
* Show API errors clearly

2️⃣ **Login (`/auth/login`)**

* Form: `email`, `password`
* On submit → fetch token/profile
* Store token in Zustand
* Redirect to dashboard or `/auth/me`

3️⃣ **Invite User (`/auth/invite`)**

* Form: `email`, `role`
* Admin-only page
* On submit → POST `/invitations`
* Show invitation link on success

4️⃣ **Accept Invitation (`/auth/accept-invite?token=...`)**

* Form shows email (read-only) + password
* On submit → POST `/invitations/accept`
* Redirect to login on success

---

### 🔐 Auth State

* Zustand store must hold: `token` + `currentUser`
* Expose `login`, `logout`, `signup`, `refreshProfile` actions
* Pages requiring auth must guard via `useAuth` hook
* Automatically fetch `/auth/me` if token exists

---

### 💡 UI & UX

* ShadeCN components for all inputs, buttons, modals, alerts
* Tailwind for colors, spacing, fonts
* Responsive for mobile + desktop
* Loading states for all async actions
* Clear error/success messages

---

### 📦 Output Format for Claude

1. `base-api.ts` → Axios instance + snake_case → camelCase
2. `auth-api.ts`, `invitations-api.ts`, `users-api.ts` → extend base-api
3. Zustand store → `auth-store.ts`
4. `useAuth.ts` hook for auth interactions
5. Pages + forms → `/auth/login`, `/auth/signup`, `/auth/invite`, `/auth/accept-invite`
6. Common UI components → reusable across all pages
7. Fully typed with TypeScript

---

🎯 **Priority:** **Correctness > Reusability > Clean Architecture**

Start now.

---

If you want, I can also **write a ready-to-use version of this prompt with base-api, stores, types, and folder placeholders prefilled**, so Claude can generate the full frontend auth flow **in one go**.

Do you want me to prepare that full ready-to-use prompt?


# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests (after installing Playwright)
npm run test:e2e
```

### 7.2 Manual Testing Checklist

**Before creating MR/PR:**

**Functionality Testing:**
- [ ] Feature works as expected in happy path
- [ ] Edge cases handled correctly
- [ ] Error states display properly
- [ ] Loading states work correctly
- [ ] Empty states show appropriate messages

**UI/UX Testing:**
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Visual consistency with existing design
- [ ] Animations/transitions work smoothly
- [ ] No visual glitches or layout shifts

**Accessibility Testing (CRITICAL - see Section 7.5):**
- [ ] Keyboard navigation works (tab, enter, escape, arrows)
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader support (aria labels, alt text, sr-only)
- [ ] Color contrast meets WCAG AA standards
- [ ] No keyboard traps
- [ ] Semantic HTML used correctly

**Browser Testing:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if Mac available)
- [ ] Edge (latest)

**Performance Testing:**
- [ ] Page loads in reasonable time
- [ ] No console errors or warnings
- [ ] No memory leaks (check DevTools)
- [ ] Smooth interactions (no lag)

**Data Testing:**
- [ ] Data persists correctly
- [ ] API calls succeed
- [ ] Cache works as expected
- [ ] Stale data handled properly

### 7.3 Test Data Management

**Environment Variables for Testing:**
```bash
# .env.test (create when needed)
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DATABASE_URL=postgresql://test:test@localhost:5432/test_db
```

**Mock Data:**
```typescript
// src/lib/mocks/users.ts
export const mockUsers = [
  { id: '1', name: 'John Doe', email: 'john@example.com' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
];

// Use in tests
import { mockUsers } from '@/lib/mocks/users';
```

### 7.4 Adding Test IDs

**In Components:**
```typescript
// Add data-testid for E2E testing
<div data-testid="feature-container">
  <h1 data-testid="feature-title">{title}</h1>
  <button data-testid="load-button" onClick={handleLoad}>
    Load Data
  </button>
  {error && (
    <div data-testid="error-message">{error}</div>
  )}
</div>
```

**Best practices for test IDs:**
- Use kebab-case: `data-testid="my-component-button"`
- Be specific: `data-testid="submit-form-button"` vs. `data-testid="button"`
- Don't use dynamic values: `data-testid="item-1"` might break
- Prefer semantic IDs: `data-testid="error-message"` vs. `data-testid="red-text"`

### 7.5 Accessibility Requirements (CRITICAL)

**After implementing any component or feature, ALWAYS verify accessibility:**

#### Keyboard Navigation Testing

**Required for all interactive components:**

```typescript
// ✅ GOOD: Proper keyboard navigation support
<button
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }}
  tabIndex={0}
  aria-label="Submit form"
>
  Submit
</button>

// ✅ GOOD: Focus management
<div
  role="button"
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
>
  Custom Button
</div>

// ✅ GOOD: Skip links for navigation
<a href="#main-content" className="sr-only sr-only-focusable">
  Skip to main content
</a>
```

**Keyboard Navigation Checklist:**
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical and intuitive
- [ ] Focus indicators are visible
- [ ] No keyboard traps (user can tab in and out)
- [ ] Enter/Space keys work on custom buttons
- [ ] Escape key closes modals/dropdowns
- [ ] Arrow keys navigate lists/menus (where applicable)


**Screen Reader Examples:**

```typescript
// ✅ GOOD: Descriptive labels for icons
<button aria-label="Close modal" onClick={handleClose}>
  <CloseIcon aria-hidden="true" />
  <span className="sr-only">Close</span>
</button>

// ✅ GOOD: Loading states
<div role="status" aria-live="polite">
  {isLoading && <span className="sr-only">Loading data...</span>}
</div>

// ✅ GOOD: Error announcements
<div role="alert" aria-live="assertive">
  {error && <span>{error}</span>}
</div>

// ✅ GOOD: Form field labels
<label htmlFor="email-input">
  Email Address
  <span className="sr-only">(required)</span>
</label>
<input
  id="email-input"
  type="email"
  required
  aria-required="true"
  aria-describedby="email-help"
/>
<small id="email-help">We'll never share your email</small>
```

#### ARIA Attributes Guidelines

**Common ARIA patterns:**

```typescript
// Modal/Dialog
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-description"
>
  <h2 id="dialog-title">Confirm Action</h2>
  <p id="dialog-description">Are you sure you want to proceed?</p>
</div>

// Dropdown/Menu
<button
  aria-haspopup="true"
  aria-expanded={isOpen}
  aria-controls="dropdown-menu"
  onClick={toggleDropdown}
>
  Menu
</button>
<ul id="dropdown-menu" role="menu" hidden={!isOpen}>
  <li role="menuitem">Option 1</li>
  <li role="menuitem">Option 2</li>
</ul>

// Tabs
<div role="tablist">
  <button
    role="tab"
    aria-selected={activeTab === 'tab1'}
    aria-controls="panel1"
    id="tab1"
  >
    Tab 1
  </button>
</div>
<div role="tabpanel" id="panel1" aria-labelledby="tab1">
  Panel content
</div>

// Loading/Busy states
<button aria-busy={isLoading} disabled={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</button>
```

**ARIA Best Practices:**
- Use semantic HTML first (prefer `<button>` over `<div role="button">`)
- Add `aria-label` for icons and icon-only buttons
- Use `aria-describedby` for additional context
- Implement `aria-live` regions for dynamic content
- Mark decorative images with `aria-hidden="true"`

#### Accessibility Testing Checklist

**Before marking feature as complete:**

- [ ] **Keyboard Navigation**
  - [ ] Tab through all interactive elements
  - [ ] Verify logical tab order
  - [ ] Test Enter/Space on buttons
  - [ ] Test Escape to close modals
  - [ ] Verify no keyboard traps

- [ ] **Screen Reader Testing** (use browser extensions)
  - [ ] All images have alt text
  - [ ] Form fields have labels
  - [ ] Buttons have descriptive text
  - [ ] Dynamic content announces properly
  - [ ] Error messages are announced

- [ ] **Visual Accessibility**
  - [ ] Color contrast meets WCAG AA standards (4.5:1 for text)
  - [ ] Focus indicators are visible
  - [ ] No information conveyed by color alone
  - [ ] Text is resizable up to 200%

- [ ] **Semantic HTML**
  - [ ] Proper heading hierarchy (h1, h2, h3...)
  - [ ] Landmarks used correctly (nav, main, aside, footer)
  - [ ] Lists use proper markup (ul, ol, li)
  - [ ] Tables have proper structure (thead, tbody, th, td)

**Tools for Accessibility Testing:**
- axe DevTools (browser extension)
- WAVE (browser extension)
- Lighthouse accessibility audit
- Screen readers: NVDA (Windows), JAWS (Windows), VoiceOver (Mac)

#### Common Accessibility Violations to Avoid

```typescript
// ❌ BAD: Click handler on non-interactive element
<div onClick={handleClick}>Click me</div>

// ✅ GOOD: Use button element
<button onClick={handleClick}>Click me</button>

// ❌ BAD: Missing alt text
<img src="chart.png" />

// ✅ GOOD: Descriptive alt text
<img src="chart.png" alt="Sales growth chart showing 25% increase" />

// ❌ BAD: Icon button without label
<button onClick={handleDelete}>
  <TrashIcon />
</button>

// ✅ GOOD: Icon button with accessible label
<button onClick={handleDelete} aria-label="Delete item">
  <TrashIcon aria-hidden="true" />
</button>

// ❌ BAD: Form input without label
<input type="text" placeholder="Enter name" />

// ✅ GOOD: Proper label association
<label htmlFor="name-input">Name</label>
<input id="name-input" type="text" />
```

---

## 8. Git & Version Control

**Branch Naming Convention:**
```bash
# Feature branches
feature/add-auth
feature/implement-search-functionality

# Bug fix branches
fix/resolve-login-error
fix/correct-data-display-issue

# Refactoring branches
refactor/update-api-architecture
refactor/simplify-components

# Hotfix branches
hotfix/critical-security-patch

# Documentation branches
docs/update-readme
```

### 8.2 Creating a Feature Branch

```bash
# 1. Ensure you're on main branch
git checkout main

# 2. Pull latest changes
git pull origin main

# 3. Create feature branch
git checkout -b feature/add-user-dashboard

# 4. Work on your feature
# ... make changes ...

# 5. Commit changes
git add .
git commit -m "feat: Add user dashboard with analytics"

# 6. Push branch
git push origin feature/add-user-dashboard
```

### 8.3 Commit Message Standards

**Format:**
```
<type>: <subject>

<optional body>

<optional footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `style`: Formatting changes (no code logic change)
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `perf`: Performance improvements

**Examples:**
```bash
# Feature
git commit -m "feat: Add user analytics dashboard with charts"

# Bug fix
git commit -m "fix: Resolve login redirect loop issue"

# Refactoring
git commit -m "refactor: Simplify store initialization logic"

# Multiple line commit
git commit -m "feat: Add export functionality

- Support CSV, PDF, and Excel formats
- Add progress indicator for large exports
- Implement error handling for failed exports"

# With issue reference
git commit -m "fix: Correct data display issue

Resolves #12348"
```

### 8.4 Merge Request (MR) / Pull Request (PR) Process

**Creating MR/PR:**

1. **Ensure quality gates pass:**
   ```bash
   npm run type-check
   npm run lint-fix
   npm run build
   ```

2. **Push latest changes:**
   ```bash
   git push origin feature/12345-my-feature
   ```

3. **Create PR in GitHub:**
   - Navigate to GitHub repository
   - Click "Pull requests" → "New pull request"
   - Source: `feature/my-feature`
   - Target: `main`
   - Fill out PR template (see below)

**PR Template:**
```markdown
## Description
Brief description of what this PR accomplishes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation update

## Changes Made
- Added user dashboard page
- Implemented responsive design with Tailwind CSS
- Created reusable components
- Added proper TypeScript types

## Screenshots (if applicable)
[Add screenshots here for UI changes]

## Testing
- [ ] Manual testing completed
- [ ] Tested on Chrome, Firefox
- [ ] Tested responsive design (mobile, tablet, desktop)
- [ ] No console errors or warnings
- [ ] Unit tests added/updated (if applicable)

## Quality Gates
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] `npm run build` succeeds
- [ ] No new TypeScript errors

## Checklist
- [ ] Code follows project standards (see docs/coding-sop.md)
- [ ] Used Server Components where appropriate
- [ ] Client Components marked with 'use client'
- [ ] Documentation updated (if needed)
- [ ] No commented-out code
- [ ] Responsive design verified
- [ ] Accessible (keyboard navigation, ARIA labels)
- [ ] No unused imports or variables
```

### 8.5 Code Review Guidelines

**For Reviewers:**
- [ ] Code follows architecture patterns
- [ ] TypeScript types are properly defined
- [ ] API clients extend BaseApi correctly
- [ ] Components use existing common components where possible
- [ ] No performance anti-patterns (inline functions, objects in JSX)
- [ ] Error handling is comprehensive
- [ ] No security vulnerabilities (XSS, injection, etc.)
- [ ] Tests are included (E2E tests for features)
- [ ] Documentation is updated if needed

**For Authors:**
- Respond to feedback promptly
- Address all comments before merging
- Re-request review after making changes
- Ensure CI/CD pipeline passes

## 9. Performance Standards

### 9.1 Code Splitting & Lazy Loading

**Lazy Load Components:**
```typescript
// Use dynamic imports for large components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(
  () => import('@/components/dashboard/heavy-component'),
  {
    loading: () => <div>Loading...</div>,
    ssr: false  // Disable SSR if component uses window/document
  }
);

// Use in component
const Page = () => {
  return (
    <div>
      <HeavyComponent />
    </div>
  );
};
```

### 9.2 Image Optimization

**Use Next.js Image Component:**
```typescript
import Image from 'next/image';

// Optimized image loading (static import)
import heroImage from '@/public/hero.jpg';

<Image
  src={heroImage}
  alt="Hero image"
  priority  // For above-the-fold images
  placeholder="blur" // Automatic with static import
/>

// External images (configure in next.config.ts)
<Image
  src="https://example.com/image.jpg"
  alt="External image"
  width={800}
  height={600}
  loading="lazy"
/>

// Responsive images with fill
<div className="relative w-full h-64">
  <Image
    src="/product.jpg"
    alt="Product"
    fill
    className="object-cover"
  />
</div>
```

**Configure External Images:**
```typescript
// next.config.ts
import type { NextConfig } from 'next';

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

export default config;
```

### 9.3 Bundle Size Monitoring

**Analyze Bundle Size:**
```bash
# Install bundle analyzer
npm install -D @next/bundle-analyzer

# Update next.config.ts
# See: https://nextjs.org/docs/app/building-your-application/optimizing/bundle-analyzer

# Build with analysis
ANALYZE=true npm run build

# Check .next/analyze/ for reports
```

**Monitor Bundle in Dev:**
```bash
# Build and check size
npm run build

# Look for warnings in build output:
# ⚠ Compiled with warnings:
# Route (app) Exceeds maximum recommended bundle size
```

**Actions if bundle is too large:**
1. Use dynamic imports for large components:
   ```typescript
   import dynamic from 'next/dynamic';

   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>,
   });
   ```

2. Check for large dependencies with `npm ls`

3. Use named imports:
   ```typescript
   // ✅ GOOD: Tree-shakeable
   import { useState } from 'react';

   // ❌ BAD: Imports everything
   import * as React from 'react';
   ```

4. Move large dependencies to edge/runtime when possible

### 9.4 Performance Best Practices

**React Performance:**
```typescript
// Use React.memo for expensive pure components
export const ExpensiveComponent = React.memo<Props>(({ data }) => {
  // Expensive rendering logic
  return <div>{/* content */}</div>;
});

// Use useMemo for expensive computations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Use useCallback for stable function references
const handleClick = useCallback(() => {
  // Handler logic
}, [dependency]);

// Virtualize long lists
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={600}
  itemCount={items.length}
  itemSize={50}
  width="100%"
>
  {({ index, style }) => (
    <div style={style}>{items[index]}</div>
  )}
</FixedSizeList>
```

**API Performance:**
```typescript
// Use axios-cache-interceptor for caching
// (Already configured in BaseApi)

// Implement request debouncing for search
import { debounce } from 'lodash';

const debouncedSearch = useMemo(
  () => debounce((query: string) => {
    store.searchData(query);
  }, 300),
  [store]
);

// Cancel requests on cleanup
useEffect(() => {
  const controller = new AbortController();

  api.getData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

### 9.5 Performance Monitoring

**Check Performance in Development:**
```bash
# Open React DevTools Profiler
# Record interaction
# Analyze render times and component updates
```

**Sentry Performance Monitoring:**
- Automatic transaction tracking enabled

**Performance Budget (Core Web Vitals):**
- Largest Contentful Paint (LCP): < 2.5s
- First Input Delay (FID): < 100ms
- Cumulative Layout Shift (CLS): < 0.1
- First Contentful Paint (FCP): < 1.8s
- Total Bundle Size: Target < 200KB (initial load, gzipped)

---

## 10. Documentation Requirements

### 10.2 When to Add Documentation

**Always document:**
- Public APIs and interfaces
- Complex business logic
- Non-obvious algorithms
- Configuration options
- Security-sensitive code

**Don't document:**
- Self-explanatory code
- Implementation details (focus on "what" and "why", not "how")
- Getters/setters with obvious behavior
- Standard CRUD operations

### 10.3 README Files

**When to create README:**
- New major feature directory
- Complex module with multiple files
- Standalone utility library
- Integration with external service

**README Template:**
```markdown
# Feature Name

Brief description of the feature and its purpose.

## Structure
\`\`\`
feature/
├── components/
├── api/
└── utils/
\`\`\`

## Usage
\`\`\`typescript
import { FeatureComponent } from './feature';

<FeatureComponent userId="123" />
\`\`\`

## API
- `FeatureComponent` - Main component
- `featureApi` - API client

## Configuration
Environment variables:
- `FEATURE_API_URL` - API endpoint URL
- `FEATURE_ENABLED` - Enable/disable feature

## Testing
\`\`\`bash
npm run test:e2e -- e2e/tests/feature.spec.ts
\`\`\`
```

### 10.4 Updating Documentation

**When making changes:**
- [ ] Update CLAUDE.md if architecture changes
- [ ] Update component documentation if props change
- [ ] Update README if feature behavior changes
- [ ] Update API documentation if endpoints change
- [ ] Update this SOP if new patterns are introduced

---

## 11. Quick Reference

### 11.2 File Path Quick Reference

```
Pages:                 src/app/*/page.tsx
Layouts:               src/app/*/layout.tsx
API Routes:            src/app/api/*/route.ts
Components:            src/components/ (create as needed)
Utilities:             src/lib/ (create as needed)
Types:                 src/types/ (create as needed)
Documentation:         docs/
Public Assets:         public/
```

### 11.3 Import Path Quick Reference

```typescript
// Next.js imports
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

// Components (using @ alias from tsconfig)
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';

// Utilities
import { formatDate } from '@/lib/utils/date';
import { cn } from '@/lib/utils/className';

// Types
import type { IUser } from '@/types/user';
import type { TUserRole } from '@/types/roles';

// API
import { NextRequest, NextResponse } from 'next/server';
```

### 11.4 Common Patterns Quick Reference

**Server Component:**
```typescript
// Default - can fetch data directly
export default async function Page() {
  const data = await fetchData();
  return <div>{data}</div>;
}
```

**Client Component:**
```typescript
'use client';
import { useState } from 'react';

export function Component({ prop }: Props) {
  const [data, setData] = useState<IDataProp | null>(null);
  return <div>{data?.value}</div>;
}
```

**API Route:**
```typescript
// src/app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const data = await fetchUsers();
  return NextResponse.json({ data });
}
```

**Client-side Data Fetching:**
```typescript
'use client';
import { useEffect, useState } from 'react';

export function DataComponent() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(setData);
  }, []);

  return <div>{data}</div>;
}
```

---

## 12. Troubleshooting

### 12.1 Common Issues & Solutions

#### Issue: ESLint errors

**Solution:**
```bash
# Run linter
npm run lint

# Check TypeScript errors
npx tsc --noEmit

# Fix manually, then retry
git add .
git commit -m "Your message"
```

#### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Check for type errors
npx tsc --noEmit

# Common issues:
# - Missing types: npm install -D @types/[package]
# - Wrong import paths: Check tsconfig.json paths
# - 'use client' missing: Add to components using hooks
```

#### Issue: "Hydration mismatch" errors

**Solution:**
```typescript
// Avoid using browser-only code in Server Components
// Bad:
export default function Page() {
  const width = window.innerWidth; // Error!
  return <div>{width}</div>;
}

// Good:
'use client';
export function ClientComponent() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);
  return <div>{width}</div>;
}
```

### 12.2 Getting Help

**Resources:**
1. **Project Documentation**: [README.md](../README.md)
2. **This SOP**: [docs/coding-sop.md](./coding-sop.md)
3. **Next.js Docs**: Check `node_modules/next/dist/docs/` or https://nextjs.org/docs
4. **Codebase Examples**: Search for similar implementations

---

## Appendix A: Checklist Summary

### Pre-Development Checklist
- [ ] Environment setup verified
- [ ] Documentation reviewed
- [ ] Existing solutions searched
- [ ] Feature architecture understood

### During Development Checklist
- [ ] Using existing common components
- [ ] Following TypeScript standards (Interfaces: `I` prefix, Types: `T` prefix)
- [ ] No `any` types
- [ ] Using hooks correctly
- [ ] Extending BaseApi for API clients
- [ ] Implementing proper error handling
- [ ] Adding test IDs for E2E testing
- [ ] Functions with 3+ params use object destructuring
- [ ] useEffect dependencies are primitives (not objects)
- [ ] No props spreading (`[...items]`, `{...props}`)
- [ ] Accessibility considered (keyboard nav, aria labels)
- [ ] Writing self-documenting code

### Pre-Commit Checklist
- [ ] No console errors in development
- [ ] Component renders correctly
- [ ] Responsive design verified
- [ ] No unused imports or variables

### Pre-MR/PR Checklist
- [ ] `npm run type-check` passes
- [ ] `npm run lint-fix` completes
- [ ] `npm run build` succeeds
- [ ] Manual testing completed
- [ ] Accessibility testing completed
  - [ ] Keyboard navigation verified
  - [ ] Screen reader support tested
  - [ ] Focus indicators visible
  - [ ] Color contrast meets WCAG AA
- [ ] E2E tests added/updated (if applicable)
- [ ] Documentation updated (if needed)
- [ ] No commented-out code
- [ ] No props spreading anti-patterns
- [ ] MR/PR description filled out

### Code Review Checklist
- [ ] Architecture patterns followed
- [ ] TypeScript types properly defined (I/T prefix convention)
- [ ] No performance anti-patterns
  - [ ] No props spreading
  - [ ] useEffect deps are primitives
  - [ ] No inline functions/objects in JSX
- [ ] Error handling comprehensive
- [ ] No security vulnerabilities
- [ ] Accessibility implemented correctly
- [ ] Functions with 3+ params use object destructuring
- [ ] Tests included
- [ ] Documentation updated

---

## Appendix B: VSCode Recommended Settings

Create `.vscode/settings.json` in your project:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "tailwindcss"
  },
  "tailwindCSS.experimental.classRegex": [
    ["cn\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

**Recommended Extensions:**
- ESLint
- Tailwind CSS IntelliSense
- Prettier - Code formatter
- TypeScript and JavaScript Language Features (built-in)

---

## Appendix C: Browser DevTools Tips

**React DevTools:**
- Install React DevTools extension
- Use Profiler to identify slow renders
- Use Components tab to inspect props/state

**Network Tab:**
- Monitor API calls
- Check request/response payloads
- Verify caching behavior

**Performance Tab:**
- Record interactions
- Identify performance bottlenecks
- Check for memory leaks

---

**End of SOP Document**
