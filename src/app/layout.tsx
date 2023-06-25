import "../styles/globals.css";

import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	);
}
