require('dotenv').config(); // Must be FIRST

const express   = require('express');
const cors      = require('cors');
const path      = require('path');
const connectDB = require('./config/db');

// Route files
const authRoutes    = require('./routes/auth.routes');
const postRoutes    = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes   = require('./routes/admin.routes');
const contactRoutes = require('./routes/contact.route');

const app = express();

// ── Connect to MongoDB ───────────────────────────────────────────────
connectDB();

// ── Global Middleware ────────────────────────────────────────────────

// 1. Define allowed origins clearly
const allowedOrigins = [
  "http://localhost:3000",
  "https://thefolio-project.vercel.app",
  "https://thefolio-project-git-main-znieyuriane-gifs-projects.vercel.app"
];

// 2. Comprehensive CORS Configuration
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Allow requests with no origin
    if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith(".vercel.app")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 3. Manual Preflight Handling
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || (origin && origin.endsWith(".vercel.app"))) {
    res.header("Access-Control-Allow-Origin", origin);
  }
  res.header("Access-Control-Allow-Credentials", "true");

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json());

// Serve uploaded image files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API Routes ──────────────────────────────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/posts',    postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/contact',  contactRoutes);

// ── Health check ────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'The folio API is Live ✔' });
});

// Optional: DB health check route
app.get('/api/health', async (req, res) => {
  try {
    const state = mongoose.connection.readyState;
    res.json({ dbState: state === 1 ? 'connected' : 'disconnected' });
  } catch (err) {
    res.status(500).json({ error: 'Health check failed', details: err.message });
  }
});

// ── Start Server ────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
