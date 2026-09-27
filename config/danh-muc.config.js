// ============================================================================
// CAU HINH CAC MODULE DANH MUC (khoa, nganh nghe, lop, giao vien, HSSV,
// tai khoan, nhom quyen).
//
// Y TUONG: cac danh muc nay deu lam cung mot viec - them / sua / xem /
// tim kiem / xoa mem. Neu viet 7 controller + 7 route + 14 view giong het
// nhau thi rat dai va de sai. Vi vay o day chi khai bao "danh muc gom
// nhung truong nao", con phan xu ly dung chung mot controller tong quat
// (controllers/admin/danh-muc.controller.js) va hai view dung chung
// (views/admin/pages/danh-muc/index.pug, form.pug).
//
// Moi truong (field) khai bao:
//   name      : ten truong trong schema Mongoose
//   label     : nhan hien thi tren giao dien
//   type      : text | number | textarea | date | select | ref | multiref |
//               password | list
//   required  : bat buoc nhap
//   list      : co hien thi o bang danh sach hay khong
//   options   : danh sach lua chon cho type = select
//   ref       : { model, labelField } cho type = ref / multiref
// ============================================================================

const Khoa = require("../models/khoa.model");
const NganhNghe = require("../models/nganh-nghe.model");
const Lop = require("../models/lop.model");
const GiaoVien = require("../models/giao-vien.model");
const HocSinh = require("../models/hoc-sinh.model");
const Account = require("../models/account.model");
const Role = require("../models/role.model");

const TRANG_THAI = {
  name: "status",
  label: "Trạng thái",
  type: "select",
  list: true,
  options: [
    { value: "active", label: "Đang hoạt động" },
    { value: "inactive", label: "Ngừng hoạt động" }
  ]
};

module.exports = {
  khoa: {
    title: "Khoa / Phòng",
    model: Khoa,
    searchFields: ["code", "name", "truongKhoa"],
    fields: [
      { name: "code", label: "Mã khoa/phòng", type: "text", required: true, list: true },
      { name: "name", label: "Tên khoa/phòng", type: "text", required: true, list: true },
      { name: "truongKhoa", label: "Trưởng khoa/phòng", type: "text", list: true },
      { name: "phone", label: "Điện thoại", type: "text", list: true },
      { name: "description", label: "Mô tả", type: "textarea" },
      TRANG_THAI
    ]
  },

  "nganh-nghe": {
    title: "Ngành / Nghề đào tạo",
    model: NganhNghe,
    searchFields: ["code", "name"],
    fields: [
      { name: "code", label: "Mã ngành/nghề", type: "text", required: true, list: true },
      { name: "name", label: "Tên ngành/nghề", type: "text", required: true, list: true },
      { name: "khoa_id", label: "Thuộc khoa", type: "ref", required: true, list: true, ref: { model: Khoa, labelField: "name" } },
      { name: "trinhDo", label: "Trình độ đào tạo", type: "list", list: true, placeholder: "Cao đẳng, Trung cấp, Sơ cấp" },
      { name: "description", label: "Mô tả", type: "textarea" },
      TRANG_THAI
    ]
  },

  lop: {
    title: "Lớp",
    model: Lop,
    searchFields: ["code", "name", "khoaHoc"],
    fields: [
      { name: "code", label: "Mã lớp", type: "text", required: true, list: true },
      { name: "name", label: "Tên lớp", type: "text", required: true, list: true },
      { name: "nganhNghe_id", label: "Ngành/nghề", type: "ref", required: true, list: true, ref: { model: NganhNghe, labelField: "name" } },
      { name: "gvChuNhiem_id", label: "Giáo viên chủ nhiệm", type: "ref", list: true, ref: { model: GiaoVien, labelField: "fullName" } },
      { name: "khoaHoc", label: "Khóa học", type: "text", list: true, placeholder: "2024-2027" },
      { name: "trinhDo", label: "Trình độ", type: "text", list: true },
      TRANG_THAI
    ]
  },

  "giao-vien": {
    title: "Giáo viên",
    model: GiaoVien,
    searchFields: ["code", "fullName", "email", "chuyenMon"],
    fields: [
      { name: "code", label: "Mã giáo viên", type: "text", required: true, list: true },
      { name: "fullName", label: "Họ và tên", type: "text", required: true, list: true },
      {
        name: "gender", label: "Giới tính", type: "select", list: true,
        options: [{ value: "Nam", label: "Nam" }, { value: "Nu", label: "Nữ" }, { value: "Khac", label: "Khác" }]
      },
      { name: "dob", label: "Ngày sinh", type: "date" },
      { name: "khoa_id", label: "Thuộc khoa", type: "ref", required: true, list: true, ref: { model: Khoa, labelField: "name" } },
      { name: "chuyenMon", label: "Chuyên môn", type: "text", list: true },
      { name: "hocVi", label: "Học vị", type: "text", list: true },
      { name: "email", label: "Email", type: "text" },
      { name: "phone", label: "Điện thoại", type: "text" },
      TRANG_THAI
    ]
  },

  "hoc-sinh": {
    title: "Học sinh - Sinh viên",
    model: HocSinh,
    searchFields: ["code", "fullName", "email", "phone"],
    fields: [
      { name: "code", label: "Mã HSSV", type: "text", required: true, list: true },
      { name: "fullName", label: "Họ và tên", type: "text", required: true, list: true },
      {
        name: "gender", label: "Giới tính", type: "select", list: true,
        options: [{ value: "Nam", label: "Nam" }, { value: "Nu", label: "Nữ" }, { value: "Khac", label: "Khác" }]
      },
      { name: "dob", label: "Ngày sinh", type: "date" },
      { name: "lop_id", label: "Lớp", type: "ref", required: true, list: true, ref: { model: Lop, labelField: "name" } },
      { name: "phone", label: "Điện thoại", type: "text", list: true },
      { name: "email", label: "Email", type: "text" },
      { name: "address", label: "Địa chỉ", type: "textarea" },
      TRANG_THAI
    ]
  },

  "tai-khoan": {
    title: "Tài khoản",
    model: Account,
    searchFields: ["fullName", "email"],
    fields: [
      { name: "fullName", label: "Họ và tên", type: "text", required: true, list: true },
      { name: "email", label: "Email đăng nhập", type: "text", required: true, list: true },
      { name: "password", label: "Mật khẩu", type: "password", hint: "Để trống khi sửa nếu không đổi mật khẩu" },
      { name: "role_id", label: "Nhóm quyền", type: "ref", required: true, list: true, ref: { model: Role, labelField: "title" } },
      { name: "giaoVien_id", label: "Hồ sơ giáo viên", type: "ref", list: true, ref: { model: GiaoVien, labelField: "fullName" } },
      { name: "phone", label: "Điện thoại", type: "text" },
      TRANG_THAI
    ]
  },

  "nhom-quyen": {
    title: "Nhóm quyền",
    model: Role,
    searchFields: ["title", "slug"],
    fields: [
      { name: "title", label: "Tên nhóm quyền", type: "text", required: true, list: true },
      { name: "slug", label: "Mã nhóm (slug)", type: "text", required: true, list: true, placeholder: "quan-tri, khoa, giao-vien" },
      { name: "description", label: "Mô tả", type: "textarea", list: true },
      { name: "permissions", label: "Danh sách mã quyền", type: "list", rows: 6, placeholder: "doanh-nghiep_view, doanh-nghiep_create, phan-cong_edit ..." }
    ]
  }
};
