# Performance Optimization Guide

## Build Optimization

### Frontend Bundle Analysis
```bash
npm run build:analyze
```

This generates a source map explorer report showing:
- Bundle size by module
- Dependencies impact
- Code splitting opportunities

### Code Splitting Strategy
The app automatically splits chunks for:
- Main app code
- Vendor dependencies
- Socket.io library

### Production Build Checklist
- ✅ Sourcemaps disabled (`GENERATE_SOURCEMAP=false`)
- ✅ CSS minified by default
- ✅ JavaScript minified and tree-shaken
- ✅ Images optimized
- ✅ No console.log in production

## Runtime Performance

### Frontend Optimizations
1. **Lazy Loading**: Components load on demand (future enhancement)
2. **Code Splitting**: Automatic splitting of chunks
3. **Memoization**: React.useMemo for expensive computations
4. **Virtual Scrolling**: Handle large chat histories (future enhancement)
5. **Web Workers**: For heavy computations (future enhancement)

### Backend Optimizations
1. **Compression**: gzip compression enabled for all responses
2. **Connection Pooling**: MongoDB connection management
3. **Rate Limiting**: Protect against abuse (future enhancement)
4. **Caching**: Redis caching for frequent queries (future enhancement)
5. **Database Indexing**: Optimized indexes on message queries

## Network Performance

### Frontend
```javascript
// DNS Prefetch & Preconnect
<link rel="preconnect" href="https://your-backend.com" />
<link rel="dns-prefetch" href="https://cdn.example.com" />
```

### Backend
- **Compression Enabled**: All responses gzipped
- **Keep-Alive**: TCP connection reuse
- **CORS Optimization**: Specific origins instead of "*"
- **WebSocket Optimization**: Proper heartbeat configuration

## Core Web Vitals Targets

### Largest Contentful Paint (LCP) < 2.5s
- Optimize image loading
- Defer non-critical CSS
- Lazy load components

### First Input Delay (FID) < 100ms
- Minimize JavaScript
- Break up long tasks
- Use Web Workers for heavy processing

### Cumulative Layout Shift (CLS) < 0.1
- Reserve space for images
- Avoid inserting content above existing content
- Use CSS transforms for animations

## Monitoring & Metrics

### Performance Metrics to Track
```javascript
// Web Vitals
- LCP: Largest Contentful Paint
- FID: First Input Delay
- CLS: Cumulative Layout Shift
- FCP: First Contentful Paint
- TTFB: Time to First Byte

// Custom Metrics
- Socket connection time
- Message delivery time
- Chat history load time
- Room creation time
```

### Tools
- **Chrome DevTools**: Performance tab
- **Lighthouse**: Automated audit
- **WebPageTest**: Detailed waterfall analysis
- **Google Analytics**: Real user metrics
- **Sentry**: Error tracking and performance monitoring

## Database Performance

### Query Optimization
```javascript
// Efficient message retrieval with proper indexing
db.messages.createIndex({ room: 1, time: -1 })

// Query example with limit
Message.find({ room })
  .sort({ time: 1 })
  .limit(100)
  .lean() // Returns plain objects, not Mongoose documents
```

### Connection Management
- Use connection pooling
- Set proper timeouts
- Monitor active connections
- Implement reconnection logic

## Caching Strategy

### Frontend Caching
- Browser cache for static assets (configured by server)
- Service Worker for offline support (future enhancement)
- Session storage for temporary data

### Backend Caching
- Redis for session data (future enhancement)
- HTTP caching headers
- In-memory caching for frequently accessed data

## Memory Management

### Frontend
- Remove listeners on component unmount
- Avoid memory leaks in useEffect
- Clear timers and intervals
- Monitor bundle size

### Backend
- Monitor process memory with `node --inspect`
- Use streaming for large data sets
- Implement pagination for queries
- Set proper heap size limits

## Deployment Performance

### Build Time Optimization
- Current: ~1-2 minutes
- Target: < 2 minutes
- Strategies:
  - Parallel builds
  - Incremental builds
  - Cache dependencies

### Bundle Size Targets
- JavaScript: < 150KB (gzipped)
- CSS: < 20KB (gzipped)
- Total: < 200KB (gzipped)

## Progressive Enhancement

### Current State
- ✅ Core functionality works without optimization
- ✅ Graceful degradation for older browsers
- ✅ Mobile responsive design

### Future Enhancements
- Service Worker for offline capability
- React Suspense for complex components
- GraphQL (if scaling)
- WebAssembly for compute-heavy tasks

## Monitoring Checklist

- [ ] Set up Sentry for error tracking
- [ ] Configure Google Analytics for user analytics
- [ ] Enable Application Insights in Node.js
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Track database query performance
- [ ] Monitor WebSocket connections
- [ ] Setup uptime monitoring
- [ ] Track Core Web Vitals
- [ ] Monitor third-party script impact

## Common Performance Issues & Solutions

### Issue: Slow Initial Load
**Solution:**
- Check bundle size: `npm run build:analyze`
- Enable HTTP/2 on server
- Use CDN for static assets
- Optimize images

### Issue: High Memory Usage
**Solution:**
- Check for memory leaks: `node --inspect`
- Monitor MongoDB connections
- Implement pagination on large queries
- Clear old socket connections

### Issue: WebSocket Disconnections
**Solution:**
- Check network latency
- Verify CORS configuration
- Monitor server load
- Implement exponential backoff for reconnection

### Issue: Database Query Slowness
**Solution:**
- Verify indexes are created
- Analyze query plans
- Implement query timeouts
- Consider query caching

## Testing Performance

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Create load test config
artillery quick --count 100 --num 10 http://your-api.com
```

### Benchmarking
```bash
# Node.js built-in profiling
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

## References
- [Web Vitals Documentation](https://web.dev/vitals/)
- [Node.js Performance](https://nodejs.org/en/docs/guides/nodejs-performance-hooks/)
- [React Performance](https://react.dev/reference/react/memo)
- [MongoDB Performance](https://docs.mongodb.com/manual/administration/analyzing-mongodb-performance/)
