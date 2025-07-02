# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Code Talk Client** is a React frontend application for a real-time code collaboration and messaging platform. Built with Apollo Client for GraphQL integration, the app provides secure authentication, real-time messaging through GraphQL subscriptions, and collaborative text editing features. Emphasizes modern React patterns with styled-components for CSS-in-JS styling.

## Commands

### Development
- `react-scripts start` or `npm start` - Start development server with hot reloading
- `react-scripts build` or `npm run build` - Build production static assets
- `react-scripts test` - Run Jest tests in jsdom environment
- `npm run lint` - Run ESLint on src directory
- `react-scripts eject` - Eject from Create React App (irreversible)

### Testing
- Jest testing framework integrated with Create React App
- Enzyme for component testing with React 16 adapter
- Test files located alongside components with `.test.js` extension

## Architecture

### Application Entry Point (`src/index.js`)
The main entry file configures:
- **Apollo Client** with HTTP and WebSocket link configuration
- **Authentication Link** for JWT token management
- **Error Handling Link** for GraphQL and network errors
- **Split Link** for routing queries/mutations vs subscriptions
- **Theme Provider** for styled-components theming
- **Development/Production** environment-aware GraphQL endpoints

### Apollo Client Configuration

**Link Composition:**
- **HTTP Link** - REST-like queries and mutations
- **WebSocket Link** - Real-time subscriptions
- **Auth Link** - Automatic JWT token attachment from localStorage
- **Error Link** - Centralized error handling with auto-logout on auth errors
- **Split Link** - Smart routing based on operation type

**Cache Management:**
- InMemoryCache for client-side state management
- Automatic cache updates from subscriptions
- Dev tools integration for debugging

### Routing & Navigation (`src/components/App/`)

**React Router Setup:**
- Browser router with history management
- Route-based code splitting preparation
- Protected route patterns with session management

**Route Structure:**
- `/` - Landing page
- `/signup` - User registration
- `/signin` - User authentication  
- `/code-talk-chat/` - Main chat room interface
- `/admin` - Administrative interface (future)

### Authentication & Session Management (`src/components/Session/`)

**Session Management:**
- **withSession HOC** - Provides session data to wrapped components
- **GET_ME Query** - Fetches current user information
- **JWT Token Handling** - localStorage persistence with automatic attachment
- **Auto-logout** - On authentication errors or token expiration

**Authentication Flow:**
1. User signs in via GraphQL mutation
2. JWT token stored in localStorage
3. Token automatically attached to all requests
4. Session query validates and provides user data
5. Protected components receive session props

### Real-time Features

**GraphQL Subscriptions:**
- **Message Subscriptions** - Real-time chat message updates
- **Editor Subscriptions** - Collaborative text editing synchronization
- **WebSocket Management** - Automatic reconnection and error handling

**Subscription Implementation:**
- Split link configuration for subscription routing
- Component-level subscription management
- Real-time UI updates from server events

### Component Architecture

**Modular Component Structure:**
- **Container Components** - Data fetching and state management
- **Presentational Components** - UI rendering and user interaction
- **HOCs for Cross-cutting Concerns** - Authentication, session management
- **Styled Components** - CSS-in-JS with theme integration

**Key Components:**
- **Message Components** - Chat functionality with real-time updates
- **Editor Component** - Collaborative text editing with debounced updates
- **Authentication Components** - Sign up, sign in, sign out flows
- **Navigation** - Conditional rendering based on authentication state

### Styling Architecture

**Styled Components Integration:**
- Theme provider with consistent color palette
- Component-scoped styling with props integration
- Global styles for typography and layout
- Custom font loading with WebFont loader

**Design System:**
- Primary colors: `#30d403` (green), `#393939` (black), `#EDEDED` (white)
- Typography: Custom fonts (RussellSquareStd, SerpentineStd-Medium, FloodStd)
- Responsive design patterns
- Consistent component styling patterns

## Key Technologies

- **React 16.14.0** - Component-based UI library
- **Apollo Client 2.6.10** - GraphQL client with caching and subscriptions
- **React Apollo 3.1.5** - React bindings for Apollo Client
- **Styled Components 4.4.1** - CSS-in-JS styling solution
- **React Router DOM 5.2.0** - Client-side routing
- **GraphQL 14.7.0** - Query language and schema definition

## GraphQL Integration

**Query Patterns:**
- Declarative data fetching with Query components
- Automatic loading states and error handling
- Cache-first data retrieval with network fallbacks

**Mutation Patterns:**
- Form submissions with optimistic updates
- Error handling and user feedback
- Automatic cache updates post-mutation

**Subscription Patterns:**
- Real-time data synchronization
- Component-level subscription management
- Automatic reconnection and error recovery

## Development Dependencies

- **Enzyme 3.11.0** - Component testing utilities
- **ESLint** - Code linting with Airbnb configuration and GraphQL plugin
- **Prettier** - Code formatting integration
- **Babel Runtime** - ES6+ feature polyfills

## Environment Configuration

**Development vs Production:**
- GraphQL endpoint switching based on NODE_ENV
- WebSocket URL configuration for subscriptions
- Development tools and debugging features

**Environment Variables:**
- Automatic detection of development/production environments
- No additional environment variables required for basic functionality

## Real-time Collaboration Features

**Message System:**
- Real-time chat with message creation/deletion
- User attribution and timestamps
- Pagination for message history
- Optimistic UI updates

**Collaborative Editor:**
- Real-time text synchronization across clients
- Debounced input to prevent excessive network traffic
- Conflict resolution through server-side state management
- Auto-resizing textarea with styled-components integration

## Authentication Patterns

**Protected Components:**
- HOC pattern for authentication requirements
- Automatic redirects on authentication failures
- Session data propagation through component tree

**Token Management:**
- localStorage persistence across browser sessions
- Automatic token refresh handling
- Secure token transmission via headers

## Error Handling

**GraphQL Error Management:**
- Centralized error logging and user notification
- Authentication error auto-logout
- Network error handling and retry logic

**Component Error Boundaries:**
- Error components for graceful failure handling
- User-friendly error messages
- Development vs production error display

## Testing Strategy

**Component Testing:**
- Enzyme shallow and mount testing
- Mock Apollo Client for GraphQL testing
- Snapshot testing for UI consistency
- Integration testing for user flows

**Test Organization:**
- Tests colocated with components
- Shared test utilities and mocks
- Setup configuration in setupTests.js

## Performance Optimizations

**Code Splitting:**
- Route-based splitting preparation
- Component lazy loading patterns
- Bundle size optimization

**GraphQL Optimizations:**
- Query deduplication through Apollo Client
- Intelligent caching strategies
- Subscription management and cleanup

## Deployment

**Heroku Configuration:**
- `heroku-run-build-script: true` for automated builds
- Static file serving for SPA routing
- Environment-based API endpoint configuration

**Build Optimization:**
- Create React App production builds
- Asset optimization and minification
- Progressive Web App capabilities preparation

## Browser Support

- Modern browsers with ES6+ support
- Responsive design for mobile and desktop
- WebSocket support for real-time features
- Progressive enhancement patterns

## Project Structure
```
src/
├── index.js                    # App entry point with Apollo setup
├── components/
│   ├── App/                    # Main app component with routing
│   ├── Session/                # Authentication and session management
│   │   ├── withSession.js      # HOC for session injection
│   │   ├── withAuthorization.js # HOC for protected routes
│   │   └── queries.js          # Session-related GraphQL queries
│   ├── Message/                # Real-time messaging components
│   │   ├── Messages/           # Message list with subscriptions
│   │   ├── MessageCreate/      # New message form
│   │   └── MessageDelete/      # Message removal
│   ├── Editor/                 # Collaborative text editor
│   ├── Navigation/             # App navigation with auth states
│   │   ├── Auth/               # Authenticated navigation
│   │   └── NonAuth/            # Public navigation
│   ├── SignIn/                 # Authentication form
│   ├── SignUp/                 # Registration form
│   ├── SignOut/                # Logout functionality
│   ├── Room/                   # Chat room interface
│   │   ├── RoomGrid/           # Room layout system
│   │   ├── RoomList/           # Room selection
│   │   └── RoomCreate/         # Room creation
│   ├── Landing/                # Public landing page
│   ├── Loading/                # Loading state components
│   ├── Error/                  # Error display components
│   └── Variables/              # Theme and styling constants
├── constants/
│   ├── routes.js               # Route path definitions
│   └── history.js              # Router history configuration
└── setupTests.js               # Test environment setup
```

## Future Enhancements

- **Redis Cache Integration** - Persistent editor state across sessions
- **Enhanced Room Management** - Multi-room support and permissions
- **Real-time Presence** - User online/offline status indicators
- **File Upload/Sharing** - Code file import and export
- **Syntax Highlighting** - Programming language support in editor
- **Mobile App** - React Native implementation
- **Progressive Web App** - Offline functionality and native features