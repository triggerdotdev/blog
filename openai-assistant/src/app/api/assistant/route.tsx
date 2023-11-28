import {client} from "@openai-assistant/trigger";
import {prisma} from "@openai-assistant/helper/prisma.client";

export async function POST(request: Request) {
    const body = await request.json();
    if (!body.url) {
        return new Response(JSON.stringify({error: 'URL is required'}), {status: 400});
    }

    // We send an event to the trigger to process the documentation
    const {id: eventId} = await client.sendEvent({
        name: "process.documentation.event", payload: {url: body.url},
    });

    return new Response(JSON.stringify({
        eventId
    }), {status: 200});
}

export async function GET(request: Request) {
    const url = new URL(request.url).searchParams.get('url');
    if (!url) {
        return new Response(JSON.stringify({error: 'URL is required'}), {status: 400});
    }

    const assistant = await prisma.assistant.findFirst({
        where: {
            url: url
        }
    });

    return new Response(JSON.stringify(assistant), {status: 200});
}
