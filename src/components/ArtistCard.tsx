import { PlayIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";

import {
	HeaderAtomState,
	playlistAtomState,
	playlistContentAtomState,
	playlistHistoryAtomState,
	searchAtomState,
} from "@/components/atoms/playlistAtom";

export default function ArtistCard({ item }: { item: SpotifyApi.ArtistObjectFull }): React.JSX.Element {
	const setSearch = useRecoilState(searchAtomState)[1];
	const setHeaderOpacity = useRecoilState(HeaderAtomState)[1];
	const setPlaylistContent = useRecoilState(playlistContentAtomState)[1];
	const setPlaylistID = useRecoilState(playlistAtomState)[1];
	const setPlaylistHistory = useRecoilState(playlistHistoryAtomState)[1];
	return (
		<div
			onClick={(): void => {
				setSearch(false);
				setPlaylistID(`artist ${item.id}`);
				setPlaylistHistory((prev) => [...prev, `artist ${item.id}`]);
				setPlaylistContent(undefined);
				setHeaderOpacity("bg-opacity-0");
			}}
			className="group col-span-1 rounded-md bg-neutral-600 bg-opacity-10 cursor-pointer p-3 hover:bg-opacity-20 transition-all duration-300 ease-in-out">
			<div className="flex w-full flex-col gap-2">
				<div className="relative aspect-square w-full overflow-hidden rounded-xl shadow-neutral-900 shadow-lg transition-all duration-300 ease-in-out group">
					<Image
						src={item.images[0].url}
						className="rounded-md"
						width={300}
						height={300}
						alt={"Playlist Image"}
					/>
					<div className="absolute right-3 bottom-3 hidden group-hover:flex flex-row gap-2 items-center">
						<PlayIcon className="h-10 w-10 text-black rounded-full bg-green-500 p-2" />
					</div>
				</div>
				<h1 className="text-white text-lg font-bold mt-5 truncate">This is {item.name}</h1>
				<p className="text-gray-400 font-semibold text-sm mt-2">Artist</p>
			</div>
		</div>
	);
}
