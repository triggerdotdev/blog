import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@openai-assistant/trigger";
import {object, string} from "zod";
import {JSDOM} from "jsdom";
import {getElementsBetween} from "@openai-assistant/helper/elements.between";
import {chunk} from "lodash";
import {prisma} from "@openai-assistant/helper/prisma.client";
import {makeId} from "@openai-assistant/helper/make.id";
import {openai} from "@openai-assistant/helper/open.ai";

client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "process-documentation",
  name: "Process Documentation",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "process.documentation.event",
    schema: object({
      url: string(),
    })
  }),
  integrations: {
    openai
  },
  run: async (payload, io, ctx) => {

    // The first task to get the sitemap url from the website
    const getSiteMap = await io.runTask("grab-sitemap", async () => {
      const data = await (await fetch(payload.url)).text();
      const dom = new JSDOM(data);
      const sitemap = dom.window.document.querySelector('[rel="sitemap"]')?.getAttribute('href');
      return new URL(sitemap!, payload.url).toString();
    });

    // We parse the sitemap, instead of using some XML parser, we just use regex to get the urls and we return it in chunks of 25
    const {identifier, list} = await io.runTask("load-and-parse-sitemap", async () => {
        const urls = /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/g;
        const identifier = makeId(5);
        const data = await (await fetch(getSiteMap)).text();
        // @ts-ignore
        return {identifier, list: chunk(([...new Set(data.match(urls))] as string[]).filter(f => f.includes(payload.url)).map(p => ({identifier, url: p})), 25)};
    });

    // We go into each page and grab the content, we do this in batches of 25 and save it to the DB
    let i = 0;
    for (const item of list) {
        await processContent.batchInvokeAndWaitForCompletion(
            'process-list-' + i,
            item.map(
                payload => ({
                payload,
            }),
            86_400),
        );
        i++;
    }

    // We get the data that we saved in batches from the DB
    const data = await io.runTask("get-extracted-data", async () => {
        return (await prisma.docs.findMany({
            where: {
                identifier
            },
            select: {
                content: true
            }
        })).map((d) => d.content).join('\n\n');
    });

    // We upload the data to OpenAI with all the content
    const file = await io.openai.files.createAndWaitForProcessing("upload-file", {
      purpose: "assistants",
      file: data
    });

    // We check if we already have an old assistant, based on the URL (from the database)
    const currentAssistant = await io.runTask('find-old-assistant', async () => {
      return prisma.assistant.findFirst({
          where: {
              url: payload.url
          }
      });
    });

    // We create a new assistant or update the old one with the new file
    const assistant = await io.openai.runTask("create-or-update-assistant", async (openai) => {
        if (currentAssistant) {
            return openai.beta.assistants.update(currentAssistant.aId, {
                file_ids: [file.id]
            });
        }
        return openai.beta.assistants.create({
            name: identifier,
            description: 'Documentation',
            instructions: 'You are a documentation assistant, you have been loaded with documentation from ' + payload.url + ', return everything in an MD format.',
            model: 'gpt-4-1106-preview',
            tools: [{ type: "code_interpreter" }, {type: 'retrieval'}],
            file_ids: [file.id],
        });
    });

    // We update our internal database with the assistant
    await io.runTask("save-assistant", async () => {
        await prisma.assistant.upsert({
            where: {
                url: payload.url
            },
            update: {
                aId: assistant.id,
            },
            create: {
                aId: assistant.id,
                url: payload.url,
            }
        });
    });
  },
});

// This is the Job that will grab the content from the website
const processContent = client.defineJob({
  // This is the unique identifier for your Job, it must be unique across all Jobs in your project.
  id: "process-content",
  name: "Process Content",
  version: "0.0.1",
  // This is triggered by an event using eventTrigger. You can also trigger Jobs with webhooks, on schedules, and more: https://trigger.dev/docs/documentation/concepts/triggers/introduction
  trigger: eventTrigger({
    name: "process.content.event",
    schema: object({
      url: string(),
      identifier: string(),
    })
  }),
  run: async (payload, io, ctx) => {
    return io.runTask('grab-content', async () => {
        try {
            // We first grab a raw html of the content from the website
            const data = await (await fetch(payload.url)).text();

            // We load it with JSDOM so we can manipulate it
            const dom = new JSDOM(data);

            // We remove all the scripts and styles from the page
            dom.window.document.querySelectorAll('script, style').forEach((el) => el.remove());

            // We grab all the titles from the page
            const content = Array.from(dom.window.document.querySelectorAll('h1, h2, h3, h4, h5, h6'));

            // We grab the last element so we can get the content between the last element and the next element
            const lastElement = content[content.length - 1]?.parentElement?.nextElementSibling!;
            const elements = [];

            // We loop through all the elements and grab the content between each title
            for (let i = 0; i < content.length; i++) {
                const element = content[i];
                const nextElement = content?.[i + 1] || lastElement;
                const elementsBetween = getElementsBetween(element, nextElement);
                elements.push({
                    title: element.textContent, content: elementsBetween.map((el) => el.textContent).join('\n')
                });
            }

            // We create a raw text format of all the content
            const page = `
            ----------------------------------
            url: ${payload.url}\n
            ${elements.map((el) => `${el.title}\n${el.content}`).join('\n')}
            
            ----------------------------------
            `;

            // We save it to our database
            await prisma.docs.upsert({
                where: {
                    url: payload.url
                }, update: {
                    content: page, identifier: payload.identifier
                }, create: {
                    url: payload.url, content: page, identifier: payload.identifier
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    });
  },
});
