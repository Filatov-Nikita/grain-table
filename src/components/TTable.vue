<template>
  <table>
    <THead v-bind="{ days, columns, firstCol }" />
    <tbody>
      <template
        v-for="(group, index) in tableData.extrudate_groups"
        :key="group.id"
      >
        <TGroup :group="group" :daysCol="days.length">
          <template #rows>
            <TRow
              v-for="(row, index) in group.extrudates"
              :key="row.nomenclature"
              :row="row"
              :groupColor="group.color"
              :isEven="(index + 1) % 2 === 0"
            />
          </template>
        </TGroup>
      </template>
    </tbody>
  </table>
</template>

<script>
import TGroup from 'src/components/TGroup.vue';
import TRow from 'src/components/TRow.vue';
import THead from 'src/components/THead.vue';

export default {
  props: {
    tableData: {
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
    firstCol: {
      required: true,
      type: Object,
    },
  },
  components: {
    TGroup,
    TRow,
    THead,
  },
};
</script>

<style>
</style>
