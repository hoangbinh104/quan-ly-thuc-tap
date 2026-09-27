const mongoose = require("mongoose");

// Ket noi MongoDB. Tach rieng ra file nay de index.js gon va de test.
module.exports.connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("[DB] Ket noi MongoDB thanh cong");
  } catch (error) {
    console.error("[DB] Ket noi that bai:", error.message);
    process.exit(1);
  }
};
