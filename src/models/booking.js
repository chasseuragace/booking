class Booking {
    constructor(id, entityId, userId, status, createdAt, updatedAt, startAt, endAt, completedAt, bookingInfo) {
        this.id = id;
        this.entityId = entityId;
        this.userId = userId;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.startAt = startAt; // New field
        this.endAt = endAt;     // New field
        this.completedAt = completedAt;
        this.bookingInfo = bookingInfo;
    }
}

module.exports = Booking;
