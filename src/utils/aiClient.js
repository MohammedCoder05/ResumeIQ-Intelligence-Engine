import { GoogleGenAI } from '@google/genai';

// Initialize the API client pulling the key from Vite environment variables.
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

// Instantiate a global client
export const genai = new GoogleGenAI({ apiKey });

export async function rewriteBulletPoint(text) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
You are an expert resume writer and career coach. Review the following resume bullet point and rewrite it into exactly 3 distinct, improved variations. 
For each variation:
- Improve clarity and professional tone.
- Add strong impact and start with power action verbs.
- Include or infer quantifiable metrics where possible (e.g. percentages, money, time saved).

Return ONLY the 3 variations, separated by newlines, with no additional conversational text, bullets, or numbers.

Original Bullet Point: "${text}"
  `.trim();

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    
    // Split the response by newlines and clean up standard list formatting
    const suggestions = response.text
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 10);
      
    // Ensure we return up to 3 variations
    return suggestions.slice(0, 3);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Rewrite generation failed");
  }
}

export async function generateResumeRecommendations(parsedText) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
You are an elite Fortune 500 ATS grading algorithm and expert career coach. Analyze the entire resume text provided below.
Identify the 3 most critical, actionable structural or contextual improvements the candidate must make to pass automated screenings.
Return EXACTLY 3 bullet points, separated by newlines. No intros, no lists, no numbers, just the plain actionable suggestions. Keep them concise, highly impactful, and tailored entirely to the text provided.

Resume Text: "${parsedText.slice(0, 4500)}"
  `.trim();

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    
    return response.text
      .split('\n')
      .map(line => line.replace(/^[-*•\d.]+\s*/, '').trim())
      .filter(line => line.length > 10)
      .slice(0, 3);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Contextual generation failed");
  }
}
export async function predictInterviewQuestions(resumeText, jobDescription) {
  if (!apiKey) {
    throw new Error("Missing Gemini API Key. Please add VITE_GEMINI_API_KEY to your .env file.");
  }

  const prompt = `
You are an expert technical interviewer and executive talent coach. 
Analyze the candidate's RESUME and the TARGET JOB DESCRIPTION provided below.

1. Identify the 5 most likely and challenging interview questions (mix of technical and behavioral) that this specific interviewer would ask this specific candidate for this specific role.
2. For each question, provide a "Precision Response": a high-impact, data-driven answer that utilizes specific achievements, metrics, or technologies from the candidate's resume to prove their fit.

Return ONLY a valid JSON array of objects. Each object must have "question" and "response" keys.
Do not include markdown formatting or conversational text. Just the raw JSON array.

RESUME: "${resumeText.slice(0, 4000)}"
JOB DESCRIPTION: "${jobDescription.slice(0, 2000)}"
  `.trim();

  try {
    const response = await genai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
    });
    
    // Robust JSON extraction
    const rawText = response.text.trim();
    const cleanJson = rawText.replace(/```json|```/g, '').trim();
    
    try {
      return JSON.parse(cleanJson);
    } catch (e) {
      const arrayMatch = cleanJson.match(/\[[\s\S]*\]/);
      if (arrayMatch) {
        return JSON.parse(arrayMatch[0]);
      }
      throw e;
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "Interview prediction failed");
  }
}
