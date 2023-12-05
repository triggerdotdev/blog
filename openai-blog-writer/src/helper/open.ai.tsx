import {OpenAI} from "@trigger.dev/openai";

export const openai = new OpenAI({
    id: "openai",
    apiKey: process.env.OPENAI_API_KEY!,
});