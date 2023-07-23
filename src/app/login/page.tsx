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
		<div className="h-screen overflow-hidden bg-black">
			<div className="flex h-full flex-col items-center justify-center">
				<div className="flex flex-col items-center justify-center space-y-10">
					<Image src="/logo.png" width={200} height={200} alt={"Spotify Clone Logo"} />
					<h1 className="text-4xl font-bold text-white">Welcome to Spotify Clone</h1>
					{providers &&
						Object.values(providers).map((provider) => (
							<ProviderButton key={provider.name} id={provider.id} name={provider.name} callback={"/"} />
						))}
					<p className="text-center text-sm text-neutral-600">
						Demo Account: demo93923@gmail.com
						<br /> <span className="text-center">Password: Demo@1234</span>
					</p>
				</div>
			</div>
		</div>
	);
}
