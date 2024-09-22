const BookingService = require('../services/bookingService');

class BookingController {
    constructor() {
        this.bookingService = new BookingService();
    }

    async createBooking(req, res) {
        const { entityId, userId, startAt, endAt, additionalInfo } = req.body;

        try {
            // Try to create the booking using the booking service
            const booking = await this.bookingService.bookEntity(
                entityId,
                userId,
                new Date(startAt), // Convert to Date object
                new Date(endAt),   // Convert to Date object
                additionalInfo
            );

            // If successful, return the booking details with a 201 status
            res.status(201).json(booking);

        } catch (error) {
            // Handle booking conflict errors from PostgreSQL
            if (error.code === '23505' || error.code === '23P01') {
                // These codes indicate a conflict due to the exclusion constraint
                res.status(409).json({ error: 'Booking conflict: the entity is already booked during this time range.' });
            } else {
                // Handle any other errors with a generic 500 status
                res.status(500).json({ error: error.message });
            }
        }
    }


    async updateStatus(req, res) {
        const { id } = req.params;
        const { status } = req.body;
        try {
            const updatedBooking = await this.bookingService.updateStatus(id, status);
            if (updatedBooking) {
                res.json(updatedBooking);
            } else {
                res.status(404).json({ message: 'Booking not found' });
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async listBookings(req, res) {
        try {
            const bookings = await this.bookingService.listBookings();
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    async listFilteredBookings(req, res) {
        const { userIds, entityIds, statuses, bookingIds, fromDate,
            toDate } = req.query;

        // Convert comma-separated strings into arrays
        const userIdsArray = userIds ? userIds.split(',') : null;
        const entityIdsArray = entityIds ? entityIds.split(',') : null;
        const statusArray = statuses ? statuses.split(',') : null;
        const bookingIdArray = bookingIds ? bookingIds.split(',') : null;

        try {
            const filters = {
                userIds: userIdsArray, entityIds: entityIdsArray, statuses: statusArray, bookingIds: bookingIdArray,
                fromDate: fromDate,
                toDate: toDate,
            };
            const bookings = await this.bookingService.listFilteredBookings(filters);
            console.log(bookings);
            res.json(bookings);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = BookingController;
