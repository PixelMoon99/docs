/**
 * Seed script to create master admin user.
 * Run with: node scripts/seedMasterAdmin.js
 */
const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

async function run() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  const email = process.env.MASTER_ADMIN_EMAIL || 'admin@example.com';
  const pwd = process.env.MASTER_ADMIN_PASSWORD || 'changeMe';
  const hashed = await bcrypt.hash(pwd, 10);
  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Master admin already exists:', email);
    process.exit(0);
  }
  const user = new User({ email, password: hashed, role: 'master_admin' });
  await user.save();
  console.log('Created master admin:', email);
  process.exit(0);
}
run().catch(e=>{ console.error(e); process.exit(1); });
