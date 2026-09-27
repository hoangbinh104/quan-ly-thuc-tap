// Validate phia server. Bat buoc phai co, du form da validate o phia client,
// vi client hoan toan co the bi bo qua (Postman, sua HTML...).
module.exports.createPatch = (req, res, next) => {
  const errors = [];

  if (!req.body.code || !req.body.code.trim()) errors.push("Ma doanh nghiep khong duoc de trong.");
  if (!req.body.name || !req.body.name.trim()) errors.push("Ten doanh nghiep khong duoc de trong.");
  if (req.body.email && !/^\S+@\S+\.\S+$/.test(req.body.email)) errors.push("Email khong hop le.");
  if (req.body.soLuongTiepNhan && isNaN(Number(req.body.soLuongTiepNhan)))
    errors.push("So luong tiep nhan phai la so.");

  if (errors.length > 0) {
    req.flash("error", errors.join(" "));
    return res.redirect("back");
  }

  next();
};
