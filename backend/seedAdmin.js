// backend/seedAdmin.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' }); // explicitly load from backend/.env

require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
connectDB().then(async () => {
const exists = await User.findOne({ email: 'admin@thefolio.com' });
if (exists) {
console.log('Admin account already exists.');
process.exit();
}
await User.create({
name: 'TheFolio Admin',
email: 'admin@thefolio.com',
password: 'Admin@1234',
role: 'admin',
});
console.log("MONGO_URI:", process.env.MONGO_URI);

console.log('Admin account created successfully!');
console.log('Email: admin@thefolio.com');
console.log('Password: Admin@1234');
process.exit();
});