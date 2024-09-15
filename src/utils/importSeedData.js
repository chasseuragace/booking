const fs = require('fs');
const path = require('path');
const BookingRepository = require('../repositories/bookingRepository');

async function importSeedData() {
    const bookingRepository = new BookingRepository();
    const seedData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../db/seed/seed.json')));
    for (const data of seedData) {
        await bookingRepository.createBooking(data);
    }
    console.log('Seed data imported successfully.');
}

importSeedData();
