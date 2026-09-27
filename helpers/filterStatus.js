// Sinh danh sach nut loc trang thai cho giao dien, danh dau nut dang duoc chon.
module.exports = (query, options = []) => {
  const base = [{ label: "Tat ca", value: "" }, ...options];

  return base.map((item) => ({
    ...item,
    class: (query.status || "") === item.value ? "active" : ""
  }));
};
