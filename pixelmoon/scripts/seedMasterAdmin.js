#!/usr/bin/env node
// UPDATED 2025-01-27 — Master admin seed script for initial setup
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

async function seedMasterAdmin() {
  try {
    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      console.error('MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Check if master admin already exists
    const existingMaster = await User.findOne({ isMasterAdmin: true });
    if (existingMaster) {
      console.log('Master admin already exists:', existingMaster.email);
      process.exit(0);
    }

    // Get master admin credentials from environment
    const masterEmail = process.env.MASTER_ADMIN_EMAIL;
    const masterPassword = process.env.MASTER_ADMIN_PASSWORD;

    if (!masterEmail || !masterPassword) {
      console.error('MASTER_ADMIN_EMAIL and MASTER_ADMIN_PASSWORD must be set in environment');
      process.exit(1);
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(masterPassword, saltRounds);

    // Create master admin user
    const masterAdmin = new User({
      email: masterEmail,
      username: 'master_admin',
      password: hashedPassword,
      role: 'master',
      isAdmin: true,
      isMasterAdmin: true,
      emailVerified: true,
      walletBalance: 0,
      isVip: false
    });

    await masterAdmin.save();
    console.log('Master admin created successfully:', masterEmail);
    console.log('Username: master_admin');
    console.log('Role: master');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding master admin:', error);
    process.exit(1);
  }
}

// Run the seed function
seedMasterAdmin();
