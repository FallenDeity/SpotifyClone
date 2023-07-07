"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { BiShuffle } from "react-icons/bi";
import { BsFillPauseCircleFill, BsFillPlayCircleFill } from "react-icons/bs";
import { HiQueueList, HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import { RxLoop } from "react-icons/rx";
import { useRecoilState } from "recoil";

import { TrackIDAtomState } from "@/components/atoms/playlistAtom";
import Slider from "@/components/Slider";
import useSpotify from "@/hooks/useSpotify";
import { UserSession } from "@/utils/models";

function millisecondsToMinutesAndSeconds(ms: number): string {
	const minutes = Math.floor(ms / 60000);
	const seconds = ((ms % 60000) / 1000).toFixed(0);
	return `${minutes}:${+seconds < 10 ? "0" : ""}${seconds}`;
}

export default function Player(): React.JSX.Element {
	const { data: session } = useSession() as { data: UserSession };
	const [volume, setVolume] = React.useState(0);
	const [progressInterval, setProgressInterval] = React.useState(0);
	const [isPlaying, setIsPlaying] = React.useState(false);
	const [isShuffle, setIsShuffle] = React.useState(false);
	const [isRepeat, setIsRepeat] = React.useState(false);
	const [Track, setTrack] = React.useState<SpotifyApi.TrackObjectFull>();
	const [trackID, setTrackID] = useRecoilState(TrackIDAtomState);
	const spotifyApi = useSpotify();
	const PlayIcon = isPlaying ? BsFillPauseCircleFill : BsFillPlayCircleFill;
	const VolumeIcon = volume > 0 ? HiSpeakerWave : HiSpeakerXMark;
	const fetchCurrentData = (): void => {
		void spotifyApi.getMyCurrentPlaybackState().then((data) => {
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			data.body && setTrack(data.body.item as SpotifyApi.TrackObjectFull);
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
			if (data.body) {
				setTrackID(data.body.item?.id ?? "");
				setVolume(data.body.device.volume_percent ?? 0);
				setIsPlaying(Boolean(data.body.is_playing));
				setIsShuffle(Boolean(data.body.shuffle_state));
				setIsRepeat(data.body.repeat_state === "track");
				setProgressInterval(data.body.progress_ms ?? 0);
			}
		});
	};
	React.useEffect(() => {
		if (spotifyApi.getAccessToken()) {
			if (trackID) {
				void spotifyApi.getTrack(trackID).then((data) => {
					setTrack(data.body);
				});
			} else {
				console.log("No Track ID");
				fetchCurrentData();
			}
		}
	}, [spotifyApi, trackID, session]);
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-expect-error
	React.useEffect((): (() => void) => {
		if (spotifyApi.getAccessToken()) {
			const interval = setInterval(() => {
				fetchCurrentData();
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [spotifyApi, trackID, session]);
	return (
		<div className="fixed bottom-0 sm:px-5 px-2 flex flex-row justify-between items-center bg-gradient-to-b from-black to-gray-900 w-full h-20 z-10">
			<div className="flex flex-row items-center space-x-3">
				{Track?.album.images[0]?.url ? (
					<Image
						src={Track.album.images[0].url}
						className="rounded-md object-contain w-12 h-12"
						width={50}
						height={50}
						alt={"Album Image"}
					/>
				) : (
					<div className="w-12 h-12 bg-gray-300 rounded-md" />
				)}
				<div className="flex flex-col">
					<p className="text-sm text-gray-300 font-semibold w-[150px] truncate">
						{Track?.name ?? "No Track"}
					</p>
					<p className="text-xs text-gray-400 w-[150px] truncate">
						{Track?.artists.map((artist) => artist.name).join(", ") ?? "No Artist"}
					</p>
				</div>
			</div>
			<div className="flex-col items-center hidden sm:flex">
				<div className="flex flex-row items-center space-x-3">
					<BiShuffle
						className={`w-4 h-4 text-gray-300 cursor-pointer hover:text-white transition duration-300
						${
							/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
							isShuffle && "text-green-500"
						}`}
					/>
					<AiFillStepBackward className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white transition duration-300" />
					<PlayIcon className="w-8 h-8 text-gray-300 cursor-pointer hover:text-white transition duration-300" />
					<AiFillStepForward className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white transition duration-300" />
					<RxLoop
						className={`w-4 h-4 text-gray-300 cursor-pointer hover:text-white transition duration-300
						${
							/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
							isRepeat && "text-green-500"
						}`}
					/>
				</div>
				<div className="flex flex-row items-center space-x-3 mt-1 sm:w-[300px] md:w-[400px] lg:w-[500px]">
					<p className="text-xs text-gray-300">{millisecondsToMinutesAndSeconds(progressInterval)}</p>
					<Slider value={Number((progressInterval / (Track?.duration_ms ?? 0)) * 100)} />
					<p className="text-xs text-gray-300">{millisecondsToMinutesAndSeconds(Track?.duration_ms ?? 0)}</p>
				</div>
			</div>
			<div className="hidden sm:flex flex-row items-center space-x-3 sm:w-[100px] md:w-[130px]">
				<HiQueueList
					size={34}
					className="text-gray-300 cursor-pointer hover:text-white transition duration-300"
				/>
				<VolumeIcon
					size={34}
					onClick={(): void => setVolume(volume > 0 ? 0 : 100)}
					className="text-gray-300 cursor-pointer hover:text-white transition duration-300"
				/>
				<Slider value={volume} />
			</div>
			<div className="flex flex-row items-center space-x-3 sm:hidden">
				<PlayIcon className="w-8 h-8 text-gray-300 cursor-pointer hover:text-white transition duration-300" />
			</div>
		</div>
	);
}
