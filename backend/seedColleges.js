/**
 * seedColleges.js
 * 
 * One-time seed script to populate the database with all existing
 * hardcoded college data from the frontend.
 * 
 * Usage:  node seedColleges.js
 * 
 * Safe to run multiple times — skips colleges that already exist by name.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const College = require('./models/College');

const colleges = [
  // ─── MEDICAL ──────────────────────────────────────────────
  {
    name: 'Government Medical College (GMC), Srinagar',
    image: '/images/gmcsgr.jpg',
    location: 'Srinagar, J&K',
    description: 'One of the oldest and most prestigious medical institutions in North India, dedicated to excellence in medical education and healthcare.',
    websiteUrl: 'https://www.gmcs.ac.in/',
    category: 'Medical',
  },
  {
    name: 'Government Medical College (GMC), Jammu',
    image: '/images/gmcjmu.png',
    location: 'Jammu, J&K',
    description: 'A leading medical college and hospital providing top-tier medical education and serving the Jammu region.',
    websiteUrl: 'http://gmcjammu.nic.in/',
    category: 'Medical',
  },
  {
    name: 'SKIMS Medical College, Bemina',
    image: '/images/skims.jpg',
    location: 'Srinagar, J&K',
    description: 'A premier medical institution attached to the Sher-i-Kashmir Institute of Medical Sciences, offering UG and PG medical courses.',
    websiteUrl: 'https://skimsmc.edu.in/',
    category: 'Medical',
  },
  {
    name: 'Government Medical College (GMC), Anantnag',
    image: '/images/gmcant.jpg',
    location: 'Anantnag, J&K',
    description: 'A rapidly growing medical college in South Kashmir, providing state-of-the-art medical training and patient care.',
    websiteUrl: 'https://gmcanantnag.net/',
    category: 'Medical',
  },
  {
    name: 'AIIMS, Jammu',
    image: '/images/aiimsjmu.jpg',
    location: 'Vijaypur, Jammu',
    description: 'A premier institute of national importance, bringing world-class healthcare and medical research to the region.',
    websiteUrl: 'https://www.aiimsjammu.edu.in/',
    category: 'Medical',
  },

  // ─── ENGINEERING ──────────────────────────────────────────
  {
    name: 'National Institute of Technology (NIT), Srinagar',
    image: '/images/nitsri.jpg',
    location: 'Srinagar, J&K',
    description: 'A premier engineering institution located on the banks of Dal Lake, offering diverse engineering and technology programs.',
    websiteUrl: 'https://nitsri.ac.in/',
    category: 'Engineering',
  },
  {
    name: 'Indian Institute of Technology (IIT), Jammu',
    image: '/images/iitjmu.jpg',
    location: 'Jammu, J&K',
    description: 'A world-class engineering institute fostering innovation and research excellence in the heart of Jammu.',
    websiteUrl: 'https://iitjammu.ac.in/',
    category: 'Engineering',
  },
  {
    name: 'Government College of Engineering & Tech (GCET), Jammu',
    image: '/images/gcetjmu.jpg',
    location: 'Jammu, J&K',
    description: 'The premier state-run engineering college in Jammu, offering undergraduate courses in several engineering disciplines.',
    websiteUrl: 'https://gcetjammu.org.in/',
    category: 'Engineering',
  },
  {
    name: 'Model Institute of Engineering & Tech (MIET), Jammu',
    image: '/images/miet.jpg',
    location: 'Jammu, J&K',
    description: 'The first private engineering college in J&K, known for its strong industry-academia links and placements.',
    websiteUrl: 'https://www.mietjmu.in/',
    category: 'Engineering',
  },
  {
    name: 'SSM College of Engineering, Pattan',
    image: '/images/ssm.jpg',
    location: 'Baramulla, J&K',
    description: 'One of the oldest private engineering colleges in the valley, providing quality technical education.',
    websiteUrl: 'http://www.ssmcollege.com/',
    category: 'Engineering',
  },

  // ─── GENERAL ──────────────────────────────────────────────
  {
    name: 'University of Kashmir',
    image: '/images/uok.jpg',
    location: 'Srinagar, J&K',
    description: 'The primary university of the valley, known for its beautiful campus and wide range of academic departments.',
    websiteUrl: 'https://www.kashmiruniversity.net/',
    category: 'General',
  },
  {
    name: 'University of Jammu',
    image: '/images/uoj.jpg',
    location: 'Jammu, J&K',
    description: 'An \'A+\' grade university offering diverse research and academic programs in the city of temples.',
    websiteUrl: 'https://www.jammuuniversity.ac.in/',
    category: 'General',
  },
  {
    name: 'Islamic University of Science & Technology (IUST)',
    image: '/images/iust.jpg',
    location: 'Awantipora, J&K',
    description: 'A unique technical university focused on bringing modern science and technology to the doorstep of students.',
    websiteUrl: 'https://www.iust.ac.in/',
    category: 'General',
  },
  {
    name: 'Islamia College of Science & Commerce',
    image: '/images/islamia.jpg',
    location: 'Srinagar, J&K',
    description: 'A heritage institution in the heart of Srinagar, offering specialized courses in science and management.',
    websiteUrl: 'https://islamiacollege.edu.in/',
    category: 'General',
  },
  {
    name: 'Sri Pratap (SP) College, Srinagar',
    image: '/images/sp.jpg',
    location: 'Srinagar, J&K',
    description: 'The oldest science college in the valley, a constituent of the Cluster University Srinagar with a rich history.',
    websiteUrl: 'https://spcollege.edu.in/',
    category: 'General',
  },
];

async function seedColleges() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    console.log('🏫 Seeding Colleges...');
    let created = 0, skipped = 0;

    for (const college of colleges) {
      const exists = await College.findOne({ name: college.name });
      if (exists) {
        // Update category if it was missing
        if (!exists.category || exists.category === 'General') {
          exists.category = college.category;
          await exists.save();
        }
        skipped++;
      } else {
        await College.create(college);
        created++;
      }
    }

    console.log(`   ✅ ${created} created, ${skipped} already existed\n`);
    console.log('═══════════════════════════════════════');
    console.log(`✅ College seed complete!`);
    console.log(`   Total: ${created + skipped} colleges`);
    console.log('═══════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedColleges();
