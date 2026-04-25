const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env vars
dotenv.config({ path: './.env' });

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@edubag.in';
    const adminPassword = 'adminpassword123';

    // Check if admin already exists
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      admin.password = adminPassword;
      admin.role = 'admin';
      await admin.save();
      console.log('Admin user updated successfully');
    } else {
      admin = await User.create({
        name: 'Super Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log('Admin user created successfully');
    }

    console.log('Admin user created successfully');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    process.exit();
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdmin();
