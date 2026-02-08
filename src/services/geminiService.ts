
import { GoogleGenAI, Type } from "@google/genai";
import { Course } from '../types';

// Safely retrieve the API key. 
// Vite replaces `process.env.API_KEY` during build, but accessing `process` object directly can crash browsers.
const getEnvApiKey = () => {
    try {
        // @ts-ignore
        return process.env.API_KEY; 
    } catch (e) {
        return '';
    }
};

let dynamicApiKey = getEnvApiKey();

// Export a function to set the API key at runtime
export const setGeminiApiKey = (key: string) => {
    dynamicApiKey = key;
};

// Helper to lazily get the AI client
const getAiClient = () => {
    // Fix: API key is sourced from process.env.API_KEY as mandated by guidelines.
    const apiKey = getEnvApiKey() || dynamicApiKey;
    if (!apiKey) {
        console.warn("Gemini API Key is missing. AI features will be disabled until configured.");
        return null;
    }
    // Fix: Always use named parameter for apiKey initialization.
    return new GoogleGenAI({ apiKey });
};

/**
 * Generates a lesson plan using the Gemini API.
 * @param subject The subject of the lesson.
 * @param level The educational level (e.g., elementary, high school).
 * @param topic The specific topic for the lesson plan.
 * @returns A string containing the generated lesson plan.
 */
export const generateLessonPlan = async (subject: string, level: string, topic: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) {
        return "عذرًا، خدمة الذكاء الاصطناعي غير متوفرة حاليًا. يرجى التأكد من إعداد مفتاح API.";
    }

    // Fix: Updated model to 'gemini-3-flash-preview' for basic text tasks.
    const model = 'gemini-3-flash-preview';

    const prompt = `
        أنشئ خطة درس مفصلة باللغة العربية.
        المادة: ${subject}
        المرحلة الدراسية: ${level}
        موضوع الدرس: ${topic}

        يجب أن تتضمن الخطة ما يلي:
        1.  **الأهداف التعليمية:** (ماذا سيتعلم الطالب بنهاية الدرس؟)
        2.  **المواد والأدوات اللازمة:** (أي شيء مطلوب للدرس)
        3.  **مقدمة ونشاط استهلالي:** (لجذب انتباه الطلاب)
        4.  **شرح المفاهيم الأساسية:** (خطوات شرح الدرس)
        5.  **نشاط تطبيقي:** (تمرين عملي لترسيخ المفهوم)
        6.  **التقييم والواجب المنزلي:** (كيفية قياس فهم الطلاب وما يجب عليهم فعله بعد الدرس)
        
        اجعل الخطة واضحة ومنظمة وسهلة المتابعة للمعلم.
    `;

    try {
        // Fix: Use generateContent directly with both model and contents in parameters.
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
        });
        
        // Fix: Access response text property directly.
        return response.text || "لم يتم إنشاء محتوى.";
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        throw new Error('Failed to generate lesson plan from Gemini API.');
    }
};

/**
 * Translates a JSON object's values to a target language using the Gemini API.
 * @param content The JSON object to translate.
 * @param targetLanguage The target language (e.g., "English").
 * @returns A new JSON object with translated string values.
 */
export const translateContent = async (content: object, targetLanguage: string): Promise<any> => {
    const ai = getAiClient();
    if (!ai) {
        console.warn("Translation skipped: API Key missing.");
        return content; // Return original content if AI is unavailable
    }

    // Fix: Updated model to 'gemini-3-pro-preview' for complex text translation tasks.
    const model = 'gemini-3-pro-preview';

    const prompt = `
        You are an expert localization specialist. Translate all Arabic string values in the following JSON object to professional, natural-sounding ${targetLanguage}.
        The context is for an educational tutoring platform named "JoTutor".
        
        RULES:
        - DO NOT translate the JSON keys. The keys must remain exactly the same.
        - Preserve the original JSON structure EXACTLY.
        - Keep all non-string values (numbers, booleans, nulls) as they are.
        - For arrays of strings, translate each string element in the array.
        - The final output MUST be a single, valid JSON object and nothing else.

        JSON to translate:
        ${JSON.stringify(content, null, 2)}
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
            },
        });

        let jsonStr = response.text?.trim();
        if (!jsonStr) return content;

        // Clean up potential markdown wrappers from the response
        if (jsonStr.startsWith('```json')) {
            jsonStr = jsonStr.substring(7, jsonStr.length - 3).trim();
        } else if (jsonStr.startsWith('```')) {
            jsonStr = jsonStr.substring(3, jsonStr.length - 3).trim();
        }

        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error translating content:', error);
        throw new Error('Failed to translate content using Gemini API.');
    }
};

export const getChatbotResponse = async (message: string, courses: Course[]): Promise<{ responseText: string; recommendedCourseIds: string[] }> => {
    const ai = getAiClient();
    if (!ai) {
        return {
            responseText: "عذرًا، خدمة المحادثة غير متوفرة حاليًا. يرجى التأكد من إعداد مفتاح API.",
            recommendedCourseIds: []
        };
    }

    // Fix: Updated model to 'gemini-3-flash-preview' for simple chatbot logic.
    const model = 'gemini-3-flash-preview';

    // Prepare a lightweight course list for the AI, including the CURRICULUM
    const courseData = courses.map(c => ({
        id: c.id,
        title: c.title,
        description: c.description,
        category: c.category,
        level: c.level,
        curriculum: c.curriculum,
        price: c.priceJod || c.price
    }));

    const prompt = `
        أنت "Mr.Pincel"، المساعد التعليمي الذكي والشخصية المميزة لمنصة JoTutor.
        شخصيتك: ودود، ذكي، مشجع، ومحب للتعليم. تتحدث بأسلوب لطيف واحترافي.
        
        المهمة:
        بناءً على رسالة المستخدم وقائمة الدورات المتاحة، قدم ردًا مفيدًا.
        يجب عليك تحليل طلب المستخدم بدقة (المادة، المستوى الدراسي، والمنهاج إن وجد) واقتراح الدورات الأنسب له من القائمة.
        
        قائمة الدورات المتاحة (JSON):
        ${JSON.stringify(courseData, null, 2)}

        رسالة المستخدم:
        "${message}"

        التعليمات:
        1.  عرف عن نفسك باسم "Mr.Pincel" عند الحاجة.
        2.  تحدث باللغة العربية بأسلوب ودود ومساعد.
        3.  حلل رسالة المستخدم لفهم ما يبحث عنه. انتبه للمادة، المستوى، والمنهج (مثل دولي، وطني، IGCSE).
        4.  إذا وجدت دورات مناسبة في القائمة، **يجب** أن تضع أرقام معرفاتها (IDs) في مصفوفة recommendedCourseIds في ردك.
        5.  في نص الرد (responseText)، قم بدعوة المستخدم للاطلاع على الدورات المقترحة أدناه.
        6.  يجب أن يكون ردك عبارة عن كائن JSON صالح فقط، ولا شيء غير ذلك.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        responseText: {
                            type: Type.STRING,
                            description: "Your friendly, conversational response to the user in Arabic as Mr.Pincel."
                        },
                        recommendedCourseIds: {
                            type: Type.ARRAY,
                            description: "An array of course IDs (strings) that are relevant to the user's query. Return an empty array if no courses are relevant.",
                            items: {
                                type: Type.STRING,
                            }
                        }
                    },
                    required: ["responseText", "recommendedCourseIds"]
                }
            }
        });
        
        const jsonStr = response.text?.trim();
        if (!jsonStr) throw new Error("Empty response from AI");
        return JSON.parse(jsonStr);

    } catch (error) {
        console.error('Error getting chatbot response:', error);
        return {
            responseText: "عذرًا، Mr.Pincel يواجه مشكلة فنية صغيرة في الوقت الحالي. يرجى المحاولة مرة أخرى لاحقًا.",
            recommendedCourseIds: []
        };
    }
};
