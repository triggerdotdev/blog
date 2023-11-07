"use server";

import { client } from "@/trigger";

type SendEmailProps = {
  to: string;
  text: string;
  name: string;
  from?: string;
};

export async function sendEmail({ to, text, name, from }: SendEmailProps) {
  return await client.sendEvent({
    name: "send.email",
    payload: {
      to,
      text,
      name,
      from,
    },
  });
}
