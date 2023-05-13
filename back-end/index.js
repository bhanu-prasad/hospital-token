const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const socketIO = require("socket.io");

// const { Pool } = require('pg');
const cors = require("cors");
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

var mysql = require("mysql");
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hospital",
});
con.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/tokens", (req, res) => {
  con.connect((err) => {
    let sql = "SELECT * FROM tokens";
    con.query(sql, (err, results) => {
      if (err) console.log(err);
      res.send(results);
    });
  });
});
app.post("/token", (req, res) => {
  con.connect(function (err) {
    let sql2 = `SELECT COUNT(name) FROM tokens`;
    con.query(sql2, function (err, result) {
      let sql = `INSERT INTO tokens(name, phone, token) VALUES ('${
        req.body.name
      }',${req.body.number},${result[0]["COUNT(name)"] + 1 + 100})`;
      con.connect(function (err) {
        con.query(sql, (err, resu) => {
          if (err) console.log(err);
        });
      });
    });
  });
  res.send("done");
});
app.patch("/next", (req, res) => {
  con.connect((err) => {
    con.query("SELECT * FROM tokens WHERE flag = 1", (err, result) => {
      if (result.length == 1) {
        let sql = `UPDATE tokens SET flag = 1
        WHERE token = ${result[0].token + 1};`;
        con.query(sql, (err, resu) => {
          if (resu["affectedRows"] === 0) {
            res.send("Ok");
            return;
          }
          let sql2 = `UPDATE tokens SET flag = 0
        WHERE token = ${result[0].token};`;
          con.query(sql2, (err, resu) => {
            if (err) {
              res.send("Ok");
              return;
            }
            res.send("Ok");
          });
        });
      } else {
        let sql = `UPDATE tokens SET flag = 1
        WHERE token = 101;`;
        con.query(sql, (err, resu) => {
          res.send("Ok");
        });
      }
    });
  });
});
app.delete("/", (req, res) => {
  con.connect(function (err) {
    con.query("TRUNCATE TABLE tokens", (err, resp) => {
      if (err) console.log(err);
      res.send("Ok");
    });
  });
});
// Socket.io connection
io.on("connection", (socket) => {
  socket.on("nextToken", () => {
    con.connect((err) => {
      con.query("SELECT * FROM tokens WHERE flag = 1", (err, result) => {
        if (!err) {
          if (result.length > 0) {
            io.emit("token", { token: result[0].token, name: result[0].name });
          } else {
            io.emit("token", { token: "", name: "" });
          }
        }
      });
    });

    // Perform server-side logic
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});
server.listen(3010, () => {
  console.log("Listening on port: " + 3010);
});
