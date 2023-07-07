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
				className="flex flex-row space-x-6 bg-neutral-500 bg-opacity-10 px-5 p-3 w-full cursor-pointer hover:bg-opacity-20 transition duration-300">
				<img
					src={item.album.images[0]?.url}
					alt={item.album.name}
					className="rounded-full w-14 h-14 object-cover"
				/>
				<div className="flex flex-col">
					<p className="text-lg font-bold text-neutral-100">{item.name}</p>
					<p className="text-md font-semibold text-neutral-400">{item.album.name}</p>
				</div>
			</div>
			<hr className="border-neutral-400 border-opacity-50 h-10 self-center" />
		</>
	);
}
