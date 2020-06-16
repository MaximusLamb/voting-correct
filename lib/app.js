const express = require('express');
const app = express();

app.use(express.json());
app.use(require('cookie-parser')());

app.use('/api/v1/Organizations', require('./routes/orgRoutes'));
app.use('/api/v1/Users', require('./routes/userRoutes'));
app.use('/api/v1/Polls', require('./routes/pollRoutes'));
app.use('/api/v1/Memberships', require('./routes/memberRoutes'));
app.use('/api/v1/Votes', require('./routes/voteRoutes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
