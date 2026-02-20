# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Environment Setup
- **Required Node.js version**: 22.0.0 (managed via `.nvmrc`)
- **Version management**: Run `nvm use` to switch to the correct Node.js version
- **Environment files**: Copy `.env.development` and `.env.production` from Google Drive (link in README.md)
- **Dependencies**: `npm install`

### Development
- **Start dev server**: `npm run dev` (runs on http://localhost:3000)
- **Build production**: `npm run build`
- **Start production**: `npm run start`

### Code Quality
- **Lint code**: `npm run lint` (uses Google TypeScript Style - GTS)
- **Fix lint issues**: `npm run fix`
- **Format code**: `npm run prettier`
- **Type checking**: `npm run compile`

### Testing
- **E2E tests**: `npx playwright test` (Playwright with Chrome, Firefox, Edge)
- **Test setup**: Tests use authenticated state from `e2e/.auth/user.json`

### Component Development
- **Storybook dev**: `npm run storybook` (runs on http://localhost:6006)
- **Build Storybook**: `npm run build-storybook`
- **Test Storybook**: `npm run test-storybook`

## Architecture Overview

### Framework & Tech Stack
- **Next.js 14.2.25** with App Router pattern
- **TypeScript** with strict configuration
- **Tailwind CSS 4.0** + **Radix UI** components
- **NextAuth.js 5.0** for authentication
- **Zustand** for global state management
- **Konva.js + React-Konva** for 2D canvas drawing
- **PDF.js** for PDF handling, **Forge Viewer** for CAD files

### App Router Structure
```
app/
├── (Admin)/          # Admin-only routes (/admin/*)
├── (Authed)/         # Authenticated routes (/projects/*, /organizations/*, etc.)
└── api/              # API routes (REST endpoints)
```

### Component Architecture
```
components/
├── ui/
│   ├── base/         # Shadcn/ui components (Button, Input, etc.)
│   ├── custom/       # Project-specific components (Dialog, SearchInput, etc.)
│   └── icons/        # Lucide-based icon system
├── pages/            # Page-specific components organized by feature
├── layouts/          # Header, Sidebar, navigation components
└── commons/          # Shared utility components
```

### State Management
- **Zustand stores** in `/stores/` directory (16+ domain-specific stores)
- **Key stores**: `projectFolderStore`, `annotationStore`, `organizationStore`
- **Authentication**: NextAuth.js with JWT sessions and role-based access

### Services Layer
```
services/
├── fetchWrapperService.ts    # Base HTTP client with error handling
├── [domain]Service.ts        # Feature-specific API services
├── annotation/               # Drawing and annotation APIs
├── organization/             # Multi-tenant organization management
└── macro/                    # Automated analysis workflows
```

## Key Features

### Document Management System
- File upload with chunking support (`/api/projects/[uuid]/files/chunk/`)
- Folder hierarchy with drag-and-drop
- Version control and file comparison
- Trash/restore functionality

### Drawing & Annotation System
- Canvas-based drawing using Konva.js
- Multiple drawing tools: rectangle, line, text, sticky notes
- Real-time collaboration features
- PDF and CAD file visualization with Forge Viewer

### Multi-tenancy
- Organization-based access control
- User invitation system with role management
- Admin panel for user management

### Macro/Automation Tools
- Construction industry-specific analysis workflows
- Step-based processing with loading states
- Job polling for long-running operations

## Development Guidelines

### Code Organization
- **Feature-first structure**: Group related components, services, types by domain
- **Page components**: Located in `components/pages/[feature]/`
- **Shared utilities**: Use existing patterns in `/utils/` and `/lib/`

### UI Components
- **Base components**: Use Shadcn/ui components from `components/ui/base/`
- **Custom components**: Extend base components in `components/ui/custom/`
- **Add new Shadcn components**: `npx shadcn-ui@latest add {component-name}`

### Type Safety
- **API types**: Organized in `/types/` by domain
- **Zod validation**: Used for API request/response validation
- **Request/Response types**: Separate files for API contracts

### State Management
- **Zustand**: For complex state that needs persistence or sharing across components
- **Local state**: Use React hooks for component-specific state
- **Form state**: Use React Hook Form with Zod validation

### API Development
- **REST pattern**: Organized by resource (`/api/projects/`, `/api/organizations/`)
- **Dynamic routing**: Extensively uses `[uuid]` and `[file_uuid]` patterns
- **Error handling**: Consistent error responses via `fetchWrapperService`

### Authentication
- **Protected routes**: Use route groups `(Admin)` and `(Authed)`
- **Role-based access**: Check user roles in API routes and components
- **Session management**: NextAuth.js handles JWT tokens

## Important Configuration

### Build Configuration
- **Canvas fallback**: Webpack config handles server-side rendering for Konva
- **TypeScript**: Build errors currently ignored (temporary setting)
- **React Strict Mode**: Disabled due to canvas rendering issues

### Code Quality
- **GTS**: Google TypeScript Style for consistent formatting
- **Husky**: Pre-commit hooks run `lint-staged`
- **Lint-staged**: Automatically fixes code on commit

### Testing
- **Playwright**: E2E tests with cross-browser support
- **Test data**: Uses authenticated sessions for realistic testing
- **Base URL**: Configurable via `NEXT_PUBLIC_URL` environment variable

## File Upload Patterns
- **Chunked uploads**: For large files, use the chunking API endpoints
- **Progress tracking**: Monitor upload status via job polling
- **File validation**: Client and server-side validation for file types and sizes

## Common Development Patterns

### Toast Notifications
- **Import**: Use `toast` from `sonner` library
- **Message length**: Keep messages concise and user-friendly
- **Dynamic content**: Use `truncateForToast()` from `/utils/toastUtils` when including dynamic text (file names, user names, etc.)
  ```typescript
  import {truncateForToast} from '@/utils/toastUtils';

  // Good: Truncate dynamic content
  toast.success(`${truncateForToast(fileName)}をアップロードしました`);

  // Bad: Long file names can break UI
  toast.success(`${fileName}をアップロードしました`);
  ```
- **Text width**: `truncateForToast()` calculates width considering full-width (2) and half-width (1) characters
  - Default max width: 45 characters
  - Customize with second parameter: `truncateForToast(text, 30)`
- **Message types**:
  - `toast.success()`: Successful operations
  - `toast.error()`: Failed operations or validation errors
  - `toast.info()`: Informational messages
- **Best practices**:
  - Use Japanese messages consistent with the UI language
  - Avoid technical jargon in user-facing messages
  - Include the action performed (e.g., "作成しました", "削除しました", "更新しました")

### Error Handling
- Use `fetchWrapperService` for consistent API error handling
- Display user-friendly error messages via toast notifications
- Log errors appropriately without exposing sensitive information

### Form Handling
- Combine React Hook Form + Zod for form validation
- Use TypeScript for form data types
- Handle loading states during form submission

### Drawing/Canvas Operations
- Use Konva.js patterns established in existing drawing components
- Handle canvas-to-server synchronization for annotations
- Implement undo/redo functionality for drawing operations

### File Operations
- Follow existing patterns for file upload, download, and management
- Use proper MIME type detection and validation
- Handle file versioning and comparison features

## Logging & Tracing
- **Comprehensive documentation**: See `/docs/USER_ACTIVITY_LOGGING.md` for detailed logging system documentation
- **API route wrappers**: Use `withTrace*` wrappers from `/lib/logger/apiWrapper` for proper context isolation
- **Client-side tracking**: Automatic page transition and user interaction logging via collectors
- **Server-side isolation**: AsyncLocalStorage ensures request context separation
