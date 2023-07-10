<template>
  <LogInForm />
</template>

<script lang="ts">
import Vue from "vue";
import LogInForm from "../components/LogInForm.vue";

export default Vue.extend({
  name: "LogInView",
  components: { LogInForm },
});
</script>
