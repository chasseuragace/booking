const pool = require('../config/database');
const Booking = require('../models/booking');

class BookingRepository {
    async createBooking(booking) {
        const query = `
            INSERT INTO bookings (id, entity_id, user_id, status, created_at, updated_at, start_at, end_at, completed_at, booking_info)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
        const values = [
            booking.id,
            booking.entityId,
            booking.userId,
            booking.status,
            booking.createdAt,
            booking.updatedAt,
            booking.startAt, // Added this line
            booking.endAt,   // Added this line
            booking.completedAt,
            booking.bookingInfo
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    }
    

    async updateBookingStatus(id, status) {
        const query = `UPDATE bookings SET status = $1, updated_at = $2 WHERE id = $3 RETURNING *`;
        const values = [status, new Date(), id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getAllBookings() {
        const query = `SELECT * FROM bookings`;
        const result = await pool.query(query);
        return result.rows;
    }
    async getAllFilteredBookings({ bookingIds, userIds, entityIds, statuses, fromDate, toDate }) {
        let query = 'SELECT * FROM bookings WHERE 1=1';
        const values = [];
        
        if (userIds && userIds.length > 0) {
            query += ' AND user_id = ANY($' + (values.length + 1) + ')';
            values.push(userIds);
        }
        if (bookingIds && bookingIds.length > 0) {
            query += ' AND id = ANY($' + (values.length + 1) + ')';
            values.push(bookingIds);
        }
        if (entityIds && entityIds.length > 0) {
            query += ' AND entity_id = ANY($' + (values.length + 1) + ')';
            values.push(entityIds);
        }
        if (statuses && statuses.length > 0) {
            query += ' AND status = ANY($' + (values.length + 1) + ')';
            values.push(statuses);
        }
        
        // Use BETWEEN for created_at date range filter
        if (fromDate && toDate) {
            query += ' AND created_at BETWEEN $' + (values.length + 1) + ' AND $' + (values.length + 2);
            values.push(fromDate, toDate);
        } else if (fromDate) {
            query += ' AND created_at >= $' + (values.length + 1);
            values.push(fromDate);
        } else if (toDate) {
            query += ' AND created_at <= $' + (values.length + 1);
            values.push(toDate);
        }
    
        try {
            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            console.error('Error executing query in getAllFilteredBookings:', error);
            throw error;
        }
    }
    
    
}

module.exports = BookingRepository;
