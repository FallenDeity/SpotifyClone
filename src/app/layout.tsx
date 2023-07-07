"use client";

import "@/styles/globals.css";

import { Figtree } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { RecoilRoot } from "recoil";

const font = Figtree({ subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body className={font.className}>
				<SessionProvider>
					<RecoilRoot>{children}</RecoilRoot>
				</SessionProvider>
			</body>
		</html>
	);
}
