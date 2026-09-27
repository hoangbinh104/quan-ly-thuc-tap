// Nhan query tu URL, tra ve doi tuong dung cho .find() cua Mongoose.
// keyword duoc chuyen thanh RegExp de tim gan dung, khong phan biet hoa thuong.
module.exports = (query, fields = ["name"]) => {
  const result = { keyword: "", filter: {} };

  if (query.keyword) {
    result.keyword = query.keyword.trim();
    const regex = new RegExp(result.keyword, "i");
    result.filter = { $or: fields.map((f) => ({ [f]: regex })) };
  }

  return result;
};
