const express = require('express');
const cors = require('cors');
const sessionConfig = require('./config/sessionConfig');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(sessionConfig);

app.use('/auth', authRoutes);

module.exports = app;
