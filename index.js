require("dotenv").config();

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const moment = require("moment");

const database = require("./config/database");
const systemConfig = require("./config/system");
const adminRoutes = require("./routes/admin/index.route");

const app = express();
const port = process.env.PORT || 3000;

// Gia tri du phong, de ung dung van chay duoc neu quen tao file .env
process.env.MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quan_ly_thuc_tap";
process.env.SESSION_SECRET = process.env.SESSION_SECRET || "doi-chuoi-nay-trong-file-env";

database.connect();

// --- View engine: PUG (dung dung nhu bai 14 cua khoa hoc) ---
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// --- Middleware chung ---
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// Cho phep form HTML gui duoc PATCH / DELETE qua ?_method=PATCH
app.use(methodOverride("_method"));
app.use(cookieParser(process.env.SESSION_SECRET));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 8 }
  })
);
app.use(flash());

// --- Bien toan cuc dung duoc trong moi file .pug ---
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

// Day flash message sang view de partials/alert.pug hien thi
app.use((req, res, next) => {
  res.locals.messages = {
    success: req.flash("success"),
    error: req.flash("error")
  };
  next();
});

// --- Routes ---
adminRoutes(app);

app.get("/", (req, res) => {
  res.redirect(systemConfig.prefixAdmin + "/dashboard");
});

// 404
app.use((req, res) => {
  res.status(404).render("admin/pages/error/404", { pageTitle: "Khong tim thay trang" });
});

app.listen(port, () => {
  console.log("[APP] Server chay tai http://localhost:" + port);
});
