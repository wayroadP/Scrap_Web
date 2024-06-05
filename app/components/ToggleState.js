import React, { useState } from 'react';

function ToggleState({ Bag }) {
  const [isChecked, setIsChecked] = useState(Bag.PrintStatus === 1);

  const handleCheckboxChange = async () => {
    try {
      // ทำการอัปเดตสถานะของ isChecked โดยกำหนดให้เป็นค่าตรงข้ามของ isChecked เดิม
      setIsChecked((prevChecked) => !prevChecked);
      let st = 0;
      if(isChecked)
        st = 1;
      else
        st = 0;
      // เรียกใช้ฟังก์ชัน togglePrintStatus โดยส่ง OpenBagID และสถานะ isChecked ไปด้วย
      await togglePrintStatus(Bag.OpenBagID, st);
    } catch (error) {
      console.error('Error updating print status:', error);
      // กรณีเกิดข้อผิดพลาดในการอัปเดตสถานะของ isChecked
      // คุณอาจต้องเขียนโค้ดเพิ่มเติมเพื่อกู้คืนสถานะเดิมหรือจัดการข้อผิดพลาดตามที่ต้องการ
    }
  };

  return (
    <div>
      <input
        type="checkbox"
        onChange={handleCheckboxChange}
        checked={isChecked}
      />
      BagNo.{Bag.BagNo} {Bag.ScrapName}
    </div>
  );
}

export default ToggleState;
