"use client";
import Head from "next/head";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
	const [selectedFile, setSelectedFile] = useState<File>();
	const [userPrompt, setUserPrompt] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [gender, setGender] = useState<string>("");
	const router = useRouter();

	const handleFileUpload = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		try {
			if (!selectedFile) return;
			const formData = new FormData();
			formData.append("image", selectedFile);
			formData.append("gender", gender);
			formData.append("email", email);
			formData.append("userPrompt", userPrompt);
			await fetch("/api/generate", {
				method: "POST",
				body: formData,
			});
			router.push("/success")
		} catch (err) {
			console.error({ err });
		}
	};

	return (
		<main className='flex items-center md:p-8 px-4 w-full justify-center min-h-screen flex-col'>
			<Head>
				<title>Avatar Generator</title>
			</Head>
			<header className='mb-8 w-full flex flex-col items-center justify-center'>
				<h1 className='font-bold text-4xl'>Avatar Generator</h1>
				<p className='opacity-60'>
					Upload a picture of yourself and generate your avatar
				</p>
			</header>

			<form
				method='POST'
				className='flex flex-col md:w-[60%] w-full'
				onSubmit={(e) => handleFileUpload(e)}
			>
				<label htmlFor='email'>Email Address</label>
				<input
					type='email'
					required
					className='px-4 py-2 border-[1px] mb-3'
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>

				<label htmlFor='gender'>Gender</label>
				<select
					className='border-[1px] py-3 px-4 mb-4 rounded'
					name='gender'
					id='gender'
					value={gender}
					onChange={(e) => setGender(e.target.value)}
					required
				>
					<option value=''>Select</option>
					<option value='male'>Male</option>
					<option value='female'>Female</option>
				</select>

				<label htmlFor='image'>Upload your picture</label>
				<input
					name='image'
					type='file'
					className='border-[1px] py-2 px-4 rounded-md mb-3'
					accept='.png, .jpg, .jpeg'
					required
					onChange={({ target }) => {
						if (target.files) {
							const file = target.files[0];
							setSelectedFile(file);
						}
					}}
				/>
				<label htmlFor='prompt'>
					Add custom prompt for your avatar{" "}
					<span className='opacity-60'>(optional)</span>
				</label>
				<textarea
					rows={4}
					className='w-full border-[1px] p-3'
					name='prompt'
					id='prompt'
					value={userPrompt}
					placeholder='Copy image prompts from https://lexica.art'
					onChange={(e) => setUserPrompt(e.target.value)}
				/>
				<button
					type='submit'
					className='px-6 py-4 mt-5 bg-blue-500 text-lg hover:bg-blue-700 rounded text-white'
				>
					Generate Avatar
				</button>
			</form>
		</main>
	);
}