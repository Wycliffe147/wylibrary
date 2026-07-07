import AdmZip from 'adm-zip';
import fs from 'fs';

export async function extractDocxWithUnderlines(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
    }

    const zip = new AdmZip(filePath);
    const contentXml = zip.readAsText("word/document.xml");

    // We need to parse the XML. A regex approach on <w:p> and <w:r> is robust for this task.
    // Each <w:p> is a paragraph.
    // Each <w:r> is a "run" (a segment of text with shared formatting).
    
    const paragraphs = contentXml.match(/<w:p\b[^>]*>.*?<\/w:p>/g) || [];
    let fullText = "";

    for (const p of paragraphs) {
        let pText = "";
        const runs = p.match(/<w:r\b[^>]*>.*?<\/w:r>/g) || [];
        
        for (const r of runs) {
            // Check if this run is underlined
            const isUnderlined = /<w:u\b[^>]*\/>/.test(r);
            
            // Extract the text content from <w:t> tags
            // Note: <w:t> can have xml:space="preserve"
            const texts = r.match(/<w:t\b[^>]*>(.*?)<\/w:t>/g) || [];
            let rText = "";
            for (const t of texts) {
                const val = t.replace(/<w:t\b[^>]*>/, '').replace(/<\/w:t>/, '');
                // Handle basic entities
                rText += val.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
            }

            if (isUnderlined && rText.trim().length > 0) {
                pText += `<u>${rText}</u>`;
            } else {
                pText += rText;
            }
        }
        
        if (pText.trim().length > 0) {
            fullText += pText + "\n";
        }
    }

    return fullText;
}

// Simple CLI test
if (process.argv[1].endsWith('docx-extractor.js')) {
    const file = process.argv[2];
    if (file) {
        extractDocxWithUnderlines(file).then(text => {
            console.log("--- EXTRACTED TEXT START ---");
            console.log(text);
            console.log("--- EXTRACTED TEXT END ---");
        }).catch(err => console.error(err));
    }
}
