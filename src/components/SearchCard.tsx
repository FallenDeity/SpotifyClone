import Image from "next/image";
import React from "react";

export default function SearchCard({
	item,
	callback,
}: {
	item: SpotifyApi.TrackObjectFull;
	callback: () => void;
}): React.JSX.Element {
	return (
		<>
			<div
				onClick={callback}
				key={item.id}
				className="flex w-full cursor-pointer flex-row space-x-6 bg-neutral-500 bg-opacity-10 p-3 px-5 transition duration-300 hover:bg-opacity-20">
				<Image
					width={50}
					height={50}
					src={item.album.images[0]?.url}
					alt={item.album.name}
					className="h-14 w-14 rounded-full object-cover"
				/>
				<div className="flex flex-col">
					<p className="text-lg font-bold text-neutral-100">{item.name}</p>
					<p className="text-md font-semibold text-neutral-400">{item.album.name}</p>
				</div>
			</div>
			<hr className="h-10 self-center border-neutral-400 border-opacity-50" />
		</>
	);
}
