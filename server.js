const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

// Increase payload size limit
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configure CORS more explicitly
app.use(cors({
  origin: '*', // Be more specific in production
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files with proper MIME types
app.use(express.static('.', {
  setHeaders: (res, path) => {
    if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Add error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

// Add request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.post('/generate', async (req, res) => {
  try {
    // Add timeout to axios request
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent',
      req.body,
      {
        params: {
          key: 'AIzaSyA3xLBmycLbszOMJxUQSJVmGEewVW9Z0hY'
        },
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    );
    
    // Validate response before sending
    if (!response.data) {
      throw new Error('Empty response from Gemini API');
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Generate endpoint error:', error);
    
    // Send more detailed error information
    res.status(500).json({
      error: error.message,
      details: error.response ? error.response.data : null,
      status: error.response ? error.response.status : null
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3000;

// Different startup for local vs production
if (process.env.NODE_ENV === 'production') {
  // For Ubuntu server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running in production mode on http://0.0.0.0:${PORT}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`Environment: production`);
  });
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`Server running in development mode on http://localhost:${PORT}`);
    console.log(`Node.js version: ${process.version}`);
    console.log(`Environment: development`);
  });
}

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
}); 