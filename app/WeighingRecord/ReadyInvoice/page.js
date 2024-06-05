"use client";
const ipAddress = require("@/config"); // เรียกใช้ค่า IP Address จากไฟล์ config.js
import { Suspense } from "react";
import { useState, useEffect } from "react";

import * as React from "react";
import { DataGrid, GridToolbar, gridClasses } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { alignProperty } from "@mui/material/styles/cssUtils";

// import { submitForm } from './action'
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";
const columns = [
	// { field: "id", headerName: "No", width: 70 },
	{
		field: "WeighingRecordID",
		headerName: "WeighingRecordID",
		type: "number",
		width: 150,
		headerAlign: "center",
		headerClassName: "super-app-theme--header",
	},
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
	// {
	// 	field: "TotalNetW",
	// 	headerName: "Total NetWeight",
	// 	type: "number",
	// 	width: 130,
	// 	headerAlign: "center",
	// 	headerClassName: "super-app-theme--header",
	// },
];

async function getWR_1() {
	// const response = await fetch('http://localhost:3005/api/wr_2');
	const response = await fetch(`http://${ipAddress}:3005/api/wr_2`);
	if (!response.ok) {
		throw new Error("Cannot fetch WR_1");
	}
	return response.json();
}

export default function Page() {
	const [selectionModel, setSelectionModel] = useState([]);
	const [selModel, setSelModel] = useState([]);
	const [WR_1, setWR_1] = useState([]);
	const [sInvoice,setSInvoice]=useState(0);

	const initWR_1 = async () => {
		try {
			const result = await getWR_1();
			setWR_1(result);
		} catch (error) {
			console.log("Error fetching WR_1:", error);
		}
	};

	useEffect(() => {
		initWR_1();
	}, []);

	const rowsWithId = WR_1.map((item, index) => ({
		id: index + 1,
		...item,
	}));

	async function takeInvoice(SelWRID, UserInvoice) {
		// sp_UpdatePrintStatus
		// /api/updatePrintStatus/:OpenBagID
		// console.log(WeighingRecordIDs);
		console.log(UserInvoice);
		console.log(SelWRID);

		// const url = `http://localhost:3005/api/wr_invoice_all/${encodeURIComponent(UserInvoice)}`;
		const url = `http://${ipAddress}:3005/api/wr_invoice_all/${encodeURIComponent(
			SelWRID
		)}/${encodeURIComponent(UserInvoice)}`;
		// const url = `http://localhost:3005/api/togglePrintStatus/${encodeURIComponent(
		// 	OpenBagID
		// )}/${encodeURIComponent(st)}`;

		const response = await fetch(url);

		if (!response.ok) {
			throw new Error("ไม่สามารถเรียกข้อมูล OpenBag ได้");
		}
		// รีเฟรชหน้าโดยใช้ useRouter hook

		//  router.reload();
		// history.push('/BagOpened');
		// router.push('/BagOpened');
		return response.json();
	}
	////////////////////////////////////////////////////////////////////////
	//Sweet Take Invoice check PIC
	const checkTakeInvoice = async (
		WeighingRecordID,
		ScrapID,
		ScrapName,
		BagNo,
		BagName,
		FactoryCode,
		NetWeight,
		QRCode,
		id
	) => {
		let confirmBtn = "";
		let confirmBtnColor = "";
		if (selectionModel.includes(WeighingRecordID)) {
			(confirmBtnColor = "#EF233C"), (confirmBtn = "Cancel Confirm Invoice");
		} else {
			(confirmBtnColor = "#FFC300"), (confirmBtn = "Confirm Invoice");
		}
		withReactContent(Swal)
			.fire({
				title: `<strong>WeighingRecordID : ${WeighingRecordID}</strong>`,
				icon: "",
				text: `Would you like to take this scrap invoice ?`,
				html: `
        <div>BagNo. ${BagNo} : ${ScrapName}</div>
        <div>Bag Type : ${BagName}</div>
		<div>Factoy keep : ${FactoryCode}</div>
        <div>Net Weitht : ${NetWeight}</div><br>
        <div>Would you like to take this scrap invoice ?</div><br>
        <div style="text-align: center;">
      <img src="http://${ipAddress}:3005/image/${QRCode}.jpg" alt="info" width="450" height="500">
      </div>`,
				showCloseButton: true,
				showCancelButton: true,
				focusConfirm: false,
				confirmButtonColor: confirmBtnColor,
				confirmButtonText: confirmBtn,
				cancelButtonText: `Cancle`,
			})
			.then((result) => {
				// Check if the user clicked the "Print" button
				if (result.isConfirmed) {
					// เพิ่ม WeighingRecordID เข้าไปใน selectionModel
					useStateWRID(WeighingRecordID);
				} else {
					// ถ้าผู้ใช้คลิก "Cancel" ลบ WeighingRecordID ออกจาก selectionModel
					setSelModel(["2"]);
				}
			});
	};

	const useStateWRID = async (WeighingRecordID) => {
		// alert(WeighingRecordID);
		if (WeighingRecordID != "") {
			if (selectionModel.includes(WeighingRecordID)) {
				const updatedSelection = selectionModel.filter(
					(id) => id !== WeighingRecordID
				);
				setSelectionModel(updatedSelection);
			} else {
				setSelectionModel((prevSelection) => [
					WeighingRecordID,
					...prevSelection,
				]);
			}
		}
	};

	const customRowClassName = async (params) => {
		// ตัดสินใจส่งคืนชื่อคลาส CSS ที่ต้องใช้สำหรับแถว
		if (params.isSelected) {
			return "selectedRow";
		} else if (params.columns.NetWeight > 100) {
			return "heavy-row";
		} else {
			return ""; // ไม่มีการปรับเปลี่ยนสี
		}
	};
	///////////// continue!!!!!!!
	const confirmTakeInv = async (
		InvoiceST,
		TotalNetWeight,
		UserInvoice,
		SelWRID
	) => {
		let textAlert = "";
		let iconAlert = "";
		let confirmSt = true;
		if (TotalNetWeight == null) InvoiceST = false;
		// alert(TotalNetWeight);
		if (InvoiceST) {
			textAlert = `คุณต้องการออก Invoice Scrap ทั้งหมด ${TotalNetWeight.toLocaleString()} kgs นี้ใช่หรือไม่`;
			iconAlert = "warning";
			confirmSt = true;
			if(sInvoice==0){
				if (TotalNetWeight <= 10000) {
					textAlert = "จำนวนของ Scrap ที่ทำการ Take Invoice  น้อยกว่า 10,000 kgs";
					iconAlert = "error";
					confirmSt = false;
				}
			}else{
			  textAlert = `คุณต้องการออก Invoice Scrap ทั้งหมด ${TotalNetWeight.toLocaleString()} kgs ในแบบพิเศษใช่หรือไม่`;
			}
		} else {
			textAlert =
				"ต้องทำการเลือก Scrap ทั้งหมดและตรวจสอบความถูกต้องให้ครบจึงจะสามารถออก Invoice ได้";
			iconAlert = "error";
			confirmSt = false;
		}
		withReactContent(Swal)
			.fire({
				// icon: "success",  // success, error, warning, info, question
				title: `<strong>WeighingRecordID : ${SelWRID}</strong>`,
				icon: iconAlert,
				text: textAlert,
				showCloseButton: true,
				showCancelButton: true,
				confirmButtonColor: "#FFC300",
				showConfirmButton: confirmSt,
				focusConfirm: false,
				confirmButtonText: "Yes",
				cancelButtonText: "No",
			})
			.then((result) => {
				if (result.isConfirmed && confirmSt) {
					//  window.location.reload();
					window.location.href = "/WeighingRecord/InvoiceDetail";
					takeInvoice(SelWRID, UserInvoice);
				}
			});
	};
	const checkLen = async (len, totalNetW, user, selInv) => {
		alert(selInv);
	};
	const sInvoiceCheck = async(checked)=>{
		// alert(checked);
		if(checked){
			setSInvoice(1);
		}else{
			setSInvoice(0);
		}
		
	}
	const firstTotalNetW = rowsWithId.length > 0 ? rowsWithId[0].TotalNetW : null;
	return (
		<div className="mainPage">
			<div>
				{/* <div className="centerH">
				<h3>Ready for Invoice</h3>
			</div> */}
				<div className="sDataGrid">
					<Box
						sx={{
							height: "auto",
							width: "auto",
							"& .super-app-theme--header": {
								backgroundColor: "rgba(255, 195, 0)",
								color: "rgba(0, 0, 0)",
							},
							"& .MuiDataGrid-filterForm .MuiPaper-root": {
								backgroundColor: "rgba(255, 195, 0)", // Also change color for the paper element
							},
							[`.${gridClasses.cell}.checked`]: {
								backgroundColor: "#001D3D",
								color: "#EDF2F4",
							},
							[`.${gridClasses.cell}.uncheck`]: {
								backgroundColor: "#EDF2F4",
								color: "#000814",
							},
						}}
					>
						<DataGrid
							// checkboxSelection
							getRowClassName={customRowClassName}
							rows={rowsWithId}
							columns={columns}
							rowsPerPageOptions={[10, 20, 50]}
							// initialState={{
							// 	pagination: {
							// 		paginationModel: { page: 0, pageSize: 10 },
							// 	},
							// }}
							getCellClassName={(params) => {
								if (selectionModel.includes(params.row.WeighingRecordID)) {
									return "checked";
								} else {
									return "uncheck";
								}
							}}
							// isRowSelectable={(params) => params.row.WeighingRecordID > 0}
							selectionModel={selModel}
							// disabled={selectionModel.length === rowsWithId.length}
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
							// disableDensitySelector
							onRowClick={(params) => {
								if (params.row.WeighingRecordID != null) {
									checkTakeInvoice(
										params.row.WeighingRecordID,
										params.row.ScrapID,
										params.row.ScrapName,
										params.row.BagNo,
										params.row.BagName,
										params.row.FactoryCode,
										params.row.NetWeight,
										params.row.QRCode,
										params.row.id,
										params.row.TotalNetWeight
									);
								}
							}}
						/>
					</Box>
				</div>
			</div>

			<div className="setDetail">
				<table>
					<tbody>
						<tr>
							<td>Total NetWeight :</td>
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
							<td>Selected WeighingRecordIDs :</td>
							<td>{selectionModel.join(", ")}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div className="setDetail">
				<button
					className="buttonP"
					onClick={() =>
						confirmTakeInv(
							rowsWithId.length == selectionModel.length,
							firstTotalNetW,
							"8080",
							selectionModel
						)
					}
				>
					{/* rowsWithId.length-1 */}
					{/* onClick={() => confirmTakeInv("8080")} */}
					Take Invoice
				</button>
			</div>
			<div className="tableDetail">
			<input type="checkbox"	onChange={(e) => sInvoiceCheck(
											e.target.checked
										)
									}
								/>
				Special Take Invoice</div>
		</div>
	);
}
