import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key not found in process.env");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateChatResponse = async (
  history: ChatMessage[],
  userMessage: string
): Promise<string> => {
  const client = getClient();
  if (!client) {
    return "抱歉，目前無法連接到 AI 服務 (API Key Missing)。";
  }

  try {
    // Construct formatting for the model
    // We only send the last few messages to keep context but save tokens
    const recentHistory = history.slice(-6).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    }));

    const systemInstruction = `
      你是一位精通「醫學人文（Medical Humanities）」的 AI 助理。
      你的名字叫「醫文小幫手」。
      你的目標是幫助用戶理解醫學與文學、藝術、歷史、倫理及哲學的交集。
      請用溫暖、富有同理心且專業的語氣回答。
      回答應簡潔明瞭，適合網頁閱讀。
      如果用戶問及具體的醫療診斷，請禮貌地拒絕並建議尋求專業醫師協助，並將話題引導回人文層面（例如：疾病的心理影響、社會支持等）。
      請使用繁體中文回答。
    `;

    const model = 'gemini-2.5-flash';

    const chat = client.chats.create({
      model: model,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
      history: recentHistory,
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "抱歉，我現在無法思考，請稍後再試。";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "發生錯誤，請稍後再試。";
  }
};