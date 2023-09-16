import React from "react";
import Image from "next/image";

const ViewMemes = ({ memes }) => {
	return (
		<section className='h-[100vh] px-4 py-10 flex items-center flex-col'>
			<h2 className='text-3xl font-bold mb-8'>Recent Memes</h2>
			<div className='w-full flex flex-wrap md:space-x-4'>
				{memes.map((meme) => (
					<div
						className='md:w-[30%] w-full m-2 flex flex-col items-center'
						key={meme.id}
					>
						<Image
							src={`${meme.meme_url}`}
							alt={meme.name}
							className='hover:scale-105 rounded'
							width={400}
							height={400}
						/>
					</div>
				))}
			</div>
		</section>
	);
};

export default ViewMemes;
