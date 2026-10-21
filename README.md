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

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm start
```

Backend runs on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## API Endpoints

### Subscriptions
- `GET /api/subscriptions` - Get all subscriptions
- `POST /api/subscriptions` - Create new subscription
- `GET /api/subscriptions/:id` - Get subscription details
- `PUT /api/subscriptions/:id` - Update subscription
- `DELETE /api/subscriptions/:id` - Delete subscription
- `GET /api/subscriptions/analytics/summary` - Get spending analytics

## Development Timeline

- **Week 1**: Core features (tracking, analytics, alerts)
- **Week 1.5**: Alternative recommendations, Polish & Deployment

## License

MIT
