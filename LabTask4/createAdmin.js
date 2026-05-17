// Run ONCE to seed your first admin user: node createAdmin.js
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const User     = require('./models/User');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/assignment3';

async function run() {
  await mongoose.connect(MONGO_URI);
  const email = 'admin@royaltag.com';
  const exists = await User.findOne({ email });
  if (exists) { console.log('Admin already exists:', email); return mongoose.disconnect(); }
  await User.create({
    name:     'Admin',
    email,
    password: await bcrypt.hash('admin1234', 10),
    role:     'admin',
  });
  console.log('✅ Admin created:', email, '/ password: admin1234');
  console.log('⚠️  Change the password after first login!');
  mongoose.disconnect();
}
run().catch(console.error);
