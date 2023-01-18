<template>
  <tr :class="{ 'selected-row': selected }" class="full-row">
    <td
      class="td-name"
      :style="{ background: isEven && !selected ? groupColor : '' }"
      @click="onSelect"
      :class="{ selected }"
    >
      {{ row.nomenclature }}
    </td>
    <template v-for="row in row.day_balances" :key="row.day">
      <template v-for="(col, index) in columns" :key="col.field(row)">
        <TCol
          v-show="index === 0 || invisibleDays[row.day] !== true"
          :class="{ selected, 'left-b': index === 0 }"
          :style="{ background: isEven && !selected ? groupColor : '' }"
          :value="col.field(row)"
          @click="onSelect"
        />
      </template>
    </template>
    <TCol
      :key="row.end_of_month.day"
      :style="{ background: isEven && !selected ? groupColor : '#ffffff' }"
      :class="{ selected }"
      class="td-last"
        :value="row.end_of_month.balance_morning"
        @click="onSelect"
      />
  </tr>
</template>

<script>
import TCol from 'src/components/TCol.vue';
import { inject } from 'vue';

export default {
  props: {
    row: {
      required: true,
      type: Object,
    },
    groupColor: {
      required: true,
      type: String,
    },
    isEven: {
      default: false,
      type: Boolean,
    },
  },
  setup() {
    const columns = inject('columns');
    const invisibleDays = inject('invisibleDays');

    return {
      columns,
      invisibleDays,
    };
  },
  data() {
    return {
      selected: false,
    };
  },
  methods: {
    onSelect() {
      this.selected = !this.selected;
    },
  },
  components: {
    TCol,
  },
};
</script>

<style scoped>
.selected {
  background: #91c7fc !important;
  /* color: white; */
  border-top: 2px solid black !important;
  border-bottom: 2px solid black !important;
}

.right-b {
  border-right: 1px solid black;
}
</style>
