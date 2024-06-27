<template>
  <q-page class="q-py-sm q-px-md">
    <section class="q-mb-sm">
      <q-card class="my-card">
        <q-card-section @click="showFilter = !showFilter" class="bg-primary text-white q-py-sm" style="cursor:pointer">
          <div class="flex justify-between items-center">
            <div class="text-md text-weight-bold">Фильтр</div>
            <q-space/>
            <button v-ripple class="filterBtn">
              <q-icon color="dark" :name="showFilter ? 'expand_less' : 'expand_more'" />
            </button>
          </div>
        </q-card-section>

        <q-separator />
        <q-slide-transition>
          <q-card-section v-if="showFilter">
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col">
                <q-input
                  v-model="period1"
                  filled
                  type="date"
                  hint="Начало периода"
                  :min="periodMin"
                  :max="periodMax"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="period2"
                  filled
                  type="date"
                  hint="Конец периода"
                  :min="periodMin"
                  :max="periodMax"
                />
              </div>
              <div class="col">
                <q-select
                  filled
                  v-model="group"
                  :options="groupOptions"
                  label="Группа"
                />
              </div>
              <div class="col">
                <q-select
                  filled
                  v-model="tool"
                  :options="toolOptions"
                  label="Тип инструмента"
                />
              </div>

              <div class="col">
                <q-select
                  filled
                  v-model="negativeOnly"
                  :options="negativeOnlyOptions"
                  label="Остаток"
                />
              </div>
            </div>
            <div class="flex q-gutter-md">
              <q-btn label="Применить" color="secondary" @click="fetchData()" />
              <q-btn
                v-if="showResetBtn"
                label="Сбросить"
                color="negative"
                @click="reset"
              />
            </div>
          </q-card-section>
        </q-slide-transition>
      </q-card>
    </section>

    <div class="t-container">
      <TTable
        v-if="tableData"
        v-bind="{
          tableData,
          days,
          columns,
          firstCol,
        }"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, provide, ref } from 'vue';
import { TableData_Path } from 'src/env';
import TTable from 'src/components/TTable.vue';

const firstCol = {
  label: 'Продукция',
};

const columns = [
  {
    label: 'Ост. утро',
    field: (row) => row.balance_morning,
  },
  {
    label: 'Отгрузка (план)',
    field: (row) => row.shipment_plan,
  },
  {
    label: 'Отгрузка (факт)',
    field: (row) => row.shipment_fact,
  },
  {
    label: 'Актуализация (план)',
    field: (row) => row.a11n_plan,
  },
  {
    label: 'Актуализация (факт)',
    field: (row) => row.a11n_fact,
  },
  {
    label: 'Произв. день (план)',
    field: (row) => row.prod_day_plan,
  },
  {
    label: 'Произв. день (факт)',
    field: (row) => row.prod_day_fact,
  },
  {
    label: 'Ост. вечер',
    field: (row) => row.balance_evening,
  },
  {
    label: 'Произв. ночь (план)',
    field: (row) => row.prod_night_plan,
  },
  {
    label: 'Произв. ночь (факт)',
    field: (row) => row.prod_night_fact,
  },
];

export default defineComponent({
  name: 'PageIndex',
  data() {
    return {
      firstCol,
      days: [],
      tableData: null,
      period1: null,
      period2: null,
      group: null,
      tool: null,
      negativeOnly: null,
    };
  },
  setup() {
    const cols = ref(columns);
    const invisibleDays = ref({});

    const onCollapse = (day) => {
      if (invisibleDays.value[day]) {
        delete invisibleDays.value[day];
      } else {
        invisibleDays.value[day] = true;
      }
    };

    const invisibleDaysUpdate = (data) => {
      invisibleDays.value = data;
    };

    provide('invisibleDays', invisibleDays);
    provide('onCollapse', onCollapse);
    provide('columns', cols);

    return {
      columns: cols,
      invisibleDaysUpdate,
      showFilter: ref(false)
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async fetchData(filter = {}) {
      try {
        this.$q.loading.show();

        if (this.period1) filter.period_start = this.period1;
        if (this.period2) filter.period_end = this.period2;
        if (this.group) filter.group = this.group.value;
        if (this.tool) filter.tool_type = this.tool.value;
        if (this.negativeOnly && this.negativeOnly.value)
          filter.negative_stock_only = this.negativeOnly.value;

        // const isProd = process.env.NODE_ENV === 'production';
        const url = new URL(
          TableData_Path,
          window.location.origin
        );
        url.search = new URLSearchParams(filter).toString();

        const res = await fetch(url, {
          headers: {
            accept: 'application/json',
          },
        });
        const { data } = await res.json();

        if (!this.tableData) {
          this.group = this.groupOptions[0] || null;
          this.tool = this.toolOptions[0] || null;
          this.negativeOnly = this.negativeOnlyOptions[0] || null;
        }
        this.period1 = data.filters.period_start;
        this.period2 = data.filters.period_end;

        this.tableData = data;
        const lastDay = data.extrudate_groups?.[0]?.extrudates?.[0]?.end_of_month.day || ''
        this.days = [ ...data.period ];
        if(this.$serverData.withLastCol) {
          this.days.push(lastDay);
        }
        this.invisibleDaysUpdate(
          this.days.reduce((acc, per) => {
            acc[per] = true;
            return acc;
          }, {})
        );
      } catch (e) {
        console.error(e);
        this.$q.notify({
          type: 'negative',
          message: 'Произошла ошибка при загрузке данных',
        });
      } finally {
        this.$q.loading.hide();
      }
    },
    reset() {
      this.period1 = this.period2 = null;
      this.group = this.groupOptions[0] || null;
      this.tool = this.toolOptions[0] || null;
      this.negativeOnly = this.negativeOnlyOptions[0] || null;
      this.fetchData();
    },
    getOptions(key, cb) {
      if (!this.tableData) return [];
      return this.tableData.filter_ranges?.[key]?.map(cb);
    },
  },
  computed: {
    showResetBtn() {
      const res =
        this.group ||
        this.tool ||
        this.period1 ||
        this.period2 ||
        (this.negativeOnly && this.negativeOnly.value);

      return res ? true : false;
    },
    periodMax() {
      return this.tableData?.filter_ranges?.period?.max || '';
    },
    periodMin() {
      return this.tableData?.filter_ranges?.period?.min || '';
    },
    groupOptions() {
      return [
        { label: 'Все', value: 'all' },
        ...this.getOptions('groups', (gr) => ({
          label: gr.name,
          value: gr.id,
        })),
      ];
    },
    toolOptions() {
      return [
        { label: 'Любой', value: 'all' },
        ...this.getOptions('tool_types', (tool) => ({
          label: tool.name,
          value: tool.id,
        })),
      ];
    },
    negativeOnlyOptions() {
      return [
        { label: 'Любой', value: false },
        { label: 'Отрицательный', value: true },
      ];
    },
  },
  watch: {
    negativeOnlyOptions: {
      handler(options) {
        this.negativeOnly = options[0] || null;
      },
      immediate: true,
    },
  },
  components: {
    TTable,
  },
});
</script>
<style>
.filterBtn {
  position: relative;
  background: white;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border: 0;
  cursor: pointer;
}

table {
  border-spacing: 0;
  width: 100%;
  max-width: 100%;
  table-layout: fixed;
}

th,
td {
  border: 1px solid rgba(0, 0, 0, 0.3);
  padding: 7px 16px;
  height: 48px;
}

.th-2 {
  width: 150px;
  font-size: 12px;
  background: #1976d2;
  color: white;
}

.th-1 {
  width: 250px;
  background: #1976d2;
  color: white;
  text-align: center !important;
}

.td-gen {
  text-align: right !important;
}

.th-day {
  width: 1000px;
  font-size: 14px;
  background: #9c27b0;
  color: white;
  cursor: pointer;
  transition: background 0.3s;
  text-align: center !important;
}

.td-name {
  background-color: white;
}

.th-day--hidden {
  width: 150px;
}

.th-day:hover {
  background: rgb(104, 33, 170);
}

.t-container {
  height: calc(100vh - 145px);
  overflow: scroll;
}

.group,
.group-empty {
  background: rgb(255, 140, 0);
}

.left-b {
  border-left: 2px solid black;
}

/* колонки дней, колонка "продукция", название столбцов (ниже дат), колонка наименований продукции, колонка группы */
.th-day, .th-1, .th-2, .td-name, .group, .td-last {
  position: sticky;
}

.th-day, .th-1 {
  top: 0
}

/* top фиксированное значение зависит от высоты первой строки */
.th-2 {
  text-align: center !important;
  top: 48px;
}

.td-name,
.group,
.th-1 {
  left: 0;
}

.th-day, .td-name, .group, .th-2, .td-last {
  z-index: 1;
}

.td-last, .th-day-last, .th-2-last-day {
  right: 0;
}

.th-1, .th-day-last, .th-2-last-day {
  z-index: 3;
}

.th-day-last {
  background: #5f2da4;
  cursor: default !important;
}

.th-2-last-day {
  background: #0c27a1;
}

.td-last {
  border-left-width: 3px;
  border-right-width: 3px;
  border-color: #0c27a1;
}
</style>
