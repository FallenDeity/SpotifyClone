"use client";

import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import { HeartIcon, HomeIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import React from "react";
import { useRecoilState } from "recoil";

import {
	DailyMixAtomState,
	HeaderAtomState,
	playlistAtomState,
	playlistContentAtomState,
	playlistHistoryAtomState,
	searchAtomState,
} from "@/components/atoms/playlistAtom";
import useSpotify from "@/hooks/useSpotify";
import { UserSession } from "@/utils/models";

export default function SideBar(): React.JSX.Element {
	const { data: session } = useSession() as { data: UserSession };
	const pathname = usePathname();
	const spotifyApi = useSpotify();
	const setPlaylistHistory = useRecoilState(playlistHistoryAtomState)[1];
	const [dailyMixContent, setDailyMixContent] =
		useRecoilState<SpotifyApi.PlaylistObjectSimplified[]>(DailyMixAtomState);
	const [search, setSearch] = useRecoilState(searchAtomState);
	const setPlaylistContent = useRecoilState(playlistContentAtomState)[1];
	const [playlists, setPlaylists] = React.useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
	const [playlistID, setPlaylistID] = useRecoilState(playlistAtomState);
	const setHeaderOpacity = useRecoilState(HeaderAtomState)[1];
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken()) {
			const options = { limit: 50, offset: 0 };
			void spotifyApi.getUserPlaylists(options).then((data) => {
				setPlaylists(data.body.items);
				const next = data.body.next;
				if (next) {
					for (let i = options.offset + options.limit; i < data.body.total; i += options.limit) {
						options.offset = i;
						void spotifyApi.getUserPlaylists(options).then((data) => {
							setPlaylists((playlists) => [...playlists, ...data.body.items]);
						});
					}
				}
			});
		}
	}, [session, spotifyApi]);
	React.useEffect((): void => {
		for (const playlist of playlists) {
			if (RegExp(/Daily Mix [1-6]/).exec(playlist.name)) {
				const names = dailyMixContent.map((item) => item.name && item.owner.id === "spotify" && item.name);
				if (!names.includes(playlist.name)) {
					setDailyMixContent((dailyMixContent) => [...dailyMixContent, playlist]);
				}
			}
		}
	}, [playlists, dailyMixContent, setDailyMixContent]);
	return (
		<div className="hidden flex-col text-sm sm:flex">
			<div className="space-y-3 rounded-md bg-white bg-opacity-10 p-3">
				<button
					onClick={(): void => {
						setSearch(false);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-0");
					}}
					className={`flex items-center space-x-3 hover:text-white ${
						pathname === "/" && playlistID === "" && !search ? "text-gray-100" : "text-gray-400"
					}`}>
					<HomeIcon className="h-6 w-6" />
					<p>Home</p>
				</button>
				<button
					onClick={(): void => {
						setSearch(false);
						setPlaylistID("liked-songs");
						setPlaylistHistory((prev) => [...prev, "liked-songs"]);
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
					className={`flex items-center space-x-3 hover:text-white ${
						playlistID === "liked-songs" ? "text-gray-100" : "text-gray-400"
					}`}>
					<HeartIcon className="h-6 w-6" />
					<p>Liked Songs</p>
				</button>
				<button
					/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
					onClick={(): void => {
						setSearch(true);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
					className={`flex items-center space-x-3 hover:text-white ${
						search ? "text-gray-100" : "text-gray-400"
					}`}>
					<MagnifyingGlassIcon className="h-6 w-6" />
					<p>Search</p>
				</button>
			</div>
			<div className="mt-5 rounded-t bg-white bg-opacity-10 p-4">
				<div className="flex flex-row items-center space-x-3 text-gray-400">
					<MusicalNoteIcon className="h-6 w-6" />
					<p>Your Library</p>
					<div className="flex-grow" />
					<PlusIcon className="h-6 w-6 cursor-pointer hover:text-white" />
				</div>
			</div>
			<div className="flex-grow space-y-3 overflow-y-auto rounded-b bg-white bg-opacity-10 p-4 scrollbar-thin scrollbar-thumb-gray-600 sm:w-[30vw] lg:w-[25vw]">
				{playlists.map((data) => (
					<div
						key={data.id}
						className={`flex cursor-pointer items-center space-x-3 text-gray-400 hover:text-white ${
							playlistID === data.id ? "text-white" : ""
						}`}
						onClick={(): void => {
							setSearch(false);
							setPlaylistID(data.id);
							setPlaylistHistory((prev) => [...prev, data.id]);
							setPlaylistContent(undefined);
							setHeaderOpacity("bg-opacity-100");
						}}>
						<Image
							src={data.images[0].url}
							alt={data.name}
							width={40}
							height={40}
							className={"h-10 w-10 rounded-md"}
						/>
						<p className="truncate">{data.name}</p>
					</div>
				))}
			</div>
		</div>
	);
}
