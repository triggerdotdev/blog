import {object, string} from "zod";
import {registerProvider} from "@/providers/register.provider";
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
            from: "Eric Allam <eric@trigger.dev>",
            to: ['eric@trigger.dev'],
            subject: 'New GitHub stars',
            html: `The library ${libName} has ${stars} new stars!`,
        });
    }
);