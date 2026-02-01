# loom - The Compatibility Engine

loom is a revolutionary dating app that goes beyond superficial bios to create meaningful human connections based on psychological principles, behavioral patterns, communication styles, and deeper personality insights.

## Core Features

- **Psychological Matching**: Advanced compatibility based on Big Five personality traits, love languages, and communication styles
- **Personality Quiz**: Comprehensive assessment covering personality, love languages, communication style, and lifestyle preferences
- **Smart Recommendations**: Algorithm that learns from your preferences to suggest the most compatible matches
- **Real-time Chat**: Secure, real-time messaging system for matched users
- **Compatibility Scoring**: Detailed breakdown of compatibility factors with explanations

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose for data modeling
- **JWT** authentication with bcrypt password hashing
- **Socket.IO** for real-time chat functionality
- **Express Validator** for input validation

### Frontend
- **React 18** with modern hooks
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls
- **Socket.IO Client** for real-time features
- **Framer Motion** for animations
- **React Hot Toast** for notifications

## Project Structure

```
loom/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts (Auth, Socket)
│   │   ├── pages/          # Page components
│   │   └── main.jsx        # App entry point
│   ├── package.json
│   └── vite.config.js
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── index.js            # Server entry point
│   └── package.json
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loom
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd server
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/loom
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

4. **Start MongoDB**
   ```bash
   # If using local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   # From the root directory
   npm run dev
   ```

   This will start both the backend server (port 3000) and frontend development server (port 5173).

### Alternative: Run servers separately

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm run dev
```

## Compatibility Algorithm

The loom compatibility engine calculates matches based on multiple psychological factors:

### 1. Big Five Personality Traits (25% weight)
- **Openness**: Creativity, curiosity, and openness to new experiences
- **Conscientiousness**: Organization, discipline, and goal-oriented behavior
- **Extraversion**: Social energy, assertiveness, and positive emotions
- **Agreeableness**: Trust, cooperation, and empathy
- **Neuroticism**: Emotional stability and stress response

### 2. Love Languages (20% weight)
- **Words of Affirmation**: Verbal expressions of love and appreciation
- **Acts of Service**: Actions that demonstrate care and support
- **Receiving Gifts**: Thoughtful presents and gestures
- **Quality Time**: Undivided attention and meaningful moments
- **Physical Touch**: Affectionate contact and intimacy

### 3. Communication Style (20% weight)
- **Directness**: How straightforward someone is in communication
- **Emotional Expression**: How openly emotions are shared
- **Conflict Resolution**: Approach to handling disagreements
- **Humor**: Use and appreciation of humor in relationships

### 4. Lifestyle Preferences (15% weight)
- **Social Activity**: Preference for social vs. solitary activities
- **Adventure**: Openness to new experiences and spontaneity
- **Routine**: Preference for structure vs. flexibility
- **Work-Life Balance**: Priorities between career and personal life

### 5. Values & Interests (20% weight)
- **Core Values**: Fundamental beliefs and principles
- **Shared Interests**: Common hobbies and activities

## 📊 Database Models

### User Model
- Basic information (name, email, age, gender, location)
- Authentication data (password hash, JWT tokens)
- Profile completion status

### Profile Model
- Extended user information (bio, photos, interests)
- Psychological assessment results
- Privacy settings and preferences

### Match Model
- Compatibility scores and breakdowns
- Match status (potential, mutual, declined)
- Chat room associations

### Message Model
- Real-time chat messages
- Read status and timestamps
- Message reactions and editing

## Authentication

- JWT-based authentication with 7-day expiration
- Password hashing using bcrypt with salt rounds of 12
- Protected routes with middleware validation
- Secure token storage in localStorage

## 💬 Real-time Features

- Socket.IO integration for instant messaging
- Room-based chat system
- Message delivery confirmation
- Online/offline status indicators

## UI/UX Features

- Modern, responsive design with TailwindCSS
- Gradient color schemes and smooth animations
- Mobile-first approach
- Accessibility considerations
- Loading states and error handling

## Future Enhancements

### Planned Features
- **AI Love Coach**: Personalized insights and relationship advice
- **Advanced ML Algorithm**: Machine learning-based compatibility scoring
- **Video Chat Integration**: Face-to-face conversations
- **Date Planning**: AI-suggested activities based on shared interests
- **Friend Matching**: Expand beyond romantic relationships
- **Photo Verification**: Prevent catfishing with image verification
- **Premium Features**: Advanced filters and unlimited likes

### Technical Improvements
- **Microservices Architecture**: Scalable backend services
- **Redis Caching**: Improved performance and session management
- **Image Processing**: Automated photo optimization and filtering
- **Push Notifications**: Real-time alerts for matches and messages
- **Analytics Dashboard**: User engagement and success metrics

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Psychological research on compatibility and relationship success
- Big Five personality model and love languages theory
- Modern web development best practices
- Open source community contributions

## Support

For support, email support@loom.app or join our Discord community.

---

**loom** - Where meaningful connections begin with psychological compatibility. 💕
