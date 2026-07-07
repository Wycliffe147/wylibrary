import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || ""; 

async function extractQuestionsWithAI(text, source) {
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing");
    
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
    Extract all multiple-choice questions (MCQs) from the following exam text.
    The text is from a file named: ${source}.
    
    CRITICAL RULES:
    1. Preserve HTML formatting tags like <u> (underlines) and <strong> (bold) in the question text and options.
    2. Each question must have exactly 4 options.
    3. Return ONLY a valid JSON array of objects.
    4. Each object must have these fields:
       "topic": "English Grammar"
       "question": "The text of the question with <u>underlines</u> if present"
       "options": ["Option A", "Option B", "Option C", "Option D"]
       "answer": 0 (The index 0-3 of the correct answer. Use your knowledge to solve them.)
       "explanation": "A short 1-2 sentence explanation of why the answer is correct."
       "source": "${source}"

    TEXT TO PARSE:
    ${text}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResult = response.text();
        // Clean up markdown code blocks if present
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(textResult);
    } catch (e) {
        console.error("AI Extraction Error:", e.message);
        return [];
    }
}

async function run() {
    const examFilePath = 'public/Media/Exams/English/2026 NED MOCK JCE ENG P1.docx';
    const buffer = fs.readFileSync(examFilePath);
    const result = await mammoth.convertToHtml({ buffer });
    let html = result.value;
    html = html.replace(/<\/p>/g, '\n');
    html = html.replace(/<(?!u|b|i|strong|em|\/u|\/b|\/i|\/strong|\/em)[^>]+>/g, '');

    console.log("Extracting 20 questions with AI (preserving underlines)...");
    const questions = await extractQuestionsWithAI(html, path.basename(examFilePath));
    
    console.log(`AI found ${questions.length} questions.`);

    const quizDataPath = path.join(projectRoot, 'public', 'quiz-data.json');
    let data = fs.existsSync(quizDataPath) ? JSON.parse(fs.readFileSync(quizDataPath, 'utf8')) : [];

    // Clear existing questions from this source first to avoid duplicates/formatting mix
    data = data.filter(q => q.source !== path.basename(examFilePath));

    questions.forEach(nq => data.push(nq));

    fs.writeFileSync(quizDataPath, JSON.stringify(data, null, 2));
    console.log(`Saved ${questions.length} questions to quiz-data.json.`);
}

run();
