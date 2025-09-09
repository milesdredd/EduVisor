# EduPath - Career Guidance Platform

## Overview

EduPath is a comprehensive career guidance platform designed to help students discover their ideal career paths through personalized assessments and educational recommendations. The application provides quiz-based aptitude assessments, career matching algorithms, college discovery tools, and personalized user profiles to guide students in making informed educational and career decisions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built using **React with TypeScript** and follows a component-based architecture pattern. The application uses **Wouter** for client-side routing instead of React Router, providing a lightweight navigation solution. State management is handled through **TanStack Query (React Query)** for server state and React's built-in state management for local component state.

The UI is constructed using **shadcn/ui components** built on top of **Radix UI primitives**, providing a consistent and accessible design system. **Tailwind CSS** handles styling with a custom design system that includes CSS variables for theming support (light/dark modes).

### Backend Architecture
The backend follows a **REST API architecture** built with **Express.js** and **TypeScript**. The server uses a modular approach with separate modules for routing, authentication, storage, and database operations.

Key architectural decisions:
- **Separation of concerns**: Routes, storage layer, and database operations are clearly separated
- **Interface-based storage**: The storage layer implements an `IStorage` interface, allowing for easy testing and future database migrations
- **Middleware pattern**: Authentication, logging, and error handling are implemented as Express middleware

### Authentication & Authorization
The application implements **Replit Auth** using **OpenID Connect (OIDC)** with **Passport.js**. This provides:
- Seamless integration with the Replit ecosystem
- Session-based authentication with PostgreSQL session storage
- Automatic user creation and profile management
- Secure token handling and validation

### Data Storage
**PostgreSQL** serves as the primary database with **Drizzle ORM** providing type-safe database operations. The database schema includes:
- User profiles and authentication data
- Quiz assessments and responses
- Career paths and matching algorithms
- College information and recommendations
- Session storage for authentication

**Neon Database** is used as the PostgreSQL provider, offering serverless database capabilities with connection pooling through `@neondatabase/serverless`.

### Development & Build System
The application uses **Vite** as the build tool and development server, providing:
- Fast hot module replacement during development
- Optimized production builds
- TypeScript compilation and type checking
- Asset bundling and optimization

The project structure follows a **monorepo pattern** with:
- `client/` - React frontend application
- `server/` - Express.js backend application  
- `shared/` - Common TypeScript types and database schema

### Design System & Styling
**Tailwind CSS** provides utility-first styling with a custom configuration that includes:
- CSS variables for dynamic theming
- Custom color palette with primary, secondary, and accent colors
- Responsive design utilities
- Component-specific styling patterns

The design system supports both light and dark themes through CSS custom properties and data attributes.

## External Dependencies

### Database & Storage
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and migrations
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Authentication Services
- **Replit Auth**: OIDC-based authentication provider
- **openid-client**: OpenID Connect client implementation
- **Passport.js**: Authentication middleware for Express

### UI & Frontend Libraries
- **Radix UI**: Primitive components for accessibility and interaction
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **TanStack Query**: Server state management and caching
- **Wouter**: Lightweight client-side routing

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and developer experience
- **ESBuild**: Fast JavaScript bundling for production
- **PostCSS**: CSS processing and optimization
- **Tailwind CSS**: Utility-first CSS framework

### Utility Libraries
- **clsx & tailwind-merge**: Conditional CSS class composition
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation
- **memoizee**: Function memoization for performance optimization