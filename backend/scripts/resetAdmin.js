const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');

    const admin = await User.findOne({ role: 'admin' });
    
    if (admin) {
      admin.password = '@Kalkhaarab123';
      await admin.save();
      console.log('Admin password updated to @Kalkhaarab123');
    }

    process.exit();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

resetAdmin();
