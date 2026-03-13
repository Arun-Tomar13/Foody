const multer = require("multer");
const  path  = require("path");
const  fs  = require("fs");

const upload = (folderName) =>{
  return multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        const dirName = path.join('public/uploads',folderName)
        if(!fs.existsSync(dirName)) fs.mkdirSync(dirName)
        cb(null, `./public/uploads/${folderName}`);
      },
      filename: function (req, file, cb) {
        const imageName = req.user + "-" + Date.now() + "-" + file.originalname;
        cb(null, imageName);
      },
    }),
  });
}

module.exports = upload
