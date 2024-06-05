"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { alignProperty } from "@mui/material/styles/cssUtils";

// import { submitForm } from './action'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const columns = [
	// { field: "id", headerName: "No", width: 70 },
	// {
	// 	field: "TakeOutNo",
	// 	headerName: "Takeout No.",
	// 	type: "number",
	// 	width: 150,
	// 	headerAlign: "center",
	// 	headerClassName: "super-app-theme--header",
	// },
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
		width: 75,
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
	{
		field: "TakeOutNetWeight",
		headerName: "TakeOut NetWeight",
		type: "number",
		width: 130,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "CompareNetWeight",
		headerName: "Compare",
		type: "number",
		width: 130,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "UserWeightTakeOut",
		headerName: "UserWeightTakeOut",
		width: 130,
		headerAlign: "center",
		type: "number",
		headerClassName: "super-app-theme--header",
	},
	{
		field: "UserRecTakeOut",
		headerName: "UserRecTakeOut",
		width: 130,
		headerAlign: "center",
		type: "number",
		headerClassName: "super-app-theme--header",
	},
];

async function getTakeoutDetail() {
	const response = await fetch(`http://${ipAddress}:3005/api/takeout_detail`);
	if (!response.ok) {
		throw new Error("Cannot fetch TakeoutDetail");
	}
	return response.json();
}

export default function Page() {
	const [TakeoutDetail, setTakeoutDetail] = useState([]);
	const [invoiceNoList, setInvoiceNoList] = useState([]);
	const [invoiceNo, setInvoiceNo] = useState("");
	const [summaryData, setSummaryData] = useState([]);

	const initTakeoutDetail = async () => {
		try {
			const result = await getTakeoutDetail();
			setTakeoutDetail(result);
		} catch (error) {
			console.log("Error fetching TakeoutDetail:", error);
		}
	};
	useEffect(() => {
		initTakeoutDetail();
	}, []);

	const rowsWithId = summaryData.map((item, index) => ({
		id: index + 1,
		...item,
	}));


	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/invoiceNoList`)
			.then((response) => response.json())
			.then((data) => {
				// Add "ALL" option to the invoiceNoList
				const modifiedData = [{ InvoiceNo: 'ALL' }, ...data];
				setInvoiceNoList(modifiedData);
				// Set the first invoice number as the selected invoice number
				
					setInvoiceNo('ALL');
				
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);
	const handleSelectChange = (event) => {
		// alert(event.target.value);
		setInvoiceNo(event.target.value);
	};
	useEffect(() => {
		if (invoiceNo) {
			fetch(`http://${ipAddress}:3005/api/takeout_detail/${invoiceNo}`)
				.then((response) => response.json())
				.then((data) => {
					setSummaryData(data);
				})
				.catch((error) => {
					console.error("Error fetching summary data:", error);
				});
		}
	}, [invoiceNo]);

	const firstTotalNetW = rowsWithId.length > 0 ? rowsWithId[0].TotalNetW : null;
	const firstTotalTakeOutNetW =
		rowsWithId.length > 0 ? rowsWithId[0].TotalTakeOutNetW : null;
	const firstTotalCompareNetW =
		rowsWithId.length > 0 ? rowsWithId[0].TotalCompareNetW : null;

	return (
		<div className="mainPage">
			<div className="us-form setDetail">
			<span className="w-full aspect-square">Invoice Number : </span>
				<select className="w-full aspect-square" onChange={handleSelectChange}>
					{invoiceNoList.map((InvoiceNo, index) => (
						<option key={index} value={InvoiceNo.InvoiceNo}>
							{InvoiceNo.InvoiceNo}
						</option>
					))}
				</select>
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
						isRowSelectable={(params) => params.row.WeighingRecordID > 0}
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
			<div className="tableDetail">
				<table className="centerH">
					<tbody>
						<tr>
							<td>Total NetWeight : </td>
							<td>
								{" "}
								{firstTotalNetW
									? firstTotalNetW.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: null}{" "}
								Kgs
							</td>
						</tr>
						<tr>
							<td>Total TakeOut NetWeight : </td>
							<td>
								{" "}
								{firstTotalTakeOutNetW
									? firstTotalTakeOutNetW.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: null}{" "}
								Kgs
							</td>
						</tr>
						<tr>
							<td>Total Compare NetWeight : </td>
							<td>
								{" "}
								{firstTotalCompareNetW
									? firstTotalCompareNetW.toLocaleString(undefined, {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2,
									  })
									: null}{" "}
								Kgs
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
