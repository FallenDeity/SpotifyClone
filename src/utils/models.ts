import { Session } from "next-auth";

export interface Token {
	name: string;
	email: string;
	picture: string;
	sub: string;
	accessToken: string;
	refreshToken: string;
	username: string;
	accessTokenExpires: number;
	iat: number;
	exp: number;
	jti: string;
}

export interface User {
	name: string;
	email: string;
	image: string;
	token: Token;
}

export interface UserSession extends Session {
	user?: User;
	error?: string;
	expires: string;
}
