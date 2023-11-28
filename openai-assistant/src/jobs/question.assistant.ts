import {eventTrigger} from "@trigger.dev/sdk";
import {client} from "@openai-assistant/trigger";
import {object, string} from "zod";
import {openai} from "@openai-assistant/helper/open.ai";

client.defineJob({
    // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
    id: "question-assistant",
    name: "Question Assistant",
    version: "0.0.1", // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
    trigger: eventTrigger({
        name: "question.assistant.event", schema: object({
            content: string(),
            aId: string(),
            threadId: string().optional(),
        })
    }), integrations: {
        openai
    }, run: async (payload, io, ctx) => {
        console.log(payload);
        console.log('creating a new thread');
        const thread = payload.threadId ? await io.openai.beta.threads.retrieve('get-thread', payload.threadId) : await io.openai.beta.threads.create('create-thread');

        console.log('creating a new message');
       await io.openai.beta.threads.messages.create('create-message', thread.id, {
            content: payload.content,
            role: 'user',
        });

       console.log('running thread');
        const run = await io.openai.beta.threads.runs.createAndWaitForCompletion('run-thread', thread.id, {
            model: 'gpt-4-1106-preview',
            assistant_id: payload.aId,
        });

        console.log('checking status');
        if (run.status !== "completed") {
            console.log('not completed');
            throw new Error(`Run finished with status ${run.status}: ${JSON.stringify(run.last_error)}`);
        }

        console.log('getting messages list');
        const messages = await io.openai.beta.threads.messages.list("list-messages", run.thread_id, {
            query: {
                limit: "1"
            }
        });

        const content = messages[0].content[0];
        if (content.type === 'text') {
            return {content: content.text.value, threadId: thread.id};
        }
    }
});