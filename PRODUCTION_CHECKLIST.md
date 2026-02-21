# Production Deployment Checklist

## Pre-Deployment

### Environment Setup
- [ ] Set `NODE_ENV=production` on server
- [ ] Configure `.env.production` variables
- [ ] Set `REACT_APP_BACKEND_URL` to your production backend URL
- [ ] Update `FRONTEND_URL` in backend `.env`
- [ ] Generate database backups

### Code Quality
- [ ] Run `npm test` to ensure all tests pass
- [ ] Execute Lighthouse audit: `npm run build:analyze`
- [ ] Remove console.log statements in production code
- [ ] Verify no secrets are committed to repository

### Security
- [ ] Install dependencies: `npm install --production`
- [ ] Update all packages: `npm update`
- [ ] Run security audit: `npm audit fix`
- [ ] Enable HTTPS on frontend and backend
- [ ] Configure CORS properly (not "*" in production)
- [ ] Use environment variables for sensitive data

### Performance
- [ ] Production build runs successfully: `npm run build`
- [ ] Build size is under 200KB (gzipped)
- [ ] No source maps in production build
- [ ] Verify chunk splitting is working
- [ ] WebSocket compression is enabled

## Deployment

### Frontend (Vercel)
- [ ] `vercel.json` configured with 2GB memory
- [ ] `.vercelignore` properly configured
- [ ] Build command: `cd frontend && npm run build`
- [ ] Output directory: `frontend/build`
- [ ] Environment variables set in Vercel dashboard
- [ ] Custom domain configured with SSL

### Backend (Render/Other)
- [ ] Server configured with Node.js 20.x
- [ ] MongoDB connection verified
- [ ] SSL certificate installed
- [ ] Compression enabled
- [ ] Health check endpoint: `/health`
- [ ] Graceful shutdown handler active

## Post-Deployment

### Monitoring
- [ ] Set up application monitoring (e.g., Sentry, DataDog)
- [ ] Configure error logging
- [ ] Monitor CPU and memory usage
- [ ] Set up uptime monitoring
- [ ] Enable application insights in backend

### Testing
- [ ] Test user authentication and login
- [ ] Verify message sending and receiving
- [ ] Test room creation and switching
- [ ] Check chat history loading
- [ ] Test mobile responsiveness
- [ ] Verify WebSocket connection stability
- [ ] Test reconnection handling

### Optimization
- [ ] Enable caching headers
- [ ] Configure CDN if needed
- [ ] Monitor Core Web Vitals
- [ ] Check database query performance
- [ ] Review server logs for errors
- [ ] Monitor bandwidth and costs

### Documentation
- [ ] Update README with production deployment steps
- [ ] Document environment variables
- [ ] Create incident response plan
- [ ] Document rollback procedures
- [ ] Maintain deployment logs

## Ongoing Maintenance

- [ ] Regular security updates (npm audit)
- [ ] Monitor error rates and performance metrics
- [ ] Review logs weekly for issues
- [ ] Test disaster recovery procedures
- [ ] Schedule database backups
- [ ] Monitor costs and optimize resources

## Performance Targets

- [ ] Lighthouse Score: > 90
- [ ] First Contentful Paint (FCP): < 1.8s
- [ ] Largest Contentful Paint (LCP): < 2.5s
- [ ] Cumulative Layout Shift (CLS): < 0.1
- [ ] Time to Interactive (TTI): < 3.8s
- [ ] Build time: < 2 minutes
- [ ] Bundle size (gzipped): < 200KB
