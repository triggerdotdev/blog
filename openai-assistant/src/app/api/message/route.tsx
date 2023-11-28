import OpenAI from 'openai';

import {prisma} from "@openai-assistant/helper/prisma.client";
import {client} from "@openai-assistant/trigger";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(request: Request) {
    const body = await request.json();

    // Check that we have the assistant id and the message
    if (!body.id || !body.message) {
        return new Response(JSON.stringify({error: 'Id and Message are required'}), {status: 400});
    }

    // get the assistant id in OpenAI from the id in the database
    const assistant = await prisma.assistant.findUnique({
        where: {
            id: +body.id
        }
    });

    // We send an event to the trigger to process the documentation
    const {id: eventId} = await client.sendEvent({
        name: "question.assistant.event",
        payload: {
            content: body.message,
            aId: assistant?.aId,
            threadId: body.threadId
        },
    });

    return new Response(JSON.stringify({eventId}), {status: 200});
}