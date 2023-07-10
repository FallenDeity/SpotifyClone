"use client";

import { signIn } from "next-auth/react";
import React from "react";

export default function ProviderButton({
	id,
	name,
	callback,
}: {
	id: string;
	name: string;
	callback: string;
}): React.JSX.Element {
	return (
		<button
			key={name}
			className="rounded-full bg-green-500 px-4 py-2 text-xl font-semibold text-black shadow-lg shadow-gray-800 transition duration-300 hover:bg-white hover:text-black"
			/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
			onClick={async (): Promise<void> => void (await signIn(id, { callbackUrl: callback }))}>
			Sign in with {name}
		</button>
	);
}
