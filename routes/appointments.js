const express = require('express');
const router = express.Router();

module.exports = (connection) => {
    // Get all appointments
    router.get('/', (req, res) => {
    // Retrieve all appointments from the database
        connection.query('SELECT * FROM appointments', (error, results) => {
            if (error) {
                console.error('Error retrieving appointments:', error);
                res.status(500).json({ error: 'Failed to retrieve appointments' });
                return;
            }
            res.json(results);
   
        });
    });

  // Delete an appointment by ID (DELETE route)
  router.delete('/:id', (req, res) => {
    const appointmentId = req.params.id;
    const query = 'DELETE FROM appointments WHERE id = ?';

    // Execute the query
    connection.query(query, [appointmentId], (error, results) => {
      if (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Error deleting appointment' });
        return;
      }

      // Check if any rows were affected
      if (results.affectedRows === 0) {
        res.status(404).json({ message: 'Appointment not found' });
        return;
      }

      // Send a response back to the client
      res.status(200).json({ message: 'Appointment deleted successfully' });
    });
  });

  return router;
};
