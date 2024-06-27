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
        v-for="(day, index) in daysList"
        :key="day"
        :colspan="invisibleDays[day] === true ? 1 : 10"
        @click="onCollapse(day)"
      >
        {{ $filters.displayDate(day) }}
      </th>
      <th
        v-if="$serverData.withLastCol"
        class="th-day th-day--hidden left-b th-day-last"
        :key="lastDay"
        :colspan="1"
      >
        {{ $filters.displayDate(lastDay) }}
      </th>
    </tr>
    <tr>
      <template v-for="day in daysList" :key="day">
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
      <th class="th-2 th-2-last-day" v-if="$serverData.withLastCol">
        {{ columns[0].label }}
      </th>
    </tr>
  </thead>
</template>

<script>
import useServerData from 'src/plugins/serverData/useServerData';
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
    const serverData = useServerData();

    const daysList = computed(() => {
      const _days = [ ...props.days ];
      if(serverData.withLastCol) return props.days.slice(0, -1);
      return _days;
    });

    const dayLastIndex = computed(() => props.days.length - 1);
    const lastDay = computed(() => props.days[props.days.length - 1]);

    return {
      onCollapse,
      invisibleDays,
      daysList,
      dayLastIndex,
      lastDay
    };
  },
};
</script>
