import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    try {
        // The SDK doesn't always have a direct listModels, but we can try a dummy call
        // or check common names. Let's try gemini-1.5-flash-latest.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("test");
        console.log("gemini-1.5-flash works!");
    } catch (e) {
        console.error("Error with gemini-1.5-flash:", e.message);
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
            await model.generateContent("test");
            console.log("gemini-1.5-flash-latest works!");
        } catch (e2) {
            console.error("Error with gemini-1.5-flash-latest:", e2.message);
        }
    }
}
listModels();
