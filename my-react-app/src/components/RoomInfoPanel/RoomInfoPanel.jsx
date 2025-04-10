import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RoomInfoPanel.css';

const RoomInfoPanel = ({ code = "135783", qrImage = null, buttonRoute = "/" }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(buttonRoute);
  };

  return (
    <div className="room-info-panel">
      <div
        className="qr-box"
        style={{ backgroundImage: qrImage ? `url(${qrImage})` : 'none' }}
      >
        {!qrImage && <span className="qr-placeholder">QR CODE</span>}
      </div>

      <div className="code-box">
        <strong>{code}</strong>
      </div>

      <button className="banner-button" onClick={handleClick}>
        Comenzar
      </button>
    </div>
  );
};

export default RoomInfoPanel;
