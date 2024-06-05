import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Head from "next/head";
// ไม่ต้อง import Image อีกต่อไป

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "Scrap Management System",
	description: "Scrap Management System",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<Head>
				{/* เปลี่ยนไอคอนในแถบสถานะ (Favicon) */}
				{/* <link rel="icon" href="/favicon.ico" /> */}
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<body className={inter.className}>
				<Navbar />

				{children}
				<Footer />
			</body>
		</html>
	);
}
