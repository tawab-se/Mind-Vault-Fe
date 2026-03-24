# Mind Vault - Frontend

Secure knowledge management system for teams with powerful authentication and role-based access control.

Built with **Next.js 16** (Turbopack), **TypeScript**, and **Tailwind CSS**.

## Features

- 🔐 **Authentication**: Cookie-based auth with server-side middleware protection
- 👥 **User Management**: Invite system with role-based access (Admin/Member)
- 🎨 **Modern UI**: Responsive design with light/dark mode support
- 🔄 **Auto Case Conversion**: Seamless snake_case ↔ camelCase API integration
- 📱 **SSR-Ready**: Server-side rendering with Next.js middleware

## Prerequisites

- **Node.js** 18+ and npm
- **Backend API** running on `http://localhost:8000`

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment** (optional):
```bash
cp .env.example .env.local
```

3. **Run development server**:
```bash
npm run dev
```

4. **Open browser**: [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/              # Next.js pages (App Router)
├── components/       # Reusable components
│   ├── forms/       # Form components
│   ├── guards/      # Auth/Admin guards
│   └── ui/          # UI components
├── hooks/           # Custom React hooks
├── services/        # API services
├── stores/          # Zustand state management
├── types/           # TypeScript definitions
├── middleware.ts    # Route protection
└── utils/           # Utility functions

docs/
├── app-flows.md     # Application flows documentation
└── coding-sop.md    # Coding standards
```

## Key Architecture

### Authentication
- Tokens stored in **HTTP cookies** (not localStorage) for SSR compatibility
- Server-side route protection via Next.js middleware
- Auto-refresh user profile on page load

### API Integration
- Base URL: `http://localhost:8000/api/v1`
- Automatic case conversion (snake_case ↔ camelCase)
- Axios interceptors for auth headers

### State Management
- **Zustand** for auth state
- Triple-layer deduplication for `/auth/me` calls

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npx tsc --noEmit     # TypeScript check
```

## Documentation

- **[Application Flows](./docs/app-flows.md)** - Complete flow documentation
- **[Coding Standards](./docs/coding-sop.md)** - Development guidelines
- **[AI Guidelines](./CLAUDE.md)** - AI-specific development context

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **HTTP Client**: Axios
- **Cookies**: js-cookie

## Code Standards

- ❌ No `any` types (use `unknown`)
- ✅ Interfaces: `I` prefix (IUser, ISignupRequest)
- ✅ Types: `T` prefix (TUserRole, TFormMode)
- ✅ ESLint and TypeScript strict mode

## Contributing

1. Follow [coding standards](./docs/coding-sop.md)
2. Update [app flows](./docs/app-flows.md) for flow changes
3. Ensure all tests pass: `npm run lint && npx tsc --noEmit && npm run build`

## License

[Your License Here]
