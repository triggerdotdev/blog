import { client } from "@/trigger";
import { cronTrigger } from "@trigger.dev/sdk";
import { Supabase } from "@trigger.dev/supabase";

const supabase = new Supabase({
	id: "supabase",
	supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
	supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
});

client.defineJob({
	id: "post-schedule",
	name: "Post Schedule",
	integrations: { supabase },
	version: "0.0.1",
	trigger: cronTrigger({
		cron: "* * * * *",
	}),
	run: async (payload, io, ctx) => {
		await io.logger.info("Job started! 🌟");

		const { data, error } = await io.supabase.runTask(
			"find-schedule",
			async (db) => {
				return (await db.from("schedule_posts").select(`*, users (username, accessToken)`).eq("published", false).lt("timestamp", new Date().toISOString()))
			}
		);
			
		await io.logger.info(JSON.stringify(data))

		for (let i = 0; i < data?.length; i++) {
			try {
				const postTweet = await fetch("https://api.twitter.com/2/tweets", {
					method: "POST",
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${data[i].users.accessToken}`,
					},
					body: JSON.stringify({ text: data[i].content })
				})
				const getResponse = await postTweet.json()
				await io.logger.info(`${i}`)
				await io.logger.info(`Tweet created successfully!${i} - ${getResponse.data}`)

			}catch (err) {
				await io.logger.error(err)
			}
				
		}
		
	},
});