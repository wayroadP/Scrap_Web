"use client";
import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
// import { submitForm } from './action'
import Link from "next/link";
import ToggleState from "../components/ToggleState";

import SweetAlert from "../components/SweetAlert";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import HtmlTest from "../components/HtmlTest";
import ReactDOMServer from 'react-dom/server';

const componentHtml = ReactDOMServer.renderToString(<HtmlTest />);

async function getOpenBag() {
	// const response = await fetch("http://10.182.1.52:3005/api/printQR");
	const response = await fetch("http://localhost:3005/api/printQR");
	if (!response.ok) {
		throw new Error("cannot fetch OpenBag");
	}
	return response.json();
}
// add handlePrint
const handlePrint = async (
	OpenBagID,
	ScrapName,
	BagNo,
	BagName,
	FactoryCode,
	QRCode
) => {
	// เรียกใช้ API เพื่ออัปเดตข้อมูล
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
	try {
		const updateResponse = await updatePrintStatus(OpenBagID);
		console.log("Update response:", updateResponse);
	} catch (error) {
		console.error("Error updating data:", error);
	}
	try {
		// เรียกใช้งาน API และรับข้อมูล HTML
		const htmlContent = await callPrintApi(OpenBagID);

		// สร้างหน้าต่างใหม่เพื่อพิมพ์เนื้อหาที่ได้รับ
		const printWindow = window.open("", "_self");
		if (!printWindow) {
			console.error("Failed to open print window.");
			return;
		}

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
                margin-left: 20;
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
              ${htmlContent}
            </div>
            <div class="container">
              <a class="button" href="/BagOpened">Back</a><a class="buttonP" onclick="window.print();">Print</a>
            </div>
            <script>
              // เมื่อเอกสารโหลดเสร็จให้แสดงเนื้อหาและเริ่มกระบวนการพิมพ์
              document.addEventListener('DOMContentLoaded', () => {
                document.body.style.display = 'block'; // แสดงส่วนของเนื้อหาทั้งหมด
                window.print(); // เรียกใช้งานการพิมพ์

              });
            </script>
          </body>
        </html>
      `;

		// รอให้เสร็จสิ้นการเขียนเนื้อหาและพร้อมที่จะพิมพ์
		printWindow.document.write(printDocument);
		printWindow.document.close();

	} catch (error) {
		console.error("Error handling print:", error);
	}
};

async function callPrintApi(OpenBagID) {
	try {
		// const url = "http://10.182.1.52:3005/qrcode";
		const url = "http://localhost:3005/qrcode";
		const payload = {
			OpenBagID: OpenBagID.toString(),
		};
		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(payload),
		});
		if (!response.ok) {
			throw new Error("Failed to call API");
		}
		const data = await response.text(); // รับข้อมูล HTML จากการเรียก API
		return data; // ส่ง HTML กลับเพื่อใช้ในการแสดงผล
	} catch (error) {
		console.error("Error calling API:", error);
		throw error;
	}
}
async function updatePrintStatus(OpenBagID) {
	// sp_UpdatePrintStatus
	// /api/updatePrintStatus/:OpenBagID
	console.log(OpenBagID);

	// const url = `http://10.182.1.52:3005/api/updatePrintStatus/${encodeURIComponent(
	// 	OpenBagID
	// )}`;
	const url = `http://localhost:3005/api/updatePrintStatus/${encodeURIComponent(
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

	// const url = `http://10.182.1.52:3005/api/togglePrintStatus/${encodeURIComponent(
	// 	OpenBagID
	// )}/${encodeURIComponent(st)}`;
	const url = `http://localhost:3005/api/togglePrintStatus/${encodeURIComponent(
		OpenBagID
	)}/${encodeURIComponent(st)}`;


	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("ไม่สามารถเรียกข้อมูล OpenBag ได้");
	}
	// รีเฟรชหน้าโดยใช้ useRouter hook
	// const router = useRouter();
	// router.reload();
	return response.json();
}

export default function Page() {
	const [OpenBag, setOpenBag] = useState([]);

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

	const handleSweet = () => {
		// Trigger SweetAlert2 alert
		withReactContent(Swal).fire({
			// icon: "success",  // success, error, warning, info, question
			// title: "TEST",
			// text: "OK"
			
				title: "<strong>HTML <u>example</u></strong>",
				icon: "info",
				html: componentHtml,
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
				cancelButtonAriaLabel: "Thumbs down"
			  
		  });
		
	  };

	return (
		<div>
			<div className="subHeader">
				<h2>Bag Opened</h2>
			</div>
			<div className="card-container">
				<Suspense fallback={<p>Loading feed...</p>}>
					{OpenBag.map((Bag, index) => (
						<div
							key={index}
							className={Bag.PrintStatus === 1 ? "cardP" : "card"}
						>
							<h3>
								{/* togglePrintStatus */}
								<input
									type="checkbox"
									onChange={(e) =>
										handleCheckboxChange(Bag.OpenBagID, e.target.checked)
									}
									checked={Bag.PrintStatus === 1}
								/>
								BagNo.{Bag.BagNo} {Bag.ScrapName}
							</h3>
							<p>Bag Type : {Bag.BagName} </p>
							<br />
							<p>Factory Code : {Bag.FactoryCode} </p>
							<br />
							<p>QRCode : {Bag.QRCode} </p>
							<br />
							<p>UserCreate : {Bag.UserCreateBag}</p>
							<br />
							<p>
								Date : {new Date(Bag.DateCreateBag).toLocaleDateString("th-TH")}{" "}
							</p>
							<br />
							{/* <form action={submitForm}>
                                <input type='hidden' value={Bag.OpenBagID} name='OpenBagID'  />
                                <button>Print</button>
                            </form> */}
							{/* <div className='container'><Link className='buttonP' onClick={handlePrint} >Print</Link></div> */}
							<div className="container">
								<button
									className="buttonP"
									onClick={() =>
										handlePrint(
											Bag.OpenBagID,
											Bag.ScrapName,
											Bag.BagNo,
											Bag.BagName,
											Bag.FactoryCode,
											Bag.QRCode
										)
									}
								>
									Print
								</button>
								<button onClick={handleSweet}>Sweet</button>
							</div>
						</div>
					))}
				</Suspense>
			</div>
		</div>
	);
}
