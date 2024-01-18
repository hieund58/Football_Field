const express = require('express');
const router = express.Router();
const Schedule = require('../../db/schedule'); // Import your MongoDB model

// Route to get schedule by date
router.get('/get-schedule-by-date/:date/:sanId', async (req, res) => {
  const isoDateString = req.params.date;
  const sanId = req.params.sanId; // Lấy giá trị sanId từ truy vấn (query parameter)

  try {
    const date = new Date(isoDateString);

    if (isNaN(date)) {
      throw new Error('Invalid date format');
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Kiểm tra xem lịch cho ngày đã tồn tại hay chưa
    const existingSchedule = await Schedule.findOne({ date: formattedDate, sanId });

    if (!existingSchedule) {
      // Lịch cho ngày hiện tại chưa tồn tại, tạo lịch cố định ban đầu
      const currentDate = new Date();
      const hoursOfDay = [
        '05:00 AM', '06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM',
        '10:00 AM', '11:00 AM', '12:00 AM', '13:00 AM', '14:00 AM',
        '15:00 AM', '16:00 AM','17:00 AM', '18:00 AM', '19:00 AM',
        '20:00 AM', '21:00 AM', '22:00 AM', '23:00 AM',
      ];

      const initialSlots = hoursOfDay.map((hour) => ({
        hour,
        court: '', // Số sân ban đầu
        price: '', // Giá tiền ban đầu
        status: 'available',
      }));

      const initialSchedule = new Schedule({
        date: formattedDate,
        sanId, // Lưu sanId vào lịch
        slots: initialSlots,
      });

      await initialSchedule.save();
      console.log('Tạo lịch cố định ban đầu thành công');
    }

    // Sau khi tạo hoặc kiểm tra, truy vấn lại lịch
    const schedule = await Schedule.findOne({ date: formattedDate, sanId });

    res.json({ schedule });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy lịch sân.' });
  }
});


// Route to update court information
router.put('/update-court/:date', async (req, res) => {
  try {
    const isoDateString = req.params.date;
    const hour = req.body.hour;
    const updatedCourt = req.body.court;
    const sanId = req.body.sanId;

    // Chuyển đổi isoDateString thành định dạng YYYY-MM-DD
    const date = new Date(isoDateString);
    if (isNaN(date)) {
      throw new Error('Invalid date format');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Tìm lịch sân dựa trên date, hour, và sanId
    const schedule = await Schedule.findOne({ date: formattedDate, 'slots.hour': hour, sanId });

    if (schedule) {
      const updatedSlot = schedule.slots.find(slot => slot.hour === hour);
      if (updatedSlot) {
        updatedSlot.court = updatedCourt;
        updatedSlot.sanId = sanId;

        // Lưu cập nhật vào CSDL
        await schedule.save();
        return res.json({ message: 'Cập nhật số sân và sanId thành công' });
      }
    }

    res.status(400).json({ message: 'Không thể cập nhật số sân và sanId cho lịch cố định ban đầu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật số sân và sanId.' });
  }
});

// Route to update price information
router.put('/update-price/:date', async (req, res) => {
  try {
    const isoDateString = req.params.date;
    const hour = req.body.hour;
    const updatedPrice = req.body.price;
    const sanId = req.body.sanId;

    // Chuyển đổi isoDateString thành định dạng YYYY-MM-DD
    const date = new Date(isoDateString);
    if (isNaN(date)) {
      throw new Error('Invalid date format');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Tìm lịch sân dựa trên date, hour, và sanId
    const schedule = await Schedule.findOne({ date: formattedDate, 'slots.hour': hour, sanId });

    if (schedule) {
      const updatedSlot = schedule.slots.find(slot => slot.hour === hour);
      if (updatedSlot) {
        updatedSlot.price = updatedPrice;
        updatedSlot.sanId = sanId;

        // Lưu cập nhật vào CSDL
        await schedule.save();
        return res.json({ message: 'Cập nhật giá tiền và sanId thành công' });
      }
    }

    res.status(400).json({ message: 'Không thể cập nhật giá tiền và sanId cho lịch cố định ban đầu.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật giá tiền và sanId.' });
  }
});

// Route to update court information for a specific date
router.put('/update-court/:date/:sanId/delete', async (req, res) => {
  try {
    const isoDateString = req.params.date;
    const selectTime = req.body.selectTime;
    const sanId = req.params.sanId;

    // Chuyển đổi isoDateString thành định dạng YYYY-MM-DD
    const date = new Date(isoDateString);
    if (isNaN(date)) {
      throw new Error('Invalid date format');
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    // Tìm lịch sân dựa trên date và sanId
    const schedule = await Schedule.findOne({ date: formattedDate, sanId });

    if (schedule) {
      // Tìm slot cần cập nhật
      const slotIndex = schedule.slots.findIndex(slot => slot.hour === selectTime);

      if (slotIndex !== -1 && schedule.slots[slotIndex].court > 0) {
        // Giảm số sân còn trống đi 1
        schedule.slots[slotIndex].court -= 1;

        // Lưu cập nhật vào CSDL
        await schedule.save();
        return res.json({ message: 'Cập nhật số sân thành công' });
      }
    }

    res.status(400).json({ message: 'Không thể cập nhật số sân cho lịch sân.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật số sân.' });
  }
});


module.exports = router;
