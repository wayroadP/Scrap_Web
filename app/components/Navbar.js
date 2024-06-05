// components/Navbar.js
'use client'
import { useState } from 'react';
import Image from "next/image";
import { usePathname } from 'next/navigation';
import ColorText from './ColorText';

export default function Navbar() {
    const [isBagOpen, setIsBagOpen] = useState(false);

    const toggleBagDropdown = () => {
        setIsBagOpen(!isBagOpen);
    };

	const pathName = usePathname()
	// Function to determine the color of the text based on the current path
	const getColor = (path) => {
		if (pathName === path || (pathName.startsWith('/WeighingRecord') && path === '/WeighingRecord')|| (pathName.startsWith('/TakeoutScrap') && path === '/TakeoutScrap')|| (pathName.startsWith('/ScrapReport') && path === '/ScrapReport')) {
		  return '#FFD60A'; // Set the color to red if the current path matches the specified path
		} else {
		  return '#fff'; // Set the color to white for other paths
		}
	  };
    return (
        <div className="navbar" style={{ position: 'fixed', top: 0, left: 0, right: 0}} >
            <div className="logo-container">
                <Image src="/img/scrap.png" alt="Logo" width={50} height={50} />
                <a href='/'><h1>Scrap Management System</h1></a>
            </div>
            <div className="menu">
                <a href="/BagOpened" className='m1'><ColorText color={getColor('/BagOpened')}>Bag Opened</ColorText></a>
                <a href="/WeighingRecord" className='m2'><ColorText color={getColor('/WeighingRecord')}>Weighing Record</ColorText></a>
                <a href="/ScrapReport" className='m4'><ColorText color={getColor('/ScrapReport')}>Scrap Report</ColorText></a>
                <a href="/TakeoutScrap" className='m3'><ColorText color={getColor('/TakeoutScrap')}>Takeout Scrap</ColorText></a>
                
            </div>
        </div>
    );
}
