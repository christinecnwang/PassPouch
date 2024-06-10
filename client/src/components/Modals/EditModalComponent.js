import React from "react";
import "./Modal.css";

function EditModalComponent({
  isOpen,
  app,
  password,
  onSave,
  onClose,
  onAppChange,
  onPasswordChange,
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className='Overlay' onClick={onClose}></div>
      <div className='Modal'>
        <h2>Edit Password</h2>
        <form onSubmit={onSave}>
          <input
            type='text'
            value={app}
            onChange={onAppChange}
            placeholder='Enter App Name'
            required
          />
          <input
            type='text'
            value={password}
            onChange={onPasswordChange}
            placeholder='Enter Password'
            required
          />
          <button type='submit'>Save Changes</button>
          <button onClick={onClose}>Close</button>
        </form>
      </div>
    </>
  );
}

export default EditModalComponent;
