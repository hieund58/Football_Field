<template>
  <div class="wrapper bg-slate-100">
    <div class="top-buttons">
      <h2>Lịch đặt sân</h2>
      <div class="top-buttons__week-nav">
        <n-icon
          v-if="showPrevWeekArrow"
          class="top-buttons__week-nav-arrow pl-[5px] pr-[10px] mr-[10px] text-center"
          @click="changeWeek('prev')"
        >
          <ChevronBackOutline />
        </n-icon>
        <div
          :class="`${showPrevWeekArrow && !showNextWeekArrow ? 'mr-[10px]' : !showPrevWeekArrow && showNextWeekArrow ? 'ml-[10px]' : ''}`"
        >
          Từ ngày {{ formatDateVn(startDate) }} đến ngày {{ formatDateVn(endDate) }}
        </div>
        <n-icon
          v-if="showNextWeekArrow"
          class="top-buttons__week-nav-arrow pl-[8px] pr-[5px] mr-[13px]"
          @click="changeWeek('next')"
        >
          <ChevronForwardOutline />
        </n-icon>
      </div>
      <div class="top-buttons__right-buttons">
        <div
          :class="`top-buttons__right-button mr-2 ${dayPeriod === 'morning' ? 'top-buttons__right-button--active' : ''}`"
          @click="toggleDayPeriod('morning')"
        >
          Khung sáng
        </div>
        <div
          :class="`top-buttons__right-button ${dayPeriod === 'afternoon' ? 'top-buttons__right-button--active' : ''}`"
          @click="toggleDayPeriod('afternoon')"
        >
          Khung chiều
        </div>
      </div>
    </div>

    <div class="time-slot">
      <div v-for="schedule in filteredSchedules" class="flex flex-row items-center">
        <div :class="`time-slot__weekday ${isToday(schedule.date) ? 'time-slot__weekday--active' : ''}`">
          <div>{{ getWeekDay(schedule.date) }}</div>
          <div>{{ getMonthDay(schedule.date) }}</div>
        </div>
        <div
          v-for="slot in schedule.slots"
          :class="`hover:cursor-pointer ${slotDisabled(schedule.date, slot.hour) ? 'time-slot--disabled' : slot.status === 'available' ? 'time-slot--available' : 'time-slot--booked'}`"
          @click="
            slotDisabled(schedule.date, slot.hour) ? () => {} : openModalPayment(schedule.date, slot)
          "
        >
          <div>{{ slot.name }}</div>
          <div>
            {{
              `${slotDisabled(schedule.date, slot.hour) ? 'Quá hạn' : slot.status === 'available' ? 'Còn trống' : 'Đã đặt'}`
            }}
          </div>
        </div>
      </div>
    </div>
    <BookingPaymentModal
      v-model:show="showModalPayment"
      :data="paymentData"
      @cancel-success="onCancelSuccess"
      @close="showModalPayment = false"
    />
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, onMounted } from 'vue';
import { DateTime } from 'luxon';
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5';
import { useLoadingBar, useMessage } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';

import { formatDateVn, formatQueryDate, getWeekDay, getMonthDay, isToday } from '@/utils/common';

import BookingPaymentModal from './BookingPaymentModal.vue';

const props = defineProps({
  fieldData: Object
});

const loadingBar = useLoadingBar();
const message = useMessage();
const route = useRoute();
const router = useRouter();

const dayPeriod = ref('morning'); // morning or afternoon
const startDate = ref(DateTime.now());
const endDate = computed(() => startDate.value?.plus({ weeks: 1 }));

const schedulesFromApi = ref([]);

const showModalPayment = ref(false);
const paymentData = ref({});

const showPrevWeekArrow = computed(() => !isToday(startDate.value));
const showNextWeekArrow = computed(() => endDate.value.diffNow('weeks').get('week') < 2);

const changeWeek = type => {
  if (type === 'prev') startDate.value = startDate.value.minus({ weeks: 1 });
  else startDate.value = startDate.value.plus({ weeks: 1 });
  fetchSchedules();
};

const toggleDayPeriod = period => {
  dayPeriod.value = period;
};

const createTimeSlots = () => {
  const arr = [];
  for (let i = 5; i <= 23; i++) {
    arr.push({
      hour: `${i}:00`,
      name: `${i}:00 - ${i + 1}:00`,
      isMorning: i <= 12,
      status: 'available',
      bookedBy: ''
    });
  }
  return arr;
};

const createSchedules = startDate => {
  const arr = [];
  for (let i = 0; i < 7; i++) {
    arr.push({
      fieldId: '1',
      date: startDate.plus({ days: i }).toFormat('yyyy-MM-dd'),
      slots: createTimeSlots()
    });
  }
  return arr;
};

const slotDisabled = (scheduleDate, slotHour) => {
  if (!isToday(scheduleDate)) return false;
  return (
    DateTime.fromObject({ hour: slotHour.split(':')[0] })
      .diffNow('hour')
      .get('hour') <= 0
  );
};

const filteredSchedules = computed(() => {
  const schedules = createSchedules(startDate.value);
  schedules.forEach(schedule => {
    schedule.slots = schedule.slots.filter(
      slot => (dayPeriod.value === 'morning' && slot.isMorning) || (dayPeriod.value === 'afternoon' && !slot.isMorning)
    );
    if (!schedulesFromApi.value?.length) return;
    schedulesFromApi.value?.forEach(scheduleFromApi => {
      if (formatQueryDate(scheduleFromApi?.date) === schedule.date) {
        console.log(scheduleFromApi);
        const bookedSlots = [];
        scheduleFromApi.slots.forEach(slotFromApi => {
          if (slotFromApi.status === 'booked') {
            // schedule.slots[slotIndex].status = 'booked';
            bookedSlots.push({
              hour: slotFromApi.hour,
              bookedBy: slotFromApi.bookedBy
            });
          }
        });
        schedule.slots.forEach(slot => {
          bookedSlots.forEach(booked => {
            if (booked.hour === slot.hour) {
              slot.status = 'booked';
              slot.bookedBy = booked.bookedBy
            }
          })
          // if (bookedSlots.includes(slot.hour)) slot.status = 'booked';
        });
      }
    });
  });
  return schedules;
});

const openModalPayment = (scheduleDate, slot) => {
  paymentData.value = {
    fieldId: props.fieldData?.id,
    fieldPrice: props.fieldData?.price,
    scheduleDate,
    slot
  };
  showModalPayment.value = true;
};

const onCancelSuccess = async () => {
  showModalPayment.value = false;
  loadingBar.start();
  await fetchSchedules();
  loadingBar.finish();
};

const fetchSchedules = async () => {
  const params = {
    fieldId: props.fieldData?.id,
    dateFrom: formatQueryDate(startDate.value),
    dateTo: formatQueryDate(endDate.value)
  };
  try {
    const res = await axios.get(`http://localhost:5000/api/schedule/get-schedules-by-field/`, { params });
    schedulesFromApi.value = res.data;
  } catch (error) {
    message.error(error?.response?.data?.message || 'Tìm lịch sân thất bại');
  }
};

const executePayment = async () => {
  if (!route.query.token || !route.query.PayerID) {// paypal trả về token(id của giao dịch), PayerID(id của người trả tiền)
    router.replace({ query: {} });//nếu không thanh toán mà back về thì xóa token giao địch đi
    return;
  }
  const paymentId = route.query.token;
  try {
    const res = await axios.post('http://localhost:5000/api/paypal/execute', { paymentId });
    console.log('🚀 ~ excutePayment ~ res:', res);
    message.success('Đặt sân thành công');
    router.replace({ query: {} });
  } catch (error) {
    console.log('🚀 ~ excutePayment ~ error:', error);
    router.replace({ query: {} });
  }
};

onMounted(async () => {
  loadingBar.start();
  await executePayment();
  await fetchSchedules();
  loadingBar.finish();
});
</script>

<style lang="scss" scoped>
.wrapper {
  border-radius: 10px;
  text-align: center;
  padding: 10px 20px !important;
}

.top-buttons {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  h2 {
    font-size: 20px;
    font-weight: 600;
  }

  &__week-nav {
    border-radius: 5px;
    background-color: #fafbfc;
    border: 1px solid #b7cdff;
    font-size: 16px;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px;
  }

  &__week-nav-arrow:hover {
    cursor: pointer;
  }

  &__right-buttons {
    right: 0;
    display: flex;
    flex-direction: row;
  }

  &__right-button {
    border: 1px solid #2563eb;
    border-radius: 5px;
    padding: 5px;
  }

  &__right-button:hover {
    cursor: pointer;
  }

  &__right-button--active {
    background-color: #2563eb;
    color: #fff;
  }
}

.time-slot {
  margin: 5px;
  width: 100%;
  overflow-x: scroll;
  scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    background-color: darkgrey;
  }
  ::-webkit-scrollbar-thumb {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }

  &__weekday {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-direction: column;
    padding: 10px;
    color: #959595;
    border: 1px solid;
    border-radius: 5px;
    margin-right: 5px;
    min-width: 60px;
  }

  &__weekday--active {
    background: #2563eb;
    color: #fff;
  }

  &--disabled {
    background-color: #f3f3f3;
    border: 1px solid #8f8181;
    color: #8b8b8b;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    min-width: 120px;
  }

  &--available {
    background: #dbe6fe;
    border: 1px solid #93b4fd;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    min-width: 120px;
  }

  &--booked {
    background: rgb(255, 79, 79);
    border: 1px solid #93b4fd;
    margin: 5px;
    padding: 10px;
    border-radius: 5px;
    min-width: 120px;
  }
}
</style>
