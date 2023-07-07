import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";

import { TrackIDAtomState } from "@/components/atoms/playlistAtom";

export default function SongCard({ item }: { item: SpotifyApi.PlayHistoryObject }): React.JSX.Element {
	const setTrackID = useRecoilState(TrackIDAtomState)[1];
	return (
		<div
			className="group col-span-1 rounded-md bg-neutral-600 bg-opacity-10 cursor-pointer p-3 hover:bg-opacity-20 transition-all duration-300 ease-in-out"
			onClick={(): void => setTrackID(item.track.id)}>
			<div className="flex w-full flex-col gap-2">
				<div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-neutral-900 shadow-lg transition-all duration-300 ease-in-out group">
					<Image
						src={item.track.album.images[0].url}
						className="rounded-md"
						width={300}
						height={300}
						alt={"Playlist Image"}
					/>
					<div className="absolute right-3 bottom-3 hidden group-hover:flex flex-row gap-2 items-center">
						<PlayIcon className="h-10 w-10 text-black rounded-full bg-green-500 p-2" />
					</div>
				</div>
				<h1 className="text-white text-lg font-bold mt-5 truncate">{item.track.name}</h1>
				<p className="text-gray-400 font-semibold text-sm mt-2 line-clamp-2">
					{item.track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
		</div>
	);
}
