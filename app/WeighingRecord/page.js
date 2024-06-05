"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";
import ColorText from "../components/ColorText";

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
} from "@mui/material";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

// import { submitForm } from './action'
import Link from "next/link";
import { fromJSON } from "postcss";
{
	/* <TableCell>No</TableCell>
										<TableCell>WR_ID</TableCell>
										<TableCell>InvoiceNo</TableCell>
										<TableCell>ScrapID</TableCell>
										<TableCell>BagNo</TableCell>
										<TableCell>BagName</TableCell>
										<TableCell>FactoryCode</TableCell>
										<TableCell>NetWeight</TableCell> */
}
const columns = [
	{
		field: "id",
		headerName: "No",
		width: 70,
		type: "number",
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	// { field: "WeighingRecordID", headerName: "WR_ID", width: 70 },
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
	// const response = await fetch("http://localhost:3005/api/wr_1");
	const response = await fetch(`http://${ipAddress}:3005/api/wr_1`);
	if (!response.ok) {
		throw new Error("cannot fetch OpenBag");
	}
	return response.json();
}

export default function Page() {

	const handleRowClick = (params) => {
		const rowData = params.row; // ข้อมูลของแถวที่ถูกคลิก
		const { BagNo, BagName } = params.row;
		// แสดงข้อมูลของแถวที่ถูกคลิกในแบบ Alert
		alert(`BagNo: ${BagNo}\nBagName: ${BagName}`);
	};

	const [WR_1, setWR_1] = useState([]);
	const initWR_1 = async () => {
		try {
			const result = await getWR_1();
			setWR_1(result);
		} catch (error) {
			console.log("error", error);
		}
	};
	useEffect(() => {
		initWR_1();
		console.log("userEffect");
	}, []);
	console.log(WR_1);
	const rowsWithId = WR_1.map((item, index) => ({
		id: index + 1, // ใช้ index + 1 เป็น id (ตัวอย่างเท่านี้ใช้ index + 1 แต่ควรใช้ค่า unique จากข้อมูลจริง)
		...item,
	}));

	return (
		<div className="mainPage">
			{/* <h3 className="centerH">Bags Status</h3> */}
			<div className="sDataGrid">
				<Suspense fallback={<p>Loading feed...</p>}>
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
							// 		paginationModel: { page: 0, pageSize: 10 },
							// 	},
							// }}
							density="compact"
							disableColumnFilter
							disableColumnSelector
							disableDensitySelector
							disableColumnMenu
							slots={{ toolbar: GridToolbar }}
							slotProps={{
								toolbar: {
									showQuickFilter: true,
								},
							}}
						/>
					</Box>
				</Suspense>
			</div>
		</div>
	);
}
