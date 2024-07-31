const mongoose = require("mongoose");
const timeZone = require('mongoose-timezone');

const scheduleSchema = new mongoose.Schema({
  date: Date,
  fieldId: String,
  // Hoặc kiểu dữ liệu phù hợp với `fieldId` của bạn
  slots: [
    {
      hour: String,
      status: String,
      court: Number,
      price: Number, // Thêm trường giá tiền
    },
  ],
});

scheduleSchema.plugin(timeZone);

const Schedule = mongoose.model("Schedule", scheduleSchema);

Schedule.createInitialSchedule = async (fieldId, date) => {
  try {
    const hoursOfDay = [
      "5:00",
      "6:00",
      "7:00",
      "8:00",
      "9:00",
      "10:00",
      "11:00",
      "12:00",
      "13:00",
      "14:00",
      "15:00",
      "16:00",
      "17:00",
      "18:00",
      "19:00",
      "20:00",
      "21:00",
      "22:00",
      "23:00",
    ];

    const existingSchedule = await Schedule.findOne({ fieldId: fieldId, date: date });

    if (!existingSchedule) {
      const initialSlots = hoursOfDay.map((hour) => ({
        hour,
        status: "available",
        court: "", // Số sân ban đầu
        price: "", // Giá tiền ban đầuz
      }));

      const initialSchedule = new Schedule({
        date: formattedDate, // Lưu trữ ngày giờ dưới định dạng ISO
        fieldId,
        slots: initialSlots,
      });

      await initialSchedule.save();
      console.log("Tạo lịch cố định ban đầu thành công");
    } else {
      console.log("Lịch cho ngày hiện tại đã tồn tại.");
    }
  } catch (error) {
    console.error("Lỗi khi tạo lịch cố định: " + error);
  }
};

// Định nghĩa hàm để cập nhật thông tin của một giờ trên lịch sân
Schedule.updateSlotInfo = async (fieldId, date, hour, status, court, price) => {
  try {
    const existingSchedule = await Schedule.findOne({ date, fieldId });

    if (existingSchedule) {
      const slotIndex = existingSchedule.slots.findIndex(
        (slot) => slot.hour === hour
      );

      if (slotIndex !== -1) {
        existingSchedule.slots[slotIndex].court = court;
        existingSchedule.slots[slotIndex].price = price;
        existingSchedule.slots[slotIndex].status = status;

        await existingSchedule.save();
        console.log("Cập nhật thông tin lịch sân thành công");
      } else {
        console.log("Không tìm thấy giờ trên lịch sân.");
      }
    } else {
      console.log("Không tìm thấy lịch cho ngày đã cho.");
    }
  } catch (error) {
    console.error("Lỗi khi cập nhật thông tin lịch sân: " + error);
  }
};

module.exports = Schedule;
