"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { alignProperty } from "@mui/material/styles/cssUtils";

// import { submitForm } from './action'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const columns = [
	{
		field: "id",
		headerName: "No",
		width: 60,
		type: "number",
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	// { field: "InvoiceNo", headerName: "Invoice No.",type: 'number', width: 150 ,headerAlign: 'center',headerClassName: 'super-app-theme--header',},
	// { field: "InvoiceNo", headerName: "InvoiceNo", width: 130 },
	{
		field: "ScrapID",
		headerName: "ScrapID",
		width: 90,
		type: "number",
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "ScrapName",
		headerName: "ScrapName",
		width: 130,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "BagNo",
		headerName: "BagNo",
		width: 90,
		type: "number",
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "BagName",
		headerName: "BagName",
		width: 130,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "FactoryCode",
		headerName: "FacCode",
		width: 72,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "NetWeight",
		headerName: "NetWeight",
		type: "number",
		width: 130,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
];

async function getWR_1() {
	// const response = await fetch('http://localhost:3005/api/wr_invoice');
	const response = await fetch(`http://${ipAddress}:3005/api/wr_invoice`);
	if (!response.ok) {
		throw new Error("Cannot fetch WR_1");
	}
	return response.json();
}



export default function Page() {
	const [firstInvoiceNo, setFirstInvoiceNo] = useState("");
	const [selectionModel, setSelectionModel] = useState([]);
	const [WR_1, setWR_1] = useState([]);
	const [invoiceNoList, setInvoiceNoList] = useState([]);
	const [invoiceNo, setInvoiceNo] = useState("");
	const [summaryData, setSummaryData] = useState([]);
// InvoiceNo List 
	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/invoiceNoList`)
			.then((response) => response.json())
			.then((data) => {
				setInvoiceNoList(data);
				// Set the first invoice number as the selected invoice number
				if (data.length > 0) {
					setInvoiceNo(data[0].InvoiceNo);
				}
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);

	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/invoiceNoList`)
			.then((response) => response.json())
			.then((data) => {
				setInvoiceNoList(data);
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);

	useEffect(() => {
		if (invoiceNo) {
			fetch(`http://${ipAddress}:3005/api/invoiceDetail/${invoiceNo}`)
				.then((response) => response.json())
				.then((data) => {
					setSummaryData(data);
				})
				.catch((error) => {
					console.error("Error fetching summary data:", error);
				});
		}
	}, [invoiceNo]);
	const handleSelectChange = (event) => {
		// alert(event.target.value);
		setInvoiceNo(event.target.value);
	};
// InvoiceNo List END 

	const initWR_1 = async () => {
		try {
			const result = await getWR_1();
			setWR_1(result);
			if (result && result.length > 0) {
				setFirstInvoiceNo(result[0].InvoiceNo);
			}
		} catch (error) {
			console.log("Error fetching WR_1:", error);
		}
	};

	useEffect(() => {
		initWR_1();
	}, []);

	const rowsWithId = summaryData.map((item, index) => ({
		id: index + 1,
		...item,
	}));

	const confirmCancelInv = async (invoiceNo) => {
		// alert(wrIDs);
		let textAlert = `คุณต้องการที่จะยกเลิก InvoiceNo: ${invoiceNo} ทั้งหมดนี้ใช่หรือไม่`;
		let iconAlert = "warning";
		let confirmSt = true;

		withReactContent(Swal)
			.fire({
				// icon: "success",  // success, error, warning, info, question
				title: `<strong>Cancel Invoice</strong>`,
				icon: iconAlert,
				text: textAlert,
				showCloseButton: true,
				showCancelButton: true,
				focusConfirm: false,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
			})
			.then((result) => {
				if (result.isConfirmed && confirmSt) {
					//  window.location.reload();
					window.location.href = "/WeighingRecord/ReadyInvoice";
					cancelInvoice(invoiceNo);
				}
			});
	};
	async function cancelInvoice(invoiceNo) {
		// const url = `http://localhost:3005/api/wr_invoice_cancel`;
		const url = `http://${ipAddress}:3005/api/wr_invoice_cancel/${invoiceNo}`;
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error("ไม่สามารถเรียกข้อมูล OpenBag ได้");
		}
		return response.json();
	}
	const firstTotalNetW = rowsWithId.length > 0 ? rowsWithId[0].TotalNetW : null;
	return (
		<div className="mainPage">
			<div className="centerH">
			<div className="us-form"><h3>
					<div className="unwrap">
					Invoice Detail : 
						<select onChange={handleSelectChange}>
							{invoiceNoList.map((InvoiceNo, index) => (
								<option key={index} value={InvoiceNo.InvoiceNo}>
									{InvoiceNo.InvoiceNo}
								</option>
							))}
						</select>
					</div>
					</h3></div>
			</div>
			<div className="sDataGrid">
				<Box
					sx={{
						height: "auto",
						width: "auto",
						"& .super-app-theme--header": {
							backgroundColor: "rgba(255, 195, 0)",
							color: "rgba(0, 8, 20)",
						},
					}}
				>
					<DataGrid
						// checkboxSelection
						rows={rowsWithId}
						columns={columns}
						rowsPerPageOptions={[10, 20, 50]}
						// initialState={{
						// 	pagination: {
						// 		paginationModel: { page: 0, pageSize: 10 },
						// 	},
						// }}
						selectionModel={selectionModel}
						// onSelectionModelChange={handleSelectionChange}
						// onSelectionModelChange={(newSelection) => setSelectionModel(newSelection)}
						// onRowClick={handleRowClick}
						disableColumnFilter
						disableColumnSelector
						disableDensitySelector
						disableColumnMenu
						density="compact"
						slots={{ toolbar: GridToolbar }}
						slotProps={{
							toolbar: {
								showQuickFilter: true,
							},
						}}
					/>
				</Box>
			</div>
			{/* TotalNetW */}

			<div className="centerH">
				<p>
					Total NetWeight:{" "}
					{firstTotalNetW
						? firstTotalNetW.toLocaleString(undefined, {
								minimumFractionDigits: 2,
								maximumFractionDigits: 2,
						  })
						: null}{" "}
					Kgs
				</p>
			</div>

			<div className="tableDetail">
				<button className="buttonP" onClick={() => confirmCancelInv(invoiceNo)}>
					Cancel Invoice
				</button>
			</div>
			<p></p>
		</div>
	);
}
