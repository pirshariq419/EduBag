const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config();

const User = require('./models/User');
const Note = require('./models/Note');
const Test = require('./models/Test');
const College = require('./models/College');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany();
    await Note.deleteMany();
    await Test.deleteMany();
    await College.deleteMany();
    console.log('Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@edubag.in',
      password: 'admin123',
      role: 'admin',
      examTarget: 'JEE',
    });
    console.log('Admin created:', admin.email);

    // Create test user
    const user = await User.create({
      name: 'Test Student',
      email: 'student@edubag.in',
      password: 'student123',
      role: 'user',
      examTarget: 'NEET',
    });
    console.log('Student created:', user.email);

    // Create Notes
    const notes = await Note.insertMany([
      { title: 'Mechanics Complete Notes', description: 'Comprehensive notes covering Newton Laws, Work-Energy theorem, and Rotational Mechanics.', subject: 'Physics', chapter: 'Mechanics', exam: 'JEE', year: 2025, difficulty: 'Medium', tags: ['Important', 'High Weightage'], fileUrl: 'https://example.com/mechanics.pdf', downloads: 1245, uploadedBy: admin._id },
      { title: 'Organic Chemistry Reactions', description: 'All major organic reactions with mechanisms and examples.', subject: 'Chemistry', chapter: 'Organic Chemistry', exam: 'NEET', year: 2025, difficulty: 'Hard', tags: ['High Weightage'], fileUrl: 'https://example.com/organic.pdf', downloads: 890, uploadedBy: admin._id },
      { title: 'Calculus - Differentiation', description: 'Step-by-step differentiation techniques including chain rule and product rule.', subject: 'Mathematics', chapter: 'Calculus', exam: 'JEE', year: 2024, difficulty: 'Medium', tags: ['Important'], fileUrl: 'https://example.com/calculus.pdf', downloads: 2100, uploadedBy: admin._id },
      { title: 'Human Physiology', description: 'Detailed notes on circulatory, nervous, and digestive systems.', subject: 'Biology', chapter: 'Human Physiology', exam: 'NEET', year: 2025, difficulty: 'Easy', tags: ['Important', 'High Weightage'], fileUrl: 'https://example.com/physiology.pdf', downloads: 1560, uploadedBy: admin._id },
      { title: 'Electrostatics & Magnetism', description: 'Complete electrostatics and magnetism notes with derivations.', subject: 'Physics', chapter: 'Electrostatics', exam: 'JEE', year: 2024, difficulty: 'Hard', tags: ['High Weightage'], fileUrl: 'https://example.com/electrostatics.pdf', downloads: 780, uploadedBy: admin._id },
    ]);
    console.log(`${notes.length} notes created`);

    // Create Tests
    const tests = await Test.insertMany([
      {
        title: 'JEE Mains Full Mock - 1', type: 'Full-Length', subject: 'Physics', durationMinutes: 180, createdBy: admin._id,
        questions: [
          { questionText: 'A particle moves in a circle of radius R. The displacement after half a revolution is:', options: ['2R', 'πR', '2πR', '0'], correctAnswerIndex: 0, explanation: 'Displacement is the straight line from start to end = diameter = 2R' },
          { questionText: 'Which of the following is a vector quantity?', options: ['Speed', 'Mass', 'Displacement', 'Time'], correctAnswerIndex: 2, explanation: 'Displacement has both magnitude and direction.' },
          { questionText: 'SI unit of force is:', options: ['Dyne', 'Newton', 'Joule', 'Watt'], correctAnswerIndex: 1, explanation: 'Newton is the SI unit of force.' },
        ],
      },
      {
        title: 'Physics - Mechanics', type: 'Chapter-wise', subject: 'Physics', durationMinutes: 45, createdBy: admin._id,
        questions: [
          { questionText: 'Acceleration due to gravity on Earth is approximately:', options: ['8.9 m/s²', '9.8 m/s²', '10.8 m/s²', '11.2 m/s²'], correctAnswerIndex: 1, explanation: 'Standard value of g = 9.8 m/s²' },
          { questionText: 'Newton third law is applicable to:', options: ['A body in motion only', 'All bodies', 'A body at rest only', 'None'], correctAnswerIndex: 1, explanation: 'Newton third law applies to all interactions.' },
        ],
      },
    ]);
    console.log(`${tests.length} tests created`);

    // Create Colleges
    const colleges = await College.insertMany([
      {
        name: 'NIT Srinagar', location: 'Srinagar, J&K', description: 'National Institute of Technology, Srinagar is one of the premier Educational Institutes of the country.',
        courses: [{ name: 'B.Tech CSE', duration: '4 years', fees: 125000 }, { name: 'B.Tech EE', duration: '4 years', fees: 125000 }],
        cutoffs: [{ year: 2024, exam: 'JEE Mains', rank: 35000 }],
        placementData: { averagePackage: '8.5 LPA', highestPackage: '45 LPA', topRecruiters: ['Google', 'Microsoft', 'Amazon'] },
      },
      {
        name: 'GMC Srinagar', location: 'Srinagar, J&K', description: 'Government Medical College, Srinagar, one of the oldest medical colleges in North India.',
        courses: [{ name: 'MBBS', duration: '5.5 years', fees: 50000 }],
        cutoffs: [{ year: 2024, exam: 'NEET', rank: 25000 }],
        placementData: { averagePackage: '12 LPA', highestPackage: '25 LPA', topRecruiters: ['AIIMS', 'SKIMS'] },
      },
    ]);
    console.log(`${colleges.length} colleges created`);

    console.log('\n✅ Seed data created successfully!');
    console.log('Admin login: admin@edubag.in / admin123');
    console.log('Student login: student@edubag.in / student123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
