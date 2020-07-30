const Router = require("koa-router");
const multer = require("koa-multer");
const uuidv5 = require("uuid/v5");
const Controller = require("./controller");
const gcsSharp = require("multer-sharp");

const storage = gcsSharp({
  filename: (req, file, cb) => {
    const MY_NAMESPACE = "7d849d8b-7294-46ab-87a0-8851fb3c9256";
    const ext = file.originalname
      .substr(file.originalname.lastIndexOf("."), file.originalname.length)
      .toLowerCase();
    const filename = uuidv5(`${Date.now()}-${file.originalname}`, MY_NAMESPACE);
    cb(null, `${filename}${ext}`);
  },
  bucket: "hitgall_image_testing", // Required : bucket name to upload
  projectId: "axial-edition-275610", // Required : Google project ID
  keyFilename: "My First Project-87cdfeaa0d0c.json",
  destination: "public/image", // Optional : destination folder to store your file on Google Cloud Storage, default: ''
  acl: "publicRead", // Optional : acl credentials file for Google Cloud Storage, 'publicrRead' or 'private', default: 'private', default
  gzip: true,
  sizes: [
    { suffix: "xlg", width: 1200 },
    { suffix: "lg", width: 800 },
    { suffix: "md", width: 500 },
    { suffix: "sm", width: 300 },
    { suffix: "xs", width: 100, height: 100 }
  ],
  metadata: {
    cacheControl: "public, max-age=31536000"
  }
});

const upload = multer({
  storage
});

const app = new Router();

// const middleware = (ctx, next) => {
//   console.log("hits!");
//   // console.log(ctx.req);
//   next();
// };

// 유저 프로필 관련 이미지 업로드
app.post("/profile", upload.single("image"), Controller.createImage());
app.post(
  "/background",
  upload.single("image"),
  Controller.createImage("background")
);

app.post("/icon", upload.single("image"), Controller.createImage("icon"));
app.post("/pick", upload.single("image"), Controller.createImage("pick"));

// 게시물 이미지 업로드
app.post("/topic", upload.single("image"), Controller.createImage("topic"));

module.exports = app;
