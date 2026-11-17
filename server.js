require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('./passport');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session setup
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Middleware to protect routes
function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/');
}

// Routes
app.get('/', (req, res) => {
  if (req.isAuthenticated()) {
    return res.send(`
      <h2>Hello, ${req.user.name || req.user.displayName}!</h2>
      <p>Email: ${req.user.email || 'N/A'}</p>
      ${req.user.picture || req.user.photo ? `<img src="${req.user.picture || req.user.photo}" alt="profile picture" width="100"/>` : ''}
      <br/><br/>
      <a href="/profile">View Profile JSON</a> | <a href="/logout">Logout</a>
    `);
  }

  res.send(`
    <h2>Welcome to Google OAuth Demo</h2>
    <a href="/auth/google">Login with Google</a>
  `);
});

// Start Google Authentication
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Google OAuth callback
app.get(
  '/auth/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failed',
    successRedirect: '/profile'
  })
);

// Protected user profile route
app.get('/profile', ensureAuth, (req, res) => {
  res.json({
    message: 'User is authenticated',
    user: req.user
  });
});

// Login failed route
app.get('/login-failed', (req, res) => {
  res.status(401).send(`
    <h2>Authentication Failed</h2>
    <p>Could not log in with Google. Check your credentials and try again.</p>
    <a href="/">Back to Home</a>
  `);
});

// Logout route
app.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(() => {
      res.redirect('/');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
