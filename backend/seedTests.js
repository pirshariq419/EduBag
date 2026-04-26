const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Test = require('./models/Test');

dotenv.config();

const tests = [
  {
    title: "NEET Biology Foundation Test",
    type: "Chapter-wise",
    exam: "NEET",
    subject: "Biology",
    durationMinutes: 20,
    questions: [
      {
        questionText: "Which of the following is known as the powerhouse of the cell?",
        options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi Body"],
        correctAnswerIndex: 1,
        explanation: "Mitochondria are known as the powerhouse of the cell because they generate ATP."
      },
      {
        questionText: "The function of ribosomes is:",
        options: ["Lipid synthesis", "Protein synthesis", "Photosynthesis", "Respiration"],
        correctAnswerIndex: 1,
        explanation: "Ribosomes are the sites of protein synthesis in the cell."
      },
      {
        questionText: "Who discovered the cell for the first time?",
        options: ["Robert Brown", "Robert Hooke", "Leeuwenhoek", "Purkinje"],
        correctAnswerIndex: 1,
        explanation: "Robert Hooke discovered the cell in 1665 while observing a cork slice."
      },
      {
        questionText: "Which organelle contains digestive enzymes?",
        options: ["Lysosome", "Vacuole", "Plastid", "ER"],
        correctAnswerIndex: 0,
        explanation: "Lysosomes contain hydrolytic enzymes and are known as suicidal bags."
      },
      {
        questionText: "Plant cell wall is mainly composed of:",
        options: ["Protein", "Cellulose", "Lipid", "Starch"],
        correctAnswerIndex: 1,
        explanation: "The plant cell wall is a rigid layer made primarily of cellulose."
      },
      {
        questionText: "Photosynthesis occurs in:",
        options: ["Mitochondria", "Chloroplast", "Leucoplast", "Chromoplast"],
        correctAnswerIndex: 1,
        explanation: "Chloroplasts are the sites where photosynthesis takes place in plants."
      },
      {
        questionText: "The genetic material of a prokaryotic cell is found in:",
        options: ["Nucleus", "Nucleoid", "Nucleolus", "Cytoplasm"],
        correctAnswerIndex: 1,
        explanation: "Prokaryotes lack a defined nucleus; their DNA is found in a region called the nucleoid."
      },
      {
        questionText: "Which of the following is a unicellular organism?",
        options: ["Amoeba", "Mushroom", "Hydra", "Earthworm"],
        correctAnswerIndex: 0,
        explanation: "Amoeba is a single-celled eukaryotic organism."
      },
      {
        questionText: "The process of cell division that results in four daughter cells is:",
        options: ["Mitosis", "Meiosis", "Amitosis", "Binary Fission"],
        correctAnswerIndex: 1,
        explanation: "Meiosis is a reductional division resulting in four haploid daughter cells."
      },
      {
        questionText: "DNA is primarily found in which part of the cell?",
        options: ["Cytoplasm", "Ribosome", "Nucleus", "Cell Wall"],
        correctAnswerIndex: 2,
        explanation: "Most of the cell's DNA is located in the nucleus."
      },
      {
        questionText: "Which pigment gives green color to plants?",
        options: ["Hemoglobin", "Chlorophyll", "Carotene", "Xanthophyll"],
        correctAnswerIndex: 1,
        explanation: "Chlorophyll is the green pigment responsible for absorbing light during photosynthesis."
      },
      {
        questionText: "The study of tissues is called:",
        options: ["Cytology", "Histology", "Morphology", "Anatomy"],
        correctAnswerIndex: 1,
        explanation: "Histology is the branch of biology that studies the microscopic structure of tissues."
      },
      {
        questionText: "Which human organ system is responsible for the transport of nutrients?",
        options: ["Digestive", "Respiratory", "Circulatory", "Excretory"],
        correctAnswerIndex: 2,
        explanation: "The circulatory system transports oxygen, nutrients, and hormones throughout the body."
      },
      {
        questionText: "Bile is produced by which organ?",
        options: ["Stomach", "Pancreas", "Liver", "Gallbladder"],
        correctAnswerIndex: 2,
        explanation: "Bile is produced by the liver and stored in the gallbladder."
      },
      {
        questionText: "The functional unit of the kidney is:",
        options: ["Neuron", "Nephron", "Alveoli", "Villi"],
        correctAnswerIndex: 1,
        explanation: "The nephron is the structural and functional unit of the kidney responsible for filtration."
      }
    ]
  },
  {
    title: "JEE Physics & Maths Quick Test",
    type: "Chapter-wise",
    exam: "JEE",
    subject: "Physics/Maths",
    durationMinutes: 30,
    questions: [
      {
        questionText: "The SI unit of force is:",
        options: ["Watt", "Joule", "Newton", "Pascal"],
        correctAnswerIndex: 2,
        explanation: "Newton (N) is the SI unit of force."
      },
      {
        questionText: "Value of sin(90°) is:",
        options: ["0", "1", "1/2", "Undefined"],
        correctAnswerIndex: 1,
        explanation: "The value of sine at 90 degrees is exactly 1."
      },
      {
        questionText: "If the velocity of an object is constant, its acceleration is:",
        options: ["Positive", "Negative", "Zero", "Constant but non-zero"],
        correctAnswerIndex: 2,
        explanation: "Acceleration is the rate of change of velocity. If velocity is constant, acceleration is zero."
      },
      {
        questionText: "The derivative of x^2 is:",
        options: ["x", "2x", "2", "x^3/3"],
        correctAnswerIndex: 1,
        explanation: "Using the power rule d/dx(x^n) = nx^(n-1), the derivative of x^2 is 2x."
      },
      {
        questionText: "Light year is a unit of:",
        options: ["Time", "Distance", "Speed", "Intensity"],
        correctAnswerIndex: 1,
        explanation: "A light year is the distance light travels in one year."
      },
      {
        questionText: "Escape velocity from the Earth's surface is approximately:",
        options: ["9.8 km/s", "11.2 km/s", "7.9 km/s", "15 km/s"],
        correctAnswerIndex: 1,
        explanation: "The escape velocity for Earth is about 11.2 kilometers per second."
      },
      {
        questionText: "The integral of cos(x) dx is:",
        options: ["sin(x) + C", "-sin(x) + C", "cos(x) + C", "tan(x) + C"],
        correctAnswerIndex: 0,
        explanation: "The integral of cos(x) is sin(x) plus a constant of integration."
      },
      {
        questionText: "Ohm's Law is defined as:",
        options: ["V = IR", "P = VI", "F = ma", "E = mc^2"],
        correctAnswerIndex: 0,
        explanation: "Ohm's Law states that Voltage (V) = Current (I) × Resistance (R)."
      },
      {
        questionText: "The square root of 625 is:",
        options: ["15", "25", "35", "45"],
        correctAnswerIndex: 1,
        explanation: "25 * 25 = 625."
      },
      {
        questionText: "Which of the following is a scalar quantity?",
        options: ["Velocity", "Force", "Work", "Acceleration"],
        correctAnswerIndex: 2,
        explanation: "Work is a scalar quantity because it has only magnitude, not direction."
      },
      {
        questionText: "Sum of angles in a triangle is:",
        options: ["90°", "180°", "360°", "270°"],
        correctAnswerIndex: 1,
        explanation: "The internal angles of a triangle always sum up to 180 degrees."
      },
      {
        questionText: "Absolute zero temperature is:",
        options: ["0°C", "-273.15°C", "-100°C", "273.15°C"],
        correctAnswerIndex: 1,
        explanation: "Absolute zero is 0 Kelvin, which is -273.15 degrees Celsius."
      },
      {
        questionText: "The log of 1 to any base is:",
        options: ["1", "0", "Base itself", "Infinity"],
        correctAnswerIndex: 1,
        explanation: "Log(1) is always 0 for any positive base."
      },
      {
        questionText: "The first law of thermodynamics is a statement of:",
        options: ["Conservation of mass", "Conservation of energy", "Conservation of momentum", "Entropy"],
        correctAnswerIndex: 1,
        explanation: "The first law of thermodynamics is essentially the law of conservation of energy."
      },
      {
        questionText: "Value of π (Pi) is approximately:",
        options: ["3.14", "3.41", "2.14", "4.13"],
        correctAnswerIndex: 0,
        explanation: "Pi is approximately 3.14159..."
      }
    ]
  },
  {
    title: "JKSSB General Awareness Mock",
    type: "Full-Length",
    exam: "JKSSB",
    subject: "General Knowledge",
    durationMinutes: 15,
    questions: [
      {
        questionText: "Which is the summer capital of Jammu and Kashmir?",
        options: ["Jammu", "Srinagar", "Leh", "Udhampur"],
        correctAnswerIndex: 1,
        explanation: "Srinagar is the summer capital, while Jammu is the winter capital."
      },
      {
        questionText: "Which river is known as the 'Vitasta' in ancient scriptures?",
        options: ["Chenab", "Jhelum", "Indus", "Tawi"],
        correctAnswerIndex: 1,
        explanation: "The Jhelum river is referred to as Vitasta in the Rigveda."
      },
      {
        questionText: "Wular Lake is located in which district of J&K?",
        options: ["Srinagar", "Bandipora", "Baramulla", "Ganderbal"],
        correctAnswerIndex: 1,
        explanation: "Wular Lake, one of the largest freshwater lakes in Asia, is in Bandipora district."
      },
      {
        questionText: "Who was the last ruling Maharaja of Jammu and Kashmir?",
        options: ["Gulab Singh", "Hari Singh", "Pratap Singh", "Ranbir Singh"],
        correctAnswerIndex: 1,
        explanation: "Maharaja Hari Singh was the last ruling monarch of the princely state of J&K."
      },
      {
        questionText: "Which pass connects Jammu with Srinagar?",
        options: ["Zojila Pass", "Banihal Pass", "Khardung La", "Rohtang Pass"],
        correctAnswerIndex: 1,
        explanation: "The Banihal Pass (now bypassable via the Chenani-Nashri and Banihal-Qazigund tunnels) connects the two regions."
      },
      {
        questionText: "The famous Mughal Garden 'Shalimar Bagh' was built by:",
        options: ["Akbar", "Shah Jahan", "Jahangir", "Babur"],
        correctAnswerIndex: 2,
        explanation: "Shalimar Bagh was built by Emperor Jahangir for his wife Nur Jahan in 1619."
      },
      {
        questionText: "Which town in J&K is known as the 'Apple Town'?",
        options: ["Sopore", "Anantnag", "Shopian", "Pulwama"],
        correctAnswerIndex: 0,
        explanation: "Sopore is widely known as the Apple Town of Kashmir due to its large fruit mandis."
      },
      {
        questionText: "The treaty of Amritsar was signed in which year?",
        options: ["1840", "1846", "1850", "1836"],
        correctAnswerIndex: 1,
        explanation: "The Treaty of Amritsar was signed on March 16, 1846."
      },
      {
        questionText: "Which power project is built on the Chenab river?",
        options: ["Uri", "Salal", "Lower Jhelum", "Upper Sindh"],
        correctAnswerIndex: 1,
        explanation: "Salal Hydroelectric Power Station is built on the Chenab river in Reasi district."
      },
      {
        questionText: "Hemis National Park is famous for which animal?",
        options: ["Hangul", "Snow Leopard", "Black Bear", "Markhor"],
        correctAnswerIndex: 1,
        explanation: "Hemis National Park in Ladakh is world-famous for its Snow Leopards."
      },
      {
        questionText: "Which ruler built the Hari Parbat Fort?",
        options: ["Akbar", "Zain-ul-Abidin", "Atta Muhammad Khan", "Gulab Singh"],
        correctAnswerIndex: 2,
        explanation: "While Akbar built the outer wall, the current fort structure was built by Atta Muhammad Khan, an Afghan governor."
      },
      {
        questionText: "The 'Martand Sun Temple' is located in which district?",
        options: ["Srinagar", "Anantnag", "Kulgam", "Budgam"],
        correctAnswerIndex: 1,
        explanation: "The Martand Sun Temple is located near Anantnag."
      },
      {
        questionText: "Which fruit is J&K the largest producer of in India?",
        options: ["Mango", "Apple", "Banana", "Orange"],
        correctAnswerIndex: 1,
        explanation: "J&K is the leading producer of apples in India."
      },
      {
        questionText: "The 'Kheer Bhawani' temple is dedicated to which Goddess?",
        options: ["Durga", "Ragnya Devi", "Lakshmi", "Saraswati"],
        correctAnswerIndex: 1,
        explanation: "Kheer Bhawani is a famous Hindu temple dedicated to the Goddess Ragnya Devi."
      },
      {
        questionText: "Which district of J&K is known as the 'District of Lakes'?",
        options: ["Srinagar", "Ganderbal", "Poonch", "Reasi"],
        correctAnswerIndex: 1,
        explanation: "Ganderbal is often referred to as the district of lakes due to the presence of Manasbal and other high-altitude lakes."
      }
    ]
  },
  {
    title: "CUET General Awareness Practice",
    type: "Full-Length",
    exam: "CUET",
    subject: "General Awareness",
    durationMinutes: 15,
    questions: [
      {
        questionText: "Who is the current President of India?",
        options: ["Ram Nath Kovind", "Droupadi Murmu", "Narendra Modi", "Jagdeep Dhankhar"],
        correctAnswerIndex: 1,
        explanation: "Droupadi Murmu is the 15th and current President of India."
      },
      {
        questionText: "The headquarters of ISRO is located in:",
        options: ["Mumbai", "Bengaluru", "Chennai", "New Delhi"],
        correctAnswerIndex: 1,
        explanation: "The Indian Space Research Organisation is headquartered in Bengaluru."
      },
      {
        questionText: "Which is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Pacific", "Arctic"],
        correctAnswerIndex: 2,
        explanation: "The Pacific Ocean is the largest and deepest of Earth's oceanic divisions."
      },
      {
        questionText: "The currency of Japan is:",
        options: ["Yuan", "Yen", "Won", "Dollar"],
        correctAnswerIndex: 1,
        explanation: "The Yen is the official currency of Japan."
      },
      {
        questionText: "Who won the FIFA World Cup 2022?",
        options: ["France", "Argentina", "Brazil", "Germany"],
        correctAnswerIndex: 1,
        explanation: "Argentina won the 2022 FIFA World Cup by defeating France."
      },
      {
        questionText: "The smallest state in India by area is:",
        options: ["Sikkim", "Goa", "Tripura", "Manipur"],
        correctAnswerIndex: 1,
        explanation: "Goa is India's smallest state by area."
      },
      {
        questionText: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswerIndex: 1,
        explanation: "Mars is often called the Red Planet due to iron oxide on its surface."
      },
      {
        questionText: "Who is known as the 'Father of the Indian Constitution'?",
        options: ["Mahatma Gandhi", "B.R. Ambedkar", "Jawaharlal Nehru", "Sardar Patel"],
        correctAnswerIndex: 1,
        explanation: "Dr. B.R. Ambedkar was the chairman of the drafting committee."
      },
      {
        questionText: "The longest river in the world is:",
        options: ["Amazon", "Nile", "Ganges", "Yangtze"],
        correctAnswerIndex: 1,
        explanation: "The Nile is generally considered the longest river in the world."
      },
      {
        questionText: "Which country is called the 'Land of the Rising Sun'?",
        options: ["China", "Japan", "Norway", "Australia"],
        correctAnswerIndex: 1,
        explanation: "Japan is known as the Land of the Rising Sun."
      },
      {
        questionText: "The World Environment Day is celebrated on:",
        options: ["June 5", "April 22", "May 1", "December 1"],
        correctAnswerIndex: 0,
        explanation: "World Environment Day is observed every year on June 5."
      },
      {
        questionText: "Who wrote 'Discovery of India'?",
        options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Rabindranath Tagore", "Subhash Chandra Bose"],
        correctAnswerIndex: 1,
        explanation: "Jawaharlal Nehru wrote the book during his imprisonment."
      },
      {
        questionText: "Giddha is a folk dance of which state?",
        options: ["Haryana", "Punjab", "Rajasthan", "Gujarat"],
        correctAnswerIndex: 1,
        explanation: "Giddha is a popular folk dance of women in the Punjab region."
      },
      {
        questionText: "The first Indian woman to win an Olympic medal was:",
        options: ["Saina Nehwal", "Karnam Malleswari", "P.V. Sindhu", "Mary Kom"],
        correctAnswerIndex: 1,
        explanation: "Karnam Malleswari won a bronze medal in weightlifting at the 2000 Sydney Olympics."
      },
      {
        questionText: "Which gas is most abundant in Earth's atmosphere?",
        options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Argon"],
        correctAnswerIndex: 1,
        explanation: "Nitrogen makes up about 78% of the Earth's atmosphere."
      }
    ]
  }
];

const seedDB = async () => {
  try {
    await Test.deleteMany({});
    await Test.insertMany(tests);
    console.log('Mock tests seeded successfully!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

mongoose.connect(process.env.MONGO_URI)
  .then(() => seedDB())
  .catch(err => console.error(err));
