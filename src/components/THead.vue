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
        v-for="(day, index) in daysWithoutLast"
        :key="day"
        :colspan="invisibleDays[day] === true ? 1 : 9"
        @click="onCollapse(day)"
      >
        {{ $filters.displayDate(day) }}
      </th>
      <th
        class="th-day th-day--hidden left-b th-day-last"
        :key="lastDay"
        :colspan="1"
      >
        {{ $filters.displayDate(lastDay) }}
      </th>
    </tr>
    <tr>
      <template v-for="day in daysWithoutLast" :key="day">
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
      <th class="th-2 th-2-last-day">
        {{ columns[0].label }}
      </th>
    </tr>
  </thead>
</template>

<script>
import { inject, computed } from 'vue';

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
  setup(props) {
    const onCollapse = inject('onCollapse');
    const invisibleDays = inject('invisibleDays');

    const daysWithoutLast = computed(() => {
      return props.days.slice(0, -1);
    });

    const dayLastIndex = computed(() => props.days.length - 1);
    const lastDay = computed(() => props.days[props.days.length - 1]);

    return {
      onCollapse,
      invisibleDays,
      daysWithoutLast,
      dayLastIndex,
      lastDay
    };
  },
};
</script>
