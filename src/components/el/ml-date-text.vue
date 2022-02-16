<template>
  <span :title="value">{{ value | dateFormat(format) }}</span>
</template>

<script>
export default {
  name: 'ml-date-text',
  props: ['value', 'format']
};
</script>
