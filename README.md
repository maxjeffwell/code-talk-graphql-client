# Code Talk Client

<div align="center">

![React](https://img.shields.io/badge/React-16.14.0-30d403?style=for-the-badge&logo=react&logoColor=white&labelColor=393939)
![Apollo Client](https://img.shields.io/badge/Apollo%20Client-2.6.10-30d403?style=for-the-badge&logo=apollo-graphql&logoColor=white&labelColor=393939)
![GraphQL](https://img.shields.io/badge/GraphQL-14.7.0-30d403?style=for-the-badge&logo=graphql&logoColor=white&labelColor=393939)
![Styled Components](https://img.shields.io/badge/styled--components-4.4.1-30d403?style=for-the-badge&logo=styled-components&logoColor=white&labelColor=393939)

</div>

<div align="center">

**Real-time Collaborative Code Editor & Messaging Platform**

*Build, chat, and collaborate seamlessly with developers worldwide*

</div>

<h1 align="center"><img width=100% src=https://github.com/maxjeffwell/code-talk-graphql-client/blob/master/src/components/Images/Logo/CodeTalk_Title_Logo.png alt="Code Talk Logo"></h1>

## 🚀 Features

<div align="center">

| Feature | Description |
|---------|-------------|
| 🔄 **REAL-TIME** | **Synchronized text editing** across multiple users |
| 💬 **MESSAGING** | **Instant messaging** with GraphQL subscriptions |
| 🔐 **SECURE** | **JWT-based authentication** with automatic token management |
| 🎨 **MODERN UI** | **Responsive design** with styled-components |
| ⚡ **WEBSOCKET** | **Real-time updates** through GraphQL subscriptions |

</div>

## 🛠️ Tech Stack

### Frontend
- **React 16.14.0** - Component-based UI framework
- **Apollo Client 2.6.10** - GraphQL client with caching and real-time subscriptions
- **Styled Components 4.4.1** - CSS-in-JS styling solution
- **React Router DOM 5.2.0** - Client-side routing
- **GraphQL 14.7.0** - Query language for API

### Key Features
- **GraphQL Subscriptions** for real-time updates
- **Apollo Link** architecture for authentication and error handling
- **InMemoryCache** for efficient data management
- **Component-based architecture** with HOCs for cross-cutting concerns

## 🏗️ Architecture

### Apollo Client Configuration
- **Split Link** - Intelligent routing between HTTP and WebSocket connections
- **Auth Link** - Automatic JWT token attachment
- **Error Link** - Centralized error handling with auto-logout
- **WebSocket Link** - Real-time subscription support

### Component Structure
```
src/
├── components/
│   ├── App/                    # Main app with routing
│   ├── Session/                # Authentication & session management
│   ├── Message/                # Real-time messaging
│   ├── Editor/                 # Collaborative text editor
│   ├── Room/                   # Chat room interface
│   ├── Navigation/             # Auth-aware navigation
│   └── [Auth Components]       # SignIn, SignUp, SignOut
├── constants/                  # Routes and configuration
└── index.js                    # Apollo Client setup
```

## 🚦 Getting Started

### Prerequisites
- Node.js 12+
- npm or yarn
- [Code Talk Server](https://github.com/maxjeffwell/code-talk-graphql-server) running

### Installation

1. Clone the repository
```bash
git clone https://github.com/maxjeffwell/code-talk-graphql-client.git
cd code-talk-graphql-client
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

The app will be available at `http://localhost:3000`

### Environment Configuration

The app automatically detects development vs production environments:
- **Development**: Connects to `http://localhost:4000/graphql`
- **Production**: Connects to deployed server URL

## 📜 Available Scripts

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run test suite
npm run lint       # Run ESLint
npm run eject      # Eject from Create React App (irreversible)
```

## 🔐 Authentication

Code Talk uses JWT-based authentication with secure token storage:
1. **Hybrid Storage Strategy**:
   - **Production (HTTPS)**: Tokens stored in `sessionStorage` for enhanced security
   - **Development/Non-HTTPS**: Falls back to `localStorage` for persistence
2. Automatically attached to all GraphQL requests via Auth Link
3. Session validation through `GET_ME` query
4. Protected routes with HOC pattern
5. Automatic token cleanup on logout from both storage types

## 🎨 Styling & Theme

<div align="center">
  
### 🎯 **Code Talk Design System**

</div>

Built with styled-components featuring a cohesive design system:

### Color Palette
The app uses a carefully curated color scheme defined in `src/theme.js`:

<table align="center">
  <tr>
    <th>Color</th>
    <th>Hex Code</th>
    <th>Usage</th>
    <th>Preview</th>
  </tr>
  <tr>
    <td><strong>Primary Green</strong></td>
    <td><code>#30d403</code></td>
    <td>Accents, buttons, borders, text highlights</td>
    <td><img src="https://via.placeholder.com/60x30/30d403/30d403.png" alt="Primary Green" /></td>
  </tr>
  <tr>
    <td><strong>Dark Gray</strong></td>
    <td><code>#393939</code></td>
    <td>Backgrounds, containers, secondary text</td>
    <td><img src="https://via.placeholder.com/60x30/393939/393939.png" alt="Dark Gray" /></td>
  </tr>
  <tr>
    <td><strong>Light Gray</strong></td>
    <td><code>#EDEDED</code></td>
    <td>Primary text, light backgrounds</td>
    <td><img src="https://via.placeholder.com/60x30/EDEDED/EDEDED.png" alt="Light Gray" /></td>
  </tr>
</table>

<div align="center">

---

### 🎨 **Color Showcase**

<img src="https://via.placeholder.com/150x80/30d403/FFFFFF?text=PRIMARY" alt="Primary Green" />
<img src="https://via.placeholder.com/150x80/393939/30d403?text=DARK" alt="Dark Theme" />
<img src="https://via.placeholder.com/150x80/EDEDED/393939?text=LIGHT" alt="Light Theme" />

</div>

### Typography
- **Primary**: RussellSquareStd - Modern, clean headers
- **Secondary**: SerpentineStd-Medium - UI elements and navigation  
- **Code**: FloodStd - Monospace for editor and code display

### Component Styling
- **Theme Provider** integration across all components
- **Consistent spacing** and border radius patterns
- **Hover states** with color transitions
- **Responsive design** with mobile-first approach

<div align="center">

> **Design Philosophy**: Minimalist cyberpunk aesthetic with high contrast and clean typography

</div>

## 🧪 Testing

- **Jest** - Testing framework
- **Enzyme** - React component testing
- Tests colocated with components (`.test.js`)
- Run tests with `npm test`

## 📦 Deployment

### Heroku Deployment

The app includes Heroku configuration:
- `Procfile` for static file serving
- Automatic build process
- Environment-based API endpoints

```bash
git push heroku master
```

## 🔮 Future Enhancements

- [ ] Redis cache for persistent editor state
- [ ] Multi-room support with permissions
- [ ] User presence indicators
- [ ] Code syntax highlighting
- [ ] File upload and sharing
- [ ] Progressive Web App features
- [ ] React Native mobile app

## 📋 Next Steps

### Immediate Priorities

1. **Fix Editor State Persistence**
   - Implement Redis caching for collaborative editor content
   - Ensure new users can see existing editor content when joining a room
   - Add debounced auto-save functionality

2. **Enhance Room Management**
   - Add room creation and deletion UI
   - Implement room permissions (public/private)
   - Display active users in each room
   - Add room search/filter functionality

3. **Improve Error Handling**
   - Add user-friendly error messages for network failures
   - Implement retry logic for failed subscriptions
   - Add offline mode detection and recovery

### Short-term Goals

4. **Performance Optimizations**
   - Implement virtual scrolling for message lists
   - Add message pagination with infinite scroll
   - Optimize bundle size with code splitting
   - Add service worker for caching

5. **UI/UX Improvements**
   - Add typing indicators
   - Implement message read receipts
   - Add emoji support in messages
   - Create dark mode theme option
   - Add message search functionality

6. **Developer Experience**
   - Add comprehensive test coverage
   - Set up CI/CD pipeline
   - Add Storybook for component documentation
   - Implement E2E tests with Cypress

### Long-term Vision

7. **Advanced Features**
   - Code syntax highlighting with language detection
   - File sharing and code snippet storage
   - Voice/video chat integration
   - Screen sharing capabilities
   - Integration with popular IDEs

8. **Platform Expansion**
   - React Native mobile applications
   - Desktop app with Electron
   - Browser extension for quick access
   - REST API for third-party integrations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the GNU GPLv3 License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Jeff Maxwell**
- Email: [jeff@el-jefe.me](mailto:jeff@el-jefe.me)
- GitHub: [@maxjeffwell](https://github.com/maxjeffwell)
- Portfolio: [https://www.el-jefe.me](https://www.el-jefe.me)

## 🙏 Acknowledgments

- Built with Create React App
- Powered by Apollo GraphQL
- Styled with styled-components

---

<div align="center">

<img src="https://via.placeholder.com/600x80/393939/30d403?text=Made+with+%E2%9D%A4%EF%B8%8F+and+GraphQL" alt="Made with love and GraphQL" />

<br><br>

<img src="https://via.placeholder.com/300x40/30d403/393939?text=Code+Talk+Client" alt="Code Talk Client" />

</div>
