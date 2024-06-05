"use client";
import Image from "next/image";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { useState, useEffect } from "react";

export default function LayoutWR({ children }) {
	const [BagOpened, setBagOpened] = useState([]);
	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/BagOpenedCount`)
			.then((response) => response.json())
			.then((data) => {
				setBagOpened(data[0].OpenBagedCount);
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);
	return (
		<div>
			<div
				className="navbar"
				style={{ position: "fixed", top: 80, left: 0, right: 0 }}
			>
				<div className="menu">
					<a href="#">Bag Opened : {BagOpened}</a>
					<h3></h3>
				</div>
			</div>
			<div style={{ position: "fixed", top: 120, left: 0, right: 0 }}>
				{children}
			</div>
		</div>
	);
}
