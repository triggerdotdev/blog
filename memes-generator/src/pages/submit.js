import Link from "next/link";
import React from "react";

export default function Submit() {
	return (
		<div className='w-full h-screen flex flex-col items-center justify-center'>
			<h2 className='font-extrabold text-4xl mb-4 text-[#DAC0A3]'>
				Thank You!
			</h2>
			<p className='mb-6'>
				Your newly generated meme has been sent to your email.
			</p>
			<Link href='/'>
				<p className='text-[#662549]'>Go Home</p>
			</Link>
		</div>
	);
}
