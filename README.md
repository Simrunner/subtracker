# SubTracker - Subscription Manager & Optimizer

SubTracker helps you track, analyze, and optimize your recurring subscription costs. Never overpay for subscriptions you forgot about again.

## Features

- **Subscription Tracking**: Add all your subscriptions and track costs
- **Cost Analytics**: Visual analytics of spending by category and time
- **Renewal Alerts**: Get notified before subscription renewals
- **Alternative Recommendations**: Find cheaper alternatives to your current services
- **Dashboard**: Real-time overview of all subscriptions and upcoming renewals
- **Multi-currency Support**: Track subscriptions in different currencies

## Tech Stack

- **Frontend**: React + TypeScript
- **Backend**: Node.js + Express
- **Database**: MongoDB
- **Authentication**: JWT

## Project Structure

```
subtracker/
├── client/          # React frontend application
├── server/          # Node.js backend API
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   └── server.js    # Express server entry point
└── README.md
```

## Quick Start

### Option 1: Docker Deployment (Recommended)

```bash
docker-compose up --build
```

This starts:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Local Development

**Prerequisites:**
- Node.js (v16+)
- npm or yarn
- MongoDB running locally or connection URI

**Install all dependencies:**
```bash
npm run install:all
```

**Set up environment variables:**
```bash
cd server
cp .env.example .env
# Edit .env with your MongoDB URI
```

**Start development (both frontend and backend):**
```bash
npm run dev
```

Or start separately:
```bash
# Terminal 1: Backend
cd server && npm start

# Terminal 2: Frontend
cd client && npm start
```

**Access the app:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Features

### 📊 Dashboard Analytics
- Total subscriptions count
- Monthly spending breakdown
- Spending by category visualization
- Upcoming renewal alerts (5 next renewals)

### 💰 Subscription Management
- Add/Edit/Delete subscriptions
- Support for multiple billing cycles (daily, weekly, monthly, quarterly, yearly)
- Category organization
- Custom renewal dates
- Notes and descriptions

### 🎯 Cost Optimization
- Automatic alternative recommendations
- Monthly and annual savings calculations
- Service comparison (Adobe, Microsoft, Slack, etc.)
- Feature comparison matrix
- Optimization opportunity counter

### ⚙️ Settings & Preferences
- Currency selection (USD, EUR, GBP, JPY, CAD, AUD)
- Timezone configuration
- Email notification preferences
- Customizable alert timing (1-30 days before renewal)

### 🔐 Security
- User signup and login with password hashing
- JWT-based authentication
- Protected API endpoints
- Session persistence with localStorage

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new account
- `POST /api/auth/login` - Login user

### Subscriptions (Protected)
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create subscription
- `GET /api/subscriptions/:id` - Get subscription by ID
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/analytics/summary` - Get analytics

### Recommendations (Protected)
- `GET /api/recommendations/` - Get all recommendations
- `GET /api/recommendations/savings/summary` - Get savings summary

### User (Protected)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/preferences` - Update preferences

## Database Schema

### User
```javascript
{
  email: String,
  password: String (hashed),
  firstName: String,
  lastName: String,
  currency: String,
  timezone: String,
  emailNotifications: Boolean,
  alertDaysBefore: Number
}
```

### Subscription
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  cost: Number,
  billingCycle: String (daily|weekly|monthly|quarterly|yearly),
  category: String,
  renewalDate: Date,
  status: String (active|cancelled|paused),
  notes: String
}
```

## Development

### Project Structure
```
subtracker/
├── client/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── App.tsx
│   │   └── index.tsx
│   └── package.json
├── server/              # Express backend
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth middleware
│   ├── server.js
│   └── package.json
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── README.md
```

## Technology Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Modern CSS Grid/Flexbox

- **Backend:**
  - Node.js
  - Express 5
  - MongoDB with Mongoose
  - JWT Authentication
  - bcryptjs for password hashing

- **Deployment:**
  - Docker & Docker Compose
  - Environment-based configuration

## Performance Features

- Optimized API queries with filtering
- Client-side data caching
- Efficient database indexing
- Responsive design for all devices
- Lazy loading of components

## Future Enhancements

- [ ] Email notifications for renewals
- [ ] CSV/PDF export functionality
- [ ] Advanced filtering and search
- [ ] Budget goals and savings targets
- [ ] Subscription sharing (family plans)
- [ ] Mobile app (React Native)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Advanced analytics with charts
- [ ] Integration with payment platforms

## Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for any improvements.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feedback, please open an issue on GitHub or contact the development team.
