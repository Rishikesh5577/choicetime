import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const email = process.argv[2];

if (!email) {
  console.error('Please provide user email: node scripts/setAdmin.js user@example.com');
  process.exit(1);
}

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Missing MONGODB_URI in environment.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { isAdmin: true, role: 'admin' } },
      { new: true }
    ).select('-password');

    if (!user) {
      console.log('User not found.');
    } else {
      console.log(`✅ ${user.email} is now marked as admin.`);
    }
  } catch (error) {
    console.error('Error setting admin flag:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();


