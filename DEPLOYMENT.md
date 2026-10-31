# SubTracker + Porteflow Integration Deployment Guide

## Overview

This document describes how to deploy the integrated SubTracker + Porteflow system with unified Supabase authentication.

## Environment Variables

### SubTracker Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/subtracker
SUPABASE_JWT_SECRET=<your_supabase_jwt_public_key>
PORTEFLOW_ORIGIN=https://porteflow.com
NODE_ENV=production
```

### Porteflow Frontend (.env.production)

```
VITE_SUBTRACKER_URL=https://porteflow.com/api/subscriptions
```

## Docker Compose Configuration

Add to docker-compose.yml on the Porteflow server:

```yaml
subtracker:
  image: node:18-alpine
  working_dir: /app
  volumes:
    - ./subtracker:/app
  environment:
    - PORT=5000
    - MONGODB_URI=mongodb://mongodb:27017/subtracker
    - SUPABASE_JWT_SECRET=${SUPABASE_JWT_SECRET}
    - PORTEFLOW_ORIGIN=https://porteflow.com
    - NODE_ENV=production
  ports:
    - "5000:5000"
  depends_on:
    - mongodb
  command: npm start

mongodb:
  image: mongo:7-alpine
  ports:
    - "27017:27017"
  volumes:
    - mongodb_data:/data/db
  environment:
    - MONGO_INITDB_DATABASE=subtracker

volumes:
  mongodb_data:
```

## Nginx Configuration

Add to nginx config on the Porteflow server:

```nginx
location /api/subscriptions/ {
    proxy_pass http://localhost:5000/api/subscriptions/;
    proxy_set_header Authorization $http_authorization;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header Host $host;
    
    # CORS headers already set by SubTracker
    add_header 'Access-Control-Allow-Origin' 'https://porteflow.com' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
    add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
}

location /api/user/ {
    proxy_pass http://localhost:5000/api/user/;
    proxy_set_header Authorization $http_authorization;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}

location /api/recommendations/ {
    proxy_pass http://localhost:5000/api/recommendations/;
    proxy_set_header Authorization $http_authorization;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

## Deployment Steps

### 1. Clone SubTracker Repository

```bash
cd /var/www
git clone https://github.com/Simrunner/subtracker.git
cd subtracker
git checkout feature/subtracker-integration
npm install
```

### 2. Configure Environment Variables

```bash
cp server/.env.example server/.env
# Edit server/.env and add:
# - SUPABASE_JWT_SECRET
# - PORTEFLOW_ORIGIN
# - MONGODB_URI (if using external MongoDB)
```

### 3. Update Docker Compose

```bash
# Add SubTracker and MongoDB services to docker-compose.yml
# See Docker Compose Configuration section above
docker-compose up -d subtracker mongodb
```

### 4. Update Nginx Configuration

```bash
# Add proxy rules from Nginx Configuration section above
# Then reload nginx
sudo nginx -s reload
```

### 5. Deploy Porteflow with Subscriptions

```bash
cd /var/www/portfolio-navigator
git fetch origin feature/subtracker-integration
git checkout feature/subtracker-integration
npm install
npm run build
# Nginx will serve the updated build
```

### 6. Verify Integration

1. **Health Check**: `curl https://porteflow.com/api/subscriptions/health`
   - Should return: `{ "status": "Server is running" }`

2. **Login via Porteflow**: Navigate to https://porteflow.com and login with Supabase

3. **Add Subscription**: Go to Subscriptions tab and add a test subscription

4. **Verify Data**: 
   - Check MongoDB: `mongo subtracker`
   - Query: `db.subscriptions.findOne()`

## Authentication Flow

```
1. User logs in via Porteflow
   → Supabase Auth returns JWT token
   → Stored in localStorage

2. User navigates to Subscriptions tab
   → Frontend fetches JWT from Supabase session
   → Sends API request: GET /api/subscriptions
   → Authorization header: Bearer <JWT>

3. SubTracker receives request
   → Verifies JWT using SUPABASE_JWT_SECRET
   → Extracts user_id from JWT.sub claim
   → Returns subscriptions for that user_id

4. Frontend displays subscription data
```

## Data Storage

- **User Profiles**: MongoDB collection `users`
  - Fields: `supabase_user_id`, `email`, `currency`, `timezone`, `preferences`
  - Created on first API call from Porteflow

- **Subscriptions**: MongoDB collection `subscriptions`
  - Fields: `supabase_user_id`, `name`, `cost`, `billingCycle`, `category`, `renewalDate`, `status`
  - Indexed by `supabase_user_id` for fast queries

## Troubleshooting

### JWT Verification Fails

- Verify `SUPABASE_JWT_SECRET` is correct
- Check JWT format: `Bearer <token>`
- Ensure token hasn't expired

### CORS Errors

- Verify `PORTEFLOW_ORIGIN` matches the frontend URL
- Check nginx proxy headers are set correctly
- Ensure CORS configuration in SubTracker matches Porteflow origin

### Subscriptions Not Loading

1. Check SubTracker is running: `curl http://localhost:5000/api/health`
2. Verify MongoDB is running: `mongo subtracker`
3. Check Porteflow logs for API errors
4. Verify JWT is being sent in Authorization header

## Rollback

If issues occur:

```bash
# Revert to previous Porteflow version
cd /var/www/portfolio-navigator
git checkout main
npm run build

# Stop SubTracker if not needed
docker-compose down subtracker
```

## Future Enhancements

- [ ] Email notifications for subscription renewals
- [ ] Export subscriptions as CSV/PDF
- [ ] Advanced recommendation engine with ML
- [ ] Mobile app sync
- [ ] Slack/Discord integrations
