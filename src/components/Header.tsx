"use client";

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
	HomeIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { useRecoilState } from "recoil";

import {
	HeaderAtomState,
	playlistAtomState,
	playlistContentAtomState,
	playlistHistoryAtomState,
	playlistHistoryIndexAtomState,
	searchAtomState,
} from "@/components/atoms/playlistAtom";
import { UserSession } from "@/utils/models";

export default function Header({ color }: { color: { headerColor: string } }): React.JSX.Element {
	const { data: session } = useSession() as { data: UserSession };
	const router = useRouter();
	const headerOpacity = useRecoilState(HeaderAtomState)[0];
	const [playlistHistory, setPlaylistHistory] = useRecoilState(playlistHistoryAtomState);
	const [playlistHistoryIndex, setPlaylistHistoryIndex] = useRecoilState(playlistHistoryIndexAtomState);
	const [playlistContent, setPlaylistContent] = useRecoilState(playlistContentAtomState);
	const setSearch = useRecoilState(searchAtomState)[1];
	const setPlaylistID = useRecoilState(playlistAtomState)[1];
	const setHeaderOpacity = useRecoilState(HeaderAtomState)[1];
	return (
		<div
			className={`flex flex-row items-center justify-between sticky top-0 z-50 p-3 ${headerOpacity} backdrop-filter backdrop-blur-sm ${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unnecessary-condition
				playlistContent && color.headerColor
			}`}>
			<div className="flex-row px-5 items-center space-x-4 hidden sm:flex">
				<ChevronLeftIcon
					className={`w-8 h-8 p-1 text-gray-200 bg-black rounded-full hover:text-white transition duration-300 cursor-pointer bg-opacity-50 hover:bg-opacity-75 ${
						playlistHistoryIndex === 0 ? "opacity-50" : ""
					}`}
					onClick={(): void => {
						if (playlistHistoryIndex > 0) {
							setHeaderOpacity("bg-opacity-100");
							setPlaylistID(playlistHistory[playlistHistoryIndex - 1]);
							setPlaylistHistoryIndex(playlistHistoryIndex - 1);
						}
					}}
				/>
				<ChevronRightIcon
					className={`w-8 h-8 p-1 text-gray-200 bg-black rounded-full hover:text-white transition duration-300 cursor-pointer bg-opacity-50 hover:bg-opacity-75 ${
						playlistHistoryIndex === playlistHistory.length - 1 ? "opacity-50" : ""
					}`}
					onClick={(): void => {
						if (playlistHistoryIndex < playlistHistory.length - 1) {
							setHeaderOpacity("bg-opacity-100");
							setPlaylistID(playlistHistory[playlistHistoryIndex + 1]);
							setPlaylistHistoryIndex(playlistHistoryIndex + 1);
						}
					}}
				/>
			</div>
			<div className="flex-row items-center space-x-4 sm:hidden flex px-5">
				<HomeIcon
					className="w-8 h-8 p-2 text-gray-200 bg-black rounded-full hover:text-white transition duration-300 cursor-pointer bg-opacity-50 hover:bg-opacity-75"
					onClick={(): void => {
						setSearch(false);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-0");
					}}
				/>
				<HeartIcon
					className="w-8 h-8 p-2 text-gray-200 bg-black rounded-full hover:text-white transition duration-300 cursor-pointer bg-opacity-50 hover:bg-opacity-75"
					onClick={(): void => {
						setSearch(false);
						setPlaylistHistory((prev) => [...prev, "liked-songs"]);
						setPlaylistID("liked-songs");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
				/>
				<MagnifyingGlassIcon
					className="w-8 h-8 p-2 text-gray-200 bg-black rounded-full hover:text-white transition duration-300 cursor-pointer bg-opacity-50 hover:bg-opacity-75"
					onClick={(): void => {
						setSearch(true);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
				/>
			</div>
			<div className="flex-row items-center space-x-2 flex px-5">
				{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
				{session ? (
					<div
						className="flex flex-row items-center space-x-3 cursor-pointer bg-neutral-600 bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition duration-300"
						/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
						onClick={async (): Promise<void> => await signOut()}>
						<Image
							src={session.user?.image ?? "/user.png"}
							className="rounded-full object-contain"
							width={30}
							height={30}
							alt={"User Image"}
						/>
						<p className="text-sm text-gray-200">{session.user?.name}</p>
						<ChevronDownIcon className="w-4 h-4 text-gray-200" />
					</div>
				) : (
					<button
						className="px-4 py-2 font-semibold text-sm text-gray-200 rounded-full hover:bg-white hover:text-black transition duration-300"
						onClick={(): void => router.push("/login")}>
						Login
					</button>
				)}
			</div>
		</div>
	);
}
