import { eventTrigger } from "@trigger.dev/sdk";
import { client } from "@/trigger";
import { Resend } from "@trigger.dev/resend";
import { Replicate } from "@trigger.dev/replicate";
import { z } from "zod";

const replicate = new Replicate({
  id: "replicate",
  apiKey: process.env.REPLICATE_API_TOKEN!,
});

const resend = new Resend({
  id: "resend",
  apiKey: process.env.RESEND_API_KEY!,
});

const urlToBase64 = async (image: string) => {
  const response = await fetch(image);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const base64String = buffer.toString("base64");
  const mimeType = "image/png";
  const dataURI = `data:${mimeType};base64,${base64String}`;
  return dataURI;
};

client.defineJob({
  id: "generate-avatar",
  name: "Generate Avatar",
  integrations: { resend, replicate },
  version: "0.0.2",
  trigger: eventTrigger({
    name: "generate.avatar",
    schema: z.object({
      image: z.string(),
      email: z.string(),
      gender: z.string(),
      userPrompt: z.string().nullable(),
    }),
  }),
  run: async (payload, io, ctx) => {
    const { email, image, gender, userPrompt } = payload;

    await io.logger.info("Avatar generation started!", { image });

    const imageGenerated = await io.replicate.run("create-model", {
      identifier:
        "stability-ai/sdxl:c221b2b8ef527988fb59bf24a8b97c4561f1c671f73bd389f866bfb27c061316",
      input: {
        prompt: `${
          userPrompt
            ? userPrompt
            : `A professional ${gender} portrait suitable for a social media avatar. Please ensure the image is appropriate for all audiences.`
        }`,
      },
    });

    const swappedImage = await io.replicate.run("create-image", {
      identifier:
        "lucataco/faceswap:9a4298548422074c3f57258c5d544497314ae4112df80d116f0d2109e843d20d",
      input: {
        target_image: await urlToBase64(imageGenerated.output),
        swap_image: "data:image/png;base64," + image,
      },
    });

    await io.logger.info(JSON.stringify(swappedImage));
    await io.resend.sendEmail("send-email", {
      from: "onboarding@resend.dev",
      to: [email],
      subject: "Your avatar is ready! 🌟🤩",
      text: `Hi! \n View and download your avatar here - ${swappedImage.output}`,
    });

    await io.logger.info(
      "✨ Congratulations, the image has been delivered! ✨"
    );
  },
});
