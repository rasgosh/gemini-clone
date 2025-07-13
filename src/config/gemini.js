// Make sure to run this in a Node.js environment with ESM enabled (e.g., using "type": "module" in package.json)
import { GoogleGenerativeAI } from "@google/generative-ai";

// ⚠️ Replace with a secure backend proxy in production
const ai = new GoogleGenerativeAI("AIzaSyCibQK3aflDjtiU-ykUSpYZv_X0sUCphTI");

async function runChat(input) {
  const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

  const maxRetries = 3;
  const delay = 2000;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(input);
      const response = await result.response;
      const text = await response.text();

      console.log("Gemini response:", text);
      return text;
    } catch (error) {
      console.error(`Attempt ${attempt} failed`, error);

      if (error.message.includes("503") && attempt < maxRetries) {
        console.warn(`Model overloaded. Retrying in ${delay / 1000}s...`);
        await new Promise((res) => setTimeout(res, delay));
      } else {
        return "⚠️ Gemini is currently overloaded. Please try again shortly.";
      }
    }
  }
}

export default runChat;
