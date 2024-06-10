import React from "react";
import "./Modal.css";

function DeleteModalComponent({ isOpen, appName, onDelete, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      <div className='Overlay' onClick={onClose}></div>
      <div className='Modal'>
        <h2>Are you sure?</h2>
        <p>Do you really want to delete the password for: "{appName}"?</p>
        <button onClick={onDelete}>Yes</button>
        <button onClick={onClose}>No</button>
      </div>
    </>
  );
}

export default DeleteModalComponent;
