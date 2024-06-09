import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

function App() {
  const [app, setApp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

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

  const togglePassword = (encryption) => {
    if (encryption.isVisible) {
      hidePassword(encryption);
    } else {
      showPassword(encryption);
    }
  };

  const showPassword = (encryption) => {
    Axios.post("http://localhost:3001/decryptpassword", {
      password: encryption.password,
      iv: encryption.iv,
    }).then((response) => {
      setPasswordList(
        passwordList.map((val) => {
          return val.id === encryption.id
            ? {
                ...val,
                text: response.data,
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
              <div className='PasswordRow'>
                <div className='Password' key={key}>
                  <h3>{val.text}</h3>
                </div>
                <FontAwesomeIcon
                  className='EyeIcon'
                  icon={faEye}
                  onClick={() => togglePassword(val)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
