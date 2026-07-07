import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

async function extractText(filePath) {
    const buffer = fs.readFileSync(filePath);
    const result = await mammoth.extractRawText({ buffer: buffer });
    return result.value;
}

function parseMCQs(text) {
    const questions = [];
    const allLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const sectionAIndex = allLines.findIndex(l => l.match(/^Section\s+A/i));
    const sectionBIndex = allLines.findIndex(l => l.match(/^SECTION\s+B/i));
    
    const lines = allLines.slice(
        sectionAIndex !== -1 ? sectionAIndex + 1 : 0,
        sectionBIndex !== -1 ? sectionBIndex : allLines.length
    );

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.match(/^(Questions?|Section|Instructions?|Answer all|Choose the|In each|Turn over|PAPER I|Subject Number|Friday,|Time allowed:|Turn over|Questions \d+ to \d+)/i)) continue;
        if (line.length < 5) continue;
        if (line.match(/^[A-D](\.|\s|–|-)/i)) continue;

        let potentialOpts = [];
        let lookAhead = 1;
        while (potentialOpts.length < 4 && (i + lookAhead) < lines.length) {
            const nextLine = lines[i + lookAhead];
            if (nextLine.match(/^(Questions?|Section|Instructions?|Answer all|Choose the|In each|Turn over|PAPER I|Questions \d+ to \d+)/i)) break;
            potentialOpts.push(nextLine);
            lookAhead++;
        }

        if (potentialOpts.length === 4) {
            questions.push({ question: line });
            i += (lookAhead - 1);
        }
    }
    return questions;
}

async function run() {
    const examText = await extractText('public/Media/Exams/English/2026 NED MOCK JCE ENG P1.docx');
    const questions = parseMCQs(examText);
    console.log(`TOTAL QUESTIONS FOUND: ${questions.length}`);
    questions.forEach((q, idx) => console.log(`${idx + 1}. ${q.question.substring(0, 60)}...`));
}

run();
