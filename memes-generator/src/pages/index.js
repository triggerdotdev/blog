"use client";
import { Space_Grotesk } from "next/font/google";
import { useEffect, useState } from "react";
import { WithContext as ReactTags } from "react-tag-input";
import { useRouter } from "next/navigation";
import ViewMemes from "@/components/ViewMemes";

const KeyCodes = {
	comma: 188,
	enter: 13,
};
const inter = Space_Grotesk({ subsets: ["latin"] });
const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default function Home() {
	const [audience, setAudience] = useState("");
	const [email, setEmail] = useState("");
	const [memes, setMemes] = useState([]);
	const router = useRouter();
	const [topics, setTopics] = useState([
		{ id: "Developers", text: "Developers" },
	]);

	const handleDelete = (i) =>
		setTopics(topics.filter((topic, index) => index !== i));

	const handleAddition = (topic) => setTopics([...topics, topic]);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (topics.length > 0) {
			let topic = "";
			topics.forEach((tag) => {
				topic += tag.text + ", ";
			});
			postData(topic);
			router.push("/submit");
		}
	};

	const postData = async (topic) => {
		try {
			const data = await fetch("/api/api", {
				method: "POST",
				body: JSON.stringify({
					audience,
					topic,
					email,
				}),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const response = await data.json();
			console.log(response);
		} catch (err) {
			console.error(err);
		}
	};

	useEffect(() => {
		fetchMemes();
	}, []);

	const fetchMemes = async () => {
		try {
			const request = await fetch("/api/all-memes");
			const response = await request.json();
			setMemes(response.data);
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<main className={`w-full min-h-screen ${inter.className}`}>
			<header className='bg-[#F8F0E5] min-h-[95vh] flex items-center justify-center flex-col'>
				<h2 className='text-4xl font-bold mb-2 text-[#0F2C59]'>Meme Magic</h2>
				<h3 className='text-lg opacity-60 mb-8'>
					Creating memes with a touch of magic
				</h3>
				<form
					className='flex flex-col md:w-[70%] w-[95%]'
					onSubmit={handleSubmit}
				>
					<label htmlFor='audience'>Audience</label>
					<input
						type='text'
						name='audience'
						value={audience}
						required
						className='px-4 py-2 rounded mb-4'
						onChange={(e) => setAudience(e.target.value)}
					/>
					<label htmlFor='email'>Your email address</label>
					<input
						type='email'
						name='email'
						value={email}
						required
						className='px-4 py-2 rounded mb-4'
						onChange={(e) => setEmail(e.target.value)}
					/>

					<ReactTags
						tags={topics}
						delimiters={delimiters}
						handleDelete={handleDelete}
						handleAddition={handleAddition}
						inputFieldPosition='top'
						autocomplete
						placeholder='Enter a topic for the meme and press enter'
					/>
					<button
						type='submit'
						className='bg-[#0F2C59] text-[#fff] mt-[30px] py-4 rounded text-lg font-bold hover:bg-[#151d2b]'
					>
						GENERATE MEME
					</button>
				</form>
			</header>
			<ViewMemes memes={memes} />
		</main>
	);
}
