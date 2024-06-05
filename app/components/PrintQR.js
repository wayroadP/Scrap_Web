// components/PrintQR.js

import React from 'react';

const DataView = ({ data }) => {
  return (
    <div>
      <h1>Data View</h1>
      <table>
        <thead>
          <tr>
            <th>No.</th>
            <th>QR Code</th>
            <th>Scrap Name</th>
            <th>Bag Name</th>
            <th>Factory Code</th>
            <th>User Create Bag</th>
            <th>Date Create Bag</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr key={item.OpenBagID}>
              <td>{item['No.']}</td>
              <td>{item.QRCode}</td>
              <td>{item.ScrapName}</td>
              <td>{item.BagName}</td>
              <td>{item.FactoryCode}</td>
              <td>{item.UserCreateBag}</td>
              <td>{new Date(item.DateCreateBag).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrintQR;
