const express = require("express");
const router = express.Router();
const User = require("../../db/user");
// Route để lấy tất cả người dùng, quản lí
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Lấy tất cả người dùng từ cơ sở dữ liệu
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để thêm người dùng,quản lí
router.post("/", async (req, res) => {
  try {
    // Extract user data from the request body
    const { fullName, phone, email, role } = req.body;

    // Validate the required fields (you can add more validation as needed)

    // Create a new user instance
    const newUser = new User({
      fullName,
      phone,
      email,
      role,
      password: '123456'
    });

    await newUser.hashPassword();
    await newUser.save();

    // Send a success response
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    // Extract user data from the request body
    const id = req.params.id;
    const { fullName, phone, role } = req.body;

    // Validate the required fields (you can add more validation as needed)

    // Create a new user instance
    const user = await User.findById(id);
    user.fullName = fullName;
    user.phone = phone;
    user.role = role;

    // Save the new user to the database
    await user.save();

    // Send a success response
    res.status(201).json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/reset-password/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    user.password = '123456'

    await user.hashPassword();
    await user.save();

    res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route để xóa người dùng theo userId
router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID and remove it
    const deletedUser = await User.findByIdAndRemove(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Send a success response
    res.json({ message: "User deleted successfully", user: deletedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;
