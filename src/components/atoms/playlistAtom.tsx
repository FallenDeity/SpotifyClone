import { atom } from "recoil";

export const playlistAtomState = atom({
	key: "playlistAtom",
	default: "",
});

export const playlistContentAtomState = atom({
	key: "playlistContentAtom",
	default: undefined,
});

export const TrackIDAtomState = atom({
	key: "TrackIDAtom",
	default: "",
});

export const DailyMixAtomState = atom({
	key: "DailyMixAtom",
	default: [] as SpotifyApi.PlaylistObjectSimplified[],
});

export const HeaderAtomState = atom({
	key: "HeaderAtom",
	default: "bg-opacity-100",
});

export const searchAtomState = atom({
	key: "searchAtom",
	default: false,
});

export const playlistHistoryAtomState = atom({
	key: "playlistHistoryAtom",
	default: [] as string[],
});

export const playlistHistoryIndexAtomState = atom({
	key: "playlistHistoryIndexAtom",
	default: 0,
});
