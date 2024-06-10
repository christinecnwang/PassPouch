const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 3001;

const { encrypt, decrypt } = require("./EncryptionHandler");

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "passpouch",
});

app.post("/addpassword", (req, res) => {
  const { app, password } = req.body;
  const hashedPassword = encrypt(password);

  db.query(
    "INSERT INTO passwords (app, password, iv) VALUES (?, ?, ?)",
    [app, hashedPassword.password, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success: values inserted");
      }
    }
  );
});

app.get("/getpasswords", (req, res) => {
  db.query("SELECT * FROM passwords", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/decryptpassword", (req, res) => {
  res.send(decrypt(req.body));
});

app.post("/updatepassword", (req, res) => {
  const { id, app, password } = req.body;
  const hashedPassword = encrypt(password);

  db.query(
    "UPDATE passwords SET app = ?, password = ?, iv = ? WHERE id = ?",
    [app, hashedPassword.password, hashedPassword.iv, id],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send("Success: values updated");
      }
    }
  );
});

app.post("/deletepassword", (req, res) => {
  const { id } = req.body;

  db.query("DELETE FROM passwords WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send("Success: values deleted");
    }
  });
});

app.listen(PORT, () => {
  console.log("Server is running!");
});
