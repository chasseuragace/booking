const express = require('express');
const BookingController = require('../controllers/bookingController');
const router = express.Router();

const bookingController = new BookingController();

router.post('/book', bookingController.createBooking.bind(bookingController));

// Route for updating booking status
router.patch('/book/:id/status', bookingController.updateStatus.bind(bookingController));

// Route for listing all bookings
router.get('/', bookingController.listBookings.bind(bookingController));
router.get('/filtered', bookingController.listFilteredBookings.bind(bookingController));


module.exports = router;
