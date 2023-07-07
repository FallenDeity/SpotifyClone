import SpotifyWebApi from "spotify-web-api-node";

const scopes = [
	"user-read-private",
	"playlist-read-private",
	"playlist-read-collaborative",
	"user-read-email",
	"streaming",
	"user-library-read",
	"user-library-modify",
	"user-top-read",
	"user-read-playback-state",
	"user-modify-playback-state",
	"user-read-currently-playing",
	"user-read-recently-played",
	"user-follow-read",
].join(",");

const params = new URLSearchParams({ scope: scopes });
const LOGIN_URL = `https://accounts.spotify.com/authorize?${params.toString()}`;
// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
const spotifyApi = new SpotifyWebApi({
	clientId: String(process.env.SPOTIFY_CLIENT_ID),
	clientSecret: String(process.env.SPOTIFY_CLIENT_SECRET),
	redirectUri: String(process.env.NEXTAUTH_URL) + "/api/auth/callback/spotify",
});

export { LOGIN_URL, spotifyApi };
