"use client";
import Image from "next/image";
import ColorText from "../components/ColorText";
import { usePathname } from "next/navigation";

export default function LayoutWR({ children }) {
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
                <a href="#">Weighing Record : </a>
                <a href="/WeighingRecord"><ColorText color={getColor('/WeighingRecord')}>Bag Status</ColorText></a>
                <a href="/WeighingRecord/ReadyInvoice"><ColorText color={getColor('/WeighingRecord/ReadyInvoice')}>Ready for Invoice</ColorText></a>
                <a href="/WeighingRecord/InvoiceDetail"><ColorText color={getColor('/WeighingRecord/InvoiceDetail')}>Invoice Detail</ColorText></a>
                <h3></h3>
            </div>
			</div>
			<div style={{ position: "fixed", top: 130, left: 0, right: 0 }}>
			{children}
			</div>
			
		</div>
	);
}
