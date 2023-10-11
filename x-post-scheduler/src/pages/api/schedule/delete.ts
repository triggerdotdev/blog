// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "../../../../supabaseClient";
import { client } from "@/trigger";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { profile, timestamp, content } = req.body;

	const { data, error } = await supabase
		.from("schedule_posts").delete().eq("profile", profile).eq("content", content)
  
	res.status(200).json({ data, error });
}