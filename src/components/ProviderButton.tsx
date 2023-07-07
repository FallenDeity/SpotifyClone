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
			className="px-4 py-2 font-semibold text-black text-xl bg-green-500 rounded-full hover:bg-white hover:text-black transition duration-300 shadow-lg shadow-gray-800"
			/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
			onClick={async (): Promise<void> => void (await signIn(id, { callbackUrl: callback }))}>
			Sign in with {name}
		</button>
	);
}
