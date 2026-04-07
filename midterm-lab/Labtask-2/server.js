let express = require("express");
let app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/contact-us", function (req, res) {
  return res.render("contact-us");
});

app.get("/", function (req, res) {
  return res.render("index");
});

app.listen(3000, function () {
  console.log("Server Started at localhost:3000");
});

console.log("Console from server.js file");