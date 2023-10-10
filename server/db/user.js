// Trong model User (../api/user.js)
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Tạo schema cho User
const userSchema = new mongoose.Schema({
  email: { type: String, unique: true },
  password: String,
  role: String,
});

// Phương thức để hash mật khẩu
userSchema.methods.hashPassword = async function () {
  // Đảm bảo rằng this.password đã được thiết lập
  if (!this.password) {
    throw new Error('Password is required');
  }

  // Hash mật khẩu và gán giá trị đã băm vào this.password
  this.password = await bcrypt.hash(this.password, 10);
};

// Tạo model User từ schema
const User = mongoose.model('User', userSchema);

module.exports = User;
