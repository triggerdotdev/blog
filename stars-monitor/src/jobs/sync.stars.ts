import {cronTrigger} from "@trigger.dev/sdk";
import { client } from "@/trigger";
import {prisma} from "../../helper/prisma";
import axios from "axios";

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
    await io.runTask('sync-stars', async () => {
      // get all libraries and current amount of stars
      const getAllRepoAndTotalStars = await prisma.repository.groupBy({
        by: ['name'],
        _sum: {
          stars: true
        }
      });

      await Promise.all(getAllRepoAndTotalStars.map(async (repo) => {
        const {data: {stargazers_count}} = await axios.get(`https://api.github.com/repos/${repo.name}`, {
          headers: {
              authorization: `token ${process.env.TOKEN}`,
          }
        });

        try {
          await prisma.repository.create({
            data: {
              name: repo.name,
              stars: stargazers_count - (repo?._sum?.stars || 0),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
              day: new Date().getDate(),
            }
          })
        }
        catch (err) {
          console.log('Record already exists');
        }
      }));
    });
  },
});