# Standard Operating Procedure (SOP) for Coding with Standards
## LinkGraph Customer Frontend

**Version**: 1.1
**Last Updated**: 2025-11-11
**Maintained By**: Development Team
**Changelog**: Added MobX reaction patterns, useEffect best practices, accessibility requirements, and enhanced TypeScript/SCSS guidelines

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

- [ ] Environment variables configured (`.env` file copied from `.env.dev`)
- [ ] Dependencies installed: `make package-install` or `npm install --legacy-peer-deps`
- [ ] Development server starts successfully: `make dev`
- [ ] Git configured with correct user credentials
- [ ] IDE/Editor configured with ESLint and TypeScript support

**Verify your setup:**
```bash
# Check Node version (should be compatible with Next.js 14.2.3)
node -v

# Verify dependencies are installed
ls node_modules

# Start dev server to ensure everything works
make dev
```

### 1.2 Documentation Review Requirements

**Read before coding:**

- [ ] Review [CLAUDE.md](./CLAUDE.md) for project overview and architecture
- [ ] Check relevant feature documentation in `@docs/` directory
- [ ] Review existing components in `src/components/common-components/`
- [ ] Understand store architecture for your feature area
- [ ] Check API documentation for endpoints you'll use

**Key documentation files:**
- `@docs/technical-architecture.md` - System architecture
- `@docs/api-architecture.md` - API patterns
- `@docs/mobx-store-documentation.md` - Store patterns
- `@docs/common-components.md` - Component library
- `@docs/feature-overview.md` - Business features

### 1.3 Codebase Familiarity Guidelines

**Before implementing new functionality:**

1. **Search for existing solutions:**
   ```bash
   # Search for similar components
   find src/components -name "*[keyword]*"

   # Search for similar functionality in code
   grep -r "functionName" src/
   ```

2. **Check common components library:**
   - Browse `src/components/common-components/components/`
   - Review `src/components/common-components/v2/`

3. **Understand the feature's store:**
   - Locate store in `src/store/specialized-stores/`
   - Check if store hooks exist in `src/store/hooks/`

4. **Review API integration:**
   - Check `src/api/` for existing API clients
   - Understand BaseApi patterns in `src/api/base-api.ts`

---

## 2. Development Standards

### 2.1 Code Style & Formatting

#### ESLint Configuration
**Base Rules** (Google ESLint + React + Next.js):

```javascript
// Key rules to follow:
{
  "max-len": ["warn", 350],           // Max 350 characters per line
  "indent": ["error", 2],             // 2 spaces indentation
  "quotes": ["error", "single"],      // Single quotes required
  "semi": "error",                    // Semicolons required
  "no-console": ["warn", {            // Console allowed for debug/warn/error
    "allow": ["debug", "warn", "error"]
  }],
  "no-debugger": "error",             // No debugger statements
  "arrow-parens": ["error", "as-needed"], // Arrow function parens only when needed
  "@typescript-eslint/no-unused-vars": "error"  // No unused variables
}
```

**Quick Style Rules:**
- ✅ Use single quotes: `'hello'`
- ✅ Always use semicolons
- ✅ 2-space indentation
- ✅ Max line length: 350 characters (wrap when exceeded)
- ✅ Console.log allowed for debug/warn/error only
- ❌ No `any` types unless absolutely necessary
- ❌ No unused variables or imports
- ❌ No debugger statements

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

#### SCSS/CSS Standards

**StyleLint Rules** (Nested pattern with state classes):

```scss
// ✅ GOOD: Component-based naming with nesting
.component-name {
  // Component styles

  .element {
    // Nested element styles
  }

  .another-element {
    // Another nested element
  }

  &.is-active {  // State classes with 'is-' or 'has-' prefix
    // Active state
  }

  &.has-error {
    // Error state
  }
}

// Nesting: Max 10 levels (use carefully)
.parent {
  .child {
    .grandchild {
      // Avoid deep nesting when possible
    }
  }
}

// ❌ BAD: Avoid vendor prefixes (PostCSS handles this)
.element {
  -webkit-transform: rotate(45deg);  // Don't do this
  transform: rotate(45deg);          // Do this instead
}
```

**SCSS Variable Usage (CRITICAL):**
```scss
// ✅ GOOD: Use existing variables for colors, spacing, etc.
@import '@/components/common-components/scss/variables';

.component {
  color: $primary-color;           // Use variable
  background: $background-light;    // Use variable
  padding: $spacing-md;            // Use variable
  border-radius: $border-radius;   // Use variable
  font-size: $font-size-base;      // Use variable
}

// ❌ BAD: Hardcoded values
.component {
  color: #0066cc;                  // DON'T hardcode colors!
  background: #f5f5f5;             // DON'T hardcode colors!
  padding: 16px;                   // DON'T hardcode spacing!
  border-radius: 4px;              // DON'T hardcode values!
}

// IMPORTANT: Always check if a variable exists before introducing hardcoded values
// This ensures easier implementation of:
// - Theming systems
// - Dark mode
// - Consistent design system
// - Brand color updates
```

**SCSS Module Pattern:**
```typescript
// Component with SCSS module
import styles from './style.module.scss';

const Component = () => (
  <div className={styles.componentName}>
    <div className={styles.componentName__element}>
      Content
    </div>
  </div>
);
```

### 2.2 Architecture Compliance

#### File Structure Standards

```
src/
├── components/
│   ├── common-components/      # Shared, reusable components
│   │   ├── components/         # Individual components (atoms & molecules)
│   │   ├── v2/                # Version 2 components
│   │   └── scss/              # Shared styles
│   ├── dashboard/             # Feature-specific components (organisms)
│   │   └── [feature]/         # Organized by feature domain
│   └── layoutV2/              # Layout components
├── pages/                     # Next.js file-based routing
├── store/                     # MobX State Tree stores
│   ├── common-store.ts        # Always-loaded stores
│   ├── specialized-stores/    # Lazy-loaded feature stores
│   └── hooks/                 # Store access hooks
├── api/                       # API clients
│   ├── base-api.ts           # Base HTTP client
│   └── [feature]-api.ts      # Feature-specific APIs
└── utils/                     # Shared utility functions
```

#### Naming Conventions

**Files & Folders:**
```
kebab-case for files:       button-component.tsx
kebab-case for folders:     common-components/
Index files:                index.tsx, index.ts
Module styles:              style.module.scss
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

// Store naming
export const ContentOptimizerStore = types.model('ContentOptimizerStore', {});
export type TContentOptimizerStore = Instance<typeof ContentOptimizerStore>;
export const initializeContentOptimizerStore = () => {};

// Hook naming
export function useCAStore() {}
```

### 2.3 Component Architecture Patterns

#### Atomic Design Pattern

**Component Hierarchy:**
1. **Atoms** (`src/components/common-components/components/`):
   - Basic building blocks (Button, Input, Icon, etc.)
   - No business logic, highly reusable
   - Should be used across the entire application

2. **Molecules** (`src/components/common-components/components/`):
   - Combinations of atoms (SearchBar, FormField, etc.)
   - Simple, reusable component groups
   - Composed of 2+ atoms

3. **Organisms** (`src/components/dashboard/[feature]/`):
   - Combinations of 2 or more molecules
   - Feature-specific components with complex business logic
   - May include MobX store integration
   - Examples: Complete forms, data tables with filters, dashboard sections

4. **Pages** (`src/pages/`):
   - Next.js page components
   - Route-level components with layouts

**Decision Tree - When to Create vs. Use Existing:**
```
Need a component?
├─ Is it a basic UI element (button, input, modal)?
│  ├─ YES → Check src/components/common-components/components/ first
│  │         Use existing component if available
│  └─ NO → Continue
├─ Is it feature-specific?
│  ├─ YES → Create in src/components/dashboard/[feature]/
│  └─ NO → Create in src/components/common-components/components/
└─ Does it need to be shared across features?
   ├─ YES → Create in common-components
   └─ NO → Keep in feature folder
```

---

## 3. Quality Gates Workflow

### 3.1 Pre-Commit Hooks (Automatic)

**What happens when you commit:**
```bash
git add .
git commit -m "Your message"

# Husky pre-commit hook runs automatically:
# 1. ESLint on staged JS/TS files (with auto-fix)
# 2. Stylelint on staged CSS/SCSS files (with auto-fix)
# 3. Fixed files are re-added to staging
# 4. Commit proceeds if no errors, blocks if errors exist
```

**If pre-commit hook fails:**
1. Review error messages in terminal
2. Fix issues manually if auto-fix didn't work
3. Re-stage fixed files: `git add .`
4. Retry commit

### 3.2 Manual Quality Checks

**Run before creating MR/PR:**

```bash
# Full quality check suite (RECOMMENDED)
make lint-fix        # ESLint + Stylelint + Type check

# Or run individually:
npm run type-check   # TypeScript type checking (12GB memory allocation)
npm run lint-fix     # ESLint auto-fix
npm run css-lint     # Stylelint for SCSS files
```

**For verbose output:**
```bash
npm run lintVerbose  # See all ESLint warnings and errors
```

### 3.3 Dead Code Detection

**Run periodically to keep codebase clean:**

```bash
# Comprehensive dead code analysis
npm run knip

# Specific analyses
npm run knip-dependencies  # Find unused dependencies
npm run knip-exports      # Find unused exports
npm run find:unused       # Find unused files (next-unused)

# Auto-fix options (use with caution)
npm run knip-fix          # Auto-fix Knip issues
npm run knip-fix-remove   # Auto-fix with file removal (dangerous!)
```

**Review Knip output carefully before auto-fixing!**

### 3.4 Build Verification

**Before finalizing MR/PR:**

```bash
# Production build test
npm run build

# If build succeeds, optionally test locally
npm run build:local
npm run start

# Bundle size analysis (if concerned about performance)
npm run analyze         # Full analysis
npm run analyze:browser # Browser bundle only
npm run analyze:server  # Server bundle only
```

### 3.5 Quality Gate Checklist

**Before every commit:**
- [ ] Pre-commit hooks pass automatically
- [ ] No console errors in development
- [ ] Component renders correctly

**Before every MR/PR:**
- [ ] `npm run type-check` passes with no errors
- [ ] `npm run lint-fix` completes successfully
- [ ] `npm run build` succeeds
- [ ] Manual testing completed (see Section 7.2)
- [ ] Accessibility verified (keyboard nav, screen readers - Section 7.5)
- [ ] No unused imports or variables
- [ ] No commented-out code (clean it up)
- [ ] Responsive design verified (if UI changes)
- [ ] No props spreading anti-patterns (`[...items]`, `{...props}`)
- [ ] useEffect dependencies use primitives, not objects
- [ ] Functions with 3+ params use object destructuring
- [ ] Interfaces use `I` prefix, types use `T` prefix

**Periodically (weekly/sprint):**
- [ ] Run `npm run knip` and review dead code
- [ ] Check bundle size with `npm run analyze`
- [ ] Review and update documentation

---

## 4. Component Development Standards

### 4.1 Component Structure Template

**Functional Component with TypeScript:**

```typescript
// src/components/dashboard/feature/MyComponent.tsx
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from '@/components/common-components/components/button';
import { useCAStore } from '@/store/hooks/useCAStore';
import styles from './style.module.scss';

// Props interface (use 'I' prefix for interfaces)
interface IMyComponentProps {
  title: string;
  userId: string;
  onComplete?: (data: string) => void;
  isVisible?: boolean;
}

// Component implementation
export const MyComponent: React.FC<IMyComponentProps> = observer(({
  title,
  userId,
  onComplete,
  isVisible = true
}) => {
  // Local state
  const [isLoading, setIsLoading] = useState(false);

  // Store access
  const store = useCAStore();
  const { contentOptimizer } = store;

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
      await contentOptimizer.performAction(userId);
      onComplete?.('success');
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

  // Render
  return (
    <div className={styles.myComponent}>
      <h2 className={styles.myComponent__title}>{title}</h2>
      <Button
        type="primary"
        loading={isLoading}
        onClick={handleAction}
      >
        Execute Action
      </Button>
    </div>
  );
});

// Display name for debugging
MyComponent.displayName = 'MyComponent';
```

### 4.2 Component Best Practices

#### ✅ DO:

```typescript
// Use observer wrapper for MobX-connected components
export const Component = observer(() => {
  const store = useCAStore();
  return <div>{store.data}</div>;
});

// Use React.memo for performance optimization (non-MobX components)
export const PureComponent = React.memo<Props>(({ data }) => {
  return <div>{data}</div>;
});

// Define handlers outside JSX
const handleClick = () => {
  // Logic here
};
return <Button onClick={handleClick}>Click</Button>;

// Use proper key props in lists
{items.map(item => (
  <Item key={item.id} data={item} />
))}

// Use optional chaining for safe access
const userName = user?.profile?.name;

// Use nullish coalescing for default values
const count = data?.count ?? 0;

// ✅ GOOD: Use object parameters for 3+ params
interface IGetUserDataParams {
  id: string;
  firstName: string;
  lastName: string;
  isSubscribed: boolean;
}

const getUserData = ({ id, firstName, lastName, isSubscribed }: IGetUserDataParams) => {
  // Implementation
};

// Usage
getUserData({
  id: '123',
  firstName: 'John',
  lastName: 'Doe',
  isSubscribed: true
});

// ✅ GOOD: Pass primitive values as props
<Component userId={user.id} isActive={user.isActive} />

// ✅ GOOD: Pass items without spreading
<Component items={items} />
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

// Don't forget observer wrapper for MobX
const Component = ({ store }) => {  // Missing observer - won't react to changes
  return <div>{store.data}</div>;
};

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

### 4.3 Common Component Usage

**Button:**
```typescript
import { Button } from '@/components/common-components/components/button';

<Button type="primary" onClick={handleClick}>
  Primary Button
</Button>
```

**Modal:**
```typescript
import { Modal } from '@/components/common-components/components/modal';

<Modal
  visible={isVisible}
  onCancel={handleClose}
  title="Modal Title"
>
  Modal Content
</Modal>
```

**Error Boundary:**
```typescript
import { ErrorBoundary } from '@/components/error-boundary';

<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

**NoSsr (Client-only rendering):**
```typescript
import NoSsr from '@mui/material/NoSsr';

<NoSsr>
  <ClientOnlyComponent />
</NoSsr>
```

### 4.4 Styling Best Practices

**SCSS Modules:**
```scss
// style.module.scss
.myComponent {
  padding: 20px;

  &__title {
    font-size: 24px;
    font-weight: bold;
  }

  &__content {
    margin-top: 16px;
  }

  &--highlighted {
    background-color: #fffbea;
  }

  &.is-active {
    border: 2px solid #0066cc;
  }
}
```

**Conditional Classes:**
```typescript
import classNames from 'classnames';
import styles from './style.module.scss';

<div className={classNames(
  styles.myComponent,
  { [styles['myComponent--highlighted']]: isHighlighted },
  { [styles['is-active']]: isActive }
)}>
  Content
</div>
```

---

## 5. State Management Standards

### 5.1 MobX State Tree Architecture

**Store Lazy-Loading Pattern:**
```
Root Store (always loaded)
├── Common Store (always loaded)
│   ├── NavBar
│   ├── Settings
│   ├── Notifications
│   ├── Plans
│   └── Other shared stores
└── Specialized Stores (lazy-loaded by route)
    ├── contentAnalysisTools → /content-* routes
    ├── siteAudit → /site-audit-* routes
    ├── keywordResearch → /research-* routes
    ├── backlinkTools → /backlink-* routes
    └── Other feature stores
```

### 5.2 Store Access Pattern (CRITICAL)

#### ✅ CORRECT: Use Store Hooks

```typescript
// Always use provided hooks
import { useCAStore } from '@/store/hooks/useCAStore';
import { useSAStore } from '@/store/hooks/useSAStore';
import { useCommonStore } from '@/store/hooks/useCommonStore';

const Component = observer(() => {
  // Correct way to access stores
  const caStore = useCAStore();
  const saStore = useSAStore();
  const commonStore = useCommonStore();

  const { contentOptimizer } = caStore;
  const { siteAuditor } = saStore;
  const { navBar } = commonStore;

  return <div>{/* Use store data */}</div>;
});
```

#### ❌ INCORRECT: Direct Store Access

```typescript
// NEVER do this - Direct store access
import { getStore } from '@/store/root-storeV2';

const Component = () => {
  const store = getStore().contentAnalysisTools;  // BAD!
  return <div>{store.data}</div>;
};

// NEVER do this - Manual store initialization
const store = getStore();
store.attachStore('feature', initializeFeatureStore());  // BAD!
```

### 5.3 MobX Reactions & useEffect Best Practices (CRITICAL)

#### ✅ CORRECT: Use MobX reaction for fine-grained reactivity

```typescript
import { reaction } from 'mobx';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

const Component = observer(() => {
  const store = useCAStore();

  // ✅ GOOD: Use MobX reaction for store-based side effects
  useEffect(() => {
    // React to specific store property changes
    const dispose = reaction(
      () => store.selectedId,  // Track specific property
      (selectedId) => {
        if (selectedId) {
          console.log('Selected ID changed:', selectedId);
          // Perform side effect
        }
      }
    );

    return () => dispose();  // Cleanup
  }, [store]);

  // ✅ GOOD: Use primitive dependencies in useEffect
  useEffect(() => {
    fetchData(store.userId);
  }, [store.userId]);  // Primitive value - GOOD!

  return <div>{store.data}</div>;
});
```

#### ❌ INCORRECT: Anti-patterns to avoid

```typescript
const Component = observer(() => {
  const store = useCAStore();

  // ❌ CRITICAL: Never serialize full store objects
  useEffect(() => {
    console.log('Store changed');
  }, [JSON.stringify(toJS(store))]);  // BAD! Heavy serialization, memory issues

  // ❌ BAD: Full object as dependency
  useEffect(() => {
    fetchData(user);
  }, [user]);  // BAD! Full object causes unnecessary re-runs

  // ✅ GOOD: Use primitive properties instead
  useEffect(() => {
    fetchData(user);
  }, [user.id]);  // GOOD! Primitive dependency

  // ❌ BAD: Multiple object properties
  useEffect(() => {
    processData();
  }, [config]);  // BAD! Full config object

  // ✅ GOOD: Destructure specific primitives
  const { isEnabled, maxCount } = config;
  useEffect(() => {
    processData();
  }, [isEnabled, maxCount]);  // GOOD! Primitive dependencies

  return <div>{store.data}</div>;
});
```

**Key Rules for useEffect Dependencies:**

1. **99% of cases: Use primitives** (boolean, number, string)
   - ✅ `[user.id, isActive, count]`
   - ❌ `[user, config, data]`

2. **Never use `JSON.stringify(toJS(store))`**
   - Causes performance issues
   - Memory heap problems
   - Heavy object serialization

3. **Use MobX `reaction` for store reactivity**
   - More efficient than useEffect for store changes
   - Fine-grained control over what triggers effects
   - Better performance and memory usage

4. **If you must use objects, use React hooks:**
   ```typescript
   // For object dependencies, use useMemo/useCallback
   const memoizedValue = useMemo(() => ({ ...config }), [config.key1, config.key2]);
   ```

### 5.4 Store Implementation Pattern

**Store Structure:**
```typescript
// src/store/specialized-stores/feature-store.ts
import { types, flow, Instance } from 'mobx-state-tree';
import { FeatureApi } from '@/api/feature-api';

const featureApi = new FeatureApi();

// Models
export const FeatureDataModel = types.model('FeatureDataModel', {
  id: types.string,
  name: types.string,
  value: types.number,
  createdAt: types.maybeNull(types.string)
});

// Store
export const FeatureStore = types
  .model('FeatureStore', {
    data: types.array(FeatureDataModel),
    isLoading: false,
    error: types.maybeNull(types.string),
    selectedId: types.maybeNull(types.string)
  })
  .views(self => ({
    // Computed values
    get selectedItem() {
      return self.data.find(item => item.id === self.selectedId);
    },

    get dataCount() {
      return self.data.length;
    },

    // Derived state
    get hasData() {
      return self.data.length > 0;
    }
  }))
  .actions(self => ({
    // Synchronous actions
    setSelectedId(id: string | null) {
      self.selectedId = id;
    },

    reset() {
      self.data.clear();
      self.isLoading = false;
      self.error = null;
      self.selectedId = null;
    },

    // Asynchronous actions (use flow)
    fetchData: flow(function* (params: { userId: string }) {
      self.isLoading = true;
      self.error = null;

      try {
        const response = yield featureApi.getData(params);
        self.data = response.data;
      } catch (error) {
        self.error = error.message || 'Failed to fetch data';
        console.error('FeatureStore.fetchData error:', error);
      } finally {
        self.isLoading = false;
      }
    }),

    createItem: flow(function* (itemData: { name: string; value: number }) {
      try {
        const response = yield featureApi.createItem(itemData);
        self.data.push(response.data);
        return response.data;
      } catch (error) {
        self.error = error.message || 'Failed to create item';
        console.error('FeatureStore.createItem error:', error);
        throw error;
      }
    }),

    updateItem: flow(function* (id: string, updates: Partial<{ name: string; value: number }>) {
      try {
        const response = yield featureApi.updateItem(id, updates);
        const index = self.data.findIndex(item => item.id === id);
        if (index !== -1) {
          self.data[index] = response.data;
        }
        return response.data;
      } catch (error) {
        self.error = error.message || 'Failed to update item';
        console.error('FeatureStore.updateItem error:', error);
        throw error;
      }
    }),

    deleteItem: flow(function* (id: string) {
      try {
        yield featureApi.deleteItem(id);
        const index = self.data.findIndex(item => item.id === id);
        if (index !== -1) {
          self.data.splice(index, 1);
        }
      } catch (error) {
        self.error = error.message || 'Failed to delete item';
        console.error('FeatureStore.deleteItem error:', error);
        throw error;
      }
    })
  }));

// Type exports
export type FeatureStoreType = Instance<typeof FeatureStore>;

// Store initialization
export const initializeFeatureStore = (): FeatureStoreType => {
  return FeatureStore.create({
    data: [],
    isLoading: false,
    error: null,
    selectedId: null
  });
};
```

**Store Hook:**
```typescript
// src/store/hooks/useFeatureStore.ts
import { getStore } from '@/store/root-storeV2';
import { initializeFeatureStore, FeatureStoreType } from '@/store/specialized-stores/feature-store';

export function useFeatureStore(): FeatureStoreType {
  const store = getStore();

  if (!store.featureTools) {
    store.attachStore('featureTools', initializeFeatureStore());
  }

  return store.featureTools as FeatureStoreType;
}
```

### 5.4 Store Best Practices

#### ✅ DO:

```typescript
// Use flow for async operations
fetchData: flow(function* (params) {
  try {
    const response = yield api.getData(params);
    self.data = response.data;
  } catch (error) {
    self.error = error.message;
  }
})

// Use views for computed values
.views(self => ({
  get filteredData() {
    return self.data.filter(item => item.isActive);
  }
}))

// Handle errors properly
try {
  yield api.call();
} catch (error) {
  self.error = error.message || 'Operation failed';
  console.error('Store action error:', error);
}

// Use maybeNull for nullable values
error: types.maybeNull(types.string)
```

#### ❌ DON'T:

```typescript
// Don't use async/await (use flow instead)
async fetchData() {  // BAD - won't work properly with MobX State Tree
  const data = await api.getData();
  self.data = data;
}

// Don't mutate state outside actions
const store = useFeatureStore();
store.data.push(newItem);  // BAD - must be in action

// Don't forget error handling
fetchData: flow(function* () {
  const data = yield api.getData();  // BAD - no try/catch
  self.data = data;
})

// Don't use undefined (use maybeNull)
error: types.maybe(types.string)  // BAD - use maybeNull
```

---

## 6. API Integration Standards

### 6.1 BaseApi Extension Pattern

**API Client Structure:**
```typescript
// src/api/feature-api.ts
import { BaseApi } from '@/api/base-api';
import { getApiUrl } from '@/api/common-utils';

// Request/Response interfaces
export interface FeatureGetParams {
  userId: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export interface FeatureDataResponse {
  data: Array<{
    id: string;
    name: string;
    value: number;
    createdAt: string;
  }>;
  total: number;
  page: number;
}

export interface FeatureCreateRequest {
  name: string;
  value: number;
  metadata?: Record<string, any>;
}

export interface FeatureUpdateRequest {
  name?: string;
  value?: number;
  metadata?: Record<string, any>;
}

// API Client
export class FeatureApi extends BaseApi {
  constructor() {
    // Use appropriate host from environment
    super(getApiUrl(BaseApi.LG_HOST));  // or CA_HOST, SA_HOST, etc.
  }

  /**
   * Get feature data
   */
  async getData(params: FeatureGetParams): Promise<FeatureDataResponse> {
    return this.get('/api/feature/data/', params);
  }

  /**
   * Create new item
   */
  async createItem(data: FeatureCreateRequest): Promise<{ data: any }> {
    return this.post('/api/feature/items/', data);
  }

  /**
   * Update existing item
   */
  async updateItem(id: string, data: FeatureUpdateRequest): Promise<{ data: any }> {
    return this.put(`/api/feature/items/${id}/`, data);
  }

  /**
   * Delete item
   */
  async deleteItem(id: string): Promise<void> {
    return this.delete(`/api/feature/items/${id}/`);
  }

  /**
   * Batch operation example
   */
  async batchUpdate(ids: string[], updates: FeatureUpdateRequest): Promise<{ updated: number }> {
    return this.post('/api/feature/batch-update/', {
      ids,
      updates
    });
  }
}

// Export singleton instance
export const featureApi = new FeatureApi();
```

### 6.2 API Host Configuration

**Available Hosts:**
```typescript
// From src/api/common-utils.ts
BaseApi.LG_HOST              // Primary LinkGraph API
BaseApi.GSC_HOST             // Google Search Console
BaseApi.KW_HOST              // Keyword Research
BaseApi.BL_HOST              // Backlink Analysis
BaseApi.CA_HOST              // Content Assistant
BaseApi.SA_HOST              // Site Auditor
BaseApi.OTTO_PPC_HOST        // PPC Automation
BaseApi.APP_HEALTH_CHECK_HOST // Health Monitoring
```

**Choosing the right host:**
```typescript
// Content-related features → CA_HOST
export class ContentApi extends BaseApi {
  constructor() {
    super(getApiUrl(BaseApi.CA_HOST));
  }
}

// Site audit features → SA_HOST
export class AuditApi extends BaseApi {
  constructor() {
    super(getApiUrl(BaseApi.SA_HOST));
  }
}

// General features → LG_HOST
export class GeneralApi extends BaseApi {
  constructor() {
    super(getApiUrl(BaseApi.LG_HOST));
  }
}
```

### 6.3 Error Handling

**BaseApi handles these automatically:**
- Authentication (JWT token injection)
- Request/response transformation (snake_case ↔ camelCase)
- Request cancellation for duplicates
- OpenTelemetry tracing

**Manual error handling in stores:**
```typescript
fetchData: flow(function* (params) {
  self.isLoading = true;
  self.error = null;

  try {
    const response = yield featureApi.getData(params);
    self.data = response.data;
    return response;
  } catch (error) {
    // Error is already processed by BaseApi
    const errorMessage = error.message || 'Failed to fetch data';
    self.error = errorMessage;
    console.error('FeatureStore.fetchData error:', error);

    // Optionally show notification
    // notification.error({ message: 'Error', description: errorMessage });

    throw error;  // Re-throw if caller needs to handle
  } finally {
    self.isLoading = false;
  }
})
```

### 6.4 API Best Practices

#### ✅ DO:

```typescript
// Always extend BaseApi
export class MyApi extends BaseApi {
  constructor() {
    super(getApiUrl(BaseApi.LG_HOST));
  }
}

// Use proper TypeScript interfaces for requests/responses
async getData(params: GetParams): Promise<DataResponse> {
  return this.get('/api/endpoint/', params);
}

// Handle errors in stores, not API layer
// (BaseApi handles common errors automatically)

// Use descriptive method names
async getUserProfile(userId: string): Promise<UserProfile> {}
async updateUserSettings(userId: string, settings: Settings): Promise<void> {}

// Document complex endpoints
/**
 * Retrieves paginated user activity logs
 * @param userId - The user's unique identifier
 * @param options - Pagination and filter options
 * @returns Paginated activity log response
 */
async getUserActivityLogs(userId: string, options: PaginationOptions): Promise<PaginatedResponse> {}
```

#### ❌ DON'T:

```typescript
// Don't create raw axios instances
import axios from 'axios';
const api = axios.create({ baseURL: 'https://api.example.com' });  // BAD

// Don't ignore error handling
async getData() {
  return this.get('/api/endpoint/');  // No error handling - risky
}

// Don't use any types
async getData(params: any): Promise<any> {  // BAD - use proper types
  return this.get('/api/endpoint/', params);
}

// Don't forget to return promises
async createUser(data: UserData) {
  this.post('/api/users/', data);  // Missing return!
}
```

---

## 7. Testing Requirements

### 7.1 E2E Testing with Playwright

**Test File Location:**
```
/e2e/
├── tests/
│   ├── feature.spec.ts
│   └── other-feature.spec.ts
├── auth/
│   └── storage.json
└── playwright.config.ts
```

**Writing E2E Tests:**
```typescript
// e2e/tests/my-feature.spec.ts
import { test, expect } from '@playwright/test';

test.describe('My Feature', () => {
  test.beforeEach(async ({ page }) => {
    // Setup - navigate to feature page
    await page.goto('/my-feature');
    await page.waitForLoadState('networkidle');
  });

  test('should display feature data correctly', async ({ page }) => {
    // Arrange - wait for data to load
    await page.waitForSelector('[data-testid="feature-container"]');

    // Act - interact with feature
    await page.click('[data-testid="load-button"]');
    await page.waitForSelector('[data-testid="data-item"]');

    // Assert - verify expected outcome
    const items = await page.locator('[data-testid="data-item"]').count();
    expect(items).toBeGreaterThan(0);

    const title = await page.textContent('[data-testid="feature-title"]');
    expect(title).toContain('Expected Title');
  });

  test('should handle errors gracefully', async ({ page }) => {
    // Simulate error condition
    await page.route('**/api/feature/**', route => {
      route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.click('[data-testid="load-button"]');
    await page.waitForSelector('[data-testid="error-message"]');

    const errorText = await page.textContent('[data-testid="error-message"]');
    expect(errorText).toContain('error');
  });
});
```

**Running Tests:**
```bash
# Run all E2E tests
npm run test:e2e

# Run specific test file
npm run test:e2e -- e2e/tests/my-feature.spec.ts

# Run with UI (interactive mode)
npm run test:e2e:ui

# Run in debug mode
npm run test:e2e:debug

# Run with specific browser
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox
npm run test:e2e -- --project=webkit
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

**Using Test Accounts:**
```typescript
// .env.e2e
TEST_USER_EMAIL=test@example.com
TEST_USER_PASSWORD=testpassword123
TEST_API_BASE_URL=https://staging.api.example.com
```

**Authentication Setup:**
```bash
# Set up authentication for E2E tests
npm run test:e2e:auth
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

#### Screen Reader Support

**Use sr-only (screen reader only) classes for hidden but accessible content:**

```scss
// SCSS utility class (should already exist in common styles)
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: inherit;
  margin: inherit;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

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

### 8.1 Branch Strategy

**Branch Hierarchy:**
```
master (production)
├── staging (pre-production)
    └── develop (active development)
        ├── feature/[issue-number]-[description]
        ├── fix/[issue-number]-[description]
        └── refactor/[issue-number]-[description]
```

**Branch Naming Convention:**
```bash
# Feature branches
feature/12345-add-user-dashboard
feature/12346-implement-search-functionality

# Bug fix branches
fix/12347-resolve-login-error
fix/12348-correct-data-display-issue

# Refactoring branches
refactor/12349-update-store-architecture
refactor/12350-simplify-api-client

# Hotfix branches (for production)
hotfix/12351-critical-security-patch
```

### 8.2 Creating a Feature Branch

```bash
# 1. Ensure you're on develop branch
git checkout develop

# 2. Pull latest changes
git pull origin develop

# 3. Create feature branch
git checkout -b feature/12345-my-feature-description

# 4. Work on your feature
# ... make changes ...

# 5. Commit changes (pre-commit hooks will run)
git add .
git commit -m "Add user dashboard with analytics"

# 6. Push branch to remote
git push -u origin feature/12345-my-feature-description
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

#### 8.3.1 Commitlint (Optional Recommendation)

**For enforcing uniform commit messages across all developers:**

Commitlint can be added to ensure consistent commit message format. This is **optional but recommended** for larger teams.

**Setup (if team decides to implement):**

```bash
# Install commitlint
npm install --save-dev @commitlint/{config-conventional,cli}

# Create commitlint config
echo "module.exports = {extends: ['@commitlint/config-conventional']}" > commitlint.config.js

# Add to package.json scripts
{
  "scripts": {
    "commitlint": "commitlint --edit"
  }
}

# Add to Husky (if using)
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit ${1}'
```

**Benefits:**
- Enforces consistent commit message format
- Prevents malformed commits
- Easier to generate changelogs
- Better Git history readability

**Considerations:**
- May be overkill for small teams
- Adds slight overhead to commit process
- Requires team buy-in and training

**Decision:** Discuss with team before implementing. Current pre-commit hooks may be sufficient for code quality without commitlint.

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

3. **Create MR in GitLab:**
   - Navigate to GitLab repository
   - Click "Merge Requests" → "New merge request"
   - Source: `feature/12345-my-feature`
   - Target: `develop`
   - Fill out MR template (see below)

**MR Template:**
```markdown
## Description
Brief description of what this MR accomplishes.

## Related Issue
Closes #12345

## Changes Made
- Added user analytics dashboard
- Implemented chart visualizations with ECharts
- Created new API client for analytics data
- Added E2E tests for dashboard functionality

## Screenshots (if applicable)
[Add screenshots here]

## Testing
- [ ] Manual testing completed
- [ ] E2E tests added/updated
- [ ] Tested on Chrome, Firefox, Safari
- [ ] Tested responsive design
- [ ] No console errors

## Quality Gates
- [ ] `npm run type-check` passes
- [ ] `npm run lint-fix` completes successfully
- [ ] `npm run build` succeeds
- [ ] No new warnings or errors introduced

## Checklist
- [ ] Code follows project standards (see CODING_SOP.md)
- [ ] Documentation updated (if needed)
- [ ] No commented-out code
- [ ] No console.log statements (except debug/warn/error)
- [ ] Responsive design verified
- [ ] Accessible (keyboard navigation, screen readers)
```

### 8.5 Code Review Guidelines

**For Reviewers:**
- [ ] Code follows architecture patterns
- [ ] TypeScript types are properly defined
- [ ] MobX stores use proper patterns (hooks, flow, etc.)
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

### 8.6 Release Process

**Staging Release:**
```bash
# Run staging release script
./.gitlab/staging-release-mr.sh <username> <token> [version]

# Example
./.gitlab/staging-release-mr.sh john.doe mytoken123 1.2.0
```

**Production Release:**
```bash
# Run production release script
./.gitlab/prod-release-mr.sh <token> [version]

# Example
./.gitlab/prod-release-mr.sh mytoken123 1.2.0
```

**Release Notes Format:**
```markdown
### Changelog:
* Bugfix: Resolve login redirect loop (#12348)
* Improvement: Optimize chart rendering performance (#12352)
* Feature: Add user analytics dashboard (#12345)

### Version: 1.2.0
```

---

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

**Lazy Load Stores:**
```typescript
// Stores are automatically lazy-loaded via hooks
// Just use the hook - it handles initialization
const store = useCAStore();  // Loads store only when needed
```

### 9.2 Image Optimization

**Use Next.js Image Component:**
```typescript
import Image from 'next/image';

// Optimized image loading
<Image
  src="/images/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority  // For above-the-fold images
  placeholder="blur"
  blurDataURL="/images/hero-blur.jpg"
/>

// Responsive images
<Image
  src="/images/product.jpg"
  alt="Product"
  layout="responsive"
  width={16}
  height={9}
/>
```

### 9.3 Bundle Size Monitoring

**Analyze Bundle Size:**
```bash
# Full analysis (server + browser)
npm run analyze

# Browser bundle only
npm run analyze:browser

# Server bundle only
npm run analyze:server
```

**Review Generated Reports:**
- `.next/analyze/client.html` - Browser bundle analysis
- `.next/analyze/server.html` - Server bundle analysis

**Actions if bundle is too large:**
1. Check for large dependencies
2. Implement dynamic imports for heavy components
3. Remove unused dependencies: `npm run knip-dependencies`
4. Split large files into smaller modules
5. Use tree-shaking friendly imports:
   ```typescript
   // ✅ GOOD: Tree-shakeable
   import { Button } from 'antd';

   // ❌ BAD: Imports entire library
   import * as antd from 'antd';
   ```

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

**MobX Performance:**
```typescript
// Use observer for fine-grained reactivity
export const Component = observer(() => {
  const store = useCAStore();
  // Only re-renders when accessed store properties change
  return <div>{store.specificProperty}</div>;
});

// Use computed values (views) for derived state
.views(self => ({
  get expensiveComputation() {
    // Cached until dependencies change
    return self.data.filter(item => item.isActive).length;
  }
}))
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
- OpenTelemetry integration configured
- Check Sentry dashboard for slow transactions

**Performance Budget:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.8s
- Total Bundle Size: < 500KB (gzipped)

---

## 10. Documentation Requirements

### 10.1 Code Documentation

**Component Documentation:**
```typescript
/**
 * UserDashboard displays user analytics with interactive charts.
 *
 * Features:
 * - Real-time data updates
 * - Interactive chart filtering
 * - Export to CSV/PDF
 *
 * @example
 * ```tsx
 * <UserDashboard userId="123" />
 * ```
 */
interface UserDashboardProps {
  /** User's unique identifier */
  userId: string;
  /** Optional date range for analytics */
  dateRange?: { start: Date; end: Date };
  /** Callback when export is triggered */
  onExport?: (format: 'csv' | 'pdf') => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  userId,
  dateRange,
  onExport
}) => {
  // Implementation
};
```

**Function Documentation:**
```typescript
/**
 * Fetches user analytics data from the API.
 *
 * @param userId - The user's unique identifier
 * @param options - Optional filtering and pagination options
 * @param options.startDate - Start date for analytics range
 * @param options.endDate - End date for analytics range
 * @param options.limit - Maximum number of results (default: 100)
 * @returns Promise resolving to analytics data
 * @throws {ApiError} If API request fails
 *
 * @example
 * ```typescript
 * const data = await getUserAnalytics('123', {
 *   startDate: '2024-01-01',
 *   endDate: '2024-01-31',
 *   limit: 50
 * });
 * ```
 */
export async function getUserAnalytics(
  userId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }
): Promise<AnalyticsData> {
  // Implementation
}
```

**Store Documentation:**
```typescript
/**
 * ContentOptimizerStore manages content analysis and optimization state.
 *
 * Features:
 * - Content analysis with AI
 * - SEO recommendations
 * - Readability scoring
 * - Keyword optimization
 *
 * @example
 * ```typescript
 * const store = useCAStore();
 * const { contentOptimizer } = store;
 *
 * await contentOptimizer.analyzeContent({
 *   text: 'Content to analyze',
 *   targetKeywords: ['seo', 'optimization']
 * });
 * ```
 */
export const ContentOptimizerStore = types
  .model('ContentOptimizerStore', {
    // ...
  });
```

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
├── stores/
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
- `useFeatureStore()` - Store access hook
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

### 11.1 Common Commands Cheatsheet

```bash
# Development
make dev                    # Start dev server
make package-install        # Install dependencies

# Quality Checks
make lint-fix               # Full linting (ESLint + Stylelint + Type check)
npm run type-check          # TypeScript only
npm run lint                # ESLint only
npm run css-lint            # Stylelint only

# Code Analysis
npm run knip                # Dead code detection
npm run find:unused         # Unused files
npm run analyze             # Bundle analysis

# Building
npm run build               # Production build
npm run build:local         # Local build

# Testing
npm run test:e2e            # E2E tests
npm run test:e2e:ui         # E2E UI mode
npm run test:e2e:debug      # E2E debug mode

# Git
git checkout develop        # Switch to develop
git pull origin develop     # Pull latest
git checkout -b feature/123-name  # Create feature branch
git add .                   # Stage changes
git commit -m "message"     # Commit (hooks run)
git push -u origin feature/123-name  # Push branch
```

### 11.2 File Path Quick Reference

```
Common Components:     src/components/common-components/components/
Dashboard Components:  src/components/dashboard/
Pages:                 src/pages/
Stores:                src/store/specialized-stores/
Store Hooks:           src/store/hooks/
API Clients:           src/api/
Utils:                 src/utils/
E2E Tests:             e2e/tests/
Documentation:         @docs/
```

### 11.3 Import Path Quick Reference

```typescript
// Components
import { Button } from '@/components/common-components/components/button';
import { Modal } from '@/components/common-components/components/modal';

// Stores
import { useCAStore } from '@/store/hooks/useCAStore';
import { useCommonStore } from '@/store/hooks/useCommonStore';

// API
import { BaseApi } from '@/api/base-api';
import { getApiUrl } from '@/api/common-utils';

// Utils
import { getLocalStorageItem } from '@/utils/safe-localStorage';
import { formatDate } from '@/utils/date-utils';

// Types
import type { UserModel } from '@/types/user';

// Styles
import styles from './style.module.scss';
```

### 11.4 Common Patterns Quick Reference

**Component:**
```typescript
export const Component: React.FC<Props> = observer(({ prop }) => {
  const store = useCAStore();
  return <div>{store.data}</div>;
});
```

**Store Action:**
```typescript
fetchData: flow(function* (params) {
  self.isLoading = true;
  try {
    const response = yield api.getData(params);
    self.data = response.data;
  } catch (error) {
    self.error = error.message;
  } finally {
    self.isLoading = false;
  }
})
```

**API Client:**
```typescript
export class FeatureApi extends BaseApi {
  constructor() {
    super(getApiUrl(BaseApi.LG_HOST));
  }
  async getData(params: Params): Promise<Response> {
    return this.get('/api/endpoint/', params);
  }
}
```

---

## 12. Troubleshooting

### 12.1 Common Issues & Solutions

#### Issue: Pre-commit hook fails with ESLint errors

**Solution:**
```bash
# Run lint-fix to auto-fix issues
npm run lint-fix

# Check remaining errors
npm run lintVerbose

# Fix manually if needed, then retry commit
git add .
git commit -m "Your message"
```

#### Issue: TypeScript errors during build

**Solution:**
```bash
# Run type check to see all errors
npm run type-check

# Common fixes:
# - Add missing types/interfaces
# - Fix any type assertions
# - Add proper null checks
# - Update tsconfig.json if needed
```

#### Issue: Store not loading / undefined store error

**Solution:**
```typescript
// ❌ WRONG: Direct access
const store = getStore().contentAnalysisTools;  // May be undefined

// ✅ CORRECT: Use hook
const store = useCAStore();  // Ensures store is initialized
```

#### Issue: Component not re-rendering with MobX state changes

**Solution:**
```typescript
// ❌ WRONG: Missing observer
const Component = () => {
  const store = useCAStore();
  return <div>{store.data}</div>;  // Won't react to changes
};

// ✅ CORRECT: With observer
const Component = observer(() => {
  const store = useCAStore();
  return <div>{store.data}</div>;  // Reacts to changes
});
```

#### Issue: API calls failing with 401 Unauthorized

**Solution:**
```bash
# Check if token is valid
# Token is automatically managed by BaseApi
# If issue persists:
# 1. Clear localStorage
# 2. Log out and log back in
# 3. Check .env file for correct API hosts
```

#### Issue: Bundle size too large

**Solution:**
```bash
# Analyze bundle
npm run analyze:browser

# Find large dependencies and consider:
# 1. Dynamic imports for large components
# 2. Remove unused dependencies: npm run knip-dependencies
# 3. Use tree-shakeable imports
# 4. Split large components into smaller ones
```

#### Issue: Memory leak in component

**Solution:**
```typescript
// ✅ Clean up effects
useEffect(() => {
  const subscription = store.subscribe();
  const timer = setTimeout(() => {}, 1000);

  return () => {
    subscription.unsubscribe();
    clearTimeout(timer);
  };
}, []);

// ✅ Cancel API requests
useEffect(() => {
  const controller = new AbortController();
  api.getData({ signal: controller.signal });

  return () => controller.abort();
}, []);
```

#### Issue: Styles not applying / CSS specificity issues

**Solution:**
```scss
// Use BEM methodology to avoid specificity wars
.component {
  &__element {
    // Styles here
  }
}

// Don't nest too deeply (max 10 levels)
// Use CSS modules to avoid global conflicts
```

### 12.2 Getting Help

**Resources:**
1. **Project Documentation**: [CLAUDE.md](./CLAUDE.md)
2. **Technical Docs**: `@docs/` directory
3. **Codebase Examples**: Search for similar implementations
4. **Team Members**: Ask experienced developers
5. **Git History**: Check how similar issues were resolved

**Before Asking for Help:**
- [ ] Read relevant documentation
- [ ] Search codebase for similar patterns
- [ ] Check git history for related changes
- [ ] Try debugging with console.log / React DevTools
- [ ] Review error messages carefully

**When Asking for Help:**
- Provide context (what you're trying to do)
- Share error messages (full stack trace)
- Show code snippets (relevant parts)
- Explain what you've already tried
- Include screenshots if UI-related

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
- [ ] No `any` types unless absolutely necessary
- [ ] Using store hooks correctly (never direct store access)
- [ ] Extending BaseApi for API clients
- [ ] Implementing proper error handling
- [ ] Adding test IDs for E2E testing
- [ ] Functions with 3+ params use object destructuring
- [ ] useEffect dependencies are primitives (not objects)
- [ ] No props spreading (`[...items]`, `{...props}`)
- [ ] Using MobX `reaction` for store-based side effects
- [ ] SCSS variables used (no hardcoded colors/spacing)
- [ ] Accessibility considered (keyboard nav, aria labels)
- [ ] Writing self-documenting code

### Pre-Commit Checklist
- [ ] Pre-commit hooks pass
- [ ] No console errors in development
- [ ] Component renders correctly
- [ ] Responsive design verified
- [ ] No unused imports or variables

### Pre-MR/PR Checklist
- [ ] `npm run type-check` passes
- [ ] `npm run lint-fix` completes
- [ ] `npm run build` succeeds
- [ ] Manual testing completed (Section 7.2)
- [ ] Accessibility testing completed (Section 7.5)
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
  - [ ] MobX reactions used appropriately
- [ ] Error handling comprehensive
- [ ] No security vulnerabilities
- [ ] Accessibility implemented correctly
- [ ] SCSS variables used (no hardcoded values)
- [ ] Functions with 3+ params use object destructuring
- [ ] Tests included
- [ ] Documentation updated

---

## Appendix B: VSCode Recommended Settings

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.fixAll.stylelint": true
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
    "*.css": "scss"
  }
}
```

---

## Appendix C: Browser DevTools Tips

**React DevTools:**
- Install React DevTools extension
- Use Profiler to identify slow renders
- Use Components tab to inspect props/state

**Redux DevTools (for MobX):**
- Install MobX DevTools extension
- Monitor store state changes
- Time-travel debugging

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

For questions, clarifications, or updates to this SOP, please contact the development team or create an issue in the repository.
