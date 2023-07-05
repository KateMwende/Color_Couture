const express = require('express');
const router = express.Router();

module.exports = connection => {
  // Get all services
  router.get('/', (req, res) => {
    // Retrieve all services from the database
    connection.query('SELECT * FROM service', (error, results) => {
      if (error) {
        console.error('Error retrieving services:', error);
        res.status(500).json({ error: 'Failed to retrieve services' });
        return;
      }
      res.json(results);
    });
  });

  return router;
};
