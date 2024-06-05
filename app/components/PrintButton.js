import React from 'react';

const PrintButton = () => {
  const handlePrint = () => {
    // เลือกส่วนที่ต้องการพิมพ์
    const printableContent = document.querySelector('.printable-content');

    // สร้างหน้าต่างใหม่เพื่อพิมพ์เฉพาะส่วนที่ต้องการ
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <link rel="stylesheet" href="print.css" type="text/css" media="print">
        </head>
        <body>
          <div class="printable-content">
            ${printableContent.innerHTML}
          </div>
        </body>
      </html>
    `);

    // เมื่อเสร็จสิ้นในการเขียนเนื้อหาสำหรับพิมพ์ ให้พิมพ์เอกสาร
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div>
      
      <div className="printable-content">
        {/* เนื้อหาที่ต้องการพิมพ์ */}
        <h1>Printable Content</h1>
        <p>This is the content that will be printed.</p>
      </div>
      <button onClick={handlePrint}>Print</button>
    </div>
  );
};

export default PrintButton;
