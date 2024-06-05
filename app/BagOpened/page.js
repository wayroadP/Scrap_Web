"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

async function getOpenBag() {
	const response = await fetch(`http://${ipAddress}:3005/api/printQR`);
	// const response = await fetch("http://localhost:3005/api/printQR");
	if (!response.ok) {
		throw new Error("cannot fetch OpenBag");
	}
	return response.json();
}

async function updatePrintStatus(OpenBagID) {
	// sp_UpdatePrintStatus
	// /api/updatePrintStatus/:OpenBagID
	console.log(OpenBagID);

	const url = `http://${ipAddress}:3005/api/updatePrintStatus/${encodeURIComponent(
		OpenBagID
	)}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("ไม่สามารถเรียกข้อมูล OpenBag ได้");
	}

	return response.json();
}

async function togglePrintStatus(OpenBagID, st) {
	// sp_UpdatePrintStatus
	// /api/updatePrintStatus/:OpenBagID
	console.log(OpenBagID);
	console.log(st);

	const url = `http://${ipAddress}:3005/api/togglePrintStatus/${encodeURIComponent(
		OpenBagID
	)}/${encodeURIComponent(st)}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("ไม่สามารถเรียกข้อมูล OpenBag ได้");
	}
	return response.json();
}

export default function Page() {
	// const router = useRouter();
	const [OpenBag, setOpenBag] = useState([]);
	// const [Reload, setReload] = useState(0);

	const initOpenBag = async () => {
		try {
			const result = await getOpenBag();
			setOpenBag(result);
		} catch (error) {
			console.log("error", error);
		}
	};
	useEffect(() => {
		initOpenBag();
		console.log("userEffect");
	}, []);
	console.log(OpenBag);

	const handleCheckboxChange = async (OpenBagID, isChecked) => {
		let st = 0;

		try {
			// เรียกใช้ togglePrintStatus เพื่ออัพเดตสถานะการพิมพ์ของ OpenBagID
			if (isChecked) {
				st = 1;
			} else {
				st = 0;
			}
			await togglePrintStatus(OpenBagID, st);
			console.log(`Updated print status for OpenBagID: ${OpenBagID}`);
		} catch (error) {
			console.error("Error updating print status:", error);
		}
	};

	const handleSweet = async (
		OpenBagID,
		ScrapName,
		BagNo,
		BagName,
		FactoryCode,
		QRCode,
		fDate,
		UserCreateBag,
		NameUserCreateBag
	) => {
		withReactContent(Swal)
			.fire({
				// icon: "success",  // success, error, warning, info, question
				// title: "TEST",
				// text: "OK"
				// ${BagName}${FactoryCode}${QRCode}
				title: `<strong>BagNo ${BagNo} ${ScrapName}</strong>`,
				icon: "info",
				text: `You want to print this information.`,
				html: `<div style="text-align: center;">
				<img src="http://${ipAddress}:3005/qrImg/qr${QRCode}.png" alt="QR Code" width="150" height="150">
				</div>`,
				showCloseButton: true,
				showCancelButton: true,
				focusConfirm: false,
				confirmButtonText: `
				Print
				`,
				confirmButtonAriaLabel: "Thumbs up, great!",
				cancelButtonText: `
				Cancle
				`,
				cancelButtonAriaLabel: "Thumbs down",
			})
			.then((result) => {
				// Check if the user clicked the "Print" button
				if (result.isConfirmed) {
					try {
						const updateResponse = updatePrintStatus(OpenBagID);
						console.log("Update response:", updateResponse);
					} catch (error) {
						console.error("Error updating data:", error);
					}
					printText(
						OpenBagID, // Replace with actual value for OpenBagID
						ScrapName,
						BagNo,
						BagName, // Replace with actual value for BagName
						FactoryCode, // Replace with actual value for FactoryCode
						QRCode, // Replace with actual value for QRCode
						fDate,
						UserCreateBag,
						NameUserCreateBag
					);
					window.location.reload();
				}
			});
	};
	const printText = async (
		OpenBagID,
		ScrapName,
		BagNo,
		BagName,
		FactoryCode,
		QRCode,
		fDate,
		UserCreateBag,
		NameUserCreateBag
	) => {
		// สร้างหน้าต่างใหม่เพื่อพิมพ์ข้อความ
		var printWindow = window.open("", "_blank");
		const fileName =
			ScrapName +
			"-BagNo_" +
			BagNo +
			"-" +
			BagName +
			"-" +
			FactoryCode +
			"_" +
			QRCode;
		const printDocument = `
        <html>
          <head>
            <title>${fileName}</title>
            <style>
              /* CSS สำหรับการพิมพ์ */
              body {
                display: none; /* ซ่อนส่วนที่ไม่ต้องการพิมพ์ */
              }
              .printable-content {
                display: block; /* แสดงเนื้อหาที่ต้องการพิมพ์ */
              }
              .buttonP {
                width: 200px;
                margin-right: 20;
                text-align: center;
                display: inline-block;
                padding: 0.5rem 1rem;
                background-color: #FFC300; /* สีพื้นหลัง */
                color: #000; /* สีตัวอักษร */
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none; /* ลบขีดเส้นใต้ข้อความ */
                transition: background-color 0.3s ease;
              }
              
              .buttonP:hover {
                background-color: #003566; /* เปลี่ยนสีพื้นหลังเมื่อโฮเวอร์ */
                color: #ffffff; /* สีตัวอักษร */
              }
              .button {
                width: 200px;
                text-align: center;
                display: inline-block;
                padding: 0.5rem 1rem;
                background-color: #D90429; /* สีพื้นหลัง */
                color: #ffffff; /* สีตัวอักษร */
                border: none;
                border-radius: 5px;
                cursor: pointer;
                text-decoration: none; /* ลบขีดเส้นใต้ข้อความ */
                transition: background-color 0.3s ease;
              }
              .button:hover {
                background-color: #003566; /* เปลี่ยนสีพื้นหลังเมื่อโฮเวอร์ */
              }
              .container {
                display: flex;
                justify-content: center; /* จัดให้เนื้อหาอยู่ตรงกลางแนวนอน */
                align-items: center; /* จัดให้เนื้อหาอยู่ตรงกลางแนวตั้ง */
                height: 100px; /* กำหนดความสูงของพื้นที่ container (ตัวอย่างเท่านั้น) */
              }
            </style>
          </head>
          <body>
            <div class="printable-content">
			<div style="text-align: center;">
            <h1>BagNo ${BagNo} : ${ScrapName} </h1>	
			<h3>Bag Type : ${BagName} - ${FactoryCode}</h3>
		 	<h3>Date Create : ${fDate}</h3>
		 	<h3>User Create : ${UserCreateBag}  ${NameUserCreateBag}</h3>
            <img src="http://${ipAddress}:3005/qrImg/qr${QRCode}.png" alt="QR Code" width="350" height="350">
			</div>
            </div>
            <div class="container">
			<a class="buttonP" onclick="window.print();">Print</a><a class="button" onclick="window.close();">Close</a>
            </div>
          </body>
		  <script>
              // เมื่อเอกสารโหลดเสร็จให้แสดงเนื้อหาและเริ่มกระบวนการพิมพ์
              document.addEventListener('DOMContentLoaded', () => {
                document.body.style.display = 'block'; // แสดงส่วนของเนื้อหาทั้งหมด
                window.print(); // เรียกใช้งานการพิมพ์
              });
            </script>
        </html>
      `;
		//   <img src="http://${ipAddress}:3005/qrImg/qr${QRCode}.png" alt="QR Code" width="350" height="350"></img>
		// เรียกเมธอด print() เพื่อเปิดหน้าต่างเครื่องพิมพ์
		printWindow.document.write(printDocument);
		printWindow.document.close();
	};
	const handleSweetToggle = async (OpenBagID, ScrapName, BagNo, isChecked) => {
		// Trigger SweetAlert2 alert
		let st = 0;
		if (isChecked) {
			st = 1;
		} else {
			st = 0;
		}
		withReactContent(Swal)
			.fire({
				// icon: "success",  // success, error, warning, info, question
				title: `<strong>BagNo ${BagNo} ${ScrapName}</strong>`,
				icon: "warning",
				text: `Do you want to cancel the printing status?`,
				showCloseButton: true,
				showCancelButton: true,
				focusConfirm: false,
				confirmButtonText: `
				Yes
				`,
				confirmButtonAriaLabel: "Thumbs up, great!",
				cancelButtonText: `
				No
				`,
				cancelButtonAriaLabel: "Thumbs down",
			})
			.then((result) => {
				// Check if the user clicked the "Print" button
				if (result.isConfirmed) {
					// Call handlePrint function with required parameters
					window.location.reload();
					togglePrintStatus(
						OpenBagID, // Replace with actual value for OpenBagID
						st
					);
				}
			});
	};
	return (
		<div className="mainPage">
			<div className="card-container">
				<Suspense fallback={<p>Loading feed...</p>}>
					{OpenBag.map((Bag, index) => (
						<div
							key={index}
							className={Bag.PrintStatus === 1 ? "cardP" : "card"}
						>
							<h4>
								{/* togglePrintStatus */}
								<input
									type="checkbox"
									onChange={(e) =>
										handleSweetToggle(
											Bag.OpenBagID,
											Bag.ScrapName,
											Bag.BagNo,
											e.target.checked
										)
									}
									checked={Bag.PrintStatus === 1}
								/>
								BagNo.{Bag.BagNo} {Bag.ScrapName}
							</h4>
								<table>
									<tr>
										<td>Bag Type :</td>
										<td>{Bag.BagName}</td>
									</tr>
									<tr>
										<td>Factory Code :</td>
										<td>{Bag.FactoryCode}</td>
									</tr>
									<tr>
										<td>UserCreate :</td>
										<td>{Bag.UserCreateBag}</td>
									</tr>
									<tr>
										<td colspan="2">{Bag.NameUserCreateBag}</td>
									</tr>
									<tr>
										<td>Date :</td>
										<td>
											{new Date(Bag.DateCreateBag).toLocaleDateString("th-TH")}
										</td>
									</tr>
								</table>
							
				
								<button
									className="buttonP"
									onClick={() =>
										// handlePrint(
										handleSweet(
											Bag.OpenBagID,
											Bag.ScrapName,
											Bag.BagNo,
											Bag.BagName,
											Bag.FactoryCode,
											Bag.QRCode,
											new Date(Bag.DateCreateBag).toLocaleDateString("th-TH"),
											Bag.UserCreateBag,
											Bag.NameUserCreateBag
										)
									}
								>
									Print
								</button>
								{/* <button onClick={() => router.push('/')}>Router</button> */}
							
						</div>
					))}
				</Suspense>
			</div>
		</div>
	);
}
