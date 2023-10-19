const express = require('express');
require('dotenv').config();
const nodemailer = require('nodemailer');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require('path');

// MySQL Connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((error) => {
  if (error) {
    console.error('Error connecting to the database:', error);
    return;
  }
  console.log('Connected to the database');
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from the 'static' directory
app.use(express.static(path.join(__dirname, 'web_static/static/styles')));
app.use(express.static(path.join(__dirname, 'web_static')));
app.use(express.static(path.join(__dirname, 'web_static/templates')));
// Serve static files from node_modules directory
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// Routes
const servicesRouter = require('./routes/services')(connection);
const submitRouter = require('./routes/submit')(connection);

// Route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile('index.html', {
    root: path.join(__dirname, 'web_static/templates'),
  });
});
app.get('/appointments.html', (req, res) => {
  res.sendFile('appointments.html', {
    root: path.join(__dirname, 'web_static/templates'),
  });
});

app.use('/api/services', servicesRouter);
app.use('/submit', submitRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
