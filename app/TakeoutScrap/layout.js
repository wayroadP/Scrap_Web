"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import ColorText from "../components/ColorText";


export default function LayoutTakeout({ children }) {
	const pathName = usePathname()
	// Function to determine the color of the text based on the current path
	const getColor = (path) => {
		if (pathName === path) {
		  return '#FFD60A'; // Set the color to red if the current path matches the specified path
		} else {
		  return '#fff'; // Set the color to white for other paths
		}
	  };
	return (
		<div>
			<div className="navbar" style={{ position: 'fixed', top: 80, left: 0, right: 0}}>
				<div className="menu">
                <a href="#">Takeout Scrap : </a>
                <a href="/TakeoutScrap"><ColorText color={getColor('/TakeoutScrap')}>Takeout Detail</ColorText></a>
                {/* <a href="/TakeoutScrap/TakeoutDetail"><ColorText color={getColor('/TakeoutScrap/TakeoutDetail')}>Takeout Detail</ColorText></a> */}
                <h3></h3>
            </div>
			</div>
			<div style={{ position: "fixed", top: 130, left: 0, right: 0 }}>
			{children}
			</div>
			
		</div>
	);
}
