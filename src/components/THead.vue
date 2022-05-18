<template>
  <thead>
    <tr>
      <th class="th-1" rowspan="2">{{ firstCol.label }}</th>
      <th
        class="th-day"
        :class="{
          'th-day--hidden': invisibleDays[day] === true,
          'left-b': true,
        }"
        v-for="(day, index) in days"
        :key="day"
        :colspan="invisibleDays[day] === true ? 1 : 10"
        @click="onCollapse(day)"
      >
        {{ $filters.displayDate(day) }}
      </th>
    </tr>
    <tr>
      <template v-for="day in days" :key="day">
        <template v-for="(col, index) in columns" :key="col.label">
          <th
            class="th-2"
            :class="{ 'left-b': index === 0 }"
            v-show="index === 0 || invisibleDays[day] !== true"
          >
            {{ col.label }}
          </th>
        </template>
      </template>
    </tr>
  </thead>
</template>

<script>
import { inject } from 'vue';

export default {
  props: {
    firstCol: {
      required: true,
      type: Object,
    },
    days: {
      required: true,
      type: Array,
    },
    columns: {
      required: true,
      type: Array,
    },
  },
  setup() {
    const onCollapse = inject('onCollapse');
    const invisibleDays = inject('invisibleDays');
    return {
      onCollapse,
      invisibleDays,
    };
  },
};
</script>
