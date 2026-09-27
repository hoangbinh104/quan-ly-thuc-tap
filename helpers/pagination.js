// Tinh toan phan trang: tra ve limitItems, currentPage, skip, totalPage.
// countRecords lay tu Model.countDocuments(filter).
module.exports = (query, countRecords, limitDefault = 10) => {
  const pagination = {
    currentPage: 1,
    limitItems: limitDefault
  };

  if (query.page) pagination.currentPage = Math.max(1, parseInt(query.page) || 1);
  if (query.limit) pagination.limitItems = Math.max(1, parseInt(query.limit) || limitDefault);

  pagination.totalPage = Math.max(1, Math.ceil(countRecords / pagination.limitItems));
  if (pagination.currentPage > pagination.totalPage) pagination.currentPage = pagination.totalPage;
  pagination.skip = (pagination.currentPage - 1) * pagination.limitItems;
  pagination.totalRecords = countRecords;

  return pagination;
};
