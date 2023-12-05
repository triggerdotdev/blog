import {prisma} from "@openai-assistant/helper/prisma.client";

// Get the list of all the available assistants
export const getList = () => {
    return prisma.assistant.findMany({
    });
}