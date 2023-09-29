import { createPagesRoute } from "@trigger.dev/nextjs";
import { client } from "@/trigger";

import "@/jobs";

//this route is used to send and receive data with Trigger.dev
const { handler, config } = createPagesRoute(client);
export { config };

export default handler;
