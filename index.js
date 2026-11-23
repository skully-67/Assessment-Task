/* Python Implementation, comment out js implementaion below before running

    const spawn = require("child_process").spawn;
    // you can add arguments with spawn('python',["path/to/script.py", arg1, arg2, ...])
    const pythonProcess = spawn('python',["database_manager.py"]);

*/

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database/data_source.db");

const fs = require("fs");

db.all("SELECT * FROM Liverpool_FC_Squad", function (err, rows) {
  if (err) {
    console.log(err.message);
    return;
  }

  const jsonData = JSON.stringify(rows, null, 2);

  fs.writeFileSync("public/frontEndData.json", jsonData);

  console.log("Catalogue JSON updated");
});
const express = require("express");
const path = require("path");
const app = express();
app.use(express.static(path.join(__dirname, "public")));
let bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
  res.sendFile(path.join(__dirname, "public/add.html"));
});

app.post("/add.html", function (req, res) {
  db.serialize(() => {
    db.run(
      "INSERT INTO contact_list(email,name) VALUES(?,?)",
      [req.body.email, req.body.name],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
        res.send(
          "Thank you " +
            req.body.name +
            " we have added your email " +
            req.body.email +
            " to our distribution list.",
        );
      },
    );
  });
});

app.listen(5000, () =>
  console.log(
    "Server is running on Port 3000, visit http://localhost:3000/ or http://127.0.0.1:3000 to access your website",
  ),
);
