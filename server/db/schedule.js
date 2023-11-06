const mongoose = require('mongoose');
const moment = require('moment-timezone'); 
const scheduleSchema = new mongoose.Schema({
  date: String,
  sanId: String, 
  // Hoặc kiểu dữ liệu phù hợp với `sanId` của bạn
  slots: [{
    hour: String,
    status: String,
    court: Number,
    price: Number, // Thêm trường giá tiền
  }],
});

const Schedule = mongoose.model('Schedule', scheduleSchema);

Schedule.createInitialSchedule = async () => {
  try {
    const hoursOfDay = [
      '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
      '10:00 AM', '11:00 AM', '12:00 AM', '13:00 AM', '14:00 AM',
      '15:00 AM', '16:00 AM', '17:00 AM', '18:00 AM', '19:00 AM',
      '20:00 AM', '21:00 AM', '22:00 AM', '23:00 AM',
    ];

    const currentDate = moment(); // Sử dụng moment() để tạo ngày giờ hiện tại
    const formattedDate = currentDate.format(); // Lấy ngày giờ theo định dạng ISO

    const existingSchedule = await Schedule.findOne({ date: formattedDate });

    if (!existingSchedule) {
      const initialSlots = hoursOfDay.map((hour) => ({
        hour,
        status: 'available',
        court: '', // Số sân ban đầu
        price: '', // Giá tiền ban đầuz
      }));

      const initialSchedule = new Schedule({
        date: formattedDate, // Lưu trữ ngày giờ dưới định dạng ISO
        sanId,
        slots: initialSlots,
      });

      await initialSchedule.save();
      console.log('Tạo lịch cố định ban đầu thành công');
    } else {
      console.log('Lịch cho ngày hiện tại đã tồn tại.');
    }
  } catch (error) {
    console.error('Lỗi khi tạo lịch cố định: ' + error);
  }
};

// Định nghĩa hàm để cập nhật thông tin của một giờ trên lịch sân
Schedule.updateSlotInfo = async (date, hour, court, price, status,sanId) => {
  try {
    const existingSchedule = await Schedule.findOne({ date,sanId });

    if (existingSchedule) {
      const slotIndex = existingSchedule.slots.findIndex((slot) => slot.hour === hour);

      if (slotIndex !== -1) {
        existingSchedule.slots[slotIndex].court = court;
        existingSchedule.slots[slotIndex].price = price;
        existingSchedule.slots[slotIndex].status = status;

        await existingSchedule.save();
        console.log('Cập nhật thông tin lịch sân thành công');
      } else {
        console.log('Không tìm thấy giờ trên lịch sân.');
      }
    } else {
      console.log('Không tìm thấy lịch cho ngày đã cho.');
    }
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin lịch sân: ' + error);
  }
};

module.exports = Schedule;
