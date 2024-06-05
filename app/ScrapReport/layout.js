"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ColorText from "../components/ColorText";
import Head from "next/head";

export default function LayoutTakeout({ children }) {
	const pathName = usePathname();
	// Function to determine the color of the text based on the current path
	const getColor = (path) => {
		if (pathName === path) {
			return "#FFD60A"; // Set the color to red if the current path matches the specified path
		} else {
			return "#fff"; // Set the color to white for other paths
		}
	};

	return (
		<div>
			<div
				className="navbar"
				style={{ position: "fixed", top: 80, left: 0, right: 0 }}
			>
				<div className="menu">
					<a href="#">Scrap Report : </a>
					<a href="/ScrapReport">
						<ColorText color={getColor("/ScrapReport")}>
							Summary by Invoice
						</ColorText>
					</a>
					<a href="/ScrapReport/SummarizeScrap">
						<ColorText color={getColor("/ScrapReport/SummarizeScrap")}>
							Summarize by Invoice
						</ColorText>
					</a>
					<a href="/ScrapReport/SummarizeScrapOnly">
						<ColorText color={getColor("/ScrapReport/SummarizeScrapOnly")}>
							Summarize Only Have by Invoice
						</ColorText>
					</a>
					<a href="/ScrapReport/SummarizeScrapYear">
						<ColorText color={getColor("/ScrapReport/SummarizeScrapYear")}>
							Summarize by Year
						</ColorText>
					</a>
					<a href="/ScrapReport/StockScrap">
						<ColorText color={getColor("/ScrapReport/StockScrap")}>
							Stock by Year
						</ColorText>
					</a>
				</div>
			</div>
			<div style={{ position: "fixed", top: 130, left: 0, right: 0 }}>
				{children}
			</div>
		</div>
	);
}
