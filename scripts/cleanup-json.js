import fs from 'fs';
import path from 'path';

const filePath = '/storage/emulated/0/e-library/public/quiz-data.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const filteredData = data.filter(q => q.source !== '2026 NED MOCK JCE ENG P1.docx');

fs.writeFileSync(filePath, JSON.stringify(filteredData, null, 2));
console.log(`Removed ${data.length - filteredData.length} questions.`);
