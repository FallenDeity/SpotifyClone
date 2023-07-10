"use client";

import {
	ChevronDownIcon,
	ChevronLeftIcon,
	ChevronRightIcon,
	HeartIcon,
	HomeIcon,
	MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { CogIcon, LogOutIcon, UserIcon } from "lucide-react";
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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
			className={`sticky top-0 z-50 flex flex-row items-center justify-between p-3 ${headerOpacity} backdrop-blur-sm backdrop-filter ${
				// eslint-disable-next-line @typescript-eslint/restrict-template-expressions,@typescript-eslint/no-unnecessary-condition
				playlistContent && color.headerColor
			}`}>
			<div className="hidden flex-row items-center space-x-4 px-5 sm:flex">
				<ChevronLeftIcon
					className={`h-8 w-8 cursor-pointer rounded-full bg-black bg-opacity-50 p-1 text-gray-200 transition duration-300 hover:bg-opacity-75 hover:text-white ${
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
					className={`h-8 w-8 cursor-pointer rounded-full bg-black bg-opacity-50 p-1 text-gray-200 transition duration-300 hover:bg-opacity-75 hover:text-white ${
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
			<div className="flex flex-row items-center space-x-4 px-5 sm:hidden">
				<HomeIcon
					className="h-8 w-8 cursor-pointer rounded-full bg-black bg-opacity-50 p-2 text-gray-200 transition duration-300 hover:bg-opacity-75 hover:text-white"
					onClick={(): void => {
						setSearch(false);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-0");
					}}
				/>
				<HeartIcon
					className="h-8 w-8 cursor-pointer rounded-full bg-black bg-opacity-50 p-2 text-gray-200 transition duration-300 hover:bg-opacity-75 hover:text-white"
					onClick={(): void => {
						setSearch(false);
						setPlaylistHistory((prev) => [...prev, "liked-songs"]);
						setPlaylistID("liked-songs");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
				/>
				<MagnifyingGlassIcon
					className="h-8 w-8 cursor-pointer rounded-full bg-black bg-opacity-50 p-2 text-gray-200 transition duration-300 hover:bg-opacity-75 hover:text-white"
					onClick={(): void => {
						setSearch(true);
						setPlaylistID("");
						setPlaylistContent(undefined);
						setHeaderOpacity("bg-opacity-100");
					}}
				/>
			</div>
			<div className="flex flex-row items-center space-x-2 px-5">
				{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
				{session ? (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<div className="flex cursor-pointer flex-row items-center space-x-3 rounded-full bg-neutral-600 bg-opacity-50 p-1 transition duration-300 hover:bg-opacity-70">
								<Image
									src={session.user?.image ?? "/user.png"}
									className="rounded-full object-contain"
									width={30}
									height={30}
									alt={"User Image"}
								/>
								<p className="text-sm text-gray-200">{session.user?.name}</p>
								<ChevronDownIcon className="h-4 w-4 text-gray-200" />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="rounded-lg border-0 bg-neutral-800">
							<DropdownMenuLabel className="text-center text-sm font-semibold text-gray-200">
								Account
							</DropdownMenuLabel>
							<DropdownMenuSeparator className="bg-neutral-600" />
							<DropdownMenuItem className="space-x-3 text-sm text-gray-200 focus:bg-neutral-600 focus:text-white">
								<UserIcon className="mr-2 h-4 w-4" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem className="space-x-3 text-sm text-gray-200 focus:bg-neutral-600 focus:text-white">
								<CogIcon className="mr-2 h-4 w-4" />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem
								className="space-x-3 text-sm text-gray-200 focus:bg-neutral-600 focus:text-white"
								onClick={(): void => void signOut()}>
								<LogOutIcon className="mr-2 h-4 w-4" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				) : (
					<button
						className="rounded-full px-4 py-2 text-sm font-semibold text-gray-200 transition duration-300 hover:bg-white hover:text-black"
						onClick={(): void => router.push("/login")}>
						Login
					</button>
				)}
			</div>
		</div>
	);
}
