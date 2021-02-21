const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const bodyParser = require("body-parser");

const app = express();

// MULTER CONFIGURATION

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "files/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

app.use(express.static("files"));
app.use(express.static("views"));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: storageConfig }).array("uploadFiles", 5));

app.get("/api/delete", (req, res) => {
  fs.readdir("files", (err, files) => {
    files.forEach((file) => {
      fs.unlink(path.join("files", file), (err) => {
        if (err) {
          console.error(err);
          return;
        }

        //file removed
      });
    });
  });

  res.redirect("/index.html");
});

app.post("/api/send", (req, res) => {
  res.redirect("/send.html?success=true");
});

app.get("/api/recieve/:id", (req, res) => {
  var filePath = path.join("files", req.params.id);
  res.download(filePath);
});

app.get("/api/recieve", (req, res) => {
  var data = [];
  fs.readdir("files", (err, files) => {
    res.send(files);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    "Application started. You can send and recieve your files now. \n"
  );
});

function uniqueID() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

