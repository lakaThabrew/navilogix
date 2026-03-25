import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';
import Parcel from '../models/Parcel.js';
import logger from '../utils/logger.js';

dotenv.config();

// The new SDK reads GEMINI_API_KEY from environment variables or can be passed explicitly
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        logger.info('🤖 [AI CHAT] Request received', { message });

        // Step 1: Check for tracking ID (Pattern: NL followed by digits)
        const trackingMatch = message.toUpperCase().match(/NL[0-9]{5,20}/);
        let parcelContext = "";

        if (trackingMatch) {
            const trackingId = trackingMatch[0];
            const parcel = await Parcel.findOne({ trackingId }).populate('branchId');

            if (parcel) {
                parcelContext = `
                                [PARCEL DATA FOUND]
                                Tracking ID: ${parcel.trackingId}
                                Status: ${parcel.status}
                                Receiver: ${parcel.receiverInfo.name}
                                Destination: ${parcel.receiverInfo.address}
                                Weight: ${parcel.weight}kg
                                COD Amount: Rs. ${parcel.codAmount}
                                History: ${parcel.history.map(h => `${h.status} at ${h.location}`).join(' -> ')} `;
                logger.info(`✅ [AI CHAT] Found parcel data for ${trackingId}`);
            }
        }

        // Step 2: Build Enhanced System Prompt
        const systemPrompt = `
                    You are NaviLogix AI, a professional customer support assistant for NaviLogix Courier.
                    [COMPANY INFO]
                    Address: 164/A, Hegalle, Kosgoda 30805
                    Phone: +94-713278691 | Email: support@navilogix.com
                    Services: Express Delivery, International Freight, Warehousing, Supply Chain.
                    Colors: Primary Blue (#00468C), Secondary Red (#EF4136).

                    [INSTRUCTIONS]
                    1. When you find parcel data, follow this EXACT TEMPLATE:
                       "Hello! I am NaviLogix AI, your professional assistant for NaviLogix Courier. 📦
                       I have found the information for tracking ID **TRACKING_ID**:
                       *   **Current Status:** STATUS_HERE EMOJI
                       *   **Receiver:** NAME_HERE
                       *   **Destination:** ADDRESS_HERE
                       *   **COD Amount:** Rs. AMOUNT_HERE
                       *   **Weight:** WEIGHT_HERE
                       [Brief professional summary/conclusion about the parcel's journey] 🚢"
                    2. If NO tracking ID is found or details are missing, ask for it politely.
                    3. Be polite, concise, and helpful. Use emojis.
                    4. Keep formatting clean with bullet points and bold labels.

                    [PARCEL DATA FOUND]
                    ${parcelContext || "No specific parcel was identified in the query yet. Ask the user for a tracking ID if they wish to track a package."}

                    User query: ${message} `;

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: systemPrompt
        });

        res.json({ reply: response.text });
    } catch (error) {
        logger.error(`Error communicating with Gemini 3 API: ${error.message}`, { error });
        res.status(500).json({ reply: "Sorry, I'm having trouble with my internal intelligence right now. 🚢 Please try again later or contact our support team at +94-713278691." });
    }
};
