import React, { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faPencilAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { EditModal, DeleteModal } from "./components";
import "./App.css";

function App() {
  const [app, setApp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState({});
  const [editApp, setEditApp] = useState("");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    Axios.get("http://localhost:3001/getpasswords").then((response) => {
      setPasswordList(
        response.data.map((item) => ({
          ...item,
          isVisible: false,
          text: item.app,
        }))
      );
    });
  }, []);

  const addPassword = (event) => {
    event.preventDefault();

    setApp("");
    setPassword("");

    Axios.post("http://localhost:3001/addpassword", {
      app: app,
      password: password,
    }).then(() => {
      Axios.get("http://localhost:3001/getpasswords").then((response) => {
        setPasswordList(
          response.data.map((item) => ({
            ...item,
            isVisible: false,
            text: item.app,
          }))
        );
        setSuccessMessage("Success!");
        setTimeout(() => setSuccessMessage(""), 2000);
      });
    });
  };

  const getPassword = (encryption) => {
    return Axios.post("http://localhost:3001/decryptpassword", {
      app: encryption.app,
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      return response.data;
    });
  };

  const togglePassword = (encryption) => {
    if (encryption.isVisible) {
      hidePassword(encryption);
    } else {
      showPassword(encryption);
    }
  };

  const showPassword = (encryption) => {
    getPassword(encryption).then((decryptedPassword) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
                ...val,
                text: decryptedPassword,
                isVisible: true,
              }
            : val;
        })
      );
    });
  };

  const hidePassword = (encryption) => {
    setPasswordList(
      passwordList.map((val) => {
        return val.id === encryption.id
          ? {
              ...val,
              text: val.app,
              isVisible: false,
            }
          : val;
      })
    );
  };

  const openEditModal = (encryption) => {
    getPassword(encryption).then((decryptedPassword) => {
      setIsEditModalOpen(true);
      setCurrentPassword({ ...encryption, id: encryption.id });
      setEditApp(encryption.app);
      setEditPassword(decryptedPassword);
    });
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditApp("");
    setEditPassword("");
  };

  const handleEditSave = (event) => {
    event.preventDefault();

    Axios.post("http://localhost:3001/updatepassword", {
      id: currentPassword.id,
      app: editApp,
      password: editPassword,
    }).then(() => {
      Axios.get("http://localhost:3001/getpasswords").then((response) => {
        setPasswordList(
          response.data.map((item) => ({
            ...item,
            isVisible: false,
            text: item.app,
          }))
        );
        closeEditModal();
      });
    });
  };

  const openDeleteModal = (password) => {
    setCurrentPassword(password);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDelete = () => {
    Axios.post("http://localhost:3001/deletepassword", {
      id: currentPassword.id,
    }).then(() => {
      Axios.get("http://localhost:3001/getpasswords").then((response) => {
        setPasswordList(
          response.data.map((item) => ({
            ...item,
            isVisible: false,
            text: item.app,
          }))
        );
        closeDeleteModal();
      });
    });
  };

  return (
    <div className='App'>
      <div className='Banner'>
        <div className='Title'>PassPouch</div>
      </div>

      <div className='MainContent'>
        <div className='LeftPanel'>
          <div className='Intro'>
            <img
              src={`${process.env.PUBLIC_URL}/kangaroo-cartoon.png`}
              alt='Kangaroo'
              className='Kangaroo'
            />
            <div className='IntroText'>
              <h1>Hello there!</h1>
              <h2>Add your passwords to my pouch, and I'll keep them safe!</h2>
              <h2>
                View your saved passwords on the right & click the eye icon to
                toggle visibility.
              </h2>
            </div>
          </div>

          <form className='AddPassword' onSubmit={addPassword}>
            <input
              type='text'
              placeholder='Enter app name'
              value={app}
              onChange={(event) => setApp(event.target.value)}
              required
            />
            <input
              type='text'
              placeholder='Enter password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button type='submit'>
              {successMessage ? "Success!" : "Add Password"}
            </button>
          </form>
        </div>

        <div className='Passwords'>
          <h2>Your Saved Passwords:</h2>
          {passwordList.map((val, key) => {
            return (
              <div className='PasswordRow' key={key}>
                <div
                  className='Password'
                  style={{
                    backgroundColor: val.isVisible ? "#78aba8" : "#e98b4c",
                  }}
                >
                  <h3>{val.text}</h3>
                </div>
                <FontAwesomeIcon
                  className='Icon'
                  icon={val.isVisible ? faEyeSlash : faEye}
                  onClick={() => togglePassword(val)}
                />
                <FontAwesomeIcon
                  className='Icon'
                  icon={faPencilAlt}
                  onClick={() => openEditModal(val)}
                />
                <FontAwesomeIcon
                  className='Icon'
                  icon={faTrash}
                  onClick={() => openDeleteModal(val)}
                />
              </div>
            );
          })}
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        app={editApp}
        password={editPassword}
        onSave={handleEditSave}
        onClose={closeEditModal}
        onAppChange={(e) => setEditApp(e.target.value)}
        onPasswordChange={(e) => setEditPassword(e.target.value)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        appName={currentPassword?.app}
        onDelete={handleDelete}
        onClose={closeDeleteModal}
      />
    </div>
  );
}

export default App;
