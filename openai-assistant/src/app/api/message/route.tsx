import OpenAI from 'openai';

import {prisma} from "@openai-assistant/helper/prisma.client";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
    const body = await request.json();

    // Check that we have the assistant id and the message
    if (!body.id || !body.message){
        return new Response(JSON.stringify({error: 'Id and Message are required'}), {status: 400});
    }

    // get the assistant id in OpenAI from the id in the database
    const assistant = await prisma.assistant.findUnique({
        where: {
            id: +body.id
        }
    });

    // If it's the first message in the thread, create the thread, if not retrieve the thread
    const thread = body.threadId ? await openai.beta.threads.retrieve(body.threadId) : await openai.beta.threads.create();

    // Create the message in the thread
    await openai.beta.threads.messages.create(
        thread.id,
        {
            role: "user",
            content: body.message
        }
    );

    // Run the thread with the new message
    const {id, thread_id} = await openai.beta.threads.runs.create(thread.id, {
        assistant_id: assistant?.aId!,
        model: 'gpt-4-1106-preview'
    });

    // Wait for the message to be ready, at the moment, long polling is the only option
    await isMessageReady(id, thread_id);

    // Retrieve the message, ChatGPT put the last message at the top of the array, so we limit it to 1
    const messages = await openai.beta.threads.messages.list(
        thread_id,
        {
            limit: 1
        }
    );

    // Check that the message is a text message (Just to get the typescript autocomplete)
    const last = messages?.data?.[0].content[0];

    // return it, with the threadId for the next use.
    if (last?.type === 'text') {
        return new Response(JSON.stringify({threadId: thread_id, message: last.text.value}), {status: 200});
    }
}

// Just a simple timer function that can use await
const timer = (ms: number) => new Promise(res => setTimeout(res, ms));

export const isMessageReady = async (id: string, thread_id: string): Promise<boolean> => {
    // getting the status of our run
    const run = await openai.beta.threads.runs.retrieve(thread_id, id);

    // on failure return false
    if (run.status === 'failed') {
        return false;
    }

    // on success return true
    if (run.status === 'completed') {
        return true;
    }

    // if the status is not completed or failed, wait 500ms and try again
    await timer(500);
    return isMessageReady(id, thread_id);
}