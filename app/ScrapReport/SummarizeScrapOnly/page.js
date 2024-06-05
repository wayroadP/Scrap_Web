"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
// Edit Colums *******************************************************************************
const columns = [
	// { field: "id", headerName: "No", width: 70 },
	// { field: "InvoiceNo", headerName: "InvoiceNo", width: 130 },
	{
		field: "ID",
		headerName: "NO.",
		width: 60,
		type: "number",
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "Scrap Type",
		headerName: "ITEMS",
		width: 200,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "BagNo",
		headerName: "BagNo",
		width: 200,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "BagType",
		headerName: "Bag Type",
		width: 200,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "FactoryCode",
		headerName: "Fac Code",
		width: 120,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "NetWeight",
		headerName: "NetWeight",
		type: "number",
		width: 120,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
		valueFormatter: (params) => {
			// alert(params);
			if (params == null) {
			  return ''; // ถ้า params หรือค่าเป็น null หรือ undefined, ส่งคืนเป็น string ว่าง
			}
			// จัดรูปแบบตัวเลขโดยใช้ comma separators สำหรับหลักพันและสองตำแหน่งทศนิยม
			return params.toLocaleString(undefined, {
			  minimumFractionDigits: 2,
			  maximumFractionDigits: 2,
			});
		  },
	},
	{
		field: "InvoiceNo",
		headerName: "Invoice No",
		width: 200,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
];

async function getInvoiceNo() {
	const response = await fetch(`http://${ipAddress}:3005/api/invoiceNoList`);
	if (!response.ok) {
		throw new Error("cannot fetch OpenBag");
	}
	return response.json();
}

export default function Page() {
	const [invoiceNoList, setInvoiceNoList] = useState([]);
	const [invoiceNo, setInvoiceNo] = useState("");
	const [summaryData, setSummaryData] = useState([]);

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
			fetch(`http://${ipAddress}:3005/api/summarizeScrapOnly/${invoiceNo}`)
				.then((response) => response.json())
				.then((data) => {
					setSummaryData(data);
				})
				.catch((error) => {
					console.error("Error fetching summary data:", error);
				});
		}
	}, [invoiceNo]);

	const rowsWithId = summaryData.map((item, index) => ({
		id: index + 1, // ใช้ index + 1 เป็น id (ตัวอย่างเท่านี้ใช้ index + 1 แต่ควรใช้ค่า unique จากข้อมูลจริง)
		...item,
	}));

	const handleSelectChange = (event) => {
		// alert(event.target.value);
		setInvoiceNo(event.target.value);
	};

	return (
		<div className="mainPage">
	
			<div className="centerH">
				<span>Select Invoice Number : </span>
				<div className="us-form">
					<div className="unwrap">
						<select onChange={handleSelectChange}>
							{invoiceNoList.map((InvoiceNo, index) => (
								<option key={index} value={InvoiceNo.InvoiceNo}>
									{InvoiceNo.InvoiceNo}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>
			<br/>
			<div className="tableDetail">
			<div className="sDataGrid">
				{/* {invoiceNo} */}
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
						// pageSize={10}
						rowsPerPageOptions={[10, 20, 50]}
						// initialState={{
						// 	pagination: {
						// 		paginationModel: { page: 0, pageSize: 20 },
						// 	},
						// }}
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
			</div>
		</div>
	);
}
