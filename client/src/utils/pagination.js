import { reactive, h } from 'vue';

export const getPagination = (pPageSize, pPageSizes) => {
  const pageSize = !!pPageSize ? pPageSize : 10;
  const pageSizes = !!pPageSizes
    ? pPageSizes
    : [
        {
          label: '10 / trang',
          value: 10
        },
        {
          label: '20 / trang',
          value: 20
        },
        {
          label: '30 / trang',
          value: 30
        }
      ];
  const pagination = reactive({
    page: 1,
    pageSize: pageSize,
    showSizePicker: true,
    pageSizes: pageSizes,
    onChange: page => {
      pagination.page = page;
    },
    onUpdatePageSize: pageSize => {
      pagination.pageSize = pageSize;
      pagination.page = 1;
    },
    prefix: paginationInfo => {
      return h('div', null, [`Tổng: ${paginationInfo.itemCount}`]);
    }
  });
  return pagination;
};
