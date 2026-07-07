import mammoth from 'mammoth';
import fs from 'fs';

async function test() {
    const buffer = fs.readFileSync('/storage/emulated/0/e-library/public/Media/Exams/English/2026 NED MOCK JCE ENG P1.docx');
    const result = await mammoth.extractRawText({ buffer: buffer });
    const text = result.value;

    const allLines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    
    allLines.forEach((l, i) => {
        if (l.match(/Section [A-B]/i)) {
            console.log(`${i}: "${l}"`);
        }
    });
}

test();
