import genai = require("@google/genai");

const model = "gemini-2.5-flash";

const createHttpError = (
  message: string,
  statusCode: number,
  errorCode: string,
) => {
  const error = new Error(message);
  Object.assign(error, { statusCode, errorCode });
  return error;
};

const getClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw createHttpError(
      "Gemini API key is not configured",
      500,
      "GEMINI_API_KEY_MISSING",
    );
  }

  return new genai.GoogleGenAI({ apiKey });
};

const buildTaskDescriptionPrompt = (title: string) => {
  return [
    "Generate a short, professional task description for this task title.",
    "Keep it clear and actionable in 1-2 sentences.",
    "Do not include markdown, labels, or extra formatting.",
    `Task title: ${title}`,
  ].join("\n");
};

const generateTaskDescription = async (title: string) => {
  const ai = getClient();
  const response = await ai.models.generateContent({
    model,
    contents: buildTaskDescriptionPrompt(title.trim()),
  });
  const description = response.text?.trim();

  if (!description) {
    throw createHttpError(
      "Failed to generate task description",
      502,
      "AI_DESCRIPTION_GENERATION_FAILED",
    );
  }

  return description;
};

export = {
  generateTaskDescription,
};
