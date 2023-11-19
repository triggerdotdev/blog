import {object, string} from "zod";
import {registerProvider} from "@/providers/register.provider";
import axios from "axios";

export const SlackProvider = registerProvider(
    "slack",
    {active: true},
    object({
        SLACK_WEBHOOK_URL: string(),
    }),
    async (libName, stars, values) => {
        await axios.post(values.SLACK_WEBHOOK_URL, {text: `The library ${libName} has ${stars} new stars!`});
    }
);