# DevChat Production Deployment Guide

## Overview
This guide covers deploying DevChat to production with optimized performance and security.

## Frontend Deployment (Vercel)

### 1. Prepare Frontend
```bash
cd frontend
npm install
npm run build
```

### 2. Configure Vercel
Create/update `vercel.json`:
```json
{
  "buildCommand": "cd frontend && npm run build",
  "framework": "react",
  "outputDirectory": "frontend/build",
  "env": {
    "NODE_OPTIONS": "--max-old-space-size=2048"
  }
}
```

### 3. Set Environment Variables
In Vercel Dashboard → Project Settings → Environment Variables:
```
REACT_APP_BACKEND_URL=https://your-backend-url.com
REACT_APP_ENV=production
GENERATE_SOURCEMAP=false
```

### 4. Deploy
```bash
vercel deploy --prod
```

## Backend Deployment (Render/Heroku/VPS)

### 1. Install Dependencies
```bash
npm install --production
```

### 2. Configure Environment
Create `.env` with production values:
```
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/devchat
FRONTEND_URL=https://your-frontend-url.com
```

### 3. Set Build Command
```bash
npm install
```

### 4. Set Start Command
```bash
node server.js
```

### 5. Deploy
Follow your hosting platform's deployment steps.

## Optimization Tips

### Frontend
- Use the production build with `GENERATE_SOURCEMAP=false`
- Verify sourcemaps are not uploaded
- Check bundle size with `npm run build:analyze`
- Monitor Core Web Vitals in browser DevTools

### Backend
- Monitor server metrics (CPU, memory, connections)
- Enable compression with `compression` middleware
- Use connection pooling for MongoDB
- Implement request rate limiting for production
- Set up error tracking (Sentry, etc.)

## Post-Deployment Verification

### Frontend Checks
```bash
# Build should be quick
npm run build

# Check build size
ls -lh build/

# Verify no source maps
! find build -name "*.js.map"
```

### Backend Checks
```bash
# Check health endpoint
curl https://your-backend-url.com/health

# Monitor logs
tail -f logs.txt

# Verify WebSocket connection
# Open DevTools console and check socket connection status
```

## Database Maintenance

### Backup Strategy
```bash
# MongoDB Atlas - Automatic backups enabled
# Set to daily incremental backups

# Local backup
mongodump --uri "mongodb+srv://user:pass@cluster.mongodb.net/devchat"
```

### Indexing
```javascript
// Ensure proper indexes for performance
db.messages.createIndex({ room: 1, time: -1 })
db.messages.createIndex({ room: 1 })
```

## Monitoring & Alerts

### Application Monitoring
- Set up error tracking (Sentry, LogRocket)
- Monitor server health (Uptime Robot)
- Track performance metrics (Google Analytics)
- Monitor database performance

### Key Metrics
- HTTP response times
- WebSocket connection success rate
- Error rate
- Database query performance
- Server uptime percentage

## Troubleshooting

### Build Timeout
- Increase memory: `NODE_OPTIONS="--max-old-space-size=2048"`
- Reduce dependencies
- Check for large assets

### WebSocket Disconnections
- Check CORS configuration
- Verify frontend and backend URLs match
- Check server logs for errors
- Monitor network conditions

### Database Connection Issues
- Verify MongoDB connection string
- Check network access list in MongoDB Atlas
- Confirm credentials are correct
- Check IP whitelist

## Rollback Procedure

### Quick Rollback
```bash
# Vercel - Select previous deployment
vercel rollback

# Backend - Restart previous version
git checkout <previous-commit>
npm install
npm start
```

## Performance Optimization

### Frontend
- Enable gzip compression in Vercel
- Use image optimization
- Lazy load components when appropriate
- Monitor bundle size regularly

### Backend
- Enable HTTP compression middleware
- Use connection pooling
- Implement caching strategies
- Optimize database queries

## Security Best Practices

- [ ] Use HTTPS everywhere
- [ ] Set secure CORS headers
- [ ] Implement rate limiting
- [ ] Use environment variables for secrets
- [ ] Enable HSTS headers
- [ ] Validate all user input
- [ ] Use security headers (helmet.js)
- [ ] Keep dependencies updated
- [ ] Monitor for vulnerabilities
- [ ] Use private databases with proper access controls

## Support & Escalation

For critical issues:
1. Check application logs
2. Verify server status
3. Check database connectivity
4. Review error tracking service
5. Consider rollback if necessary
