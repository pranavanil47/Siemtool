# Wazuh Security Dashboard

## Overview

This is a modern web-based security monitoring dashboard built for Wazuh, an open-source security platform. The application provides real-time visualization of security metrics, alerts, vulnerabilities, compliance status, and MITRE ATT&CK framework data. It features a responsive design with a dark theme optimized for security operations centers (SOCs).

The system is designed as a full-stack application with a React frontend and Express.js backend, providing comprehensive security monitoring capabilities including agent management, alert tracking, vulnerability assessment, and compliance reporting.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Styling**: Tailwind CSS with custom Wazuh-branded color scheme and dark theme
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful API architecture with structured endpoints for different data domains
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Schema Validation**: Zod for runtime type validation of API requests and responses
- **Development**: Hot reload and middleware integration for development workflow

### Data Storage Solutions
- **Primary Database**: PostgreSQL hosted on Neon for production-ready cloud database
- **ORM**: Drizzle ORM providing type-safe database queries and migrations
- **Schema Management**: Structured schema definitions in shared directory for consistency
- **Connection**: Serverless-compatible database connection using @neondatabase/serverless

### Database Schema Design
The application uses a relational schema with the following core entities:
- **Agents**: Security agents with status tracking, version info, and platform details
- **Alerts**: Security alerts with severity levels, MITRE ATT&CK mappings, and resolution status
- **Vulnerabilities**: CVE tracking with severity classification and package information
- **Compliance Results**: Framework compliance tracking (PCI DSS, GDPR, HIPAA, NIST 800-53)
- **MITRE ATT&CK Data**: Attack technique tracking with alert correlation

### API Structure
The backend provides organized endpoints grouped by functionality:
- `/api/dashboard/*` - Dashboard metrics and KPI data
- `/api/agents/*` - Agent management and status monitoring
- `/api/alerts/*` - Alert retrieval, filtering, and timeline data
- `/api/vulnerabilities/*` - Vulnerability management and distribution analytics
- `/api/compliance/*` - Compliance framework reporting
- `/api/mitre-attack/*` - MITRE ATT&CK framework data

### Authentication and Authorization
The application is prepared for session-based authentication with:
- Session storage using connect-pg-simple for PostgreSQL-backed sessions
- Middleware structure for request logging and error handling
- Credential-based API requests with CORS support

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting for production deployment
- **Drizzle Kit**: Database migration and schema management tool

### UI and Component Libraries
- **Radix UI**: Comprehensive set of accessible UI primitives for React
- **shadcn/ui**: Pre-built component library built on Radix UI with Tailwind CSS
- **Lucide React**: Icon library providing consistent iconography
- **Recharts**: Chart library for data visualization components

### Development and Build Tools
- **Replit Integration**: Platform-specific plugins for development environment
- **ESBuild**: Fast JavaScript bundler for server-side builds
- **PostCSS and Autoprefixer**: CSS processing for cross-browser compatibility

### Data Visualization
- **Recharts**: React charting library for alerts timeline, vulnerability distribution, and other analytics
- **Date-fns**: Date manipulation library for time-based data processing

### Form and Data Handling
- **React Hook Form**: Form state management with validation
- **Zod Resolvers**: Integration between Zod validation and React Hook Form
- **TanStack Query**: Server state management with caching and background updates

The architecture prioritizes type safety throughout the stack, real-time data updates, and a scalable design that can accommodate growing security monitoring needs.