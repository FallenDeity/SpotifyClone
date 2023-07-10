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
	const handlePlayPause = (): void => {
		if (!trackID) return;
		if (isPlaying) {
			void spotifyApi.pause();
		} else {
			void spotifyApi.play();
		}
		setIsPlaying(!isPlaying);
	};
	return (
		<div className="fixed bottom-0 z-10 flex h-20 w-full flex-row items-center justify-between bg-gradient-to-b from-black to-gray-900 px-2 sm:px-5">
			<div className="flex flex-row items-center space-x-3">
				{Track?.album.images[0]?.url ? (
					<Image
						src={Track.album.images[0].url}
						className="h-12 w-12 rounded-md object-contain"
						width={50}
						height={50}
						alt={"Album Image"}
					/>
				) : (
					<div className="h-12 w-12 rounded-md bg-gray-300" />
				)}
				<div className="flex flex-col">
					<p className="w-[9rem] truncate text-sm font-semibold text-gray-300">{Track?.name ?? "No Track"}</p>
					<p className="w-[9rem] truncate text-xs text-gray-400">
						{Track?.artists.map((artist) => artist.name).join(", ") ?? "No Artist"}
					</p>
				</div>
			</div>
			<div className="hidden flex-col items-center sm:flex">
				<div className="flex flex-row items-center space-x-3">
					<BiShuffle
						onClick={(): void => {
							if (!trackID) return;
							void spotifyApi.setShuffle(!isShuffle);
							setIsShuffle(!isShuffle);
						}}
						className={`h-4 w-4 cursor-pointer text-gray-300 transition duration-300 hover:text-white
						${
							/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
							isShuffle && "text-green-500"
						}`}
					/>
					<AiFillStepBackward
						className="h-5 w-5 cursor-pointer text-gray-300 transition duration-300 hover:text-white"
						onClick={(): void => {
							if (!trackID) return;
							void spotifyApi.skipToPrevious();
						}}
					/>
					<PlayIcon
						className="h-8 w-8 cursor-pointer text-gray-300 transition duration-300 hover:text-white"
						onClick={handlePlayPause}
					/>
					<AiFillStepForward
						className="h-5 w-5 cursor-pointer text-gray-300 transition duration-300 hover:text-white"
						onClick={(): void => {
							if (!trackID) return;
							void spotifyApi.skipToNext();
						}}
					/>
					<RxLoop
						onClick={(): void => {
							if (!trackID) return;
							void spotifyApi.setRepeat(!isRepeat ? "track" : "off");
							setIsRepeat(!isRepeat);
						}}
						className={`h-4 w-4 cursor-pointer text-gray-300 transition duration-300 hover:text-white
						${
							/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */
							isRepeat && "text-green-500"
						}`}
					/>
				</div>
				<div className="mt-1 flex flex-row items-center space-x-3 sm:w-[18rem] md:w-[25rem] lg:w-[32rem]">
					<p className="text-xs text-gray-300">{millisecondsToMinutesAndSeconds(progressInterval)}</p>
					<Slider
						value={Number((progressInterval / (Track?.duration_ms ?? 0)) * 100)}
						onChange={(value): void => {
							if (!trackID) return;
							void spotifyApi.seek((Track?.duration_ms ?? 0) * (value / 100));
							setProgressInterval((Track?.duration_ms ?? 0) * (value / 100));
						}}
					/>
					<p className="text-xs text-gray-300">{millisecondsToMinutesAndSeconds(Track?.duration_ms ?? 0)}</p>
				</div>
			</div>
			<div className="hidden flex-row items-center space-x-3 sm:flex sm:w-[6rem] md:w-[8rem]">
				<HiQueueList
					size={34}
					className="cursor-pointer text-gray-300 transition duration-300 hover:text-white"
				/>
				<VolumeIcon
					size={34}
					onClick={(): void => {
						void spotifyApi.setVolume(volume === 0 ? 100 : 0);
						setVolume(volume === 0 ? 100 : 0);
					}}
					className="cursor-pointer text-gray-300 transition duration-300 hover:text-white"
				/>
				<Slider
					value={volume}
					onChange={(value): void => {
						void spotifyApi.setVolume(value);
						setVolume(value);
					}}
				/>
			</div>
			<div className="flex flex-row items-center space-x-3 sm:hidden">
				<PlayIcon
					className="h-8 w-8 cursor-pointer text-gray-300 transition duration-300 hover:text-white"
					onClick={handlePlayPause}
				/>
			</div>
		</div>
	);
}
