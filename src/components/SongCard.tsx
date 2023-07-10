import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";

import { TrackIDAtomState } from "@/components/atoms/playlistAtom";

export default function SongCard({ item }: { item: SpotifyApi.PlayHistoryObject }): React.JSX.Element {
	const setTrackID = useRecoilState(TrackIDAtomState)[1];
	return (
		<div
			className="group col-span-1 cursor-pointer rounded-md bg-neutral-600 bg-opacity-10 p-3 transition-all duration-300 ease-in-out hover:bg-opacity-20"
			onClick={(): void => setTrackID(item.track.id)}>
			<div className="flex w-full flex-col gap-2">
				<div className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-lg shadow-neutral-900 transition-all duration-300 ease-in-out">
					<Image
						src={item.track.album.images[0].url}
						className="rounded-md"
						width={300}
						height={300}
						alt={"Playlist Image"}
					/>
					<div className="absolute bottom-3 right-3 hidden flex-row items-center gap-2 group-hover:flex">
						<PlayIcon className="h-10 w-10 rounded-full bg-green-500 p-2 text-black" />
					</div>
				</div>
				<h1 className="mt-5 truncate text-lg font-bold text-white">{item.track.name}</h1>
				<p className="mt-2 line-clamp-2 text-sm font-semibold text-gray-400">
					{item.track.artists.map((artist) => artist.name).join(", ")}
				</p>
			</div>
		</div>
	);
}
