import {object, string} from "zod";
import {registerProvider} from "@/providers/register.provider";
import axios from "axios";

export const DiscordProvider = registerProvider(
    "discord",
    {active: true},
    object({
        DISCORD_WEBHOOK_URL: string(),
    }),
    async (libName, stars, values) => {
        await axios.post(values.DISCORD_WEBHOOK_URL, {content: `The library ${libName} has ${stars} new stars!`});
    }
);