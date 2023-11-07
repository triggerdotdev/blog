import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY!,
  dangerouslyAllowBrowser: true,
});

export async function generateResumeText(prompt: string) {
  const response = await openai.completions.create({
    model: "text-davinci-003",
    prompt,
    max_tokens: 250,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  return response.choices[0].text.trim();
}
