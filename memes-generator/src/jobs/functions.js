import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import OpenAI from "openai";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);
import { supabase } from "@/supabaseClient";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const extractSentencesInQuotes = (inputString) => {
	const sentenceRegex = /"([^"]+)"/g;
	const sentences = [];
	let match;
	while ((match = sentenceRegex.exec(inputString))) {
		sentences.push(match[1]);
	}
	return sentences;
};

client.defineJob({
	// This is the unique identifier for your Job, it must be unique across all Jobs in your project
	id: "generate-meme",
	name: "Generate Meme",
	version: "0.0.1",

	trigger: eventTrigger({
		name: "generate.meme",
	}),
	run: async (payload, io, ctx) => {
		const { audience, topic, email } = payload;
		// This logs a message to the console
		await io.logger.info("Meme request received!✅");
		await io.logger.info("Meme generation in progress 🤝");

		let fetchAllMeme = await fetch("https://api.imgflip.com/get_memes");
		let memesData = await fetchAllMeme.json();
		const memes = memesData.data.memes;
		const randInt = Math.floor(Math.random() * 101);
		const selectedTemplate = memes[randInt];

		const userPrompt = `Topics: ${topic} \n Intended Audience: ${audience} \n Template: ${selectedTemplate.name} \n`;

		const sysPrompt = `You are a meme idea generator. You will use the imgflip api to generate a meme based on an idea you suggest. Given a random template name and topics, generate a meme idea for the intended audience. Only use the template provided.`;

		io.sendEvent("generate-gpt-text", {
			name: "gpt.text",
			payload: {
				userPrompt,
				sysPrompt,
				selectedTemplate,
				email,
			},
		});
		await io.logger.info("✨ Yay! You've gotten a template for the meme ✨");
	},
});

client.defineJob({
	id: "chatgpt-meme-text",
	name: "ChatGPT Meme Text",
	version: "0.0.1",

	trigger: eventTrigger({
		name: "gpt.text",
	}),
	run: async (payload, io, ctx) => {
		const { userPrompt, sysPrompt, selectedTemplate, email } = payload;
		await io.logger.info("✨ Talking to ChatGPT 🫂");
		const messages = [
			{ role: "system", content: sysPrompt },
			{ role: "user", content: userPrompt },
		];
		const functions = [
			{
				name: "generateMemeImage",
				description:
					"Generate meme via the imgflip API based on the given idea",
				parameters: {
					type: "object",
					properties: {
						text0: {
							type: "string",
							description: "The text for the top caption of the meme",
						},
						text1: {
							type: "string",
							description: "The text for the bottom caption of the meme",
						},
					},
					required: ["templateName", "text0", "text1"],
				},
			},
		];
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo",
			messages,
			functions,
			function_call: "auto",
		});

		const responseMessage = response.choices[0];
		const texts = extractSentencesInQuotes(responseMessage.message.content);

		await io.logger.info(JSON.stringify(texts));
		await io.logger.info("✨ Yay! You've gotten a text for your meme ✨");

		io.sendEvent("caption-save-meme", {
			name: "caption.save.meme",
			payload: {
				texts: ["Text0", "Text1"],
				selectedTemplate,
				email,
			},
		});
	},
});

client.defineJob({
	id: "caption-save-meme",
	name: "Caption and Save Meme",
	version: "0.0.1",

	trigger: eventTrigger({
		name: "caption.save.meme",
	}),
	run: async (payload, io, ctx) => {
		const { texts, selectedTemplate, email } = payload;
		await io.logger.info("Received meme template and texts 🎉");

		const formatData = new URLSearchParams({
			template_id: selectedTemplate.id,
			username: process.env.IMGFLIP_USERNAME,
			password: process.env.IMGFLIP_PW,
			text0: texts[0],
			text1: texts[1],
		});

		const response = await fetch("https://api.imgflip.com/caption_image", {
			method: "POST",
			body: formatData.toString(),
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		const rawData = await response.text();
		const JSONData = JSON.parse(rawData);
		await io.logger.info("✨ Yay! Your meme has been captioned! ✨");

		await io.logger.info(JSON.stringify(JSONData));

		await supabase.from("memes").insert({
			id: selectedTemplate.id,
			name: selectedTemplate.name,
			meme_url: JSONData.data.url,
		});

		io.sendEvent("email-meme", {
			name: "send.meme",
			payload: {
				email,
				meme_url: `http://localhost:3000/memes/${selectedTemplate.id}`,
			},
		});

		await io.logger.info(
			"✨ Yay! Your meme has been saved to the database! ✨"
		);
	},
});

client.defineJob({
	id: "send-meme",
	name: "Send Meme",
	version: "0.0.1",

	trigger: eventTrigger({
		name: "send.meme",
	}),
	run: async (payload, io, ctx) => {
		const { meme_url, email } = payload;
		await io.logger.info("Sending meme to the user 🎉");

		await resend.emails.send({
			from: "onboarding@resend.dev",
			to: [email],
			subject: "Your meme is ready!",
			text: `Hey there, Your meme is ready.\n Access it here: ${meme_url}`,
		});

		await io.logger.info(
			"✨ Yay! Your meme has been saved to the database! ✨"
		);
	},
});
