import { supabase } from "@/supabaseClient";

export default function handler(req, res) {
	const fetchMemes = async () => {
		try {
			const { data, error } = await supabase
				.from("memes")
				.select("*")
				.order("created_at", { ascending: false });
			res.status(200).json({ data });
		} catch (err) {
			res.status(400).json({ error: err });
		}
	};
	fetchMemes();
}
