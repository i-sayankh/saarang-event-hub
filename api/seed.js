const mongoose = require('mongoose');
const Event = require('./models/Event');
require('dotenv').config();
const seedData = [
  { title: 'Hackathon', description: 'Description for Hackathon', date: new Date('2023-10-10'), venue: 'CLT', capacity: 200 },
  { title: 'Workshop', description: 'Description for Workshop', date: new Date('2023-10-11'), venue: 'RJN 101', capacity: 50 },
  { title: 'Seminar', description: 'Description for Seminar', date: new Date('2023-10-12'), venue: 'RJN 102', capacity: 100 },
];

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log('Connected to MongoDB');
    await Event.deleteMany({});
    await Event.insertMany(seedData);
    console.log('Data seeded successfully');
})
.catch(err => {
  console.error('Error seeding data:', err);
});