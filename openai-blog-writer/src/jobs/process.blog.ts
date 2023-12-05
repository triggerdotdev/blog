import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@openai-assistant/trigger";
import {object, string} from "zod";
import {openai} from "@openai-assistant/helper/open.ai";
import {writeFileSync} from "fs";
import slugify from "slugify";

client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "process-blog",
  name: "Process Blog",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "process.blog.event",
    schema: object({
      title: string(),
      aId: string(),
    })
  }),
  integrations: {
    openai
  },
  run: async (payload, io, ctx) => {
      const {title, aId} = payload;
      const thread = await io.openai.beta.threads.create('create-thread');

      await io.openai.beta.threads.messages.create('create-message', thread.id, {
          content: `
           title: ${title}
          `,
          role: 'user',
      });

      const run = await io.openai.beta.threads.runs.createAndWaitForCompletion('run-thread', thread.id, {
          model: 'gpt-4-1106-preview',
          assistant_id: payload.aId,
      });

      if (run.status !== "completed") {
          console.log('not completed');
          throw new Error(`Run finished with status ${run.status}: ${JSON.stringify(run.last_error)}`);
      }

      const messages = await io.openai.beta.threads.messages.list("list-messages", run.thread_id, {
          query: {
              limit: "1"
          }
      });

      return io.runTask('save-blog', async () => {
          const content = messages[0].content[0];
          if (content.type === 'text') {
              const fileName = slugify(title, {lower: true, strict: true, trim: true});
              writeFileSync(`./blog/blog/${fileName}.md`, content.text.value)
              return {fileName};
          }
      });
  },
});
