import "./App.css";
import React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [app, setApp] = useState("");
  const [password, setPassword] = useState("");
  const [passwordList, setPasswordList] = useState([]);

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
        setApp("");
        setPassword("");
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
      <form className='AddPassword' onSubmit={addPassword}>
        <input
          type='text'
          placeholder='Enter app name'
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
        <button type='submit'>Add Password</button>
      </form>

      <div className='Passwords'>
        {passwordList.map((val, key) => {
          return (
            <div
              className='Password'
              onClick={() => {
                togglePassword(val);
              }}
              key={key}
            >
              <h3>{val.text}</h3>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
