// components/SweetAlert.js

import Swal from 'sweetalert2';
import withReactContent from "sweetalert2-react-content";
const  SweetAlert = async ({ type, title, text }) => {

    withReactContent(Swal).fire({
    icon: type,  // success, error, warning, info, question
    title: title,
    text: text
  });

//   return null; // SweetAlert component doesn't render anything directly
};

export default SweetAlert;
