import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

const satoshi = localFont({
	src: [
		{
			path: "../../public/fonts/Satoshi-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../../public/fonts/Satoshi-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-satoshi",
	display: "swap",
});

export const metadata = {
	title: "Hack4u - Student Hackathon",
	description: "A community for builders and innovators",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<head></head>
			<body className={satoshi.variable}>
				<AuthProvider>{children}</AuthProvider>
			</body>
		</html>
	);
}
