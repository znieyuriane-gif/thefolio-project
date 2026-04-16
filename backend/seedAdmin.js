// backend/seedAdmin.js
const dotenv = require('dotenv');
dotenv.config({ path: './.env' });

const connectDB = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

connectDB().then(async () => {
  const exists = await User.findOne({ email: 'admin@thefolio.com' });
  if (exists) {
    console.log('Admin account already exists.');
    process.exit();
  }

  const hashedPassword = await bcrypt.hash('Admin@1234', 10);

  await User.create({
    name: 'TheFolio Admin',
    email: 'admin@thefolio.com',
    password: hashedPassword,
    role: 'admin',
  });

  console.log("MONGO_URI:", process.env.MONGO_URI);
  console.log('Admin account created successfully!');
  console.log('Email: admin@thefolio.com');
  console.log('Password: Admin@1234');
  process.exit();
});
