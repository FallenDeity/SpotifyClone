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

function parseAnchorTags(text: string): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, "text/html");
	const aTags = doc.getElementsByTagName("a");
	if (aTags.length === 0) return text;
	const textNodes = Array.from(aTags).map((aTag) => aTag.childNodes[0].nodeValue);
	return textNodes.join(", ") + " and more...";
}

export default function PlaylistCard({ item }: { item: SpotifyApi.PlaylistObjectSimplified }): React.JSX.Element {
	const setSearch = useRecoilState(searchAtomState)[1];
	const setHeaderOpacity = useRecoilState(HeaderAtomState)[1];
	const setPlaylistContent = useRecoilState(playlistContentAtomState)[1];
	const setPlaylistID = useRecoilState(playlistAtomState)[1];
	const setPlaylistHistory = useRecoilState(playlistHistoryAtomState)[1];
	return (
		<div
			onClick={(): void => {
				setSearch(false);
				setPlaylistID(item.id);
				setPlaylistHistory((prev) => [...prev, item.id]);
				setPlaylistContent(undefined);
				setHeaderOpacity("bg-opacity-0");
			}}
			className="group col-span-1 cursor-pointer rounded-md bg-neutral-600 bg-opacity-10 p-3 transition-all duration-300 ease-in-out hover:bg-opacity-20">
			<div className="flex w-full flex-col gap-2">
				<div className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-lg shadow-neutral-900 transition-all duration-300 ease-in-out">
					<Image
						src={item.images[0].url}
						className="rounded-md"
						width={300}
						height={300}
						alt={"Playlist Image"}
					/>
					<div className="absolute bottom-3 right-3 hidden flex-row items-center gap-2 group-hover:flex">
						<PlayIcon className="h-10 w-10 rounded-full bg-green-500 p-2 text-black" />
					</div>
				</div>
				<h1 className="mt-5 truncate text-lg font-bold text-white">{item.name}</h1>
				<p className="mt-2 line-clamp-3 text-sm font-semibold text-gray-400">
					{parseAnchorTags(item.description ?? "")}
				</p>
			</div>
		</div>
	);
}
