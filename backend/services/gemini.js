const { GoogleGenAI } = require('@google/genai');
const ErrorResponse = require('../utils/errorResponse');

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Exam-specific system prompts for accurate question generation
const EXAM_CONTEXTS = {
  'JKBOSE': `You are an expert question paper setter for the Jammu & Kashmir Board of School Education (JKBOSE). 
Generate questions based on the JKBOSE curriculum for Class 10/12 students. 
Questions should align with J&K state board textbooks and syllabus patterns.
Focus on NCERT-based content adapted for JKBOSE examination standards.`,

  'NEET UG': `You are an expert question paper setter for NEET UG (National Eligibility cum Entrance Test - Undergraduate).
Generate questions strictly based on NCERT Class 11 and 12 syllabus for Physics, Chemistry, and Biology.
Questions should match NEET UG exam patterns — conceptual clarity, application-based, and competitive level.
Include questions on numerical problems where applicable.`,

  'NEET PG': `You are an expert question paper setter for NEET PG (National Eligibility cum Entrance Test - Postgraduate).
Generate clinical and theoretical questions suitable for medical postgraduate entrance.
Questions should test clinical reasoning, pathophysiology, pharmacology, and diagnostic skills.
Include case-based and scenario-based questions.`,

  'JEE Mains': `You are an expert question paper setter for JEE Mains (Joint Entrance Examination - Main).
Generate questions based on NCERT Class 11 and 12 syllabus for Physics, Chemistry, and Mathematics.
Questions should be at JEE Mains difficulty — moderate to challenging, testing conceptual understanding and problem-solving.
Include numerical-answer-type patterns where applicable.`,

  'JEE Advanced': `You are an expert question paper setter for JEE Advanced.
Generate highly challenging questions for Physics, Chemistry, and Mathematics at IIT entrance level.
Questions should require multi-step reasoning, deep conceptual understanding, and advanced problem-solving.
Focus on tricky and non-routine problems that test analytical thinking.`,

  'JKBOPEE': `You are an expert question paper setter for JKBOPEE (J&K Board of Professional Entrance Examinations).
Generate questions for nursing, paramedical, and allied health science entrance examinations in J&K.
Questions should cover Biology, Chemistry, Physics, and General Knowledge at intermediate level.
Keep questions accessible but examination-oriented.`,

  'CUET': `You are an expert question paper setter for CUET (Common University Entrance Test).
Generate questions based on the CUET exam pattern for central university admissions.
Questions can cover domain subjects (Science, Commerce, Humanities), General Test, and Languages.
Match the moderate difficulty level of CUET with focus on comprehension and application.`,

  'SKAUST-K UET': `You are an expert question paper setter for SKAUST-K UET (Sher-e-Kashmir University of Agricultural Sciences and Technology entrance test).
Generate questions for agricultural science and technology entrance at undergraduate level.
Cover Biology, Chemistry, Physics, Agriculture basics, and General Knowledge.
Questions should be at the 10+2 to undergraduate level.`
};

// Difficulty calibration instructions
const DIFFICULTY_INSTRUCTIONS = {
  'Easy': 'Generate straightforward questions that test direct recall and basic understanding. Students with a decent grasp of the topic should answer correctly.',
  'Medium': 'Generate moderate-difficulty questions that require application of concepts and some analytical thinking. These should challenge average students.',
  'Hard': 'Generate challenging questions that require multi-step reasoning, deep understanding, and ability to apply concepts in unfamiliar contexts. Only well-prepared students should answer correctly.'
};

// JSON Schema for structured output enforcement
const QUESTION_SCHEMA = {
  type: 'ARRAY',
  items: {
    type: 'OBJECT',
    properties: {
      questionText: {
        type: 'STRING',
        description: 'The complete question text. Must be clear, unambiguous, and self-contained.'
      },
      options: {
        type: 'ARRAY',
        items: { type: 'STRING' },
        description: 'Exactly 4 answer options. Each must be distinct and plausible.'
      },
      correctAnswerIndex: {
        type: 'INTEGER',
        description: 'The 0-based index of the correct option (0, 1, 2, or 3).'
      },
      explanation: {
        type: 'STRING',
        description: 'A clear, concise explanation of why the correct answer is right and why other options are wrong.'
      }
    },
    required: ['questionText', 'options', 'correctAnswerIndex', 'explanation']
  }
};

/**
 * Generate MCQ questions using Gemini 2.5 Flash
 * @param {string} exam - Target exam (e.g., 'NEET UG', 'JEE Mains')
 * @param {string} subject - Subject (e.g., 'Physics', 'Chemistry')
 * @param {string} topic - Optional specific topic/chapter
 * @param {number} count - Number of questions to generate (5-50)
 * @param {string} difficulty - Easy, Medium, or Hard
 * @returns {Array} Array of question objects
 */
async function generateQuestions(exam, subject, topic, count = 10, difficulty = 'Medium') {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new ErrorResponse('Gemini API key is not configured. Add GEMINI_API_KEY to your .env file.', 500);
  }

  const examContext = EXAM_CONTEXTS[exam] || EXAM_CONTEXTS['CUET']; // fallback to CUET for unknown exams
  const difficultyGuide = DIFFICULTY_INSTRUCTIONS[difficulty] || DIFFICULTY_INSTRUCTIONS['Medium'];

  const topicClause = topic ? `Focus specifically on the topic: "${topic}".` : 'Cover a diverse range of topics within the subject.';

  const prompt = `${examContext}

SUBJECT: ${subject}
${topicClause}
DIFFICULTY LEVEL: ${difficulty}
${difficultyGuide}

Generate exactly ${count} unique multiple-choice questions (MCQs) for the above exam and subject.

RULES:
1. Each question MUST have exactly 4 options labeled in the array (index 0-3).
2. Exactly ONE option must be correct — set its index as correctAnswerIndex (0, 1, 2, or 3).
3. All 4 options must be plausible — avoid obviously wrong distractors.
4. No two questions should test the exact same concept.
5. Questions should be diverse — mix conceptual, numerical, and application-based where appropriate.
6. Explanations should be clear and educational — explain WHY the correct answer is right.
7. Do NOT include question numbering in the questionText — just the question itself.
8. Ensure all content is factually accurate and up-to-date.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: QUESTION_SCHEMA,
        temperature: 0.7, // Balanced creativity vs accuracy
      }
    });

    const text = response.text;
    if (!text) {
      throw new ErrorResponse('Gemini returned an empty response. Please try again.', 502);
    }

    let questions;
    try {
      questions = JSON.parse(text);
    } catch (parseErr) {
      console.error('Gemini JSON parse error:', text.substring(0, 500));
      throw new ErrorResponse('Gemini returned invalid JSON. Please try again.', 502);
    }

    // Validate the response
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new ErrorResponse('Gemini returned no questions. Please try again.', 502);
    }

    // Cap at requested count (safety)
    if (questions.length > count) {
      questions = questions.slice(0, count);
    }

    // Validate each question
    const validQuestions = questions.filter(q => {
      if (!q.questionText || typeof q.questionText !== 'string' || q.questionText.trim() === '') return false;
      if (!Array.isArray(q.options) || q.options.length !== 4) return false;
      if (q.options.some(opt => typeof opt !== 'string' || opt.trim() === '')) return false;
      if (typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) return false;
      if (!q.explanation || typeof q.explanation !== 'string') {
        q.explanation = 'No explanation provided.';
      }
      return true;
    });

    if (validQuestions.length === 0) {
      throw new ErrorResponse('Gemini generated questions but none passed validation. Please try again.', 502);
    }

    return validQuestions;

  } catch (error) {
    // Re-throw our own errors
    if (error instanceof ErrorResponse) throw error;

    // Handle Gemini API errors
    const message = error.message || 'Unknown Gemini error';

    if (message.includes('API_KEY') || message.includes('permission') || message.includes('403')) {
      throw new ErrorResponse('Invalid Gemini API key. Check your GEMINI_API_KEY in .env.', 401);
    }
    if (message.includes('quota') || message.includes('rate') || message.includes('429')) {
      throw new ErrorResponse('Gemini rate limit exceeded. Please wait a moment and try again.', 429);
    }
    if (message.includes('timeout') || message.includes('DEADLINE')) {
      throw new ErrorResponse('Gemini request timed out. Try fewer questions or a simpler topic.', 504);
    }

    console.error('Gemini generation error:', error);
    throw new ErrorResponse(`AI generation failed: ${message}`, 500);
  }
}

/**
 * Chat with EduBot using Gemini 2.5 Flash
 * @param {Array} history - Array of { role: 'user' | 'bot', text: string }
 * @param {Object} userProfile - User details
 * @returns {string} The AI response
 */
async function chatWithEduBot(history, userProfile) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    throw new ErrorResponse('Gemini API key is not configured.', 500);
  }

  const systemInstruction = `You are EduBot, an expert academic tutor for EduBag.
You help students prepare for Indian competitive exams like JEE, NEET, JKBOSE, CUET, etc.
The user you are talking to is named ${userProfile.name || 'Student'}.
RULES:
1. Be encouraging, concise, and academically rigorous.
2. If asked to explain a concept, explain it clearly using simple analogies.
3. If asked about non-academic topics (like writing code, writing essays on random topics, or general chit-chat), politely decline and say you only help with exam preparation and academics.
4. Use markdown formatting to make your responses readable (bullet points, bold text for key terms).
5. DO NOT provide links.
`;

  // Format history for Gemini (requires { role: 'user' | 'model', parts: [{ text: ... }] })
  const contents = history.map(msg => ({
    role: msg.role === 'bot' ? 'model' : 'user',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    const text = response.text;
    if (!text) {
      throw new ErrorResponse('EduBot is currently unavailable. Please try again later.', 502);
    }

    return text;
  } catch (error) {
    if (error instanceof ErrorResponse) throw error;
    console.error('EduBot generation error:', error);
    throw new ErrorResponse('EduBot failed to respond. Please try again.', 500);
  }
}

module.exports = { generateQuestions, EXAM_CONTEXTS, chatWithEduBot };
