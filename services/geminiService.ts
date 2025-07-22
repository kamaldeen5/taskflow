
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, Category, Priority, Task } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        category: {
            type: Type.STRING,
            enum: Object.values(Category),
            description: 'The best category for the task.',
        },
        priority: {
            type: Type.STRING,
            enum: Object.values(Priority),
            description: 'The priority level of the task.',
        },
        reasoning: {
            type: Type.STRING,
            description: 'A brief explanation for the chosen category and priority.'
        }
    },
    required: ['category', 'priority', 'reasoning']
};

export const analyzeTask = async (userInput: string): Promise<AIAnalysisResult> => {
    try {
        const prompt = `
            Analyze the following task and provide its category and priority.
            Task: "${userInput}"

            Consider the following:
            - Keywords indicating urgency (e.g., 'ASAP', 'urgent', 'deadline', 'by tomorrow').
            - Work-related terms (e.g., 'client', 'meeting', 'project', 'report', 'presentation').
            - Personal activities (e.g., 'doctor', 'gym', 'family', 'shopping', 'appointment').
            - Creative tasks (e.g., 'design', 'write', 'brainstorm', 'plan', 'create').
            - Routine activities (e.g., 'daily', 'weekly', 'review', 'standup', 'cleanup').

            Return the analysis in JSON format.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: analysisSchema
            }
        });

        const jsonText = response.text;
        const result = JSON.parse(jsonText) as AIAnalysisResult;

        if (!Object.values(Category).includes(result.category) || !Object.values(Priority).includes(result.priority)) {
            throw new Error('Invalid category or priority returned by AI.');
        }

        return result;

    } catch (error) {
        console.error("Error analyzing task with Gemini:", error);
        throw new Error("Failed to analyze task. The AI service may be unavailable.");
    }
};

export const getDailyInsight = async (tasks: Task[]): Promise<string> => {
    if (tasks.length === 0) {
        return "Add your first task to get started!";
    }

    try {
        const taskSummary = tasks.map(t => `- ${t.title} (${t.category}, ${t.priority} priority)`).join('\n');
        const prompt = `
            Based on the following list of tasks for today, provide a single, short, and encouraging productivity insight or tip for the user.
            Keep it under 25 words. Be positive and motivational.

            Tasks:
            ${taskSummary}
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text.trim();

    } catch (error) {
        console.error("Error getting daily insight:", error);
        return "Could not retrieve AI insight at this time.";
    }
};
