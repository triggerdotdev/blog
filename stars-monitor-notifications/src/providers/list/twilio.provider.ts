import {object, string} from "zod";
import {registerProvider} from "@/providers/register.provider";
import axios from "axios";
import client from 'twilio';

export const TwilioProvider = registerProvider(
    "twilio",
    {active: true},
    object({
        TWILIO_SID: string(),
        TWILIO_AUTH_TOKEN: string(),
        TWILIO_FROM_NUMBER: string(),
        TWILIO_TO_NUMBER: string(),
    }),
    async (libName, stars, values) => {
        const twilio = client(values.TWILIO_SID, values.TWILIO_AUTH_TOKEN);
        await twilio.messages.create({
            body: `The library ${libName} has ${stars} new stars!`,
            from: values.TWILIO_FROM_NUMBER,
            to: values.TWILIO_TO_NUMBER,
        });
    }
);