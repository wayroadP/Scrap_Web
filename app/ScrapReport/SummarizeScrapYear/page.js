"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
import { render } from "react-dom";
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
		width: 60,
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
		width: 100,
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
		field: "BagWeight",
		headerName: "Bag Weight",
		type: "number",
		width: 100,
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
		field: "Total",
		headerName: "Total(kgs)",
		type: "number",
		width: 100,
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
		width: 150,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "BagStatus",
		headerName: "BagStatus",
		width: 150,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
];

async function getInvoiceNo() {
	const response = await fetch(`http://${ipAddress}:3005/api/yearStockList`);
	if (!response.ok) {
		throw new Error("cannot fetch OpenBag");
	}
	return response.json();
}

export default function Page() {
	const [yearStock, setYearStock] = useState([]);
	const [ys, setYs] = useState("");
	const [summaryData, setSummaryData] = useState([]);

	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/yearStockList`)
			.then((response) => response.json())
			.then((data) => {
				setYearStock(data);
				// Set the first invoice number as the selected invoice number
				if (data.length > 0) {
					setYs(data[0].YearStock);
				}
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);

	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/yearStockList`)
			.then((response) => response.json())
			.then((data) => {
				setYearStock(data);
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);

	useEffect(() => {
		if (ys) {
			
			fetch(`http://${ipAddress}:3005/api/summarizeScrapYear/${ys}`)
				.then((response) => response.json())
				.then((data) => {
					setSummaryData(data);
				})
				.catch((error) => {
					console.error("Error fetching summary data:", error);
				});
		}
	}, [ys]);

	const rowsWithId = summaryData.map((item, index) => ({
		id: index + 1, // ใช้ index + 1 เป็น id (ตัวอย่างเท่านี้ใช้ index + 1 แต่ควรใช้ค่า unique จากข้อมูลจริง)
		...item,
	}));

	const handleSelectChange = (event) => {
		// alert(event.target.value);
		setYs(event.target.value);
	};

	return (
		<div className="mainPage">
			<div className="centerH">
				<span>Select Year : </span>
				<div className="us-form">
					<div className="unwrap">
						<select onChange={handleSelectChange}>
							{yearStock.map((YearStock, index) => (
								<option key={index} value={YearStock.YearStock}>
									{YearStock.YearStock}
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
						height: "320px",
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
						// 		paginationModel: { page: 0, pageSize: 50 },
						// 	},
						// }}
						// disableColumnFilter
						// disableColumnSelector
						// disableDensitySelector
						density="compact"
						disableColumnMenu
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
