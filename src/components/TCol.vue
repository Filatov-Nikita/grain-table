<template>
  <td :class="{ 'text-negative': isNegative }">
    {{ value ?? '-' }}
  </td>
</template>

<script>
export default {
  props: {
    value: {
      required: true,
    },
  },
  computed: {
    isNegative() {
      return this.value && this.value[0] === '-';
    },
  },
};
</script>
