# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend (Node.js/Express)
```bash
cd backend
npm install                 # Install dependencies
npm run dev                 # Start development server (port 3001)
npm run build              # Build TypeScript
npm start                  # Start production server
npx prisma generate        # Regenerate Prisma client
npx prisma db push         # Push schema changes to database
```

### Frontend (React/Vite)
```bash
cd frontend
npm install                # Install dependencies
npm run dev                # Start development server (port 5173)
npm run build              # Build for production
npm run lint               # Run ESLint
npm run preview            # Preview production build
```

### WSL/Linux Environment Setup
- Backend runs on port 3001, frontend on port 5173
- In WSL environments, use IP address `172.27.50.224` instead of localhost for cross-environment communication
- Frontend `.env` file should contain: `VITE_API_URL=http://172.27.50.224:3001/api`
- If Vite cache issues occur, run: `rm -rf frontend/node_modules/.vite && npm run dev`

## Architecture Overview

### Full-Stack Structure
- **Backend**: Express.js API with TypeScript, Prisma ORM, SQLite database
- **Frontend**: React SPA with TypeScript, TailwindCSS, React Router
- **Database**: SQLite with Prisma schema located in `backend/prisma/schema.prisma`
- **Authentication**: JWT-based with bcrypt password hashing

### API Architecture
RESTful API design with routes organized by domain:
- `/api/auth/*` - User authentication (login, register, profile)
- `/api/saunas/*` - Sauna data management and search
- `/api/ladies-days/*` - Ladies day information and voting system
- `/api/reviews/*` - Sauna reviews and ratings
- `/api/users/*` - User profile management

### Frontend Architecture
- **Pages**: Route-level components in `src/pages/`
- **Layout**: Shared UI with tab navigation using `src/components/Layout.tsx`
- **Services**: API communication layer in `src/services/` (api.ts is the main Axios instance)
- **Hooks**: Custom React hooks for data fetching (`useAuth`, `useSaunas`, `useLadiesDays`)
- **Type Safety**: TypeScript interfaces defined locally in each service file (not centralized)

### Database Schema
Core entities and relationships:
- **Users**: Authentication, trust scores, contribution tracking
- **Saunas**: Location data, facilities, ratings
- **LadiesDays**: Community-driven ladies day information with voting system
- **Reviews**: User reviews with ratings and visibility controls
- **Votes**: Support/oppose voting on ladies day information
- **Facilities**: Sauna amenities categorized by type

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token injection via Axios interceptors
- Token refresh and logout handling on 401 responses
- Protected routes require authentication middleware

### Key Technical Decisions
- **Type Definitions**: Currently defined locally in each file rather than centralized due to module import issues
- **Search Functionality**: Currently simplified due to SQLite limitations with complex text search
- **TailwindCSS**: Version locked to 3.4.0 for stability
- **Database**: Prisma client generated to `backend/src/generated/prisma` for custom output location

### Known Issues & Workarounds
- Search functionality is temporarily simplified in `backend/src/controllers/saunaController.ts`
- Type imports may fail; use local interface definitions instead of importing from `src/types/`
- WSL networking requires explicit IP addresses rather than localhost
- Vite cache may need manual clearing when configuration changes

### Development Workflow
1. Start backend server first to ensure database is available
2. Run frontend development server
3. Use health check endpoint `/health` to verify backend connectivity
4. For database changes, update Prisma schema then run `npx prisma generate`
5. Authentication testing can use the pre-seeded test user or create new accounts via `/register`