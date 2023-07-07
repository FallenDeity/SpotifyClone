"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import SpotifyWebApi from "spotify-web-api-node";

import { UserSession } from "@/utils/models";

const spotifyApi = new SpotifyWebApi({
	clientId: String(process.env.SPOTIFY_CLIENT_ID),
	clientSecret: String(process.env.SPOTIFY_CLIENT_SECRET),
	redirectUri: String(process.env.NEXTAUTH_URL) + "/api/auth/callback/spotify",
});

export default function useSpotify(): SpotifyWebApi {
	const { data: session } = useSession() as { data: UserSession };
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (session) {
			if (session.error === "RefreshAccessTokenError") {
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				signIn();
			}
		}
		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		spotifyApi.setAccessToken(session?.user?.token?.accessToken ?? "");
	}, [session]);
	return spotifyApi;
}
