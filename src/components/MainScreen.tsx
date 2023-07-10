"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useSession } from "next-auth/react";
import React from "react";
import { useRecoilState } from "recoil";

import ArtistCard from "@/components/ArtistCard";
import {
	DailyMixAtomState,
	HeaderAtomState,
	playlistAtomState,
	playlistContentAtomState,
	playlistHistoryAtomState,
	searchAtomState,
	TrackIDAtomState,
} from "@/components/atoms/playlistAtom";
import Header from "@/components/Header";
import PlaylistCard from "@/components/PlaylistCard";
import SearchCard from "@/components/SearchCard";
import Song from "@/components/Song";
import SongCard from "@/components/SongCard";
import useSpotify from "@/hooks/useSpotify";
import { UserSession } from "@/utils/models";

interface Color {
	color: string;
	headerColor: string;
}

const colors: Color[] = [
	{ color: "bg-gradient-to-b from-green-400 via-blue-500", headerColor: "bg-green-400" },
	{ color: "bg-gradient-to-b from-yellow-400 via-red-500", headerColor: "bg-yellow-400" },
	{ color: "bg-gradient-to-b from-purple-400 via-pink-500", headerColor: "bg-purple-400" },
	{ color: "bg-gradient-to-b from-blue-400 via-indigo-500", headerColor: "bg-blue-400" },
	{ color: "bg-gradient-to-b from-pink-400 via-red-500 via-yellow-500", headerColor: "bg-pink-400" },
	{ color: "bg-gradient-to-b from-yellow-400 via-green-500 via-blue-500", headerColor: "bg-yellow-400" },
	{ color: "bg-gradient-to-b from-red-400 via-pink-500 via-purple-500", headerColor: "bg-red-400" },
	{ color: "bg-gradient-to-b from-green-400 via-blue-500 via-indigo-500", headerColor: "bg-green-400" },
	{ color: "bg-gradient-to-b from-yellow-400 via-red-500 via-pink-500", headerColor: "bg-yellow-400" },
	{ color: "bg-gradient-to-b from-purple-400 via-pink-500 via-red-500", headerColor: "bg-purple-400" },
	{ color: "bg-gradient-to-b from-blue-400 via-indigo-500 via-purple-500", headerColor: "bg-blue-400" },
	{ color: "bg-gradient-to-b from-pink-400 via-red-500 via-yellow-500", headerColor: "bg-pink-400" },
	{ color: "bg-gradient-to-b from-yellow-400 via-green-500 via-blue-500", headerColor: "bg-yellow-400" },
	{ color: "bg-gradient-to-b from-red-400 via-pink-500 via-purple-500", headerColor: "bg-red-400" },
	{ color: "bg-gradient-to-b from-green-400 via-blue-500 via-indigo-500", headerColor: "bg-green-400" },
	{ color: "bg-gradient-to-b from-yellow-400 via-red-500 via-pink-500", headerColor: "bg-yellow-400" },
	{ color: "bg-gradient-to-b from-purple-400 via-pink-500 via-red-500", headerColor: "bg-purple-400" },
	{ color: "bg-gradient-to-b from-blue-400 via-indigo-500 via-purple-500", headerColor: "bg-blue-400" },
];

function instanceofSinglePlaylistResponse(
	playlistContent:
		| SpotifyApi.SinglePlaylistResponse
		| SpotifyApi.SavedTrackObject[]
		| SpotifyApi.TrackObjectSimplified[]
): playlistContent is SpotifyApi.SinglePlaylistResponse {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return (playlistContent as SpotifyApi.SinglePlaylistResponse).tracks !== undefined;
}

function instanceofSingleArtistResponse(
	userProfile: SpotifyApi.UserProfileResponse | SpotifyApi.SingleArtistResponse | undefined
): userProfile is SpotifyApi.SingleArtistResponse {
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	return (userProfile as SpotifyApi.SingleArtistResponse)?.name !== undefined;
}

function parseAnchorTags(text: string): string {
	const parser = new DOMParser();
	const doc = parser.parseFromString(text, "text/html");
	const aTags = doc.getElementsByTagName("a");
	if (aTags.length === 0) return text;
	const textNodes = Array.from(aTags).map((aTag) => aTag.childNodes[0].nodeValue);
	return textNodes.join(", ") + " and more...";
}

export default function MainScreen(): React.JSX.Element {
	const { data: session } = useSession() as { data: UserSession };
	const spotifyApi = useSpotify();
	const [search, setSearch] = useRecoilState(searchAtomState);
	const setTrackID = useRecoilState(TrackIDAtomState)[1];
	const [searchResults, setSearchResults] = React.useState<SpotifyApi.SearchResponse>();
	const [mixes, setMixes] = React.useState<SpotifyApi.PlaylistObjectSimplified[]>([]);
	const [featuredPlaylists, setFeaturedPlaylists] = React.useState<SpotifyApi.PlaylistObjectSimplified[]>();
	const DailyMixContent = useRecoilState<SpotifyApi.PlaylistObjectSimplified[]>(DailyMixAtomState)[0];
	const [topArtists, setTopArtists] = React.useState<SpotifyApi.ArtistObjectFull[]>();
	const [recentlyPlayed, setRecentlyPlayed] = React.useState<SpotifyApi.PlayHistoryObject[]>();
	const setHeaderOpacity = useRecoilState(HeaderAtomState)[1];
	const [color, setColor] = React.useState<Color>({ color: "", headerColor: "" });
	const [playlistID, setPlaylistID] = useRecoilState(playlistAtomState);
	const [playlistContent, setPlaylistContent] = useRecoilState<
		| SpotifyApi.SinglePlaylistResponse
		| SpotifyApi.SavedTrackObject[]
		| undefined
		| SpotifyApi.TrackObjectSimplified[]
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
	>(playlistContentAtomState);
	const setPlaylistHistory = useRecoilState(playlistHistoryAtomState)[1];
	const [user, setUser] = React.useState<SpotifyApi.UserProfileResponse | SpotifyApi.SingleArtistResponse>();
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken() && playlistID) {
			setColor(colors[Math.floor(Math.random() * colors.length)]);
			if (playlistID === "liked-songs") {
				const options = { limit: 50, offset: 0 };
				void spotifyApi.getMySavedTracks(options).then((data) => {
					setPlaylistContent(data.body.items);
					const next = data.body.next;
					if (next) {
						for (let i = options.offset + options.limit; i < data.body.total; i += options.limit) {
							options.offset = i;
							void spotifyApi.getMySavedTracks(options).then((data): void => {
								setPlaylistContent((prev) => [
									...(prev as SpotifyApi.SavedTrackObject[]),
									...data.body.items,
								]);
							});
						}
					}
				});
			} else if (playlistID.includes("artist")) {
				const options = { limit: 15, offset: 0 };
				void spotifyApi.getArtistAlbums(playlistID.split(" ")[1], options).then((data) => {
					const albums = data.body.items;
					const albumIDs = albums.map((album) => album.id);
					void spotifyApi.getAlbums(albumIDs).then((data) => {
						const dataItems = data.body.albums;
						const tracks = dataItems.map((album) =>
							album.tracks.items.map((track) => {
								return { ...track, album: album };
							})
						);
						const tracksFlat = tracks.flat();
						setPlaylistContent(tracksFlat);
					});
					for (let i = options.offset + options.limit; i < data.body.total; i += options.limit) {
						options.offset = i;
						void spotifyApi.getArtistAlbums(playlistID.split(" ")[1], options).then((data) => {
							const albums = data.body.items;
							const albumIDs = albums.map((album) => album.id);
							void spotifyApi.getAlbums(albumIDs).then((data) => {
								const dataItems = data.body.albums;
								const tracks = dataItems.map((album) =>
									album.tracks.items.map((track) => {
										return { ...track, album: album };
									})
								);
								const tracksFlat = tracks.flat();
								setPlaylistContent((prev) =>
									[...(prev as SpotifyApi.TrackObjectFull[]), ...tracksFlat].slice(0, 300)
								);
							});
						});
					}
				});
			} else {
				void spotifyApi.getPlaylist(playlistID).then((data) => {
					setPlaylistContent(data.body);
					const next = data.body.tracks.next;
					const options = { limit: 100, offset: 0 };
					if (next) {
						for (let i = options.offset + options.limit; i < data.body.tracks.total; i += options.limit) {
							options.offset = i;
							void spotifyApi.getPlaylistTracks(playlistID, options).then((data): void => {
								// eslint-disable-next-line @typescript-eslint/ban-ts-comment
								// @ts-expect-error
								setPlaylistContent((prev) => ({
									...prev,
									tracks: {
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-expect-error
										...(prev.tracks as SpotifyApi.PagingObject<SpotifyApi.PlaylistTrackObject>),
										items: [
											// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/ban-ts-comment
											// @ts-expect-error
											// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
											...(prev.tracks.items as SpotifyApi.PlaylistTrackObject[]),
											...data.body.items,
										] as SpotifyApi.PlaylistTrackObject[],
									},
								}));
							});
						}
					}
				});
			}
		}
	}, [session, spotifyApi, playlistID]);
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken() && playlistContent) {
			if ("owner" in playlistContent) {
				void spotifyApi.getUser(playlistContent.owner.id).then((data) => setUser(data.body));
			} else if (playlistID.includes("artist")) {
				void spotifyApi.getArtist(playlistID.split(" ")[1]).then((data) => setUser(data.body));
			} else {
				void spotifyApi.getMe().then((data) => setUser(data.body));
			}
		}
	}, [session, spotifyApi, playlistContent]);
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken()) {
			void spotifyApi.getMyRecentlyPlayedTracks().then((data) => setRecentlyPlayed(data.body.items));
		}
	}, [session, spotifyApi]);
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken()) {
			void spotifyApi.getMyTopArtists().then((data) => {
				setTopArtists(data.body.items);
			});
		}
	}, [session, spotifyApi]);
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken()) {
			const options = { limit: 50, offset: 0, locale: "en_US" };
			void spotifyApi.getFeaturedPlaylists(options).then((data) => {
				setFeaturedPlaylists(data.body.playlists.items);
			});
		}
	}, [session, spotifyApi]);
	React.useEffect((): void => {
		if (spotifyApi.getAccessToken()) {
			const options = { limit: 50, offset: 0 };
			void spotifyApi.search("mix", ["playlist"], options).then((data) => {
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				setMixes(data.body.playlists.items.filter((playlist) => playlist.owner.id === "spotify"));
			});
		}
	}, [session, spotifyApi]);
	const HandleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
		if (e.target.value.trim() === "") return;
		const options = { limit: 10, offset: 0 };
		void spotifyApi.search(e.target.value, ["artist", "playlist", "track"], options).then((data) => {
			setSearchResults(data.body);
		});
	};
	const scrollHandler = (e: React.UIEvent<HTMLDivElement>): void => {
		if (e.currentTarget.scrollTop > 60) {
			setHeaderOpacity("bg-opacity-0");
		}
		if (e.currentTarget.scrollTop < 60) {
			setHeaderOpacity("bg-opacity-100");
		}
	};
	return (
		<div
			onScroll={scrollHandler}
			className="flex flex-grow flex-col overflow-y-auto rounded-md bg-white bg-opacity-10 scrollbar-hide sm:ml-3">
			<Header color={playlistID ? color : { headerColor: "" }} />
			{search && (
				<>
					<div className="mt-5 flex flex-grow flex-col items-center">
						<div className="relative w-4/5 sm:w-2/3">
							<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-neutral-100" />
							<input
								onChange={HandleSearch}
								className="w-full truncate rounded-full bg-neutral-500 bg-opacity-10 p-2 px-5 pl-10 text-neutral-100"
								type="text"
								placeholder="Search for a song, artist, or album"
							/>
						</div>
					</div>
					<div className="mt-5 flex flex-grow flex-col items-center overflow-y-auto scrollbar-hide">
						{searchResults?.tracks &&
							searchResults.tracks.items.map((item) => (
								<SearchCard item={item} callback={(): void => setTrackID(item.id)} key={item.id} />
							))}
						{searchResults?.playlists &&
							searchResults.playlists.items.map((item) => (
								<SearchCard
									/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
									// @ts-expect-error
									item={{ ...item, album: item }}
									callback={(): void => {
										setSearch(false);
										setPlaylistID(item.id);
										setPlaylistHistory((prev) => [...prev, item.id]);
										setPlaylistContent(undefined);
										setHeaderOpacity("bg-opacity-100");
									}}
									key={item.id}
								/>
							))}
						{searchResults?.artists &&
							searchResults.artists.items.map((item) => (
								<SearchCard
									/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
									// @ts-expect-error
									item={{ ...item, album: item }}
									callback={(): void => {
										setSearch(false);
										setPlaylistID(`artist ${item.id}`);
										setPlaylistHistory((prev) => [...prev, `artist ${item.id}`]);
										setPlaylistContent(undefined);
										setHeaderOpacity("bg-opacity-100");
									}}
									key={item.id}
								/>
							))}
					</div>
				</>
			)}
			{!playlistContent && !playlistID && !search && (
				<div className="flex flex-grow flex-col space-y-10 p-5">
					{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
					{DailyMixContent.length ? (
						<>
							<h1 className="px-5 text-3xl font-bold text-neutral-100">Daily Mixes</h1>
							<div className="grid gap-5 px-5 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
								{DailyMixContent.map((item) => (
									<div
										key={item.id}
										onClick={(): void => {
											setPlaylistID(item.id);
											setPlaylistHistory((prev) => [...prev, item.id]);
											setPlaylistContent(undefined);
											setHeaderOpacity("bg-opacity-100");
										}}
										className="flex cursor-pointer flex-row space-x-5 rounded-md bg-neutral-500 bg-opacity-10 transition duration-200 ease-in-out hover:bg-opacity-20">
										<Image
											src={item.images[0].url}
											width={50}
											height={50}
											unoptimized={true}
											alt={item.name}
											className="h-20 w-20 rounded-md"
										/>
										<div className="flex flex-col justify-center">
											<h1 className="text-xl font-bold text-neutral-100">{item.name}</h1>
										</div>
									</div>
								))}
							</div>
						</>
					) : (
						<></>
					)}
					{featuredPlaylists ? (
						<>
							<h1 className="px-5 text-3xl font-bold text-neutral-100">Your Local Mixes</h1>
							<div className="relative z-0 mt-5 grid auto-cols-[12rem] grid-flow-col gap-6 overflow-x-auto px-5 pt-2 scrollbar-hide">
								{featuredPlaylists.map((item) => (
									<PlaylistCard item={item} key={item.id} />
								))}
							</div>
						</>
					) : (
						<></>
					)}
					{/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
					{mixes ? (
						<>
							<h1 className="px-5 text-3xl font-bold text-neutral-100">Your Top Mixes</h1>
							<div className="relative z-0 mt-5 grid auto-cols-[12rem] grid-flow-col gap-6 overflow-x-auto px-5 pt-2 scrollbar-hide">
								{mixes.map((item) => (
									<PlaylistCard item={item} key={item.id} />
								))}
							</div>
						</>
					) : (
						<></>
					)}
					{recentlyPlayed?.length ? (
						<>
							<h1 className="px-5 text-3xl font-bold text-neutral-100">Recently Played</h1>
							<div className="relative z-0 mt-5 grid auto-cols-[12rem] grid-flow-col gap-6 overflow-x-auto px-5 pt-2 scrollbar-hide">
								{recentlyPlayed.map((item) => (
									<SongCard item={item} key={item.played_at} />
								))}
							</div>
						</>
					) : (
						<></>
					)}
					{topArtists?.length ? (
						<>
							<h1 className="px-5 text-3xl font-bold text-neutral-100">Top Artists</h1>
							<div className="relative z-0 mt-5 grid auto-cols-[12rem] grid-flow-col gap-6 overflow-x-auto px-5 pt-2 scrollbar-hide">
								{topArtists.map((item) => (
									<ArtistCard item={item} key={item.id} />
								))}
							</div>
						</>
					) : (
						<></>
					)}
				</div>
			)}
			{playlistContent && (
				// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
				<div className={`flex flex-col ${playlistContent && color.color} h-2/3 to-transparent p-5`}>
					<div className="mt-10 flex flex-row space-x-5">
						<Image
							src={
								instanceofSingleArtistResponse(user)
									? user.images[0].url
									: playlistContent instanceof Array
									? "/liked.png"
									: playlistContent.images[0].url
							}
							className="h-48 w-48 rounded-md object-contain md:h-48 md:w-48 lg:h-56 lg:w-56"
							width={300}
							height={300}
							alt={"Playlist Image"}
						/>
						<div className="flex flex-col items-start justify-end">
							<h6 className="text-sm font-bold text-gray-200">Playlist</h6>
							<h1 className="mt-5 text-3xl font-bold text-gray-200 sm:text-lg md:text-2xl lg:text-4xl">
								{instanceofSingleArtistResponse(user)
									? // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
									  user?.name ?? ""
									: playlistContent instanceof Array
									? "Liked Songs"
									: playlistContent.name}
							</h1>
							{instanceofSinglePlaylistResponse(playlistContent) && playlistContent.description && (
								<p className="mt-2 hidden text-sm font-semibold text-gray-300 lg:block">
									{parseAnchorTags(playlistContent.description)}
								</p>
							)}
							<div className="mt-4 hidden flex-row items-center space-x-2 sm:flex">
								{user?.images && user.images[0]?.url && (
									<Image
										src={user.images[0].url}
										className="rounded-full object-contain"
										width={30}
										height={30}
										alt={"User Image"}
									/>
								)}
								{instanceofSinglePlaylistResponse(playlistContent) ? (
									<p className="text-sm font-bold text-gray-200">
										{playlistContent.owner.display_name} • {playlistContent.tracks.total} Songs •{" "}
										{playlistContent.followers.total
											.toString()
											.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
										Followers
									</p>
								) : (
									<p className="text-sm font-bold text-gray-200">
										{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
										{/* @ts-expect-error */}
										{user?.display_name ?? user?.name} •{" "}
										{playlistContent.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Songs
									</p>
								)}
							</div>
						</div>
					</div>
					<div className="mt-5 py-5">
						{instanceofSinglePlaylistResponse(playlistContent)
							? playlistContent.tracks.items.map((track, index) => (
									<Song track={track} index={index} key={track.track?.id} />
							  ))
							: playlistContent.map((track, index) => (
									<Song
										// eslint-disable-next-line @typescript-eslint/ban-ts-comment
										// @ts-expect-error
										track={"track" in track ? track : { track: track }}
										index={index}
										key={"track" in track ? track.track.id : track.id}
									/>
							  ))}
					</div>
				</div>
			)}
		</div>
	);
}
