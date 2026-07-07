import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("SUCCESS with gemini-1.5-flash");
    } catch (e) {
        console.log("FAILED with gemini-1.5-flash:", e.message);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent("Hi");
            console.log("SUCCESS with gemini-pro");
        } catch (e2) {
            console.log("FAILED with gemini-pro:", e2.message);
        }
    }
}
test();
