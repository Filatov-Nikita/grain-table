<template>
  <tr>
    <td class="group text-bold" :style="{ background: group.color }">
      {{ group.name }}
    </td>
    <td
      class="group-empty"
      colspan="100%"
      :style="{ background: group.color }"
    ></td>
  </tr>
  <slot name="rows" />
</template>

<script>
export default {
  props: {
    group: {
      required: true,
      type: Object,
    },
    daysCol: {
      required: true,
      type: Number,
    },
  },
};
</script>
