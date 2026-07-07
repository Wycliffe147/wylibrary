import mammoth from 'mammoth';
import fs from 'fs';

async function test() {
    const buffer = fs.readFileSync('/storage/emulated/0/e-library/public/Media/Exams/English/2026 NED MOCK JCE ENG P1.docx');
    const result = await mammoth.extractRawText({ buffer: buffer });
    console.log(result.value);
}

test();
