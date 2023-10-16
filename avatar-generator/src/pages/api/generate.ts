// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { client } from "@/trigger";
import { Writable } from "stream";

export const config = {
  api: {
    bodyParser: false,
  },
};

const fileConsumer = (acc: any) => {
  const writable = new Writable({
    write: (chunk, _enc, next) => {
      acc.push(chunk);
      next();
    },
  });

  return writable;
};

const readFile = (req: NextApiRequest, saveLocally?: boolean) => {
  // @ts-ignore
  const chunks: any[] = [];
  const form = formidable({
    keepExtensions: true,
    fileWriteStreamHandler: () => fileConsumer(chunks),
  });

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields: any, files: any) => {
      const image = Buffer.concat(chunks).toString("base64");
      await client.sendEvent({
        name: "generate.avatar",
        payload: {
          image,
          email: fields.email[0],
          gender: fields.gender[0],
          userPrompt: fields.userPrompt[0],
        },
      });

      if (err) reject(err);
      resolve({ fields, files });
    });
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await readFile(req, true);

  res.status(200).json({ message: "Processing!" });
}
