import Image from "next/image";
import { getProviders } from "next-auth/react";
import React from "react";

import ProviderButton from "@/components/ProviderButton";

export const metadata = {
	title: "Login | Spotify Clone",
	description: "Login to Spotify Clone",
};

export default async function Login(): Promise<React.JSX.Element> {
	const providers = await getProviders();
	return (
		<div className="h-screen bg-black overflow-hidden">
			<div className="flex flex-col items-center justify-center h-full">
				<div className="flex flex-col items-center justify-center space-y-10">
					<Image src="/logo.png" width={200} height={200} alt={"Spotify Clone Logo"} />
					<h1 className="text-4xl font-bold text-white">Welcome to Spotify Clone</h1>
					{providers &&
						Object.values(providers).map((provider) => (
							<ProviderButton key={provider.name} id={provider.id} name={provider.name} callback={"/"} />
						))}
				</div>
			</div>
		</div>
	);
}
