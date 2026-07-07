import mammoth from 'mammoth';
import fs from 'fs';

async function test() {
    const buffer = fs.readFileSync('/storage/emulated/0/e-library/public/Media/Exams/English/2026 NED MOCK JCE ENG P1.docx');
    const result = await mammoth.extractRawText({ buffer: buffer });
    const text = result.value;

    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    const sectionAStart = lines.findIndex(l => l.includes('Section A'));
    const sectionBStart = lines.findIndex(l => l.includes('SECTION B'));
    
    const relevantLines = lines.slice(sectionAStart + 1, sectionBStart > -1 ? sectionBStart : lines.length);
    
    const questions = [];
    for (let i = 0; i < relevantLines.length; i++) {
        const line = relevantLines[i];
        
        // Skip headers
        if (line.match(/^(Questions?|Choose|Answer|In each|Section)/i)) continue;
        if (line.length < 5) continue; // Skip very short lines/artifacts

        if (i + 4 < relevantLines.length) {
            const opts = [relevantLines[i+1], relevantLines[i+2], relevantLines[i+3], relevantLines[i+4]];
            // Heuristic: options are usually shorter than 100, and there's no 5th option that looks similar
            if (opts.every(o => o.length < 100 && !o.match(/^(Questions?|Choose|Answer|In each|Section)/i))) {
                questions.push({
                    question: line,
                    options: opts
                });
                i += 4; // Skip the options
            }
        }
    }
    
    console.log(`Found ${questions.length} questions.`);
    questions.forEach((q, idx) => {
        console.log(`${idx + 1}. ${q.question}`);
        q.options.forEach((o, oIdx) => console.log(`   ${String.fromCharCode(65+oIdx)}. ${o}`));
    });
}

test();
