const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

module.exports = (connection) => {
  // Create an appointment (POST route)
  router.post('/', (req, res) => {
    const { customer_name, date, time, service } = req.body;
    const query =
      'INSERT INTO appointments (customer_name, date, time, service) VALUES (?, ?, ?, ?)';
    const values = [customer_name, date, time, service];
    // Execute the query
    connection.query(query, values, (error, results) => {
      if (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ message: 'Error creating appointment' });
        return;
      }
      // Send a response back to the client
      res.status(200).json({ message: 'Appointment submitted successfully' });
    });
    // Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    console.log('service:', service);
    const mailOptions = {
      from: 'katemunyoki76@gmail.com',
      to: 'kmwende419@gmail.com',
      subject: 'New Appointment',
      text: `A new appointment has been submitted.\n\nCustomer Name: ${customer_name}\nDate: ${date}\nTime: ${time}\nService: ${service}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
  });

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
