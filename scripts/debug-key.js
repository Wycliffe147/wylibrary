import mammoth from 'mammoth';
import fs from 'fs';

async function test() {
    const buffer = fs.readFileSync('/storage/emulated/0/e-library/public/Media/Exams/English/Marking Keys/2026 NED MOCK  ENG P1  MARKING KEY.docx');
    const result = await mammoth.extractRawText({ buffer: buffer });
    console.log(result.value);
}

test();
