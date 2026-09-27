require("dotenv").config();
process.env.MONGO_URL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/quan_ly_thuc_tap";

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const Role = require("../models/role.model");
const Account = require("../models/account.model");
const Khoa = require("../models/khoa.model");
const NganhNghe = require("../models/nganh-nghe.model");
const Lop = require("../models/lop.model");
const GiaoVien = require("../models/giao-vien.model");
const HocSinh = require("../models/hoc-sinh.model");
const DoanhNghiep = require("../models/doanh-nghiep.model");
const DotThucTap = require("../models/dot-thuc-tap.model");
const PhanCong = require("../models/phan-cong.model");
const NhatKy = require("../models/nhat-ky.model");
const DanhGia = require("../models/danh-gia.model");

// ============================================================================
// SCRIPT TAO DU LIEU MAU - chay bang: npm run seed
// Muc dich: co san du lieu sat thuc te de kiem thu, chup anh man hinh va
// trinh dien san pham. Script XOA TOAN BO du lieu cu truoc khi tao lai.
// ============================================================================

const run = async () => {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("Da ket noi CSDL, bat dau tao du lieu mau...");

  await Promise.all([
    Role.deleteMany({}), Account.deleteMany({}), Khoa.deleteMany({}),
    NganhNghe.deleteMany({}), Lop.deleteMany({}), GiaoVien.deleteMany({}),
    HocSinh.deleteMany({}), DoanhNghiep.deleteMany({}), DotThucTap.deleteMany({}),
    PhanCong.deleteMany({}), NhatKy.deleteMany({}), DanhGia.deleteMany({})
  ]);

  // ----- 1. Nhom quyen -------------------------------------------------------
  const MODULES = ["khoa", "nganh-nghe", "lop", "giao-vien", "hoc-sinh", "doanh-nghiep",
    "dot-thuc-tap", "phan-cong", "nhat-ky", "danh-gia", "tai-khoan", "nhom-quyen"];
  const ACTIONS = ["view", "create", "edit", "delete"];
  const ALL_PERMISSIONS = [];
  MODULES.forEach((m) => ACTIONS.forEach((a) => ALL_PERMISSIONS.push(m + "_" + a)));

  const [roleAdmin, roleKhoa, roleGV] = await Role.insertMany([
    {
      title: "Quản trị hệ thống", slug: "quan-tri",
      description: "Toàn quyền trên hệ thống", permissions: ALL_PERMISSIONS
    },
    {
      title: "Cán bộ khoa / phụ trách thực tập", slug: "khoa",
      description: "Quản lý doanh nghiệp, đợt thực tập, danh sách HSSV và phân công giáo viên",
      permissions: ALL_PERMISSIONS.filter((p) => !p.startsWith("tai-khoan") && !p.startsWith("nhom-quyen"))
    },
    {
      title: "Giáo viên hướng dẫn", slug: "giao-vien",
      description: "Xem nhiệm vụ được giao, ghi nhật ký và đánh giá HSSV phụ trách",
      permissions: [
        "hoc-sinh_view", "lop_view", "doanh-nghiep_view", "dot-thuc-tap_view", "phan-cong_view",
        "nhat-ky_view", "nhat-ky_create", "nhat-ky_edit", "nhat-ky_delete",
        "danh-gia_view", "danh-gia_create", "danh-gia_edit"
      ]
    }
  ]);

  // ----- 2. Khoa, nganh nghe -------------------------------------------------
  const [khoaCNTT, khoaCKDL, khoaDien] = await Khoa.insertMany([
    { code: "KT-CNTT", name: "Khoa Kế toán - Công nghệ thông tin", truongKhoa: "Nguyễn Viết Quyền", phone: "02183874282" },
    { code: "CKDL", name: "Khoa Cơ khí động lực", truongKhoa: "Trần Văn Hùng", phone: "02183874283" },
    { code: "DDT", name: "Khoa Điện - Điện tử", truongKhoa: "Phạm Thị Lan", phone: "02183874284" }
  ]);

  const [ngheQTM, ngheTHVP, ngheOTO, ngheDCN] = await NganhNghe.insertMany([
    { code: "QTM", name: "Quản trị mạng máy tính", khoa_id: khoaCNTT._id, trinhDo: ["Cao đẳng", "Trung cấp"] },
    { code: "THVP", name: "Tin học văn phòng", khoa_id: khoaCNTT._id, trinhDo: ["Cao đẳng", "Trung cấp", "Sơ cấp"] },
    { code: "CNOT", name: "Công nghệ ô tô", khoa_id: khoaCKDL._id, trinhDo: ["Cao đẳng", "Trung cấp"] },
    { code: "DCN", name: "Điện công nghiệp", khoa_id: khoaDien._id, trinhDo: ["Cao đẳng", "Trung cấp", "Sơ cấp"] }
  ]);

  // ----- 3. Giao vien --------------------------------------------------------
  const giaoViens = await GiaoVien.insertMany([
    { code: "GV001", fullName: "Hoàng Văn Bình", gender: "Nam", khoa_id: khoaCNTT._id, chuyenMon: "Công nghệ phần mềm", hocVi: "Kỹ sư", email: "gv001@tybac.edu.vn", phone: "0383385868" },
    { code: "GV002", fullName: "Nguyễn Viết Quyền", gender: "Nam", khoa_id: khoaCNTT._id, chuyenMon: "Mạng máy tính", hocVi: "Thạc sĩ", email: "gv002@tybac.edu.vn", phone: "0989965786" },
    { code: "GV003", fullName: "Lê Thị Hường", gender: "Nu", khoa_id: khoaCNTT._id, chuyenMon: "Tin học văn phòng", hocVi: "Cử nhân", email: "gv003@tybac.edu.vn" },
    { code: "GV004", fullName: "Trần Văn Hùng", gender: "Nam", khoa_id: khoaCKDL._id, chuyenMon: "Công nghệ ô tô", hocVi: "Thạc sĩ", email: "gv004@tybac.edu.vn" },
    { code: "GV005", fullName: "Phạm Thị Lan", gender: "Nu", khoa_id: khoaDien._id, chuyenMon: "Điện công nghiệp", hocVi: "Thạc sĩ", email: "gv005@tybac.edu.vn" }
  ]);

  // ----- 4. Lop --------------------------------------------------------------
  const [lopQTM, lopTHVP, lopOTO, lopDCN] = await Lop.insertMany([
    { code: "QTM24A", name: "Quản trị mạng 24A", nganhNghe_id: ngheQTM._id, gvChuNhiem_id: giaoViens[1]._id, khoaHoc: "2024-2027", trinhDo: "Cao đẳng" },
    { code: "THVP24A", name: "Tin học văn phòng 24A", nganhNghe_id: ngheTHVP._id, gvChuNhiem_id: giaoViens[2]._id, khoaHoc: "2024-2027", trinhDo: "Cao đẳng" },
    { code: "OTO24B", name: "Công nghệ ô tô 24B", nganhNghe_id: ngheOTO._id, gvChuNhiem_id: giaoViens[3]._id, khoaHoc: "2024-2027", trinhDo: "Cao đẳng" },
    { code: "DCN25A", name: "Điện công nghiệp 25A", nganhNghe_id: ngheDCN._id, gvChuNhiem_id: giaoViens[4]._id, khoaHoc: "2025-2028", trinhDo: "Trung cấp" }
  ]);

  // ----- 5. Hoc sinh - sinh vien ---------------------------------------------
  const HO = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Đinh", "Bùi", "Vũ"];
  const DEM = ["Văn", "Thị", "Đức", "Minh", "Quang", "Thu", "Hữu", "Ngọc"];
  const TEN = ["An", "Bình", "Cường", "Dũng", "Giang", "Hà", "Khánh", "Linh", "Mai", "Nam", "Phúc", "Quân",
    "Sơn", "Thảo", "Trang", "Tuấn", "Vân", "Việt", "Yến", "Long", "Hải", "Hòa", "Ngân", "Kiên"];

  const lops = [lopQTM, lopTHVP, lopOTO, lopDCN];
  const dsHocSinh = TEN.map((ten, i) => {
    const lop = lops[Math.floor(i / 6)];
    return {
      code: lop.code + String((i % 6) + 1).padStart(2, "0"),
      fullName: `${HO[i % HO.length]} ${DEM[i % DEM.length]} ${ten}`,
      gender: i % 3 === 1 ? "Nu" : "Nam",
      dob: new Date(2006, i % 12, (i % 27) + 1),
      lop_id: lop._id,
      phone: "09" + String(10000000 + i * 137).slice(0, 8),
      email: `hs${i + 1}@tybac.edu.vn`,
      address: "Xã Lạc Thủy, tỉnh Phú Thọ"
    };
  });
  const hocSinhs = await HocSinh.insertMany(dsHocSinh);

  // ----- 6. Doanh nghiep -----------------------------------------------------
  const doanhNghieps = await DoanhNghiep.insertMany([
    { code: "DN001", name: "Công ty TNHH Công nghệ ABC", taxCode: "2600123456", linhVuc: "Phần mềm, hạ tầng mạng", soLuongTiepNhan: 10, nguoiDaiDien: "Trần Văn An", chucVuNguoiDaiDien: "Giám đốc", address: "KCN Thụy Vân, Phú Thọ", phone: "02103888999", email: "hr@abc.com.vn" },
    { code: "DN002", name: "Công ty CP Điện tử XYZ", taxCode: "2600987654", linhVuc: "Lắp ráp điện tử", soLuongTiepNhan: 8, nguoiDaiDien: "Lê Thị Bình", chucVuNguoiDaiDien: "Trưởng phòng nhân sự", address: "KCN Đồng Văn, Hà Nam", phone: "02263888777" },
    { code: "DN003", name: "Gara ô tô Trường Thành", linhVuc: "Sửa chữa, bảo dưỡng ô tô", soLuongTiepNhan: 6, nguoiDaiDien: "Phạm Quang Trường", address: "Xã Lạc Thủy, Phú Thọ", phone: "0912345678" },
    { code: "DN004", name: "Công ty TNHH Cơ điện Hòa Phát Việt", linhVuc: "Cơ điện công nghiệp", soLuongTiepNhan: 12, nguoiDaiDien: "Đinh Văn Hòa", address: "KCN Lương Sơn, Phú Thọ" },
    { code: "DN005", name: "Trung tâm Tin học Sao Mai", linhVuc: "Đào tạo, dịch vụ tin học", soLuongTiepNhan: 5, nguoiDaiDien: "Bùi Thị Mai", address: "TP Việt Trì, Phú Thọ", status: "inactive" }
  ]);

  // ----- 7. Dot thuc tap -----------------------------------------------------
  const dot1 = await DotThucTap.create({
    code: "TTSX-2026-1",
    name: "Thực tập sản xuất đợt 1 - năm học 2026-2027",
    namHoc: "2026-2027", hocKy: "1",
    quyetDinhSo: "125/QĐ-CĐCĐTB", ngayQuyetDinh: new Date("2026-08-05"),
    startDate: new Date("2026-08-10"), endDate: new Date("2026-09-27"),
    lop_ids: [lopQTM._id, lopTHVP._id],
    moTa: "Đợt thực tập sản xuất dành cho HSSV khối Công nghệ thông tin.",
    status: "open"
  });

  await DotThucTap.create({
    code: "TTSX-2025-2",
    name: "Thực tập sản xuất đợt 2 - năm học 2025-2026",
    namHoc: "2025-2026", hocKy: "2",
    quyetDinhSo: "87/QĐ-CĐCĐTB", ngayQuyetDinh: new Date("2026-02-10"),
    startDate: new Date("2026-03-02"), endDate: new Date("2026-04-17"),
    lop_ids: [lopOTO._id, lopDCN._id],
    moTa: "Đợt thực tập đã kết thúc, dùng để tra cứu lịch sử.",
    status: "closed"
  });

  // ----- 8. Phan cong (nghiep vu trong tam) ----------------------------------
  const hssvCuaDot = hocSinhs.filter((hs) =>
    String(hs.lop_id) === String(lopQTM._id) || String(hs.lop_id) === String(lopTHVP._id)
  ).slice(0, 10);

  const phanCongs = await PhanCong.insertMany(
    hssvCuaDot.map((hs, i) => ({
      dotThucTap_id: dot1._id,
      hocSinh_id: hs._id,
      doanhNghiep_id: doanhNghieps[i % 2]._id,
      giaoVien_id: giaoViens[i % 2]._id,
      viTriThucTap: i % 2 === 0 ? "Kỹ thuật viên hỗ trợ hạ tầng mạng" : "Nhân viên văn phòng - xử lý dữ liệu",
      canBoHuongDanDN: i % 2 === 0 ? "Trần Văn An" : "Lê Thị Bình",
      sdtCanBoDN: i % 2 === 0 ? "02103888999" : "02263888777",
      ngayBatDau: new Date("2026-08-10"),
      ngayKetThuc: new Date("2026-09-27"),
      trangThai: "dang-thuc-tap"
    }))
  );

  // ----- 9. Nhat ky huong dan ------------------------------------------------
  const noiDungTuan = [
    {
      noiDungCongViec: "Bàn giao HSSV cho doanh nghiệp, phổ biến nội quy, an toàn lao động và kế hoạch thực tập.",
      tinhHinhHSSV: "HSSV có mặt đầy đủ, chấp hành nội quy của doanh nghiệp.",
      vanDePhatSinh: "Một số HSSV chưa quen giờ giấc làm việc theo ca.",
      deXuat: "Nhắc nhở HSSV chủ động sắp xếp thời gian, đi làm đúng giờ."
    },
    {
      noiDungCongViec: "Theo dõi HSSV thực hiện công việc được doanh nghiệp giao; trao đổi với cán bộ hướng dẫn tại đơn vị.",
      tinhHinhHSSV: "HSSV bước đầu làm quen với quy trình, thái độ tích cực.",
      vanDePhatSinh: "Kỹ năng thực hành của một vài HSSV còn hạn chế.",
      deXuat: "Đề nghị doanh nghiệp bố trí kèm cặp thêm trong tuần tiếp theo."
    },
    {
      noiDungCongViec: "Kiểm tra tiến độ, hướng dẫn HSSV ghi chép nhật ký cá nhân và chuẩn bị báo cáo thực tập.",
      tinhHinhHSSV: "HSSV hoàn thành công việc được giao, không vi phạm kỷ luật.",
      vanDePhatSinh: "Không có.",
      deXuat: "Tiếp tục duy trì, chuẩn bị nội dung báo cáo kết thúc đợt."
    }
  ];

  const nhatKys = [];
  phanCongs.slice(0, 4).forEach((pc) => {
    noiDungTuan.forEach((nd, t) => {
      nhatKys.push({
        phanCong_id: pc._id,
        tuan: t + 1,
        tuNgay: new Date(2026, 7, 10 + t * 7),
        denNgay: new Date(2026, 7, 16 + t * 7),
        noiDungCongViec: nd.noiDungCongViec,
        tinhHinhHSSV: nd.tinhHinhHSSV,
        vanDePhatSinh: nd.vanDePhatSinh,
        deXuat: nd.deXuat
      });
    });
  });
  await NhatKy.insertMany(nhatKys);

  // ----- 10. Ket qua danh gia ------------------------------------------------
  const diemMau = [
    { dn: 9, gv: 8.5, bc: 9 },
    { dn: 8, gv: 8, bc: 7.5 },
    { dn: 7, gv: 6.5, bc: 7 }
  ];

  await DanhGia.insertMany(
    phanCongs.slice(0, 3).map((pc, i) => {
      const d = diemMau[i];
      const tongKet = Math.round((d.dn * 0.4 + d.gv * 0.4 + d.bc * 0.2) * 10) / 10;
      return {
        phanCong_id: pc._id,
        diemDoanhNghiep: d.dn,
        diemGiaoVien: d.gv,
        diemBaoCao: d.bc,
        diemTongKet: tongKet,
        xepLoai: tongKet >= 9 ? "Xuat sac" : tongKet >= 8 ? "Gioi" : tongKet >= 6.5 ? "Kha" : "Trung binh",
        nhanXetDoanhNghiep: "Chấp hành tốt nội quy, tiếp thu nhanh, hoàn thành công việc được giao.",
        nhanXetGiaoVien: "HSSV nghiêm túc, chủ động liên hệ giáo viên khi có vướng mắc.",
        ngayDanhGia: new Date("2026-09-25")
      };
    })
  );

  await PhanCong.updateMany(
    { _id: { $in: phanCongs.slice(0, 3).map((pc) => pc._id) } },
    { trangThai: "hoan-thanh" }
  );

  // ----- 11. Tai khoan dang nhap ---------------------------------------------
  const hash = await bcrypt.hash("123456", 10);
  await Account.insertMany([
    { fullName: "Quản trị hệ thống", email: "admin@tybac.edu.vn", password: hash, role_id: roleAdmin._id, phone: "0383385868" },
    { fullName: "Cán bộ phụ trách thực tập", email: "khoa@tybac.edu.vn", password: hash, role_id: roleKhoa._id },
    { fullName: "Hoàng Văn Bình", email: "gv001@tybac.edu.vn", password: hash, role_id: roleGV._id, giaoVien_id: giaoViens[0]._id },
    { fullName: "Nguyễn Viết Quyền", email: "gv002@tybac.edu.vn", password: hash, role_id: roleGV._id, giaoVien_id: giaoViens[1]._id }
  ]);

  console.log("=========================================================");
  console.log("Tao du lieu mau thanh cong!");
  console.log("  Quan tri     : admin@tybac.edu.vn  / 123456");
  console.log("  Can bo khoa  : khoa@tybac.edu.vn   / 123456");
  console.log("  Giao vien    : gv001@tybac.edu.vn  / 123456");
  console.log("=========================================================");

  await mongoose.disconnect();
};

run().catch((error) => {
  console.error("Loi khi tao du lieu mau:", error);
  process.exit(1);
});
