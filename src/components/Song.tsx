import { EllipsisHorizontalIcon, HeartIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import React from "react";
import { useRecoilState } from "recoil";

import { TrackIDAtomState } from "@/components/atoms/playlistAtom";
import useSpotify from "@/hooks/useSpotify";

function millisecondsToMinutesAndSeconds(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = ((ms % 60000) / 1000).toFixed(0);
	return `${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`;
}

export default function Song({
	track,
	index,
}: {
	track: SpotifyApi.PlaylistTrackObject;
	index: number;
}): React.JSX.Element {
	const spotifyApi = useSpotify();
	const setTrackID = useRecoilState(TrackIDAtomState)[1];
	return (
		<>
			<div
				key={track.track?.id}
				onClick={(): void => {
					setTrackID(track.track?.id ?? "");
					void spotifyApi.addToQueue(track.track?.uri ?? "");
				}}
				className="flex flex-row items-center justify-between px-2 py-2 hover:bg-white hover:bg-opacity-10 transition duration-300 cursor-pointer">
				<div className="flex flex-row items-center space-x-5">
					<div className="flex flex-col items-center justify-center">
						<p className="text-sm text-gray-200 font-bold">{index + 1}</p>
					</div>
					{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
					{track.track?.album?.images[0]?.url && (
						<Image
							src={track.track.album.images[0].url}
							className="rounded-md object-contain w-10 h-10"
							width={50}
							height={50}
							alt={"Album Image"}
						/>
					)}
					<div className="flex flex-col items-start justify-center">
						<p className="text-sm text-gray-200 font-bold truncate w-[8rem] sm:w-[10rem] md:w-[15rem]">
							{track.track?.name}
						</p>
						<p className="text-xs text-gray-300 w-[8rem] sm:w-[10rem] md:w-[15rem] truncate">
							{track.track?.artists.map((artist) => artist.name).join(", ")}
						</p>
					</div>
				</div>
				<div className="flex flex-row items-center space-x-3">
					<p className="text-xs text-gray-300">
						{millisecondsToMinutesAndSeconds(track.track?.duration_ms ?? 0)}
					</p>
					<HeartIcon className="w-5 h-5 text-gray-200" />
					<EllipsisHorizontalIcon className="w-5 h-5 text-gray-200" />
				</div>
			</div>
			<hr className="border-neutral-800" />
		</>
	);
}
