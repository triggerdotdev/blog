import {DiscordProvider} from "@/providers/list/discord.provider";
import {ResendProvider} from "@/providers/list/resend.provider";
import {SlackProvider} from "@/providers/list/slack.provider";
import {TwilioProvider} from "@/providers/list/twilio.provider";

export const Providers = [
    DiscordProvider,
    ResendProvider,
    SlackProvider,
    TwilioProvider,
];
