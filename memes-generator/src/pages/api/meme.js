import { supabase } from "@/supabaseClient";

export default function handler(req, res) {
	const getMeme = async () => {
		const { id } = req.body;
		try {
			const { data, error } = await supabase
				.from("memes")
				.select("*")
				.eq("id", parseInt(id));
			res.status(200).json({ data });
		} catch (err) {
			res.status(400).json({ error: err });
		}
	};
	getMeme();
}
