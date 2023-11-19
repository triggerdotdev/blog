import {object, string} from "zod";
import {registerProvider} from "@/providers/register.provider";
import axios from "axios";
import { Resend } from 'resend';

export const ResendProvider = registerProvider(
    "resend",
    {active: true},
    object({
        RESEND_API_KEY: string(),
    }),
    async (libName, stars, values) => {
        const resend = new Resend(values.RESEND_API_KEY);
        await resend.emails.send({
            from: "Nevo David <nevo@gitup.dev>",
            to: ['nevo@gitroom.com'],
            subject: 'New GitHub stars',
            html: `The library ${libName} has ${stars} new stars!`,
        });

        await axios.post(values.DISCORD_WEBHOOK_URL, {content: `The library ${libName} has ${stars} new stars!`});
    }
);