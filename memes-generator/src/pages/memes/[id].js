"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function Meme() {
	const params = usePathname();
	const [meme, setMeme] = useState({});

	useEffect(() => {
		const fetchMeme = async () => {
			if (params) {
				const id = params.split("/")[2];
				const request = await fetch("/api/meme", {
					method: "POST",
					body: JSON.stringify({ id }),
					headers: {
						"Content-Type": "application/json",
					},
				});
				const response = await request.json();
				setMeme(response.data[0]);
			}
		};

		fetchMeme();
	}, [params]);

	return (
		<div className='w-full min-h-screen flex flex-col items-center justify-center'>
			{meme?.meme_url && (
				<Image
					src={meme.meme_url}
					alt={meme.name}
					className='hover:scale-105 rounded'
					width={500}
					height={500}
				/>
			)}

			<Link href='/' className='mt-6 text-blue-500'>
				Go back home
			</Link>
		</div>
	);
}
