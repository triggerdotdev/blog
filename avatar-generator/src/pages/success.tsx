import Link from "next/link";
import Head from "next/head";

export default function Success() {
	return (
		<div className='min-h-screen w-full flex flex-col items-center justify-center'>
			<Head>
				<title>Success | Avatar Generator</title>
			</Head>
			<h2 className='font-bold text-3xl mb-2'>Thank you! 🌟</h2>
			<p className='mb-4 text-center'>
				Your image will be delivered to your email, once it is ready! 💫
			</p>
			<Link
				href='/'
				className='bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600'
			>
				Generate another
			</Link>
		</div>
	);
}