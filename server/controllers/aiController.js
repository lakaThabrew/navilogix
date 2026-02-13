
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // Use the Gemini model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate content with context
        const context = "You are a helpful AI customer support agent for NaviLogix, a logistics and courier company. Answer the user's question politely and concisely. If they ask about tracking, explain that they can use the tracking ID on the home page. User query: ";

        const result = await model.generateContent(context + message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });
    } catch (error) {
        console.error("Error communicating with Gemini API:", error);
        res.status(500).json({ error: "Failed to communicate with AI service" });
    }
};
