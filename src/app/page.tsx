import React from "react";

import MainScreen from "@/components/MainScreen";
import Player from "@/components/Player";
import SideBar from "@/components/SideBar";

export const metadata = {
	title: "Spotify Clone",
	description: "A Spotify Clone made with Next.js and Tailwind CSS",
};

export default function Home(): React.JSX.Element {
	return (
		<>
			<div className="bg-black h-screen overflow-hidden">
				<main className="flex flex-row p-2 sm:p-5 h-[90vh] w-full">
					<SideBar />
					<MainScreen />
				</main>
				<Player />
			</div>
		</>
	);
}
