// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { client } from "@/trigger";

export default function handler(req, res) {
	const { topic, audience, email } = req.body;
	try {
		async function fetchMeme() {
			if (topic && audience && email) {
				await client.sendEvent({
					name: "generate.meme",
					payload: {
						audience,
						topic,
						email,
					},
				});
			}
		}
		fetchMeme();
	} catch (err) {
		return res.status(400).json({ message: err });
	}
}
