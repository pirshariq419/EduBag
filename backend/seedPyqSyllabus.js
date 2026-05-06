/**
 * seedPyqSyllabus.js
 * 
 * One-time seed script to populate the database with all existing
 * hardcoded PYQ papers and Syllabus entries from the frontend.
 * 
 * Usage:  node seedPyqSyllabus.js
 * 
 * Safe to run multiple times — uses upsert logic to avoid duplicates.
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const Category = require('./models/Category');
const Resource = require('./models/Resource');

// ─── CATEGORY DEFINITIONS ───────────────────────────────────────────
const categories = [
  { id: 'jkbose',       name: 'JKBOSE',            logo: '/images/jkbose.png',      type: 'all', order: 0 },
  { id: 'neet-ug',      name: 'NEET UG',           logo: '/images/neetug.png',      type: 'all', order: 1 },
  { id: 'jee-mains',    name: 'JEE Mains',         logo: '/images/jeemain.png',     type: 'all', order: 2 },
  { id: 'jee-advanced', name: 'JEE Advanced',      logo: '/images/jeeadvanced.jpg', type: 'all', order: 3 },
  { id: 'neet-pg',      name: 'NEET PG',           logo: '/images/neetpg.jpg',      type: 'all', order: 4 },
  { id: 'jkbopee',      name: 'JKBOPEE Nursing',   logo: '/images/jkbopeeb.jpg',    type: 'all', order: 5 },
  { id: 'skaust',       name: 'SKAUST-K UET',      logo: '/images/skaustsyl.jpg',   type: 'all', order: 6 },
  { id: 'upsc-ias',     name: 'UPSC IAS',          logo: '/images/ias.png',         type: 'all', order: 7 },
  { id: 'jkpsc',        name: 'JKPSC KAS',         logo: '/images/jkpsc.jpg',       type: 'syllabus', order: 8 },
];

// ─── PYQ RESOURCE GENERATION ────────────────────────────────────────

function generatePyqResources() {
  const resources = [];

  // --- JKBOSE ---
  const jkboseClasses = [
    {
      className: 'Class 10th',
      folderSuffix: '10th',
      startYear: 2026, endYear: 2020,
      subjects: ['English', 'Maths', 'Science', 'Social Science', 'Urdu', 'Hindi'],
      // Hindi not available for 2020-2025
      subjectFilter: (subject, year) => {
        if (subject === 'Hindi' && year >= 2020 && year <= 2025) return false;
        return true;
      }
    },
    {
      className: 'Class 11th',
      folderSuffix: '11th',
      startYear: 2026, endYear: 2020,
      subjects: ['English', 'Physics', 'Chemistry', 'Zoology', 'Botany', 'Maths', 'Phy. Edu.', 'Political Science', 'Geography', 'History'],
    },
    {
      className: 'Class 12th',
      folderSuffix: '12th',
      startYear: 2026, endYear: 2020,
      subjects: ['English', 'Physics', 'Chemistry', 'Zoology', 'Botany', 'Maths', 'Phy. Edu.', 'History'],
    },
  ];

  for (const cls of jkboseClasses) {
    for (let year = cls.startYear; year >= cls.endYear; year--) {
      for (const subject of cls.subjects) {
        if (cls.subjectFilter && !cls.subjectFilter(subject, year)) continue;
        resources.push({
          title: subject,
          type: 'pyq',
          exam: 'jkbose',
          class: cls.className,
          year,
          subject,
          fileUrl: `/assets/pyq/jkbose/${cls.folderSuffix}/Class ${cls.folderSuffix} ${subject} ${year}.pdf`,
        });
      }
    }
  }

  // --- NEET UG ---
  for (let year = 2025; year >= 2013; year--) {
    resources.push({
      title: 'Question Paper',
      type: 'pyq',
      exam: 'neet-ug',
      year,
      subject: 'Question Paper',
      fileUrl: year === 2025
        ? `/assets/pyq/neet ug/NEET Paper 2025.pdf`
        : `/assets/pyq/neet ug/NEET ${year} Paper.pdf`,
    });
  }

  // --- JEE Mains ---
  for (let year = 2026; year >= 2013; year--) {
    for (let shift = 1; shift <= 3; shift++) {
      resources.push({
        title: `Shift ${shift} - Question Paper`,
        type: 'pyq',
        exam: 'jee-mains',
        year,
        subject: `Shift ${shift}`,
        fileUrl: `/assets/pyq/jee mains/JEE ${year}(Shift-${shift}) Paper.pdf`,
      });
    }
  }

  // --- JEE Advanced ---
  for (let year = 2025; year >= 2013; year--) {
    resources.push({
      title: 'Question Paper',
      type: 'pyq',
      exam: 'jee-advanced',
      year,
      subject: 'Question Paper',
      fileUrl: `/assets/pyq/jee advanced/JEE Adv ${year} Paper.pdf`,
    });
  }

  // --- NEET PG ---
  for (let year = 2025; year >= 2020; year--) {
    resources.push({
      title: 'Question Paper',
      type: 'pyq',
      exam: 'neet-pg',
      year,
      subject: 'Question Paper',
      fileUrl: year === 2025
        ? `/assets/pyq/neet pg/NEET PG Paper 2025.pdf`
        : `/assets/pyq/neet pg/NEET PG ${year} Paper.pdf`,
    });
  }

  // --- JKBOPEE B.Sc Nursing ---
  for (let year = 2025; year >= 2020; year--) {
    resources.push({
      title: 'Question Paper',
      type: 'pyq',
      exam: 'jkbopee',
      year,
      subject: 'Question Paper',
      fileUrl: `/assets/pyq/jkbopee bsc nursing/JKBOPEE B.Sc Nursing ${year}.pdf`,
    });
  }

  // --- SKAUST-K UET ---
  for (let year = 2025; year >= 2015; year--) {
    resources.push({
      title: 'Question Paper',
      type: 'pyq',
      exam: 'skaust',
      year,
      subject: 'Question Paper',
      fileUrl: `/assets/pyq/skaust_k/SKAUST-K UET ${year}.pdf`,
    });
  }

  // --- UPSC IAS ---
  resources.push({
    title: 'UPSC IAS Paper',
    type: 'pyq',
    exam: 'upsc-ias',
    year: 2025,
    subject: 'UPSC IAS Paper',
    fileUrl: `/assets/pyq/upsc ias/UPSC IAS Paper 2025.pdf`,
  });

  return resources;
}

// ─── SYLLABUS RESOURCE GENERATION ───────────────────────────────────

function generateSyllabusResources() {
  return [
    { title: 'Class 10th',            type: 'syllabus', exam: 'jkbose',       class: 'Class 10th',    fileUrl: '/assets/syllabus/jkbose/10th/Class 10th JKBOSE Syllabus.pdf' },
    { title: 'Class 11th',            type: 'syllabus', exam: 'jkbose',       class: 'Class 11th',    fileUrl: '/assets/syllabus/jkbose/11th/Class 11th JKBOSE Syllabus.pdf' },
    { title: 'Class 12th',            type: 'syllabus', exam: 'jkbose',       class: 'Class 12th',    fileUrl: '/assets/syllabus/jkbose/12th/Class 12th JKBOSE Syllabus.pdf' },
    { title: 'NEET UG Syllabus',      type: 'syllabus', exam: 'neet-ug',      class: 'Undergraduate', fileUrl: '/assets/syllabus/neet ug/NEET UG Syllabus 2026.pdf' },
    { title: 'NEET PG Syllabus',      type: 'syllabus', exam: 'neet-pg',      class: 'Postgraduate',  fileUrl: '/assets/syllabus/neet pg/NEET PG Syllabus 2026.pdf' },
    { title: 'JEE Mains Syllabus',    type: 'syllabus', exam: 'jee-mains',    class: 'Undergraduate', fileUrl: '/assets/syllabus/jee mains/JEE Mains 2026 Syllabus.pdf' },
    { title: 'JEE Advanced Syllabus', type: 'syllabus', exam: 'jee-advanced', class: 'Undergraduate', fileUrl: '/assets/syllabus/jee advanced/JEE Advanced 2026 Syllabus.pdf' },
    { title: 'SKAUST-K UET',          type: 'syllabus', exam: 'skaust',       class: 'Undergraduate', fileUrl: '/assets/syllabus/skaust/SKAUST-K UET 2026 Syllabus.pdf' },
    { title: 'B.Sc Nursing Syllabus', type: 'syllabus', exam: 'jkbopee',      class: 'Undergraduate', fileUrl: '/assets/syllabus/jkbopee bsc nursing/JKBOPEE B.Sc Nursing Entrance Syllabus 2026.pdf' },
    { title: 'KAS Prelims & Mains',   type: 'syllabus', exam: 'jkpsc',        class: 'General',       fileUrl: '/assets/syllabus/jkpsc kas/JKPSC KAS Syllabus 2026.pdf' },
    { title: 'UPSC IAS Syllabus',     type: 'syllabus', exam: 'upsc-ias',     class: 'General',       fileUrl: '/assets/syllabus/upsc ias/UPSC IAS Syllabus 2026.pdf' },
  ];
}

// ─── MAIN SEED FUNCTION ─────────────────────────────────────────────

async function seedPyqSyllabus() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // 1. Upsert Categories
    console.log('📁 Seeding Categories...');
    let catCreated = 0, catUpdated = 0;
    for (const cat of categories) {
      const result = await Category.findOneAndUpdate(
        { id: cat.id },
        { $set: cat },
        { upsert: true, new: true }
      );
      if (result.createdAt && result.updatedAt && 
          Math.abs(result.createdAt.getTime() - result.updatedAt.getTime()) < 1000) {
        catCreated++;
      } else {
        catUpdated++;
      }
    }
    console.log(`   ✅ ${catCreated} created, ${catUpdated} updated\n`);

    // 2. Seed PYQ Resources
    console.log('📄 Seeding PYQ Resources...');
    const pyqResources = generatePyqResources();
    let pyqCreated = 0, pyqSkipped = 0;
    for (const r of pyqResources) {
      const exists = await Resource.findOne({ fileUrl: r.fileUrl, type: 'pyq' });
      if (exists) {
        pyqSkipped++;
      } else {
        await Resource.create(r);
        pyqCreated++;
      }
    }
    console.log(`   ✅ ${pyqCreated} created, ${pyqSkipped} already existed\n`);

    // 3. Seed Syllabus Resources
    console.log('📚 Seeding Syllabus Resources...');
    const syllabusResources = generateSyllabusResources();
    let sylCreated = 0, sylSkipped = 0;
    for (const r of syllabusResources) {
      const exists = await Resource.findOne({ fileUrl: r.fileUrl, type: 'syllabus' });
      if (exists) {
        sylSkipped++;
      } else {
        await Resource.create(r);
        sylCreated++;
      }
    }
    console.log(`   ✅ ${sylCreated} created, ${sylSkipped} already existed\n`);

    // Summary
    console.log('═══════════════════════════════════════');
    console.log(`✅ Seed complete!`);
    console.log(`   Categories: ${catCreated + catUpdated}`);
    console.log(`   PYQ Papers: ${pyqCreated} new`);
    console.log(`   Syllabi:    ${sylCreated} new`);
    console.log('═══════════════════════════════════════');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
}

seedPyqSyllabus();
