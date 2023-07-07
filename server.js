const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;
const path = require('path');
const DB_HOST = process.env.DB_HOST || '35.160.120.126';

// MySQL Connection
const connection = mysql.createConnection({
  host: DB_HOST,
  user: 'kate',
  password: 'Iam....4',
  database: 'color_couture'
});

connection.connect(error => {
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
const appointmentsRoute = require('./routes/appointments')(connection);
// Route for serving the HTML file
app.get('/', (req, res) => {
  res.sendFile('index.html', { root: path.join(__dirname, 'web_static/templates') });
});
app.get('/appointments.html', (req, res) => {
  res.sendFile('appointments.html', { root: path.join(__dirname, 'web_static/templates') });
});

app.use('/api/services', servicesRouter);
app.use('/submit', submitRouter);
app.use('/api/appointments', appointmentsRoute);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
