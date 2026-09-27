const bcrypt = require("bcryptjs");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const generate = require("../../helpers/generateToken");

// [GET] /admin/auth/login
module.exports.login = (req, res) => {
  if (req.cookies.token) return res.redirect(systemConfig.prefixAdmin + "/dashboard");
  res.render("admin/pages/auth/login", { pageTitle: "Dang nhap he thong" });
};

// [POST] /admin/auth/login
module.exports.loginPost = async (req, res) => {
  const { email, password } = req.body;

  const user = await Account.findOne({ email: email, deleted: false });

  // Thong bao chung chung cho ca 2 truong hop sai email / sai mat khau,
  // de khong lo thong tin tai khoan nao ton tai.
  if (!user) {
    req.flash("error", "Email hoac mat khau khong dung.");
    return res.redirect("back");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    req.flash("error", "Email hoac mat khau khong dung.");
    return res.redirect("back");
  }

  if (user.status !== "active") {
    req.flash("error", "Tai khoan dang bi khoa.");
    return res.redirect("back");
  }

  // Sinh token moi moi lan dang nhap
  user.token = generate.generateRandomString(30);
  await user.save();

  res.cookie("token", user.token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 8 });
  req.flash("success", "Dang nhap thanh cong.");
  res.redirect(systemConfig.prefixAdmin + "/dashboard");
};

// [GET] /admin/auth/logout
module.exports.logout = async (req, res) => {
  if (req.cookies.token) {
    await Account.updateOne({ token: req.cookies.token }, { token: "" });
  }
  res.clearCookie("token");
  res.redirect(systemConfig.prefixAdmin + "/auth/login");
};
