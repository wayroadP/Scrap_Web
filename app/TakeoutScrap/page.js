"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";

import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

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

// async function getWait_takeout(invoiceNo) {
// 	// const response = await fetch("http://localhost:3005/api/wait_takeout");
// 	const response = await fetch(`http://${ipAddress}:3005/api/wait_takeout/${invoiceNo}`);

// 	return response.json();
// }



export default function Page() {
	const [selectionModel, setSelectionModel] = useState([]);
	const handleRowClick = (params) => {
		const rowData = params.row; // ข้อมูลของแถวที่ถูกคลิก
		const { BagNo, BagName } = params.row;
		// แสดงข้อมูลของแถวที่ถูกคลิกในแบบ Alert
		alert(`BagNo: ${BagNo}\nBagName: ${BagName}`);
	};

	const showQRCode = async (
		ScrapID,
		ScrapName,
		BagNo,
		BagName,
		FactoryCode,
		NetWeight,
		QRCode,
		id
	) => {
		// alert(QRCode);
		withReactContent(Swal)
			.fire({
				title: `<strong>BagNo.${BagNo} : ${ScrapName}</strong>`,
				icon: "",
				text: `Scrap Detail`,
				html: `
        <div>Bag Type : ${BagName}</div>
		<div>Factoy keep : ${FactoryCode}</div>
        <div>Net Weitht : ${NetWeight}</div><br>
       <br>
        <div style="text-align: center;">
      <img src="http://${ipAddress}:3005/qrImg/qr${QRCode}.png" alt="info" width="250" height="250">
      </div>`,
				showCloseButton: true,
				showCancelButton: false,
				focusConfirm: false,
				confirmButtonColor: '#FFC300',
				confirmButtonText: 'OK',
			})
	};
	const [invoiceNoList, setInvoiceNoList] = useState([]);
	const [invoiceNo, setInvoiceNo] = useState("");
	const [summaryData, setSummaryData] = useState([]);

	const [totalNetWeight, setTotalNetWeight] = useState(0);
	const [totalTakeOutNetW,setTotalTakeOutNetW]=useState(0);
	const [totalCompareNetW,setTotalCompareNetW]=useState(0);

	useEffect(() => {
		fetch(`http://${ipAddress}:3005/api/invoiceNoList`)
			.then((response) => response.json())
			.then((data) => {
				const modifiedData = [{ InvoiceNo: 'ALL' }, ...data];
				setInvoiceNoList(modifiedData);
				// Set the first invoice number as the selected invoice number
				// if (data.length > 0) {
				setInvoiceNo('ALL');
				// }
			})
			.catch((error) => {
				console.error("Error fetching invoice numbers:", error);
			});
	}, []);

	useEffect(() => {
		if (invoiceNo) {
			fetch(`http://${ipAddress}:3005/api/wait_takeout/${invoiceNo}`)
				.then((response) => response.json())
				.then((data) => {
					setSummaryData(data);
					// Calculate the total NetWeight
                    const totalWeight = data.reduce((sum, item) => sum + item.NetWeight, 0);
                    setTotalNetWeight(totalWeight);
					const totalTakeOut = data.reduce((sum, item) => sum + item.TakeOutNetWeight, 0);
                    setTotalTakeOutNetW(totalTakeOut);
					const totalComp = data.reduce((sum, item) => sum + item.CompareNetWeight, 0);
                    setTotalCompareNetW(totalComp);
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

	// const firstTotalNetW = rowsWithId.length > 0 ? rowsWithId[0].TotalNetW : null;
	// const firstTotalTakeOutNetW =
	// 	rowsWithId.length > 0 ? rowsWithId[0].TotalTakeOutNetW : null;
	// const firstTotalCompareNetW =
	// 	rowsWithId.length > 0 ? rowsWithId[0].TotalCompareNetW : null;

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
							pageSize={10}
							rowsPerPageOptions={[10, 20, 50]}
							density="compact"
							// initialState={{
							// 	pagination: {
							// 		paginationModel: { page: 0, pageSize: 10 },
							// 	},
							// }}
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
							onRowClick={(params) => {
								showQRCode(
									params.row.ScrapID,
									params.row.ScrapName,
									params.row.BagNo,
									params.row.BagName,
									params.row.FactoryCode,
									params.row.NetWeight,
									params.row.QRCode,
									params.row.id
								);
							}}
						/>
					</Box>
				</Suspense>
			</div>
			{/* TotalNetW */}
			<div className="tableDetail">
				<table className="centerH">
					<tbody>
						<tr>
							<td>Total NetWeight : </td>
							<td>
								{" "}
								{totalNetWeight
									? totalNetWeight.toLocaleString(undefined, {
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
								{totalTakeOutNetW
									? totalTakeOutNetW.toLocaleString(undefined, {
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
								{totalCompareNetW
									? totalCompareNetW.toLocaleString(undefined, {
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
