const express = require('express');
const app = express();

app.use(express.json());

app.use('/api/v1/Organizations', require('./routes/orgRoutes'));
app.use('/api/v1/Users', require('./routes/userRoutes'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
