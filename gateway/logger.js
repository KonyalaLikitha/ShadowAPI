function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();
    const status = res.statusCode;
    const statusColor = status >= 500 ? '🔴' : status >= 400 ? '🟡' : '🟢';
    
    console.log(`${statusColor} [${timestamp}] ${req.method} ${req.path} ${status} ${duration}ms`);
    
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(`   Body: ${JSON.stringify(req.body)}`);
    }
  });
  
  next();
}

module.exports = requestLogger;
