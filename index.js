const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "todocopy",
});

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let sqlquery = "SELECT * FROM items";
  conn.query(sqlquery, (err, results) => {
    if (!err) {
      res.render("todo", { items: results });
    }
  });
});

app.get("/update/:id", (req, res) => {
  res.render("update", { flag: req.params.id });
});

app.post("/update/:id", (req, res) => {
  let index = req.body.changedwork;
  if (req.body.changebtn) {
    let sqlquery =
      "UPDATE items SET item = '" +
      index +
      "' WHERE id =" +
      req.params.id +
      ";";
    conn.query(sqlquery, (err, results) => {
      console.log("data updated successfully!");
    });
  }
  res.redirect("/");
});

app.post("/", function (req, res) {
  let todoitem = req.body.work;
  if (req.body.btn) {
    if (todoitem !== "") {
      let sqlquery = "INSERT INTO items(item) VALUES('" + todoitem + "');";
      conn.query(sqlquery, (err, results) => {
        if (err) throw err;
      });
    }
  } else if (req.body.del) {
    let index = req.body.del;
    let sqlquery = "DELETE from items WHERE id='" + index + "';";
    conn.query(sqlquery, (err, results) => {
      if (err) throw err;
      else {
        console.log("data deleted successfully");
      }
    });
  } else if (req.body.update) {
    res.redirect("/update/" + req.body.update);
  }
  return res.redirect("/");
});

conn.connect((err) => {
  if (err) throw err;
  else console.log("mysql connected successfully");
});

app.listen(6969, function () {
  console.log("app running on port 6969");
});
