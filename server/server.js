require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const passport = require('passport');
const authRoutes = require('./routes/authRoutes');
require('./config/passport');
// require('./config/db').connect();
const announcementRoutes = require('./routes/announcementRoutes');

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use('/auth', authRoutes);
app.use('/api/announcements', announcementRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
