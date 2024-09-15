const BookingRepository = require('../repositories/bookingRepository');
const { v4: uuidv4 } = require('uuid');
const Booking = require('../models/booking');

class BookingService {
    constructor() {
        this.bookingRepository = new BookingRepository();
    }

    async bookEntity(entityId, userId, startAt, endAt, bookingInfo) {
        const booking = new Booking(
            uuidv4(), 
            entityId, 
            userId, 
            'pending', 
            new Date(), 
            new Date(), 
            startAt,  // Pass startAt to Booking constructor
            endAt,    // Pass endAt to Booking constructor
            null, 
            bookingInfo
        );
        return await this.bookingRepository.createBooking(booking);
    }

    async updateStatus(id, status) {
        return await this.bookingRepository.updateBookingStatus(id, status);
    }

    async listBookings() {
        return await this.bookingRepository.getAllBookings();
    }
    // this is in service 
    async listFilteredBookings(filters) {
        return await this.bookingRepository.getAllFilteredBookings(filters);
    }
}

module.exports = BookingService;
