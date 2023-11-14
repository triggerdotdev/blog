import { cronTrigger, invokeTrigger, isTriggerError } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { prisma } from "../../helper/prisma";
import axios from "axios";
import { z } from "zod";

// Your first job
// This Job will be triggered by an event, log a joke to the console, and then wait 5 seconds before logging the punchline.
client.defineJob({
  id: "sync-stars",
  name: "Sync Stars Daily",
  version: "0.0.1",
  // Run a cron every day at 23:00 AM
  trigger: cronTrigger({
    cron: "0 23 * * *",
  }),
  run: async (payload, io, ctx) => {
    const repos = await io.runTask("get-stars", async () => {
      // get all libraries and current amount of stars
      return await prisma.repository.groupBy({
        by: ["name"],
        _sum: {
          stars: true,
        },
      });
    });

    //loop through all repos and invoke the Job that gets the latest stars
    for (const repo of repos) {
      getStars.invoke(repo.name, {
        name: repo.name,
        previousStarCount: repo?._sum?.stars || 0,
      });
    }
  },
});

const getStars = client.defineJob({
  id: "get-latest-stars",
  name: "Get latest stars",
  version: "0.0.1",
  // Run a cron every day at 23:00 AM
  trigger: invokeTrigger({
    schema: z.object({
      name: z.string(),
      previousStarCount: z.number(),
    }),
  }),
  run: async (payload, io, ctx) => {
    const stargazers_count = await io.runTask("get-stars", async () => {
      const { data } = await axios.get(
          `https://api.github.com/repos/${payload.name}`,
          {
            headers: {
              authorization: `token ${process.env.TOKEN}`,
            },
          }
      );
      return data.stargazers_count as number;
    });
    try {
      await prisma.repository.upsert({
        where: {
          name_day_month_year: {
            name: payload.name,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            day: new Date().getDate(),
          },
        },
        update: {
            stars: stargazers_count - payload.previousStarCount,
        },
        create: {
          name: payload.name,
          stars: stargazers_count - payload.previousStarCount,
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
          day: new Date().getDate(),
        },
      });
    } catch (err) {
      if (isTriggerError(err)) throw err;
      console.log("Record already exists");
    }
  },
});