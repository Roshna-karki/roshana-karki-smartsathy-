require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionSecret = process.env.SESSION_SECRET || 'dev-secret';
if (!process.env.SESSION_SECRET) {
    console.warn('⚠️  SESSION_SECRET is not set. Using default development secret. Set SESSION_SECRET in production!');
}

app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

function getLocalIp() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Normalize repeated slashes in URLs (e.g., /api/auth//login -> /api/auth/login)
app.use((req, res, next) => {
    if (req.url && req.url.includes('//')) req.url = req.url.replace(/\/\/+/, '/');
    next();
});

// Routes
app.use('/api/auth', authRoutes);

// Return JSON for unknown API routes (helps clients get JSON 404s instead of HTML)
app.use('/api', (req, res) => {
    const info = {
        message: 'API endpoint not found',
        method: req.method,
        path: req.originalUrl
    };

    // If client likely meant auth routes, list valid endpoints
    if (req.originalUrl.startsWith('/api/auth')) {
        info.available = [
            { method: 'POST', path: '/api/auth/register', body: { name: 'string', email: 'string', password: 'string', companyName: 'string' } },
            { method: 'POST', path: '/api/auth/login', body: { email: 'string', password: 'string' } },
            { method: 'GET', path: '/api/auth/current-user', auth: 'Bearer <token>' }
        ];
    }

    res.status(404).json(info);
});

// Global error handler (returns JSON)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});

app.listen(PORT, '0.0.0.0', () => {
    const ip = getLocalIp();
    console.log(`Server is running on port http://${ip}:${PORT}`);
});