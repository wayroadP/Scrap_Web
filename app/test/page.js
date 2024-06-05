'use client'
import React, { useState } from "react";
import {IoMdNotificationsOutline} from 'react-icons/io'
import { IoIosHelpCircleOutline } from 'react-icons/io';
import { CiLogout } from 'react-icons/ci';
import {CiSettings} from 'react-icons/ci'
import {RiEditBoxLine} from 'react-icons/ri'
import {CgProfile} from 'react-icons/cg'

function DropdownMenu() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  return (
    <div className={`navigation${isActive ? " active" : ""}`}>
      <div className="userBx">
        <div className="imgBx">
          <img src="/img/user2.jpg" alt="user" />
        </div>
        <p className="username">Jully smith</p>
      </div>
      <div className="menuToggle" onClick={handleClick}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <ul className="menu">
        <li>
          <a href="/"><CgProfile/>My profile</a>
        </li>
        <li>
          <a href="/"><RiEditBoxLine/> Edit</a>
        </li>
        <li>
          <a href="/"><IoMdNotificationsOutline/> Notifications</a>
        </li>
        <li>
          <a href="/"><CiSettings/> Settings</a>
        </li>
        <li>
          <a href="/"><IoIosHelpCircleOutline/> Help & support</a>
        </li>
        <li>
          <a href="/"><CiLogout/> Logout</a>
        </li>
      </ul>
    </div>
  );
}

export default DropdownMenu;

// ----------------------------------------------Type Script code start---------------------------

// import React, { useState } from "react";
// // import "../Style/DropdownMenuStyle.css";

// function DropdownMenu(): JSX.Element {
//   const [isActive, setIsActive] = useState<boolean>(false);

//   const handleClick = (): void => {
//     setIsActive(!isActive);
//   };

//   return (
//     <div className={`navigation${isActive ? " active" : ""}`}>
//       <div className="userBx">
//         <div className="imgBx">
//           <img src="/img/user.jpg" alt="user" />
//         </div>
//         <p className="username">Jully smith</p>
//       </div>
//       <div className="menuToggle" onClick={handleClick}>
//         <span></span>
//         <span></span>
//         <span></span>
//       </div>
//       <ul className="menu">
//         <li>
//           <a href="/">My profile</a>
//         </li>
//         <li>
//           <a href="/">Edit</a>
//         </li>
//         <li>
//           <a href="/">Notifications</a>
//         </li>
//         <li>
//           <a href="/">Settings</a>
//         </li>
//         <li>
//           <a href="/">Help &amp; support</a>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default DropdownMenu;

// ----------------------------------------------Type Script code css---------------------------




// --------------------------------------------Css file code start-----------------------------------

// @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');

// *{
// margin: 0;
// padding: 0;
// box-sizing: border-box;
// font-family: 'Ubuntu', sans-serif;
// }
// body {
// min-height: 100vh;
// background: radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%);
// }


 
// --------------------------------------------Css file code end-----------------------------------