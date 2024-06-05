// sections for this page
import Image from "next/image";
export default function Components() {
	return (
		<div>
			<div style={{ display: "flex", justifyContent: "center",marginTop:'100px',marginLeft:'15%' }}>
				<Image
					src="/img/scrap_bg.jpg"
					alt="Scrap Image Background"
					width={1420}
					height={500}
					layout="intrinsic"
					style={{ width: "auto", height: "auto" }}
				/>
			</div>
		</div>
	);
}
